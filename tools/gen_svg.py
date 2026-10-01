"""Gera os SVGs decorativos (DESIGN.md §e): fita de água (E3) e ramo de bambu (E4).
Uso: python tools/gen_svg.py  ->  site/svg/fita.svg, site/svg/bambu.svg
Coordenadas traçadas sobre a referência em escala 1440 (seção 03 = 0..679, seção 04 = 679..1304).
Tudo estático: nada aqui anima (regra do elemento decorativo contínuo).
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "design" / "legacy-svg"  # não publicado: substituído pelas imagens geradas
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
# Vidro/água: corpo translúcido + refração (feDisplacementMap) + brilho especular
# sobre o relevo (feSpecularLighting) + borda escura fina (feMorphology).
center = [(760, -40), (600, 40), (450, 120), (330, 220), (272, 350), (296, 470), (366, 580),
          (446, 690), (500, 790), (512, 890), (494, 985), (462, 1070), (436, 1140)]
line = catmull(center)


def width(t):  # larga no topo, "respira" no meio, afina no fim
    return 190 * (1 - t) ** 0.9 + 34 * math.sin(t * math.pi * 3.2) ** 2 + 26


left = offset(line, width, 1)
right = offset(line, width, -1)
body = d_poly(left + right[::-1], close=True)
core_l = offset(line, lambda t: width(t) * .62, 1)
core_r = offset(line, lambda t: width(t) * .18, 1)
core = d_poly(core_l + core_r[::-1], close=True)
hl = [offset(line, lambda t, k=k: width(t) * k, 1) for k in (0.4, -0.55, 0.78)]

fita = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1304" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="agua" x1="0" y1="0" x2="1" y2=".4">
      <stop offset="0" stop-color="#F4F9FC"/>
      <stop offset=".3" stop-color="#CFE0EC"/>
      <stop offset=".55" stop-color="#8FA9BE"/>
      <stop offset=".8" stop-color="#DCE9F2"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
    <linearGradient id="fim" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".8" stop-color="#fff"/>
      <stop offset=".97" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <filter id="reflexo" x="-10%" y="-5%" width="120%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" seed="3" result="r"/>
      <feDisplacementMap in="SourceGraphic" in2="r" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="2.4"/>
    </filter>
    <mask id="m"><rect width="1440" height="1304" fill="url(#fim)"/></mask>
    <filter id="vidro" x="-15%" y="-5%" width="130%" height="110%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.008" numOctaves="2" seed="11" result="ruido"/>
      <feDisplacementMap in="SourceGraphic" in2="ruido" scale="16" xChannelSelector="R" yChannelSelector="G" result="forma"/>
      <feGaussianBlur in="forma" stdDeviation="11" result="relevo0"/>
      <feTurbulence type="turbulence" baseFrequency="0.006 0.02" numOctaves="2" seed="4" result="ondas"/>
      <feComposite in="ondas" in2="relevo0" operator="arithmetic" k2=".18" k3="1" result="relevo"/>
      <feSpecularLighting in="relevo" surfaceScale="12" specularConstant="1.4" specularExponent="34" lighting-color="#FFFFFF" result="brilho">
        <feDistantLight azimuth="225" elevation="52"/>
      </feSpecularLighting>
      <feComposite in="brilho" in2="forma" operator="in" result="brilhoIn"/>
      <feMorphology in="forma" operator="erode" radius="3" result="miolo"/>
      <feComposite in="forma" in2="miolo" operator="out" result="borda"/>
      <feFlood flood-color="#455E72" flood-opacity=".55"/>
      <feComposite in2="borda" operator="in" result="bordaCor"/>
      <feMerge><feMergeNode in="forma"/><feMergeNode in="bordaCor"/><feMergeNode in="brilhoIn"/></feMerge>
    </filter>
  </defs>
  <g mask="url(#m)" filter="url(#vidro)">
    <path d="{body}" fill="url(#agua)" fill-opacity=".5"/>
    <path d="{core}" fill="#FFFFFF" fill-opacity=".55"/>
  </g>
  <g mask="url(#m)" filter="url(#reflexo)">
    <path d="{d_poly(hl[0])}" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
    <path d="{d_poly(hl[2])}" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/>
    <path d="{d_poly(hl[1])}" fill="none" stroke="#455E72" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>
'''
(OUT / "fita.svg").write_text(fita, encoding="utf-8")


# ---------- E4: ramo de bambu ----------
def leaf(bx, by, ang, L, W, droop=0.18):
    a = math.radians(ang)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    tip = (bx + ux * L, by + uy * L + L * droop)  # ponta cai um pouco (gravidade)
    mx, my = bx + ux * L * .38, by + uy * L * .38 + L * droop * .25
    c1a = (mx + nx * W * 1.3, my + ny * W * 1.3)
    c1b = (bx + ux * L * .8 + nx * W * .5, by + uy * L * .8 + ny * W * .5 + L * droop * .7)
    c2a = (bx + ux * L * .8 - nx * W * .5, by + uy * L * .8 - ny * W * .5 + L * droop * .7)
    c2b = (mx - nx * W * 1.3, my - ny * W * 1.3)
    blade = (f"M{bx:.1f} {by:.1f} C{c1a[0]:.1f} {c1a[1]:.1f} {c1b[0]:.1f} {c1b[1]:.1f} {tip[0]:.1f} {tip[1]:.1f} "
             f"C{c2a[0]:.1f} {c2a[1]:.1f} {c2b[0]:.1f} {c2b[1]:.1f} {bx:.1f} {by:.1f}Z")
    rib = f"M{bx:.1f} {by:.1f} Q{mx:.1f} {my:.1f} {tip[0]:.1f} {tip[1]:.1f}"
    return blade, rib, tip


leaves = [  # base x, y, ângulo, comprimento, meia-largura, tom
    (62, 40, 12, 260, 30, 0), (60, 60, 75, 200, 26, 1), (150, 190, -30, 230, 28, 1),
    (80, 260, 30, 280, 32, 0), (40, 300, 95, 220, 26, 1), (175, 330, -18, 270, 30, 0),
    (95, 470, 8, 300, 32, 1), (50, 470, 70, 200, 24, 0), (185, 440, -50, 250, 28, 1),
    (120, 590, 20, 260, 30, 0), (185, 180, 40, 190, 24, 0),
]
# Verdes amostrados do bambu do mockup (#719325); sombras puxam para o musgo do logo.
defs = ['<linearGradient id="colmo" x1="0" x2="1"><stop offset="0" stop-color="#3F5A1C"/>'
        '<stop offset=".45" stop-color="#9DBB5A"/><stop offset=".7" stop-color="#719325"/>'
        '<stop offset="1" stop-color="#3F5A1C"/></linearGradient>']
parts = [
    '<path d="M-6 690 C 34 560 66 360 58 -10" fill="none" stroke="url(#colmo)" stroke-width="18" stroke-linecap="round"/>',
    '<path d="M34 690 C 86 520 146 360 192 170" fill="none" stroke="url(#colmo)" stroke-width="11" stroke-linecap="round"/>',
]
for y in (140, 300, 470, 620):  # nós do colmo
    parts.append(f'<path d="M{46 + (690 - y) * .012:.0f} {y} q16 -5 30 0" fill="none" stroke="#3F5A1C" stroke-width="5" stroke-linecap="round"/>')
paleta = [("#3E5A1A", "#86A845", "#5C7D28"), ("#4B6A22", "#A3C25F", "#6E9030")]
for i, (bx, by, ang, L, W, t) in enumerate(leaves):
    blade, rib, tip = leaf(bx, by, ang, L, W)
    c0, c1, c2 = paleta[t]
    defs.append(f'<linearGradient id="f{i}" gradientUnits="userSpaceOnUse" x1="{bx:.0f}" y1="{by:.0f}" x2="{tip[0]:.0f}" y2="{tip[1]:.0f}">'
                f'<stop offset="0" stop-color="{c0}"/><stop offset=".45" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>')
    parts.append(f'<path d="{blade}" fill="url(#f{i})"/>')
    parts.append(f'<path d="{rib}" fill="none" stroke="#DCE8B8" stroke-opacity=".55" stroke-width="1.4"/>')
bambu = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 680" aria-hidden="true" focusable="false">\n  <defs>'
         + "".join(defs) + "</defs>\n  " + "\n  ".join(parts) + "\n</svg>\n")
(OUT / "bambu.svg").write_text(bambu, encoding="utf-8")
print("ok", OUT)
