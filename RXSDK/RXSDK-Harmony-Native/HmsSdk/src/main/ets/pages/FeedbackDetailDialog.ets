import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';

import { feedbackDetailBuilder, FeedbackDetailParams } from './FeedbackDetailBuilder';
import Feedback, { FeedbackDetailBean } from '../api/Feedback';

let Instance: FeedbackDetailDialog;

export class FeedbackDetailDialog extends BaseDialog<FeedbackDetailParams, object> {
  id: number = 0

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new FeedbackDetailDialog(uiContext);
    }
    return Instance;
  }

  public setId(id: number) {
    this.id = id
    return this;
  }

  async show(callback?: RCallback) {
    let ret = await Feedback.getFeedbackDetail(this.id)
    let args = new FeedbackDetailParams(() => {
      this.close()
      callback?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>)
    })
    if (ret.code == 0 && ret.data) {
      args.setContent(ret.data as FeedbackDetailBean)
    }
    args.onReceiveClick = async () => {
      let re = await Feedback.feedbackGetprop(this.id)
      if (re.code == 0) {
        this.uiPromptAction.showToast({ message: "领取成功" })
        ret == await Feedback.getFeedbackDetail(this.id)
      } else {
        this.uiPromptAction.showToast(re)
      }
      if (re.code == 0 && re.code == 0 && ret.data) {
        let c = ret.data as FeedbackDetailBean
        c.get_prop = 1
        args.setContent(c)
        if (this.contentNode) {
          this.contentNode.update(args)
        }
      }
    }

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackDetailBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}