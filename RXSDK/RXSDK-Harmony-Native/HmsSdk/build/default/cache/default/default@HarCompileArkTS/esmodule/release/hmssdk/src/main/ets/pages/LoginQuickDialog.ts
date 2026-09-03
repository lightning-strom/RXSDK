// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Account, LoginData, RXCallback, RXLoginConfig, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { loginQuickBuilder, LoginQuickParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginQuicktBuilder&4.0.0";
import RXApiImpl from "@normalized:N&&&hmssdk/src/main/ets/api/RXApiImpl&4.0.0";
import { LoginDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginDialog&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
let Instance: LoginQuickDialog;
export class LoginQuickDialog extends BaseDialog<LoginQuickParams, LoginData> {
    account: Account = {
        openid: '',
        method: ''
    };
    private config?: RXLoginConfig;
    public setConfig(c112: RXLoginConfig) {
        this.config = c112;
        return this;
    }
    public static getInstance(b112: UIContext) {
        if (Instance == null) {
            Instance = new LoginQuickDialog(b112);
        }
        return Instance;
    }
    public setAccount(a112: Account) {
        this.account = a112;
        return this;
    }
    show(v111?: RXCallback<RXResult<LoginData>>) {
        let w111 = new LoginQuickParams(this.account, () => {
            this.close();
            v111?.(null, { code: RXErrorCode.UI_CLOSE } as RXResult<LoginData>);
        });
        w111.onStartClick = async (y111) => {
            let z111 = await RXApiImpl.login(y111);
            z111["type"] = "login";
            this.onCallback?.(z111 as RXResult<LoginData>);
            if (z111.code === 0) {
                this.close();
            }
            else if (z111.code == RXErrorCode.LOGIN_OPENID_ERROR) {
                this.showLoginDialog(v111, y111);
            }
            else {
                v111?.(null, z111);
            }
        };
        w111.onMoreMethodClick = (x111) => {
            if (x111 == 1) {
                this.close();
            }
            this.showLoginDialog(v111);
        };
        if (this.contentNode) {
            this.contentNode.update(w111);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginQuickBuilder), w111);
        }
        this._show(this.contentNode);
        return this;
    }
    private showLoginDialog(r111: RXCallback<RXResult<LoginData>> | undefined, s111?: Account) {
        LoginDialog.getInstance(this.uiContext)
            .setAccount(s111)
            .setLoginMethods(this.config?.loginMethods?.length ? this.config.loginMethods : SDKConfig.loginMethods)
            .setConfig(this.config)
            .show((t111, u111) => {
            if (u111?.code == 0) {
                this.close();
            }
            r111?.(t111, u111);
        });
    }
}
