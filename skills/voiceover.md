---
name: voiceover
description: 使用 edge-tts 生成中文配音，基于录屏时间线精确同步。
---

# 配音生成技能

## 技术选型

| 方案 | 优点 | 缺点 |
|------|------|------|
| edge-tts | 免费、音质好、支持中文 | 需要网络 |
| Azure TTS | 更多声音选择、更稳定 | 需要付费 |

**推荐**: edge-tts (zh-CN-XiaoxiaoNeural)

## 时间线计算

### 核心公式

```python
# 最终视频时间 = 录屏事件时间 + 偏移量
DEMO_START = OPENING_DURATION + FEATURES_DURATION
final_time = recording_time + DEMO_START
```

### 示例

```python
# 视频结构
OPENING_DURATION = 10   # 片头 10 秒
FEATURES_DURATION = 8   # 功能亮点 8 秒
DEMO_START = 18         # 录屏从第 18 秒开始

# 录屏时间线
# 录屏 20.8 秒：页面加载完成
# → 最终视频时间：20.8 + 18 = 38.8 秒

# 配音定义
VOICEOVER_SEGMENTS = [
    # 片头配音 (不需要偏移)
    (1.0, 5.0, "欢迎使用产品名"),

    # 演示配音 (需要加 DEMO_START 偏移)
    (38.8, 47.0, "在统计页面，您可以..."),
]
```

## 配音脚本模板

```python
#!/usr/bin/env python3
import asyncio
import edge_tts
import subprocess
from pathlib import Path

VOICE = "zh-CN-XiaoxiaoNeural"
OUTPUT_DIR = Path("public/audio")

# 配音段落定义
VOICEOVER_SEGMENTS = [
    # (开始时间, 结束时间, 配音文字)
    (1.0, 5.0, "配音内容"),
]

async def generate_segment(index, text, start, end):
    """生成单个配音片段"""
    output_file = OUTPUT_DIR / f"vo_{index:02d}.mp3"
    duration_target = end - start

    # 根据目标时长调整语速
    char_count = len(text.replace(" ", "").replace("，", "").replace("。", ""))
    natural_duration = char_count / 4.0  # 每秒约4个中文字

    if natural_duration > duration_target:
        rate_adjust = min(35, int((natural_duration / duration_target - 1) * 100))
        rate = f"+{rate_adjust}%"
    else:
        rate = "+0%"

    communicate = edge_tts.Communicate(text=text, voice=VOICE, rate=rate)
    await communicate.save(str(output_file))

    return {
        "file": output_file.name,
        "start_time": start,
        "actual_duration": get_audio_duration(output_file),
    }

def merge_with_timing(segments, total_duration):
    """按时间线合并音频"""
    filter_parts = []
    inputs = []

    for i, seg in enumerate(segments):
        inputs.extend(["-i", str(OUTPUT_DIR / seg["file"])])
        delay_ms = int(seg["start_time"] * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")

    mix_inputs = "".join([f"[a{i}]" for i in range(len(segments))])
    filter_parts.append(f"{mix_inputs}amix=inputs={len(segments)}:duration=longest[out]")

    subprocess.run([
        "ffmpeg", "-y", *inputs,
        "-filter_complex", "".join(filter_parts),
        "-map", "[out]",
        "-t", str(total_duration),
        str(OUTPUT_DIR / "synced_voiceover.mp3")
    ])
```

## 语速控制

### 语速计算

```python
# 中文语速约 4 字/秒
char_count = len(text)  # 不含标点
natural_duration = char_count / 4.0

# 需要的语速调整
if natural_duration > target_duration:
    rate = f"+{adjustment}%"  # 最多 +35%
elif natural_duration < target_duration * 0.7:
    rate = f"-{adjustment}%"  # 最多 -15%
```

### 建议

| 情况 | 处理方式 |
|------|----------|
| 配音太长 | 先精简文字，再考虑加速 |
| 配音太短 | 稍微减速，或延长画面 |
| 语速 > +35% | 必须精简文字 |

## FFmpeg 音频合并

### adelay 滤镜

