// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
import { SuccessTipsComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/SuccessTipsComponent&4.0.0";
export class SuccessTipsParams {
    title: ResourceStr = "实名认证";
    icon: ResourceStr = { "id": -1, "type": 20000, params: ['app.media.rx_tips_ico_success'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
    description: ResourceStr = "实名认证成功";
    onConfirm?: (event?: ClickEvent) => void;
    constructor(n133?: (event?: ClickEvent) => void) {
        this.onConfirm = n133;
    }
}
export function successTipsBuilder(f133: SuccessTipsParams, g133 = null) {
    const h133 = f133;
    {
        (g133 ? g133 : this).observeComponentCreation2((i133, j133, k133 = h133) => {
            if (j133) {
                let l133 = new SuccessTipsComponent(g133 ? g133 : this, {
                    title: k133.title,
                    icon: k133.icon,
                    description: k133.description,
                    onCloseClick: k133.onConfirm,
                }, undefined, i133, () => { }, { page: "HmsSdk/src/main/ets/pages/SuccessTipsBuilder.ets", line: 16, col: 3 });
                ViewPU.create(l133);
                let m133 = () => {
                    return {
                        title: k133.title,
                        icon: k133.icon,
                        description: k133.description,
                        onCloseClick: k133.onConfirm
                    };
                };
                l133.paramsGenerator_ = m133;
            }
            else {
                (g133 ? g133 : this).updateStateVarsOfChildByElmtId(i133, {});
            }
        }, { name: "SuccessTipsComponent" });
    }
}
