import { common, Want } from "@kit.AbilityKit";
import { HashMap } from "@kit.ArkTS";


export class GlobalData {
  /**
   * 需要进行近场快传传输的沙箱路径的相对路径, 相对于context.fileDir的路径
   */
  public static transferResourcePath: string[] = ["/AssetBundles", "/IFS"]
  /**
   * 传输资源的版本文件路径，相对于 context.fileDir
   */
  public static versionFilePath: string = "/AssetBundles/Version_Harmony.json"
  /**
   * 碰一碰分享出来的 uri
   */
  public static shareUri: string = "link://nearbyshare.com?versionName="
  public static batchSize: number = 200;
  public static progressValue: number = 0;
  public static progressTotal: number = 0;
  public static version: string = "0.0.0.0";
  public static connectedNetworkId: string = "";
  public static uiContext: UIContext;
  public static versionMap: HashMap<string, Array<string>> = new HashMap();
  public static filesDir: string = "";
  public static uiAbilityContext: common.UIAbilityContext;

  public static reset() {
    GlobalData.connectedNetworkId = "";
    GlobalData.versionMap = new HashMap();
  }
}