"use strict";

(() => {
  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    mode: "both",
    minLength: 4,
    cooldownMs: 2000,
    volume: 50,
    excludedSites: [],
    enabledLanguages: globalThis.LayoutGuard.KeyboardMap.DEFAULT_ENABLED_LANGUAGE_IDS
  });
  const ENDING_KEYS = new Set([" ", "Enter", ".", ",", "!", "?", ":", ";", ")", "]", "}"]);

  class LayoutGuardController {
    constructor() {
      this.settings = { ...DEFAULT_SETTINGS };
      this.detector = null;
      this.audio = new globalThis.LayoutGuard.WarningAudio();
      this.active = true;
      this.lastChecked = "";
      this.pendingChecks = new Map();
    }

    async initialize() {
      this.settings = this.sanitizeSettings(await chrome.storage.sync.get(DEFAULT_SETTINGS));
      this.updateActiveState();
      this.attachListeners();

      try {
        const dictionaries = { en: await this.fetchDictionary("dictionary/en.json") };
        await Promise.all(globalThis.LayoutGuard.KeyboardMap.profiles.map(async (profile) => {
          dictionaries[profile.id] = await this.fetchDictionary(profile.dictionaryPath);
        }));
        this.detector = new globalThis.LayoutGuard.Detector({
          dictionaries,
          keyboardMap: globalThis.LayoutGuard.KeyboardMap
        });
        for (const [strategy, fragment] of this.pendingChecks) {
          this.processFragment(fragment, strategy);
        }
        this.pendingChecks.clear();
      } catch (error) {
        console.error("Layout Guard dictionaries could not be loaded.", error);
      }
    }

    attachListeners() {
      document.addEventListener("input", (event) => {
        const target = this.getSupportedTarget(event.target);
        if (target) {
          this.handleChangedFragment(this.textBeforeCaret(target));
        }
      }, true);

      document.addEventListener("keydown", (event) => {
        const target = this.getSupportedTarget(event.target);
        if (target && this.active) {
          this.audio.unlock();
        }
        if (target && ENDING_KEYS.has(event.key) && this.modeIncludes("complete")) {
          this.processFragment(this.textBeforeCaret(target), "complete");
        }
      }, true);

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "sync") {
          return;
        }
        Object.keys(DEFAULT_SETTINGS).forEach((key) => {
          if (changes[key]) {
            this.settings[key] = changes[key].newValue;
          }
        });
        this.settings = this.sanitizeSettings(this.settings);
        this.updateActiveState();
      });
    }

    async fetchDictionary(path) {
      const response = await fetch(chrome.runtime.getURL(path));
      if (!response.ok) {
        throw new Error(`Failed loading ${path}: ${response.status}`);
      }
      const entries = await response.json();
      return new Set(entries.map((word) => String(word).toLowerCase()));
    }

    sanitizeSettings(values) {
      const minLength = Number(values.minLength);
      const cooldownMs = Number(values.cooldownMs);
      const volume = Number(values.volume);
      return {
        enabled: values.enabled !== false,
        mode: ["live", "complete", "both"].includes(values.mode) ? values.mode : DEFAULT_SETTINGS.mode,
        minLength: Number.isFinite(minLength) ? Math.min(10, Math.max(2, minLength)) : DEFAULT_SETTINGS.minLength,
        cooldownMs: Number.isFinite(cooldownMs) ? Math.min(30000, Math.max(0, cooldownMs)) : DEFAULT_SETTINGS.cooldownMs,
        volume: Number.isFinite(volume) ? Math.min(100, Math.max(0, volume)) : DEFAULT_SETTINGS.volume,
        excludedSites: Array.isArray(values.excludedSites) ? values.excludedSites : [],
        enabledLanguages: Array.isArray(values.enabledLanguages)
          ? [...new Set(values.enabledLanguages)].filter((id) => globalThis.LayoutGuard.KeyboardMap.profilesById[id])
          : [...DEFAULT_SETTINGS.enabledLanguages]
      };
    }

    updateActiveState() {
      const host = location.hostname.toLowerCase();
      const isExcluded = this.settings.excludedSites.some((entry) => {
        const excluded = String(entry).trim().toLowerCase().replace(/^\*\./, "");
        return excluded && (host === excluded || host.endsWith(`.${excluded}`));
      });
      this.active = this.settings.enabled && !isExcluded;
      this.lastChecked = "";
    }

    modeIncludes(strategy) {
      return this.active && (this.settings.mode === "both" || this.settings.mode === strategy);
    }

    processFragment(fragment, strategy) {
      if (!this.modeIncludes(strategy)) {
        return;
      }
      if (!this.detector) {
        this.pendingChecks.set(strategy, fragment);
        return;
      }
      const fingerprint = `${strategy}:${fragment}`;
      if (fingerprint === this.lastChecked) {
        return;
      }
      this.lastChecked = fingerprint;
      if (this.detector.detect(fragment, this.settings.minLength, this.settings.enabledLanguages).length) {
        this.audio.beep(this.settings.volume, this.settings.cooldownMs);
      }
    }

    handleChangedFragment(fragment) {
      if (this.modeIncludes("live")) {
        this.processFragment(fragment, "live");
      }
      if (this.modeIncludes("complete") && /[ \t\n.,!?:;)\]}]$/.test(fragment)) {
        this.processFragment(fragment.replace(/[ \t\n.,!?:;)\]}]+$/, ""), "complete");
      }
    }

    getSupportedTarget(target) {
      if (!(target instanceof Element)) {
        return null;
      }
      if (target instanceof HTMLInputElement) {
        const type = target.type.toLowerCase();
        return (type === "text" || type === "search") && !target.disabled && !target.readOnly ? target : null;
      }
      if (target instanceof HTMLTextAreaElement) {
        return !target.disabled && !target.readOnly ? target : null;
      }
      const editable = target.closest("[contenteditable='true'], [contenteditable='plaintext-only']");
      return editable && !editable.matches("[aria-disabled='true']") ? editable : null;
    }

    textBeforeCaret(target) {
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return target.value.slice(0, target.selectionStart == null ? target.value.length : target.selectionStart);
      }

      const selection = globalThis.getSelection();
      if (!selection || !selection.rangeCount || !target.contains(selection.focusNode)) {
        return target.textContent || "";
      }
      try {
        const range = document.createRange();
        range.selectNodeContents(target);
        range.setEnd(selection.focusNode, selection.focusOffset);
        return range.toString();
      } catch (error) {
        return target.textContent || "";
      }
    }
  }

  new LayoutGuardController().initialize().catch((error) => {
    console.error("Layout Guard failed to initialize.", error);
  });
})();
