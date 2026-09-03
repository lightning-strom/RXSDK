// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Operation from "@normalized:N&&&hmssdk/src/main/ets/api/Operation&4.0.0";
import { mailDetailBuilder, MailDetailParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailDetailBuilder&4.0.0";
import type { MailDetail } from '../types/MailInterfaces';
let Instance: MailDetailDialog;
let TYPE = 1;
export class MailDetailDialog extends BaseDialog<MailDetailParams, string> {
    private _mailContent?: MailDetail | undefined;
    userId?: string;
    mailId?: number;
    public setMailParams(b118: number, c118?: string) {
        this.userId = c118;
        this.mailId = b118;
        return this;
    }
    public static getInstance(a118: UIContext) {
        if (Instance == null) {
            Instance = new MailDetailDialog(a118);
        }
        return Instance;
    }
    async show(t117?: RCallback<string>) {
        let u117 = this._mailContent || {} as MailDetail;
        if (!this._mailContent) {
            let z117: RXResult<object> = await Operation.getEmailDetail(this.mailId, this.userId);
            if (z117.code == 0 && z117.data) {
                u117 = z117.data as MailDetail;
            }
            Logger.d(z117);
        }
        if (u117 && this.mailId) {
            u117.rx_mail_id = this.mailId;
        }
        let v117 = new MailDetailParams(u117, () => {
            this.close();
            t117?.({ code: RXErrorCode.UI_CLOSE } as RXResult<string>);
        });
        v117.setOnMailClick((w117: boolean) => {
            if (w117) {
                Operation.deleteEmail({ cp_user_id: this.userId, type: TYPE, rx_mail_id: this.mailId })
                    .then((y117) => {
                    if (y117.code == 0) {
                        this.close();
                        this.uiPromptAction.showToast({ message: "删除成功！" });
                    }
                    else {
                        this.uiPromptAction.showToast(y117);
                    }
                });
            }
            else {
                Operation.getEmailAward({ cp_user_id: this.userId, type: TYPE, rx_mail_id: this.mailId })
                    .then((x117) => {
                    if (x117.code == 0) {
                        this.close();
                        this.uiPromptAction.showToast({ message: "领取成功！" });
                    }
                    else {
                        this.uiPromptAction.showToast(x117);
                    }
                });
            }
        });
        if (this.contentNode) {
            this.contentNode.update(v117);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(mailDetailBuilder), v117);
        }
        this._show(this.contentNode);
        return this;
    }
}
