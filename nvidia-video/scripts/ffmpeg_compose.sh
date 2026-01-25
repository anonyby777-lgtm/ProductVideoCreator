#!/bin/bash
# NVIDIA 公司历程短片 - FFmpeg 合成脚本
# 备选方案：当 Remotion 浏览器下载失败时使用

set -e

cd "$(dirname "$0")/.."

OUTPUT_DIR="out"
IMAGES_DIR="public/images"
AUDIO_FILE="public/audio/synced_voiceover.mp3"
OUTPUT_FILE="$OUTPUT_DIR/nvidia_history.mp4"

mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "NVIDIA 公司历程短片 - FFmpeg 合成"
echo "========================================"

# 视频参数
FPS=30
WIDTH=1920
HEIGHT=1080

# 场景时间配置 (秒)
SCENE1_DUR=8   # 片头
SCENE2_DUR=14  # 创始 1993
SCENE3_DUR=16  # GPU 1999
SCENE4_DUR=14  # CUDA 2006
SCENE5_DUR=20  # AI 时代
SCENE6_DUR=13  # 片尾

TOTAL_DUR=$((SCENE1_DUR + SCENE2_DUR + SCENE3_DUR + SCENE4_DUR + SCENE5_DUR + SCENE6_DUR))

echo "总时长: ${TOTAL_DUR}秒"
echo ""

# 生成场景视频片段
echo "生成场景视频..."

# 场景1: 片头 - NVIDIA Logo + 标题
echo "  场景1: 片头 (${SCENE1_DUR}s)"
ffmpeg -y -loop 1 -i "$IMAGES_DIR/nvidia_logo.png" \
  -f lavfi -i "color=c=0x0a0a0a:s=${WIDTH}x${HEIGHT}:d=${SCENE1_DUR}" \
  -filter_complex "
    [1:v][0:v]overlay=(W-w)/2:(H-h)/2-100:enable='between(t,0,${SCENE1_DUR})'[bg];
    [bg]drawtext=text='从车库到万亿帝国':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=h/2+100:enable='gte(t,1)',
    drawtext=text='NVIDIA 三十年传奇':fontsize=48:fontcolor=0x76B900:x=(w-text_w)/2:y=h/2+200:enable='gte(t,2)'
  " \
  -t $SCENE1_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene1.mp4" 2>/dev/null

# 场景2: 创始 1993
echo "  场景2: 创始1993 (${SCENE2_DUR}s)"
ffmpeg -y -loop 1 -i "$IMAGES_DIR/circuit_board.jpg" \
  -filter_complex "
    [0:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT},
    colorchannelmixer=aa=0.25[bg];
    color=c=0x0a0a0a:s=${WIDTH}x${HEIGHT}:d=${SCENE2_DUR}[solid];
    [solid][bg]overlay[base];
    [base]drawtext=text='1993':fontsize=200:fontcolor=0x76B900:x=100:y=150:enable='gte(t,0.5)',
    drawtext=text='三位工程师在餐厅相遇':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=h/2+100:enable='gte(t,1.5)',
    drawtext=text='启动资金\: \$40,000':fontsize=40:fontcolor=0xaaaaaa:x=(w-text_w)/2:y=h/2+200:enable='gte(t,2.5)'
  " \
  -t $SCENE2_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene2.mp4" 2>/dev/null

# 场景3: GPU 1999
echo "  场景3: GPU 1999 (${SCENE3_DUR}s)"
ffmpeg -y -loop 1 -i "$IMAGES_DIR/gpu_card.jpg" \
  -filter_complex "
    [0:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT},
    colorchannelmixer=aa=0.3[bg];
    color=c=0x0a0a0a:s=${WIDTH}x${HEIGHT}:d=${SCENE3_DUR}[solid];
    [solid][bg]overlay[base];
    [base]drawtext=text='1999':fontsize=180:fontcolor=0x76B900:x=w-text_w-100:y=100:enable='gte(t,0.5)',
    drawtext=text='GPU':fontsize=300:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:enable='gte(t,2)',
    drawtext=text='GeForce 256 · 定义图形处理器':fontsize=48:fontcolor=0xcccccc:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'
  " \
  -t $SCENE3_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene3.mp4" 2>/dev/null

# 场景4: CUDA 2006
echo "  场景4: CUDA 2006 (${SCENE4_DUR}s)"
ffmpeg -y -f lavfi -i "color=c=0x1a1a2e:s=${WIDTH}x${HEIGHT}:d=${SCENE4_DUR}" \
  -filter_complex "
    drawtext=text='2006':fontsize=160:fontcolor=0x76B900:x=100:y=100:enable='gte(t,0.5)',
    drawtext=text='CUDA':fontsize=120:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-50:enable='gte(t,1)',
    drawtext=text='GPU 通用计算革命':fontsize=40:fontcolor=0xaaaaaa:x=(w-text_w)/2:y=h/2+100:enable='gte(t,2)'
  " \
  -t $SCENE4_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene4.mp4" 2>/dev/null

