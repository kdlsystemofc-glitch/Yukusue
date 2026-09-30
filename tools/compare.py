"""Lado a lado: fatia de referência (design/secoes) x screenshot da seção em 1440.
Uso: python tools/compare.py <fatia.png> <rotulo> [saida]
A referência só é lida aqui para comparação; nunca é copiada para site/.
"""
import sys
from pathlib import Path
from PIL import Image

ref_name, label = sys.argv[1], sys.argv[2]
out = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("screenshots") / label / "comparacao.png"
ref = Image.open(Path("design/secoes") / ref_name).convert("RGB")
shot = Image.open(Path("screenshots") / label / "1440-secao.png").convert("RGB")
W = 720
ref = ref.resize((W, round(ref.height * W / ref.width)))
shot = shot.resize((W, round(shot.height * W / shot.width)))
c = Image.new("RGB", (W * 2 + 20, max(ref.height, shot.height)), (255, 0, 255))
c.paste(ref, (0, 0)); c.paste(shot, (W + 20, 0))
c.save(out)
print(out, "ref", ref.size, "site", shot.size)
