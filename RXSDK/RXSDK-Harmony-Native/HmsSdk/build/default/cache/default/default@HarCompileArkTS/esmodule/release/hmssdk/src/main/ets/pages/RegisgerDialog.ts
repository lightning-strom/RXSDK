// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { registerBuilder, RegisterParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/RegisterBuilder&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
let Instance: RegisterDialog;
export class RegisterDialog extends BaseDialog<RegisterParams> {
    public static getInstance(c130: UIContext) {
        if (Instance == null) {
            Instance = new RegisterDialog(c130);
        }
        return Instance;
    }
    show(w129?: RCallback | undefined) {
        let x129 = new RegisterParams(async (y129, z129) => {
            try {
                let b130: RXResult = await Passport.register(y129, z129, undefined, { type: 1 });
                b130.data = Objects.assign(b130.data, { username: y129, password: z129 });
                Logger.d(b130);
                w129?.(b130);
            }
            catch (a130) {
                this.uiPromptAction.showToast({ message: a130.message });
            }
        }, () => {
            this.close();
            w129?.({ code: RXErrorCode.UI_CLOSE } as RXResult);
        });
        if (this.contentNode) {
            this.contentNode.update(x129);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(registerBuilder), x129);
        }
        this._show(this.contentNode);
        return this;
        return this;
    }
}
