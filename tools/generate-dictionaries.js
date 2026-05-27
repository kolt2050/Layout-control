"use strict";

const fs = require("fs");
const path = require("path");

const languages = ["uk", "de", "fr", "el", "he", "ar", "fa", "es"];
const sourceDirectory = process.argv[2] || "C:\\tmp";
const targetDirectory = path.join(__dirname, "..", "src", "dictionary");

for (const language of languages) {
  const sourcePath = path.join(sourceDirectory, `${language}_50k.txt`);
  const words = fs.readFileSync(sourcePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/)[0])
    .map((word) => word.normalize("NFC").toLocaleLowerCase())
    .filter((word) => /^[\p{L}\p{M}]+$/u.test(word));
  const uniqueWords = [...new Set(words)].slice(0, 40000);
  if (uniqueWords.length !== 40000) {
    throw new Error(`${language} yielded only ${uniqueWords.length} alphabetic words`);
  }
  fs.writeFileSync(path.join(targetDirectory, `${language}.json`), JSON.stringify(uniqueWords));
  console.log(`${language}: ${uniqueWords.length} words`);
}
