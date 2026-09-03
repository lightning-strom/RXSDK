import Http, { CONTENT_TYPE, RUIXUE_ENCIPHER, TEXT_PLAIN } from './http';
import DateTime from '../utils/DateTime'
import Devices from '../utils/Devices'
import { RCallback, RXResult } from '../types/Index';
import SDKConfig from '../sdk/SDKConfig';
import Passport from '../base/Passport';
import Objects from '../utils/Objects'
import { RXUtil } from '../utils/RXUtil';
import UserActionTracer from '../base/UserActionTracer';
import { APITraceData } from '../base/UserActionEnum';
import UrlUtil from '../utils/UrlUtil';


export interface RequestOptions {
  method: string | RequestMethod
  path: string
  data?: string | Object
  expectedType?: 'string' | 'object' | 'arraybuffer'
  headers?: Record<string, any>
  withToken?: boolean
  ignoreReport?: boolean
  encipher?: number
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class RXRequest {
  private retryCode: number = 302001

  static get token() {
    return Passport.token;
  }

  static getHeader(header?: Record<string, any>, withToken: boolean = true, encipher?: number) {
    let config = SDKConfig;
    encipher ??= config.encipher
    const headers: Record<string, any> = {
      "Charset": "UTF-8",
      "accept": "application/json",
      "Accept-Language": Devices.systemLocale,
      "ruixue-language": Devices.simplifiedLanguage,
      "ruixue-tzoffset": DateTime.getTimezoneDecimal(),
      "ruixue-traceid": Devices.genUUID(),
      "ruixue-appinfo": UrlUtil.toQueryString({ version: config.APP_VERSION }),
      "ruixue-cpid": config?.cpId,
      "ruixue-productid": config?.productId,
      "ruixue-channelid": config?.channelId,
      "ruixue-platformid": Devices.platformId,
      "ruixue-version": config.VERSION,
      "ruixue-devicecode": Devices.deviceCode,
      [CONTENT_TYPE]: encipher == 1 ? TEXT_PLAIN : "application/json; charset=UTF-8",
      [RUIXUE_ENCIPHER]: encipher,
    };
    if (config.regionTag) {
      headers["ruixue-region"] = config.regionTag;
    }
    if (config.cpRoleId) {
      headers["ruixue-cp-role-id"] = config.cpRoleId;
    }

    if (header) {
      Object.assign(headers, Objects.toObject(header));
    }
    let token = this.token
    if (withToken && token) {
      headers["ruixue-accesstoken"] = token.access
    }
    return headers;
  }

  identity<T>(arg: T): T {
    return arg;
  }

  static createRequest(options: RequestOptions): Http {
    options.headers = RXRequest.getHeader(options.headers, options.withToken, options.encipher)
    return Http.create(options.path)
      .setMethod(options.method as RequestMethod)
      .setDomains(SDKConfig.domains)
      .setIgnoreReport(options.ignoreReport)
      .setHeaders(options.headers)
      .setBody(options.data)
  }

  //
  static async request<T>(options: RequestOptions, callback?: RCallback<T>): Promise<RXResult<T>> {
    return await this.createRequest(options).fetchRestfulData<T>(RXUtil.toRXCallback(callback)).then((resp) => {

      let ue: APITraceData = {
        error_code: resp.code,
        error_msg: resp.msg,
        api: options.path,
        request_body: Objects.toObject(options.data),
        request_header: options.headers
      }
      UserActionTracer.dispatch(ue)
      return resp
    })
  }

  static async get<T>(path: string, data?: string | object, headers?: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>> {
    return this.request({
      method: RequestMethod.GET,
      path,
      data,
      headers
    }, callback)
  }

  static async post<T>(path: string, data: string | object, headers?: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>> {
    return this.request({
      method: RequestMethod.POST,
      path,
      data,
      headers
    }, callback)
  }
}

// export default new RXRequest()