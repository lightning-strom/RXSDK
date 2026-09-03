// @keepTs
// @ts-nocheck
import type { Mail, MailItem } from '../types/MailInterfaces';
import { MailListComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailListComponent&4.0.0";
@Observed
export class MailListParams {
    _mailObj: Mail;
    onCloseClick?: (event?: ClickEvent) => void;
    onMailClick?: (mailItem: MailItem) => void;
    onReceiveClick?: () => void;
    public set mailObj(p118: Mail) {
        this._mailObj = p118;
    }
    public setOnReceiveClick(o118: () => void) {
        this.onReceiveClick = o118;
        return this;
    }
    public setOnMailClick(n118: (mailItem: MailItem) => void) {
        this.onMailClick = n118;
        return this;
    }
    constructor(l118: Mail, m118?: (event?: ClickEvent) => void) {
        this._mailObj = l118;
        this.onCloseClick = m118;
    }
}
export function mailListBuilder(d118: MailListParams, e118 = null) {
    const f118 = d118;
    {
        (e118 ? e118 : this).observeComponentCreation2((g118, h118, i118 = f118) => {
            if (h118) {
                let j118 = new MailListComponent(e118 ? e118 : this, {
                    mailObj: i118._mailObj,
                    onCloseClick: i118.onCloseClick,
                    onMailClick: i118.onMailClick,
                    onReceiveClick: i118.onReceiveClick
                }, undefined, g118, () => { }, { page: "HmsSdk/src/main/ets/pages/MailListBuilder.ets", line: 40, col: 3 });
                ViewV2.create(j118);
                let k118 = () => {
                    return {
                        mailObj: i118._mailObj,
                        onCloseClick: i118.onCloseClick,
                        onMailClick: i118.onMailClick,
                        onReceiveClick: i118.onReceiveClick
                    };
                };
                j118.paramsGenerator_ = k118;
            }
            else {
                (e118 ? e118 : this).updateStateVarsOfChildByElmtId(g118, {
                    mailObj: i118._mailObj
                });
            }
        }, { name: "MailListComponent" });
    }
}
