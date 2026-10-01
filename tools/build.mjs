// Build: src/ -> site/   (node tools/build.mjs)
//  - CSS: tokens + base + sections juntos, minificados de forma conservadora (só comentários e
//    espaços: declarações duplicadas de fallback — overflow hidden/clip, 100vh/svh, height/round() —
//    são preservadas) e embutidos no <head> (todo o CSS é pequeno e é "crítico": nada bloqueia).
//  - JS próprio: terser -> site/js/*.min.js. Bootstrap inline também minificado.
//  - HTML: comentários de PENDÊNCIA mantidos de propósito.
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { minify } from "terser";
import { gzipSync } from "node:zlib";

const css = ["tokens", "base", "sections"].map(f => readFileSync(`src/css/${f}.css`, "utf8")).join("\n")
  .replace(/url\("\.\.\//g, 'url("');
const cssMin = css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};])\s*/g, "$1")
  .replace(/:\s+/g, ":")
  .replace(/,\s+/g, ",")
  .replace(/;}/g, "}")
  .trim();

let html = readFileSync("src/index.html", "utf8");
const links = /\s*<link rel="stylesheet" href="css\/tokens\.css">\s*<link rel="stylesheet" href="css\/base\.css">\s*<link rel="stylesheet" href="css\/sections\.css">/;
if (!links.test(html)) throw new Error("links de CSS não encontrados no src/index.html");
html = html.replace(links, `\n  <style>${cssMin}</style>`);

// bootstrap inline
const boot = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop(); // o bootstrap é o último script inline
const bootMin = (await minify(boot[1], { compress: true, mangle: true })).code;
html = html.replace(boot[0], `<script>${bootMin}</script>`);
writeFileSync("site/index.html", html);

mkdirSync("site/js", { recursive: true });
const report = [];
for (const f of ["motion", "cinema"]) {
  const src = readFileSync(`src/js/${f}.js`, "utf8");
  const out = (await minify(src, { compress: true, mangle: true, format: { comments: /^!/ } })).code;
  writeFileSync(`site/js/${f}.min.js`, out);
  report.push([`js/${f}.min.js`, src.length, out.length, gzipSync(out).length]);
}
for (const f of ["gsap.min.js", "ScrollTrigger.min.js", "lenis.min.js"]) {
  const b = readFileSync(`site/js/vendor/${f}`); report.push([`js/vendor/${f}`, b.length, b.length, gzipSync(b).length]);
}
report.push(["index.html (CSS inline)", readFileSync("src/index.html").length + css.length, html.length, gzipSync(html).length]);
console.log("arquivo".padEnd(30), "fonte".padStart(9), "min".padStart(9), "gzip".padStart(9));
for (const [n, a, b, g] of report) console.log(n.padEnd(30), (a / 1024).toFixed(1).padStart(8) + "K", (b / 1024).toFixed(1).padStart(8) + "K", (g / 1024).toFixed(1).padStart(8) + "K");
console.log(`CSS: ${(css.length / 1024).toFixed(1)}K -> ${(cssMin.length / 1024).toFixed(1)}K`);
