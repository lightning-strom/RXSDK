import { RCallback, RXErrorCode, RXLoginConfig, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import Passport from '../base/Passport';
import { BaseDialog } from './BaseDialog';
import { changePasswordBuilder, ChangePasswordParams } from './ChangePasswordBuilder';
import { Logger } from '../utils/Logger';

let Instance: ChangePasswordDialog;

export class ChangePasswordDialog extends BaseDialog<ChangePasswordParams> {
  private config?: RXLoginConfig;

  public setConfig(value: RXLoginConfig) {
    this.config = value;
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new ChangePasswordDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback | undefined) {
    let args = new ChangePasswordParams(!Passport.loginData?.isPasswordSet, async (newpwd, oldpwd) => {

      try {
        let ret: RXResult = await Passport.changePassword(oldpwd, newpwd)
        Logger.d(ret)
        callback?.(  ret)
        // return ret
      } catch (e) {
        this.uiPromptAction.showToast({ message: e.message })
      }

    }, () => {
      this.close()
      callback?.( { code: RXErrorCode.UI_CLOSE } as RXResult)
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(changePasswordBuilder), args);
    }
    this._show(this.contentNode)
    return this
    return this
  }
}