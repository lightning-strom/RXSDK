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
/**
 * 生成 MD5 加密字符串
 * @param {string} message - 需要加密的字符串
 * @returns {string} - 加密后的 MD5 字符串
 */
export declare function generateMD5(message: string): any;
/**
 * 获取系统设备信息(同步)
 * */
export declare const getUCSystemInfoSync: () => unknown;
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export declare function getSearchQueries(ifStringify: true): string;
export declare function getSearchQueries(): object;
export declare const customGetStorageSync: (key: string) => any;
export declare const customSetStorageSync: (key: string, value: any) => void;
export declare const removeStorageSync: (key: string) => void;
export declare const getDevicecode: () => any;
export declare const handleTrackError: (platform: string, error_action: "" | "rxlog_error_pay" | "rxlog_error_login" | "rxlog_error_share" | "rxlog_error_init" | "rxlog_error_ad" | undefined, error: any, code?: any) => {
    code: any;
    msg: any;
    thirdcode: any;
    thirdmsg: any;
};
export declare function getAllKeys(): any[];
export declare const removeStorageByPrefix: (prefix: string, predict?: Function) => void;
export declare function checkNeedAesEncrypt(url: string): boolean;
export declare function removeKeyFromObject(obj: any): {
    [k: string]: unknown;
};
export declare function isJsonString(str: any): boolean;
export declare function aesEncryptBase64String(data: any, key: string): any;
export declare function aesDecryptBase64String(data: any, key: string): any;
export declare function trackEncrypt(options: any, platform: string, key: string): void;
export declare function trackDecrypt(options: any, res: any, platform: string, key: string): void;
