import { RCallback, RXCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { Logger } from '../utils/Logger';

import { feedbackListBuilder, FeedbackListParams } from './FeedbackListBuilder';
import { FeedbackDetailDialog } from './FeedbackDetailDialog';

let Instance: FeedbackListDialog;

export class FeedbackListDialog extends BaseDialog<FeedbackListParams, object> {
  page: number = 1
  size: number = 20

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new FeedbackListDialog(uiContext);
    }
    return Instance;
  }


  async show(callback?: RCallback) {
    let args = new FeedbackListParams(() => {
      this.close()
      callback?.({ code: RXErrorCode.UI_CLOSE } as RXResult<object>)
    })
    args.onItemClick = (item) => {
      FeedbackDetailDialog.getInstance(this.uiContext).setId(item.id).show()
    }

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(feedbackListBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}