# CENA FINAL — "O FESTIVAL DAS CORES" (Encerramento Interativo)
## A TURMINHA DA FLORESTA E O TREM DAS CORES — Shot-list & Seedance 2.5 Production Doc

> 💡 **Quer tudo em um só arquivo p/ colar na IA de vídeo?** Use `CENA_FINAL_MASTER_PROMPT.md`
> (prompts autossuficientes + bible + timeline + cue sheet em um único Markdown).

> **Pipeline:** cada shot é gerado no **Seedance 2.5** no modo **image-to-video**,
> usando o keyframe indicado como **reference frame** + o prompt abaixo.
> Depois, monta-se o corte num editor (CapCut / Premiere / Remotion) e sobrepõe-se
> **VO + SFX + BGM** conforme a *Audio Cue Sheet* (os clipes de voz já estão prontos em `audio/`).
> Render final: **16:9, master 4K (3840×2160), 30 fps**. Duração total: **≈ 46,5 s**.
> Personagens/estilo: seguir obrigatoriamente `../VISUAL_BIBLE.md`.

---

## TIMING CHART (resumo)

| Shot | In–Out (s) | Duração | Conteúdo | Ref |
|---|---|---|---|---|
| 01 | 00.0–04.0 | 4.0 | Grupo em frente ao trem, festival | `keyframes/01_group_front_train.jpg` |
| 02 | 04.0–08.5 | 4.5 | Símbolo VERMELHO + Tico aponta + pausa | `keyframes/02_red_tico.jpg` |
| 03 | 08.5–13.0 | 4.5 | Símbolo AZUL + Bibi aponta + pausa | `keyframes/03_blue_bibi.jpg` |
| 04 | 13.0–17.5 | 4.5 | Símbolo AMARELO + Nino aponta + pausa | `keyframes/04_yellow_nino.jpg` |
| 05 | 17.5–22.0 | 4.5 | Símbolo ROXO + Luma aponta + pausa | `keyframes/05_purple_luma.jpg` |
| 06 | 22.0–26.0 | 4.0 | Os quatro pulam e celebram; luzes do trem piscam | `keyframes/06_celebration_jump.jpg` |
| 07 | 26.0–31.0 | 5.0 | Bibi pergunta direto à câmera; pausa interativa | `keyframes/07_bibi_camera.jpg` |
| 08 | 31.0–34.5 | 3.5 | Nino responde "todas!"; risadas | `keyframes/01_group_front_train.jpg` |
| 09 | 34.5–39.5 | 5.0 | Acenam p/ câmera; trem apita PII! PII! | `keyframes/08_wave_goodbye.jpg` |
| 10 | 39.5–46.5 | 7.0 | Final cinematográfico: trem parte pela floresta | `keyframes/09_wide_ending.jpg` |

Regra de ouro pedagógica: após cada cor, **≥ 2,5 s de pausa visual** para a criança repetir a palavra.

---

## SHOTS — PROMPTS SEEDANCE 2.5

Use em todos os prompts o **style anchor** do Visual Bible. Gere cada shot sem áudio nativo
(mute) e use a cue sheet; ou deixe ambience nativo leve (sparkles/steam) e mantenha VO/SFX por cima.

### SHOT 01 — Grupo no festival (front-facing) · 0.0–4.0 · 4 s
**Câmera:** dolly-in lento, wide → medium, altura dos olhos.
**Prompt (Seedance 2.5, i2v, ref `01`):**
> Using the reference image, keep the exact same four characters, train and festival.
> The four friends stand smiling in front of the mint-teal smiling-face train: orange
> squirrel with red star bandana, white bunny with blue bow and dungarees, honey bear
> cub with yellow scarf, purple glowing firefly hovering. Gentle idle motion: blinking,
> tiny happy bounces, swaying pennant bunting, soft steam puffs from the train, lanterns
> glowing, magical golden particles drifting. Camera: slow smooth dolly-in, eye level.
> Warm sunset lighting, premium 3D CGI children's animation, 16:9, 4K, no text.

### SHOT 02 — VERMELHO · 4.0–8.5 · 4,5 s
**Câmera:** medium close-up, leve push-in; emblema vermelho + Tico em destaque.
**Ação:** emblema circular vermelho brilhante surge com burst de sparkles dourados (≈0,4 s);
Tico aponta com o braço esticado; amigos olham encantados; **segurar 2,5 s de pausa**.
**Prompt:**
> Using the reference image, same characters and style. A huge glowing RED circular
> emblem pops into the air with a burst of golden-white star sparkles and soft bloom;
> the orange squirrel with red star bandana stretches his arm pointing at it, mouth open
> excitedly; the white bunny, honey bear cub and purple firefly look up delighted.
> Sparkles shimmer and settle, then a calm visual hold so a child can repeat the color.
> Camera: gentle push-in. Warm sunset light, premium 3D CGI children's animation,
> 16:9, 4K, no text.

