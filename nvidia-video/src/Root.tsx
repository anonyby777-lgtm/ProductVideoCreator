import React from "react";
import { Composition } from "remotion";
import { NvidiaHistory } from "./NvidiaHistory";
import { NvidiaHistoryV2, nvidiaHistoryV2Config } from "./NvidiaHistoryV2";

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
    </>
  );
};
