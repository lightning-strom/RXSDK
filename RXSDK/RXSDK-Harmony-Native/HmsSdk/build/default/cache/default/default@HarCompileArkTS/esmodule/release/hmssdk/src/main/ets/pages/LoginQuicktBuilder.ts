// @keepTs
// @ts-nocheck
import type { Account } from '../types/Index';
import { LoginQuickComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginQuickComponent&4.0.0";
export class LoginQuickParams {
    account: Account;
    onCloseClick?: (event?: ClickEvent) => void;
    onStartClick?: (account: Account) => void;
    onMoreMethodClick?: (tag: number) => void;
    constructor(l112: Account, m112?: (event?: ClickEvent) => void) {
        this.account = l112;
        this.onCloseClick = m112;
    }
}
export function loginQuickBuilder(d112: LoginQuickParams, e112 = null) {
    const f112 = d112;
    {
        (e112 ? e112 : this).observeComponentCreation2((g112, h112, i112 = f112) => {
            if (h112) {
                let j112 = new LoginQuickComponent(e112 ? e112 : this, {
                    account: i112.account,
                    onCloseClick: i112.onCloseClick,
                    onStartClick: i112.onStartClick,
                    onMoreMethodClick: i112.onMoreMethodClick,
                }, undefined, g112, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginQuicktBuilder.ets", line: 18, col: 3 });
                ViewPU.create(j112);
                let k112 = () => {
                    return {
                        account: i112.account,
                        onCloseClick: i112.onCloseClick,
                        onStartClick: i112.onStartClick,
                        onMoreMethodClick: i112.onMoreMethodClick
                    };
                };
                j112.paramsGenerator_ = k112;
            }
            else {
                (e112 ? e112 : this).updateStateVarsOfChildByElmtId(g112, {});
            }
        }, { name: "LoginQuickComponent" });
    }
}
