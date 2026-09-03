import { AbilityStage, Want } from '@kit.AbilityKit';
import { OpenInstall } from '@openinstall/sdk';
import { Logger } from '../opi/RXInterfaces';

export default class MyAbilityStage extends AbilityStage {
  onCreate(): void {
    // 应用HAP首次加载时触发，可以在此执行该Module的初始化操作（例如资源预加载、线程创建等）。
    Logger.d("MyAbilityStage=====onCreate")
    OpenInstall.preInit(this.context)

  }

  onAcceptWant(want: Want): string {
    Logger.d("MyAbilityStage=====onAcceptWant")

    // 仅specified模式下触发
    return 'MyAbilityStage';
  }
}