/**
 * Axios.js
 */

import wxRequest from './wxRequest'
import defaults from './defaults'
import { mergeConfig, transformError, transformResponse } from './utils'
import InterceptorManager from './InterceptorManager'
import {
  Method,
  WXRequestConfig,
  WXRequestInterceptorManager,
  WXRequestPromise,
  WXRequestResponse,
} from './index'

class WxAxios {
  defaults: WXRequestConfig
  interceptors: {
    request: WXRequestInterceptorManager<WXRequestConfig>
    response: WXRequestInterceptorManager<WXRequestResponse>
  }
  constructor(config: WXRequestConfig = defaults) {
    this.defaults = config
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    }
  }

  get(url: string, config: WXRequestConfig = {}) {
    const _config = {
      ...config,
      url,
      method: 'GET',
    } as WXRequestConfig
    return this.request(_config)
  }

  post(url: string, data = {}, config: WXRequestConfig = {}) {
    const _config = {
      ...config,
      url,
      data,
      method: 'POST',
    } as WXRequestConfig
    return this.request(_config)
  }

  request(config: WXRequestConfig) {
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {}
      config.url = arguments[0]
    } else {
      config = config || {}
    }

    config = mergeConfig(this.defaults, config)

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase() as Method
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase() as Method
    } else {
      config.method = 'GET'
    }

    // filter out skipped interceptors
    var chain = [this.dispatchRequest, undefined]
    var promise: any = Promise.resolve(config)
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor: any) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor: any) {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  // _request(config: WXRequestConfig = {}): WXRequestPromise<any> {
  //   const { baseURL = '', url = '', headers, data = {} } = config
  //   console.log('wx.request raw config:', headers)
  //   const computedConfig = {
  //     ...(baseURL && {
  //       url: combineUrl(url, baseURL),
  //     }),
  //     header: {
  //       ...headers,
  //     },
  //     data,
  //   }
  //   console.log('wx.request computedConfig:', computedConfig)
  //   config = mergeConfig(config, computedConfig)
  //   console.log('wx.request config:', config)
  //   return wxRequest(config)
  // }

  dispatchRequest(config: WXRequestConfig = {}) {
    return wxRequest(config).then(
      function onAdapterResolution(response: any) {
        const _response = transformResponse(response, config)
        console.info('======================')
        console.log('wxAxios request transformResponse: ', _response)
        return _response
      },
      function onAdapterRejection(reason: any) {
        const _error = transformError(reason, config)
        console.info('======================')
        console.log('wxAxios request transformError: ', _error)
        return Promise.reject(_error)
      }
    )
  }
}

export default WxAxios
