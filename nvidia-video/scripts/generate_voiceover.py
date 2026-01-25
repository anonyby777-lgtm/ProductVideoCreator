#!/usr/bin/env python3
"""
NVIDIA 公司历程短片 - 配音生成脚本
使用 edge-tts 生成中文女声配音
"""

import asyncio
import subprocess
from pathlib import Path
import json

VOICE = "zh-CN-XiaoxiaoNeural"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"
TOTAL_DURATION = 85  # 总时长 85 秒

# 配音段落定义 (开始时间, 结束时间, 配音文字)
VOICEOVER_SEGMENTS = [
    # 场景1: 片头 (0:00-0:08)
    (0.5, 7.5, "英伟达，从一个车库创业公司，成长为全球市值最高的芯片巨头。"),

    # 场景2: 创始时期 1993 (0:08-0:22)
    (8.5, 21.5, "一九九三年，三十岁的黄仁勋与两位工程师好友，在丹尼斯餐厅的一次聚会上，决定创造能让电脑呈现逼真3D图形的芯片。凭借四万美元启动资金，英伟达诞生了。"),

    # 场景3: GPU 时代开创 1999 (0:22-0:38)
    (22.5, 37.5, "一九九九年，英伟达发布全球第一款图形处理器 GeForce 256，正式定义了 GPU 这一全新品类。同年，公司以每股十二美元上市。从此，GPU 开始改变游戏、设计和科学计算的面貌。"),

    # 场景4: CUDA 革命 2006 (0:38-0:52)
    (38.5, 51.5, "二零零六年，英伟达推出 CUDA 架构，让 GPU 不再只是显卡，而是通用计算的超级引擎。科学家们开始用它模拟气候、研究基因、训练人工智能。"),

    # 场景5: AI 时代崛起 2020-2024 (0:52-1:12)
    (52.5, 71.5, "二零二零年，英伟达超越英特尔，成为美国市值最高的芯片公司。人工智能浪潮席卷全球，英伟达的 GPU 成为训练大模型的核心算力。二零二三年，公司市值突破一万亿美元，成为全球首家达成这一里程碑的芯片企业。如今，全球超过百分之八十的 AI 计算都运行在英伟达的芯片上。"),

    # 场景6: 片尾 (1:12-1:25)
    (72.5, 84.0, "三十年前的一个创意，如今已成为推动人类科技进步的核心引擎。英伟达，用芯片重新定义未来。"),
]


def get_audio_duration(file_path):
    """获取音频文件时长"""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


async def generate_segment(index, start, end, text):
    """生成单个配音片段"""
    import edge_tts

    output_file = OUTPUT_DIR / f"vo_{index:02d}.mp3"
    duration_target = end - start

    # 计算语速调整
    char_count = len(text.replace(" ", "").replace("，", "").replace("。", "").replace("、", ""))
    natural_duration = char_count / 4.0  # 每秒约4个中文字

    if natural_duration > duration_target:
        rate_adjust = min(35, int((natural_duration / duration_target - 1) * 100))
        rate = f"+{rate_adjust}%"
    else:
        rate = "+0%"

    print(f"  生成片段 {index}: {text[:20]}... (语速: {rate})")

    communicate = edge_tts.Communicate(text=text, voice=VOICE, rate=rate)
    await communicate.save(str(output_file))

    actual_duration = get_audio_duration(output_file)

    return {
        "index": index,
        "file": output_file.name,
        "start_time": start,
        "end_time": end,
        "target_duration": duration_target,
        "actual_duration": actual_duration,
        "text": text,
    }


def merge_with_timing(segments):
    """按时间线合并音频"""
    print("\n合并音频...")

    filter_parts = []
    inputs = []

    for i, seg in enumerate(segments):
        inputs.extend(["-i", str(OUTPUT_DIR / seg["file"])])
        delay_ms = int(seg["start_time"] * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")

    mix_inputs = "".join([f"[a{i}]" for i in range(len(segments))])
    filter_parts.append(f"{mix_inputs}amix=inputs={len(segments)}:duration=longest[out]")

    output_file = OUTPUT_DIR / "synced_voiceover.mp3"

    cmd = [
        "ffmpeg", "-y", *inputs,
        "-filter_complex", "".join(filter_parts),
        "-map", "[out]",
        "-t", str(TOTAL_DURATION),
        str(output_file)
    ]

    subprocess.run(cmd, capture_output=True)

    final_duration = get_audio_duration(output_file)
    print(f"  输出文件: {output_file}")
    print(f"  总时长: {final_duration:.1f} 秒")

    return output_file


def check_gaps(segments):
    """检查配音段之间的空白"""
    print("\n检查配音空白...")
    gaps = []
    for i in range(len(segments) - 1):
        gap = segments[i+1]["start_time"] - segments[i]["end_time"]
        if gap > 2:
            print(f"  警告: 空白 {segments[i]['end_time']:.1f}s - {segments[i+1]['start_time']:.1f}s ({gap:.1f}秒)")
            gaps.append((segments[i]["end_time"], segments[i+1]["start_time"], gap))

    if not gaps:
        print("  无明显空白")

    return gaps


async def main():
    """主函数"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 50)
    print("NVIDIA 公司历程短片 - 配音生成")
    print("=" * 50)
    print(f"\n配音段落数: {len(VOICEOVER_SEGMENTS)}")
    print(f"目标总时长: {TOTAL_DURATION} 秒")
    print(f"语音模型: {VOICE}")

    # 生成各段配音
    print("\n生成配音片段...")
    segments = []
    for i, (start, end, text) in enumerate(VOICEOVER_SEGMENTS):
        seg = await generate_segment(i, start, end, text)
        segments.append(seg)

    # 检查空白
    check_gaps(segments)

    # 合并音频
    merge_with_timing(segments)

    # 保存元数据
    metadata = {
        "voice": VOICE,
        "total_duration": TOTAL_DURATION,
        "segments": segments,
    }

    metadata_file = OUTPUT_DIR / "voiceover_metadata.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print(f"\n元数据已保存: {metadata_file}")
    print("\n配音生成完成!")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
