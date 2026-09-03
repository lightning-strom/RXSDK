import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { Singleton } from '../types/Types';
import Objects from '../utils/Objects';
import { RXUtil } from '../utils/RXUtil';
import { WXApi } from './WXApi';

interface WXBusinessResp extends RXResult {
  extMsg?: string;
  businessType?: string;
  result?: 'success' | 'fail' | 'cancel'
}

export class WXSdkWrapper extends Singleton<WXSdkWrapper> {
  /**
   * 调起微信客户端指定业务视图（适配微信Open SDK商家转账等业务场景）
   * 功能说明：异步调起微信客户端对应的业务页面（如商家转账用户确认页），通过Promise返回业务交互结果
   * 官方文档：https://pay.weixin.qq.com/doc/v3/merchant/4012719576
   * @param params 业务调起参数集合，键值对格式，所有可选参数需与微信SDK业务要求一致
   * @param params.wx_appid 微信 appid
   * @param params.businessType 业务类型标识（必填），固定值需遵循微信SDK约定（如商家转账传"requestMerchantTransfer"）
   * @param params.query 业务查询参数（必填），格式为key=value&key2=value2（value需做UrlEncode处理）
   *                     商家转账场景必传字段：mchId（商户号）、appId（应用ID）、package（转账单package_info）
   * @param params.extInfo 业务扩展信息（可选），额外补充的业务参数，根据具体业务场景传入
   * @param callback 可选同步回调函数，用于额外的结果通知（优先级低于Promise返回值，可按需传入）
   * @returns Promise<RXResult> 异步返回结果Promise，RXResult包含业务交互状态（成功/失败/取消）及扩展信息
   * @注意事项：
   * 1. 返回结果仅代表微信页面交互状态，不代表业务最终执行结果（如转账成功需调用微信查询接口核实）
   * 2. 若微信未安装、版本过低或参数非法，Promise会返回失败状态及对应错误码/错误信息
   * 3. query参数中的特殊字符需进行UrlEncode处理，避免解析失败导致调起异常
   */
  async openBusinessView(params: Record<string, ESObject>, callback?: RCallback): Promise<RXResult> {
    try {
      let resp = await WXApi.getInstance(params["wx_appid"]).openBusinessView({
        businessType: params["businessType"], query: params["query"],
        extInfo: params["extInfo"]
      })
      let msg = resp.errStr

      let ret: WXBusinessResp = {
        code: resp.errCode,
        message: msg || ''
      }
      if (resp.extMsg) {
        ret = Objects.assign(ret, JSON.parse(resp.extMsg))
        msg = msg ?? ret.result
      }
      if (ret.code == 0) {
        callback?.(ret)
        return ret
      } else {
        let r = RXUtil.getRXResult(WXApi.toRXShareError(ret.code), msg, ret.code)
        callback?.(r)
        return r
      }
    } catch (e) {
      callback?.(RXUtil.formatResult(e, RXErrorCode.SHARE_PARAMS_ERROR))
      return e
    }
  }
}