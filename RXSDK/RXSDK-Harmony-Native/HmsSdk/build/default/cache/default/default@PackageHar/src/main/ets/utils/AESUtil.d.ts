export default class AESUtil {
    private static _aesKey;
    static set aesKey(b172: any);
    static generateSymKey(z171: string, a172?: string): import("hmssdk/../../../../../../../../../Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/ets/api/@ohos.security.cryptoFramework").default.SymKey;
    static encrypt(x171: string, y171?: string): string;
    static decrypt(v171: string, w171?: string): string;
    static encryptCBC(r171: string | Uint8Array | ArrayBuffer, s171?: string): string;
    static decryptCBC(p171: string, q171?: string): string;
    static getAesKey(): string;
}
