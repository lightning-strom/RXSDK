import { IShare, RCallback, RXErrorCode, RXResult, ShareFuncParams, ShareParams, SharePlatform, SharePlatforms } from '../types/Index';
import { Logger } from '../utils/Logger';
import { harmonyShare } from '@kit.ShareKit';
import { common, Context } from '@kit.AbilityKit';
import { Callback } from '@kit.BasicServicesKit';

import Objects from '../utils/Objects';
import { ShareData } from './ShareData';
import { IShareTarget } from './ISharableTarget';
import HuaweiShare from './HuaweiShare';
import SystemShare from './SystemShare';
import WXShare from '../wx/WXShare';

import ShareImpl from './ShareImpl';
import { RXUtil } from '../sdk/RXIndex';


class ShareProvider extends ShareImpl implements IShare, IShareTarget {
  private readonly sharableTargets: Record<SharePlatform, IShareTarget> = {
    [SharePlatforms.WECHAT]: new WXShare(),
    [SharePlatforms.HW_KNOCK]: new HuaweiShare(),
    [SharePlatforms.SYSTEM]: new SystemShare(),
  };

  private getShareTarget(platform: SharePlatform) {
    return this.sharableTargets[platform]
  }

  async share(context: Context, params: ShareFuncParams | ShareParams, callback?: RCallback): Promise<RXResult<object>> {
    let ret: RXResult<ShareData>
    try {
      if (this.isShareFuncParams(params)) {
        ret = await this.getShareData(params)
        if (ret.code == RXErrorCode.OK) {
          let res = await this.doShare(Objects.assign(ret.data?.content, params), context)
          ret = RXUtil.getRXResult() as RXResult<ShareData>
          callback?.(ret)
          return ret
        } else {
          Logger.e("data   error " + ret.code)
          ret = RXUtil.getRXResult(RXErrorCode.SHARE_PARAMS_ERROR) as RXResult<ShareData>
          callback?.(ret)
          return ret
        }
      } else {
        return this.shareCustom(context, params, callback)
      }
    } catch (e) {
      Logger.e(e)
      ret = RXUtil.formatResult(e)
      callback?.(ret)
      return ret
    }
  }

  async shareCustom(context: Context, params: ShareParams, callback?: RCallback): Promise<RXResult<object>> {
    let ret: RXResult<object>
    try {
      let res = await this.doShare(params, context)
      ret = RXUtil.getRXResult()
      callback?.(ret)
      return ret
    } catch (e) {
      ret = RXUtil.formatResult(e)
      callback?.(ret)
      return ret
    }
  }

  // 支持一碰分享的能力.
  isSupportKnockShare() {
    return canIUse('SystemCapability.Collaboration.HarmonyShare')
  }

  doShare(params: ShareParams, context: Context): Promise<void> {
    let target = this.getShareTarget(params.platform)
    if (target) {
      Logger.d("doShare:" + JSON.stringify(params))
      return target?.doShare(params, context)
    } else {
      let err = RXUtil.getError(RXErrorCode.SHARE_PARAMS_ERROR, "not support platform " + params.platform)
      throw err
    }
  }

  public onKnockShare(callback: Callback<harmonyShare.SharableTarget>) {
    (this.getShareTarget(SharePlatforms.HW_KNOCK) as HuaweiShare)?.onKnockShare(callback)
  }

  public offKnockShare() {
    (this.getShareTarget(SharePlatforms.HW_KNOCK) as HuaweiShare)?.offKnockShare()
  }
}

export default new ShareProvider()