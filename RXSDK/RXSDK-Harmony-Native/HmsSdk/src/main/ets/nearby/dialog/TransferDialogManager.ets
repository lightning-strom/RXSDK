import { TransferParams } from "./TransferParams";
import { ComponentContent, promptAction } from "@kit.ArkUI";

import { BusinessError } from '@kit.BasicServicesKit';
import { NearbyLog } from "../common/NearbyLog";
import { NearbyTransferService } from "../NearbyTransferService";
import { buildText } from "./TransferDialogBuilder";


export class TransferDialogManager {
  private static instance: TransferDialogManager;
  private contentNode: ComponentContent<Object>;
  private transferParam: TransferParams;
  private uiContext: UIContext;
  private options: promptAction.BaseDialogOptions;

  private constructor(uiContext: UIContext) {
    this.uiContext = uiContext;
    this.transferParam = new TransferParams("初始化中，请稍候...", () => {
      TransferDialogManager.getInstance()?.closeDialog()
      NearbyTransferService.getInstance().destroy();
    })
    this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(buildText,), this.transferParam);
    this.options = {
      isModal: false,
      alignment: DialogAlignment.Center,
      offset: { dx: 0, dy: 0 }
    };
  }

  public static getInstance(uiContext?: UIContext): TransferDialogManager | undefined {
    if (!TransferDialogManager.instance && uiContext) {
      TransferDialogManager.instance = new TransferDialogManager(uiContext);
    }
    return TransferDialogManager.instance;
  }

  public openDialog() {
    if (this.contentNode !== null) {
      this.uiContext.getPromptAction()
        .openCustomDialog(this.contentNode, this.options)
        .then(() => {
          NearbyLog.info('OpenCustomDialog complete');
        })
        .catch((error: BusinessError) => {
          let message = (error as BusinessError).message;
          let code = (error as BusinessError).code;
          NearbyLog.info(`OpenCustomDialog args error code is ${code}, message is ${message}`);
        })
    }
  }

  public closeDialog() {
    if (this.contentNode !== null) {
      this.uiContext.getPromptAction()
        .closeCustomDialog(this.contentNode)
        .then(() => {
          NearbyLog.info('CloseCustomDialog complete');
        })
        .catch((error: BusinessError) => {
          let message = (error as BusinessError).message;
          let code = (error as BusinessError).code;
          NearbyLog.info(`CloseCustomDialog args error code is ${code}, message is ${message}`);
        })
    }
  }

  /**
   * 动态更新 dialog 信息
   * @param text
   * @param isTransferred
   */
  public updateDialogInfo(text: string, isTransferred: boolean, value: number, total: number) {
    this.transferParam.text = text;
    this.transferParam.isTransferred = isTransferred;
    this.transferParam.transferredData = value; // 数据单位转换为 mb
    this.transferParam.totalData = total;
    this.contentNode.update(this.transferParam);
  }


  public destroy() {
    this.closeDialog();
    this.transferParam = new TransferParams("初始化中，请稍候...")
  }
}
