// @keepTs
// @ts-nocheck
import type gameNearbyTransfer from "@hms:core.gameservice.gamenearbytransfer";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import { NearbyTransferService } from "@normalized:N&&&hmssdk/src/main/ets/nearby/NearbyTransferService&4.0.0";
export class NearbyHandler {
    public async Create(p53?: string): Promise<Array<any>> {
        let q53: UIContext = SDKConfig.uiContext;
        NearbyLog.info("Create:" + p53);
        let r53: gameNearbyTransfer.CreateParameters = p53 ? JSON.parse(p53) : undefined;
        try {
            let t53: Array<any> = await NearbyTransferService.getInstance().create(q53!, r53);
            return t53;
        }
        catch (s53) {
            return [JSON.stringify(s53)];
        }
    }
    public RegisterCallback(): Promise<Array<any>> {
        NearbyLog.info("RegisterCallback");
        return NearbyTransferService.getInstance().registerCallback();
    }
    public UnregisterCallback() {
        NearbyLog.info("UnregisterCallback");
        NearbyTransferService.getInstance().unregisterCallback();
    }
    public PublishNearbyGame(): Promise<Array<any>> {
        NearbyLog.info("PublishNearbyGame");
        return NearbyTransferService.getInstance().publishNearbyGame();
    }
    public Discovery(): Promise<Array<any>> {
        return NearbyTransferService.getInstance().discovery();
    }
    public AutoBindNearbyGame(): Promise<Array<any>> {
        NearbyLog.info("AutoBindNearbyGame");
        return NearbyTransferService.getInstance().autoBindNearbyGame();
    }
    public BindNearbyGame(n53: string): Promise<Array<any>> {
        NearbyLog.info("BindNearbyGame:" + n53);
        let o53: gameNearbyTransfer.NearbyGameDevice = n53 ? JSON.parse(n53) : undefined;
        return NearbyTransferService.getInstance().bindNearbyGame(o53);
    }
    public static AcceptCollaboration(m53: Record<string, object>) {
        NearbyLog.info("AcceptCollaboration");
        NearbyTransferService.acceptCollaboration(m53);
    }
    public SendPackageInfo(k53: string): Promise<Array<any>> {
        let l53: gameNearbyTransfer.PackageInfo = k53 ? JSON.parse(k53) : undefined;
        return NearbyTransferService.getInstance().sendPackageInfo(l53);
    }
    public ReplyPackageInfoResult(i53: string): Promise<Array<any>> {
        let j53: gameNearbyTransfer.PackageInfoResult = i53 ? JSON.parse(i53) : undefined;
        return NearbyTransferService.getInstance().replyPackageInfoResult(j53);
    }
    public TransferPackageData(g53: string): Promise<Array<any>> {
        let h53: gameNearbyTransfer.PackageData = g53 ? JSON.parse(g53) : undefined;
        return NearbyTransferService.getInstance().transferPackageData(h53);
    }
    public Destroy(): Promise<Array<any>> {
        return NearbyTransferService.getInstance().destroy();
    }
    static Instance: NearbyHandler;
    public static getInstance(): NearbyHandler {
        if (NearbyHandler.Instance == null) {
            NearbyHandler.Instance = new NearbyHandler();
        }
        return NearbyHandler.Instance;
    }
}
