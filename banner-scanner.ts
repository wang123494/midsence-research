import {
  AndroidAgent,
  AndroidDevice,
  getConnectedDevices,
} from '@midscene/android';
import 'dotenv/config';

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms))

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
    await console.timeEnd('AI动作耗时')

  })()
)
