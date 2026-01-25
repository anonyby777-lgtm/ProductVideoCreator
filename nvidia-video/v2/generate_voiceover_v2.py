#!/usr/bin/env python3
"""
NVIDIA 公司历程短片 V2 - 配音生成脚本
优化内容：
1. 使用 YunjianNeural（激情男声）
2. 添加配音验证机制
3. 更详细的时长控制
"""

import asyncio
import subprocess
from pathlib import Path
import json

# ========== 配置 ==========
VOICE = "zh-CN-YunjianNeural"  # 激情男声，适合科技内容
OUTPUT_DIR = Path("../public/audio/v2")
TOTAL_DURATION = 85  # 视频总时长

# 配音段落定义 (开始时间, 结束时间, 配音文字)
# 基于优化后的分镜脚本
VOICEOVER_SEGMENTS = [
    # 场景1: 片头 (0-8秒)
    (0.5, 7.5, "从一个小餐厅的梦想，到改变世界的科技巨头。这是 NVIDIA 的传奇故事。"),

    # 场景2: 创始 1993 (8-22秒)
    (8.5, 21.5, "1993年，三位年轻工程师在加州的一家餐厅相遇。黄仁勋、克里斯·马拉科夫斯基和柯蒂斯·普里姆，怀揣着图形计算的梦想，用四万美元启动资金，创立了 NVIDIA。"),

    # 场景3: GPU 1999 (22-38秒)
    (22.5, 37.5, "1999年，NVIDIA 发布了革命性的 GeForce 256，首次提出 GPU 概念。图形处理器从此诞生，为游戏、设计和科学计算带来前所未有的视觉体验。这一创新奠定了 NVIDIA 在图形领域的霸主地位。"),

    # 场景4: CUDA 2006 (38-52秒)
    (38.5, 51.5, "2006年，NVIDIA 推出 CUDA 平台，将 GPU 的强大算力释放到通用计算领域。科学家、研究人员第一次能够利用显卡进行大规模并行计算，这为人工智能时代的到来埋下了种子。"),

    # 场景5: AI 时代 (52-72秒)
    (52.5, 71.5, "2020年代，人工智能浪潮席卷全球。NVIDIA 的 GPU 成为训练大型语言模型的核心硬件。从 ChatGPT 到自动驾驶，全球超过百分之八十的 AI 计算都运行在 NVIDIA 芯片之上。2023年，NVIDIA 市值突破一万亿美元，成为全球首家万亿市值芯片公司。"),

    # 场景6: 片尾 (72-85秒)
    (72.5, 84.5, "从车库创业到万亿帝国，NVIDIA 用三十年时间证明：创新的力量能够改变世界。用芯片重新定义未来，这就是 NVIDIA 的故事。"),
]

# ========== 工具函数 ==========
def get_audio_duration(file_path):
    """获取音频时长"""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def validate_voiceover(segments, total_duration):
    """
    验证配音时间线
    返回: (是否通过, 问题列表)
    """
    issues = []

    for i, seg in enumerate(segments):
        # 检查1: 配音是否超出场景时长
        if seg["actual_duration"] > seg["target_duration"] + 0.5:
            issues.append({
                "type": "duration_exceeded",
                "segment": i,
                "message": f"片段{i}: 实际({seg['actual_duration']:.1f}s) > 目标({seg['target_duration']:.1f}s)",
                "severity": "warning"
            })

        # 检查2: 配音是否与下一段重叠
        if i < len(segments) - 1:
            actual_end = seg["start_time"] + seg["actual_duration"]
            next_start = segments[i+1]["start_time"]
            if actual_end > next_start:
                issues.append({
                    "type": "overlap",
                    "segment": i,
                    "message": f"片段{i}和{i+1}重叠: {actual_end:.1f}s > {next_start:.1f}s",
                    "severity": "error"
                })

    # 检查3: 最后一段是否超出视频时长
    last_seg = segments[-1]
    last_end = last_seg["start_time"] + last_seg["actual_duration"]
    if last_end > total_duration + 1:
        issues.append({
            "type": "exceeds_video",
            "message": f"配音结束({last_end:.1f}s) > 视频时长({total_duration}s)",
            "severity": "error"
        })

    # 检查4: 空白间隙
    for i in range(len(segments) - 1):
        current_end = segments[i]["start_time"] + segments[i]["actual_duration"]
        next_start = segments[i+1]["start_time"]
        gap = next_start - current_end
        if gap > 3:
            issues.append({
                "type": "large_gap",
                "segment": i,
                "message": f"片段{i}和{i+1}之间有{gap:.1f}s空白",
                "severity": "warning"
            })

    passed = not any(issue["severity"] == "error" for issue in issues)
    return passed, issues


