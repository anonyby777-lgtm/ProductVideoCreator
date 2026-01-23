---
name: compositing
description: 使用 Remotion 合成最终视频，组合片头、录屏、配音和片尾。
---

# 视频合成技能

## Remotion 基础

Remotion 是 React-based 的视频渲染框架，使用 React 组件定义视频内容。

### 核心概念

| 概念 | 说明 |
|------|------|
| Composition | 视频组合定义（分辨率、帧率、时长） |
| Sequence | 时间序列，控制内容出现时机 |
| useCurrentFrame | 获取当前帧数 |
| interpolate | 数值插值，用于动画 |
| spring | 弹性动画 |

### 基本结构

```tsx
import { Composition } from "remotion";

export const RemotionRoot = () => {
  return (
    <Composition
      id="FinalVideo"
      component={FinalVideo}
      durationInFrames={3757}  // 125秒 * 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

## 视频组件模板

```tsx
import React from "react";
import {
  Audio,
  Video,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { OpeningScene } from "./scenes/OpeningScene";
import { FeatureCardsScene } from "./scenes/FeatureCardsScene";
import { ClosingScene } from "./scenes/ClosingScene";

const FPS = 30;

// 时间配置
const OPENING_START = 0;
const OPENING_DURATION = 10 * FPS;

const FEATURES_START = OPENING_DURATION;
const FEATURES_DURATION = 8 * FPS;

const DEMO_START = FEATURES_START + FEATURES_DURATION;
const DEMO_DURATION = Math.ceil(97.227 * FPS);

const CLOSING_START = DEMO_START + DEMO_DURATION;
const CLOSING_DURATION = 10 * FPS;

const TOTAL_FRAMES = CLOSING_START + CLOSING_DURATION;

export const FinalVideo: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <>
      {/* 同步配音 */}
      <Audio src={staticFile("audio/synced_voiceover.mp3")} volume={1} />

      {/* 片头动画 */}
      <Sequence from={OPENING_START} durationInFrames={OPENING_DURATION}>
        <OpeningScene />
      </Sequence>

      {/* 功能亮点 */}
      <Sequence from={FEATURES_START} durationInFrames={FEATURES_DURATION}>
        <FeatureCardsScene />
      </Sequence>

      {/* 演示录屏 */}
      <Sequence from={DEMO_START} durationInFrames={DEMO_DURATION}>
        <Video
          src={staticFile("recordings/full_demo.mp4")}
          style={{ width, height, objectFit: "contain" }}
        />
      </Sequence>

      {/* 片尾动画 */}
      <Sequence from={CLOSING_START} durationInFrames={CLOSING_DURATION}>
        <ClosingScene />
      </Sequence>
    </>
  );
};

export const finalVideoConfig = {
  id: "FinalVideo",
  component: FinalVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1920,
  height: 1080,
};
```

## 常用动画模式

### Logo 弹性缩放

```tsx
const logoScale = spring({
  frame,
  fps,
  config: { damping: 10, stiffness: 100 },
});

<div style={{ transform: `scale(${logoScale})` }}>🔐</div>
```

### 淡入效果

```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});
```

### 打字机效果

```tsx
const text = "一站式多节点账户管理平台";
const charsToShow = Math.floor(interpolate(frame, [0, 90], [0, text.length]));
const displayText = text.slice(0, charsToShow);
```

### 发光效果

```tsx
const glowIntensity = interpolate(
  Math.sin(frame * 0.1),
  [-1, 1],
  [0.3, 0.7]
);

<div style={{ filter: `drop-shadow(0 0 ${20 * glowIntensity}px #2563eb)` }}>
```

## 渲染命令

```bash
# 开发预览
npm run studio

# 渲染输出
npx remotion render src/index.ts FinalVideo out/final.mp4
```

## package.json 配置

```json
{
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "render:final": "remotion render src/index.ts FinalVideo out/final.mp4"
  },
  "dependencies": {
    "remotion": "^4.0.409",
    "@remotion/cli": "^4.0.409",
    "@remotion/player": "^4.0.409",
    "@remotion/transitions": "^4.0.409"
  }
}
```

## 项目文件结构

```
src/
├── index.ts              # 入口文件
├── Root.tsx              # Composition 定义
├── FinalVideo.tsx        # 主视频组件
├── scenes/
│   ├── OpeningScene.tsx  # 片头
│   ├── FeatureCardsScene.tsx
│   └── ClosingScene.tsx  # 片尾
├── components/
│   ├── Background.tsx
│   ├── AnimatedText.tsx
│   └── FeatureCard.tsx
└── utils/
    └── colors.ts         # 颜色配置
```

## 常见问题

### Chrome 下载失败

```bash
npx remotion browser ensure
```

### 视频文件找不到

确保文件在 `public/` 目录下，使用 `staticFile()` 引用

### 渲染内存不足

减少并发数：
```bash
npx remotion render ... --concurrency=4
```

### 字体不显示

确保字体已加载：
```tsx
import "@fontsource/noto-sans-sc";
```

或使用 Google Fonts：
```tsx
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
loadFont();
```

## 最终检查清单

- [ ] 音频文件存在且路径正确
- [ ] 视频文件存在且路径正确
- [ ] 时间线计算正确（总帧数 = 各段之和）
- [ ] 场景之间无缝隙
- [ ] 字体正确加载
- [ ] 渲染输出无错误
