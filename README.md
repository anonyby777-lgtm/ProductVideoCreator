# ProductVideoCreator

**[中文文档](README_zh.md)**

A standard Claude Code Skills toolkit for automated product introduction video generation. Creates professional videos with animated intros, screen recordings, synchronized voiceovers, and animated outros.

## Features

- **Storyboard-First Workflow** - Always get user confirmation before production
- **Automated Browser Recording** - Playwright-based screen capture with timeline tracking
- **Synchronized Voiceover** - edge-tts powered Chinese TTS with precise timing
- **Professional Composition** - Remotion-based video assembly with animations

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Video Composition | Remotion | React-based video rendering |
| Screen Recording | Playwright | Browser automation & capture |
| Text-to-Speech | edge-tts | Free Chinese voice synthesis |
| Audio Processing | FFmpeg | Audio merging & timing |

## Project Structure

```
ProductVideoCreator/
├── .claude/
│   └── skills/                 # Standard Claude Code skills
│       ├── product-video/      # Main workflow entry
│       │   └── SKILL.md
│       ├── storyboard/         # Storyboard design
│       │   └── SKILL.md
│       ├── recording/          # Browser recording
│       │   └── SKILL.md
│       ├── voiceover/          # Voice generation
│       │   └── SKILL.md
│       └── compositing/        # Video composition
│           └── SKILL.md
├── templates/                  # Reusable templates
│   ├── storyboard-template.json
│   ├── recording-script.js
│   ├── voiceover-script.py
│   └── FinalVideo.tsx
└── examples/
    └── ldap-manager/           # Real-world example
```

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| product-video | `/product-video` | Main entry point for video creation workflow |
| storyboard | `/storyboard` | Design storyboard and voiceover scripts |
| recording | `/recording` | Browser automation and screen recording |
| voiceover | `/voiceover` | Chinese TTS generation with timeline sync |
| compositing | `/compositing` | Remotion-based video composition |

## Key Lessons Learned

| Problem | Solution |
|---------|----------|
| Audio-video sync issues | Record timeline events, add offset to voiceover |
| Multiple reworks | **Must** confirm storyboard before recording |
| Multi-segment editing | Single continuous recording |
| Time calculation errors | `final_time = recording_time + intro_duration` |

## Workflow

```
Storyboard → User Confirmation → Recording → Voiceover → Composition → Review
```

## Installation

### 1. Clone this repository into your project

```bash
# Option A: Clone as submodule
git submodule add https://github.com/MatrixReligio/ProductVideoCreator.git

# Option B: Copy .claude/skills to your project
cp -r ProductVideoCreator/.claude/skills .claude/
```

### 2. Install dependencies

**Node.js Dependencies**

```bash
npm install remotion @remotion/cli @remotion/player @remotion/transitions playwright
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
# Start a video creation workflow
/product-video MyProduct

# Or ask Claude directly
"Create a product introduction video for my web application"
```

## Video Structure

| Section | Duration | Content |
|---------|----------|---------|
| Opening | 8-12s | Logo animation + product name + tagline |
| Features | 6-10s | Feature cards showcase |
| Demo | 60-120s | Screen recording demonstration |
| Closing | 8-12s | Logo + slogan + call-to-action |

## Example Output

The `examples/ldap-manager/` directory contains a complete real-world example:
- 2-minute product introduction video
- Full storyboard and timeline
- Recording script and voiceover script
- Final Remotion composition

## License

ISC
