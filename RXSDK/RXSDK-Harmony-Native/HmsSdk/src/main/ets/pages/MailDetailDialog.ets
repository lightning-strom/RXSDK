import { RCallback, RXCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { Logger } from '../utils/Logger';
import Operation from '../api/Operation';

import { mailDetailBuilder, MailDetailParams } from './MailDetailBuilder';
import { MailDetail } from '../types/MailInterfaces';

let Instance: MailDetailDialog;
let TYPE = 1 //单条事件

export class MailDetailDialog extends BaseDialog<MailDetailParams, string> {
  private _mailContent?: MailDetail | undefined;
  userId?: string
  mailId?: number

  public setMailParams( mailId: number,userId?: string) {
    this.userId = userId;
    this.mailId = mailId;
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new MailDetailDialog(uiContext);
    }
    return Instance;
  }

  async show(callback?: RCallback< string>) {
    let mail = this._mailContent || {} as MailDetail
    if (!this._mailContent) {
      let ret: RXResult<object> = await Operation.getEmailDetail( this.mailId,this.userId)
      if (ret.code == 0 && ret.data) {
        mail = ret.data as MailDetail
      }
      Logger.d(ret)
    }
    if (mail && this.mailId) {
      mail.rx_mail_id = this.mailId
    }

    let args = new MailDetailParams(mail, () => {
      this.close()
      callback?.( { code: RXErrorCode.UI_CLOSE } as RXResult<string>)
    })
    //true 删除  false 领取
    args.setOnMailClick((isDelete: boolean) => {
      if (isDelete) {
        Operation.deleteEmail({ cp_user_id: this.userId, type: TYPE, rx_mail_id: this.mailId })
          .then((ret) => {
            if (ret.code == 0) {
              this.close()
              this.uiPromptAction.showToast({ message: "删除成功！" })
            } else {
              this.uiPromptAction.showToast(ret)
            }
          })
      } else {
        Operation.getEmailAward({ cp_user_id: this.userId, type: TYPE, rx_mail_id: this.mailId })
          .then((ret) => {
            if (ret.code == 0) {
              this.close()
              this.uiPromptAction.showToast({ message: "领取成功！" })
            } else {
              this.uiPromptAction.showToast(ret)
            }
          })
      }
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(mailDetailBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}