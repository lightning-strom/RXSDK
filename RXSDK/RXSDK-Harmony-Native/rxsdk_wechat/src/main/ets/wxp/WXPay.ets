import { WXApi } from 'hmssdk/src/main/ets/wx/WXApi';
import * as wxopensdk from '@tencent/wechat_open_sdk';
import { BillingClient, OrderData, RegisterPayment, RXErrorCode, RXResult, RXUtil } from './RXInterfaces';
import Devices from 'hmssdk/src/main/ets/utils/Devices';

@RegisterPayment()
class WXPay extends BillingClient {
  async onOrderResponse(order: OrderData): Promise<RXResult<object>> {
    //调用支付
    let params = order.ext || {}
    let req = new wxopensdk.PayReq
    let appid: string = params['appId']
    req.appId = appid // 'wxd930ea5d5a258f4f' //微信开放平台审核通过的移动应用AppID
    req.partnerId = params['partnerId'] //'1900000109' //微信支付商户号
    req.prepayId = params['prepayId'] // '1101000000140415649af9fc314aa427' //调用微信支付下单接口返回的支付交易会话ID
    req.packageValue = params['packageValue'] || 'Sign=WXPay' // 'Sign=WXPay' //填写固定值Sign=WXPay
    req.nonceStr = params['nonceStr'] || Devices.genUUID() // '1101000000140429eb40476f8896f4c9' //随机字符串，不长于32位
    req.timeStamp = params['timeStamp'] //'1398746574' //时间戳
    req.sign = params['sign'] // '7FFECB600D7157C5AA49810D2D8F28BC2811827B' //签名值
    let resp = (await WXApi.getInstance(appid).sendReq(req)) as wxopensdk.PayResp;
    if (resp.errCode == wxopensdk.ErrCode.ERR_OK) {
      return RXUtil.getRXResult()
    } else if (resp.errCode == wxopensdk.ErrCode.ERR_USER_CANCEL) {
      return RXUtil.getRXResult(RXErrorCode.PAY_CANCEL)
    } else {
      return RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "支付错误", resp.errCode, resp.errStr)
    }
  }

  name(): string {
    return 'wechat'
  }

  static install() {
  }
}

export default WXPay