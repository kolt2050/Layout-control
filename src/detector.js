"use strict";

(() => {
  const TOKEN_AT_END = /(\S+)$/u;
  const CAMEL_CASE = /[\p{Ll}][\p{Lu}]/u;
  const URL_OR_EMAIL = /(?:@|:\/\/|www\.|(?:^|[./])[\p{L}\p{N}-]+\.(?:com|net|org|ru|io|dev|app|рф)(?:[/?#:]|$))/iu;
  const SPECIFIED_ALIASES = Object.freeze({
    ru: new Map([["сегданя", "сегодня"]])
  });

  class Detector {
    constructor({ dictionaries, keyboardMap }) {
      this.dictionaries = dictionaries;
      this.keyboardMap = keyboardMap;
    }

    detect(rawFragment, minimumLength, enabledLanguageIds = this.keyboardMap.DEFAULT_ENABLED_LANGUAGE_IDS) {
      const candidate = this.extractCandidate(rawFragment, minimumLength);
      if (!candidate) {
        return [];
      }

      const normalized = this.keyboardMap.normalize(candidate);
      const profiles = this.keyboardMap.getProfiles(enabledLanguageIds);
      if (this.isKnownOriginal(normalized, profiles)) {
        return [];
      }

      const matches = [];
      for (const profile of profiles) {
        this.addEnglishToTargetMatch(matches, profile, candidate, normalized);
        this.addTargetToEnglishMatch(matches, profile, candidate, normalized);
      }
      return matches;
    }

    extractCandidate(rawFragment, minimumLength) {
      const fragment = String(rawFragment || "");
      const match = fragment.match(TOKEN_AT_END);
      if (!match) {
        return null;
      }

      const candidate = match[1];
      if (
        Array.from(candidate).length < minimumLength ||
        URL_OR_EMAIL.test(candidate) ||
        /[\d_-]/u.test(candidate) ||
        CAMEL_CASE.test(candidate) ||
        /^(?:[a-f]+\d|\d+[a-f])[\da-f]*$/i.test(candidate)
      ) {
        return null;
      }
      return candidate;
    }

    isKnownOriginal(candidate, profiles) {
      if (this.hasWord("en", candidate)) {
        return true;
      }
      return profiles.some((profile) => this.hasWord(profile.id, candidate));
    }

    addEnglishToTargetMatch(matches, profile, typed, normalized) {
      const remapped = this.keyboardMap.normalize(profile.fromEnglish(normalized));
      const converted = this.aliasFor(profile.id, remapped);
      if (converted !== normalized && this.hasWord(profile.id, converted)) {
        matches.push({ languageId: profile.id, languageName: profile.name, direction: "en-to-target", typed, converted });
      }
    }

    addTargetToEnglishMatch(matches, profile, typed, normalized) {
      const converted = this.keyboardMap.normalize(profile.toEnglish(normalized));
      if (converted !== normalized && this.hasWord("en", converted)) {
        matches.push({ languageId: profile.id, languageName: profile.name, direction: "target-to-en", typed, converted });
      }
    }

    aliasFor(languageId, converted) {
      const aliases = SPECIFIED_ALIASES[languageId];
      return aliases && aliases.has(converted) ? aliases.get(converted) : converted;
    }

    hasWord(languageId, word) {
      const dictionary = this.dictionaries[languageId];
      return Boolean(dictionary && dictionary.has(word));
    }
  }

  globalThis.LayoutGuard = globalThis.LayoutGuard || {};
  globalThis.LayoutGuard.Detector = Detector;
})();
