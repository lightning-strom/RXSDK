import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { Logger } from '../utils/Logger';
import Operation from '../api/Operation';
import { mailListBuilder, MailListParams } from './MailListBuilder';
import { MailDetailDialog } from './MailDetailDialog';
import { Mail } from '../types/MailInterfaces';

let Instance: MailListDialog;
let TYPE = 2

export class MailListDialog extends BaseDialog<MailListParams, object> {
  mailObj?: Mail
  private _userId?: string = undefined;

  public setUserId(value?: string) {
    this._userId = value;
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new MailListDialog(uiContext);
    }
    return Instance;
  }

  async show(callback?: RCallback) {
    let mail = this.mailObj || {} as Mail
    if (!this.mailObj) {
      let ret: RXResult<object> = await Operation.getEmailList(this._userId)
      if (ret.code == 0 && ret.data) {
        mail = ret.data as Mail
        // mail.list.forEach((it)=>{it.status=3})
      }
      Logger.d(ret)
    }

    let args = new MailListParams(mail, () => {
      this.close()
      callback?.(  { code: RXErrorCode.UI_CLOSE } as RXResult<object>)
    })
    args.setOnReceiveClick(() => {
      Operation.getEmailAward({ cp_user_id: this._userId, type: TYPE })
        .then(async (ret) => {
          if (ret.code == 0) {
            this.uiPromptAction.showToast({ message: "领取成功！" })
            let ret: RXResult<object> = await Operation.getEmailList(this._userId)
            if (ret.code == 0 && ret.data) {
              mail = ret.data as Mail
              args.mailObj = mail
              // args.mailList = mail.list
              if (this.contentNode) {
                this.contentNode.update(args)
              }
            }
          } else {
            this.uiPromptAction.showToast(ret)
          }
        })
    })

    let self = this

    args.setOnMailClick((mailItem) => {
      MailDetailDialog.getInstance(this.uiContext)
        .setMailParams( mailItem?.rx_mail_id,this._userId)
        .setOnCloseCallback(async () => {
          let ret: RXResult<object> = await Operation.getEmailList(this._userId)
          if (ret.code == 0 && ret.data) {
            mail = ret.data as Mail
            args.mailObj = mail
            // args.mailList = mail.list

            if (self.contentNode) {
              self.contentNode.update(args)
            }
          } else {
            this.uiPromptAction.showToast(ret)
          }
        })
        .show()
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(mailListBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }



}