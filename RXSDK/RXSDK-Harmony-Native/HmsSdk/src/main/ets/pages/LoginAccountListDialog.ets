import { Account, RCallback, RXCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';

import { loginAccountListBuilder, LoginAccountListParams } from './LoginAccountListBuilder';
import AccountManager from '../base/AccountManager';

let Instance: LoginAccountListDialog;

interface AccountStateCallback {
  onSwitchAccount?: (account: Account) => void;
  onAccountListEmpty?: () => void;
  onAccountDeleted?: (item: Account, index: number) => void;
}

export class LoginAccountListDialog extends BaseDialog<LoginAccountListParams, Account> {
  config?: AccountStateCallback = {}
  list?: Account[]

  public setConfig(config: AccountStateCallback) {
    this.config = config
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new LoginAccountListDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback<Account>) {
    let accounts = AccountManager.getAllAccounts() || [];
    this.list ??= accounts;

    let args = new LoginAccountListParams(this.list || [], () => {
      this.close()
      callback?.({ code: RXErrorCode.UI_CLOSE } as RXResult<Account>)
    })
    args.onItemClick = (item, index) => {
      this.close()
      this.config?.onSwitchAccount?.(item)
      callback?.({ code: RXErrorCode.OK, data: item } as RXResult<Account>)
    }
    args.onDelClick = (item, index) => {
      AccountManager.removeAccountByOpenId(item.openid)
      this.list = AccountManager.getAllAccounts() || [];
      this.config?.onAccountDeleted?.(item, index)
      if (this.list?.length == 0) {
        this.close()
        this.config?.onAccountListEmpty?.()
        callback?.({ code: RXErrorCode.UI_CLOSE, message: "account list empty" } as RXResult<Account>)
      }
    }

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginAccountListBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}