import { cryptoFramework } from '@kit.CryptoArchitectureKit';
import { buffer, util } from '@kit.ArkTS';
import { Logger } from "./Logger";
import { BufferUtil } from './BufferUtil';


const base64 = new util.Base64Helper();

export enum AlgName {
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

export enum CipherMode {
  ECB = "AES128|ECB|PKCS7",
  CBC = "AES256|CBC|PKCS7",
}

export enum PaddingMode {
  PKCS5 = "PKCS5",
  PKCS7 = "PKCS7",
}

interface SymKeyWithParamsSpec {
  key: cryptoFramework.SymKey;
  spec: cryptoFramework.ParamsSpec;
}

export class CryptoUtil {
  static aesEncrypt(source: string | Uint8Array | ArrayBuffer, puKey: string, cipherAlgName: string = CipherMode.ECB): string {
    let result = '';
    if (!source) {
      return result;
    }
    let globalCipher = cryptoFramework.createCipher(cipherAlgName);
    let symKeySpec = this.genSymKeyWithParamsSpec(puKey, cipherAlgName);

    globalCipher.initSync(cryptoFramework.CryptoMode.ENCRYPT_MODE, symKeySpec.key, symKeySpec.spec);
    let ret = globalCipher.doFinalSync({ data: BufferUtil.toUint8Array(source) });
    result = base64.encodeToStringSync(ret.data);
    // console.log(BufferUtil.uint8ArrayToHexStr(ret.data))
    return result;
  }


  static aesDecrypt(text: string, puKey: string, cipherAlgName: string = CipherMode.ECB) {
    let result = '';
    if (!text) {
      return text;
    }
    let globalCipher = cryptoFramework.createCipher(cipherAlgName);
    let symKeySpec = this.genSymKeyWithParamsSpec(puKey, cipherAlgName);
    globalCipher.initSync(cryptoFramework.CryptoMode.DECRYPT_MODE, symKeySpec.key, symKeySpec.spec);
    let plainText: cryptoFramework.DataBlob = { data: base64.decodeSync(text) };
    let ret = globalCipher.doFinalSync(plainText);
    result = BufferUtil.uint8ArrayToString(ret.data);
    return result;
  }

  static genSymKeyWithParamsSpec(key: string | Uint8Array, algName: string = CipherMode.CBC): SymKeyWithParamsSpec {
    let data: Uint8Array
    if (key instanceof Uint8Array) {
      data = key
    } else {
      let hexStr = BufferUtil.stringToHex(key)
      data = BufferUtil.hexToUint8Array(hexStr)
    }
    // console.log("rxsdk genSymKeyWithParamsSpec ", key, data)
    return {
      key: this.generateSymKey(data, algName.split('|')?.[0]),
      spec: this.genParamsSpec(data, algName)
    };
  }


  //- "IvParamsSpec": 适用于CBC|CTR|OFB|CFB模式
  // "GcmParamsSpec": 适用于GCM模式
  // "CcmParamsSpec": 适用于CCM模式
  static genParamsSpec(key?: Uint8Array, cipherAlgName: string = CipherMode.ECB,) {
    if (cipherAlgName === CipherMode.CBC) {
      return this.genIvParamsSpec(key);
    }
    return null
  }


  static generateRandom(len: number) {
    let rand = cryptoFramework.createRandom();
    let generateRandSync = rand.generateRandomSync(len);
    return generateRandSync;
  }


  static genIvParamsSpec(pubKeyHex?: Uint8Array) {
    let ivBlob = pubKeyHex ? { data: pubKeyHex.slice(0, 16) } : this.generateRandom(16)
    let ivParamsSpec: cryptoFramework.IvParamsSpec = {
      algName: "IvParamsSpec",
      iv: ivBlob
    };
    return ivParamsSpec;
  }

  static genGcmParamsSpec() {
    let ivBlob = this.generateRandom(12);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 bytes
    let dataAad = new Uint8Array(arr);
    let aadBlob: cryptoFramework.DataBlob = { data: dataAad };
    arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 16 bytes
    let dataTag = new Uint8Array(arr);
    let tagBlob: cryptoFramework.DataBlob = {
      data: dataTag
    }; // The GCM authTag is obtained by doFinal() in encryption and passed in params of init() in decryption.
    let gcmParamsSpec: cryptoFramework.GcmParamsSpec = {
      iv: ivBlob,
      aad: aadBlob,
      authTag: tagBlob,
      algName: "GcmParamsSpec"
    };
    return gcmParamsSpec;
  }

  static genCcmParamsSpec() {
    let rand: cryptoFramework.Random = cryptoFramework.createRandom();
    let ivBlob: cryptoFramework.DataBlob = rand.generateRandomSync(7);
    let aadBlob: cryptoFramework.DataBlob = rand.generateRandomSync(8);
    let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 bytes
    let dataTag = new Uint8Array(arr);
    let tagBlob: cryptoFramework.DataBlob = {
      data: dataTag
    };
    // CCM的authTag在加密时从doFinal结果中获取，在解密时填入init函数的params参数中
    let ccmParamsSpec: cryptoFramework.CcmParamsSpec = {
      iv: ivBlob,
      aad: aadBlob,
      authTag: tagBlob,
      algName: "CcmParamsSpec"
    };
    return ccmParamsSpec;
  }

