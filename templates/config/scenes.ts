/**
 * 场景时间配置模板
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/config/ 目录
 * 2. 根据你的视频内容修改场景配置
 * 3. 在组件中导入使用
 *
 * @example
 * import { SCENES, FPS, VIDEO_DURATION } from "./config/scenes";
 *
 * <Sequence
 *   from={SCENES.opening.start * FPS}
 *   durationInFrames={SCENES.opening.duration * FPS}
 * >
 *   <OpeningScene />
 * </Sequence>
 */

// ========== 基础配置 ==========

/** 视频帧率 */
export const FPS = 30;

/** 视频总时长 (秒) */
export const VIDEO_DURATION = 85;

/** 总帧数 */
export const TOTAL_FRAMES = VIDEO_DURATION * FPS;

// ========== 场景配置接口 ==========

export interface SceneConfig {
  /** 开始时间 (秒) */
  start: number;
  /** 持续时间 (秒) */
  duration: number;
}

export interface ScenesConfig {
  [key: string]: SceneConfig;
}

// ========== 场景时间配置 ==========

/**
 * 场景时间配置
 *
 * 注意：
 * - 确保场景之间无缝隙 (前一场景的 start + duration = 下一场景的 start)
 * - 所有场景的总时长应等于 VIDEO_DURATION
 */
export const SCENES: ScenesConfig = {
  opening: { start: 0, duration: 8 },      // 0-8s: 片头
  scene1: { start: 8, duration: 14 },      // 8-22s: 场景1
  scene2: { start: 22, duration: 16 },     // 22-38s: 场景2
  scene3: { start: 38, duration: 14 },     // 38-52s: 场景3
  scene4: { start: 52, duration: 20 },     // 52-72s: 场景4
  closing: { start: 72, duration: 13 },    // 72-85s: 片尾
};

// ========== 工具函数 ==========

/**
 * 获取场景的帧范围
 *
 * @example
 * const { startFrame, endFrame } = getSceneFrameRange('opening');
 * // startFrame: 0, endFrame: 240
 */
export const getSceneFrameRange = (sceneName: keyof typeof SCENES) => {
  const scene = SCENES[sceneName];
  return {
    startFrame: scene.start * FPS,
    endFrame: (scene.start + scene.duration) * FPS,
    durationFrames: scene.duration * FPS,
  };
};

/**
 * 验证场景配置是否正确
 * - 检查场景是否连续无缝隙
 * - 检查总时长是否正确
 */
export const validateScenes = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const sceneNames = Object.keys(SCENES);

  // 检查场景连续性
  for (let i = 0; i < sceneNames.length - 1; i++) {
    const current = SCENES[sceneNames[i]];
    const next = SCENES[sceneNames[i + 1]];
    const expectedStart = current.start + current.duration;

    if (next.start !== expectedStart) {
      errors.push(
        `场景 "${sceneNames[i]}" 和 "${sceneNames[i + 1]}" 之间有缝隙: ` +
        `预期开始时间 ${expectedStart}s, 实际 ${next.start}s`
      );
    }
  }

  // 检查总时长
  const lastScene = SCENES[sceneNames[sceneNames.length - 1]];
  const totalDuration = lastScene.start + lastScene.duration;

  if (totalDuration !== VIDEO_DURATION) {
    errors.push(
      `总时长不匹配: 预期 ${VIDEO_DURATION}s, 实际 ${totalDuration}s`
    );
  }

  return { valid: errors.length === 0, errors };
};
