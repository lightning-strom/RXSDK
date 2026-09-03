import { RXErrorCode, ShareParams } from "../types/Index";
import { IShareTarget } from "./ISharableTarget";
import { Context } from "@kit.AbilityKit";
import { harmonyShare } from "@kit.ShareKit";
import { ShareObject } from "./ShareObject";
import { Logger } from "../utils/Logger";
import { BusinessError, Callback } from "@kit.BasicServicesKit";

export default class HuaweiShare implements IShareTarget {
  private sharableTarget: harmonyShare.SharableTarget;

  //  纯图片布局
  // 构造分享数据时，仅传递预览图（thumbnailUri）字段，即可生成此卡片模板。
  //沉浸式大卡布局
  //构造分享数据时，需同时传入标题(title)、描述(description)字段和预览图(thumbnailUri)字段。
  // 预览图宽高比小于1:1。
  //   白卡上下布局
  //   构造分享数据时，需同时传入标题(title)、描述(description)字段和预览图(thumbnailUri)字段。
  // 预览图宽高比大于1:1。
  async doShare(params: ShareParams, context: Context): Promise<void> {
    if (this.sharableTarget) {
      return this.sharableTarget.share(await new ShareObject(params).toSystemShareData())
    } else {
      let err: BusinessError = {
        code: RXErrorCode.SHARE_KNOCK_NOT_ENABLE,
        name: "knockShareError",
        message: "The share can only be called after the onKnockShareEvent has been executed. Please ensure that onKnockShareEvent is called first. "
      }
      throw err
    }
  }

  public onKnockShare(callback: Callback<harmonyShare.SharableTarget>) {
    Logger.d("knockShare on " + callback)
    harmonyShare.on('knockShare', (sharableTarget: harmonyShare.SharableTarget) => {
      Logger.d("knockShare called")
      this.sharableTarget = sharableTarget;
      callback?.(sharableTarget)
    })
  }


  public offKnockShare() {
    Logger.d("knockShare off")
    this.sharableTarget = undefined;
    harmonyShare.off('knockShare');
  }
}