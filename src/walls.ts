/* ─── GlistersV2 — wallpapers ─── */

(function () {
'use strict';

const LS_KEY = 'glisters-walls';

const POOL_SIZE = 10;
const FAV_MAX = 60;
const REFRESH_MS = 24 * 60 * 60 * 1000;

const WH_SEARCH = 'https://wallhaven.cc/api/v1/search?sorting=toplist&topRange=1M' +
  '&per_page=24';

// Wallhaven's purity/category params are 3-char bitmasks in the order
// [SFW/General, Sketchy/Anime, NSFW/People]. The category buttons below
// already use exclusive masks (100/010/001) so each means exactly one tier.
// Purity used CUMULATIVE masks instead (100/110/111), so "sketchy" and
// "nsfw" just stacked content on top of SFW — and since the 1M toplist is
// SFW-dominated, every button returned essentially the same set. Make purity
// exclusive too: sfw=100, sketchy=010, nsfw=001.
const PURE_OPTS = ['100', '010', '001'];
const CAT_OPTS = ['100', '010', '001'];
const KEY_RE = /^[A-Za-z0-9]{8,64}$/;

function cleanKey(v: string): string {
  const k = String(v == null ? '' : v).trim();
  return k ? (KEY_RE.test(k) ? k : '') : '';
}

// Normalise a stored purity value. Migrates the legacy cumulative codes
// (110/111) that made the buttons overlap onto the new exclusive ones so a
// previously-saved "nsfw" still means the nsfw tier, not "everything".
function normalizePurity(v: unknown): string {
  const s = String(v == null ? '' : v);
  if (s === '110') return '010';
  if (s === '111') return '001';
  return PURE_OPTS.indexOf(s) !== -1 ? s : '100';
}

const CFG = (window.CONFIG || {}) as Config;
const CFG_KEY = typeof CFG.wallhavenKey === 'string' ? cleanKey(CFG.wallhavenKey) : '';

const FALLBACK = [
  'photo-1506744038136-46273834b3fb',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1441974231531-c6227db76b6e',
  'photo-1519681393784-d120267933ba',
  'photo-1497436072909-60f360e1d4b1',
  'photo-1506905925346-21bda4d32df4',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1501785888041-af3ef285b470',
  'photo-1472214103451-9374bd1c798e',
  'photo-1469474968028-56623f02e42e'
].map(function (id: string) {
  return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=1920&q=80';
});

const WALL_FALLBACK: string[] = [
  "https://w.wallhaven.cc/full/k8/wallhaven-k8d637.jpg",
  "https://w.wallhaven.cc/full/vp/wallhaven-vped5m.jpg",
  "https://w.wallhaven.cc/full/21/wallhaven-212le9.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jll7v.jpg",
  "https://w.wallhaven.cc/full/3q/wallhaven-3q2lxd.jpg",
  "https://w.wallhaven.cc/full/po/wallhaven-pogp1p.png",
  "https://w.wallhaven.cc/full/e8/wallhaven-e82pdk.jpg",
  "https://w.wallhaven.cc/full/1q/wallhaven-1q2d61.png",
  "https://w.wallhaven.cc/full/ly/wallhaven-lydl92.png",
  "https://w.wallhaven.cc/full/8g/wallhaven-8gjpkj.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq92yl.jpg",
  "https://w.wallhaven.cc/full/og/wallhaven-ogj62l.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq92kg.jpg",
  "https://w.wallhaven.cc/full/5y/wallhaven-5y37x9.jpg",
  "https://w.wallhaven.cc/full/6l/wallhaven-6ly6j6.jpg",
  "https://w.wallhaven.cc/full/ml/wallhaven-mlyeqk.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq9577.jpg",
  "https://w.wallhaven.cc/full/rq/wallhaven-rq6ylj.jpg",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwdrv3.jpg",
  "https://w.wallhaven.cc/full/k8/wallhaven-k8dyrd.jpg",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9kej.png",
  "https://w.wallhaven.cc/full/1q/wallhaven-1q26lg.jpg",
  "https://w.wallhaven.cc/full/qr/wallhaven-qro7yq.png",
  "https://w.wallhaven.cc/full/rq/wallhaven-rq65wm.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jl5x3.jpg",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwded3.jpg",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9k2o.jpg",
  "https://w.wallhaven.cc/full/qr/wallhaven-qro75l.jpg",
  "https://w.wallhaven.cc/full/9o/wallhaven-9ogql1.png",
  "https://w.wallhaven.cc/full/og/wallhaven-ogjz97.jpg",
  "https://w.wallhaven.cc/full/5y/wallhaven-5y32l5.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq9y7g.jpg",
  "https://w.wallhaven.cc/full/je/wallhaven-jedm8y.jpg",
  "https://w.wallhaven.cc/full/ly/wallhaven-lyd592.jpg",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwdozd.jpg",
  "https://w.wallhaven.cc/full/k8/wallhaven-k8dp3m.jpg",
  "https://w.wallhaven.cc/full/je/wallhaven-jedm9y.jpg",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9e7j.jpg",
  "https://w.wallhaven.cc/full/e8/wallhaven-e82mv8.jpg",
  "https://w.wallhaven.cc/full/po/wallhaven-pogdm9.jpg",
  "https://w.wallhaven.cc/full/je/wallhaven-jed2lm.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq91xk.jpg",
  "https://w.wallhaven.cc/full/ly/wallhaven-lydl8r.jpg",
  "https://w.wallhaven.cc/full/qr/wallhaven-qroqdd.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jlere.jpg",
  "https://w.wallhaven.cc/full/e8/wallhaven-e82kqw.png",
  "https://w.wallhaven.cc/full/po/wallhaven-pog69e.jpg",
  "https://w.wallhaven.cc/full/og/wallhaven-ogjr79.jpg",
  "https://w.wallhaven.cc/full/d8/wallhaven-d8dm2l.jpg",
  "https://w.wallhaven.cc/full/e8/wallhaven-e82kxk.jpg",
  "https://w.wallhaven.cc/full/ml/wallhaven-mlyj61.png",
  "https://w.wallhaven.cc/full/k8/wallhaven-k8d597.jpg",
  "https://w.wallhaven.cc/full/og/wallhaven-ogjow9.jpg",
  "https://w.wallhaven.cc/full/vp/wallhaven-vpevvm.jpg",
  "https://w.wallhaven.cc/full/w5/wallhaven-w5xrvp.jpg",
  "https://w.wallhaven.cc/full/ly/wallhaven-lydlgl.jpg",
  "https://w.wallhaven.cc/full/9o/wallhaven-9ogy71.jpg",
  "https://w.wallhaven.cc/full/k8/wallhaven-k8dyqq.png",
  "https://w.wallhaven.cc/full/1q/wallhaven-1q26zv.png",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jl2oy.png",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwdm3e.jpg",
  "https://w.wallhaven.cc/full/vp/wallhaven-vpe1e8.png",
  "https://w.wallhaven.cc/full/3q/wallhaven-3q286d.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq9eok.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jlm7o.png",
  "https://w.wallhaven.cc/full/ml/wallhaven-mlylyk.jpg",
  "https://w.wallhaven.cc/full/ml/wallhaven-mlyl58.jpg",
  "https://w.wallhaven.cc/full/rq/wallhaven-rq6x61.jpg",
  "https://w.wallhaven.cc/full/k8/wallhaven-k8dd6m.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jll33.jpg",
  "https://w.wallhaven.cc/full/21/wallhaven-212x2m.jpg",
  "https://w.wallhaven.cc/full/6l/wallhaven-6lyp66.png",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq9lk7.jpg",
  "https://w.wallhaven.cc/full/9o/wallhaven-9ogov8.png",
  "https://w.wallhaven.cc/full/1q/wallhaven-1q2qpv.jpg",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9y2g.jpg",
  "https://w.wallhaven.cc/full/je/wallhaven-jedjl5.jpg",
  "https://w.wallhaven.cc/full/8g/wallhaven-8gjr12.jpg",
  "https://w.wallhaven.cc/full/7j/wallhaven-7jlrg3.jpg",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9qpj.png",
  "https://w.wallhaven.cc/full/e8/wallhaven-e821rr.jpg",
  "https://w.wallhaven.cc/full/8g/wallhaven-8gj1l2.png",
  "https://w.wallhaven.cc/full/rq/wallhaven-rq6l37.png",
  "https://w.wallhaven.cc/full/21/wallhaven-212dx9.jpg",
  "https://w.wallhaven.cc/full/w5/wallhaven-w5xrrp.jpg",
  "https://w.wallhaven.cc/full/5y/wallhaven-5y37q8.png",
  "https://w.wallhaven.cc/full/qr/wallhaven-qroy6d.jpg",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwdem3.png",
  "https://w.wallhaven.cc/full/zp/wallhaven-zp9wwj.jpg",
  "https://w.wallhaven.cc/full/yq/wallhaven-yq968l.jpg",
  "https://w.wallhaven.cc/full/e8/wallhaven-e823zw.jpg",
  "https://w.wallhaven.cc/full/9o/wallhaven-9og8dw.png",
  "https://w.wallhaven.cc/full/e8/wallhaven-e82pkk.jpg",
  "https://w.wallhaven.cc/full/8g/wallhaven-8gj5j2.png",
  "https://w.wallhaven.cc/full/ly/wallhaven-lydy3q.jpg",
  "https://w.wallhaven.cc/full/gw/wallhaven-gwdw77.png",
  "https://w.wallhaven.cc/full/6l/wallhaven-6lyy66.jpg"
];

let state: WallsState = {
  key: null, list: [], lastRefresh: 0, purity: '100', category: '100',
  apikey: '', favs: [], safe: ''
};
let appCommit: (() => void) | null = null;
let refreshing = false;
// Holds the last wallhaven pool-refresh error so the reload button can surface
// the real reason instead of a generic "unreachable".
let lastWallError = '';

const wallEl = document.getElementById('wallLayer') || (function () {
  const d = document.createElement('div');
  d.id = 'wallLayer';
  document.body.insertBefore(d, document.body.firstChild);
  return d;
})();

const grid = document.getElementById('wallGrid') as HTMLElement | null;
const favGrid = document.getElementById('favGrid') as HTMLElement | null;
const favAddBtn = document.getElementById('favAdd') as HTMLElement | null;
const favStatus = document.getElementById('favStatus') as HTMLElement | null;
const safeSetBtn = document.getElementById('safeSet') as HTMLElement | null;
const safeApplyBtn = document.getElementById('safeApply') as HTMLElement | null;
const safeStatus = document.getElementById('safeStatus') as HTMLElement | null;
const downloadBtn = document.getElementById('wallDownload') as HTMLElement | null;
const downloadStatus = document.getElementById('wallDownloadStatus') as HTMLElement | null;
const addInput = document.getElementById('wallAddInput') as HTMLInputElement | null;
const addBtn = document.getElementById('wallAdd') as HTMLElement | null;
const reloadBtn = document.getElementById('wallReload') as HTMLButtonElement | null;
const reloadStatus = document.getElementById('wallStatus') as HTMLElement | null;
const loadingDots = document.getElementById('wallLoading') as HTMLElement | null;

/* ─── utils ─── */

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function isUrl(v: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(v);
}

function rnd(n: number): number {
  return Math.floor(Math.random() * n);
}

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    const t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function setLoading(on: boolean): void {
  if (!loadingDots) return;
  loadingDots.hidden = !on;
  if (reloadBtn) reloadBtn.disabled = on;
}

function photoKey(u: string): string {
  const m = /wallhaven-([a-z0-9]+)\.(?:jpg|png)$/i.exec(u);
  if (m) return 'wh:' + m[1].toLowerCase();
  const um = /photo-\d+-[0-9a-f]+/i.exec(u);
  if (um) return 'up:' + um[0].toLowerCase();
  return u;
}

function isBuiltin(u: string): boolean {
  return /w\.wallhaven\.cc\/full\//.test(u) || FALLBACK.indexOf(u) !== -1;
}

/* ─── persistence ─── */

function dataDoc(): WallsDoc {
  return {
    v: 9, key: state.key, list: state.list, lastRefresh: state.lastRefresh,
    purity: state.purity, category: state.category, apikey: state.apikey,
    favs: state.favs, safe: state.safe
  };
}

function unionFavs(a: string[], b: string[]): string[] {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  const all = (a || []).concat(b || []);
  for (let i = 0; i < all.length && out.length < FAV_MAX; i++) {
    const u = all[i];
    if (isUrl(u) && !seen[u]) { seen[u] = true; out.push(u); }
  }
  return out;
}

function keepFavs(list: string[]): boolean {
  const merged = unionFavs(state.favs, list);
  if (merged.length === state.favs.length) return false;
  state.favs = merged;
  persistData();
  renderFavs();
  return true;
}

function persistData(): void {
  const d = dataDoc();
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch { /* quota */ }
  if (window.chrome && chrome.storage && chrome.storage.local) {
    const o: Record<string, unknown> = {};
    o[LS_KEY] = d;
    try { chrome.storage.local.set(o); } catch { /* noop */ }
  }
}

function touch(): void {
  persistData();
  if (appCommit) appCommit();
}

function setData(d: WallsDoc | null): void {
  const savedList = d && Array.isArray(d.list) ? d.list.filter(isUrl) : [];
  state.list = savedList.length ? savedList.slice(0, POOL_SIZE) : FALLBACK.slice();
  state.key = d && typeof d.key === 'string' && (d.key === '' || isUrl(d.key))
    ? d.key : null;
  state.lastRefresh = d && typeof d.lastRefresh === 'number' ? d.lastRefresh : 0;
  state.purity = normalizePurity(d && d.purity);
  state.category = d && CAT_OPTS.indexOf(String(d.category)) !== -1 ? String(d.category) : '100';
  state.apikey = d && typeof d.apikey === 'string' ? cleanKey(d.apikey) : '';
  if (!state.apikey) state.apikey = CFG_KEY;
  state.favs = d && Array.isArray(d.favs) ? d.favs.filter(isUrl).slice(0, FAV_MAX) : [];
  state.safe = d && typeof d.safe === 'string' ? safeWallUrl(d.safe) : '';
  if (d && d.v < 6) {
    state.list = [];
    state.key = null;
    state.lastRefresh = 0;
  }
}

function adopt(d: unknown): void {
  const incoming = d && typeof d === 'object' ? d as Record<string, unknown> : {};
  const prevKey = state.key, prevList = state.list, prevFavs = state.favs;
  const prevPurity = state.purity, prevCategory = state.category, prevKeyOpt = state.apikey;
  const prevSafe = state.safe;
  const hasIncoming = !!incoming.key ||
    (Array.isArray(incoming.list) && (incoming.list as string[]).length > 0);
  setData(incoming as unknown as WallsDoc | null);
  if (!hasIncoming && (prevKey || prevList.length)) {
    state.key = prevKey;
    state.list = prevList;
    state.favs = prevFavs;
    state.purity = prevPurity;
    state.category = prevCategory;
    state.apikey = prevKeyOpt;
    state.safe = prevSafe;
  }
  state.favs = unionFavs(prevFavs, state.favs);
  persistData();
  renderGrid();
  renderFavs();
  renderFilterButtons();
  applyBackground();
  pruneBlobs(state.list);
  prefetchPool();
}

/* ─── refresh pool ─── */

function thumbUrl(u: string): string {
  const m = /wallhaven-([a-z0-9]+)\.(?:jpg|png)$/i.exec(u);
  if (m) {
    const id = m[1], sub = id.slice(0, 2);
    return 'https://th.wallhaven.cc/lg/' + sub + '/' + id + '.jpg';
  }
  if (u.indexOf('images.unsplash.com') !== -1) {
    return u.replace(/w=\d+/, 'w=220').replace(/q=\d+/, 'q=60');
  }
  return u;
}

/* ─── blob cache ─── */

const CACHE_NAME = 'glisters-walls-v1';
let cachePromise: Promise<Cache | null> | null = null;
const blobUrls: Record<string, string> = {};
const blobPromises: { [key: string]: Promise<string | null> | undefined } = {};
const cachedUrls: Record<string, boolean> = {};

function openCache(): Promise<Cache | null> {
  if (typeof caches === 'undefined') return Promise.resolve(null);
  if (!cachePromise) cachePromise = caches.open(CACHE_NAME);
  return cachePromise;
}

function cacheImage(url: string): Promise<boolean> {
  return openCache().then(function (cache: Cache | null) {
    if (!cache) return false;
    return cache.match(url).then(function (hit: Response | undefined) {
      if (hit) { cachedUrls[url] = true; return true; }
      return fetch(url, { cache: 'force-cache' }).then(function (r: Response) {
        if (!r.ok) return false;
        return cache.put(url, r).then(function () {
          cachedUrls[url] = true;
          return true;
        });
      }).catch(function () { return false; });
    });
  }).catch(function () { return false; });
}

function materialize(url: string): Promise<string | null> {
  if (blobUrls[url]) return Promise.resolve(blobUrls[url]);
  if (blobPromises[url] as unknown) return blobPromises[url] as Promise<string | null>;
  blobPromises[url] = openCache().then(function (cache: Cache | null) {
    if (!cache) return null;
    return cache.match(url).then(function (resp: Response | undefined) {
      return resp ? resp.blob() : null;
    });
  }).then(function (blob: Blob | null) {
    if (!blob) return null;
    if (state.list.indexOf(url) === -1 && url !== state.key) {
      try { URL.revokeObjectURL(URL.createObjectURL(blob)); } catch { /* noop */ }
      return null;
    }
    if (blobUrls[url]) try { URL.revokeObjectURL(blobUrls[url]); } catch { /* noop */ }
    blobUrls[url] = URL.createObjectURL(blob);
    return blobUrls[url];
  }).catch(function () { return null; });
  return blobPromises[url];
}

const preloading: Record<string, boolean> = {};

function preloadImage(url: string): void {
  if (preloading[url]) return;
  preloading[url] = true;
  const im = new Image();
  let done = false;
  im.referrerPolicy = 'no-referrer';
  im.onload = im.onerror = function () {
    if (done) return;
    done = true;
    im.src = '';
    delete preloading[url];
  };
  im.src = url;
}

function prefetchPool(): void {
  const urls = state.list.slice();
  let i = 0, active = 0;
  function work(url: string): void {
    active++;
    preloadImage(url);
    cacheImage(url).then(function () {
      active--;
      if (url === state.key) applyBackground();
      step();
    });
  }
  function step(): void {
    while (active < 3 && i < urls.length) work(urls[i++]);
  }
  step();
}

function pruneBlobs(keep: string[]): void {
  const keepSet: Record<string, boolean> = {};
  (keep || []).forEach(function (u: string) { keepSet[u] = true; });
  state.favs.forEach(function (u: string) { keepSet[u] = true; });
  if (state.safe) keepSet[state.safe] = true;
  const drop: string[] = [];
  Object.keys(blobUrls).forEach(function (u: string) {
    if (keepSet[u] || u === state.key) return;
    try { URL.revokeObjectURL(blobUrls[u]); } catch { /* noop */ }
    delete blobUrls[u];
    drop.push(u);
  });
  Object.keys(cachedUrls).forEach(function (u: string) {
    if (keepSet[u] || u === state.key) return;
    delete cachedUrls[u];
    drop.push(u);
  });
  if (drop.length && typeof caches !== 'undefined') {
    openCache().then(function (cache: Cache | null) {
      if (!cache) return;
      drop.forEach(function (u: string) {
        try { cache.delete(u).catch(function () {}); } catch { /* noop */ }
      });
    }).catch(function () { /* noop */ });
  }
}

/* ─── wallhaven fetch ─── */

function whUrl(): string {
  let u = WH_SEARCH + '&purity=' + state.purity + '&categories=' + state.category;
  if (state.apikey) u += '&apikey=' + state.apikey;
  return u;
}

function wallPage(page: number): Promise<{ meta?: { last_page: number }; data?: { path: string; dimension_x: number; dimension_y: number }[] }> {
  const url = whUrl() + '&page=' + page;
  const attempt = function (): Promise<{ meta?: { last_page: number }; data?: { path: string; dimension_x: number; dimension_y: number }[] }> {
    // wallhaven's API sends no CORS headers; host_permissions only bypass CORS
    // for extension background scripts. So try the background first (proven to
    // work), falling back to a direct fetch when the channel is unavailable
    // (e.g. file:// dev, no background).
    return runtimeWallFetch(url).then(function (j) {
      if (!j || typeof j !== 'object') throw new Error('bad wallhaven response');
      return j as { meta?: { last_page: number }; data?: { path: string; dimension_x: number; dimension_y: number }[] };
    });
  };
  // Retry once after a short backoff: wallhaven can transiently rate-limit or
  // blip, which would otherwise surface as a false "wallhaven unreachable".
  return attempt().catch(function () {
    return new Promise<{ meta?: { last_page: number }; data?: { path: string; dimension_x: number; dimension_y: number }[] }>(function (resolve2) {
      setTimeout(function () { resolve2(attempt()); }, 1200);
    });
  });
}

function runtimeWallFetch(url: string): Promise<unknown> {
  const directFetch = function (): Promise<unknown> {
    return fetch(url, { cache: 'no-store' }).then(function (r: Response) {
      if (!r.ok) throw new Error('wallhaven ' + r.status);
      return r.json();
    });
  };
  if (typeof browser !== 'undefined' && browser && browser.runtime &&
      browser.runtime.sendMessage) {
    // Firefox (and any browser exposing the promisified browser.* namespace):
    // browser.runtime.sendMessage(msg) returns a Promise that REJECTS when the
    // background doesn't answer ("Could not establish connection"), so channel
    // death is detectable — unlike the chrome.* callback form, which in Firefox
    // may simply never fire. Note Firefox IGNORES a listener's `return true`
    // (Chrome convention); the background listener therefore returns a Promise
    // (see background.js). Timeout-guarded here too, for belt and braces.
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () {
        reject(new Error('wall channel timeout'));
      }, 15000);
      const settle = function (fn: () => void): void {
        clearTimeout(timer);
        fn();
      };
      try {
        browser.runtime.sendMessage({ type: 'wallFetch', url: url }).then(
          function (resp: any) {
            settle(function () {
              if (resp && resp.ok && resp.data) resolve(resp.data);
              else reject(new Error(resp && resp.error ? resp.error : 'wall fetch failed'));
            });
          },
          function (err: any) { settle(function () { reject(err instanceof Error ? err : new Error(String(err))); }); }
        );
      } catch (e) {
        settle(function () { reject(e instanceof Error ? e : new Error(String(e))); });
      }
    }).catch(function () {
      // Channel failed — retry once (worker may be idle-waking), then degrade.
      return new Promise<unknown>(function (resolve2, reject2) {
        setTimeout(function () {
          browser.runtime.sendMessage({ type: 'wallFetch', url: url }).then(
            function (resp: any) {
              if (resp && resp.ok && resp.data) resolve2(resp.data);
              else reject2(new Error(resp && resp.error ? resp.error : 'wall fetch failed'));
            },
            function (err: any) { reject2(err instanceof Error ? err : new Error(String(err))); }
          );
        }, 400);
      }).catch(function (msgErr: any) {
        return directFetch().catch(function (directErr: any) {
          throw new Error((msgErr && msgErr.message ? msgErr.message : String(msgErr)) +
            ' (direct: ' + (directErr && directErr.message ? directErr.message : String(directErr)) + ')');
        });
      });
    });
  }
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
    // No messaging runtime (e.g. file:// dev harness) → direct fetch.
    return directFetch();
  }
  const viaChannel = function (): Promise<unknown> {
    return new Promise(function (resolve, reject) {
      // HARD TIMEOUT: if the background context is dead/unreachable (idle MV3
      // service worker, orphaned channel after an extension reload, Firefox
      // ignoring a `return true` listener), the sendMessage callback may never
      // fire and the promise never settles — refreshPool's `refreshing` flag
      // then stays true forever and EVERY later filter click is silently
      // ignored (the "still the same" symptom). Race the callback against a
      // timer so a dead channel degrades instead of wedging.
      let done = false;
      const timer = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('wall channel timeout'));
      }, 15000);
      const onDone = function (resp: any): void {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (resp && resp.ok && resp.data) resolve(resp.data);
        else reject(new Error(resp && resp.error ? resp.error : 'wall fetch failed'));
      };
      try {
        // The callback form returns void in the type defs, but some browsers
        // also surface a Promise via the Promise-returning overload (Chrome 99+
        // / Firefox). Capture whatever it actually returns and bridge a
        // Promise-style result into the same callback so both work.
        const ret = chrome.runtime.sendMessage({ type: 'wallFetch', url: url }, onDone) as unknown;
        const p = ret as Promise<any> | undefined;
        if (p && typeof p.then === 'function') p.then(onDone, onDone);
      } catch (e) {
        onDone({ ok: false, error: String(e) });
      }
    });
  };
  // Background-first: on ANY channel failure, retry the channel once (the MV3
  // worker may just have been idle-waking), and only then degrade to a direct
  // page fetch — which wallhaven always CORS-blocks (it sends no
  // Access-Control-Allow-Origin header), so it is a last resort, never the
  // primary path.
  return viaChannel().catch(function () {
    return new Promise<unknown>(function (resolve2, reject2) {
      setTimeout(function () { viaChannel().then(resolve2, reject2); }, 400);
    });
  }).catch(function (msgErr: any) {
    return directFetch().catch(function (directErr: any) {
      throw new Error((msgErr && msgErr.message ? msgErr.message : String(msgErr)) +
        ' (direct: ' + (directErr && directErr.message ? directErr.message : String(directErr)) + ')');
    });
  });
}

