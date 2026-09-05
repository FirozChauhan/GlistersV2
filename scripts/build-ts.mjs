#!/usr/bin/env node
/**
 * Compile src/*.ts → js/*.js (standalone IIFE per entry, same script-tag
 * structure the extension already uses). Types are erased; the only shared
 * imports are `import type`, so each output is dependency-free and loads
 * fine as a plain <script>.
 *
 * js/config.js is NOT compiled — it stays a generated one-liner written by
 * scripts/gen-config.mjs from the .env.
 */
import * as esbuild from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENTRIES = [
  ['sync', 'src/sync.ts', 'js/sync.js'],
  ['walls', 'src/walls.ts', 'js/walls.js'],
  ['bookmarks', 'src/bookmarks.ts', 'js/bookmarks.js'],
  ['app', 'src/app.ts', 'js/app.js'],
  ['lens-relay', 'src/lens-relay.ts', 'js/lens-relay.js'],
];

const opts = {
  bundle: false,
  format: 'iife',
  target: 'es2020',
  charset: 'utf8',
  sourcemap: false,
  legalComments: 'none',
  logLevel: 'info',
};

for (const [name, src, out] of ENTRIES) {
  mkdirSync(dirname(join(root, out)), { recursive: true });
  await esbuild.build({ ...opts, entryPoints: [join(root, src)], outfile: join(root, out) });
  console.log(`✓ ${name} → ${out}`);
}
console.log('ts build done');
