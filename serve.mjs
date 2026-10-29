/* Lokalni pregled gotovog sajta: node serve.mjs, pa http://localhost:8080 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = join(dirname(fileURLToPath(import.meta.url)), 'docs');
const PORT = +process.env.PORT || 8080;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
  let file = join(DOCS, path);
  if (!file.startsWith(DOCS)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) {
      if (!req.url.split('?')[0].endsWith('/')) { res.writeHead(301, { Location: req.url.replace(/(\?|$)/, '/$1') }).end(); return; }
      file = join(file, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(await readFile(join(DOCS, '404.html')).catch(() => 'Nema stranice'));
  }
}).listen(PORT, () => console.log(`Pregled: http://localhost:${PORT}`));
