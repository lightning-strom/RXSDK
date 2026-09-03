// @keepTs
// @ts-nocheck
import { Account, LoginData, RXCallback, RXLoginConfig, RXResult } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { LoginQuickParams } from './LoginQuicktBuilder';
export declare class LoginQuickDialog extends BaseDialog<LoginQuickParams, LoginData> {
    account: Account;
    private config?;
    setConfig(c112: RXLoginConfig): this;
    static getInstance(b112: UIContext): LoginQuickDialog;
    setAccount(a112: Account): this;
    show(v111?: RXCallback<RXResult<LoginData>>): this;
    private showLoginDialog;
}
