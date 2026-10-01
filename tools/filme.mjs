// Tira de quadros ao longo da rolagem: node tools/filme.mjs [largura=1440] [passo=220]
import { chromium } from "playwright"; import { resolve } from "node:path"; import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process"; import { mkdirSync } from "node:fs";
const W = +(process.argv[2] || 1440), step = +(process.argv[3] || 220), H = W > 800 ? 900 : 844;
const out = resolve("screenshots/motion/filme"); mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
const erros = []; p.on("pageerror", e => erros.push(e.message)); p.on("console", m => m.type() === "error" && erros.push(m.text()));
await p.goto(pathToFileURL(resolve("site/index.html")).href + "?q=high", { waitUntil: "load" });
await p.waitForFunction(() => document.documentElement.dataset.cinemaReady === "1", null, { timeout: 10000 });
const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const fs = [];
for (let y = 0, k = 0; y <= max + step; y += step, k++) {
  await p.evaluate(y => YMotion.lenis ? YMotion.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y), Math.min(y, max));
  await p.waitForTimeout(1300);
  const f = `${out}/${W}-${String(k).padStart(2, "0")}.png`; await p.screenshot({ path: f }); fs.push(f);
}
console.log("quadros", fs.length, "altura", max, erros.length ? "ERROS: " + erros.join(" | ") : "sem erros");
execFileSync("python", ["-W", "ignore", "-c", `
import sys
from PIL import Image
fs=sys.argv[2:]; tw=360; ims=[Image.open(f).convert('RGB') for f in fs]; ims=[i.resize((tw,int(i.height*tw/i.width))) for i in ims]
cols=5; rows=(len(ims)+cols-1)//cols; h=ims[0].height
c=Image.new('RGB',(cols*(tw+8),rows*(h+8)),(255,0,255))
for k,i in enumerate(ims): c.paste(i,((k%cols)*(tw+8),(k//cols)*(h+8)))
c.save(sys.argv[1])`, `${out}/${W}-folha.png`, ...fs]);
await b.close();
