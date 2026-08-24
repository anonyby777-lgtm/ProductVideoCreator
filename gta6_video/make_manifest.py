#!/usr/bin/env python3
"""Gera render/manifest.json — mapeamento explícito das fotos do usuário na timeline de 60s."""
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
A = {a["file"]: a for a in json.load(open(os.path.join(ROOT, "render", "images_analysis.json")))}

def face_of(fname, default=(0.5, 0.38), idx=0):
    a = A[fname]
    if a["faces"]:
        f = a["faces"][min(idx, len(a["faces"]) - 1)]
        return (round(min(max(f["x"] + f["w"] / 2, 0.12), 0.88), 3),
                round(min(max(f["y"] + f["h"] / 2 - 0.04, 0.12), 0.88), 3))
    return default

LUCIA_DIN = "GTA6_Lucia_Dinheiro_01.png"
LUCIA_TRE = "GTA6_Lucia_Treino_01.png"
JASON_CAR = "GTA6_Jason_Carro_01.png"
JASON_CEL = "GTA6_Jason_Celular_01.png"
DANCA     = "GTA6_Jason_Lucia_Danca_01.png"
DANCA_N   = "GTA6_Jason_Lucia_Danca_Noite_01.png"
DUO_NOITE = "GTA6_Jason_Lucia_Noite_01.png"
ASSALTO   = "GTA6_Lucia_Jason_Assalto_01.png"
KEYS      = "GTA6_Leonida_Keys_01.png"
VC_NOITE  = "GTA6_Vice_City_Noite_01.png"

shots = []
def add(t0, t1, img, move, focus=None, idx=0, defocus=(0.5, 0.38)):
    fx, fy = focus if focus else face_of(img, defocus, idx)
    a = A[img]
    mode = "blurpad" if a["ar"] > 1.05 else "cover"
    shots.append(dict(img=f"images/user/{img}", t0=round(t0, 2), t1=round(t1, 2),
                      move=move, fx=fx, fy=fy, mode=mode))

# HOOK 0-5 — Lucia close / Jason carro / Vice City noite
add(0.00, 1.65, LUCIA_DIN, "punch")
add(1.65, 3.30, JASON_CAR, "diag")
add(3.30, 5.00, VC_NOITE, "in", defocus=(0.5, 0.45))
# S1 5-12 — LUCIA JÁ FOI PRESA
add(5.00, 7.35, LUCIA_DIN, "in")
add(7.35, 9.70, LUCIA_DIN, "right", defocus=(0.5, 0.34))
add(9.70, 12.00, LUCIA_TRE, "punch", idx=1, defocus=(0.62, 0.36))
# S2 12-19 — APRENDEU A LUTAR (treino)
add(12.00, 14.35, LUCIA_TRE, "diag2", idx=1, defocus=(0.62, 0.36))
add(14.35, 16.65, LUCIA_TRE, "left", idx=2, defocus=(0.62, 0.36))
add(16.65, 19.00, LUCIA_TRE, "out", idx=1, defocus=(0.62, 0.36))
# S3 19-27 — PASSADO DE JASON
add(19.00, 21.00, JASON_CAR, "in")
add(21.00, 23.00, JASON_CAR, "up", defocus=(0.44, 0.46))
add(23.00, 25.00, JASON_CEL, "diag")
add(25.00, 27.00, JASON_CEL, "punch", defocus=(0.42, 0.34))
# S4 27-35 — DUPLA PRÓXIMA (dança)
add(27.00, 29.00, DANCA, "in_slow", defocus=(0.5, 0.34))
add(29.00, 31.00, DANCA, "left", defocus=(0.5, 0.36))
add(31.00, 33.00, DANCA_N, "right", defocus=(0.34, 0.40))
add(33.00, 35.00, DANCA_N, "in", defocus=(0.4, 0.38))
# S5 35-43 — BONNIE & CLYDE (suspense: noite + assalto)
add(35.00, 37.00, DUO_NOITE, "in_slow")
add(37.00, 39.00, DUO_NOITE, "down", defocus=(0.36, 0.40))
add(39.00, 41.00, ASSALTO, "in", defocus=(0.5, 0.40))
add(41.00, 43.00, ASSALTO, "diag2", defocus=(0.5, 0.38))
# S6 43-51 — GOLPE MUDA TUDO (ação)
add(43.00, 45.00, ASSALTO, "punch", defocus=(0.5, 0.36))
add(45.00, 47.00, VC_NOITE, "left", defocus=(0.5, 0.46))
add(47.00, 49.00, KEYS, "diag", defocus=(0.5, 0.45))
add(49.00, 51.00, VC_NOITE, "right", defocus=(0.5, 0.44))
# S7 51-57 — PROTAGONISTAS + cidade
add(51.00, 53.00, DANCA_N, "in", defocus=(0.36, 0.38))
add(53.00, 55.00, KEYS, "diag", defocus=(0.5, 0.42))
add(55.00, 57.00, VC_NOITE, "in", defocus=(0.5, 0.40))
# CTA 57-60 — dupla olhando
add(57.00, 60.00, DUO_NOITE, "in_slow", defocus=(0.32, 0.40))

# valida
assert abs(shots[-1]["t1"] - 60.0) < 1e-6
for s, n in zip(shots, shots[1:]):
    assert s["t1"] == n["t0"], (s, n)

json.dump(dict(shots=shots), open(os.path.join(ROOT, "render", "manifest.json"), "w"), indent=1)
print("shots:", len(shots))
for s in shots:
    print(f"{s['t0']:6.2f}-{s['t1']:6.2f} {os.path.basename(s['img']):34s} {s['move']:8s} fx={s['fx']} fy={s['fy']}")
