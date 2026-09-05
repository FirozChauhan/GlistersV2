# Glisters

Keyboard-first new tab extension — shortcut grid, live Chrome bookmarks, Wallhaven wallpapers, single-user GitHub Gist sync. No backend, no sign-in.

![JavaScript](https://img.shields.io/badge/JavaScript-161B22?style=for-the-badge&logo=javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-161B22?style=for-the-badge&logo=typescript&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-161B22?style=for-the-badge&logo=googlechrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-161B22?style=for-the-badge&logo=firefox&logoColor=white)

## Install

```bash
git clone https://github.com/FirozChauhan/Glisters && cd Glisters
npm install
npm run build
```

Then load unpacked:
- **Chrome** → `chrome://extensions` → Developer mode → select this folder
- **Firefox** → `about:debugging#/runtime/this-firefox` → select `dist/firefox/manifest.json`

## Usage

```bash
# vim-style keys on the new tab
h j k l   # move      a  # add shortcut
enter     # open      e  # edit
d         # delete    w  # next wallpaper
```

## Features

- Shortcut grid with vim keys + mouse drag-reorder
- Live Chrome bookmarks sidebar (shared across devices)
- Daily Wallhaven wallpaper pool (optional API key for NSFW)
- One secret GitHub Gist as your entire sync backend

## Environment Variables

Copy `.env.example` to `.env`, then `npm run build` to regenerate `js/config.js` (gitignored):

```bash
GIST_ID=              # required for sync — id from your secret gist URL
GITHUB_TOKEN=         # required for sync — classic PAT, `gist` scope only
WALLHAVEN_API_KEY=    # optional — unlocks NSFW purity
```

## Architecture

```mermaid
flowchart LR
    A[Chrome new tab] --> B[newtab.html shell]
    A2[Firefox popup] --> B2[popup.html] --> B
    B --> C[app.js - grid, drag, sync]
    C --> D[localStorage] --> E[GitHub Gist API]
    B --> G[bookmarks.js - chrome.bookmarks]
    B --> H[walls.js - Wallhaven pool]
```

Last-write-wins by `updatedAt`; the gist is always authoritative on boot, so a wiped local store can never clobber real data.

## Development

```bash
npm run build          # config + icons + ts → js/
npm run build:all      # + firefox zip (AMO-ready)
npm run typecheck
```

## License

[MIT](LICENSE)
