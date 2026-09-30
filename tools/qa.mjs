// QA responsivo: node tools/qa.mjs [modo]
// modos: base (padrão) | zoom (texto 200%) | nofont (Google Fonts bloqueado) | reduced | dark
// Para cada tela: rolagem horizontal, texto cortado/sobreposto, alvos de toque < 44px,
// erros de console e screenshot da página inteira em screenshots/qa/<modo>/<tela>.png
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const modo = process.argv[2] || "base";
const telas = [[2560,1440],[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[360,740],[320,568],[844,390]];
const out = resolve("screenshots/qa", modo); mkdirSync(out, { recursive: true });
const url = pathToFileURL(resolve("site/index.html")).href;
const browser = await chromium.launch();
let falhas = 0;

for (const [w, h] of telas) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1,
    reducedMotion: modo === "reduced" ? "reduce" : "no-preference",
    colorScheme: modo === "dark" ? "dark" : "light",
    hasTouch: w < 900, isMobile: w < 900,
  });
  const page = await ctx.newPage();
  const erros = [];
  page.on("console", m => { if (m.type() === "error") erros.push(m.text()); });
  page.on("pageerror", e => erros.push(e.message));
  if (modo === "nofont") await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(url, { waitUntil: "networkidle" });
  if (modo === "zoom") await page.addStyleTag({ content: "html{font-size:200%!important}" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const i of document.images) i.loading = "eager";
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  });
  const r = await page.evaluate(() => {
    const res = { overflow: document.documentElement.scrollWidth - innerWidth, cortado: [], sobreposto: [], toque: [] };
    const vis = el => { const s = getComputedStyle(el); return s.visibility !== "hidden" && s.display !== "none" && el.getClientRects().length && !el.closest(".sr-only,.skip"); };
    // textos: elementos-folha com texto
    const textos = [...document.querySelectorAll("body *")].filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    for (const e of textos) {
      if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== "visible") res.cortado.push(e.textContent.trim().slice(0, 40));
      const b = e.getBoundingClientRect();
      if (b.right > innerWidth + 1 || b.left < -1) res.cortado.push("fora da tela: " + e.textContent.trim().slice(0, 40));
    }
    // sobreposição texto x texto (blocos distintos)
    const blocos = textos.map(e => [e, e.getBoundingClientRect()]);
    for (let i = 0; i < blocos.length; i++) for (let j = i + 1; j < blocos.length; j++) {
      const [a, A] = blocos[i], [b, B] = blocos[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ix = Math.min(A.right, B.right) - Math.max(A.left, B.left), iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
      if (ix > 2 && iy > 2) res.sobreposto.push(`${a.textContent.trim().slice(0, 25)} × ${b.textContent.trim().slice(0, 25)}`);
    }
    // texto sobre imagem de comida (legibilidade)
    for (const a of document.querySelectorAll("a, button")) {
      if (!vis(a)) continue;
      const b = a.getBoundingClientRect();
      if (b.height < 44 || b.width < 44) res.toque.push(`${a.textContent.trim().slice(0, 25)} (${Math.round(b.width)}×${Math.round(b.height)})`);
    }
    return res;
  });
  await page.screenshot({ path: `${out}/${w}x${h}.png`, fullPage: true });
  const probs = [];
  if (r.overflow > 0) probs.push(`rolagem horizontal ${r.overflow}px`);
  if (r.cortado.length) probs.push(`cortado: ${[...new Set(r.cortado)].join(" | ")}`);
  if (r.sobreposto.length) probs.push(`sobreposto: ${[...new Set(r.sobreposto)].join(" | ")}`);
  if (r.toque.length) probs.push(`toque<44: ${[...new Set(r.toque)].join(" | ")}`);
  if (erros.length) probs.push(`console: ${erros.join(" | ")}`);
  falhas += probs.length;
  console.log(`${String(w).padStart(4)}x${h}: ${probs.length ? probs.join("\n            ") : "ok"}`);
  await ctx.close();
}
await browser.close();
console.log(falhas ? `\n${falhas} problema(s) [${modo}]` : `\ntudo ok [${modo}]`);
