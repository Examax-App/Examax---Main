"""
The launch film's soundtrack and sound effects, synthesised from scratch so
every sound in the film is Examax's own (no samples, no licences).

    python3 remotion/audio/compose.py            # needs numpy + scipy

Writes 48 kHz stereo WAVs into remotion/public/film/:

    music.wav     60 s, 120 BPM (a bar is 2 s, 60 film frames), F major
    click.wav     a soft UI click
    key-1..3.wav  keyboard ticks, three variants
    pop.wav       a card arriving
    whoosh.wav    the air between scenes
    success.wav   a two-note chime for a right answer / a result

The music's sections sit on the film's scene cuts (components/launch-film/
timeline.ts), all on bar lines:

    bars  0–1   0–4 s    intro: pad swelling open, a filtered pluck, riser
    bars  2–11  4–24 s   groove A: kick, offbeat hats, bass, chords, arpeggio
    bars 12–21  24–44 s  groove B: + claps, a bell melody
    bars 22–24  44–50 s  groove C: everything, the arpeggio an octave up
    bars 25–26  50–54 s  build: drums thin out, the riser climbs
    bars 27–29  54–60 s  impact, then B♭ – C – F resolving and ringing out
"""

from pathlib import Path

import numpy as np
from scipy import signal

SR = 48_000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 60.0
N = int(SR * LENGTH)
OUT = Path(__file__).resolve().parents[1] / "public" / "film"
rng = np.random.default_rng(2026)


