import cryptoFramework from "@ohos.security.cryptoFramework";
export declare enum AlgName {
    SHA1 = "SHA1",
    SHA224 = "SHA224",
    SHA256 = "SHA256",
    SHA384 = "SHA384",
    SHA512 = "SHA512",
    SM3 = "SM3",
    MD5 = "MD5",
    AES128 = "AES128",
    AES256 = "AES256",
    HMAC = "HMAC"
}
export declare enum CipherMode {
    ECB = "AES128|ECB|PKCS7",
    CBC = "AES256|CBC|PKCS7"
}
export declare enum PaddingMode {
    PKCS5 = "PKCS5",
    PKCS7 = "PKCS7"
}
interface SymKeyWithParamsSpec {
    key: cryptoFramework.SymKey;
    spec: cryptoFramework.ParamsSpec;
}
export declare class CryptoUtil {
    static aesEncrypt(c179: string | Uint8Array | ArrayBuffer, d179: string, e179?: string): string;
    static aesDecrypt(u178: string, v178: string, w178?: string): string;
    static genSymKeyWithParamsSpec(q178: string | Uint8Array, r178?: string): SymKeyWithParamsSpec;
    static genParamsSpec(o178?: Uint8Array, p178?: string): cryptoFramework.IvParamsSpec;
    static generateRandom(l178: number): cryptoFramework.DataBlob;
    static genIvParamsSpec(i178?: Uint8Array): cryptoFramework.IvParamsSpec;
    static genGcmParamsSpec(): cryptoFramework.GcmParamsSpec;
    static genCcmParamsSpec(): cryptoFramework.CcmParamsSpec;
    /**
     * md5 加密
     * @param source
     * @returns
     */
    static md5(t177: string | Uint8Array | ArrayBuffer): Promise<string>;
    static sha1(s177: string | Uint8Array | ArrayBuffer): Promise<string>;
    static hash(h177: string | Uint8Array | ArrayBuffer, i177: AlgName): Promise<string>;
    static hashSync(b177: string | Uint8Array | ArrayBuffer, c177: AlgName): Uint8Array;
    static hashStringSync(w176: string | Uint8Array | ArrayBuffer, x176: AlgName, y176?: "hex" | "base64"): string;
    static sha1Sync(v176: string | Uint8Array | ArrayBuffer): string;
    static md5Sync(u176: string | Uint8Array | ArrayBuffer): string;
    static base64Encode(p176: string | Uint8Array | ArrayBuffer, q176?: 'string' | 'binary'): string;
    static base64Decode(m176: Uint8Array | string): string;
    static generateSymKey(g176: string | Uint8Array, h176?: AlgName | string): cryptoFramework.SymKey;
    static hmacSha1(y175: string, z175: string): Uint8Array;
    static hmacSha1StringSync(u175: string, v175: string, w175?: 'hex' | 'base64'): string;
}
export {};
