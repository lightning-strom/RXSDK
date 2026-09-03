import { Logger } from "./Logger";

type EventHandler<T> = (event: T) => boolean | void;
type EventType = string | number | symbol;


export class RXEvent<T extends Record<EventType, any>> {
  private listeners: Record<EventType, EventHandler<any>[]> = {};

  on<K extends keyof T>(eventType: K, handler: EventHandler<T[K]>) {
    if (!(eventType in this.listeners)) {
      // @ts-ignore
      this.listeners[eventType] = [];
    }
    (this.listeners as Record<K, EventHandler<any>[]>)[eventType].push(handler);
  }

  emit<K extends keyof T>(eventType: K, event?: T[K]) {
    const handlers = (this.listeners as Record<K, EventHandler<any>[]>)[eventType];
    if (handlers) {
      const toRemove: number[] = [];
      handlers.forEach((handler, index) => {
        try {
          let ret = handler(event)
          if (ret) {
            toRemove.push(index);
          }
        } catch (e) {
          e.msg ??= e.message
          Logger.e(e)

          toRemove.push(index);
        }
      });
      toRemove.reverse().forEach(index => {
        handlers.splice(index, 1);
      });
    }
  }

  off<K extends keyof T>(eventType: K, handler?: EventHandler<T[K]>) {
    Logger.d("off:" + String(eventType) + "," + handler)
    if (!handler) {
      // @ts-ignore
      delete this.listeners[eventType];
      return true
      // @ts-ignore
    } else if (this.listeners[eventType]) {
      // @ts-ignore
      this.listeners[eventType] = this.listeners[eventType].filter(h => h !== handler);
      return true
    } else {
      return false
    }
  }
}


