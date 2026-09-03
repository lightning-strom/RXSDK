import ApiPath from '../constants/ApiPath';
import Passport from '../base/Passport';
import SDKConfig from '../sdk/SDKConfig';
import { HelperCenterArgs, JsObject, UserCenterArgs, UserCenterConfig } from '../types/Index';
import { UserCenterComponent } from './UserCenterComponent';

export class UserCenterParams {
  nickName?: string;
  avatar?: string;
  private _config_params?: UserCenterArgs;
  private _custom_params?: HelperCenterArgs;
  onCloseClick?: (event?: ClickEvent) => void;
  private _onJavaScriptCallback?: ((data: JsObject) => string | boolean | undefined) | undefined;
  onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;

  public set onJavaScriptCallback(value: ((data: JsObject) => string | boolean | undefined) | undefined) {
    this._onJavaScriptCallback = value;
  }

  public get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined {
    return this._onJavaScriptCallback;
  }

  public setConfigParams(value: UserCenterArgs) {
    this._config_params = value;
  }

  public setCustomParams(value: HelperCenterArgs) {
    this._custom_params = value;
  }

  public getConfigParams(): Record<string, string> {
    let parm: Record<string, string> = {};
    if (this._config_params) {
      parm["config_params"] = JSON.stringify(this._config_params)
    }
    if (this._custom_params) {
      parm["custom_params"] = JSON.stringify(this._custom_params)
    }
    return parm
  }

  constructor(nickName: string, onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
    this.nickName = nickName
    this.avatar = Passport.loginData?.avatar
    this._config_params = SDKConfig.userCenterConfig;
  }
}


@Builder
export function userCenterBuilder(params: UserCenterParams) {
  UserCenterComponent({
    nickName: params.nickName,
    avatar: params.avatar,
    webParams: params.getConfigParams(),
    url: ApiPath.getUrl(ApiPath.STATIC_USER_CENTER),
    onJavaScriptCallback: params.onJavaScriptCallback,
    onSwitchAccount: params.onSwitchAccount,
    onCloseClick: params.onCloseClick
  })
}