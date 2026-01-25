# ProductVideoCreator

**[中文文档](README_zh.md)**

A standard Claude Code Skills toolkit for automated product video generation. Supports multiple video types: screen recording demos, image-based slideshows, and hybrid productions.

## Features

- **Multiple Video Types** - Demo (screen recording), Slideshow (image-based), Mixed (hybrid)
- **Storyboard-First Workflow** - Always get user confirmation before production
- **Voice Selection** - 5 Chinese voice options for different content styles
- **Voiceover Validation** - Automatic detection of duration/overlap/gap issues
- **Advanced Animations** - Spring physics, glow effects, particle systems
- **Professional Composition** - Remotion-based video assembly

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Video Composition | Remotion | React-based video rendering |
| Screen Recording | Playwright | Browser automation & capture |
| Text-to-Speech | edge-tts | Free Chinese voice synthesis (5 voices) |
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
│       ├── voiceover/          # Voice generation + validation
│       ├── compositing/        # Video composition + animations
│       └── asset-collection/   # Image/logo collection
├── templates/                  # Reusable templates
└── nvidia-video/               # Demo: NVIDIA history video
    ├── src/                    # V1 & V2 video components
    ├── public/images/          # Collected assets
    └── COMPARISON_REPORT.md    # V1 vs V2 analysis
```

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| product-video | `/product-video` | Main entry - supports demo/slideshow/mixed types |
| storyboard | `/storyboard` | Design storyboard and voiceover scripts |
| recording | `/recording` | Browser automation and screen recording |
| voiceover | `/voiceover` | TTS generation with validation mechanism |
| compositing | `/compositing` | Video composition with advanced animations |
| asset-collection | `/asset-collection` | Collect images from royalty-free sources |

## Video Types

| Type | Use Case | Core Assets |
|------|----------|-------------|
| **Demo** | Software tutorials, feature demos | Playwright screen recording |
| **Slideshow** | Company intro, product history | Images + text animations |
| **Mixed** | Product promos | Recording + images + animations |

## Voice Options

| Voice ID | Gender | Style | Best For |
|----------|--------|-------|----------|
| XiaoxiaoNeural | Female | Warm, friendly | Tutorials, product intros |
| YunxiNeural | Male | Professional | Enterprise content |
| **YunjianNeural** | Male | Energetic | Tech content, launches |
| XiaoyiNeural | Female | Youthful | Creative content |
| YunyangNeural | Male | News anchor | Formal announcements |

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
- **30% improvement** through skills optimization

See `nvidia-video/COMPARISON_REPORT.md` for detailed analysis.

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
