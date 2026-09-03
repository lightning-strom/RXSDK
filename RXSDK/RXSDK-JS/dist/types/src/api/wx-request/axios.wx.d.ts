/**
 * Axios.js
 */
import { WXRequestConfig, WXRequestInterceptorManager, WXRequestResponse } from './index';
declare class WxAxios {
    defaults: WXRequestConfig;
    interceptors: {
        request: WXRequestInterceptorManager<WXRequestConfig>;
        response: WXRequestInterceptorManager<WXRequestResponse>;
    };
    constructor(config?: WXRequestConfig);
    get(url: string, config?: WXRequestConfig): any;
    post(url: string, data?: {}, config?: WXRequestConfig): any;
    request(config: WXRequestConfig): any;
    dispatchRequest(config?: WXRequestConfig): any;
}
export default WxAxios;
