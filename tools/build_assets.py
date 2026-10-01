"""Gera site/assets/*.webp a partir das imagens geradas em design/plates/ (DESIGN.md §m).

Uso: python tools/build_assets.py
Decisão de 2026-09-30: nenhuma foto real no site; todas as imagens são geradas por IA com o
mesmo bloco de estilo. Exceção: o logo, que é o arquivo real do cliente (gerar = inventar marca).
Nada de /design/secoes ou do mockup entra aqui.

Cenas sobre fundo liso são recortadas por diferença de cor (key), o que preserva a sombra
natural e a transparência do gelo, do vidro e da água, e depois cortadas na caixa útil.
Saída: <nome>-800.webp + <nome>.webp (largura nativa; nunca amplia).
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PL = ROOT / "design" / "plates"
OUT = ROOT / "site" / "assets"
OUT.mkdir(parents=True, exist_ok=True)
manifest = {}


def key(path, T=40, lo=.06, pad=8):
    """alpha = distância de cor até o fundo (mediana das bordas) / T; cor descontaminada."""
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    e = 6
    bg = np.median(np.concatenate([im[:e].reshape(-1, 3), im[-e:].reshape(-1, 3),
                                   im[:, :e].reshape(-1, 3), im[:, -e:].reshape(-1, 3)]), axis=0)
    d = im - bg
    a = np.clip(np.sqrt((d ** 2).sum(2)) / T, 0, 1)
    a[a < lo] = 0
    rgb = np.clip(bg + d / np.maximum(a, 1e-3)[..., None], 0, 255)
    out = Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA")
    # caixa útil calculada só sobre o que é claramente conteúdo (ignora ruído de JPEG no fundo)
    x0, y0, x1, y1 = Image.fromarray(((a > .22) * 255).astype(np.uint8)).getbbox()
    pad = pad + 24  # margem para a sombra suave
    return out.crop((max(0, x0 - pad), max(0, y0 - pad), min(out.width, x1 + pad), min(out.height, y1 + pad)))


def save(name, im, alpha=False, small=(), q=80):
    """<nome>-<w>.webp para cada degrau pequeno (celular) + -800 + <nome>.webp (largura nativa)."""
    files = []
    steps = [(w, f"{name}-{w}.webp") for w in small if w < im.width]
    mid = [(800, f"{name}-800.webp")] if im.width > 800 else []   # sem cópia idêntica quando a original já tem <= 800px
    for w, fn in steps + mid + [(im.width, f"{name}.webp")]:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        r.save(OUT / fn, "WEBP", quality=q, method=6, **({"alpha_quality": 90 if q >= 80 else 60} if alpha else {}))
        files.append({"file": fn, "w": w, "h": h})
    manifest[name] = files


# Logo real do cliente (150px), fundo preto removido por key. Pendência: vetor.
logo = Image.open(ROOT / "imagens" / "imgi_2_290687920_1041048783216439_4869083936603517475_n.jpg")
logo = logo.convert("RGB").crop((2, 54, 148, 94))
lg = np.asarray(logo).astype(np.float32)
a = np.clip((lg.max(2) - 40) / 60, 0, 1)
Image.fromarray(np.dstack([lg, a * 255]).astype(np.uint8), "RGBA").save(OUT / "logo-yukusue-146.png")
manifest["logo-yukusue"] = [{"file": "logo-yukusue-146.png", "w": 146, "h": 40}]

# Cenas geradas (IMG-01..06)
save("cena-hero", key(PL / "img-01-hero.png"), alpha=True, small=(480,))
save("cena-pratos", key(PL / "img-02-pratos.png"), alpha=True, small=(480,))
save("cena-drinks", key(PL / "img-03-drinks.png"), alpha=True, small=(480,))
save("cena-ambiente", Image.open(PL / "img-04-ambiente.png").convert("RGB"), small=(480,))
save("fita-agua", key(PL / "img-05-fita-agua.png", T=34, lo=.04, pad=0), alpha=True, small=(300,), q=62)  # decorativo; 300px no celular (aparece com ~140px de largura)
save("bambu", key(PL / "img-06-bambu.png", T=45), alpha=True, small=(480,), q=62)  # decorativo
# Textura de gelo das letras do H1 (PLATE-01)
save("plate-gelo", Image.open(PL / "Gemini_Generated_Image_s9ein8s9ein8s9ei.jpg").convert("RGB"), q=62)  # textura das letras: decorativa

(ROOT / "assets.manifest.json").write_text(  # fora de site/: não é publicado
    json.dumps(manifest, indent=2), encoding="utf-8")
for k, v in manifest.items():
    print(k, ", ".join(f"{f['file']} ({f['w']}x{f['h']})" for f in v))
