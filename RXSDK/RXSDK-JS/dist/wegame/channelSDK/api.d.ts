/**
 * wechath5: 微信支付(苹果浏览器)
 * minigame: 米大师虚拟支付
 * qq: QQ 米大师虚拟支付
 * weile: 客户端
 * wxpub: 微信公众号/小游戏客服下单
 * jxzx: 小程序吉祥臻选支付
 * ios_minigame: 动态获取支付方式 wxpub / jxzx
 */
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
type TPayTypes = 'wechath5' | 'ios_minigame' | 'jxzx' | ChannelKeys
type SelfChannel = 'weile' | 'jixiang' | 'xinyue' | 'kele'
type TShareTypes = 'ad' | 'share'
/** 分享素材类型
 * url：分享链接
 * image：分享图片
 * card：小卡片
 * a2m：app分享至小游戏
 * text：分享文本
 */
type TShareMaterial = 'url' | 'image' | 'card' | 'a2m' | 'text'

interface Ext<T> {
  ext: T
}

interface ITrackProperties {
  /** 预置属性：服务端与设备时间差（毫秒） */
  st_offset?: string
  [key: string]: any
}

interface ISdkInitParams {
  cloud?: any
  cloudAppId?: number
  env?: 'test' | 'online'
  // 产品 id
  productId: string
  // 渠道id
  channelId: string
  // 客户端id
  cpid: string
  // 请求域名队列
  baseUrlList: string[]
  // 游戏实现类型 cocos ｜ unity
  gameImplType?: string
  short_domain?: string
  // HttpDNS 服务商 Id
  httpDNSServiceId?: string
  timeout?: number
  //是否支持支付广点通上报
  isSupportGDTReport?: boolean
  // 回调函数
  complete: (data: any) => void
}

interface IMethodParams<T = any> {
  complete: (data: T) => void
  paySuccCallback?: () => void
}

/** Request **/
interface IRequestLogin {
  /** 微信授权码 - 与 openid 互斥 */
  code?: string
  /** 微乐 openid */
  openid?: string
  ext?: {
    encryptedData: string
    iv: string
  } & any
  type: string
}
interface IRequestLoginWx extends IRequestLogin {
  /** 版本 - 为空则默认为nomal登录
   * base:基础版本
   * nomal:普通版本 - 仅针对小游戏, 用于首次登录，需要在 ext 中加 encryptedData & iv，
   */
  version?: 'base' | 'normal'
}
interface IRequestLoginThirdpart extends IRequestLogin {
  type: ThridPartChannel
}

interface IRequestLoginH5 extends Partial<IRequestLoginWx> { }

type RequestLoginParams = IRequestLogin | IRequestLoginWx

interface IRequestPay {
  /** 在平台注册的商品tag */
  goodsTag: string
  /** 商品名称, 显示在支付界面 */
  goodsName: string
  /** 游戏订单号 */
  tradeNo: string
  /** 金额/分 */
  amount: number
  /*是否使用钻石支付*/
  isUseDiamond?: boolean
  /**keleAppkey 用于拉起kele商城 */
  keleAppkey?: string
  is_debug?: 0 | 1
  /** 跳转到支付小程序需要使用的版本 */
  envVersion?: 'develop' | 'trial' | 'release'
  /** 米大师支付的环境: 0-米大师正式环境 1-米大师沙箱环境*/
  env?: 0 | 1
  /** 透传参数 */
  transmitArgs?: any
  ext?: {
    [key: string]: any
    /** 支付方式 0: 钻石 1: 人民币 */
    'ext.feeType'?: 0 | 1
    /** 当前渠道支持的支付方式：0-钻石支付、1-微信支付、2-支付宝支付，3-iap支付，4-微信公众号支付 */
    'ext.payChannel'?: 0 | 1 | 2 | 3 | 4
    /** 支付等级  与策划定义的IOS小程序支付不同等级走不同的小程序支付 */
    order_level?: string | number
  }
  type?: TPayTypes
  /** 游戏方向 0=竖屏，1=横屏 */
  land?: string
  /** 单位 */
  currency?: string
  /** 是否自动调用兑换钻石方法(weile) */
  autoExchange?: boolean
  /** 分区 */
  zoneId?: string
}

