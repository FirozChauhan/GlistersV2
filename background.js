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
// Guards: if the page also works without a background (e.g. file:// dev), the
// page falls back to a direct fetch when this channel is unavailable.

var api = (typeof browser !== 'undefined' && browser.runtime)
  ? browser.runtime
  : (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime : null);

if (api && api.onMessage) {
  api.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg || msg.type !== 'wallFetch' || !msg.url) return undefined;
    fetch(msg.url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) { sendResponse({ ok: false, error: 'wallhaven ' + r.status }); return; }
        r.json().then(
          function (j) { sendResponse({ ok: true, data: j }); },
          function (e) { sendResponse({ ok: false, error: 'json: ' + e }); }
        );
      })
      .catch(function (e) { sendResponse({ ok: false, error: String(e) }); });
    // Returning true keeps the message channel open for the async sendResponse.
    return true;
  });
}
