// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { FeedbackListParams } from './FeedbackListBuilder';
export declare class FeedbackListDialog extends BaseDialog<FeedbackListParams, object> {
    page: number;
    size: number;
    static getInstance(c90: UIContext): FeedbackListDialog;
    show(z89?: RCallback): Promise<this>;
}
