// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { MailDetailParams } from './MailDetailBuilder';
export declare class MailDetailDialog extends BaseDialog<MailDetailParams, string> {
    private _mailContent?;
    userId?: string;
    mailId?: number;
    setMailParams(b118: number, c118?: string): this;
    static getInstance(a118: UIContext): MailDetailDialog;
    show(t117?: RCallback<string>): Promise<this>;
}
