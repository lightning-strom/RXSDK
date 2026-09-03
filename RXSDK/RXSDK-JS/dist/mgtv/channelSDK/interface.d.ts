interface InitRpkParams {
  // 产品 id
  productId: string
  // 渠道id
  channelId: string
  // 客户端id
  cpid: string
  // 请求域名队列
  baseUrlList: string[]
  // 回调函数
  complete: (data: any) => void
  // 游戏id
  gameId?: string | number
  // 是否是比赛模式
  isMatch?: boolean
}

interface RpkDouyinOpenCustomServiceParams {
  type: 1 | 2 | 3 //1 ：小 6 客服 2 :  抖音IM 客服（仅支持抖音）,
  sessionFrom: string //保留字段，暂时可以不填
}

interface TTButtonStyles {
  left: number //左上角横坐标
  top: number
  width: number//宽度
  height: number //高度
  backgroundColor: string //背景颜色
  borderColor: string //边框颜色
  borderWidth: number //边框宽度
  borderRadius: number  //边框圆角
  textAlign: 'left' | 'center' | 'right' //文本的水平居中方式
  fontSize: number //字号
  lineHeight: number //文本的行高
  textColor: string //文本颜色
}

interface RpkDouyinCustomType {
  type: 'image' | 'text' //按钮的类型，取值 image 或 text。image 对应图片按钮，text 对应文本按钮
  style: TTButtonStyles
  image?: string //按钮的背景图片，type 为 image 时必填。仅支持本地图片，目录包括代码包目录、临时文件目录和本地用户目录
  text?: string //按钮上的文本内容， type 为 text 时有效
}

interface RpkDdouyinCustomType {
  type: 'image' | 'text' //按钮的类型，取值 image 或 text。image 对应图片按钮，text 对应文本按钮
  style: TTButtonStyles
  image?: string //按钮的背景图片，type 为 image 时必填。仅支持本地图片，目录包括代码包目录、临时文件目录和本地用户目录
  text?: string //按钮上的文本内容， type 为 text 时有效
}

type RpkShareExtraVideo = {
  withVideoId?: boolean //是否支持跳转到播放页， 以及支持获取视频信息等接口 （为 true 时会在 success 回调中带上 videoId）
  videoPath?: string //视频地址 ，分享一个本地视频。如果 videoPath 不传入会拉起摄像头拍摄界面
  videoTopics?: string[] //视频话题(仅抖音支持) ，目前由 hashtag_list 代替即将废弃，为保证兼容性，建议同时设置hashtag_list
  createChallenge?: boolean //是否分享为挑战视频 ( 仅头条支持 )
  video_title?: string //生成输入的默认文案
  hashtag_list?: string[] //视频话题，字符串中间包含空格会取第一个空格前内容作为话题(仅抖音支持)
  videoTag?: string //分享视频的标签，可以结合获取抖音视频排行榜使用
  defaultBgm?: string //抖音 pgc 音乐的短链(仅抖音支持，需要基础库版本大于 1.90) 。形如https://v.douyin.com/JmcxWo8/， 参考 抖音小游戏录屏带配乐能力
  cutTemplateId?: string //抖音上可用的剪映模板 ID， 参考 录屏添加剪映视频模板能力
  abortWhenCutTemplateUnavailable?: boolean //剪映模板不可用或者剪映模板 ID 无效的时候是否直接回调失败
}

type RpkShareExtraPicture = {
  picturePath: string[] //发布的图片地址，仅支持本地图片路径（即游戏包内路径和ttfile://路径）channel=picture时，本参数必传。
  contentTitle: string  //作品标题
  contentDescription: string  //作品描述信息
  hashtag_list: string[] //视频话题，字符串中间包含空格会取第一个空格前内容作为话题
}

