/* ─── GlistersV2 — grid app ─── */

(function () {
'use strict';

const CF: Config = window.CONFIG || {};
const SYNC_ENABLED = !!(CF.gistId && CF.githubToken);

const STORE_KEY = 'glisters';
const SEED_FLAG_KEY = 'glisters-seed';
const SEED_VERSION = 2;

const DEFAULT_SITES: Site[] = [
  { name: 'Youtube', url: 'https://youtube.com', id: '' },
  { name: 'BlackFlag', url: 'https://docs.google.com/spreadsheets/d/177cnuV9QlHmO6bAGdO1xgN04xnQJCAuLOcj0ckmy4Yk/edit?gid=1167406126#gid=1167406126', id: '' },
  { name: 'Google Maps', url: 'https://maps.google.com/', id: '' },
  { name: 'Google Images', url: 'https://images.google.com/', id: '' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/', id: '' },
  { name: 'Google Drive', url: 'https://drive.google.com/drive/home', id: '' },
  { name: 'Tuta Mail', url: 'https://app.tuta.com/mail/Ohr3gNy--F-9', id: '' },
  { name: 'GitHub', url: 'https://github.com/FirozChauhan', id: '' },
  { name: 'Javascript Compiler', url: 'https://nextleap.app/online-compiler/javascript-programming', id: '' },
  { name: 'WhatsApp', url: 'https://web.whatsapp.com/', id: '' },
  { name: 'x.com', url: 'https://x.com/', id: '' },
  { name: 'ImageKit Dashboard', url: 'https://imagekit.io/dashboard/media-library/L0hBWkVM', id: '' },
  { name: 'Instagram', url: 'https://www.instagram.com/', id: '' },
  { name: 'Cloudflare R2', url: 'https://dash.cloudflare.com/a30112ac3e6966496265c81adcab8fcf/r2/default/buckets/jigar', id: '' },
  { name: 'FitGirl', url: 'https://fitgirl-repacks.site/', id: '' },
  { name: 'Pinterest', url: 'https://www.pinterest.com/', id: '' },
  { name: 'Wallhaven', url: 'https://wallhaven.cc/', id: '' },
  { name: 'Fast.com', url: 'https://fast.com/', id: '' },
  { name: 'Pirate Bay', url: 'https://thepiratebay.org', id: '' },
  { name: 'Amazon', url: 'http://amazon.in', id: '' },
  { name: 'Google Translate', url: 'https://translate.google.co.in/?sl=auto&tl=en&op=translate', id: '' },
  { name: 'Google Docs', url: 'http://docs.google.com', id: '' },
  { name: 'WordCounter', url: 'https://wordcounter.net/', id: '' },
  { name: 'AnkerGames', url: 'https://ankergames.net/', id: '' },
  { name: 'Render', url: 'https://dashboard.render.com/', id: '' },
  { name: 'Neon', url: 'https://console.neon.tech/app', id: '' },
  { name: 'Paletton', url: 'https://paletton.com/', id: '' },
  { name: 'GroqCloud', url: 'https://console.groq.com/home', id: '' },
  { name: 'Cloudinary', url: 'https://console.cloudinary.com/app', id: '' },
  { name: 'Gmail', url: 'https://mail.google.com/mail/u/3/#inbox', id: '' },
  { name: 'XXXClub', url: 'https://xxxclub.to/', id: '' },
  { name: 'RARBG', url: 'https://rargb.to/', id: '' },
  { name: 'NSFW - Google Drive', url: 'https://drive.google.com/drive/u/1/folders/14MIlVL7UX7k7pPItT6c0ovUzZai_oO15', id: '' },
  { name: 'DropMMS', url: 'https://dropmms.co/forum/2-desi-new-videos-hd-sd/', id: '' },
  { name: 'Masti Raja', url: 'https://mastiraja.com/', id: '' },
  { name: 'Reddit', url: 'http://www.reddit.com', id: '' },
  { name: 'PornPics', url: 'https://www.pornpics.com/', id: '' },
  { name: 'Emochi', url: 'https://emochi.com/', id: '' },
  { name: 'AI Character Editor', url: 'https://avakson.github.io/character-editor/', id: '' },
  { name: 'Elite Babes', url: 'https://www.elitebabes.com/', id: '' },
  { name: 'ViperGirls', url: 'https://viper.to/forum.php', id: '' },
  { name: 'character.ai', url: 'https://character.ai/', id: '' },
  { name: 'Chub AI', url: 'https://chub.ai/', id: '' },
  { name: 'Streamtape', url: 'https://streamtape.com/accpanel', id: '' },
  { name: 'EXT', url: 'https://ext.to/', id: '' },
  { name: 'cookii.ai', url: 'https://cookii.ai/', id: '' }
];

const DEFAULTS: SaveDoc = {
  version: SEED_VERSION,
  updatedAt: 0,
  sites: DEFAULT_SITES.slice(),
  settings: { iconSize: 68, colGap: 28, rowGap: 28, cols: 8, rows: 3, labels: false, labelOp: 100, labelColor: '#f5f5f5', bkWidth: 500, drWidth: 500, mono: false, wallMono: false, blur: 0 }
};

/* ─── constants ─── */

const GSTATIC = 'https://ssl.gstatic.com/images/branding/product/2x/';

const OFFICIAL_ICONS: Record<string, string> = {
  'mail.google.com': GSTATIC + 'gmail_2020q4_64dp.png',
  'drive.google.com': GSTATIC + 'drive_2020q4_64dp.png',
  'docs.google.com': GSTATIC + 'docs_2020q4_64dp.png',
  'sheets.google.com': GSTATIC + 'sheets_2020q4_64dp.png',
  'slides.google.com': GSTATIC + 'slides_2020q4_64dp.png',
  'calendar.google.com': GSTATIC + 'calendar_2020q4_64dp.png',
  'keep.google.com': GSTATIC + 'keep_2020q4_64dp.png',
  'meet.google.com': GSTATIC + 'meet_2020q4_64dp.png',
  'translate.google.co.in': 'https://www.google.com/s2/favicons?domain=translate.google.com&sz=128',
  'translate.google.com': 'https://www.google.com/s2/favicons?domain=translate.google.com&sz=128',
  'maps.google.com': 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=128',
  'youtube.com': 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
  'photos.google.com': 'https://www.google.com/s2/favicons?domain=photos.google.com&sz=128',
  'forms.google.com': 'https://www.google.com/s2/favicons?domain=forms.google.com&sz=128',
  'google.com': 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
  'chat.deepseek.com': 'https://fe-static.deepseek.com/chat/icon-180.png',
  'deepseek.com': 'https://fe-static.deepseek.com/chat/icon-180.png'
};

const TITLE_CASE: Record<string, string> = {
  'chat.deepseek.com': 'DeepSeek',
  'web.whatsapp.com': 'WhatsApp',
  'imagekit.io': 'ImageKit',
  'app.tuta.com': 'Tuta Mail',
  'console.groq.com': 'Groq',
  'console.neon.tech': 'Neon',
  'dashboard.render.com': 'Render',
  'ankergames.net': 'Anker Games',
  'paletton.com': 'Paletton',
  'wallhaven.cc': 'Wallhaven',
  'thepiratebay.org': 'Pirate Bay',
  'x.com': 'X',
  'mail.google.com': 'Gmail',
  'drive.google.com': 'Drive',
  'youtube.com': 'YouTube',
  'github.com': 'GitHub',
  'translate.google.co.in': 'Translate',
  'amazon.in': 'Amazon'
};

/* ─── boot state ─── */

let saved: SaveDoc | null = null;
try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch { /* noop */ }
const needSeed = !saved || !saved.version || saved.version < SEED_VERSION;

let state: SaveDoc;
if (needSeed) {
  state = Object.assign({}, DEFAULTS);
  state.settings = Object.assign({}, DEFAULTS.settings);
  state.sites = DEFAULT_SITES.slice();
} else {
  state = normalize(saved) || Object.assign({}, DEFAULTS, { settings: Object.assign({}, DEFAULTS.settings), sites: DEFAULT_SITES.slice() });
}

let focused = -1;
let armed = -1;
let page = 0;
let armTimer: ReturnType<typeof setTimeout> | null = null;
let cloudTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let settingTimer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;
let seededFromLinks = false;
{
  let v: string | null = null;
  try { v = localStorage.getItem(SEED_FLAG_KEY); } catch { /* noop */ }
  seededFromLinks = v === '1';
}
let mode: 'none' | 'drawer' | 'modal' | 'bar' = 'none';

/* ─── DOM refs ─── */

function $(s: string): HTMLElement | null { return document.querySelector(s); }
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const grid = $('#grid') as HTMLElement | null;
const empty = $('#empty') as HTMLElement | null;
const scrollArea = $('#scroll') as HTMLElement | null;
const bar = $('#bar') as HTMLElement | null;
const barInput = $('#barInput') as HTMLInputElement | null;
const drawer = $('#drawer') as HTMLElement | null;
const scrim = $('#scrim') as HTMLElement | null;
const modalEl = $('#modal') as HTMLElement | null;
const form = $('#siteForm') as HTMLElement | null;
const nameIn = $('#siteName') as HTMLInputElement | null;
const urlIn = $('#siteUrl') as HTMLInputElement | null;
const modalTitle = $('#modalTitle') as HTMLElement | null;
const settingsBtn = $('#settingsBtn') as HTMLElement | null;
const drawerClose = $('#drawerClose') as HTMLElement | null;
const drawerBody = $('#drawerBody') as HTMLElement | null;
const iconPicker = $('#iconPicker') as HTMLElement | null;
const metaStatus = $('#metaStatus') as HTMLElement | null;
const syncNow = $('#syncNow') as HTMLElement | null;
const resetSettings = $('#resetSettings') as HTMLElement | null;
const emptyAdd = $('#emptyAdd') as HTMLElement | null;

/* ─── state helpers ─── */

function readLocal(): SaveDoc | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function prettyBase(hostname: string): string {
  const parts = hostname.split('.');
  const base = parts.length > 2 ? parts[parts.length - 2] : parts[0];
  return (base.charAt(0).toUpperCase() + base.slice(1)).replace(/-/g, ' ');
}

function nameForUrl(raw: string): string {
  let u: URL;
  try { u = new URL(raw); } catch { return raw; }
  const h = u.hostname.replace(/^www\./, '');
  const path = u.pathname || '';

  if (h === 'docs.google.com') {
    return path.indexOf('/spreadsheets') !== -1 ? 'Sheets' : 'Docs';
  }
  if (h === 'google.com') {
    if (path.indexOf('/maps') !== -1) return 'Maps';
    return 'Google';
  }
  return TITLE_CASE[h] || prettyBase(h);
}

function parseLinks(text: string): Site[] {
  const seen: Record<string, number> = {};
  const out: Site[] = [];
  String(text).split(/\r?\n/).forEach(function (line: string) {
    const url = line.trim();
    if (!url) return;
    let name = nameForUrl(url);
    const key = name.toLowerCase();
    if (seen[key]) {
      seen[key]++;
      name = name + ' ' + seen[key];
    } else {
      seen[key] = 1;
    }
    out.push({ id: uid(), name: name, url: url });
  });
  return out;
}

function loadSeed(): Promise<SaveDoc> {
  return fetch('default-save.json', { cache: 'no-store' })
    .then(function (r: Response) {
      if (!r.ok) throw new Error('default-save.json: ' + r.status);
      return r.json();
    })
    .then(function (doc: SaveDoc) {
      const s = normalize(doc);
      if (!s || !Array.isArray(s.sites) || !s.sites.length) throw new Error('default-save.json: empty');
      return s;
    })
    .catch(function () {
      return fetch('links.txt', { cache: 'no-store' })
        .then(function (r: Response) {
          if (!r.ok) throw new Error('links.txt: ' + r.status);
          return r.text();
        })
        .then(function (text: string) {
          const links = parseLinks(text);
          if (!links.length) throw new Error('links.txt: empty');
          return { version: SEED_VERSION, updatedAt: 0, sites: links, settings: Object.assign({}, DEFAULTS.settings) } as SaveDoc;
        });
    });
}

function normalize(o: unknown): SaveDoc | null {
  if (!o || typeof o !== 'object') return null;
  const obj = o as Record<string, unknown>;
  const d = DEFAULTS.settings;
  const s: Settings = {} as Settings;
  if (obj.settings && typeof obj.settings === 'object') {
    const st = obj.settings as Record<string, unknown>;
    (['iconSize', 'colGap', 'rowGap', 'cols', 'rows', 'bkWidth', 'drWidth', 'blur', 'labelOp'] as const).forEach(function (k) {
      const v = st[k] as number;
      (s as unknown as Record<string, number>)[k] = (typeof v === 'number' && isFinite(v) ? v : (d as unknown as Record<string, number>)[k]);
    });
    s.labels = st.labels === true;
    s.labelColor = typeof st.labelColor === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(st.labelColor as string)
      ? (st.labelColor as string) : d.labelColor;
    s.mono = st.mono === true;
    s.wallMono = st.wallMono === true;
  } else {
    Object.assign(s, d);
  }
  const sites = Array.isArray(obj.sites)
    ? (obj.sites as Record<string, unknown>[]).filter(function (t) {
        return t && typeof t.name === 'string' && typeof t.url === 'string';
      }).map(function (t) {
        return {
          id: (t.id as string) || uid(),
          name: String(t.name).slice(0, 300),
          url: String(t.url).slice(0, 4096),
          icon: typeof t.icon === 'string' && /^https?:\/\//i.test(t.icon)
            ? (t.icon as string).slice(0, 4096) : undefined
        } as Site;
      })
    : [];
  return {
    version: SEED_VERSION,
    updatedAt: typeof obj.updatedAt === 'number' ? obj.updatedAt : 0,
    sites: sites,
    settings: s,
    bookmarks: (obj.bookmarks && typeof obj.bookmarks === 'object') ? obj.bookmarks : null,
    walls: (obj.walls && typeof obj.walls === 'object') ? obj.walls : null
  } as SaveDoc;
}

function doc(): SaveDoc {
  const d: SaveDoc = { version: SEED_VERSION, updatedAt: state.updatedAt, sites: state.sites, settings: state.settings };
  const bm = window.BOOKMARKS ? window.BOOKMARKS.forDoc() : null;
  if (bm) d.bookmarks = bm;
  if (window.WALLS) d.walls = window.WALLS.forDoc();
  return d;
}

function persistLocal(): void {
  const d = doc();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch { /* quota */ }
  if (window.chrome && chrome.storage && chrome.storage.local) {
    const o: Record<string, unknown> = {};
    o[STORE_KEY] = d;
    try { chrome.storage.local.set(o); } catch { /* noop */ }
  }
}

function restoreFromStorage(): Promise<SaveDoc | null> {
  return new Promise(function (resolve) {
    if (!(window.chrome && chrome.storage && chrome.storage.local)) { resolve(null); return; }
    try {
      chrome.storage.local.get(STORE_KEY, function (o: { [key: string]: unknown }) {
        try { resolve((o && (o[STORE_KEY] as SaveDoc)) || null); } catch { resolve(null); }
      });
    } catch { resolve(null); }
  });
}

function commit(opts?: CommitOptions): void {
  state.updatedAt = Date.now();
  if (!opts || !opts.noRender) renderAll();
  persistLocal();
  if (!opts || !opts.noCloud) scheduleCloud();
}

function mutateSite(fn: () => void): void {
  fn();
  state.updatedAt = Date.now();
  commit();
}

/* ─── render ─── */

function applyCssVars(): void {
  if (!grid) return;
  const s = state.settings;
  grid.style.setProperty('--ts', s.iconSize + 'px');
  grid.style.setProperty('--colgap', s.colGap + 'px');
  grid.style.setProperty('--rowgap', s.rowGap + 'px');
  document.documentElement.style.setProperty('--bk-width', (s.bkWidth || 400) + 'px');
  document.documentElement.style.setProperty('--dr-width', (s.drWidth || 400) + 'px');
  grid.style.setProperty('--cols', String(s.cols));
  grid.style.gridAutoRows = (s.iconSize + (s.labels ? 24 : 0)) + 'px';
  if (s.labels) grid.classList.remove('tile-label-off');
  else grid.classList.add('tile-label-off');
  grid.style.setProperty('--label-op', ((s.labelOp == null ? 100 : s.labelOp) / 100).toFixed(2));
  grid.style.setProperty('--label-color', s.labelColor || '#f5f5f5');
  grid.classList.toggle('tile-mono', s.mono === true);
  document.documentElement.style.setProperty('--wall-blur', (s.blur || 0) + 'px');
  document.documentElement.classList.toggle('wall-mono', s.wallMono === true);
}

function initials(name: string): string {
  const w = String(name).trim().split(/\s+/).filter(Boolean);
  return (w.slice(0, 2).map(function (x) { return x[0]; }).join('') || '?').toUpperCase();
}

function hostOf(url: string): string {
  try { return new URL(url).hostname; } catch { return ''; }
}

function officialIcon(url: string): string | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const h = u.hostname.replace(/^www\./, '').toLowerCase();
  const p = u.pathname || '';
  if (h === 'google.com') {
    if (p.indexOf('/maps') === 0) return OFFICIAL_ICONS['maps.google.com'];
    if (p.indexOf('/translate') === 0) return OFFICIAL_ICONS['translate.google.com'];
    if (p.indexOf('/calendar') === 0) return OFFICIAL_ICONS['calendar.google.com'];
    if (p.indexOf('/drive') === 0) return OFFICIAL_ICONS['drive.google.com'];
    if (p.indexOf('/photos') === 0) return OFFICIAL_ICONS['photos.google.com'];
    if (p.indexOf('/gmail') === 0 || p.indexOf('/mail') === 0) return OFFICIAL_ICONS['mail.google.com'];
    if (p.indexOf('/keep') === 0) return OFFICIAL_ICONS['keep.google.com'];
    if (p.indexOf('/meet') === 0) return OFFICIAL_ICONS['meet.google.com'];
    if (p.indexOf('/forms') === 0) return OFFICIAL_ICONS['forms.google.com'];
    if (p.indexOf('/sheets') === 0) return OFFICIAL_ICONS['sheets.google.com'];
    if (p.indexOf('/slides') === 0) return OFFICIAL_ICONS['slides.google.com'];
    if (p.indexOf('/docs') === 0) return OFFICIAL_ICONS['docs.google.com'];
    return OFFICIAL_ICONS['google.com'];
  }
  if (h === 'docs.google.com') {
    if (p.indexOf('/spreadsheets') === 0) return OFFICIAL_ICONS['sheets.google.com'];
    if (p.indexOf('/presentation') === 0) return OFFICIAL_ICONS['slides.google.com'];
    if (p.indexOf('/forms') === 0) return OFFICIAL_ICONS['forms.google.com'];
  }
  return OFFICIAL_ICONS[h] || null;
}

function iconCandidates(site: Site, deep = false): IconCandidate[] {
  const h = hostOf(site.url);
  const cands: IconCandidate[] = [];
  if (site.icon) cands.push({ src: site.icon, preferred: true });
  if (!h) return cands;
  const first = officialIcon(site.url);
  if (first) cands.push({ src: first, preferred: true });
  // Fast, uniform primary source via Google's favicon CDN (loads in <300ms vs
  // the site's own apple-touch/favicon which are often slow or 404). Marked
  // preferred so the tile settles quickly and uniformly instead of a janky
  // staggered letter→icon pop-in. Only this lean set is requested up front so
  // the grid doesn't fire ~150 concurrent favicon requests (which queue behind
  // each other and contend with the wallpaper); the deeper site-specific
  // sources are tried on retry when s2 has no match.
  const s2url = function (d: string): string {
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(d) + '&sz=128';
  };
  cands.push({ src: s2url(h), preferred: true });
  // The site's own favicons are included as non-preferred fallbacks even on the
  // first pass, so sites Google's s2 CDN can't resolve (returns a tiny generic
  // globe that gets rejected) still get a real icon immediately instead of
  // waiting for the delayed deep retry. s2 stays preferred so fast-loading tiles
  // settle uniformly and these idle candidates are discarded once settled.
  cands.push({ src: 'https://' + h + '/apple-touch-icon.png', preferred: false });
  cands.push({ src: 'https://' + h + '/favicon.ico', preferred: false });
  if (deep) {
    cands.push({ src: 'https://' + h + '/favicon-32x32.png', preferred: false });
    const variants = [h];
    const parts = h.split('.');
    while (parts.length > 2) {
      parts.shift();
      variants.push(parts.join('.'));
    }
    for (let i = 1; i < variants.length; i++) {
      cands.push({ src: s2url(variants[i]), preferred: false, chip: true });
    }
    cands.push({ src: 'https://icons.duckduckgo.com/ip3/' + encodeURIComponent(h) + '.ico', preferred: false });
  }
  return cands;
}

/* ─── favicon system ─── */

const ICON_CACHE_KEY = 'glisters-icons';
const faviconCache: Record<string, HTMLElement | false> = Object.create(null);
const iconLoading: Record<string, boolean> = Object.create(null);
const persistedIcons: Record<string, string> = Object.create(null);
const iconRetries: Record<string, number> = Object.create(null);
let iconPersistTimer: ReturnType<typeof setTimeout> | null = null;
// When 1 (set by retryIcon), tileEl builds the deeper site-specific candidate
// set so a site Google s2 can't find still gets a chance via its own favicon.
let iconDeep = false;

function loadPersistedIcons(): void {
  try {
    const raw = localStorage.getItem(ICON_CACHE_KEY);
    if (raw) {
      const m = JSON.parse(raw) as Record<string, unknown>;
      for (const k in m) if (typeof m[k] === 'string') persistedIcons[k] = m[k] as string;
    }
  } catch { /* fresh profile */ }
  if (window.chrome && chrome.storage && chrome.storage.local) {
    try {
      chrome.storage.local.get(ICON_CACHE_KEY, function (o: { [key: string]: unknown }) {
        const m = o && (o[ICON_CACHE_KEY] as Record<string, unknown>);
        if (m && typeof m === 'object') {
          for (const k2 in m) if (typeof m[k2] === 'string') persistedIcons[k2] = m[k2] as string;
        }
      });
    } catch { /* noop */ }
  }
}
/* ─── favicon loading ─── */

function persistIcon(key: string, src: string): void {
  if (!key || !src) return;
  persistedIcons[key] = src;
  if (iconPersistTimer) clearTimeout(iconPersistTimer);
  iconPersistTimer = setTimeout(function () {
    try { localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(persistedIcons)); } catch { /* quota */ }
    if (window.chrome && chrome.storage && chrome.storage.local) {
      try {
        const o: Record<string, unknown> = {};
        o[ICON_CACHE_KEY] = persistedIcons;
        chrome.storage.local.set(o);
      } catch { /* noop */ }
    }
  }, 400);
}

function scheduleIconRetry(key: string): void {
  if (!key || mode !== 'none' || dragUi) return;
  const n = (iconRetries[key] || 0) + 1;
  iconRetries[key] = n;
  if (n > 5) return;
  setTimeout(function () { retryIcon(key); }, n * 5000);
}

function retryIcon(key: string): void {
  if (faviconCache[key] !== false || mode !== 'none' || dragUi) return;
  delete faviconCache[key];
  iconDeep = true;
  for (let i = pageStart(); i <= pageEnd(); i++) {
    if (state.sites[i] && state.sites[i].url === key) {
      replaceTile(i);
      break;
    }
  }
  iconDeep = false;
}

function replaceTile(idx: number): void {
  if (!grid) return;
  const b = grid.querySelector('[data-idx="' + idx + '"]');
  if (!b) return;
  const nb = tileEl(state.sites[idx], idx);
  b.parentNode!.replaceChild(nb, b);
  renderTileStates();
}

function retryAllFailed(): void {
  if (mode !== 'none' || dragUi) return;
  let any = false;
  for (const k in faviconCache) {
    if (faviconCache[k] === false) { delete faviconCache[k]; any = true; }
  }
  if (any) renderGrid();
}

function loadIcon(ic: HTMLElement, letter: HTMLElement | null, cands: IconCandidate[], key: string, onFail?: () => void): void {
  let bestImg: HTMLImageElement | null = null;
  let bestW = 0;
  let settled = false;
  const guard = cands.length ? setTimeout(finalize, 6000) : 0;
  let hasPreferred = false;
  for (let p = 0; p < cands.length; p++) { if (cands[p].preferred) { hasPreferred = true; break; } }

  for (let i = 0; i < cands.length; i++) trySrc(cands[i].src, cands[i].preferred, !!cands[i].chip);

  function finalize(): void {
    if (settled) return;
    settled = true;
    if (guard) clearTimeout(guard);
    if (key) iconLoading[key] = false;
    if (bestImg) {
      const kids = Array.prototype.slice.call(ic.children);
      for (let k = 0; k < kids.length; k++) {
        if (kids[k].tagName === 'IMG' && kids[k] !== bestImg) ic.removeChild(kids[k]);
      }
      bestImg.classList.add('loaded');
      if (letter) {
        letter.classList.add('out');
        setTimeout(function () { letter.style.display = 'none'; }, 230);
      }
      const nw = bestImg.naturalWidth, nh = bestImg.naturalHeight;
      if (nw > 0 && nw < 40) {
        const cap = Math.floor(ic.offsetWidth * 0.55);
        let scale = 1;
        while (nw * (scale + 1) <= cap && nh * (scale + 1) <= cap) scale++;
        if (scale > 1) bestImg.classList.add('sharp');
        bestImg.style.width = (nw * scale) + 'px';
        bestImg.style.height = (nh * scale) + 'px';
      }
      if (key) {
        faviconCache[key] = bestImg;
        if (bestImg.src) persistIcon(key, bestImg.src);
      }
    } else if (key) {
      faviconCache[key] = false;
      scheduleIconRetry(key);
      if (onFail) onFail();
    }
  }

  function allDone(): void {
    const kids = ic.children;
    for (let k = 0; k < kids.length; k++) {
      if (kids[k].tagName === 'IMG' && !(kids[k] as HTMLImageElement & { _done?: boolean })._done) return;
    }
    finalize();
  }

  function trySrc(src: string, preferred: boolean, chip: boolean): void {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    let done = false;
    const idle = setTimeout(function () {
      if (done || settled) return;
      done = true;
      (img as HTMLImageElement & { _done: boolean })._done = true;
      if (img.parentNode) img.remove();
      allDone();
    }, 4000);
    img.addEventListener('load', function () {
      if (done || settled) return;
      done = true;
      (img as HTMLImageElement & { _done: boolean })._done = true;
      clearTimeout(idle);
      const w = img.naturalWidth, h = img.naturalHeight;
      if (w < 16 || h < 16 || (chip && w <= 16)) {
        if (img.parentNode) img.remove();
        allDone();
        return;
      }
      if (preferred) {
        bestW = w; bestImg = img;
        finalize();
        return;
      }
      if (w > bestW) { bestW = w; bestImg = img; }
      if (w >= 128 && !hasPreferred) finalize();
      else allDone();
    });
    img.addEventListener('error', function () {
      if (done || settled) return;
      done = true;
      (img as HTMLImageElement & { _done: boolean })._done = true;
      clearTimeout(idle);
      if (img.parentNode) img.remove();
      allDone();
    });
    ic.appendChild(img);
  }
}

function tileEl(site: Site, i: number): HTMLElement {
  const b = el('button', 'tile');
  b.type = 'button';
  b.dataset.idx = String(i);
  b.title = site.name + ' — ' + site.url;
  b.draggable = false;

  const ic = el('span', 'icon');
  const letter = el('span', 'letter', initials(site.name));
  ic.appendChild(letter);

  const key = site.url;
  const cached = faviconCache[key];
  if (cached) {
    const img = cached.cloneNode(false) as HTMLImageElement;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.classList.add('loaded');
    ic.appendChild(img);
    if (letter) {
      letter.classList.add('out');
      setTimeout(function () { letter.style.display = 'none'; }, 230);
    }
  } else if (cached === undefined && !iconLoading[key]) {
    iconLoading[key] = true;
    if (persistedIcons[key] && !site.icon) {
      loadIcon(ic, letter, [{ src: persistedIcons[key], preferred: true }], key, function () {
        delete persistedIcons[key];
        delete faviconCache[key];
        for (let i = pageStart(); i <= pageEnd(); i++) {
          if (state.sites[i] && state.sites[i].url === key) { replaceTile(i); break; }
        }
      });
    } else {
      const cands = iconCandidates(site, iconDeep);
      if (cands.length) loadIcon(ic, letter, cands, key);
    }
  }

  const editBtn = el('span', 'ctx-btn ctx-edit');
  editBtn.setAttribute('role', 'button');
  editBtn.setAttribute('aria-label', 'edit ' + site.name);
  editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
  editBtn.addEventListener('click', function (ev: Event) {
    ev.stopPropagation();
    const idx = state.sites.indexOf(site);
    closeCtx();
    if (idx >= 0) {
      const t = grid!.querySelector('[data-idx="' + idx + '"]');
      if (t) t.classList.add('ctx-dim');
    }
    openModal(site);
  });
  const delBtn = el('span', 'ctx-btn ctx-delete');
  delBtn.setAttribute('role', 'button');
  delBtn.setAttribute('aria-label', 'delete ' + site.name);
  delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  delBtn.addEventListener('click', function (ev: Event) {
    ev.stopPropagation();
    closeCtx();
    const idx = state.sites.indexOf(site);
    if (idx >= 0) removeSite(idx);
  });
  ic.appendChild(editBtn);
  ic.appendChild(delBtn);

  b.appendChild(ic);
  b.appendChild(el('span', 'label', site.name));
  return b;
}

function renderGrid(): void {
  if (!grid) return;
  grid.innerHTML = '';
  if (state.sites.length === 0) return;
  const start = pageStart();
  const end = pageEnd();
  const cap = cellCapacity();
  for (let i = start; i <= end; i++) {
    grid.appendChild(tileEl(state.sites[i], i));
  }
  for (let j = end - start + 1; j < cap; j++) {
    grid.appendChild(el('div', 'cell-empty'));
  }
}

function renderTileStates(): void {
  if (!grid) return;
  const kids = grid.children;
  for (let i = 0; i < kids.length; i++) {
    const t = kids[i] as HTMLElement;
    const ix = parseInt(t.dataset.idx || '', 10);
    t.classList.toggle('focused', ix === focused);
    t.classList.toggle('armed', ix === armed);
  }
}

function updateEmpty(): void {
  if (!grid || !empty) return;
  const has = state.sites.length > 0;
  empty.hidden = has;
  grid.style.display = has ? '' : 'none';
}

/* ─── pagination ─── */

function cellCapacity(): number {
  return Math.max(1, state.settings.cols * state.settings.rows);
}

function pageCount(): number {
  return Math.max(1, Math.ceil(state.sites.length / cellCapacity()));
}

function pageStart(): number {
  return page * cellCapacity();
}

function pageEnd(): number {
  const end = pageStart() + cellCapacity() - 1;
  return Math.min(end, state.sites.length - 1);
}

function clampPage(): void {
  if (state.sites.length === 0) page = 0;
  else page = Math.max(0, Math.min(page, pageCount() - 1));
}

let pageGhost: HTMLElement | null = null;

function goPage(p: number): void {
  if (state.sites.length === 0) return;
  if (!grid || !scrollArea) return;
  const pc = pageCount();
  const np = ((p % pc) + pc) % pc;
  if (np === page) return;
  const dir = p > page ? 1 : -1;
  page = np;
  focused = pageStart();
  animatePage(dir);
  renderGrid();
  renderTileStates();
}

function animatePage(dir: number): void {
  if (!grid || !scrollArea) return;
  grid.classList.remove('anim-next', 'anim-prev', 'anim-reorder');
  if (pageGhost) { pageGhost.remove(); pageGhost = null; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ghost = grid.cloneNode(true) as HTMLElement;
  ghost.classList.remove('anim-next', 'anim-prev', 'anim-reorder', 'dragging-active');
  ghost.classList.add('page-snapshot', dir > 0 ? 'page-out-next' : 'page-out-prev');
  const r = grid.getBoundingClientRect();
  const sr = scrollArea.getBoundingClientRect();
  ghost.style.position = 'absolute';
  ghost.style.left = (r.left - sr.left + scrollArea.scrollLeft) + 'px';
  ghost.style.top = (r.top - sr.top + scrollArea.scrollTop) + 'px';
  ghost.style.width = r.width + 'px';
  ghost.style.margin = '0';
  scrollArea.appendChild(ghost);
  pageGhost = ghost;

  function drop(): void {
    if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    if (pageGhost === ghost) pageGhost = null;
  }
  ghost.addEventListener('animationend', drop, { once: true });
  setTimeout(drop, 600);

  void grid.offsetWidth;
  grid.classList.add(dir > 0 ? 'anim-next' : 'anim-prev');
}

function renderAll(): void {
  clampPage();
  if (state.sites.length === 0) {
    focused = -1;
  } else {
    if (focused < pageStart()) focused = pageStart();
    if (focused > pageEnd()) focused = pageEnd();
  }
  applyCssVars();
  renderGrid();
  updateEmpty();
  renderTileStates();
  if (drawer && drawer.classList.contains('open')) syncDrawerDisplay();
}

function setFocused(i: number): void {
  armed = -1;
  if (armTimer) clearTimeout(armTimer);
  focused = i;
  renderTileStates();
}

/* ─── nav ─── */

function normUrl(url: string): string {
  const u = String(url).trim();
  if (!u) return '';
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return 'https://' + u;
  const scheme = u.slice(0, u.indexOf(':')).toLowerCase();
  if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') return u;
  return '';
}

function openInNewTab(url: string): void {
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: url, active: false });
      return;
    }
  } catch { /* fall through */ }
  try {
    const w = window.open(url, '_blank', 'noopener');
    if (!w) location.assign(url);
  } catch { location.assign(url); }
}

