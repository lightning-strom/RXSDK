// @keepTs
// @ts-nocheck
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import { Logger } from "@normalized:N&&&hmssdk/Index&4.0.0";
import { pluginProvider } from "@normalized:N&&&hmssdk/src/main/ets/base/PluginManager&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
export class OpenInstall extends Singleton<OpenInstall> {
    private plugin?: OpenInstall;
    constructor() {
        super();
        this.plugin = pluginProvider.getPlugin("openinstall") as OpenInstall;
        if (!this.plugin) {
            Logger.w("openinstall plugin not install");
        }
    }
    name(): string {
        return "";
    }
    getVersion(): string | undefined {
        return this.plugin?.getVersion();
    }
    getOpid(): string | undefined {
        return this.plugin?.getOpid();
    }
    preInit(y151: common.UIAbilityContext | common.AbilityStageContext): void {
        this.plugin?.preInit(y151);
    }
    init(w151: common.UIAbilityContext | common.AbilityStageContext, x151?: any): void {
        if (!this.plugin) {
            Logger.e("openinstall plugin is not install");
        }
        else {
            this.plugin?.init(w151, x151);
        }
    }
    async getInstall(u151?: number): Promise<any> {
        try {
            return await this.plugin?.getInstall(u151);
        }
        catch (v151) {
            Logger.e("openinstall getInstall:", v151);
        }
    }
    async getWakeUp(s151?: Want): Promise<any> {
        try {
            if (s151) {
                return await this.plugin?.getWakeUp(s151);
            }
        }
        catch (t151) {
            Logger.d("openinstall getWakeUp:", t151);
            return;
        }
    }
}
