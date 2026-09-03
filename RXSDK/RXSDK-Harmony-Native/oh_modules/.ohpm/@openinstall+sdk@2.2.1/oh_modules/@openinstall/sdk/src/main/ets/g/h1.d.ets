// @keepTs
// @ts-nocheck
export declare enum EventType {
    EVENT_DEFAULT = 0,
    EVENT_REGISTER = 1,
    EVENT_ALIVE = 2
}
export declare class k6 {
    readonly type: EventType;
    readonly name: Nullable<string>;
    readonly time: number;
    readonly value: number;
    readonly d6: Nullable<Map<string, string>>;
    constructor(type: EventType, name: Nullable<string>, time: number, value: number, p6?: Map<string, string>);
    e6(): boolean;
    f6(): boolean;
}
export declare class l6 extends k6 {
    constructor(time: number);
}
export declare class m6 extends k6 {
    constructor(time: number, value: number);
}
export declare class n6 extends k6 {
    constructor(name: string, time: number, value: number, o6?: Map<string, string>);
}
