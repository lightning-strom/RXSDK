// @keepTs
// @ts-nocheck
import { JsHandlerType, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { JsObject, RXResult, UserCenterConfig, RCallback } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { userCenterBuilder, UserCenterParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserCenterBuilder&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { LoginDecorator } from "@normalized:N&&&hmssdk/src/main/ets/base/LoginDecorator&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
let Instance: UserCenterDialog;
export class UserCenterDialog extends BaseDialog<UserCenterParams> {
    private ucConfig?: UserCenterConfig;
    private _onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
    private _onJavaScriptCallback?: ((data: JsObject) => string | boolean | undefined) | undefined;
    public setConfigParams(e146?: UserCenterConfig) {
        this.ucConfig = e146;
        return this;
    }
    public set onSwitchAccount(d146: ((event?: ClickEvent) => void) | undefined) {
        this._onSwitchAccount = d146;
    }
    public get onSwitchAccount(): ((event?: ClickEvent) => void) | undefined {
        return this._onSwitchAccount;
    }
    public set onJavaScriptCallback(c146: ((data: JsObject) => string | boolean | undefined) | undefined) {
        this._onJavaScriptCallback = c146;
    }
    public get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined {
        return this._onJavaScriptCallback;
    }
    public static getInstance(b146: UIContext) {
        if (Instance == null) {
            Instance = new UserCenterDialog(b146);
        }
        return Instance;
    }
    @LoginDecorator
    async show(t145?: RCallback | undefined) {
        let u145 = new UserCenterParams(Passport.loginData?.nickNameDisplay || "", (z145) => {
            let a146 = { code: RXErrorCode.UI_CLOSE } as RXResult;
            a146.name = "close";
            t145?.(a146);
            this.onCallback?.((a146));
            this.close();
        });
        try {
            u145.onSwitchAccount = (x145) => {
                let y145 = { code: RXErrorCode.OK } as RXResult;
                y145.name = "switch_user";
                this.onCallback?.((y145));
            };
            u145.onJavaScriptCallback = (w145: JsObject) => {
                if (w145.type == JsHandlerType.logBackIn) {
                    this.close();
                }
                this.onCallback?.(w145 as object as RXResult);
                return this.onJavaScriptCallback?.(w145);
            };
            if (this.ucConfig?.config_prams) {
                u145.setConfigParams(this.ucConfig?.config_prams);
            }
            if (this.ucConfig?.custom_params) {
                u145.setCustomParams(this.ucConfig.custom_params);
            }
        }
        catch (v145) {
            Logger.e(v145);
        }
        if (this.contentNode) {
            this.contentNode.update(u145);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(userCenterBuilder), u145);
        }
        this._show(this.contentNode);
        return this;
    }
}
