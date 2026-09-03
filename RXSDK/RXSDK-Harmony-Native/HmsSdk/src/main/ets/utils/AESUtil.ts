import { CipherMode, CryptoUtil } from "./CryptoUtil";
import Devices from "./Devices";


const aesKey = "4ca7dacc9332d74e1292c83f0aa3b376"

export default class AESUtil {
  private static _aesKey;

  public static set aesKey(value) {
    AESUtil._aesKey = CryptoUtil.md5Sync(value + aesKey).toLowerCase()
  }

  static generateSymKey(aesKey: string, algName: string = "AES128") {
    return CryptoUtil.generateSymKey(aesKey, algName);
  }

  //ecb
  static encrypt(text: string, puKey?: string) {
    return CryptoUtil.aesEncrypt(text, puKey || this.getAesKey());
  }

  //ecb
  static decrypt(text: string, puKey?: string) {
    return CryptoUtil.aesDecrypt(text, puKey || this.getAesKey());
  }

  static encryptCBC(text: string | Uint8Array | ArrayBuffer, puKey?: string) {
    let key = puKey || this.getAesKey()
    // Logger.debug(key);
    // Logger.debug("原文:" + text);
    let d = CryptoUtil.aesEncrypt(text, key, CipherMode.CBC);
    // Logger.debug("密文:" + d);
    return d
  }

  static decryptCBC(text: string, puKey?: string) {
    return CryptoUtil.aesDecrypt(text, puKey || this.getAesKey(), CipherMode.CBC);
  }

  public static getAesKey(): string {
    if (!this._aesKey) {
      this.aesKey = Devices.deviceCode
      // console.log(`rxsdk 设备码： ${Devices.deviceCode} 密钥： ${aesKey} 加密密钥： ${this._aesKey}`)
    }
    return this._aesKey
  }
}