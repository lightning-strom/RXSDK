// @keepTs
// @ts-nocheck
import type common from "@ohos:app.ability.common";
import HashMap from "@ohos:util.HashMap";
export class GlobalData {
    public static transferResourcePath: string[] = ["/AssetBundles", "/IFS"];
    public static versionFilePath: string = "/AssetBundles/Version_Harmony.json";
    public static shareUri: string = "link://nearbyshare.com?versionName=";
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
