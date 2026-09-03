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
export declare function doRequest(options: any, urlIndex?: number, refreshNum?: number, enableHttpDNS?: boolean): Promise<any>;
