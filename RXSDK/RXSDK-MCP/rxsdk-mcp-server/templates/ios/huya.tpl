# 虎牙联运（iOS）

虎牙联运当前仅支持 Android。iOS SDK 不提供虎牙登录、支付、初始化或角色信息上报能力。

- 不要为 iOS 生成 `method=huya`、`hq_type=huya` 或其他伪接口。
- Unity/Cocos2dx 跨平台项目必须在调用虎牙能力前判断当前运行平台。
- 请改用 Android、Unity Android 或 Cocos2dx Android 接入。
