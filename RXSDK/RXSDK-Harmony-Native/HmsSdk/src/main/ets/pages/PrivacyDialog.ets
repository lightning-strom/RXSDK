import { RCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';

import { BaseDialog } from './BaseDialog';
import { privacyBuilder, PrivacyParams } from './PrivacyBuilder';

let Instance: PrivacyDialog;



export class PrivacyDialog extends BaseDialog<PrivacyParams> {
  private _key?: string;
  private _key_list?: string[];

  public setKeyData(value: string[], key: string) {
    this._key_list = value;
    this._key = key;
    return this
  }

  public static getInstance(uiContext: UIContext,) {
    if (Instance == null) {
      Instance = new PrivacyDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RCallback | undefined) {
    let args = new PrivacyParams({ key: this._key, key_list: this._key_list }, () => {
      this.close()
      callback?.({ code: RXErrorCode.UI_CLOSE } as RXResult)
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(privacyBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}