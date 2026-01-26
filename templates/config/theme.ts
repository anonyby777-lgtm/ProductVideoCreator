/**
 * 主题颜色配置模板
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/config/ 目录
 * 2. 根据品牌色修改颜色值
 * 3. 在组件中导入使用
 *
 * @example
 * import { THEME, getGlowStyle } from "./config/theme";
 *
 * <div style={{ color: THEME.primary, ...getGlowStyle(THEME.primary, 0.8) }}>
 *   品牌文字
 * </div>
 */

// ========== 主题配置接口 ==========

export interface ThemeConfig {
  /** 主色调 (品牌色) */
  primary: string;
  /** 辅助色 */
  secondary: string;
  /** 背景色 */
  background: string;
  /** 主文字颜色 */
  text: string;
  /** 次要文字颜色 */
  muted: string;
  /** 渐变背景 */
  gradient: string;
}

// ========== 主题颜色 ==========

/**
 * 主题配置
 *
 * 修改说明：
 * - primary: 品牌主色，用于标题、高亮、发光效果
 * - secondary: 辅助色，用于次要元素
 * - background: 深色背景，建议使用深灰或黑色
 * - text: 主文字颜色，通常为白色
 * - muted: 次要文字颜色，用于描述、标签
 * - gradient: 渐变叠加层，用于背景图上方
 */
export const THEME: ThemeConfig = {
  primary: "#76B900",      // 修改为你的品牌色 (示例: NVIDIA Green)
  secondary: "#00A8E8",    // 辅助色 (示例: Tech Blue)
  background: "#0a0a0a",   // 深色背景
  text: "#ffffff",         // 主文字白色
  muted: "#888888",        // 次要文字灰色
  gradient: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
};

// ========== 样式工具函数 ==========

/**
 * 生成发光效果样式
 *
 * @param color 发光颜色
 * @param intensity 发光强度 (0-1)
 * @param blur 模糊半径基数 (默认 40)
 *
 * @example
 * const glowStyle = getGlowStyle(THEME.primary, 0.8);
 * // 返回: { filter: "drop-shadow(0 0 32px #76B900)" }
 */
export const getGlowStyle = (
  color: string,
  intensity: number = 0.5,
  blur: number = 40
) => ({
  filter: `drop-shadow(0 0 ${blur * intensity}px ${color})`,
});

/**
 * 生成文字阴影效果
 *
 * @param color 阴影颜色
 * @param intensity 强度 (0-1)
 *
 * @example
 * const shadowStyle = getTextShadowStyle(THEME.primary, 0.7);
 * // 返回: { textShadow: "0 0 42px #76B900" }
 */
export const getTextShadowStyle = (
  color: string,
  intensity: number = 0.5
) => ({
  textShadow: `0 0 ${60 * intensity}px ${color}`,
});

/**
 * 生成脉动发光强度值 (用于动画)
 *
 * @param frame 当前帧
 * @param speed 脉动速度 (默认 0.08)
 * @param min 最小强度 (默认 0.3)
 * @param max 最大强度 (默认 0.8)
 *
 * @example
 * const intensity = getPulseIntensity(frame, 0.08, 0.3, 0.8);
 * // 返回 0.3-0.8 之间的脉动值
 */
export const getPulseIntensity = (
  frame: number,
  speed: number = 0.08,
  min: number = 0.3,
  max: number = 0.8
): number => {
  const sin = Math.sin(frame * speed);
  return min + (max - min) * (sin + 1) / 2;
};

// ========== 常用颜色预设 ==========

/**
 * 常用品牌色参考
 */
export const BRAND_COLORS = {
  nvidia: "#76B900",
  google: "#4285F4",
  amazon: "#FF9900",
  apple: "#000000",
  microsoft: "#00A4EF",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  youtube: "#FF0000",
  tiktok: "#000000",
  wechat: "#07C160",
};
