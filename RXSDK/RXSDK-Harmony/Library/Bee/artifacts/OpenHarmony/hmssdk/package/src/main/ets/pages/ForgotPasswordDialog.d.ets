// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { ForgotPasswordParams } from './ForgotPasswordBuilder';
export declare class ForgotPasswordDialog extends BaseDialog<ForgotPasswordParams> {
    static getInstance(o90: UIContext): ForgotPasswordDialog;
    show(m90?: RCallback | undefined): this;
}
