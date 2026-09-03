import http from '@ohos.net.http';
import { RXCallback, RXResult } from '../types/Index';
import { BusinessError } from '@ohos.base';
export interface HttpResponse extends http.HttpResponse {
    index: number;
}
type RequestMethod = keyof typeof http.RequestMethod;
export declare const CONTENT_ENCODING = "content-encoding";
export declare const CONTENT_TYPE = "Content-Type";
export declare const CONTENT_TYPE_JSON = "application/json";
export declare const TEXT_PLAIN = "text/plain";
export declare const RUIXUE_ENCIPHER = "ruixue-encipher";
interface Interceptor {
    request?(config: http.HttpRequestOptions): http.HttpRequestOptions | Promise<http.HttpRequestOptions>;
    response?(response: HttpResponse): HttpResponse | Promise<HttpResponse>;
    error?(error: any): any | Promise<any>;
}
declare class Http {
    private _url;
    private interceptors;
    private _domains;
    private _options;
    private _index;
    private _delay;
    private dataReceiveProgress;
    private ignoreReport?;
    private _expectedType?;
    private _responseHeader?;
    private _resultType?;
    private _bodyData?;
    private readonly retryCodes;
    constructor();
    static create(u60?: string): Http;
    get url(): string;
    addInterceptor(t60: Interceptor): void;
    get responseHeader(): object | undefined;
    get resultType(): http.HttpDataType | undefined;
    get domains(): string[];
    private isEncipher;
    setIgnoreReport(r60: boolean | undefined): this;
    setDelay(q60: number): Http;
    setUrl(p60: string): Http;
    setDomains(o60: string[]): Http;
    stringToEnum<k60>(l60: object, m60: string): k60 | undefined;
    setMethod(j60: RequestMethod): Http;
    setHeaders(i60: Record<string, any>): this;
    setBody(h60?: string | Object | ArrayBuffer): this;
    setOptions(g60: Object): this;
    setList(d60: number[], e60: number): number[];
    setParameter(x59: string[], y59: string[]): Map<String, Object>;
    fetchRestfulData<n59>(o59?: RXCallback<RXResult<n59>>): Promise<RXResult<n59>>;
    request<c59>(d59?: RXCallback<c59>, e59?: string, f59?: number, g59?: number): Promise<HttpResponse>;
    wait: (millisecond: number) => Promise<void>;
    moveDomainToFirst(x58: number): Array<string>;
    error(u58: number, v58: string): BusinessError<void>;
    report(r58: string, s58: any, t58?: object): void;
    getCurlStr(j58: string): string;
    private isGzip;
    private doRequest;
}
export default Http;
