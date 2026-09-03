import Web from './web'
import SdkBaiduH5 from '../../../copy/index.h5_baidu'

let sdk: any = new SdkBaiduH5({
  productId: '1002',
  channelId: '818',
  cpid: '114',
  baseUrlList: ['http://cn-api-test.ruixuecloud.com/'],
  complete(res: any) {
    console.log(res)
  }
})

Web(sdk)
