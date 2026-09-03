// @keepTs
// @ts-nocheck
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { loadingBuilder, LoadingParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoadingBuilder&4.0.0";
let Instance: LoadingDialog;
export class LoadingDialog extends BaseDialog<LoadingParams> {
    timeout?: number;
    text?: string;
    bgColor?: ResourceColor;
    public setBackgroundColor(f93: ResourceColor) {
        this.bgColor = f93;
        return this;
    }
    public setText(e93: string) {
        this.text = e93;
        return this;
    }
    public setTimeout(d93: number) {
        this.timeout = d93;
        return this;
    }
    public static getInstance(c93: UIContext) {
        if (Instance == null) {
            Instance = new LoadingDialog(c93);
        }
        return Instance;
    }
    show() {
        let b93 = new LoadingParams(async () => {
            this.close();
        });
        if (this.timeout) {
            b93.timeout = this.timeout;
        }
        if (this.text) {
            b93.text = this.text;
        }
        if (this.bgColor) {
            b93.bgColor = this.bgColor;
        }
        if (this.contentNode) {
            this.contentNode.update(b93);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loadingBuilder), b93);
        }
        this._show(this.contentNode);
        return this;
    }
}