interface IRequestPayQQ extends IRequestPay {
  ext: IRequestPay['ext'] & {
    // 游戏服务器大区 ID
    zone_id: string
  }
}

interface IRequestPayMeituan extends IRequestPay {
  /** 商品描述 */
  goodsDesc?: string
  /** 商品图片链接 */
  goodsUrl?: string
}

type PayParams =
  | IRequestPay
  | IRequestPayQQ
  | ShandwOrderParams
  | X7SYOrderParams
  | PayOrder1N
  | GameDogOrderParams
  | IRequestPayMeituan

interface IRequestShareAdData {
  /** 是否强制类型, ad/share, 为空则各50%几率 */
  forcetype?: TShareTypes
  /** 埋点名称，后台约定 */
  func: string
  /** 透传参数, 原样返回 */
  transmitargs?: string
  /** 自定义参数，用于后台处理的数据 */
  custom?: string
  fromChannel?: string
  imageUrl?: string
  title?: string
}

interface IRequestShareData extends IRequestShareAdData {
  /** 1:朋友圈;
   ** 2:群消息
   ** 8:指定好友
   *  微信小游戏仅支持 2 / 8
   **/
  forcemethod?: 1 | 2 | 8
  /** 查询字符串, 必须是 key1=val1&key2=val2 的格式。 */
  query?: string
}

interface IRequestAd {
  /**
   * 是否仅检测能否拉取广告, 而不显示
   * (例如检测用户是否[无合适的广告])
   * 后续可用 sdk.hasAd() 来判断是否有广告
   * sdk.hasAd 为 false 也可尝试拉起广告
   */
  isCheck?: boolean
}

interface IRequestAdData extends IRequestAd {
  adUnitId?: string
  func?: string
  custom_ext?: any
  destroyAd?: boolean
  multiton?: boolean
}

interface IRequestBannerAd extends WechatMinigame.CreateBannerAdOption, IRequestAd { }

interface IRequestInterstitialAd extends WechatMinigame.CreateInterstitialAdOption, IRequestAd { }

interface IRequestShareReport {
  func: string
  /** 看广告不做校验 */
  uuid?: string
  result: 'ok' | 'fail' | 'noad' | 'closead'
  type: TShareTypes
  /** type === share 必须 */
  method?: number
  material?: TShareMaterial
  materialid?: number
  transmitargs?: string
  custom?: string
}

interface IReqShareScheduleInit {
  funcs?: string[]
  type?: string
  open_id?: string
}

interface IReqShareScheduleReport {
  product_id?: string
  channel_id?: string
  // 埋点
  func: string
  // 平台 目前只有 wechat qq
  platform?: string
  // 客户端：app， 小游戏：mini
  type?: string
  // 瑞雪openid
  open_id?: string
  sub_channel_id?: string
  region?: string
  transmits?: string
  // share 分享 ad 广告
  scheduling_type: string
  scheduling_event: boolean
  // scheduling_strategy_id: string
  properties?: object
}

interface IRequestBindPhone {
  phone: string
  password: string
  captchaToken: string
  captchaCode: string
  ext?: any
}

/** Response **/
interface IResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

interface ISdkInitConfigData {
  [key: string]: any
  cp?: {
    of?: boolean
    [key: string]: any
  }
  server?: {
    /** 服务器时间戳（毫秒） */
    time: string
    [key: string]: any
  }
}

interface IResponseSdkInitConfig extends IResponse<ISdkInitConfigData> {}

