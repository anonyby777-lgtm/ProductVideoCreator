#!/usr/bin/env python3
"""Renderiza overlays de texto (títulos, legendas, CTA) como PNGs transparentes + manifest de timing."""
import json, os, math
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "overlays")
os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1920

BLACK = (10, 10, 12, 255)
WHITE = (255, 255, 255, 255)
YELLOW = (255, 214, 0, 255)
RED = (232, 29, 54, 255)

try:
    import font_roboto
    FDIR = os.path.join(os.path.dirname(font_roboto.__file__), "files")
    F_TITLE = os.path.join(FDIR, "Roboto-Black.ttf")
    F_CAP = os.path.join(FDIR, "Roboto-Black.ttf")
except Exception:
    F_TITLE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    F_CAP = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

vo = {e["file"]: e for e in json.load(open(os.path.join(ROOT, "render", "vo_meta.json")))["vo"]}

def parse_markup(s):
    """'*PALAVRA*' vira (word, True). Retorna lista de (token, is_hi)."""
    out = []
    for i, part in enumerate(s.split("*")):
        if part:
            out.append((part, i % 2 == 1))
    return out

def draw_marked(d, xy, text, font, fill=WHITE, hi=YELLOW, stroke=0, anchor="la", stroke_fill=BLACK):
    x, y = xy
    # medir tudo
    pieces = []
    for tok, is_hi in parse_markup(text):
        bbox = d.textbbox((0, 0), tok, font=font, stroke_width=stroke)
        pieces.append((tok, is_hi, bbox[2] - bbox[0]))
    total = sum(p[2] for p in pieces) + d.textlength(" ", font=font) * (len(pieces) - 1)
    if anchor == "ma":
        x -= total / 2
    elif anchor == "ra":
        x -= total
    for tok, is_hi, w in pieces:
        d.text((x, y), tok, font=font, fill=hi if is_hi else fill,
               stroke_width=stroke, stroke_fill=stroke_fill)
        x += w + d.textlength(" ", font=font)
    return total

