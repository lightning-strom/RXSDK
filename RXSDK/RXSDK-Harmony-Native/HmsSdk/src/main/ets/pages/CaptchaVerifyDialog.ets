import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { captchaVerifyBuilder, CaptchaVerifyParams } from './CaptchaVerifyBuilder';

let Instance: CaptchaVerifyDialog;

export class CaptchaVerifyDialog extends BaseDialog<CaptchaVerifyParams, object> {
  appid: string = ""

  public setAppid(appid: string) {
    this.appid = appid
    return this;
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new CaptchaVerifyDialog(uiContext);
    }
    return Instance;
  }

  async show(callback?: RCallback) {
    let args = new CaptchaVerifyParams(this.appid, () => {
      this.close()
      callback?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>)
    })
    args.onSliderCaptchaCallback = (obj) => {
      callback?.( obj as RXResult<object>)
      this.close()
    }
    // if (this.contentNode) {
    //   this.contentNode.update(args)
    // } else {
    this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(captchaVerifyBuilder), args);
    // }
    this._show(this.contentNode)
    return this
  }
}