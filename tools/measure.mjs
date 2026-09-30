// Uso: node tools/measure.mjs <largura> <seletor> [seletor...] — imprime caixas
import { chromium } from "playwright";
import { resolve } from "node:path"; import { pathToFileURL } from "node:url";
const [w, ...sels] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(pathToFileURL(resolve("site/index.html")).href, { waitUntil: "networkidle" });
for (const s of sels) {
  const r = await p.$$eval(s, els => els.map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)]; }));
  console.log(s, JSON.stringify(r));
}
await b.close();