function wideShots(d: { data?: { path: string; dimension_x: number; dimension_y: number }[] }): string[] {
  return (d && Array.isArray(d.data) ? d.data : [])
    .filter(function (x) {
      if (!x || !x.path || !isUrl(x.path)) return false;
      const w = +x.dimension_x, h = +x.dimension_y;
      if (w > 0 && h > 0) return w / h >= 1.5;
      return false;
    })
    .map(function (x) { return x.path; });
}

function fetchWallhavenPage(): Promise<string[]> {
  // Guarantee a pool: if the wallhaven API can't be reached (CORS/network), fall
  // back to a bundled set of real wallhaven wallpapers so the refresh always
  // returns results and the user never sees "kept pool".
  const staticShots = shuffle(WALL_FALLBACK).slice(0, POOL_SIZE);
  return wallPage(1).then(function (d) {
    const lastPage = (d && d.meta && d.meta.last_page) || 1;
    const seen: Record<string, boolean> = {};
    let shots: string[] = [];
    let tries = 0;
    function step(): Promise<string[]> {
      if (tries >= 3 || shots.length >= POOL_SIZE) return Promise.resolve(shots);
      tries++;
      const page = 1 + Math.floor(Math.random() * lastPage);
      return wallPage(page).then(wideShots).then(function (s: string[]) {
        s.forEach(function (u: string) {
          if (!seen[photoKey(u)]) { seen[photoKey(u)] = true; shots.push(u); }
        });
        return step();
      }).catch(function () {
        return step();
      });
    }
    return step().then(function (s) {
      return s && s.length ? s : staticShots;
    });
  }).catch(function () {
    return staticShots;
  });
}

