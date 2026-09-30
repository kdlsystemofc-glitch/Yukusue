// Uso: node tools/render.mjs <arquivo.svg> <saida.png> [largura] [altura] [fundo]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path"; import { pathToFileURL } from "node:url";
const [src, out, w = "1440", h = "1304", bg = "#E8F1F8"] = process.argv.slice(2);
const html = join(dirname(resolve(out)), "_render.html");
writeFileSync(html, `<body style="margin:0;background:${bg}"><img src="${pathToFileURL(resolve(src)).href}" style="width:${w}px;height:${h}px;display:block">`);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(pathToFileURL(html).href); await p.waitForTimeout(400);
await p.screenshot({ path: out }); await b.close();
