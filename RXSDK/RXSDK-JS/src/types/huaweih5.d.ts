interface HuaweiH5Base {
  code: number
  data: string
}

interface HuaweiH5LoginParams {
  forceLogin: 0 | 1
  appid: string
}

interface HuaweiH5LoginResult {
  code: number
  data: string
  gameUserData: {
    /**
     * 玩家帐户ID。如果游戏不需要对华为帐号的登录结果进行鉴权
     * 那么当返回playerId的时候就可以使用该值进行游戏
     * */
    playerId: string
    /** 用户的昵称 */
    displayName: string
    /** 玩家等级 */
    playerLevel: number
    /** 时间戳，用于鉴权签名校验 */
    ts: string
    /** 鉴权签名 */
    gameAuthSign: string
    /** 高清头像链接，假如没有设置则为空字符串 */
    hiResImageUri: string
    /** 头像链接，假如没有设置则为空字符串 */
    imageUri: string
  }
}

interface HuaweiH5OrderInfo {
  /**
   * 商品金额，商品所要支付金额。此金额将会在支付时显示给用户确认
   * 1、请保留小数点后两位，如20.00。如果不按照格式传入金额，会导致支付失败。
   * 2、当金额位数大于3位，切勿使用 , 进行分隔，正确写法：1000.00，错误写法：1,000.00
   * */
  amount: string
  /** 应用ID，在华为开发者联盟上获取的APP ID */
  applicationID: string
  /**
   * 国家码，用于区分国家信息
   * 如US、CN、MY，符合ISO 3166标准
   * 如果不填写则默认为CN
   * */
  country:	string
  /**
   * 币种，用于支付的币种
   * 如USD、CNY、MYR等，符合ISO 4217
   * 如果不填写则默认为CNY
   * */
  currency?: string
  /**
   * 支付结果回调地址
   *  华为服务器收到后检查该应用有无在开发者联盟配置回调URL，如果配置了则使用应用配置的URL，否则使用此url作为该次支付的回调URL。
   *  注意：必须是合法的url，长度最大255，不能以‘\’结尾，不能包含get参数。支持多级域名，但域名中不能使用 _ 等特殊字符。
   *  正确：http://test.sdkapp.chuangyunet.com/Pay/path
   *  错误：http://test.sdk_app.chuangyunet.com/Pay/path?key=value
   * */
  url?: string

  /**	商品描述，商户对商品的自定义描述。该字段中不能包含特殊字符，包括# " & / ? $ ^ *:) \ < > , | % + */
  productDesc: string
  /**	商户对商品的自定义名称。此名称将会在支付时显示给用户确认。该字段中不能包含特殊字符，包括# " & / ? $ ^ *:) \ < > , | % + */
  productName: string
  /**
   * 商户侧保留信息。该字段中不能包含特殊字符，包括# " & / ? $ ^ *:) \ < > , | % +
   * 若该字段有值，在华为支付服务器回调接口中原样返回
   * */
  extReserved?: string
  /**
   * 商户订单号
   * 来源：开发者应用在支付前自定义生成，用于唯一标识一次支付请求
   * 支付平台在服务器回调接口中会原样返回requestId的值
   * 该字段可以由字母、数字或者字母与数字组合构成
   * 该字段必须在商户内唯一（ 即一个开发者帐号下所有游戏中保持唯一），用于唯一标识一个商户订单。
   * */
  requestId: string
  /**	商品类型。游戏请设置为X6。 */
  serviceCatalog: string
  /**
   * 商户ID
   * 来源：在华为开发者联盟上获取的“支付ID”
   * */
  merchantId: string
  /**
   * 商户名称
   * 来源：开发者注册的公司名
   * */
  merchantName?: string
  /**
   * 支付结果回调版本
   * 请CP关注，该值可以不传，如果传值则固定值传2，如果不传2会导致支付不成功
   * */
  urlver?: 2
  /** 渠道信息，快游戏请设置为3 */
  sdkChannel: 3
  /**
   * sign的生成请参见“sign生成原理”
   * 具体生成代码请参见“sign签名示例代码”。
   * 签名过程建议在服务端进行
   */
  sign: string
  /**	公钥，在华为开发者联盟上开通支付服务获取的“支付公钥”，获取方式参见“申请支付服务”。 */
  publicKey: string
}

interface HuaweiH5SubmitPlayerEventParams {
  /**
   * GAMEBEGIN：进入游戏
   * GAMEEND：退出游戏
   */
  eventType: 'GAMEBEGIN' | 'GAMEEND'
  /**
   * 当eventType为GAMEBEGIN时，eventId为开发者生成的随机数，应用内唯一，不超过64位
   * 当eventType为GAMEEND时，eventId为进入游戏时上报事件获取的transactionId
   */
  eventId: string
}

interface HuaweiH5PlayerExtraInfoResult {
  code: number
  /** 用户是否成年 */
  isAdult: boolean
  /** 玩家账户ID，不同华为帐号登录游戏成功后返回的玩家游戏账户ID */
  playerId: string
  /** 玩家当天游戏时长 */
  playerDuration: number
  /** 用户是否实名认证 */
  isRealName: boolean
}

interface APIHuaweiH5 {
  /**
   * 登录
   * @param {object} data
   * @param {number} data.forceLogin 玩家未登录华为帐号或鉴权失败时，是否拉起登录页面
   * @param {number} data.appid 在华为开发者联盟上创建快游戏后分配的唯一标识
   */
  gameLoginWithReal: (data: Stringified<HuaweiH5LoginParams>) => void

  /**
   * 获取登录结果
   * @param {object} data
   * @param {number} data.forceLogin 玩家未登录华为帐号或鉴权失败时，是否拉起登录页面
   * @param {number} data.appid 在华为开发者联盟上创建快游戏后分配的唯一标识
   */
  onGameLoginWithRealResult: (data: HuaweiH5LoginResult) => void

  /**
   * 获取登录结果
   * @param {object} data
   * @param {number} data.forceLogin 玩家未登录华为帐号或鉴权失败时，是否拉起登录页面
   * @param {number} data.appid 在华为开发者联盟上创建快游戏后分配的唯一标识
   */
  pay: (data: Stringified<{ orderInfo: HuaweiH5OrderInfo }>) => void
  onPayResult: (data: HuaweiH5Base) => void
  submitPlayerEvent: (data: Stringified<HuaweiH5SubmitPlayerEventParams>) => void
  onSubmitPlayerEventResult: (data: { code: number; transactionId: string }) => void
  getPlayerExtraInfo: (data: Stringified<{ transactionId: string }>) => void
  onGetPlayerExtraInfoResult: (result: HuaweiH5PlayerExtraInfoResult) => void
}