type RpkDouyinShareParams = {
  func: string
  channel?: 'invite' | 'video' | 'token' | 'article' | 'picture' //转发内容类型
  transmits?: string //透传的参数
  templateId?: string //分享素材模板 id，指定通过平台审核的 templateId 来选择分享内容，需在平台设置且通过审核。
  desc?: string //分享文案，不传则默认使用后台配置内容或游戏简介
  title?: string //转发标题，不传则默认使用后台配置或当前小游戏的名称
  imageUrl?: string //转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径，显示图片长宽比推荐 5:4，不传则默认使用小游戏icon  当channel = video | picture时，该字段不生效
  query?: string //查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 tt.getLaunchOptionsSync 或 tt.onShow 获取启动参数中的 query用来实现信息透传
  extra?: RpkDouyinShareExtra
}

type RpkDouyinShareExtra = {
  withVideoId?:boolean //是否支持跳转到播放页， 以及支持获取视频信息等接口 （为 true 时会在 success 回调中带上 videoId）
  videoPath?:string //视频地址 ，分享一个本地视频。如果 videoPath 不传入会拉起摄像头拍摄界面
  videoTopics?:string[] //视频话题(仅抖音支持) ，目前由 hashtag_list 代替即将废弃，为保证兼容性，建议同时设置hashtag_list
  createChallenge?:boolean //是否分享为挑战视频 ( 仅头条支持 )
  video_title?:string //生成输入的默认文案
  hashtag_list?:string[] //视频话题，字符串中间包含空格会取第一个空格前内容作为话题(仅抖音支持)
  videoTag?:string //分享视频的标签，可以结合获取抖音视频排行榜使用
  defaultBgm?:string //抖音 pgc 音乐的短链(仅抖音支持，需要基础库版本大于 1.90) 。形如https://v.douyin.com/JmcxWo8/， 参考 抖音小游戏录屏带配乐能力
  cutTemplateId?:string //抖音上可用的剪映模板 ID， 参考 录屏添加剪映视频模板能力
  abortWhenCutTemplateUnavailable?:boolean //剪映模板不可用或者剪映模板 ID 无效的时候是否直接回调失败
  picturePath?:string[] //发布的图片地址，仅支持本地图片路径（即游戏包内路径和ttfile://路径）channel=picture时，本参数必传。
  contentTitle?:string  //作品标题
  contentDescription?:string  //作品描述信息
}

type RpkOpenCustomServiceParamsForOs = {
  currencyType: 'CNY', // 币种：目前仅为 "CNY"
  buyQuantity: number, // 购买数量，必须满足：金币数量*金币单价 = 限定价格等级（详见金币限定等级）
  zoneId: string,
  customId: string, //开发者自定义唯一订单号。如不填，支付结果回调将不包含此字段，将导致游戏开发者无法发放游戏道具, 基础库版本低于1.55.0没有此字段
  extraInfo: '',
}

type RpkDouyinRewardedAdParams = {
  func?: string
  destroyAd?: boolean
  adUnitId: string //广告位 id，后续可以在平台基于广告位id看数
  isCheck?: boolean //是否仅检测能否拉取广告, 而不显示
  multiton?: boolean //是否开启再得广告模式（只支持安卓系统的抖音和抖音极速版）
  multitonRewardMsg?: string[] //再得广告的奖励文案，玩家每看完一个广告都会展示，如【再看1个获得xx】xx就multitonRewardMsg中的文案，按顺序依次展示，单个文案最大长度为 7
  multitonRewardTimes?: number //额外观看广告的次数，合法的数据范围为1-4，multiton为true时必填
  progressTip?: boolean  //是否开启进度提醒，开启时广告文案为【再看N个获得xx】，关闭时为【 再看1个获得xx】。N表示玩家当前还需额外观看广告的次数。
  custom_ext?: any
}

