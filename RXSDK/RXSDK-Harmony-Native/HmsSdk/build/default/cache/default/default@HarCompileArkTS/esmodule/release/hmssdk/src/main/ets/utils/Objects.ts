import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
class Objects {
    checkRequiredParams(f193: Record<string, any>, g193?: string[]) {
        return RXUtil.checkRequiredParams(f193, g193);
    }
    isEmpty(e193: Object): boolean {
        return !e193 || Object.keys(e193).length === 0;
    }
    isMap(d193: any): d193 is Map<any, any> {
        return d193 instanceof Map;
    }
    isArray(c193: any): c193 is Array<any> {
        return c193 instanceof Array;
    }
    isArrayBuffer(b193: any): b193 is ArrayBuffer {
        return b193 instanceof ArrayBuffer;
    }
    isError(a193: any): a193 is Error {
        return a193 instanceof Error;
    }
    deleteKey(y192: object, z192: string) {
        if (y192) {
            delete y192[z192];
        }
        return y192;
    }
    assign(w192: object, ...x192: any[]) {
        if (w192 == null) {
            w192 = {};
        }
        return Object.assign(w192, ...x192);
    }
    deepAssign(p192, ...q192) {
        const r192 = (q192.length && typeof q192[q192.length - 1] === 'object' && q192[q192.length - 1].__deepAssignOptions)
            ? q192.pop().__deepAssignOptions
            : { arrayMerge: 'replace' };
        if (!p192 || typeof p192 !== 'object') {
            p192 = {};
        }
        q192.forEach(s192 => {
            if (!s192 || typeof s192 !== 'object') {
                return;
            }
            Object.keys(s192).forEach(t192 => {
                const u192 = s192[t192];
                const v192 = p192[t192];
                if (u192 && typeof u192 === 'object' && !Array.isArray(u192)) {
                    if (!v192 || typeof v192 !== 'object' || Array.isArray(v192)) {
                        p192[t192] = {};
                    }
                    this.deepAssign(p192[t192], u192, { __deepAssignOptions: r192 });
                }
                else if (Array.isArray(u192)) {
                    if (Array.isArray(v192) && r192.arrayMerge === 'concat') {
                        p192[t192] = v192.concat(u192);
                    }
                    else {
                        p192[t192] = u192;
                    }
                }
                else {
                    p192[t192] = u192;
                }
            });
        });
        return p192;
    }
    parse<m192 = any>(n192: string): m192 {
        try {
            const o192 = JSON.parse(n192);
            return o192 as m192;
        }
        catch {
            return n192 as m192;
        }
    }
    safeStringify(h192) {
        try {
            const j192 = new WeakSet();
            return JSON.stringify(h192, (k192, l192) => {
                if (typeof l192 === 'object' && l192 !== null) {
                    if (j192.has(l192)) {
                        return '[Circular]';
                    }
                    j192.add(l192);
                }
                if (l192 === undefined) {
                    return '[undefined]';
                }
                if (l192 === null) {
                    return '[null]';
                }
                if (typeof l192 === 'function') {
                    return '[Function]';
                }
                if (typeof l192 === 'symbol') {
                    return '[Symbol]';
                }
                if (l192 instanceof Date) {
                    return l192.toISOString();
                }
                if (typeof l192 === 'bigint') {
                    return l192.toString();
                }
                return l192;
            });
        }
        catch (i192) {
            console.error('JSON.stringify error:', i192);
            return '';
        }
    }
    stringify(x191) {
        if (typeof x191 === 'string') {
            return x191;
        }
        return JSON.stringify(x191, (y191, z191) => {
            if (z191 instanceof Map) {
                return {
                    __type: "Map",
                    ...Object.fromEntries(z191)
                };
            }
            else if (z191 instanceof Set) {
                return {
                    __type: "Set",
                    ...Array.from(z191).reduce((e192, f192, g192) => {
                        e192[g192] = f192;
                        return e192;
                    }, {})
                };
            }
            else if (z191 instanceof Error) {
                return {
                    __type: "Error",
                    code: z191["code"],
                    name: z191.name,
                    message: z191.message,
                    stack: z191.stack ? z191.stack.split('\n').slice(0, 10)?.join(' ')?.trim() : undefined
                };
            }
            else if (z191 instanceof ArrayBuffer) {
                return {
                    __type: "ArrayBuffer",
                    ...Array.from(new Uint8Array(z191)).reduce((b192, c192, d192) => {
                        b192[d192] = c192;
                        return b192;
                    }, {})
                };
            }
            else if (z191 instanceof RegExp) {
                const a192: {
                    __type: "RegExp";
                    pattern: string;
                    flags: string;
                } = {
                    __type: "RegExp",
                    pattern: z191.source,
                    flags: z191.flags
                };
                return a192;
            }
            return z191;
        });
    }
    mapToRecord(u191: Map<string, any>): Record<string, any> {
        return Object.fromEntries(Array.from(u191.entries(), ([v191, w191]) => [
            v191,
            w191 instanceof Map
                ? this.mapToRecord(w191)
                : typeof w191 === "object" && w191 !== null && !(w191 instanceof Array)
                    ? this.recordToMap(w191)
                    : w191,
        ]));
    }
    recordToMap(r191: Record<string, any>): Map<string, any> {
        return new Map(Object.entries(r191).map(([s191, t191]) => [
            s191,
            t191 instanceof Map
                ? this.mapToRecord(t191)
                : typeof t191 === "object" && t191 !== null && !(t191 instanceof Array)
                    ? this.recordToMap(t191)
                    : t191,
        ]));
    }
    shallowCopy(p191: object): object {
        let q191 = {};
        Object.assign(q191, p191);
        return q191;
    }
    deepCopy(m191: object): object {
        let n191 = Array.isArray(m191) ? [] : {};
        for (let o191 in m191) {
            if (typeof m191[o191] === 'object') {
                n191[o191] = this.deepCopy(m191[o191]);
            }
            else {
                n191[o191] = m191[o191];
            }
        }
        return n191;
    }
    eToObject(k191: Error): object {
        const l191 = {
            name: k191.name,
            message: k191.message,
            stack: k191.stack ? k191.stack.split('\n').slice(0, 10).join('\n') : undefined,
        };
        return l191;
    }
    toObject<f191 = object>(g191: string | Map<any, any> | object | Error | Record<string, any>): f191 | null {
        if (g191 instanceof Map) {
            return Array.from(g191.entries()).reduce((h191, [i191, j191]) => {
                (h191 as any)[i191] = j191;
                return h191;
            }, {} as f191);
        }
        else if (g191 instanceof Error) {
            return this.eToObject(g191) as f191;
        }
        else if (typeof g191 === "object" && g191 !== null) {
            return g191 as f191;
        }
        else if (typeof g191 == 'string') {
            return JSON.parse(g191) as f191;
        }
        else {
            Logger.e("Unsupported data type for toObject conversion.");
            return null;
        }
    }
    prefixInt(d191, e191): string {
        return (Array(e191).join('0') + d191).slice(-e191);
    }
    clone(c191: Object) {
        return Object.assign({}, c191);
    }
    deepClone(a191: any) {
        if (a191 instanceof Array) {
            return a191.concat();
        }
        else {
            let b191 = Object.getPrototypeOf(a191);
            return Object.assign(Object.create(b191), a191);
        }
    }
}
export default new Objects();
