import Http from '../net/http'
import Path from '../net/Path'
import { RequestMethod } from '../net/RXRequest'
import SDKConfig from '../sdk/SDKConfig'
import { RCallback, RXResult } from '../types/Index'
import { AlgName, CryptoUtil } from '../utils/CryptoUtil'
import { Logger } from '../utils/Logger'
import URL from '../utils/URL'
import { CredentialsBean, OssClient, OssConfigBean } from './OssClient'
import TencentOssSigner from './TencentOssSigner'

class AuthConstants {
  static readonly Q_SIGN_ALGORITHM = "q-sign-algorithm";
  static readonly Q_AK = "q-ak";
  static readonly Q_SIGN_TIME = "q-sign-time";
  static readonly Q_KEY_TIME = "q-key-time";
  static readonly Q_HEADER_LIST = "q-header-list";
  static readonly Q_URL_PARAM_LIST = "q-url-param-list";
  static readonly Q_SIGNATURE = "q-signature";
  static readonly SHA1 = "sha1";
  static readonly EXPIRE_TIME_RESERVE_IN_SECONDS = 60;
}

export default class OssClientTencent  extends  OssClient {

  generateOSSHeaders(c: OssConfigBean, objectKey: string, data: ArrayBuffer): Record<string, string> {
    const urlString = `${c.domain}/${objectKey}`;
    let contentType = "application/octet-stream";

    const url = new URL(urlString);
    const host = url.host;
    // const udata = new Uint8Array(data);

    let contentMD5: string = CryptoUtil.hashStringSync(data, AlgName.MD5, "base64")

    let contentLength: number = data.byteLength
    // Logger.d("test result contentMD5:" + contentMD5)
    // Logger.d("test result contentLength:" + contentLength)

    const headers: Record<string, string> = {
      "Content-Length": contentLength?.toString(),
      "User-Agent": `ruixue-sdk-${SDKConfig.VERSION}`,
      "Host": host,
      "Content-MD5": contentMD5,
    };
    const signHeaders = new Set<string>([
      "Content-Length",
      "Content-MD5",
    ]);
    const signature = TencentOssSigner.generateSignature(headers, signHeaders, c.credentials, url)
    headers.Authorization = signature;
    headers["Content-Type"] = contentType;
    headers["x-cos-security-token"] = c.credentials.security_token

    Logger.d("test Authorization:" + signature)

    return headers;
  }




}
