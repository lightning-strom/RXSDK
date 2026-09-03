// @keepTs
// @ts-nocheck
import pasteboard from '@ohos.pasteboard';
export declare class o8 {
    private o7;
    set failed(value: boolean);
    get failed(): boolean;
    private p7;
    set text(value: Nullable<string>);
    get text(): Nullable<string>;
    private q7;
    set html(value: Nullable<string>);
    get html(): Nullable<string>;
    r7(): boolean;
}
export declare function m8(t8: Nullable<pasteboard.PasteData>): o8;
declare class p8 {
    static readonly s7 = 1;
    static readonly t7 = 2;
    constructor();
    private readSync;
    u7(): o8;
}
declare const l15: p8;
export default l15;
