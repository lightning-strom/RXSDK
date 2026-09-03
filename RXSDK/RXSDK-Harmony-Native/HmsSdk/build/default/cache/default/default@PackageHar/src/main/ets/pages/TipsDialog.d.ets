// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { TipsParams } from './TipsBuilder';
interface TipsConfig {
    title?: ResourceStr;
    confirmText?: ResourceStr;
    content: ResourceStr;
    cancelText?: ResourceStr;
    cancelVisible?: boolean;
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
}
export declare class TipsDialog extends BaseDialog<TipsParams> {
    private _config?;
    private clickClose;
    setClickClose(j138: boolean): this;
    setConfig(i138: TipsConfig): this;
    static getInstance(h138: UIContext): TipsDialog;
    show(d138?: RCallback): this;
}
export {};
