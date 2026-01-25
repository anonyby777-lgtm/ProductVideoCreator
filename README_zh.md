# 产品视频生成 Agent Skills

**[English](README.md)**

标准 Claude Code Skills 技能包，用于自动化生成产品介绍视频。支持三种视频类型：录屏演示、图文展示、混合制作。

## 核心特性

- **多种视频类型** - 录屏演示型、图文展示型、混合型
- **分镜先行** - 制作前必须获得用户确认
- **多语言配音** - 中文（5种声音）+ 英文（6种声音），自动语速计算
- **背景音乐** - 免版权 BGM，场景感知动态音量，淡入淡出效果
- **自动字幕** - 解析配音文案，生成同步字幕
- **多尺寸模板** - 1080p、720p、竖屏 (9:16)、方形 (1:1)
- **配音验证** - 自动检测时长超出、片段重叠、空白间隙
- **高级动画** - 弹性物理动画、发光效果、粒子系统
- **专业合成** - 基于 Remotion 的视频渲染

## 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| 视频合成 | Remotion | React-based 视频渲染框架 |
| 浏览器录屏 | Playwright | 自动化浏览器操作和录制 |
| 语音合成 | edge-tts | 多语言配音（11种声音） |
| 音视频处理 | FFmpeg | 音频合并、时间定位、音量标准化 |
| 字体渲染 | @remotion/google-fonts | 统一中文字体显示 |

## 项目结构

```
ProductVideoCreator/
├── .claude/
│   └── skills/                 # 标准 Claude Code 技能目录
│       ├── product-video/      # 主技能入口
│       ├── storyboard/         # 分镜脚本技能
│       ├── recording/          # 录屏技能
│       ├── voiceover/          # 多语言配音生成
│       ├── bgm/                # 背景音乐
│       ├── subtitles/          # 自动字幕生成
│       ├── compositing/        # 视频合成 + 多尺寸
│       └── asset-collection/   # 素材收集
├── templates/                  # 可复用模板
└── nvidia-video/               # 示例：NVIDIA 公司历程视频
    ├── src/                    # V1、V2、V3 视频组件
    ├── public/images/          # 收集的素材
    └── V3_COMPARISON_REPORT.md # V1 vs V2 vs V3 对比分析
```

## 可用技能

| 技能 | 命令 | 说明 |
|------|------|------|
| product-video | `/product-video` | 主入口 - 支持 demo/slideshow/mixed 类型 |
| storyboard | `/storyboard` | 分镜脚本和配音文案设计 |
| recording | `/recording` | 浏览器自动化录屏 |
| voiceover | `/voiceover` | 多语言配音 (中/英) + 自动验证 |
| bgm | `/bgm` | 背景音乐 + 场景感知音量控制 |
| subtitles | `/subtitles` | 自动字幕生成 |
| compositing | `/compositing` | 视频合成 + 多尺寸模板 |
| asset-collection | `/asset-collection` | 从免版权网站收集素材 |

## 视频类型

| 类型 | 适用场景 | 核心素材 |
|------|----------|----------|
| **Demo 录屏型** | 软件教程、功能演示 | Playwright 录屏 |
| **Slideshow 图文型** | 公司介绍、产品历程 | 图片 + 文字动画 |
| **Mixed 混合型** | 产品宣传片 | 录屏 + 图片 + 动画 |

## 声音选择

### 中文声音 (zh-CN)

| 声音 ID | 性别 | 风格 | 适用场景 |
|---------|------|------|----------|
| XiaoxiaoNeural | 女 | 温暖亲切 | 产品介绍、教程 |
| YunxiNeural | 男 | 专业稳重 | 企业宣传、正式场合 |
| **YunjianNeural** | 男 | 激情活力 | 科技发布、激励视频 |
| XiaoyiNeural | 女 | 年轻活泼 | 创意内容、轻松主题 |
| YunyangNeural | 男 | 新闻播报 | 资讯类、严肃主题 |

### 英文声音 (en-US)

| 声音 ID | 性别 | 风格 | 适用场景 |
|---------|------|------|----------|
| GuyNeural | 男 | 专业稳重 | 企业宣传、产品介绍 |
| JennyNeural | 女 | 温暖友好 | 教程、客户服务 |
| **JasonNeural** | 男 | 激情活力 | 科技发布、激励视频 |
| AriaNeural | 女 | 清晰专业 | 新闻、正式场合 |
| DavisNeural | 男 | 年轻活力 | 科技内容、创意视频 |
| SaraNeural | 女 | 年轻活泼 | 社交媒体、轻松主题 |

## 视频尺寸模板

| 尺寸 | 分辨率 | 比例 | 适用平台 |
|------|--------|------|----------|
| 1080p | 1920×1080 | 16:9 | YouTube, 官网 |
| 720p | 1280×720 | 16:9 | 快速预览, 低带宽 |
| vertical | 1080×1920 | 9:16 | 抖音, 小红书, Reels |
| square | 1080×1080 | 1:1 | Instagram, 微信 |

## 配音验证机制

工具包自动验证配音时间线：

- **时长检查**: 实际时长 ≤ 目标时长 + 0.5s
- **重叠检测**: 相邻片段不重叠
- **空白检测**: 间隙 > 3s 时警告
- **边界检查**: 总时长 ≤ 视频时长

```
============================================================
                         配音验证报告
============================================================
片段          开始      目标时长      实际时长          状态
------------------------------------------------------------
  0      0.5s     7.0s       6.3s        OK
  1      8.5s    13.0s      11.8s        OK
  ...
------------------------------------------------------------
验证通过
============================================================
```

## 示例项目

`nvidia-video/` 目录包含完整的 NVIDIA 公司历程视频示例：

- **V1 版本**: 基础实现（评分: 6.6/10）
- **V2 版本**: 优化版 - YunjianNeural 声音、粒子效果、发光动画（评分: 8.6/10）
- **V3 版本**: 完整版 - 字幕、BGM、增强动画（评分: 9.1/10）
- **提升 38%** (V1→V3) - 通过技能优化实现

详见 `nvidia-video/V3_COMPARISON_REPORT.md` 对比分析报告。

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
npm install remotion @remotion/cli @remotion/player @remotion/google-fonts playwright
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
npx playwright install chromium
```

## 使用方式

技能放入项目的 `.claude/skills/` 目录后，Claude Code 会自动发现并加载。

```bash
# 创建录屏演示视频
/product-video 我的应用 demo

# 创建图文展示视频
/product-video "公司历程" slideshow

# 或直接询问 Claude
"为我的 Web 应用创建一个产品介绍视频"
```

## 工作流程

```
┌─────────────────────────────────────────────────────┐
│  阶段一: 分镜设计                                     │
│  └── 必须等待用户确认后才能继续                        │
├─────────────────────────────────────────────────────┤
│  阶段二: 素材准备                                     │
│  ├── [demo] Playwright 浏览器录屏                    │
│  ├── [slideshow] 素材收集                            │
│  └── [mixed] 录屏 + 素材收集                         │
├─────────────────────────────────────────────────────┤
│  阶段三: 配音生成                                     │
│  ├── 选择声音生成 TTS                                │
│  └── 自动验证配音时间线                               │
├─────────────────────────────────────────────────────┤
│  阶段四: 视频合成                                     │
│  ├── Remotion 渲染 + 动画效果                        │
│  └── 音量标准化后处理                                 │
├─────────────────────────────────────────────────────┤
│  阶段五: 验收交付                                     │
└─────────────────────────────────────────────────────┘
```

## 许可证

ISC
