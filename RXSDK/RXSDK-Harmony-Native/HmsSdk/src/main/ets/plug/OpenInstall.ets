import { common, Want } from "@kit.AbilityKit";
import { Logger } from "../../../../Index";
import { pluginProvider } from "../base/PluginManager";
import { Singleton } from "../types/Types";

export class OpenInstall extends Singleton<OpenInstall> {
  private plugin?: OpenInstall

  constructor() {
    super();
    this.plugin = pluginProvider.getPlugin("openinstall") as OpenInstall
    if (!this.plugin) {
      Logger.w("openinstall plugin not install")
    }
  }

  name(): string {
    return ""
  }

  getVersion(): string | undefined {
    return this.plugin?.getVersion();
  }

  getOpid(): string | undefined {
    return this.plugin?.getOpid();
  }

  preInit(context: common.UIAbilityContext | common.AbilityStageContext): void {
    this.plugin?.preInit(context)
  }

  init(context: common.UIAbilityContext | common.AbilityStageContext, params?: ESObject): void {
    if (!this.plugin) {
      Logger.e("openinstall plugin is not install")
    } else {
      this.plugin?.init(context, params)
    }
  }

  async getInstall(z11?: number): Promise<ESObject> {
    try {
      return await this.plugin?.getInstall(z11)
    } catch (e) {
      Logger.e("openinstall getInstall:", e)
    }
  }

  //获取拉起参数 在 EntryAbility 的 onCreate 和 onNewWant 方法中调用getWakeUp(want: Want)
  async getWakeUp(w?: Want): Promise<ESObject> {
    try {
      if (w) {
        return await this.plugin?.getWakeUp(w)
      }
    } catch (e) {
      Logger.d("openinstall getWakeUp:", e)
      return
    }
  }
}


