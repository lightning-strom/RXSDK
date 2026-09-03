// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { feedbackDetailBuilder, FeedbackDetailParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackDetailBuilder&4.0.0";
import Feedback from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
import type { FeedbackDetailBean } from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
let Instance: FeedbackDetailDialog;
export class FeedbackDetailDialog extends BaseDialog<FeedbackDetailParams, object> {
    id: number = 0;
    public static getInstance(q86: UIContext) {
        if (Instance == null) {
            Instance = new FeedbackDetailDialog(q86);
        }
        return Instance;
    }
    public setId(p86: number) {
        this.id = p86;
        return this;
    }
    async show(k86?: RCallback) {
        let l86 = await Feedback.getFeedbackDetail(this.id);
        let m86 = new FeedbackDetailParams(() => {
            this.close();
            k86?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>);
        });
        if (l86.code == 0 && l86.data) {
            m86.setContent(l86.data as FeedbackDetailBean);
        }
        m86.onReceiveClick = async () => {
            let n86 = await Feedback.feedbackGetprop(this.id);
            if (n86.code == 0) {
                this.uiPromptAction.showToast({ message: "领取成功" });
                l86 == await Feedback.getFeedbackDetail(this.id);
            }
            else {
                this.uiPromptAction.showToast(n86);
            }
            if (n86.code == 0 && n86.code == 0 && l86.data) {
                let o86 = l86.data as FeedbackDetailBean;
                o86.get_prop = 1;
                m86.setContent(o86);
                if (this.contentNode) {
                    this.contentNode.update(m86);
                }
            }
        };
        if (this.contentNode) {
            this.contentNode.update(m86);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackDetailBuilder), m86);
        }
        this._show(this.contentNode);
        return this;
    }
}
