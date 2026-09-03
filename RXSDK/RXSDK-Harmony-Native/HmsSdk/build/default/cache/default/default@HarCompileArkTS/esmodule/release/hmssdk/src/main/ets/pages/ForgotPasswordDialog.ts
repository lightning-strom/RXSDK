// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { forgotPasswordBuilder, ForgotPasswordParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/ForgotPasswordBuilder&4.0.0";
let Instance: ForgotPasswordDialog;
export class ForgotPasswordDialog extends BaseDialog<ForgotPasswordParams> {
    public static getInstance(o90: UIContext) {
        if (Instance == null) {
            Instance = new ForgotPasswordDialog(o90);
        }
        return Instance;
    }
    show(m90?: RCallback | undefined) {
        let n90 = new ForgotPasswordParams(() => {
            this.close();
            m90?.({ code: RXErrorCode.UI_CLOSE } as RXResult);
        });
        if (this.contentNode) {
            this.contentNode.update(n90);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(forgotPasswordBuilder), n90);
        }
        this._show(this.contentNode);
        return this;
    }
}
