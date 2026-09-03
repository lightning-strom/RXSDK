// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { FeedbackParams } from './FeedbackBuilder';
export declare class FeedbackDialog extends BaseDialog<FeedbackParams, object> {
    private tags;
    static getInstance(d87: UIContext): FeedbackDialog;
    setTags(c87?: string[]): this;
    show(r86?: RCallback): Promise<this>;
}
