# RXSDK Unity 版本记录

> 本文件记录 RXSDK Unity SDK 的版本变更历史。

---

## 版本历史

<!-- 按时间倒序记录版本变更 -->

### v4.0.3 (2026-08-10)

**修改内容：**

- `SetThirdGameInfo(GameInfo)` 最低 Unity 版本调整为 `4.0.3`。
- iOS 使用 `roleId/serverId` 复用 `SetGameInfo`，Android 继续上报完整渠道角色信息。
- 新增栩腾渠道公共接入说明：不提供独立 UPM，统一使用 Base、Login、Pay
  `4.0.3` 或更高版本。
- 栩腾仅支持 Android，要求 `rxsdk_xuteng` `4.0.19` 或更高版本及
  `minSdkVersion 23`，通用 API 覆盖初始化、登录、支付、角色上报、登出和退出。

**涉及文件：**

- `RXSDK-Doc/thirdchannel/xuteng/start_unity.md`
- `RXSDK-Doc/thirdchannel/xuteng/start_android.md`
- `WSDoc/docs/开发者文档/三方服务/栩腾/客户端接入.mdx`

---

### v4.0.2 (2026-08-10)

**修改内容：**

- Huya、MuMu MCP 最低版本统一为 Unity `4.0.2`、Android `4.0.19`。

---

### v4.0.1 (2026-08-10)

**修改内容：**

- 移除虎牙专属 UPM 接入方式，虎牙 Unity 项目迁移到公共
  `com.ruixue.unitysdk.base`、`com.ruixue.unitysdk.login`、
  `com.ruixue.unitysdk.pay` 包
- Android 导出工程只接入 `com.ruixue:rxsdk_huya:4.0.17`，并使用
  Volcengine Maven 仓库
- 初始化、登录、支付、角色上报和渠道回调全部改用公共 API

**涉及文件：**

- `RXSDK-Doc/thirdchannel/huya/unity/start.md`
- `RXSDK-Doc/thirdchannel/huya/android/start.md`
- `RXSDK-Doc/thirdchannel/huya/cocos2dx/start.md`

**备注：**

- 公共 UPM 最低版本为 `4.0.1`；不再安装
  `com.ruixue.unitysdk.huya`，也不再使用 `HuyaConfig` 或虎牙专属
  `BuildProcessor`。

---

### v4.0.0 (2026-07-31)

**修改内容：**
- 全部 `com.ruixue.unitysdk.*` UPM 包及内部依赖统一升级到 `4.0.0`
- 新增 `com.ruixue.unitysdk.xingyi` 星驿 App/H5 支付包
- Android 导出工程自动接入 `rxsdk_xingyi`、`rxsdk_h5pay` 4.0.14 和 Volcengine Maven 仓库
- 新增 `RXXingYiPay.PayApp`、`RXXingYiPay.PayH5`，iOS 返回平台不支持
- 新增 `com.ruixue.unitysdk.huya` 虎牙联运 Android 渠道包
- 虎牙渠道初始化使用 `RuiXueSdk.InitThirdSdk`；登录、支付、角色上报分别复用 `RXLogin.Login`、`RXPay.Pay`、`RuiXueSdk.SetThirdGameInfo`，原生依赖最低为 Android 4.0.17

**涉及文件：**
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.*/package.json`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.xingyi/**`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.huya/**`
- `RXSDK-Doc/thirdchannel/xingyi/unity/start.md`
- `RXSDK-Doc/thirdchannel/huya/unity/start.md`

**备注：**
- 星驿支付最低要求 Android SDK 4.0.14。
- 虎牙联运最低要求 Android SDK 4.0.17，需先完成 Maven 发布。
- 本记录仅描述本地代码版本更新，不代表 UPM 包已经发布。
- 迁移说明（2026-08-10）：后续已移除虎牙专属 UPM，统一改用 Base、Login、
  Pay 公共包；本条保留当时的历史记录。

---

### v1.6.36 (2026-07-29)

**修改内容：**
- 新增 `com.ruixue.unitysdk.mumu` 网易 MuMu/Yofun Android 渠道包
- 新增渠道闪屏、调试模式、Unity Player 恢复和 Android 构建自动注入
- `RuiXue.Base` 新增 `LoginMethod.MuMu`，角色事件复用 `SetThirdGameInfo`

**涉及文件：**
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.mumu/**`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.base/Runtime/Common/LoginMethod.cs`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.base/Runtime/Common/GameInfo.cs`
- `RXSDK-Doc/thirdchannel/mumu/mumu.md`

**备注：**
- MuMu 为 Android 专属渠道，`rxsdk_yofun` 版本必须由项目显式配置。

---

### v1.6.22 (2026-06-01)

**修改内容：**
- `com.ruixue.unitysdk.base` 新增 `RuiXueSdk.GetDistinctId(RequestResponseDelegate onResponse)`，桥接 iOS / Android 原生 `getDistinctId`
- 示例工程补充 `GetDistinctId` 调用示例
- 同步补充 Unity API 文档

**涉及文件：**
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.base/Runtime/RuiXueSdk.cs`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.base/Runtime/Impl/*/RuiXueSdk*.cs`
- `RXSDK-Unity/Packages/com.ruixue.unitysdk.base/Plugins/IOS/RuiXueIOSBridgeBase.*`
- `RXSDK-Doc/unity/api/API_LIST.md`
- `RXSDK-Doc/unity/api/09_misc.md`

**备注：**
- 新增接口保持与 `GetDeviceCode` 一致的回调风格，不影响已有 API。

---

### v1.6.21 (2026-05-14)

**修改内容：**
- 全量发布所有 `com.ruixue.unitysdk.*` UPM 包，统一升级到 `1.6.21`
- 同步更新各包 `package.json` 的 `version` 与 `com.ruixue.*` 内部依赖版本号

**涉及包（共 40 个）：**
- 基础：`base`、`ui`、`uioverseas`、`feedbackui`
- 登录/支付：`login`、`pay`、`unipin`
- 通行证/合规：`legal`、`versioncheck`、`review`、`helpcenter`、`feedback`、`announcement`（含于 base）
- 社交/分享：`share`、`social`、`im`、`rank`、`facebook`、`google`、`line`、`zalo`、`weixin`、`reddit`、`instagram`、`tiktok`、`snapchat`、`qoo`
- 推送/统计/广告：`push`、`firebase`、`adjust`、`analysis`、`ad`、`bytedance`
- 其它：`alidns`、`txdns`、`oaidv2`、`uwa`、`lbs`、`quick`
- 小游戏：`minigame.weixin`、`minigame.douyin`

**发布信息：**
- Registry: `http://60.205.123.114:4873`
- 发布脚本: `RXSDK-Unity/scripts/publish-upm.sh --version 1.6.21`
- 发布顺序: `com.ruixue.unitysdk.base` 优先，其余按目录顺序

**备注：**
- 本次为版本号统一刷新，未变更对外 API 签名，可平滑升级
- 升级方式：在 Unity 项目 `Packages/manifest.json` 中将各 `com.ruixue.unitysdk.*` 依赖版本号改为 `1.6.21`，或在 Package Manager 中点击 Update

---

## 版本记录模板

```markdown
### vX.X.X (YYYY-MM-DD)

**修改内容：**
- 

**涉及文件：**
- 

**备注：**
```
