import { SDKEventType } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IWindowLifecycle } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import EventBus from "@normalized:N&&&hmssdk/src/main/ets/base/EventBus&4.0.0";
export default abstract class WindowLifecycle implements IWindowLifecycle {
    constructor() {
        let k27 = EventBus.getInstance();
        k27.registerEvent(SDKEventType.OnShown, this.onShown.bind(this));
        k27.registerEvent(SDKEventType.OnActive, this.onActive.bind(this));
        k27.registerEvent(SDKEventType.OnInactive, this.onInactive.bind(this));
        k27.registerEvent(SDKEventType.OnHidden, this.onHidden.bind(this));
        k27.registerEvent(SDKEventType.OnResumed, this.onResumed.bind(this));
        k27.registerEvent(SDKEventType.OnPaused, this.onPaused.bind(this));
    }
    onShown(j27?: any): void {
    }
    onActive(i27?: any): void {
    }
    onInactive(h27?: any): void {
    }
    onHidden(g27?: any): void {
    }
    onResumed(f27?: any): void {
    }
    onPaused(e27?: any): void {
    }
}
