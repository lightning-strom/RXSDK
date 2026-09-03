// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { captchaVerifyBuilder, CaptchaVerifyParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/CaptchaVerifyBuilder&4.0.0";
let Instance: CaptchaVerifyDialog;
export class CaptchaVerifyDialog extends BaseDialog<CaptchaVerifyParams, object> {
    appid: string = "";
    public setAppid(c73: string) {
        this.appid = c73;
        return this;
    }
    public static getInstance(b73: UIContext) {
        if (Instance == null) {
            Instance = new CaptchaVerifyDialog(b73);
        }
        return Instance;
    }
    async show(y72?: RCallback) {
        let z72 = new CaptchaVerifyParams(this.appid, () => {
            this.close();
            y72?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>);
        });
        z72.onSliderCaptchaCallback = (a73) => {
            y72?.(a73 as RXResult<object>);
            this.close();
        };
        this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(captchaVerifyBuilder), z72);
        this._show(this.contentNode);
        return this;
    }
}
