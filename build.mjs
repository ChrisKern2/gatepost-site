/* ===========================================================================
   Build the deploy folder.
   ---------------------------------------------------------------------------
   Copies only the files a host should serve into _deploy/.

   server.mjs and package.json stay out on purpose. If they sit next to
   index.html, Vercel detects a Node backend, treats server.mjs as the app
   entrypoint, and then serves nothing static. Deploying a clean folder avoids
   that entirely.

   Run it with:   npm run build
   Vercel runs it automatically on each push (see vercel.json).
   =========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, '_deploy');

const INCLUDE = ['index.html', 'robots.txt', 'sitemap.xml',
                 'favicon.svg', 'apple-touch-icon.png'];
const INCLUDE_DIRS = ['assets'];
const SKIP_NAMES = new Set(['README.txt', 'README.md', '.DS_Store', 'Thumbs.db']);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let count = 0;
let bytes = 0;

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  count++;
  bytes += fs.statSync(to).size;
}

function copyDir(rel) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const childRel = path.join(rel, entry.name);
    if (entry.isDirectory()) copyDir(childRel);
    else copyFile(path.join(ROOT, childRel), path.join(OUT, childRel));
  }
}

for (const f of INCLUDE) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) copyFile(src, path.join(OUT, f));
  else console.warn(`  missing (skipped): ${f}`);
}
for (const d of INCLUDE_DIRS) copyDir(d);

console.log(`_deploy ready: ${count} files, ${(bytes / 1024).toFixed(0)} KB`);
for (const f of fs.readdirSync(OUT)) console.log('  ' + f);
