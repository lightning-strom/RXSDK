import { SDKEventType } from "../types/Index";
import { Logger } from "../utils/Logger";
import { RXEvent } from "../utils/RXEvent";

const sensitiveKey = Symbol('_event');

export default class EventBus extends RXEvent<Record<string | number | symbol, any>> {
  private static instance: EventBus;

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public dispatchEvent<T = any>(type: SDKEventType, data?: T) {
    this.emit(type, data)
  }

  public registerEvent<T = any>(type: SDKEventType, data: (event: T) => void | boolean) {
    this.on(type, data)
  }

  unregisterEvent<T = any>(type: SDKEventType, handler: (event: T) => void | boolean) {
    this.off(type, handler)
  }
}