// GlistersBackground event page (Firefox MV3, also runs as a Chrome MV3
// service worker).
//
// Why this exists: wallhaven.cc's API sends NO CORS headers, and the newtab
// extension page can therefore get blocked when it fetches wallhaven directly.
// Firefox/Chrome host_permissions ("https://*/*") bypass CORS *for extension
// background scripts*, so we perform the wallhaven fetch here and hand the JSON
// back to the page over runtime messaging. This is the standard MV3 pattern for
// cross-origin API calls the page can't make on its own.
//
// NOTE on keeping the channel open for async sendResponse:
//   - Chrome (MV3 service worker) uses `return true` from the listener.
//   - Firefox (MV3 event page) IGNORES `return true`; the listener must return
//     a Promise and the channel stays open until it settles. Returning `true`
//     on Firefox closed the channel immediately, so the page's sendMessage
//     callback got `undefined` and every wallhaven request failed → the UI
//     silently kept the old (fallback) pool and every filter looked identical.
//   Returning a Promise works on BOTH browsers: Chrome ignores the return
//   value but still honours the async sendResponse calls made before resolve.
var api = (typeof browser !== 'undefined' && browser.runtime)
  ? browser.runtime
  : (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime : null);

if (api && api.onMessage) {
  api.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg || msg.type !== 'wallFetch' || !msg.url) return undefined;
    return new Promise(function (resolve) {
      fetch(msg.url, { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) { sendResponse({ ok: false, error: 'wallhaven ' + r.status }); resolve(false); return; }
          r.json().then(
            function (j) { sendResponse({ ok: true, data: j }); resolve(true); },
            function (e) { sendResponse({ ok: false, error: 'json: ' + e }); resolve(false); }
          );
        })
        .catch(function (e) { sendResponse({ ok: false, error: String(e) }); resolve(false); });
    });
  });
}

