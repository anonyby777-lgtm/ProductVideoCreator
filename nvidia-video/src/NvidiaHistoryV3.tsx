import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import { SCENES, FPS } from "./config/scenes";
import { THEME } from "./config/theme";
import type { Subtitle } from "./config/types";
import { getResponsiveFontSize, getLayoutConfig } from "./config/videoPresets";

// 字体加载
const { fontFamily } = loadFont();

// ========== 响应式工具 Hook ==========
const useResponsive = () => {
  const { width, height } = useVideoConfig();
  const layout = getLayoutConfig(width, height);
  const aspectRatio = width / height;
  const isVertical = aspectRatio < 1;
  const isSquare = Math.abs(aspectRatio - 1) < 0.01;

  const scale = (baseSize: number) => getResponsiveFontSize(baseSize, width, height);

  return { width, height, layout, aspectRatio, isVertical, isSquare, scale };
};

// ========== 字幕数据 (基于 voiceover_metadata.json 实际时长) ==========
const SUBTITLES: Subtitle[] = [
  { start: 0.5, end: 7.0, text: "1993年，黄仁勋在加州创立NVIDIA，开启了一段改变世界的旅程" },
  { start: 8.5, end: 20.5, text: "三位工程师从餐厅起步，用4万美元启动资金，立志重新定义计算机图形" },
  { start: 22.5, end: 36.5, text: "1999年，GeForce 256横空出世，GPU概念首次被提出，视觉计算进入新纪元" },
  { start: 38.5, end: 51.0, text: "2006年CUDA发布，GPU不再只是图形处理器，而是通用并行计算平台" },
  { start: 52.5, end: 70.5, text: "AI时代来临，NVIDIA成为全球首家万亿市值芯片公司，掌握全球80%AI算力" },
  { start: 72.5, end: 83.0, text: "用芯片重新定义未来，NVIDIA的传奇仍在继续" },
];

// ========== 字幕组件 ==========
const SubtitleDisplay: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / FPS;

  const currentSubtitle = SUBTITLES.find(
    (sub) => currentTime >= sub.start && currentTime < sub.end
  );

  if (!currentSubtitle) return null;

  const subStartFrame = currentSubtitle.start * FPS;
  const subEndFrame = currentSubtitle.end * FPS;
  const fadeInDuration = 8;
  const fadeOutDuration = 8;

  const opacity = interpolate(
    frame,
    [
      subStartFrame,
      subStartFrame + fadeInDuration,
      subEndFrame - fadeOutDuration,
      subEndFrame,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.ease,
    }
  );

  const translateY = interpolate(
    frame,
    [subStartFrame, subStartFrame + fadeInDuration],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontSize: 42,
          fontFamily,
          color: THEME.text,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "16px 36px",
          borderRadius: 12,
          textAlign: "center",
          maxWidth: "85%",
          lineHeight: 1.5,
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          border: `1px solid rgba(118, 185, 0, 0.3)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {currentSubtitle.text}
      </div>
    </div>
  );
};

// ========== 粒子背景 ==========
const ParticleField: React.FC<{ count?: number; color?: string }> = ({
  count = 50,
  color = THEME.primary,
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => ({
    x: ((i * 47) % 1920),
    y: ((i * 73) % 1080),
    size: 2 + (i % 4),
    speedX: 0.3 + (i % 5) * 0.1,
    speedY: 0.2 + (i % 3) * 0.15,
    opacity: 0.15 + (i % 10) * 0.03,
  }));

  return (
    <>
      {particles.map((p, i) => {
        const x = (p.x + frame * p.speedX) % 1920;
        const y = (p.y + frame * p.speedY) % 1080;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

// ========== Logo with Advanced Glow ==========
const LogoWithGlow: React.FC<{ src: string; size?: number }> = ({ src, size = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 1]
  );

  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: "extend",
  });

  return (
    <div style={{ position: "relative" }}>
      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size * 1.3,
          height: size * 1.3,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          border: `2px solid ${THEME.primary}`,
          borderRadius: "50%",
          opacity: glowIntensity * 0.3,
          boxShadow: `0 0 ${30 * glowIntensity}px ${THEME.primary}`,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${50 * glowIntensity}px ${THEME.primary})`,
        }}
      >
        <Img src={src} style={{ width: size }} />
      </div>
    </div>
  );
};

