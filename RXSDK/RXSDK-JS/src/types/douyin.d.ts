interface initParams{
  productId:string
  channelId:string
  cpid:string
  baseUrlList: string[]
}

interface douyinLogin{
  force:boolean , //未登录时, 是否强制调起登录框
  login_openid?:string, //二次登录的openid
  method:'douyinh5',
  ext?: {
    [key: string]: any
  }
}

interface IpayParmasForDouyin{

  pay_type:'douyinh5', //支付的类型 minigame米大师支付 wxpub为ios跳转客服公众号支付
  goods_tag:string, //商品标识
  currency:'CNY',//币种 默认传: CNY
  trade_no:string, //CP订单号

  indulge_auth?: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  transmit_args?:string, // 客户端透传参数
  is_debug?:0 | 1, //0 或 1 默认为0 正式  1 测试
  env?:0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  notify_url:string , //支付成功通知CP发货地址
  ext:{ //扩展字段
    [key:string]:any
  },
  zoneId?:string //分区 默认是1
}
type OmitPayforDouyin = 'currency' | 'openid'

type IpayForDouyin = Omit<IpayParmas,OmitPay>

interface buttonStyles{
  left:number //左上角横坐标
  top:number
  width:number//宽度
  height:number //高度
  backgroundColor:string //背景颜色
  borderColor:string //边框颜色
  borderWidth:number //边框宽度
  borderRadius:number  //边框圆角
  textAlign:"left" | "center" | "right" //文本的水平居中方式
  fontSize:number //字号
  lineHeight:number //文本的行高
  textColor:string //文本颜色
}
interface douyinCustomType{
  type:"image" | "text" //按钮的类型，取值 image 或 text。image 对应图片按钮，text 对应文本按钮
  style:buttonStyles
  image?:string //按钮的背景图片，type 为 image 时必填。仅支持本地图片，目录包括代码包目录、临时文件目录和本地用户目录
  text?:string //按钮上的文本内容， type 为 text 时有效
}
interface douyinTrackForReq {
  type?: string //事件类型，必须在dataTrackType中，默认为 track（SDK自动设置） 1
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
  properties?: ITrackProperties
}
type getTrack = 'properties' | 'event'
// type trackParams = Pick<douyinTrackForReq,getTrack>
// type ImegSecCheck = {
//   content:string //	是	需检测的文本内容，文本字数的上限为2500字，需使用UTF-8编码
//   version:2	//是	接口版本号，2.0版本为固定值2
//   scene:1|2|3|4	//是	场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
//   openid:string	//是	用户的openid（用户需在近两小时访问过小程序）
//   title?:string	//否	文本标题，需使用UTF-8编码
//   nickname?:string	//否	用户昵称，需使用UTF-8编码
//   signature?:string	//否	个性签名，该参数仅在资料类场景有效(scene=1)，需使用UTF-8编码
// }

// type OmitMegSecCheck = Omit<ImegSecCheck,'version' | 'openid'>

/**
 * 分享参数
 */
//channel == video 时extra可传递的参数
type ShareExtraVideo = {
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
}
//channel == picture 时extra 可传递
type ShareExtraPicture = {
  picturePath:string[] //发布的图片地址，仅支持本地图片路径（即游戏包内路径和ttfile://路径）channel=picture时，本参数必传。
  contentTitle:string  //作品标题
  contentDescription:string  //作品描述信息
  hashtag_list:string[] //视频话题，字符串中间包含空格会取第一个空格前内容作为话题
}
type ShareParams = {
  func:string
  channel?:'invite' | 'video' | 'token' | 'article' | 'picture' //转发内容类型
  transmits?:string //透传的参数
  templateId?:string //分享素材模板 id，指定通过平台审核的 templateId 来选择分享内容，需在平台设置且通过审核。
  desc?:string //分享文案，不传则默认使用后台配置内容或游戏简介
  title?:string //转发标题，不传则默认使用后台配置或当前小游戏的名称
  imageUrl?:string //转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径，显示图片长宽比推荐 5:4，不传则默认使用小游戏icon  当channel = video | picture时，该字段不生效
  query?:string //查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 tt.getLaunchOptionsSync 或 tt.onShow 获取启动参数中的 query用来实现信息透传
  extra?:ShareExtraVideo | ShareExtraPicture //附加信息
}

type OpenCustomServiceParams = {
  type:1 | 2 //1 ：小 6 客服 2 :  抖音IM 客服（仅支持抖音）,
  sessionFrom:string //保留字段，暂时可以不填
}

type OpenCustomServiceParamsForOs = {
  currencyType: "CNY", // 币种：目前仅为 "CNY"
  buyQuantity: number, // 购买数量，必须满足：金币数量*金币单价 = 限定价格等级（详见金币限定等级）
  zoneId: string,
  customId: string, //开发者自定义唯一订单号。如不填，支付结果回调将不包含此字段，将导致游戏开发者无法发放游戏道具, 基础库版本低于1.55.0没有此字段
  extraInfo: "",
}
type rewardedAdParams = {
  destroyAd?: boolean
  adUnitId:	string //广告位 id，后续可以在平台基于广告位id看数
  isCheck?: boolean //是否仅检测能否拉取广告, 而不显示
  multiton?: boolean //是否开启再得广告模式（只支持安卓系统的抖音和抖音极速版）
  multitonRewardMsg?:string[] //再得广告的奖励文案，玩家每看完一个广告都会展示，如【再看1个获得xx】xx就multitonRewardMsg中的文案，按顺序依次展示，单个文案最大长度为 7
  multitonRewardTimes?:number //额外观看广告的次数，合法的数据范围为1-4，multiton为true时必填
  progressTip?:boolean  //是否开启进度提醒，开启时广告文案为【再看N个获得xx】，关闭时为【 再看1个获得xx】。N表示玩家当前还需额外观看广告的次数。
}
