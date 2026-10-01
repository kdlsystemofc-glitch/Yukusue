// Coerência: loops simultâneos por posição de rolagem + vídeo da página inteira (1440x900).
import { chromium } from "playwright"; import { resolve } from "node:path"; import { pathToFileURL } from "node:url";
import { mkdirSync, renameSync, readdirSync } from "node:fs";
const out = resolve("screenshots/motion/video"); mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
const p = await ctx.newPage();
await p.goto(pathToFileURL(resolve("site/index.html")).href + "?q=high", { waitUntil: "load" });
await p.waitForFunction(() => document.documentElement.dataset.motionReady === "1");
await p.waitForTimeout(800);
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
let max = 0; const linhas = [];
await p.mouse.move(700, 450);
for (let y = 0; y <= H + 120; y += 120) {
  await p.mouse.wheel(0, 120); await p.waitForTimeout(260);
  const r = await p.evaluate(() => ({ y: Math.round(scrollY), loops: YMotion.info().loops.filter(l => l.running).map(l => l.cls),
    animando: window.gsap.globalTimeline.getChildren(true, true, false).filter(t => t.isActive()).length }));
  max = Math.max(max, r.loops.length); linhas.push(r);
}
await p.waitForTimeout(1500);
for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, -400); await p.waitForTimeout(60); } // volta rápida ao topo
await p.waitForTimeout(1500);
await ctx.close(); await b.close();
const f = readdirSync(out).filter(x => x.endsWith(".webm")).sort().pop(); renameSync(resolve(out, f), resolve(out, "pagina-1440.webm"));
for (const l of linhas) console.log(`y=${String(l.y).padStart(5)} loops=${l.loops.length} ${l.loops.join(",")} tweens-ativos=${l.animando}`);
console.log("máx. loops simultâneos:", max);
