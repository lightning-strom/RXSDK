// @keepTs
// @ts-nocheck
export declare class AppInfo {
    readonly bundleName: string;
    readonly e3: number;
    readonly f3: string;
    readonly signatureInfo: string;
    constructor(bundleName: string, n3: number, p3: string, signatureInfo: string);
}
export declare class d3 {
    private appInfo;
    g3(): Promise<AppInfo>;
    private h3;
    private i3;
    j3(): Nullable<string>;
}
declare const l15: d3;
export default l15;
