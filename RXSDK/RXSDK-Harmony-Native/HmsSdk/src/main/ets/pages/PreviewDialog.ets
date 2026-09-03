import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';

import { previewBuilder, PreviewParams } from './PreviewBuilder';

let Instance: PreviewDialog;


export class PreviewDialog extends BaseDialog<PreviewParams> {
  list?: string[]
  index?: number

  public setList(list?: string[], index: number = 0) {
    this.list = list
    this.index = index
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new PreviewDialog(uiContext);
    }
    return Instance;
  }

  async show(callback?: RCallback) {
    let args = new PreviewParams(this.list || [], () => {
      this.close()
      callback?.(  { code: RXErrorCode.UI_CLOSE } as RXResult)
    }, this.index)

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(previewBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}