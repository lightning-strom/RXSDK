// @keepTs
// @ts-nocheck
import { TipsComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsComponent&4.0.0";
export class TipsParams {
    title: ResourceStr = '提示';
    confirmText: ResourceStr = '确定';
    content: ResourceStr = '';
    cancelText: ResourceStr = '取消';
    cancelVisible: boolean = true;
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
    constructor(q135?: (event?: ClickEvent) => void, r135?: (event?: ClickEvent) => void) {
        this.onConfirm = q135;
        this.onCancel = r135;
    }
}
export function tipsBuilder(i135: TipsParams, j135 = null) {
    const k135 = i135;
    {
        (j135 ? j135 : this).observeComponentCreation2((l135, m135, n135 = k135) => {
            if (m135) {
                let o135 = new TipsComponent(j135 ? j135 : this, {
                    onConfirm: n135.onConfirm,
                    onCancel: n135.onCancel,
                    title: n135.title,
                    confirmText: n135.confirmText,
                    cancelText: n135.cancelText,
                    content: n135.content
                }, undefined, l135, () => { }, { page: "HmsSdk/src/main/ets/pages/TipsBuilder.ets", line: 21, col: 3 });
                ViewPU.create(o135);
                let p135 = () => {
                    return {
                        onConfirm: n135.onConfirm,
                        onCancel: n135.onCancel,
                        title: n135.title,
                        confirmText: n135.confirmText,
                        cancelText: n135.cancelText,
                        content: n135.content
                    };
                };
                o135.paramsGenerator_ = p135;
            }
            else {
                (j135 ? j135 : this).updateStateVarsOfChildByElmtId(l135, {});
            }
        }, { name: "TipsComponent" });
    }
}
