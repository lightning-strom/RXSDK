// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { userAgreementBuilder, UserAgreementParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserAgreementBuilder&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
let Instance: UserAgreementDialog;
export class UserAgreementDialog extends BaseDialog<UserAgreementParams> {
    title: string = '';
    content: string = '';
    public setContent(r143: string) {
        this.content = r143;
        return this;
    }
    public setTitle(q143: string) {
        this.title = q143;
        return this;
    }
    public static getInstance(p143: UIContext) {
        if (Instance == null) {
            Instance = new UserAgreementDialog(p143);
        }
        return Instance;
    }
    show(j143?: RCallback) {
        let k143 = new UserAgreementParams(this.content, (n143) => {
            let o143: RXResult = {
                code: RXErrorCode.OK,
                message: "同意"
            };
            Devices.setPrivacyAgree(getContext());
            this.close();
            j143?.(o143);
            this.onCallback?.(o143 as RXResult);
        }, (l143) => {
            let m143: RXResult = {
                code: RXErrorCode.DISAGREE_PRIVACY,
                message: "不同意"
            };
            this.close();
            j143?.(m143);
            this.onCallback?.(m143 as RXResult);
        });
        if (this.contentNode) {
            this.contentNode.update(k143);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(userAgreementBuilder), k143);
        }
        this._show(this.contentNode);
        return this;
    }
}