// ========== Fade In Text ==========
const FadeInText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ text, delay = 0, fontSize = 48, color = THEME.text }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [delay, delay + 25], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 2px 15px rgba(0,0,0,0.6)",
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  );
};

// ========== Year Display ==========
const YearDisplay: React.FC<{ year: string; position?: "left" | "right" }> = ({
  year,
  position = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        [position]: 80,
        fontSize: 180,
        fontWeight: "bold",
        fontFamily,
        color: THEME.primary,
        transform: `scale(${scale})`,
        textShadow: `0 0 ${70 * glowPulse}px ${THEME.primary}`,
        letterSpacing: 8,
      }}
    >
      {year}
    </div>
  );
};

// ========== Big Text Animation ==========
const BigText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
}> = ({ text, delay = 0, fontSize = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(Math.sin((frame - delay) * 0.05), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: "bold",
        color: THEME.text,
        transform: `scale(${progress})`,
        opacity,
        textShadow: `0 0 ${60 * glowPulse}px rgba(118, 185, 0, 0.6)`,
        letterSpacing: 10,
      }}
    >
      {text}
    </div>
  );
};

// ========== Data Card ==========
const DataCard: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: "center",
        minWidth: 220,
        padding: "30px 40px",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 16,
        border: `1px solid ${THEME.primary}33`,
        boxShadow: `0 4px 30px rgba(0,0,0,0.4)`,
      }}
    >
      <div style={{
        fontSize: 60,
        color: THEME.primary,
        fontWeight: "bold",
        fontFamily,
        textShadow: `0 0 25px ${THEME.primary}`,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 26,
        color: THEME.muted,
        fontFamily,
        marginTop: 10,
        letterSpacing: 2,
      }}>
        {label}
      </div>
    </div>
  );
};

// ========== Background with Overlay ==========
const BackgroundWithOverlay: React.FC<{
  src: string;
  opacity?: number;
}> = ({ src, opacity = 0.3 }) => {
  const frame = useCurrentFrame();

  // Subtle zoom effect
  const scale = interpolate(frame, [0, 300], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: THEME.gradient,
        }}
      />
    </>
  );
};

// ========== Scene Components ==========

const OpeningScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.background,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <ParticleField count={40} />
      <LogoWithGlow src={staticFile("images/v3/nvidia_logo.png")} size={380} />
      <FadeInText
        text="从车库到万亿帝国"
        delay={25}
        fontSize={76}
        color={THEME.text}
      />
      <FadeInText
        text="NVIDIA 三十年传奇"
        delay={55}
        fontSize={50}
        color={THEME.primary}
      />
    </AbsoluteFill>
  );
};

const FoundingScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/v3/circuit_board.jpg" opacity={0.28} />
      <ParticleField count={25} color={THEME.secondary} />
      <YearDisplay year="1993" position="left" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 35,
          paddingTop: 100,
        }}
      >
        <FadeInText
          text="三位工程师在餐厅相遇"
          delay={25}
          fontSize={60}
        />
        <FadeInText
          text="启动资金: $40,000"
          delay={55}
          fontSize={42}
          color={THEME.muted}
        />
        <FadeInText
          text="黄仁勋 · 克里斯 · 柯蒂斯"
          delay={85}
          fontSize={38}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GPUScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/v3/chip_closeup.jpg" opacity={0.32} />
      <ParticleField count={35} />
      <YearDisplay year="1999" position="right" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 25,
        }}
      >
        <BigText text="GPU" delay={40} fontSize={300} />
        <FadeInText
          text="GeForce 256 · 定义图形处理器"
          delay={85}
          fontSize={50}
          color={THEME.muted}
        />
        <FadeInText
          text="视觉计算新纪元"
          delay={115}
          fontSize={42}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CUDAScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Enhanced code rain effect - useMemo to prevent character flickering
  const codeLines = useMemo(() => {
    // Use seeded random for consistent results
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 25 }, (_, i) => ({
      x: (i * 80) % 1920,
      speed: 1.5 + (i % 4) * 0.5,
      opacity: 0.08 + (i % 6) * 0.04,
      chars: Array.from({ length: 25 }, (_, j) => {
        // Use Katakana range (0x30A0-0x30FF) with seeded random
        const charCode = 0x30A0 + Math.floor(seededRandom(i * 100 + j) * 96);
        return String.fromCharCode(charCode);
      }).join(""),
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      {/* Code rain background */}
      {codeLines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: line.x,
            top: (frame * line.speed) % 1400 - 200,
            color: THEME.primary,
            opacity: line.opacity,
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: 2,
            writingMode: "vertical-rl",
          }}
        >
          {line.chars}
        </div>
      ))}

      <YearDisplay year="2006" position="left" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 35,
        }}
      >
        <BigText text="CUDA" delay={25} fontSize={200} />
        <FadeInText
          text="GPU 通用计算革命"
          delay={55}
          fontSize={50}
          color={THEME.muted}
        />
        <FadeInText
          text="为 AI 时代埋下种子"
          delay={85}
          fontSize={42}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AIScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Neural network visualization
  const nodes = Array.from({ length: 40 }, (_, i) => ({
    x: Math.sin((frame * 0.015) + i * 0.4) * 350 + 960,
    y: Math.cos((frame * 0.012) + i * 0.3) * 180 + 480,
    size: 4 + (i % 6),
    opacity: 0.25 + (i % 8) * 0.06,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/v3/ai_network.jpg" opacity={0.38} />

      {/* Neural network particles */}
      {nodes.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: THEME.primary,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 4}px ${THEME.primary}`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontSize: 110,
          fontWeight: "bold",
          fontFamily,
          color: THEME.primary,
          textShadow: `0 0 40px ${THEME.primary}`,
          letterSpacing: 6,
        }}
      >
        2020-2024
      </div>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 45,
        }}
      >
        <BigText text="$3万亿" delay={140} fontSize={220} />
        <FadeInText
          text="全球首家万亿市值芯片公司"
          delay={200}
          fontSize={50}
          color={THEME.primary}
        />
        <FadeInText
          text="全球 80% AI 计算"
          delay={260}
          fontSize={58}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.background,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 55,
      }}
    >
      <ParticleField count={60} />

      {/* Logo with enhanced glow */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${60 * glowPulse}px ${THEME.primary})`,
        }}
      >
        <Img
          src={staticFile("images/v3/nvidia_logo.png")}
          style={{ width: 480 }}
        />
      </div>

      <FadeInText
        text="用芯片重新定义未来"
        delay={40}
        fontSize={52}
      />

      {/* Data cards */}
      <div style={{ display: "flex", gap: 80, marginTop: 35 }}>
        <DataCard value="1993" label="创立" delay={80} />
        <DataCard value="GPU" label="发明" delay={110} />
        <DataCard value="$3万亿+" label="市值" delay={140} />
      </div>
    </AbsoluteFill>
  );
};

// ========== Main Video Component ==========
export const NvidiaHistoryV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* V3 配音 + BGM (场景感知音量: 片头0.15/正片0.05/片尾0.10) */}
      <Audio src={staticFile("audio/v3/mixed_with_bgm_v2.mp3")} volume={1} />

      {/* Scene sequences */}
      <Sequence
        from={SCENES.opening.start * FPS}
        durationInFrames={SCENES.opening.duration * FPS}
      >
        <OpeningScene />
      </Sequence>

      <Sequence
        from={SCENES.founding.start * FPS}
        durationInFrames={SCENES.founding.duration * FPS}
      >
        <FoundingScene />
      </Sequence>

      <Sequence
        from={SCENES.gpu.start * FPS}
        durationInFrames={SCENES.gpu.duration * FPS}
      >
        <GPUScene />
      </Sequence>

      <Sequence
        from={SCENES.cuda.start * FPS}
        durationInFrames={SCENES.cuda.duration * FPS}
      >
        <CUDAScene />
      </Sequence>

      <Sequence
        from={SCENES.ai.start * FPS}
        durationInFrames={SCENES.ai.duration * FPS}
      >
        <AIScene />
      </Sequence>

      <Sequence
        from={SCENES.closing.start * FPS}
        durationInFrames={SCENES.closing.duration * FPS}
      >
        <ClosingScene />
      </Sequence>

      {/* Subtitle overlay - always on top */}
      <SubtitleDisplay />
    </AbsoluteFill>
  );
};

// Video config
export const nvidiaHistoryV3Config = {
  id: "NvidiaHistoryV3",
  component: NvidiaHistoryV3,
  durationInFrames: 85 * FPS,
  fps: FPS,
  width: 1920,
  height: 1080,
};
