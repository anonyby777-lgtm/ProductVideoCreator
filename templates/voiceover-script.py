#!/usr/bin/env python3
"""
产品视频配音生成脚本模板
使用 edge-tts 生成中文配音，基于录屏时间线精确同步

使用方法:
1. 复制此文件到项目的 scripts/ 目录
2. 创建 Python 虚拟环境: python -m venv venv
3. 激活并安装依赖: source venv/bin/activate && pip install edge-tts
4. 修改配音段落定义
5. 运行: python scripts/generate_voiceover.py
"""

import asyncio
import edge_tts
import json
import subprocess
from pathlib import Path

# ============ 配置区 ============

# 语音配置
VOICE = "zh-CN-XiaoxiaoNeural"  # 中文女声，自然亲切

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"

# 时间线配置（秒）
# 根据实际视频结构调整
OPENING_START = 0
OPENING_DURATION = 10
FEATURES_START = 10
FEATURES_DURATION = 8
DEMO_START = 18  # 片头 + 功能亮点 = 18秒
DEMO_DURATION = 80  # 根据实际录屏时长调整
CLOSING_START = DEMO_START + DEMO_DURATION
CLOSING_DURATION = 10
TOTAL_DURATION = CLOSING_START + CLOSING_DURATION

# ============ 配音段落定义 ============

# 格式: (开始时间秒, 结束时间秒, 配音文字)
# 注意: 演示部分的时间需要加上 DEMO_START 偏移

VOICEOVER_SEGMENTS = [
    # ========== 片头 (0-10秒) ==========
    (1.0, 5.0, "欢迎使用 [产品名]"),
    (5.5, 9.5, "[一句话定位]"),

    # ========== 功能亮点 (10-18秒) ==========
    (10.5, 17.5, "我们为您提供强大的[功能]，让[场景]变得轻松高效"),

    # ========== 演示部分 (18-98秒) ==========
    # 时间 = 录屏时间 + DEMO_START (18秒)

    # TODO: 根据录屏时间线填写配音段落
    # 示例:
    # (20.0, 30.0, "在[页面名]页面，您可以..."),
    # (35.0, 45.0, "[功能描述]..."),

    # ========== 片尾 (98-108秒) ==========
    (CLOSING_START + 1, CLOSING_START + 9, "[产品名]，让[场景]更智能、更高效！立即开始使用吧！"),
]


# ============ 工具函数 ============

def get_audio_duration(file_path: Path) -> float:
    """获取音频文件时长"""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)],
        capture_output=True, text=True
    )
    return float(result.stdout.strip()) if result.stdout.strip() else 0


async def generate_segment(index: int, text: str, start: float, end: float, max_retries: int = 3) -> dict:
    """生成单个配音片段（带重试）"""
    output_file = OUTPUT_DIR / f"vo_{index:02d}.mp3"
    duration_target = end - start

    # 计算语速调整
    # 中文语速约 4 字/秒
    char_count = len(text.replace(" ", "").replace("，", "").replace("。", "").replace("！", ""))
    natural_duration = char_count / 4.0

    if natural_duration > duration_target:
        rate_adjust = min(35, int((natural_duration / duration_target - 1) * 100))
        rate = f"+{rate_adjust}%"
    elif natural_duration < duration_target * 0.7:
        rate_adjust = min(15, int((1 - natural_duration / duration_target) * 50))
        rate = f"-{rate_adjust}%"
    else:
        rate = "+0%"

    # 生成配音（带重试）
    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(
                text=text,
                voice=VOICE,
                rate=rate,
                pitch="+0Hz",
            )
            await communicate.save(str(output_file))
            break
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"  [{index:02d}] 重试 {attempt + 1}/{max_retries}: {str(e)[:50]}")
                await asyncio.sleep(2)
            else:
                print(f"  [{index:02d}] 生成失败: {str(e)[:80]}")
                return None

    actual_duration = get_audio_duration(output_file)

    print(f"  [{index:02d}] {start:.1f}s-{end:.1f}s (目标{duration_target:.1f}s, 实际{actual_duration:.1f}s)")
    print(f"       {text[:40]}...")

    return {
        "index": index,
        "file": output_file.name,
        "text": text,
        "start_time": start,
        "end_time": end,
        "target_duration": duration_target,
        "actual_duration": actual_duration,
    }


def merge_with_timing(segments: list, total_duration: float):
    """按时间线合并音频"""
    valid_segments = [s for s in segments if s is not None]

    filter_parts = []
    inputs = []

    for i, seg in enumerate(valid_segments):
        seg_file = OUTPUT_DIR / seg["file"]
        inputs.extend(["-i", str(seg_file)])

        delay_ms = int(seg["start_time"] * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")

    n_inputs = len(valid_segments)
    mix_inputs = "".join([f"[a{i}]" for i in range(n_inputs)])
    filter_parts.append(f"{mix_inputs}amix=inputs={n_inputs}:duration=longest[out]")

    filter_complex = "".join(filter_parts)
    output_file = OUTPUT_DIR / "synced_voiceover.mp3"

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-t", str(total_duration + 2),
        str(output_file)
    ]

    print("\n正在合并配音...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        print(f"✓ 合并完成: {output_file}")
        return output_file
    else:
        print(f"✗ 合并失败: {result.stderr[:500]}")
        return None


# ============ 主函数 ============

async def main():
    print("=" * 60)
    print("产品视频配音生成")
    print(f"语音: {VOICE}")
    print(f"输出: {OUTPUT_DIR}")
    print("=" * 60)
    print(f"\n时间线:")
    print(f"  片头:     {OPENING_START}-{OPENING_DURATION}秒")
    print(f"  功能亮点: {FEATURES_START}-{FEATURES_START + FEATURES_DURATION}秒")
    print(f"  演示:     {DEMO_START}-{CLOSING_START:.1f}秒")
    print(f"  片尾:     {CLOSING_START:.1f}-{TOTAL_DURATION:.1f}秒")
    print(f"  总时长:   {TOTAL_DURATION:.1f}秒")
    print("=" * 60)
    print()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 清理旧文件
    for old_file in OUTPUT_DIR.glob("vo_*.mp3"):
        old_file.unlink()

    print("生成配音片段...")

    segments = []
    for i, (start, end, text) in enumerate(VOICEOVER_SEGMENTS):
        seg = await generate_segment(i, text, start, end)
        segments.append(seg)
        await asyncio.sleep(0.5)  # 避免请求过快

    valid_segments = [s for s in segments if s is not None]

    # 保存元数据
    metadata = {
        "voice": VOICE,
        "total_duration": TOTAL_DURATION,
        "timeline": {
            "opening": {"start": OPENING_START, "duration": OPENING_DURATION},
            "features": {"start": FEATURES_START, "duration": FEATURES_DURATION},
            "demo": {"start": DEMO_START, "duration": DEMO_DURATION},
            "closing": {"start": CLOSING_START, "duration": CLOSING_DURATION},
        },
        "segments": valid_segments,
    }

    metadata_file = OUTPUT_DIR / "voiceover_metadata.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    print(f"\n✓ 元数据: {metadata_file}")

    # 合并配音
    merge_with_timing(valid_segments, TOTAL_DURATION)

    print("\n" + "=" * 60)
    print("配音生成完成!")
    print(f"总时长: {TOTAL_DURATION:.1f}秒 (约 {int(TOTAL_DURATION // 60)} 分 {int(TOTAL_DURATION % 60)} 秒)")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
