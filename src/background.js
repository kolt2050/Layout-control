"use strict";

const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  mode: "both",
  minLength: 4,
  cooldownMs: 2000,
  volume: 50,
  excludedSites: [],
  enabledLanguages: ["ru", "uk", "de", "fr", "el", "he", "ar", "fa", "es"]
});

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get({
    ...DEFAULT_SETTINGS,
    uiLocale: null,
    uiLocaleCustomized: false
  });
  const browserLocale = supportedLocale(chrome.i18n.getUILanguage());
  await chrome.storage.sync.set({
    ...DEFAULT_SETTINGS,
    ...stored,
    uiLocale: stored.uiLocaleCustomized && isSupportedLocale(stored.uiLocale) ? stored.uiLocale : browserLocale,
    uiLocaleCustomized: stored.uiLocaleCustomized === true
  });
});

function supportedLocale(locale) {
  const primaryLanguage = String(locale || "").toLowerCase().split("-")[0];
  return isSupportedLocale(primaryLanguage) ? primaryLanguage : "en";
}

function isSupportedLocale(locale) {
  return ["en", "ru", "uk", "de", "fr", "el", "he", "ar", "fa", "es"].includes(locale);
}

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
