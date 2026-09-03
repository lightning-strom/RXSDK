// @keepTs
// @ts-nocheck
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type { HelperCenterArgs, JsObject, UserCenterArgs } from '../types/Index';
import { UserCenterComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserCenterComponent&4.0.0";
export class UserCenterParams {
    nickName?: string;
    avatar?: string;
    private _config_params?: UserCenterArgs;
    private _custom_params?: HelperCenterArgs;
    onCloseClick?: (event?: ClickEvent) => void;
    private _onJavaScriptCallback?: ((data: JsObject) => string | boolean | undefined) | undefined;
    onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
    public set onJavaScriptCallback(f144: ((data: JsObject) => string | boolean | undefined) | undefined) {
        this._onJavaScriptCallback = f144;
    }
    public get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined {
        return this._onJavaScriptCallback;
    }
    public setConfigParams(e144: UserCenterArgs) {
        this._config_params = e144;
    }
    public setCustomParams(d144: HelperCenterArgs) {
        this._custom_params = d144;
    }
    public getConfigParams(): Record<string, string> {
        let c144: Record<string, string> = {};
        if (this._config_params) {
            c144["config_params"] = JSON.stringify(this._config_params);
        }
        if (this._custom_params) {
            c144["custom_params"] = JSON.stringify(this._custom_params);
        }
        return c144;
    }
    constructor(a144: string, b144?: (event?: ClickEvent) => void) {
        this.onCloseClick = b144;
        this.nickName = a144;
        this.avatar = Passport.loginData?.avatar;
        this._config_params = SDKConfig.userCenterConfig;
    }
}
export function userCenterBuilder(s143: UserCenterParams, t143 = null) {
    const u143 = s143;
    {
        (t143 ? t143 : this).observeComponentCreation2((v143, w143, x143 = u143) => {
            if (w143) {
                let y143 = new UserCenterComponent(t143 ? t143 : this, {
                    nickName: x143.nickName,
                    avatar: x143.avatar,
                    webParams: x143.getConfigParams(),
                    url: ApiPath.getUrl(ApiPath.STATIC_USER_CENTER),
                    onJavaScriptCallback: x143.onJavaScriptCallback,
                    onSwitchAccount: x143.onSwitchAccount,
                    onCloseClick: x143.onCloseClick
                }, undefined, v143, () => { }, { page: "HmsSdk/src/main/ets/pages/UserCenterBuilder.ets", line: 54, col: 3 });
                ViewPU.create(y143);
                let z143 = () => {
                    return {
                        nickName: x143.nickName,
                        avatar: x143.avatar,
                        webParams: x143.getConfigParams(),
                        url: ApiPath.getUrl(ApiPath.STATIC_USER_CENTER),
                        onJavaScriptCallback: x143.onJavaScriptCallback,
                        onSwitchAccount: x143.onSwitchAccount,
                        onCloseClick: x143.onCloseClick
                    };
                };
                y143.paramsGenerator_ = z143;
            }
            else {
                (t143 ? t143 : this).updateStateVarsOfChildByElmtId(v143, {});
            }
        }, { name: "UserCenterComponent" });
    }
}
