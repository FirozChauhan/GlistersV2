# GlistersV2 — Privacy

GlistersV2 is a single-user browser extension. Here's exactly what data it touches and where it goes.

## Data stored locally

- Your shortcut grid (icons, URLs, layout)
- Your wallpaper settings and favourites
- A favicon cache (so icons load instantly on every new tab)

This is stored in `localStorage` and `chrome.storage.local` inside your browser. No app or server ever sees it unless you enable sync.

## Cloud sync (GitHub Gist)

When you configure a Gist id + token in `js/config.js`, the extension sends your save data to **one specific secret GitHub Gist** that you own. The save contains:

- Your shortcut list (names + URLs)
- Your layout settings (icon size, columns, gaps, colours, etc.)
- Your wallpaper settings (favourites, safe wallpaper, category/purity filters)

The Gist is **private** (secret) — only you and anyone you share the Gist URL with can see it. GitHub stores revision history, so every save is backed up.

## What is NOT collected

- No email, name, or any identity information
- No cookies, session tokens, or analytics
- No IP logging (beyond what GitHub's servers see)
- No third-party scripts or tracking pixels
- No authentication server — the extension talks directly to GitHub's API

## Permissions

| Permission | Why |
|---|---|
| `storage` | Saves your shortcuts + settings locally |
| `bookmarks` | The bookmarks sidebar reads Chrome's native bookmarks |
| `https://*/*` | Loads favicons from each site; fetches Wallhaven wallpapers |
| `https://api.github.com/*` | Reads/writes your Gist (sync) |

## Data retention

- **Local**: persists until you clear browser data or uninstall the extension.
- **Gist**: persists until you delete the Gist or its file. GitHub retains revision history; you can delete individual revisions or the entire Gist at any time.

## Contact

For questions, open an issue at the repository.