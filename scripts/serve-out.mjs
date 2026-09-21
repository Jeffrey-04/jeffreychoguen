/**
 * Petit serveur statique pour inspecter out/ localement.
 * Reproduit le comportement de Nginx : /chemin/ sert /chemin/index.html.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const ROOT = "out";
const PORT = Number(process.argv[2] ?? 8070);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".pdf": "application/pdf",
  ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".wasm": "application/wasm",
  ".gz": "application/gzip", ".ico": "image/x-icon",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let file = join(ROOT, normalize(url).replace(/^(\.\.[/\\])+/, ""));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`out/ servi sur http://localhost:${PORT}`));
