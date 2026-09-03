import { ValidateError } from './interface';
export declare function format(template: ((...args: any[]) => string) | string, ...args: any[]): string;
export declare class AsyncValidationError extends Error {
    errors: ValidateError[];
    constructor(errors: ValidateError[]);
}
export declare function isEmptyValue<T = unknown>(val: T, type?: string): val is T;
