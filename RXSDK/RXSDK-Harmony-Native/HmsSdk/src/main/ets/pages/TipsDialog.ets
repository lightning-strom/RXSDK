import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { tipsBuilder, TipsParams } from './TipsBuilder';

let Instance: TipsDialog;

interface TipsConfig {
  title?: ResourceStr;
  confirmText?: ResourceStr;
  content: ResourceStr;
  cancelText?: ResourceStr;
  cancelVisible?: boolean;
  onConfirm?: (event?: ClickEvent) => void;
  onCancel?: (event?: ClickEvent) => void
}

export class TipsDialog extends BaseDialog<TipsParams> {
  private _config?: TipsConfig
  private clickClose: boolean = true

  public setClickClose(c: boolean) {
    this.clickClose = c
    return this
  }

  public setConfig(c: TipsConfig) {
    this._config = c
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new TipsDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback) {
    let args = new TipsParams((e) => {
      callback?.({
        code: RXErrorCode.OK,
        message: "确定"
      } as RXResult)
      if (this.clickClose) {
        this.close()
      }
      this._config?.onConfirm?.(e)
    }, (e) => {
      callback?.({
        code: RXErrorCode.CANCEL,
        message: "取消"
      } as RXResult)
      if (this.clickClose) {
        this.close()
      }
      this._config?.onCancel?.(e)
    })
    if (this._config?.title) {
      args.title = this._config?.title
    }
    if (this._config?.content) {
      args.content = this._config?.content
    }
    if (this._config?.confirmText) {
      args.confirmText = this._config?.confirmText
    }
    if (this._config?.cancelText) {
      args.cancelText = this._config?.cancelText
    }


    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(tipsBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }
}