// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { tipsBuilder, TipsParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsBuilder&4.0.0";
let Instance: TipsDialog;
interface TipsConfig {
    title?: ResourceStr;
    confirmText?: ResourceStr;
    content: ResourceStr;
    cancelText?: ResourceStr;
    cancelVisible?: boolean;
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
}
export class TipsDialog extends BaseDialog<TipsParams> {
    private _config?: TipsConfig;
    private clickClose: boolean = true;
    public setClickClose(j138: boolean) {
        this.clickClose = j138;
        return this;
    }
    public setConfig(i138: TipsConfig) {
        this._config = i138;
        return this;
    }
    public static getInstance(h138: UIContext) {
        if (Instance == null) {
            Instance = new TipsDialog(h138);
        }
        return Instance;
    }
    show(d138?: RCallback) {
        let e138 = new TipsParams((g138) => {
            d138?.({
                code: RXErrorCode.OK,
                message: "确定"
            } as RXResult);
            if (this.clickClose) {
                this.close();
            }
            this._config?.onConfirm?.(g138);
        }, (f138) => {
            d138?.({
                code: RXErrorCode.CANCEL,
                message: "取消"
            } as RXResult);
            if (this.clickClose) {
                this.close();
            }
            this._config?.onCancel?.(f138);
        });
        if (this._config?.title) {
            e138.title = this._config?.title;
        }
        if (this._config?.content) {
            e138.content = this._config?.content;
        }
        if (this._config?.confirmText) {
            e138.confirmText = this._config?.confirmText;
        }
        if (this._config?.cancelText) {
            e138.cancelText = this._config?.cancelText;
        }
        if (this.contentNode) {
            this.contentNode.update(e138);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(tipsBuilder), e138);
        }
        this._show(this.contentNode);
        return this;
    }
}
