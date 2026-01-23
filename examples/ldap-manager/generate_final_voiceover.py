#!/usr/bin/env python3
"""
LDAP Manager 完整版配音生成脚本
包含片头、演示、片尾的完整配音
"""

import asyncio
import edge_tts
import json
import subprocess
from pathlib import Path

# 配置
VOICE = "zh-CN-XiaoxiaoNeural"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"

# 时间线配置（秒）
OPENING_START = 0
OPENING_DURATION = 10
FEATURES_START = 10
FEATURES_DURATION = 8
DEMO_START = 18  # 片头10秒 + 功能亮点8秒
DEMO_DURATION = 97.227
CLOSING_START = DEMO_START + DEMO_DURATION  # 约115.227秒
CLOSING_DURATION = 10
TOTAL_DURATION = CLOSING_START + CLOSING_DURATION  # 约125.227秒

# 配音段落定义（基于精确时间线）
# 格式: (开始时间秒, 结束时间秒, 配音文字)
# 录屏时间线 + 18秒偏移 = 最终视频时间
VOICEOVER_SEGMENTS = [
    # ========== 片头 (0-10秒) ==========
    (1.0, 5.0, "欢迎使用 LDAP Manager"),
    (5.5, 9.5, "一站式多节点账户管理平台"),

    # ========== 功能亮点 (10-18秒) ==========
    (10.5, 17.5, "我们为您提供强大的账户管理功能，让运维工作变得轻松高效"),

    # ========== 演示部分 (18-115秒) ==========
    # 录屏0-20.8秒是页面加载 → 最终视频18-38.8秒
    (19.0, 28.0, "让我们来看看实际操作演示"),

    # 统计页面就绪+图表展示+节点切换 (录屏20.8-30s → 最终38.8-48s)
    (39.0, 47.5, "在运行统计页面，您可以一目了然地查看30天的认证趋势。系统支持多节点管理，点击即可切换查看不同节点的数据。"),

    # TAB切换 (录屏30-38s → 最终48-56s)
    (48.5, 54.0, "统计类型支持认证统计和数据同步统计两种模式，切换TAB即可查看不同类型的统计图表。"),

    # 服务状态监控 (录屏38-45.5s → 最终56-63.5s)
    (56.5, 63.0, "服务状态实时监控，绿色表示正常运行，红色表示需要关注，橙色表示无法获取服务状态。"),

    # 导航到账号管理 (录屏45.5-60s → 最终63.5-78s)
    (64.0, 77.5, "点击侧边栏进入账号管理页面，这里可以对用户账号进行查询和管理。系统支持海量数据，可查询管理数万条账户记录。"),

    # 账号查询 (录屏60-68s → 最终78-86s)
    (78.5, 85.5, "账号管理支持多条件筛选，输入用户名即可快速定位目标账号。"),

    # 认证记录查询 (录屏68-77.6s → 最终86-95.6s)
    (86.0, 95.0, "点击认证记录按钮，查询该用户认证历史，支持时间筛选和数据分析。"),

    # 批量操作 (录屏77.6-91s → 最终95.6-109s)
    (96.0, 101.5, "批量操作让您一键开放或屏蔽用户。选择需要操作的账号，"),
    (102.5, 108.5, "点击开放按钮，一键启用选中的账号。操作自动同步到所有选中节点。"),

    # 数据导出 (录屏91-97s → 最终109-115s)
    (110.0, 114.5, "所有查询结果支持一键导出 Excel，方便数据分析。"),

    # ========== 片尾 (115.2-125.2秒) ==========
    (116.0, 124.5, "LDAP Manager，让账户管理更智能、更高效！立即开始使用吧！"),
]


async def generate_segment_with_retry(index: int, text: str, start: float, end: float, max_retries: int = 3) -> dict:
    """生成单个语音片段（带重试）"""
    output_file = OUTPUT_DIR / f"vo_full_{index:02d}.mp3"
    duration_target = end - start

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

    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(output_file)],
        capture_output=True, text=True
    )
    actual_duration = float(result.stdout.strip()) if result.stdout.strip() else 0

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


def merge_with_timing(segments: list[dict], total_duration: float):
    """按时间线合并音频"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    filter_parts = []
    inputs = []

    valid_segments = [s for s in segments if s is not None]

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


async def main():
    print("=" * 60)
    print("LDAP Manager 完整版配音生成（含片头片尾）")
    print(f"语音: {VOICE}")
    print(f"输出: {OUTPUT_DIR}")
    print("=" * 60)
    print(f"\n时间线:")
    print(f"  片头:     0-{OPENING_DURATION}秒")
    print(f"  功能亮点: {FEATURES_START}-{FEATURES_START + FEATURES_DURATION}秒")
    print(f"  演示:     {DEMO_START}-{CLOSING_START:.1f}秒")
    print(f"  片尾:     {CLOSING_START:.1f}-{TOTAL_DURATION:.1f}秒")
    print(f"  总时长:   {TOTAL_DURATION:.1f}秒")
    print("=" * 60)
    print()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 清理旧文件
    for old_file in OUTPUT_DIR.glob("vo_full_*.mp3"):
        old_file.unlink()

    print("生成配音片段...")

    segments = []
    for i, (start, end, text) in enumerate(VOICEOVER_SEGMENTS):
        seg = await generate_segment_with_retry(i, text, start, end)
        segments.append(seg)
        await asyncio.sleep(0.5)

    valid_segments = [s for s in segments if s is not None]

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

    metadata_file = OUTPUT_DIR / "voiceover_full_metadata.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    print(f"\n✓ 元数据: {metadata_file}")

    merge_with_timing(valid_segments, TOTAL_DURATION)

    print("\n" + "=" * 60)
    print("配音生成完成!")
    print(f"总时长: {TOTAL_DURATION:.1f}秒 (约 {int(TOTAL_DURATION // 60)} 分 {int(TOTAL_DURATION % 60)} 秒)")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
