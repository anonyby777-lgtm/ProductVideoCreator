/**
 * 场景时间配置 - 共享配置文件
 * 所有视频版本应引用此配置以保持一致性
 */

export interface SceneConfig {
  start: number;
  duration: number;
}

export interface ScenesConfig {
  opening: SceneConfig;
  founding: SceneConfig;
  gpu: SceneConfig;
  cuda: SceneConfig;
  ai: SceneConfig;
  closing: SceneConfig;
}

/**
 * NVIDIA 历程视频场景配置
 * - opening: 片头 Logo 展示
 * - founding: 创立故事
 * - gpu: GPU 革命
 * - cuda: CUDA 发布
 * - ai: AI 时代
 * - closing: 片尾
 */
export const SCENES: ScenesConfig = {
  opening: { start: 0, duration: 8 },
  founding: { start: 8, duration: 14 },
  gpu: { start: 22, duration: 16 },
  cuda: { start: 38, duration: 14 },
  ai: { start: 52, duration: 20 },
  closing: { start: 72, duration: 13 },
};

/** 视频总时长（秒） */
export const VIDEO_DURATION = 85;

/** 帧率 */
export const FPS = 30;

/** 视频总帧数 */
export const TOTAL_FRAMES = VIDEO_DURATION * FPS;

/**
 * 获取场景的帧范围
 */
export function getSceneFrameRange(scene: SceneConfig): {
  startFrame: number;
  endFrame: number;
  durationFrames: number;
} {
  return {
    startFrame: scene.start * FPS,
    endFrame: (scene.start + scene.duration) * FPS,
    durationFrames: scene.duration * FPS,
  };
}
