// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { PreviewParams } from './PreviewBuilder';
export declare class PreviewDialog extends BaseDialog<PreviewParams> {
    list?: string[];
    index?: number;
    setList(m123?: string[], n123?: number): this;
    static getInstance(l123: UIContext): PreviewDialog;
    show(j123?: RCallback): Promise<this>;
}
