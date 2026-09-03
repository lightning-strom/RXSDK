// @keepTs
// @ts-nocheck
import type { MailDetail } from '../types/MailInterfaces';
import { MailDetailComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailDetailComponent&4.0.0";
export class MailDetailParams {
    mailContent: MailDetail;
    onCloseClick?: (event?: ClickEvent) => void;
    _onMailClick?: ((isDelete: boolean) => void) | undefined;
    public setOnMailClick(x112: ((isDelete: boolean) => void) | undefined) {
        this._onMailClick = x112;
        return this;
    }
    constructor(v112: MailDetail, w112?: (event?: ClickEvent) => void) {
        this.mailContent = v112;
        this.onCloseClick = w112;
    }
}
export function mailDetailBuilder(n112: MailDetailParams, o112 = null) {
    const p112 = n112;
    {
        (o112 ? o112 : this).observeComponentCreation2((q112, r112, s112 = p112) => {
            if (r112) {
                let t112 = new MailDetailComponent(o112 ? o112 : this, { mailContent: s112.mailContent, onCloseClick: s112.onCloseClick, onMailClick: s112._onMailClick }, undefined, q112, () => { }, { page: "HmsSdk/src/main/ets/pages/MailDetailBuilder.ets", line: 23, col: 3 });
                ViewPU.create(t112);
                let u112 = () => {
                    return {
                        mailContent: s112.mailContent,
                        onCloseClick: s112.onCloseClick,
                        onMailClick: s112._onMailClick
                    };
                };
                t112.paramsGenerator_ = u112;
            }
            else {
                (o112 ? o112 : this).updateStateVarsOfChildByElmtId(q112, {});
            }
        }, { name: "MailDetailComponent" });
    }
}
