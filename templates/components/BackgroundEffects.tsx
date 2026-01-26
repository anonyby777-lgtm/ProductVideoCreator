/**
 * 背景效果组件模板
 *
 * 包含多种背景视觉效果：
 * - ParticleField: 粒子漂浮效果
 * - CodeRain: 代码雨效果 (Matrix风格)
 * - BackgroundWithOverlay: 带渐变遮罩的背景图
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/components/ 目录
 * 2. 导入需要的组件使用
 *
 * @example
 * import { ParticleField, CodeRain, BackgroundWithOverlay } from "./components/BackgroundEffects";
 *
 * <AbsoluteFill>
 *   <BackgroundWithOverlay src="images/bg.jpg" opacity={0.3} />
 *   <ParticleField count={50} color="#76B900" />
 * </AbsoluteFill>
 */

import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import type { ParticleConfig, CodeRainConfig } from "../config/types";

// ========== ParticleField 组件 ==========

export interface ParticleFieldProps {
  /** 粒子数量 (默认 50) */
  count?: number;
  /** 粒子颜色 (默认 #76B900) */
  color?: string;
  /** 容器宽度 (默认 1920) */
  width?: number;
  /** 容器高度 (默认 1080) */
  height?: number;
  /** 最小粒子大小 (默认 2) */
  minSize?: number;
  /** 最大粒子大小 (默认 6) */
  maxSize?: number;
  /** 最小移动速度 (默认 0.2) */
  minSpeed?: number;
  /** 最大移动速度 (默认 0.5) */
  maxSpeed?: number;
  /** 最小透明度 (默认 0.1) */
  minOpacity?: number;
  /** 最大透明度 (默认 0.4) */
  maxOpacity?: number;
}

/**
 * 粒子漂浮效果
 *
 * 特点：
 * - 使用 useMemo 缓存粒子初始状态，防止闪烁
 * - 粒子循环移动，无缝循环
 * - 支持完全自定义外观和行为
 *
 * @example
 * <ParticleField
 *   count={40}
 *   color="#76B900"
 *   minOpacity={0.15}
 *   maxOpacity={0.45}
 * />
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 50,
  color = "#76B900",
  width = 1920,
  height = 1080,
  minSize = 2,
  maxSize = 6,
  minSpeed = 0.2,
  maxSpeed = 0.5,
  minOpacity = 0.1,
  maxOpacity = 0.4,
}) => {
  const frame = useCurrentFrame();

  // 使用 useMemo 缓存粒子初始状态，防止每帧重新计算
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (i * 47) % width,
      y: (i * 73) % height,
      size: minSize + (i % (maxSize - minSize + 1)),
      speedX: minSpeed + ((i % 5) * (maxSpeed - minSpeed)) / 5,
      speedY: minSpeed + ((i % 3) * (maxSpeed - minSpeed)) / 3,
      opacity: minOpacity + ((i % 10) * (maxOpacity - minOpacity)) / 10,
    }));
  }, [count, width, height, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity]);

  return (
    <>
      {particles.map((p, i) => {
        // 计算当前位置，使用模运算实现循环
        const x = (p.x + frame * p.speedX) % width;
        const y = (p.y + frame * p.speedY) % height;

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

// ========== CodeRain 组件 ==========

export interface CodeRainProps {
  /** 代码行数量 (默认 25) */
  lineCount?: number;
  /** 每行字符数 (默认 25) */
  charsPerLine?: number;
  /** 字符集类型 (默认 katakana) */
  charSet?: "binary" | "katakana" | "hex";
  /** 最小速度 (默认 1.5) */
  minSpeed?: number;
  /** 最大速度 (默认 3.0) */
  maxSpeed?: number;
  /** 颜色 (默认 #76B900) */
  color?: string;
  /** 容器宽度 (默认 1920) */
  width?: number;
  /** 容器高度 (默认 1400) */
  height?: number;
  /** 最小透明度 (默认 0.08) */
  minOpacity?: number;
  /** 最大透明度 (默认 0.32) */
  maxOpacity?: number;
}

/**
 * 代码雨效果 (Matrix风格)
 *
 * 特点：
 * - 使用 useMemo + seeded random 防止字符闪烁 (重要!)
 * - 支持多种字符集: 二进制、片假名、十六进制
 * - 垂直滚动的字符流效果
 *
 * 重要注意事项：
 * 字符生成必须使用 seeded random 并缓存在 useMemo 中，
 * 否则每帧都会生成新的随机字符导致闪烁。
 *
 * @example
 * <CodeRain
 *   lineCount={25}
 *   charSet="katakana"
 *   color="#76B900"
 *   minOpacity={0.08}
 *   maxOpacity={0.24}
 * />
 */
