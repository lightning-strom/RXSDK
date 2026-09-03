// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Operation from "@normalized:N&&&hmssdk/src/main/ets/api/Operation&4.0.0";
import { mailListBuilder, MailListParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailListBuilder&4.0.0";
import { MailDetailDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailDetailDialog&4.0.0";
import type { Mail } from '../types/MailInterfaces';
let Instance: MailListDialog;
let TYPE = 2;
export class MailListDialog extends BaseDialog<MailListParams, object> {
    mailObj?: Mail;
    private _userId?: string = undefined;
    public setUserId(h121?: string) {
        this._userId = h121;
        return this;
    }
    public static getInstance(g121: UIContext) {
        if (Instance == null) {
            Instance = new MailListDialog(g121);
        }
        return Instance;
    }
    async show(x120?: RCallback) {
        let y120 = this.mailObj || {} as Mail;
        if (!this.mailObj) {
            let f121: RXResult<object> = await Operation.getEmailList(this._userId);
            if (f121.code == 0 && f121.data) {
                y120 = f121.data as Mail;
            }
            Logger.d(f121);
        }
        let z120 = new MailListParams(y120, () => {
            this.close();
            x120?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>);
        });
        z120.setOnReceiveClick(() => {
            Operation.getEmailAward({ cp_user_id: this._userId, type: TYPE })
                .then(async (d121) => {
                if (d121.code == 0) {
                    this.uiPromptAction.showToast({ message: "领取成功！" });
                    let e121: RXResult<object> = await Operation.getEmailList(this._userId);
                    if (e121.code == 0 && e121.data) {
                        y120 = e121.data as Mail;
                        z120.mailObj = y120;
                        if (this.contentNode) {
                            this.contentNode.update(z120);
                        }
                    }
                }
                else {
                    this.uiPromptAction.showToast(d121);
                }
            });
        });
        let a121 = this;
        z120.setOnMailClick((b121) => {
            MailDetailDialog.getInstance(this.uiContext)
                .setMailParams(b121?.rx_mail_id, this._userId)
                .setOnCloseCallback(async () => {
                let c121: RXResult<object> = await Operation.getEmailList(this._userId);
                if (c121.code == 0 && c121.data) {
                    y120 = c121.data as Mail;
                    z120.mailObj = y120;
                    if (a121.contentNode) {
                        a121.contentNode.update(z120);
                    }
                }
                else {
                    this.uiPromptAction.showToast(c121);
                }
            })
                .show();
        });
        if (this.contentNode) {
            this.contentNode.update(z120);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(mailListBuilder), z120);
        }
        this._show(this.contentNode);
        return this;
    }
}
