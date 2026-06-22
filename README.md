# ProductVideoCreator

**[中文文档](README_zh.md)**

A standard Skills toolkit for automated product video generation. Supports multiple video types: screen recording demos, image-based slideshows, and hybrid productions.

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
│   ├── config/                 # Configuration templates
│   │   ├── scenes.ts           # Scene timing config
│   │   ├── theme.ts            # Brand colors & styles
│   │   ├── types.ts            # TypeScript definitions
│   │   └── videoPresets.ts     # Multi-size presets (720p-4K)
│   └── components/             # Component templates
│       ├── SubtitleDisplay.tsx # Subtitle with fade animations
│       ├── AnimatedText.tsx    # FadeIn, BigText, Typewriter
│       ├── BackgroundEffects.tsx # Particles, CodeRain, Neural
│       ├── BrandElements.tsx   # Logo, DataCard, Slogan
│       └── useResponsive.ts    # Responsive layout hook
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
| 4k | 3840×2160 | 16:9 | High-end displays, 4K monitors |
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
- **V3**: Full-featured with subtitles, BGM, scene-aware volume, multi-size templates (score: 9.4/10)
- **42% improvement** (V1→V3) through skills optimization
- **Multi-size support**: Verified working with 720p, 1080p, vertical, square, and 4K outputs

See `nvidia-video/V3_COMPARISON_REPORT.md` for detailed analysis.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | >= 18.0.0 | Required for Remotion |
| Python | >= 3.8 | Required for edge-tts |
| FFmpeg | >= 4.0 | Required for audio processing |
| Git | >= 2.0 | Required for version control |

**Operating System**: macOS or Linux (Windows with WSL)

### Quick Check

```bash
# Verify all dependencies
node --version    # Should be >= 18.0.0
python3 --version # Should be >= 3.8
ffmpeg -version   # Should be >= 4.0
```

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

## Troubleshooting

### Video renders but has no audio

```bash
# Check FFmpeg installation
ffmpeg -version

# Verify audio files exist
ls -la nvidia-video/public/audio/
```

### Chinese characters don't display correctly

```bash
# Install font package
npm install @remotion/google-fonts

# Verify font loading in your component
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
const { fontFamily } = loadFont();
```

### Remotion browser download timeout

```bash
# Use cached browser if available
npx remotion render src/index.ts MyVideo out/video.mp4 \
  --browser-executable="$HOME/.cache/remotion/chrome-headless-shell-mac-arm64/chrome-headless-shell"
```

### edge-tts voice generation fails

```bash
# Reinstall edge-tts
pip install --upgrade edge-tts

# Test voice generation
edge-tts --text "Hello" --voice en-US-GuyNeural --write-media test.mp3
```

### Voiceover validation errors

| Error | Solution |
|-------|----------|
| Duration exceeds target | Shorten script or increase scene duration |
| Segments overlap | Adjust start/end times in storyboard |
| Gap too large (>3s) | Add transition text or adjust timing |

## License

ISC
