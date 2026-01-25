import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const FPS = 30;

// 场景时间配置 (秒)
const SCENES = {
  opening: { start: 0, duration: 8 },
  founding: { start: 8, duration: 14 },
  gpu: { start: 22, duration: 16 },
  cuda: { start: 38, duration: 14 },
  ai: { start: 52, duration: 20 },
  closing: { start: 72, duration: 13 },
};

// NVIDIA 绿色
const NVIDIA_GREEN = "#76B900";
const DARK_BG = "#0a0a0a";

// ========== 场景组件 ==========

// 场景1: 片头
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${NVIDIA_GREEN})`,
          marginBottom: 40,
        }}
      >
        <Img
          src={staticFile("images/nvidia_logo.png")}
          style={{ width: 400, height: "auto" }}
        />
      </div>

      {/* 主标题 */}
      <h1
        style={{
          color: "white",
          fontSize: 72,
          fontWeight: "bold",
          opacity: titleOpacity,
          marginBottom: 20,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        从车库到万亿帝国
      </h1>

      {/* 副标题 */}
      <h2
        style={{
          color: NVIDIA_GREEN,
          fontSize: 42,
          opacity: subtitleOpacity,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        NVIDIA 三十年传奇
      </h2>
    </AbsoluteFill>
  );
};

// 场景2: 创始时期 1993
const FoundingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const yearScale = spring({
    frame,
    fps: FPS,
    config: { damping: 15, stiffness: 80 },
  });

  const contentOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* 背景图 */}
      <Img
        src={staticFile("images/circuit_board.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.2,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {/* 年份 */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 150,
            transform: `scale(${yearScale})`,
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: "bold",
              color: NVIDIA_GREEN,
              fontFamily: "system-ui, sans-serif",
              textShadow: `0 0 60px ${NVIDIA_GREEN}`,
            }}
          >
            1993
          </span>
        </div>

        {/* 内容 */}
        <div
          style={{
            opacity: contentOpacity,
            marginTop: 200,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 48,
              color: "white",
              maxWidth: 1200,
              lineHeight: 1.6,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            三位工程师在餐厅相遇
          </p>
          <p
            style={{
              fontSize: 36,
              color: "#aaa",
              marginTop: 30,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            启动资金: $40,000
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景3: GPU 时代 1999
const GpuScene: React.FC = () => {
  const frame = useCurrentFrame();

  const yearScale = spring({
    frame,
    fps: FPS,
    config: { damping: 15, stiffness: 80 },
  });

  const gpuTextOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gpuGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Img
        src={staticFile("images/gpu_card.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 年份 */}
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 100,
            transform: `scale(${yearScale})`,
          }}
        >
          <span
            style={{
              fontSize: 180,
              fontWeight: "bold",
              color: NVIDIA_GREEN,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            1999
          </span>
        </div>

        {/* GPU 大字 */}
        <div
          style={{
            opacity: gpuTextOpacity,
            filter: `drop-shadow(0 0 ${50 * gpuGlow}px ${NVIDIA_GREEN})`,
          }}
        >
          <span
            style={{
              fontSize: 300,
              fontWeight: "bold",
              color: "white",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            GPU
          </span>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: 150,
            fontSize: 42,
            color: "#ccc",
            opacity: gpuTextOpacity,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          GeForce 256 · 定义图形处理器
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景4: CUDA 革命 2006
const CudaScene: React.FC = () => {
  const frame = useCurrentFrame();

  const yearScale = spring({
    frame,
    fps: FPS,
    config: { damping: 15, stiffness: 80 },
  });

  const contentOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 代码行动画
  const codeLines = [
    "__global__ void compute() {",
    "  int idx = blockIdx.x * blockDim.x;",
    "  // Parallel processing...",
    "}",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 年份 */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 100,
            transform: `scale(${yearScale})`,
          }}
        >
          <span
            style={{
              fontSize: 160,
              fontWeight: "bold",
              color: NVIDIA_GREEN,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            2006
          </span>
        </div>

        {/* CUDA 标题 */}
        <div style={{ opacity: contentOpacity, textAlign: "center" }}>
          <h2
            style={{
              fontSize: 120,
              color: "white",
              marginBottom: 40,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            CUDA
          </h2>

          {/* 代码示意 */}
          <div
            style={{
              backgroundColor: "#0d0d1a",
              padding: 40,
              borderRadius: 20,
              border: `2px solid ${NVIDIA_GREEN}`,
            }}
          >
            {codeLines.map((line, i) => {
              const lineOpacity = interpolate(
                frame,
                [60 + i * 15, 75 + i * 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <p
                  key={i}
                  style={{
                    fontSize: 32,
                    color: "#00ff88",
                    fontFamily: "monospace",
                    opacity: lineOpacity,
                    textAlign: "left",
                    margin: "10px 0",
                  }}
                >
                  {line}
                </p>
              );
            })}
          </div>

          <p
            style={{
              fontSize: 36,
              color: "#aaa",
              marginTop: 40,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            GPU 通用计算革命
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景5: AI 时代 2020-2024
const AiScene: React.FC = () => {
  const frame = useCurrentFrame();

  const yearScale = spring({
    frame,
    fps: FPS,
    config: { damping: 15, stiffness: 80 },
  });

  const trillionOpacity = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trillionScale = spring({
    frame: Math.max(0, frame - 180),
    fps: FPS,
    config: { damping: 10, stiffness: 80 },
  });

  const percentOpacity = interpolate(frame, [360, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Img
        src={staticFile("images/datacenter.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 年份 */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 80,
            transform: `scale(${yearScale})`,
          }}
        >
          <span
            style={{
              fontSize: 120,
              fontWeight: "bold",
              color: NVIDIA_GREEN,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            2020-2024
          </span>
        </div>

        {/* 万亿美元 */}
        <div
          style={{
            opacity: trillionOpacity,
            transform: `scale(${trillionScale})`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: "bold",
              color: "white",
              fontFamily: "system-ui, sans-serif",
              textShadow: `0 0 80px ${NVIDIA_GREEN}`,
            }}
          >
            $1万亿
          </span>
          <p
            style={{
              fontSize: 48,
              color: NVIDIA_GREEN,
              marginTop: 20,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            全球首家万亿市值芯片公司
          </p>
        </div>

        {/* 80% */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            opacity: percentOpacity,
          }}
        >
          <span
            style={{
              fontSize: 72,
              color: "white",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            全球{" "}
            <span style={{ color: NVIDIA_GREEN, fontSize: 96 }}>80%</span> AI
            计算
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 场景6: 片尾
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.4, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${DARK_BG} 0%, #1a2f00 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${60 * glowIntensity}px ${NVIDIA_GREEN})`,
          marginBottom: 60,
        }}
      >
        <Img
          src={staticFile("images/nvidia_logo.png")}
          style={{ width: 500, height: "auto" }}
        />
      </div>

      {/* 结语 */}
      <p
        style={{
          fontSize: 48,
          color: "white",
          opacity: textOpacity,
          textAlign: "center",
          maxWidth: 1000,
          lineHeight: 1.6,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        用芯片重新定义未来
      </p>

      {/* 数据展示 */}
      <div
        style={{
          display: "flex",
          gap: 100,
          marginTop: 60,
          opacity: textOpacity,
        }}
      >
        {[
          { label: "创立", value: "1993" },
          { label: "GPU", value: "1999" },
          { label: "市值", value: "$3万亿+" },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 56,
                color: NVIDIA_GREEN,
                fontWeight: "bold",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                fontSize: 28,
                color: "#888",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ========== 主视频组件 ==========
export const NvidiaHistory: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 配音音轨 */}
      <Audio src={staticFile("audio/synced_voiceover.mp3")} volume={1} />

      {/* 场景1: 片头 */}
      <Sequence
        from={SCENES.opening.start * FPS}
        durationInFrames={SCENES.opening.duration * FPS}
      >
        <OpeningScene />
      </Sequence>

      {/* 场景2: 创始 1993 */}
      <Sequence
        from={SCENES.founding.start * FPS}
        durationInFrames={SCENES.founding.duration * FPS}
      >
        <FoundingScene />
      </Sequence>

      {/* 场景3: GPU 1999 */}
      <Sequence
        from={SCENES.gpu.start * FPS}
        durationInFrames={SCENES.gpu.duration * FPS}
      >
        <GpuScene />
      </Sequence>

      {/* 场景4: CUDA 2006 */}
      <Sequence
        from={SCENES.cuda.start * FPS}
        durationInFrames={SCENES.cuda.duration * FPS}
      >
        <CudaScene />
      </Sequence>

      {/* 场景5: AI 时代 */}
      <Sequence
        from={SCENES.ai.start * FPS}
        durationInFrames={SCENES.ai.duration * FPS}
      >
        <AiScene />
      </Sequence>

      {/* 场景6: 片尾 */}
      <Sequence
        from={SCENES.closing.start * FPS}
        durationInFrames={SCENES.closing.duration * FPS}
      >
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