interface RpkDouyinImRankData {
  extra?: string // 预留字段
  priority?: number // 用于判断权重 ，仅当  dataType 为 1 时需要，不传则使用默认值 0。如传入 value 为'白银'，priority 为 2，则白银的权重为 2，传入value 为 '黄金'，priority 为 3，则黄金的权重为3，高于白银，届时生成的榜单，黄金段位会排在白银前面
  zoneId?: string // 排行榜分区标识，取值可以是 'default' 或 'test' 或其他开发者自定义的分区标识，'default' 表示为默认的线上分区，'test' 表示测试分区。不同分区的排行榜数据存在数据隔离，如 zoneId='test' 设置的数据不会影响通过  zoneId='default' 的排行榜，可用于测试环境。目前每个小游戏除了 default 和 test， 最多可支持 10 个分区
  value: string // 展示出来的数值，dataType 为 0 时只能传正数的字符串  （如'103', '105'）,且取值范围为 [0, int32_MAX)，否则会报错。dataType 为 1 时，则可传入任意字符串（eg：'青铜'、'白银'）
  dataType: 0 | 1 // 可选值: 0 或 1。0 表示数据为数字类型，往往适用于游戏的通关分数（如 103分、105分）； 1 表示数据为字符串类型，适用于段位信息（如 '青铜'、'白银'）
}

interface RpkDouyinGetImRankData {
  zoneId?: string // 排行榜分区标识，取值可以是 'default' 或 'test' 或其他开发者自定义字符串。'default' 表示为默认的线上分区，不同分区的排行榜数据存在数据隔离，如 zoneId='test' 设置的数据不会影响通过  zoneId='default' 的排行榜，可用于测试环境。目前每个小游戏除了 default 和 test， 最多可支持 10 个分区（未包括默认的线上分区）
  dataType: 0 | 1 // 可选值： 0  或  1。0 表示返回数据被解析为 number。1 表示返回数据被解析为 string
  relationType: 'friend' | 'all' // 排行榜类型
  pageSize: number // 每页长度，大于 0 小于 40
  pageNum: number // 页码，从 1 开始
  rankType: 'day' | 'week' | 'month' | 'all'
}

interface RpkDouyinImRankList {
  zoneId?: string // 排行榜分区标识，取值可以是 'default' 或 'test' 或其他开发者自定义字符串，'default' 表示为默认的线上分区，不同分区的排行榜数据存在数据隔离，如 zoneId='test' 设置的数据不会影响通过 zoneId='default' 的排行榜，可用于测试环境。目前每个小游戏除了 default 和 test， 最多可支持 10 个分区
  suffix?: string // 分数后缀补充文案
  rankTitle?: string // 排行榜标题
  dataType: 0 | 1 // 可选值有 0 或 1。 0 表示数据被解析为数值。1 表示数据被解析为字符串
  relationType: 'friend' | 'all' // 排行榜类型
  rankType: 'day' | 'week' | 'month' | 'all'
}

interface RpkDouyinGridGamePanel {
  position?: string // 排行榜分区标识，取值可以是 'default' 或 'test' 或其他开发者自定义字符串，'default' 表示为默认的线上分区，不同分区的排行榜数据存在数据隔离，如 zoneId='test' 设置的数据不会影响通过 zoneId='default' 的排行榜，可用于测试环境。目前每个小游戏除了 default 和 test， 最多可支持 10 个分区
  query?: object // 分数后缀补充文案
  gridCount: 'one' | 'four' | 'nine' // 表示游戏推荐组件的格子数量
  size: 'friend' | 'medium' | 'small' // 表示组件大小，仅 gridCount = one | four 时有效
}

interface GridGamePanelPosition {
  top: number // 组件左上角纵坐标
  left: number // 组件左上角横坐标
}

interface RpkTrackForReq {
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
  ip?: string //事件发生 IP，字符串类型 1
  sub_channel_id?: string //子渠道ID（SDK自动设置）
  properties?: { //CP 自定义属性（由CP调用时传入）
    [key: string]: any
  }
}

interface RpkBaiduShareParams {
  query?: string // 查询字符串，必须是 key1=val1&key2=val2 的格式。
  target?: string // wechat:微信好友，qq: qq好友，不设置的话会调起分享面板
}

interface RpkBaiduLoginParam {
  method: 'minigame_baidu'
  login_openid?: string,
  ext?: {
    [key: string]: any
  }
}

interface ButtonStyles {
  left: number //左上角横坐标
  top: number
  width: number//宽度
  height: number //高度
  backgroundColor: string //背景颜色
  borderColor: string //边框颜色
  borderWidth: number //边框宽度
  borderRadius: number  //边框圆角
  textAlign: 'left' | 'center' | 'right' //文本的水平居中方式
  fontSize: number //字号
  lineHeight: number //文本的行高
  textColor: string //文本颜色
}

