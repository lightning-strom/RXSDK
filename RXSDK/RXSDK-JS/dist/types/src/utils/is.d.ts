export declare function is(val: unknown, type: string): boolean;
export declare function isNumber(val: unknown): val is number;
export declare function isString(val: unknown): val is string;
export declare function isBoolean(val: unknown): val is boolean;
export declare function isFunction(val: unknown): val is Function;
export declare function isObject(val: any): val is Record<any, any>;
export declare function isArray(val: any): val is Array<any>;
/**
 * Checks if `value` is `null` or `undefined`.
 */
export declare function isNil<T = unknown>(val: T): val is T;
export declare function isEmpty<T = unknown>(val: T): val is T;
/**
 * Array
 */
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
export declare function compact(val: any): any;
/**
 * Object
 */
export declare function pick(obj: Record<any, any>, ...props: Array<any>): any;
export declare function omit(obj: Record<any, any>, ...props: Array<any>): Record<any, any>;
export declare function compareVersions(version1: string, version2: string): 0 | 1 | -1;
