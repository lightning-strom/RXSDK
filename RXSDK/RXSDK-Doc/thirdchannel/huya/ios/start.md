# 虎牙联运（iOS）

虎牙联运渠道当前仅支持 Android。iOS SDK 不提供虎牙登录、支付或角色信息上报能力。

跨平台项目应在调用前判断运行平台，不要在 iOS 将 `method=huya` 或
`hq_type=huya` 映射到其他登录、支付接口。

