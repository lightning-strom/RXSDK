export declare const cpkey = "4ca7dacc9332d74e1292c83f0aa3b376";
/**
 * AES-CBC 加密字符串
 * @param {string} data 需要加密的字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 加密后的 Base64 编码字符串
 */
export declare function AesEncryptBase64String(data: any, key: any, iv: any): any;
/**
 * AES-CBC 解密字符串
 * @param {string} encryptedData 加密后的 Base64 编码字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 解密后的原始字符串
 */
export declare function AesDecryptBase64String(encryptedData: any, key: any, iv: any): any;
export declare const getSystemInfo: () => any;
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export declare function getSearchQueries(ifStringify: true): string;
export declare function getSearchQueries(): object;
export declare const storage: {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
};
/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
export declare const removeStorageByPrefix: (prefix: string, predict?: Function) => void;
export declare const asyncFunc: <F extends (...args: any) => any>(func: F, options?: Parameters<F>[0] | undefined, params?: Parameters<F>[] | undefined) => Promise<any>;
export declare const getCacheKey: (key: string, USER_INFO: any) => string;
export declare function checkNeedAesEncrypt(url: string): boolean;
export declare function removeKeyFromObject(obj: any): {
    [k: string]: unknown;
};
export declare function isJsonString(str: any): boolean;
export declare function aesEncryptBase64String(data: any, key: string): any;
export declare function aesDecryptBase64String(data: any, key: string): any;
export declare function trackEncrypt(options: any, platform: string, key: string): void;
export declare function trackDecrypt(options: any, res: any, platform: string, key: string): void;
export declare const getDevicecode: () => any;
