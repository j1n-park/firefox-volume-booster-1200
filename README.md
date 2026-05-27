# Firefox Volume Booster

A lightweight Firefox extension that boosts audio and video volume on web pages up to **1200%** using the Web Audio API.

Already released on Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/volume-booster-1200/

## Features

- Enable or disable boosting from the toolbar popup
- Adjustable volume slider from 10% to 1200%
- Quick presets for 200%, 400%, 600%, 800%, 1000%, and 1200%
- Remembers the enabled state and selected boost level
- Works with existing and newly added `audio`/`video` elements on a page
- Includes light and dark popup styling

> Warning: High volume can damage hearing or speakers. Increase volume gradually and use responsibly.

## Essential files

This repository is configured to keep only the files needed to run the extension:

- `manifest.json` - Firefox extension manifest
- `content.js` - page audio/video processing and volume boost logic
- `popup.html` - toolbar popup markup
- `popup.css` - popup styling
- `popup.js` - popup controls and messaging
- `icon-48.png` and `icon-96.png` - extension icons

Generated archives, local virtual environments, OS files, editor/agent settings, and helper assets are ignored by `.gitignore`.

## Install from Firefox Add-ons

Install the released version from Mozilla Add-ons:

https://addons.mozilla.org/en-US/firefox/addon/volume-booster-1200/

## Install temporarily in Firefox

1. Clone or download this project.
2. Open Firefox.
3. Go to `about:debugging#/runtime/this-firefox`.
4. Click **Load Temporary Add-on...**.
5. Select the project's `manifest.json` file.
6. The Volume Booster icon should appear in the Firefox toolbar.

Temporary add-ons are removed when Firefox restarts. Repeat the steps above after restarting Firefox.

## How to use

1. Open a page with audio or video.
2. Click the **Volume Booster** toolbar icon.
3. Turn on the **Volume Booster** toggle.
4. Move the slider or click a preset volume button.
5. Turn the toggle off to return the boost to normal.

If a page was already open before installing the extension, refresh that page so the content script can load.

## Package the extension

From the project root, package only the essential extension files:

```bash
zip -r firefox-volume-booster.zip \
  manifest.json \
  content.js \
  popup.html \
  popup.css \
  popup.js \
  icon-48.png \
  icon-96.png
```

