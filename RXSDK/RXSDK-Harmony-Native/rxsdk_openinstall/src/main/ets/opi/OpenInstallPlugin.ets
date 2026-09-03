import { OpCallback, OpData, OpenInstall, OpInitConfig } from "@openinstall/sdk";
import { common, Want } from "@kit.AbilityKit";
import { applyMixins, IPlugin, RegisterPlugin } from "./RXInterfaces";

@RegisterPlugin()
class OpenInstallPlugin extends IPlugin {
  constructor() {
    super();
  }

  static install() {
  }

  name(): string {
    return "openinstall";
  }

  getVersion(): string {
    return OpenInstall.getVersion();
  }

  getOpid(): string {
    return OpenInstall.getOpid();
  }

  preInit(context: common.UIAbilityContext | common.AbilityStageContext): void {
    console.log("OpenInstallPlugin preInit");
    OpenInstall.preInit(context)
  }

  init(context: common.UIAbilityContext | common.AbilityStageContext, params: ESObject): void {
    console.log("OpenInstallPlugin init")
    OpenInstall.init(context)
  }

  async getInstall(z11?: number): Promise<ESObject> {
    console.log("OpenInstallPlugin getInstall");
    if (z11) {
      return OpenInstall.getInstall(z11)
    } else {
      return OpenInstall.getInstall()
    }
  }

  //获取拉起参数 在 EntryAbility 的 onCreate 和 onNewWant 方法中调用getWakeUp(want: Want)
  async getWakeUp(want: Want): Promise<ESObject> {
    console.log("OpenInstallPlugin getWakeUp");
    return OpenInstall.getWakeUp(want);
  }
}

// applyMixins(OpenInstallPlugin, [OpenInstall]);

export default OpenInstallPlugin

// export class OpenInstallPlugin {
//   // reportRegister() {
//   //   OpenInstall.reportRegister()
//   // }

//   //   init(context: common.UIAbilityContext | common.AbilityStageContext): void;
//   //   init(context: common.UIAbilityContext | common.AbilityStageContext, inputKey: string): void;
//   //   init(context: common.UIAbilityContext | common.AbilityStageContext, g12: OpInitConfig): void;
//   //   init(context: common.UIAbilityContext | common.AbilityStageContext, inputKey: string, g12: OpInitConfig): void;
//
//  //App传参安装
//

//
//   //   getWakeUp(want: Want, callback: OpCallback<OpData>): void;
//   //   reportRegister(): Promise<void>;
//   //   reportEffectPoint(u11: string, v11: number, w11?: Map<string, string>): Promise<void>;
//   //   reportShare(q11: string, r11: string): Promise<void>;
//   //   reportShare(q11: string, r11: string, callback: OpCallback<void>): void;
//   //   acceptWant(want: Want): boolean;
//   //   acceptPasteData(j11: pasteboard.PasteData): boolean;
// }