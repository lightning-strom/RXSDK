import { RXResult } from "../types/Index";
export declare class RXError extends Error implements RXResult {
    code: number;
    msg?: string;
    thirdcode?: any;
    thirdmsg?: string;
    constructor(i25?: any, j25?: number, k25?: any, l25?: string);
}
