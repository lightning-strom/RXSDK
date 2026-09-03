// // sdk init params
// interface initParams{
//   productId:string
//   channelId:string
//   cpid:string
//   baseUrlList: string[]
//   thirdPartAppId?:string | number //三方appid
//   needRefresh?:0 | 1  //支付完成后是否重新加载游戏
//   gameImplType?: string  // 游戏实现类型 cocos ｜ unity
// }
//
// interface IlocationInfomation{
//   longitude: number,
//   latitude: number
// }
// interface IreportLoaction{
//   types:string[], //分组名称列表，由 CP 自定义
//   reportSpace:number //上报的时间间隔
// }
// interface IreqReportLocationUpdata{
//   lon:number, //WGS84 经度
//   lat:number, //WGS84 纬度
//   type:string[] //坐标分组，由 CP 自定义。
// }
// interface IreqdeleteReportLocation{
//   types:string[]
// }
// interface IreqNearlyPeason{
//   radius:number //限定半径距离，单位：米
//   count:number //获取数量，0表示获取全部
//   page:number //获取第几页的数据 从1开始
//   page_size:number //每页数量
//   type:string //坐标分组，由 CP 自定义
//   lon?:number  //WGS84 经度
//   lat?:number //WGS84 纬度
// }
// interface IaddRelation{
//   target:string //对方 OpenID
//   types:{ //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
//     [key:string]:boolean
//   }
//   target_remarks?:string //用户给Target设置的备注信息（最长512字符）
//   user_remarks?:string //Target给用户设置的备注信息（最长512字符）
// }
// type somes = 'target_remarks' | 'user_remarks'
// type IdeleteRelation = Omit<IaddRelation,somes>
// type somes2 = 'user_remarks'
// type Iupdateremarks = Omit<IaddRelation,somes2 | some3> & Irelationlists
// type IHasRelation = Omit<IaddRelation, somes | some3> & Irelationlists
// type some3 = 'types'
// type IaddFriend = Omit<IaddRelation,some3>
// type Irelationlists = {
//   type:string
// }
// type IdeleFriend = Pick<IaddRelation,'target'>
// type Iupdatefriendremarks = Pick<IaddRelation,'target' | 'target_remarks'>
// type Iisfriend = Pick<IaddRelation,'target'>
//
// type Iaddscroe = {
//   rank_id:string
//   score:number
// }
// type Igetranklist = {
//   rank_id: string
// }
// type IgetranklistLimit = Igetranklist & {
//   start_rank: number
//   end_rank: number
// }
// type queryuserrank = {
//   open_id:string
// }
// interface IMethodParams<T = any> {
//   complete: (data: T) => void
//   paySuccCallback?: () => void
// }
// interface IgetShareData {
//   func?:string  //分享的埋点
//   transmits?:string //透传的参数
//   imageUrl?:string //分享的图片url
//   title?:string //分享的标题
//   query?:string //分享的页面路径的参数
//   region?: string // 地区码，没有则不传，会取全国地区的数据
//   readCache?: boolean // 是否读取缓存，默认读取
// }
//
// interface IpayParmas{
//   //支付的类型 minigame米大师支付 wxpub为ios跳转客服公众号支付 aums: 银联云闪付支付
//   pay_type:'minigame' | 'minigame_friend' | 'wxpub' | 'minigame_v2' | 'aums' | 'minigame_vivo' | 'minigame_oppo',
//   func?:string, //当wxpub时 func必传
//   goods_tag:string, //商品标识
//   currency?:'CNY',//币种 默认传: CNY
//   openid?:string, //瑞雪OPENID
//   trade_no:string, //CP订单号
//   transmit_args?:string, // 客户端透传参数
//   is_debug?:0 | 1, //0 或 1 默认为0 正式  1 测试
//   env?:0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
//   indulge_auth:0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
//   age?:number, //用户年龄,indulge_auth为1时必传该字段
//   callback_from?:0 | 1, //支付成功后的回调是否是客户端发起 客户端发起传: 1
//   notify_url?:string , //支付成功通知CP发货地址\
//   noreply?:boolean, //用于隐藏客服列表 wxpub时生效
//   onlyGetOrder?:boolean //只获取order接口的内容
//   ext:{ //扩展字段
//     [key:string]:any
//   },
//   zoneId?:string //分区 默认是1
//   querystr?: string // 用于打开客服透传的url参数 必须以&开头
//   // 用于打开客服透传的sessionFrom参数
//   sessionFromExt?: {
//     [key:string]:any
//   }
// }
// type OmitPay = 'currency' | 'openid'
//
// type Ipay = Omit<IpayParmas,OmitPay>
//
// interface IsendCaptcha{
//   email?: string //邮箱   (和参数phone二选一 全填写默认为手机号码)
//   phone?: string //手机号码 (和参数email二选一  全填写默认为手机号码)
//   purpose: 'register' | 'bindphone' | 'unbindphone' | 'resetpwd' | 'bindemail' | 'unbindemail' | 'login' | 'setpwd' //发送意图 见备注
// }
//
// interface IBindPhone{
//   phone: string   //手机
//   captcha_code: string //验证码
//   password: string //密码
// }
//
// type IunBindPhone = Omit<IBindPhone,'password'>
//
// type IBindEmail = Omit<IBindPhone,'phone'> & {email:string}
//
// type IunBindEmail = Omit<IBindEmail,'password'>
//
// type IReqMediaCheckAsync = {
//   // 图片地址
//   urls: string[]
//   /**
//    * 阿里鉴黄规则
//    *    porn：图片智能鉴黄
//    *    terrorism：图片暴恐涉政
//    *    ad：图文违规
//    *    qrcode：图片二维码
//    *    live：图片不良场景
//    *    logo：图片logo
//    */
//   scenes: string[]
// }
//
// type MediaCheckAsyncReqParams = Omit<IReqMediaCheckAsync,'version' | 'openid'>
//
// type ImegSecCheck = {
//   content:string //	是	需检测的文本内容，文本字数的上限为2500字，需使用UTF-8编码
//   version:2	//是	接口版本号，2.0版本为固定值2
//   scene:1|2|3|4	//是	场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
//   openid:string	//是	用户的openid（用户需在近两小时访问过小程序）
//   title?:string	//否	文本标题，需使用UTF-8编码
//   nickname?:string	//否	用户昵称，需使用UTF-8编码
//   signature?:string	//否	个性签名，该参数仅在资料类场景有效(scene=1)，需使用UTF-8编码
// }
//
// type OmitMegSecCheck = Omit<ImegSecCheck,'version' | 'openid'>

interface bilibiliLogin {
  login_openid?: string, //二次登录的openid
  method: 'minigame_bilibili',
  ext?: {
    [key: string]: any
  }
}

type IpayForBilibili = Omit<IpayParmas, 'openid'>

interface bilibiliTrackForReq {
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