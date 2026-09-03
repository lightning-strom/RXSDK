// @keepTs
// @ts-nocheck
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { WebViewComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewComponent&4.0.0";
export class ForgotPasswordParams {
    onCloseClick?: (event?: ClickEvent) => void;
    url?: string;
    constructor(l90?: (event?: ClickEvent) => void) {
        this.onCloseClick = l90;
    }
}
export function forgotPasswordBuilder(d90: ForgotPasswordParams, e90 = null) {
    const f90 = d90;
    {
        (e90 ? e90 : this).observeComponentCreation2((g90, h90, i90 = f90) => {
            if (h90) {
                let j90 = new WebViewComponent(e90 ? e90 : this, { url: i90.url || ApiPath.getUrl(ApiPath.STATIC_FORGET_PASSWORD), onCloseClick: i90.onCloseClick }, undefined, g90, () => { }, { page: "HmsSdk/src/main/ets/pages/ForgotPasswordBuilder.ets", line: 16, col: 3 });
                ViewPU.create(j90);
                let k90 = () => {
                    return {
                        url: i90.url || ApiPath.getUrl(ApiPath.STATIC_FORGET_PASSWORD),
                        onCloseClick: i90.onCloseClick
                    };
                };
                j90.paramsGenerator_ = k90;
            }
            else {
                (e90 ? e90 : this).updateStateVarsOfChildByElmtId(g90, {});
            }
        }, { name: "WebViewComponent" });
    }
}
