// @keepTs
// @ts-nocheck
import * as f2 from "./i/u";
import pasteboard from '@ohos.pasteboard';
export interface OpCallback<Type> {
    onResult: (result: Type) => void;
    onError: (error: OpError) => void;
}
export declare class OpData {
    readonly channelCode: string;
    readonly bindData: object;
    constructor(k2: string, l2: object);
    isEmpty(): boolean;
}
export declare class OpError {
    static readonly REQUEST_FAIL: number;
    static readonly REQUEST_ERROR: number;
    static readonly TIMEOUT: number;
    static readonly INVALID_INTENT: number;
    static readonly NOT_INIT: number;
    static readonly INIT_ERROR: number;
    static readonly REPORT_ERROR: number;
    readonly code: number;
    readonly message?: string;
    constructor(code: number, message?: string);
    static n2(j2: f2.o2): OpError;
}
export declare class OpInitConfig {
    private t2;
    private u2;
    get fetchPasteData(): boolean;
    disableFetchPasteData(): void;
    set pasteData(value: Nullable<pasteboard.PasteData>);
    get pasteData(): Nullable<pasteboard.PasteData>;
    private v2;
    get adEnabled(): boolean;
    set adEnabled(i2: boolean);
    private w2;
    set macAddress(value: Nullable<string>);
    get macAddress(): Nullable<string>;
    private z2;
    private a3;
    get fetchOaid(): boolean;
    disableFetchOaid(): void;
    set oaid(value: Nullable<string>);
    get oaid(): Nullable<string>;
}
export declare const h2: OpInitConfig;