export const CodeRain: React.FC<CodeRainProps> = ({
  lineCount = 25,
  charsPerLine = 25,
  charSet = "katakana",
  minSpeed = 1.5,
  maxSpeed = 3.0,
  color = "#76B900",
  width = 1920,
  height = 1400,
  minOpacity = 0.08,
  maxOpacity = 0.32,
}) => {
  const frame = useCurrentFrame();

  // 使用 useMemo + seeded random 防止字符闪烁
  const codeLines = useMemo(() => {
    // Seeded random function - 确保相同种子产生相同结果
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    // 根据字符集生成字符
    const getChar = (seed: number): string => {
      const rand = seededRandom(seed);
      switch (charSet) {
        case "binary":
          return rand > 0.5 ? "1" : "0";
        case "hex":
          return Math.floor(rand * 16).toString(16).toUpperCase();
        case "katakana":
        default:
          // Katakana Unicode range: 0x30A0-0x30FF
          return String.fromCharCode(0x30A0 + Math.floor(rand * 96));
      }
    };

    return Array.from({ length: lineCount }, (_, i) => ({
      x: (i * Math.floor(width / lineCount)) % width,
      speed: minSpeed + ((i % 4) * (maxSpeed - minSpeed)) / 4,
      opacity: minOpacity + ((i % 6) * (maxOpacity - minOpacity)) / 6,
      // 预先生成所有字符，存储在数组中
      chars: Array.from({ length: charsPerLine }, (_, j) =>
        getChar(i * 100 + j)
      ).join(""),
    }));
  }, [lineCount, charsPerLine, charSet, minSpeed, maxSpeed, width, minOpacity, maxOpacity]);

  return (
    <>
      {codeLines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: line.x,
            top: (frame * line.speed) % height - 200,
            color,
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
    </>
  );
};

// ========== BackgroundWithOverlay 组件 ==========

export interface BackgroundWithOverlayProps {
  /** 背景图片路径 (相对于 public 目录) */
  src: string;
  /** 图片透明度 (默认 0.3) */
  opacity?: number;
  /** 渐变遮罩 (可选，默认为从上到下的暗色渐变) */
  gradient?: string;
  /** 是否启用缩放动画 (默认 true) */
  enableZoom?: boolean;
  /** 缩放范围 [起始, 结束] (默认 [1, 1.05]) */
  zoomRange?: [number, number];
  /** 缩放持续帧数 (默认 300) */
  zoomDuration?: number;
}

/**
 * 带渐变遮罩的背景图组件
 *
 * 特点：
 * - 图片全屏覆盖，自动裁剪
 * - 可选的缓慢缩放动画 (Ken Burns效果)
 * - 渐变遮罩叠加，便于文字阅读
 *
 * @example
 * <BackgroundWithOverlay
 *   src="images/tech_bg.jpg"
 *   opacity={0.35}
 *   enableZoom={true}
 * />
 */
export const BackgroundWithOverlay: React.FC<BackgroundWithOverlayProps> = ({
  src,
  opacity = 0.3,
  gradient = "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
  enableZoom = true,
  zoomRange = [1, 1.05],
  zoomDuration = 300,
}) => {
  const frame = useCurrentFrame();

  // 缓慢缩放效果 (Ken Burns)
  const scale = enableZoom
    ? interpolate(
        frame,
        [0, zoomDuration],
        zoomRange,
        { extrapolateRight: "clamp" }
      )
    : 1;

  return (
    <>
      {/* 背景图片层 */}
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

      {/* 渐变遮罩层 */}
      <AbsoluteFill
        style={{
          background: gradient,
        }}
      />
    </>
  );
};

// ========== NeuralNetwork 组件 ==========

export interface NeuralNetworkProps {
  /** 节点数量 (默认 40) */
  nodeCount?: number;
  /** 颜色 (默认 #76B900) */
  color?: string;
  /** 最小节点大小 (默认 4) */
  minSize?: number;
  /** 最大节点大小 (默认 10) */
  maxSize?: number;
  /** 中心 X 坐标 (默认 960) */
  centerX?: number;
  /** 中心 Y 坐标 (默认 480) */
  centerY?: number;
  /** X 轴扩散范围 (默认 350) */
  spreadX?: number;
  /** Y 轴扩散范围 (默认 180) */
  spreadY?: number;
}

/**
 * 神经网络可视化效果
 *
 * 效果：飘动的发光节点，模拟神经网络的活跃状态
 *
 * @example
 * <NeuralNetwork
 *   nodeCount={50}
 *   color="#76B900"
 *   centerX={960}
 *   centerY={540}
 * />
 */
export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
  nodeCount = 40,
  color = "#76B900",
  minSize = 4,
  maxSize = 10,
  centerX = 960,
  centerY = 480,
  spreadX = 350,
  spreadY = 180,
}) => {
  const frame = useCurrentFrame();

  // 使用 useMemo 缓存节点属性
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      size: minSize + (i % (maxSize - minSize + 1)),
      opacity: 0.25 + ((i % 8) * 0.06),
      offsetMultiplierX: (i * 0.4),
      offsetMultiplierY: (i * 0.3),
      speedX: 0.015,
      speedY: 0.012,
    }));
  }, [nodeCount, minSize, maxSize]);

  return (
    <>
      {nodes.map((node, i) => {
        const x = Math.sin(frame * node.speedX + node.offsetMultiplierX) * spreadX + centerX;
        const y = Math.cos(frame * node.speedY + node.offsetMultiplierY) * spreadY + centerY;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: node.size,
              height: node.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: node.opacity,
              boxShadow: `0 0 ${node.size * 4}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