### SHOT 03 — AZUL · 8.5–13.0 · 4,5 s
Igual ao 02, com: emblema **BLUE**, **Bibi (white bunny, blue bow & dungarees) aponta com as duas patinhas**. Ref `03`.
**Prompt:** trocar "RED/orange squirrel points" por "BLUE circular emblem … the white bunny
with blue polka-dot bow points up with both paws". Mesma estrutura de sparkles + pausa.

### SHOT 04 — AMARELO · 13.0–17.5 · 4,5 s
Emblema **YELLOW**; **Nino (honey bear cub, yellow scarf) aponta com uma pata, cabeça inclinada**. Ref `04`. Mesma estrutura.

### SHOT 05 — ROXO · 17.5–22.0 · 4,5 s
Emblema **PURPLE**; **Luma (purple firefly) flutua e aponta**, brilho roxo combinando com o emblema; **exatamente UMA vaga-lume**. Ref `05`. Mesma estrutura.

### SHOT 06 — Celebração · 22.0–26.0 · 4 s
**Câmera:** medium group, ângulo levemente baixo, acompanha o pulo.
**Ação:** os quatro pulam juntos com confete; **as lâmpadas do trem piscam suavemente 2×**.
**Prompt:**
> Using the reference image, same characters and style. All four friends jump together
> in mid-air cheering — squirrel, bunny, bear cub and the single purple firefly highest —
> colorful confetti and star sparkles flying; behind them the mint-teal train's warm round
> lamps gently flash twice. Joyful bouncy motion, camera slight low angle with small hop.
> Warm sunset light, premium 3D CGI children's animation, 16:9, 4K, no text.

### SHOT 07 — Bibi pergunta à câmera · 26.0–31.0 · 5 s
**Câmera:** close-up Bibi, eye-level, push-in muito lento; amigos desfocados também olhando à lente.
**Ação:** Bibi fala para a câmera gesticulando; **28.8–31.0 = PAUSA DE INTERAÇÃO**
(personagens imóveis olhando à lente, só sparkles e piscar de olhos).
**Prompt:**
> Using the reference image, same characters and style. The white bunny with blue bow
> stands front and center looking straight into the camera lens, mouth moving as if
> asking the viewer a sweet question, one paw gesturing toward the lens; behind her the
> squirrel, bear cub and purple firefly also look into the camera with gentle smiles.
> Then a calm held beat — characters quietly watching the viewer, only soft blinking and
> floating sparkles — creating strong interaction with the child. Camera: very slow
> push-in. Warm sunset bokeh, premium 3D CGI children's animation, 16:9, 4K, no text.

### SHOT 08 — Nino responde · 31.0–34.5 · 3,5 s
**Câmera:** medium grupo, eye-level. **Ação:** todos olham à câmera; Nino sorri e responde;
grupo ri (quiques engraçados, barriga do Nino balança).
**Prompt:**
> Using the reference image (group facing camera), same characters and style. The four
> friends look straight into the camera; the chubby honey bear cub with yellow scarf
> grins and answers proudly, then all four laugh together with playful bounces, the
> purple firefly spinning happily. Warm, funny, affectionate. Camera: static medium
> group shot, eye level. Premium 3D CGI children's animation, 16:9, 4K, no text.

### SHOT 09 — Tchau + apito · 34.5–39.5 · 5 s
**Câmera:** medium-wide frontal, leve sway. **Ação:** os quatro acenam direto à câmera com
sorrisos enormes; lâmpadas do trem brilham; **apito PII! PII! sincronizado**.
**Prompt:**
> Using the reference image, same characters and style. All four friends stand in a row
> on the wooden platform waving goodbye directly at the camera with big warm smiles —
> squirrel waving one paw, bunny waving both paws, bear cub waving, single purple
> firefly hovering with sparkle trail; behind them the smiling mint-teal train's lamps
> glow and pulse warmly, a soft steam puff with each whistle beat. Camera: medium-wide,
> gentle friendly sway. Warm sunset light, premium 3D CGI children's animation,
> 16:9, 4K, no text.

### SHOT 10 — Final cinematográfico · 39.5–46.5 · 7 s
**Câmera:** wide, crane-up + pull-back lento. **Ação:** trem se afasta devagar pela curva dos
trilhos rumo ao pôr do sol; os quatro acenam da plataforma (vistos de costas); partículas
douradas; **fade-out quente no fim**.
**Prompt:**
> Using the reference image, same characters and style. Wide cinematic shot from behind
> the four friends on the wooden platform as they wave goodbye; the small mint-teal
> smiling-face train slowly rolls away along the curving tracks into the magical
> colorful forest toward the glowing golden-peach sunset, soft steam puffs, warm lamp
> glow, colorful carriages (red, blue, yellow, purple). Abundant golden sparkle
> particles, long soft shadows; camera slowly cranes up and pulls back; the last second
> gently fades into warm light. Emotional, cozy, happy ending. Premium 3D CGI
> children's animation, 16:9, 4K, no text.

