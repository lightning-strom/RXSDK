import type { SDKEventType } from "../types/Index";
import { RXEvent } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXEvent&4.0.0";
const sensitiveKey = Symbol('_event');
export default class EventBus extends RXEvent<Record<string | number | symbol, any>> {
    private static instance: EventBus;
    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    public dispatchEvent<y12 = any>(z12: SDKEventType, a13?: y12) {
        this.emit(z12, a13);
    }
    public registerEvent<v12 = any>(w12: SDKEventType, x12: (event: v12) => void | boolean) {
        this.on(w12, x12);
    }
    unregisterEvent<s12 = any>(t12: SDKEventType, u12: (event: s12) => void | boolean) {
        this.off(t12, u12);
    }
}
