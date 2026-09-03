import { preferences } from '@kit.ArkData';
import { util } from '@kit.ArkTS';
import { Account, LoginData } from '../types/Index';
import { Logger } from '../utils/Logger';

let STORAGE_KEY = "rx_account_list"
let ACCOUNT_DATA = "rx_accounts_data"
let preferencesObj: preferences.Preferences

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

  constructor(data: Partial<AccountData>) {
    this.update(data)
    this.openid = data.openid || '';
  }

  update(data: Partial<AccountData>) {
    Object.assign(this, data);
  }
}

class AccountManager {
  accountList?: AccountData[] = []

  public async initAsync(context) {
    try {
      preferencesObj = await preferences.getPreferences(context, STORAGE_KEY)
      let dat: preferences.ValueType = await preferencesObj.get(ACCOUNT_DATA, new Uint8Array(0))
      let textDecoder = util.TextDecoder.create('utf-8')
      let val = textDecoder.decodeToString(dat as Uint8Array);
      if (val) {
        const parsedData = JSON.parse(val);
        this.accountList = parsedData.map((item: any) => new AccountData(item));
        Logger.d("Account data loaded successfully." + JSON.stringify(this.accountList));
      } else {
        Logger.d("AccountData cache is null")
      }
    } catch (e) {
      e.msg ??= e.message
      Logger.w(e);
    }
  }

  flush() {
    if (preferencesObj) {
      let uInt8Array = new util.TextEncoder().encodeInto(this.accountsToJson());
      preferencesObj.put(ACCOUNT_DATA, uInt8Array)
      preferencesObj.flush()
    }
  }

  // 通过 openid 查找账户
  findAccountByOpenId(openid: string): AccountData | undefined {
    return this.accountList?.find(account => account.openid === openid);
  }

  findIndexByOpenId(openid: string): number {
    return this.accountList?.findIndex(account => account.openid === openid);
  }

  // 添加账户
  addAccount(account: AccountData): void {
    if (!this.accountList) {
      this.accountList = []
    }
    this.accountList.unshift(account);
    this.flush()
  }

  moveToStart(index: number) {
    let arr = this.accountList
    if (index < 0 || index >= arr.length) {
      throw new Error("Index out of range");
    }
    const element = arr.splice(index, 1)[0];
    arr.unshift(element);
    return arr;
  }


  // 更新账户信息
  updateAccount(openid: string, loginData: Partial<LoginData>, onlyUpdate?: boolean) {
    try {
      let index = this.findIndexByOpenId(openid);
      let updatedData = this.filterLoginDataToAccount(loginData)
      if (index >= 0 && updatedData) {
        let account = this.accountList[index]
        account.update(updatedData)
        this.moveToStart(index)
        this.flush()
      } else if (!onlyUpdate && updatedData) {
        updatedData.openid ??= openid
        const newAccount = new AccountData(
          updatedData
        );
        this.addAccount(newAccount)
      }
    } catch (e) {
      Logger.e(e)
    }
  }

  filterLoginDataToAccount(loginData: Partial<LoginData>): Partial<Account>|undefined {
    if (!loginData) {
      return
    }
    let account: Partial<Account> = {};
    if (loginData.openid !== undefined) {
      account.openid = loginData.openid;
    }
    if (loginData.sex !== undefined) {
      account.sex = loginData.sex;
    }
    if (loginData.nickname !== undefined) {
      account.nickname = loginData.nickname;
    }
    if (loginData.method !== undefined) {
      account.method = loginData.method;
    }
    if (loginData.login_openid !== undefined) {
      account.login_openid = loginData.login_openid;
    }
    if (loginData.login_method !== undefined) {
      account.login_method = loginData.login_method;
    }
    if (loginData.login_username|| loginData.username) {
      account.username = loginData.login_username || loginData.username;
    }
    if (loginData.avatar !== undefined) {
      account.avatar = loginData.avatar;
    }
    return account;
  }

  // 通过 openid 删除账户
  removeAccountByOpenId(openid: string): boolean {
    const index = this.accountList?.findIndex(account => account.openid === openid);
    if (index !== -1) {
      this.accountList?.splice(index, 1);
      this.flush()
      return true;
    }
    return false;
  }

  // 获取所有账户
  getAllAccounts(): AccountData[] {
    return this.accountList;
  }

  getFirstAccount(): AccountData {
    return this.accountList?.[0];
  }

  // 将所有账户转换为 JSON 字符串
  accountsToJson(): string {
    return JSON.stringify(this.accountList || []);
  }
}

export default new AccountManager()