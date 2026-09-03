/**
 * 基于wx.request封装的类axios请求
 * wx.request 的配置、axios的调用方式
 * @config 配置参数说明 --> ./defaults.js
 * @api axios(config) - 默认get
 */

import { WXRequestConfig, WXRequestInstance, WXRequestStatic } from './index'
import WxAxios from './axios.wx'
import { bind, extend } from './utils'

function createInstance(defaultConfig?: WXRequestConfig): WXRequestInstance {
  console.log('createWxRequestInstance')
  const context = new WxAxios(defaultConfig)
  const instance = bind(WxAxios.prototype.request, context) as any
  // Copy axios.prototype to instance
  extend(instance, WxAxios.prototype, context)

  // Copy context to instance
  extend(instance, context)
  return instance
}

let wxAxios = new WxAxios() as unknown as WXRequestStatic

wxAxios.create = function create(instanceConfig: WXRequestConfig): WXRequestInstance {
  return createInstance({ ...wxAxios.defaults, ...instanceConfig })
}

export default wxAxios