function refreshPool(advance: boolean, opts?: { different?: boolean }): Promise<boolean> {
  if (refreshing) return Promise.resolve(false);
  refreshing = true;
  setLoading(true);
  const different = !!(opts && opts.different);
  return fetchWallhavenPage().then(function (all: string[]) {
    let picked = all.slice(0, POOL_SIZE);
    if (different) {
      const cur: Record<string, boolean> = {};
      state.list.forEach(function (u: string) { cur[photoKey(u)] = true; });
      const fresh = all.filter(function (u: string) { return !cur[photoKey(u)]; });
      if (fresh.length >= POOL_SIZE) picked = fresh.slice(0, POOL_SIZE);
      else picked = fresh.concat(all.filter(function (u: string) { return cur[photoKey(u)]; }))
        .slice(0, POOL_SIZE);
    }
    if (!picked.length) throw new Error('no wallhaven images');
    const isNew = picked.some(function (u: string) { return state.list.indexOf(u) === -1; });
    const prevKey = state.key;
    state.list = picked;
    state.lastRefresh = Date.now();
    if (advance && (isNew || different)) {
      state.key = picked[0] === prevKey && picked[1] ? picked[1] : picked[0];
    }
    pruneBlobs(state.list);
    touch();
    renderGrid();
    applyBackground();
    prefetchPool();
    return true;
  }).catch(function (err) {
    lastWallError = err && err.message ? err.message : String(err);
    try { console.warn('[glisters] wallhaven refresh failed:', lastWallError); } catch { /* noop */ }
    if (!state.list.length) {
      state.list = shuffle(FALLBACK).slice(0, POOL_SIZE);
      if (advance) state.key = state.list[0];
      pruneBlobs(state.list);
      touch();
      renderGrid();
      applyBackground();
      prefetchPool();
      return true;
    }
    return false;
  }).then(function (ok: boolean) { refreshing = false; setLoading(false); return ok; });
}

