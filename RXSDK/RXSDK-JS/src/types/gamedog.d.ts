interface QueriesGameDog {
  /** 游戏的 appid */
  appid: string
  token: string
  channel: string
  timestamp: string
  sign: string
}

interface GameDogOrderParams extends IRequestPay {
  ext: {
    appid: string
    channel: string
    token: string
  }
}

interface GameDataPayParams {
  appid: string
  channel: number
  /** 单位元 */
  fee: number
  /** 订单号 */
  orderno: string
  subject: string
  sign: string
  token: string
  ext: string
}

interface GameDataRoleParams {
  /** 游戏appid  (必填, 参与加密) */
  appid: string
  /** token (必填, 参与加密) */
  token: string
  /** 角色名称 (必填, 参与加密) */
  role: string
  /** 角色id (必填, 参与加密) */
  roleid: string
  /** 角色等级 (必填, 参与加密) */
  grade: string
  /** 区服名称 (必填, 参与加密) */
  server: string
  /** 区服id (必填, 参与加密) */
  serverid: string
  /** 签名(必填, 不参与加密) */
  sign: string
  /** 砖石、金币数量  (必填, 不参与加密) */
  moneynum: string
  /** VIP等级  (必填, 不参与加密) */
  vip: string
  /** 战力值  (选填, 不参与加密) */
  power: string
  /** 透传参数 (选填, 不参与加密) */
  ext: string
}

declare class GameGD {
  constructor (data: { appid: string; token: string})
  pay (data: GameDataPayParams): void
  reportrole (data: GameDataRoleParams, callback: () => void): void
}
