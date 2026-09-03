// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IifaaRedirectURLResp, IifaaValidateResp, RealNameResult, Reward, RXCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { realNameBuilder, RealNameParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/RealNameBuilder&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { SuccessTipsDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/SuccessTipsDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
let Instance: RealNameDialog;
export class RealNameDialog extends BaseDialog<RealNameParams, RealNameResult> {
    private _props?: Reward[] | undefined;
    public get props(): Reward[] | undefined {
        return this._props || Passport.realAuthReward;
    }
    public setProps(v129: Reward[] | undefined) {
        this._props = v129;
        return this;
    }
    public static getInstance(u129: UIContext) {
        if (Instance == null) {
            Instance = new RealNameDialog(u129);
        }
        return Instance;
    }
    show(o129?: RXCallback<RXResult<RealNameResult>> | undefined) {
        let p129 = new RealNameParams(async (r129, s129, t129) => {
            await this.commitRealName(r129, s129, t129, o129);
        }, () => {
            let q129 = {
                code: RXErrorCode.LOGIN_ERROR,
                msg: "取消认证"
            } as RXResult<RealNameResult>;
            o129?.(null, q129);
            this.onCallback?.(q129 as RXResult<RealNameResult>);
            this.close();
        }, this.props);
        p129.onAlipayAuthClick = async () => {
            await this.commitAlipayRealName(o129);
        };
        p129.canCloseRealAuth = this.cancelable;
        p129.useAlipayAuth = SDKConfig.isUseIifaaAuth;
        if (SDKConfig.isUseFastAuth) {
            p129.realName = Passport.loginData?.ext?.["realname"];
            p129.idCard = Passport.loginData?.ext?.["idcard"];
        }
        this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(realNameBuilder), p129);
        this._show(this.contentNode);
        return this;
    }
    onClose(): void {
        super.onClose();
        this._props = undefined;
        Passport.clearIifaaAutoValidateCallback();
    }
    private async commitRealName(i129: string, j129: string, k129: boolean, l129?: RXCallback<RXResult<RealNameResult>> | undefined) {
        try {
            Passport.clearIifaaAutoValidateCallback();
            let n129 = await Passport.realAuth(i129, j129, k129);
            Logger.d("real auth:", i129, j129, JSON.stringify(n129));
            this.handleRealNameResult(n129, l129);
        }
        catch (m129) {
            Logger.w("real auth error", i129, j129, JSON.stringify(m129));
            this.uiPromptAction.showToast({ message: JSON.stringify(m129) });
            l129?.(m129);
            this.onCallback?.(m129);
        }
    }
    private async commitAlipayRealName(c129?: RXCallback<RXResult<RealNameResult>> | undefined) {
        try {
            this.uiPromptAction.showToast({ message: "正在打开支付宝实名认证" });
            let e129 = this.getIifaaThirdPartSchema();
            if (!e129) {
                Logger.e("IIFAA third_part_schema is empty, check init config channel.sh");
                this.uiPromptAction.showToast({ message: "实名认证失败" });
                return;
            }
            let f129: RXResult<IifaaRedirectURLResp> = await Passport.getIifaaRedirectURL(app.name, e129);
            let g129 = f129.data?.redirect_url || f129.data?.redirectUrl || f129.data?.url;
            if (f129.code != 0 || !g129) {
                this.uiPromptAction.showToast(f129);
                c129?.(null, f129 as RXResult<RealNameResult>);
                this.onCallback?.(f129 as RXResult<RealNameResult>);
                return;
            }
            let h129 = await app.tryStartBrowser(g129);
            if (!h129) {
                Passport.clearIifaaAutoValidateCallback();
                this.uiPromptAction.showToast({ message: "实名认证失败" });
                return;
            }
            this.registerIifaaValidateCallback(c129);
        }
        catch (d129) {
            Logger.w("alipay real auth error", JSON.stringify(d129));
            this.uiPromptAction.showToast({ message: JSON.stringify(d129) });
            c129?.(d129);
            this.onCallback?.(d129);
        }
    }
    private handleRealNameResult(z128: RXResult<RealNameResult>, a129?: RXCallback<RXResult<RealNameResult>> | undefined) {
        if (z128.code == 0 || z128.code == RXErrorCode.ALREADY_REAL_NAME) {
            z128.code = 0;
            SuccessTipsDialog.getInstance(this.uiContext).setContent(z128.msg).show((b129) => {
                Logger.d("SuccessTips: " + JSON.stringify(b129));
                a129?.(null, z128);
                this.onCallback?.(z128 as RXResult<RealNameResult>);
            });
            this.close();
        }
        else {
            this.uiPromptAction.showToast(z128);
            a129?.(null, z128);
            this.onCallback?.(z128 as RXResult<RealNameResult>);
        }
    }
    private registerIifaaValidateCallback(w128?: RXCallback<RXResult<RealNameResult>> | undefined) {
        Passport.setIifaaAutoValidateCallback((x128: RXResult<IifaaValidateResp>) => {
            if (x128.code == 0 || x128.code == RXErrorCode.ALREADY_REAL_NAME) {
                Passport.clearIifaaAutoValidateCallback();
                this.close();
                let y128 = x128 as RXResult<RealNameResult>;
                y128.code = 0;
                w128?.(null, y128);
                this.onCallback?.(y128);
            }
            else {
                this.uiPromptAction.showToast(x128);
            }
        });
    }
    private getIifaaThirdPartSchema(): string {
        let v128 = SDKConfig.realAuthIifaaScheme.trim();
        if (!v128) {
            return "";
        }
        return v128.includes("://") ? v128 : v128 + "://";
    }
}
