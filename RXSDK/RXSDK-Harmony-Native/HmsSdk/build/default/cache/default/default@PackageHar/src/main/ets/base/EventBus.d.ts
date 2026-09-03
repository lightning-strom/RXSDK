import { SDKEventType } from "../types/Index";
import { RXEvent } from "../utils/RXEvent";
export default class EventBus extends RXEvent<Record<string | number | symbol, any>> {
    private static instance;
    static getInstance(): EventBus;
    dispatchEvent<y12 = any>(z12: SDKEventType, a13?: y12): void;
    registerEvent<v12 = any>(w12: SDKEventType, x12: (event: v12) => void | boolean): void;
    unregisterEvent<s12 = any>(t12: SDKEventType, u12: (event: s12) => void | boolean): void;
}
