# 百度游戏渠道（iOS）

百度游戏渠道仅支持 Android。iOS SDK 不提供百度渠道初始化、闪屏、登录、支付、角色上报、悬浮窗或退出能力。

- 不要为 iOS 生成 `method=baidunet`、百度闪屏或其他伪接口。
- Unity/Cocos2dx 跨平台项目必须在调用百度能力前判断当前运行平台。
- 请改用 Android、Unity Android 或 Cocos2dx Android 接入。
