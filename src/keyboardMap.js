"use strict";

(() => {
  const ENGLISH_KEYS = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
  const DEFAULT_ENABLED_LANGUAGE_IDS = Object.freeze(["ru", "uk", "de", "fr", "el", "he", "ar", "fa", "es"]);
  const PROFILE_DEFINITIONS = [
    { id: "ru", name: "Russian", keys: "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю." },
    { id: "uk", name: "Ukrainian", keys: "'1234567890-=йцукенгшщзхї\\фівапролджєячсмитьбю." },
    { id: "de", name: "German", keys: "^1234567890ß´qwertzuiopü+asdfghjklöä#yxcvbnm,.-" },
    { id: "fr", name: "French", keys: "²&é\"'(-è_çà)=azertyuiop^$*qsdfghjklmùwxcvbn,;:" },
    { id: "el", name: "Greek", keys: "`1234567890-=;ςερτυθιοπ[]\\ασδφγηξκλ΄ζχψωβνμ,./" },
    { id: "he", name: "Hebrew", keys: ";1234567890-=/'קראטוןםפ][\\שדגכעיחלךף,זסבהנמצתץ." },
    { id: "ar", name: "Arabic", keys: "ذ1234567890-=ضصثقفغعهخحجد\\شسيبلاتنمكطئءؤرلاىةوزظ" },
    { id: "fa", name: "Persian", keys: "‍۱۲۳۴۵۶۷۸۹۰-=ضصثقفغعهخحجچ\\شسیبلاتنمکگظطزرذدپو./" },
    { id: "es", name: "Spanish", keys: "º1234567890'¡qwertyuiop`+çasdfghjklñ´zxcvbnm,.-" }
  ];

  function normalize(value) {
    return String(value || "").normalize("NFC").toLocaleLowerCase();
  }

  function createProfile(definition) {
    const fromEnglish = new Map();
    const toEnglish = new Map();
    Array.from(ENGLISH_KEYS).forEach((key, index) => {
      const target = Array.from(definition.keys)[index];
      if (target) {
        fromEnglish.set(key, target);
        toEnglish.set(target, key);
      }
    });
    const remap = (value, map) => Array.from(normalize(value), (character) => map.get(character) || character).join("");
    return Object.freeze({
      id: definition.id,
      name: definition.name,
      dictionaryPath: `dictionary/${definition.id}.json`,
      fromEnglish: (value) => remap(value, fromEnglish),
      toEnglish: (value) => remap(value, toEnglish)
    });
  }

  const profiles = Object.freeze(PROFILE_DEFINITIONS.map(createProfile));
  const profilesById = Object.freeze(Object.fromEntries(profiles.map((profile) => [profile.id, profile])));

  globalThis.LayoutGuard = globalThis.LayoutGuard || {};
  globalThis.LayoutGuard.KeyboardMap = Object.freeze({
    DEFAULT_ENABLED_LANGUAGE_IDS,
    profiles,
    profilesById,
    normalize,
    getProfiles: (enabledLanguageIds) => enabledLanguageIds
      .map((id) => profilesById[id])
      .filter(Boolean)
  });
})();
