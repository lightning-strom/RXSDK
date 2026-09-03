import Http from "../net/http";
import Path from "../net/Path";
import { RequestMethod } from "../net/RXRequest";
import { RCallback, RXResult } from "../types/Index";
import { BusinessError } from "@kit.BasicServicesKit";
import { Logger } from "../utils/Logger";

import { http } from "@kit.NetworkKit";
import { RXUtil } from "../utils/RXUtil";

export interface CredentialsBean {
  access_key_secret: string;
  expiration: string;
  access_key_id: string;
  security_token: string;
  start_unix_time: number;
  expiration_unix_time: number;
  assumed_role: string;
  arn: string;
}

export interface OssConfigBean {
  provider: string;
  region: string;
  bucket: string;
  domain: string;
  credentials: CredentialsBean;
}

export class Header {
  static readonly AUTHORIZATION = "Authorization";
  static readonly X_COS_SECURITY_TOKEN = "x-cos-security-token";

  static readonly USER_AGENT = "User-Agent";

  static readonly HOST = "Host";

  static readonly CONTENT_LENGTH = "Content-Length";

  static readonly CONTENT_DISPOSITION = "Content-Disposition";

  static readonly CONTENT_ENCODING = "Content-Encoding";

  static readonly CONTENT_TYPE = "Content-Type";

  static readonly CONTENT_MD5 = "Content-MD5";
}

export class OssClient implements OssConfigBean {
  provider: string
  region: string
  bucket: string
  domain: string
  credentials: CredentialsBean
  method: RequestMethod = RequestMethod.PUT

  constructor(config: OssConfigBean) {
    this.provider = config.provider;
    this.region = config.region;
    this.bucket = config.bucket;
    this.domain = config.domain;
    this.credentials = config.credentials;
  }

  generateOSSHeaders(c: OssConfigBean, objectKey: string, data: ArrayBuffer): Record<string, string> {
    return;
  }




  public async putObject(objectKey: string, data: ArrayBuffer, callback?: RCallback): Promise<RXResult<object>> {
    let headers = this.generateOSSHeaders(this, objectKey, data)
    let url = Path.join(this.domain, objectKey)
    try {
      let resp = await Http.create(url)
        .setMethod(this.method)
        .setHeaders(headers)
        .setBody(data)
        .request()
      let tr: RXResult<object> = {
        code: 0, data: {
          url
        },
        message: ''
      };
      if (resp.responseCode == http.ResponseCode.OK) {
        callback?.( tr)
        Logger.d("uploadFile resp:" + JSON.stringify(tr))
      } else {
        let err: BusinessError = {
          code: 1000 + resp.responseCode,
          name: 'HttpError',
          message: resp.result.toString()
        }
        throw err
      }
      return tr
    } catch (e) {
      e = RXUtil.formatResult(e)
      callback?.(e )
      Logger.e(e)
      return e
    }
  }
}
