// Regressão de motion: node tools/motion-test.mjs [secoes=hero,pratos,bebidas,local] [--cost]
// Sai com código 1 se algo falhar. Screenshots em screenshots/motion/.
import { chromium, webkit } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const doCost = args.includes("--cost");
const secoes = (args.find(a => !a.startsWith("--")) || "hero,pratos,bebidas,local").split(",");
const SEL = { hero: ".s-hero", pratos: ".s-pratos", bebidas: ".s-bebidas", local: ".s-local", header: ".s-header" };
const OUT = resolve("screenshots/motion"); mkdirSync(OUT, { recursive: true });
const base = process.env.QA_HTTP ? "http://localhost:8766/" : pathToFileURL(resolve("site/index.html")).href; // QA_HTTP=1 + tools/serve.mjs
const browser = await (process.env.QA_BROWSER === "webkit" ? webkit : chromium).launch(); // QA_BROWSER=webkit
const falhas = [];
const T0 = Date.now();
const log = (ok, msg) => { console.log(`${ok ? "  ok " : "  FALHA"} ${msg}  [${((Date.now() - T0) / 1000).toFixed(0)}s]`); if (!ok) falhas.push(msg); };

async function abrir(vp, qs = "", opts = {}) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: opts.reduced ? "reduce" : "no-preference", javaScriptEnabled: opts.js !== false });
  const page = await ctx.newPage();
  const erros = [];
  page.on("console", m => { if (m.type() === "error") erros.push(m.text()); });
  page.on("pageerror", e => erros.push(e.message));
  await page.goto(base + qs, { waitUntil: "load" });
  if (opts.js !== false && !qs.includes("motion=off")) await page.waitForFunction(() => document.documentElement.dataset.motionReady === "1", null, { timeout: 8000 }).catch(() => erros.push("motion não ficou pronto"));
  if (opts.js !== false && !qs.includes("motion=off") && !opts.reduced) await page.waitForFunction(() => document.documentElement.dataset.cinemaReady === "1", null, { timeout: 8000 }).catch(() => erros.push("cinema não ficou pronto"));
  await page.evaluate(async () => { await document.fonts.ready; for (const i of document.images) i.loading = "eager";
    await Promise.race([Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))), new Promise(r => setTimeout(r, 4000))]); });
  return { ctx, page, erros };
}
const pausa = ms => new Promise(r => setTimeout(r, ms));
const rolarPara = async (page, y) => page.evaluate(y => { const L = window.YMotion && window.YMotion.lenis; L ? L.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); }, y);

// ---------------------------------------------------------------- 1. invariantes por modo
const modos = [
  ["full-high", "?q=high", {}], ["full-low", "?q=low", {}], ["reduced", "", { reduced: true }], ["paused", "?motion=paused&q=high", {}],
];
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (const [nome, qs, o] of modos) {
    console.log(`\n[${nome} ${vp.width}x${vp.height}]`);
    const { ctx, page, erros } = await abrir(vp, qs, o);
    // acima da dobra: tudo visível já no primeiro quadro pós-motion
    const escondidoTopo = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter(e => {
      const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && +getComputedStyle(e).opacity < 0.99; }).length);
    log(escondidoTopo === 0, `nada acima da dobra escondido (${escondidoTopo})`);
    // fita + ancestrais nunca ganham transform/filter/opacity, durante toda a rolagem
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    let violacoes = new Set();
    for (let y = 0; y <= H; y += 180) {
      await rolarPara(page, y); await pausa(40);
      const v = await page.evaluate(() => {
        const out = []; let el = document.querySelector(".flow__fita");
        while (el && el !== document.documentElement) { const s = getComputedStyle(el);
          if (s.transform !== "none" || s.filter !== "none" || +s.opacity < 1 || s.translate !== "none" || s.rotate !== "none" || s.scale !== "none") out.push(el.className || el.tagName);
          el = el.parentElement; }
        return out; });
      v.forEach(x => violacoes.add(x));
    }
    log(violacoes.size === 0, `fita e ancestrais intactos na rolagem inteira ${violacoes.size ? [...violacoes].join(",") : ""}`);
    await pausa(1200);
    const info = await page.evaluate(() => window.YMotion && window.YMotion.info());
    log(info && info.hidden === 0, `rolagem completa: nada preso escondido (${info && info.hidden})`);
    const opac = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter(e => +getComputedStyle(e).opacity < 0.99).map(e => e.className));
    log(opac.length === 0, `todos os data-reveal com opacidade 1 ${opac.join(",")}`);
    if (nome === "reduced") log(info.loops.length === 0 && info.parallax === 0 && !info.lenis, `reduced: sem loops/parallax/Lenis (${info.loops.length}/${info.parallax}/${info.lenis})`);
    if (nome === "full-low") log(info.loops.length === 0 && !info.lenis, `low: sem loops e sem Lenis (${info.loops.length}/${info.lenis})`);
    if (nome === "paused") {
      await rolarPara(page, 0); await pausa(300);
      const a = await page.evaluate(() => [...document.querySelectorAll("[data-loop],[data-parallax]")].map(e => getComputedStyle(e).transform));
      await pausa(700);
      const b = await page.evaluate(() => [...document.querySelectorAll("[data-loop],[data-parallax]")].map(e => getComputedStyle(e).transform));
      log(JSON.stringify(a) === JSON.stringify(b), "pausado: nada se move");
      await page.evaluate(() => window.YMotion.resume()); await pausa(900);
      const c = await page.evaluate(() => window.YMotion.info());
      log(!c.paused, "retoma após pausa");
    }
    log(erros.length === 0, `sem erros de console ${erros.join(" | ")}`);
    await ctx.close();
  }
}

