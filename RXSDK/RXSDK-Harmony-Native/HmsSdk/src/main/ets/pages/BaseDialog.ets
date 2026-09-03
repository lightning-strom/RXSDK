import { ComponentContent, PromptAction, promptAction, UIContext } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { IBaseDialog, RCallback, RXCallback, RXResult } from '../types/Index';


export abstract class BaseDialog<T extends object, T2 = object> implements IBaseDialog<T2> {
  protected contentNode?: ComponentContent<T>;
  protected uiPromptAction: PromptAction;
  protected uiContext: UIContext;
  private _onCallback?: ((data: RXResult<T2>) => void);
  private _onCloseCallback?: (() => void) | undefined;
  private _cancelable: boolean = true;

  public get cancelable(): boolean {
    return this._cancelable;
  }

  public setCancelable(value?: boolean) {
    this._cancelable = value ?? false;
    return this
  }

  public setOnCloseCallback(value: (() => void) | undefined) {
    this._onCloseCallback = value;
    return this
  }

  public get onCloseCallback(): (() => void) | undefined {
    return this._onCloseCallback;
  }

  public setOnCallback(value?: ((data: RXResult<T2>) => void)) {
    this._onCallback = value;
    return this
  }

  protected get onCallback(): ((data: RXResult<T2>) => void) | undefined {
    return this._onCallback;
  }

  constructor(uiContext: UIContext) {
    this.uiContext = uiContext
    this.uiPromptAction = uiContext.getPromptAction()
  }

  show(callback?: RCallback<T2>) {
  }

  protected onClose(event?: ClickEvent): void {
    this.onCloseCallback?.()
  }

  protected _show(component: ComponentContent<T>) {
    if (component) {
      this.contentNode = component
    }
    try {
      let options: promptAction.BaseDialogOptions = {
        alignment: DialogAlignment.Center,
        autoCancel: false,
        maskColor: 0x66000000,
        onWillDismiss: (dismissDialogAction: DismissDialogAction) => {
          if (this._cancelable && dismissDialogAction.reason == DismissReason.PRESS_BACK) {
            dismissDialogAction.dismiss();
            this.onClose()
          } else {
            console.info('onWillDismiss:' + JSON.stringify(dismissDialogAction));
          }
        }
      };
      this.uiPromptAction.openCustomDialog(this.contentNode, options);
    } catch (error) {
      let message = (error as BusinessError).message;
      let code = (error as BusinessError).code;
      console.error(`OpenCustomDialog args error code is ${code}, message is ${message}`);
    }
  }

  close() {
    let contentNode = this.contentNode
    if (contentNode) {
      this.uiPromptAction?.closeCustomDialog(contentNode);
      this.contentNode = undefined;
      this.onClose()
    }
  }
}