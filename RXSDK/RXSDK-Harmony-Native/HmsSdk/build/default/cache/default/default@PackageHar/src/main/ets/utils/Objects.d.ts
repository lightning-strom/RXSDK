declare class Objects {
    checkRequiredParams(f193: Record<string, any>, g193?: string[]): void;
    isEmpty(e193: Object): boolean;
    isMap(d193: any): d193 is Map<any, any>;
    isArray(c193: any): c193 is Array<any>;
    isArrayBuffer(b193: any): b193 is ArrayBuffer;
    isError(a193: any): a193 is Error;
    deleteKey(y192: object, z192: string): object;
    assign(w192: object, ...x192: any[]): any;
    /**
     * 深度合并对象，类似 Object.assign，但支持子对象和数组
     * @param {Object} target 目标对象
     * @param {...Object} sources 源对象，可多个
     * @param {Object} [options] 可选配置
     *        options.arrayMerge: 'replace' | 'concat' (默认 'replace')
     * 如果想数组合并：deepAssign(target, { arr: [5] }, { __deepAssignOptions: { arrayMerge: 'concat' } });
     */
    deepAssign(p192: any, ...q192: any[]): any;
    parse<m192 = any>(n192: string): m192;
    safeStringify(h192: any): string;
    stringify(x191: any): string;
    mapToRecord(u191: Map<string, any>): Record<string, any>;
    recordToMap(r191: Record<string, any>): Map<string, any>;
    shallowCopy(p191: object): object;
    deepCopy(m191: object): object;
    eToObject(k191: Error): object;
    toObject<f191 = object>(g191: string | Map<any, any> | object | Error | Record<string, any>): f191 | null;
    prefixInt(d191: any, e191: any): string;
    clone(c191: Object): Object;
    deepClone(a191: any): any;
}
declare const _default: Objects;
export default _default;
