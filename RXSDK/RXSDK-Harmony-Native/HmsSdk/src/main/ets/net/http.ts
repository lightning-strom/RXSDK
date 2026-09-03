/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import http from '@ohos.net.http'
import { Logger } from '../utils/Logger'
import Path from './Path'
import { RXCallback, RXError, RXErrorCode, RXResult } from '../types/Index'
import Objects from '../utils/Objects'
import { BusinessError, Callback } from '@ohos.base'
import UrlUtil from '../utils/UrlUtil';
import { RXUtil } from '../utils/RXUtil';
import { ErrorReport } from '../base/ErrorReport';
import ZlibUtil from '../utils/ZlibUtil';
import { buffer } from '@kit.ArkTS'
import AESUtil from '../utils/AESUtil'

export interface HttpResponse extends http.HttpResponse {
  index: number;
}

type RequestMethod = keyof typeof http.RequestMethod;

export const CONTENT_ENCODING = "content-encoding"

export const CONTENT_TYPE = "Content-Type"

export const CONTENT_TYPE_JSON = "application/json"

export const TEXT_PLAIN = "text/plain"

export const RUIXUE_ENCIPHER = "ruixue-encipher"

interface Interceptor {
  request?(config: http.HttpRequestOptions): http.HttpRequestOptions | Promise<http.HttpRequestOptions>;

  response?(response: HttpResponse): HttpResponse | Promise<HttpResponse>;

  error?(error: any): any | Promise<any>;
}

class Http {
  private _url: string
  private interceptors: Interceptor[] = [];
  private _domains: Array<string>
  private _options: http.HttpRequestOptions
  private _index: number = 0
  private _delay: number = 0
  private dataReceiveProgress: Callback<http.DataReceiveProgressInfo>
  private ignoreReport?: boolean | undefined;
  private _expectedType?: 'string' | 'object' | 'arraybuffer'
  private _responseHeader?: object | undefined
  private _resultType?: http.HttpDataType | undefined
  private _bodyData?: string | Object | ArrayBuffer;
  private readonly retryCodes: Set<number> = new Set([305503, 302015, 302016]);

  constructor() {
    this._url = ''
    this._options = {
      method: http.RequestMethod.GET,
      header: { 'Content-Type': 'application/json' },
      extraData: "",
      usingProtocol: http.HttpProtocol.HTTP2,
      readTimeout: 70000,
      connectTimeout: 70000
    }
  }

  static create(url: string = null): Http {
    return new Http().setUrl(url)
  }

  get url() {
    return this._url
  }

  addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }


  public get responseHeader(): object | undefined {
    return this._responseHeader
  }


  public get resultType(): http.HttpDataType | undefined {
    return this._resultType
  }

  get domains() {
    return this._domains
  }

  private isEncipher(header): boolean {
    return header?.[RUIXUE_ENCIPHER] == 1
  }


  public setIgnoreReport(value: boolean | undefined) {
    this.ignoreReport = value;
    return this
  }

  setDelay(delayMilliSecond: number): Http {
    this._delay = delayMilliSecond
    return this
  }

  setUrl(url: string): Http {
    this._url = url
    return this
  }

  setDomains(domains: string[]): Http {
    this._domains = domains
    return this
  }

  stringToEnum<T>(enumType: object, stringValue: string): T | undefined {
    for (const key in http.RequestMethod) {
      if (enumType.hasOwnProperty(key) && enumType[key] === stringValue) {
        return key as any;
      }
    }
    return undefined;
  }

  setMethod(method: RequestMethod): Http {
    this._options.method = method?.toUpperCase() as http.RequestMethod
    return this
  }


  setHeaders(headers: Record<string, any>) {
    this._options.header = Object.assign({}, this._options?.header, Objects.toObject(headers));
    return this
  }

  setBody(extraData?: string | Object | ArrayBuffer) {
    if (typeof extraData === 'object') {
      this._bodyData = Objects.toObject(extraData) ?? {}
    } else {
      this._bodyData = extraData
    }
    if (typeof extraData === 'function') {
      Logger.e("error extraData type function not support. ")
    }
    return this
  }

  setOptions(option: Object) {
    this._options = option
    return this
  }

  setList(list: number[], flag: number) {
    list = []
    for (let i = 0; i < flag; i++) {
      list[i] = i
    }
    return list
  }

  setParameter(keys: string[], values: string[]) {
    let result = new Map<String, Object>()
    for (let i = 0; i <= keys.length - 1; i++) {
      let key = keys[i]
      let value = values[i]
      result[key] = value
    }
    return result
  }


  async fetchRestfulData<T>(callback?: RXCallback<RXResult<T>>): Promise<RXResult<T>> {
    try {
      return await this.request(callback)
        .then(resp => {
          let tr: RXResult<T>;
          //resp.resultType == http.HttpDataType.STRING
          if (typeof resp.result === 'string') {
            let retryRequest = () => {
              this._options.header[RUIXUE_ENCIPHER] = 0
              this._options.header[CONTENT_TYPE] = CONTENT_TYPE_JSON
              Logger.d("retry the no encipher request " + this._url)
              return this.fetchRestfulData(callback)
            }
            if (this.isEncipher(resp.header)) {
              let dat = JSON.parse(resp.result) as RXResult<string>;
              if (dat.code === 0) {
                try {
                  let dec = AESUtil.decryptCBC(dat.data)
                  tr = { ...dat, data: Objects.parse<T>(dec) }
                } catch (e) {
                  this.report(this.url, e, { error_action: "decrypt", key: AESUtil.getAesKey() })
                  return retryRequest()

                }
              } else {
                tr = dat as RXResult<T>;
              }
            } else {
              tr = JSON.parse(resp.result) as RXResult<T>;
            }

            if (this.retryCodes.has(tr?.code) && this.isEncipher(this._options.header)) {
              return retryRequest()
            }

            if (typeof tr === 'object' && tr !== null && "msg" in tr) {
              tr = {
                ...tr, message: tr.msg, trace_id: this._options.header?.["ruixue-traceid"]
              } as RXResult<T>;
            }
          } else {
            tr = resp.result as RXResult<T>;
          }

          callback?.(null, tr);
          return tr


        })
    } catch (e) {
      let ee = RXUtil.formatResult(e, RXErrorCode.NET_ERROR)
      Logger.e(ee?.errorfunc?.name || "error" + ":" + JSON.stringify(ee))
      if (callback) {
        callback?.(ee)
        return ee
      } else {
        throw ee
      }
      // Promise.reject(e)
    }
  }


  async request<T>(callback?: RXCallback<T>, url: string = this.url, delay: number = this._delay, cursor: number = this._index): Promise<HttpResponse> {
    let url_full: string = url
    let isPath: boolean = false
    let domains = this.domains;
    if (!url.startsWith("http")) {
      isPath = true
      if (!domains || cursor >= domains.length) {
        let err = this.error(RXErrorCode.INIT_PARAMS_ERROR, "domains is null or index out of bounds")
        if (callback) {
          callback(err, null)
        } else {
          throw err
        }
      }
      url_full = Path.join(domains[cursor], url)
    }
    return await this.doRequest(url_full, delay)
      .catch((err: Error) => {
        this.report(url_full, err)
        if (isPath && domains && domains.length > 1 && ++cursor < domains.length) {
          this._index = cursor;
          return this.request(callback, url, 0, cursor)
        } else {
          let er = err as RXError
          er.msg = err.message
          if (callback) {
            callback(er, null)
          } else {
            throw err
          }
        }
      })
  }

  wait = (millisecond: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, millisecond)
    })
  }

  moveDomainToFirst(index: number): Array<string> {
    if (index > 0 && index < this.domains.length) {
      let t = this.domains[index]
      this.domains.splice(index, 1)
      this.domains.unshift(t)
      this._index = 0
      Logger.debug(this.domains)
    }
    return this.domains
  }

  error(code: number, msg: string) {
    let err: BusinessError = {
      code: 1000 + code,
      name: 'HttpError',
      message: msg
    }
    return err
  }

  report(url: string, e: any, ext?: object) {
    if (!this.ignoreReport) {
      ErrorReport.report(Objects.assign({
        error_code: e.code,
        error_msg: e.message || e.msg,
        request_address: url,
        request_body: this._bodyData,
        request_header: this._options.header
      }, e, ext))
    } else {
      Logger.e("request error:" + Objects.stringify(e))
    }
  }

  getCurlStr(url: string): string {
    try {
      const headers = Object.entries(this._options.header || {})
        .map(([key, value]) => `-H "${key}: ${value}"`)
        .join(" ");
      let body = "";
      let isGzip = this.isGzip(this._options.header);
      if (this._options.method !== http.RequestMethod.GET && this._options.extraData) {
        let requestData = this._options.extraData;
        if (isGzip) {
          body = `\\\r\n --data-binary @<(echo '${buffer.from(requestData as ArrayBuffer)?.toString("base64")}' | base64 --decode)`;
        } else {
          body = `\\\r\n -d '${Objects.stringify(requestData)}'`;
        }
      }
      return `${url} ${headers} ${body}`.trim();
    } catch (e) {
      Logger.e(e)
    }
  }

  private isGzip(header?): boolean {
    return header?.[CONTENT_ENCODING] === "gzip"
  }

  private async doRequest(url: string = this._url, delay: number = 0): Promise<HttpResponse> {
    if (delay > 0) {
      await this.wait(delay)
    }
    let httpRequest = http.createHttp()
    if (this.dataReceiveProgress) {
      httpRequest.on('dataReceiveProgress', this.dataReceiveProgress)
    }
    const header = this._options.header as Record<string, any>
    let extraData = this._bodyData
    if (this._options.method === http.RequestMethod.GET) {
      url = UrlUtil.joinQuery(url, extraData)
    }

    if (this.isGzip(header) && extraData) {
      extraData = await ZlibUtil.gzip(extraData) ?? extraData
    }

    if (this.isEncipher(header) && extraData) {
      try {
        let encDat
        Logger.debug(extraData)
        if (typeof extraData === 'object' && !(extraData instanceof ArrayBuffer) && !(extraData instanceof Uint8Array)) {
          encDat = AESUtil.encryptCBC(Objects.stringify(extraData));
        } else {
          encDat = AESUtil.encryptCBC(extraData);
        }
        extraData = encDat
      } catch (e) {
        header[RUIXUE_ENCIPHER] = 0
        header[CONTENT_TYPE] = CONTENT_TYPE_JSON
        this._options.header = header
        Logger.debug("err data:" + extraData)
        this.report(url, e, { error_action: "encrypt", key: AESUtil.getAesKey() })
      }
    }
    this._options.extraData = extraData

    Logger.debug(this.getCurlStr(url));
    // httpRequest.requestInStream(url, this._options);
    let result: HttpResponse = await httpRequest.request(url, this._options).then((resp) => {
      this._responseHeader = resp.header
      this._resultType = resp.resultType

      if (resp.responseCode == http.ResponseCode.OK) {
        let t = resp as HttpResponse
        this.moveDomainToFirst(this._index)
        Logger.debug(resp.result);
        return t
      } else {
        Logger.w(resp.result);
        throw this.error(resp.responseCode, resp.result as string)
      }
    });
    if (this.dataReceiveProgress) {
      httpRequest.off('dataReceiveProgress', this.dataReceiveProgress)
    }
    httpRequest.destroy();
    return result;

  }
}

export default Http