def render_caption(text, size=62, maxw=980):
    font = ImageFont.truetype(F_CAP, size)
    tmp = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(tmp)
    while size > 30:
        bbox = d.textbbox((0, 0), text.replace("*", ""), font=font, stroke_width=7)
        if bbox[2] - bbox[0] <= maxw:
            break
        size -= 3
        font = ImageFont.truetype(F_CAP, size)
    asc, desc = font.getmetrics()
    hgt = asc + desc + 22
    img = Image.new("RGBA", (1080, hgt), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # sombra suave
    draw_marked(d, (540, 13), text, font, stroke=8, anchor="ma")
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    draw_marked(ds, (536, 9), text, font, stroke=8, anchor="ma",
                fill=(0, 0, 0, 160), hi=(0, 0, 0, 160))
    from PIL import ImageFilter
    sh = sh.filter(ImageFilter.GaussianBlur(6))
    img = Image.alpha_composite(sh, img)
    return img

def render_title(num, text, maxw=1000):
    size = 84
    font = ImageFont.truetype(F_TITLE, size)
    tmp = Image.new("RGBA", (10, 10)); d = ImageDraw.Draw(tmp)
    full = (f"{num} — " if num else "") + text
    while size > 36:
        bbox = d.textbbox((0, 0), full, font=font, stroke_width=9)
        if bbox[2] - bbox[0] <= maxw:
            break
        size -= 4
        font = ImageFont.truetype(F_TITLE, size)
    asc, desc = font.getmetrics()
    hgt = asc + desc + 26
    img = Image.new("RGBA", (1080, hgt), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    marked = (f"*{num}* — " if num else "") + text
    from PIL import ImageFilter
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    draw_marked(ds, (536, 10), marked, font, stroke=10, anchor="ma",
                fill=(0, 0, 0, 190), hi=(0, 0, 0, 190))
    sh = sh.filter(ImageFilter.GaussianBlur(7))
    draw_marked(d, (540, 14), marked, font, stroke=9, anchor="ma")
    img = Image.alpha_composite(sh, img)
    # barra vermelha de acento
    bar = Image.new("RGBA", (1080, 14), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bar)
    bd.rectangle([140, 4, 940, 10], fill=RED)
    out = Image.new("RGBA", (1080, hgt + 14), (0, 0, 0, 0))
    out.paste(img, (0, 0), img); out.paste(bar, (0, hgt), bar)
    return out

def draw_heart(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pts = []
    for i in range(80):
        t = 2 * math.pi * i / 80
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((size / 2 + x * size / 36, size / 2 + y * size / 34))
    d.polygon(pts, fill=(236, 29, 66, 255), outline=(120, 8, 26, 255))
    return img

def draw_flame(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    outer = [(0.50, -0.98), (0.66, -0.62), (0.84, -0.28), (0.90, 0.05), (0.86, 0.38),
             (0.70, 0.68), (0.46, 0.90), (0.22, 1.00), (0.02, 0.96), (-0.14, 0.82),
             (-0.24, 0.60), (-0.28, 0.34), (-0.22, 0.08), (-0.10, -0.14), (0.02, -0.44),
             (0.22, -0.74)]
    def scale(pts, s, dx=0.0, dy=0.0):
        return [(size / 2 + (x * s + dx) * size, size / 2 + (y * s + dy) * size) for x, y in pts]
    d.polygon(scale(outer, 0.48), fill=(255, 122, 24, 255), outline=(140, 52, 4, 255))
    inner = [(0.50, -0.52), (0.62, -0.22), (0.70, 0.10), (0.64, 0.42), (0.46, 0.62),
             (0.28, 0.70), (0.14, 0.60), (0.08, 0.40), (0.14, 0.16), (0.26, -0.06)]
    d.polygon(scale(inner, 0.48, 0.0, 0.16), fill=(255, 216, 61, 255))
    return img

def render_cta():
    img = Image.new("RGBA", (1080, 560), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(F_TITLE, 88)
    # faixa escura atrás para leitura
    d.rounded_rectangle([60, 40, 1020, 300], 26, fill=(8, 8, 14, 170))
    # linha: LUCIA ❤ OU JASON 🔥
    heart = draw_heart(108); flame = draw_flame(118)
    segs = [("LUCIA", WHITE), ("OU", (210, 210, 220, 255)), ("JASON", WHITE)]
    widths = [d.textbbox((0,0), s, font=font, stroke_width=8)[2] for s, _ in segs]
    gap = 26
    total = sum(widths) + 2 * gap + heart.width + flame.width + 4 * 14
    x = 540 - total / 2
    ytxt = 66
    (s1, c1), (s2, c2), (s3, c3) = segs
    d.text((x, ytxt), s1, font=font, fill=c1, stroke_width=8, stroke_fill=BLACK); x += widths[0] + 14
    img.paste(heart, (int(x), ytxt + 52), heart); x += heart.width + gap
    d.text((x, ytxt), s2, font=font, fill=c2, stroke_width=8, stroke_fill=BLACK); x += widths[1] + gap
    img.paste(flame, (int(x), ytxt + 44), flame); x += flame.width + 14
    d.text((x, ytxt), s3, font=font, fill=c3, stroke_width=8, stroke_fill=BLACK); x += widths[2]
    # COMENTA!
    f2 = ImageFont.truetype(F_TITLE, 108)
    bbox = d.textbbox((0, 0), "COMENTA!", font=f2, stroke_width=9)
    tw = bbox[2] - bbox[0]; th = bbox[3] - bbox[1]
    bx0 = 540 - tw / 2 - 44; bx1 = 540 + tw / 2 + 44
    d.rounded_rectangle([bx0, 350, bx1, 350 + th + 76], 22, fill=RED, outline=(255, 255, 255, 230), width=5)
    d.text((540 - tw / 2, 350 + 34), "COMENTA!", font=f2, fill=WHITE, stroke_width=9, stroke_fill=(120, 8, 26, 255))
    return img

# ---------------- defs de conteúdo ----------------
SEGS = [
    dict(vofile="vo_01_hook.mp3",   s0=0.0,  s1=5.0),
    dict(vofile="vo_02_preso.mp3",  s0=5.0,  s1=12.0),
    dict(vofile="vo_03_luta.mp3",   s0=12.0, s1=19.0),
    dict(vofile="vo_04_jason.mp3",  s0=19.0, s1=27.0),
    dict(vofile="vo_05_dupla.mp3",  s0=27.0, s1=35.0),
    dict(vofile="vo_06_bonnie.mp3", s0=35.0, s1=43.0),
    dict(vofile="vo_07_golpe.mp3",  s0=43.0, s1=51.0),
    dict(vofile="vo_08_jogaveis.mp3", s0=51.0, s1=57.0),
]

CAPTIONS = [
    ["Você conhece realmente", "*LUCIA* e *JASON* de *GTA 6*?", "olha essas *7 CURIOSIDADES!*"],
    ["*LUCIA* é a *primeira*", "protagonista *feminina*", "de destaque em um *GTA*",
     "quando a história começa...", "ela *ACABOU DE SAIR*", "da *PRISÃO*"],
    ["outro detalhe:", "o *PAI* de Lucia", "ensinou ela a *LUTAR*", "desde *CRIANÇA*"],
    ["*JASON* também tem", "um *PASSADO PESADO*", "cresceu cercado", "por *CRIMINOSOS*",
     "e serviu no *EXÉRCITO*"],
    ["Jason e Lucia", "não são apenas *PARCEIROS*", "a *ROCKSTAR* apresenta", "os dois como uma *DUPLA*",
     "extremamente *PRÓXIMA*"],
    ["a dinâmica lembra", "uma versão moderna de", "*BONNIE E CLYDE*", "dois *CRIMINOSOS*",
     "unidos *CONTRA O MUNDO*"],
    ["mas tudo *MUDA*", "quando um *GOLPE*", "dá *ERRADO*...", "no meio de uma", "*CONSPIRAÇÃO* muito maior"],
    ["e o mais interessante:", "os dois são", "*PROTAGONISTAS JOGÁVEIS*", "a *RELAÇÃO* entre eles",
     "será *FUNDAMENTAL*"],
]

TITLES = [  # (num, texto)
    ("7", "CURIOSIDADES SOBRE\nLUCIA E JASON"),
    ("1", "LUCIA JÁ FOI PRESA"),
    ("2", "ELA APRENDEU A LUTAR\nDESDE CEDO"),
    ("3", "O PASSADO DE JASON"),
    ("4", "ELES PRECISAM\nUM DO OUTRO"),
    ("5", "BONNIE & CLYDE?"),
    ("6", "UM GOLPE MUDA TUDO"),
    ("7", "OS DOIS SÃO\nPROTAGONISTAS"),
]

manifest = []

# títulos
for i, ((num, text), seg) in enumerate(zip(TITLES, SEGS)):
    lines = text.split("\n")
    imgs = [render_title(None if i == 0 else num, ln) for ln in lines]
    hgt = sum(im.height for im in imgs)
    canvas = Image.new("RGBA", (1080, hgt), (0, 0, 0, 0))
    yy = 0
    for im in imgs:
        canvas.paste(im, (0, yy), im); yy += im.height
    fn = f"tt_{i:02d}.png"
    canvas.save(os.path.join(OUT, fn))
    t0 = seg["s0"] + (1.15 if i == 0 else 0.05)
    t1 = min(seg["s0"] + (4.85 if i == 0 else 2.75), seg["s1"] - 0.15)
    manifest.append(dict(file=fn, t0=round(t0, 2), t1=round(t1, 2), y=250, kind="title"))

# legendas
for i, (seg, chunks) in enumerate(zip(SEGS, CAPTIONS)):
    v = vo[seg["vofile"]]
    t0, t1 = v["start"] + 0.02, v["end"] - 0.04
    chars = [len(c.replace("*", "")) for c in chunks]
    tot = sum(chars)
    ct = t0
    for j, ch in enumerate(chunks):
        dt = (t1 - t0) * chars[j] / tot
        img = render_caption(ch)
        fn = f"cap_{i:02d}_{j:02d}.png"
        img.save(os.path.join(OUT, fn))
        manifest.append(dict(file=fn, t0=round(ct, 2), t1=round(ct + dt - 0.03, 2), y=1480, kind="cap"))
        ct += dt

# CTA
cta = render_cta()
cta.save(os.path.join(OUT, "cta.png"))
manifest.append(dict(file="cta.png", t0=57.35, t1=59.95, y=640, kind="cta"))

json.dump(manifest, open(os.path.join(OUT, "overlays.json"), "w"), indent=1)
print("overlays:", len(manifest))
for m in manifest[:6]: print(m)
print("...")
for m in manifest[-4:]: print(m)
