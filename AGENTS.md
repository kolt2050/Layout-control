Project

Build a complete working Chrome/Edge browser extension (Manifest V3).

Purpose:

Detect when the user is likely typing with the wrong keyboard layout (English vs Russian) and play a short warning beep.

Example:

user types ghbdtn
extension detects that this maps to Russian привет
extension plays a beep

Reverse:

user types руддщ
extension detects that this maps to English hello
extension plays a beep

This extension must work entirely offline.

No telemetry.
No remote APIs.
No analytics.

Primary Deliverable

Generate a complete runnable browser extension project.

The output must include all source files required to load the extension in Chrome Developer Mode.

Do not provide pseudo-code.

Provide production-quality working code.

Technical Stack

Required:

JavaScript (ES6+)
Chrome Extension Manifest V3
Plain JavaScript only
No React
No Vue
No build step
No TypeScript
No npm dependencies unless absolutely necessary

Use browser-native APIs only.

Supported Browsers

MVP target:

Google Chrome
Microsoft Edge

Firefox support is NOT required.

Core Features
1. Wrong keyboard layout detection

Detect likely wrong keyboard layout between:

English QWERTY
Russian ЙЦУКЕН

Supported directions:

English typed instead of Russian
Russian typed instead of English

Examples:

Must detect:

ghbdtn -> привет
руддщ -> hello
ctulfyz -> сегодня

Must trigger warning beep.

2. Supported input targets

Monitor text input in:

<input type="text">
<input type="search">
<textarea>
[contenteditable="true"]
custom extension Find Overlay search field

Do NOT monitor:

password fields
hidden inputs
disabled fields
readonly fields
3. Detection modes

Implement all 3 modes.

Selectable in settings.

Mode A: Live

Detect while typing.

Behavior:

start checking only after minimum character threshold
default threshold = 4

Example:

g
gh
ghb
ghbd -> detection runs
Mode B: Word-complete

Detect only when word ends.

Word ending triggers:

space
Enter
punctuation

Supported punctuation:

. , ! ? : ; ) ] }
Mode C: Both

Run both strategies.

Default mode.

Detection Algorithm

Implement deterministic logic.

Do NOT use AI/ML.

Step 1: classify token

For current token:

Determine whether token is:

Latin-only
Cyrillic-only
mixed

If mixed:
ignore.

Step 2: remap keyboard layout

If token is Latin:

Convert EN keyboard chars to RU equivalents.

Example:

g -> п
h -> р
b -> и
d -> в
t -> е
n -> т

Result:

ghbdtn -> привет

If token is Cyrillic:

Convert RU keyboard chars to EN equivalents.

Example:

р -> h
у -> e
д -> l
д -> l
щ -> o

Result:

руддщ -> hello
Step 3: dictionary validation

After remapping:

Check resulting token against in-memory dictionary.

Use:

English dictionary
Russian dictionary

Implementation requirement:

Set<string>

Lookup must be O(1).

Dictionary Requirements

Include local dictionaries only.

No API lookups.

Approximate size:

English: 20,000–50,000 common words
Russian: 20,000–50,000 common words

Store as:

/src/dictionary/en.json
/src/dictionary/ru.json

Load locally.

False Positive Filtering

Must ignore tokens matching:

URLs

Examples:

https://google.com
google.com/path
Email addresses

Examples:

user@example.com
Numeric identifiers

Examples:

abc123
x9f8d2
snake_case

Examples:

my_variable_name
kebab-case

Examples:

my-variable-name
camelCase

Examples:

myVariableName
hash-like strings

Examples:

a94f3c1d
550e8400-e29b
short tokens

Ignore tokens shorter than threshold.

Alert Behavior

When wrong layout is detected:

Play warning beep.

ONLY beep.

Do NOT:

show popup
show tooltip
modify text
auto-correct
replace user input
Audio Implementation

Use Web Audio API.

Do NOT use audio files.

Required:

AudioContext
generated oscillator beep

Parameters:

duration: 100–250 ms
configurable volume
low latency
Cooldown

Prevent repeated beeps.

Default:

2000 ms

If beep was played recently:
skip.

Ctrl+F Replacement

IMPORTANT:

Do NOT try to access native browser find UI.

Instead:

Implement custom Find Overlay.

Shortcut interception

Intercept:

Windows/Linux:

Ctrl+F

Mac:

Cmd+F

Call:

event.preventDefault()

Open custom overlay.

Find Overlay Requirements

Must include:

search input
next match button
previous match button
match counter
close button

Keyboard behavior:

Enter -> next
Shift+Enter -> previous
Esc -> close

Live search required.

Search behavior

Implement in-page text search.

Required capabilities:

find all matches
highlight matches
navigate next/previous
show current index / total

Suggested implementation:

TreeWalker
Range
DOM traversal

Do NOT depend on browser native find bar.

Overlay styling

Must not conflict with host page CSS.

Use:

Shadow DOM
fixed positioning
isolated styles
high z-index
Settings Page

Implement extension options UI.

Required settings:

General

Enable extension:

ON/OFF
Detection mode

Options:

Live
Word-complete
Both

Default:

Both
Minimum character threshold

Numeric input.

Default:

4

Range:

2–10
Cooldown

Numeric input.

Default:

2000 ms
Audio volume

Slider:

0–100%
Ctrl+F replacement

Toggle:

Replace native Ctrl+F

Default:
ON

Site exclusions

Domain blacklist.

Examples:

docs.google.com
figma.com
notion.so

Extension disabled on matching domains.

Storage

Use:

chrome.storage.sync

Persist settings.

Project File Structure

Generate this structure:

/src
  manifest.json
  background.js
  content.js
  detector.js
  keyboardMap.js
  audio.js

  /dictionary
    en.json
    ru.json

  /overlay
    overlay.js
    overlay.css
    searchEngine.js

  /options
    options.html
    options.css
    options.js
Manifest Requirements

Use Manifest V3.

Minimal permissions.

Expected:

[
  "storage",
  "activeTab",
  "scripting"
]

Host permissions only if necessary.

Performance Constraints

Must not introduce noticeable typing lag.

Requirements:

efficient token parsing
dictionary O(1) lookup
debounce expensive work
avoid unnecessary DOM scanning
avoid memory leaks
Privacy Constraints

Hard requirements:

no network requests
no telemetry
no analytics
no user data collection
all processing local only
Code Quality Requirements

Generate maintainable production-quality code.

Requirements:

modular architecture
clear naming
comments for non-obvious logic
defensive error handling
no dead code
Acceptance Tests

Implementation is complete only if all pass.

Test 1

Input:

ghbdtn

Expected:

beep

Test 2

Input:

руддщ

Expected:

beep

Test 3

Input:

password field

Expected:

no detection

Test 4

Input:

user@example.com

Expected:

no beep

Test 5

Input:

https://google.com

Expected:

no beep

Test 6

Press:

Ctrl+F

Expected:

custom search overlay opens

Test 7

Type wrong-layout query in overlay

Expected:

beep

Test 8

Settings persist after browser restart

Expected:

yes

Non-Goals (Do NOT implement)

Do NOT implement:

auto-correction
text replacement
visual suggestions
AI detection
cloud sync
telemetry
Firefox compatibility
additional languages
Final Instruction

Generate the complete working implementation, not a design document.