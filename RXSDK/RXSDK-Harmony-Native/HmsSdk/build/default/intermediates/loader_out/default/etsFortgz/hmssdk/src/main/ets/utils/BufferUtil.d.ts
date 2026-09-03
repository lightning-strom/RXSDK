import buffer from "@ohos.buffer";
export declare class BufferUtil {
    static stringToHex(p175: string): string;
    static unit8ArrayToString(l175: Uint8Array, m175?: buffer.BufferEncoding): string;
    static trim(k175: string): string;
    /**
     * 重复字符串指定的次数
     * @param str 要重复的字符串
     * @param count 重复的次数
     * @returns 重复后的字符串
     */
    static repeat(i175: string, j175: number): string;
    static toCamelCase(g175: string): string;
    static toSnakeCase(e175: string): string;
    static toKebabCase(c175: string): string;
    static isValidEmail(a175: string): boolean;
    static capitalizeWords(y174: string): string;
    static toLowerCase(x174: string): string;
    static toUpperCase(w174: string): string;
    static replaceAll(t174: string, u174: string, v174: string): string;
    static isNullOrEmpty(s174: string): boolean;
    static stringToUint8Array(r174: string): Uint8Array;
    static stringToArrayBuffer(n174: string): ArrayBuffer;
    static uint8ArrayToString(l174: Uint8Array): string;
    static uint8ArrayToArrayBuffer(k174: Uint8Array): ArrayBuffer;
    /**
     * uint8Array 转换为 hex字符串
     * @param uint8Array
     * @returns
     */
    static uint8ArrayToHexString(g174: Uint8Array): string;
    static uint8ArrayToHexString2(f174: Uint8Array): string;
    static uint8ArrayToHexString3(b174: Uint8Array): string;
    static uint8ArrayToHexArray(z173: Uint8Array): string[];
    static isHexString(x173: string): boolean;
    static hexToUint8Array(t173: string): Uint8Array;
    static arrayBufferToString(p173: ArrayBuffer): string;
    static arrayBufferToUint8Array(o173: ArrayBuffer): Uint8Array;
    static toUint8Array(n173: string | Uint8Array | ArrayBuffer): Uint8Array;
    static toArrayBuffer(m173: string | Object | ArrayBuffer): ArrayBuffer;
    static removeTrailingZeros(j173: ArrayBuffer): ArrayBuffer;
}
export { BufferUtil as StringUtil };
