import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { forgotPasswordBuilder, ForgotPasswordParams } from './ForgotPasswordBuilder';

let Instance: ForgotPasswordDialog;

export class ForgotPasswordDialog extends BaseDialog<ForgotPasswordParams> {
  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new ForgotPasswordDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback | undefined) {
    let args = new ForgotPasswordParams(() => {
      this.close()
      callback?.(  { code: RXErrorCode.UI_CLOSE } as RXResult)
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(forgotPasswordBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}