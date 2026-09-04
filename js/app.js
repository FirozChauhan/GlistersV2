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
  var require_app = __commonJS({
    "src/app.ts"() {
      (function() {
        "use strict";
        const CF = window.CONFIG || {};
        const SYNC_ENABLED = !!(CF.gistId && CF.githubToken);
        const STORE_KEY = "glisters";
        const SEED_FLAG_KEY = "glisters-seed";
        const SEED_VERSION = 2;
        const DEFAULT_SITES = [
          { name: "Youtube", url: "https://youtube.com", id: "" },
          { name: "BlackFlag", url: "https://docs.google.com/spreadsheets/d/177cnuV9QlHmO6bAGdO1xgN04xnQJCAuLOcj0ckmy4Yk/edit?gid=1167406126#gid=1167406126", id: "" },
          { name: "Google Maps", url: "https://maps.google.com/", id: "" },
          { name: "Google Images", url: "https://images.google.com/", id: "" },
          { name: "DeepSeek", url: "https://chat.deepseek.com/", id: "" },
          { name: "Google Drive", url: "https://drive.google.com/drive/home", id: "" },
          { name: "Tuta Mail", url: "https://app.tuta.com/mail/Ohr3gNy--F-9", id: "" },
          { name: "GitHub", url: "https://github.com/FirozChauhan", id: "" },
          { name: "Javascript Compiler", url: "https://nextleap.app/online-compiler/javascript-programming", id: "" },
          { name: "WhatsApp", url: "https://web.whatsapp.com/", id: "" },
          { name: "x.com", url: "https://x.com/", id: "" },
          { name: "ImageKit Dashboard", url: "https://imagekit.io/dashboard/media-library/L0hBWkVM", id: "" },
          { name: "Instagram", url: "https://www.instagram.com/", id: "" },
          { name: "Cloudflare R2", url: "https://dash.cloudflare.com/a30112ac3e6966496265c81adcab8fcf/r2/default/buckets/jigar", id: "" },
          { name: "FitGirl", url: "https://fitgirl-repacks.site/", id: "" },
          { name: "Pinterest", url: "https://www.pinterest.com/", id: "" },
          { name: "Wallhaven", url: "https://wallhaven.cc/", id: "" },
          { name: "Fast.com", url: "https://fast.com/", id: "" },
          { name: "Pirate Bay", url: "https://thepiratebay.org", id: "" },
          { name: "Amazon", url: "http://amazon.in", id: "" },
          { name: "Google Translate", url: "https://translate.google.co.in/?sl=auto&tl=en&op=translate", id: "" },
          { name: "Google Docs", url: "http://docs.google.com", id: "" },
          { name: "WordCounter", url: "https://wordcounter.net/", id: "" },
          { name: "AnkerGames", url: "https://ankergames.net/", id: "" },
          { name: "Render", url: "https://dashboard.render.com/", id: "" },
          { name: "Neon", url: "https://console.neon.tech/app", id: "" },
          { name: "Paletton", url: "https://paletton.com/", id: "" },
          { name: "GroqCloud", url: "https://console.groq.com/home", id: "" },
          { name: "Cloudinary", url: "https://console.cloudinary.com/app", id: "" },
          { name: "Gmail", url: "https://mail.google.com/mail/u/3/#inbox", id: "" },
          { name: "XXXClub", url: "https://xxxclub.to/", id: "" },
          { name: "RARBG", url: "https://rargb.to/", id: "" },
          { name: "NSFW - Google Drive", url: "https://drive.google.com/drive/u/1/folders/14MIlVL7UX7k7pPItT6c0ovUzZai_oO15", id: "" },
          { name: "DropMMS", url: "https://dropmms.co/forum/2-desi-new-videos-hd-sd/", id: "" },
          { name: "Masti Raja", url: "https://mastiraja.com/", id: "" },
          { name: "Reddit", url: "http://www.reddit.com", id: "" },
          { name: "PornPics", url: "https://www.pornpics.com/", id: "" },
          { name: "Emochi", url: "https://emochi.com/", id: "" },
          { name: "AI Character Editor", url: "https://avakson.github.io/character-editor/", id: "" },
          { name: "Elite Babes", url: "https://www.elitebabes.com/", id: "" },
          { name: "ViperGirls", url: "https://viper.to/forum.php", id: "" },
          { name: "character.ai", url: "https://character.ai/", id: "" },
          { name: "Chub AI", url: "https://chub.ai/", id: "" },
          { name: "Streamtape", url: "https://streamtape.com/accpanel", id: "" },
          { name: "EXT", url: "https://ext.to/", id: "" },
          { name: "cookii.ai", url: "https://cookii.ai/", id: "" }
        ];
        const DEFAULTS = {
          version: SEED_VERSION,
          updatedAt: 0,
          sites: DEFAULT_SITES.slice(),
          settings: { iconSize: 68, colGap: 28, rowGap: 28, cols: 8, rows: 3, labels: false, labelOp: 100, labelColor: "#f5f5f5", bkWidth: 500, drWidth: 500, mono: false, wallMono: false, blur: 0 }
        };
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
        const TITLE_CASE = {
          "chat.deepseek.com": "DeepSeek",
          "web.whatsapp.com": "WhatsApp",
          "imagekit.io": "ImageKit",
          "app.tuta.com": "Tuta Mail",
          "console.groq.com": "Groq",
          "console.neon.tech": "Neon",
          "dashboard.render.com": "Render",
          "ankergames.net": "Anker Games",
          "paletton.com": "Paletton",
          "wallhaven.cc": "Wallhaven",
          "thepiratebay.org": "Pirate Bay",
          "x.com": "X",
          "mail.google.com": "Gmail",
          "drive.google.com": "Drive",
          "youtube.com": "YouTube",
          "github.com": "GitHub",
          "translate.google.co.in": "Translate",
          "amazon.in": "Amazon"
        };
        let saved = null;
        try {
          saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
        } catch {
        }
        const needSeed = !saved || !saved.version || saved.version < SEED_VERSION;
        let state;
        if (needSeed) {
          state = Object.assign({}, DEFAULTS);
          state.settings = Object.assign({}, DEFAULTS.settings);
          state.sites = DEFAULT_SITES.slice();
        } else {
          state = normalize(saved) || Object.assign({}, DEFAULTS, { settings: Object.assign({}, DEFAULTS.settings), sites: DEFAULT_SITES.slice() });
        }
        let focused = -1;
        let armed = -1;
        let heartIdx = -1;
        let page = 0;
        let armTimer = null;
        let cloudTimer = null;
        let retryTimer = null;
        let settingTimer = null;
        let dirty = false;
        let seededFromLinks = false;
        {
          let v = null;
          try {
            v = localStorage.getItem(SEED_FLAG_KEY);
          } catch {
          }
          seededFromLinks = v === "1";
        }
        let mode = "none";
        function $(s) {
          return document.querySelector(s);
        }
        function el(tag, cls, text) {
          const n = document.createElement(tag);
          if (cls) n.className = cls;
          if (text != null) n.textContent = text;
          return n;
        }
        function uid() {
          return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        }
        const grid = $("#grid");
        const empty = $("#empty");
        const scrollArea = $("#scroll");
        const bar = $("#bar");
        const barInput = $("#barInput");
        const drawer = $("#drawer");
        const scrim = $("#scrim");
        const modalEl = $("#modal");
        const form = $("#siteForm");
        const nameIn = $("#siteName");
        const urlIn = $("#siteUrl");
        const modalTitle = $("#modalTitle");
        const settingsBtn = $("#settingsBtn");
        const drawerClose = $("#drawerClose");
        const drawerBody = $("#drawerBody");
        const iconPicker = $("#iconPicker");
        const metaStatus = $("#metaStatus");
        const syncNow = $("#syncNow");
        const resetSettings = $("#resetSettings");
        const syncCard = $("#syncCard");
        const syncStatus = $("#syncStatus");
        const stLocal = $("#stLocal");
        const stExt = $("#stExt");
        const backupDownload = $("#backupDownload");
        const backupLoad = $("#backupLoad");
        const backupLoadInput = $("#backupLoadInput");
        const restorePrevious = $("#restorePrevious");
        const emptyAdd = $("#emptyAdd");
        function readLocal() {
          try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        }
        function prettyBase(hostname) {
          const parts = hostname.split(".");
          const base = parts.length > 2 ? parts[parts.length - 2] : parts[0];
          return (base.charAt(0).toUpperCase() + base.slice(1)).replace(/-/g, " ");
        }
        function nameForUrl(raw) {
          let u;
          try {
            u = new URL(raw);
          } catch {
            return raw;
          }
          const h = u.hostname.replace(/^www\./, "");
          const path = u.pathname || "";
          if (h === "docs.google.com") {
            return path.indexOf("/spreadsheets") !== -1 ? "Sheets" : "Docs";
          }
          if (h === "google.com") {
            if (path.indexOf("/maps") !== -1) return "Maps";
            return "Google";
          }
          return TITLE_CASE[h] || prettyBase(h);
        }
        function parseLinks(text) {
          const seen = {};
          const out = [];
          String(text).split(/\r?\n/).forEach(function(line) {
            const url = line.trim();
            if (!url) return;
            let name = nameForUrl(url);
            const key = name.toLowerCase();
            if (seen[key]) {
              seen[key]++;
              name = name + " " + seen[key];
            } else {
              seen[key] = 1;
            }
            out.push({ id: uid(), name, url });
          });
          return out;
        }
        function loadSeed() {
          return fetch("default-save.json", { cache: "no-store" }).then(function(r) {
            if (!r.ok) throw new Error("default-save.json: " + r.status);
            return r.json();
          }).then(function(doc2) {
            const s = normalize(doc2);
            if (!s || !Array.isArray(s.sites) || !s.sites.length) throw new Error("default-save.json: empty");
            return s;
          }).catch(function() {
            return fetch("links.txt", { cache: "no-store" }).then(function(r) {
              if (!r.ok) throw new Error("links.txt: " + r.status);
              return r.text();
            }).then(function(text) {
              const links = parseLinks(text);
              if (!links.length) throw new Error("links.txt: empty");
              return { version: SEED_VERSION, updatedAt: 0, sites: links, settings: Object.assign({}, DEFAULTS.settings) };
            });
          });
        }
        function normalize(o) {
          if (!o || typeof o !== "object") return null;
          const obj = o;
          const d = DEFAULTS.settings;
          const s = {};
          if (obj.settings && typeof obj.settings === "object") {
            const st = obj.settings;
            ["iconSize", "colGap", "rowGap", "cols", "rows", "bkWidth", "drWidth", "blur", "labelOp"].forEach(function(k) {
              const v = st[k];
              s[k] = typeof v === "number" && isFinite(v) ? v : d[k];
            });
            s.labels = st.labels === true;
            s.labelColor = typeof st.labelColor === "string" && /^#[0-9a-fA-F]{3,8}$/.test(st.labelColor) ? st.labelColor : d.labelColor;
            s.mono = st.mono === true;
            s.wallMono = st.wallMono === true;
          } else {
            Object.assign(s, d);
          }
          const sites = Array.isArray(obj.sites) ? obj.sites.filter(function(t) {
            return t && typeof t.name === "string" && typeof t.url === "string";
          }).map(function(t) {
            return {
              id: t.id || uid(),
              name: String(t.name).slice(0, 300),
              url: String(t.url).slice(0, 4096),
              icon: typeof t.icon === "string" && /^https?:\/\//i.test(t.icon) ? t.icon.slice(0, 4096) : void 0
            };
          }) : [];
          return {
            version: SEED_VERSION,
            updatedAt: typeof obj.updatedAt === "number" ? obj.updatedAt : 0,
            sites,
            settings: s,
            bookmarks: obj.bookmarks && typeof obj.bookmarks === "object" ? obj.bookmarks : null,
            walls: obj.walls && typeof obj.walls === "object" ? obj.walls : null
          };
        }
        function doc() {
          const d = { version: SEED_VERSION, updatedAt: state.updatedAt, sites: state.sites, settings: state.settings };
          const bm = window.BOOKMARKS ? window.BOOKMARKS.forDoc() : null;
          if (bm) d.bookmarks = bm;
          if (window.WALLS) d.walls = window.WALLS.forDoc();
          return d;
        }
        function persistLocal() {
          const d = doc();
          try {
            localStorage.setItem(STORE_KEY, JSON.stringify(d));
          } catch {
          }
          if (window.chrome && chrome.storage && chrome.storage.local) {
            const o = {};
            o[STORE_KEY] = d;
            try {
              chrome.storage.local.set(o);
            } catch {
            }
          }
        }
        function restoreFromStorage() {
          return new Promise(function(resolve) {
            if (!(window.chrome && chrome.storage && chrome.storage.local)) {
              resolve(null);
              return;
            }
            try {
              chrome.storage.local.get(STORE_KEY, function(o) {
                try {
                  resolve(o && o[STORE_KEY] || null);
                } catch {
                  resolve(null);
                }
              });
            } catch {
              resolve(null);
            }
          });
        }
        function commit(opts) {
          state.updatedAt = Date.now();
          if (!opts || !opts.noRender) renderAll();
          persistLocal();
          if (!opts || !opts.noCloud) scheduleCloud();
        }
        function mutateSite(fn) {
          fn();
          state.updatedAt = Date.now();
          commit();
        }
        function applyCssVars() {
          if (!grid) return;
          const s = state.settings;
          grid.style.setProperty("--ts", s.iconSize + "px");
          grid.style.setProperty("--colgap", s.colGap + "px");
          grid.style.setProperty("--rowgap", s.rowGap + "px");
          document.documentElement.style.setProperty("--bk-width", (s.bkWidth || 400) + "px");
          document.documentElement.style.setProperty("--dr-width", (s.drWidth || 400) + "px");
          grid.style.setProperty("--cols", String(s.cols));
          grid.style.gridAutoRows = s.iconSize + (s.labels ? 24 : 0) + "px";
          if (s.labels) grid.classList.remove("tile-label-off");
          else grid.classList.add("tile-label-off");
          grid.style.setProperty("--label-op", ((s.labelOp == null ? 100 : s.labelOp) / 100).toFixed(2));
          grid.style.setProperty("--label-color", s.labelColor || "#f5f5f5");
          grid.classList.toggle("tile-mono", s.mono === true);
          document.documentElement.style.setProperty("--wall-blur", (s.blur || 0) + "px");
          document.documentElement.classList.toggle("wall-mono", s.wallMono === true);
        }
        function initials(name) {
          const w = String(name).trim().split(/\s+/).filter(Boolean);
          return (w.slice(0, 2).map(function(x) {
            return x[0];
          }).join("") || "?").toUpperCase();
        }
        function hostOf(url) {
          try {
            return new URL(url).hostname;
          } catch {
            return "";
          }
        }
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
        function iconCandidates(site, deep = false) {
          const h = hostOf(site.url);
          const cands = [];
          if (site.icon) cands.push({ src: site.icon, rank: 100, service: "site" });
          if (!h) return cands;
          const first = officialIcon(site.url);
          if (first) cands.push({ src: first, rank: 95, service: "site" });
          const s2url = function(d) {
            return "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(d) + "&sz=128";
          };
          if (!deep) {
            cands.push({ src: "https://" + h + "/favicon.ico", rank: 80, service: "site" });
            cands.push({ src: "https://" + h + "/apple-touch-icon.png", rank: 88, service: "site" });
            cands.push({ src: "https://icons.duckduckgo.com/ip3/" + encodeURIComponent(h) + ".ico", rank: 72, service: "ddg" });
            cands.push({ src: s2url(h), rank: 68, service: "s2" });
          } else {
            cands.push({ src: "https://" + h + "/favicon.ico", rank: 80, service: "site" });
            cands.push({ src: "https://" + h + "/favicon-32x32.png", rank: 84, service: "site" });
            cands.push({ src: "https://" + h + "/apple-touch-icon.png", rank: 88, service: "site" });
            const variants = [h];
            const parts = h.split(".");
            while (parts.length > 2) {
              parts.shift();
              variants.push(parts.join("."));
            }
            for (let i = 1; i < variants.length; i++) {
              cands.push({ src: s2url(variants[i]), rank: 62, service: "s2", chip: true });
            }
            cands.push({ src: "https://icons.duckduckgo.com/ip3/" + encodeURIComponent(h) + ".ico", rank: 72, service: "ddg" });
            cands.push({ src: s2url(h), rank: 68, service: "s2" });
          }
          return cands;
        }
        const ICON_CACHE_KEY = "glisters-icons";
        const faviconCache = /* @__PURE__ */ Object.create(null);
        const iconLoading = /* @__PURE__ */ Object.create(null);
        const persistedIcons = /* @__PURE__ */ Object.create(null);
        const iconRetries = /* @__PURE__ */ Object.create(null);
        let iconPersistTimer = null;
        let iconDeep = false;
        function loadPersistedIcons() {
          try {
            const raw = localStorage.getItem(ICON_CACHE_KEY);
            if (raw) {
              const m = JSON.parse(raw);
              for (const k in m) if (typeof m[k] === "string") persistedIcons[k] = m[k];
            }
          } catch {
          }
          if (window.chrome && chrome.storage && chrome.storage.local) {
            try {
              chrome.storage.local.get(ICON_CACHE_KEY, function(o) {
                const m = o && o[ICON_CACHE_KEY];
                if (m && typeof m === "object") {
                  for (const k2 in m) if (typeof m[k2] === "string") persistedIcons[k2] = m[k2];
                }
              });
            } catch {
            }
          }
        }
        function persistIcon(key, src) {
          if (!key || !src) return;
          persistedIcons[key] = src;
          if (iconPersistTimer) clearTimeout(iconPersistTimer);
          iconPersistTimer = setTimeout(function() {
            try {
              localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(persistedIcons));
            } catch {
            }
            if (window.chrome && chrome.storage && chrome.storage.local) {
              try {
                const o = {};
                o[ICON_CACHE_KEY] = persistedIcons;
                chrome.storage.local.set(o);
              } catch {
              }
            }
          }, 400);
        }
        function scheduleIconRetry(key) {
          if (!key || mode !== "none" || dragUi) return;
          const n = (iconRetries[key] || 0) + 1;
          iconRetries[key] = n;
          if (n > 5) return;
          setTimeout(function() {
            retryIcon(key);
          }, n * 2500);
        }
        function retryIcon(key) {
          if (faviconCache[key] !== false || mode !== "none" || dragUi) return;
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
        function replaceTile(idx) {
          if (!grid) return;
          const b = grid.querySelector('[data-idx="' + idx + '"]');
          if (!b) return;
          const nb = tileEl(state.sites[idx], idx);
          b.parentNode.replaceChild(nb, b);
          renderTileStates();
        }
        function refreshKeyTile(key) {
          if (!key || !grid || mode !== "none" || dragUi) return;
          for (let i = pageStart(); i <= pageEnd(); i++) {
            const s = state.sites[i];
            if (!s || s.url !== key) continue;
            const t = grid.querySelector('.tile[data-idx="' + i + '"]');
            if (!t) continue;
            const hasIcon = !!t.querySelector(".icon img.loaded");
            if (!hasIcon) replaceTile(i);
            return;
          }
        }
        function retryAllFailed() {
          if (mode !== "none" || dragUi) return;
          let any = false;
          for (const k in faviconCache) {
            if (faviconCache[k] === false) {
              delete faviconCache[k];
              any = true;
            }
          }
          if (any) renderGrid();
        }
        function serviceOf(src) {
          if (/google\.com\/s2\/favicons|gstatic\.com\/faviconV2/i.test(src)) return "s2";
          if (/icons\.duckduckgo\.com\/ip3/i.test(src)) return "ddg";
          return "site";
        }
        function loadIcon(ic, letter, cands, key, onFail) {
          let bestImg = null;
          let bestSrc = "";
          let bestRank = -1;
          let bestW = 0;
          let settled = false;
          let settleT = null;
          const guard = setTimeout(function() {
            finalize();
          }, 8e3);
          let pending = cands.length;
          if (pending === 0) {
            clearTimeout(guard);
            if (key) {
              iconLoading[key] = false;
              faviconCache[key] = false;
              scheduleIconRetry(key);
            }
            if (onFail) onFail();
            return;
          }
          for (let i = 0; i < cands.length; i++) trySrc(cands[i]);
          function showBest() {
            if (!bestImg || settled) return;
            const kids = Array.prototype.slice.call(ic.children);
            for (let k = 0; k < kids.length; k++) {
              const kid = kids[k];
              if (kid.tagName === "IMG") {
                if (kid === bestImg) {
                  kid.style.opacity = "";
                  kid.classList.add("loaded");
                } else {
                  kid.style.opacity = "0";
                  kid.classList.remove("loaded");
                }
              }
            }
            if (bestImg.parentNode !== ic) ic.appendChild(bestImg);
            if (letter && !letter.classList.contains("out")) {
              letter.classList.add("out");
              setTimeout(function() {
                letter.style.display = "none";
              }, 230);
            }
          }
          function finalize() {
            if (settled) return;
            settled = true;
            clearTimeout(guard);
            if (settleT) clearTimeout(settleT);
            if (key) iconLoading[key] = false;
            if (bestImg) {
              const kids = Array.prototype.slice.call(ic.children);
              for (let k = 0; k < kids.length; k++) {
                if (kids[k].tagName === "IMG" && kids[k] !== bestImg) {
                  kids[k].remove();
                }
              }
              if (bestImg.parentNode !== ic) ic.appendChild(bestImg);
              bestImg.style.opacity = "";
              bestImg.classList.add("loaded");
              if (letter) {
                letter.classList.add("out");
                setTimeout(function() {
                  letter.style.display = "none";
                }, 230);
              }
              const nw = bestImg.naturalWidth, nh = bestImg.naturalHeight;
              if (nw > 0 && nw < 40) {
                const cap = Math.floor(ic.offsetWidth * 0.55);
                let scale = 1;
                while (nw * (scale + 1) <= cap && nh * (scale + 1) <= cap) scale++;
                if (scale > 1) bestImg.classList.add("sharp");
                bestImg.style.width = nw * scale + "px";
                bestImg.style.height = nh * scale + "px";
              }
              if (key) {
                faviconCache[key] = bestImg;
                if (bestSrc) persistIcon(key, bestSrc);
                else if (bestImg.src) persistIcon(key, bestImg.src);
                refreshKeyTile(key);
              }
            } else if (key) {
              faviconCache[key] = false;
              scheduleIconRetry(key);
              if (onFail) onFail();
            }
          }
          function isFake(c, w, h) {
            if (w < 16 || h < 16) return true;
            if (c.service === "s2" && w <= 16 && h <= 16) return true;
            return false;
          }
          function maybeSettle() {
            if (settled || !bestImg) return;
            if (bestRank >= 85 && bestW >= 48) {
              finalize();
              return;
            }
            if (settleT) clearTimeout(settleT);
            settleT = setTimeout(finalize, 380);
          }
          function trySrc(c) {
            const img = document.createElement("img");
            img.alt = "";
            img.draggable = false;
            img.decoding = "async";
            img.referrerPolicy = "no-referrer";
            let done = false;
            const idle = setTimeout(function() {
              if (done || settled) return;
              done = true;
              if (img.parentNode) img.remove();
              allPendingDone();
            }, 7500);
            function resolve(ok, w, h) {
              if (done || settled) return;
              done = true;
              clearTimeout(idle);
              if (!ok || isFake(c, w, h)) {
                if (img.parentNode) img.remove();
                allPendingDone();
                return;
              }
              const rank = c.rank;
              const effW = Math.min(w, 128);
              const effBW = Math.min(bestW, 128);
              const improved = !bestImg || effW > effBW || effW === effBW && rank > bestRank;
              if (improved) {
                bestRank = rank;
                bestW = w;
                bestImg = img;
                bestSrc = c.src;
                showBest();
                maybeSettle();
              }
              allPendingDone();
            }
            img.addEventListener("load", function() {
              resolve(true, img.naturalWidth, img.naturalHeight);
            });
            img.addEventListener("error", function() {
              resolve(false, 0, 0);
            });
            ic.appendChild(img);
            img.style.opacity = "0";
            img.src = c.src;
          }
          function allPendingDone() {
            pending--;
            if (pending <= 0) finalize();
          }
        }
        let prefetchTimer = null;
        let prefetchQueue = [];
        let prefetchPos = 0;
        function prefetchStep() {
          if (prefetchPos >= prefetchQueue.length) {
            prefetchTimer = null;
            return;
          }
          const host = document.getElementById("__iconPrefetch");
          if (!host) {
            prefetchTimer = null;
            return;
          }
          let batch = 4;
          while (batch > 0 && prefetchPos < prefetchQueue.length) {
            const site = state.sites[prefetchQueue[prefetchPos]];
            prefetchPos++;
            batch--;
            if (!site || !site.url) continue;
            const key = site.url;
            if (faviconCache[key] !== void 0 || iconLoading[key]) continue;
            iconLoading[key] = true;
            const ic = el("span", "icon");
            const letter = el("span", "letter", initials(site.name));
            ic.appendChild(letter);
            host.appendChild(ic);
            const cands = iconCandidates(site, iconDeep);
            if (cands.length) loadIcon(ic, letter, cands, key);
            else {
              iconLoading[key] = false;
              faviconCache[key] = false;
            }
          }
          if (prefetchPos < prefetchQueue.length) prefetchTimer = setTimeout(prefetchStep, 300);
          else prefetchTimer = null;
        }
        function prefetchRemaining() {
          if (state.sites.length === 0) return;
          let host = document.getElementById("__iconPrefetch");
          if (!host) {
            host = el("div", "");
            host.id = "__iconPrefetch";
            host.setAttribute("style", "position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;pointer-events:none;");
            document.body.appendChild(host);
          }
          prefetchQueue = [];
          for (let i = 0; i < state.sites.length; i++) {
            const site = state.sites[i];
            if (!site || !site.url) continue;
            const key = site.url;
            if (faviconCache[key] !== void 0 || iconLoading[key]) continue;
            prefetchQueue.push(i);
          }
          prefetchPos = 0;
          if (prefetchTimer) clearTimeout(prefetchTimer);
          if (prefetchQueue.length) prefetchTimer = setTimeout(prefetchStep, 200);
        }
        function tileEl(site, i) {
          const b = el("button", "tile");
          b.type = "button";
          b.dataset.idx = String(i);
          b.title = site.name + " — " + site.url;
          b.draggable = false;
          const ic = el("span", "icon");
          const letter = el("span", "letter", initials(site.name));
          ic.appendChild(letter);
          const key = site.url;
          const cached = faviconCache[key];
          if (cached) {
            const img = cached.cloneNode(false);
            img.alt = "";
            img.draggable = false;
            img.decoding = "async";
            img.referrerPolicy = "no-referrer";
            img.classList.add("loaded", "instant");
            ic.appendChild(img);
            if (letter) letter.style.display = "none";
          } else if (cached === void 0 && !iconLoading[key]) {
            iconLoading[key] = true;
            if (persistedIcons[key] && !site.icon) {
              loadIcon(ic, letter, [{ src: persistedIcons[key], rank: 100, service: serviceOf(persistedIcons[key]) }], key, function() {
                delete persistedIcons[key];
                delete faviconCache[key];
                for (let i2 = pageStart(); i2 <= pageEnd(); i2++) {
                  if (state.sites[i2] && state.sites[i2].url === key) {
                    replaceTile(i2);
                    break;
                  }
                }
              });
            } else {
              const cands = iconCandidates(site, iconDeep);
              if (cands.length) loadIcon(ic, letter, cands, key);
              else {
                iconLoading[key] = false;
                faviconCache[key] = false;
              }
            }
          }
          const editBtn = el("span", "ctx-btn ctx-edit");
          editBtn.setAttribute("role", "button");
          editBtn.setAttribute("aria-label", "edit " + site.name);
          editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
          editBtn.addEventListener("click", function(ev) {
            ev.stopPropagation();
            const idx = state.sites.indexOf(site);
            closeCtx();
            if (idx >= 0) {
              const t = grid.querySelector('[data-idx="' + idx + '"]');
              if (t) t.classList.add("ctx-dim");
            }
            openModal(site);
          });
          const delBtn = el("span", "ctx-btn ctx-delete");
          delBtn.setAttribute("role", "button");
          delBtn.setAttribute("aria-label", "delete " + site.name);
          delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
          delBtn.addEventListener("click", function(ev) {
            ev.stopPropagation();
            closeCtx();
            const idx = state.sites.indexOf(site);
            if (idx >= 0) removeSite(idx);
          });
          ic.appendChild(editBtn);
          ic.appendChild(delBtn);
          b.appendChild(ic);
          b.appendChild(el("span", "label", site.name));
          return b;
        }
        function renderGrid() {
          if (!grid) return;
          grid.innerHTML = "";
          if (state.sites.length === 0) return;
          const start = pageStart();
          const end = pageEnd();
          const cap = cellCapacity();
          for (let i = start; i <= end; i++) {
            grid.appendChild(tileEl(state.sites[i], i));
          }
          for (let j = end - start + 1; j < cap; j++) {
            grid.appendChild(el("div", "cell-empty"));
          }
        }
        function renderTileStates() {
          if (!grid) return;
          const kids = grid.children;
          for (let i = 0; i < kids.length; i++) {
            const t = kids[i];
            const ix = parseInt(t.dataset.idx || "", 10);
            t.classList.toggle("focused", ix === focused);
            t.classList.toggle("armed", ix === armed);
          }
          if (focused >= 0 && focused !== heartIdx) {
            heartIdx = focused;
            const t = grid.querySelector('.tile[data-idx="' + focused + '"]');
            if (t) setHeartRandom(t);
          }
        }
        function setHeartRandom(t) {
          const hue = Math.floor(Math.random() * 360);
          const col = "hsl(" + hue + " 90% 65%)";
          const x = 25 + Math.random() * 50;
          const y = 25 + Math.random() * 50;
          t.style.setProperty("--heart-color", col);
          t.style.setProperty("--heart-x", x.toFixed(1) + "%");
          t.style.setProperty("--heart-y", y.toFixed(1) + "%");
        }
        function updateEmpty() {
          if (!grid || !empty) return;
          const has = state.sites.length > 0;
          empty.hidden = has;
          grid.style.display = has ? "" : "none";
        }
        function cellCapacity() {
          return Math.max(1, state.settings.cols * state.settings.rows);
        }
        function pageCount() {
          return Math.max(1, Math.ceil(state.sites.length / cellCapacity()));
        }
        function pageStart() {
          return page * cellCapacity();
        }
        function pageEnd() {
          const end = pageStart() + cellCapacity() - 1;
          return Math.min(end, state.sites.length - 1);
        }
        function clampPage() {
          if (state.sites.length === 0) page = 0;
          else page = Math.max(0, Math.min(page, pageCount() - 1));
        }
        let pageGhost = null;
        function goPage(p) {
          if (state.sites.length === 0) return;
          if (!grid || !scrollArea) return;
          const pc = pageCount();
          const np = (p % pc + pc) % pc;
          if (np === page) return;
          const dir = p > page ? 1 : -1;
          page = np;
          focused = pageStart();
          animatePage(dir);
          renderGrid();
          renderTileStates();
        }
        function animatePage(dir) {
          if (!grid || !scrollArea) return;
          const wrap = grid.parentElement;
          if (!wrap) return;
          const wp = wrap;
          grid.classList.remove("anim-next", "anim-prev", "anim-reorder");
          if (pageGhost) {
            pageGhost.remove();
            pageGhost = null;
          }
          if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const ghost = grid.cloneNode(true);
          ghost.classList.remove("anim-next", "anim-prev", "anim-reorder", "dragging-active");
          ghost.classList.add("page-snapshot", dir > 0 ? "page-out-next" : "page-out-prev");
          const wr = wp.getBoundingClientRect();
          const r = grid.getBoundingClientRect();
          ghost.style.position = "absolute";
          ghost.style.left = r.left - wr.left + "px";
          ghost.style.top = r.top - wr.top + "px";
          ghost.style.width = r.width + "px";
          ghost.style.margin = "0";
          wp.appendChild(ghost);
          pageGhost = ghost;
          function drop() {
            if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
            if (pageGhost === ghost) pageGhost = null;
          }
          ghost.addEventListener("animationend", drop, { once: true });
          setTimeout(drop, 600);
          void grid.offsetWidth;
          grid.classList.add(dir > 0 ? "anim-next" : "anim-prev");
        }
        function renderAll() {
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
          if (drawer && drawer.classList.contains("open")) syncDrawerDisplay();
        }
        function setFocused(i) {
          armed = -1;
          if (armTimer) clearTimeout(armTimer);
          focused = i;
          renderTileStates();
        }
        function normUrl(url) {
          const u = String(url).trim();
          if (!u) return "";
          if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return "https://" + u;
          const scheme = u.slice(0, u.indexOf(":")).toLowerCase();
          if (scheme === "http" || scheme === "https" || scheme === "mailto") return u;
          return "";
        }
        function openInNewTab(url) {
          try {
            if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
              chrome.tabs.create({ url, active: false });
              return;
            }
          } catch {
          }
          try {
            const w = window.open(url, "_blank", "noopener");
            if (!w) location.assign(url);
          } catch {
            location.assign(url);
          }
        }
        function openInSameTab(url) {
          try {
            location.assign(url);
          } catch {
          }
        }
        function open(i, opts) {
          const n = state.sites.length;
          if (n === 0 || i >= n) {
            openModal(null);
            return;
          }
          const url = normUrl(state.sites[i].url);
          if (!url) return;
          if (opts && opts.newTab) openInNewTab(url);
          else openInSameTab(url);
        }
        function moveV(d, cols) {
          if (focused < 0) {
            focused = pageStart();
            return;
          }
          const start = pageStart();
          const end = pageEnd();
          if (end < start) return;
          const i = focused + d * cols;
          focused = i < start ? start : i > end ? end : i;
        }
        function removeSite(i) {
          if (i < 0 || i >= state.sites.length) return;
          mutateSite(function() {
            state.sites.splice(i, 1);
          });
          armed = -1;
          if (focused >= state.sites.length) focused = state.sites.length - 1;
          if (focused < 0) focused = -1;
        }
        document.addEventListener("keydown", function(e) {
          if (e.defaultPrevented) return;
          if ((e.key === "Enter" || e.key === "o") && (e.ctrlKey || e.metaKey) && mode === "none" && focused >= 0) {
            const t2 = e.target;
            if (t2.tagName !== "INPUT" && t2.tagName !== "TEXTAREA" && t2.tagName !== "SELECT" && !t2.isContentEditable) {
              open(focused, { newTab: true });
              e.preventDefault();
              return;
            }
          }
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (mode === "modal") {
            if (e.key === "Escape") {
              closeModal();
              e.preventDefault();
            }
            return;
          }
          if (mode === "bar") {
            if (e.key === "Escape") {
              closeBar();
              e.preventDefault();
            }
            return;
          }
          const t = e.target;
          const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
          if (typing) return;
          if (mode === "drawer") {
            if (e.key === "Escape" || e.key === "s") {
              closeDrawer();
              e.preventDefault();
            }
            return;
          }
          if (grid) grid.classList.remove("mouse-nav");
          const n = state.sites.length;
          const cols = state.settings.cols;
          const pStart = pageStart();
          const pEnd = pageEnd();
          let handled = true;
          switch (e.key) {
            case "h":
            case "ArrowLeft":
              if (focused < 0) focused = pStart;
              else if (focused % cols > 0 && focused > pStart) focused--;
              break;
            case "l":
            case "ArrowRight":
              if (focused < 0) focused = pStart;
              else if (focused % cols < cols - 1 && focused < pEnd) focused++;
              break;
            case "j":
            case "ArrowDown":
              moveV(1, cols);
              break;
            case "k":
            case "ArrowUp":
              moveV(-1, cols);
              break;
            case "g":
              focused = pStart;
              break;
            case "G":
            case "End":
              focused = pEnd;
              break;
            case "Home":
              focused = pStart;
              break;
            case "Tab":
              e.preventDefault();
              goPage(e.shiftKey ? page - 1 : page + 1);
              break;
            case "PageDown":
              e.preventDefault();
              goPage(page + 1);
              break;
            case "PageUp":
              e.preventDefault();
              goPage(page - 1);
              break;
            case "Enter":
            case "o":
              if (focused < 0) focused = pStart;
              open(focused);
              break;
            case "a":
              openModal(null);
              break;
            case "e":
              if (focused >= 0 && focused < n) openModal(state.sites[focused]);
              break;
            case "d":
              if (focused < 0 || focused >= n) break;
              if (armed === focused) {
                removeSite(focused);
              } else {
                armed = focused;
                if (armTimer) clearTimeout(armTimer);
                armTimer = setTimeout(function() {
                  armed = -1;
                  renderTileStates();
                }, 2500);
                renderTileStates();
              }
              break;
            case "s":
              toggleDrawer();
              break;
            case "/":
            case ":":
              openBar();
              break;
            case "Escape":
              if (armed >= 0) armed = -1;
              closeCtx();
              handled = true;
              break;
            default:
              handled = false;
          }
          if (handled) e.preventDefault();
          if (handled && e.key !== "Escape" && e.key !== "s" && e.key !== "a" && e.key !== "d") {
            if (armTimer) clearTimeout(armTimer);
            armed = -1;
          }
          renderTileStates();
        });
        document.addEventListener("visibilitychange", function() {
          if (document.visibilityState === "visible") {
            if (dirty) pushCloud();
          }
        });
        let wheelLock = false;
        if (scrollArea) {
          scrollArea.addEventListener("wheel", function(e) {
            if (e.ctrlKey || mode !== "none") return;
            e.preventDefault();
            if (wheelLock) return;
            const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            if (d === 0) return;
            wheelLock = true;
            setTimeout(function() {
              wheelLock = false;
            }, 180);
            goPage(page + (d > 0 ? 1 : -1));
          }, { passive: false });
        }
        if (grid) {
          grid.addEventListener("mouseover", function(e) {
            const b = e.target.closest && e.target.closest(".tile");
            if (b) {
              grid.classList.add("mouse-nav");
              setFocused(parseInt(b.dataset.idx || "", 10));
              setHeartRandom(b);
            }
          });
          grid.addEventListener("click", function(e) {
            if (suppressClick) {
              suppressClick = false;
              return;
            }
            const b = e.target.closest && e.target.closest(".tile");
            if (!b) return;
            open(parseInt(b.dataset.idx || "", 10), { newTab: e.ctrlKey || e.metaKey });
          });
        }
        function closeCtx() {
          const open2 = grid ? grid.querySelectorAll(".tile.ctx-open") : [];
          for (let i = 0; i < open2.length; i++) open2[i].classList.remove("ctx-open");
        }
        if (grid) {
          grid.addEventListener("contextmenu", function(e) {
            const b = e.target.closest && e.target.closest(".tile");
            if (!b) return;
            const idx = parseInt(b.dataset.idx || "", 10);
            if (idx < 0 || idx >= state.sites.length) return;
            e.preventDefault();
            closeCtx();
            setFocused(idx);
            b.classList.add("ctx-open");
          });
        }
        document.addEventListener("contextmenu", function(e) {
          if (e.target.closest && e.target.closest(".tile")) return;
          closeCtx();
        });
        document.addEventListener("click", function(e) {
          if (e.target.closest && e.target.closest(".ctx-btn")) return;
          closeCtx();
        });
        document.addEventListener("click", function() {
          setTimeout(function() {
            suppressClick = false;
          }, 0);
        }, true);
        let dragFrom = null;
        let dragUi = null;
        let suppressClick = false;
        let autoFlipDir = 0;
        let autoFlipTimer = null;
        let flipTimer = null;
        function stopAutoFlip() {
          autoFlipDir = 0;
          if (autoFlipTimer) {
            clearInterval(autoFlipTimer);
            autoFlipTimer = null;
          }
        }
        function armAutoFlip(x, y) {
          if (!scrollArea) {
            stopAutoFlip();
            return;
          }
          const r = scrollArea.getBoundingClientRect();
          if (y < r.top || y > r.bottom) {
            stopAutoFlip();
            return;
          }
          let dir = 0;
          if (x < r.left + 70) dir = -1;
          else if (x > r.right - 70) dir = 1;
          if (dir === autoFlipDir) return;
          autoFlipDir = dir;
          if (autoFlipTimer) {
            clearInterval(autoFlipTimer);
            autoFlipTimer = null;
          }
          if (dir) {
            autoFlipTimer = setInterval(function() {
              if (autoFlipDir) goPage(page + autoFlipDir);
            }, 480);
          }
        }
        function snapRects() {
          if (!grid) return [];
          const kids = grid.children;
          const out = [];
          for (let i = 0; i < kids.length; i++) {
            out.push({ node: kids[i], rect: kids[i].getBoundingClientRect() });
          }
          return out;
        }
        function flipFrom(captured) {
          if (!grid) return;
          if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const kids = grid.children;
          let moved = 0;
          for (let i = 0; i < kids.length; i++) {
            const c = kids[i];
            let old = null;
            for (let k = 0; k < captured.length; k++) {
              if (captured[k].node === c) {
                old = captured[k].rect;
                break;
              }
            }
            if (!old) continue;
            const last = c.getBoundingClientRect();
            const dx = old.left - last.left;
            const dy = old.top - last.top;
            if (dx !== 0 || dy !== 0) {
              c.style.transition = "none";
              c.style.transform = "translate(" + dx + "px," + dy + "px)";
              moved++;
            }
          }
          if (!moved) return;
          void grid.offsetWidth;
          for (let j = 0; j < kids.length; j++) {
            const t = kids[j];
            if (t.style.transform) {
              t.style.transition = "transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1)";
              t.style.transform = "";
            }
          }
          if (flipTimer) clearTimeout(flipTimer);
          flipTimer = setTimeout(function() {
            const k = grid.children;
            for (let n = 0; n < k.length; n++) {
              k[n].style.transition = "";
              k[n].style.transform = "";
            }
          }, 400);
        }
        function highlightDrop(b) {
          if (!grid) return;
          const tiles = grid.querySelectorAll(".tile.drop-target");
          for (let i = 0; i < tiles.length; i++) tiles[i].classList.remove("drop-target");
          if (dragUi && b) b.classList.add("drop-target");
        }
        function makeGhost(b) {
          const g = b.cloneNode(true);
          g.removeAttribute("id");
          g.className = "tile drag-ghost";
          g.style.width = b.offsetWidth + "px";
          ["--ts", "--label-op", "--label-color"].forEach(function(v) {
            g.style.setProperty(v, grid ? grid.style.getPropertyValue(v) : "");
          });
          document.body.appendChild(g);
          return g;
        }
        function cleanupDrag() {
          if (flipTimer) {
            clearTimeout(flipTimer);
            flipTimer = null;
          }
          if (dragUi && dragUi.ghost) dragUi.ghost.remove();
          dragUi = null;
          dragFrom = null;
          if (grid) grid.classList.remove("dragging-active");
          const d = grid ? grid.querySelectorAll(".tile.dragging") : [];
          for (let i = 0; i < d.length; i++) d[i].classList.remove("dragging");
          highlightDrop(null);
          stopAutoFlip();
        }
        function draggedNode() {
          return dragFrom == null ? null : grid ? grid.querySelector('[data-idx="' + dragFrom + '"]') : null;
        }
        function measureGrid() {
          if (!grid) return null;
          const first = grid.querySelector(".tile");
          if (!first) return null;
          const r = first.getBoundingClientRect();
          const cs = getComputedStyle(grid);
          const cg = parseFloat(cs.columnGap) || 0;
          const rg = parseFloat(cs.rowGap) || 0;
          return {
            originX: r.left,
            originY: r.top,
            strideX: r.width + cg,
            strideY: r.height + rg,
            cols: Math.max(1, state.settings.cols),
            rows: Math.max(1, state.settings.rows)
          };
        }
        function slotAt(g, x, y) {
          let col = Math.round((x - g.originX) / g.strideX);
          let row = Math.round((y - g.originY) / g.strideY);
          col = Math.max(0, Math.min(col, g.cols - 1));
          row = Math.max(0, Math.min(row, g.rows - 1));
          return row * g.cols + col;
        }
        function inGridBounds(g, x, y) {
          const x0 = g.originX - g.strideX * 0.5;
          const x1 = g.originX + (g.cols - 1) * g.strideX + g.strideX * 0.5;
          const y0 = g.originY - g.strideY * 0.5;
          const y1 = g.originY + (g.rows - 1) * g.strideY + g.strideY * 0.5;
          return x >= x0 && x <= x1 && y >= y0 && y <= y1;
        }
        function reorderToSlot(slot) {
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
        function undoLiveOrder() {
          if (!grid || !dragUi || !dragUi.orig || dragUi.orig.length < 2) return;
          const rects = snapRects();
          for (let i = 0; i < dragUi.orig.length; i++) {
            if (dragUi.orig[i].parentNode === grid) grid.appendChild(dragUi.orig[i]);
          }
          flipFrom(rects);
        }
        if (grid) {
          grid.addEventListener("pointerdown", function(e) {
            if (e.button !== 0 || mode !== "none") return;
            const b = e.target.closest && e.target.closest(".tile");
            if (!b) return;
            dragFrom = parseInt(b.dataset.idx || "", 10);
            dragUi = {
              from: dragFrom,
              startX: e.clientX,
              startY: e.clientY,
              lastX: e.clientX,
              lastY: e.clientY,
              moved: false,
              ghost: null,
              page,
              geom: null,
              orig: null,
              lastSlot: -1,
              lastInGrid: false,
              pageChangedAt: 0
            };
          });
        }
        window.addEventListener("pointermove", function(e) {
          if (!dragUi) return;
          const dx = e.clientX - dragUi.startX, dy = e.clientY - dragUi.startY;
          if (!dragUi.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
          if (!dragUi.moved) {
            dragUi.moved = true;
            e.preventDefault();
            if (grid) grid.classList.add("dragging-active");
            dragUi.geom = measureGrid();
            dragUi.orig = Array.prototype.slice.call(grid ? grid.children : []);
            const src = draggedNode();
            if (src) src.classList.add("dragging");
            dragUi.ghost = makeGhost(src || e.target.closest(".tile"));
            dragUi.ghost.style.transform = "translate(" + (dragUi.startX + 12) + "px," + (dragUi.startY + 12) + "px) scale(1.06)";
          }
          if (!dragUi.moved || !dragUi.geom) return;
          e.preventDefault();
          dragUi.lastX = e.clientX;
          dragUi.lastY = e.clientY;
          dragUi.ghost.style.transform = "translate(" + (e.clientX + 12) + "px," + (e.clientY + 12) + "px) scale(1.06)";
          armAutoFlip(e.clientX, e.clientY);
          if (dragUi.page !== page) {
            dragUi.page = page;
            dragUi.pageChangedAt = Date.now();
            dragUi.geom = measureGrid();
            dragUi.orig = Array.prototype.slice.call(grid ? grid.children : []);
            dragUi.lastSlot = -1;
            const fresh = draggedNode();
            if (fresh) fresh.classList.add("dragging");
          }
          const g = dragUi.geom;
          if (!g) return;
          const inGrid = inGridBounds(g, e.clientX, e.clientY);
          dragUi.lastInGrid = inGrid;
          if (inGrid) {
            const slot = slotAt(g, e.clientX, e.clientY);
            dragUi.lastSlot = slot;
            const kids = grid ? grid.children : [];
            const b = kids[slot] && kids[slot].classList.contains("tile") ? kids[slot] : null;
            highlightDrop(b);
            if (Date.now() - dragUi.pageChangedAt > 380) reorderToSlot(slot);
          } else {
            highlightDrop(null);
          }
        });
        window.addEventListener("pointerup", function(e) {
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
                const movedSite = arr.splice(dragFrom, 1)[0];
                arr.splice(to, 0, movedSite);
                mutateSite(function() {
                  state.sites = arr;
                });
                focused = to;
                renderTileStates();
              }
            } else {
              undoLiveOrder();
            }
          }
          cleanupDrag();
        });
        window.addEventListener("pointercancel", function() {
          if (dragUi && dragUi.moved) undoLiveOrder();
          cleanupDrag();
        });
        let editingIdx = -1;
        let pickedIcon = "";
        let lastAutoName = "";
        let metaTimer = null;
        const metaCache = /* @__PURE__ */ Object.create(null);
        const metaIcons = /* @__PURE__ */ Object.create(null);
        const META_MAX = 4 * 1024 * 1024;
        function openModal(site) {
          armed = -1;
          if (armTimer) clearTimeout(armTimer);
          editingIdx = site ? state.sites.indexOf(site) : -1;
          if (nameIn) nameIn.value = site ? site.name : "";
          if (urlIn) urlIn.value = site ? site.url : "";
          if (modalTitle) modalTitle.textContent = site ? "edit shortcut" : "add shortcut";
          pickedIcon = site && site.icon ? site.icon : "";
          lastAutoName = "";
          if (modalEl) modalEl.hidden = false;
          mode = "modal";
          renderIconPicker(urlIn ? urlIn.value : "", pickedIcon);
          scheduleMetaDetect();
          if (site && site.name && urlIn) urlIn.focus();
          else if (nameIn) nameIn.focus();
        }
        function closeModal() {
          if (modalEl) modalEl.hidden = true;
          mode = "none";
          editingIdx = -1;
          pickedIcon = "";
          if (metaTimer) clearTimeout(metaTimer);
          if (iconPicker) iconPicker.innerHTML = "";
          if (metaStatus) metaStatus.hidden = true;
          const dim = grid ? grid.querySelectorAll(".tile.ctx-dim") : [];
          for (let i = 0; i < dim.length; i++) dim[i].classList.remove("ctx-dim");
        }
        if (nameIn) nameIn.addEventListener("input", function() {
          lastAutoName = "";
        });
        if (urlIn) urlIn.addEventListener("input", scheduleMetaDetect);
        function scheduleMetaDetect() {
          if (metaTimer) clearTimeout(metaTimer);
          metaTimer = setTimeout(function() {
            renderIconPicker(urlIn ? urlIn.value : "", pickedIcon);
            detectMeta(urlIn ? urlIn.value : "");
          }, 400);
        }
        function renderIconPicker(rawUrl, selectedSrc) {
          if (!iconPicker) return;
          iconPicker.innerHTML = "";
          const url = normUrl(rawUrl);
          iconPicker.appendChild(autoPickEl(selectedSrc === ""));
          if (!url) return;
          const seen = {};
          const cands = iconCandidates({ url, icon: "" });
          cands.forEach(function(c) {
            if (c.src) seen[c.src] = true;
          });
          (metaIcons[url] || []).forEach(function(src) {
            if (!src || seen[src]) return;
            seen[src] = true;
            cands.push({ src, rank: 76, service: "site" });
          });
          let shown = 0;
          for (let i = 0; i < cands.length && shown < 8; i++) {
            (function(src) {
              const b = el("button", "pick-item");
              b.type = "button";
              b.dataset.src = src;
              b.setAttribute("role", "radio");
              b.setAttribute("aria-checked", src === selectedSrc ? "true" : "false");
              b.title = src;
              const img = el("img");
              img.src = src;
              img.alt = "";
              img.referrerPolicy = "no-referrer";
              img.decoding = "async";
              img.draggable = false;
              const failTimer = setTimeout(function() {
                if (b.parentNode) b.parentNode.removeChild(b);
              }, 6e3);
              img.addEventListener("load", function() {
                clearTimeout(failTimer);
              });
              img.addEventListener("error", function() {
                clearTimeout(failTimer);
                if (b.parentNode) b.parentNode.removeChild(b);
              });
              b.appendChild(img);
              b.addEventListener("click", function() {
                selectPick(b, src);
              });
              if (src === selectedSrc) b.classList.add("selected");
              iconPicker.appendChild(b);
              shown++;
            })(cands[i].src);
          }
        }
        function autoPickEl(selected) {
          const b = el("button", "pick-item pick-auto" + (selected ? " selected" : ""));
          b.type = "button";
          b.dataset.src = "";
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", selected ? "true" : "false");
          b.title = "auto-detect icon";
          b.appendChild(el("span", "pick-letter", "auto"));
          b.addEventListener("click", function() {
            selectPick(b, "");
          });
          return b;
        }
        function selectPick(btn, src) {
          pickedIcon = src;
          const sels = iconPicker ? iconPicker.querySelectorAll(".pick-item.selected") : [];
          for (let i = 0; i < sels.length; i++) {
            sels[i].classList.remove("selected");
            sels[i].setAttribute("aria-checked", "false");
          }
          btn.classList.add("selected");
          btn.setAttribute("aria-checked", "true");
        }
        function detectMeta(raw) {
          const url = normUrl(raw);
          if (!url || !/^https?:/i.test(url)) {
            if (metaStatus) metaStatus.hidden = true;
            return;
          }
          if (metaStatus) {
            metaStatus.hidden = false;
            metaStatus.textContent = "detecting title…";
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
          fetchMeta(url).then(function(meta) {
            if (metaStatus) metaStatus.hidden = true;
            if (!meta) return;
            metaCache[url] = meta;
            applyMeta(url, meta);
          }).catch(function() {
            if (metaStatus) metaStatus.hidden = true;
          });
        }
        function applyMeta(url, meta) {
          if (meta.title && nameIn && (!nameIn.value.trim() || nameIn.value === lastAutoName)) {
            lastAutoName = meta.title;
            nameIn.value = meta.title;
          }
          if (meta.icons && meta.icons.length) {
            metaIcons[url] = meta.icons;
            renderIconPicker(url, pickedIcon);
          }
        }
        function fetchMeta(url) {
          const u = new URL(url);
          const cands = [];
          const tryH = [u.hostname, "www." + u.hostname];
          for (let i = 0; i < tryH.length; i++) {
            const proto = /^https:/.test(u.protocol) ? "https" : "http";
            cands.push(proto + "://" + tryH[i] + u.pathname);
            cands.push(proto + "://" + tryH[i] + "/");
          }
          let idx = 0;
          let signal = null;
          try {
            signal = AbortSignal.timeout(6e3);
          } catch {
          }
          return new Promise(function(resolve) {
            const next = function() {
              if (idx >= cands.length) {
                resolve(null);
                return;
              }
              const c = cands[idx++];
              fetch(c, { signal: signal || void 0 }).then(function(r) {
                if (!r.ok) {
                  next();
                  return null;
                }
                return r.text().then(function(t) {
                  if (t.length > META_MAX) return null;
                  return t;
                }).then(function(t) {
                  if (!t) return null;
                  const info = parseMetaHtml(t, url);
                  if (info && (info.title || info.icons && info.icons.length)) resolve(info);
                  else {
                    next();
                  }
                  return null;
                });
              }).catch(function() {
                next();
              });
            };
            next();
          });
        }
        function parseMetaHtml(html, url) {
          let doc2;
          try {
            doc2 = new DOMParser().parseFromString(html, "text/html");
          } catch {
            return null;
          }
          const m = { title: "", icons: [] };
          const t = doc2.querySelector("title");
          if (t && t.textContent) m.title = t.textContent.trim().slice(0, 200);
          const pickIcon = function(src) {
            if (!src || m.icons.length >= 10) return;
            const abs = absUrl(src, url);
            if (!abs) return;
            m.icons.push(abs);
          };
          const iconEls = doc2.querySelectorAll('link[rel~="icon"], link[rel~="shortcut"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
          for (let i = 0; i < iconEls.length; i++) {
            pickIcon(iconEls[i].href || "");
          }
          if (!m.icons.length) {
            const og = doc2.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
            if (og) pickIcon(og.content || "");
          }
          const apple = doc2.querySelector('meta[name="apple-itunes-app"]');
          if (apple) {
            const mm = /app-id=(\d+)/.exec(apple.content || "");
            if (mm) {
              const u2 = new URL(url);
              pickIcon("https://" + u2.hostname + "/images/apple-touch-icon.png");
            }
          }
          if (!m.title && !m.icons.length) return null;
          return m;
        }
        function absUrl(src, base) {
          try {
            return new URL(src, base).href;
          } catch {
            return null;
          }
        }
        if (form) {
          form.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = nameIn ? nameIn.value.trim() : "";
            const raw = urlIn ? urlIn.value.trim() : "";
            if (!name || !raw) return;
            const url = normUrl(raw);
            if (!url) return;
            const site = { id: editingIdx >= 0 && state.sites[editingIdx] ? state.sites[editingIdx].id || uid() : uid(), name, url };
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
        if (settingsBtn) settingsBtn.addEventListener("click", function() {
          toggleDrawer();
        });
        if (emptyAdd) emptyAdd.addEventListener("click", function() {
          openModal(null);
        });
        if (scrim) scrim.addEventListener("click", function() {
          if (mode === "drawer") closeDrawer();
          else if (mode === "modal") closeModal();
        });
        if (drawerClose) drawerClose.addEventListener("click", function() {
          closeDrawer();
        });
        const setNav = $("#setNav");
        const setGroups = Array.prototype.slice.call(document.querySelectorAll(".set-group"));
        function showGroup(name) {
          for (let g = 0; g < setGroups.length; g++) {
            const grp = setGroups[g];
            grp.style.display = grp.id === "grp-" + name ? "" : "none";
          }
          const btns = setNav ? setNav.querySelectorAll(".set-nav-btn") : [];
          for (let b = 0; b < btns.length; b++) {
            const btn = btns[b];
            const on = btn.getAttribute("data-scroll") === name;
            btn.classList.toggle("active", on);
            if (on) btn.setAttribute("aria-current", "true");
            else btn.removeAttribute("aria-current");
          }
        }
        if (setNav) setNav.addEventListener("click", function(e) {
          const b = e.target.closest(".set-nav-btn");
          if (!b) return;
          showGroup(b.getAttribute("data-scroll") || "layout");
        });
        showGroup("layout");
        document.addEventListener("click", function(e) {
          if (mode !== "drawer" || !drawer) return;
          const t = e.target;
          if (!t || !t.closest) return;
          if (drawer.contains(t)) return;
          if (settingsBtn && settingsBtn.contains(t)) return;
          closeDrawer();
        }, true);
        if (syncNow) syncNow.addEventListener("click", function() {
          pushCloud();
        });
        if (resetSettings) resetSettings.addEventListener("click", function() {
          if (!window.confirm("Reset all shortcuts and settings?")) return;
          state.sites = DEFAULT_SITES.slice();
          state.settings = Object.assign({}, DEFAULTS.settings);
          state.updatedAt = Date.now();
          commit();
          closeDrawer();
          if (window.WALLS) window.WALLS.applySafe();
        });
        if (backupDownload) backupDownload.addEventListener("click", function() {
          const d = doc();
          const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "glisters-backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function() {
            URL.revokeObjectURL(url);
          }, 1500);
        });
        if (backupLoad && backupLoadInput) backupLoad.addEventListener("click", function() {
          backupLoadInput.click();
        });
        if (backupLoadInput) backupLoadInput.addEventListener("change", function() {
          const f = backupLoadInput.files && backupLoadInput.files[0];
          backupLoadInput.value = "";
          if (!f) return;
          const r = new FileReader();
          r.onload = function() {
            let norm = null;
            try {
              norm = normalize(JSON.parse(String(r.result || "")));
            } catch {
            }
            if (!norm) {
              setSyncStatus("error", "bad backup file");
              return;
            }
            snapshotPrevious();
            adopt(norm);
            setSyncStatus("synced", "backup loaded");
            updateStorageInfo();
          };
          r.onerror = function() {
            setSyncStatus("error", "couldn't read file");
          };
          r.readAsText(f);
        });
        if (restorePrevious) restorePrevious.addEventListener("click", function() {
          try {
            const raw = localStorage.getItem(STORE_KEY + ":prev");
            if (!raw) {
              setSyncStatus("ready", "no previous save yet");
              return;
            }
            const norm = normalize(JSON.parse(raw));
            if (!norm) {
              setSyncStatus("error", "previous save unreadable");
              return;
            }
            snapshotPrevious();
            adopt(norm);
            setSyncStatus("synced", "previous save restored");
            updateStorageInfo();
          } catch {
            setSyncStatus("error", "previous save unreadable");
          }
        });
        if (scrim) {
          scrim.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
              if (mode === "drawer") closeDrawer();
              else if (mode === "modal") closeModal();
            }
          });
        }
        let barIdx = 0;
        let barItems = [];
        function barResults(query) {
          const q = query.trim().toLowerCase();
          if (!q) return [];
          const out = [];
          for (let i = 0; i < state.sites.length; i++) {
            const s = state.sites[i];
            if (s.name.toLowerCase().indexOf(q) !== -1 || s.url.toLowerCase().indexOf(q) !== -1) {
              out.push(s);
            }
          }
          const openers = [];
          if (/youtube|yt/.test(q)) openers.push("YouTube");
          if (/gmail|mail/.test(q)) openers.push("Gmail");
          if (/drive/.test(q)) openers.push("Google Drive");
          if (/docs|document/.test(q)) openers.push("Google Docs");
          if (/maps|map/.test(q)) openers.push("Google Maps");
          if (/translate/.test(q)) openers.push("Google Translate");
          if (/github/.test(q)) openers.push("GitHub");
          for (let k = 0; k < openers.length; k++) out.push(openers[k]);
          return out;
        }
        function renderBar() {
          if (!bar) return;
          const items = barResults(barInput ? barInput.value : "");
          barItems = items;
          const hasQuery = !!(barInput && barInput.value.trim());
          if (!hasQuery || !items.length) {
            if (barHint) barHint.textContent = hasQuery ? "no matches" : "search shortcuts";
            barIdx = 0;
            if (barList) barList.hidden = true;
            if (barInput) barInput.setAttribute("aria-expanded", "false");
            return;
          }
          if (barList) {
            barList.hidden = false;
            barList.innerHTML = "";
            const max = Math.min(8, items.length);
            for (let i = 0; i < max; i++) {
              const item = items[i];
              const row = el("button", "bar-row" + (i === barIdx ? " bar-sel" : ""));
              row.type = "button";
              if (typeof item === "string") {
                row.dataset.kind = "open";
                const ic = el("span", "bar-glyph", "↗");
                const lbl = el("span", "bar-label", item);
                const cmd = el("span", "bar-cmd", "open " + item);
                row.appendChild(ic);
                row.appendChild(lbl);
                row.appendChild(cmd);
              } else {
                row.dataset.kind = "site";
                row.dataset.idx = String(state.sites.indexOf(item));
                const ic = el("span", "bar-glyph", "›");
                const lbl = el("span", "bar-label", item.name);
                const cmd = el("span", "bar-cmd", item.url);
                row.appendChild(ic);
                row.appendChild(lbl);
                row.appendChild(cmd);
              }
              row.addEventListener("click", function() {
                if (typeof item === "string") openByName(item);
                else open(state.sites.indexOf(item));
              });
              barList.appendChild(row);
            }
          }
          barIdx = 0;
          if (barInput) barInput.setAttribute("aria-expanded", "true");
          if (barHint) barHint.textContent = "↑↓ navigate · enter open · esc close";
          syncBarSel();
        }
        function syncBarSel() {
          if (!barList) return;
          const rows = barList.querySelectorAll(".bar-row");
          for (let i = 0; i < rows.length; i++) {
            rows[i].classList.toggle("bar-sel", i === barIdx);
          }
        }
        let barHint = $("#barHint");
        const barList = $("#barList");
        function openBar() {
          if (mode === "bar") return;
          mode = "bar";
          if (bar) {
            bar.hidden = false;
            bar.classList.add("open");
          }
          if (barInput) {
            barInput.value = "";
            barInput.focus();
          }
          barIdx = 0;
          barItems = [];
          renderBar();
        }
        function closeBar() {
          if (mode !== "bar") return;
          mode = "none";
          if (bar) {
            bar.hidden = true;
            bar.classList.remove("open");
          }
        }
        function openByName(name) {
          const url = {
            "YouTube": "https://youtube.com",
            "Gmail": "https://mail.google.com",
            "Google Drive": "https://drive.google.com",
            "Google Docs": "https://docs.google.com/document/u/0/",
            "Google Maps": "https://maps.google.com",
            "Google Translate": "https://translate.google.com",
            "GitHub": "https://github.com"
          }[name];
          if (!url) return;
          closeBar();
          openInSameTab(url);
        }
        if (barInput) {
          barInput.addEventListener("input", function() {
            barIdx = 0;
            renderBar();
          });
          barInput.addEventListener("keydown", function(e) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (barItems.length) {
                barIdx = (barIdx + 1) % Math.min(8, barItems.length);
                syncBarSel();
              }
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (barItems.length) {
                barIdx = (barIdx - 1 + Math.min(8, barItems.length)) % Math.min(8, barItems.length);
                syncBarSel();
              }
            } else if (e.key === "Enter") {
              e.preventDefault();
              const item = barItems[barIdx];
              if (typeof item === "string") openByName(item);
              else open(state.sites.indexOf(item));
            } else if (e.key === "Escape") {
              e.preventDefault();
              closeBar();
            }
          });
          barInput.addEventListener("paste", function(e) {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.indexOf("image/") === 0) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (!file) return;
                reverseImageSearch(file);
                return;
              }
            }
          });
        }
        let imageSearchTimer = null;
        function reverseImageSearch(file) {
          const priorText = barInput ? barInput.value : "";
          if (barInput) barInput.value = "🔍 reverse image search...";
          if (barHint) barHint.textContent = "uploading image — opening results";
          const fail = function(msg) {
            if (barInput) barInput.value = priorText;
            if (barHint) barHint.textContent = msg;
          };
          const fd = new FormData();
          fd.append("encoded_image", file, file.name || "pasted.png");
          fd.append("image_url", "");
          fd.append("image_content", "");
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "https://images.google.com/searchbyimage/upload");
          if (imageSearchTimer) clearTimeout(imageSearchTimer);
          imageSearchTimer = setTimeout(function() {
            try {
              xhr.abort();
            } catch {
            }
            fail("image search timed out — try again");
          }, 2e4);
          xhr.onloadend = function() {
            if (imageSearchTimer) {
              clearTimeout(imageSearchTimer);
              imageSearchTimer = null;
            }
            const status = xhr.status;
            const rurl = xhr.responseURL || "";
            const landed = /^https?:\/\//i.test(rurl) && rurl.indexOf("/searchbyimage/upload") === -1 && rurl.indexOf("images.google.com/searchbyimage/upload") === -1;
            if (status >= 200 && status < 400 && landed) {
              closeBar();
              openInNewTab(rurl);
            } else {
              fail("image search failed — try again");
            }
          };
          xhr.onerror = function() {
            if (imageSearchTimer) {
              clearTimeout(imageSearchTimer);
              imageSearchTimer = null;
            }
            fail("image search failed — check connection");
          };
          xhr.send(fd);
        }
        if (bar) {
          bar.addEventListener("mousedown", function(e) {
            e.preventDefault();
          });
        }
        if (barInput) barInput.setAttribute("role", "combobox");
        if (barInput) barInput.setAttribute("autocomplete", "off");
        if (barInput) barInput.setAttribute("spellcheck", "false");
        function toggleDrawer() {
          if (!drawer) return;
          const isOpen = drawer.classList.contains("open");
          if (isOpen) closeDrawer();
          else {
            drawer.classList.add("open");
            if (scrim) {
              scrim.hidden = false;
            }
            mode = "drawer";
            syncDrawerDisplay();
            if (drawerBody) drawerBody.focus();
          }
        }
        function closeDrawer() {
          if (!drawer) return;
          drawer.classList.remove("open");
          if (scrim) {
            scrim.hidden = true;
          }
          mode = "none";
        }
        const SETTING_RANGES = ["iconSize", "colGap", "rowGap", "cols", "rows", "labelOp", "bkWidth", "drWidth", "blur"];
        const SETTING_CHECKS = ["labels", "mono", "wallMono"];
        function settingVal(k) {
          return state.settings[k];
        }
        function syncSettingControl(k) {
          if (!drawerBody) return;
          const inp = drawerBody.querySelector("#set-" + k);
          if (!inp) return;
          const v = settingVal(k);
          if (inp.type === "checkbox") inp.checked = v === true;
          else inp.value = String(v);
          const disp = drawerBody.querySelector("#val-" + k);
          if (disp) {
            const unit = inp.getAttribute("data-unit") ? inp.getAttribute("data-unit") : "";
            disp.textContent = String(v) + unit;
          }
        }
        function syncDrawerDisplay() {
          if (!drawerBody) return;
          SETTING_RANGES.forEach(syncSettingControl);
          SETTING_CHECKS.forEach(syncSettingControl);
          syncSettingControl("labelColor");
          updateStorageInfo();
        }
        function commitSetting(k) {
          if (settingTimer) clearTimeout(settingTimer);
          settingTimer = setTimeout(function() {
            state.updatedAt = Date.now();
            renderAll();
            persistLocal();
            scheduleCloud();
            if (window.WALLS && (k === "blur" || k === "wallMono")) window.WALLS.applySafe();
          }, 120);
        }
        if (drawerBody) {
          drawerBody.addEventListener("input", function(e) {
            const t = e.target;
            if (!t || !t.id || t.id.indexOf("set-") !== 0) return;
            const k = t.id.slice(4);
            let val = 0;
            if (t.type === "checkbox") val = t.checked;
            else if (t.type === "color") val = t.value;
            else val = parseFloat(t.value) || 0;
            state.settings[k] = val;
            syncSettingControl(k);
            commitSetting(k);
          });
          drawerBody.addEventListener("click", function(e) {
            const b = e.target.closest && e.target.closest(".step");
            if (!b) return;
            const key = b.getAttribute("data-target");
            if (!key) return;
            const d = parseInt(b.getAttribute("data-step") || "0", 10);
            const inp = drawerBody.querySelector("#set-" + key);
            if (!inp) return;
            const min = parseFloat(inp.min);
            const max = parseFloat(inp.max);
            const cur = parseFloat(inp.value) || 0;
            let next = cur + d;
            if (!isNaN(min)) next = Math.max(min, next);
            if (!isNaN(max)) next = Math.min(max, next);
            inp.value = String(next);
            state.settings[key] = next;
            syncSettingControl(key);
            commitSetting(key);
          });
          const labelColorReset = drawerBody.querySelector("#labelColorReset");
          if (labelColorReset) {
            labelColorReset.addEventListener("click", function() {
              state.settings.labelColor = DEFAULTS.settings.labelColor;
              syncSettingControl("labelColor");
              commitSetting("labelColor");
            });
          }
        }
        const SYNC_STATES = ["off", "ready", "syncing", "synced", "error"];
        function setSyncStatus(state2, text) {
          if (!syncCard) return;
          const s = SYNC_STATES.indexOf(state2) >= 0 ? state2 : "ready";
          if (s === "syncing" && syncCard.classList.contains("syncing")) {
            if (syncStatus && text !== void 0) syncStatus.textContent = text;
            return;
          }
          syncCard.classList.remove("off", "ready", "syncing", "synced", "error");
          syncCard.classList.add(s);
          if (syncStatus && text !== void 0) syncStatus.textContent = text;
          if (syncNow) syncNow.disabled = s === "syncing";
        }
        function bytes(n) {
          if (!isFinite(n) || n < 0) return "—";
          if (n < 1024) return n + " B";
          if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " kB";
          return (n / (1024 * 1024)).toFixed(2) + " MB";
        }
        function updateStorageInfo() {
          if (stLocal) {
            try {
              const raw = localStorage.getItem(STORE_KEY);
              const ok = !!raw;
              stLocal.textContent = ok ? bytes(new Blob([raw]).size) : "—";
              stLocal.classList.toggle("ok", ok);
              stLocal.classList.toggle("bad", !ok);
            } catch {
              stLocal.textContent = "—";
            }
          }
          if (stExt && window.chrome && chrome.storage && chrome.storage.local) {
            try {
              chrome.storage.local.get(STORE_KEY, function(o) {
                if (!stExt) return;
                try {
                  const v = o[STORE_KEY];
                  const ok = !!v;
                  const raw = ok ? JSON.stringify(v) : null;
                  stExt.textContent = ok ? bytes(new Blob([raw]).size) : "—";
                  stExt.classList.toggle("ok", ok);
                  stExt.classList.toggle("bad", !ok);
                } catch {
                  stExt.textContent = "—";
                }
              });
            } catch {
              stExt.textContent = "—";
            }
          }
        }
        function snapshotPrevious() {
          try {
            const cur = localStorage.getItem(STORE_KEY);
            if (cur) localStorage.setItem(STORE_KEY + ":prev", cur);
          } catch {
          }
        }
        function scheduleCloud() {
          if (!SYNC_ENABLED) return;
          dirty = true;
          if (cloudTimer) clearTimeout(cloudTimer);
          cloudTimer = setTimeout(function() {
            pushCloud();
          }, 1300);
        }
        function pushCloud() {
          if (!SYNC_ENABLED) return;
          dirty = false;
          if (cloudTimer) {
            clearTimeout(cloudTimer);
            cloudTimer = null;
          }
          if (!window.SYNC) return;
          setSyncStatus("syncing");
          const d = doc();
          const onOk = function() {
            dirty = false;
            setSyncStatus("synced", "synced just now");
            updateStorageInfo();
          };
          window.SYNC.push(d).then(onOk, function() {
            dirty = true;
            setSyncStatus("error", "offline — will retry");
            if (retryTimer) clearTimeout(retryTimer);
            retryTimer = setTimeout(function() {
              pushCloud();
            }, 2e4);
          });
        }
        function pullCloud() {
          if (!SYNC_ENABLED || !window.SYNC) return;
          setSyncStatus("syncing");
          window.SYNC.pull().then(function(remote) {
            if (!remote) {
              setSyncStatus("error", "cloud empty");
              bootstrapSync();
              return;
            }
            const local = readLocal();
            const rw = remote && remote.walls ? remote.walls : null;
            const lw = local && local.walls ? local.walls : null;
            if (rw && Array.isArray(rw.favs) && rw.favs.length === 0 && lw && Array.isArray(lw.favs) && lw.favs.length) {
              rw.favs = lw.favs;
            }
            if (local && !local.updatedAt) {
              bootstrapSync();
              return;
            }
            if (local && local.updatedAt && local.updatedAt > remote.updatedAt) {
              pushCloud();
              return;
            }
            snapshotPrevious();
            adopt(remote);
            setSyncStatus("synced", "restored from cloud");
            updateStorageInfo();
          }).catch(function() {
            setSyncStatus("error", "offline — will retry");
            bootstrapSync();
          });
        }
        function adopt(remote) {
          const norm = normalize(remote);
          if (!norm) return;
          state = norm;
          state.updatedAt = Date.now();
          commit({ noCloud: true });
          if (window.BOOKMARKS) window.BOOKMARKS.restore(norm.bookmarks);
          if (window.WALLS) window.WALLS.restore(norm.walls);
        }
        function bootstrapSync() {
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
          loadSeed().then(function(seed) {
            try {
              localStorage.setItem(SEED_FLAG_KEY, "1");
            } catch {
            }
            seededFromLinks = true;
            adopt(seed);
          }).catch(function() {
            scheduleCloud();
          });
        }
        function paintState(n) {
          state = n;
          renderAll();
          if (window.BOOKMARKS && window.BOOKMARKS.restore && n.bookmarks) window.BOOKMARKS.restore(n.bookmarks);
          if (window.WALLS && window.WALLS.restore && n.walls) window.WALLS.restore(n.walls);
        }
        function syncStart() {
          if (!SYNC_ENABLED || !window.SYNC) {
            setSyncStatus("off", "sync is off");
            updateStorageInfo();
            return;
          }
          setSyncStatus("ready", "ready");
          updateStorageInfo();
          if (seededFromLinks) {
            pullCloud();
            return;
          }
          restoreFromStorage().then(function(cached) {
            if (cached && cached.updatedAt && cached.sites && cached.sites.length) {
              const n = normalize(cached);
              if (n) paintState(n);
            }
            pullCloud();
          }).catch(function() {
            pullCloud();
          });
        }
        function bindModules() {
          if (window.BOOKMARKS && window.BOOKMARKS.bind) {
            window.BOOKMARKS.bind(function() {
              state.updatedAt = Date.now();
              persistLocal();
              scheduleCloud();
            });
          }
          if (window.WALLS && window.WALLS.bind) {
            window.WALLS.bind(function() {
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
        window.addEventListener("resize", function() {
          if (settingTimer) clearTimeout(settingTimer);
          settingTimer = setTimeout(function() {
            applyCssVars();
            if (drawer && drawer.classList.contains("open")) syncDrawerDisplay();
          }, 150);
        });
        function init() {
          loadPersistedIcons();
          bindModules();
          renderAll();
          syncStart();
          setInterval(function() {
            retryAllFailed();
          }, 12e4);
          setTimeout(prefetchRemaining, 2e3);
        }
        document.addEventListener("DOMContentLoaded", init);
      })();
    }
  });
  require_app();
})();
