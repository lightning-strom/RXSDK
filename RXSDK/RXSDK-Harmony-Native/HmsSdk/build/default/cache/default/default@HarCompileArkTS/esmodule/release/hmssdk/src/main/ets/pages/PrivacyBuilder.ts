// @keepTs
// @ts-nocheck
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { WebViewComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewComponent&4.0.0";
interface Protocol {
    key?: string;
    key_list?: string[];
}
export class PrivacyParams {
    onCloseClick?: (event?: ClickEvent) => void;
    protocol?: Protocol;
    constructor(w123: Protocol, x123?: (event?: ClickEvent) => void) {
        this.protocol = w123;
        this.onCloseClick = x123;
    }
}
export function privacyBuilder(o123: PrivacyParams, p123 = null) {
    const q123 = o123;
    {
        (p123 ? p123 : this).observeComponentCreation2((r123, s123, t123 = q123) => {
            if (s123) {
                let u123 = new WebViewComponent(p123 ? p123 : this, { url: ApiPath.getUrl(ApiPath.STATIC_PROTOCOL_LIST), webParams: { "protocol": t123.protocol ? JSON.stringify(t123.protocol) : "" }, onCloseClick: t123.onCloseClick }, undefined, r123, () => { }, { page: "HmsSdk/src/main/ets/pages/PrivacyBuilder.ets", line: 21, col: 3 });
                ViewPU.create(u123);
                let v123 = () => {
                    return {
                        url: ApiPath.getUrl(ApiPath.STATIC_PROTOCOL_LIST),
                        webParams: { "protocol": t123.protocol ? JSON.stringify(t123.protocol) : "" },
                        onCloseClick: t123.onCloseClick
                    };
                };
                u123.paramsGenerator_ = v123;
            }
            else {
                (p123 ? p123 : this).updateStateVarsOfChildByElmtId(r123, {});
            }
        }, { name: "WebViewComponent" });
    }
}
