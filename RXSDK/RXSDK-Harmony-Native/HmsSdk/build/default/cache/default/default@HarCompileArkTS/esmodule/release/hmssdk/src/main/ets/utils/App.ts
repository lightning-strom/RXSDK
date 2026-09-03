// @keepTs
// @ts-nocheck
import bundleManager from "@ohos:bundle.bundleManager";
import type common from "@ohos:app.ability.common";
import type OpenLinkOptions from "@ohos:app.ability.OpenLinkOptions";
import type Want from "@ohos:app.ability.Want";
import type { BusinessError } from "@ohos:base";
import url from "@ohos:url";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { PushManager } from "@normalized:N&&&hmssdk/src/main/ets/base/PushManager&4.0.0";
export class App {
    private _want?: Want = undefined;
    public get want(): Want | undefined {
        return this._want;
    }
    get bundleInfo(): bundleManager.BundleInfo {
        return bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
    }
    get info(): bundleManager.ApplicationInfo {
        return this.bundleInfo.appInfo;
    }
    get signInfo() {
        const i173: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO);
        return i173.signatureInfo;
    }
    get name() {
        return getContext().resourceManager.getStringSync(this.info.labelId);
    }
    get bundleName() {
        return this.info.name;
    }
    get versionName() {
        return this.bundleInfo.versionName;
    }
    get versionCode() {
        return this.bundleInfo.versionCode;
    }
    get uiAbilityContext(): common.UIAbilityContext {
        return getContext() as common.UIAbilityContext;
    }
    terminateSelf(h173?: common.AbilityResult): Promise<void> {
        if (h173) {
            return this.uiAbilityContext?.terminateSelfWithResult(h173);
        }
        else {
            return this.uiAbilityContext?.terminateSelf();
        }
    }
    reboot(b173: common.UIAbilityContext) {
        try {
            const d173: string = this.bundleName;
            const e173: string = b173.abilityInfo.name;
            let f173: Want = {
                bundleName: d173,
                abilityName: e173,
                parameters: {
                    '__app_restart': true
                }
            };
            b173.terminateSelf(() => {
                b173.startAbility(f173).catch((g173: BusinessError) => {
                    console.error(`Restart failed: ${g173.code}, ${g173.message}`);
                });
            });
        }
        catch (c173) {
            console.error(`Restart failed: ${c173.code}, ${c173.message}`);
        }
    }
    startAbility(z172: Want): Promise<void> {
        return this.uiAbilityContext.startAbility(z172).then(() => {
            console.error('startAbility successfully.');
        }).catch((a173: BusinessError) => {
            console.error(`Failed to startAbility. Code: ${a173.code}, message: ${a173.message}`);
        });
    }
    tryStartAbility(x172: Want): Promise<boolean> {
        return this.uiAbilityContext.startAbility(x172).then(() => {
            console.error('startAbility successfully.');
            return true;
        }).catch((y172: BusinessError) => {
            console.error(`Failed to startAbility. Code: ${y172.code}, message: ${y172.message}`);
            return false;
        });
    }
    startBrowser(v172: string): Promise<void> {
        let w172: Want = {
            action: 'ohos.want.action.viewData',
            entities: ['entity.system.browsable'],
            uri: v172
        };
        return this.startAbility(w172);
    }
    tryStartBrowser(t172: string): Promise<boolean> {
        let u172: Want = {
            action: 'ohos.want.action.viewData',
            entities: ['entity.system.browsable'],
            uri: t172
        };
        return this.tryStartAbility(u172);
    }
    openLink(k172: string, l172?: boolean, m172?: Record<string, Object>, n172?: common.UIAbilityContext): Promise<number> {
        const o172: OpenLinkOptions = {
            appLinkingOnly: l172,
            parameters: m172
        };
        n172 ??= this.uiAbilityContext;
        return new Promise<number>((p172, q172) => {
            n172?.openLink(k172, o172, (r172: BusinessError, s172: common.AbilityResult) => {
                p172(r172?.code || s172.resultCode);
            });
        });
    }
    canOpenLink(i172: string) {
        let j172 = bundleManager.canOpenLink(i172);
        return j172;
    }
    handleWant(c172: Want) {
        this._want = c172;
        try {
            let e172 = c172.uri;
            if (e172) {
                Logger.d("want.uri:" + e172);
                const f172 = url.URL.parseURL(e172);
                const g172 = f172.params;
                const h172 = g172.get('id');
                Logger.d("want.url.params:" + JSON.stringify(g172));
            }
            if (c172?.parameters) {
                Logger.d("want.parameters:" + JSON.stringify((c172.parameters)));
                if (c172.parameters.debug_enable) {
                    Logger.logEnable = Boolean(c172.parameters.debug_enable);
                }
                if (c172.parameters.task_id) {
                    PushManager.getInstance().reportNotifyStatus(c172.parameters["task_id"] as string, 3);
                }
            }
        }
        catch (d172) {
            Logger.e(d172);
        }
    }
}
const app = new App();
export default app;
