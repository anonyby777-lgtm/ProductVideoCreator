/**
 * LDAP Manager 最终版录屏脚本 v3
 * 严格按照分镜脚本录制，记录精确时间用于配音同步
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

const BASE_URL = "http://localhost:5173";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "recordings");

const VIEWPORT = { width: 1920, height: 1080 };

// 测试数据 (示例数据，请替换为实际值)
const TEST_DATA = {
  searchUsername: "demo_user@example.com",
  nodes: ["192.168.1.10", "192.168.1.20"],
};

const wait = (page, ms) => page.waitForTimeout(ms);

// 时间记录器
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

async function recordFullDemo() {
  console.log("═".repeat(60));
  console.log("LDAP Manager 最终版录屏 v3");
  console.log("═".repeat(60));

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });

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
    // ========== 场景2: 运行统计 - 认证统计 ==========
    console.log("\n[场景2] 运行统计 - 认证统计");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    timeline.mark("页面加载完成");

    await page.waitForSelector(".stats-container", { timeout: 10000 });
    await wait(page, 1500);
    timeline.mark("统计页面就绪");

    // 等待图表加载
    await page.waitForSelector("canvas", { timeout: 10000 }).catch(() => {});
    await wait(page, 3000);
    timeline.mark("认证趋势图表展示");

    // 切换节点
    const nodes = page.locator(".node-item");
    const nodeCount = await nodes.count();

    if (nodeCount > 1) {
      await nodes.nth(1).click();
      timeline.mark("切换到节点2");
      await wait(page, 2500);

      await nodes.nth(0).click();
      timeline.mark("切换回节点1");
      await wait(page, 2000);
    }

    // ========== 场景3: 运行统计 - 同步统计TAB切换 ==========
    console.log("\n[场景3] 运行统计 - 同步统计TAB切换");

    const typeItems = page.locator(".type-item");
    const typeCount = await typeItems.count();

    if (typeCount > 1) {
      // 点击"数据同步统计"TAB
      await typeItems.nth(1).click();
      timeline.mark("切换到数据同步统计TAB");
      await wait(page, 3000);

      // 展示同步统计图表
      timeline.mark("展示同步统计图表");
      await wait(page, 3000);

      // 切换回认证统计
      await typeItems.nth(0).click();
      timeline.mark("切换回认证统计TAB");
      await wait(page, 2000);
    }

    // ========== 场景4: 服务状态监控 ==========
    console.log("\n[场景4] 服务状态监控");

    // 悬停节点显示tooltip
    for (let i = 0; i < Math.min(nodeCount, 2); i++) {
      await nodes.nth(i).hover();
      timeline.mark(`悬停节点${i + 1}显示服务状态`);
      await wait(page, 3500);
    }

    // ========== 场景5: 导航到账号管理 ==========
    console.log("\n[场景5] 导航到账号管理");

    const navItem = page.locator('.nav-item:has-text("账号管理")');
    await navItem.click();
    timeline.mark("点击账号管理菜单");
    await wait(page, 2000);

    await page.waitForSelector(".el-table", { timeout: 10000 }).catch(() => {});
    timeline.mark("账号列表加载完成");
    await wait(page, 2500);

    // ========== 场景6: 账号查询演示 ==========
    console.log("\n[场景6] 账号查询演示");

    // 找到用户名输入框
    const usernameInput = page.locator('.el-input__inner').first();

    if (await usernameInput.isVisible()) {
      await usernameInput.click();
      timeline.mark("点击用户名输入框");
      await wait(page, 800);

      // 逐字输入用户名（更真实的效果）
      await usernameInput.fill("");
      for (const char of TEST_DATA.searchUsername) {
        await usernameInput.type(char, { delay: 80 });
      }
      timeline.mark(`输入用户名: ${TEST_DATA.searchUsername}`);
      await wait(page, 1000);

      // 点击查询按钮
      const searchBtn = page.locator('button:has-text("查询")').first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
        timeline.mark("点击查询按钮");
        await wait(page, 3000);
        timeline.mark("显示查询结果");
      }
    }

    // ========== 场景7: 认证记录查询 ==========
    console.log("\n[场景7] 认证记录查询");

    // 找到认证记录按钮
    const authLogBtn = page.locator('button:has-text("认证"), button:has-text("日志")').first();

    if (await authLogBtn.isVisible()) {
      await authLogBtn.click();
      timeline.mark("点击认证记录按钮");
      await wait(page, 2500);

      // 等待弹窗打开
      const dialog = page.locator(".el-dialog, .el-drawer");
      await dialog.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
      timeline.mark("认证记录弹窗打开");
      await wait(page, 1500);

      // 在弹窗中点击查询按钮
      const dialogSearchBtn = page.locator('.el-dialog button:has-text("查询"), .el-drawer button:has-text("查询")').first();
      if (await dialogSearchBtn.isVisible()) {
        await dialogSearchBtn.click();
        timeline.mark("点击弹窗内查询按钮");
        await wait(page, 3000);
        timeline.mark("展示认证记录结果");
      }

      await wait(page, 2500);

      // 关闭弹窗
      const closeBtn = page.locator(".el-dialog__close, .el-drawer__close-btn, .el-icon-close").first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        timeline.mark("关闭认证记录弹窗");
        await wait(page, 1500);
      }
    }

    // ========== 场景8: 批量操作演示 ==========
    console.log("\n[场景8] 批量操作演示");

    // 清空搜索条件
    const inputs = page.locator('.el-input__inner');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        await input.clear();
      }
    }

    // 重新查询
    const searchBtn2 = page.locator('button:has-text("查询")').first();
    if (await searchBtn2.isVisible()) {
      await searchBtn2.click();
      timeline.mark("清空条件重新查询");
      await wait(page, 2500);
    }

    // 选择多行
    const rows = page.locator(".el-table__row");
    const rowCount = await rows.count();

    for (let i = 0; i < Math.min(rowCount, 3); i++) {
      const checkbox = rows.nth(i).locator(".el-checkbox").first();
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await wait(page, 500);
      }
    }
    timeline.mark("选择3条数据");
    await wait(page, 2000);

    // 找到并点击开放按钮
    const enableBtn = page.locator('button:has-text("开放"), button:has-text("启用"), button:has-text("开启")').first();
    if (await enableBtn.isVisible()) {
      await enableBtn.hover();
      timeline.mark("悬停开放按钮");
      await wait(page, 1500);

      await enableBtn.click();
      timeline.mark("点击开放按钮");
      await wait(page, 3000);

      // 如果有确认弹窗，点击确认
      const confirmBtn = page.locator('.el-message-box__btns button:has-text("确"), .el-button--primary:has-text("确")').first();
      if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click();
        timeline.mark("确认批量操作");
        await wait(page, 2000);
      }
    }

    // ========== 场景9: 数据导出 ==========
    console.log("\n[场景9] 数据导出");

    const exportBtn = page.locator('button:has-text("导出"), button:has-text("Excel")').first();
    if (await exportBtn.isVisible()) {
      await exportBtn.hover();
      await wait(page, 1000);

      await exportBtn.click();
      timeline.mark("点击导出按钮");
      await wait(page, 3000);
    }

    timeline.mark("录制结束");

    console.log("\n✓ 所有场景录制完成");

  } catch (error) {
    console.error("\n✗ 录制错误:", error.message);
  } finally {
    const totalDuration = (Date.now() - timeline.startTime) / 1000;

    await page.close();
    await context.close();

    // 获取视频文件
    const video = page.video();
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(OUTPUT_DIR, "demo_v3.webm");
      try {
        await fs.rename(videoPath, targetPath);
        console.log(`\n视频保存: demo_v3.webm`);
      } catch {
        console.log(`\n视频路径: ${videoPath}`);
      }
    }

    // 保存时间线
    const timelineData = {
      totalDuration,
      events: timeline.getTimeline(),
    };

    const timelinePath = path.join(OUTPUT_DIR, "timeline_v3.json");
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

recordFullDemo().catch(console.error);
