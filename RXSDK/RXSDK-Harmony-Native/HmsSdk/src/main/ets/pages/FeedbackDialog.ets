import { Announcement, RCallback, RXCallback, RXErrorCode, RXResult  } from '../types/Index';
import { ComponentContent, promptAction } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { Logger } from '../utils/Logger';
import { feedbackBuilder, FeedbackParams } from './FeedbackBuilder';
import Feedback from '../api/Feedback';
import Oss from '../oss/Oss';
import { LoadingDialog } from './LoadingDialog';


let Instance: FeedbackDialog;


export class FeedbackDialog extends BaseDialog<FeedbackParams, object> {
  private tags: string[] = [];

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new FeedbackDialog(uiContext);
    }
    return Instance;
  }

  public setTags(tag?: string[]) {
    this.tags = this.tags;
    return this;
  }


  async show(callback?: RCallback) {
    let args = new FeedbackParams(() => {
      this.close()
      callback?.(  { code: RXErrorCode.UI_CLOSE } as RXResult<object>)
    })
    args.setOnCommitClick(async (content, attachments, phone) => {
      let loading = LoadingDialog.getInstance(this.uiContext)
        .setTimeout(-1)
        .setText("提交中,请稍后...")
        .setBackgroundColor("#9f000000")
        .show()
      let urls: string[] = [];
      for (let index = 0; index < attachments.length; index++) {
        const element = attachments[index];
        let r = await Oss.uploadFile(getContext(), element)
        if (r.code == 0) {
          urls.push(r.data?.["url"])
        }
      }
      Logger.d("feedback files:" + JSON.stringify(urls))
      let ret = await Feedback.feedbackCreate(content, urls, phone, this.tags)
      Logger.d("feedbackCreate:" + JSON.stringify(ret))
      loading.close();
      if (ret.code == 0) {
        promptAction.showToast({ "message": "提交成功" })
        this.close()
      } else {
        promptAction.showToast(ret)
      }
      callback?.( ret)
      this.onCallback?.(ret as RXResult<object>)
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}