interface IResponseLogin extends IResponse {
  tid: string
  token: string
  openid: string
  username: string
  nickname: string
  avatarUrl: string
  /** 0:女; 1:男 **/
  sex: 0 | 1
  timestamp: number
  ext?: {
    channel_userid?: string
  } & any
  regtime: string
  /** 三方平台的唯一标识 */
  wxOpenid?: string
  uid?: number
  source_openid: string // 分享来源第一个用户
  source: string // share-[openid]--[level]， eg: share-wx12345--5
}

interface IResponseLoginWx extends IResponseLogin {
  ext?: {
    [key: string]: any
    switchIgf: boolean
    switchIgfLevel: number
  }
}

type ResponseLoginParams = IResponseLogin | IResponseLoginWx

interface IResponsePayBase extends IResponse {
  orderNo: string
  amount: number
  pay_type: TPayTypes
}

interface IResponsePay extends IResponsePayBase {
  notifyUrl: string
  balance: number
  productDesc: string
  productName: string
  offerId: string
  ext: any
  payUrl?: any
}

interface IResponsePayQQ extends IResponsePayBase {
  pay_type: 'qq'
  prepayId: string
}

interface IResponsePayMinigameFriend extends IResponsePayBase {
  miniorder: any
}

interface IResponsePayType extends IResponsePayBase {
  pay_type: 'jxzx' | 'wxpub' | 'wechath5'
  app_id: string
  payUrl?: string
  wxappid?: any
  miniorder?: any
}

type PayResponse =
  | IResponsePay
  | IResponsePayType
  | IResponsePayQQ
  | Ext<ShandwPayParams>
  | Ext<HuaweiH5OrderInfo>
  | Ext<Is7k7kOrderInfo>
  | Ext<X7SYPayParams['pay_obj']>
  | Ext<PayParams1N>
  | Ext<GameDataPayParams>
  | IResponsePayMinigameFriend

interface IResponseShareData extends IResponse {
  /** 任务串号 */
  uuid: string
  /** 是否需要上报 */
  needreport: boolean
  /** 是否强制成功后用户才能操作 */
  syncreport: boolean
  type: TShareTypes
  func: string
  transmitargs: string
  // 以下 type === share 返回
  /** 系统分享 */
  is_system_share?: boolean
  /** 允许的分享方式
   * 1:朋友圈; 2:群消息
   * 该字段实为二进制开关形式(uint8类型),
   * 当值为3时（即：位运算 1|2 所得）
   * 表示可以让用户从朋友圈和群消息
   * 两者中选择分享方式
   **/
  method: number
  material?: TShareMaterial
  /** 素材ID 或 广告商ID */
  materialid?: number
  wxid?: string
  domain?: string
  url?: string
  title?: string
  content?: string
  /** a2m 使用 */
  gh_id?: string
  /** 素材图标/图片 */
  image?: string
  /** 当日该埋点使用次数 */
  use_limit?: number
  /** 当日该埋点失败次数 */
  fail_val?: number
  /** 未成功拉新的分享次数 */
  not_fission_count?: number
}

interface IResponseShareReport extends IResponse {
  transmitargs: string
  /** 埋点剩余使用次数(判断是否显示分享按钮等逻辑) */
  remain_val: number
  /** 控制类广告埋点每日可看广告总数 0 代表不限制 */
  ad_days_limit: number
  /** 控制类分享埋点每日可分享总数 0 代表不限制 */
  share_days_limit: number
  /** 控制类广告埋点用户当天已看广告数 */
  use_controller_ad: number
  /** 控制类分享埋点用户当天已分享数 */
  use_controller_share: number
}

interface IResponseCheckAuth extends IResponse {
  data?: {
    /**
     * 0: 授权且关注
     * 6000011 小游戏未授权
     * 6000012 已关注未授权
     * 6000013 未关注
     */
    code: 0 | 6000011 | 6000012 | 6000013
    wxopenid: string
  }
}

