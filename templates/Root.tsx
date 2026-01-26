/**
 * Root.tsx 多尺寸视频配置模板
 *
 * 使用方法：
 * 1. 复制此文件到项目的 src/ 目录
 * 2. 修改组件导入和配置
 * 3. 运行 npx remotion compositions 查看所有可用尺寸
 *
 * 渲染命令：
 * npx remotion render src/index.ts Video-1080p out/video_1080p.mp4
 * npx remotion render src/index.ts Video-4k out/video_4k.mp4
 * npx remotion render src/index.ts Video-vertical out/video_vertical.mp4
 */

import React from "react";
import { Composition } from "remotion";
import { FPS, VIDEO_DURATION } from "./config/scenes";
import { VIDEO_PRESETS, VideoPreset } from "./config/videoPresets";
// 导入你的主视频组件
// import { MainVideo } from "./MainVideo";

/**
 * 占位视频组件 (替换为你的实际组件)
 */
const PlaceholderVideo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#76B900",
        fontSize: 48,
        fontFamily: "sans-serif",
      }}
    >
      Replace with your video component
    </div>
  );
};

/**
 * Remotion Root 组件
 *
 * 自动为所有预设尺寸生成 Composition：
 * - Video-1080p (1920x1080)
 * - Video-720p (1280x720)
 * - Video-vertical (1080x1920)
 * - Video-square (1080x1080)
 * - Video-4k (3840x2160)
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== 默认版本 (1080p) ========== */}
      <Composition
        id="Video"
        component={PlaceholderVideo}  // 替换为你的组件: MainVideo
        durationInFrames={VIDEO_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* ========== 多尺寸版本 (自动生成) ========== */}
      {(Object.entries(VIDEO_PRESETS) as [VideoPreset, typeof VIDEO_PRESETS[VideoPreset]][]).map(
        ([key, preset]) => (
          <Composition
            key={`Video-${key}`}
            id={`Video-${key}`}
            component={PlaceholderVideo}  // 替换为你的组件: MainVideo
            durationInFrames={VIDEO_DURATION * FPS}
            fps={FPS}
            width={preset.width}
            height={preset.height}
            defaultProps={{
              preset: key as VideoPreset,
            }}
          />
        )
      )}
    </>
  );
};

/**
 * 批量渲染脚本示例 (render_all_sizes.sh)
 *
 * #!/bin/bash
 * SIZES=("1080p" "720p" "vertical" "square" "4k")
 * OUTPUT_DIR="out"
 *
 * for size in "${SIZES[@]}"; do
 *   echo "渲染 $size..."
 *   npx remotion render src/index.ts "Video-$size" "$OUTPUT_DIR/video_$size.mp4"
 * done
 *
 * echo "所有尺寸渲染完成!"
 */
