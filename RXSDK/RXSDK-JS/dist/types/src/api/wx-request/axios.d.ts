/**
 * 基于wx.request封装的类axios请求
 * wx.request 的配置、axios的调用方式
 * @config 配置参数说明 --> ./defaults.js
 * @api axios(config) - 默认get
 */
import { WXRequestStatic } from './index';
declare let wxAxios: WXRequestStatic;
export default wxAxios;