interface IResponseSendCaptcha extends IResponse {
  captchaCode: string
  captchaToken: string
  interval: string
  surplus: string
}

interface ConversationParams {
  sessionFrom: string //	会话来源 腾讯测需要
  params: string //透传参数
  func?: string //埋点名称（主要获得标题和图片）
  desc?: string //模态弹窗的描述
  title?: string //如果不传递func 的话,cp方自定义标题
  image?: string //如果不传递func 的话,cp方自定义图片
  reconfirm?: boolean //如果模态框被关闭是否再次弹起提醒用户跳转客服
  path?: string
}

interface ShareLimitParams {
  /** 埋点列表 */
  func_tags: string[]
}

interface IResponseShareLimit extends IResponseShareReport {
  /** 埋点使用次数 */
  funcs?: Record<
    string,
    {
      /** 埋点每日限制次数 0: 不限制; -1: 未配置 */
      daily_limit: number
      /** 埋点当日分享/广告成功使用次数 */
      use_func: number
    }
  >
}

// 文字检测
interface IRequestMsgSecurity {
  /** 游戏APPID */
  appid: string
  /** 平台 */
  check_channel: 'weile' | 'minigame'
  /** 需要检测的词 */
  check_words: string
}

interface IResponseMsgSecurity extends IResponse {
  /** 检测出的第一个敏感词 */
  first_sensitive?: string
}

// 授权响应数据
interface IResponseAuthorize {
  openid: string
  nickname: string
  sex: number
  /** 用户头像 */
  avatarurl: string
  userid: number
}

// 授权请求数据
interface IRequestAuthorize {
  nickname: string
  sex: number
  /** 用户头像 */
  avatarurl: string
}

// ------ V2 ------
interface ShareData {
  share_limit: {
    // 埋点次数信息
    funcs_num: number // 该埋点该用户累计拉取数据总次数
    funcs_sn: number // 该埋点该用户累计成功总次数(正常分享)
    funcs_fn: number // 该埋点该用户累计失败总次数(正常分享)
    funcs_stf_sn: number // 埋点指定好友成功次数(指定分享)
    funcs_stf_fn: number // 埋点指定好友失败次数(指定分享) ->取消分享看有上报就记录
    funcs_ad_sn: number // 埋点广告成功次数
    funcs_ad_fn: number // 埋点广告失败次数
    funcs_day_num: number // 该埋点该用户当天累计拉取数据总次数
    funcs_day_sn: number // 该埋点该用户当天累计成功总次数(正常分享)
    funcs_day_fn: number // 该埋点该用户当天累计失败次数(正常分享)
    funcs_stf_day_sn: number // 埋点该用户当天指定好友成功次数(指定分享)
    funcs_stf_day_fn: number // 埋点该用户当天指定好友失败次数(指定分享) ->取消分享看有上报就记录
    funcs_ad_day_sn: number // 埋点该用户当天广告成功次数
    funcs_ad_day_fn: number // 埋点该用户当天广告失败次数

    share_day_num: number // 该用户所有埋点当天总拉取分享次数
    share_day_sn: number // 该用户所有埋点当天总分享成功次数(正常分享)
    share_day_fn: number // 该用户所有埋点当天总分享失败次数(正常分享)
    stf_day_sn: number // 该用户当天指定分享好友成功总次数(指定分享)
    stf_day_fn: number // 该用户当天指定分享好友失败总次数(指定分享) ->取消分享看有上报就记录
    ad_day_sn: number // 用户当天看广告成功次数
    ad_day_fn: number // 用户当天看广告失败次数(关闭广告或者其他错误)

    share_num: number // 该用户所有埋点总拉取分享次数
    share_sn: number // 该用户所有埋点总分享成功次数(正常分享)
    share_fn: number // 该用户所有埋点总分享失败次数(正常分享)
    stf_sn: number // 该用户总的指定分享好友成功总次数(指定分享)
    stf_fn: number // 该用户总的指定分享好友失败总次数->取消分享看有上报就记录
    ad_sn: number // 该用户总的看广告成功次数
    ad_fn: number // 该用户总的看广告失败次数
    fission_num: number // 用户总共拉新人数
  }
  funcs: {
    // 埋点信息
    id: number
    appid: string
    funcTag: string // 埋点标识
    funcTitle: string //  埋点标题
    shareType: 1 | 2 | 3 // 埋点配置的分享类型 1 正常 2定向 3 调度
    active: 1 | 2 // 是否活动埋点 1 活动 2 非活动
    rejectMsg: string // 拒绝信息
    status: number
    ctime: string
  }
  share_content: {
    // 埋点内容
    title: string //  内容标题
    url: string // 内容标题URL
    wxid: string // 内容WXID
    domain: string // 内容域名
    material: TShareMaterial // 分享素材类型，url：分享链接，image：分享图片，card：小卡片，a2m：app分享至小游戏，text：分享文本
    materialid: number // 分享素材ID，上报原样返回
    image: string // 素材图标或图片地址
    content: string //
    gh_id: string // material a2m使用
    active: 1 | 2 //  1 活动 2 非活动
  }
  transmitargs: string // 透传参数，原样返回
  custom: string // 自定义参数，URLENCODE
  share_type: 'normal' | 'stf' // 分享方式 达到指定分享后有值 (normal:正常分享->游戏自己决定哪一种分享方式 stf: 指定好友分享)
}

