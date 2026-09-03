// @keepTs
// @ts-nocheck
import { RegisterComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/RegisterComponent&4.0.0";
export class RegisterParams {
    onCommitClick?: (username: string, password?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    constructor(l130?: (username: string, password?: string) => void, m130?: (event?: ClickEvent) => void) {
        this.onCommitClick = l130;
        this.onCloseClick = m130;
    }
}
export function registerBuilder(d130: RegisterParams, e130 = null) {
    const f130 = d130;
    {
        (e130 ? e130 : this).observeComponentCreation2((g130, h130, i130 = f130) => {
            if (h130) {
                let j130 = new RegisterComponent(e130 ? e130 : this, { onCommitClick: i130.onCommitClick, onCloseClick: i130.onCloseClick }, undefined, g130, () => { }, { page: "HmsSdk/src/main/ets/pages/RegisterBuilder.ets", line: 16, col: 3 });
                ViewPU.create(j130);
                let k130 = () => {
                    return {
                        onCommitClick: i130.onCommitClick,
                        onCloseClick: i130.onCloseClick
                    };
                };
                j130.paramsGenerator_ = k130;
            }
            else {
                (e130 ? e130 : this).updateStateVarsOfChildByElmtId(g130, {});
            }
        }, { name: "RegisterComponent" });
    }
}
