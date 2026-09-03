// @keepTs
// @ts-nocheck
import bundleManager from "@ohos.bundle.bundleManager";
import common from "@ohos.app.ability.common";
import Want from "@ohos.app.ability.Want";
export declare class App {
    private _want?;
    get want(): Want | undefined;
    get bundleInfo(): bundleManager.BundleInfo;
    get info(): bundleManager.ApplicationInfo;
    get signInfo(): import("hmssdk/../../../../../../../../../Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/ets/api/bundleManager/BundleInfo").SignatureInfo;
    get name(): string;
    get bundleName(): string;
    get versionName(): string;
    get versionCode(): number;
    get uiAbilityContext(): common.UIAbilityContext;
    terminateSelf(h173?: common.AbilityResult): Promise<void>;
    reboot(b173: common.UIAbilityContext): void;
    startAbility(z172: Want): Promise<void>;
    tryStartAbility(x172: Want): Promise<boolean>;
    startBrowser(v172: string): Promise<void>;
    tryStartBrowser(t172: string): Promise<boolean>;
    openLink(k172: string, l172?: boolean, m172?: Record<string, Object>, n172?: common.UIAbilityContext): Promise<number>;
    canOpenLink(i172: string): boolean;
    handleWant(c172: Want): void;
}
declare const app: App;
export default app;
