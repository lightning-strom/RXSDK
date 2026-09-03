import Http from './http';
import { RCallback, RXResult } from '../types/Index';
export interface RequestOptions {
    method: string | RequestMethod;
    path: string;
    data?: string | Object;
    expectedType?: 'string' | 'object' | 'arraybuffer';
    headers?: Record<string, any>;
    withToken?: boolean;
    ignoreReport?: boolean;
    encipher?: number;
}
export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export declare class RXRequest {
    private retryCode;
    static get token(): import("../types/Index").AccessToken;
    static getHeader(b62?: Record<string, any>, c62?: boolean, d62?: number): Record<string, any>;
    identity<z61>(a62: z61): z61;
    static createRequest(y61: RequestOptions): Http;
    static request<t61>(u61: RequestOptions, v61?: RCallback<t61>): Promise<RXResult<t61>>;
    static get<o61>(p61: string, q61?: string | object, r61?: Record<string, any>, s61?: RCallback<o61>): Promise<RXResult<o61>>;
    static post<j61>(k61: string, l61: string | object, m61?: Record<string, any>, n61?: RCallback<j61>): Promise<RXResult<j61>>;
}