def midi(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def t_of(samples: int) -> np.ndarray:
    return np.arange(samples) / SR


def place(buf: np.ndarray, sound: np.ndarray, at: float, gain: float = 1.0, pan: float = 0.0) -> None:
    """Mix a mono sound into the stereo buffer at `at` seconds, equal-power panned."""
    start = int(at * SR)
    if start >= buf.shape[1]:
        return
    end = min(buf.shape[1], start + len(sound))
    piece = sound[: end - start] * gain
    left = np.cos((pan + 1) * np.pi / 4)
    right = np.sin((pan + 1) * np.pi / 4)
    buf[0, start:end] += piece * left * np.sqrt(2)
    buf[1, start:end] += piece * right * np.sqrt(2)


def lowpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    sos = signal.butter(order, min(cutoff, SR / 2 - 100), "low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def highpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    sos = signal.butter(order, cutoff, "high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def bandpass(x: np.ndarray, lo: float, hi: float, order: int = 2) -> np.ndarray:
    sos = signal.butter(order, [lo, hi], "band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    """Attack, decay, sustain level, release — over n samples, the release at the end."""
    env = np.full(n, s)
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    env[:na] = np.linspace(0, 1, na, endpoint=False)
    nd = min(nd, n - na)
    env[na : na + nd] = np.linspace(1, s, nd, endpoint=False)
    nr = min(nr, n)
    env[n - nr :] *= np.linspace(1, 0, nr)
    return env


def saw(freq: float, n: int, phase: float = 0.0) -> np.ndarray:
    return 2 * ((t_of(n) * freq + phase) % 1.0) - 1


def reverb(x: np.ndarray, seconds: float = 2.2, mix: float = 0.22, seed: int = 1) -> np.ndarray:
    """Stereo convolution with exponentially decaying, slightly darkened noise."""
    local = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-6.0 * t_of(n) / seconds)
    out = np.empty_like(x)
    for ch in range(2):
        ir = local.standard_normal(n) * decay
        ir = lowpass(ir, 6000)
        ir[: int(0.012 * SR)] = 0  # pre-delay
        ir /= np.sqrt(np.sum(ir**2))
        wet = signal.fftconvolve(x[ch], ir)[: x.shape[1]]
        out[ch] = x[ch] * (1 - mix) + wet * mix
    return out


def delay(x: np.ndarray, time: float, feedback: float, mix: float) -> np.ndarray:
    """Ping-pong delay: each repeat crosses to the other side."""
    d = int(time * SR)
    wet = np.zeros_like(x)
    tap = x.copy()
    for i in range(1, 6):
        g = feedback**i
        if g < 0.02:
            break
        shifted = np.zeros_like(x)
        shifted[:, d * i :] = tap[:, : x.shape[1] - d * i]
        if i % 2:
            shifted = shifted[::-1]
        wet += shifted * g
    return x + wet * mix


# --------------------------------------------------------------------------
# Harmony
# --------------------------------------------------------------------------

# F major: I – V – vi – IV, as MIDI chord tones (root, third, fifth).
F, C, DM, BB = [53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53]
LOOP = [F, C, DM, BB]
OUTRO = [BB, C, F]


def chord_at(bar: int) -> list[int]:
    if bar >= 27:
        return OUTRO[min(bar - 27, 2)]
    return LOOP[bar % 4]


def section(bar: int) -> str:
    if bar <= 1:
        return "intro"
    if bar <= 11:
        return "A"
    if bar <= 21:
        return "B"
    if bar <= 24:
        return "C"
    if bar <= 26:
        return "build"
    return "outro"


# --------------------------------------------------------------------------
# Instruments
# --------------------------------------------------------------------------


def pad_note(freq: float, seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    voices = sum(saw(freq * 2 ** (cents / 1200), n, rng.random()) for cents in (-9, -3, 4, 10)) / 4
    return voices * adsr(n, 0.35, 0.4, 0.8, 0.6)


def pluck(freq: float, seconds: float = 0.45, bright: float = 3200) -> np.ndarray:
    n = int(seconds * SR)
    tone = 0.6 * saw(freq, n) + 0.4 * signal.square(2 * np.pi * freq * t_of(n), 0.3)
    env = np.exp(-t_of(n) * 9)
    # The filter closes as the note dies, the way a plucked string darkens.
    return lowpass(tone * env, bright) * np.minimum(1, t_of(n) * 400)


def bass_note(freq: float, seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    tone = np.sin(2 * np.pi * freq * t_of(n)) + 0.25 * lowpass(saw(freq, n), 500)
    return np.tanh(tone * 1.4) * adsr(n, 0.005, 0.08, 0.7, 0.05)


def bell(freq: float, seconds: float = 1.2) -> np.ndarray:
    n = int(seconds * SR)
    t = t_of(n)
    mod = np.sin(2 * np.pi * freq * 3.5 * t) * 1.6 * np.exp(-t * 5)
    tone = np.sin(2 * np.pi * freq * t + mod) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    return tone * np.exp(-t * 3.2) * np.minimum(1, t * 300)


def kick() -> np.ndarray:
    n = int(0.42 * SR)
    t = t_of(n)
    pitch = 46 + 110 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 7.5)
    click = lowpass(rng.standard_normal(n), 4000) * np.exp(-t * 300) * 0.25
    return np.tanh((body + click) * 1.6)


def hat(open_: bool = False) -> np.ndarray:
    n = int((0.22 if open_ else 0.06) * SR)
    t = t_of(n)
    noise = highpass(rng.standard_normal(n), 7000, 4)
    return noise * np.exp(-t * (14 if open_ else 70))


def clap() -> np.ndarray:
    n = int(0.3 * SR)
    t = t_of(n)
    noise = bandpass(rng.standard_normal(n), 900, 4200)
    env = np.zeros(n)
    for k, offset in enumerate((0, 0.011, 0.022)):
        s = int(offset * SR)
        env[s:] += np.exp(-(t[: n - s]) * (55 if k < 2 else 16))
    return noise * env * 0.7


def noise_riser(seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    t = t_of(n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    # A band that climbs, in chunks, from 400 Hz to 9 kHz.
    chunks = 48
    for i in range(chunks):
        a, b = i * n // chunks, (i + 1) * n // chunks
        centre = 400 * (9000 / 400) ** (i / chunks)
        out[a:b] = bandpass(noise[max(0, a - 2000) : b], centre * 0.7, min(centre * 1.4, SR / 2 - 200))[-(b - a) :]
    tone = np.sin(2 * np.pi * np.cumsum(220 * (4 ** (t / seconds))) / SR) * 0.15
    return (out * 0.6 + tone) * (t / seconds) ** 2


def impact() -> np.ndarray:
    n = int(3.0 * SR)
    t = t_of(n)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 18)) / SR) * np.exp(-t * 2.2)
    air = lowpass(rng.standard_normal(n), 3500) * np.exp(-t * 2.6) * 0.35
    return np.tanh((boom + air) * 1.3)


# --------------------------------------------------------------------------
# Arrangement
# --------------------------------------------------------------------------


def compose() -> np.ndarray:
    music = np.zeros((2, N))
    pads = np.zeros((2, N))
    plucks = np.zeros((2, N))
    drums = np.zeros((2, N))
    kicks_at: list[float] = []

    for bar in range(30):
        start = bar * BAR
        part = section(bar)
        chord = chord_at(bar)

        # Pads: the chord an octave up, spread across the field.
        length = BAR + 0.6 if bar < 29 else 2.6
        for i, note in enumerate(chord):
            place(pads, pad_note(midi(note + 12), length), start, 0.17, pan=(i - 1) * 0.45)
        if part in ("B", "C", "outro"):
            place(pads, pad_note(midi(chord[0] + 24), length), start, 0.07, pan=0.0)

        # Bass: driving eighths on the root from groove A on; whole notes in the intro and outro.
        root = midi(chord[0] - 12)
        if part in ("A", "B", "C"):
            for e in range(8):
                place(music, bass_note(root, BEAT / 2 * 0.9), start + e * BEAT / 2, 0.15 if e % 2 else 0.12)
        elif part == "build":
            for q in range(4):
                place(music, bass_note(root, BEAT * 0.9), start + q * BEAT, 0.12)
        elif part == "outro" and bar < 29:
            place(music, bass_note(root, BAR * 0.95), start, 0.15)

        # Arpeggio: sixteenths through the chord tones, an octave up in groove C.
        tones = [chord[0], chord[1], chord[2], chord[0] + 12, chord[2], chord[1] + 12, chord[2] + 12, chord[1]]
        lift = 24 if part == "C" else 12
        if part in ("A", "B", "C", "build") or (part == "intro" and bar == 1):
            for s in range(16):
                if part == "build" and s % 2:
                    continue
                note = tones[s % len(tones)] + lift
                accent = 1.0 if s % 4 == 0 else 0.72
                place(plucks, pluck(midi(note), bright=2600 if part != "intro" else 1300), start + s * BEAT / 4, 0.13 * accent, pan=0.35 if s % 2 else -0.35)

        # Drums.
        if part in ("A", "B", "C"):
            for q in range(4):
                place(drums, kick(), start + q * BEAT, 0.34)
                kicks_at.append(start + q * BEAT)
                place(drums, hat(), start + q * BEAT + BEAT / 2, 0.2, pan=0.2)
            if part in ("B", "C"):
                for q in (1, 3):
                    place(drums, clap(), start + q * BEAT, 0.3, pan=-0.05)
                for s in range(16):
                    if s % 4 != 2:
                        place(drums, hat(), start + s * BEAT / 4, 0.08, pan=-0.25)
            if bar % 4 == 3:
                place(drums, hat(open_=True), start + 3.5 * BEAT, 0.12, pan=0.3)
        elif part == "build":
            for q in range(4 if bar == 25 else 8):
                step = BEAT if bar == 25 else BEAT / 2
                place(drums, kick(), start + q * step, 0.24 + 0.02 * q)
                kicks_at.append(start + q * step)

    # Bell melody over grooves B and C: a four-bar phrase, answered.
    phrase = [  # (beat within the phrase, MIDI note, beats held)
        (0, 72, 1.5), (1.5, 74, 0.5), (2, 76, 2), (4, 79, 1.5), (5.5, 77, 0.5), (6, 76, 2),
        (8, 74, 1.5), (9.5, 76, 0.5), (10, 77, 2), (12, 74, 1), (13, 72, 1), (14, 70, 2),
    ]
    for block in (12, 16, 20, 22):
        for beat, note, _ in phrase:
            at = block * BAR + beat * BEAT
            if at >= 25 * BAR:
                continue
            place(music, bell(midi(note)), at, 0.16, pan=0.15)
    # The outro answers with the phrase's opening, slower, over B♭ – C – F.
    for beat, note in ((0, 70), (2, 72), (4, 74), (6, 72), (8, 77)):
        place(music, bell(midi(note), 2.4), 27 * BAR + beat * BEAT, 0.18, pan=0.1)

    # Risers and the hit.
    place(music, noise_riser(1.9), 2 * BAR - 1.9, 0.20)
    place(music, noise_riser(4.0), 27 * BAR - 4.0, 0.26)
    place(music, impact(), 27 * BAR, 0.4)

    # Sidechain: pads and plucks breathe with the kick.
    duck = np.ones(N)
    for at in kicks_at:
        s = int(at * SR)
        n = int(0.32 * SR)
        e = min(N, s + n)
        curve = 1 - 0.55 * np.exp(-t_of(e - s) * 12)
        duck[s:e] = np.minimum(duck[s:e], curve)
    pads *= duck
    plucks *= duck

    # Intro: the pads open from a muffled swell.
    intro = int(2 * BAR * SR)
    for ch in range(2):
        head = pads[ch, :intro]
        swept = np.zeros_like(head)
        chunks = 32
        for i in range(chunks):
            a, b = i * intro // chunks, (i + 1) * intro // chunks
            cutoff = 350 * (4500 / 350) ** (i / chunks)
            swept[a:b] = lowpass(head[max(0, a - 4000) : b], cutoff)[-(b - a) :]
        pads[ch, :intro] = swept
    pads[:, : int(1.2 * SR)] *= np.linspace(0, 1, int(1.2 * SR))

    plucks = delay(plucks, 0.375, 0.42, 0.45)
    music += lowpass(pads, 5200) + plucks + drums
    music = reverb(music, 2.4, 0.2)

    # Master: clear the sub-rumble and any DC, glue, and land at -1 dBFS.
    music = np.vstack([highpass(ch, 30, 2) for ch in music])
    music = np.tanh(music * 1.15) / np.tanh(1.15)
    tail = int(1.6 * SR)
    music[:, -tail:] *= np.linspace(1, 0, tail) ** 1.5
    return music / np.max(np.abs(music)) * 10 ** (-1 / 20)


# --------------------------------------------------------------------------
# Sound effects
# --------------------------------------------------------------------------


def stereo(x: np.ndarray, width: float = 0.0) -> np.ndarray:
    return np.vstack([x * (1 - width), x * (1 + width)])


def sfx_click() -> np.ndarray:
    n = int(0.08 * SR)
    t = t_of(n)
    tick = bandpass(rng.standard_normal(n), 1800, 7000) * np.exp(-t * 450)
    body = np.sin(2 * np.pi * 1350 * t) * np.exp(-t * 90) * 0.5
    return stereo((tick + body) * 0.9)


def sfx_key(seed: int) -> np.ndarray:
    local = np.random.default_rng(seed)
    n = int(0.05 * SR)
    t = t_of(n)
    centre = 2600 + seed * 500
    tick = bandpass(local.standard_normal(n), centre * 0.6, centre * 1.6) * np.exp(-t * 320)
    thock = np.sin(2 * np.pi * (180 + seed * 25) * t) * np.exp(-t * 120) * 0.35
    return stereo((tick + thock) * 0.8)


def sfx_pop() -> np.ndarray:
    n = int(0.16 * SR)
    t = t_of(n)
    sweep = np.sin(2 * np.pi * np.cumsum(420 + 900 * (t / t[-1]) ** 0.6) / SR) * np.exp(-t * 32)
    return stereo(sweep * 0.8)


def sfx_whoosh() -> np.ndarray:
    n = int(0.7 * SR)
    t = t_of(n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 24
    for i in range(chunks):
        a, b = i * n // chunks, (i + 1) * n // chunks
        x = i / (chunks - 1)
        centre = 500 + 3500 * np.sin(np.pi * x)
        out[a:b] = bandpass(noise[max(0, a - 1500) : b], centre * 0.6, centre * 1.5)[-(b - a) :]
    env = np.sin(np.pi * t / t[-1]) ** 2
    left = out * env * np.linspace(1.2, 0.6, n)
    right = out * env * np.linspace(0.6, 1.2, n)
    return np.vstack([left, right]) * 0.7


def sfx_success() -> np.ndarray:
    n = int(1.1 * SR)
    out = np.zeros(n)
    for at, note in ((0.0, 84), (0.09, 91)):
        b = bell(midi(note), 1.0)
        s = int(at * SR)
        out[s : s + len(b)] += b[: n - s]
    return stereo(out * 0.6, 0.05)


def write(name: str, data: np.ndarray) -> None:
    from scipy.io import wavfile

    data = data / max(1.0, np.max(np.abs(data)))
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16).T
    wavfile.write(OUT / name, SR, pcm)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    write("music.wav", compose())
    write("click.wav", sfx_click())
    for i in (1, 2, 3):
        write(f"key-{i}.wav", sfx_key(i))
    write("pop.wav", sfx_pop())
    write("whoosh.wav", sfx_whoosh())
    write("success.wav", sfx_success())
    print("wrote", sorted(p.name for p in OUT.glob("*.wav")))
