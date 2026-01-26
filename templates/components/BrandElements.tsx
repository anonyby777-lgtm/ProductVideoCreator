/**
 * 品牌元素组件模板
 *
 * 包含常用的品牌展示元素：
 * - LogoWithGlow: 带发光效果的 Logo
 * - DataCard: 数据展示卡片
 * - BrandSlogan: 品牌标语
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/components/ 目录
 * 2. 导入需要的组件使用
 *
 * @example
 * import { LogoWithGlow, DataCard, BrandSlogan } from "./components/BrandElements";
 *
 * <LogoWithGlow src={staticFile("images/logo.png")} size={400} />
 * <DataCard value="$3万亿" label="市值" delay={80} />
 */

import React from "react";
import { Img, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ========== LogoWithGlow 组件 ==========

export interface LogoWithGlowProps {
  /** Logo 图片源 */
  src: string;
  /** Logo 大小 (默认 400) */
  size?: number;
  /** 发光颜色 (默认 #76B900) */
  glowColor?: string;
  /** 是否显示旋转光环 (默认 true) */
  showRing?: boolean;
  /** 光环旋转速度 (度/300帧, 默认 360) */
  ringRotationSpeed?: number;
  /** 弹性阻尼 (默认 12) */
  damping?: number;
  /** 弹性刚度 (默认 100) */
  stiffness?: number;
}

/**
 * 带发光效果的 Logo 组件
 *
 * 特点：
 * - 弹性缩放进入动画
 * - 脉冲发光效果
 * - 可选的旋转光环装饰
 *
 * @example
 * <LogoWithGlow
 *   src={staticFile("images/nvidia_logo.png")}
 *   size={380}
 *   glowColor="#76B900"
 * />
 */
export const LogoWithGlow: React.FC<LogoWithGlowProps> = ({
  src,
  size = 400,
  glowColor = "#76B900",
  showRing = true,
  ringRotationSpeed = 360,
  damping = 12,
  stiffness = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 弹性缩放动画
  const scale = spring({
    frame,
    fps,
    config: { damping, stiffness },
  });

  // 脉冲发光强度
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 1]
  );

  // 光环旋转角度
  const rotation = interpolate(
    frame,
    [0, 300],
    [0, ringRotationSpeed],
    { extrapolateRight: "extend" }
  );

  return (
    <div style={{ position: "relative" }}>
      {/* 旋转光环 */}
      {showRing && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 1.3,
            height: size * 1.3,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            border: `2px solid ${glowColor}`,
            borderRadius: "50%",
            opacity: glowIntensity * 0.3,
            boxShadow: `0 0 ${30 * glowIntensity}px ${glowColor}`,
          }}
        />
      )}

      {/* Logo 图片 */}
      <div
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${50 * glowIntensity}px ${glowColor})`,
        }}
      >
        <Img src={src} style={{ width: size }} />
      </div>
    </div>
  );
};

// ========== DataCard 组件 ==========

export interface DataCardProps {
  /** 数值文字 */
  value: string;
  /** 标签文字 */
  label: string;
  /** 延迟帧数 (默认 0) */
  delay?: number;
  /** 数值颜色 (默认 #76B900) */
  valueColor?: string;
  /** 标签颜色 (默认 #888888) */
  labelColor?: string;
  /** 数值字体大小 (默认 60) */
  valueFontSize?: number;
  /** 标签字体大小 (默认 26) */
  labelFontSize?: number;
  /** 字体族 */
  fontFamily?: string;
  /** 卡片最小宽度 (默认 220) */
  minWidth?: number;
  /** 背景颜色 (默认 rgba(0,0,0,0.6)) */
  backgroundColor?: string;
  /** 边框颜色 (品牌色 + 透明度, 默认 #76B90033) */
  borderColor?: string;
}

/**
 * 数据展示卡片
 *
 * 特点：
 * - 弹性缩放进入动画
 * - 发光数值效果
 * - 支持完全自定义样式
 *
 * @example
 * <DataCard
 *   value="$3万亿"
 *   label="市值"
 *   delay={80}
 *   valueColor="#76B900"
 * />
 */
export const DataCard: React.FC<DataCardProps> = ({
  value,
  label,
  delay = 0,
  valueColor = "#76B900",
  labelColor = "#888888",
  valueFontSize = 60,
  labelFontSize = 26,
  fontFamily = "sans-serif",
  minWidth = 220,
  backgroundColor = "rgba(0,0,0,0.6)",
  borderColor = "#76B90033",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

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
        opacity,
        transform: `scale(${scale})`,
        textAlign: "center",
        minWidth,
        padding: "30px 40px",
        backgroundColor,
        borderRadius: 16,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          fontSize: valueFontSize,
          color: valueColor,
          fontWeight: "bold",
          fontFamily,
          textShadow: `0 0 25px ${valueColor}`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: labelFontSize,
          color: labelColor,
          fontFamily,
          marginTop: 10,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ========== BrandSlogan 组件 ==========

export interface BrandSloganProps {
  /** 主标语 */
  mainText: string;
  /** 副标语 (可选) */
  subText?: string;
  /** 延迟帧数 (默认 0) */
  delay?: number;
  /** 主标语字体大小 (默认 72) */
  mainFontSize?: number;
  /** 副标语字体大小 (默认 42) */
  subFontSize?: number;
  /** 主标语颜色 (默认 #ffffff) */
  mainColor?: string;
  /** 副标语颜色 (默认 #76B900) */
  subColor?: string;
  /** 字体族 */
  fontFamily?: string;
  /** 间距 (默认 20) */
  gap?: number;
}

/**
 * 品牌标语组件
 *
 * 特点：
 * - 主副标语组合
 * - 错开的淡入动画
 * - 支持自定义颜色和大小
 *
 * @example
 * <BrandSlogan
 *   mainText="用芯片重新定义未来"
 *   subText="NVIDIA 三十年传奇"
 *   delay={25}
 * />
 */
export const BrandSlogan: React.FC<BrandSloganProps> = ({
  mainText,
  subText,
  delay = 0,
  mainFontSize = 72,
  subFontSize = 42,
  mainColor = "#ffffff",
  subColor = "#76B900",
  fontFamily = "sans-serif",
  gap = 20,
}) => {
  const frame = useCurrentFrame();

  // 主标语动画
  const mainOpacity = interpolate(
    frame,
    [delay, delay + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mainTranslateY = interpolate(
    frame,
    [delay, delay + 25],
    [25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 副标语动画 (延迟 30 帧)
  const subDelay = delay + 30;
  const subOpacity = interpolate(
    frame,
    [subDelay, subDelay + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const subTranslateY = interpolate(
    frame,
    [subDelay, subDelay + 25],
    [15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: mainFontSize,
          color: mainColor,
          opacity: mainOpacity,
          transform: `translateY(${mainTranslateY}px)`,
          textShadow: "0 2px 15px rgba(0,0,0,0.6)",
          letterSpacing: 4,
        }}
      >
        {mainText}
      </div>

      {subText && (
        <div
          style={{
            fontFamily,
            fontSize: subFontSize,
            color: subColor,
            opacity: subOpacity,
            transform: `translateY(${subTranslateY}px)`,
            textShadow: `0 2px 25px ${subColor}40`,
            letterSpacing: 2,
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};

// ========== StatRow 组件 ==========

export interface StatRowProps {
  /** 统计项数组 */
  stats: Array<{ value: string; label: string }>;
  /** 起始延迟帧数 (默认 0) */
  startDelay?: number;
  /** 每项之间的延迟 (默认 30) */
  itemDelay?: number;
  /** 项目间距 (默认 80) */
  gap?: number;
  /** 数值颜色 */
  valueColor?: string;
  /** 标签颜色 */
  labelColor?: string;
}

/**
 * 统计数据行组件
 *
 * 特点：
 * - 自动排列多个 DataCard
 * - 错开的动画效果
 *
 * @example
 * <StatRow
 *   stats={[
 *     { value: "1993", label: "创立" },
 *     { value: "GPU", label: "发明" },
 *     { value: "$3万亿+", label: "市值" },
 *   ]}
 *   startDelay={80}
 *   itemDelay={30}
 * />
 */
export const StatRow: React.FC<StatRowProps> = ({
  stats,
  startDelay = 0,
  itemDelay = 30,
  gap = 80,
  valueColor = "#76B900",
  labelColor = "#888888",
}) => {
  return (
    <div style={{ display: "flex", gap }}>
      {stats.map((stat, index) => (
        <DataCard
          key={index}
          value={stat.value}
          label={stat.label}
          delay={startDelay + index * itemDelay}
          valueColor={valueColor}
          labelColor={labelColor}
        />
      ))}
    </div>
  );
};
