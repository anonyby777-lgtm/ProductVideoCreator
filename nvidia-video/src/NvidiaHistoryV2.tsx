import React from "react";
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
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansSC";

const { fontFamily } = loadFont();

const FPS = 30;

// ========== 场景时间配置 ==========
const SCENES = {
  opening: { start: 0, duration: 8 },
  founding: { start: 8, duration: 14 },
  gpu: { start: 22, duration: 16 },
  cuda: { start: 38, duration: 14 },
  ai: { start: 52, duration: 20 },
  closing: { start: 72, duration: 13 },
};

// ========== 主题颜色 ==========
const THEME = {
  primary: "#76B900",      // NVIDIA Green
  background: "#0a0a0a",
  text: "#ffffff",
  muted: "#888888",
  gradient: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
};

// ========== 可复用动画组件 ==========

// Logo with Glow Effect
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
    [0.3, 0.8]
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${THEME.primary})`,
      }}
    >
      <Img src={src} style={{ width: size }} />
    </div>
  );
};

// Fade In Text with Y Movement
const FadeInText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ text, delay = 0, fontSize = 48, color = THEME.text }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [delay, delay + 30], [30, 0], {
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
        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};

// Year Display with Spring Bounce
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
        textShadow: `0 0 ${60 * glowPulse}px ${THEME.primary}`,
      }}
    >
      {year}
    </div>
  );
};

// Big Text Animation
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

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: "bold",
        color: THEME.text,
        transform: `scale(${progress})`,
        opacity,
        textShadow: `0 0 40px rgba(255,255,255,0.3)`,
      }}
    >
      {text}
    </div>
  );
};

// Data Card with Staggered Animation
const DataCard: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [delay, delay + 20], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: "center",
        minWidth: 200,
      }}
    >
      <div style={{
        fontSize: 56,
        color: THEME.primary,
        fontWeight: "bold",
        fontFamily,
        textShadow: `0 0 20px ${THEME.primary}`,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 24,
        color: THEME.muted,
        fontFamily,
        marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  );
};

// Background with Gradient Overlay
const BackgroundWithOverlay: React.FC<{
  src: string;
  opacity?: number;
}> = ({ src, opacity = 0.3 }) => {
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

// ========== 场景组件 ==========

// 场景1: 片头
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
      <LogoWithGlow src={staticFile("images/nvidia_logo.png")} size={350} />
      <FadeInText
        text="从车库到万亿帝国"
        delay={30}
        fontSize={72}
        color={THEME.text}
      />
      <FadeInText
        text="NVIDIA 三十年传奇"
        delay={60}
        fontSize={48}
        color={THEME.primary}
      />
    </AbsoluteFill>
  );
};

// 场景2: 创始 1993
const FoundingScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/circuit_board.jpg" opacity={0.25} />
      <YearDisplay year="1993" position="left" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
          paddingTop: 100,
        }}
      >
        <FadeInText
          text="三位工程师在餐厅相遇"
          delay={30}
          fontSize={56}
        />
        <FadeInText
          text="启动资金: $40,000"
          delay={60}
          fontSize={40}
          color={THEME.muted}
        />
        <FadeInText
          text="黄仁勋 · 克里斯 · 柯蒂斯"
          delay={90}
          fontSize={36}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景3: GPU 1999
const GPUScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/gpu_card.jpg" opacity={0.3} />
      <YearDisplay year="1999" position="right" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <BigText text="GPU" delay={45} fontSize={280} />
        <FadeInText
          text="GeForce 256 · 定义图形处理器"
          delay={90}
          fontSize={48}
          color={THEME.muted}
        />
        <FadeInText
          text="视觉计算新纪元"
          delay={120}
          fontSize={40}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景4: CUDA 2006
const CUDAScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 代码雨效果
  const codeLines = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 100) % 1920,
    speed: 2 + (i % 3),
    opacity: 0.1 + (i % 5) * 0.05,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      {/* 代码雨背景 */}
      {codeLines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: line.x,
            top: (frame * line.speed) % 1200 - 100,
            color: THEME.primary,
            opacity: line.opacity,
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          {Array.from({ length: 20 }, () => Math.random() > 0.5 ? "1" : "0").join("")}
        </div>
      ))}

      <YearDisplay year="2006" position="left" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <BigText text="CUDA" delay={30} fontSize={180} />
        <FadeInText
          text="GPU 通用计算革命"
          delay={60}
          fontSize={48}
          color={THEME.muted}
        />
        <FadeInText
          text="为 AI 时代埋下种子"
          delay={90}
          fontSize={40}
          color={THEME.primary}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景5: AI 时代 2020-2024
const AIScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 数据流动效果
  const particleCount = 30;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    x: Math.sin((frame * 0.02) + i * 0.5) * 400 + 960,
    y: Math.cos((frame * 0.015) + i * 0.3) * 200 + 540,
    size: 3 + (i % 5),
    opacity: 0.2 + (i % 10) * 0.05,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      <BackgroundWithOverlay src="images/datacenter.jpg" opacity={0.35} />

      {/* AI 数据粒子 */}
      {particles.map((p, i) => (
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
            boxShadow: `0 0 ${p.size * 2}px ${THEME.primary}`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontSize: 100,
          fontWeight: "bold",
          fontFamily,
          color: THEME.primary,
          textShadow: `0 0 30px ${THEME.primary}`,
        }}
      >
        2020-2024
      </div>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <BigText text="$1万亿" delay={150} fontSize={200} />
        <FadeInText
          text="全球首家万亿市值芯片公司"
          delay={210}
          fontSize={48}
          color={THEME.primary}
        />
        <FadeInText
          text="全球 80% AI 计算"
          delay={270}
          fontSize={56}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景6: 片尾
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
        gap: 50,
      }}
    >
      {/* Logo with Glow */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${50 * glowPulse}px ${THEME.primary})`,
        }}
      >
        <Img
          src={staticFile("images/nvidia_logo.png")}
          style={{ width: 450 }}
        />
      </div>

      <FadeInText
        text="用芯片重新定义未来"
        delay={45}
        fontSize={48}
      />

      {/* 数据卡片 */}
      <div style={{ display: "flex", gap: 100, marginTop: 40 }}>
        <DataCard value="1993" label="创立" delay={90} />
        <DataCard value="1999" label="GPU" delay={120} />
        <DataCard value="$3万亿+" label="市值" delay={150} />
      </div>
    </AbsoluteFill>
  );
};

// ========== 主视频组件 ==========
export const NvidiaHistoryV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* V2 配音 */}
      <Audio src={staticFile("audio/v2/synced_voiceover.mp3")} volume={1} />

      {/* 场景序列 */}
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
    </AbsoluteFill>
  );
};

// 视频配置
export const nvidiaHistoryV2Config = {
  id: "NvidiaHistoryV2",
  component: NvidiaHistoryV2,
  durationInFrames: 85 * FPS,  // 85秒
  fps: FPS,
  width: 1920,
  height: 1080,
};