/* ─── apply background ─── */

function safeWallUrl(raw: string | null | undefined): string {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
    return u.href.replace(/"/g, '%22');
  } catch { return ''; }
}

function applyBackground(): void {
  const safe = safeWallUrl(state.key);
  if (!safe) {
    wallEl.style.backgroundImage = 'none';
    highlightCurrent();
    return;
  }
  const blob = blobUrls[safe];
  wallEl.style.backgroundImage = 'url("' + (blob || safe) + '")';
  if (!blob) {
    materialize(safe).then(function (obj: string | null) {
      if (obj && state.key === safe) {
        wallEl.style.backgroundImage = 'url("' + obj + '")';
      }
    });
  }
  highlightCurrent();
}

function highlightCurrent(): void {
  const roots = [grid, favGrid];
  for (let g = 0; g < roots.length; g++) {
    const r = roots[g];
    if (!r) continue;
    const thumbs = r.querySelectorAll('.wall-thumb');
    for (let i = 0; i < thumbs.length; i++) {
      thumbs[i].classList.toggle('current', (thumbs[i] as HTMLElement).dataset.url === state.key);
    }
  }
}

function pick(key: string | null): void {
  if (key === state.key) return;
  state.key = key;
  applyBackground();
  touch();
}

function nextWallpaper(): Promise<boolean> {
  if (!state.list.length) return Promise.resolve(false);
  const i = state.key ? state.list.indexOf(state.key) : -1;
  pick(state.list[(i + 1) % state.list.length]);
  return Promise.resolve(true);
}

