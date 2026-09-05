/* Image-search relay for the command bar. Loaded by app.ts inside a SANDBOXED
   iframe, which gives this document an opaque origin. That is the whole point:
   Google retired the old searchbyimage/upload endpoint (it now 400s) and the
   Lens replacement — lens.google.com/v3/upload — 403s any request whose Origin
   header is a chrome-extension:// / moz-extension:// origin, but it accepts
   `Origin: null`, which is exactly what an opaque-origin frame sends.

   We cannot read the results URL from here: a no-cors fetch returns an opaque
   response whose .url Chrome now redacts, and the frame cannot see into the
   popup it opens. So instead we let the browser do the navigating — a form
   POST (target=_blank) follows Google's 303 all the way to the
   google.com/search?vsrid=… results page in a new tab, no URL-reading needed.
   The only message back to the parent is "submitted". */

/* The real lens.google.com UI posts to this exact endpoint; the plain
   /upload path still answers curl but returns 500 to browser-shaped
   requests, so we mirror the working one. */
const LENS_UPLOAD_BASE = 'https://lens.google.com/v3/upload';

interface LensUploadMsg {
  type: 'lens-upload';
  id: string;
  file: File;
}

interface LensResultMsg {
  type: 'lens-result';
  id: string;
  ok?: boolean;
  error?: string;
}

self.addEventListener('message', function (e: MessageEvent) {
  const msg = e.data as Partial<LensUploadMsg> | null;
  if (!msg || msg.type !== 'lens-upload' || !msg.id || !msg.file) return;
  const id: string = msg.id;
  const file: File = msg.file;

  const reply = function (m: LensResultMsg): void {
    try { parent.postMessage(m, '*'); } catch { /* parent gone — noop */ }
  };

  const form = document.getElementById('lensForm') as HTMLFormElement | null;
  const input = document.getElementById('lensFile') as HTMLInputElement | null;
  if (!form || !input) {
    reply({ type: 'lens-result', id: id, error: 'relay form missing' });
    return;
  }

  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  if (!input.files.length) {
    reply({ type: 'lens-result', id: id, error: 'file not accepted by relay' });
    return;
  }

  form.action = LENS_UPLOAD_BASE +
    '?ep=gsbubb&st=' + Date.now() +
    '&hl=' + encodeURIComponent((navigator.language || 'en').toLowerCase()) +
    '&vpw=' + window.screen.width +
    '&vph=' + window.screen.height;

  try {
    form.submit();
    reply({ type: 'lens-result', id: id, ok: true });
  } catch (err) {
    reply({ type: 'lens-result', id: id, error: String(err) });
  }
});
