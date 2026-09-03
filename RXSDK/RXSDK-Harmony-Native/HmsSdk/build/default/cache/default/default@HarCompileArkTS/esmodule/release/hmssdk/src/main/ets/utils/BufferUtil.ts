import buffer from "@ohos:buffer";
import util from "@ohos:util";
export class BufferUtil {
    static stringToHex(p175: string): string {
        let q175 = '';
        for (let r175 = 0; r175 < p175.length; r175++) {
            const s175 = p175.charCodeAt(r175);
            const t175 = s175.toString(16).padStart(2, '0');
            q175 += t175;
        }
        return q175;
    }
    static unit8ArrayToString(l175: Uint8Array, m175: buffer.BufferEncoding = 'utf-8'): string {
        let n175 = util.TextDecoder.create(m175, { ignoreBOM: true });
        let o175 = n175.decodeToString(l175, { stream: true });
        return o175;
    }
    static trim(k175: string): string {
        return k175.trim();
    }
    static repeat(i175: string, j175: number): string {
        return i175.repeat(j175);
    }
    static toCamelCase(g175: string): string {
        return g175.replace(/-./g, h175 => h175.charAt(1).toUpperCase())
            .replace(/_/g, '');
    }
    static toSnakeCase(e175: string): string {
        return e175.replace(/[A-Z]/g, f175 => `_${f175.toLowerCase()}`)
            .replace(/^\_/, '');
    }
    static toKebabCase(c175: string): string {
        return c175.replace(/[A-Z]/g, d175 => `-${d175.toLowerCase()}`)
            .replace(/^\-/, '');
    }
    static isValidEmail(a175: string): boolean {
        const b175 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return b175.test(a175);
    }
    static capitalizeWords(y174: string): string {
        return y174.replace(/\b\w/g, z174 => z174.toUpperCase());
    }
    static toLowerCase(x174: string): string {
        return x174.toLowerCase();
    }
    static toUpperCase(w174: string): string {
        return w174.toUpperCase();
    }
    static replaceAll(t174: string, u174: string, v174: string): string {
        return t174.split(u174).join(v174);
    }
    static isNullOrEmpty(s174: string): boolean {
        return !s174 || s174.length === 0;
    }
    static stringToUint8Array(r174: string): Uint8Array {
        return new util.TextEncoder().encodeInto(r174);
    }
    static stringToArrayBuffer(n174: string): ArrayBuffer {
        const o174 = new ArrayBuffer(n174.length);
        const p174 = new Uint8Array(o174);
        for (let q174 = 0; q174 < n174.length; q174++) {
            p174[q174] = n174.charCodeAt(q174);
        }
        return o174;
    }
    static uint8ArrayToString(l174: Uint8Array): string {
        const m174 = new util.TextDecoder();
        return m174.decodeToString(l174);
    }
    static uint8ArrayToArrayBuffer(k174: Uint8Array): ArrayBuffer {
        return k174.buffer;
    }
    static uint8ArrayToHexString(g174: Uint8Array) {
        let h174 = '';
        for (let i174 = 0; i174 < g174.length; i174++) {
            const j174 = g174[i174].toString(16);
            h174 += j174.length === 1 ? '0' + j174 : j174;
        }
        return h174;
    }
    static uint8ArrayToHexString2(f174: Uint8Array): string {
        return buffer.from(f174).toString('hex');
    }
    static uint8ArrayToHexString3(b174: Uint8Array): string {
        let c174 = '';
        let d174: number;
        for (d174 = 0; d174 < b174.length; d174++) {
            let e174 = ('00' + b174[d174].toString(16)).slice(-2);
            c174 += e174;
        }
        return c174;
    }
    static uint8ArrayToHexArray(z173: Uint8Array) {
        return Array.from(z173).map(a174 => a174.toString(16).padStart(2, '0'));
    }
    static isHexString(x173: string): boolean {
        const y173 = /^[0-9a-fA-F]+$/;
        return y173.test(x173);
    }
    static hexToUint8Array(t173: string): Uint8Array {
        const u173 = t173.length;
        const v173 = new Uint8Array(u173 / 2);
        for (let w173 = 0; w173 < u173; w173 += 2) {
            v173[w173 / 2] = parseInt(t173.substring(w173, w173 + 2), 16);
        }
        return v173;
    }
    static arrayBufferToString(p173: ArrayBuffer): string {
        const q173 = new Uint8Array(p173);
        let r173 = '';
        for (let s173 = 0; s173 < q173.length; s173++) {
            r173 += String.fromCharCode(q173[s173]);
        }
        return r173;
    }
    static arrayBufferToUint8Array(o173: ArrayBuffer): Uint8Array {
        return new Uint8Array(o173);
    }
    static toUint8Array(n173: string | Uint8Array | ArrayBuffer): Uint8Array {
        if (n173 instanceof Uint8Array) {
            return n173;
        }
        else if (n173 instanceof ArrayBuffer) {
            return new Uint8Array(n173);
        }
        return this.stringToUint8Array(n173);
    }
    static toArrayBuffer(m173: string | Object | ArrayBuffer): ArrayBuffer {
        if (m173 instanceof ArrayBuffer) {
            return m173;
        }
        if (typeof m173 === "object") {
            m173 = JSON.stringify(m173);
        }
        if (typeof m173 === "string") {
            return buffer.from(m173, 'utf-8').buffer;
        }
        else {
            return null;
        }
    }
    static removeTrailingZeros(j173: ArrayBuffer): ArrayBuffer {
        const k173 = new Uint8Array(j173);
        let l173 = k173.length;
        while (l173 > 0 && k173[l173 - 1] === 0) {
            l173--;
        }
        if (l173 < k173.length) {
            return j173.slice(0, l173);
        }
        return j173;
    }
}
export { BufferUtil as StringUtil };
