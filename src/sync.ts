/* ─── GitHub Gist sync — single-user, no backend ─── */

(function () {
'use strict';

const CF: Config = window.CONFIG || {};
const gistId = CF.gistId || '';
const githubToken = CF.githubToken || '';
const cfg = { enabled: !!(gistId && githubToken) };

const FILE_NAME = 'glisters-save.json';
const API = 'https://api.github.com/gists';

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