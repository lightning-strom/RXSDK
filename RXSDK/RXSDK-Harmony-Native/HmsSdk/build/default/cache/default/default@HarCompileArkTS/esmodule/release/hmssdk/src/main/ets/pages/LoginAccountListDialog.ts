// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Account, RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { loginAccountListBuilder, LoginAccountListParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginAccountListBuilder&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
let Instance: LoginAccountListDialog;
interface AccountStateCallback {
    onSwitchAccount?: (account: Account) => void;
    onAccountListEmpty?: () => void;
    onAccountDeleted?: (item: Account, index: number) => void;
}
export class LoginAccountListDialog extends BaseDialog<LoginAccountListParams, Account> {
    config?: AccountStateCallback = {};
    list?: Account[];
    public setConfig(x95: AccountStateCallback) {
        this.config = x95;
        return this;
    }
    public static getInstance(w95: UIContext) {
        if (Instance == null) {
            Instance = new LoginAccountListDialog(w95);
        }
        return Instance;
    }
    show(p95?: RCallback<Account>) {
        let q95 = AccountManager.getAllAccounts() || [];
        this.list ??= q95;
        let r95 = new LoginAccountListParams(this.list || [], () => {
            this.close();
            p95?.({ code: RXErrorCode.UI_CLOSE } as RXResult<Account>);
        });
        r95.onItemClick = (u95, v95) => {
            this.close();
            this.config?.onSwitchAccount?.(u95);
            p95?.({ code: RXErrorCode.OK, data: u95 } as RXResult<Account>);
        };
        r95.onDelClick = (s95, t95) => {
            AccountManager.removeAccountByOpenId(s95.openid);
            this.list = AccountManager.getAllAccounts() || [];
            this.config?.onAccountDeleted?.(s95, t95);
            if (this.list?.length == 0) {
                this.close();
                this.config?.onAccountListEmpty?.();
                p95?.({ code: RXErrorCode.UI_CLOSE, message: "account list empty" } as RXResult<Account>);
            }
        };
        if (this.contentNode) {
            this.contentNode.update(r95);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginAccountListBuilder), r95);
        }
        this._show(this.contentNode);
        return this;
    }
}
