interface huaweiQuickLogin {
  login_openid?: string //二次登录的openid
  method?: string
  ext?: {
    [key: string]: any
  }
}
type IpayForHuawei = Omit<IpayParmas, OmitPay> //商品计费点

type createRewardAdResponse = {
  code: 0 | -1 | 1 // 0 广告关闭 -1错误  1 初始化完成
  data: string
  isEnded: Boolean
}
