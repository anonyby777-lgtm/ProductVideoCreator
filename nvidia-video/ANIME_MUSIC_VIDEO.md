# Anime Music Video — editable Remotion composition

`AnimeMusicVideo` is a 1920×1080 / 30 fps, 12-scene anime music-video scaffold. It is deliberately **asset- and lyric-neutral**: no unlicensed audio, lyrics, or generated visual material has been bundled.

## Quick start

```bash
cd nvidia-video
npm install
npm run studio:anime
# Select AnimeMusicVideo in Remotion Studio
npm run render:anime
```

## Edit in this order

1. The supplied audio is connected at `public/anime-clip/audio/Young Girl A (Tradução + Letra_Legenda) - Gabii (youtube).mp3` and `HAS_MUSIC_ASSET` is enabled in `src/anime-clip/AnimeMusicVideo.tsx`.
2. Generate one 16:9 visual per scene using the exact `CHARACTER_BIBLE`, scene prompt, and `NEGATIVE_PROMPT` in `src/anime-clip/storyboard.ts`. Put it at the scene's `asset` path.
3. Set that scene's `hasVisualAsset: true`. For motion clips use an `.mp4` path and `assetKind: "video"`.
4. Replace every entry in `LYRICS` with the authorized original lyric, Portuguese translation, and precise timestamps. Adjust each scene's `duration`; update `VIDEO_DURATION_SECONDS` and the config duration together if the song is not 240 seconds.

The scene folders contain `.gitkeep` files so the expected asset layout is visible. The composition uses an elegant separate subtitle overlay — images must never contain text.

## Continuity

The protagonist is **Ren**. Copy `CHARACTER_BIBLE` verbatim into every visual-generation prompt. The storyboard holds all twelve narrative beats, camera language, emotion, transition, and reserved lower-screen subtitle area. It is written as a safe initial interpretation until the actual licensed lyric/timecode is supplied.
