// @keepTs
// @ts-nocheck
import { RCallback, RXLoginConfig } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { ChangePasswordParams } from './ChangePasswordBuilder';
export declare class ChangePasswordDialog extends BaseDialog<ChangePasswordParams> {
    private config?;
    setConfig(n75: RXLoginConfig): this;
    static getInstance(m75: UIContext): ChangePasswordDialog;
    show(g75?: RCallback | undefined): this;
}
