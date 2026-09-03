export default class ZlibUtil {
    static gzip(t199: string | Object | ArrayBuffer): Promise<ArrayBufferLike>;
    static gzip2(q199: string | Object | ArrayBuffer): Promise<void>;
    static compress(j199: string | Object | ArrayBuffer): Promise<ArrayBuffer>;
    static deflate(z198: string | Object | ArrayBuffer): Promise<ArrayBuffer>;
    static inflate(t198: string | Object | ArrayBuffer): Promise<ArrayBuffer>;
}