interface ShareReportParams extends Omit<IRequestShareReport, 'uuid'> {
  fromChannel: string // 来源渠道
  adPlatform?: string // 广告平台
}

interface ShareLimitData {
  limit: Record<
    string,
    ShareData['share_limit'] & {
      lt: number
      v: number
      fail_val: number
    }
  > // 所有埋点总次数 当天次数
  funcs: ShareLimitData['limit'] // 各个埋点次数
}

interface ShareDataParams extends IRequestShareAdData {
  /** 1:朋友圈;
   ** 2:群消息
   ** 8:指定好友
   *  微信小游戏仅支持 2 / 8
   **/
  method?: 1 | 2 | 8
  /** 查询字符串, 必须是 key1=val1&key2=val2 的格式。 */
  query?: string
}
interface ImsgSecCheckParmas {
  scene: 1 | 2 | 3 | 4 //场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
  content: string //需检测的文本内容，文本字数的上限为2500字，
  nickname?: string //用户昵称，
  title?: string //文本标题，
  signature?: string //个性签名，该参数仅在资料类场景有效(scene=1)，
}
interface imsgSecCheckRes {
  errcode: number //错误码
  errmsg: string //错误信息
  trace_id: string //唯一请求标识，标记单次请求
  result: checkResult //综合结果
  detail: checkmsgDetail[] //详细检测结果
}
interface checkResult {
  label: string //命中标签枚举值，100 正常；10001 广告；20001 时政；20002 色情；20003 辱骂；20006 违法犯罪；20008 欺诈；20012 低俗；20013 版权；21000 其他
  suggest: string //有risky、pass、review三种值
}
interface checkmsgDetail extends checkResult {
  strategy: string //策略类型
  errcode: number //错误码，仅当该值为0时，该项结果有效
  prob: number //0-100，代表置信度，越高代表越有可能属于当前返回的标签（label）
  keyword: string //命中的自定义关键词
}
interface ImediaSecCheckParams {
  scene: 1 | 2 | 3 | 4 //场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
  media_type: 1 | 2 //1:音频;2:图片
  media_url: string //	要检测的图片或音频的url，支持图片格式包括jpg, jepg, png, bmp, gif（取首帧），支持的音频格式包括mp3, aac, ac3, wma, flac, vorbis, opus, wav
}
interface IgetKeleConfigRes {
  callbackId: string
  isRMBPayEnable: number
  payChannelFromCmd: 0 | 1 | 2 | 3 | 4
  payChannels: number[]
}

