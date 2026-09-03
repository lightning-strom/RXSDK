// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { SuccessTipsParams } from './SuccessTipsBuilder';
export declare class SuccessTipsDialog extends BaseDialog<SuccessTipsParams> {
    private _content?;
    setContent(h135: string | undefined): this;
    static getInstance(g135: UIContext): SuccessTipsDialog;
    show(c135?: RCallback): this;
}
