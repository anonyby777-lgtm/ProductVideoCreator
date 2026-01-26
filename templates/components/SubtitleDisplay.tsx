/**
 * 字幕显示组件模板
 *
 * 功能：
 * - 根据时间自动显示/隐藏字幕
 * - 淡入淡出动画效果
 * - 可自定义样式和位置
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/components/ 目录
 * 2. 根据需要修改样式和动画参数
 * 3. 在主组件中导入使用
 *
 * @example
 * import { SubtitleDisplay } from "./components/SubtitleDisplay";
 *
 * const SUBTITLES = [
 *   { start: 0.5, end: 7.0, text: "第一段字幕" },
 *   { start: 8.5, end: 15.0, text: "第二段字幕" },
 * ];
 *
 * // 在组件中使用
 * <SubtitleDisplay subtitles={SUBTITLES} />
 */

import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import type { Subtitle } from "../config/types";

// ========== 类型定义 ==========

export interface SubtitleDisplayProps {
  /** 字幕数据数组 */
  subtitles: Subtitle[];
  /** 帧率 (默认 30) */
  fps?: number;
  /** 字体族 */
  fontFamily?: string;
  /** 字体大小 (默认 42) */
  fontSize?: number;
  /** 文字颜色 (默认 #ffffff) */
  textColor?: string;
  /** 背景颜色 (默认 rgba(0,0,0,0.75)) */
  backgroundColor?: string;
  /** 底部距离 (默认 80) */
  bottom?: number;
  /** 最大宽度 (默认 85%) */
  maxWidth?: string;
  /** 淡入帧数 (默认 8) */
  fadeInFrames?: number;
  /** 淡出帧数 (默认 8) */
  fadeOutFrames?: number;
  /** 品牌色 (用于边框) */
  brandColor?: string;
}

// ========== 主组件 ==========

/**
 * 字幕显示组件
 *
 * 特点：
 * - 自动根据当前时间显示对应字幕
 * - 平滑的淡入淡出和上移动画
 * - 支持自定义所有样式参数
 *
 * 注意事项：
 * - 字幕的 start/end 时间应基于 voiceover_metadata.json 的实际时长
 * - end = start + actual_duration (从 metadata 获取)
 */
export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  subtitles,
  fps = 30,
  fontFamily = "sans-serif",
  fontSize = 42,
  textColor = "#ffffff",
  backgroundColor = "rgba(0, 0, 0, 0.75)",
  bottom = 80,
  maxWidth = "85%",
  fadeInFrames = 8,
  fadeOutFrames = 8,
  brandColor = "#76B900",
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  // 查找当前应该显示的字幕
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime < sub.end
  );

  if (!currentSubtitle) return null;

  // 计算动画参数
  const subStartFrame = currentSubtitle.start * fps;
  const subEndFrame = currentSubtitle.end * fps;

  // 透明度动画: 淡入 -> 保持 -> 淡出
  const opacity = interpolate(
    frame,
    [
      subStartFrame,
      subStartFrame + fadeInFrames,
      subEndFrame - fadeOutFrames,
      subEndFrame,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.ease,
    }
  );

  // 上移动画: 从下方滑入
  const translateY = interpolate(
    frame,
    [subStartFrame, subStartFrame + fadeInFrames],
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
        bottom,
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
          fontSize,
          fontFamily,
          color: textColor,
          backgroundColor,
          padding: "16px 36px",
          borderRadius: 12,
          textAlign: "center",
          maxWidth,
          lineHeight: 1.5,
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          border: `1px solid ${brandColor}33`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {currentSubtitle.text}
      </div>
    </div>
  );
};

// ========== 工具函数 ==========

/**
 * 从 voiceover_metadata.json 生成字幕数组
 *
 * @param segments voiceover metadata 中的 segments 数组
 * @returns 字幕数组
 *
 * @example
 * import metadata from "../public/audio/voiceover_metadata.json";
 * const subtitles = createSubtitlesFromMetadata(metadata.segments);
 */
export const createSubtitlesFromMetadata = (
  segments: Array<{
    start_time: number;
    actual_duration: number;
    text: string;
  }>
): Subtitle[] => {
  return segments.map((segment) => ({
    start: segment.start_time,
    end: segment.start_time + segment.actual_duration,
    text: segment.text,
  }));
};

/**
 * 验证字幕时间是否与视频时长匹配
 *
 * @param subtitles 字幕数组
 * @param videoDuration 视频总时长 (秒)
 * @returns 验证结果
 */
export const validateSubtitleTiming = (
  subtitles: Subtitle[],
  videoDuration: number
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  subtitles.forEach((sub, index) => {
    // 检查字幕是否超出视频时长
    if (sub.end > videoDuration) {
      warnings.push(
        `字幕 ${index + 1} 结束时间 (${sub.end}s) 超出视频时长 (${videoDuration}s)`
      );
    }

    // 检查字幕顺序
    if (index > 0 && sub.start < subtitles[index - 1].end) {
      warnings.push(
        `字幕 ${index + 1} 与前一条字幕重叠`
      );
    }
  });

  return { valid: warnings.length === 0, warnings };
};
