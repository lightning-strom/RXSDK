import Demo from '@/demo/douyin'
// @ts-ignore
import SdkDouyin from '@/index.douyin'
// import SdkLingjing from '@/index.lingjing'

let sdkName: any = SdkDouyin
switch (process.env.TYPE) {
  case 'douyin':
    sdkName = SdkDouyin
    break
}
const sdk = new Demo<typeof sdkName>(sdkName)
console.log(sdkName)

export default sdk
