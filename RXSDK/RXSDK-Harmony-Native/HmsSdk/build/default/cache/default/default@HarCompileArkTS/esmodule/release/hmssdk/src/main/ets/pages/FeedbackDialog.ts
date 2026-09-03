// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import promptAction from "@ohos:promptAction";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { feedbackBuilder, FeedbackParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackBuilder&4.0.0";
import Feedback from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
import Oss from "@normalized:N&&&hmssdk/src/main/ets/oss/Oss&4.0.0";
import { LoadingDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoadingDialog&4.0.0";
let Instance: FeedbackDialog;
export class FeedbackDialog extends BaseDialog<FeedbackParams, object> {
    private tags: string[] = [];
    public static getInstance(d87: UIContext) {
        if (Instance == null) {
            Instance = new FeedbackDialog(d87);
        }
        return Instance;
    }
    public setTags(c87?: string[]) {
        this.tags = this.tags;
        return this;
    }
    async show(r86?: RCallback) {
        let s86 = new FeedbackParams(() => {
            this.close();
            r86?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>);
        });
        s86.setOnCommitClick(async (t86, u86, v86) => {
            let w86 = LoadingDialog.getInstance(this.uiContext)
                .setTimeout(-1)
                .setText("提交中,请稍后...")
                .setBackgroundColor("#9f000000")
                .show();
            let x86: string[] = [];
            for (let z86 = 0; z86 < u86.length; z86++) {
                const a87 = u86[z86];
                let b87 = await Oss.uploadFile(getContext(), a87);
                if (b87.code == 0) {
                    x86.push(b87.data?.["url"]);
                }
            }
            Logger.d("feedback files:" + JSON.stringify(x86));
            let y86 = await Feedback.feedbackCreate(t86, x86, v86, this.tags);
            Logger.d("feedbackCreate:" + JSON.stringify(y86));
            w86.close();
            if (y86.code == 0) {
                promptAction.showToast({ "message": "提交成功" });
                this.close();
            }
            else {
                promptAction.showToast(y86);
            }
            r86?.(y86);
            this.onCallback?.(y86 as RXResult<object>);
        });
        if (this.contentNode) {
            this.contentNode.update(s86);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackBuilder), s86);
        }
        this._show(this.contentNode);
        return this;
    }
}
