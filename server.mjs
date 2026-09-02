/* ===========================================================================
   Tidewater Partners — local development server
   ---------------------------------------------------------------------------
   Zero dependencies. Uses only what ships with Node.js, so there is no
   `npm install` step and nothing to keep up to date.

   Run it with:   npm start          (or:  node server.mjs)
   Then open:     http://localhost:4321

   Whenever you save a file in this folder, the browser reloads by itself.
   =========================================================================== */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const START_PORT = Number(process.env.PORT) || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

/* --- live-reload plumbing ------------------------------------------------ */

const clients = new Set();

const RELOAD_SNIPPET = `
<!-- injected by server.mjs for local development only -->
<script>
(function () {
  var es = new EventSource('/__reload');
  es.onmessage = function () { location.reload(); };
  es.onerror = function () { /* server restarting - EventSource retries on its own */ };
})();
</script>
`;

function broadcastReload() {
  for (const res of clients) {
    try { res.write('data: reload\n\n'); } catch { clients.delete(res); }
  }
}

/* --- static file serving ------------------------------------------------- */

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const resolved = path.join(ROOT, path.normalize(decoded).replace(/^([/\\])+/, ''));
  // never serve anything above this folder
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

async function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store, must-revalidate'
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // live-reload event stream
  if (req.url.startsWith('/__reload')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write('retry: 500\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let filePath = safeResolve(req.url === '/' ? '/index.html' : req.url);
  if (!filePath) return send(res, 403, 'Forbidden', 'text/plain');

  try {
    let stat = await fsp.stat(filePath).catch(() => null);

    // /about -> /about.html, and directories -> their index.html
    if (!stat && !path.extname(filePath)) {
      const asHtml = filePath + '.html';
      if (await fsp.stat(asHtml).catch(() => null)) {
        filePath = asHtml;
        stat = await fsp.stat(filePath);
      }
    }
    if (stat?.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stat = await fsp.stat(filePath).catch(() => null);
    }
    if (!stat) {
      return send(res, 404, `<h1>404</h1><p>Not found: ${req.url}</p>`, MIME['.html']);
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';

    if (ext === '.html') {
      let html = await fsp.readFile(filePath, 'utf8');
      html = html.includes('</body>')
        ? html.replace('</body>', RELOAD_SNIPPET + '</body>')
        : html + RELOAD_SNIPPET;
      return send(res, 200, html, type);
    }

    return send(res, 200, await fsp.readFile(filePath), type);
  } catch (err) {
    return send(res, 500, `<h1>500</h1><pre>${err.message}</pre>`, MIME['.html']);
  }
});

/* --- watch for edits ----------------------------------------------------- */

const IGNORED = /(^|[\\/])(node_modules|\.git|\.claude)([\\/]|$)/;
let debounce = null;

try {
  fs.watch(ROOT, { recursive: true }, (_event, filename) => {
    if (!filename || IGNORED.test(filename)) return;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      console.log(`  ↻ ${filename} changed - reloading browser`);
      broadcastReload();
    }, 80);
  });
} catch {
  console.log('  (file watching unavailable - refresh the browser manually)');
}

/* --- start, stepping past a busy port ------------------------------------ */

// Announced once, reading the port we actually landed on rather than the one
// we asked for — otherwise a busy port prints a URL that doesn't work.
server.on('listening', () => {
  const { port } = server.address();
  console.log('');
  console.log('  Tidewater Partners - local site');
  console.log('  ───────────────────────────────────────────');
  console.log(`  Open:     http://localhost:${port}`);
  console.log(`  Folder:   ${ROOT}`);
  console.log('  Editing:  save any file and the page reloads');
  console.log('  Stop:     press Ctrl+C');
  console.log('');
});

function listen(port, attempt = 0) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt < 10) {
      console.log(`  port ${port} is busy, trying ${port + 1}…`);
      return listen(port + 1, attempt + 1);
    }
    console.error(err.message);
    process.exit(1);
  });
  server.listen(port);
}

listen(START_PORT);
