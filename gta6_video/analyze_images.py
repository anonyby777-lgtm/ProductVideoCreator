#!/usr/bin/env python3
"""Analisa imagens do usuário: rostos, personagem provável, noite/neon, proporção."""
import json, os, glob
import numpy as np
import cv2

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "images", "user")

casc_front = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
casc_prof = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")

def analyze(path):
    img = cv2.imread(path)
    if img is None:
        return None
    h, w = img.shape[:2]
    small = cv2.resize(img, (960, int(h * 960 / w)))
    gray = cv2.equalizeHist(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY))
    faces = list(casc_front.detectMultiScale(gray, 1.12, 5, minSize=(70, 70)))
    prof = list(casc_prof.detectMultiScale(gray, 1.12, 5, minSize=(70, 70)))
    flipped = cv2.flip(gray, 1)
    prof2 = list(casc_prof.detectMultiScale(flipped, 1.12, 5, minSize=(70, 70)))
    sw = small.shape[1]
    for (x, y, fw, fh) in prof2:
        faces.append((sw - x - fw, y, fw, fh))
    # dedup
    kept = []
    for f in faces + prof:
        dup = False
        for k in kept:
            if abs(f[0]-k[0]) < f[2]*0.4 and abs(f[1]-k[1]) < f[3]*0.4:
                dup = True; break
        if not dup:
            kept.append(f)
    faces = sorted(kept, key=lambda f: f[2]*f[3], reverse=True)[:4]
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    night = hsv[..., 2].mean() < 95
    neon = float(hsv[..., 1][hsv[..., 2] > 140].mean()) if (hsv[..., 2] > 140).any() else 0

    guess = "none"
    hair_hint = ""
    if len(faces) >= 2:
        guess = "duo"
    elif len(faces) == 1:
        (x, y, fw, fh) = faces[0]
        g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        # cabelo: faixa acima + laterais abaixo do rosto (cabelo comprido escuro)
        top = g[max(0, y-int(0.30*fh)):y, x:x+fw]
        left_below = g[y+fh:min(g.shape[0], y+int(1.9*fh)), max(0,x-int(0.30*fw)):x]
        right_below = g[y+fh:min(g.shape[0], y+int(1.9*fh)), x+fw:min(g.shape[1], x+int(1.30*fw))]
        dark = lambda r: float((r < 70).mean()) if r.size else 0.0
        d_top, d_side = dark(top), 0.5*(dark(left_below)+dark(right_below))
        if d_top > 0.42 and d_side > 0.33:
            guess, hair_hint = "lucia", f"darkTop={d_top:.2f} darkSide={d_side:.2f}"
        else:
            guess, hair_hint = "jason", f"darkTop={d_top:.2f} darkSide={d_side:.2f}"
    return dict(file=os.path.basename(path), w=w, h=h, ar=round(w/h, 3),
                nfaces=len(faces),
                faces=[dict(x=round(x/small.shape[1], 3), y=round(y/small.shape[0], 3),
                            w=round(fw/small.shape[1], 3), h=round(fh/small.shape[0], 3)) for (x, y, fw, fh) in faces],
                night=bool(night), neon=round(neon, 1), guess=guess, hair=hair_hint)

if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(SRC, "*.png")) + glob.glob(os.path.join(SRC, "*.jpg")))
    if not files:
        print("SEM IMAGENS em", SRC); raise SystemExit(1)
    out = []
    for f in files:
        r = analyze(f)
        if r:
            out.append(r)
            print(f"{r['file']:14s} {r['w']}x{r['h']} ar={r['ar']:.2f} rostos={r['nfaces']} "
                  f"-> {r['guess']:5s} noite={r['night']} neon={r['neon']} {r['hair']}")
    json.dump(out, open(os.path.join(ROOT, "render", "images_analysis.json"), "w"), indent=1)
    print("salvo: render/images_analysis.json | total", len(out))