```bash
# 单个音频延迟 5 秒
ffmpeg -i input.mp3 -af "adelay=5000|5000" output.mp3

# 多音频按时间点合并
ffmpeg -i vo_01.mp3 -i vo_02.mp3 -i vo_03.mp3 \
  -filter_complex \
  "[0:a]adelay=1000|1000[a0];\
   [1:a]adelay=5500|5500[a1];\
   [2:a]adelay=10500|10500[a2];\
   [a0][a1][a2]amix=inputs=3:duration=longest[out]" \
  -map "[out]" output.mp3
```

## 配音验证

### 检查清单

- [ ] 每段配音的实际时长 ≤ 目标时长
- [ ] 配音开始时间与画面事件匹配
- [ ] 无配音重叠
- [ ] 总时长与视频时长匹配

### 时长获取

```python
import subprocess

def get_audio_duration(file_path):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())
```

## 网络错误处理

edge-tts 依赖网络，需要重试机制：

```python
async def generate_with_retry(text, output_file, max_retries=3):
    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(text=text, voice=VOICE)
            await communicate.save(str(output_file))
            return True
        except Exception as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(2)
            else:
                print(f"生成失败: {e}")
                return False
```

## 跳过录屏开头的时间计算

如果使用 Remotion `startFrom` 跳过录屏开头的等待/加载时间：

```python
# 跳过录屏开头 12 秒
DEMO_SKIP = 12
DEMO_START = 18  # 片头 + 功能亮点

# 新公式：录屏时间 - 跳过时间 + 前缀时长 = 最终时间
# 简化：录屏时间 + (DEMO_START - DEMO_SKIP) = 录屏时间 + 6
final_time = recording_time - DEMO_SKIP + DEMO_START

# 示例：录屏 20.8 秒页面加载 → 最终视频 26.8 秒
# 20.8 - 12 + 18 = 26.8
```

## 避免配音空白间隙

**重要**: 确保配音段覆盖整个视频，不留空白！

### 问题示例

```python
# ❌ 错误：28-39秒有11秒空白
VOICEOVER_SEGMENTS = [
    (19.0, 28.0, "让我们来看看演示"),
    (39.0, 47.5, "统计页面展示..."),  # 中间11秒无配音！
]
```

### 解决方案

```python
# ✓ 正确：填补空白
VOICEOVER_SEGMENTS = [
    (19.0, 26.0, "让我们来看看演示"),
    (27.0, 38.0, "系统正在加载统计数据..."),  # 填补空白
    (39.0, 47.0, "统计页面展示..."),
]
```

### 检查方法

```python
# 检查配音段之间是否有大于2秒的空白
for i in range(len(segments) - 1):
    gap = segments[i+1][0] - segments[i][1]
    if gap > 2:
        print(f"⚠️ 空白: {segments[i][1]}s - {segments[i+1][0]}s ({gap}秒)")
```

## 音量标准化

配音合成后可能存在音量不一致问题（前半段小，后半段大），需要标准化：

### 使用 FFmpeg loudnorm

```bash
# 标准化到 -16 LUFS（广播标准）
ffmpeg -i input.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy output.mp4

# 参数说明：
# I=-16: 目标响度 (LUFS)
# TP=-1.5: 真峰值上限 (dB)
# LRA=11: 响度范围 (LU)
```

### 集成到渲染流程

```bash
# 1. 渲染原始视频
npx remotion render src/index.ts FinalVideo out/final_raw.mp4

# 2. 音量标准化
ffmpeg -i out/final_raw.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy out/final.mp4

# 3. 清理临时文件
rm out/final_raw.mp4
```

## 常见问题

### 配音和画面不同步

1. 检查时间偏移计算是否正确
2. 检查录屏时间线是否准确
3. 检查配音实际时长是否超出目标
4. **检查是否跳过了录屏开头**（需重新计算偏移）

### 配音语速过快/过慢

调整 rate 参数或精简/扩展文字

### 配音段之间有空白

检查时间线，确保配音段连续覆盖，必要时添加过渡说明

### 音量不一致

使用 FFmpeg loudnorm 滤镜标准化音量

### 网络连接失败

添加重试机制，或改用 Azure TTS
