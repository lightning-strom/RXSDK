import { IWindowLifecycle, SDKEventType } from "../types/Index";
import { Logger } from "../utils/Logger";
import EventBus from "./EventBus";

export default abstract class WindowLifecycle implements IWindowLifecycle {
  constructor() {
    let sdk = EventBus.getInstance();
    sdk.registerEvent(SDKEventType.OnShown, this.onShown.bind(this))
    sdk.registerEvent(SDKEventType.OnActive, this.onActive.bind(this) )
    sdk.registerEvent(SDKEventType.OnInactive, this.onInactive.bind(this))
    sdk.registerEvent(SDKEventType.OnHidden, this.onHidden.bind(this))
    sdk.registerEvent(SDKEventType.OnResumed, this.onResumed.bind(this))
    sdk.registerEvent(SDKEventType.OnPaused, this.onPaused.bind(this))
  }

  //1
  onShown(data?: any): void {
    // Logger.d("onShown")
  }

  //2
  onActive(data?: any): void {
    // Logger.d("onActive")

  }

  //3
  onInactive(data?: any): void {
    // Logger.d("onInactive")

  }

  //4
  onHidden(data?: any): void {
    // Logger.d("onHidden")

  }

  //5
  onResumed(data?: any): void {
    // Logger.d("onResumed")
  }

  //6
  onPaused(data?: any): void {
    // Logger.d("onPaused")
  }
}