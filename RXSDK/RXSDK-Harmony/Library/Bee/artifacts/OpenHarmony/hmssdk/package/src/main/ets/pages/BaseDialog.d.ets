// @keepTs
// @ts-nocheck
import { ComponentContent } from "@ohos.arkui.node";
import { PromptAction } from "@ohos.arkui.UIContext";
import { UIContext } from "@ohos.arkui.UIContext";
import { IBaseDialog, RCallback, RXResult } from '../types/Index';
export declare abstract class BaseDialog<T extends object, T2 = object> implements IBaseDialog<T2> {
    protected contentNode?: ComponentContent<T>;
    protected uiPromptAction: PromptAction;
    protected uiContext: UIContext;
    private _onCallback?;
    private _onCloseCallback?;
    private _cancelable;
    get cancelable(): boolean;
    setCancelable(t70?: boolean): this;
    setOnCloseCallback(s70: (() => void) | undefined): this;
    get onCloseCallback(): (() => void) | undefined;
    setOnCallback(r70?: ((data: RXResult<T2>) => void)): this;
    protected get onCallback(): ((data: RXResult<T2>) => void) | undefined;
    constructor(q70: UIContext);
    show(p70?: RCallback<T2>): void;
    protected onClose(o70?: ClickEvent): void;
    protected _show(i70: ComponentContent<T>): void;
    close(): void;
}
