// Quadros-chave de uma seção: node tools/keyframes.mjs <seletor> <rotulo> [largura=1440] [modo=scroll|entrada]
//  entrada: rola até a seção ficar 35% visível e captura em 0/150/300/500/800/1200 ms
//  scroll : captura a seção em 0/150/300/450 px de rolagem (efeitos de saída/parallax)
// Saída: screenshots/motion/kf-<rotulo>.png (tira horizontal) + valores de transform/opacity por quadro.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const [sel, label, w = "1440", modo = "entrada"] = process.argv.slice(2);
const W = +w, H = W > 800 ? 900 : 844;
const OUT = resolve("screenshots/motion"); mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(pathToFileURL(resolve("site/index.html")).href + "?q=high", { waitUntil: "load" });
await p.waitForFunction(() => document.documentElement.dataset.motionReady === "1");
const alvos = `${sel} [data-reveal], ${sel} [data-parallax], ${sel} [data-loop], ${sel}[data-reveal]`;
const ler = () => p.evaluate(a => [...document.querySelectorAll(a)].map(e => {
  const s = getComputedStyle(e); return `${(e.className || e.tagName).toString().split(" ")[0]} op=${(+s.opacity).toFixed(2)} ${s.transform === "none" ? "" : s.transform.replace(/matrix\(|\)/g, "").split(",").map(v => (+v).toFixed(2)).join(",")}`; }), alvos);
const frames = [];
const go = y => p.evaluate(y => { const L = window.YMotion.lenis; L ? L.scrollTo(y, { immediate: true }) : scrollTo(0, y); }, y);
if (modo === "scroll") {
  for (const y of [0, 150, 300, 450]) { await go(y); await p.waitForTimeout(250);
    const f = join(OUT, `kf-${label}-${y}.png`); await p.screenshot({ path: f }); frames.push(f); console.log(`scroll ${y}px:`, (await ler()).join(" | ")); }
} else {
  const y = await p.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return r.top + scrollY - innerHeight * 0.55; }, sel);
  await go(Math.max(0, y));
  const t0 = Date.now();
  for (const t of [0, 150, 300, 500, 800, 1200]) {
    const wait = t - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
    const f = join(OUT, `kf-${label}-${t}.png`); await p.screenshot({ path: f }); frames.push(f);
    console.log(`${t}ms:`, (await ler()).join(" | "));
  }
}
await b.close();
execFileSync("python", ["-W", "ignore", "-c", `
import sys
from PIL import Image
fs=sys.argv[2:]; ims=[Image.open(f).convert('RGB') for f in fs]
w=480; ims=[i.resize((w,int(i.height*w/i.width))) for i in ims]
c=Image.new('RGB',(w*len(ims)+8*(len(ims)-1),ims[0].height),(255,0,255))
for k,i in enumerate(ims): c.paste(i,(k*(w+8),0))
c.save(sys.argv[1])
import os
[os.remove(f) for f in fs]`, join(OUT, `kf-${label}.png`), ...frames]);
console.log("->", join(OUT, `kf-${label}.png`));
