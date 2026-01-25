import React from "react";
import { Composition } from "remotion";
import { NvidiaHistory } from "./NvidiaHistory";
import { NvidiaHistoryV2, nvidiaHistoryV2Config } from "./NvidiaHistoryV2";
import { NvidiaHistoryV3, nvidiaHistoryV3Config } from "./NvidiaHistoryV3";

const FPS = 30;
const DURATION_SECONDS = 85;

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      {/* V3 版本 - 字幕 + 高级动画 */}
      <Composition
        id={nvidiaHistoryV3Config.id}
        component={nvidiaHistoryV3Config.component}
        durationInFrames={nvidiaHistoryV3Config.durationInFrames}
        fps={nvidiaHistoryV3Config.fps}
        width={nvidiaHistoryV3Config.width}
        height={nvidiaHistoryV3Config.height}
      />
    </>
  );
};