// 上报经纬度
interface IReportLocation {
  types: string[] //分组名称列表，由 CP 自定义
  reportSpace: number //上报的时间间隔
}

// 删除经纬度坐标
type IReqDelReportLocation = Pick<IReportLocation, 'types'>

// 获取半径内用户
interface IReqNearlyPeason {
  radius: number //限定半径距离，单位：米
  count: number //获取数量，0表示获取全部
  page: number //获取第几页的数据 从1开始
  page_size: number //每页数量
  type: string //坐标分组，由 CP 自定义
  lon?: number //WGS84 经度
  lat?: number //WGS84 纬度
}

// 脚本类型
type ScriptType = 'js' | 'lua' | 'u3d'
// 输出文件后缀
type OutputFileSuffix = 'json' | 'lua'

interface CheckVersionParams {
  type?: ScriptType
  format?: OutputFileSuffix
}

interface ICheckAppVersion extends CheckVersionParams {
  // 客户端版本号， 3段或4段
  clientversion: string
  // 客户端设备码 没有传唯一值，缓存使用
  devicecode?: string
  // 地区码， 默认0
  region?: number
}

interface ICheckVersion extends ICheckAppVersion {
  // key客户端游戏id value版本
  games?: object
  // key客户端活动别名 value版本
  activities?: object
}

interface ICheckGameVersion extends CheckVersionParams {
  // 游戏id
  gameid: number
  // 客户端版本号
  gameversion: number
  // 优先检查这个版本，没用再返回最新版本
  gamecheckversion?: number
}
interface ICheckActivityVersion extends CheckVersionParams {
  // 活动别名
  activityshortname: string
  // 客户端版本号
  activityversion: number
  // 优先检查这个版本，没用再返回最新版本
  activitycheckversion?: number
}

interface IReqBusinessData {
  // 窗口key
  window_key: string
  // 事件
  event: string
  // 前置事件，可传空
  before_event?: string
}

interface IReqBusinessOrder {
  // CP方订单号
  trade_no: string
  // 窗口签名
  sign: string
}

interface IReqCreateFeedback {
  product_id?: string
  channel_id?: string
  game_id: number
  kind_id: number
  kind_name: string
  // 紧急程度 1:紧急 2:不紧急
  priority: 1 | 2
  content: string
  picture: string
  player_gameid: string
  // 作废是否发邮件 1:发 2:不发
  send_voided_mails: 1 | 2
}

interface IReqFeedbackEval {
  key_number: number
  pleased_status: number
  reason: string
}

interface FriendInteractionStorage {
  keyList: string[]
}

interface GameClubDataParams {
  dataTypeList: [
    {
      type: number
      subKey?: string
    }
  ]
}
/**
 * value的内容必须是JSON Object格式序列化的字符串，该JSON Object顶层必须包含 wxgame 字段
 * score
 * update_time
 */
interface KVData {
  key: string
  value: string
}

interface ModifyFriendInteractionStorage {
  // 需要修改的数据的 key，目前可以为 '1' - '50'
  key: string
  // 需要修改的数值，目前只能为 1
  opNum?: number
  operation?: string
  // 目标好友的 openId
  toUser?: string
  title?: string
  imageUrl?: string
  imageUrlId?: string
  quiet?: boolean
}

interface HelpcenterQuestionReq {
  // 问题编号
  id: number
}

interface HelpcenterResolution {
  // 问题编号
  id: number
  // 解决状态 true 已解决 false 未解决
  status: boolean
}

interface trackParams {
  event: string //埋点标识（由CP调用时传入）
  type?: string //上报类型，必须在dataTrackType中，默认为track
  flushInterval?: number //上报间隔（秒），正整数，最小值1秒，默认60秒
  maxCacheCount?: number //缓存数据上限，正整数，最小100，最大1000，默认100
  properties?: ITrackProperties
}