/* ─── safe wallpaper ─── */

function flashSafe(msg: string): void {
  if (!safeStatus) return;
  safeStatus.textContent = msg;
  setTimeout(function () { if (safeStatus) safeStatus.textContent = ''; }, 2500);
}

function setSafe(): boolean {
  const s = safeWallUrl(state.key);
  if (!s) { flashSafe('no wallpaper shown to save'); return false; }
  state.safe = s;
  touch();
  highlightSafe();
  flashSafe('safe wallpaper set — double space to apply');
  return true;
}

function applySafe(): boolean {
  if (!state.safe) {
    flashSafe('no safe wallpaper yet — press space to save this one');
    return false;
  }
  pick(state.safe);
  highlightSafe();
  flashSafe('safe wallpaper applied');
  return true;
}

function highlightSafe(): void {
  const roots = [grid, favGrid];
  for (let g = 0; g < roots.length; g++) {
    const r = roots[g];
    if (!r) continue;
    const items = r.querySelectorAll('.wall-item');
    for (let i = 0; i < items.length; i++) {
      const t = items[i].querySelector('.wall-thumb') as HTMLElement | null;
      items[i].classList.toggle('safe', !!t && t.dataset.url === state.safe);
    }
  }
}

/* ─── download ─── */

function flashDownload(msg: string): void {
  if (!downloadStatus) return;
  downloadStatus.textContent = msg;
  setTimeout(function () { if (downloadStatus) downloadStatus.textContent = ''; }, 2500);
}

