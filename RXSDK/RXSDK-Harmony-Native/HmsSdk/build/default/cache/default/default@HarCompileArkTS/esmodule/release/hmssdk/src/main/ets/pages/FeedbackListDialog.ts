// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { feedbackListBuilder, FeedbackListParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackListBuilder&4.0.0";
import { FeedbackDetailDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackDetailDialog&4.0.0";
let Instance: FeedbackListDialog;
export class FeedbackListDialog extends BaseDialog<FeedbackListParams, object> {
    page: number = 1;
    size: number = 20;
    public static getInstance(c90: UIContext) {
        if (Instance == null) {
            Instance = new FeedbackListDialog(c90);
        }
        return Instance;
    }
    async show(z89?: RCallback) {
        let a90 = new FeedbackListParams(() => {
            this.close();
            z89?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>);
        });
        a90.onItemClick = (b90) => {
            FeedbackDetailDialog.getInstance(this.uiContext).setId(b90.id).show();
        };
        if (this.contentNode) {
            this.contentNode.update(a90);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackListBuilder), a90);
        }
        this._show(this.contentNode);
        return this;
    }
}
