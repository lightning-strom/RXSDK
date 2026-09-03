// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { previewBuilder, PreviewParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/PreviewBuilder&4.0.0";
let Instance: PreviewDialog;
export class PreviewDialog extends BaseDialog<PreviewParams> {
    list?: string[];
    index?: number;
    public setList(m123?: string[], n123: number = 0) {
        this.list = m123;
        this.index = n123;
        return this;
    }
    public static getInstance(l123: UIContext) {
        if (Instance == null) {
            Instance = new PreviewDialog(l123);
        }
        return Instance;
    }
    async show(j123?: RCallback) {
        let k123 = new PreviewParams(this.list || [], () => {
            this.close();
            j123?.({ code: RXErrorCode.UI_CLOSE } as RXResult);
        }, this.index);
        if (this.contentNode) {
            this.contentNode.update(k123);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(previewBuilder), k123);
        }
        this._show(this.contentNode);
        return this;
    }
}
