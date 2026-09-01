"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var require_bookmarks = __commonJS({
    "src/bookmarks.ts"() {
      (function() {
        "use strict";
        const UI_KEY = "glisters-bk-ui";
        const TREE = { folders: [], items: [] };
        const ui = {
          open: false,
          folder: null,
          focusedId: null,
          armedId: null,
          armTimer: null,
          editor: null,
          visible: []
        };
        let appCommit = null;
        void appCommit;
        const faviconCache = /* @__PURE__ */ Object.create(null);
        let ignoreOutsideClick = false;
        function $bk(s) {
          return document.querySelector(s);
        }
        function elbk(tag, cls, text) {
          const n = document.createElement(tag);
          if (cls) n.className = cls;
          if (text != null) n.textContent = text;
          return n;
        }
        function isTyping(t) {
          return !!t && t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
        }
        function isVisible(sel) {
          const n = $bk(sel);
          return !!n && !n.hidden && n.getAttribute("aria-hidden") !== "true" && getComputedStyle(n).display !== "none";
        }
        const root = $bk("#bk");
        const tree = $bk("#bkTree");
        const closeBtn = $bk("#bkClose");
        const toggleBtn = $bk("#bkToggle");
        const chromeBtn = $bk("#bkChrome");
        const backBtn = $bk("#bkBack");
        const crumbsEl = $bk("#bkCrumbs");
        const emptyEl = $bk("#bkEmpty");
        const emptyAddBtn = emptyEl ? emptyEl.querySelector(".bk-empty-add") : null;
        if (!root || !tree) throw new Error("bookmarks markup missing");
        function saveUI() {
          try {
            localStorage.setItem(UI_KEY, JSON.stringify({ open: ui.open }));
          } catch {
          }
        }
        function chromeBk() {
          return typeof chrome !== "undefined" && chrome.bookmarks ? chrome.bookmarks : null;
        }
        function homeIdOf(p) {
          return p || "1";
        }
        function homeOf(p) {
          return p === "1" ? null : p;
        }
        function hostOf(url) {
          try {
            return new URL(url).hostname.replace(/^www\./, "");
          } catch {
            return "";
          }
        }
        function refresh() {
          return new Promise(function(resolve) {
            const bk = chromeBk();
            if (!bk || !bk.getTree) {
              resolve(false);
              return;
            }
            try {
              bk.getTree(function(treeData) {
                try {
                  normalizeTree(treeData);
                } catch {
                }
                if (ui.folder && !findFolder(ui.folder)) ui.folder = null;
                render();
                resolve(true);
              });
            } catch {
              resolve(false);
            }
          });
        }
        function normalizeTree(treeData) {
          const folders = [], items = [];
          const rootNode = treeData && treeData[0];
          (function walk(cn, parent) {
            const kids = cn.children || [];
            for (let i = 0; i < kids.length; i++) {
              const ch = kids[i];
              if (!ch || !ch.id) continue;
              const p = parent === "1" ? null : parent;
              if (ch.url) {
                items.push({ id: ch.id, name: ch.title || hostOf(ch.url) || ch.url, url: ch.url, parent: p, index: i });
              } else {
                if (ch.id === "1") {
                  walk(ch, "1");
                  continue;
                }
                const idx = parent == null ? 1e5 + i : i;
                folders.push({ id: ch.id, name: ch.title || "folder", parent: p, index: idx });
                walk(ch, ch.id);
              }
            }
          })(rootNode, null);
          TREE.folders = folders;
          TREE.items = items;
        }
        let refreshTimer = null;
        function armRefresh() {
          if (refreshTimer) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(refresh, 150);
        }
        const BK_EVENTS = [
          "onCreated",
          "onRemoved",
          "onChanged",
          "onMoved",
          "onChildrenReordered",
          "onImportEnded",
          "onImportBegan"
        ];
        function bindChromeEvents() {
          const bk = chromeBk();
          if (!bk) return;
          for (let i = 0; i < BK_EVENTS.length; i++) {
            const ev = bk[BK_EVENTS[i]];
            if (ev && ev.addListener) {
              try {
                ev.addListener(armRefresh);
              } catch {
              }
            }
          }
        }
        function parentKey(p) {
          return p == null ? "__root__" : p;
        }
        function findFolder(id) {
          for (let i = 0; i < TREE.folders.length; i++) if (TREE.folders[i].id === id) return TREE.folders[i];
          return null;
        }
        function findItem(id) {
          for (let i = 0; i < TREE.items.length; i++) if (TREE.items[i].id === id) return TREE.items[i];
          return null;
        }
        function findNode(id) {
          const f = findFolder(id ?? "");
          if (f) return { type: "folder", node: f };
          const it = findItem(id ?? "");
          if (it) return { type: "link", node: it };
          return null;
        }
        function childrenOf(parent) {
          const p = parentKey(parent);
          const out = [];
          for (let i = 0; i < TREE.folders.length; i++) {
            if (parentKey(TREE.folders[i].parent) === p) out.push({ type: "folder", node: TREE.folders[i] });
          }
          for (let j = 0; j < TREE.items.length; j++) {
            if (parentKey(TREE.items[j].parent) === p) out.push({ type: "link", node: TREE.items[j] });
          }
          out.sort(function(a, b) {
            return a.node.index - b.node.index;
          });
          return out;
        }
        function folderPathIds(folderId) {
          const ids = [];
          let cur = folderId, guard = 0;
          while (cur && guard++ < 50) {
            const f = findFolder(cur);
            if (!f) break;
            ids.unshift(f.id);
            cur = f.parent;
          }
          return ids;
        }
        function isDescendant(maybeChild, ancestor) {
          let cur = maybeChild, guard = 0;
          while (cur && guard++ < 100) {
            if (cur === ancestor) return true;
            const n = findNode(cur);
            cur = n ? n.node.parent : null;
          }
          return false;
        }
        function visibleNodes() {
          const out = [];
          childrenOf(ui.folder).forEach(function(c) {
            out.push({ type: c.type, node: c.node, depth: 0 });
          });
          return out;
        }
        function initialsBk(name) {
          const w = String(name).trim().split(/\s+/).filter(Boolean);
          return (w.slice(0, 2).map(function(x) {
            return x[0];
          }).join("") || "?").toUpperCase();
        }
        const GSTATIC = "https://ssl.gstatic.com/images/branding/product/2x/";
        const OFFICIAL_ICONS = {
          "mail.google.com": GSTATIC + "gmail_2020q4_64dp.png",
          "drive.google.com": GSTATIC + "drive_2020q4_64dp.png",
          "docs.google.com": GSTATIC + "docs_2020q4_64dp.png",
          "sheets.google.com": GSTATIC + "sheets_2020q4_64dp.png",
          "slides.google.com": GSTATIC + "slides_2020q4_64dp.png",
          "calendar.google.com": GSTATIC + "calendar_2020q4_64dp.png",
          "keep.google.com": GSTATIC + "keep_2020q4_64dp.png",
          "meet.google.com": GSTATIC + "meet_2020q4_64dp.png",
          "translate.google.co.in": "https://www.google.com/s2/favicons?domain=translate.google.com&sz=128",
          "translate.google.com": "https://www.google.com/s2/favicons?domain=translate.google.com&sz=128",
          "maps.google.com": "https://www.google.com/s2/favicons?domain=maps.google.com&sz=128",
          "youtube.com": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
          "photos.google.com": "https://www.google.com/s2/favicons?domain=photos.google.com&sz=128",
          "forms.google.com": "https://www.google.com/s2/favicons?domain=forms.google.com&sz=128",
          "google.com": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
          "chat.deepseek.com": "https://fe-static.deepseek.com/chat/icon-180.png",
          "deepseek.com": "https://fe-static.deepseek.com/chat/icon-180.png"
        };
        function officialIcon(url) {
          let u;
          try {
            u = new URL(url);
          } catch {
            return null;
          }
          const h = u.hostname.replace(/^www\./, "").toLowerCase();
          const p = u.pathname || "";
          if (h === "google.com") {
            if (p.indexOf("/maps") === 0) return OFFICIAL_ICONS["maps.google.com"];
            if (p.indexOf("/translate") === 0) return OFFICIAL_ICONS["translate.google.com"];
            if (p.indexOf("/calendar") === 0) return OFFICIAL_ICONS["calendar.google.com"];
            if (p.indexOf("/drive") === 0) return OFFICIAL_ICONS["drive.google.com"];
            if (p.indexOf("/photos") === 0) return OFFICIAL_ICONS["photos.google.com"];
            if (p.indexOf("/gmail") === 0 || p.indexOf("/mail") === 0) return OFFICIAL_ICONS["mail.google.com"];
            if (p.indexOf("/keep") === 0) return OFFICIAL_ICONS["keep.google.com"];
            if (p.indexOf("/meet") === 0) return OFFICIAL_ICONS["meet.google.com"];
            if (p.indexOf("/forms") === 0) return OFFICIAL_ICONS["forms.google.com"];
            if (p.indexOf("/sheets") === 0) return OFFICIAL_ICONS["sheets.google.com"];
            if (p.indexOf("/slides") === 0) return OFFICIAL_ICONS["slides.google.com"];
            if (p.indexOf("/docs") === 0) return OFFICIAL_ICONS["docs.google.com"];
            return OFFICIAL_ICONS["google.com"];
          }
          if (h === "docs.google.com") {
            if (p.indexOf("/spreadsheets") === 0) return OFFICIAL_ICONS["sheets.google.com"];
            if (p.indexOf("/presentation") === 0) return OFFICIAL_ICONS["slides.google.com"];
            if (p.indexOf("/forms") === 0) return OFFICIAL_ICONS["forms.google.com"];
          }
          return OFFICIAL_ICONS[h] || null;
        }
        function faviconCands(url) {
          let h;
          try {
            h = new URL(url).hostname.replace(/^www\./, "");
          } catch {
            return [];
          }
          const cands = [];
          const first = officialIcon(url);
          if (first) cands.push(first);
          cands.push(
            "https://" + h + "/apple-touch-icon.png",
            "https://" + h + "/favicon.ico",
            "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(h) + "&sz=64",
            "https://icons.duckduckgo.com/ip3/" + encodeURIComponent(h) + ".ico"
          );
          return cands;
        }
        const ICON_CACHE_KEY = "glisters-icons";
        const persistedIconsBk = /* @__PURE__ */ Object.create(null);
        let iconPersistTimerBk = null;
        function loadPersistedIconsBk() {
          try {
            const raw = localStorage.getItem(ICON_CACHE_KEY);
            if (raw) {
              const m = JSON.parse(raw);
              for (const k in m) if (typeof m[k] === "string") persistedIconsBk[k] = m[k];
            }
          } catch {
          }
          if (window.chrome && chrome.storage && chrome.storage.local) {
            try {
              chrome.storage.local.get(ICON_CACHE_KEY, function(o) {
                const m = o && o[ICON_CACHE_KEY];
                if (m && typeof m === "object") {
                  for (const k2 in m) if (typeof m[k2] === "string") persistedIconsBk[k2] = m[k2];
                }
              });
            } catch {
            }
          }
        }
        function persistIconBk(key, src) {
          if (!key || !src) return;
          persistedIconsBk[key] = src;
          if (iconPersistTimerBk) clearTimeout(iconPersistTimerBk);
          iconPersistTimerBk = setTimeout(function() {
            try {
              localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(persistedIconsBk));
            } catch {
            }
            if (window.chrome && chrome.storage && chrome.storage.local) {
              try {
                const o = {};
                o[ICON_CACHE_KEY] = persistedIconsBk;
                chrome.storage.local.set(o);
              } catch {
              }
            }
          }, 400);
        }
        function loadFavicon(ic, node) {
          const letter = ic.querySelector(".bk-letter");
          const cached = faviconCache[node.url || ""];
          if (cached) {
            setImg(ic, cached, letter);
            return;
          }
          const cands = faviconCands(node.url || "");
          if (persistedIconsBk[node.url || ""]) cands.unshift(persistedIconsBk[node.url || ""]);
          let done = false;
          for (let i = 0; i < cands.length; i++) {
            (function(src) {
              const img = document.createElement("img");
              img.src = src;
              img.alt = "";
              img.referrerPolicy = "no-referrer";
              img.decoding = "async";
              img.addEventListener("load", function() {
                if (done || img.naturalWidth < 16 || img.naturalHeight < 16) return;
                done = true;
                faviconCache[node.url || ""] = src;
                persistIconBk(node.url || "", src);
                const olds = ic.querySelectorAll("img");
                for (let k = 0; k < olds.length; k++) ic.removeChild(olds[k]);
                if (letter) letter.style.display = "none";
                ic.appendChild(img);
              });
              ic.appendChild(img);
            })(cands[i]);
          }
        }
        function setImg(ic, src, letter) {
          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.referrerPolicy = "no-referrer";
          if (letter) letter.style.display = "none";
          ic.appendChild(img);
        }
        const FOLDER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
        const EDIT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
        const DEL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        function rowEl(v, depth) {
          const node = v.node;
          const isFolder = v.type === "folder";
          const r = elbk("div", "bk-row " + (isFolder ? "folder" : "link"));
          r.dataset.id = node.id;
          r.dataset.type = v.type;
          r.draggable = true;
          r.style.paddingLeft = 10 + depth * 16 + "px";
          r.setAttribute("role", "treeitem");
          r.setAttribute("aria-level", String(depth + 1));
          if (isFolder) {
            const tw = elbk("span", "bk-twist", "▸");
            tw.setAttribute("aria-hidden", "true");
            r.appendChild(tw);
            const fic = elbk("span", "bk-icon bk-folder");
            fic.innerHTML = FOLDER_SVG;
            r.appendChild(fic);
          } else {
            r.appendChild(elbk("span", "bk-twist", ""));
            const ic = elbk("span", "bk-icon");
            ic.appendChild(elbk("span", "bk-letter", initialsBk(node.name)));
            r.appendChild(ic);
            loadFavicon(ic, node);
          }
          r.appendChild(elbk("span", "bk-name", node.name));
          const ctx = elbk("span", "bk-ctx");
          const eb = elbk("button", "bk-ctx-btn bk-ctx-edit");
          eb.type = "button";
          eb.title = "edit";
          eb.setAttribute("aria-label", "edit " + node.name);
          eb.innerHTML = EDIT_SVG;
          eb.addEventListener("click", function(ev) {
            ev.stopPropagation();
            openEditor(node.parent, v.type, node);
          });
          const db = elbk("button", "bk-ctx-btn bk-ctx-del");
          db.type = "button";
          db.title = "delete";
          db.setAttribute("aria-label", "delete " + node.name);
          db.innerHTML = DEL_SVG;
          db.addEventListener("click", function(ev) {
            ev.stopPropagation();
            armOrDelete(node.id);
          });
          ctx.appendChild(eb);
          ctx.appendChild(db);
          r.appendChild(ctx);
          return r;
        }
        function crumbEl(label, folderId, current) {
          const c = elbk("button", "bk-crumb" + (current ? " current" : ""));
          c.type = "button";
          c.textContent = label;
          if (!current) {
            c.addEventListener("click", function() {
              openFolder(folderId);
            });
          }
          return c;
        }
        function renderCrumbs(ids) {
          if (!crumbsEl) return;
          crumbsEl.innerHTML = "";
          crumbsEl.appendChild(crumbEl("home", null, ids.length === 0));
          for (let i = 0; i < ids.length; i++) {
            const f = findFolder(ids[i]);
            if (!f) continue;
            crumbsEl.appendChild(elbk("span", "bk-crumb-sep", "/"));
            crumbsEl.appendChild(crumbEl(f.name, f.id, i === ids.length - 1));
          }
        }
        function editorEl() {
          const ed = ui.editor;
          const form = elbk("form", "bk-editor");
          const nf = elbk("label", "bk-field");
          nf.appendChild(elbk("span", "", "name"));
          const ni = elbk("input", "bk-en");
          ni.type = "text";
          ni.autocomplete = "off";
          ni.spellcheck = false;
          ni.placeholder = ed.type === "folder" ? "folder name" : "name";
          ni.value = ed.node ? ed.node.name : "";
          nf.appendChild(ni);
          form.appendChild(nf);
          if (ed.type === "link") {
            const uf = elbk("label", "bk-field");
            uf.appendChild(elbk("span", "", "url"));
            const uin = elbk("input", "bk-ur");
            uin.type = "text";
            uin.autocomplete = "off";
            uin.spellcheck = false;
            uin.placeholder = "example.com";
            uin.value = ed.node ? ed.node.url || "" : "";
            uf.appendChild(uin);
            form.appendChild(uf);
          }
          const acts = elbk("div", "bk-editor-actions");
          const cancel = elbk("button", "bk-btn", "cancel");
          cancel.type = "button";
          const save = elbk("button", "bk-btn", "save");
          save.type = "submit";
          acts.appendChild(cancel);
          acts.appendChild(save);
          form.appendChild(acts);
          cancel.addEventListener("click", cancelEditor);
          form.addEventListener("submit", function(e) {
            e.preventDefault();
            saveEditor(form);
          });
          return form;
        }
        function render() {
          ui.visible = visibleNodes();
          let focusId = ui.focusedId, hasFocus = false;
          for (let i = 0; i < ui.visible.length; i++) {
            if (ui.visible[i].node.id === focusId) {
              hasFocus = true;
              break;
            }
          }
          if (!hasFocus) focusId = ui.visible.length ? ui.visible[0].node.id : null;
          ui.focusedId = focusId;
          tree.innerHTML = "";
          if (ui.editor) tree.appendChild(editorEl());
          for (let i = 0; i < ui.visible.length; i++) {
            const v = ui.visible[i];
            const r = rowEl(v, v.depth);
            if (v.node.id === focusId) r.classList.add("focused");
            if (v.node.id === ui.armedId) r.classList.add("armed");
            tree.appendChild(r);
          }
          const hasRows = ui.visible.length > 0;
          if (emptyEl) {
            emptyEl.style.display = !hasRows && !ui.editor ? "flex" : "none";
            const t1 = emptyEl.querySelector(".bk-empty-title");
            const t2 = emptyEl.querySelector(".bk-empty-sub");
            if (t1) t1.textContent = ui.folder ? "no bookmarks here" : "no bookmarks yet";
            if (t2) t2.textContent = "press a to add your first link";
          }
          if (backBtn) backBtn.classList.toggle("disabled", ui.folder == null);
          if (crumbsEl) renderCrumbs(folderPathIds(ui.folder));
          if (ui.editor) {
            const nameInp = tree.querySelector(".bk-en");
            if (nameInp) nameInp.focus();
          }
        }
        function updateArmed() {
          const rows = tree.querySelectorAll(".bk-row");
          for (let i = 0; i < rows.length; i++) {
            rows[i].classList.toggle("armed", rows[i].dataset.id === ui.armedId);
          }
        }
        function disarm() {
          if (ui.armedId == null && ui.armTimer == null) return;
          ui.armedId = null;
          if (ui.armTimer) clearTimeout(ui.armTimer);
          ui.armTimer = null;
          updateArmed();
        }
        function setFocused(id) {
          ui.focusedId = id;
          disarm();
          const rows = tree.querySelectorAll(".bk-row");
          for (let i = 0; i < rows.length; i++) {
            const f = rows[i].dataset.id === id;
            rows[i].classList.toggle("focused", f);
            if (f) {
              try {
                rows[i].scrollIntoView({ block: "nearest" });
              } catch {
              }
            }
          }
        }
        function moveFocus(d) {
          const n = ui.visible.length;
          if (!n) return;
          let cur = -1;
          for (let i = 0; i < n; i++) if (ui.visible[i].node.id === ui.focusedId) {
            cur = i;
            break;
          }
          const ni = cur < 0 ? d > 0 ? 0 : n - 1 : Math.max(0, Math.min(n - 1, cur + d));
          setFocused(ui.visible[ni].node.id);
        }
        function visibleFocused() {
          if (!ui.focusedId) return null;
          for (let i = 0; i < ui.visible.length; i++) {
            if (ui.visible[i].node.id === ui.focusedId) return ui.visible[i];
          }
          return null;
        }
        function focusFirst() {
          if (ui.visible.length) setFocused(ui.visible[0].node.id);
        }
        function focusLast() {
          if (ui.visible.length) setFocused(ui.visible[ui.visible.length - 1].node.id);
        }
        function normUrlBk(url) {
          const u = String(url).trim();
          if (!u) return "";
          if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return "https://" + u;
          const scheme = u.slice(0, u.indexOf(":")).toLowerCase();
          if (scheme === "http" || scheme === "https" || scheme === "mailto") return u;
          return "";
        }
        function openInNewTab(url) {
          if (!url) return;
          if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
            try {
              chrome.tabs.create({ url, active: false });
              return;
            } catch {
            }
          }
          try {
            const w = window.open(url, "_blank");
            if (w) return;
          } catch {
          }
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener";
          (document.body || document.documentElement).appendChild(a);
          ignoreOutsideClick = true;
          try {
            a.click();
          } finally {
            ignoreOutsideClick = false;
          }
          a.remove();
        }
        function openFolder(id) {
          if (id === "1") id = null;
          if (id != null && !findFolder(id)) return;
          ui.folder = id;
          ui.focusedId = null;
          render();
        }
        function goBack() {
          if (ui.folder == null) return;
          const prev = ui.folder;
          const f = findFolder(prev);
          ui.folder = f ? homeOf(f.parent) : null;
          ui.focusedId = prev;
          render();
        }
        function openFocused() {
          const v = visibleFocused();
          if (!v) return;
          if (v.type === "link") {
            openInNewTab(normUrlBk(v.node.url || ""));
            return;
          }
          openFolder(v.node.id);
        }
        function rightKey() {
          const v = visibleFocused();
          if (!v) return;
          if (v.type === "folder") openFolder(v.node.id);
        }
        function leftKey() {
          goBack();
        }
        function addParent() {
          const v = visibleFocused();
          if (!v) return ui.folder;
          return v.type === "folder" ? v.node.id : v.node.parent ?? null;
        }
        function openEditor(parent, type, node) {
          ui.editor = { parent: parent ?? null, type, node: node || null };
          render();
          const inp = tree.querySelector(".bk-en");
          if (inp) inp.focus();
        }
        function cancelEditor() {
          ui.editor = null;
          render();
        }
        function saveEditor(form) {
          const ed = ui.editor;
          if (!ed) return;
          const bk = chromeBk();
          if (!bk) {
            cancelEditor();
            return;
          }
          const nameInp = form.querySelector(".bk-en");
          const urlInp = form.querySelector(".bk-ur");
          const name = nameInp.value.trim();
          const url = ed.type === "link" ? normUrlBk(urlInp ? urlInp.value : "") : "";
          let ok = true;
          nameInp.classList.remove("err");
          if (!name) {
            nameInp.classList.add("err");
            ok = false;
          }
          if (ed.type === "link" && !url) {
            if (urlInp) urlInp.classList.add("err");
            ok = false;
          }
          if (!ok) return;
          const done = function(created) {
            const focusId = created && created.id || ed.node && ed.node.id || null;
            ui.editor = null;
            if (ed.parent) ui.folder = homeOf(ed.parent);
            saveUI();
            render();
            refresh().then(function() {
              if (focusId) setFocused(focusId);
            });
          };
          if (ed.node) {
            const upd = { title: name };
            if (ed.type === "link") upd.url = url;
            try {
              bk.update(ed.node.id, upd, function(r) {
                done(r || null);
              });
            } catch {
              cancelEditor();
            }
          } else {
            const o = { parentId: homeIdOf(ed.parent), title: name };
            if (ed.type === "link") o.url = url;
            try {
              bk.create(o, function(r) {
                done(r || null);
              });
            } catch {
              cancelEditor();
            }
          }
        }
        function armOrDelete(id) {
          const target = id || ui.focusedId;
          if (!target || !findNode(target)) return;
          if (ui.armedId === target) {
            deleteNode(target);
            return;
          }
          ui.armedId = target;
          if (ui.armTimer) clearTimeout(ui.armTimer);
          ui.armTimer = setTimeout(function() {
            disarm();
          }, 2500);
          updateArmed();
        }
        function deleteNode(id) {
          const n = findNode(id);
          if (!n) return;
          const parent = n.node.parent;
          const bk = chromeBk();
          if (!bk) return;
          const done = function() {
            ui.focusedId = parent;
            disarm();
            refresh();
          };
          try {
            if (n.type === "folder") bk.removeTree(id, done);
            else bk.remove(id, done);
          } catch {
          }
        }
        function clearDrop() {
          tree.classList.remove("drop-root");
          const rows = tree.querySelectorAll(".bk-row");
          for (let i = 0; i < rows.length; i++) {
            rows[i].classList.remove("drop-before", "drop-into", "dragging");
          }
        }
        function moveNode(id, newParent, newIndex) {
          const n = findNode(id);
          if (!n) return;
          if (n.type === "folder" && (newParent === id || isDescendant(newParent, id))) return;
          const bk = chromeBk();
          if (!bk) return;
          try {
            bk.move(id, { parentId: homeIdOf(newParent), index: newIndex }, function() {
              ui.focusedId = id;
              refresh();
            });
          } catch {
          }
        }
        tree.addEventListener("dragstart", function(e) {
          const r = e.target.closest(".bk-row");
          if (!r) {
            e.preventDefault();
            return;
          }
          ui.dragId = r.dataset.id;
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", ui.dragId);
          r.classList.add("dragging");
        });
        tree.addEventListener("dragend", function() {
          ui.dragId = null;
          clearDrop();
        });
        tree.addEventListener("dragover", function(e) {
          if (!ui.dragId) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          const r = e.target.closest(".bk-row");
          clearDrop();
          if (r && r.dataset.type === "folder") r.classList.add("drop-into");
          else if (r) r.classList.add("drop-before");
          else tree.classList.add("drop-root");
        });
        tree.addEventListener("drop", function(e) {
          if (!ui.dragId) return;
          e.preventDefault();
          const id = ui.dragId;
          const r = e.target.closest(".bk-row");
          let dest;
          if (r && r.dataset.type === "folder") {
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
        function setOpen(open) {
          if (open === ui.open) return;
          ui.open = open;
          root.classList.toggle("open", open);
          root.setAttribute("aria-hidden", String(!open));
          saveUI();
          if (open) render();
        }
        function togglePanel() {
          setOpen(!ui.open);
        }
        if (toggleBtn) toggleBtn.addEventListener("click", togglePanel);
        if (closeBtn) closeBtn.addEventListener("click", function() {
          setOpen(false);
        });
        if (chromeBtn) {
          chromeBtn.addEventListener("click", function() {
            if (chromeBtn.classList.contains("syncing")) return;
            chromeBtn.classList.add("syncing");
            refresh().then(function() {
              chromeBtn.classList.remove("syncing");
            });
          });
        }
        if (backBtn) backBtn.addEventListener("click", goBack);
        if (emptyAddBtn) emptyAddBtn.addEventListener("click", function() {
          openEditor(ui.folder, "link", null);
        });
        tree.addEventListener("click", function(e) {
          const r = e.target.closest(".bk-row");
          if (!r || e.target.closest(".bk-ctx-btn")) return;
          const id = r.dataset.id ?? null;
          ui.focusedId = id;
          let v = null;
          for (let i = 0; i < ui.visible.length; i++) if (ui.visible[i].node.id === id) v = ui.visible[i];
          if (!v) return;
          if (v.type === "link") openInNewTab(normUrlBk(v.node.url || ""));
          else openFolder(id);
        });
        tree.addEventListener("contextmenu", function(e) {
          if (e.target.closest(".bk-row")) e.preventDefault();
        });
        document.addEventListener("click", function(e) {
          if (!ui.open || ignoreOutsideClick) return;
          if (e.target && e.target.closest && (e.target.closest("#bk") || e.target.closest("#bkToggle"))) return;
          setOpen(false);
        }, true);
        document.addEventListener("keydown", function(e) {
          if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
          const typing = isTyping(e.target);
          const modalOpen = isVisible("#modal");
          const drawerOpen = !!($bk("#drawer") && $bk("#drawer").classList.contains("open"));
          const barOpen = isVisible("#bar");
          if (modalOpen || drawerOpen || barOpen) {
            if (ui.open && e.key === "Escape") {
              setOpen(false);
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }
          if (typing) {
            if (ui.editor && e.key === "Escape") {
              cancelEditor();
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }
          if (!ui.open) {
            if (e.key === "b" || e.key === "B") {
              setOpen(true);
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }
          let handled = true;
          switch (e.key) {
            case "b":
            case "B":
            case "Escape":
              if (ui.editor) cancelEditor();
              else if (ui.armedId) disarm();
              else setOpen(false);
              break;
            case "j":
            case "ArrowDown":
              moveFocus(1);
              break;
            case "k":
            case "ArrowUp":
              moveFocus(-1);
              break;
            case "l":
            case "ArrowRight":
              rightKey();
              break;
            case "h":
            case "ArrowLeft":
              leftKey();
              break;
            case "Enter":
            case "o":
            case "O":
              openFocused();
              break;
            case "a":
              openEditor(addParent(), "link", null);
              break;
            case "A":
              openEditor(addParent(), "folder", null);
              break;
            case "e":
            case "E": {
              const v = visibleFocused();
              if (v) openEditor(v.node.parent, v.type, v.node);
              break;
            }
            case "d":
            case "D":
              armOrDelete();
              break;
            case "g":
            case "Home":
              focusFirst();
              break;
            case "G":
            case "End":
              focusLast();
              break;
            case "Tab":
              break;
            default:
              handled = false;
          }
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        window.BOOKMARKS = {
          bind: function() {
          },
          forDoc: function() {
            return null;
          },
          restore: function() {
          },
          refreshFromChrome: function() {
            return refresh();
          }
        };
        bindChromeEvents();
        loadPersistedIconsBk();
        let uiSaved = null;
        try {
          uiSaved = JSON.parse(localStorage.getItem(UI_KEY) || "null");
        } catch {
        }
        if (uiSaved && uiSaved.open) {
          ui.open = true;
          root.classList.add("open");
          root.setAttribute("aria-hidden", "false");
        }
        refresh();
      })();
    }
  });
  require_bookmarks();
})();
