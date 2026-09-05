#!/usr/bin/env node
/* Builds a TEST copy of the extension in dist/firefox-test/ — for automated
   (Selenium/Puppeteer/Playwright/headless) runs. It is identical to the
   release build EXCEPT js/config.js, whose gist id + GitHub token are blanked,
   so window.SYNC.cfg.enabled is false and the instance physically cannot read
   or write the user's real Gist.

   WHY: on 2026-09-05 a headless test loaded the release build (real config),
   seeded its links from links.txt, and pushed that seed over the user's
   curated cloud list. The sync.ts navigator.webdriver guard is the runtime
   backstop; this script is the build-time one. NEVER point an automated
   browser at dist/firefox/ or the repo root — always build:test and load
   dist/firefox-test/.

   Run:  node scripts/build-test.mjs   (or: npm run build:test)
*/
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'firefox-test');

const manifest = JSON.parse(
  readFileSync(join(root, 'manifest.firefox.json'), 'utf8')
);

const files = [
  ['manifest.firefox.json', 'manifest.json'],
  ['newtab.html', null],
  ['lens-relay.html', null],
  ['popup.html', null],
  ['popup.js', null],
  ['background.js', null],
  ['css', null],
  ['js', null],
  ['icons', null],
  ['default-save.json', null],
  ['links.txt', null],
  ['LICENSE', null],
];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const [src, dstName] of files) {
  const dst = dstName || src;
  cpSync(join(root, src), join(out, dst), { recursive: true });
}

/* The whole point: credentials stripped → sync disabled at runtime. */
writeFileSync(join(out, 'js', 'config.js'), 'window.CONFIG = ' + JSON.stringify({
  gistId: '',
  githubToken: '',
  wallhavenKey: '',
  generatedAt: new Date().toISOString(),
  testBuild: true
}, null, 2) + ';\n');

console.log('[build-test] ' + manifest.version + ' — test build in dist/firefox-test/ (GIST SYNC DISABLED — safe for automation)');
