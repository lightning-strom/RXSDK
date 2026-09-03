import Demo from '@/demo/index'
import Sdk from '@/index.qq'
// @ts-ignore
// 调试包
// import Sdk from './channel-sdk.qq.v2.umd.js'
let sdkName: any = Sdk
const sdk = new Demo<typeof sdkName>(sdkName)
console.log(sdk)

export default sdk
