/**
 * 组件模板统一导出
 *
 * 使用方法：
 * import {
 *   SubtitleDisplay,
 *   FadeInText,
 *   BigText,
 *   ParticleField,
 *   CodeRain,
 *   LogoWithGlow,
 *   DataCard,
 *   useResponsive,
 * } from "./components";
 */

// 字幕组件
export {
  SubtitleDisplay,
  createSubtitlesFromMetadata,
  validateSubtitleTiming,
} from "./SubtitleDisplay";
export type { SubtitleDisplayProps } from "./SubtitleDisplay";

// 动画文字组件
export {
  FadeInText,
  BigText,
  TypewriterText,
  GlowText,
  YearDisplay,
} from "./AnimatedText";
export type {
  FadeInTextProps,
  BigTextProps,
  TypewriterTextProps,
  GlowTextProps,
  YearDisplayProps,
} from "./AnimatedText";

// 背景效果组件
export {
  ParticleField,
  CodeRain,
  BackgroundWithOverlay,
  NeuralNetwork,
} from "./BackgroundEffects";
export type {
  ParticleFieldProps,
  CodeRainProps,
  BackgroundWithOverlayProps,
  NeuralNetworkProps,
} from "./BackgroundEffects";

// 品牌元素组件
export {
  LogoWithGlow,
  DataCard,
  BrandSlogan,
  StatRow,
} from "./BrandElements";
export type {
  LogoWithGlowProps,
  DataCardProps,
  BrandSloganProps,
  StatRowProps,
} from "./BrandElements";

// 响应式 Hook
export {
  useResponsive,
  selectByOrientation,
  createResponsiveStyles,
  isAtLeast,
  BREAKPOINTS,
} from "./useResponsive";
export type { ResponsiveContext } from "./useResponsive";