# 场景5: AI 时代 2020-2024
echo "  场景5: AI 时代 (${SCENE5_DUR}s)"
ffmpeg -y -loop 1 -i "$IMAGES_DIR/datacenter.jpg" \
  -filter_complex "
    [0:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT},
    colorchannelmixer=aa=0.35[bg];
    color=c=0x0a0a0a:s=${WIDTH}x${HEIGHT}:d=${SCENE5_DUR}[solid];
    [solid][bg]overlay[base];
    [base]drawtext=text='2020-2024':fontsize=120:fontcolor=0x76B900:x=100:y=80:enable='gte(t,0.5)',
    drawtext=text='\$1万亿':fontsize=200:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-50:enable='gte(t,6)',
    drawtext=text='全球首家万亿市值芯片公司':fontsize=48:fontcolor=0x76B900:x=(w-text_w)/2:y=h/2+100:enable='gte(t,8)',
    drawtext=text='全球 80%% AI 计算':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=h-120:enable='gte(t,12)'
  " \
  -t $SCENE5_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene5.mp4" 2>/dev/null

# 场景6: 片尾
echo "  场景6: 片尾 (${SCENE6_DUR}s)"
ffmpeg -y -loop 1 -i "$IMAGES_DIR/nvidia_logo.png" \
  -f lavfi -i "color=c=0x0a0a0a:s=${WIDTH}x${HEIGHT}:d=${SCENE6_DUR}" \
  -filter_complex "
    [0:v]scale=500:-1[logo];
    [1:v][logo]overlay=(W-w)/2:(H-h)/2-150:enable='between(t,0,${SCENE6_DUR})'[bg];
    [bg]drawtext=text='用芯片重新定义未来':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h/2+100:enable='gte(t,2)',
    drawtext=text='1993':fontsize=56:fontcolor=0x76B900:x=w/4-50:y=h-200:enable='gte(t,4)',
    drawtext=text='创立':fontsize=28:fontcolor=0x888888:x=w/4-30:y=h-130:enable='gte(t,4)',
    drawtext=text='1999':fontsize=56:fontcolor=0x76B900:x=w/2-40:y=h-200:enable='gte(t,5)',
    drawtext=text='GPU':fontsize=28:fontcolor=0x888888:x=w/2-25:y=h-130:enable='gte(t,5)',
    drawtext=text='\$3万亿+':fontsize=56:fontcolor=0x76B900:x=3*w/4-80:y=h-200:enable='gte(t,6)',
    drawtext=text='市值':fontsize=28:fontcolor=0x888888:x=3*w/4-25:y=h-130:enable='gte(t,6)'
  " \
  -t $SCENE6_DUR -r $FPS -pix_fmt yuv420p "$OUTPUT_DIR/scene6.mp4" 2>/dev/null

# 合并所有场景
echo ""
echo "合并场景..."
cat > "$OUTPUT_DIR/concat_list.txt" << EOF
file 'scene1.mp4'
file 'scene2.mp4'
file 'scene3.mp4'
file 'scene4.mp4'
file 'scene5.mp4'
file 'scene6.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i "$OUTPUT_DIR/concat_list.txt" \
  -c copy "$OUTPUT_DIR/video_only.mp4" 2>/dev/null

# 添加音频
echo "添加配音音轨..."
ffmpeg -y -i "$OUTPUT_DIR/video_only.mp4" -i "$AUDIO_FILE" \
  -c:v copy -c:a aac -b:a 192k \
  -map 0:v -map 1:a \
  -shortest \
  "$OUTPUT_DIR/nvidia_history_raw.mp4" 2>/dev/null

# 音量标准化
echo "音量标准化..."
ffmpeg -y -i "$OUTPUT_DIR/nvidia_history_raw.mp4" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v copy \
  "$OUTPUT_FILE" 2>/dev/null

# 清理临时文件
echo "清理临时文件..."
rm -f "$OUTPUT_DIR/scene"*.mp4 "$OUTPUT_DIR/concat_list.txt" \
      "$OUTPUT_DIR/video_only.mp4" "$OUTPUT_DIR/nvidia_history_raw.mp4"

# 输出结果
echo ""
echo "========================================"
echo "视频生成完成!"
echo "========================================"
echo "输出文件: $OUTPUT_FILE"

# 获取视频信息
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_FILE")
SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')

echo "时长: ${DURATION%.*} 秒"
echo "大小: $SIZE"
echo ""
