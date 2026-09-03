import cryptoFramework from "@ohos:security.cryptoFramework";
import buffer from "@ohos:buffer";
import util from "@ohos:util";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { BufferUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/BufferUtil&4.0.0";
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
    CBC = "AES256|CBC|PKCS7"
}
export enum PaddingMode {
    PKCS5 = "PKCS5",
    PKCS7 = "PKCS7"
}
interface SymKeyWithParamsSpec {
    key: cryptoFramework.SymKey;
    spec: cryptoFramework.ParamsSpec;
}
export class CryptoUtil {
    static aesEncrypt(c179: string | Uint8Array | ArrayBuffer, d179: string, e179: string = CipherMode.ECB): string {
        let f179 = '';
        if (!c179) {
            return f179;
        }
        let g179 = cryptoFramework.createCipher(e179);
        let h179 = this.genSymKeyWithParamsSpec(d179, e179);
        g179.initSync(cryptoFramework.CryptoMode.ENCRYPT_MODE, h179.key, h179.spec);
        let i179 = g179.doFinalSync({ data: BufferUtil.toUint8Array(c179) });
        f179 = base64.encodeToStringSync(i179.data);
        return f179;
    }
    static aesDecrypt(u178: string, v178: string, w178: string = CipherMode.ECB) {
        let x178 = '';
        if (!u178) {
            return u178;
        }
        let y178 = cryptoFramework.createCipher(w178);
        let z178 = this.genSymKeyWithParamsSpec(v178, w178);
        y178.initSync(cryptoFramework.CryptoMode.DECRYPT_MODE, z178.key, z178.spec);
        let a179: cryptoFramework.DataBlob = { data: base64.decodeSync(u178) };
        let b179 = y178.doFinalSync(a179);
        x178 = BufferUtil.uint8ArrayToString(b179.data);
        return x178;
    }
    static genSymKeyWithParamsSpec(q178: string | Uint8Array, r178: string = CipherMode.CBC): SymKeyWithParamsSpec {
        let s178: Uint8Array;
        if (q178 instanceof Uint8Array) {
            s178 = q178;
        }
        else {
            let t178 = BufferUtil.stringToHex(q178);
            s178 = BufferUtil.hexToUint8Array(t178);
        }
        return {
            key: this.generateSymKey(s178, r178.split('|')?.[0]),
            spec: this.genParamsSpec(s178, r178)
        };
    }
    static genParamsSpec(o178?: Uint8Array, p178: string = CipherMode.ECB) {
        if (p178 === CipherMode.CBC) {
            return this.genIvParamsSpec(o178);
        }
        return null;
    }
    static generateRandom(l178: number) {
        let m178 = cryptoFramework.createRandom();
        let n178 = m178.generateRandomSync(l178);
        return n178;
    }
    static genIvParamsSpec(i178?: Uint8Array) {
        let j178 = i178 ? { data: i178.slice(0, 16) } : this.generateRandom(16);
        let k178: cryptoFramework.IvParamsSpec = {
            algName: "IvParamsSpec",
            iv: j178
        };
        return k178;
    }
    static genGcmParamsSpec() {
        let b178 = this.generateRandom(12);
        let c178 = [1, 2, 3, 4, 5, 6, 7, 8];
        let d178 = new Uint8Array(c178);
        let e178: cryptoFramework.DataBlob = { data: d178 };
        c178 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let f178 = new Uint8Array(c178);
        let g178: cryptoFramework.DataBlob = {
            data: f178
        };
        let h178: cryptoFramework.GcmParamsSpec = {
            iv: b178,
            aad: e178,
            authTag: g178,
            algName: "GcmParamsSpec"
        };
        return h178;
    }
    static genCcmParamsSpec() {
        let u177: cryptoFramework.Random = cryptoFramework.createRandom();
        let v177: cryptoFramework.DataBlob = u177.generateRandomSync(7);
        let w177: cryptoFramework.DataBlob = u177.generateRandomSync(8);
        let x177 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let y177 = new Uint8Array(x177);
        let z177: cryptoFramework.DataBlob = {
            data: y177
        };
        let a178: cryptoFramework.CcmParamsSpec = {
            iv: v177,
            aad: w177,
            authTag: z177,
            algName: "CcmParamsSpec"
        };
        return a178;
    }
    static md5(t177: string | Uint8Array | ArrayBuffer): Promise<string> {
        return this.hash(t177, AlgName.MD5);
    }
    static sha1(s177: string | Uint8Array | ArrayBuffer): Promise<string> {
        return this.hash(s177, AlgName.SHA1);
    }
    static hash(h177: string | Uint8Array | ArrayBuffer, i177: AlgName): Promise<string> {
        let j177 = cryptoFramework.createMd(i177);
        return new Promise((k177, l177) => {
            let m177: cryptoFramework.DataBlob = { data: BufferUtil.toUint8Array(h177) };
            let n177 = j177.update(m177);
            n177.then(() => {
                let r177 = j177.digest();
                return r177;
            }).then(p177 => {
                let q177 = BufferUtil.uint8ArrayToHexString(p177.data);
                k177(q177.toUpperCase());
            }).catch(o177 => {
                console.log("加密失败:" + o177);
                l177(o177);
            });
        });
    }
    static hashSync(b177: string | Uint8Array | ArrayBuffer, c177: AlgName): Uint8Array {
        try {
            let e177 = cryptoFramework.createMd(c177);
            let f177: cryptoFramework.DataBlob = { data: BufferUtil.toUint8Array(b177) };
            e177.updateSync(f177);
            let g177 = e177.digestSync();
            return g177.data;
        }
        catch (d177) {
            Logger.e(d177);
        }
    }
    static hashStringSync(w176: string | Uint8Array | ArrayBuffer, x176: AlgName, y176: "hex" | "base64" = "hex"): string {
        try {
            if (w176) {
                switch (y176) {
                    case "hex":
                        let a177 = BufferUtil.uint8ArrayToHexString(this.hashSync(w176, x176));
                        return a177.toUpperCase();
                    case "base64":
                        return CryptoUtil.base64Encode(this.hashSync(w176, x176));
                    default:
                        throw new Error(`Unsupported format: ${y176}`);
                }
            }
            else {
                return undefined;
            }
        }
        catch (z176) {
            Logger.e(z176);
        }
    }
    static sha1Sync(v176: string | Uint8Array | ArrayBuffer): string {
        return this.hashStringSync(v176, AlgName.SHA1);
    }
    static md5Sync(u176: string | Uint8Array | ArrayBuffer): string {
        return this.hashStringSync(u176, AlgName.MD5);
    }
    static base64Encode(p176: string | Uint8Array | ArrayBuffer, q176: 'string' | 'binary' = 'string'): string {
        let r176 = BufferUtil.toUint8Array(p176);
        const s176 = new util.Base64Helper();
        if (q176 === 'string') {
            let t176 = s176.encodeToStringSync(r176);
            return t176;
        }
        else {
            return BufferUtil.uint8ArrayToString(s176.encodeSync(r176));
        }
    }
    static base64Decode(m176: Uint8Array | string): string {
        const n176 = new util.Base64Helper();
        let o176 = n176.decodeSync(m176, util.Type.MIME);
        return BufferUtil.uint8ArrayToString(o176);
    }
    static generateSymKey(g176: string | Uint8Array, h176: AlgName | string = AlgName.HMAC) {
        let i176;
        if (g176 instanceof Uint8Array) {
            i176 = g176;
        }
        else {
            i176 = new Uint8Array(buffer.from(g176, 'utf-8').buffer);
        }
        let j176: cryptoFramework.DataBlob = { data: i176 };
        let k176 = cryptoFramework.createSymKeyGenerator(h176);
        let l176 = k176.convertKeySync(j176);
        return l176;
    }
    static hmacSha1(y175: string, z175: string): Uint8Array {
        let a176 = new Uint8Array(buffer.from(z175, 'utf-8').buffer);
        let b176 = this.generateSymKey(a176, AlgName.HMAC);
        let c176 = AlgName.SHA1;
        let d176 = cryptoFramework.createMac(c176);
        d176.initSync(b176);
        d176.updateSync({ data: new Uint8Array(buffer.from(y175, 'utf-8').buffer) });
        let e176 = d176.doFinalSync();
        let f176 = e176.data;
        return f176;
    }
    static hmacSha1StringSync(u175: string, v175: string, w175: 'hex' | 'base64' = 'hex') {
        let x175 = this.hmacSha1(u175, v175);
        switch (w175) {
            case "hex":
                return BufferUtil.uint8ArrayToHexString(x175);
            case "base64":
                return buffer.from(x175).toString("base64");
            default:
                throw new Error(`Unsupported format: ${w175}`);
        }
    }
}
