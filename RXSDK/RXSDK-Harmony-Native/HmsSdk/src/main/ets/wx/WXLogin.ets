import { ILogin } from '../types/ILogin';
import { RXError, RXErrorCode } from '../types/Index';
import { WXApi } from './WXApi';

interface WXResp {
  code: string
  openId: string
  lang: string
}

export class WXLogin implements ILogin {
  //   {
  //     "id": 0,
  //     "name": "SendAuthResp",
  //     "errCode": 0,
  //     "authResult": true,
  //     "errStr": "",
  //     "transaction": "b349fa46-1084-45f0-b799-7942648a4f0c",
  //     "openId": "oYmrx6kLXPUegpbKUZt1zsN3Iys0",
  //     "code": "0715Gyll2UaVTe4xlcol25AYCF45Gyly",
  //     "state": "wx_login",
  //     "url": "wx2634a4144ccbe556://oauth?code=0715Gyll2UaVTe4xlcol25AYCF45Gyly&state=wx_login",
  //     "lang": "zh_CN",
  //     "country": ""
  // }
  async doLogin(params: Record<string, ESObject>): Promise<object> {
    let resp = await WXApi.getInstance(params["wx_appid"]).login(params)
    if (resp.errCode == 0) {
      return {
        code: resp.code,
        openId: resp.openId,
        lang: resp.lang
      } as WXResp;
    } else {
      throw new RXError(resp.errStr, RXErrorCode.THIRD_LOGIN_ERROR, resp.errCode)
    }
    // return Promise.resolve(Object);
  }
}