function openInSameTab(url: string): void {
  try { location.assign(url); } catch { /* noop */ }
}

function open(i: number, opts?: { newTab?: boolean }): void {
  const n = state.sites.length;
  if (n === 0 || i >= n) { openModal(null); return; }
  const url = normUrl(state.sites[i].url);
  if (!url) return;
  if (opts && opts.newTab) openInNewTab(url);
  else openInSameTab(url);
}

function moveV(d: number, cols: number): void {
  if (focused < 0) { focused = pageStart(); return; }
  const start = pageStart();
  const end = pageEnd();
  if (end < start) return;
  const i = focused + d * cols;
  focused = i < start ? start : i > end ? end : i;
}

function removeSite(i: number): void {
  if (i < 0 || i >= state.sites.length) return;
  mutateSite(function () { state.sites.splice(i, 1); });
  armed = -1;
  if (focused >= state.sites.length) focused = state.sites.length - 1;
  if (focused < 0) focused = -1;
}

/* ─── keys ─── */

document.addEventListener('keydown', function (e: KeyboardEvent) {
  if (e.defaultPrevented) return;

  if ((e.key === 'Enter' || e.key === 'o') && (e.ctrlKey || e.metaKey) &&
      mode === 'none' && focused >= 0) {
    const t = e.target as HTMLElement;
    if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA' &&
        t.tagName !== 'SELECT' && !t.isContentEditable) {
      open(focused, { newTab: true });
      e.preventDefault();
      return;
    }
  }

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (mode === 'modal') {
    if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
    return;
  }

  if (mode === 'bar') {
    if (e.key === 'Escape') { closeBar(); e.preventDefault(); }
    return;
  }

  const t = e.target as HTMLElement;
  const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
    t.tagName === 'SELECT' || t.isContentEditable;
  if (typing) return;

  if (mode === 'drawer') {
    if (e.key === 'Escape' || e.key === 's') { closeDrawer(); e.preventDefault(); }
    return;
  }

  if (grid) grid.classList.remove('mouse-nav');

  const n = state.sites.length;
  const cols = state.settings.cols;
  const pStart = pageStart();
  const pEnd = pageEnd();
  let handled = true;

  switch (e.key) {
    case 'h': case 'ArrowLeft':
      if (focused < 0) focused = pStart;
      else if (focused % cols > 0 && focused > pStart) focused--;
      break;
    case 'l': case 'ArrowRight':
      if (focused < 0) focused = pStart;
      else if (focused % cols < cols - 1 && focused < pEnd) focused++;
      break;
    case 'j': case 'ArrowDown': moveV(1, cols); break;
    case 'k': case 'ArrowUp': moveV(-1, cols); break;
    case 'g': focused = pStart; break;
    case 'G': case 'End': focused = pEnd; break;
    case 'Home': focused = pStart; break;
    case 'Tab':
      e.preventDefault();
      goPage(e.shiftKey ? page - 1 : page + 1);
      break;
    case 'PageDown':
      e.preventDefault();
      goPage(page + 1);
      break;
    case 'PageUp':
      e.preventDefault();
      goPage(page - 1);
      break;
    case 'Enter': case 'o':
      if (focused < 0) focused = pStart;
      open(focused);
      break;
    case 'a': openModal(null); break;
    case 'e':
      if (focused >= 0 && focused < n) openModal(state.sites[focused]);
      break;
    case 'd':
      if (focused < 0 || focused >= n) break;
      if (armed === focused) { removeSite(focused); }
      else {
        armed = focused;
        if (armTimer) clearTimeout(armTimer);
        armTimer = setTimeout(function () { armed = -1; renderTileStates(); }, 2500);
        renderTileStates();
      }
      break;
    case 's': toggleDrawer(); break;
    case '/': case ':': openBar(); break;
    case 'Escape':
      if (armed >= 0) armed = -1;
      closeCtx();
      handled = true;
      break;
    default: handled = false;
  }

  if (handled) e.preventDefault();
  if (handled && e.key !== 'Escape' && e.key !== 's' && e.key !== 'a' && e.key !== 'd') {
    if (armTimer) clearTimeout(armTimer);
    armed = -1;
  }
  renderTileStates();
});

