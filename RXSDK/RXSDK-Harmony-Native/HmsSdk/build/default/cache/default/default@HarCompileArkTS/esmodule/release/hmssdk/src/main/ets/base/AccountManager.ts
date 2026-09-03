import preferences from "@ohos:data.preferences";
import util from "@ohos:util";
import type { Account, LoginData } from '../types/Index';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
let STORAGE_KEY = "rx_account_list";
let ACCOUNT_DATA = "rx_accounts_data";
let preferencesObj: preferences.Preferences;
class AccountData implements Account {
    openid: string;
    login_openid: string;
    method: string;
    login_method: string;
    username: string;
    password?: string;
    avatar?: string;
    nickname?: string;
    sex?: number;
    constructor(w9: Partial<AccountData>) {
        this.update(w9);
        this.openid = w9.openid || '';
    }
    update(v9: Partial<AccountData>) {
        Object.assign(this, v9);
    }
}
class AccountManager {
    accountList?: AccountData[] = [];
    public async initAsync(o9) {
        try {
            preferencesObj = await preferences.getPreferences(o9, STORAGE_KEY);
            let q9: preferences.ValueType = await preferencesObj.get(ACCOUNT_DATA, new Uint8Array(0));
            let r9 = util.TextDecoder.create('utf-8');
            let s9 = r9.decodeToString(q9 as Uint8Array);
            if (s9) {
                const t9 = JSON.parse(s9);
                this.accountList = t9.map((u9: any) => new AccountData(u9));
                Logger.d("Account data loaded successfully." + JSON.stringify(this.accountList));
            }
            else {
                Logger.d("AccountData cache is null");
            }
        }
        catch (p9) {
            p9.msg ??= p9.message;
            Logger.w(p9);
        }
    }
    flush() {
        if (preferencesObj) {
            let n9 = new util.TextEncoder().encodeInto(this.accountsToJson());
            preferencesObj.put(ACCOUNT_DATA, n9);
            preferencesObj.flush();
        }
    }
    findAccountByOpenId(l9: string): AccountData | undefined {
        return this.accountList?.find(m9 => m9.openid === l9);
    }
    findIndexByOpenId(j9: string): number {
        return this.accountList?.findIndex(k9 => k9.openid === j9);
    }
    addAccount(i9: AccountData): void {
        if (!this.accountList) {
            this.accountList = [];
        }
        this.accountList.unshift(i9);
        this.flush();
    }
    moveToStart(f9: number) {
        let g9 = this.accountList;
        if (f9 < 0 || f9 >= g9.length) {
            throw new Error("Index out of range");
        }
        const h9 = g9.splice(f9, 1)[0];
        g9.unshift(h9);
        return g9;
    }
    updateAccount(x8: string, y8: Partial<LoginData>, z8?: boolean) {
        try {
            let b9 = this.findIndexByOpenId(x8);
            let c9 = this.filterLoginDataToAccount(y8);
            if (b9 >= 0 && c9) {
                let e9 = this.accountList[b9];
                e9.update(c9);
                this.moveToStart(b9);
                this.flush();
            }
            else if (!z8 && c9) {
                c9.openid ??= x8;
                const d9 = new AccountData(c9);
                this.addAccount(d9);
            }
        }
        catch (a9) {
            Logger.e(a9);
        }
    }
    filterLoginDataToAccount(v8: Partial<LoginData>): Partial<Account> | undefined {
        if (!v8) {
            return;
        }
        let w8: Partial<Account> = {};
        if (v8.openid !== undefined) {
            w8.openid = v8.openid;
        }
        if (v8.sex !== undefined) {
            w8.sex = v8.sex;
        }
        if (v8.nickname !== undefined) {
            w8.nickname = v8.nickname;
        }
        if (v8.method !== undefined) {
            w8.method = v8.method;
        }
        if (v8.login_openid !== undefined) {
            w8.login_openid = v8.login_openid;
        }
        if (v8.login_method !== undefined) {
            w8.login_method = v8.login_method;
        }
        if (v8.login_username || v8.username) {
            w8.username = v8.login_username || v8.username;
        }
        if (v8.avatar !== undefined) {
            w8.avatar = v8.avatar;
        }
        return w8;
    }
    removeAccountByOpenId(s8: string): boolean {
        const t8 = this.accountList?.findIndex(u8 => u8.openid === s8);
        if (t8 !== -1) {
            this.accountList?.splice(t8, 1);
            this.flush();
            return true;
        }
        return false;
    }
    getAllAccounts(): AccountData[] {
        return this.accountList;
    }
    getFirstAccount(): AccountData {
        return this.accountList?.[0];
    }
    accountsToJson(): string {
        return JSON.stringify(this.accountList || []);
    }
}
export default new AccountManager();
