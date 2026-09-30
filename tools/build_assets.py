"""Gera site/assets/*.webp a partir de imagens/ (fotos reais) e design/plates/ (plates).

Uso: python tools/build_assets.py
Nada de /design/secoes ou do mockup entra aqui: só fotos reais e o plate decorativo.
Larguras: 800 e 1600. Se a fonte for menor que 1600, a variante grande sai na
largura nativa (nunca ampliamos por reamostragem além do original).
"""
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "imagens"
OUT = ROOT / "site" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

F = {
    "logo": "imgi_2_290687920_1041048783216439_4869083936603517475_n.jpg",
    "temaki": "imgi_47_619259016_18171558961380370_3689588281233277342_n.jpg",
    "salmao": "imgi_57_607530497_18169190896380370_3311978653427667901_n.jpg",
    "ceviche": "imgi_45_619675659_18171792079380370_4277722250567896961_n.jpg",
    "sal": "imgi_27_642528015_18176161228380370_2595430925063698484_n.jpg",
    "drinks": "imgi_48_617808468_18171129916380370_7447850538286843105_n.jpg",
    "salao": "imgi_49_616575006_18171128395380370_3490693935938839873_n.jpg",
}
PLATE = ROOT / "design" / "plates" / "Gemini_Generated_Image_s9ein8s9ein8s9ei.jpg"

isnet = new_session("isnet-general-use")
u2 = new_session("u2net")
manifest = {}


def clean_alpha(im, lo=40):
    """Remove halos semitransparentes e corta a caixa útil."""
    a = np.array(im.convert("RGBA"))
    a[..., 3][a[..., 3] < lo] = 0
    im = Image.fromarray(a)
    return im.crop(im.getbbox())


def save(name, im, widths=(800, 1600), alpha=False):
    files = []
    for w in widths:
        w_eff = min(w, im.width)
        h = round(im.height * w_eff / im.width)
        r = im.resize((w_eff, h), Image.LANCZOS) if w_eff != im.width else im
        fn = f"{name}-{w_eff}.webp"
        r.save(OUT / fn, "WEBP", quality=82, method=6, **({"exact": True} if alpha else {}))
        files.append({"file": fn, "w": w_eff, "h": h})
        if w_eff == im.width:
            break
    manifest[name] = files


# Logo: recorte do peixe no arquivo real de 150px. Sem IA. Provisório (pendência: vetor).
logo = Image.open(IMG / F["logo"]).convert("RGB").crop((2, 54, 148, 94))
logo.save(OUT / "logo-yukusue-146.png")
manifest["logo-yukusue"] = [{"file": "logo-yukusue-146.png", "w": 146, "h": 40}]

# Temaki: texto sobreposto removido por inpainting algorítmico (OpenCV Telea,
# só nos pixels do texto), depois recorte do temaki da frente.
bgr = cv2.imread(str(IMG / F["temaki"]))
hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
x0, y0, x1, y1 = 600, 290, 1210, 710
mask = np.zeros(bgr.shape[:2], np.uint8)
reg, sub = hsv[y0:y1, x0:x1], bgr[y0:y1, x0:x1].astype(int)
white = (reg[..., 2] > 170) & (reg[..., 1] < 60)
orange = (sub[..., 2] > 180) & (sub[..., 2] - sub[..., 0] > 70) & (sub[..., 1] < 170)
mask[y0:y1, x0:x1] = (white | orange).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
clean = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)
temaki = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).crop((470, 560, 1320, 1560))
save("hero-temaki", clean_alpha(remove(temaki, session=isnet), 90), alpha=True)

# Salmão em rosa: recorte das fatias, sem o prato.
save("hero-salmao", clean_alpha(remove(Image.open(IMG / F["salmao"]), session=isnet), 60), alpha=True)

# Ceviche: AJ-01 (remoção do texto por IA) não foi entregue -> fallback: crop
# acima do texto "CEVICHES FRESCOS..." e da linha indicadora. Nenhum pixel novo.
save("prato-ceviche", Image.open(IMG / F["ceviche"]).convert("RGB").crop((0, 0, 1320, 1120)))

# Sashimi na pedra de sal: foto inteira.
save("prato-sashimi-sal", Image.open(IMG / F["sal"]).convert("RGB"))

# Drinks: dois recortes separados (a esteira de bambu fica de fora).
d = Image.open(IMG / F["drinks"]).convert("RGB")
box = (20, 150, 660, 890)
a = np.array(remove(d.crop(box), session=isnet))
m = Image.new("L", (box[2] - box[0], box[3] - box[1]), 255)
pts = [(440, 545), (446, 700), (462, 800), (470, 890), (660, 890), (660, 545)]
ImageDraw.Draw(m).polygon([(x - box[0], y - box[1]) for x, y in pts], fill=0)
a[..., 3] = np.minimum(a[..., 3], np.array(m))
save("drink-verde", clean_alpha(Image.fromarray(a)), alpha=True)

box = (820, 170, 1320, 850)
a = np.array(remove(d.crop(box), session=isnet))
ub = (1060, 170, 1320, 420)
u = np.array(remove(d.crop(ub), session=u2))[..., 3]
ys, xs = slice(ub[1] - box[1], ub[3] - box[1]), slice(ub[0] - box[0], ub[2] - box[0])
a[ys, xs, 3] = np.maximum(a[ys, xs, 3], u)
a[..., :3] = np.array(d.crop(box))
a[800 - box[1]:, 1100 - box[0]:, 3] = 0  # ponta da colher
save("drink-vermelho", clean_alpha(Image.fromarray(a)), alpha=True)

# Salão real: ripado, estofado capitonê, mural e masu (substitui a "entrada" inventada do mockup).
save("salao", Image.open(IMG / F["salao"]).convert("RGB").crop((0, 0, 1320, 1180)))

# Plate decorativo (gelo abstrato).
save("plate-gelo", Image.open(PLATE).convert("RGB"))

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
for k, v in manifest.items():
    print(k, ", ".join(f"{f['file']} ({f['w']}x{f['h']})" for f in v))