---

## AUDIO CUE SHEET (montagem final)

| TC (s) | Arquivo | Conteúdo |
|---|---|---|
| 00.0 | *(BGM)* | música alegre e delicada entra suave (ukulele/glockenspiel) |
| 00.5 | `audio/01_luma_vamos_lembrar.mp3` | LUMA: "Vamos lembrar?" |
| 04.1 | `audio/sfx_sparkle_chime.mp3` | chime mágico (aparece o vermelho) |
| 04.8 | `audio/02_tico_vermelho.mp3` | TICO: "Vermelho!" |
| 05.6–08.5 | — | **pausa p/ criança repetir** |
| 08.6 | `audio/sfx_sparkle_chime.mp3` | chime (azul) |
| 09.3 | `audio/03_bibi_azul.mp3` | BIBI: "Azul!" |
| 10.1–13.0 | — | pausa |
| 13.1 | `audio/sfx_sparkle_chime.mp3` | chime (amarelo) |
| 13.8 | `audio/04_nino_amarelo.mp3` | NINO: "Amarelo!" |
| 14.6–17.5 | — | pausa |
| 17.6 | `audio/sfx_sparkle_chime.mp3` | chime (roxo) |
| 18.3 | `audio/05_luma_roxo.mp3` | LUMA: "Roxo!" |
| 19.1–22.0 | — | pausa |
| 22.3 | `audio/mixed/08_todos_muito_bem.mp3` | TODOS: "Muito bem!" (coro das 4 vozes) |
| 26.5 | `audio/06_bibi_cor_favorita.mp3` | BIBI: "Qual foi a sua cor favorita?" |
| 29.0 | `audio/sfx_sparkle_chime.mp3` (−6 dB) | shimmer suave na pausa interativa |
| 28.8–31.0 | — | **pausa de interação com a criança** |
| 31.3 | `audio/07_nino_todas.mp3` | NINO: "A minha foi… todas!" |
| 32.5 | *(risadas)* | risadinhas do grupo (nativo Seedance ou SFX de riso infantil) |
| 34.9 | `audio/mixed/09_todos_tchau.mp3` | TODOS: "Tchauuuu!" (coro das 4 vozes) |
| 36.6 | `audio/sfx_whistle_pii_pii.mp3` | TREM: "PII! PII!" |
| 39.5–45.5 | *(BGM)* | música cresce p/ acorde final quente |
| 45.5–46.5 | — | fade-out de áudio e vídeo |

Vozes isoladas p/ remix ficam em `audio/raw/` (coro "Muito bem!" e "Tchauuuu!" por personagem).

### PRODUCTION STATUS (2026-08-17)

| Asset | Status |
|---|---|
| Visual Bible | ✅ pronto (`../VISUAL_BIBLE.md`) |
| 10 keyframes 16:9 | ✅ prontos, consistentes e sem texto |
| 7 falas solo (Tico/Bibi/Nino/Luma) | ✅ prontas |
| Coro "Muito bem!" | ✅ mix 4 vozes (Tico+Bibi+Nino+Luma, stagger 0/70/140/210 ms) |
| Coro "Tchauuuu!" | ✅ mix 4 vozes (Tico+Bibi+Nino+Luma, stagger 0/70/140/210 ms) |
| SFX apito PII! PII! / chime de sparkles | ✅ sintetizados |
| Shot-list Seedance 2.5 + storyboard.json | ✅ prontos |

Todos os assets de áudio e imagem prontos (2026-08-17). Remix dos coros já aplicado:
`adelay 0/70/140/210 ms + amix normalize=0 + volume 3.0 + alimiter` → `mixed/08_…` e `mixed/09_…`

---

## CHECKLIST DE CONSISTÊNCIA POR SHOT (antes de aprovar o render)

- [ ] Tico = esquilo laranja + bandana vermelha de estrelas (NUNCA sem)
- [ ] Bibi = coelha branca + laço azul de bolinhas + jardineira azul
- [ ] Nino = ursinho mel + cachecol amarelo listrado
- [ ] Luma = vaga-lume roxo brilhante, **exatamente uma**, trilha de sparkles
- [ ] Trem = verde-menta sorridente, 4 vagões vermelho→azul→amarelo→roxo, **sem texto**
- [ ] Luz de pôr do sol + partículas mágicas presentes
- [ ] 16:9, sem texto/watermark na tela
