import React from "react";
import { Composition } from "remotion";
import { NvidiaHistory } from "./NvidiaHistory";
import { NvidiaHistoryV2, nvidiaHistoryV2Config } from "./NvidiaHistoryV2";
import { NvidiaHistoryV3, nvidiaHistoryV3Config } from "./NvidiaHistoryV3";
import { FPS, VIDEO_DURATION } from "./config/scenes";
import { VIDEO_PRESETS, VideoPreset } from "./config/videoPresets";

const DURATION_SECONDS = VIDEO_DURATION;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== 原始版本 (1080p) ========== */}

      {/* V1 版本 */}
      <Composition
        id="NvidiaHistory"
        component={NvidiaHistory}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* V2 版本 - 优化后 */}
      <Composition
        id={nvidiaHistoryV2Config.id}
        component={nvidiaHistoryV2Config.component}
        durationInFrames={nvidiaHistoryV2Config.durationInFrames}
        fps={nvidiaHistoryV2Config.fps}
        width={nvidiaHistoryV2Config.width}
        height={nvidiaHistoryV2Config.height}
      />

      {/* V3 版本 - 字幕 + 高级动画 (默认 1080p) */}
      <Composition
        id={nvidiaHistoryV3Config.id}
        component={nvidiaHistoryV3Config.component}
        durationInFrames={nvidiaHistoryV3Config.durationInFrames}
        fps={nvidiaHistoryV3Config.fps}
        width={nvidiaHistoryV3Config.width}
        height={nvidiaHistoryV3Config.height}
      />

      {/* ========== V3 多尺寸版本 ========== */}
      {(Object.entries(VIDEO_PRESETS) as [VideoPreset, typeof VIDEO_PRESETS[VideoPreset]][]).map(
        ([key, preset]) => (
          <Composition
            key={`NvidiaHistoryV3-${key}`}
            id={`NvidiaHistoryV3-${key}`}
            component={NvidiaHistoryV3}
            durationInFrames={DURATION_SECONDS * FPS}
            fps={FPS}
            width={preset.width}
            height={preset.height}
          />
        )
      )}
    </>
  );
};
