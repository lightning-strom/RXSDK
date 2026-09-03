import { AxiosInstance } from "axios"

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'trace'
  | 'TRACE'
  | 'connect'
  | 'CONNECT'

export type ResponseType = 'arraybuffer' | 'text'

export interface WXRequestConfig {
  // 请求接口地址
  url?: string
  method?: Method
  // 请求的 header
  header?: any
  // 请求的参数
  data?: any
  // 超时时间，单位为毫秒
  timeout?: number
  // 响应的数据类型
  responseType?: ResponseType
  // 返回的数据格式
  dataType?: 'json'
  // 开启 http2
  enableHttp2?: boolean
  // 开启 quic
  enableQuic?: boolean
  // 开启 cache
  enableCache?: boolean

  /** 以上为wx.request的可配置项，参考 https://developers.weixin.qq.com/minigame/dev/api/network/request/wx.request.html */
  /** 以下为wx.request没有的新增配置项 */
  // {String} baseURL` 将自动加在 `url` 前面，可以通过设置一个 `baseURL` 便于传递相对 URL
  baseURL?: string
  // 请求的 headers
  headers?: any
  // {Function} （同axios的validateStatus）定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 reject
  // validateStatus: undefined
  // // {Function} 请求参数包裹（类似axios的transformRequest），通过它可统一补充请求参数需要的额外信息（appInfo/pageInfo/场景值...），需return data
  // transformRequest: undefined
  // // {Function} resolve状态下响应数据包裹（类似axios的transformResponse），通过它可统一处理响应数据，需return res
  // transformResponse: undefined
  // // {Function} resolve状态包裹，通过它可做接口resolve状态的统一处理
  // resolveWrap: undefined
  // // {Function} reject状态包裹，通过它可做接口reject状态的统一处理
  // rejectWrap: undefined
}

export interface WXRequestResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: WXRequestConfig
  request?: any
}

export interface WXRequestRes<T = any> {
  data: T
  statusCode: number
  errMsg: string
  header: any
  cookies: string
}

export interface WXRequestError<T = any> extends Error {
  config: WXRequestConfig
  code?: string
  request?: any
  response?: WXRequestResponse<T>
  isAxiosError: boolean
  toJSON: () => object
}

export interface WXRequestPromise<T = any> extends Promise<WXRequestResponse<T>> {}

export interface InterceptorResolved<T = any> {
  (value: T): T | Promise<T>
}
export interface InterceptorRejected {
  (error: any): any | Promise<any>
}
export interface Interceptor<T = any> {
  resolved: InterceptorResolved<T>
  rejected?: InterceptorRejected
}
export interface InterceptorExecutor {
  (interceptor: Interceptor): void
}

export class InterceptorManager<T = any> {
  private id
  private handlers
  use(resolved: InterceptorResolved, rejected?: InterceptorRejected): number
  forEach(executor: InterceptorExecutor, reverse?: 'reverse'): void
}

export interface WXRequestInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number
  forEach(executor: InterceptorExecutor, reverse?: 'reverse'): void
}

export interface WXRequestInstance {
  (config: WXRequestConfig): WXRequestPromise
  defaults: WXRequestConfig
  interceptors: {
    request: WXRequestInterceptorManager<WXRequestConfig>
    response: WXRequestInterceptorManager<WXRequestResponse>
  }
  request<T = any, R = WXRequestResponse<T>>(config: WXRequestConfig): Promise<R>
  get<T = any, R = WXRequestResponse<T>>(url: string, config?: WXRequestConfig): Promise<R>
  post<T = any, R = WXRequestResponse<T>>(
    url: string,
    data?: any,
    config?: WXRequestConfig
  ): Promise<R>
}

export interface WXRequestStatic extends WXRequestInstance {
  create(config?: WXRequestConfig): WXRequestInstance
}

declare const wxAxios: WXRequestStatic
