// @keepTs
// @ts-nocheck
import { Account, RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { LoginAccountListParams } from './LoginAccountListBuilder';
interface AccountStateCallback {
    onSwitchAccount?: (account: Account) => void;
    onAccountListEmpty?: () => void;
    onAccountDeleted?: (item: Account, index: number) => void;
}
export declare class LoginAccountListDialog extends BaseDialog<LoginAccountListParams, Account> {
    config?: AccountStateCallback;
    list?: Account[];
    setConfig(x95: AccountStateCallback): this;
    static getInstance(w95: UIContext): LoginAccountListDialog;
    show(p95?: RCallback<Account>): this;
}
export {};
