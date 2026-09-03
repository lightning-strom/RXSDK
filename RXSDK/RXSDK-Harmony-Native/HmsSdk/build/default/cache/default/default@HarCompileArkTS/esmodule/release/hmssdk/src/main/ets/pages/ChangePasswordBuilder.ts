// @keepTs
// @ts-nocheck
import { ChangePasswordComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/ChangePasswordComponent&4.0.0";
export class ChangePasswordParams {
    isFirstSet: boolean = false;
    onCommitClick?: (password: string, oldPassword?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    constructor(l73: boolean, m73?: (password: string, oldPassword?: string) => void, n73?: (event?: ClickEvent) => void) {
        this.isFirstSet = l73;
        this.onCommitClick = m73;
        this.onCloseClick = n73;
    }
}
export function changePasswordBuilder(d73: ChangePasswordParams, e73 = null) {
    const f73 = d73;
    {
        (e73 ? e73 : this).observeComponentCreation2((g73, h73, i73 = f73) => {
            if (h73) {
                let j73 = new ChangePasswordComponent(e73 ? e73 : this, { isFirstSet: i73.isFirstSet, onCommitClick: i73.onCommitClick, onCloseClick: i73.onCloseClick }, undefined, g73, () => { }, { page: "HmsSdk/src/main/ets/pages/ChangePasswordBuilder.ets", line: 19, col: 3 });
                ViewPU.create(j73);
                let k73 = () => {
                    return {
                        isFirstSet: i73.isFirstSet,
                        onCommitClick: i73.onCommitClick,
                        onCloseClick: i73.onCloseClick
                    };
                };
                j73.paramsGenerator_ = k73;
            }
            else {
                (e73 ? e73 : this).updateStateVarsOfChildByElmtId(g73, {});
            }
        }, { name: "ChangePasswordComponent" });
    }
}
