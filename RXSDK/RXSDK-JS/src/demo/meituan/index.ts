import Demo from '@/demo/index'
import SdkMeituan from '@/index.meituan'

let sdkName: any = SdkMeituan
const sdk = new Demo<typeof sdkName>(sdkName)

export default sdk
