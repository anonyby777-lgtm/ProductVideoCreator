#!/usr/bin/env python3
"""GTA VI video — soundtrack + SFX synthesis + final audio mix (exactly 60.0s)."""
import json, os, subprocess, wave
import numpy as np
import imageio_ffmpeg
import pyloudnorm as pyln

SR = 44100
DUR = 60.0
N = int(SR * DUR)
ROOT = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(ROOT, "audio")
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

rng = np.random.default_rng(77)

# ---------------- helpers ----------------
def decode_mono(path, atempo=None):
    """Decode any audio to float32 mono 44.1k via ffmpeg; optional atempo."""
    tmp = None
    if atempo and abs(atempo - 1.0) > 1e-3:
        tmp = "/tmp/_atempo.wav"
        subprocess.run([FFMPEG, "-y", "-i", path, "-filter:a",
                        f"atempo={atempo:.4f}", "-ar", str(SR), "-ac", "1", tmp],
                       check=True, capture_output=True)
        path = tmp
    raw = subprocess.run([FFMPEG, "-i", path, "-f", "s16le", "-ar", str(SR), "-ac", "1", "-"],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if tmp: os.remove(tmp)
    return x

def place(track, sig, t, gain=1.0):
    i = int(t * SR)
    j = min(N, i + len(sig))
    if i >= N: return
    track[i:j] += sig[:j - i] * gain

def env_ad(n, a, d):
    e = np.ones(n, dtype=np.float32)
    na, nd = int(a * SR), int(d * SR)
    if na > 0: e[:na] = np.linspace(0, 1, na)
    if nd > 0: e[-nd:] *= np.linspace(1, 0, nd)
    return e

def lowpass(x, cutoff):
    # one-pole
    dt = 1.0 / SR
    rc = 1.0 / (2 * np.pi * cutoff)
    alpha = dt / (rc + dt)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y

def lowpass_fft(x, cutoff):
    """Vectorized FFT brickwall-ish lowpass (with soft knee)."""
    X = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    gain = 1.0 / (1.0 + (freqs / max(cutoff, 20)) ** 4)
    return np.fft.irfft(X * gain, len(x)).astype(np.float32)

def highpass_fft(x, cutoff):
    X = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    gain = 1.0 / (1.0 + (cutoff / np.maximum(freqs, 1)) ** 4)
    return np.fft.irfft(X * gain, len(x)).astype(np.float32)

def t_axis(n): return np.arange(n) / SR

# ---------------- SFX synth ----------------
def sfx_impact(f0=58.0, f1=36.0, dur=0.9, punch=1.0):
    n = int(dur * SR); t = t_axis(n)
    f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.08))
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.22 / punch)) * punch
    click = highpass_fft(rng.standard_normal(int(0.012 * SR)), 3000) * 0.5 * punch
    out = body.copy()
    place(out, click.astype(np.float32), 0.0)
    return np.tanh(out * 1.4) * 0.9

def sfx_whoosh(dur=0.55, bright=1.0):
    n = int(dur * SR); t = t_axis(n)
    noise = rng.standard_normal(n).astype(np.float32)
    hiss = highpass_fft(noise, 1200 * bright)
    air = lowpass_fft(noise, 900 * bright)
    e = np.sin(np.pi * np.minimum(t / dur, 1.0)) ** 2.2
    sig = (0.65 * hiss + 0.5 * air) * e
    return np.tanh(sig * 1.6) * 0.7

def sfx_riser(dur=1.2):
    n = int(dur * SR); t = t_axis(n)
    noise = rng.standard_normal(n).astype(np.float32)
    hi = highpass_fft(noise, 2000)
    lo = lowpass_fft(noise, 600)
    x = np.linspace(0, 1, n)
    sweep = lo * (1 - x) + hi * x
    e = x ** 2.2
    tone_f = 180 * (2 ** (x * 2.6))
    ph = 2 * np.pi * np.cumsum(tone_f) / SR
    tone = np.sin(ph) * 0.25 * e
    return np.tanh((sweep * e + tone) * 1.5) * 0.75