  /**
   * md5 加密
   * @param source
   * @returns
   */
  static md5(source: string | Uint8Array | ArrayBuffer): Promise<string> {
    return this.hash(source, AlgName.MD5)
  }

  static sha1(source: string | Uint8Array | ArrayBuffer): Promise<string> {
    return this.hash(source, AlgName.SHA1)
  }

  static hash(source: string | Uint8Array | ArrayBuffer, algName: AlgName): Promise<string> {
    let hash = cryptoFramework.createMd(algName)
    return new Promise((resolve, reject) => {
      let plainText: cryptoFramework.DataBlob = { data: BufferUtil.toUint8Array(source) };
      let promiseMdUpdate = hash.update(plainText)
      promiseMdUpdate.then(() => {
        let PromiseMdDigest = hash.digest();
        return PromiseMdDigest;
      }).then(mdOutput => {
        let string = BufferUtil.uint8ArrayToHexString(mdOutput.data);
        resolve(string.toUpperCase())
      }).catch(error => {
        console.log("加密失败:" + error)
        reject(error)
      });
    })
  }

  static hashSync(source: string | Uint8Array | ArrayBuffer, algName: AlgName): Uint8Array {
    try {
      let hash = cryptoFramework.createMd(algName)
      let plainText: cryptoFramework.DataBlob = { data: BufferUtil.toUint8Array(source) };
      hash.updateSync(plainText)
      let mdDigest = hash.digestSync();
      return mdDigest.data
    } catch (e) {
      Logger.e(e)
    }
  }

  static hashStringSync(source: string | Uint8Array | ArrayBuffer, algName: AlgName, format: "hex" | "base64" = "hex"): string {
    try {
      if (source) {
        switch (format) {
          case "hex":
            let hexStr = BufferUtil.uint8ArrayToHexString(this.hashSync(source, algName));
            return hexStr.toUpperCase()
          case "base64":
            return CryptoUtil.base64Encode(this.hashSync(source, algName));
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      } else {
        return undefined
      }
    } catch (e) {
      Logger.e(e)
    }
  }


  static sha1Sync(source: string | Uint8Array | ArrayBuffer): string {
    return this.hashStringSync(source, AlgName.SHA1)
  }

  static md5Sync(source: string | Uint8Array | ArrayBuffer): string {
    return this.hashStringSync(source, AlgName.MD5)
  }

  static base64Encode(input: string | Uint8Array | ArrayBuffer, outputType: 'string' | 'binary' = 'string'): string {
    let array = BufferUtil.toUint8Array(input);
    const base64 = new util.Base64Helper();
    if (outputType === 'string') {
      let result = base64.encodeToStringSync(array);
      return result
    } else {
      return BufferUtil.uint8ArrayToString(base64.encodeSync(array))
    }
  }

  static base64Decode(base64Str: Uint8Array | string): string {
    //, outputType: 'string' | 'binary' = 'string'
    const base64 = new util.Base64Helper();
    let result = base64.decodeSync(base64Str, util.Type.MIME);
    // if (outputType === 'string') {
    return BufferUtil.uint8ArrayToString(result)
    // } else {
    //   return result
    // }
  }

  static generateSymKey(input: string | Uint8Array, algName: AlgName | string = AlgName.HMAC) {
    let data
    if (input instanceof Uint8Array) {
      data = input
    } else {
      data = new Uint8Array(buffer.from(input, 'utf-8').buffer)
    }

    let symKeyBlob: cryptoFramework.DataBlob = { data: data };
    let aesGenerator = cryptoFramework.createSymKeyGenerator(algName);
    let symKey = aesGenerator.convertKeySync(symKeyBlob);
    return symKey;
  }

  static hmacSha1(data: string, secret: string): Uint8Array {
    let keyData = new Uint8Array(buffer.from(secret, 'utf-8').buffer);
    let key = this.generateSymKey(keyData, AlgName.HMAC);
    let macAlgName = AlgName.SHA1;
    let mac = cryptoFramework.createMac(macAlgName);
    mac.initSync(key);
    mac.updateSync({ data: new Uint8Array(buffer.from(data, 'utf-8').buffer) });
    let macResult = mac.doFinalSync();
    // console.info('HMAC 实际hex:' + Array.from(macResult.data)
    //   .map(byte => byte.toString(16).padStart(2, '0'))
    //   .join(''));
    // console.info('HMAC 实际hex1:' + this.uint8ArrayToHexStr(macResult.data));
    // let macLen = mac.getMacLength();
    // console.info('HMAC len:' + macLen);
    let macData = macResult.data
    return macData
  }

  static hmacSha1StringSync(data: string, secret: string, format: 'hex' | 'base64' = 'hex') {
    // console.info('HMAC 实际hex:' + Array.from(macResult.data)
    //   .map(byte => byte.toString(16).padStart(2, '0'))
    //   .join(''));
    // console.info('HMAC 实际hex1:' + this.uint8ArrayToHexStr(macResult.data));
    // let macLen = mac.getMacLength();
    // console.info('HMAC len:' + macLen);
    // return this.base64Encode(macResult.data)
    let macData = this.hmacSha1(data, secret);
    // return buffer.from(macData).toString("base64")
    switch (format) {
      case "hex":
        return BufferUtil.uint8ArrayToHexString(macData)
      case "base64":
        return buffer.from(macData).toString("base64");
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}