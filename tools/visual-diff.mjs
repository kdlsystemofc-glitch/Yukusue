// Regressão visual página inteira: node tools/visual-diff.mjs <index-antes> <index-depois>
// Sem motion (?motion=off), métrica perceptiva (desfoque 1px, limiar 24), tolerância 0,5%.
import { chromium } from "playwright"; import { resolve } from "node:path"; import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process"; import { mkdirSync } from "node:fs";
const [A, B] = process.argv.slice(2); const out = resolve("screenshots/otimizacao"); mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const pares = [];
for (const [w, h] of [[1920, 1080], [1440, 900], [768, 1024], [390, 844], [320, 568]]) {
  for (const [tag, f] of [["antes", A], ["depois", B]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(pathToFileURL(resolve(f)).href + "?motion=off", { waitUntil: "networkidle" });
    await p.evaluate(async () => { await document.fonts.ready; for (const i of document.images) i.loading = "eager";
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${w}-${tag}.png`, fullPage: true }); await p.close();
  }
  pares.push([`${w}`, `${out}/${w}-antes.png`, `${out}/${w}-depois.png`]);
}
await b.close();
const r = execFileSync("python", ["-W", "ignore", "-c", `
import json,sys
from PIL import Image, ImageChops, ImageFilter
for n,a,b in json.loads(sys.argv[1]):
    A=Image.open(a).convert('RGB'); B=Image.open(b).convert('RGB')
    if A.size!=B.size: print(n,'TAMANHO DIFERENTE',A.size,B.size); continue
    d=ImageChops.difference(A.filter(ImageFilter.GaussianBlur(1)),B.filter(ImageFilter.GaussianBlur(1))).convert('L').point(lambda v:255 if v>24 else 0)
    v=sum(1 for x in d.getdata() if x)/(A.width*A.height)*100
    print(n, f'{v:.3f}%', 'ok' if v<=0.5 else 'FALHA', d.getbbox())`, JSON.stringify(pares)]).toString();
console.log(r);