// ---------------------------------------------------------------- 1b. empilhamento com a fita (no meio das animações)
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  console.log(`
[empilhamento fita x camadas animadas ${vp.width}]`);
  const { ctx, page } = await abrir(vp, "?q=high");
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const erradas = new Set();
  for (let y = 0; y <= H; y += 260) {
    await rolarPara(page, y); await pausa(220); // captura no meio de entradas/parallax
    const r = await page.evaluate(() => {
      const fita = document.querySelector(".flow__fita"); fita.style.pointerEvents = "auto";
      const F = fita.getBoundingClientRect(); const bad = [];
      for (const el of document.querySelectorAll(".flow [data-reveal], .flow [data-parallax], .flow [data-loop], .flow [data-scrub]")) {
        if (+getComputedStyle(el).opacity < 0.5) continue;
        const R = el.getBoundingClientRect();
        const x0 = Math.max(F.left, R.left, 0), x1 = Math.min(F.right, R.right, innerWidth), y0 = Math.max(F.top, R.top, 0), y1 = Math.min(F.bottom, R.bottom, innerHeight);
        if (x1 - x0 < 8 || y1 - y0 < 8) continue;
        for (let i = 1; i < 4; i++) for (let j = 1; j < 4; j++) {
          const top = document.elementFromPoint(x0 + (x1 - x0) * i / 4, y0 + (y1 - y0) * j / 4);
          if (top === fita) { bad.push(el.className); break; }
        }
      }
      fita.style.pointerEvents = ""; return bad; });
    r.forEach(x => erradas.add(x));
  }
  // o bambu e as cenas precisam ficar NA FRENTE da fita (é o desenho aprovado)
  log(erradas.size === 0, `camadas animadas continuam na frente da fita ${[...erradas].join(",")}`);
  await ctx.close();
}

// ---------------------------------------------------------------- 2. navegação rápida
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  console.log(`\n[navegação rápida ${vp.width}]`);
  const { ctx, page } = await abrir(vp, "?q=high");
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const alvo of ["#onde", 0, "#bebidas", "#pratos", H, 0, "#bebidas", H / 2]) {
    if (typeof alvo === "string") await page.evaluate(a => { const L = window.YMotion.lenis, el = document.querySelector(a); L ? L.scrollTo(el, { immediate: true }) : el.scrollIntoView(); }, alvo);
    else await rolarPara(page, alvo);
    await pausa(90);
  }
  await pausa(1400);
  const presos = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter(e => {
    const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && +getComputedStyle(e).opacity < 0.99; }).map(e => e.className));
  log(presos.length === 0, `após pular/voltar nada visível ficou escondido ${presos.join(",")}`);
  await ctx.close();
}

