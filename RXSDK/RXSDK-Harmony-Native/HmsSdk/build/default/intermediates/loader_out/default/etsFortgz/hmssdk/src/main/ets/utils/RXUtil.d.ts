import { RCallback, RXCallback, RXConfig, RXError, RXResult } from "../types/Index";
export declare class RXUtil {
    static checkRequiredParams(u195: Record<string, any>, v195?: string[]): void;
    static formatResult<q195 extends RXResult<any>>(r195: q195, s195?: number): q195;
    static stringifyError(p195: RXError): string;
    static getRXResult(k195?: number, l195?: string, m195?: any, n195?: string): RXResult;
    static getRXSuccess<h195>(i195: h195): RXResult<h195>;
    static getError(c195: number, d195: string, e195?: any, f195?: string): RXError;
    static toRCallback<z194>(a195?: RXCallback<z194>): RCallback<z194> | undefined;
    static toRXCallback<v194>(w194?: RCallback<v194>): RXCallback<RXResult<v194>> | undefined;
    static apiRequest<r194>(s194: string, t194: Record<string, any>, u194: RCallback<r194> | undefined): Promise<RXResult<r194>>;
    static getSDKPrivacy(o194: RXConfig): string;
    static getSDKPrivacyUrl(l194: RXConfig, m194: string): string;
    static getSDKVersion(): string;
}
