// @keepTs
// @ts-nocheck
import { Account } from '../types/Index';
export declare class LoginQuickParams {
    account: Account;
    onCloseClick?: (event?: ClickEvent) => void;
    onStartClick?: (account: Account) => void;
    onMoreMethodClick?: (tag: number) => void;
    constructor(l112: Account, m112?: (event?: ClickEvent) => void);
}
@Builder
export declare function loginQuickBuilder(d112: LoginQuickParams): void;