def sfx_siren(dur=3.2):
    n = int(dur * SR); t = t_axis(n)
    lfo = (np.sin(2 * np.pi * 1.55 * t) > 0).astype(np.float32)
    f = 705 + 235 * lfo
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(ph) + 0.35 * np.sin(2 * ph)
    fade = env_ad(n, 0.25, 0.5)
    dist = 1.0 - 0.25 * t / dur
    return np.tanh(sig * fade * dist * 1.1) * 0.5

def sfx_heli(dur=4.0):
    n = int(dur * SR); t = t_axis(n)
    noise = rng.standard_normal(n).astype(np.float32)
    noise = lowpass_fft(noise, 380)
    chop = (np.sin(2 * np.pi * 12.5 * t) > -0.2).astype(np.float32)
    sig = noise * (0.45 + 0.55 * chop)
    rumble = np.sin(2 * np.pi * 46 * t) * 0.18 * chop
    fade = env_ad(n, 0.5, 0.8)
    return (sig + rumble) * fade * 0.9

def sfx_engine(dur=6.0):
    n = int(dur * SR); t = t_axis(n)
    wn = rng.standard_normal(n).astype(np.float32)
    brown = np.cumsum(wn); brown -= np.linspace(brown[0], brown[-1], n)
    brown = brown / (np.abs(brown).max() + 1e-9)
    brown = lowpass_fft(brown.astype(np.float32), 240)
    vib = 1 + 0.04 * np.sin(2 * np.pi * 5.2 * t) + 0.02 * np.sin(2 * np.pi * 11 * t)
    ph = 2 * np.pi * np.cumsum(88.0 * vib) / SR
    tone = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)) * 0.5
    rev = 0.75 + 0.25 * np.sin(2 * np.pi * 0.35 * t)
    fade = env_ad(n, 0.6, 0.9)
    return np.tanh((brown * 0.8 + tone) * rev * fade * 1.3) * 0.6

def sfx_heartbeat(dur=8.0, bpm=66):
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    period = 60.0 / bpm
    t = 0.0
    while t < dur - 0.6:
        for k, g in ((0.0, 1.0), (0.16, 0.72)):
            th = sfx_impact(52, 34, 0.35, punch=0.5) * g
            place(out, th, t + k)
        t += period
    return out * 0.9

def sfx_subdrop(dur=1.4):
    n = int(dur * SR); t = t_axis(n)
    f = 130 * np.exp(-t / 0.28) + 28
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-t / 0.5)
    return sig * 0.95

# ---------------- music ----------------
NOTE = {"A1":55.0,"C2":65.41,"D2":73.42,"E2":82.41,"F2":87.31,"G2":98.0,"A2":110.0,
        "C3":130.81,"D3":146.83,"E3":164.81,"F3":174.61,"G3":196.0,"A3":220.0,
        "C4":261.63,"D4":293.66,"E4":329.63,"F4":349.23,"G4":392.0,"A4":440.0,
        "B4":493.88,"C5":523.25,"E5":659.25,"A5":880.0,"F5":698.46,"G5":783.99,"D5":587.33}

BPM = 128.0
BEAT = 60.0 / BPM          # 0.46875
BAR = 4 * BEAT

def synth_kick():
    n = int(0.24 * SR); t = t_axis(n)
    f = 130 * np.exp(-t / 0.02) + 44
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.085)
    click = highpass_fft(rng.standard_normal(n).astype(np.float32), 2500) * 0.35 * np.exp(-t / 0.004)
    return np.tanh((body + click) * 1.7) * 0.95

def synth_clap():
    n = int(0.22 * SR); t = t_axis(n)
    noise = rng.standard_normal(n).astype(np.float32)
    bp = highpass_fft(lowpass_fft(noise, 2200), 500)
    e = np.exp(-t / 0.055)
    bursts = 0.0
    sig = bp * e
    for k in (0.008, 0.016):
        j = int(k * SR)
        e2 = np.zeros(n, dtype=np.float32); e2[j:] = np.exp(-t[:-j] / 0.03) if j else e
        sig = sig + 0.6 * bp * e2
    return np.tanh(sig * 1.8) * 0.6

def synth_hat(open_=False):
    n = int((0.18 if open_ else 0.055) * SR); t = t_axis(n)
    noise = rng.standard_normal(n).astype(np.float32)
    hp = highpass_fft(noise, 8200)
    e = np.exp(-t / (0.07 if open_ else 0.016))
    return hp * e * 0.5

