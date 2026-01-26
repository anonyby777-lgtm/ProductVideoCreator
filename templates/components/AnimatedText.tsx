/**
 * 动画文字组件模板
 *
 * 包含多种常用文字动画效果：
 * - FadeInText: 淡入上移文字
 * - BigText: 弹性缩放大文字
 * - TypewriterText: 打字机效果
 * - GlowText: 脉冲发光文字
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/components/ 目录
 * 2. 导入需要的组件使用
 *
 * @example
 * import { FadeInText, BigText, GlowText } from "./components/AnimatedText";
 *
 * <FadeInText text="标题文字" delay={25} fontSize={72} />
 * <BigText text="GPU" delay={40} fontSize={200} />
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ========== 通用 Props ==========

interface BaseTextProps {
  /** 显示的文字 */
  text: string;
  /** 延迟帧数 (默认 0) */
  delay?: number;
  /** 字体大小 (默认 48) */
  fontSize?: number;
  /** 文字颜色 (默认 #ffffff) */
  color?: string;
  /** 字体族 */
  fontFamily?: string;
  /** 字母间距 (默认 2) */
  letterSpacing?: number;
}

// ========== FadeInText 组件 ==========

export interface FadeInTextProps extends BaseTextProps {
  /** 动画持续帧数 (默认 25) */
  duration?: number;
  /** 起始 Y 偏移量 (默认 25) */
  offsetY?: number;
}

/**
 * 淡入上移文字动画
 *
 * 效果: 文字从下方淡入并上移到最终位置
 *
 * @example
 * <FadeInText
 *   text="NVIDIA"
 *   delay={25}
 *   fontSize={60}
 *   color="#ffffff"
 * />
 */
export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = "#ffffff",
  fontFamily = "sans-serif",
  letterSpacing = 2,
  duration = 25,
  offsetY = 25,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    frame,
    [delay, delay + duration],
    [offsetY, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 2px 15px rgba(0,0,0,0.6)",
        letterSpacing,
      }}
    >
      {text}
    </div>
  );
};

// ========== BigText 组件 ==========

export interface BigTextProps extends BaseTextProps {
  /** 弹性阻尼 (默认 12) */
  damping?: number;
  /** 弹性刚度 (默认 100) */
  stiffness?: number;
  /** 发光颜色 */
  glowColor?: string;
  /** 发光强度 (0-1, 默认 0.6) */
  glowIntensity?: number;
}

/**
 * 弹性缩放大文字动画
 *
 * 效果: 文字弹性放大并带有脉冲发光
 *
 * @example
 * <BigText
 *   text="GPU"
 *   delay={40}
 *   fontSize={200}
 *   glowColor="#76B900"
 * />
 */
export const BigText: React.FC<BigTextProps> = ({
  text,
  delay = 0,
  fontSize = 200,
  color = "#ffffff",
  fontFamily = "sans-serif",
  letterSpacing = 10,
  damping = 12,
  stiffness = 100,
  glowColor = "rgba(118, 185, 0, 0.6)",
  glowIntensity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping, stiffness },
  });

  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 脉冲发光效果
  const glowPulse = interpolate(
    Math.sin((frame - delay) * 0.05),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: "bold",
        color,
        transform: `scale(${progress})`,
        opacity,
        textShadow: `0 0 ${60 * glowPulse * glowIntensity}px ${glowColor}`,
        letterSpacing,
      }}
    >
      {text}
    </div>
  );
};

// ========== TypewriterText 组件 ==========

export interface TypewriterTextProps extends BaseTextProps {
  /** 每个字符显示的帧数 (默认 3) */
  framesPerChar?: number;
  /** 是否显示光标 (默认 true) */
  showCursor?: boolean;
  /** 光标颜色 */
  cursorColor?: string;
}

/**
 * 打字机效果文字动画
 *
 * 效果: 文字逐字符显示，模拟打字效果
 *
 * @example
 * <TypewriterText
 *   text="Hello, World!"
 *   delay={0}
 *   fontSize={48}
 *   framesPerChar={3}
 * />
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = "#ffffff",
  fontFamily = "monospace",
  letterSpacing = 0,
  framesPerChar = 3,
  showCursor = true,
  cursorColor = "#76B900",
}) => {
  const frame = useCurrentFrame();

  const effectiveFrame = Math.max(0, frame - delay);
  const charsToShow = Math.floor(effectiveFrame / framesPerChar);
  const displayText = text.slice(0, Math.min(charsToShow, text.length));

  // 光标闪烁
  const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;
  const isTyping = charsToShow < text.length;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        letterSpacing,
      }}
    >
      {displayText}
      {showCursor && (
        <span
          style={{
            opacity: isTyping ? 1 : cursorOpacity,
            color: cursorColor,
            marginLeft: 2,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};

// ========== GlowText 组件 ==========

export interface GlowTextProps extends BaseTextProps {
  /** 发光颜色 */
  glowColor?: string;
  /** 脉冲速度 (默认 0.08) */
  pulseSpeed?: number;
  /** 最小发光强度 (默认 0.3) */
  minIntensity?: number;
  /** 最大发光强度 (默认 0.8) */
  maxIntensity?: number;
}

/**
 * 脉冲发光文字
 *
 * 效果: 文字带有持续脉冲的发光效果
 *
 * @example
 * <GlowText
 *   text="NVIDIA"
 *   fontSize={72}
 *   glowColor="#76B900"
 *   pulseSpeed={0.1}
 * />
 */
export const GlowText: React.FC<GlowTextProps> = ({
  text,
  delay = 0,
  fontSize = 72,
  color = "#ffffff",
  fontFamily = "sans-serif",
  letterSpacing = 4,
  glowColor = "#76B900",
  pulseSpeed = 0.08,
  minIntensity = 0.3,
  maxIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();

  const effectiveFrame = Math.max(0, frame - delay);

  // 计算脉冲强度
  const intensity = interpolate(
    Math.sin(effectiveFrame * pulseSpeed),
    [-1, 1],
    [minIntensity, maxIntensity]
  );

  const opacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: "bold",
        color,
        opacity,
        textShadow: `0 0 ${60 * intensity}px ${glowColor}`,
        letterSpacing,
      }}
    >
      {text}
    </div>
  );
};

// ========== YearDisplay 组件 ==========

export interface YearDisplayProps {
  /** 年份文字 */
  year: string;
  /** 位置 (默认 left) */
  position?: "left" | "right";
  /** 字体大小 (默认 180) */
  fontSize?: number;
  /** 颜色 */
  color?: string;
  /** 字体族 */
  fontFamily?: string;
  /** 顶部距离 (默认 80) */
  top?: number;
  /** 左右边距 (默认 80) */
  margin?: number;
}

/**
 * 年份显示组件
 *
 * 效果: 弹性动画显示年份，带有发光效果
 * 常用于时间线视频的场景标记
 *
 * @example
 * <YearDisplay year="1993" position="left" color="#76B900" />
 */
export const YearDisplay: React.FC<YearDisplayProps> = ({
  year,
  position = "left",
  fontSize = 180,
  color = "#76B900",
  fontFamily = "sans-serif",
  top = 80,
  margin = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        [position]: margin,
        fontSize,
        fontWeight: "bold",
        fontFamily,
        color,
        transform: `scale(${scale})`,
        textShadow: `0 0 ${70 * glowPulse}px ${color}`,
        letterSpacing: 8,
      }}
    >
      {year}
    </div>
  );
};
