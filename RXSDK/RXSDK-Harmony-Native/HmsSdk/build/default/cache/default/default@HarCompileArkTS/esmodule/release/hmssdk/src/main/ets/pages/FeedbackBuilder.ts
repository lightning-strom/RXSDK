// @keepTs
// @ts-nocheck
import { FeedbackComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackComponent&4.0.0";
export class FeedbackParams {
    resList?: string[];
    onCloseClick?: (event?: ClickEvent) => void;
    onCommitClick?: (content: string, resList: string[], phone: string) => void;
    onAddFileClick?: (event?: ClickEvent) => void;
    public setOnCommitClick(a77: (content: string, resList: string[], phone: string) => void) {
        this.onCommitClick = a77;
        return this;
    }
    constructor(z76?: (event?: ClickEvent) => void) {
        this.onCloseClick = z76;
    }
}
export function feedbackBuilder(r76: FeedbackParams, s76 = null) {
    const t76 = r76;
    {
        (s76 ? s76 : this).observeComponentCreation2((u76, v76, w76 = t76) => {
            if (v76) {
                let x76 = new FeedbackComponent(s76 ? s76 : this, {
                    resList: w76.resList,
                    onCommitClick: w76.onCommitClick,
                    onCloseClick: w76.onCloseClick,
                    onAddFileClick: w76.onAddFileClick
                }, undefined, u76, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackBuilder.ets", line: 22, col: 3 });
                ViewPU.create(x76);
                let y76 = () => {
                    return {
                        resList: w76.resList,
                        onCommitClick: w76.onCommitClick,
                        onCloseClick: w76.onCloseClick,
                        onAddFileClick: w76.onAddFileClick
                    };
                };
                x76.paramsGenerator_ = y76;
            }
            else {
                (s76 ? s76 : this).updateStateVarsOfChildByElmtId(u76, {});
            }
        }, { name: "FeedbackComponent" });
    }
}