def synth_bass(freq, dur):
    n = int(dur * SR); t = t_axis(n)
    sig = np.zeros(n, dtype=np.float32)
    for h in range(1, 10):
        sig += np.sin(2 * np.pi * freq * h * t + rng.uniform(0, 6.28)) / (h ** 1.7)
    e = env_ad(n, 0.008, min(0.09, dur * 0.4))
    return lowpass_fft(sig * e, 900) * 0.9

def synth_pad(freqs, dur):
    n = int(dur * SR); t = t_axis(n)
    sig = np.zeros(n, dtype=np.float32)
    for f in freqs:
        for det, g in ((0.9965, 0.5), (1.0, 0.6), (1.004, 0.5)):
            for h in (1, 2, 3):
                sig += g / (2.6 * h) * np.sin(2 * np.pi * f * det * h * t + rng.uniform(0, 6.28))
    e = np.minimum(1, t / 0.9) * np.minimum(1, (dur - t) / 0.7)
    return lowpass_fft(sig * e, 1500) * 0.16

def synth_pluck(freq, dur=0.14):
    n = int(dur * SR); t = t_axis(n)
    sig = (np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 2 * t)
           + 0.22 * np.sin(2 * np.pi * freq * 3.01 * t))
    e = np.exp(-t / 0.045)
    return sig * e * 0.32

# chords: Am  F  C  G  (dark synthwave), bass roots A2 F2 C3 G2... use A1/F1?-> A2,F2,C3,G2
CHORDS = [
    (["A2", "C4", "E4", "A4"], "A2"),
    (["F2", "A3", "C4", "F4"], "F2"),
    (["C3", "E4", "G4", "C5"], "C3"),
    (["G2", "D4", "G4", "B4"], "G2"),
]

def build_music():
    mus = np.zeros(N, dtype=np.float32)
    kick = synth_kick(); clap = synth_clap()
    hat = synth_hat(); ohat = synth_hat(True)
    # pad bus (stereo widened later)
    pad = np.zeros(N, dtype=np.float32)
    nbars = int(round(DUR / BAR))
    for b in range(nbars):
        t0 = b * BAR
        chord, root = CHORDS[b % 4]
        # section: bars 0-1 intro (pad+arp), 2+ groove; breakdown bars 18-20 (35.2-43.4s); 21+ full; 30+ (57s+) tail
        section = "intro" if b < 2 else ("break" if 18 <= b < 21 else ("outro" if b >= 31 else "groove"))
        place(pad, synth_pad([NOTE[nm] for nm in chord], BAR + 0.4), t0)
        if section in ("groove", "outro", "intro"):
            # arp 8ths
            tones = [NOTE[nm] * 2 for nm in chord]
            for s in range(8):
                f = tones[[0, 1, 2, 3, 2, 1, 3, 1][s]]
                place(mus, synth_pluck(f), t0 + s * BEAT / 2, 0.5 if section != "intro" else 0.35)
        if section in ("groove", "outro"):
            for beat in range(4):
                place(mus, kick, t0 + beat * BEAT)
                if beat in (1, 3):
                    place(mus, clap, t0 + beat * BEAT)
                for sub in (0, 1):
                    place(mus, hat, t0 + beat * BEAT + sub * BEAT / 2,
                          0.9 if beat % 2 else 0.65)
                if beat % 2 == 1:
                    place(mus, ohat, t0 + beat * BEAT + BEAT / 2, 0.5)
            # bass offbeats
            for beat in range(4):
                place(mus, synth_bass(NOTE[root], BEAT * 0.92), t0 + beat * BEAT + BEAT / 2)
                place(mus, synth_bass(NOTE[root], BEAT * 0.45), t0 + beat * BEAT, 0.7)
    # sidechain pump from kicks
    pump = np.ones(N, dtype=np.float32)
    tt = t_axis(N)
    for b in range(nbars):
        section = "intro" if b < 2 else ("break" if 18 <= b < 21 else ("outro" if b >= 31 else "groove"))
        if section != "groove": continue
        for beat in range(4):
            i0 = int((b * BAR + beat * BEAT) * SR)
            n_rem = N - i0
            if n_rem <= 0: continue
            seg = 1.0 - 0.42 * np.exp(-tt[:n_rem] / 0.11)
            pump[i0:] = np.minimum(pump[i0:], seg) if False else pump[i0:] * 1.0
            # apply dip multiplicatively
            dip = 1.0 - 0.45 * np.exp(-tt[:n_rem] / 0.13)
            pump[i0:] *= dip ** 0  # placeholder no-op
    # simpler: rebuild pump as product of dips (vector chunks)
    pump = np.ones(N, dtype=np.float32)
    def dip_at(t0, depth=0.48, tau=0.13):
        i0 = int(t0 * SR)
        if i0 >= N: return
        n_rem = N - i0
        d = 1.0 - depth * np.exp(-tt[:n_rem] / tau)
        pump[i0:] *= d
    for b in range(nbars):
        section = "intro" if b < 2 else ("break" if 18 <= b < 21 else ("outro" if b >= 31 else "groove"))
        if section != "groove": continue
        for beat in range(4):
            dip_at(b * BAR + beat * BEAT)
    mus = mus * pump
    pad = pad * (0.85 + 0.15 * pump)
    mus += pad
    # music hard-stop at 58.9 with fast fade (space for CTA), final tail swell 57-58.9
    fade = np.ones(N, dtype=np.float32)
    i589 = int(58.9 * SR)
    fade[i589:] = np.linspace(1, 0, N - i589) ** 0.5
    mus *= fade
    return mus * 0.9

