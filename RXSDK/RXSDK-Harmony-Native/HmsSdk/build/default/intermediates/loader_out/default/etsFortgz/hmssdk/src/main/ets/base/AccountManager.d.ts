import { Account, LoginData } from '../types/Index';
declare class AccountData implements Account {
    openid: string;
    login_openid: string;
    method: string;
    login_method: string;
    username: string;
    password?: string;
    avatar?: string;
    nickname?: string;
    sex?: number;
    constructor(w9: Partial<AccountData>);
    update(v9: Partial<AccountData>): void;
}
declare class AccountManager {
    accountList?: AccountData[];
    initAsync(o9: any): Promise<void>;
    flush(): void;
    findAccountByOpenId(l9: string): AccountData | undefined;
    findIndexByOpenId(j9: string): number;
    addAccount(i9: AccountData): void;
    moveToStart(f9: number): AccountData[];
    updateAccount(x8: string, y8: Partial<LoginData>, z8?: boolean): void;
    filterLoginDataToAccount(v8: Partial<LoginData>): Partial<Account> | undefined;
    removeAccountByOpenId(s8: string): boolean;
    getAllAccounts(): AccountData[];
    getFirstAccount(): AccountData;
    accountsToJson(): string;
}
declare const _default: AccountManager;
export default _default;
