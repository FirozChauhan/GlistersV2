/* ─── GlistersV2 — bookmarks sidebar ─── */

(function () {
'use strict';

/* ─── state ─── */

const UI_KEY = 'glisters-bk-ui';

const TREE: BkTree = { folders: [], items: [] };

const ui: BkUI = {
  open: false,
  folder: null,
  focusedId: null,
  armedId: null,
  armTimer: null,
  editor: null,
  visible: []
};

let appCommit: (() => void) | null = null; /* kept for API-shape compat */
void appCommit;
const faviconCache: Record<string, string> = Object.create(null);
let ignoreOutsideClick = false;

/* ─── utils ─── */

function $bk(s: string): HTMLElement | null {
  return document.querySelector(s);
}
function elbk<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function isTyping(t: EventTarget | null): boolean {
  return !!t && (t as HTMLElement).tagName === 'INPUT' || (t as HTMLElement).tagName === 'TEXTAREA' ||
    (t as HTMLElement).tagName === 'SELECT' || (t as HTMLElement).isContentEditable;
}
function isVisible(sel: string): boolean {
  const n = $bk(sel);
  return !!n && !n.hidden && n.getAttribute('aria-hidden') !== 'true' &&
    getComputedStyle(n).display !== 'none';
}

/* ─── dom refs ─── */

const root = $bk('#bk') as HTMLElement;
const tree = $bk('#bkTree') as HTMLElement;
const closeBtn = $bk('#bkClose') as HTMLElement | null;
const toggleBtn = $bk('#bkToggle') as HTMLElement | null;
const chromeBtn = $bk('#bkChrome') as HTMLElement | null;
const backBtn = $bk('#bkBack') as HTMLElement | null;
const crumbsEl = $bk('#bkCrumbs') as HTMLElement | null;
const emptyEl = $bk('#bkEmpty') as HTMLElement | null;
const emptyAddBtn = emptyEl ? emptyEl.querySelector('.bk-empty-add') as HTMLElement | null : null;

if (!root || !tree) throw new Error('bookmarks markup missing');

function saveUI(): void {
  try { localStorage.setItem(UI_KEY, JSON.stringify({ open: ui.open })); } catch { /* noop */ }
}

/* ─── chrome access ─── */

function chromeBk(): typeof chrome.bookmarks | null {
  return (typeof chrome !== 'undefined' && chrome.bookmarks) ? chrome.bookmarks : null;
}
function homeIdOf(p: string | null): string { return p || '1'; }
function homeOf(p: string | null): string | null { return p === '1' ? null : p; }

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function refresh(): Promise<boolean> {
  return new Promise(function (resolve) {
    const bk = chromeBk();
    if (!bk || !bk.getTree) { resolve(false); return; }
    try {
      bk.getTree(function (treeData) {
        try {
          normalizeTree(treeData);
        } catch { /* keep previous tree */ }
        if (ui.folder && !findFolder(ui.folder)) ui.folder = null;
        render();
        resolve(true);
      });
    } catch { resolve(false); }
  });
}

function normalizeTree(treeData: chrome.bookmarks.BookmarkTreeNode[]): void {
  const folders: BkNode[] = [], items: BkNode[] = [];
  const rootNode = treeData && treeData[0];
  (function walk(cn: chrome.bookmarks.BookmarkTreeNode, parent: string | null) {
    const kids = cn.children || [];
    for (let i = 0; i < kids.length; i++) {
      const ch = kids[i];
      if (!ch || !ch.id) continue;
      const p = parent === '1' ? null : parent;
      if (ch.url) {
        items.push({ id: ch.id, name: ch.title || hostOf(ch.url) || ch.url, url: ch.url, parent: p, index: i });
      } else {
        if (ch.id === '1') { walk(ch, '1'); continue; }
        const idx = parent == null ? 100000 + i : i;
        folders.push({ id: ch.id, name: ch.title || 'folder', parent: p, index: idx });
        walk(ch, ch.id);
      }
    }
  })(rootNode, null);
  TREE.folders = folders;
  TREE.items = items;
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
function armRefresh(): void {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refresh, 150);
}
const BK_EVENTS = ['onCreated', 'onRemoved', 'onChanged', 'onMoved',
  'onChildrenReordered', 'onImportEnded', 'onImportBegan'];
function bindChromeEvents(): void {
  const bk = chromeBk();
  if (!bk) return;
  for (let i = 0; i < BK_EVENTS.length; i++) {
    const ev = (bk as unknown as Record<string, { addListener?: (cb: () => void) => void }>)[BK_EVENTS[i]];
    if (ev && ev.addListener) {
      try { ev.addListener(armRefresh); } catch { /* noop */ }
    }
  }
}

/* ─── tree helpers ─── */

function parentKey(p: string | null): string { return p == null ? '__root__' : p; }
function findFolder(id: string): BkNode | null {
  for (let i = 0; i < TREE.folders.length; i++) if (TREE.folders[i].id === id) return TREE.folders[i];
  return null;
}
function findItem(id: string): BkNode | null {
  for (let i = 0; i < TREE.items.length; i++) if (TREE.items[i].id === id) return TREE.items[i];
  return null;
}
function findNode(id: string | null): { type: 'folder' | 'link'; node: BkNode } | null {
  const f = findFolder(id ?? '');
  if (f) return { type: 'folder', node: f };
  const it = findItem(id ?? '');
  if (it) return { type: 'link', node: it };
  return null;
}
function childrenOf(parent: string | null): { type: 'folder' | 'link'; node: BkNode }[] {
  const p = parentKey(parent);
  const out: { type: 'folder' | 'link'; node: BkNode }[] = [];
  for (let i = 0; i < TREE.folders.length; i++) {
    if (parentKey(TREE.folders[i].parent) === p) out.push({ type: 'folder', node: TREE.folders[i] });
  }
  for (let j = 0; j < TREE.items.length; j++) {
    if (parentKey(TREE.items[j].parent) === p) out.push({ type: 'link', node: TREE.items[j] });
  }
  out.sort(function (a, b) { return a.node.index - b.node.index; });
  return out;
}
function folderPathIds(folderId: string | null): string[] {
  const ids: string[] = [];
  let cur = folderId, guard = 0;
  while (cur && guard++ < 50) {
    const f = findFolder(cur);
    if (!f) break;
    ids.unshift(f.id);
    cur = f.parent;
  }
  return ids;
}
function isDescendant(maybeChild: string | null, ancestor: string): boolean {
  let cur = maybeChild, guard = 0;
  while (cur && guard++ < 100) {
    if (cur === ancestor) return true;
    const n = findNode(cur);
    cur = n ? n.node.parent : null;
  }
  return false;
}

function visibleNodes(): BkVisible[] {
  const out: BkVisible[] = [];
  childrenOf(ui.folder).forEach(function (c) {
    out.push({ type: c.type, node: c.node, depth: 0 });
  });
  return out;
}

/* ─── favicons ─── */

function initialsBk(name: string): string {
  const w = String(name).trim().split(/\s+/).filter(Boolean);
  return (w.slice(0, 2).map(function (x) { return x[0]; }).join('') || '?').toUpperCase();
}
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
function faviconCands(url: string): string[] {
  let h: string;
  try { h = new URL(url).hostname.replace(/^www\./, ''); } catch { return []; }
  const cands: string[] = [];
  const first = officialIcon(url);
  if (first) cands.push(first);
  cands.push(
    'https://' + h + '/apple-touch-icon.png',
    'https://' + h + '/favicon.ico',
    'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(h) + '&sz=64',
    'https://icons.duckduckgo.com/ip3/' + encodeURIComponent(h) + '.ico'
  );
  return cands;
}
const ICON_CACHE_KEY = 'glisters-icons';
const persistedIconsBk: Record<string, string> = Object.create(null);
let iconPersistTimerBk: ReturnType<typeof setTimeout> | null = null;
function loadPersistedIconsBk(): void {
  try {
    const raw = localStorage.getItem(ICON_CACHE_KEY);
    if (raw) {
      const m = JSON.parse(raw) as Record<string, unknown>;
      for (const k in m) if (typeof m[k] === 'string') persistedIconsBk[k] = m[k] as string;
    }
  } catch { /* fresh profile */ }
  if (window.chrome && chrome.storage && chrome.storage.local) {
    try {
      chrome.storage.local.get(ICON_CACHE_KEY, function (o) {
        const m = o && o[ICON_CACHE_KEY] as Record<string, unknown>;
        if (m && typeof m === 'object') {
          for (const k2 in m) if (typeof m[k2] === 'string') persistedIconsBk[k2] = m[k2] as string;
        }
      });
    } catch { /* noop */ }
  }
}
function persistIconBk(key: string, src: string): void {
  if (!key || !src) return;
  persistedIconsBk[key] = src;
  if (iconPersistTimerBk) clearTimeout(iconPersistTimerBk);
  iconPersistTimerBk = setTimeout(function () {
    try { localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(persistedIconsBk)); } catch { /* quota */ }
    if (window.chrome && chrome.storage && chrome.storage.local) {
      try {
        const o: Record<string, unknown> = {};
        o[ICON_CACHE_KEY] = persistedIconsBk;
        chrome.storage.local.set(o);
      } catch { /* noop */ }
    }
  }, 400);
}

function loadFavicon(ic: HTMLElement, node: BkNode): void {
  const letter = ic.querySelector('.bk-letter') as HTMLElement | null;
  const cached = faviconCache[node.url || ''];
  if (cached) { setImg(ic, cached, letter); return; }
  const cands = faviconCands(node.url || '');
  if (persistedIconsBk[node.url || '']) cands.unshift(persistedIconsBk[node.url || '']);
  let done = false;
  for (let i = 0; i < cands.length; i++) {
    (function (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      img.decoding = 'async';
      img.addEventListener('load', function () {
        if (done || img.naturalWidth < 16 || img.naturalHeight < 16) return;
        done = true;
        faviconCache[node.url || ''] = src;
        persistIconBk(node.url || '', src);
        const olds = ic.querySelectorAll('img');
        for (let k = 0; k < olds.length; k++) ic.removeChild(olds[k]);
        if (letter) letter.style.display = 'none';
        ic.appendChild(img);
      });
      ic.appendChild(img);
    })(cands[i]);
  }
}
function setImg(ic: HTMLElement, src: string, letter: HTMLElement | null): void {
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.referrerPolicy = 'no-referrer';
  if (letter) letter.style.display = 'none';
  ic.appendChild(img);
}

/* ─── render ─── */

const FOLDER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
const EDIT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
const DEL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

function rowEl(v: BkVisible, depth: number): HTMLElement {
  const node = v.node;
  const isFolder = v.type === 'folder';
  const r = elbk('div', 'bk-row ' + (isFolder ? 'folder' : 'link'));
  r.dataset.id = node.id;
  r.dataset.type = v.type;
  r.draggable = true;
  r.style.paddingLeft = (10 + depth * 16) + 'px';
  r.setAttribute('role', 'treeitem');
  r.setAttribute('aria-level', String(depth + 1));

  if (isFolder) {
    const tw = elbk('span', 'bk-twist', '\u25b8');
    tw.setAttribute('aria-hidden', 'true');
    r.appendChild(tw);
    const fic = elbk('span', 'bk-icon bk-folder');
    fic.innerHTML = FOLDER_SVG;
    r.appendChild(fic);
  } else {
    r.appendChild(elbk('span', 'bk-twist', ''));
    const ic = elbk('span', 'bk-icon');
    ic.appendChild(elbk('span', 'bk-letter', initialsBk(node.name)));
    r.appendChild(ic);
    loadFavicon(ic, node);
  }

  r.appendChild(elbk('span', 'bk-name', node.name));

  const ctx = elbk('span', 'bk-ctx');
  const eb = elbk('button', 'bk-ctx-btn bk-ctx-edit');
  eb.type = 'button';
  eb.title = 'edit';
  eb.setAttribute('aria-label', 'edit ' + node.name);
  eb.innerHTML = EDIT_SVG;
  eb.addEventListener('click', function (ev: Event) {
    ev.stopPropagation();
    openEditor(node.parent, v.type, node);
  });
  const db = elbk('button', 'bk-ctx-btn bk-ctx-del');
  db.type = 'button';
  db.title = 'delete';
  db.setAttribute('aria-label', 'delete ' + node.name);
  db.innerHTML = DEL_SVG;
  db.addEventListener('click', function (ev: Event) {
    ev.stopPropagation();
    armOrDelete(node.id);
  });
  ctx.appendChild(eb);
  ctx.appendChild(db);
  r.appendChild(ctx);
  return r;
}

function crumbEl(label: string, folderId: string | null, current: boolean): HTMLElement {
  const c = elbk('button', 'bk-crumb' + (current ? ' current' : ''));
  c.type = 'button';
  c.textContent = label;
  if (!current) {
    c.addEventListener('click', function () { openFolder(folderId); });
  }
  return c;
}
function renderCrumbs(ids: string[]): void {
  if (!crumbsEl) return;
  crumbsEl.innerHTML = '';
  crumbsEl.appendChild(crumbEl('home', null, ids.length === 0));
  for (let i = 0; i < ids.length; i++) {
    const f = findFolder(ids[i]);
    if (!f) continue;
    crumbsEl.appendChild(elbk('span', 'bk-crumb-sep', '/'));
    crumbsEl.appendChild(crumbEl(f.name, f.id, i === ids.length - 1));
  }
}

function editorEl(): HTMLElement {
  const ed = ui.editor!;
  const form = elbk('form', 'bk-editor');
  const nf = elbk('label', 'bk-field');
  nf.appendChild(elbk('span', '', 'name'));
  const ni = elbk('input', 'bk-en');
  ni.type = 'text';
  ni.autocomplete = 'off';
  ni.spellcheck = false;
  ni.placeholder = ed.type === 'folder' ? 'folder name' : 'name';
  ni.value = ed.node ? ed.node.name : '';
  nf.appendChild(ni);
  form.appendChild(nf);

  if (ed.type === 'link') {
    const uf = elbk('label', 'bk-field');
    uf.appendChild(elbk('span', '', 'url'));
    const uin = elbk('input', 'bk-ur');
    uin.type = 'text';
    uin.autocomplete = 'off';
    uin.spellcheck = false;
    uin.placeholder = 'example.com';
    uin.value = ed.node ? ed.node.url || '' : '';
    uf.appendChild(uin);
    form.appendChild(uf);
  }

  const acts = elbk('div', 'bk-editor-actions');
  const cancel = elbk('button', 'bk-btn', 'cancel');
  cancel.type = 'button';
  const save = elbk('button', 'bk-btn', 'save');
  save.type = 'submit';
  acts.appendChild(cancel);
  acts.appendChild(save);
  form.appendChild(acts);

  cancel.addEventListener('click', cancelEditor);
  form.addEventListener('submit', function (e: Event) { e.preventDefault(); saveEditor(form); });
  return form;
}

function render(): void {
  ui.visible = visibleNodes();

  let focusId = ui.focusedId, hasFocus = false;
  for (let i = 0; i < ui.visible.length; i++) {
    if (ui.visible[i].node.id === focusId) { hasFocus = true; break; }
  }
  if (!hasFocus) focusId = ui.visible.length ? ui.visible[0].node.id : null;
  ui.focusedId = focusId;

  tree.innerHTML = '';
  if (ui.editor) tree.appendChild(editorEl());
  for (let i = 0; i < ui.visible.length; i++) {
    const v = ui.visible[i];
    const r = rowEl(v, v.depth);
    if (v.node.id === focusId) r.classList.add('focused');
    if (v.node.id === ui.armedId) r.classList.add('armed');
    tree.appendChild(r);
  }

  const hasRows = ui.visible.length > 0;
  if (emptyEl) {
    emptyEl.style.display = (!hasRows && !ui.editor) ? 'flex' : 'none';
    const t1 = emptyEl.querySelector('.bk-empty-title') as HTMLElement | null;
    const t2 = emptyEl.querySelector('.bk-empty-sub') as HTMLElement | null;
    if (t1) t1.textContent = ui.folder ? 'no bookmarks here' : 'no bookmarks yet';
    if (t2) t2.textContent = 'press a to add your first link';
  }
  if (backBtn) backBtn.classList.toggle('disabled', ui.folder == null);
  if (crumbsEl) renderCrumbs(folderPathIds(ui.folder));

  if (ui.editor) {
    const nameInp = tree.querySelector('.bk-en') as HTMLElement | null;
    if (nameInp) nameInp.focus();
  }
}

/* ─── focus ─── */

function updateArmed(): void {
  const rows = tree.querySelectorAll('.bk-row');
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.toggle('armed', (rows[i] as HTMLElement).dataset.id === ui.armedId);
  }
}
function disarm(): void {
  if (ui.armedId == null && ui.armTimer == null) return;
  ui.armedId = null;
  if (ui.armTimer) clearTimeout(ui.armTimer);
  ui.armTimer = null;
  updateArmed();
}
function setFocused(id: string): void {
  ui.focusedId = id;
  disarm();
  const rows = tree.querySelectorAll('.bk-row');
  for (let i = 0; i < rows.length; i++) {
    const f = (rows[i] as HTMLElement).dataset.id === id;
    rows[i].classList.toggle('focused', f);
    if (f) { try { rows[i].scrollIntoView({ block: 'nearest' }); } catch { /* noop */ } }
  }
}
function moveFocus(d: number): void {
  const n = ui.visible.length;
  if (!n) return;
  let cur = -1;
  for (let i = 0; i < n; i++) if (ui.visible[i].node.id === ui.focusedId) { cur = i; break; }
  const ni = cur < 0 ? (d > 0 ? 0 : n - 1) : Math.max(0, Math.min(n - 1, cur + d));
  setFocused(ui.visible[ni].node.id);
}
function visibleFocused(): BkVisible | null {
  if (!ui.focusedId) return null;
  for (let i = 0; i < ui.visible.length; i++) {
    if (ui.visible[i].node.id === ui.focusedId) return ui.visible[i];
  }
  return null;
}
function focusFirst(): void {
  if (ui.visible.length) setFocused(ui.visible[0].node.id);
}
function focusLast(): void {
  if (ui.visible.length) setFocused(ui.visible[ui.visible.length - 1].node.id);
}

