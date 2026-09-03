export const customGetStorageSync = (key: string) => {
  const str: any = localStorage.getItem(key)
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

export const customSetStorageSync = (key: string, value: any) => {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}

type ThridPartChannel =
  | 'qq'
  | '4399'
  | 'shandw'
  | 'huaweih5'
  | 'iqiyi'
  | '7k7k'
  | 'x7sy'
  | '1n'
  | 'gamedog'
  | 'qunhei'
  | 'qtoutiao'
  | 'xingjie'
  | 'moston'
  | 'yilewan'
  | 'qitianledi'
  | 'woling'
  | 'qqminigame'
  | '7724'
  | 'wxpublic'
  | 'meituan'
  | 'qianxi'

type ChannelKeys =
  | 'weile'
  | 'wxpub'
  | 'minigame'
  | 'minigame_friend'
  | 'jixiang'
  | 'xinyue'
  | 'kele'
  | 'lingjing'
  | ThridPartChannel

export interface ISystemInfo {
  [key: string]: any

  /** 登录类型 - 1:app; 2:小游戏; 3:公众号） */
  type: 1 | 2 | 3
  /** 平台标识 - 0:未知; 1:Android; 2:IOS */
  platformid: 0 | 1 | 2
  appid: string
  /** 游戏名称 */
  appName?: string
  channelid: string
  deviceCode: string
  /** 来源
   * weile: 微信/APP
   * wxpub: 公众号
   * minigame: 小游戏
   * qq: QQ
   * */
  fromChannel?: ChannelKeys
  /** 第三方渠道 APP ID */
  channelAppId: string
  productCode?: string
  productKey?: string
  /** 千禧游戏提供的分包id */
  appChannelId?: number
}

export const SYSTEM_INFO: ISystemInfo = Object.assign({}, {
  type: 2,
  appid: '',
  channelid: 'weile',
  deviceCode: 'channel-sdk-js',
  fromChannel: 'minigame',
  platformid: 0,
  channelAppId: '',
  reqUrlIndex: 0,
  publicKey: '',
  timezone: (new Date().getTimezoneOffset() / 60) * -1 || 8,
  __RX_SDK_VERSION: '__SDK_VERSION',
  SDK_INIT_FINISHED: false
} as any)


export function getHeight(element:any) {
  var style = window.getComputedStyle(element)
  var height = style.height
  var padding = style.paddingBottom + style.paddingTop
  var border = style.borderBottomWidth + style.borderTopWidth
  var margin = style.marginBottom + style.marginTop

  return parseFloat(height) + parseFloat(padding) + parseFloat(border) + parseFloat(margin)
}