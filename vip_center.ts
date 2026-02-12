// 请使用release 包，debug 包会很卡，加载很久
import {
    AndroidAgent,
    AndroidDevice,
    getConnectedDevices
}from '@midscene/android'
import 'dotenv/config' // read environment variables from .env file

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms))
// 启动器
Promise.resolve(
  (async () => {
    console.time('AI动作耗时')
    const devices = await getConnectedDevices()

    const page = new AndroidDevice(devices[0].udid)
    const agent = new AndroidAgent(page, {
      // 可以用来解决奇异
      aiActContext: '如果有任何的位置、权限、用户协议等弹窗，如果有同意，那么选择同意，如果有关闭，那么选择关闭',
    })
    await page.connect()
    await page.launch('tv.danmaku.bili/tv.danmaku.bili.MainActivityV2');    
    await agent.aiTap('页面有下角的 我的 tab')
    await agent.aiTap('页面中心的红色的横条，有会员中心的字体')
    
    // 普通断言：检查页面关键元素
    await agent.aiWaitFor('页面顶部显示“会员中心”')

    await agent.aiAssert({
        prompt: "请对比当前页面与提供的基准图(benchmark)，检查页面是否有明显的变化，比如布局错乱、缺失重要元素等。忽略动态加载的 Banner 内容、用户 ID、电量和时间等。主要结构正确即认为通过。",
        images: [
                  {
                    name: "benchmark",
                    url: "/Users/wangyuxuan/AI-UI自动化/javascript-sdk-demo/pic/vip_center_birthday_banner.png"
                      }
                ],
    }, "视觉一致性检查", { deepThink: false })

    await console.timeEnd('AI动作耗时')

  })()
)