/* ─── actions ─── */

function normUrlBk(url: string): string {
  const u = String(url).trim();
  if (!u) return '';
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return 'https://' + u;
  const scheme = u.slice(0, u.indexOf(':')).toLowerCase();
  if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') return u;
  return '';
}
function openInNewTab(url: string): void {
  if (!url) return;
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
    try { chrome.tabs.create({ url: url, active: false }); return; } catch { /* fall through */ }
  }
  try {
    const w = window.open(url, '_blank');
    if (w) return;
  } catch { /* fall through */ }
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  (document.body || document.documentElement).appendChild(a);
  ignoreOutsideClick = true;
  try { a.click(); } finally { ignoreOutsideClick = false; }
  a.remove();
}

function openFolder(id: string | null): void {
  if (id === '1') id = null;
  if (id != null && !findFolder(id)) return;
  ui.folder = id;
  ui.focusedId = null;
  render();
}
function goBack(): void {
  if (ui.folder == null) return;
  const prev = ui.folder;
  const f = findFolder(prev);
  ui.folder = f ? homeOf(f.parent) : null;
  ui.focusedId = prev;
  render();
}
function openFocused(): void {
  const v = visibleFocused();
  if (!v) return;
  if (v.type === 'link') { openInNewTab(normUrlBk(v.node.url || '')); return; }
  openFolder(v.node.id);
}
function rightKey(): void {
  const v = visibleFocused();
  if (!v) return;
  if (v.type === 'folder') openFolder(v.node.id);
}
function leftKey(): void { goBack(); }

