"""Favicons a partir do LOGO REAL do cliente (imagens/imgi_2, 150x150, quadrado, fundo preto).
Uso: python tools/build_icons.py  ->  site/favicon.ico, site/icons/*.png
PENDÊNCIA-CLIENTE: logo vetorial — 192/512 são ampliações do arquivo de 150px (ficam suaves).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
src = Image.open(ROOT / "imagens" / "imgi_2_290687920_1041048783216439_4869083936603517475_n.jpg").convert("RGB")
out = ROOT / "site" / "icons"; out.mkdir(parents=True, exist_ok=True)
for s in (32, 180, 192, 512):
    src.resize((s, s), Image.LANCZOS).save(out / f"icon-{s}.png", optimize=True)
src.save(ROOT / "site" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("ok:", sorted(p.name for p in out.iterdir()), "favicon.ico")
