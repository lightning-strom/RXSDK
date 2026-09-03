interface Queries4399 {
  /** 账号 */
  account: string
  /** 游戏ID */
  gameId: string
  /** 昵称(encodeURIComponent) */
  nick: string
  /** 4399用户ID */
  userId: string
  /** 用户名(encodeURIComponent) */
  userName: string
  /** 过期时间戳 */
  time: string
  /** 签名串 */
  sign: string
  pc: string
  device: 'wap'
  addiction: string
  /** 分享透传参数 */
  extra?: string
}

interface PlayAdCallbackData {
  /**
   * 10000 开始播放
   * 10001 播放结束
   * 10010 广告异常
   */
  code: number
  message: string
}

interface CheckWordCallbackData {
  eventType: string
  data: {
    code: number
    words: { startPos: number; endPost: number; maskWord: string }[]
  }
}

interface API4399 {
  /**
   * 角色登录
   *
   * @param {int} server 服务器编号，默认为0
   * @param {int} roleId 角色id，默认为0
   * @param {int} isNew 是否当前新创建角色，否为0，是为1
   * @param {String} roleName 角色名，默认为''
   * @param {int} level 等级，默认为1
   * @param {int} isVip 是否是VIP，否为0，是为1
   */
  roleLogin: (server?: number, roleId?: number, isNew?: 0 | 1, roleName?: string, level?: number, isVip?: 0 | 1) => void
  logout: () => void
  /**
   * 玩家点击充值，打开支付
   *
   * @param {Int} money 充值金额（人民币：元） 只能为整数
   * @param {String} mark 游戏的充值订单编号 最多64位
   * @param {String} server 服务器编号 不能为空或者0
   * @param {String} extra 透传参数，用于充值成功后的服务端回调地址
   */
  openPay: (money: number, orderId: string, server: number, extra?: string) => void
  /**
   * 玩家点击分享按钮，不同端打开相应的分享界面
   *
   * @param {String} extra 透传参数，附带在被邀请者的登录地址；目前支持字母，数字，下滑线，中横线和逗号
   */
  shareGame: (extra: string) => void
  /**
   * 设置游戏分享内容
   *
   * @param {String} title 标题
   * @param {String} content 内容
   * @param {String} icon 图标
   * @param {String} extra 扩展参数
   * @param {String} urlId 地址编号
   */
    setShare: (title?: string, content?: string, icon?: string, extra?: string, urlId?: number) => void
  /**
   * 是否可以播放广告，CP在设计广告播放场景时需要先确认是否有权限播放广告（每日广告有播放次数限制）
   *
   * @param callback 回调函数
   */
  callPlayAd: (callback: (data: { canPlayAd: boolean; remain: number }) => void) => void
  /**
   * 播放广告
   *
   * @param callback 回调函数
   */
  playAd: (callback: (data: PlayAdCallbackData) => void) => void
  /**
   * 检测敏感词
   *
   * @param word 待检测词
   * @param callback 回调函数
   */
  checkWord: (word: string, callback: (data: CheckWordCallbackData) => void) => void
}

interface m4399Login {
  login_openid?: string, //二次登录的openid
  method: 'minigame_4399',
  ext?: {
    [key: string]: any
  }
}

type IpayFor4399 = Omit<IpayParmas, 'openid'>

interface m4399TrackForReq {
  type: 'track' //事件类型（目前默认为 track，SDK自动设置） 1
  time: string //事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff（SDK自动设置）1
  distinct_id: string //用户唯一标识，一般为 OpenID（由CP调用时传入）1
  devicecode: string //uuid sdk内部处理
  event: string //埋点标识（由CP调用时传入）
  uuid: string //本事件 uuid（SDK自动设置）1
  platform_id: 4 //平台ID（SDK自动设置）1
  cpid: number //CPID（SDK自动设置）1
  product_id?: string //应用ID（SDK自动设置）1
  channel_id?: string //渠道ID（SDK自动设置）1
  ip?:string //事件发生 IP，字符串类型 1
  sub_channel_id?: string //子渠道ID（SDK自动设置）
  properties?: { //CP 自定义属性（由CP调用时传入）
    [key: string]: any
  }
}
