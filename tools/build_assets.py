"""Gera site/assets/*.webp a partir de imagens/ (fotos reais) e design/plates/ (plates).

Uso: python tools/build_assets.py
Nada de /design/secoes ou do mockup entra aqui: só fotos reais e plates decorativos.

Saída por imagem: <nome>-800.webp e <nome>.webp (largura cheia, máx. 1600; nunca amplia).

Integração (AUDITORIA.md, caminho A — sem IA):
- grade(): balanço de branco frio + exposição, para a luz das fotos de celular
  conversar com a página azul-gelo (alvo medido no mockup: R−B ≈ 60, luminância ≈ 150).
- acabamento(): borda suavizada + "light wrap" (a cor do fundo abraça a borda) contra o efeito figurinha.

Caminho B (autorizado em 2026-09-30): se existir imagens/estudio/<nome>.png — a MESMA foto real
refeita por IA com fundo/luz de estúdio —, ela substitui o recorte. Marcar em assets.md como
"recriada por IA — confirmar com o cliente antes de publicar".
"""
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "imagens"
ESTUDIO = IMG / "estudio"
OUT = ROOT / "site" / "assets"
OUT.mkdir(parents=True, exist_ok=True)
FUNDO = np.array([232, 241, 248], np.float32)  # --gelo-50

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
PLATE_AGUA = ROOT / "design" / "plates" / "plate-02-fita-agua.png"
PLATE_BAMBU = ROOT / "design" / "plates" / "plate-03-bambu.png"

isnet = new_session("isnet-general-use")
u2 = new_session("u2net")
manifest = {}


# ---------------------------------------------------------------- utilitários
def clean_alpha(im, lo=40, erode=0):
    """Remove halos semitransparentes (e opcionalmente come a borda) e corta a caixa útil."""
    a = np.array(im.convert("RGBA"))
    al = a[..., 3]
    al[al < lo] = 0
    if erode:
        al[:] = cv2.erode(al, np.ones((3, 3), np.uint8), iterations=erode)
    im = Image.fromarray(a)
    return im.crop(im.getbbox())


def key_bg(src, T, gamma=1.0):
    """Recorte por diferença de cor para imagens sobre fundo liso (preserva vidro, transparência
    e a sombra natural). alpha = distância até o fundo / T; cor descontaminada."""
    im = src if isinstance(src, Image.Image) else Image.open(src)
    im = np.asarray(im.convert("RGB")).astype(np.float32)
    bg = np.median(np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3),
                                   im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)]), axis=0)
    d = im - bg
    a = np.clip(np.abs(d).max(axis=2) / T, 0, 1) ** gamma
    a[a < 0.04] = 0
    safe = np.maximum(a, 1e-3)[..., None]
    rgb = np.clip(bg + d / safe, 0, 255)
    return Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA")


