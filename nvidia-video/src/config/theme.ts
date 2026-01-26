/**
 * 主题颜色配置 - 共享配置文件
 * 所有视频版本应引用此配置以保持视觉一致性
 */

export interface ThemeConfig {
  /** NVIDIA 品牌绿色 */
  primary: string;
  /** 辅助蓝色 */
  secondary: string;
  /** 背景色 */
  background: string;
  /** 主要文字颜色 */
  text: string;
  /** 次要文字颜色 */
  muted: string;
  /** 渐变叠加层 */
  gradient: string;
}

/**
 * NVIDIA 品牌主题
 */
export const THEME: ThemeConfig = {
  primary: "#76B900",      // NVIDIA Green
  secondary: "#00A8E8",    // Tech Blue
  background: "#0a0a0a",   // Deep Black
  text: "#ffffff",         // White
  muted: "#888888",        // Gray
  gradient: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
};

/** NVIDIA 品牌绿色 - 向后兼容 */
export const NVIDIA_GREEN = THEME.primary;

/**
 * 生成发光效果样式
 */
export function getGlowStyle(color: string, intensity: number = 1): string {
  return `0 0 ${20 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}`;
}

/**
 * 生成文字阴影样式
 */
export function getTextShadowStyle(color: string): string {
  return `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`;
}