interface RpkBaiduCustomType {
  type: 'image' | 'text' //按钮的类型，取值 image 或 text。image 对应图片按钮，text 对应文本按钮
  style: ButtonStyles
  image?: string //按钮的背景图片，type 为 image 时必填。仅支持本地图片，目录包括代码包目录、临时文件目录和本地用户目录
  text?: string //按钮上的文本内容， type 为 text 时有效
}

interface RpkJdCustomType {
  type: 'image' | 'text' //按钮的类型，取值 image 或 text。image 对应图片按钮，text 对应文本按钮
  style: ButtonStyles
  image?: string //按钮的背景图片，type 为 image 时必填。仅支持本地图片，目录包括代码包目录、临时文件目录和本地用户目录
  text?: string //按钮上的文本内容， type 为 text 时有效
}

interface RpkJdLoginParam {
  method: 'minigame_jd'
  login_openid?: string,
  ext?: {
    [key: string]: any
  }
}

interface RpkAlipayLogin {
  login_openid?: string,
  method: 'minigame_alipay',
  ext?: {
    [key: string]: any
  }
}

interface RpkTaobaoLogin {
  login_openid?: string,
  method: 'minigame_taobao',
  ext?: {
    [key: string]: any
  }
}

interface RpkKuaishouLogin {
  login_openid?: string,
  method: 'minigame_kuaishou',
  ext?: {
    [key: string]: any
  }
}

interface RpkBilibiliLogin {
  login_openid?: string,
  method: 'minigame_bilibili',
  ext?: {
    [key: string]: any
  }
}

interface RpkMgtvLogin {
  login_openid?: string,
  method: 'minigame_bilibili',
  ext?: {
    [key: string]: any
  }
}

interface RpkGameBoxLogin {
  login_openid?: string,
  method: 'minigame_haoyoukuaibao',
  ext?: {
    [key: string]: any
  }
}

interface RpkDouyinLogin {
  login_openid?: string,
  method: 'douyinh5',
  force: boolean,
  ext?: {
    [key: string]: any
  }
}

interface RpkBaiduPayParam {
  pay_type: 'minigame_baidu',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  exchange?: boolean,
  ext: { //扩展字段
    [key: string]: any
  }
}