# ---------------- timeline ----------------
SEG = [  # (start, end, vo_file, lead)
    (0.0,  5.0,  "vo_01_hook.mp3",    0.10),
    (5.0,  12.0, "vo_02_preso.mp3",   0.18),
    (12.0, 19.0, "vo_03_luta.mp3",    0.18),
    (19.0, 27.0, "vo_04_jason.mp3",   0.18),
    (27.0, 35.0, "vo_05_dupla.mp3",   0.18),
    (35.0, 43.0, "vo_06_bonnie.mp3",  0.18),
    (43.0, 51.0, "vo_07_golpe.mp3",   0.18),
    (51.0, 57.0, "vo_08_jogaveis.mp3",0.18),
    (57.0, 60.0, "vo_09_cta.mp3",     0.05),
]

def main():
    meta = {"vo": []}
    vo_track = np.zeros(N, dtype=np.float32)

    for (s0, s1, fn, lead) in SEG:
        path = os.path.join(AUD, fn)

        def trim_silence(sig, thr=0.012, keep_head=0.05, keep_tail=0.15):
            idx = np.where(np.abs(sig) > thr)[0]
            if len(idx) == 0: return sig
            a = max(0, idx[0] - int(keep_head * SR))
            b = min(len(sig), idx[-1] + int(keep_tail * SR))
            return sig[a:b]

        def load(t=None):
            x = decode_mono(path, atempo=t)
            return trim_silence(x)

        # deadline = start of next VO - 0.06s (last one: 59.95)
        idx_seg = SEG.index((s0, s1, fn, lead))
        next_start = SEG[idx_seg + 1][0] + SEG[idx_seg + 1][3] if idx_seg + 1 < len(SEG) else 59.95
        deadline = min(s1 + 0.22, next_start - 0.06)
        t0 = s0 + lead
        atempo = 1.0
        x = load()
        d = len(x) / SR
        if d > deadline - t0:
            atempo = min(1.5, d / (deadline - t0))
            x = load(atempo)
            d = len(x) / SR
            if d > deadline - t0:  # extra push
                atempo = min(1.65, atempo * d / (deadline - t0))
                x = load(atempo)
                d = len(x) / SR
        end = t0 + d
        ok = end <= deadline + 0.03
        meta["vo"].append({"file": fn, "start": round(t0, 3), "dur": round(d, 3),
                           "end": round(end, 3), "atempo": round(atempo, 4)})
        print(f"{fn:22s} start={t0:6.2f} end={end:6.2f} dur={d:5.2f} atempo={atempo:.3f} {'OK' if ok else '!! OVERFLOW'}")
        place(vo_track, x * 1.0, t0)

    # ------- SFX bus -------
    sfx = np.zeros(N, dtype=np.float32)
    # hook: opening hit + riser into fact 1
    place(sfx, sfx_impact(70, 40, 1.1, 1.0), 0.0, 0.8)
    place(sfx, sfx_riser(1.3), 3.5, 0.8)
    place(sfx, sfx_siren(2.2), 2.3, 0.40)          # distant siren in hook
    place(sfx, sfx_engine(3.2), 1.4, 0.5)
    # segment transitions: whoosh before + impact hit on title
    for i, (s0, s1, fn, lead) in enumerate(SEG[1:], start=1):
        place(sfx, sfx_whoosh(0.6, 1.0 + 0.08 * (i % 2)), s0 - 0.28, 0.9)
        place(sfx, sfx_impact(64, 38, 0.9, 0.9), s0, 0.85)
    # mid-segment cut whooshes
    for tc in (1.7, 3.4, 8.5, 15.5, 22.7, 30.5, 38.5, 46.6, 53.7):
        place(sfx, sfx_whoosh(0.42, 1.1), tc, 0.5)
    # fact 3: engine under driving b-roll
    place(sfx, sfx_engine(7.5), 19.2, 0.55)
    # fact 5 (Bonnie): heartbeat suspense + subtle riser into fact 6
    place(sfx, sfx_heartbeat(7.8), 35.2, 0.9)
    place(sfx, sfx_riser(1.6), 41.4, 0.75)
    # fact 6: chase — sirens + helicopter
    place(sfx, sfx_siren(3.4), 43.05, 0.55)
    place(sfx, sfx_siren(3.2), 47.4, 0.45)
    place(sfx, sfx_heli(4.4), 46.4, 0.8)
    place(sfx, sfx_engine(6.0), 43.3, 0.5)
    # fact 7 -> CTA
    place(sfx, sfx_riser(1.1), 55.9, 0.8)
    place(sfx, sfx_subdrop(1.5), 56.95, 1.0)
    place(sfx, sfx_impact(58, 30, 1.6, 1.1), 57.0, 1.0)

    # ------- music -------
    mus = build_music()

    # ------- ducking (music/sfx under VO) -------
    def duck_env(sig, depth, tau_a=0.008, tau_r=0.18):
        a = np.abs(sig)
        # smooth attack/release
        k = int(0.01 * SR)
        kernel = np.ones(k) / k
        a = np.convolve(a, kernel, mode="same")
        env = 1.0 - depth * np.clip((a / 0.12) ** 0.7, 0, 1)
        k2 = int(0.05 * SR)
        env = np.convolve(env, np.ones(k2) / k2, mode="same")
        return env.astype(np.float32)

    mus_d = mus * duck_env(vo_track, 0.52)
    sfx_d = sfx * duck_env(vo_track, 0.25)

    mix = vo_track * 1.15 + mus_d * 0.62 + sfx_d * 0.95
    # gentle master saturation + limit
    mix = np.tanh(mix * 1.12)

    # stereo: slight widening via 6ms Haas on side content of music (approx: delayed copy)
    delay = int(0.0065 * SR)
    left = mix.copy()
    right = mix.copy()
    m = 0.5 * (left + right)
    s = 0.5 * (left - right)
    s_delay = np.concatenate([np.zeros(delay, dtype=np.float32), s[:-delay]])
    left = m + 0.9 * s_delay
    right = m - 0.9 * s_delay
    st = np.stack([left, right], axis=1)

    # loudness normalize to -14 LUFS
    try:
        meter = pyln.Meter(SR)
        loud = meter.integrated_loudness(st)
        st = pyln.normalize.loudness(st, loud, -14.0)
    except Exception as e:
        print("loudnorm fallback:", e)
    peak = np.abs(st).max()
    if peak > 0.87:
        st = st * (0.87 / peak)

    # exact length + write 16-bit stereo WAV
    st = st[:N]
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    out = os.path.join(ROOT, "render", "final_audio.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("audio final:", out, f"{len(st)/SR:.3f}s")

    with open(os.path.join(ROOT, "render", "vo_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

if __name__ == "__main__":
    main()
