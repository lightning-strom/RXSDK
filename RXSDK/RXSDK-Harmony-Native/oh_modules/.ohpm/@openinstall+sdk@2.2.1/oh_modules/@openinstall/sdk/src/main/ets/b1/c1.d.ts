export declare class k5 {
    wakeupStatsEnabled: boolean;
    registerStatsEnabled: boolean;
    eventStatsEnabled: boolean;
    reportPeriod: number;
    installId: string;
    static v8(e11: any): k5;
    static w8(d11: k5): string;
}
export declare function s10(b11: k5, c11: k5): boolean;
export declare class t10 {
    channelCode: string;
    bind: object;
    static v8(z10: any): t10;
    static w8(y10: t10): string;
}
export declare class o9 {
    i7(): this is l9;
    x8(): this is n9;
    a9(): this is m9;
    readonly t8: boolean;
    constructor(x10: boolean);
}
export declare class l9 extends o9 {
    readonly code: number;
    readonly config: k5;
    readonly body: t10;
    readonly msg: string;
    constructor(data: any);
    isSuccess(): boolean;
}
export declare class n9 extends o9 {
    readonly b9: number;
    readonly c9?: string;
    constructor(v10: number, w10?: string);
}
export declare class m9 extends o9 {
    readonly c9: string;
    constructor(u10: string);
}
