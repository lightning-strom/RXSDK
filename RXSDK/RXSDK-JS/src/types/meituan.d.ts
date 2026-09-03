interface IpayMeituanParmas{
  pay_type:'meituan', //支付的类型 minigame米大师支付 wxpub为ios跳转客服公众号支付
  goods_tag:string, //商品标识
  trade_no:string, //CP订单号
  indulge_auth:0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  func?:string, //当wxpub时 func必传
  currency?:'CNY',//币种 默认传: CNY
  openid?:string, //瑞雪OPENID
  transmit_args?:string, // 客户端透传参数
  is_debug?:0 | 1, //0 或 1 默认为0 正式  1 测试
  env?:0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  age?:number, //用户年龄,indulge_auth为1时必传该字段
  callback_from?:0 | 1, //支付成功后的回调是否是客户端发起 客户端发起传: 1
  notify_url?:string , //支付成功通知CP发货地址\
  ext:{ //扩展字段
    [key:string]:any
  },
  zoneId?:string //分区 默认是1
}