/**
 * 响应式布局 Hook 模板
 *
 * 提供多尺寸视频的响应式支持：
 * - 自动检测视频尺寸和宽高比
 * - 根据尺寸计算合适的字体大小
 * - 提供布局配置 (padding, flexDirection 等)
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/hooks/ 或 src/components/ 目录
 * 2. 在组件中导入使用
 *
 * @example
 * import { useResponsive } from "./components/useResponsive";
 *
 * const MyComponent: React.FC = () => {
 *   const { width, height, layout, scale, isVertical } = useResponsive();
 *
 *   return (
 *     <div style={{
 *       padding: layout.padding,
 *       fontSize: scale(72), // 1080p 下为 72px，其他尺寸按比例缩放
 *     }}>
 *       Content
 *     </div>
 *   );
 * };
 */

import { useVideoConfig } from "remotion";
import { getLayoutConfig, getResponsiveFontSize } from "../config/videoPresets";

// ========== 类型定义 ==========

export interface ResponsiveContext {
  /** 视频宽度 (像素) */
  width: number;
  /** 视频高度 (像素) */
  height: number;
  /** 宽高比 */
  aspectRatio: number;
  /** 是否为竖屏 (宽高比 < 1) */
  isVertical: boolean;
  /** 是否为方形 (宽高比 ≈ 1) */
  isSquare: boolean;
  /** 是否为横屏 (宽高比 > 1) */
  isHorizontal: boolean;
  /** 布局配置 */
  layout: ReturnType<typeof getLayoutConfig>;
  /** 字体缩放函数 */
  scale: (baseSize: number) => number;
}

// ========== 主 Hook ==========

/**
 * 响应式布局 Hook
 *
 * 特点：
 * - 自动从 Remotion 获取当前视频尺寸
 * - 计算宽高比并判断屏幕方向
 * - 提供预配置的布局参数
 * - 提供便捷的字体缩放函数
 *
 * @returns ResponsiveContext 响应式上下文
 *
 * @example
 * const { width, height, layout, scale, isVertical } = useResponsive();
 *
 * // 使用布局配置
 * <div style={{ padding: layout.padding, flexDirection: layout.flexDirection }}>
 *
 * // 使用缩放函数
 * <span style={{ fontSize: scale(72) }}>Title</span>
 */
export const useResponsive = (): ResponsiveContext => {
  const { width, height } = useVideoConfig();

  // 计算宽高比
  const aspectRatio = width / height;

  // 判断屏幕方向
  const isVertical = aspectRatio < 1;
  const isSquare = Math.abs(aspectRatio - 1) < 0.01;
  const isHorizontal = aspectRatio > 1 && !isSquare;

  // 获取布局配置
  const layout = getLayoutConfig(width, height);

  // 字体缩放函数
  const scale = (baseSize: number) => getResponsiveFontSize(baseSize, width, height);

  return {
    width,
    height,
    aspectRatio,
    isVertical,
    isSquare,
    isHorizontal,
    layout,
    scale,
  };
};

// ========== 工具函数 ==========

/**
 * 根据屏幕方向选择值
 *
 * @param horizontal 横屏时的值
 * @param vertical 竖屏时的值
 * @param square 方形时的值 (可选，默认使用横屏值)
 *
 * @example
 * const { isVertical, isSquare } = useResponsive();
 * const padding = selectByOrientation(
 *   "60px 120px",  // 横屏
 *   "80px 60px",   // 竖屏
 *   "60px",        // 方形
 *   isVertical,
 *   isSquare
 * );
 */
export const selectByOrientation = <T>(
  horizontal: T,
  vertical: T,
  square: T | undefined,
  isVertical: boolean,
  isSquare: boolean
): T => {
  if (isSquare) return square ?? horizontal;
  if (isVertical) return vertical;
  return horizontal;
};

/**
 * 创建响应式样式对象
 *
 * @param baseStyles 基础样式
 * @param context 响应式上下文
 *
 * @example
 * const { layout, scale } = useResponsive();
 *
 * const styles = createResponsiveStyles({
 *   padding: layout.padding,
 *   fontSize: scale(72),
 *   gap: scale(40),
 * });
 */
export const createResponsiveStyles = <T extends React.CSSProperties>(
  baseStyles: T
): T => {
  return baseStyles;
};

// ========== 预设断点 ==========

/**
 * 常用视频尺寸断点
 *
 * 用于条件渲染或样式调整
 */
export const BREAKPOINTS = {
  /** 4K Ultra HD */
  "4k": { width: 3840, height: 2160 },
  /** Full HD 1080p */
  "1080p": { width: 1920, height: 1080 },
  /** HD 720p */
  "720p": { width: 1280, height: 720 },
  /** 竖屏 (抖音/Reels) */
  "vertical": { width: 1080, height: 1920 },
  /** 方形 (Instagram/微信) */
  "square": { width: 1080, height: 1080 },
} as const;

/**
 * 检查当前尺寸是否大于等于指定断点
 *
 * @param width 当前宽度
 * @param height 当前高度
 * @param breakpoint 断点名称
 *
 * @example
 * const { width, height } = useResponsive();
 * if (isAtLeast(width, height, "1080p")) {
 *   // 高清或更高分辨率
 * }
 */
export const isAtLeast = (
  width: number,
  height: number,
  breakpoint: keyof typeof BREAKPOINTS
): boolean => {
  const bp = BREAKPOINTS[breakpoint];
  const currentPixels = width * height;
  const breakpointPixels = bp.width * bp.height;
  return currentPixels >= breakpointPixels;
};