/* ─── mouse ─── */

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    if (dirty) pushCloud();
  }
});

let wheelLock = false;
if (scrollArea) {
  scrollArea.addEventListener('wheel', function (e: WheelEvent) {
    if (e.ctrlKey || mode !== 'none') return;
    e.preventDefault();
    if (wheelLock) return;
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (d === 0) return;
    wheelLock = true;
    setTimeout(function () { wheelLock = false; }, 180);
    goPage(page + (d > 0 ? 1 : -1));
  }, { passive: false });
}

if (grid) {
  grid.addEventListener('mouseover', function (e: MouseEvent) {
    const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
    if (b) {
      grid.classList.add('mouse-nav');
      setFocused(parseInt(b.dataset.idx || '', 10));
    }
  });

  grid.addEventListener('click', function (e: MouseEvent) {
    if (suppressClick) { suppressClick = false; return; }
    const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
    if (!b) return;
    open(parseInt(b.dataset.idx || '', 10), { newTab: e.ctrlKey || e.metaKey });
  });
}

/* ─── right-click context ─── */

function closeCtx(): void {
  const open = grid ? grid.querySelectorAll('.tile.ctx-open') : [];
  for (let i = 0; i < open.length; i++) open[i].classList.remove('ctx-open');
}

if (grid) {
  grid.addEventListener('contextmenu', function (e: MouseEvent) {
    const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
    if (!b) return;
    const idx = parseInt(b.dataset.idx || '', 10);
    if (idx < 0 || idx >= state.sites.length) return;
    e.preventDefault();
    closeCtx();
    setFocused(idx);
    b.classList.add('ctx-open');
  });
}