function addParent(): string | null {
  const v = visibleFocused();
  if (!v) return ui.folder;
  return v.type === 'folder' ? v.node.id : (v.node.parent ?? null);
}

function openEditor(parent: string | null | undefined, type: 'link' | 'folder', node: BkNode | null): void {
  ui.editor = { parent: parent ?? null, type: type, node: node || null };
  render();
  const inp = tree.querySelector('.bk-en') as HTMLElement | null;
  if (inp) inp.focus();
}
function cancelEditor(): void {
  ui.editor = null;
  render();
}
function saveEditor(form: HTMLElement): void {
  const ed = ui.editor;
  if (!ed) return;
  const bk = chromeBk();
  if (!bk) { cancelEditor(); return; }
  const nameInp = form.querySelector('.bk-en') as HTMLInputElement;
  const urlInp = form.querySelector('.bk-ur') as HTMLInputElement | null;
  const name = nameInp.value.trim();
  const url = ed.type === 'link' ? normUrlBk(urlInp ? urlInp.value : '') : '';
  let ok = true;
  nameInp.classList.remove('err');
  if (!name) { nameInp.classList.add('err'); ok = false; }
  if (ed.type === 'link' && !url) {
    if (urlInp) urlInp.classList.add('err');
    ok = false;
  }
  if (!ok) return;

  const done = function (created: chrome.bookmarks.BookmarkTreeNode | null) {
    const focusId = (created && created.id) || (ed.node && ed.node.id) || null;
    ui.editor = null;
    if (ed.parent) ui.folder = homeOf(ed.parent);
    saveUI();
    render();
    refresh().then(function () {
      if (focusId) setFocused(focusId);
    });
  };

  if (ed.node) {
    const upd: { title: string; url?: string } = { title: name };
    if (ed.type === 'link') upd.url = url;
    try { bk.update(ed.node.id, upd, function (r) { done(r || null); }); } catch { cancelEditor(); }
  } else {
    const o: chrome.bookmarks.CreateDetails = { parentId: homeIdOf(ed.parent), title: name };
    if (ed.type === 'link') o.url = url;
    try { bk.create(o, function (r) { done(r || null); }); } catch { cancelEditor(); }
  }
}

