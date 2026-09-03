import { RXError, RXErrorCode, ShareParams } from "../types/Index";
import { IShareTarget } from "../share/ISharableTarget";
import { common, Context } from "@kit.AbilityKit";
import { ShareObject } from "../share/ShareObject";
import { WXApi } from "./WXApi";
import { Logger } from "../utils/Logger";

export default class WXShare implements IShareTarget {
  async doShare(params: ShareParams, context?: Context): Promise<void> {
    try {
      const resp = await WXApi.getInstance(params.wx_appid).share(
        new ShareObject(params),
        context as common.UIAbilityContext
      );
      if (resp.errCode === 0) {
        console.log("Share successful");
      } else {
        Logger.e(`Share failed with error code: ${resp.errCode}`);
        throw new RXError(`Share failed with error code: ${resp.errCode}`, RXErrorCode.SHARE_PARAMS_ERROR, resp.errCode, resp.errStr);
      }
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new RXError(`wx share error code: ${e}`, RXErrorCode.SHARE_PARAMS_ERROR);
      }
    }
  }
}