document.addEventListener('contextmenu', function (e: MouseEvent) {
  if ((e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.tile')) return;
  closeCtx();
});

document.addEventListener('click', function (e: MouseEvent) {
  if ((e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.ctx-btn')) return;
  closeCtx();
});

document.addEventListener('click', function () {
  setTimeout(function () { suppressClick = false; }, 0);
}, true);

/* ─── drag to reorder ─── */

let dragFrom: number | null = null;
let dragUi: DragUi | null = null;
let suppressClick = false;
let autoFlipDir = 0;
let autoFlipTimer: ReturnType<typeof setInterval> | null = null;
let flipTimer: ReturnType<typeof setTimeout> | null = null;

function stopAutoFlip(): void {
  autoFlipDir = 0;
  if (autoFlipTimer) { clearInterval(autoFlipTimer); autoFlipTimer = null; }
}

function armAutoFlip(x: number, y: number): void {
  if (!scrollArea) { stopAutoFlip(); return; }
  const r = scrollArea.getBoundingClientRect();
  if (y < r.top || y > r.bottom) { stopAutoFlip(); return; }
  let dir = 0;
  if (x < r.left + 70) dir = -1;
  else if (x > r.right - 70) dir = 1;
  if (dir === autoFlipDir) return;
  autoFlipDir = dir;
  if (autoFlipTimer) { clearInterval(autoFlipTimer); autoFlipTimer = null; }
  if (dir) {
    autoFlipTimer = setInterval(function () {
      if (autoFlipDir) goPage(page + autoFlipDir);
    }, 480);
  }
}

function snapRects(): { node: HTMLElement; rect: DOMRect }[] {
  if (!grid) return [];
  const kids = grid.children;
  const out: { node: HTMLElement; rect: DOMRect }[] = [];
  for (let i = 0; i < kids.length; i++) {
    out.push({ node: kids[i] as HTMLElement, rect: kids[i].getBoundingClientRect() });
  }
  return out;
}

function flipFrom(captured: { node: HTMLElement; rect: DOMRect }[]): void {
  if (!grid) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const kids = grid.children;
  let moved = 0;
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i] as HTMLElement;
    let old: DOMRect | null = null;
    for (let k = 0; k < captured.length; k++) {
      if (captured[k].node === c) { old = captured[k].rect; break; }
    }
    if (!old) continue;
    const last = c.getBoundingClientRect();
    const dx = old.left - last.left;
    const dy = old.top - last.top;
    if (dx !== 0 || dy !== 0) {
      c.style.transition = 'none';
      c.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      moved++;
    }
  }
  if (!moved) return;
  void grid.offsetWidth;
  for (let j = 0; j < kids.length; j++) {
    const t = kids[j] as HTMLElement;
    if (t.style.transform) {
      t.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1)';
      t.style.transform = '';
    }
  }
  if (flipTimer) clearTimeout(flipTimer);
  flipTimer = setTimeout(function () {
    const k = grid.children;
    for (let n = 0; n < k.length; n++) {
      (k[n] as HTMLElement).style.transition = '';
      (k[n] as HTMLElement).style.transform = '';
    }
  }, 400);
}

function highlightDrop(b: HTMLElement | null): void {
  if (!grid) return;
  const tiles = grid.querySelectorAll('.tile.drop-target');
  for (let i = 0; i < tiles.length; i++) tiles[i].classList.remove('drop-target');
  if (dragUi && b) b.classList.add('drop-target');
}

function makeGhost(b: HTMLElement): HTMLElement {
  const g = b.cloneNode(true) as HTMLElement;
  g.removeAttribute('id');
  g.className = 'tile drag-ghost';
  g.style.width = b.offsetWidth + 'px';
  (['--ts', '--label-op', '--label-color'] as const).forEach(function (v) {
    g.style.setProperty(v, grid ? grid.style.getPropertyValue(v) : '');
  });
  document.body.appendChild(g);
  return g;
}

function cleanupDrag(): void {
  if (flipTimer) { clearTimeout(flipTimer); flipTimer = null; }
  if (dragUi && dragUi.ghost) dragUi.ghost.remove();
  dragUi = null;
  dragFrom = null;
  if (grid) grid.classList.remove('dragging-active');
  const d = grid ? grid.querySelectorAll('.tile.dragging') : [];
  for (let i = 0; i < d.length; i++) d[i].classList.remove('dragging');
  highlightDrop(null);
  stopAutoFlip();
}

function draggedNode(): HTMLElement | null {
  return dragFrom == null ? null : (grid ? grid.querySelector('[data-idx="' + dragFrom + '"]') : null);
}

function measureGrid(): GridMeasure | null {
  if (!grid) return null;
  const first = grid.querySelector('.tile') as HTMLElement | null;
  if (!first) return null;
  const r = first.getBoundingClientRect();
  const cs = getComputedStyle(grid);
  const cg = parseFloat(cs.columnGap) || 0;
  const rg = parseFloat(cs.rowGap) || 0;
  return {
    originX: r.left, originY: r.top,
    strideX: r.width + cg, strideY: r.height + rg,
    cols: Math.max(1, state.settings.cols), rows: Math.max(1, state.settings.rows)
  };
}

function slotAt(g: GridMeasure, x: number, y: number): number {
  let col = Math.round((x - g.originX) / g.strideX);
  let row = Math.round((y - g.originY) / g.strideY);
  col = Math.max(0, Math.min(col, g.cols - 1));
  row = Math.max(0, Math.min(row, g.rows - 1));
  return row * g.cols + col;
}

function inGridBounds(g: GridMeasure, x: number, y: number): boolean {
  const x0 = g.originX - g.strideX * 0.5;
  const x1 = g.originX + (g.cols - 1) * g.strideX + g.strideX * 0.5;
  const y0 = g.originY - g.strideY * 0.5;
  const y1 = g.originY + (g.rows - 1) * g.strideY + g.strideY * 0.5;
  return x >= x0 && x <= x1 && y >= y0 && y <= y1;
}

function reorderToSlot(slot: number): void {
  if (!grid) return;
  const src = draggedNode();
  if (!src) return;
  const kids = grid.children;
  const cap = Math.max(1, state.settings.cols * state.settings.rows);
  if (slot >= cap) slot = cap - 1;
  const cur = Array.prototype.indexOf.call(kids, src);
  if (cur === -1 || cur === slot) return;
  const idx = cur < slot ? slot + 1 : slot;
  const anchor = idx < kids.length ? kids[idx] : null;
  const rects = snapRects();
  grid.insertBefore(src, anchor);
  flipFrom(rects);
}

function undoLiveOrder(): void {
  if (!grid || !dragUi || !dragUi.orig || dragUi.orig.length < 2) return;
  const rects = snapRects();
  for (let i = 0; i < dragUi.orig.length; i++) {
    if (dragUi.orig[i].parentNode === grid) grid.appendChild(dragUi.orig[i]);
  }
  flipFrom(rects);
}

if (grid) {
  grid.addEventListener('pointerdown', function (e: PointerEvent) {
    if (e.button !== 0 || mode !== 'none') return;
    const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
    if (!b) return;
    dragFrom = parseInt(b.dataset.idx || '', 10);
    dragUi = {
      from: dragFrom,
      startX: e.clientX, startY: e.clientY,
      lastX: e.clientX, lastY: e.clientY,
      moved: false, ghost: null, page: page,
      geom: null, orig: null, lastSlot: -1, lastInGrid: false, pageChangedAt: 0
    };
  });
}

window.addEventListener('pointermove', function (e: PointerEvent) {
  if (!dragUi) return;
  const dx = e.clientX - dragUi.startX, dy = e.clientY - dragUi.startY;
  if (!dragUi.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
  if (!dragUi.moved) {
    dragUi.moved = true;
    e.preventDefault();
    if (grid) grid.classList.add('dragging-active');
    dragUi.geom = measureGrid();
    dragUi.orig = Array.prototype.slice.call(grid ? grid.children : []);
    const src = draggedNode();
    if (src) src.classList.add('dragging');
    dragUi.ghost = makeGhost(src || (e.target as HTMLElement).closest('.tile') as HTMLElement);
    dragUi.ghost!.style.transform = 'translate(' + (dragUi.startX + 12) + 'px,' + (dragUi.startY + 12) + 'px) scale(1.06)';
  }
  if (!dragUi.moved || !dragUi.geom) return;
  e.preventDefault();
  dragUi.lastX = e.clientX; dragUi.lastY = e.clientY;
  dragUi.ghost!.style.transform = 'translate(' + (e.clientX + 12) + 'px,' + (e.clientY + 12) + 'px) scale(1.06)';
  armAutoFlip(e.clientX, e.clientY);
  if (dragUi.page !== page) {
    dragUi.page = page;
    dragUi.pageChangedAt = Date.now();
    dragUi.geom = measureGrid();
    dragUi.orig = Array.prototype.slice.call(grid ? grid.children : []);
    dragUi.lastSlot = -1;
    const fresh = draggedNode();
    if (fresh) fresh.classList.add('dragging');
  }
  const g = dragUi.geom;
  if (!g) return;
  const inGrid = inGridBounds(g, e.clientX, e.clientY);
  dragUi.lastInGrid = inGrid;
  if (inGrid) {
    const slot = slotAt(g, e.clientX, e.clientY);
    dragUi.lastSlot = slot;
    const kids = grid ? grid.children : [];
    const b = kids[slot] && (kids[slot] as HTMLElement).classList.contains('tile')
      ? kids[slot] as HTMLElement : null;
    highlightDrop(b);
    if (Date.now() - dragUi.pageChangedAt > 380) reorderToSlot(slot);
  } else {
    highlightDrop(null);
  }
});

window.addEventListener('pointerup', function (e: PointerEvent) {
  if (!dragUi) return;
  const moved = dragUi.moved;
  if (moved) {
    e.preventDefault();
    stopAutoFlip();
    suppressClick = true;
    const g = dragUi.geom;
    const inGrid = g && inGridBounds(g, e.clientX, e.clientY);
    if (g && inGrid) {
      const slot = slotAt(g, e.clientX, e.clientY);
      let to = pageStart() + slot;
      if (to > state.sites.length) to = state.sites.length;
      if (to !== dragFrom) {
        const arr = state.sites.slice();
        const movedSite = arr.splice(dragFrom!, 1)[0];
        arr.splice(to, 0, movedSite);
        mutateSite(function () { state.sites = arr; });
        focused = to;
        renderTileStates();
      }
    } else {
      undoLiveOrder();
    }
  }
  cleanupDrag();
});

window.addEventListener('pointercancel', function () {
  if (dragUi && dragUi.moved) undoLiveOrder();
  cleanupDrag();
});

/* ─── modal ─── */

let editingIdx = -1;
let pickedIcon = '';
let lastAutoName = '';
let metaTimer: ReturnType<typeof setTimeout> | null = null;
const metaCache: Record<string, MetaInfo> = Object.create(null);
const metaIcons: Record<string, string[]> = Object.create(null);
const META_MAX = 4 * 1024 * 1024;

function openModal(site: Site | null): void {
  armed = -1;
  if (armTimer) clearTimeout(armTimer);
  editingIdx = site ? state.sites.indexOf(site) : -1;
  if (nameIn) nameIn.value = site ? site.name : '';
  if (urlIn) urlIn.value = site ? site.url : '';
  if (modalTitle) modalTitle.textContent = site ? 'edit shortcut' : 'add shortcut';
  pickedIcon = site && site.icon ? site.icon : '';
  lastAutoName = '';
  if (modalEl) modalEl.hidden = false;
  mode = 'modal';
  renderIconPicker(urlIn ? urlIn.value : '', pickedIcon);
  scheduleMetaDetect();
  if (site && site.name && urlIn) urlIn.focus();
  else if (nameIn) nameIn.focus();
}

function closeModal(): void {
  if (modalEl) modalEl.hidden = true;
  mode = 'none';
  editingIdx = -1;
  pickedIcon = '';
  if (metaTimer) clearTimeout(metaTimer);
  if (iconPicker) iconPicker.innerHTML = '';
  if (metaStatus) metaStatus.hidden = true;
  const dim = grid ? grid.querySelectorAll('.tile.ctx-dim') : [];
  for (let i = 0; i < dim.length; i++) dim[i].classList.remove('ctx-dim');
}

if (nameIn) nameIn.addEventListener('input', function () { lastAutoName = ''; });
if (urlIn) urlIn.addEventListener('input', scheduleMetaDetect);

function scheduleMetaDetect(): void {
  if (metaTimer) clearTimeout(metaTimer);
  metaTimer = setTimeout(function () {
    renderIconPicker(urlIn ? urlIn.value : '', pickedIcon);
    detectMeta(urlIn ? urlIn.value : '');
  }, 400);
}

/* ─── icon picker ─── */

function renderIconPicker(rawUrl: string, selectedSrc: string): void {
  if (!iconPicker) return;
  iconPicker.innerHTML = '';
  const url = normUrl(rawUrl);
  iconPicker.appendChild(autoPickEl(selectedSrc === ''));
  if (!url) return;
  const seen: Record<string, boolean> = {};
  const cands = iconCandidates({ url: url, icon: '' } as Site);
  cands.forEach(function (c) { if (c.src) seen[c.src] = true; });
  (metaIcons[url] || []).forEach(function (src: string) {
    if (!src || seen[src]) return;
    seen[src] = true;
    cands.push({ src: src, preferred: false });
  });
  let shown = 0;
  for (let i = 0; i < cands.length && shown < 8; i++) {
    (function (src: string) {
      const b = el('button', 'pick-item');
      b.type = 'button';
      b.dataset.src = src;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', src === selectedSrc ? 'true' : 'false');
      b.title = src;
      const img = el('img');
      img.src = src;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      img.decoding = 'async';
      img.draggable = false;
      const failTimer = setTimeout(function () {
        if (b.parentNode) b.parentNode.removeChild(b);
      }, 6000);
      img.addEventListener('load', function () { clearTimeout(failTimer); });
      img.addEventListener('error', function () {
        clearTimeout(failTimer);
        if (b.parentNode) b.parentNode.removeChild(b);
      });
      b.appendChild(img);
      b.addEventListener('click', function () {
        selectPick(b, src);
      });
      if (src === selectedSrc) b.classList.add('selected');
      iconPicker.appendChild(b);
      shown++;
    })(cands[i].src);
  }
}

function autoPickEl(selected: boolean): HTMLElement {
  const b = el('button', 'pick-item pick-auto' + (selected ? ' selected' : ''));
  b.type = 'button';
  b.dataset.src = '';
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-checked', selected ? 'true' : 'false');
  b.title = 'auto-detect icon';
  b.appendChild(el('span', 'pick-letter', 'auto'));
  b.addEventListener('click', function () { selectPick(b, ''); });
  return b;
}

function selectPick(btn: HTMLElement, src: string): void {
  pickedIcon = src;
  const sels = iconPicker ? iconPicker.querySelectorAll('.pick-item.selected') : [];
  for (let i = 0; i < sels.length; i++) {
    sels[i].classList.remove('selected');
    sels[i].setAttribute('aria-checked', 'false');
  }
  btn.classList.add('selected');
  btn.setAttribute('aria-checked', 'true');
}

/* ─── title auto-detect ─── */

function detectMeta(raw: string): void {
  const url = normUrl(raw);
  if (!url || !/^https?:/i.test(url)) { if (metaStatus) metaStatus.hidden = true; return; }
  if (metaStatus) {
    metaStatus.hidden = false;
    metaStatus.textContent = 'detecting title…';
  }
  if (nameIn && !nameIn.value.trim()) {
    lastAutoName = nameForUrl(url);
    nameIn.value = lastAutoName;
  }
  if (metaCache[url]) {
    if (metaStatus) metaStatus.hidden = true;
    applyMeta(url, metaCache[url]);
    return;
  }
  fetchMeta(url).then(function (meta: MetaInfo | null) {
    if (metaStatus) metaStatus.hidden = true;
    if (!meta) return;
    metaCache[url] = meta;
    applyMeta(url, meta);
  }).catch(function () { if (metaStatus) metaStatus.hidden = true; });
}

function applyMeta(url: string, meta: MetaInfo): void {
  if (meta.title && nameIn && (!nameIn.value.trim() || nameIn.value === lastAutoName)) {
    lastAutoName = meta.title;
    nameIn.value = meta.title;
  }
  if (meta.icons && meta.icons.length) {
    metaIcons[url] = meta.icons;
    renderIconPicker(url, pickedIcon);
  }
}

function fetchMeta(url: string): Promise<MetaInfo | null> {
  const u = new URL(url);
  const cands: string[] = [];
  const tryH = [u.hostname, 'www.' + u.hostname];
  for (let i = 0; i < tryH.length; i++) {
    const proto = /^https:/.test(u.protocol) ? 'https' : 'http';
    cands.push(proto + '://' + tryH[i] + u.pathname);
    cands.push(proto + '://' + tryH[i] + '/');
  }
  let idx = 0;
  let signal: AbortSignal | null = null;
  try { signal = AbortSignal.timeout(6000); } catch { /* unsupported */ }
  return new Promise(function (resolve) {
    const next = function (): void {
      if (idx >= cands.length) { resolve(null); return; }
      const c = cands[idx++];
      fetch(c, { signal: signal || undefined })
        .then(function (r) {
          if (!r.ok) { next(); return null; }
          return r.text().then(function (t) {
            if (t.length > META_MAX) return null;
            return t;
          }).then(function (t) {
            if (!t) return null;
            const info = parseMetaHtml(t, url);
            if (info && (info.title || (info.icons && info.icons.length))) resolve(info);
            else { next(); }
            return null;
          });
        })
        .catch(function () { next(); });
    };
    next();
  });
}

function parseMetaHtml(html: string, url: string): MetaInfo | null {
  let doc: Document;
  try { doc = new DOMParser().parseFromString(html, 'text/html'); }
  catch { return null; }
  const m: MetaInfo = { title: '', icons: [] };
  const t = doc.querySelector('title');
  if (t && t.textContent) m.title = t.textContent.trim().slice(0, 200);

  const pickIcon = function (src: string): void {
    if (!src || m.icons.length >= 10) return;
    const abs = absUrl(src, url);
    if (!abs) return;
    m.icons.push(abs);
  };

  const iconEls = doc.querySelectorAll('link[rel~="icon"], link[rel~="shortcut"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
  for (let i = 0; i < iconEls.length; i++) {
    pickIcon((iconEls[i] as HTMLLinkElement).href || '');
  }
  if (!m.icons.length) {
    const og = doc.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
    if (og) pickIcon((og as HTMLMetaElement).content || '');
  }
  const apple = doc.querySelector('meta[name="apple-itunes-app"]');
  if (apple) {
    const mm = /app-id=(\d+)/.exec((apple as HTMLMetaElement).content || '');
    if (mm) {
      const u2 = new URL(url);
      pickIcon('https://' + u2.hostname + '/images/apple-touch-icon.png');
    }
  }
  if (!m.title && !m.icons.length) return null;
  return m;
}

function absUrl(src: string, base: string): string | null {
  try { return new URL(src, base).href; } catch { return null; }
}

/* ─── form ─── */

if (form) {
  form.addEventListener('submit', function (e: Event) {
    e.preventDefault();
    const name = nameIn ? nameIn.value.trim() : '';
    const raw = urlIn ? urlIn.value.trim() : '';
    if (!name || !raw) return;
    const url = normUrl(raw);
    if (!url) return;
    const site: Site = { id: editingIdx >= 0 && state.sites[editingIdx] ? state.sites[editingIdx].id || uid() : uid(), name: name, url: url };
    if (pickedIcon) site.icon = pickedIcon;
    if (editingIdx >= 0 && editingIdx < state.sites.length) {
      const cur = state.sites[editingIdx];
      const hadIcon = !!cur.icon;
      const keep = hadIcon && !pickedIcon && cur.url === site.url;
      if (keep) site.icon = cur.icon;
      state.sites[editingIdx] = site;
    } else {
      state.sites.push(site);
    }
    state.updatedAt = Date.now();
    commit();
    closeModal();
  });
}

if (settingsBtn) settingsBtn.addEventListener('click', function () { toggleDrawer(); });
if (emptyAdd) emptyAdd.addEventListener('click', function () { openModal(null); });
if (scrim) scrim.addEventListener('click', function () {
  if (mode === 'drawer') closeDrawer();
  else if (mode === 'modal') closeModal();
});
if (drawerClose) drawerClose.addEventListener('click', function () { closeDrawer(); });

/* settings section tabs — show only the selected group (like the original) */
const setNav = $('#setNav') as HTMLElement | null;
const setGroups = Array.prototype.slice.call(document.querySelectorAll('.set-group'));

function showGroup(name: string): void {
  for (let g = 0; g < setGroups.length; g++) {
    const grp = setGroups[g] as HTMLElement;
    grp.style.display = grp.id === 'grp-' + name ? '' : 'none';
  }
  const btns = setNav ? setNav.querySelectorAll('.set-nav-btn') : [];
  for (let b = 0; b < btns.length; b++) {
    const btn = btns[b] as HTMLElement;
    const on = btn.getAttribute('data-scroll') === name;
    btn.classList.toggle('active', on);
    if (on) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  }
}
if (setNav) setNav.addEventListener('click', function (e: Event) {
  const b = (e.target as HTMLElement).closest('.set-nav-btn');
  if (!b) return;
  showGroup(b.getAttribute('data-scroll') || 'layout');
});
showGroup('layout');
// Click-outside-to-close: tapping the empty page (outside the drawer and the
// settings toggle) closes the settings drawer, matching the bookmarks sidebar.
document.addEventListener('click', function (e: MouseEvent) {
  if (mode !== 'drawer' || !drawer) return;
  const t = e.target as HTMLElement | null;
  if (!t || !t.closest) return;
  if (drawer.contains(t)) return;
  if (settingsBtn && settingsBtn.contains(t)) return;
  closeDrawer();
}, true);
if (syncNow) syncNow.addEventListener('click', function () { pushCloud(); });
if (resetSettings) resetSettings.addEventListener('click', function () {
  if (!window.confirm('Reset all shortcuts and settings?')) return;
  state.sites = DEFAULT_SITES.slice();
  state.settings = Object.assign({}, DEFAULTS.settings);
  state.updatedAt = Date.now();
  commit();
  closeDrawer();
  if (window.WALLS) window.WALLS.applySafe();
});

if (scrim) {
  scrim.addEventListener('keydown', function (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (mode === 'drawer') closeDrawer();
      else if (mode === 'modal') closeModal();
    }
  });
}

/* ─── command palette ─── */

let barIdx = 0;
let barItems: (Site | string)[] = [];

function barResults(query: string): (Site | string)[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: (Site | string)[] = [];
  for (let i = 0; i < state.sites.length; i++) {
    const s = state.sites[i];
    if (s.name.toLowerCase().indexOf(q) !== -1 || s.url.toLowerCase().indexOf(q) !== -1) {
      out.push(s);
    }
  }
  const openers: string[] = [];
  if (/youtube|yt/.test(q)) openers.push('YouTube');
  if (/gmail|mail/.test(q)) openers.push('Gmail');
  if (/drive/.test(q)) openers.push('Google Drive');
  if (/docs|document/.test(q)) openers.push('Google Docs');
  if (/maps|map/.test(q)) openers.push('Google Maps');
  if (/translate/.test(q)) openers.push('Google Translate');
  if (/github/.test(q)) openers.push('GitHub');
  for (let k = 0; k < openers.length; k++) out.push(openers[k]);
  return out;
}

function renderBar(): void {
  if (!bar) return;
  const items = barResults(barInput ? barInput.value : '');
  barItems = items;
  const hasQuery = !!(barInput && barInput.value.trim());
  if (!hasQuery || !items.length) {
    if (barHint) barHint.textContent = hasQuery ? 'no matches' : 'search shortcuts';
    barIdx = 0;
    if (barList) barList.hidden = true;
    if (barInput) barInput.setAttribute('aria-expanded', 'false');
    return;
  }
  if (barList) {
    barList.hidden = false;
    barList.innerHTML = '';
    const max = Math.min(8, items.length);
    for (let i = 0; i < max; i++) {
      const item = items[i];
      const row = el('button', 'bar-row' + (i === barIdx ? ' bar-sel' : ''));
      row.type = 'button';
      if (typeof item === 'string') {
        row.dataset.kind = 'open';
        const ic = el('span', 'bar-glyph', '↗');
        const lbl = el('span', 'bar-label', item);
        const cmd = el('span', 'bar-cmd', 'open ' + item);
        row.appendChild(ic);
        row.appendChild(lbl);
        row.appendChild(cmd);
      } else {
        row.dataset.kind = 'site';
        row.dataset.idx = String(state.sites.indexOf(item));
        const ic = el('span', 'bar-glyph', '›');
        const lbl = el('span', 'bar-label', item.name);
        const cmd = el('span', 'bar-cmd', item.url);
        row.appendChild(ic);
        row.appendChild(lbl);
        row.appendChild(cmd);
      }
      row.addEventListener('click', function () {
        if (typeof item === 'string') openByName(item);
        else open(state.sites.indexOf(item));
      });
      barList.appendChild(row);
    }
  }
  barIdx = 0;
  if (barInput) barInput.setAttribute('aria-expanded', 'true');
  if (barHint) barHint.textContent = '↑↓ navigate · enter open · esc close';
  syncBarSel();
}

function syncBarSel(): void {
  if (!barList) return;
  const rows = barList.querySelectorAll('.bar-row');
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.toggle('bar-sel', i === barIdx);
  }
}

let barHint: HTMLElement | null = null;
const barList = $('#barList') as HTMLElement | null;

function openBar(): void {
  if (mode === 'bar') return;
  mode = 'bar';
  if (bar) {
    bar.hidden = false;
    bar.classList.add('open');
  }
  if (barInput) {
    barInput.value = '';
    barInput.focus();
  }
  barIdx = 0;
  barItems = [];
  renderBar();
}

function closeBar(): void {
  if (mode !== 'bar') return;
  mode = 'none';
  if (bar) {
    bar.hidden = true;
    bar.classList.remove('open');
  }
}

function openByName(name: string): void {
  const url = {
    'YouTube': 'https://youtube.com',
    'Gmail': 'https://mail.google.com',
    'Google Drive': 'https://drive.google.com',
    'Google Docs': 'https://docs.google.com/document/u/0/',
    'Google Maps': 'https://maps.google.com',
    'Google Translate': 'https://translate.google.com',
    'GitHub': 'https://github.com'
  }[name];
  if (!url) return;
  closeBar();
  openInSameTab(url);
}

if (barInput) {
  barInput.addEventListener('input', function () {
    barIdx = 0;
    renderBar();
  });
  barInput.addEventListener('keydown', function (e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (barItems.length) { barIdx = (barIdx + 1) % Math.min(8, barItems.length); syncBarSel(); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (barItems.length) { barIdx = (barIdx - 1 + Math.min(8, barItems.length)) % Math.min(8, barItems.length); syncBarSel(); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = barItems[barIdx];
      if (typeof item === 'string') openByName(item);
      else open(state.sites.indexOf(item));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeBar();
    }
  });
}

if (bar) {
  bar.addEventListener('mousedown', function (e: MouseEvent) {
    e.preventDefault();
  });
}

if (barInput) barInput.setAttribute('role', 'combobox');
if (barInput) barInput.setAttribute('autocomplete', 'off');
if (barInput) barInput.setAttribute('spellcheck', 'false');

/* ─── settings drawer ─── */

function toggleDrawer(): void {
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) closeDrawer();
  else {
    drawer.classList.add('open');
    if (scrim) { scrim.hidden = false; }
    mode = 'drawer';
    syncDrawerDisplay();
    if (drawerBody) drawerBody.focus();
  }
}

function closeDrawer(): void {
  if (!drawer) return;
  drawer.classList.remove('open');
  if (scrim) { scrim.hidden = true; }
  mode = 'none';
}

/* Settings drawer — the layout controls are wired here. The shell's controls use
   `set-<key>` / `val-<key>` ids plus `data-step`/`data-target` on the +/- steppers
   (NOT data-k), so we bind by id. Every change updates state.settings, then a single
   debounced commit re-renders the grid, persists locally and syncs the Gist. */
const SETTING_RANGES: (keyof Settings)[] = ['iconSize', 'colGap', 'rowGap', 'cols', 'rows', 'labelOp', 'bkWidth', 'drWidth', 'blur'];
const SETTING_CHECKS: (keyof Settings)[] = ['labels', 'mono', 'wallMono'];

function settingVal(k: keyof Settings): number | boolean | string | undefined {
  return state.settings[k];
}

function syncSettingControl(k: keyof Settings): void {
  if (!drawerBody) return;
  const inp = drawerBody.querySelector('#set-' + k) as HTMLInputElement | null;
  if (!inp) return;
  const v = settingVal(k);
  if (inp.type === 'checkbox') inp.checked = (v as boolean) === true;
  else inp.value = String(v);
  const disp = drawerBody.querySelector('#val-' + k);
  if (disp) {
    const unit = inp.getAttribute('data-unit') ? inp.getAttribute('data-unit') : '';
    disp.textContent = String(v) + unit;
  }
}

function syncDrawerDisplay(): void {
  if (!drawerBody) return;
  SETTING_RANGES.forEach(syncSettingControl);
  SETTING_CHECKS.forEach(syncSettingControl);
  syncSettingControl('labelColor');
}

function commitSetting(k: keyof Settings): void {
  if (settingTimer) clearTimeout(settingTimer);
  settingTimer = setTimeout(function () {
    state.updatedAt = Date.now();
    renderAll();
    persistLocal();
    scheduleCloud();
    if (window.WALLS && (k === 'blur' || k === 'wallMono')) window.WALLS.applySafe();
  }, 120);
}

if (drawerBody) {
  /* range sliders + color picker: live value in the control/readout, debounced commit. */
  drawerBody.addEventListener('input', function (e: Event) {
    const t = e.target as HTMLInputElement;
    if (!t || !t.id || t.id.indexOf('set-') !== 0) return;
    const k = t.id.slice(4) as keyof Settings;
    let val: number | boolean | string = 0;
    if (t.type === 'checkbox') val = t.checked;
    else if (t.type === 'color') val = t.value;
    else val = parseFloat(t.value) || 0;
    (state.settings as unknown as Record<string, unknown>)[k] = val;
    syncSettingControl(k);
    commitSetting(k);
  });

  /* +/- steppers (data-step / data-target) nudge the matching slider and commit. */
  drawerBody.addEventListener('click', function (e: Event) {
    const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.step') as HTMLElement | null;
    if (!b) return;
    const key = b.getAttribute('data-target') as keyof Settings | null;
    if (!key) return;
    const d = parseInt(b.getAttribute('data-step') || '0', 10);
    const inp = drawerBody.querySelector('#set-' + key) as HTMLInputElement | null;
    if (!inp) return;
    const min = parseFloat(inp.min);
    const max = parseFloat(inp.max);
    const cur = parseFloat(inp.value) || 0;
    let next = cur + d;
    if (!isNaN(min)) next = Math.max(min, next);
    if (!isNaN(max)) next = Math.min(max, next);
    inp.value = String(next);
    (state.settings as unknown as Record<string, unknown>)[key] = next;
    syncSettingControl(key);
    commitSetting(key);
  });

  /* label colour reset button. */
  const labelColorReset = drawerBody.querySelector('#labelColorReset') as HTMLElement | null;
  if (labelColorReset) {
    labelColorReset.addEventListener('click', function () {
      state.settings.labelColor = DEFAULTS.settings.labelColor;
      syncSettingControl('labelColor');
      commitSetting('labelColor');
    });
  }
}

/* ─── sync ─── */

function scheduleCloud(): void {
  if (!SYNC_ENABLED) return;
  dirty = true;
  if (cloudTimer) clearTimeout(cloudTimer);
  cloudTimer = setTimeout(function () { pushCloud(); }, 1300);
}

function pushCloud(): void {
  if (!SYNC_ENABLED) return;
  dirty = false;
  if (cloudTimer) { clearTimeout(cloudTimer); cloudTimer = null; }
  if (!window.SYNC) return;
  const d = doc();
  const onOk = function (): void {
    dirty = false;
  };
  window.SYNC.push(d).then(onOk, function () {
    dirty = true;
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = setTimeout(function () { pushCloud(); }, 20000);
  });
}

function pullCloud(): void {
  if (!SYNC_ENABLED || !window.SYNC) return;
  window.SYNC.pull().then(function (remote: SaveDoc | null) {
    if (!remote) { bootstrapSync(); return; }
    const local = readLocal();
    // Favourites handling: the Gist is the source of truth, but if it lost its
    // favourites (the original bug) while the local state still has them, recover
    // them. This lets the user's explicit list stick AND deletions propagate,
    // instead of always-unioning which would resurrect removed favourites.
    const rw = (remote && remote.walls ? remote.walls : null) as WallsDoc | null | undefined;
    const lw = (local && local.walls ? local.walls : null) as WallsDoc | null | undefined;
    if (rw && Array.isArray(rw.favs) && rw.favs.length === 0 && lw && Array.isArray(lw.favs) && lw.favs.length) {
      rw.favs = lw.favs;
    }
    if (local && !local.updatedAt) { bootstrapSync(); return; }
    if (local && local.updatedAt && local.updatedAt > remote.updatedAt) {
      pushCloud();
      return;
    }
    adopt(remote);
  }).catch(function () { bootstrapSync(); });
}

function adopt(remote: SaveDoc): void {
  const norm = normalize(remote);
  if (!norm) return;
  state = norm;
  state.updatedAt = Date.now();
  commit({ noCloud: true });
  if (window.BOOKMARKS) window.BOOKMARKS.restore(norm.bookmarks);
  if (window.WALLS) window.WALLS.restore(norm.walls);
}

function bootstrapSync(): void {
  if (!window.SYNC) return;
  if (seededFromLinks) {
    scheduleCloud();
    return;
  }
  const local = readLocal();
  if (local && local.sites && local.sites.length) {
    scheduleCloud();
    return;
  }
  loadSeed().then(function (seed: SaveDoc) {
    try { localStorage.setItem(SEED_FLAG_KEY, '1'); } catch { /* noop */ }
    seededFromLinks = true;
    adopt(seed);
  }).catch(function () { scheduleCloud(); });
}

function paintState(n: SaveDoc): void {
  state = n;
  renderAll();
  if (window.BOOKMARKS && window.BOOKMARKS.restore && n.bookmarks) window.BOOKMARKS.restore(n.bookmarks);
  if (window.WALLS && window.WALLS.restore && n.walls) window.WALLS.restore(n.walls);
}

function syncStart(): void {
  if (!SYNC_ENABLED || !window.SYNC) return;
  if (seededFromLinks) {
    pullCloud();
    return;
  }
  // Fast-paint the cached local save (no updatedAt bump, no push) so the grid
  // shows instantly, then reconcile with the Gist. pullCloud merges favourites
  // (so a stale empty-favs local never wipes them) and adopts the Gist when
  // it's newer — restoring favourites after a cloud state loss.
  restoreFromStorage().then(function (cached: SaveDoc | null) {
    if (cached && cached.updatedAt && cached.sites && cached.sites.length) {
      const n = normalize(cached);
      if (n) paintState(n);
    }
    pullCloud();
  }).catch(function () { pullCloud(); });
}

/* ─── bookmarks + walls hooks ─── */

function bindModules(): void {
  if (window.BOOKMARKS && window.BOOKMARKS.bind) {
    window.BOOKMARKS.bind(function () {
      state.updatedAt = Date.now();
      persistLocal();
      scheduleCloud();
    });
  }
  if (window.WALLS && window.WALLS.bind) {
    window.WALLS.bind(function () {
      state.updatedAt = Date.now();
      persistLocal();
      scheduleCloud();
    });
  }
  if (window.BOOKMARKS && window.BOOKMARKS.restore && state.bookmarks) {
    window.BOOKMARKS.restore(state.bookmarks);
  }
  if (window.WALLS && window.WALLS.restore && state.walls) {
    window.WALLS.restore(state.walls);
  }
}

/* ─── resize ─── */

window.addEventListener('resize', function () {
  if (settingTimer) clearTimeout(settingTimer);
  settingTimer = setTimeout(function () {
    applyCssVars();
    if (drawer && drawer.classList.contains('open')) syncDrawerDisplay();
  }, 150);
});

/* ─── init ─── */

function init(): void {
  loadPersistedIcons();
  bindModules();
  renderAll();
  syncStart();
  setInterval(function () { retryAllFailed(); }, 120000);
}

document.addEventListener('DOMContentLoaded', init);

})();
