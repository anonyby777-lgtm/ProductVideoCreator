# A TURMINHA DA FLORESTA E O TREM DAS CORES
## CHARACTER CONSISTENCY / VISUAL BIBLE — v1.0

> Lock file. Every image, keyframe and video prompt for this series MUST reuse the exact
> descriptions, colors and style anchors below. Do not redesign characters between shots.

---

## 1. GLOBAL RENDER STYLE

- **Medium:** premium 3D CGI children's animation, preschool feature-film quality
  (Pixar / DreamWorks junior look), NOT flat cartoon, NOT anime, NOT realistic.
- **Aspect ratio:** 16:9. Master resolution 4K (3840×2160), renders 1080p minimum.
- **Shapes:** round, chubby, soft silhouettes; chibi proportions (head ≈ 45% of body);
  big glossy expressive eyes; tiny rounded noses; simple 4-finger hands or mitten paws.
- **Materials:** soft matte fur with subtle subsurface glow, slightly plush-toy feel;
  rounded, toy-like hard surfaces for the train.
- **Lighting (series default):** warm golden-hour / sunset key light, peach-to-lilac sky,
  gentle rim light on fur, soft shadows, floating magical dust/sparkle particles.
- **Sparkle FX:** golden-white star sparkles + tiny colored glints; soft bloom, never harsh.
- **Camera default:** eye-level of the characters, clean center-weighted composition,
  shallow-but-gentle depth of field, background readable at all times.

### Style anchor (append to EVERY prompt)
```
premium 3D CGI children's animation, preschool movie quality, soft rounded chibi
characters with big glossy eyes, plush-like soft fur, warm sunset lighting, magical
floating particles, clean composition, 16:9, 4K, no text, no watermark, no logos
```

### Negative guidance (avoid)
`realistic animals, scary, dark, horror, text, words, letters, watermark, logo, extra limbs, deformed faces, adult proportions, flat 2D, anime style, duplicate characters, English signage, nameplates`

---

## 2. SIGNATURE COLOR PALETTE (locked)

| Element | Color | Hex |
|---|---|---|
| Vermelho (Tico's color) | vivid warm red | `#E63946` |
| Azul (Bibi's color) | bright sky blue | `#3A86FF` |
| Amarelo (Nino's color) | sunny yellow | `#FFD166` |
| Roxo (Luma's color) | magical purple | `#8338EC` |
| Forest greens | teal-green canopy | `#2A9D8F` / `#74C69D` |
| Sunset sky | peach → gold → lilac gradient | `#FFB47B → #FFD97D → #C8A7E9` |
| Train body | mint-teal + cream | `#57CC99` / `#FFF3D6` |

---

## 3. THE FOUR CHARACTERS (exact, do not alter)

### 🐿️ TICO — the red squirrel (boy, ~5 y.o.)
- Rust-orange plush fur (`#D96C3D`), cream belly and muzzle, huge fluffy tail with cream tip.
- Big emerald-green glossy eyes; small triangular nose; two little front teeth visible when smiling.
- **Wardrobe:** red bandana with tiny white stars around his neck (`#E63946`).
- Personality: brave, curious, energetic leader; always the first to point and jump.
- Signature pose: one arm stretched out pointing, tail raised.

### 🐰 BIBI — the white bunny (girl, ~5 y.o.)
- Soft snow-white plush fur, pale-peach inner ears, long soft floppy ears;
  blue polka-dot bow on top of the head.
- Big sky-blue glossy eyes (`#3A86FF`), pink nose, rosy cheeks.
- **Wardrobe:** blue polka-dot bow on one ear + sky-blue dungarees (`#3A86FF`).
- Personality: sweet, chatty, musical; loves singing color words.
- Signature pose: ears perked up, paws clasped or pointing with both hands.

### 🐻 NINO — the honey bear cub (boy, ~4 y.o.)
- Golden-honey plush fur (`#E8A94A`), round tummy, tiny round ears, amber glossy eyes.
- Slightly smaller and chubbier than the others; always a goofy warm smile.
- **Wardrobe:** yellow scarf with white stripes (`#FFD166`).
- Personality: funny, lovable, clumsy; the comic relief who presses the wrong button.
- Signature pose: head tilted, one paw raised, belly forward.

### 🧚 LUMA — the purple firefly (girl, ~5 y.o.)
- Stylized toddler-sized firefly (floats at the group's head height, same scale as friends).
- Lavender-violet body (`#B388EB`), soft purple glow on her abdomen (`#8338EC`),
  two translucent iridescent wings, big violet glossy eyes, tiny antennae with glowing tips.
- Personality: gentle, wise, magical; her glow makes sparkles appear.
- Signature pose: hovering, wings spread, leaving a faint golden sparkle trail.

### Group lineup rule
Left → right stage order in group shots: **Tico — Bibi — Nino — Luma (hovering)**.
All four always appear together unless a script line says otherwise.

---

## 4. THE TRAIN — "O TREM DAS CORES" (exact)

- Small, round, toy-like steam locomotive with a **friendly smiling face on the front**
  (big oval eyes on the smokebox, gentle smile on the bumper).
- Mint-teal boiler (`#57CC99`) with cream trim (`#FFF3D6`), red funnel and red wheels
  with cream polka-dot hubs, brass bell, rounded puffs of cotton-white steam.
- **Four little carriages, one per signature color, in fixed order:**
  red → blue → yellow → purple. Each carriage carries a glowing circular color plate.
- Lights: warm round lamps that blink softly (slow gentle pulse, never strobe).
- Whistle: two cute cheerful high-pitched "PII! PII!" notes.
- **No text anywhere on the train** — boiler sides stay blank (no nameplates, no letters).

---

## 5. THE FOREST FESTIVAL LOCATION (exact)

- Magical forest clearing turned festival plaza: giant soft mushrooms, lantern-flowers,
  pennant bunting and round paper lanterns strung between big round trees.
- Wooden festival platform/station with a small candy-striped awning and a sign post.
- Balloons and confetti in the four signature colors; fireflies and golden particles.
- Time of day: sunset — peach/gold/lilac sky, warm rim light, long soft shadows.

---

## 6. AUDIO IDENTITY

- Voices: Brazilian Portuguese, warm childlike voices (see `audio/` — Tico, Bibi,
  Nino, Luma each have a locked registered voice).
- Train whistle: two short cheerful high notes ("PII! PII!").
- Color reveal SFX: soft magical chime + sparkle shimmer per color.
- Music: gentle cheerful orchestral (ukulele, glockenspiel, soft strings), rising
  finale, warm emotional ending chord.

---

## 7. CONSISTENCY CHECKLIST (verify before every render)

- [ ] Tico = orange squirrel + RED bandana, pointing arm
- [ ] Bibi = white bunny + BLUE bow & dungarees
- [ ] Nino = honey bear cub + YELLOW scarf
- [ ] Luma = purple glowing firefly, hovering, sparkle trail
- [ ] Train = mint-teal, smiling face, 4 colored carriages (red→blue→yellow→purple)
- [ ] Sunset warm lighting + magical particles present
- [ ] 16:9 clean composition, no on-screen text unless scripted
- [ ] Style anchor block appended to the prompt
