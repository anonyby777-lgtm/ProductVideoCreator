import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { LYRICS, MUSIC_FILE, SCENES } from "./storyboard";
import type { AnimeScene } from "./types";

const { fontFamily: cinzel } = loadCinzel("normal", { weights: ["700"] });
const { fontFamily: bebas } = loadBebasNeue("normal", { weights: ["400"] });

// Turn this on after placing your licensed audio at public/anime-clip/audio/song.mp3.
const HAS_MUSIC_ASSET = false;

const Placeholder: React.FC<{ scene: AnimeScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = Math.sin(frame / 40) * 14;
  return <AbsoluteFill style={{ background: "radial-gradient(circle at 65% 22%, #284d76 0%, #101a2b 38%, #05070e 100%)", overflow: "hidden" }}>
    <div style={{ position:"absolute", inset:0, opacity:.55, background:"linear-gradient(120deg, transparent 5%, rgba(115,190,255,.17) 46%, transparent 70%)", transform:`translateX(${drift}px)` }} />
    <div style={{ position:"absolute", left:"8%", right:"8%", top:"16%", color:"rgba(255,255,255,.9)", fontFamily:cinzel, letterSpacing:5, fontSize:Math.min(width*.035,54), textAlign:"center" }}>ASSET PLACEHOLDER · SCENE {scene.id}</div>
    <div style={{ position:"absolute", left:"18%", right:"18%", top:"34%", color:"#dbeeff", fontFamily:"sans-serif", fontSize:Math.min(width*.019,28), lineHeight:1.5, textAlign:"center" }}>{scene.visual}</div>
    <div style={{ position:"absolute", left:"12%", right:"12%", bottom:height*.29, color:"rgba(174,212,245,.75)", fontFamily:"sans-serif", fontSize:Math.min(width*.012,18), lineHeight:1.45, textAlign:"center" }}>Adicione um visual em public/{scene.asset} e altere hasVisualAsset para true em src/anime-clip/storyboard.ts</div>
  </AbsoluteFill>;
};

const SceneVisual: React.FC<{ scene: AnimeScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const localDuration = Math.min(durationInFrames, scene.duration * 30);
  const scale = interpolate(frame, [0, localDuration], [1, 1.055], { extrapolateRight:"clamp" });
  if (!scene.hasVisualAsset) return <Placeholder scene={scene} />;
  // Images receive a Ken Burns move. For AI video clips, set assetKind: "video".
  if (scene.assetKind === "video") {
    return <OffthreadVideo src={staticFile(scene.asset)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />;
  }
  return <Img src={staticFile(scene.asset)} style={{ width:"100%", height:"100%", objectFit:"cover", transform:`scale(${scale})` }} />;
};

const Lyrics: React.FC = () => {
  const frame = useCurrentFrame(); const time = frame / 30;
  const line = LYRICS.find((item) => time >= item.start && time < item.end);
  if (!line) return null;
  const opacity = interpolate(time, [line.start, line.start + .25, line.end - .25, line.end], [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  return <div style={{ position:"absolute", bottom:54, left:"8%", right:"8%", zIndex:10, opacity, textAlign:"center", textShadow:"0 3px 9px rgba(0,0,0,.92)" }}>
    <div style={{ color:"white", fontFamily:cinzel, fontWeight:700, fontSize:42, letterSpacing:1.2, lineHeight:1.2, textTransform:"uppercase", filter:"drop-shadow(0 0 5px rgba(255,255,255,.14))" }}>{line.original}</div>
    {line.portuguese && <div style={{ color:"#f5e8bf", fontFamily: bebas, fontSize:31, letterSpacing:1.4, lineHeight:1.15, marginTop:7, textTransform:"uppercase" }}>{line.portuguese}</div>}
  </div>;
};

const Scene: React.FC<{ scene: AnimeScene; fadeIn: boolean }> = ({ scene, fadeIn }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <SceneVisual scene={scene} />
    {fadeIn && <AbsoluteFill style={{ background:"black", opacity:interpolate(frame, [0, 8], [.75, 0], { extrapolateRight:"clamp" }), pointerEvents:"none" }} />}
  </AbsoluteFill>;
};

export const AnimeMusicVideo: React.FC = () => <AbsoluteFill style={{ backgroundColor:"black" }}>
  {HAS_MUSIC_ASSET && <Audio src={staticFile(MUSIC_FILE)} volume={1} />}
  {SCENES.map((scene, index) => <Sequence key={scene.id} from={scene.start * 30} durationInFrames={scene.duration * 30}><Scene scene={scene} fadeIn={index > 0} /></Sequence>)}
  <Lyrics />
</AbsoluteFill>;

export const animeMusicVideoConfig = { id:"AnimeMusicVideo", component:AnimeMusicVideo, durationInFrames:180 * 30, fps:30, width:1920, height:1080 };
