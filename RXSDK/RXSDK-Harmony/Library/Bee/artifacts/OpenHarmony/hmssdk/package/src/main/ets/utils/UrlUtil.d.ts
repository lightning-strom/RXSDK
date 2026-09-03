declare class UrlUtil {
    getHostFromUrl(r198: string): string;
    toQueryString(d198: string | object | ArrayBuffer): string;
    joinQuery(a198: string, b198: string | object | ArrayBuffer): string;
    isHttpUrl(y197: string): boolean;
    getPathFromUrl(w197: any): any;
    getProtocolFromUrl(u197: any): any;
    removeQueryParam(l197: any, m197: any): any;
    getQueryParamValue(f197: any, g197: any): string;
}
declare const _default: UrlUtil;
export default _default;
