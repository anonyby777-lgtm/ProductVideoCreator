/**
 * 多尺寸视频预设配置
 * 支持多平台视频输出
 */

export const VIDEO_PRESETS = {
  "1080p": { width: 1920, height: 1080, name: "Full HD", platform: "YouTube, 官网" },
  "720p": { width: 1280, height: 720, name: "HD", platform: "预览, 低带宽" },
  "vertical": { width: 1080, height: 1920, name: "Vertical", platform: "抖音, 小红书, Reels" },
  "square": { width: 1080, height: 1080, name: "Square", platform: "Instagram, 微信" },
  "4k": { width: 3840, height: 2160, name: "4K Ultra HD", platform: "高端展示" },
} as const;

export type VideoPreset = keyof typeof VIDEO_PRESETS;
export type PresetConfig = typeof VIDEO_PRESETS[VideoPreset];

/**
 * 获取预设配置
 */
export const getPreset = (preset: VideoPreset): PresetConfig => {
  return VIDEO_PRESETS[preset];
};

/**
 * 获取宽高比
 */
export const getAspectRatio = (preset: VideoPreset): number => {
  const config = VIDEO_PRESETS[preset];
  return config.width / config.height;
};

/**
 * 判断是否为竖屏
 */
export const isVertical = (preset: VideoPreset): boolean => {
  return getAspectRatio(preset) < 1;
};

/**
 * 判断是否为方形
 */
export const isSquare = (preset: VideoPreset): boolean => {
  return getAspectRatio(preset) === 1;
};

/**
 * 根据基准尺寸计算缩放后的字体大小
 * @param baseSize 1080p 下的基准字体大小
 * @param width 当前视频宽度
 * @param height 当前视频高度
 */
export const getResponsiveFontSize = (
  baseSize: number,
  width: number,
  height: number
): number => {
  // 以 1080p 为基准计算缩放比例
  const scale = Math.min(width / 1920, height / 1080);
  return Math.round(baseSize * scale);
};

/**
 * 根据宽高比获取布局配置
 */
export const getLayoutConfig = (width: number, height: number) => {
  const aspectRatio = width / height;

  // 竖屏布局 (9:16)
  if (aspectRatio < 1) {
    return {
      padding: "80px 60px",
      titleFontSize: getResponsiveFontSize(56, width, height),
      subtitleFontSize: getResponsiveFontSize(36, width, height),
      bodyFontSize: getResponsiveFontSize(32, width, height),
      logoSize: getResponsiveFontSize(280, width, height),
      yearFontSize: getResponsiveFontSize(120, width, height),
      flexDirection: "column" as const,
    };
  }

  // 方形布局 (1:1)
  if (Math.abs(aspectRatio - 1) < 0.01) {
    return {
      padding: "60px",
      titleFontSize: getResponsiveFontSize(64, width, height),
      subtitleFontSize: getResponsiveFontSize(40, width, height),
      bodyFontSize: getResponsiveFontSize(36, width, height),
      logoSize: getResponsiveFontSize(320, width, height),
      yearFontSize: getResponsiveFontSize(140, width, height),
      flexDirection: "column" as const,
    };
  }

  // 横屏布局 (16:9) - 包括 720p, 1080p, 4K
  return {
    padding: "60px 120px",
    titleFontSize: getResponsiveFontSize(72, width, height),
    subtitleFontSize: getResponsiveFontSize(48, width, height),
    bodyFontSize: getResponsiveFontSize(42, width, height),
    logoSize: getResponsiveFontSize(400, width, height),
    yearFontSize: getResponsiveFontSize(180, width, height),
    flexDirection: "row" as const,
  };
};
