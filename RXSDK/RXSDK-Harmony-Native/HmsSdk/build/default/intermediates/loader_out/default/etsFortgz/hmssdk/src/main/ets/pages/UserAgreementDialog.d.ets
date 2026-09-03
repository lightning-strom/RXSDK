// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { UserAgreementParams } from './UserAgreementBuilder';
export declare class UserAgreementDialog extends BaseDialog<UserAgreementParams> {
    title: string;
    content: string;
    setContent(r143: string): this;
    setTitle(q143: string): this;
    static getInstance(p143: UIContext): UserAgreementDialog;
    show(j143?: RCallback): this;
}