def grade(im, rb=60, lum=150, strength=.75):
    """Balanço de branco + exposição em direção ao alvo, medidos só nos pixels opacos."""
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    m = a[..., 3] > 200
    rgb = a[..., :3]
    r, g, b = (rgb[..., i][m].mean() for i in range(3))
    shift = ((r - b) - rb) / 2 * strength
    rgb = rgb * np.array([(r - shift) / r, 1.0, (b + shift) / b], np.float32)
    L = np.clip(rgb / 255, 1e-4, 1)
    cur = (0.3 * L[..., 0] + 0.59 * L[..., 1] + 0.11 * L[..., 2])[m].mean()
    gam = np.log(lum / 255) / np.log(cur)
    gam = 1 - (1 - gam) * strength
    a[..., :3] = np.clip(L ** gam * 255, 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def acabamento(im, feather=1.2, wrap=.28, wrap_px=4):
    """Borda suavizada + light wrap (mistura a cor do fundo na faixa da borda)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    al = a[..., 3]
    al = np.asarray(Image.fromarray(al.astype(np.uint8)).filter(ImageFilter.GaussianBlur(feather))).astype(np.float32)
    inside = (al > 128).astype(np.uint8)
    dist = cv2.distanceTransform(inside, cv2.DIST_L2, 3)
    k = np.clip(1 - dist / wrap_px, 0, 1)[..., None] * wrap * (inside[..., None] > 0)
    a[..., :3] = a[..., :3] * (1 - k) + FUNDO * k
    a[..., 3] = np.minimum(a[..., 3], al) if feather else a[..., 3]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def sharpen(im, amount=.6, radius=1.4):
    return im.filter(ImageFilter.UnsharpMask(radius=radius, percent=int(amount * 100), threshold=2))


def save(name, im, alpha=False):
    """<nome>-800.webp + <nome>.webp (largura cheia até 1600)."""
    files = []
    full_w = min(1600, im.width)
    for w, fn in ((800, f"{name}-800.webp"), (full_w, f"{name}.webp")):
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        r.save(OUT / fn, "WEBP", quality=84, method=6, **({"exact": True} if alpha else {}))
        files.append({"file": fn, "w": w, "h": h})
    manifest[name] = files


def estudio(nome):
    """Versão 'estúdio' (caminho B), se entregue: recorte por diferença de cor mantendo a sombra."""
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = ESTUDIO / f"{nome}{ext}"
        if p.exists():
            print(f"  usando estúdio (IA) para {nome}: {p.name}")
            return clean_alpha(key_bg(p, 42), 6)
    return None


# ---------------------------------------------------------------- logo
# Recorte do peixe no arquivo real de 150px; fundo preto removido por diferença de cor
# (antes aparecia um retângulo #1A1819 sobre o preto da seção). Sem IA. Pendência: vetor.
logo = Image.open(IMG / F["logo"]).convert("RGB").crop((2, 54, 148, 94))
key_bg(logo, 60).save(OUT / "logo-yukusue-146.png")
manifest["logo-yukusue"] = [{"file": "logo-yukusue-146.png", "w": 146, "h": 40}]

# ---------------------------------------------------------------- hero
# Temaki: texto sobreposto removido por inpainting algorítmico (OpenCV Telea, só nos
# pixels do texto), depois recorte do temaki da frente.
t = estudio("temaki")
if t is None:
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
    t = acabamento(grade(clean_alpha(remove(temaki, session=isnet), 90), rb=62, lum=140))
save("hero-temaki", t, alpha=True)

s = estudio("salmao")
if s is None:
    s = acabamento(grade(clean_alpha(remove(Image.open(IMG / F["salmao"]), session=isnet), 60), rb=62, lum=152))
save("hero-salmao", s, alpha=True)

# ---------------------------------------------------------------- pratos
# Ceviche: crop acima do texto "CEVICHES FRESCOS..." (sem pixel novo) + correção de cor leve e nitidez.
c = estudio("ceviche")
if c is not None:
    save("prato-ceviche-estudio", c, alpha=True)
cev = Image.open(IMG / F["ceviche"]).convert("RGBA").crop((0, 0, 1320, 1120))
save("prato-ceviche", sharpen(grade(cev, rb=20, lum=118, strength=.6)).convert("RGB"))

p = estudio("pedra-sal")
if p is None:
    sal = Image.open(IMG / F["sal"]).convert("RGB").crop((20, 580, 520, 1240))
    p = acabamento(grade(clean_alpha(remove(sal, session=isnet), 170, erode=1), rb=58, lum=160), wrap=.22)
save("prato-sal-recorte", p, alpha=True)

# ---------------------------------------------------------------- bebidas
d = Image.open(IMG / F["drinks"]).convert("RGB")
box = (20, 150, 660, 890)
a = np.array(remove(d.crop(box), session=isnet))
m = Image.new("L", (box[2] - box[0], box[3] - box[1]), 255)
pts = [(440, 545), (446, 700), (462, 800), (470, 890), (660, 890), (660, 545)]
ImageDraw.Draw(m).polygon([(x - box[0], y - box[1]) for x, y in pts], fill=0)
a[..., 3] = np.minimum(a[..., 3], np.array(m))
save("drink-verde", acabamento(grade(clean_alpha(Image.fromarray(a)), rb=55, lum=140, strength=.6)), alpha=True)

box = (820, 170, 1320, 850)
a = np.array(remove(d.crop(box), session=isnet))
ub = (1060, 170, 1320, 420)
u = np.array(remove(d.crop(ub), session=u2))[..., 3]
ys, xs = slice(ub[1] - box[1], ub[3] - box[1]), slice(ub[0] - box[0], ub[2] - box[0])
a[ys, xs, 3] = np.maximum(a[ys, xs, 3], u)
a[..., :3] = np.array(d.crop(box))
a[800 - box[1]:, 1100 - box[0]:, 3] = 0  # ponta da colher
save("drink-vermelho", acabamento(grade(clean_alpha(Image.fromarray(a)), rb=70, lum=110, strength=.6)), alpha=True)

# ---------------------------------------------------------------- salão (seção escura)
# Mesmo arquivo, sem a garrafa. Na página vira fundo desfocado de propósito (atmosfera).
save("salao-ripado", Image.open(IMG / F["salao"]).convert("RGB").crop((505, 0, 1320, 1180)))

# ---------------------------------------------------------------- plates decorativos
save("plate-fita-agua", key_bg(PLATE_AGUA, 34), alpha=True)
save("plate-bambu", clean_alpha(key_bg(PLATE_BAMBU, 55), 10), alpha=True)
save("plate-gelo", Image.open(PLATE).convert("RGB"))

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
for k, v in manifest.items():
    print(k, ", ".join(f"{f['file']} ({f['w']}x{f['h']})" for f in v))
