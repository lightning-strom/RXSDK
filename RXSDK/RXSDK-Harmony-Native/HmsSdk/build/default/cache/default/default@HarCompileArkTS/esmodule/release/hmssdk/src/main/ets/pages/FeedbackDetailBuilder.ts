// @keepTs
// @ts-nocheck
import type { FeedbackDetailBean } from '../api/Feedback';
import { FeedbackDetailComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackDetailComponent&4.0.0";
export class FeedbackDetailParams {
    content?: FeedbackDetailBean;
    onCloseClick?: (event?: ClickEvent) => void;
    onReceiveClick?: (event?: ClickEvent) => void;
    public setContent(s81: FeedbackDetailBean) {
        this.content = s81;
        return this;
    }
    constructor(r81?: (event?: ClickEvent) => void) {
        this.onCloseClick = r81;
    }
}
export function feedbackDetailBuilder(j81: FeedbackDetailParams, k81 = null) {
    const l81 = j81;
    {
        (k81 ? k81 : this).observeComponentCreation2((m81, n81, o81 = l81) => {
            if (n81) {
                let p81 = new FeedbackDetailComponent(k81 ? k81 : this, {
                    content: o81.content,
                    onReceiveClick: o81.onReceiveClick,
                    onCloseClick: o81.onCloseClick,
                }, undefined, m81, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackDetailBuilder.ets", line: 21, col: 3 });
                ViewPU.create(p81);
                let q81 = () => {
                    return {
                        content: o81.content,
                        onReceiveClick: o81.onReceiveClick,
                        onCloseClick: o81.onCloseClick
                    };
                };
                p81.paramsGenerator_ = q81;
            }
            else {
                (k81 ? k81 : this).updateStateVarsOfChildByElmtId(m81, {
                    content: o81.content
                });
            }
        }, { name: "FeedbackDetailComponent" });
    }
}
