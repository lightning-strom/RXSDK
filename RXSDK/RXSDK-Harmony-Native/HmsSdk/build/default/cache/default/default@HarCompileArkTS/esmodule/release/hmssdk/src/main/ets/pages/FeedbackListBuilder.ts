// @keepTs
// @ts-nocheck
import type { FeedbackItemBean } from '../types/Index';
import { FeedbackListComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackListComponent&4.0.0";
export class FeedbackListParams {
    page: number = 1;
    size: number = 20;
    resList?: FeedbackItemBean[];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: FeedbackItemBean) => void;
    constructor(m87?: (event?: ClickEvent) => void) {
        this.onCloseClick = m87;
    }
}
export function feedbackListBuilder(e87: FeedbackListParams, f87 = null) {
    const g87 = e87;
    {
        (f87 ? f87 : this).observeComponentCreation2((h87, i87, j87 = g87) => {
            if (i87) {
                let k87 = new FeedbackListComponent(f87 ? f87 : this, {
                    pageSize: j87.size,
                    currentPage: j87.page,
                    resList: j87.resList,
                    onItemClick: j87.onItemClick,
                    onCloseClick: j87.onCloseClick,
                }, undefined, h87, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackListBuilder.ets", line: 18, col: 3 });
                ViewPU.create(k87);
                let l87 = () => {
                    return {
                        pageSize: j87.size,
                        currentPage: j87.page,
                        resList: j87.resList,
                        onItemClick: j87.onItemClick,
                        onCloseClick: j87.onCloseClick
                    };
                };
                k87.paramsGenerator_ = l87;
            }
            else {
                (f87 ? f87 : this).updateStateVarsOfChildByElmtId(h87, {});
            }
        }, { name: "FeedbackListComponent" });
    }
}