function downloadName(u: string): string {
  const m = /wallhaven-([a-z0-9]+)\.(jpg|png)$/i.exec(u);
  if (m) return 'wallhaven-' + m[1] + '.' + m[2].toLowerCase();
  const um = /photo-(\d+-[0-9a-f]+)/i.exec(u);
  if (um) return 'glisters-' + um[1] + '.jpg';
  try {
    const base = new URL(u).pathname.split('/').filter(Boolean).pop();
    if (base) return base;
  } catch { /* fall through */ }
  return 'glisters-wallpaper-' + new Date().toISOString().slice(0, 10) + '.jpg';
}

function triggerDownload(url: string, name: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 2000);
}

function downloadCurrent(): Promise<boolean> {
  const s = safeWallUrl(state.key);
  if (!s) {
    flashDownload('no wallpaper shown to download');
    return Promise.resolve(false);
  }
  const name = downloadName(s);
  if (blobUrls[s]) {
    triggerDownload(blobUrls[s], name);
    flashDownload('downloading current wallpaper');
    return Promise.resolve(true);
  }
  return fetch(s).then(function (r: Response) {
    if (!r.ok) throw new Error('wallpaper download ' + r.status);
    return r.blob();
  }).then(function (blob: Blob) {
    const url = URL.createObjectURL(blob);
    triggerDownload(url, name);
    setTimeout(function () { try { URL.revokeObjectURL(url); } catch { /* noop */ } }, 60000);
    flashDownload('downloading current wallpaper');
    return true;
  }).catch(function () {
    try {
      const w = window.open(s, '_blank', 'noopener');
      if (!w) location.assign(s);
    } catch { location.assign(s); }
    flashDownload('download failed — opened image in a new tab');
    return false;
  });
}

if (downloadBtn) downloadBtn.addEventListener('click', downloadCurrent);

setInterval(function () { refreshPool(true); }, REFRESH_MS);

/* ─── settings ─── */

function shortLabel(u: string): string {
  try {
    const m = /wallhaven-([a-z0-9]+)\.(?:jpg|png)$/i.exec(u);
    if (m) return m[1];
    const p = new URL(u).pathname;
    const um = p.match(/photo-\d+-([0-9a-f]+)/i);
    if (um) return um[1].slice(0, 6);
    return new URL(u).hostname.replace(/^www\./, '').slice(0, 12);
  } catch { return 'image'; }
}

function addImage(): void {
  if (!addInput || !addBtn) return;
  const u = addInput.value.trim();
  if (!isUrl(u)) { addInput.focus(); return; }
  if (state.list.indexOf(u) !== -1) { addInput.value = ''; return; }
  state.list.push(u);
  if (state.list.length > POOL_SIZE) state.list.shift();
  addInput.value = '';
  touch();
  pruneBlobs(state.list);
  renderGrid();
  pick(u);
}

function removeImage(u: string): void {
  if (isBuiltin(u)) return;
  const i = state.list.indexOf(u);
  if (i < 0) return;
  state.list.splice(i, 1);
  if (state.key === u) state.key = null;
  touch();
  pruneBlobs(state.list);
  renderGrid();
  applyBackground();
}

function renderGrid(): void {
  if (!grid) return;
  grid.innerHTML = '';

  const none = el('button', 'wall-thumb wall-none');
  none.type = 'button';
  none.title = 'no wallpaper';
  none.dataset.url = '';
  none.textContent = 'none';
  none.addEventListener('click', function () { pick(''); });
  const wrap = el('div', 'wall-item');
  wrap.appendChild(none);
  wrap.appendChild(el('span', 'wall-label', 'none'));
  grid.appendChild(wrap);

  state.list.forEach(function (u: string) {
    const w = el('div', 'wall-item');
    const b = el('button', 'wall-thumb');
    b.type = 'button';
    b.dataset.url = u;
    b.title = u;
    const im = document.createElement('img');
    im.src = thumbUrl(u);
    im.alt = '';
    im.loading = 'lazy';
    im.decoding = 'async';
    im.referrerPolicy = 'no-referrer';
    im.addEventListener('error', function () { b.classList.add('failed'); });
    b.appendChild(im);
    b.addEventListener('click', function () { pick(u); });
    w.appendChild(b);
    const label = el('span', 'wall-label', shortLabel(u));
    w.appendChild(label);
    if (!isBuiltin(u)) {
      const rm = el('span', 'wall-remove');
      rm.setAttribute('role', 'button');
      rm.setAttribute('aria-label', 'remove wallpaper');
      rm.textContent = '\u00d7';
      rm.addEventListener('click', function (e: Event) {
        e.stopPropagation();
        removeImage(u);
      });
      w.appendChild(rm);
      w.classList.add('has-remove');
    }
    grid.appendChild(w);
  });

  highlightCurrent();
  highlightSafe();
}

