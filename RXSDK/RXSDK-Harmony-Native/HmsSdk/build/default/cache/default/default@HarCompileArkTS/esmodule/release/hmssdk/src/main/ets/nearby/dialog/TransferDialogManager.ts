// @keepTs
// @ts-nocheck
import { TransferParams } from "@normalized:N&&&hmssdk/src/main/ets/nearby/dialog/TransferParams&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import type promptAction from "@ohos:promptAction";
import type { BusinessError } from "@ohos:base";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import { NearbyTransferService } from "@normalized:N&&&hmssdk/src/main/ets/nearby/NearbyTransferService&4.0.0";
import { buildText } from "@normalized:N&&&hmssdk/src/main/ets/nearby/dialog/TransferDialogBuilder&4.0.0";
export class TransferDialogManager {
    private static instance: TransferDialogManager;
    private contentNode: ComponentContent<Object>;
    private transferParam: TransferParams;
    private uiContext: UIContext;
    private options: promptAction.BaseDialogOptions;
    private constructor(x52: UIContext) {
        this.uiContext = x52;
        this.transferParam = new TransferParams("初始化中，请稍候...", () => {
            TransferDialogManager.getInstance()?.closeDialog();
            NearbyTransferService.getInstance().destroy();
        });
        this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(buildText), this.transferParam);
        this.options = {
            isModal: false,
            alignment: DialogAlignment.Center,
            offset: { dx: 0, dy: 0 }
        };
    }
    public static getInstance(w52?: UIContext): TransferDialogManager | undefined {
        if (!TransferDialogManager.instance && w52) {
            TransferDialogManager.instance = new TransferDialogManager(w52);
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
                .catch((t52: BusinessError) => {
                let u52 = (t52 as BusinessError).message;
                let v52 = (t52 as BusinessError).code;
                NearbyLog.info(`OpenCustomDialog args error code is ${v52}, message is ${u52}`);
            });
        }
    }
    public closeDialog() {
        if (this.contentNode !== null) {
            this.uiContext.getPromptAction()
                .closeCustomDialog(this.contentNode)
                .then(() => {
                NearbyLog.info('CloseCustomDialog complete');
            })
                .catch((q52: BusinessError) => {
                let r52 = (q52 as BusinessError).message;
                let s52 = (q52 as BusinessError).code;
                NearbyLog.info(`CloseCustomDialog args error code is ${s52}, message is ${r52}`);
            });
        }
    }
    public updateDialogInfo(m52: string, n52: boolean, o52: number, p52: number) {
        this.transferParam.text = m52;
        this.transferParam.isTransferred = n52;
        this.transferParam.transferredData = o52;
        this.transferParam.totalData = p52;
        this.contentNode.update(this.transferParam);
    }
    public destroy() {
        this.closeDialog();
        this.transferParam = new TransferParams("初始化中，请稍候...");
    }
}
