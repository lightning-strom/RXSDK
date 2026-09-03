// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { MailListParams } from './MailListBuilder';
import { Mail } from '../types/MailInterfaces';
export declare class MailListDialog extends BaseDialog<MailListParams, object> {
    mailObj?: Mail;
    private _userId?;
    setUserId(h121?: string): this;
    static getInstance(g121: UIContext): MailListDialog;
    show(x120?: RCallback): Promise<this>;
}
