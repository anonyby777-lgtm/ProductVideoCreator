# 产品介绍视频 Agent Skills

**[English](README.md)**

标准 Claude Code Skills 技能包，用于自动化生成产品介绍视频。基于 LDAP Manager 视频制作实践总结。

## 核心流程

```
分镜脚本 → 用户确认 → 录屏 → 配音生成 → 视频合成 → 验收
```

## 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| 视频合成 | Remotion | React-based 视频渲染框架 |
| 浏览器录屏 | Playwright | 自动化浏览器操作和录制 |
| 语音合成 | edge-tts | 免费中文女声配音 |
| 音视频处理 | FFmpeg | 音频合并、视频转码 |

## 项目结构

```
ProductVideoCreator/
├── .claude/
│   └── skills/                 # 标准 Claude Code 技能目录
│       ├── product-video/      # 主技能入口
│       │   └── SKILL.md
│       ├── storyboard/         # 分镜脚本技能
│       │   └── SKILL.md
│       ├── recording/          # 录屏技能
│       │   └── SKILL.md
│       ├── voiceover/          # 配音生成技能
│       │   └── SKILL.md
│       └── compositing/        # 视频合成技能
│           └── SKILL.md
├── templates/                  # 可复用模板
│   ├── storyboard-template.json
│   ├── recording-script.js
│   ├── voiceover-script.py
│   └── FinalVideo.tsx
└── examples/                   # 示例参考
    └── ldap-manager/           # LDAP Manager 视频示例
```

## 可用技能

| 技能 | 命令 | 说明 |
|------|------|------|
| product-video | `/product-video` | 视频制作主流程入口 |
| storyboard | `/storyboard` | 分镜脚本和配音文案设计 |
| recording | `/recording` | 浏览器自动化录屏 |
| voiceover | `/voiceover` | 中文配音生成与时间线同步 |
| compositing | `/compositing` | Remotion 视频合成 |

## 经验教训总结

### 1. 音画同步是核心难点

**问题**：配音和画面不同步，严重影响观感

**解决方案**：
- 录屏时记录精确时间线（每个操作的时间戳）
- 配音生成时根据时间线计算每段配音的起止时间
- 使用 FFmpeg `adelay` 滤镜精确定位配音位置

### 2. 必须先确认分镜再制作

**问题**：直接开始制作导致多次返工

**解决方案**：
- 制作详细的分镜脚本，包括：时间线、画面内容、操作步骤、配音文字
- 必须等用户确认分镜脚本后才开始录制
- 分镜变更需要重新确认

### 3. 单次连续录制优于多段剪辑

**问题**：多段录制难以保持时间连贯性

**解决方案**：
- 设计好完整的操作流程后一次性录制
- 录屏脚本包含时间线记录器
- 避免后期剪辑拼接

### 4. 时间偏移计算

**问题**：片头动画导致录屏内容时间偏移，配音对不上

**解决方案**：
```
最终视频时间 = 录屏时间 + 片头时长 + 功能展示时长
```
所有录屏相关的配音时间都需要加上偏移量。

### 5. 避免配音空白间隙

**问题**：配音段之间有长时间静默，观感不佳

**解决方案**：
- 检查配音时间线，确保覆盖整个视频
- 空白超过2秒的段落需要添加过渡说明
- 使用脚本自动检测空白间隙

```python
# 检测配音空白
for i in range(len(segments) - 1):
    gap = segments[i+1][0] - segments[i][1]
    if gap > 2:
        print(f"警告 空白: {segments[i][1]}s - {segments[i+1][0]}s")
```

### 6. 音量标准化

**问题**：不同配音片段音量不一致，前半段小后半段大

**解决方案**：渲染后使用 FFmpeg loudnorm 滤镜

```bash
ffmpeg -i video.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy output.mp4
```

### 7. 跳过录屏等待时间

**问题**：录屏开头有页面加载等待，观感拖沓

**解决方案**：使用 Remotion `startFrom` 跳过开头

```tsx
const DEMO_SKIP = 12 * FPS;  // 跳过 12 秒

<Video src={...} startFrom={DEMO_SKIP} />
```

**注意**：跳过后需重新计算配音时间线！
```
新公式: 录屏时间 - 跳过时间 + 前缀时长 = 最终时间
```

### 8. 视频结构标准化

推荐的产品介绍视频结构：

| 段落 | 时长 | 内容 |
|------|------|------|
| 片头 | 8-12秒 | Logo + 产品名 + 一句话定位 |
| 功能亮点 | 6-10秒 | 核心功能卡片展示 |
| 操作演示 | 60-120秒 | 完整功能演示录屏 |
| 片尾 | 8-12秒 | 口号 + 行动号召 |

## 安装使用

### 1. 将技能添加到你的项目

```bash
# 方式 A: 作为 submodule 添加
git submodule add https://github.com/MatrixReligio/ProductVideoCreator.git

# 方式 B: 复制 .claude/skills 到你的项目
cp -r ProductVideoCreator/.claude/skills .claude/
```

### 2. 安装依赖

**Node.js 依赖**

```bash
npm install remotion @remotion/cli @remotion/player @remotion/transitions playwright
```

**Python 依赖**

```bash
python -m venv venv
source venv/bin/activate
pip install edge-tts
```

**系统依赖**

```bash
# macOS
brew install ffmpeg

# 安装 Playwright 浏览器
npx playwright install chromium
```

## 使用方式

技能放入项目的 `.claude/skills/` 目录后，Claude Code 会自动发现并加载。

```bash
# 启动视频制作流程
/product-video 我的产品

# 或直接询问 Claude
"为我的 Web 应用创建一个产品介绍视频"
```

## 许可证

ISC
