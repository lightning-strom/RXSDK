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
  /** 服务端与设备时间差（毫秒） */
  st_offset: string
}

export const SYSTEM_INFO: ISystemInfo = Object.assign({}, {
  type: 2,
  appid: '',
  developId: '',
  channelid: 'weile',
  deviceCode: 'channel-sdk-js',
  fromChannel: 'minigame',
  platformid: 0,
  channelAppId: '',
  reqUrlIndex: 0,
  publicKey: '',
  timezone: (new Date().getTimezoneOffset() / 60) * -1 || 8,
  __RX_SDK_VERSION: '__SDK_VERSION',
  SDK_INIT_FINISHED: false,
  errMsg: {
    default: ''
  },
  _baseUrlList: [],
  single_player_mode: false,
  need_active: false,
  logSwitch: true,
  login_config: {},
  region_tag: '',
  cp_role_id: '',
  isMatch: false,
  miniVersion: '',
  isWxAvailable: true,
  language: 'zh-CN',
  st_offset: ''
} as any)

export const USER_INFO: any = {} as any
