// @keepTs
// @ts-nocheck
import { BaseDialog } from './BaseDialog';
import { LoadingParams } from './LoadingBuilder';
export declare class LoadingDialog extends BaseDialog<LoadingParams> {
    timeout?: number;
    text?: string;
    bgColor?: ResourceColor;
    setBackgroundColor(f93: ResourceColor): this;
    setText(e93: string): this;
    setTimeout(d93: number): this;
    static getInstance(c93: UIContext): LoadingDialog;
    show(): this;
}
