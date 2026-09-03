// @keepTs
// @ts-nocheck
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import UrlUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/UrlUtil&4.0.0";
import { CaptchaVerifyComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/CaptchaVerifyComponent&4.0.0";
export class CaptchaVerifyParams {
    onCloseClick?: (event?: ClickEvent) => void;
    onSliderCaptchaCallback?: (data: object) => void;
    _url: string;
    constructor(c71: string, d71?: (event?: ClickEvent) => void) {
        this.onCloseClick = d71;
        this._url = UrlUtil.joinQuery(ApiPath.getUrl(ApiPath.STATIC_CAPTCHA), { captcha_app_id: c71 });
    }
}
export function captchaVerifyBuilder(u70: CaptchaVerifyParams, v70 = null) {
    const w70 = u70;
    {
        (v70 ? v70 : this).observeComponentCreation2((x70, y70, z70 = w70) => {
            if (y70) {
                let a71 = new CaptchaVerifyComponent(v70 ? v70 : this, { url: z70._url, onCloseClick: z70.onCloseClick, onSliderCaptchaCallback: z70.onSliderCaptchaCallback }, undefined, x70, () => { }, { page: "HmsSdk/src/main/ets/pages/CaptchaVerifyBuilder.ets", line: 18, col: 3 });
                ViewPU.create(a71);
                let b71 = () => {
                    return {
                        url: z70._url,
                        onCloseClick: z70.onCloseClick,
                        onSliderCaptchaCallback: z70.onSliderCaptchaCallback
                    };
                };
                a71.paramsGenerator_ = b71;
            }
            else {
                (v70 ? v70 : this).updateStateVarsOfChildByElmtId(x70, {});
            }
        }, { name: "CaptchaVerifyComponent" });
    }
}
