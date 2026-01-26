/**
 * 通用类型定义模板
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/config/ 目录
 * 2. 根据需要添加项目特定的类型
 * 3. 在组件中导入使用
 *
 * @example
 * import type { Subtitle, AnimationTiming } from "./config/types";
 */

// ========== 字幕类型 ==========

/**
 * 字幕数据结构
 *
 * 注意：
 * - start 和 end 时间应基于 voiceover_metadata.json 的实际时长
 * - end = start + actual_duration (从 metadata 获取)
 *
 * @example
 * const subtitles: Subtitle[] = [
 *   { start: 0.5, end: 6.764, text: "第一段字幕内容" },
 *   { start: 8.5, end: 20.308, text: "第二段字幕内容" },
 * ];
 */
export interface Subtitle {
  /** 开始时间 (秒) */
  start: number;
  /** 结束时间 (秒) - 应等于 start + actual_duration */
  end: number;
  /** 字幕文本 */
  text: string;
}

// ========== 动画类型 ==========

/**
 * 动画时间配置
 */
export interface AnimationTiming {
  /** 延迟开始 (帧) */
  delay: number;
  /** 持续时间 (帧) */
  duration: number;
}

/**
 * 默认动画时间
 */
export const DEFAULT_ANIMATION_TIMING: AnimationTiming = {
  delay: 0,
  duration: 30, // 1秒 at 30fps
};

// ========== 粒子配置类型 ==========

/**
 * 粒子效果配置
 */
export interface ParticleConfig {
  /** 粒子数量 */
  count: number;
  /** 粒子颜色 */
  color: string;
  /** 最小尺寸 */
  minSize: number;
  /** 最大尺寸 */
  maxSize: number;
  /** 最小速度 */
  minSpeed: number;
  /** 最大速度 */
  maxSpeed: number;
  /** 最小透明度 */
  minOpacity: number;
  /** 最大透明度 */
  maxOpacity: number;
}

/**
 * 默认粒子配置
 */
export const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
  count: 50,
  color: "#76B900",
  minSize: 2,
  maxSize: 6,
  minSpeed: 0.2,
  maxSpeed: 0.5,
  minOpacity: 0.1,
  maxOpacity: 0.4,
};

// ========== 代码雨配置类型 ==========

/**
 * 代码雨效果配置
 *
 * 注意：生成字符时必须使用 useMemo + seeded random 防止闪烁
 *
 * @example
 * const codeLines = useMemo(() => {
 *   const seededRandom = (seed: number) => {
 *     const x = Math.sin(seed * 9999) * 10000;
 *     return x - Math.floor(x);
 *   };
 *   return Array.from({ length: config.lineCount }, (_, i) => ({
 *     chars: Array.from({ length: 25 }, (_, j) =>
 *       String.fromCharCode(0x30A0 + Math.floor(seededRandom(i * 100 + j) * 96))
 *     ).join(""),
 *   }));
 * }, []);
 */
export interface CodeRainConfig {
  /** 代码行数量 */
  lineCount: number;
  /** 每行字符数 */
  charsPerLine: number;
  /** 字符集类型 */
  charSet: "binary" | "katakana" | "hex";
  /** 最小速度 */
  minSpeed: number;
  /** 最大速度 */
  maxSpeed: number;
  /** 颜色 */
  color: string;
}

/**
 * 默认代码雨配置
 */
export const DEFAULT_CODE_RAIN_CONFIG: CodeRainConfig = {
  lineCount: 25,
  charsPerLine: 25,
  charSet: "katakana",
  minSpeed: 1.5,
  maxSpeed: 3.0,
  color: "#76B900",
};

// ========== 配音元数据类型 ==========

/**
 * 配音片段元数据
 * 对应 voiceover_metadata.json 中的结构
 */
export interface VoiceoverSegment {
  index: number;
  file: string;
  start_time: number;
  target_duration: number;
  actual_duration: number;
  text: string;
  full_text: string;
  char_count: number;
  rate: string;
}

/**
 * 配音元数据文件结构
 */
export interface VoiceoverMetadata {
  version: string;
  voice: string;
  total_duration: number;
  segments: VoiceoverSegment[];
  validation_passed: boolean;
}

// ========== 视频预设类型 ==========

/**
 * 视频尺寸预设
 */
export interface VideoPresetConfig {
  width: number;
  height: number;
  name: string;
  platform: string;
}

/**
 * 响应式布局配置
 */
export interface ResponsiveLayoutConfig {
  padding: string;
  titleFontSize: number;
  subtitleFontSize: number;
  bodyFontSize: number;
  logoSize: number;
  yearFontSize: number;
  flexDirection: "row" | "column";
  subtitleBottom: number;
  subtitleMaxWidth: string;
}
