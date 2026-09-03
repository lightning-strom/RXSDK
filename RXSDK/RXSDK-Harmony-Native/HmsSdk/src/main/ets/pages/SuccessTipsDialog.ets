import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { successTipsBuilder, SuccessTipsParams } from './SuccessTipsBuilder';

let Instance: SuccessTipsDialog;


export class SuccessTipsDialog extends BaseDialog<SuccessTipsParams> {
  private _content?: string | undefined;

  public setContent(value: string | undefined) {
    if (value) {
      this._content = value;
    }
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new SuccessTipsDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback) {
    let args = new SuccessTipsParams((e) => {
      let ret = {
        code: RXErrorCode.OK,
        message: "确定"
      } as RXResult
      callback?.(  ret )
      this.onCallback?.(ret as RXResult)
      this.close()
    })
    if (this._content) {
      args.description = this._content
    }
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(successTipsBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}