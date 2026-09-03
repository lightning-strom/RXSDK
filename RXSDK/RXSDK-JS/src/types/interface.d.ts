declare module '*.txt'
declare module '*.html'
declare module '*.css'

type IPlatform = 'wegame' | 'h5'

/** 老结构 */
interface ISdkParams {
  /** 由我方提供的 ID */
  appId: string
  /** sdk 所需 api 地址 */
  httpApi: string
  /** 第三方渠道 APPID */
  channelAppId: string
  /** 游戏分享地址 */
  shareBaseUrl?: string
  productCode?: string
  productKey?: string
  /** 是否全屏 默往渠道 */
  isFullScreen?: boolean,
  /** 是否横屏 0：横屏 1：竖屏 默往渠道 */
  screenOrientation?: number,
  /** 0： 支付完成后游戏会重新加载 1：支付完成后会回到之前的游戏，游戏不会重新加载 */
  needRefresh?: number
  /** 游戏名称 */
  appName?: string
  /** 千禧游戏提供的分包id */
  appChannelId?: number
}

interface IIsPlatform {
  isWegame: boolean
  isH5: boolean
}

type AdTypes = 'rewarded' | 'banner' | 'interstitial'

/**
 * 角色登录/上报参数
 */
interface RoleLoginParams {
  /** 所在大区(服务器) */
  serverId?: number | string | '0'
  /** 所在大区(服务器)名称 */
  serverName?: string | ''
  /** ID */
  id: string | number
  /** 昵称 */
  nickname: string
   /** 性别 */
  sex?: 0 | 1,
  /** 是否新用户 */
  isNew?: 0 | 1
  /** 等级 */
  level: number
  /** 是否 VIP */
  isVip?: 0 | 1
  /** VIP 等级 */
  vipLevel?: number
  /** 游戏类型 */
  type?: string | '休闲'
  /** 综合能力, 如战斗力 */
  power?: string | number | 0
  /** 钻石, 金币数量 */
  money?: number
  /** 1=创建角色，2=登录角色 3=角色升级 */
  act?: number
  /** 创建角色时间 */
  createAt?: string
}
interface AntiAddictionCallbackData {
  isAdult: boolean
  todayDuration: number
  isRealName: boolean
}