function armOrDelete(id?: string): void {
  const target = id || ui.focusedId;
  if (!target || !findNode(target)) return;
  if (ui.armedId === target) { deleteNode(target); return; }
  ui.armedId = target;
  if (ui.armTimer) clearTimeout(ui.armTimer);
  ui.armTimer = setTimeout(function () { disarm(); }, 2500);
  updateArmed();
}
function deleteNode(id: string): void {
  const n = findNode(id);
  if (!n) return;
  const parent = n.node.parent;
  const bk = chromeBk();
  if (!bk) return;
  const done = function () {
    ui.focusedId = parent;
    disarm();
    refresh();
  };
  try {
    if (n.type === 'folder') bk.removeTree(id, done);
    else bk.remove(id, done);
  } catch { /* chrome gone */ }
}

/* ─── drag & drop ─── */

function clearDrop(): void {
  tree.classList.remove('drop-root');
  const rows = tree.querySelectorAll('.bk-row');
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove('drop-before', 'drop-into', 'dragging');
  }
}
function moveNode(id: string, newParent: string | null, newIndex: number): void {
  const n = findNode(id);
  if (!n) return;
  if (n.type === 'folder' && (newParent === id || isDescendant(newParent, id))) return;
  const bk = chromeBk();
  if (!bk) return;
  try {
    bk.move(id, { parentId: homeIdOf(newParent), index: newIndex }, function () {
      ui.focusedId = id;
      refresh();
    });
  } catch { /* chrome gone */ }
}

