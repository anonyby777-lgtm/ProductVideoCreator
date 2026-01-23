import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Video,
  Sequence,
  staticFile,
  interpolate,
  spring,
} from "remotion";
import { OpeningScene } from "./scenes/OpeningScene";
import { FeatureCardsScene } from "./scenes/FeatureCardsScene";
import { ClosingScene } from "./scenes/ClosingScene";

// 视频时间配置 (帧数, 30fps)
const FPS = 30;

// 片头：10秒
const OPENING_START = 0;
const OPENING_DURATION = 10 * FPS; // 300帧

// 功能亮点：8秒
const FEATURES_START = OPENING_DURATION;
const FEATURES_DURATION = 8 * FPS; // 240帧

// 演示录屏：97.227秒
const DEMO_START = FEATURES_START + FEATURES_DURATION;
const DEMO_DURATION = Math.ceil(97.227 * FPS); // 2917帧

// 片尾：10秒
const CLOSING_START = DEMO_START + DEMO_DURATION;
const CLOSING_DURATION = 10 * FPS; // 300帧

// 总帧数
const TOTAL_FRAMES = CLOSING_START + CLOSING_DURATION;

// 主视频组件
export const FinalVideo: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <>
      {/* 同步配音 */}
      <Audio
        src={staticFile("audio/synced_voiceover.mp3")}
        volume={1}
      />

      {/* 片头动画 */}
      <Sequence from={OPENING_START} durationInFrames={OPENING_DURATION}>
        <OpeningScene />
      </Sequence>

      {/* 功能亮点展示 */}
      <Sequence from={FEATURES_START} durationInFrames={FEATURES_DURATION}>
        <FeatureCardsScene />
      </Sequence>

      {/* 演示录屏 */}
      <Sequence from={DEMO_START} durationInFrames={DEMO_DURATION}>
        <Video
          src={staticFile("recordings/full_demo_v3.mp4")}
          style={{
            width,
            height,
            objectFit: "contain",
            backgroundColor: "#0f172a",
          }}
        />
      </Sequence>

      {/* 片尾动画 */}
      <Sequence from={CLOSING_START} durationInFrames={CLOSING_DURATION}>
        <ClosingScene />
      </Sequence>
    </>
  );
};

// 导出视频配置
export const finalVideoConfig = {
  id: "FinalVideo",
  component: FinalVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1920,
  height: 1080,
};
