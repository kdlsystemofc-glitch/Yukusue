// Uso: node tools/shot.mjs <seletor-da-secao> [seletor-da-anterior] [larguras=1440,390] [rotulo]
// Sempre gera: seção isolada + página inteira (+ costura com a anterior, se informada).
// Saída: screenshots/<rotulo>/<largura>-{secao,pagina,costura}.png
import { chromium } from "playwright";
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const [sel, prev, widthsArg = "1440,390", labelArg] = process.argv.slice(2);
if (!sel) { console.error("informe o seletor da seção"); process.exit(1); }
const widths = widthsArg.split(",").map(Number);
const label = labelArg || sel.replace(/[^a-z0-9-]/gi, "");
const out = resolve("screenshots", label);
mkdirSync(out, { recursive: true });

// Garantia: nada de /design é referenciado pelo site.
function walk(d) { return readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
const leaks = walk("site").filter(f => /\.(html|css|js|svg)$/.test(f))
  .filter(f => {
    const code = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, "");
    return /(?:design[\/\\]|mockup-full|secoes[\/\\]|Gemini_Generated)/i.test(code);
  });
if (leaks.length) { console.error("ERRO: referência a /design em:", leaks); process.exit(2); }

const url = pathToFileURL(resolve("site/index.html")).href;
const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // força carregamento de imagens lazy
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) console.warn(`AVISO ${w}px: rolagem horizontal de ${overflow}px`);
  await page.locator(sel).screenshot({ path: join(out, `${w}-secao.png`) });
  await page.screenshot({ path: join(out, `${w}-pagina.png`), fullPage: true });
  if (prev) {
    const box = await page.evaluate(([a, b]) => {
      const p = document.querySelector(a).getBoundingClientRect();
      const c = document.querySelector(b).getBoundingClientRect();
      return { top: p.bottom + scrollY, cur: c.top + scrollY };
    }, [prev, sel]);
    const y = Math.max(0, box.top - 260);
    await page.screenshot({ path: join(out, `${w}-costura.png`), fullPage: true, clip: { x: 0, y, width: w, height: 520 } });
  }
  await page.close();
  console.log(`ok ${w}px -> ${out}`);
}
await browser.close();
