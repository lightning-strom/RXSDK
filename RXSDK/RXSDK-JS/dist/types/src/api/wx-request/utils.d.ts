export declare function mergeConfig(config0?: {}, config1?: {}): {};
export declare function combineUrl(url: string, baseURL: string): string;
/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export declare function combineURLs(baseURL: any, relativeURL: any): any;
/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
export declare function isAbsoluteURL(url: any): boolean;
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
export declare function buildFullPath(baseURL: any, requestedURL: any): any;
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export declare function buildURL(url: string, params: object, paramsSerializer: Function): string;
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
export declare function forEach(obj: any, fn: Function): void;
export declare function bind(fn: Function, thisArg: any): () => any;
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
export declare function extend(a: any, b: any, thisArg?: any): any;
/**
 * 处理各平台返回的响应数据，抹平差异
 * @param mpResponse
 * @param config axios处理过的请求配置对象
 * @param request 小程序的调用发起请求时，传递给小程序api的实际配置
 */
export declare function transformResponse(mpResponse: any, config: any): {
    data: any;
    status: any;
    statusText: string;
    headers: any;
    config: any;
};
/**
 * 处理各平台返回的错误信息，抹平差异
 * @param error 小程序api返回的错误对象
 * @param config
 */
export declare function transformError(error: any, config: any): any;
