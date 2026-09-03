# 栩腾渠道（iOS）

栩腾渠道当前仅支持 Android。iOS SDK 不提供栩腾初始化、登录、支付、角色上报、登出或退出能力。

- 不要为 iOS 生成 `method=xuteng`、`hq_type=xuteng` 或其他伪接口。
- Unity/Cocos2dx 跨平台项目必须在调用栩腾能力前判断当前运行平台。
- 请改用 Android、Unity Android 或 Cocos2dx Android 接入。
