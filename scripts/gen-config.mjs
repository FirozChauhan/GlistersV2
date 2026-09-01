/* Regenerates js/config.js from .env.
   The extension reads window.CONFIG at runtime. js/config.js is GITIGNORED — it
   holds the real gist id + GitHub token + wallhaven key, which must never be
   committed (GitHub push protection blocks any token that reaches a commit).

   Run: node scripts/gen-config.mjs   (or: npm run gen-config)
*/
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');

if (!existsSync(envPath)) {
  console.error('missing .env — copy .env.example to .env and fill it in first');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const cfg = {
  gistId: env.GIST_ID ? env.GIST_ID.trim() : '',
  githubToken: env.GITHUB_TOKEN ? env.GITHUB_TOKEN.trim() : '',
  wallhavenKey: env.WALLHAVEN_API_KEY ? env.WALLHAVEN_API_KEY.trim() : '',
  generatedAt: new Date().toISOString()
};

writeFileSync(resolve(root, 'js/config.js'), 'window.CONFIG = ' + JSON.stringify(cfg, null, 2) + ';\n');
console.log('wrote js/config.js');
console.log('gist id: ' + (cfg.gistId ? 'set' : 'NOT SET (sync stays off)'));
console.log('github token: ' + (cfg.githubToken ? 'set' : 'NOT SET (sync stays off)'));
console.log('wallhaven key: ' + (cfg.wallhavenKey ? 'set' : 'NOT SET (NSFW disabled)'));
