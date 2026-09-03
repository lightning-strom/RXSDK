import zlib from "@ohos:zlib";
import { BufferUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/BufferUtil&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import pako from "@normalized:N&&&pako/dist/pako.esm&2.1.0";
export default class ZlibUtil {
    static async gzip(t199: string | Object | ArrayBuffer) {
        try {
            let v199 = BufferUtil.toArrayBuffer(t199);
            let w199 = pako.gzip(v199);
            return w199?.buffer;
        }
        catch (u199) {
            Logger.e(u199);
        }
    }
    static async gzip2(q199: string | Object | ArrayBuffer) {
        try {
            const s199 = zlib.createGZipSync();
        }
        catch (r199) {
            Logger.e(r199);
        }
    }
    static async compress(j199: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
        try {
            const l199 = BufferUtil.toArrayBuffer(j199);
            let m199 = new ArrayBuffer(8 + l199.byteLength);
            const n199 = zlib.createZipSync();
            const o199 = await n199.compress(m199, l199);
            let p199 = m199.slice(0, o199.destLen);
            return p199;
        }
        catch (k199) {
            Logger.e(k199);
        }
    }
    static async deflate(z198: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
        try {
            const b199 = BufferUtil.toArrayBuffer(z198);
            let c199 = new ArrayBuffer(8 + b199.byteLength);
            let d199: zlib.ZStream = {
                nextIn: b199,
                availableIn: b199.byteLength,
                nextOut: c199,
                availableOut: c199.byteLength
            };
            const e199 = zlib.createZipSync();
            const f199 = await e199.deflateInit(d199, zlib.CompressLevel.COMPRESS_LEVEL_BEST_SPEED);
            const g199 = await e199.deflate(d199, zlib.CompressFlushMode.FINISH);
            const h199 = await e199.deflateEnd(d199);
            const i199 = BufferUtil.removeTrailingZeros(c199);
            return i199;
        }
        catch (a199) {
            Logger.e(a199);
        }
    }
    static async inflate(t198: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
        try {
            let v198 = new ArrayBuffer(1024);
            const w198 = BufferUtil.toArrayBuffer(t198);
            let x198: zlib.ZStream = {
                nextIn: w198,
                availableIn: w198.byteLength,
                nextOut: v198,
                availableOut: v198.byteLength
            };
            const y198 = zlib.createZipSync();
            await y198.inflateInit(x198);
            await y198.inflate(x198, zlib.CompressFlushMode.FINISH);
            await y198.inflateEnd(x198);
            v198 = BufferUtil.removeTrailingZeros(v198);
            return v198;
        }
        catch (u198) {
            Logger.e(u198);
        }
    }
}
