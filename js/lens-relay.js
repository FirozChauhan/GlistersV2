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
  var require_lens_relay = __commonJS({
    "src/lens-relay.ts"() {
      const LENS_UPLOAD_BASE = "https://lens.google.com/v3/upload";
      self.addEventListener("message", function(e) {
        const msg = e.data;
        if (!msg || msg.type !== "lens-upload" || !msg.id || !msg.file) return;
        const id = msg.id;
        const file = msg.file;
        const reply = function(m) {
          try {
            parent.postMessage(m, "*");
          } catch {
          }
        };
        const form = document.getElementById("lensForm");
        const input = document.getElementById("lensFile");
        if (!form || !input) {
          reply({ type: "lens-result", id, error: "relay form missing" });
          return;
        }
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        if (!input.files.length) {
          reply({ type: "lens-result", id, error: "file not accepted by relay" });
          return;
        }
        form.action = LENS_UPLOAD_BASE + "?ep=gsbubb&st=" + Date.now() + "&hl=" + encodeURIComponent((navigator.language || "en").toLowerCase()) + "&vpw=" + window.screen.width + "&vph=" + window.screen.height;
        try {
          form.submit();
          reply({ type: "lens-result", id, ok: true });
        } catch (err) {
          reply({ type: "lens-result", id, error: String(err) });
        }
      });
    }
  });
  require_lens_relay();
})();
