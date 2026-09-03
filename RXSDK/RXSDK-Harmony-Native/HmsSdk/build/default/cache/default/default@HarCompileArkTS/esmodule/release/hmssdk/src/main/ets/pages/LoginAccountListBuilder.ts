// @keepTs
// @ts-nocheck
import type { Account } from '../types/Index';
import { LoginAccountListComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginAccountListComponent&4.0.0";
export class LoginAccountListParams {
    list: Account[] = [];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: Account, index: number) => void;
    onDelClick?: (item: Account, index: number) => void;
    constructor(o93: Account[], p93?: (event?: ClickEvent) => void) {
        this.list = o93;
        this.onCloseClick = p93;
    }
}
export function loginAccountListBuilder(g93: LoginAccountListParams, h93 = null) {
    const i93 = g93;
    {
        (h93 ? h93 : this).observeComponentCreation2((j93, k93, l93 = i93) => {
            if (k93) {
                let m93 = new LoginAccountListComponent(h93 ? h93 : this, {
                    list: l93.list,
                    onItemClick: l93.onItemClick,
                    onCloseClick: l93.onCloseClick,
                    onDelClick: l93.onDelClick,
                }, undefined, j93, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginAccountListBuilder.ets", line: 18, col: 3 });
                ViewPU.create(m93);
                let n93 = () => {
                    return {
                        list: l93.list,
                        onItemClick: l93.onItemClick,
                        onCloseClick: l93.onCloseClick,
                        onDelClick: l93.onDelClick
                    };
                };
                m93.paramsGenerator_ = n93;
            }
            else {
                (h93 ? h93 : this).updateStateVarsOfChildByElmtId(j93, {
                    list: l93.list
                });
            }
        }, { name: "LoginAccountListComponent" });
    }
}
