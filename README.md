# ProductVideoCreator

**[中文文档](README_zh.md)**

A standard Claude Code Skills toolkit for automated product video generation. Supports multiple video types: screen recording demos, image-based slideshows, and hybrid productions.

## Features

- **Multiple Video Types** - Demo (screen recording), Slideshow (image-based), Mixed (hybrid)
- **Storyboard-First Workflow** - Always get user confirmation before production
- **Multi-language Voiceover** - Chinese (5 voices) and English (6 voices) with automatic speech rate
- **Background Music** - Royalty-free BGM with scene-aware dynamic volume and fade effects
- **Automatic Subtitles** - Parse voiceover scripts and generate synchronized subtitles
- **Multi-size Templates** - 1080p, 720p, vertical (9:16), square (1:1) formats
- **Voiceover Validation** - Automatic detection of duration/overlap/gap issues
- **Advanced Animations** - Spring physics, glow effects, particle systems
- **Professional Composition** - Remotion-based video assembly

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Video Composition | Remotion | React-based video rendering |
| Screen Recording | Playwright | Browser automation & capture |
| Text-to-Speech | edge-tts | Multi-language voice synthesis (11 voices) |
| Audio Processing | FFmpeg | Audio merging, timing & normalization |
| Font Rendering | @remotion/google-fonts | Consistent Chinese font display |

## Project Structure

```
ProductVideoCreator/
├── .claude/
│   └── skills/                 # Standard Claude Code skills
│       ├── product-video/      # Main workflow entry
│       ├── storyboard/         # Storyboard design
│       ├── recording/          # Browser recording
│       ├── voiceover/          # Multi-language voice generation
│       ├── bgm/                # Background music
│       ├── subtitles/          # Automatic subtitle generation
│       ├── compositing/        # Video composition + multi-size
│       └── asset-collection/   # Image/logo collection
├── templates/                  # Reusable templates
└── nvidia-video/               # Demo: NVIDIA history video
    ├── src/                    # V1, V2, V3 video components
    ├── public/images/          # Collected assets
    └── V3_COMPARISON_REPORT.md # V1 vs V2 vs V3 analysis
```

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| product-video | `/product-video` | Main entry - supports demo/slideshow/mixed types |
| storyboard | `/storyboard` | Design storyboard and voiceover scripts |
| recording | `/recording` | Browser automation and screen recording |
| voiceover | `/voiceover` | Multi-language TTS (zh/en) with validation |
| bgm | `/bgm` | Background music with scene-aware volume control |
| subtitles | `/subtitles` | Automatic subtitle generation |
| compositing | `/compositing` | Video composition with multi-size templates |
| asset-collection | `/asset-collection` | Collect images from royalty-free sources |

## Video Types

| Type | Use Case | Core Assets |
|------|----------|-------------|
| **Demo** | Software tutorials, feature demos | Playwright screen recording |
| **Slideshow** | Company intro, product history | Images + text animations |
| **Mixed** | Product promos | Recording + images + animations |

## Voice Options

### Chinese Voices (zh-CN)

| Voice ID | Gender | Style | Best For |
|----------|--------|-------|----------|
| XiaoxiaoNeural | Female | Warm, friendly | Tutorials, product intros |
| YunxiNeural | Male | Professional | Enterprise content |
| **YunjianNeural** | Male | Energetic | Tech content, launches |
| XiaoyiNeural | Female | Youthful | Creative content |
| YunyangNeural | Male | News anchor | Formal announcements |

### English Voices (en-US)

| Voice ID | Gender | Style | Best For |
|----------|--------|-------|----------|
| GuyNeural | Male | Professional | Enterprise, product intros |
| JennyNeural | Female | Warm, friendly | Tutorials, customer service |
| **JasonNeural** | Male | Energetic | Tech launches, inspiring |
| AriaNeural | Female | Clear, professional | News, formal |
| DavisNeural | Male | Youthful | Tech content, creative |
| SaraNeural | Female | Youthful | Social media, casual |

## Video Size Templates

| Size | Resolution | Ratio | Platform |
|------|------------|-------|----------|
| 1080p | 1920×1080 | 16:9 | YouTube, Website |
| 720p | 1280×720 | 16:9 | Preview, Low bandwidth |
| vertical | 1080×1920 | 9:16 | TikTok, Reels, Shorts |
| square | 1080×1080 | 1:1 | Instagram, WeChat |

## Voiceover Validation

The toolkit automatically validates voiceover timing:

- Duration check: Actual ≤ Target + 0.5s
- Overlap detection: No segment overlap
- Gap detection: Warns if gap > 3s
- Boundary check: Total ≤ Video duration

## Demo Project

The `nvidia-video/` directory contains a complete NVIDIA company history video demo:

- **V1**: Basic implementation (score: 6.6/10)
- **V2**: Optimized with YunjianNeural voice, particles, glow effects (score: 8.6/10)
- **V3**: Full-featured with subtitles, BGM, enhanced animations (score: 9.1/10)
- **38% improvement** (V1→V3) through skills optimization

See `nvidia-video/V3_COMPARISON_REPORT.md` for detailed analysis.

## Installation

### 1. Clone this repository

```bash
# Option A: Clone as submodule
git submodule add https://github.com/MatrixReligio/ProductVideoCreator.git

# Option B: Copy .claude/skills to your project
cp -r ProductVideoCreator/.claude/skills .claude/
```

### 2. Install dependencies

**Node.js Dependencies**

```bash
npm install remotion @remotion/cli @remotion/player @remotion/google-fonts playwright
```

**Python Dependencies**

```bash
python -m venv venv
source venv/bin/activate
pip install edge-tts
```

**System Dependencies**

```bash
# macOS
brew install ffmpeg
npx playwright install chromium
```

## Usage

Once the skills are in your project's `.claude/skills/` directory, Claude Code will automatically discover them.

```bash
# Create a demo video (screen recording)
/product-video MyApp demo

# Create a slideshow video (image-based)
/product-video "Company History" slideshow

# Or ask Claude directly
"Create a product introduction video for my web application"
```

## Workflow

```
┌─────────────────────────────────────────────────────┐
│ Phase 1: Storyboard Design                          │
│ └── User confirmation required before proceeding    │
├─────────────────────────────────────────────────────┤
│ Phase 2: Asset Preparation                          │
│ ├── [demo] Playwright screen recording              │
│ ├── [slideshow] Image collection                    │
│ └── [mixed] Both recording + images                 │
├─────────────────────────────────────────────────────┤
│ Phase 3: Voiceover Generation                       │
│ ├── TTS with voice selection                        │
│ └── Automatic validation                            │
├─────────────────────────────────────────────────────┤
│ Phase 4: Video Composition                          │
│ ├── Remotion rendering with animations              │
│ └── Audio normalization                             │
├─────────────────────────────────────────────────────┤
│ Phase 5: Review & Delivery                          │
└─────────────────────────────────────────────────────┘
```

## License

ISC
