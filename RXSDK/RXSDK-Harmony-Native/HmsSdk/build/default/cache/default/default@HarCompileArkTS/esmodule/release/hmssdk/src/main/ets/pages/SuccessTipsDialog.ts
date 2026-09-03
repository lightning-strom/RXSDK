// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { successTipsBuilder, SuccessTipsParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/SuccessTipsBuilder&4.0.0";
let Instance: SuccessTipsDialog;
export class SuccessTipsDialog extends BaseDialog<SuccessTipsParams> {
    private _content?: string | undefined;
    public setContent(h135: string | undefined) {
        if (h135) {
            this._content = h135;
        }
        return this;
    }
    public static getInstance(g135: UIContext) {
        if (Instance == null) {
            Instance = new SuccessTipsDialog(g135);
        }
        return Instance;
    }
    show(c135?: RCallback) {
        let d135 = new SuccessTipsParams((e135) => {
            let f135 = {
                code: RXErrorCode.OK,
                message: "确定"
            } as RXResult;
            c135?.(f135);
            this.onCallback?.(f135 as RXResult);
            this.close();
        });
        if (this._content) {
            d135.description = this._content;
        }
        if (this.contentNode) {
            this.contentNode.update(d135);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(successTipsBuilder), d135);
        }
        this._show(this.contentNode);
        return this;
    }
}
