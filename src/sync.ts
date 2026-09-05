/* ─── GitHub Gist sync — single-user, no backend ─── */

(function () {
'use strict';

const CF: Config = window.CONFIG || {};
const gistId = CF.gistId || '';
const githubToken = CF.githubToken || '';
const cfg = { enabled: !!(gistId && githubToken) };

const FILE_NAME = 'glisters-save.json';
const API = 'https://api.github.com/gists';

/* HARD SAFETY GUARD — automated sessions may never write to the live Gist.
   Every browser-automation stack (Marionette/Selenium, Puppeteer, Playwright,
   headless in general) sets navigator.webdriver to true; a real user's
   browser never does. A headless test instance once pushed its seed link
   list over the user's curated cloud data (2026-09-05) — this makes that
   class of accident structurally impossible. Pulls stay allowed (read-only);
   push is refused outright. */
function isAutomatedSession(): boolean {
  try { return navigator.webdriver === true; } catch { return false; }
}

function authHeader(): string {
  return 'Bearer ' + githubToken;
}

function pull(): Promise<SaveDoc | null> {
  if (!cfg.enabled) return Promise.reject(new Error('gist sync disabled'));
  return fetch(API + '/' + encodeURIComponent(gistId), {
    headers: { Authorization: authHeader() },
    cache: 'no-store'
  }).then(function (r: Response) {
    if (r.status === 404) return null;
    if (!r.ok) return r.text().then(function (t: string) { throw new Error(t || String(r.status)); });
    return r.json().then(function (gist: { files?: Record<string, { content?: string }> }) {
      const file = gist && gist.files && gist.files[FILE_NAME];
      if (!file || !file.content) return null;
      try { return JSON.parse(file.content) as SaveDoc; } catch { return null; }
    });
  });
}

function push(data: SaveDoc): Promise<boolean> {
  if (!cfg.enabled) return Promise.reject(new Error('gist sync disabled'));
  if (isAutomatedSession()) {
    return Promise.reject(new Error('push blocked: automated browser session (test builds must use scripts/build-test.mjs)'));
  }
  const files: Record<string, { content: string }> = {};
  files[FILE_NAME] = { content: JSON.stringify(data) };
  return fetch(API + '/' + encodeURIComponent(gistId), {
    method: 'PATCH',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files })
  }).then(function (r: Response) {
    if (!r.ok) return r.text().then(function (t: string) { throw new Error(t || String(r.status)); });
    return true;
  });
}

window.SYNC = { cfg, push, pull } as SyncClient;

})();