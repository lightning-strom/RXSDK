import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { loadingBuilder, LoadingParams } from './LoadingBuilder';

let Instance: LoadingDialog;

export class LoadingDialog extends BaseDialog<LoadingParams> {
  timeout?: number
  text?: string
  bgColor?: ResourceColor

  public setBackgroundColor(col: ResourceColor) {
    this.bgColor = col
    return this
  }

  public setText(text: string) {
    this.text = text
    return this
  }

  public setTimeout(timeMilli: number) {
    this.timeout = timeMilli
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new LoadingDialog(uiContext);
    }
    return Instance;
  }

  show() {
    let args = new LoadingParams(async () => {
      this.close()
    })
    if (this.timeout) {
      args.timeout = this.timeout
    }
    if (this.text) {
      args.text = this.text
    }
    if (this.bgColor) {
      args.bgColor = this.bgColor
    }
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loadingBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}