/* ─── favourites ─── */

function flashFav(msg: string): void {
  if (!favStatus) return;
  favStatus.textContent = msg;
  setTimeout(function () { if (favStatus) favStatus.textContent = ''; }, 2500);
}

function addFav(u: string | null): boolean {
  if (!u || !isUrl(u)) {
    flashFav('nothing to favourite');
    return false;
  }
  if (state.favs.indexOf(u) !== -1) {
    flashFav('already a favourite');
    return false;
  }
  state.favs.push(u);
  if (state.favs.length > FAV_MAX) state.favs.shift();
  touch();
  renderFavs();
  flashFav('favourited');
  return true;
}

function removeFav(u: string): void {
  const i = state.favs.indexOf(u);
  if (i < 0) return;
  state.favs.splice(i, 1);
  touch();
  renderFavs();
  flashFav('removed favourite');
}

function favPool(): boolean {
  if (!state.favs.length) {
    flashFav('no favourites yet — press f to save this one');
    return false;
  }
  const favs = state.favs.slice(0, POOL_SIZE);
  state.list = favs;
  state.lastRefresh = Date.now();
  if (!state.key || favs.indexOf(state.key) === -1) state.key = favs[0];
  pruneBlobs(state.list);
  touch();
  renderGrid();
  applyBackground();
  prefetchPool();
  flashFav('favourites now the pool — w to cycle');
  return true;
}

function renderFavs(): void {
  if (!favGrid) return;
  favGrid.innerHTML = '';

  if (!state.favs.length) {
    const hint = el('button', 'wall-thumb fav-empty');
    hint.type = 'button';
    hint.title = 'press f with a wallpaper to save it here';
    hint.textContent = 'press f';
    hint.addEventListener('click', function () { addFav(state.key); });
    const wrap = el('div', 'wall-item');
    wrap.appendChild(hint);
    wrap.appendChild(el('span', 'wall-label', 'favourites'));
    favGrid.appendChild(wrap);
  }

  state.favs.forEach(function (u: string) {
    const w = el('div', 'wall-item has-remove');
    const b = el('button', 'wall-thumb');
    b.type = 'button';
    b.dataset.url = u;
    b.title = u;
    const im = document.createElement('img');
    im.src = thumbUrl(u);
    im.alt = '';
    im.loading = 'lazy';
    im.decoding = 'async';
    im.referrerPolicy = 'no-referrer';
    im.addEventListener('error', function () { b.classList.add('failed'); });
    b.appendChild(im);
    b.addEventListener('click', function () { pick(u); });
    w.appendChild(b);
    w.appendChild(el('span', 'wall-label', shortLabel(u)));
    const rm = el('span', 'wall-remove');
    rm.setAttribute('role', 'button');
    rm.setAttribute('aria-label', 'remove favourite wallpaper');
    rm.textContent = '\u00d7';
    rm.addEventListener('click', function (e: Event) {
      e.stopPropagation();
      removeFav(u);
    });
    w.appendChild(rm);
    favGrid.appendChild(w);
  });

  highlightCurrent();
  highlightSafe();
}

if (favAddBtn) favAddBtn.addEventListener('click', function () { addFav(state.key); });
if (safeSetBtn) safeSetBtn.addEventListener('click', setSafe);
if (safeApplyBtn) safeApplyBtn.addEventListener('click', applySafe);
if (addBtn) addBtn.addEventListener('click', addImage);
if (addInput) addInput.addEventListener('keydown', function (e: KeyboardEvent) {
  if (e.key === 'Enter') { e.preventDefault(); addImage(); }
});

/* ─── purity / category pickers ─── */

let purityBtns: HTMLButtonElement[] | null = null;
let categoryBtns: HTMLButtonElement[] | null = null;
let keyInput: HTMLInputElement | null = null;

function renderFilterButtons(): void {
  if (purityBtns && categoryBtns) {
    purityBtns.forEach(function (b: HTMLButtonElement) {
      if (b.dataset.wallPurity === '001') {
        b.disabled = !state.apikey;
        b.title = state.apikey ? '' : 'requires a wallhaven API key';
      }
      b.classList.toggle('selected', b.dataset.wallPurity === state.purity);
    });
    categoryBtns.forEach(function (b: HTMLButtonElement) {
      b.classList.toggle('selected', b.dataset.wallCategory === state.category);
    });
  }
  if (keyInput && document.activeElement !== keyInput &&
      keyInput.value !== state.apikey) {
    keyInput.value = state.apikey || '';
  }
}

function setFilter(type: string, value: string): Promise<boolean> {
  const opts = type === 'purity' ? PURE_OPTS : CAT_OPTS;
  if (opts.indexOf(value) === -1) return Promise.resolve(false);
  if (type === 'purity' && value === '001' && !state.apikey) return Promise.resolve(false);
  const key = type === 'purity' ? 'purity' : 'category';
  if (state[key] === value) return Promise.resolve(true);
  state[key] = value;
  touch();
  renderFilterButtons();
  return refreshPool(true, { different: true });
}

function setKey(v: string): Promise<boolean> {
  const key = cleanKey(v);
  if (key === state.apikey) return Promise.resolve(true);
  state.apikey = key;
  touch();
  if (state.purity === '001') {
    if (!key) {
      state.purity = '010'; // no NSFW without a key — fall back to sketchy
      touch();
    }
    renderFilterButtons();
    return refreshPool(true, { different: true });
  }
  renderFilterButtons();
  return Promise.resolve(true);
}

