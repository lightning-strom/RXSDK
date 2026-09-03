import Http from '../net/http'
import Path from '../net/Path'
import { RequestMethod } from '../net/RXRequest'
import { RCallback, RXErrorCode, RXResult } from '../types/Index'
import { CryptoUtil } from '../utils/CryptoUtil'
import { CredentialsBean, OssClient, OssConfigBean } from './OssClient'
import { http } from '@kit.NetworkKit'
import { BusinessError } from '@kit.BasicServicesKit'


export default class OssClientAli extends OssClient {
  generateOSSHeaders(c: OssConfigBean, objectKey: string, data: ArrayBuffer): Record<string, string> {
    let bucket = c.bucket;
    let contentType = "application/octet-stream";
    let contentMd5 = "";
    let date = new Date().toUTCString();

    // 构造资源路径
    let resource = `/${bucket}/${objectKey}`;

    // 获取临时 token 和构造 x-oss-security-token
    let token = c.credentials.security_token;
    let xossHeader = `x-oss-security-token:${token}\n`;

    // 构造 StringToSign
    let stringToSign = `${this.method}\n${contentMd5}\n${contentType}\n${date}\n${xossHeader}${resource}`;

    // 使用 AccessKeySecret 生成签名
    let secret = c.credentials.access_key_secret;

    // Logger.d(stringToSign)
    // Logger.d("secret:" + secret)
    const signature = CryptoUtil.hmacSha1StringSync(stringToSign, secret, 'base64');
    // Logger.d("signature:" + (signature))
    // 生成 Authorization
    const keyId = c.credentials.access_key_id;
    const authorization = `OSS ${keyId}:${signature}`;

    // 构造请求头
    const headers: Record<string, string> = {
      Authorization: authorization,
      "Content-Type": contentType,
      "x-oss-security-token": token,
      Date: date,
    };
    return headers;
  }
}
