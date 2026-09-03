interface QueriesShandw {
  /** 用户唯一id */
  uid: string
    /** 渠道id */
  channel: string
    /** 玩家的openid，第三方授权获得，如微信，没有为空。 */
  openid: string
  /** 游戏的id */
  appid: string
    /** 玩家昵称（URLENcoder（所有涉及这个的都是UTF-8）转码过的） */
  nick: string
    /** 玩家头像链接地址（URLENcoder转码过的） */
  avatar: string
  /** 男：1 女：2，其他未知 */
  sex: string
  /** 当前时间，服务器时间戳（10位） */
  time: string
  /** 如果验证失败，跳转地址（URLENcoder转码过的） */
  reurl: string
  /** 充值成功或者失败，跳转地址（URLENcoder转码过的） */
  cburl: string
  /** 如果支付成功重新加载会带上这个参数
   * （参数内容是支付订单相关信息
   * 参数值EncodeURIComponent过的）
   * */
  paydata: string
  /** 签名信息生成规则
   * MD5("channel=" + channel + "&appid=" + appid + "&time=" + time + "&uid=" + uid + key)
   * key是口袋分配的key
   * 运算结果MD5值是小写的字符串 */
  sign: string
  sdw_test: 'true' | 'false'
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

interface ShandwPayCallbackRes {
  /** 游戏ID */
  appId: string
  /** 渠道ID */
  channel: string
  /** 游戏玩家ID */
  accountId: string
  /** 时间戳（单位：秒） */
  timestamp: number
  /** 支付金额（单位：分） */
  amount: number
  /** 游戏请求支付的订单号 */
  cpOrderId: string
}

interface ShandwPayParams {
  /** 商品描述 */
  subject: string
  /** 游戏ID */
  appId: string
  /** 游戏名称 */
  gameName: string
  /** 游戏账号uid */
  accountId: string
  /** 支付费用（单位：分） */
  amount: number
  /** 游戏自己生成的预订单号（唯一仅字母|数字组合，不超过50位） */
  cpOrderId: string
  /** 支付方式，默认为""，"alipay":调取支付宝支付，"weixin":调取微信支付 */
  paychannel?: 'alipay' | 'weixin'
  /** 支付成功跳转页面
   * (提别提醒：请传入登录时携带的cburl客户端同步跳转，用于处理相关业务，
   * 不推荐做实际支付成功后的添加逻辑，可用于页面相关状态刷新等) */
  call_back_url: string
  /** 操作中断跳转地址
   * (提别提醒：请传入登录时携带的cburl需http://格式的完整路径，
   * 不允许加?id=123这类自定义参数，应用于支付宝充值时中断跳转) */
  merchant_url: string
  /** 签名信息，校验值 */
  sign: string
  /** 时间戳，仅允许1小时内的支付请求，精确到秒 */
  timestamp: string
  /** 渠道ID */
  channel: string
  /** 非微信APP环境为""，微信环境调起支付必填 */
  wxopenid: string
  /** 需要调用者自身根据账单去查询是否完成了支付 */
  complete: (data: ShandwPayCallbackRes) => void
}

interface ShandwOrderParams extends IRequestPay {
  ext: {
    accountId: string
    wxopenid: string
    call_back_url: string
    merchant_url: string
    channel: string
  },
}

interface ShandwShareParams {
  /** 分享的标题 */
  title: string
  /** 分享的内容 */
  desc: string
  /** 分享的链接，填写游戏地址 */
  link: string
  /** 分享小图，默认取网页第一张 */
  imgUrl: string
  /** 接口调用成功后的回调 */
  success?: () => void
  /** 接口调用失败后的回调 */
  fail?: () => void
  /** 接口取消后的回调 */
  cancel?: () => void
}

interface ShandwRoleLoginParams {
  /** 用户闪电玩平台id */
  uid: string
  /** 游戏id，闪电玩分配的游戏id */
  appid: string
  /** 闪电玩平台传递过去的channel */
  channel: number
  /** 玩家在游戏大区中游戏的id（没有的话就填uid） */
  id?: string
  /** 玩家游戏中的昵称 */
  nick: string
  /** 玩家所在游戏大区id（如果游戏没有分大区，使用0） */
  sid: string
  /** 游戏大区名称 */
  sname?: string
  /** 用户等级（没有为0） */
  level: number
  /** 游戏类型 */
  type: string
  /** 用户vip等级（没有为0） */
  vip: number
  /** 玩家综合能力，如战斗力（没有为0） */
  power: number
  /** 是否创角（0|1） */
  new: 0 | 1
}

interface APIShandw {
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
  postGameInfo: (data: ShandwRoleLoginParams) => void
  chooseSDWPay: (params: ShandwPayParams) => void
  closeSDWPay: () => void
  onSetShareOperate: (data: ShandwShareParams) => void
  onShowShareLayer: () => void
}
