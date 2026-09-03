import { Account, LoginData, RXCallback, RXErrorCode, RXLoginConfig, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { loginQuickBuilder, LoginQuickParams } from './LoginQuicktBuilder';
import RXApiImpl from '../api/RXApiImpl';
import { LoginDialog } from './LoginDialog';
import SDKConfig from '../sdk/SDKConfig';

let Instance: LoginQuickDialog;


export class LoginQuickDialog extends BaseDialog<LoginQuickParams, LoginData> {
  account: Account = {
    openid: '',
    method: ''
  }
  private config?: RXLoginConfig;

  public setConfig(value: RXLoginConfig) {
    this.config = value;
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new LoginQuickDialog(uiContext);
    }
    return Instance;
  }

  public setAccount(acc: Account) {
    this.account = acc;
    return this
  }

  show(callback?: RXCallback<RXResult<LoginData>>) {
    let args = new LoginQuickParams(this.account, () => {
      this.close()
      callback?.(null, { code: RXErrorCode.UI_CLOSE } as RXResult<LoginData>)
    })
    args.onStartClick = async (account) => {
      let ret = await RXApiImpl.login(account)
      ret["type"] = "login"
      this.onCallback?.( ret as RXResult<LoginData>)
      if (ret.code === 0) {
        this.close()
      } else if (ret.code == RXErrorCode.LOGIN_OPENID_ERROR) {
        this.showLoginDialog(callback, account);
      } else {
        callback?.(null, ret);
      }
    }

    args.onMoreMethodClick = (tag) => {
      if (tag == 1) {
        this.close()
      }
      this.showLoginDialog(callback);
    }

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginQuickBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }

  private showLoginDialog(callback: RXCallback<RXResult<LoginData>> | undefined, account?: Account) {
    LoginDialog.getInstance(this.uiContext)
      .setAccount(account)
      .setLoginMethods(this.config?.loginMethods?.length ? this.config.loginMethods : SDKConfig.loginMethods)
      .setConfig(this.config)
      .show((err, data) => {
        if (data?.code == 0) {
          this.close();
        }
        callback?.(err, data);
      });
  }
}