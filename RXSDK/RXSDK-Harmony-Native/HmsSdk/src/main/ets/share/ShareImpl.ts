import { RCallback, RXResult, SchedulingReportParams, ShareFuncParams, ShareParams, ShortLinkParams } from '../types/Index';
import { Logger } from '../utils/Logger';

import { RXRequest } from '../net/RXRequest';
import ApiPath from '../constants/ApiPath';
import SDKConfig from '../sdk/SDKConfig';
import Passport from '../base/Passport';
import Objects from '../utils/Objects';
import { ShareData } from './ShareData';
import { RXUtil } from '../utils/RXUtil';

interface DefaultParams {
  type: string;
  product_id: string;
  channel_id: string;
  open_id: string | null; // Adjust type if `openid` can be null
  sub_channel_id: string;
}

export default class ShareImpl {
  protected shareData?: ShareData

  protected handleShareData(shareData: ShareData, params: ShareFuncParams): ShareData {
    let url = shareData?.content?.url;
    if (url) {
      try {
        if (params.protocol_android) {
          url += `&protocol_android=${encodeURIComponent(String(params.protocol_android))}`;
        }
        if (params.protocol_ios) {
          url += `&protocol_ios=${encodeURIComponent(String(params.protocol_ios))}`;
        }
        if (params.use_scheme) {
          url += `&use_scheme=${params.use_scheme}`;
        }
        url += `&api=${encodeURIComponent(SDKConfig.domain)}`;
        shareData.content!.url = url;
      } catch (e) {
        Logger.e(e)
      }
    }
    return shareData;
  }

  public isShareFuncParams(params: ShareParams | ShareFuncParams): params is ShareFuncParams {
    return 'func' in params;
  }

  protected getDefaultParams(): Record<string, ESObject> {
    const hashMap: DefaultParams = {
      type: "app",
      product_id: SDKConfig.productId,
      channel_id: SDKConfig.channelId,
      open_id: Passport.openid,
      sub_channel_id: SDKConfig.subChannelId,
    };
    return hashMap;
  }


  async getShareData(params: ShareFuncParams, callback?: RCallback<ShareData>): Promise<RXResult<ShareData>> {
    try {
      params = Objects.assign(this.getDefaultParams(), params)
      let ret = await RXRequest.post<ShareData>(ApiPath.GET_DATA, params)
      if (ret.code == 0 && ret.data) {
        this.shareData = this.handleShareData(ret.data, params)
        ret.data = this.shareData
      }
      callback?.(ret)
      return ret;
    } catch (e) {
      let ret = RXUtil.formatResult(e) as RXResult<ShareData>
      callback?.(ret)
      return ret
    }

  }

  async shareSchedulingReport(params: SchedulingReportParams, callback?: RCallback): Promise<RXResult<object>> {
    let ret: RXResult<object>
    try {
      params = Objects.assign(this.getDefaultParams, params)
      ret = await RXRequest.post(ApiPath.SCHEDULING_REPORT, params)
      if (ret.code == 0) {
      }

    } catch (e) {
      ret = RXUtil.formatResult(e)
    } finally {
      callback?.(ret)
      return ret
    }
  }

  async getShortUrl(params: ShortLinkParams, callback?: RCallback): Promise<RXResult<object>> {
    return await RXRequest.post("v1/url/short", params, null, RXUtil.toRXCallback(callback))
  }
}