interface RpkJdPayParam {
  pay_type: 'minigame_jingdong',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface RpkAlipayPayParam {
  pay_type: 'minigame_alipay' | 'minigame_alipay_virtual',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  onlyGetOrder?: boolean
  exchange?: boolean
  zoneId?: string //分区 默认是1
}

interface RpkTaobaoPayParam {
  pay_type: 'minigame_taobao',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  onlyGetOrder?: boolean
  exchange?: boolean
}

interface RpkKuaishouPayParam {
  pay_type: 'minigame_kuaishou',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface RpkBlPayParam {
  pay_type: 'minigame_bilibili',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  orientation?: 0 | 1 | 2, //收银台方向， 0：竖屏， 1：横屏， 2：自适应； 不传默认竖屏
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface RpkDouyinPayParam {
  pay_type: 'douyinh5', //支付的类型
  goods_tag: string, //商品标识
  currency: 'CNY',//币种 默认传: CNY
  trade_no: string, //CP订单号
  indulge_auth?: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  transmit_args?: string, // 客户端透传参数
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  notify_url: string, //支付成功通知CP发货地址
  platform?: 'android' | 'ios',
  ext: { //扩展字段
    [key: string]: any
  },
  zoneId?: string //分区 默认是1
  onlyGetOrder?: boolean
  goods_name?: string,
  orderAmount?: number
  isGift?: boolean
}

interface RpkAlipayShareParams {
  func: string
  transmits?: string //透传的参数
  desc?: string //分享文案，不传则默认使用后台配置内容或游戏简介
  content?: string // 自定义吱口令文案，最多 28 个字符。
  path: string // 自定义分享页面的路径，path 中的自定义参数可在小程序生命周期的 onLoad 方法中获取（参数传递遵循 http get 的传参规则）。
  title?: string //转发标题，不传则默认使用后台配置或当前小游戏的名称
  bgImgUrl?: string // 自定义分享预览大图，建议尺寸 750x825，支持：网络图片路径；不支持：base64。
  scImgUrl?: string // 自定义社交图片链接，作为分享到支付宝好友时的主体图片。建议尺寸 376x330。客户端 10.2.50 开始支持。可通过 my.canIUse('page.onShareAppMessage.return.scImgUrl') 进行检测。支持：网络图片路径；不支持：base64。
  imageUrl?: string // 自定义分享小图 icon 元素，支持：网络图片路径；不支持：base64。
  searchTip?: string // 生成分享截图的搜索引导，设置该参数后，会在分享图片中增加上支付宝搜“设置关键字”的内容，设置关键字不能超过 5 个字
  query?: string //查询字符串，必须是 key1=val1&key2=val2 的格式。
}

interface RpkTaobaoShareParams {
  desc?: string // 分享文案
  title?: string // 转发标题
  imageUrl?: string // 自定义分享小图
  query?: string // 查询字符串，必须是 key1=val1&key2=val2 的格式。
}


type RpkRewardedAdParams = {
  adUnitId: string //广告位 id，后续可以在平台基于广告位id看数
  func?: string
  custom_ext?: any
}

interface RpkResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

interface RpkResponseLogin extends RpkResponse {
  tid: string
  token: string
  openid: string
  username: string
  nickname: string
  avatarUrl: string
  sex: 0 | 1
  /** 0:女; 1:男 **/
  timestamp: number
  ext?: {
    channel_userid?: string
  } & any
  regtime: string
  wxOpenid?: string
  /** 三方平台的唯一标识 */
  uid?: number
  source_openid: string // 分享来源第一个用户
  source: string
  user_flag: string
  cp_user_id: string
}


interface RpkMethodParams<T = any> {
  complete: (data: T) => void
  fail?: (data: T) => void
  onShow?: () => void
}

interface RpkgetShareData {
  func?: string //分享的埋点
  transmits?: string //透传的参数
  imageUrl?: string //分享的图片url
  title?: string //分享的标题
  query?: string //分享的页面路径的参数
  region?: string // 地区码，没有则不传，会取全国地区的数据
  readCache?: boolean // 是否读取缓存，默认读取
}

interface RpksendCaptcha {
  email?: string //邮箱   (和参数phone二选一 全填写默认为手机号码)
  phone?: string //手机号码 (和参数email二选一  全填写默认为手机号码)
  purpose:
    | 'register'
    | 'bindphone'
    | 'unbindphone'
    | 'resetpwd'
    | 'bindemail'
    | 'unbindemail'
    | 'login'
    | 'setpwd' //发送意图 见备注
}

interface RpkBindPhone {
  phone: string //手机
  captcha_code: string //验证码
  password: string //密码
}

type RpkunBindPhone = Omit<RpkBindPhone, 'password'>

type RpkBindEmail = Omit<RpkBindPhone, 'phone'> & { email: string }

type RpkunBindEmail = Omit<RpkBindEmail, 'password'>

type RpkReqMediaCheckAsync = {
  // 图片地址
  urls: string[]
  /**
   * 阿里鉴黄规则
   *    porn：图片智能鉴黄
   *    terrorism：图片暴恐涉政
   *    ad：图文违规
   *    qrcode：图片二维码
   *    live：图片不良场景
   *    logo：图片logo
   */
  scenes: string[]
}

type RpkMediaCheckAsyncReqParams = Omit<RpkReqMediaCheckAsync, 'version' | 'openid'>

type RpkmegSecCheck = {
  content: string //	是	需检测的文本内容，文本字数的上限为2500字，需使用UTF-8编码
  version: 2 //是	接口版本号，2.0版本为固定值2
  scene: 1 | 2 | 3 | 4 //是	场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
  openid: string //是	用户的openid（用户需在近两小时访问过小程序）
  title?: string //否	文本标题，需使用UTF-8编码
  nickname?: string //否	用户昵称，需使用UTF-8编码
  signature?: string //否	个性签名，该参数仅在资料类场景有效(scene=1)，需使用UTF-8编码
}

type RpkOmitMegSecCheck = Omit<RpkmegSecCheck, 'version' | 'openid'>

// 脚本类型
type RpkScriptType = 'js' | 'lua' | 'u3d'
// 输出文件后缀
type RpkOutputFileSuffix = 'json' | 'lua'

interface RpkCheckVersionParams {
  type?: RpkScriptType
  format?: RpkOutputFileSuffix
}

interface RpkCheckAppVersion extends RpkCheckVersionParams {
  // 客户端版本号， 3段或4段
  clientversion: string
  // 客户端设备码 没有传唯一值，缓存使用
  devicecode?: string
  // 地区码， 默认0
  region?: number
}

interface RpkCheckVersion extends RpkCheckAppVersion {
  // key客户端游戏id value版本
  games?: object
  // key客户端活动别名 value版本
  activities?: object
}

interface RpkCheckGameVersion extends RpkCheckVersionParams {
  // 游戏id
  gameid: number
  // 客户端版本号
  gameversion: number
  // 优先检查这个版本，没用再返回最新版本
  gamecheckversion?: number
}

interface RpkCheckActivityVersion extends RpkCheckVersionParams {
  // 活动别名
  activityshortname: string
  // 客户端版本号
  activityversion: number
  // 优先检查这个版本，没用再返回最新版本
  activitycheckversion?: number
}

interface RpkReqBusinessData {
  // 窗口key
  window_key: string
  // 事件
  event: string
  // 前置事件，可传空
  before_event?: string
}

interface RpkReqBusinessOrder {
  // CP方订单号
  trade_no: string
  // 窗口签名
  sign: string
}

interface RpkReqCreateFeedback {
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

interface RpkReqFeedbackEval {
  key_number: number
  pleased_status: number
  reason: string
}

interface RpkHelpcenterQuestionReq {
  // 问题编号
  id: number
}

interface RpkHelpcenterResolution {
  // 问题编号
  id: number
  // 解决状态 true 已解决 false 未解决
  status: boolean
}

interface RpkaddRelation {
  target: string //对方 OpenID
  types: {
    //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
    [key: string]: boolean
  }
  target_remarks?: string //用户给Target设置的备注信息（最长512字符）
  user_remarks?: string //Target给用户设置的备注信息（最长512字符）
}

type rpk_somes = 'target_remarks' | 'user_remarks'
type rpk_some3 = 'types'
type rpk_somes2 = 'user_remarks'

type RpkdeleteRelation = Omit<RpkaddRelation, rpk_somes>
type Rpkupdateremarks = Omit<RpkaddRelation, rpk_somes2 | rpk_some3> & Rpkrelationlists
type RpkHasRelation = Omit<RpkaddRelation, rpk_somes | rpk_some3> & Rpkrelationlists
type RpkaddFriend = Omit<RpkaddRelation, rpk_some3>
type Rpkrelationlists = {
  type: string
}
type RpkdeleFriend = Pick<RpkaddRelation, 'target'>
type Rpkupdatefriendremarks = Pick<RpkaddRelation, 'target' | 'target_remarks'>
type Rpkisfriend = Pick<RpkaddRelation, 'target'>

type Rpkaddscroe = {
  rank_id: string
  score: number
}
type Rpkgetranklist = {
  rank_id: string
}
type RpkgetranklistLimit = Rpkgetranklist & {
  start_rank: number
  end_rank: number
}

interface RpkgetShareData {
  func?: string //分享的埋点
  transmits?: string //透传的参数
  imageUrl?: string //分享的图片url
  title?: string //分享的标题
  query?: string //分享的页面路径的参数
  region?: string // 地区码，没有则不传，会取全国地区的数据
  readCache?: boolean // 是否读取缓存，默认读取
  custom_ext?: any
}

interface RpkReqShareScheduleInit {
  funcs?: string[]
  type?: string
  open_id?: string
}

interface RpkReqShareScheduleReport {
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