tree.addEventListener('dragstart', function (e: DragEvent) {
  const r = (e.target as HTMLElement).closest('.bk-row') as HTMLElement | null;
  if (!r) { e.preventDefault(); return; }
  ui.dragId = r.dataset.id;
  e.dataTransfer!.effectAllowed = 'move';
  e.dataTransfer!.setData('text/plain', ui.dragId!);
  r.classList.add('dragging');
});
tree.addEventListener('dragend', function () {
  ui.dragId = null;
  clearDrop();
});
tree.addEventListener('dragover', function (e: DragEvent) {
  if (!ui.dragId) return;
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'move';
  const r = (e.target as HTMLElement).closest('.bk-row') as HTMLElement | null;
  clearDrop();
  if (r && r.dataset.type === 'folder') r.classList.add('drop-into');
  else if (r) r.classList.add('drop-before');
  else tree.classList.add('drop-root');
});
tree.addEventListener('drop', function (e: DragEvent) {
  if (!ui.dragId) return;
  e.preventDefault();
  const id = ui.dragId;
  const r = (e.target as HTMLElement).closest('.bk-row') as HTMLElement | null;
  let dest: { parent: string | null; index: number };
  if (r && r.dataset.type === 'folder') {
    dest = { parent: r.dataset.id ?? null, index: childrenOf(r.dataset.id ?? null).length };
  } else if (r) {
    const target = findNode(r.dataset.id ?? null);
    let idx = target ? target.node.index : 0;
    const src = findNode(id ?? null);
    if (target && src && src.node.parent === target.node.parent && src.node.index < idx) idx -= 1;
    dest = { parent: target ? target.node.parent : null, index: idx };
  } else {
    dest = { parent: null, index: childrenOf(null).length };
  }
  ui.dragId = null;
  clearDrop();
  moveNode(id, dest.parent, dest.index);
});

