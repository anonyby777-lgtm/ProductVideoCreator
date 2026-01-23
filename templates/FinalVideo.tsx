/**
 * 产品介绍视频 - Remotion 视频组件模板
 *
 * 使用方法:
 * 1. 复制此文件到项目的 src/ 目录
 * 2. 根据实际时长调整时间配置
 * 3. 创建对应的场景组件
 */

import React from "react";
import {
  Audio,
  Video,
  Sequence,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

// ============ 时间配置 ============

const FPS = 30;

// 片头：10秒
const OPENING_START = 0;
const OPENING_DURATION = 10 * FPS;

// 功能亮点：8秒
const FEATURES_START = OPENING_DURATION;
const FEATURES_DURATION = 8 * FPS;

// 演示录屏：根据实际录屏时长调整
const DEMO_START = FEATURES_START + FEATURES_DURATION;
const DEMO_DURATION_SECONDS = 80; // TODO: 替换为实际录屏时长
const DEMO_DURATION = Math.ceil(DEMO_DURATION_SECONDS * FPS);

// 片尾：10秒
const CLOSING_START = DEMO_START + DEMO_DURATION;
const CLOSING_DURATION = 10 * FPS;

// 总帧数
const TOTAL_FRAMES = CLOSING_START + CLOSING_DURATION;

// ============ 颜色配置 ============

const colors = {
  primary: "#2563eb",
  background: "#0f172a",
  text: "#f8fafc",
  textSecondary: "#94a3b8",
};

// ============ 场景组件 ============

/**
 * 片头场景
 */
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(135deg, ${colors.background} 0%, #1a365d 50%, ${colors.background} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 120,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 30,
        }}
      >
        🔐 {/* TODO: 替换为产品Logo */}
      </div>

      {/* 主标题 */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: colors.text,
          fontFamily: '"Noto Sans SC", sans-serif',
          opacity: titleOpacity,
          marginBottom: 20,
        }}
      >
        产品名称 {/* TODO: 替换为产品名称 */}
      </div>

      {/* 副标题 */}
      <div
        style={{
          fontSize: 32,
          color: colors.textSecondary,
          fontFamily: '"Noto Sans SC", sans-serif',
          opacity: subtitleOpacity,
        }}
      >
        一句话产品定位 {/* TODO: 替换为产品定位 */}
      </div>
    </div>
  );
};

/**
 * 功能亮点场景
 */
const FeatureCardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const features = [
    { icon: "📊", title: "功能1", description: "功能1描述" },
    { icon: "🔍", title: "功能2", description: "功能2描述" },
    { icon: "⚡", title: "功能3", description: "功能3描述" },
    { icon: "📋", title: "功能4", description: "功能4描述" },
  ];

  return (
    <div
      style={{
        width,
        height,
        background: colors.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: colors.text,
          fontFamily: '"Noto Sans SC", sans-serif',
          marginBottom: 60,
        }}
      >
        强大功能，高效运维
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 30,
        }}
      >
        {features.map((feature, index) => {
          const cardOpacity = interpolate(
            frame,
            [30 + index * 15, 60 + index * 15],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          return (
            <div
              key={index}
              style={{
                padding: 30,
                backgroundColor: "#1e293b",
                borderRadius: 16,
                opacity: cardOpacity,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </div>
              <div style={{ fontSize: 16, color: colors.textSecondary }}>
                {feature.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 片尾场景
 */
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.7]
  );

  const textOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const buttonOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(135deg, ${colors.background} 0%, #1a365d 50%, ${colors.background} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 100,
          transform: `scale(${logoScale})`,
          marginBottom: 30,
          filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${colors.primary})`,
        }}
      >
        🔐
      </div>

      {/* 标题 */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: colors.text,
          fontFamily: '"Noto Sans SC", sans-serif',
          opacity: textOpacity,
          marginBottom: 20,
        }}
      >
        产品名称
      </div>

      {/* 口号 */}
      <div
        style={{
          fontSize: 32,
          color: colors.textSecondary,
          fontFamily: '"Noto Sans SC", sans-serif',
          opacity: textOpacity,
          marginBottom: 60,
        }}
      >
        让场景更智能、更高效
      </div>

      {/* 行动按钮 */}
      <div
        style={{
          opacity: buttonOpacity,
          padding: "20px 60px",
          backgroundColor: colors.primary,
          borderRadius: 12,
          fontSize: 28,
          fontWeight: 700,
          color: colors.text,
          fontFamily: '"Noto Sans SC", sans-serif',
          boxShadow: `0 0 ${30 * glowIntensity}px ${colors.primary}80`,
        }}
      >
        立即开始使用
      </div>
    </div>
  );
};

// ============ 主视频组件 ============

export const FinalVideo: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <>
      {/* 同步配音 */}
      <Audio src={staticFile("audio/synced_voiceover.mp3")} volume={1} />

      {/* 片头动画 */}
      <Sequence from={OPENING_START} durationInFrames={OPENING_DURATION}>
        <OpeningScene />
      </Sequence>

      {/* 功能亮点展示 */}
      <Sequence from={FEATURES_START} durationInFrames={FEATURES_DURATION}>
        <FeatureCardsScene />
      </Sequence>

      {/* 演示录屏 */}
      <Sequence from={DEMO_START} durationInFrames={DEMO_DURATION}>
        <Video
          src={staticFile("recordings/full_demo.mp4")}
          style={{
            width,
            height,
            objectFit: "contain",
            backgroundColor: colors.background,
          }}
        />
      </Sequence>

      {/* 片尾动画 */}
      <Sequence from={CLOSING_START} durationInFrames={CLOSING_DURATION}>
        <ClosingScene />
      </Sequence>
    </>
  );
};

// ============ 导出配置 ============

export const finalVideoConfig = {
  id: "FinalVideo",
  component: FinalVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1920,
  height: 1080,
};
