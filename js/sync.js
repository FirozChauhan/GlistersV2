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
  var require_sync = __commonJS({
    "src/sync.ts"() {
      (function() {
        "use strict";
        const CF = window.CONFIG || {};
        const gistId = CF.gistId || "";
        const githubToken = CF.githubToken || "";
        const cfg = { enabled: !!(gistId && githubToken) };
        const FILE_NAME = "glisters-save.json";
        const API = "https://api.github.com/gists";
        function isAutomatedSession() {
          try {
            return navigator.webdriver === true;
          } catch {
            return false;
          }
        }
        function authHeader() {
          return "Bearer " + githubToken;
        }
        function pull() {
          if (!cfg.enabled) return Promise.reject(new Error("gist sync disabled"));
          return fetch(API + "/" + encodeURIComponent(gistId), {
            headers: { Authorization: authHeader() },
            cache: "no-store"
          }).then(function(r) {
            if (r.status === 404) return null;
            if (!r.ok) return r.text().then(function(t) {
              throw new Error(t || String(r.status));
            });
            return r.json().then(function(gist) {
              const file = gist && gist.files && gist.files[FILE_NAME];
              if (!file || !file.content) return null;
              try {
                return JSON.parse(file.content);
              } catch {
                return null;
              }
            });
          });
        }
        function push(data) {
          if (!cfg.enabled) return Promise.reject(new Error("gist sync disabled"));
          if (isAutomatedSession()) {
            return Promise.reject(new Error("push blocked: automated browser session (test builds must use scripts/build-test.mjs)"));
          }
          const files = {};
          files[FILE_NAME] = { content: JSON.stringify(data) };
          return fetch(API + "/" + encodeURIComponent(gistId), {
            method: "PATCH",
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ files })
          }).then(function(r) {
            if (!r.ok) return r.text().then(function(t) {
              throw new Error(t || String(r.status));
            });
            return true;
          });
        }
        window.SYNC = { cfg, push, pull };
      })();
    }
  });
  require_sync();
})();