// ---------------------------------------------------------------- 3. quadros finais x estático aprovado
console.log("\n[quadros-chave x estático]");
const pares = [];
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const st = await abrir(vp, "", { js: false });
  const mo = await abrir(vp, "?q=low");  // low: sem loops, para comparar o repouso
  for (const s of secoes) {
    const sel = SEL[s];
    for (const [p, tag] of [[st.page, "estatico"], [mo.page, "motion"]]) {
      // posição de repouso: o elemento com parallax (se houver) no centro da tela, onde o deslocamento é 0
      const y = await p.evaluate(sel => { const sec = document.querySelector(sel); const el = sec.querySelector("[data-parallax]:not([data-parallax-mode])") || sec;
        const r = el.getBoundingClientRect(); return Math.max(0, r.top + scrollY + r.height / 2 - innerHeight / 2); }, sel);
      if (s === "hero") await p.evaluate(() => scrollTo(0, 0));
      else { if (tag === "motion") { const fim = await p.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return r.bottom + scrollY - innerHeight * 0.5; }, sel);
          for (let k = 0; k <= 4; k++) { await rolarPara(p, y - 400 + (fim - y + 400) * k / 4); await pausa(350); } await pausa(900); }
        tag === "motion" ? await rolarPara(p, y - 400) : 0; await pausa(tag === "motion" ? 200 : 0); tag === "motion" ? await rolarPara(p, y) : await p.evaluate(y => scrollTo(0, y), y); }
      await pausa(tag === "motion" ? 1600 : 100);
      await p.evaluate(() => { const b = document.querySelector(".motion-toggle"); if (b) b.style.visibility = "hidden"; }); // controle fixo não faz parte da seção
      if (tag === "motion") await p.evaluate(sel => { // isola a seção: parallax de vizinhas que transbordam volta a 0
        const sec = document.querySelector(sel);
        window.YMotion.parallax.forEach(P => { if (!sec.contains(P.el)) { P.st.disable(false); window.gsap.set(P.el, { yPercent: 0 }); } }); }, sel);
      await p.locator(sel).screenshot({ path: join(OUT, `${s}-${vp.width}-${tag}.png`) });
    }
    pares.push([`${s}-${vp.width}`, join(OUT, `${s}-${vp.width}-estatico.png`), join(OUT, `${s}-${vp.width}-motion.png`)]);
  }
  await st.ctx.close(); await mo.ctx.close();
}
const diffs = JSON.parse(execFileSync("python", ["-W", "ignore", "-c", `
import json,sys
from PIL import Image, ImageChops, ImageFilter
res={}
# métrica perceptiva: desfoque de 1px antes do diff ignora diferenças de rasterização/antialiasing
# de texto após camadas de composição (DOM e estilos finais idênticos), mas pega deslocamento,
# escala ou opacidade reais.
for nome,a,b in json.loads(sys.argv[1]):
    A=Image.open(a).convert('RGB').filter(ImageFilter.GaussianBlur(1)); B=Image.open(b).convert('RGB').filter(ImageFilter.GaussianBlur(1))
    # alinhamento de ±1px (arredondamento subpixel do layout com pin), comparando a área comum
    h=min(A.height,B.height); best=100.0
    for dy in (-1,0,1):
        a0=max(0,dy); b0=max(0,-dy); hh=h-abs(dy)
        Ac=A.crop((0,a0,A.width,a0+hh)); Bc=B.crop((0,b0,B.width,b0+hh))
        d=ImageChops.difference(Ac,Bc).convert('L').point(lambda v:255 if v>24 else 0)
        best=min(best, sum(1 for v in d.getdata() if v)/(Ac.width*Ac.height)*100)
    res[nome]=round(best,3)
print(json.dumps(res))`, JSON.stringify(pares)]).toString());
for (const [k, v] of Object.entries(diffs)) log(v <= 0.5, `${k}: ${v}% de pixels diferentes (limite 0,5%)`);

// ---------------------------------------------------------------- 4. custo
if (doCost) {
  console.log("\n[custo: rolagem de 5s com a roda do mouse]");
  const res = {};
  for (const [nome, qs, o] of [["sem-motion", "?motion=off", {}], ["full-high", "?q=high", {}], ["full-low", "?q=low", {}]]) {
    const { ctx, page } = await abrir({ width: 1440, height: 900 }, qs, o);
    await page.mouse.move(700, 450);
    const medir = page.evaluate(() => new Promise(r => { const t = []; let last = performance.now(); const t0 = last;
      (function f(now) { t.push(now - last); last = now; if (now - t0 < 5000) requestAnimationFrame(f); else r(t); })(last); }));
    for (let i = 0; i < 50; i++) { await page.mouse.wheel(0, i < 25 ? 180 : -180); await pausa(95); }
    const t = await medir; t.shift();
    const media = t.reduce((a, b) => a + b, 0) / t.length;
    res[nome] = { quadros: t.length, mediaMs: +media.toFixed(2), acima33ms: t.filter(x => x > 33).length };
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1));
  writeFileSync(join(OUT, "custo.json"), JSON.stringify(res, null, 1));
}

await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : "\nregressão de motion VERDE");
process.exit(falhas.length ? 1 : 0);
