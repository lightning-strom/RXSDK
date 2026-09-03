declare namespace QQMinigame {
  interface RequestMidasPaymentOption {
    prepayId: string
    starCurrency: number
    setEnv?: 0 | 1
    success?: WechatMinigame.RequestMidasPaymentSuccessCallback
    fail?: WechatMinigame.RequestMidasPaymentFailCallback
    complete?: WechatMinigame.RequestMidasPaymentCompleteCallback
  }

  interface ShareAppMessageOption {
    title?: string
    imageUrl?: string
    query?: string
    shareAppType?: string
    entryDataHash?: string
    complete?: (result: WechatMinigame.GeneralCallbackResult) => void
    fail?: (result: WechatMinigame.GeneralCallbackResult) => void
    success?: (result: WechatMinigame.GeneralCallbackResult) => void
  }

  interface qq extends Omit<WechatMinigame.Wx, 'requestMidasPayment'> {
    requestMidasPayment<TOption extends RequestMidasPaymentOption>(
      option: TOption
    ): WechatMinigame.PromisifySuccessResult<TOption, RequestMidasPaymentOption>

    shareAppMessage(option: ShareAppMessageOption): void
  }
}

declare const qq: QQMinigame.qq

interface IUserInfoButtonOption {
  // 用户信息授权按钮
  button?: WechatMinigame.CreateUserInfoButtonOption
  // 同意授权后是否自动销毁用户信息授权按钮
  autoClose?: boolean
  // 检查用户是否授权过用户信息，开启则直接返回用户信息，不展示用户信息授权按钮
  isCheck?: boolean
}
interface ILoginQQ extends IUserInfoButtonOption {
  version: 'base' | 'normal' // 是否需要拉起授权
  method: 'mobileqq' // 是否是虚拟登录
  sign_fields?: string[] // 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关.
  login_openid?: string // 二次登录的openid
  reconnect_login?: boolean // 是否是登录重连
  cancel_business_queue?: boolean // 支持取消商业化请求队列
}

interface ISyncUserInfo extends IUserInfoButtonOption {
  version?: 'base' | 'normal' // 是否需要拉起授权
  lang?: 'en' | 'zh_CN' | 'zh_TW' // 描述用户信息的语言
}

interface IGetShareData {
  func: string // 分享的埋点
  transmits?: string // 透传的参数
  imageUrl?: string // 分享的图片url
  title?: string // 分享的标题
  query?: string // 分享的页面路径的参数
  region?: string // 地区码，没有则不传，会取全国地区的数据
  readCache?: boolean // 是否读取缓存，默认读取
  // 转发目标类型， 不设该属性默认拉起手q通讯录
  shareAppType?:
    | 'qq'
    | 'qqFastShare'
    | 'qqFastShareList'
    | 'qzone'
    | 'wechatFriends'
    | 'wechatMoment'
}

interface IPayParmas {
  /** 支付的类型
   * qq_minigame: QQ小游戏米大师支付
   * wxpub: 为ios跳转客服公众号支付
   */
  pay_type: 'qq_minigame'
  /** 在平台注册的商品标识 */
  goods_tag: string
  /** CP订单号 */
  trade_no: string
  /** 是否进行防沉迷支付验证
   * 0: 不进行
   * 1: 进行
   */
  indulge_auth: 0 | 1
  /** 在平台注册的埋点名称 当wxpub时 func必传 */
  func?: string
  /** 币种 默认传: CNY */
  currency?: 'CNY'
  /** 瑞雪OPENID */
  openid?: string
  /** 客户端透传参数 */
  transmit_args?: string // 客户端透传参数
  /** 是否测试订单，默认0 正式  1为测试订单
   * 0: 正式
   * 1: 为测试订单
   */
  is_debug?: 0 | 1
  /** 是否使用沙盒环境支付
   * 0: 正式
   * 1: 沙盒
   */
  env?: 0 | 1 //是否使用沙盒环境支付 0 正式 1 沙盒
  /** 用户年龄,indulge_auth为1时必传该字段 */
  age?: number
  /** 支付成功后的回调是否是客户端发起 客户端发起传: 1， qq小游戏不需要所以传0*/
  callback_from?: 0 | 1
  notify_url?: string //支付成功通知CP发货地址\
  noreply?: boolean //用于隐藏客服列表 wxpub时生效
  ext: {
    //扩展字段
    [key: string]: any
  }
  /** 分区 默认是1 */
  zoneId?: string
  /** 用于打开客服透传的url参数 必须以&开头 */
  querystr?: string
}

interface IPayQQ extends IPayParmas {
  ext: IRequestPay['ext'] & {
    // qq小游戏openid
    qq_openid: string
  }
}
