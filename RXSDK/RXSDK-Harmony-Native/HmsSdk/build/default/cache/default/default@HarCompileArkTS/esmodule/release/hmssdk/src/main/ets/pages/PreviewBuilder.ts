// @keepTs
// @ts-nocheck
import { PreviewComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/PreviewComponent&4.0.0";
export class PreviewParams {
    list: string[];
    index: number = 0;
    onCloseClick?: (event?: ClickEvent) => void;
    public setIndex(t121: number) {
        this.index = t121;
        return this;
    }
    constructor(q121: string[], r121?: (event?: ClickEvent) => void, s121?: number) {
        this.list = q121;
        this.onCloseClick = r121;
        if (s121) {
            this.index = s121;
        }
    }
}
export function previewBuilder(i121: PreviewParams, j121 = null) {
    const k121 = i121;
    {
        (j121 ? j121 : this).observeComponentCreation2((l121, m121, n121 = k121) => {
            if (m121) {
                let o121 = new PreviewComponent(j121 ? j121 : this, {
                    list: n121.list,
                    cursorIdx: n121.index,
                    onCloseClick: n121.onCloseClick,
                }, undefined, l121, () => { }, { page: "HmsSdk/src/main/ets/pages/PreviewBuilder.ets", line: 25, col: 3 });
                ViewPU.create(o121);
                let p121 = () => {
                    return {
                        list: n121.list,
                        cursorIdx: n121.index,
                        onCloseClick: n121.onCloseClick
                    };
                };
                o121.paramsGenerator_ = p121;
            }
            else {
                (j121 ? j121 : this).updateStateVarsOfChildByElmtId(l121, {});
            }
        }, { name: "PreviewComponent" });
    }
}
