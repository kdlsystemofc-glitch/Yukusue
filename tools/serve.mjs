// Servidor local que imita os cabeçalhos do DEPLOY.md (só para medir): node tools/serve.mjs [porta=8766]
import { createServer } from "node:http"; import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path"; import { brotliCompressSync, gzipSync } from "node:zlib";
const root = resolve("site"), port = +(process.argv[2] || 8766);
const TYPE = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json", ".svg": "image/svg+xml" };
const CACHE = { ".html": "no-cache", ".js": "public, max-age=31536000, immutable", ".webp": "public, max-age=31536000, immutable",
  ".png": "public, max-age=31536000, immutable", ".woff2": "public, max-age=31536000, immutable" };
createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const f = join(root, p); if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const ext = extname(f); let body = readFileSync(f); const h = { "Content-Type": TYPE[ext] || "application/octet-stream", "Cache-Control": CACHE[ext] || "public, max-age=3600" };
  const ae = req.headers["accept-encoding"] || "";
  if ([".html", ".js", ".css", ".json", ".svg"].includes(ext)) {
    if (ae.includes("br")) { body = brotliCompressSync(body); h["Content-Encoding"] = "br"; }
    else if (ae.includes("gzip")) { body = gzipSync(body); h["Content-Encoding"] = "gzip"; }
    h["Vary"] = "Accept-Encoding";
  }
  res.writeHead(200, h); res.end(body);
}).listen(port, () => console.log("servindo site/ em http://localhost:" + port));
