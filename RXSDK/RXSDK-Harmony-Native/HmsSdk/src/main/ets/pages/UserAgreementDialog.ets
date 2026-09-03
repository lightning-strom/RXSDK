import { RCallback, RXErrorCode, RXResult  } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { userAgreementBuilder, UserAgreementParams } from './UserAgreementBuilder';
import Devices from '../utils/Devices';

let Instance: UserAgreementDialog;


export class UserAgreementDialog extends BaseDialog<UserAgreementParams> {
  title: string = '';
  content: string = '';

  public setContent(c: string) {
    this.content = c
    return this
  }

  public setTitle(c: string) {
    this.title = c
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new UserAgreementDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback) {
    let args = new UserAgreementParams(this.content, (e) => {
      let ret: RXResult = {
        code: RXErrorCode.OK,
        message: "同意"
      }
      Devices.setPrivacyAgree(getContext())
      this.close()
      callback?.(  ret)
      this.onCallback?.(ret as RXResult)
    }, (e) => {
      let ret: RXResult = {
        code: RXErrorCode.DISAGREE_PRIVACY,
        message: "不同意"
      }
      this.close()
      callback?.( ret)
      this.onCallback?.(ret as RXResult)
    })

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(userAgreementBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}