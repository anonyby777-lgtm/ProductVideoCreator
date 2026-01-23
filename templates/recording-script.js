/**
 * 产品演示录屏脚本模板
 * 使用 Playwright 自动化录制浏览器演示
 *
 * 使用方法:
 * 1. 复制此文件到项目的 scripts/ 目录
 * 2. 修改 BASE_URL 和 TEST_DATA
 * 3. 根据分镜脚本编写录制场景
 * 4. 运行: node scripts/record_demo.js
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

// ============ 配置区 ============

// 应用 URL
const BASE_URL = "http://localhost:5173";

// 输出目录
const OUTPUT_DIR = path.join(__dirname, "..", "public", "recordings");

// 视频尺寸
const VIEWPORT = { width: 1920, height: 1080 };

// 测试数据 - 使用真实有意义的数据
const TEST_DATA = {
  // 示例: 用户名、搜索关键词等
  username: "test@example.com",
  searchKeyword: "测试关键词",
};

// ============ 工具类 ============

/**
 * 时间线记录器 - 记录每个操作的精确时间
 */
class TimelineRecorder {
  constructor() {
    this.startTime = Date.now();
    this.events = [];
  }

  mark(event) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.events.push({ time: elapsed, event });
    console.log(`  [${elapsed.toFixed(1)}s] ${event}`);
    return elapsed;
  }

  getTimeline() {
    return this.events;
  }
}

/**
 * 等待函数
 */
const wait = (page, ms) => page.waitForTimeout(ms);

// ============ 录制主函数 ============

async function recordDemo() {
  console.log("═".repeat(60));
  console.log("产品演示录屏");
  console.log("═".repeat(60));

  // 创建输出目录
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // 启动浏览器
  const browser = await chromium.launch({
    headless: false, // 必须为 false 才能录制
    slowMo: 50, // 稍微放慢操作，更自然
  });

  // 创建上下文并启用录制
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: VIEWPORT,
    },
    locale: "zh-CN",
  });

  const page = await context.newPage();
  const timeline = new TimelineRecorder();

  try {
    // ========== 场景录制开始 ==========

    // 场景1: 页面加载
    console.log("\n[场景1] 页面加载");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    timeline.mark("页面加载完成");
    await wait(page, 2000);

    // 场景2: 功能演示1
    console.log("\n[场景2] 功能演示");

    // TODO: 根据分镜脚本添加具体操作
    // 示例:
    // const button = page.locator('button:has-text("查询")');
    // await button.click();
    // timeline.mark("点击查询按钮");
    // await wait(page, 2000);

    // 场景3: 更多功能...

    timeline.mark("录制结束");
    console.log("\n✓ 所有场景录制完成");

  } catch (error) {
    console.error("\n✗ 录制错误:", error.message);
  } finally {
    const totalDuration = (Date.now() - timeline.startTime) / 1000;

    // 关闭页面和上下文
    await page.close();
    await context.close();

    // 获取视频文件
    const video = page.video();
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(OUTPUT_DIR, "demo.webm");
      try {
        await fs.rename(videoPath, targetPath);
        console.log(`\n视频保存: demo.webm`);
      } catch {
        console.log(`\n视频路径: ${videoPath}`);
      }
    }

    // 保存时间线
    const timelineData = {
      totalDuration,
      events: timeline.getTimeline(),
    };

    const timelinePath = path.join(OUTPUT_DIR, "timeline.json");
    await fs.writeFile(timelinePath, JSON.stringify(timelineData, null, 2));

    console.log("\n" + "═".repeat(60));
    console.log(`录制完成! 总时长: ${totalDuration.toFixed(1)} 秒`);
    console.log("═".repeat(60));

    // 打印时间线摘要
    console.log("\n时间线摘要:");
    for (const event of timeline.getTimeline()) {
      console.log(`  ${event.time.toFixed(1)}s - ${event.event}`);
    }

    await browser.close();
  }
}

// ============ 视频转换 ============

async function convertToMp4() {
  const { execSync } = require("child_process");
  const webmPath = path.join(OUTPUT_DIR, "demo.webm");
  const mp4Path = path.join(OUTPUT_DIR, "full_demo.mp4");

  console.log("\n转换视频格式 WebM → MP4...");

  execSync(
    `ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -crf 23 "${mp4Path}"`,
    { stdio: "inherit" }
  );

  console.log(`✓ 转换完成: full_demo.mp4`);
}

// ============ 执行 ============

recordDemo()
  .then(() => convertToMp4())
  .catch(console.error);
