import http from "@ohos:net.http";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Path from "@normalized:N&&&hmssdk/src/main/ets/net/Path&4.0.0";
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXCallback, RXError, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import type { BusinessError, Callback } from "@ohos:base";
import UrlUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/UrlUtil&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import { ErrorReport } from "@normalized:N&&&hmssdk/src/main/ets/base/ErrorReport&4.0.0";
import ZlibUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/ZlibUtil&4.0.0";
import buffer from "@ohos:buffer";
import AESUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/AESUtil&4.0.0";
export interface HttpResponse extends http.HttpResponse {
    index: number;
}
type RequestMethod = keyof typeof http.RequestMethod;
export const CONTENT_ENCODING = "content-encoding";
export const CONTENT_TYPE = "Content-Type";
export const CONTENT_TYPE_JSON = "application/json";
export const TEXT_PLAIN = "text/plain";
export const RUIXUE_ENCIPHER = "ruixue-encipher";
interface Interceptor {
    request?(config: http.HttpRequestOptions): http.HttpRequestOptions | Promise<http.HttpRequestOptions>;
    response?(response: HttpResponse): HttpResponse | Promise<HttpResponse>;
    error?(error: any): any | Promise<any>;
}
class Http {
    private _url: string;
    private interceptors: Interceptor[] = [];
    private _domains: Array<string>;
    private _options: http.HttpRequestOptions;
    private _index: number = 0;
    private _delay: number = 0;
    private dataReceiveProgress: Callback<http.DataReceiveProgressInfo>;
    private ignoreReport?: boolean | undefined;
    private _expectedType?: 'string' | 'object' | 'arraybuffer';
    private _responseHeader?: object | undefined;
    private _resultType?: http.HttpDataType | undefined;
    private _bodyData?: string | Object | ArrayBuffer;
    private readonly retryCodes: Set<number> = new Set([305503, 302015, 302016]);
    constructor() {
        this._url = '';
        this._options = {
            method: http.RequestMethod.GET,
            header: { 'Content-Type': 'application/json' },
            extraData: "",
            usingProtocol: http.HttpProtocol.HTTP2,
            readTimeout: 70000,
            connectTimeout: 70000
        };
    }
    static create(u60: string = null): Http {
        return new Http().setUrl(u60);
    }
    get url() {
        return this._url;
    }
    addInterceptor(t60: Interceptor): void {
        this.interceptors.push(t60);
    }
    public get responseHeader(): object | undefined {
        return this._responseHeader;
    }
    public get resultType(): http.HttpDataType | undefined {
        return this._resultType;
    }
    get domains() {
        return this._domains;
    }
    private isEncipher(s60): boolean {
        return s60?.[RUIXUE_ENCIPHER] == 1;
    }
    public setIgnoreReport(r60: boolean | undefined) {
        this.ignoreReport = r60;
        return this;
    }
    setDelay(q60: number): Http {
        this._delay = q60;
        return this;
    }
    setUrl(p60: string): Http {
        this._url = p60;
        return this;
    }
    setDomains(o60: string[]): Http {
        this._domains = o60;
        return this;
    }
    stringToEnum<k60>(l60: object, m60: string): k60 | undefined {
        for (const n60 in http.RequestMethod) {
            if (l60.hasOwnProperty(n60) && l60[n60] === m60) {
                return n60 as any;
            }
        }
        return undefined;
    }
    setMethod(j60: RequestMethod): Http {
        this._options.method = j60?.toUpperCase() as http.RequestMethod;
        return this;
    }
    setHeaders(i60: Record<string, any>) {
        this._options.header = Object.assign({}, this._options?.header, Objects.toObject(i60));
        return this;
    }
    setBody(h60?: string | Object | ArrayBuffer) {
        if (typeof h60 === 'object') {
            this._bodyData = Objects.toObject(h60) ?? {};
        }
        else {
            this._bodyData = h60;
        }
        if (typeof h60 === 'function') {
            Logger.e("error extraData type function not support. ");
        }
        return this;
    }
    setOptions(g60: Object) {
        this._options = g60;
        return this;
    }
    setList(d60: number[], e60: number) {
        d60 = [];
        for (let f60 = 0; f60 < e60; f60++) {
            d60[f60] = f60;
        }
        return d60;
    }
    setParameter(x59: string[], y59: string[]) {
        let z59 = new Map<String, Object>();
        for (let a60 = 0; a60 <= x59.length - 1; a60++) {
            let b60 = x59[a60];
            let c60 = y59[a60];
            z59[b60] = c60;
        }
        return z59;
    }
    async fetchRestfulData<n59>(o59?: RXCallback<RXResult<n59>>): Promise<RXResult<n59>> {
        try {
            return await this.request(o59)
                .then(r59 => {
                let s59: RXResult<n59>;
                if (typeof r59.result === 'string') {
                    let t59 = () => {
                        this._options.header[RUIXUE_ENCIPHER] = 0;
                        this._options.header[CONTENT_TYPE] = CONTENT_TYPE_JSON;
                        Logger.d("retry the no encipher request " + this._url);
                        return this.fetchRestfulData(o59);
                    };
                    if (this.isEncipher(r59.header)) {
                        let u59 = JSON.parse(r59.result) as RXResult<string>;
                        if (u59.code === 0) {
                            try {
                                let w59 = AESUtil.decryptCBC(u59.data);
                                s59 = { ...u59, data: Objects.parse<n59>(w59) };
                            }
                            catch (v59) {
                                this.report(this.url, v59, { error_action: "decrypt", key: AESUtil.getAesKey() });
                                return t59();
                            }
                        }
                        else {
                            s59 = u59 as RXResult<n59>;
                        }
                    }
                    else {
                        s59 = JSON.parse(r59.result) as RXResult<n59>;
                    }
                    if (this.retryCodes.has(s59?.code) && this.isEncipher(this._options.header)) {
                        return t59();
                    }
                    if (typeof s59 === 'object' && s59 !== null && "msg" in s59) {
                        s59 = {
                            ...s59, message: s59.msg,
                            trace_id: this._options.header?.["ruixue-traceid"]
                        } as RXResult<n59>;
                    }
                }
                else {
                    s59 = r59.result as RXResult<n59>;
                }
                o59?.(null, s59);
                return s59;
            });
        }
        catch (p59) {
            let q59 = RXUtil.formatResult(p59, RXErrorCode.NET_ERROR);
            Logger.e(q59?.errorfunc?.name || "error" + ":" + JSON.stringify(q59));
            if (o59) {
                o59?.(q59);
                return q59;
            }
            else {
                throw q59;
            }
        }
    }
    async request<c59>(d59?: RXCallback<c59>, e59: string = this.url, f59: number = this._delay, g59: number = this._index): Promise<HttpResponse> {
        let h59: string = e59;
        let i59: boolean = false;
        let j59 = this.domains;
        if (!e59.startsWith("http")) {
            i59 = true;
            if (!j59 || g59 >= j59.length) {
                let m59 = this.error(RXErrorCode.INIT_PARAMS_ERROR, "domains is null or index out of bounds");
                if (d59) {
                    d59(m59, null);
                }
                else {
                    throw m59;
                }
            }
            h59 = Path.join(j59[g59], e59);
        }
        return await this.doRequest(h59, f59)
            .catch((k59: Error) => {
            this.report(h59, k59);
            if (i59 && j59 && j59.length > 1 && ++g59 < j59.length) {
                this._index = g59;
                return this.request(d59, e59, 0, g59);
            }
            else {
                let l59 = k59 as RXError;
                l59.msg = k59.message;
                if (d59) {
                    d59(l59, null);
                }
                else {
                    throw k59;
                }
            }
        });
    }
    wait = (z58: number) => {
        return new Promise<void>((a59, b59) => {
            setTimeout(() => {
                a59();
            }, z58);
        });
    };
    moveDomainToFirst(x58: number): Array<string> {
        if (x58 > 0 && x58 < this.domains.length) {
            let y58 = this.domains[x58];
            this.domains.splice(x58, 1);
            this.domains.unshift(y58);
            this._index = 0;
            Logger.debug(this.domains);
        }
        return this.domains;
    }
    error(u58: number, v58: string) {
        let w58: BusinessError = {
            code: 1000 + u58,
            name: 'HttpError',
            message: v58
        };
        return w58;
    }
    report(r58: string, s58: any, t58?: object) {
        if (!this.ignoreReport) {
            ErrorReport.report(Objects.assign({
                error_code: s58.code,
                error_msg: s58.message || s58.msg,
                request_address: r58,
                request_body: this._bodyData,
                request_header: this._options.header
            }, s58, t58));
        }
        else {
            Logger.e("request error:" + Objects.stringify(s58));
        }
    }
    getCurlStr(j58: string): string {
        try {
            const l58 = Object.entries(this._options.header || {})
                .map(([p58, q58]) => `-H "${p58}: ${q58}"`)
                .join(" ");
            let m58 = "";
            let n58 = this.isGzip(this._options.header);
            if (this._options.method !== http.RequestMethod.GET && this._options.extraData) {
                let o58 = this._options.extraData;
                if (n58) {
                    m58 = `\\\r\n --data-binary @<(echo '${buffer.from(o58 as ArrayBuffer)?.toString("base64")}' | base64 --decode)`;
                }
                else {
                    m58 = `\\\r\n -d '${Objects.stringify(o58)}'`;
                }
            }
            return `${j58} ${l58} ${m58}`.trim();
        }
        catch (k58) {
            Logger.e(k58);
        }
    }
    private isGzip(i58?): boolean {
        return i58?.[CONTENT_ENCODING] === "gzip";
    }
    private async doRequest(y57: string = this._url, z57: number = 0): Promise<HttpResponse> {
        if (z57 > 0) {
            await this.wait(z57);
        }
        let a58 = http.createHttp();
        if (this.dataReceiveProgress) {
            a58.on('dataReceiveProgress', this.dataReceiveProgress);
        }
        const b58 = this._options.header as Record<string, any>;
        let c58 = this._bodyData;
        if (this._options.method === http.RequestMethod.GET) {
            y57 = UrlUtil.joinQuery(y57, c58);
        }
        if (this.isGzip(b58) && c58) {
            c58 = await ZlibUtil.gzip(c58) ?? c58;
        }
        if (this.isEncipher(b58) && c58) {
            try {
                let h58;
                Logger.debug(c58);
                if (typeof c58 === 'object' && !(c58 instanceof ArrayBuffer) && !(c58 instanceof Uint8Array)) {
                    h58 = AESUtil.encryptCBC(Objects.stringify(c58));
                }
                else {
                    h58 = AESUtil.encryptCBC(c58);
                }
                c58 = h58;
            }
            catch (g58) {
                b58[RUIXUE_ENCIPHER] = 0;
                b58[CONTENT_TYPE] = CONTENT_TYPE_JSON;
                this._options.header = b58;
                Logger.debug("err data:" + c58);
                this.report(y57, g58, { error_action: "encrypt", key: AESUtil.getAesKey() });
            }
        }
        this._options.extraData = c58;
        Logger.debug(this.getCurlStr(y57));
        let d58: HttpResponse = await a58.request(y57, this._options).then((e58) => {
            this._responseHeader = e58.header;
            this._resultType = e58.resultType;
            if (e58.responseCode == http.ResponseCode.OK) {
                let f58 = e58 as HttpResponse;
                this.moveDomainToFirst(this._index);
                Logger.debug(e58.result);
                return f58;
            }
            else {
                Logger.w(e58.result);
                throw this.error(e58.responseCode, e58.result as string);
            }
        });
        if (this.dataReceiveProgress) {
            a58.off('dataReceiveProgress', this.dataReceiveProgress);
        }
        a58.destroy();
        return d58;
    }
}
export default Http;
