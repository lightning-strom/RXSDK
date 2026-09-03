import { RCallback, RXErrorCode, RXLoginConfig, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import Passport from '../base/Passport';
import { BaseDialog } from './BaseDialog';
import { registerBuilder, RegisterParams } from './RegisterBuilder';
import { Logger } from '../utils/Logger';
import Objects from '../utils/Objects';

let Instance: RegisterDialog;

export class RegisterDialog extends BaseDialog<RegisterParams> {
  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new RegisterDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback | undefined) {
    let args = new RegisterParams(async (username, password) => {
      try {
        let ret: RXResult = await Passport.register(username, password, undefined, { type: 1 })
        ret.data = Objects.assign(ret.data, { username, password })
        Logger.d(ret)
        callback?.( ret)
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
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(registerBuilder), args);
    }
    this._show(this.contentNode)
    return this
    return this
  }
}