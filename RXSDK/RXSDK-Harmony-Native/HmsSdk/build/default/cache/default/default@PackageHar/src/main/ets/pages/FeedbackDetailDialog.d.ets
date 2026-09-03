// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { FeedbackDetailParams } from './FeedbackDetailBuilder';
export declare class FeedbackDetailDialog extends BaseDialog<FeedbackDetailParams, object> {
    id: number;
    static getInstance(q86: UIContext): FeedbackDetailDialog;
    setId(p86: number): this;
    show(k86?: RCallback): Promise<this>;
}
