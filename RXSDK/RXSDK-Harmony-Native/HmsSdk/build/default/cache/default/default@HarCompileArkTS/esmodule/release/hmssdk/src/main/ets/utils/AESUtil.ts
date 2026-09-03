import { CipherMode, CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
const aesKey = "4ca7dacc9332d74e1292c83f0aa3b376";
export default class AESUtil {
    private static _aesKey;
    public static set aesKey(b172) {
        AESUtil._aesKey = CryptoUtil.md5Sync(b172 + aesKey).toLowerCase();
    }
    static generateSymKey(z171: string, a172: string = "AES128") {
        return CryptoUtil.generateSymKey(z171, a172);
    }
    static encrypt(x171: string, y171?: string) {
        return CryptoUtil.aesEncrypt(x171, y171 || this.getAesKey());
    }
    static decrypt(v171: string, w171?: string) {
        return CryptoUtil.aesDecrypt(v171, w171 || this.getAesKey());
    }
    static encryptCBC(r171: string | Uint8Array | ArrayBuffer, s171?: string) {
        let t171 = s171 || this.getAesKey();
        let u171 = CryptoUtil.aesEncrypt(r171, t171, CipherMode.CBC);
        return u171;
    }
    static decryptCBC(p171: string, q171?: string) {
        return CryptoUtil.aesDecrypt(p171, q171 || this.getAesKey(), CipherMode.CBC);
    }
    public static getAesKey(): string {
        if (!this._aesKey) {
            this.aesKey = Devices.deviceCode;
        }
        return this._aesKey;
    }
}
