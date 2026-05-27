"use strict";

const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const sourceFiles = [
  "background.js",
  "keyboardMap.js",
  "detector.js",
  "audio.js",
  "content.js",
  "options/options.js"
];
const languageIds = ["ru", "uk", "de", "fr", "el", "he", "ar", "fa", "es"];

for (const filename of sourceFiles) {
  new vm.Script(fs.readFileSync(`src/${filename}`, "utf8"), { filename });
}

const manifest = JSON.parse(fs.readFileSync("src/manifest.json", "utf8"));
assert.strictEqual(manifest.manifest_version, 3);
assert.deepStrictEqual(manifest.permissions, ["storage"]);
assert.strictEqual(manifest.content_scripts[0].all_frames, true);
const optionsScript = fs.readFileSync("src/options/options.js", "utf8");
assert.ok(optionsScript.includes("uiLocale"));
assert.ok(optionsScript.includes("chrome.i18n.getUILanguage()"));
assert.ok(optionsScript.includes("uiLocaleCustomized"));
assert.ok(optionsScript.includes("new Intl.Collator(currentLocale"));
assert.ok(fs.readFileSync("src/background.js", "utf8").includes("chrome.i18n.getUILanguage()"));
for (const locale of ["en", ...languageIds]) {
  assert.ok(optionsScript.includes(`${locale}: {`), `Missing options locale ${locale}`);
}
for (const size of ["16", "32", "48", "128"]) {
  const iconPath = `src/${manifest.icons[size]}`;
  assert.ok(fs.existsSync(iconPath), `${iconPath} is missing`);
  assert.deepStrictEqual([...fs.readFileSync(iconPath).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.strictEqual(manifest.action.default_icon[size], manifest.icons[size]);
}

const dictionaryIds = ["en", ...languageIds];
const dictionaries = Object.fromEntries(dictionaryIds.map((id) => {
  const path = `src/dictionary/${id}.json`;
  assert.ok(manifest.web_accessible_resources[0].resources.includes(`dictionary/${id}.json`), `${id} is not exposed`);
  const words = JSON.parse(fs.readFileSync(path, "utf8"));
  assert.strictEqual(words.length, 40000, id);
  return [id, new Set(words)];
}));

const sandbox = { console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("src/keyboardMap.js", "utf8"), sandbox);
vm.runInContext(fs.readFileSync("src/detector.js", "utf8"), sandbox);

const map = sandbox.LayoutGuard.KeyboardMap;
assert.deepStrictEqual([...map.DEFAULT_ENABLED_LANGUAGE_IDS], languageIds);
assert.strictEqual(map.profilesById.fr.fromEnglish("qwertyuiopasdfghjkl;zxcvbnm"), "azertyuiopqsdfghjklmwxcvbn,");
assert.strictEqual(map.profilesById.de.fromEnglish("qwertyuiopasdfghjkl;zxcvbnm"), "qwertzuiopsdfghjklöäyxcvbnm");
assert.strictEqual(map.profilesById.es.fromEnglish("qwertyuiopasdfghjkl;zxcvbnm"), "qwertyuiopasdfghjklñzxcvbnm");
const detector = new sandbox.LayoutGuard.Detector({ dictionaries, keyboardMap: map });

function matchesLanguage(value, languageId) {
  return detector.detect(value, 2, [languageId]).some((match) => match.languageId === languageId);
}

assert.ok(matchesLanguage("ghbdtn", "ru"));
assert.strictEqual(detector.detect("ghbdtn", 4, ["ru"])[0].converted, "привет");
assert.strictEqual(detector.detect("руддщ", 4, ["ru"])[0].converted, "hello");
assert.strictEqual(detector.detect("ctulfyz", 4, ["ru"])[0].converted, "сегодня");
assert.strictEqual(detector.detect("ctujlyz", 4, ["ru"])[0].converted, "сегодня");
assert.strictEqual(detector.detect("ghbdtn", 4, ["de"]).length, 0);

for (const languageId of languageIds) {
  const profile = map.profilesById[languageId];
  let foundExample = false;
  for (const targetWord of dictionaries[languageId]) {
    const typed = profile.toEnglish(targetWord);
    if (typed !== targetWord && matchesLanguage(typed, languageId)) {
      foundExample = true;
      break;
    }
  }
  assert.ok(foundExample, `No EN -> ${languageId} detectable dictionary example found`);
}

for (const languageId of languageIds.filter((id) => id !== "es")) {
  const profile = map.profilesById[languageId];
  let foundReverseExample = false;
  for (const englishWord of dictionaries.en) {
    const typed = profile.fromEnglish(englishWord);
    if (typed !== englishWord && detector.detect(typed, 2, [languageId]).some((match) => match.direction === "target-to-en")) {
      foundReverseExample = true;
      break;
    }
  }
  assert.ok(foundReverseExample, `No ${languageId} -> EN detectable dictionary example found`);
}
assert.strictEqual(map.profilesById.es.fromEnglish("hello"), "hello", "Spanish ordinary Latin keys should remain identical");

for (const ignored of ["hello", "user@example.com", "https://google.com/path", "abc123", "my_variable_name", "my-variable-name", "myVariableName", "a94f3c1d"]) {
  assert.strictEqual(detector.detect(ignored, 4, languageIds).length, 0, ignored);
}

console.log("Verified MV3 files, 10 local dictionaries and multilingual detection/filter scenarios.");
