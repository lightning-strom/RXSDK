// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXLoginConfig, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { changePasswordBuilder, ChangePasswordParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/ChangePasswordBuilder&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
let Instance: ChangePasswordDialog;
export class ChangePasswordDialog extends BaseDialog<ChangePasswordParams> {
    private config?: RXLoginConfig;
    public setConfig(n75: RXLoginConfig) {
        this.config = n75;
        return this;
    }
    public static getInstance(m75: UIContext) {
        if (Instance == null) {
            Instance = new ChangePasswordDialog(m75);
        }
        return Instance;
    }
    show(g75?: RCallback | undefined) {
        let h75 = new ChangePasswordParams(!Passport.loginData?.isPasswordSet, async (i75, j75) => {
            try {
                let l75: RXResult = await Passport.changePassword(j75, i75);
                Logger.d(l75);
                g75?.(l75);
            }
            catch (k75) {
                this.uiPromptAction.showToast({ message: k75.message });
            }
        }, () => {
            this.close();
            g75?.({ code: RXErrorCode.UI_CLOSE } as RXResult);
        });
        if (this.contentNode) {
            this.contentNode.update(h75);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(changePasswordBuilder), h75);
        }
        this._show(this.contentNode);
        return this;
        return this;
    }
}
