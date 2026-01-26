/**
 * 类型定义 - 共享类型文件
 */

/**
 * 字幕数据结构
 */
export interface Subtitle {
  /** 开始时间（秒） */
  start: number;
  /** 结束时间（秒） */
  end: number;
  /** 字幕文本 */
  text: string;
}

/**
 * 粒子配置
 */
export interface ParticleConfig {
  /** 粒子数量 */
  count: number;
  /** 粒子颜色 */
  color: string;
  /** 最小尺寸 */
  minSize?: number;
  /** 最大尺寸 */
  maxSize?: number;
}

/**
 * 动画时间配置
 */
export interface AnimationTiming {
  /** 淡入帧数 */
  fadeInFrames: number;
  /** 淡出帧数 */
  fadeOutFrames: number;
  /** 延迟帧数 */
  delayFrames?: number;
}

/**
 * 默认动画时间配置
 */
export const DEFAULT_ANIMATION_TIMING: AnimationTiming = {
  fadeInFrames: 8,
  fadeOutFrames: 8,
  delayFrames: 0,
};
