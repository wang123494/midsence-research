import {
    AndroidAgent,
    AndroidDevice,
    getConnectedDevices
} from '@midscene/android'
import 'dotenv/config' // read environment variables from .env file

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms))

// 启动器
Promise.resolve(
    (async () => {
        // 动态注册

        console.time('多设备并发测试总耗时')
        const allDevices = await getConnectedDevices()

        // 获取前两个连接的设备（如需更多可调整 slice）

        const testDevices = allDevices.slice(0, 2)

        console.log(`检测到已连接设备数: ${allDevices.length}，准备测试设备数: ${testDevices.length}`)

        if (testDevices.length === 0) {
            console.error('未检测到任何 Android 设备，请检查 ADB 连接')
            return
        }

        const taskPromises = testDevices.map(async (deviceInfo, index) => {
            const udid = deviceInfo.udid

            const deviceName = `设备[${index + 1}]-${udid}`

            console.log(`${deviceName}：初始化并启动测试...`)

            const page = new AndroidDevice(udid)
            const agent = new AndroidAgent(page, {
                aiActContext: '如果有任何的位置、权限、用户协议等弹窗，如果有同意，那么选择同意，如果有关闭，那么选择关闭',
            })

            try {
                await page.connect()
                // 启动 Bilibili
                await page.launch('tv.danmaku.bili/tv.danmaku.bili.MainActivityV2')
                
                console.log(`${deviceName}：点击“我的”选项卡`)
                await agent.aiTap('页面右下角的“我的” tab')
                
                console.log(`${deviceName}：准备进入会员中心`)
                await agent.aiTap('页面中心的红色的横条，有会员中心的字体，点击有会员中心四个字的按钮')
                
                // 等待页面加载完成
                await agent.aiWaitFor('页面顶部显示“会员中心”或显示用户等级信息')
                
                // 处理可能的广告弹窗
                await agent.aiAct('如果出现了广告弹窗，请点击关闭按钮；如果没有，则直接忽略。')

                console.log(`${deviceName}：执行视觉断言对比`)
                await agent.aiAssert({
                    prompt: "请对比当前页面与提供的基准图(benchmark)，检查页面是否有明显的变化，比如布局错乱、缺失重要元素等。忽略动态加载的 Banner 内容、用户 ID、电量和时间等。主要结构正确即认为通过。",
                    images: [
                        {
                            name: "benchmark",
                            url: "/Users/wangyuxuan/AI-UI自动化/javascript-sdk-demo/pic/vip_center_birthday_banner.png"
                        }
                    ],
                }, "视觉一致性检查", { deepThink: false })

                console.log(`${deviceName}：✅ 测试圆满完成`)
            } catch (error) {
                console.error(`${deviceName}：❌ 测试过程中发生错误:`, error instanceof Error ? error.message : error)
                throw error 
            }
        })

        try {
            await Promise.all(taskPromises)
            console.log('所有设备测试任务已成功并行完成 ✨')
        } catch (e) {
            console.error('多设备测试中部分任务失败，请查看上方详细日志')
        } finally {
            console.timeEnd('多设备并发测试总耗时')
        }
    })()
)
