#!/usr/bin/env python3
"""Monta o vídeo final 1080x1920@30fps, exatamente 60s, a partir de render/manifest.json."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 30
W, H = 1080, 1920
SUP_W, SUP_H = 2700, 4800   # supersample p/ zoompan sem jitter
BUILD = os.path.join(ROOT, "render")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-4000:])
        raise SystemExit(f"FFMPEG FALHOU: {' '.join(cmd[:8])}...")

# ---------- 1. preparar imagens (cover-crop 2700x4800 ou blurpad) ----------
def prep_image(src, dst, mode="cover", fx=0.5, fy=0.42):
    im = Image.open(src).convert("RGB")
    ar = im.width / im.height
    if mode == "blurpad" and ar > 1.05:
        bg = im.resize((SUP_W, SUP_H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(60))
        bg = Image.eval(bg, lambda p: int(p * 0.55))
        # frente: cabe na largura com margem p/ movimento vertical
        fw = int(SUP_W * 1.06)
        fh = int(im.height * fw / im.width)
        if fh > SUP_H:
            fh = SUP_H; fw = int(im.width * fh / im.height)
        fg = im.resize((fw, fh), Image.LANCZOS)
        bg.paste(fg, ((SUP_W - fw) // 2, (SUP_H - fh) // 2))
        bg.save(dst, quality=95)
    else:
        scale = max(SUP_W / im.width, SUP_H / im.height)
        nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
        im2 = im.resize((nw, nh), Image.LANCZOS)
        x = int((nw - SUP_W) * fx); y = int((nh - SUP_H) * fy)
        x = max(0, min(nw - SUP_W, x)); y = max(0, min(nh - SUP_H, y))
        im2.crop((x, y, x + SUP_W, y + SUP_H)).save(dst, quality=95)

# ---------- 2. cliques zoompan ----------
MOVES = {
    "in":     ("1+0.28*on/{D}", "(iw-iw/zoom)/2", "(ih-ih/zoom)/2"),
    "in_slow":("1+0.16*on/{D}", "(iw-iw/zoom)/2", "(ih-ih/zoom)/2"),
    "out":    ("1.30-0.30*on/{D}", "(iw-iw/zoom)/2", "(ih-ih/zoom)/2"),
    "punch":  ("1+0.55*pow(on/{D},2)", "(iw-iw/zoom)/2", "(ih-ih/zoom)/2"),
    "left":   ("1.24", "(iw-iw/zoom)*on/{D}", "(ih-ih/zoom)/2"),
    "right":  ("1.24", "(iw-iw/zoom)*(1-on/{D})", "(ih-ih/zoom)/2"),
    "up":     ("1.24", "(iw-iw/zoom)/2", "(ih-ih/zoom)*on/{D}"),
    "down":   ("1.24", "(iw-iw/zoom)/2", "(ih-ih/zoom)*(1-on/{D})"),
    "diag":   ("1+0.3*on/{D}", "(iw-iw/zoom)*(1-on/{D})", "(ih-ih/zoom)*on/{D}"),
    "diag2":  ("1+0.3*on/{D}", "(iw-iw/zoom)*on/{D}", "(ih-ih/zoom)*(1-on/{D})"),
}

def render_shots(manifest):
    os.makedirs(os.path.join(BUILD, "prep"), exist_ok=True)
    os.makedirs(os.path.join(BUILD, "clips"), exist_ok=True)
    clips = []
    for i, sh in enumerate(manifest["shots"]):
        dur = sh["t1"] - sh["t0"]
        frames = max(2, round(dur * FPS))
        prep = os.path.join(BUILD, "prep", f"p{i:02d}.jpg")
        prep_image(os.path.join(ROOT, sh["img"]), prep,
                   mode=sh.get("mode", "cover"), fx=sh.get("fx", 0.5), fy=sh.get("fy", 0.42))
        z, x, y = MOVES[sh.get("move", "in")]
        z, x, y = z.format(D=frames), x.format(D=frames), y.format(D=frames)
        vf = (f"zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s={W}x{H}:fps={FPS},"
              f"format=yuv420p")
        out = os.path.join(BUILD, "clips", f"c{i:02d}.mp4")
        run([FF, "-y", "-loop", "1", "-i", prep, "-vf", vf,
             "-t", f"{frames/FPS:.4f}", "-r", str(FPS),
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "17",
             "-pix_fmt", "yuv420p", out])
        clips.append(out)
        print(f"clip {i:02d}: {sh['img']} {sh.get('move','in')} {dur:.2f}s OK")
    return clips

def concat_clips(clips):
    lst = os.path.join(BUILD, "concat.txt")
    with open(lst, "w") as f:
        for c in clips:
            f.write(f"file '{c}'\n")
    base = os.path.join(BUILD, "base.mp4")
    run([FF, "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", base])
    return base

# ---------- 3. overlays + grade + flashes + audio ----------
def final_render(base):
    ov = json.load(open(os.path.join(ROOT, "overlays", "overlays.json")))
    inputs = ["-i", base]
    fparts = []
    cur = "[0:v]"
    for k, e in enumerate(ov):
        inputs += ["-loop", "1", "-t", f"{max(e['t1']-e['t0'],0.05):.3f}", "-i", os.path.join(ROOT, "overlays", e["file"])]
        fparts.append(f"[{k+1}:v]format=rgba,setpts=PTS-STARTPTS+{e['t0']}/TB[o{k}]")
        nxt = f"[v{k}]"
        fparts.append(f"{cur}[o{k}]overlay=x=0:y={e['y']}:enable='between(t,{e['t0']},{e['t1']})':eof_action=pass{nxt}")
        cur = nxt
    # grade + grão + vinheta + flashes
    flashes = [("0.00", 0.45, 0.06)] + [(f"{s}.00", 0.22, 0.07) for s in (5, 12, 19, 27, 35, 43, 51)] + [("57.00", 0.8, 0.10)]
    fx = ("eq=contrast=1.06:saturation=1.16:brightness=0.012,"
          "vignette=angle=PI/4.6,"
          "noise=alls=5:allf=t+u,"
          "unsharp=5:5:0.35:5:5:0.0")
    for (t0, a, d) in flashes:
        fx += f",drawbox=t=fill:color=white@{a}:x=0:y=0:w={W}:h={H}:enable='between(t,{t0},{float(t0)+d})'"
    fparts.append(f"{cur}{fx}[vout]")
    fc = ";".join(fparts)
    out = os.path.join(ROOT, "GTA6_Lucia_Jason_60s.mp4")
    run([FF, "-y", *inputs, "-i", os.path.join(BUILD, "final_audio.wav"),
         "-filter_complex", fc, "-map", "[vout]", "-map", f"{len(ov)+1}:a",
         "-t", "60", "-r", str(FPS),
         "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
         "-movflags", "+faststart", out])
    return out

if __name__ == "__main__":
    manifest = json.load(open(os.path.join(BUILD, "manifest.json")))
    clips = render_shots(manifest)
    base = concat_clips(clips)
    out = final_render(base)
    r = subprocess.run([FF, "-i", out], capture_output=True, text=True)
    for ln in r.stderr.splitlines():
        if "Duration" in ln or "Stream " in ln:
            print(ln.strip())
    print("FINAL:", out, os.path.getsize(out) // 1024, "KB")
