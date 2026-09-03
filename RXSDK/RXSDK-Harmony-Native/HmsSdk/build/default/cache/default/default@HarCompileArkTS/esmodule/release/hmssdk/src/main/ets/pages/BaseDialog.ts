// @keepTs
// @ts-nocheck
import type { ComponentContent } from "@ohos:arkui.node";
import type { PromptAction } from "@ohos:arkui.UIContext";
import type promptAction from "@ohos:promptAction";
import type { UIContext } from "@ohos:arkui.UIContext";
import type { BusinessError } from "@ohos:base";
import type { IBaseDialog, RCallback, RXResult } from '../types/Index';
export abstract class BaseDialog<T extends object, T2 = object> implements IBaseDialog<T2> {
    protected contentNode?: ComponentContent<T>;
    protected uiPromptAction: PromptAction;
    protected uiContext: UIContext;
    private _onCallback?: ((data: RXResult<T2>) => void);
    private _onCloseCallback?: (() => void) | undefined;
    private _cancelable: boolean = true;
    public get cancelable(): boolean {
        return this._cancelable;
    }
    public setCancelable(t70?: boolean) {
        this._cancelable = t70 ?? false;
        return this;
    }
    public setOnCloseCallback(s70: (() => void) | undefined) {
        this._onCloseCallback = s70;
        return this;
    }
    public get onCloseCallback(): (() => void) | undefined {
        return this._onCloseCallback;
    }
    public setOnCallback(r70?: ((data: RXResult<T2>) => void)) {
        this._onCallback = r70;
        return this;
    }
    protected get onCallback(): ((data: RXResult<T2>) => void) | undefined {
        return this._onCallback;
    }
    constructor(q70: UIContext) {
        this.uiContext = q70;
        this.uiPromptAction = q70.getPromptAction();
    }
    show(p70?: RCallback<T2>) {
    }
    protected onClose(o70?: ClickEvent): void {
        this.onCloseCallback?.();
    }
    protected _show(i70: ComponentContent<T>) {
        if (i70) {
            this.contentNode = i70;
        }
        try {
            let m70: promptAction.BaseDialogOptions = {
                alignment: DialogAlignment.Center,
                autoCancel: false,
                maskColor: 0x66000000,
                onWillDismiss: (n70: DismissDialogAction) => {
                    if (this._cancelable && n70.reason == DismissReason.PRESS_BACK) {
                        n70.dismiss();
                        this.onClose();
                    }
                    else {
                        console.info('onWillDismiss:' + JSON.stringify(n70));
                    }
                }
            };
            this.uiPromptAction.openCustomDialog(this.contentNode, m70);
        }
        catch (j70) {
            let k70 = (j70 as BusinessError).message;
            let l70 = (j70 as BusinessError).code;
            console.error(`OpenCustomDialog args error code is ${l70}, message is ${k70}`);
        }
    }
    close() {
        let h70 = this.contentNode;
        if (h70) {
            this.uiPromptAction?.closeCustomDialog(h70);
            this.contentNode = undefined;
            this.onClose();
        }
    }
}
