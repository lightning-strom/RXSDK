import { JsHandlerType, JsObject, RXCallback, RXResult, RXErrorCode, UserCenterConfig, HelperCenterArgs, RCallback } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { userCenterBuilder, UserCenterParams } from './UserCenterBuilder';
import Passport from '../base/Passport';
import { LoginDecorator } from '../base/LoginDecorator';
import { Logger } from '../utils/Logger';

let Instance: UserCenterDialog;

export class UserCenterDialog extends BaseDialog<UserCenterParams> {
  private ucConfig?: UserCenterConfig;
  private _onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
  private _onJavaScriptCallback?: ((data: JsObject) => string | boolean | undefined) | undefined;

  public setConfigParams(cfg?: UserCenterConfig) {
    this.ucConfig = cfg;
    return this
  }

  public set onSwitchAccount(value: ((event?: ClickEvent) => void) | undefined) {
    this._onSwitchAccount = value;
  }

  public get onSwitchAccount(): ((event?: ClickEvent) => void) | undefined {
    return this._onSwitchAccount;
  }


  public set onJavaScriptCallback(value: ((data: JsObject) => string | boolean | undefined) | undefined) {
    this._onJavaScriptCallback = value;
  }

  public get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined {
    return this._onJavaScriptCallback;
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new UserCenterDialog(uiContext);
    }
    return Instance;
  }

  @LoginDecorator
  async show(callback?: RCallback | undefined) {
    let args = new UserCenterParams(Passport.loginData?.nickNameDisplay || "", (e) => {
      let ret = { code: RXErrorCode.UI_CLOSE } as RXResult;
      ret.name = "close";
      callback?.(ret);
      this.onCallback?.((ret));
      this.close()
    }
    )
    try {
      args.onSwitchAccount = (e) => {
        let ret = { code: RXErrorCode.OK } as RXResult
        ret.name = "switch_user"
        this.onCallback?.((ret))
      }
      args.onJavaScriptCallback = (dat: JsObject) => {
        if (dat.type == JsHandlerType.logBackIn) {
          this.close()
        }
        this.onCallback?.(dat as object as RXResult)
        return this.onJavaScriptCallback?.(dat)
      }
      if (this.ucConfig?.config_prams) {
        args.setConfigParams(this.ucConfig?.config_prams)
      }
      if (this.ucConfig?.custom_params) {
        args.setCustomParams(this.ucConfig.custom_params)
      }
    } catch (e) {
      Logger.e(e)
    }
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(userCenterBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}