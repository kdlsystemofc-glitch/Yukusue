"""Gera os SVGs decorativos (DESIGN.md §e): fita de água (E3) e ramo de bambu (E4).
Uso: python tools/gen_svg.py  ->  site/svg/fita.svg, site/svg/bambu.svg
Coordenadas traçadas sobre a referência em escala 1440 (seção 03 = 0..679, seção 04 = 679..1304).
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site" / "svg"
OUT.mkdir(parents=True, exist_ok=True)


def catmull(pts, n=14):
    """Amostra uma spline Catmull-Rom pelos pontos."""
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(
                0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                       + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    out.append(pts[-1])
    return out


def offset(line, widths, side):
    res = []
    for i, (x, y) in enumerate(line):
        a = line[max(i - 1, 0)]
        b = line[min(i + 1, len(line) - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = widths(i / (len(line) - 1)) / 2 * side
        res.append((x + nx * w, y + ny * w))
    return res


def d_poly(pts, close=False):
    s = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    return s + (" Z" if close else "")


# ---------- E3: fita de água ----------
center = [(700, -20), (560, 60), (430, 130), (318, 230), (268, 360), (300, 480), (372, 590),
          (450, 700), (500, 800), (508, 900), (488, 1000), (452, 1090), (420, 1160)]
line = catmull(center)
def width(t):  # larga no topo, afina no fim
    return 128 * (1 - t) ** 0.6 + 26 * math.sin(t * math.pi * 3) ** 2 + 6
left = offset(line, width, 1)
right = offset(line, width, -1)
body = d_poly(left + right[::-1], close=True)
# faixas internas: miolo claro deslocado para um lado = volume de vidro
core_l = offset(line, lambda t: width(t) * .55, 1)
core_r = offset(line, lambda t: width(t) * .05, 1)
core = d_poly(core_l + core_r[::-1], close=True)
shade_l = offset(line, lambda t: width(t) * -.35, 1)
shade_r = offset(line, lambda t: width(t) * -.95, 1)
shade = d_poly(shade_l + shade_r[::-1], close=True)
hl = [offset(line, lambda t, k=k: width(t) * k, 1) for k in (0.55, -0.25, 0.1, -0.6)]
edge_l, edge_r = d_poly(left), d_poly(right)

fita = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1304" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="agua" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset=".35" stop-color="#D5E6F0"/>
      <stop offset=".7" stop-color="#98AFC2"/>
      <stop offset="1" stop-color="#E8F1F8"/>
    </linearGradient>
    <linearGradient id="fim" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".78" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="m"><rect width="1440" height="1304" fill="url(#fim)"/></mask>
  </defs>
  <g mask="url(#m)">
    <path d="{body}" fill="url(#agua)" fill-opacity=".55"/>
    <path d="{shade}" fill="#718795" fill-opacity=".28"/>
    <path d="{core}" fill="#FFFFFF" fill-opacity=".6"/>
    <path d="{edge_l}" fill="none" stroke="#455E72" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/>
    <path d="{edge_r}" fill="none" stroke="#455E72" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
    <path d="{d_poly(hl[0])}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-dasharray="120 36 30 60 200 40"/>
    <path d="{d_poly(hl[1])}" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="60 90 150 30"/>
    <path d="{d_poly(hl[2])}" fill="none" stroke="#718795" stroke-opacity=".45" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="40 120 90 70"/>
    <path d="{d_poly(hl[3])}" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="20 140 70 110"/>
  </g>
</svg>
'''
(OUT / "fita.svg").write_text(fita, encoding="utf-8")

# ---------- E4: ramo de bambu (duotônico musgo) ----------
def leaf(bx, by, ang, L, W, droop=0.18):
    a = math.radians(ang)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    # ponta cai um pouco (gravidade): desloca a ponta para baixo
    tip = (bx + ux * L, by + uy * L + L * droop)
    mx, my = bx + ux * L * .38, by + uy * L * .38 + L * droop * .25
    c1a = (mx + nx * W * 1.3, my + ny * W * 1.3)
    c1b = (bx + ux * L * .8 + nx * W * .5, by + uy * L * .8 + ny * W * .5 + L * droop * .7)
    c2a = (bx + ux * L * .8 - nx * W * .5, by + uy * L * .8 - ny * W * .5 + L * droop * .7)
    c2b = (mx - nx * W * 1.3, my - ny * W * 1.3)
    blade = (f"M{bx:.1f} {by:.1f} C{c1a[0]:.1f} {c1a[1]:.1f} {c1b[0]:.1f} {c1b[1]:.1f} {tip[0]:.1f} {tip[1]:.1f} "
             f"C{c2a[0]:.1f} {c2a[1]:.1f} {c2b[0]:.1f} {c2b[1]:.1f} {bx:.1f} {by:.1f}Z")
    rib = f"M{bx:.1f} {by:.1f} Q{mx:.1f} {my:.1f} {tip[0]:.1f} {tip[1]:.1f}"
    return blade, rib

leaves = [  # base x, y, ângulo, comprimento, meia-largura, tom
    (62, 40, 12, 260, 30, 0), (60, 60, 75, 200, 26, 1), (150, 190, -30, 230, 28, 1),
    (80, 260, 30, 280, 32, 0), (40, 300, 95, 220, 26, 1), (175, 330, -18, 270, 30, 0),
    (95, 470, 8, 300, 32, 1), (50, 470, 70, 200, 24, 0), (185, 440, -50, 250, 28, 1),
    (120, 590, 20, 260, 30, 0), (185, 180, 40, 190, 24, 0),
]
tones = ["#596E45", "#A9BD92"]
parts = []
parts.append('<path d="M-10 690 C 40 560 70 360 60 0" fill="none" stroke="#596E45" stroke-width="16" stroke-linecap="round"/>')
parts.append('<path d="M40 690 C 90 520 150 360 190 180" fill="none" stroke="#A9BD92" stroke-width="10" stroke-linecap="round"/>')
for y in (140, 300, 470, 620):  # nós do colmo
    parts.append(f'<path d="M{44 + (690 - y) * .01:.0f} {y} h32" stroke="#4E5E3C" stroke-width="4" stroke-linecap="round"/>')
for bx, by, ang, L, W, t in leaves:
    blade, rib = leaf(bx, by, ang, L, W)
    parts.append(f'<path d="{blade}" fill="{tones[t]}"/>')
    parts.append(f'<path d="{rib}" fill="none" stroke="{tones[1 - t]}" stroke-opacity=".55" stroke-width="1.6"/>')
bambu = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 680" aria-hidden="true" focusable="false">\n  '
         + "\n  ".join(parts) + "\n</svg>\n")
(OUT / "bambu.svg").write_text(bambu, encoding="utf-8")
print("ok", OUT)
