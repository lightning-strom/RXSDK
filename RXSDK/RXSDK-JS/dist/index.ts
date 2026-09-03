import Demo from '@/demo/index'
// import SdkWegame from '@/index.wegame'
import SdkWegame from '@/index.wegame'
// @ts-ignore
import { SDK as TencentSDK } from '@/tencent-sdk.js'
// import SdkLingjing from '@/index.lingjing'

// @ts-ignore
wx.TencentSDK = TencentSDK

// const SdkWegame = require('../test.js')
let sdkName: any = SdkWegame
switch (process.env.TYPE) {
  case 'wegame':
    sdkName = SdkWegame
    break
  // case 'lingjing':
  //   sdkName = SdkLingjing
  //   break
}
const sdk = new Demo<typeof sdkName>(sdkName)
// sdk.start()
console.log('demo sdk instance: ', sdk)

export default sdk