/* ─── panel open/close ─── */

function setOpen(open: boolean): void {
  if (open === ui.open) return;
  ui.open = open;
  root.classList.toggle('open', open);
  root.setAttribute('aria-hidden', String(!open));
  saveUI();
  if (open) render();
}
function togglePanel(): void { setOpen(!ui.open); }

if (toggleBtn) toggleBtn.addEventListener('click', togglePanel);
if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
if (chromeBtn) {
  chromeBtn.addEventListener('click', function () {
    if (chromeBtn.classList.contains('syncing')) return;
    chromeBtn.classList.add('syncing');
    refresh().then(function () { chromeBtn.classList.remove('syncing'); });
  });
}
if (backBtn) backBtn.addEventListener('click', goBack);
if (emptyAddBtn) emptyAddBtn.addEventListener('click', function () { openEditor(ui.folder, 'link', null); });

tree.addEventListener('click', function (e: MouseEvent) {
  const r = (e.target as HTMLElement).closest('.bk-row') as HTMLElement | null;
  if (!r || (e.target as HTMLElement).closest('.bk-ctx-btn')) return;
  const id = r.dataset.id ?? null;
  ui.focusedId = id;
  let v: BkVisible | null = null;
  for (let i = 0; i < ui.visible.length; i++) if (ui.visible[i].node.id === id) v = ui.visible[i];
  if (!v) return;
  if (v.type === 'link') openInNewTab(normUrlBk(v.node.url || ''));
  else openFolder(id);
});

