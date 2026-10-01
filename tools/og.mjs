// Imagem Open Graph 1200x630 a partir do hero aprovado (sem motion): node tools/og.mjs  ->  site/og-image.jpg
import { chromium } from "playwright"; import { resolve } from "node:path"; import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(resolve("site/index.html")).href + "?motion=off", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.addStyleTag({ content: ".flow,.motion-toggle{visibility:hidden!important}" }); // só o hero na imagem
const tmp = resolve("screenshots/og-hero.png");
await p.locator(".s-hero").screenshot({ path: tmp }); await b.close();
execFileSync("python", ["-W", "ignore", "-c", `
from PIL import Image
h=Image.open(r'${tmp}').convert('RGB'); c=Image.new('RGB',(1200,630),(232,241,248))
if h.height>630: h=h.crop((0,(h.height-630)//2,1200,(h.height-630)//2+630))
c.paste(h,(0,(630-h.height)//2)); c.save(r'${resolve("site/og-image.jpg")}',quality=86,optimize=True,progressive=True)
print('og-image.jpg', c.size, h.size)`], { stdio: "inherit" });
