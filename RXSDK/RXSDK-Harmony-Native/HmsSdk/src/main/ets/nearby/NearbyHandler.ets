import { gameNearbyTransfer } from "@kit.GameServiceKit";
import SDKConfig from "../sdk/SDKConfig";
import { NearbyLog } from "./common/NearbyLog";
import { NearbyTransferService } from "./NearbyTransferService";

export class NearbyHandler {
  public async Create(initStr?: string): Promise<Array<ESObject>> {
    let uiContext: UIContext = SDKConfig.uiContext
    NearbyLog.info("Create:" + initStr);
    let initParam: gameNearbyTransfer.CreateParameters = initStr ? JSON.parse(initStr) : undefined
    try {
      let ret: Array<ESObject> = await NearbyTransferService.getInstance().create(
        uiContext!,
        initParam,
      );
      return ret
    } catch (e) {
      return [JSON.stringify(e)]
    }
  }

  public RegisterCallback(): Promise<Array<ESObject>> {
    NearbyLog.info("RegisterCallback");
    return NearbyTransferService.getInstance().registerCallback();
  }

  public UnregisterCallback() {
    NearbyLog.info("UnregisterCallback");
    NearbyTransferService.getInstance().unregisterCallback()
  }

  public PublishNearbyGame(): Promise<Array<ESObject>> {
    NearbyLog.info("PublishNearbyGame");
    return NearbyTransferService.getInstance().publishNearbyGame();
  }

  public Discovery(): Promise<Array<ESObject>> {
    return NearbyTransferService.getInstance().discovery();
  }

  public AutoBindNearbyGame(): Promise<Array<ESObject>> {
    NearbyLog.info("AutoBindNearbyGame");
    return NearbyTransferService.getInstance().autoBindNearbyGame()
  }


  public BindNearbyGame(param: string): Promise<Array<ESObject>> {
    NearbyLog.info("BindNearbyGame:" + param);
    let deviceInfo: gameNearbyTransfer.NearbyGameDevice = param ? JSON.parse(param) : undefined
    return NearbyTransferService.getInstance().bindNearbyGame(deviceInfo)
  }

  public static AcceptCollaboration(acceptParameters: Record<string, object>) {
    NearbyLog.info("AcceptCollaboration");
    NearbyTransferService.acceptCollaboration(acceptParameters)
  }

  public SendPackageInfo(param: string): Promise<Array<ESObject>> {
    let packageInfo: gameNearbyTransfer.PackageInfo = param ? JSON.parse(param) : undefined
    return NearbyTransferService.getInstance().sendPackageInfo(packageInfo)
  }

  public ReplyPackageInfoResult(param: string): Promise<Array<ESObject>> {
    let packageInfoResult: gameNearbyTransfer.PackageInfoResult = param ? JSON.parse(param) : undefined
    return NearbyTransferService.getInstance().replyPackageInfoResult(packageInfoResult)
  }

  public TransferPackageData(param: string): Promise<Array<ESObject>> {
    let packageData: gameNearbyTransfer.PackageData = param ? JSON.parse(param) : undefined
    return NearbyTransferService.getInstance().transferPackageData(packageData)
  }

  public Destroy(): Promise<Array<ESObject>> {
    return NearbyTransferService.getInstance().destroy()
  }


  static Instance: NearbyHandler;

  public static getInstance(): NearbyHandler {
    if (NearbyHandler.Instance == null) {
      NearbyHandler.Instance = new NearbyHandler();
    }
    return NearbyHandler.Instance;
  }
}