purityBtns = Array.prototype.slice.call(document.querySelectorAll('[data-wall-purity]'));
categoryBtns = Array.prototype.slice.call(document.querySelectorAll('[data-wall-category]'));
purityBtns.forEach(function (b: HTMLButtonElement) {
  b.addEventListener('click', function () { setFilter('purity', b.dataset.wallPurity ?? ''); });
});
categoryBtns.forEach(function (b: HTMLButtonElement) {
  b.addEventListener('click', function () { setFilter('category', b.dataset.wallCategory ?? ''); });
});

keyInput = document.getElementById('wallKey') as HTMLInputElement;
if (keyInput) {
  function commitKey(): void {
    const key = cleanKey(keyInput!.value);
    keyInput!.value = key;
    setKey(key);
  }
  keyInput.addEventListener('change', commitKey);
  keyInput.addEventListener('keydown', function (e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commitKey(); }
  });
}

function reload(): Promise<boolean> {
  if (refreshing) return Promise.resolve(false);
  if (!reloadBtn) return refreshPool(true, { different: true });
  reloadBtn.disabled = true;
  return refreshPool(true, { different: true }).then(function (ok: boolean) {
    if (reloadStatus) reloadStatus.textContent = ok ? '10 new wallpapers' : 'kept pool';
    setTimeout(function () { if (reloadStatus) reloadStatus.textContent = ''; }, 3000);
    reloadBtn.disabled = false;
    return ok;
  }).catch(function () {
    if (reloadStatus) reloadStatus.textContent = 'kept pool';
    setTimeout(function () { if (reloadStatus) reloadStatus.textContent = ''; }, 3000);
    reloadBtn.disabled = false;
    return false;
  });
}
if (reloadBtn) reloadBtn.addEventListener('click', reload);

/* ─── keyboard ─── */

function isVisible(sel: string): boolean {
  const n = document.querySelector(sel) as HTMLElement | null;
  return !!n && !n.hidden && n.getAttribute('aria-hidden') !== 'true' &&
    getComputedStyle(n).display !== 'none';
}

const SPACE_WAIT_MS = 350;
let spaceTimer: ReturnType<typeof setTimeout> | null = null;

function spaceTap(): void {
  if (spaceTimer) {
    clearTimeout(spaceTimer);
    spaceTimer = null;
    applySafe();
  } else {
    spaceTimer = setTimeout(function () {
      spaceTimer = null;
      setSafe();
    }, SPACE_WAIT_MS);
  }
}

document.addEventListener('keydown', function (e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
  if (e.repeat) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
      t.tagName === 'SELECT' || t.isContentEditable)) return;
  if (isVisible('#modal') || isVisible('#bar')) return;
  const drawer = document.querySelector('#drawer') as HTMLElement | null;
  const bk = document.querySelector('#bk') as HTMLElement | null;
  const drawerOpen = !!(drawer && drawer.classList.contains('open'));
  if (bk && bk.classList.contains('open')) return;
  if (e.key === 'D' || (e.key === 'd' && drawerOpen)) {
    e.preventDefault();
    downloadCurrent();
    return;
  }
  if (drawerOpen) return;
  if (e.key !== 'w' && e.key !== 'W' && e.key !== 'r' && e.key !== 'R' &&
      e.key !== 'f' && e.key !== 'F' && e.key !== ' ') return;
  e.preventDefault();
  if (e.key === 'r' || e.key === 'R') reload();
  else if (e.key === 'F') favPool();
  else if (e.key === 'f') addFav(state.key);
  else if (e.key === ' ') spaceTap();
  else nextWallpaper();
});

/* ─── init ─── */

let saved: WallsDoc | null = null;
try { saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { /* noop */ }
if (saved) setData(saved);
renderGrid();
renderFavs();
renderFilterButtons();
applyBackground();
highlightSafe();
pruneBlobs(state.list);
prefetchPool();

function reconcileFavs(): void {
  function add(s: { favs?: string[] }): void { keepFavs(s.favs || []); }
  let lsWalls: { favs?: string[] } | null = null;
  let lsApp: { walls?: { favs?: string[] } } | null = null;
  try { lsWalls = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { /* noop */ }
  try { lsApp = JSON.parse(localStorage.getItem('glisters') || 'null'); } catch { /* noop */ }
  if (lsWalls) add(lsWalls);
  if (lsApp && lsApp.walls) add(lsApp.walls);
  if (window.chrome && chrome.storage && chrome.storage.local) {
    try {
      chrome.storage.local.get([LS_KEY, 'glisters'], function (o: { [key: string]: unknown }) {
        if (!o) return;
        if (o[LS_KEY]) add(o[LS_KEY] as { favs?: string[] });
        if (o['glisters'] && (o['glisters'] as { walls?: { favs?: string[] } }).walls) {
          add((o['glisters'] as { walls: { favs?: string[] } }).walls);
        }
        if (o[LS_KEY] && !JSON.parse(localStorage.getItem(LS_KEY) || 'null')) adopt(o[LS_KEY]);
      });
    } catch { /* noop */ }
  }
}
reconcileFavs();

setTimeout(function () {
  if (Date.now() - state.lastRefresh >= REFRESH_MS) refreshPool(true);
}, 1500);

/* ─── public API ─── */

window.WALLS = {
  bind: function (cb: () => void) { appCommit = cb; },
  forDoc: function () { return dataDoc(); },
  restore: function (d: unknown) {
    if (!d || typeof d !== 'object') return;
    adopt(d);
  },
  next: function () { return nextWallpaper(); },
  refresh: function () { return refreshPool(true); },
  reload: function () { return reload(); },
  filter: function (type: string, value: string) { return setFilter(type, value); },
  key: function (v: string) { return setKey(v); },
  fav: function () { return addFav(state.key); },
  favPool: function () { return favPool(); },
  setSafe: function () { return setSafe(); },
  applySafe: function () { return applySafe(); },
  download: function () { return downloadCurrent(); }
};

})();