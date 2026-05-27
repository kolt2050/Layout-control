# Layout Guard

Layout Guard is an offline Chrome and Microsoft Edge extension that plays a
short voice-like warning sound when a word appears to have been typed using
the wrong keyboard layout.

For example:

- `ghbdtn` maps to `привет` in Russian and triggers a warning.
- `руддщ` maps to `hello` in English and triggers a warning.
- `ctujlyz` maps to `сегодня` in Russian and triggers a warning.

The extension never changes or submits typed text. It only plays the warning
sound.

## Supported Layouts

English (US QWERTY) is the base layout. Layout Guard can check it against:

- Russian
- Ukrainian
- German
- French
- Greek
- Hebrew
- Arabic
- Persian
- Spanish

All nine additional languages are enabled by default and can be switched off
individually in settings. Mappings target standard Windows desktop layouts,
matching the Chrome and Edge MVP environment.

Spanish uses largely the same ordinary letter positions as English QWERTY, so
its wrong-layout detection is naturally limited to sequences involving keys
that differ between those layouts.

## Features

- Checks English-to-enabled-language and enabled-language-to-English mistakes.
- Uses local 40,000-word dictionaries for all ten supported languages.
- Suppresses warnings when the original token is already a known word in an
  enabled language, reducing false alarms in multilingual mode.
- Supports live detection, word-complete detection, or both modes together.
- Works in text inputs, search inputs, textareas, contenteditable editors, and
  supported iframe fields.
- Runs entirely offline with no analytics, telemetry, or remote API calls.

## Installation

No build step or dependencies are required.

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `src` directory from this project.

After changing extension files, click the extension's **Reload** button on the
extensions page and reload browser tabs where it should run.

## Usage

Type into an editable field on a normal web page. With the default **Both**
mode, Layout Guard checks words while you type and again when a word is
completed.

The extension warns only when keyboard remapping produces a known dictionary
word. Random sequences such as `gsdgsdgsd` are intentionally ignored.

Layout Guard does not monitor password fields, disabled or read-only fields,
hidden inputs, the browser address bar, or browser-internal pages such as
`chrome://` and `edge://`.

### Browser Address Bar Limitation

Layout Guard cannot detect wrong-layout text typed into the browser's top
address/search bar (the omnibox). That UI belongs to Chrome or Edge itself,
not to the web page, and content scripts cannot read or observe text entered
there.

The search box shown on the Chrome or Edge **New Tab** page is also browser UI,
even when it looks like a Google search field inside the page. Input there is
handled as omnibox input, so Layout Guard cannot monitor it or play a warning.

The `chrome.omnibox` extension API does not provide silent monitoring of normal
address bar input either: it works only after the user explicitly activates an
extension keyword.

Detection does work in search fields inside web pages, regular site form
fields, and editable page content.

The native `Ctrl+F` / `Cmd+F` find bar belongs to Chrome or Edge and is not
monitored by Layout Guard.

## Settings And Diagnostics

Click the extension icon to open settings. You can configure:

- Whether detection is enabled.
- Options page interface language: any supported language, including RTL
  layouts for Hebrew, Arabic, and Persian.
- Detection mode: **Live**, **Word-complete**, or **Both**.
- Enabled comparison languages.
- Minimum word length, cooldown, and audio volume.
- Disabled domains, one per line.

The settings page also includes:

- **Test sound**, which plays the warning sound directly.
- **Detection test**, which lists every matching language conversion and plays
  one warning sound when a match is found.

Settings are stored with `chrome.storage.sync`.
On first use, the options page follows the browser UI language when it is
supported; a language selected manually remains saved afterward.

## Project Structure

```text
src/
  manifest.json
  background.js
  content.js
  detector.js
  keyboardMap.js
  audio.js
  dictionary/
    en.json, ru.json, uk.json, de.json, fr.json
    el.json, he.json, ar.json, fa.json, es.json
  icons/
  options/
tools/
  generate-dictionaries.js
  generate-icons.ps1
verify-extension.js
```

The `src` directory is the complete unpacked browser extension. Files outside
`src` are development utilities and documentation.

## Verification

Run the local check with:

```powershell
node verify-extension.js
```

It validates the MV3 package, icons, all ten local dictionaries, EN/RU
regressions, multilingual remapping coverage, language opt-out behavior, and
false-positive filtering.

## Dictionaries And Privacy

The packaged dictionaries are derived from
[FrequencyWords](https://github.com/hermitdave/FrequencyWords), distributed
under the MIT License. Attribution and license text are included in
`src/dictionary/`.

All matching is performed locally in the browser. The extension does not
transmit typed text or collect user data.