tree.addEventListener('contextmenu', function (e: Event) {
  if ((e.target as HTMLElement).closest('.bk-row')) e.preventDefault();
});

document.addEventListener('click', function (e: MouseEvent) {
  if (!ui.open || ignoreOutsideClick) return;
  if (e.target && (e.target as HTMLElement).closest &&
      ((e.target as HTMLElement).closest('#bk') || (e.target as HTMLElement).closest('#bkToggle'))) return;
  setOpen(false);
}, true);

/* ─── keys ─── */

document.addEventListener('keydown', function (e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;

  const typing = isTyping(e.target);
  const modalOpen = isVisible('#modal');
  const drawerOpen = !!($bk('#drawer') && $bk('#drawer')!.classList.contains('open'));
  const barOpen = isVisible('#bar');

  if (modalOpen || drawerOpen || barOpen) {
    if (ui.open && e.key === 'Escape') {
      setOpen(false);
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  if (typing) {
    if (ui.editor && e.key === 'Escape') {
      cancelEditor();
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  if (!ui.open) {
    if (e.key === 'b' || e.key === 'B') {
      setOpen(true);
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  let handled = true;
  switch (e.key) {
    case 'b': case 'B': case 'Escape':
      if (ui.editor) cancelEditor();
      else if (ui.armedId) disarm();
      else setOpen(false);
      break;
    case 'j': case 'ArrowDown': moveFocus(1); break;
    case 'k': case 'ArrowUp': moveFocus(-1); break;
    case 'l': case 'ArrowRight': rightKey(); break;
    case 'h': case 'ArrowLeft': leftKey(); break;
    case 'Enter': case 'o': case 'O': openFocused(); break;
    case 'a': openEditor(addParent(), 'link', null); break;
    case 'A': openEditor(addParent(), 'folder', null); break;
    case 'e': case 'E': {
      const v = visibleFocused();
      if (v) openEditor(v.node.parent, v.type, v.node);
      break;
    }
    case 'd': case 'D': armOrDelete(); break;
    case 'g': case 'Home': focusFirst(); break;
    case 'G': case 'End': focusLast(); break;
    case 'Tab': break;
    default: handled = false;
  }
  if (handled) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

/* ─── public API ─── */

window.BOOKMARKS = {
  bind: function () { /* no shared-doc writes anymore */ },
  forDoc: function () { return null; },
  restore: function () { /* nothing to adopt */ },
  refreshFromChrome: function () { return refresh(); }
} as BookmarksClient;

/* ─── init ─── */

bindChromeEvents();
loadPersistedIconsBk();

let uiSaved: { open?: boolean } | null = null;
try { uiSaved = JSON.parse(localStorage.getItem(UI_KEY) || 'null'); } catch { /* noop */ }
if (uiSaved && uiSaved.open) {
  ui.open = true;
  root.classList.add('open');
  root.setAttribute('aria-hidden', 'false');
}

refresh();

})();