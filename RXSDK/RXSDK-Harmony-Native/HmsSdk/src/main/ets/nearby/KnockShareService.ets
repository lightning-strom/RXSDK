import { systemShare, harmonyShare } from '@kit.ShareKit';
import { fileUri } from '@kit.CoreFileKit'
import { common, abilityAccessCtrl } from "@kit.AbilityKit";
import { uniformTypeDescriptor as utd } from '@kit.ArkData';

import { NearbyTransferService } from './NearbyTransferService'

import { GlobalData } from './common/GlobalData';
import { getVersionName } from './common/VersionCompare';
import { NearbyLog } from './common/NearbyLog';
import { copyStorageDir, copyStoragePath } from './common/FileUtils';


export class KnockShareService {
  private static instance: KnockShareService;
  public static isSender: boolean;

  public constructor(uiContext: UIContext) {
    NearbyLog.info(" 碰一碰初始化");
    let immersiveCallback = async (sharableTarget: harmonyShare.SharableTarget) => {
      NearbyLog.info("监听到华为分享事件");
      // let uiContext: ESObject = globalThis.AbilityContext as common.Context
      let uiAbilityContext = uiContext.getHostContext() as common.Context;

      GlobalData.filesDir = uiAbilityContext.filesDir;
      let shareData: systemShare.SharedData = new systemShare.SharedData({
        utd: utd.UniformDataType.HYPERLINK,
        content: GlobalData.shareUri + getVersionName(),
        title: "近场快传示例",
        description: "传输下载资源"
      })
      sharableTarget.share(shareData);
      // 碰一碰拉起来的时候，都进行初始化，并进行自动绑定,同时需要阻塞 init 操作，防止 init 未结束就进行 publish 操作
      await NearbyTransferService.getInstance().create(uiContext);
      NearbyLog.info("拷贝一下。。。")
      copyStoragePath("/data/storage/el2/base/files/test");
    }
    harmonyShare.on('knockShare', immersiveCallback);
    harmonyShare.on('gesturesShare', immersiveCallback);
  }


  public static getInstance(uiContext: UIContext): KnockShareService {
    if (!KnockShareService.instance) {
      KnockShareService.instance = new KnockShareService(uiContext);
    }
    return KnockShareService.instance;
  }


  public init() {

  }
}