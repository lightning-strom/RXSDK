type EventHandler<T> = (event: T) => boolean | void;
type EventType = string | number | symbol;
export declare class RXEvent<T extends Record<EventType, any>> {
    private listeners;
    on<c extends keyof T>(j194: c, k194: EventHandler<T[c]>): void;
    emit<b extends keyof T>(a194: b, b194?: T[b]): void;
    off<a extends keyof T>(x193: a, y193?: EventHandler<T[a]>): boolean;
}
export {};