def print_validation_report(segments, total_duration):
    """打印配音验证报告"""
    passed, issues = validate_voiceover(segments, total_duration)

    print("\n" + "=" * 60)
    print("配音验证报告".center(56))
    print("=" * 60)
    print(f"{'片段':<6}{'开始':>8}{'目标时长':>10}{'实际时长':>10}{'状态':>12}")
    print("-" * 60)

    for i, seg in enumerate(segments):
        status = "OK" if seg["actual_duration"] <= seg["target_duration"] + 0.5 else "超时"
        print(f"  {i:<4}{seg['start_time']:>6.1f}s{seg['target_duration']:>8.1f}s{seg['actual_duration']:>10.1f}s{status:>10}")

    print("-" * 60)

    if passed:
        print("验证通过")
    else:
        print("验证失败，请检查以下问题:")
        for issue in issues:
            if issue["severity"] == "error":
                print(f"  [ERROR] {issue['message']}")

    if any(issue["severity"] == "warning" for issue in issues):
        print("\n警告:")
        for issue in issues:
            if issue["severity"] == "warning":
                print(f"  [WARN] {issue['message']}")

    print("=" * 60)
    return passed


# ========== 生成函数 ==========
async def generate_segment(index, start, end, text):
    """生成单个配音片段"""
    import edge_tts

    output_file = OUTPUT_DIR / f"vo_{index:02d}.mp3"
    duration_target = end - start

    # 计算语速
    # 去除标点计算有效字符数
    effective_text = text.replace(" ", "").replace("，", "").replace("。", "").replace("、", "").replace("！", "").replace("？", "")
    char_count = len(effective_text)
    natural_duration = char_count / 4.0  # 中文约4字/秒

    if natural_duration > duration_target:
        rate_adjust = min(35, int((natural_duration / duration_target - 1) * 100))
        rate = f"+{rate_adjust}%"
    elif natural_duration < duration_target * 0.7:
        rate_adjust = min(15, int((1 - natural_duration / duration_target) * 50))
        rate = f"-{rate_adjust}%"
    else:
        rate = "+0%"

    # 生成配音
    communicate = edge_tts.Communicate(text=text, voice=VOICE, rate=rate)
    await communicate.save(str(output_file))

    actual_duration = get_audio_duration(output_file)

    return {
        "index": index,
        "file": output_file.name,
        "start_time": start,
        "target_duration": duration_target,
        "actual_duration": actual_duration,
        "text": text[:30] + "..." if len(text) > 30 else text,
        "full_text": text,
        "char_count": char_count,
        "rate": rate,
    }


def merge_audio(segments):
    """合并音频"""
    filter_parts = []
    inputs = []

    for i, seg in enumerate(segments):
        inputs.extend(["-i", str(OUTPUT_DIR / seg["file"])])
        delay_ms = int(seg["start_time"] * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")

    mix_inputs = "".join([f"[a{i}]" for i in range(len(segments))])
    filter_parts.append(f"{mix_inputs}amix=inputs={len(segments)}:duration=longest[out]")

    output_file = OUTPUT_DIR / "synced_voiceover.mp3"

    subprocess.run([
        "ffmpeg", "-y", *inputs,
        "-filter_complex", "".join(filter_parts),
        "-map", "[out]",
        "-t", str(TOTAL_DURATION),
        str(output_file)
    ], capture_output=True)

    return output_file


# ========== 主函数 ==========
async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print(f"NVIDIA V2 配音生成 - 声音: {VOICE}")
    print("=" * 60)

    # 1. 生成配音
    print("\n[1/3] 生成配音片段...")
    segments = []
    for i, (start, end, text) in enumerate(VOICEOVER_SEGMENTS):
        seg = await generate_segment(i, start, end, text)
        segments.append(seg)
        status = "OK" if seg["actual_duration"] <= seg["target_duration"] + 0.5 else "需调整"
        print(f"  片段{i}: {seg['actual_duration']:.1f}s (目标: {seg['target_duration']:.1f}s) 语速: {seg['rate']} [{status}]")

    # 2. 验证
    print("\n[2/3] 验证配音...")
    passed = print_validation_report(segments, TOTAL_DURATION)

    if not passed:
        print("\n配音验证失败，请检查并调整配音文案")
        return False

    # 3. 合并
    print("\n[3/3] 合并音频...")
    output = merge_audio(segments)
    final_duration = get_audio_duration(output)
    print(f"  输出: {output}")
    print(f"  时长: {final_duration:.1f}s")

    # 保存元数据
    metadata = {
        "version": "V2",
        "voice": VOICE,
        "total_duration": TOTAL_DURATION,
        "segments": segments,
        "validation_passed": passed,
    }
    with open(OUTPUT_DIR / "voiceover_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print("V2 配音生成完成!")
    print("=" * 60)

    return True


if __name__ == "__main__":
    asyncio.run(main())
