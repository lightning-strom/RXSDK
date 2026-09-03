// @keepTs
// @ts-nocheck
import common from "@ohos.app.ability.common";
import HashMap from "@ohos.util.HashMap";
export declare class GlobalData {
    /**
     * 需要进行近场快传传输的沙箱路径的相对路径, 相对于context.fileDir的路径
     */
    static transferResourcePath: string[];
    /**
     * 传输资源的版本文件路径，相对于 context.fileDir
     */
    static versionFilePath: string;
    /**
     * 碰一碰分享出来的 uri
     */
    static shareUri: string;
    static batchSize: number;
    static progressValue: number;
    static progressTotal: number;
    static version: string;
    static connectedNetworkId: string;
    static uiContext: UIContext;
    static versionMap: HashMap<string, Array<string>>;
    static filesDir: string;
    static uiAbilityContext: common.UIAbilityContext;
    static reset(): void;
}
