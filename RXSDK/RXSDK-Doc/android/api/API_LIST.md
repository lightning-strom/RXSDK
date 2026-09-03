# RXSDK 接口清单

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26  
> **入口类**: `com.ruixue.openapi.RXSDK`

本文档列出了 `RXSDK` 类提供的所有公开接口，按功能模块分类整理。

## 目录

- [SDK 基础功能](#sdk-基础功能)
- [通行证相关接口](#通行证相关接口)
- [社交相关接口](#社交相关接口)
- [游戏区服相关接口](#游戏区服相关接口)
- [支付相关接口](#支付相关接口)
- [分享相关接口](#分享相关接口)
- [版本更新相关接口](#版本更新相关接口)
- [反馈相关接口](#反馈相关接口)
- [达人福利相关接口](#达人福利相关接口)
- [埋点和运营相关接口](#埋点和运营相关接口)
- [法务相关接口](#法务相关接口)
- [公告和邮件相关接口](#公告和邮件相关接口)
- [配置和信息获取接口](#配置和信息获取接口)
- [登录状态接口](#登录状态接口)
- [生命周期接口](#生命周期接口)
- [其他接口](#其他接口)

---

## SDK 基础功能

### 单例获取

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getInstance()` | 获取 RXSDK 单例实例 | `RXSDK` |

### SDK 信息

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getSdkInfo()` | 获取 SDK 信息 | `SdkInfo` |
| `getChannel()` | 获取渠道信息 | `String` |

### 插件管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `registerPlugin(IPluginSdk)` | 注册第三方插件 SDK | `thirdSdk`: 第三方插件 SDK 实例 |
| `unregisterPlugin(IPluginSdk)` | 注销第三方插件 SDK | `thirdSdk`: 第三方插件 SDK 实例 |
| `getPlugins()` | 获取所有已注册的插件 | - |
| `initThirdSdk(Activity, Map, RXRequestCallback)` | 初始化第三方 SDK | `activity`: Activity<br>`hashMap`: 参数<br>`callback`: 回调接口 |
| `checkQuickAp(RXRequestCallback)` | 检查快捷应用 | `callback`: 回调接口 |

### 隐私和合规

| 方法 | 说明 | 参数 |
|------|------|------|
| `setPrivacyAgree(Context, PrivacyCallback)` | 同意隐私政策 | `context`: Context<br>`privacyCallback`: 隐私回调 |
| `setPrivacyAgree(Context, boolean, PrivacyCallback)` | 同意隐私政策 | `context`: Context<br>`isAgree`: 是否同意<br>`privacyCallback`: 隐私回调 |
| `isAgreedPrivacy()` | 是否已同意隐私政策 | - |
| `setupAddictDelegate(AntiAddictDelegate)` | 设置防沉迷代理 | `antiAddictDelegate`: 防沉迷代理 |

### 其他基础功能

| 方法 | 说明 | 参数 |
|------|------|------|
| `jumpToAppStore(Activity)` | 跳转到应用商店 | `activity`: Activity |
| `createRequest(String, Map)` | 创建自定义接口请求 | `api`: 接口路径<br>`bodyMap`: 接口参数 |
| `setRuiXueSdkCallback(RuiXueSdkCallback)` | 设置瑞雪 SDK 回调 | `callback`: 回调接口 |
| `setSubChannelId(String)` | 设置子渠道 ID | `subChannelId`: 子渠道 ID |
| `exitApp(Activity, OnAppExitCallback)` | 退出应用 | `activity`: Activity<br>`callback`: 退出回调 |

---

## 通行证相关接口

### 登录注册

| 方法 | 说明 | 参数 |
|------|------|------|
| `login(Activity, LoginParams, RXRequestCallback)` | 用户登录 | `activity`: Activity（可选）<br>`params`: 登录参数<br>`callback`: 回调接口 |
| `login(LoginParams, RXRequestCallback)` | 用户登录（简化版本） | `params`: 登录参数<br>`callback`: 回调接口 |
| `login(Activity, Map, RXRequestCallback)` | 用户登录（Map 参数版本） | `activity`: Activity<br>`map`: 登录参数 Map<br>`callback`: 回调接口 |
| `register(RegisterParams, RXRequestCallback)` | 用户注册 | `params`: 注册参数<br>`callback`: 回调接口 |
| `logout(OnLogoutCallback)` | 用户登出 | `callback`: 登出回调 |

### 验证码

| 方法 | 说明 | 参数 |
|------|------|------|
| `sendCaptcha(CaptchaType, String, String, RXRequestCallback)` | 发送验证码 | `type`: 验证码类型<br>`target`: 手机号或邮箱<br>`purpose`: 用途<br>`callback`: 回调接口 |
| `verifyCaptcha(CaptchaType, String, String, String, RXRequestCallback)` | 验证验证码 | `type`: 验证码类型<br>`target`: 手机号或邮箱<br>`purpose`: 用途<br>`captchaCode`: 验证码<br>`callback`: 回调接口 |

### 用户信息

| 方法 | 说明 | 参数 |
|------|------|------|
| `getUserInfo(RXRequestCallback)` | 获取用户信息 | `callback`: 回调接口 |
| `updateUserInfo(UserInfoParams, RXRequestCallback)` | 更新用户信息 | `params`: 用户信息参数<br>`callback`: 回调接口 |

### 密码管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `changePassword(String, String, RXRequestCallback)` | 修改密码 | `oldPassword`: 旧密码<br>`newPassword`: 新密码<br>`callback`: 回调接口 |
| `resetPassword(String, String, String, Object, RXRequestCallback)` | 重置密码 | `username`: 手机号<br>`password`: 新密码<br>`captchaCode`: 验证码<br>`migrateArgs`: 迁移参数（可选）<br>`callback`: 回调接口 |

### 实名认证

| 方法 | 说明 | 参数 |
|------|------|------|
| `realAuth(String, String, RXRequestCallback)` | 实名认证 | `realname`: 姓名<br>`idcard`: 身份证号<br>`callback`: 回调接口 |
| `realAuth(String, String, boolean, RXRequestCallback)` | 实名认证（快速认证） | `realname`: 姓名<br>`idcard`: 身份证号<br>`isFastRealAuth`: 是否使用快速认证<br>`callback`: 回调接口 |

### 手机绑定

| 方法 | 说明 | 参数 |
|------|------|------|
| `bindPhone(String, String, String, Object, RXRequestCallback)` | 绑定手机 | `phone`: 手机号<br>`password`: 密码<br>`captchaCode`: 验证码<br>`migrateArgs`: 迁移参数（可选）<br>`callback`: 回调接口 |
| `changePhone(String, String, String, Object, RXRequestCallback)` | 修改手机号 | `newPhone`: 新手机号<br>`newPhoneCaptcha`: 新手机号验证码<br>`oldPhoneCaptcha`: 旧手机号验证码<br>`migrateArgs`: 迁移参数（可选）<br>`callback`: 回调接口 |
| `unBindPhone(String, String, RXRequestCallback)` | 解绑手机 | `phone`: 手机号<br>`captchaCode`: 验证码<br>`callback`: 回调接口 |

### 邮箱绑定

| 方法 | 说明 | 参数 |
|------|------|------|
| `bindEmail(String, String, String, Object, RXRequestCallback)` | 绑定邮箱 | `email`: 邮箱<br>`password`: 密码<br>`captchaCode`: 验证码<br>`migrateArgs`: 迁移参数（可选）<br>`callback`: 回调接口 |
| `changeEmail(String, String, String, Object, RXRequestCallback)` | 修改邮箱 | `newEmail`: 新邮箱<br>`newEmailCaptcha`: 新邮箱验证码<br>`oldEmailCaptcha`: 旧邮箱验证码<br>`migrateArgs`: 迁移参数（可选）<br>`callback`: 回调接口 |
| `unBindEmail(String, String, RXRequestCallback)` | 解绑邮箱 | `email`: 邮箱<br>`captchaCode`: 验证码<br>`callback`: 回调接口 |

### 账号管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `searchHasAccounts(String, String, int, RXRequestCallback)` | 查询账号 | `method`: 登录方式<br>`devicecode`: 设备码<br>`states`: 账号的位标记<br>`callback`: 回调接口 |
| `searchBindingAccounts(RXRequestCallback)` | 查询绑定账号列表 | `callback`: 回调接口 |
| `deregister(RXDeregisterConfig, RXRequestCallback)` | 申请注销账号 | `deregisterConfig`: 注销配置<br>`callback`: 回调接口 |
| `deregisterCancel(RXRequestCallback)` | 撤销注销申请 | `callback`: 回调接口 |

---

## 社交相关接口

### LBS 定位

| 方法 | 说明 | 参数 |
|------|------|------|
| `lbsUpdate(String[], float, float, RXRequestCallback)` | 上报/更新经纬度坐标 | `types`: 类型数组<br>`longitude`: 经度<br>`latitude`: 纬度<br>`callback`: 回调接口 |
| `lbsRadius(String, float, float, float, int, int, int, RXRequestCallback)` | 获取指定半径内的其他用户信息 | `types`: 类型<br>`longitude`: 经度<br>`latitude`: 纬度<br>`radius`: 半径<br>`count`: 数量<br>`page`: 页码<br>`pageSize`: 每页大小<br>`callback`: 回调接口 |
| `lbsDelete(String[], RXRequestCallback)` | 删除经纬度坐标 | `types`: 类型数组<br>`callback`: 回调接口 |

### 用户自定义信息

| 方法 | 说明 | 参数 |
|------|------|------|
| `userSetCustom(String, RXRequestCallback)` | 设置用户自定义信息 | `custom`: 自定义信息<br>`callback`: 回调接口 |

### 自定义关系

| 方法 | 说明 | 参数 |
|------|------|------|
| `relationAdd(String, Map, String, String, RXRequestCallback)` | 添加自定义关系 | `target`: 对方 OpenID<br>`types`: 关系类型 Map<br>`targetRemarks`: 用户给 Target 设置的备注信息<br>`userRemarks`: Target 给用户设置的备注信息<br>`callback`: 回调接口 |
| `relationDelete(String, Map, RXRequestCallback)` | 删除自定义关系 | `target`: 对方 OpenID<br>`types`: 关系类型 Map<br>`callback`: 回调接口 |
| `updateRemarks(String, String, String, RXRequestCallback)` | 更新自定义关系备注 | `target`: 对方 OpenID<br>`type`: 关系类型<br>`targetRemarks`: 备注信息<br>`callback`: 回调接口 |
| `hasRelation(String, String, RXRequestCallback)` | 判断两用户是否存在某自定义关系 | `target`: 对方 OpenID<br>`type`: 关系类型<br>`callback`: 回调接口 |
| `relationList(String, RXRequestCallback)` | 获取自定义关系列表 | `type`: 关系类型<br>`callback`: 回调接口 |

### 好友管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `addFriends(String, String, String, RXRequestCallback)` | 添加好友 | `target`: 对方 OpenID<br>`targetRemarks`: 用户给 Target 设置的备注信息<br>`userRemarks`: Target 给用户设置的备注信息<br>`callback`: 回调接口 |
| `removeFriends(String, RXRequestCallback)` | 删除好友 | `target`: 对方 OpenID<br>`callback`: 回调接口 |
| `updateFriendRemarks(String, String, RXRequestCallback)` | 更新好友备注 | `target`: 对方 OpenID<br>`targetRemarks`: 备注信息<br>`callback`: 回调接口 |
| `isFriend(String, RXRequestCallback)` | 判断两用户是否为好友 | `target`: 对方 OpenID<br>`callback`: 回调接口 |
| `relationFriends(RXRequestCallback)` | 获取好友列表 | `callback`: 回调接口 |

### 排行榜

| 方法 | 说明 | 参数 |
|------|------|------|
| `addScore(String, int, RXRequestCallback)` | 增加用户分数 | `rankId`: 榜单 ID<br>`score`: 增加的分数值<br>`callback`: 回调接口 |
| `setScore(String, int, RXRequestCallback)` | 设置用户分数 | `rankId`: 榜单 ID<br>`score`: 分数值<br>`callback`: 回调接口 |
| `queryUserRank(String, String, RXRequestCallback)` | 查询用户排名 | `rankId`: 榜单 ID<br>`openId`: 目标用户 OpenID<br>`callback`: 回调接口 |
| `getRankList(String, int, int, RXRequestCallback)` | 获取排行榜列表 | `rankId`: 榜单 ID<br>`startRank`: 开始排名<br>`endRank`: 结束排名<br>`callback`: 回调接口 |
| `friendsRank(String, RXRequestCallback)` | 获取好友排行榜列表 | `rankId`: 榜单 ID<br>`callback`: 回调接口 |

---

## 游戏区服相关接口

### 区服管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `searchGameAreaInfo(String, RXRequestCallback)` | 查询游戏区服信息 | `areaId`: 区服 ID<br>`callback`: 回调接口 |
| `searchGameAreaListInfo(RXRequestCallback)` | 查询区服列表信息 | `callback`: 回调接口 |
| `createGameArea(String, String, String, String, Map, RXRequestCallback)` | 创建游戏区服 | `areaId`: 区服 ID<br>`areaName`: 区服名称<br>`areaStatus`: 区服状态<br>`areaType`: 区服类型<br>`extension`: 扩展字段<br>`callback`: 回调接口 |
| `updateGameAreaInfo(String, String, String, String, Map, RXRequestCallback)` | 修改游戏区服信息 | `areaId`: 区服 ID<br>`areaName`: 区服名称<br>`areaStatus`: 区服状态<br>`areaType`: 区服类型<br>`extension`: 扩展字段<br>`callback`: 回调接口 |
| `deleteGameArea(String, RXRequestCallback)` | 删除游戏区服 | `areaId`: 区服 ID<br>`callback`: 回调接口 |

### 角色管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `createGameCharacter(...)` | 创建游戏角色 | `areaId`: 区服 ID<br>`characterName`: 角色名称<br>`characterLevel`: 角色等级<br>`characterFaction`: 角色阵营<br>`characterProfession`: 角色职业<br>`characterStatus`: 角色状态<br>`characterType`: 角色类型<br>`characterVipLevel`: 角色 VIP 等级<br>`cpUserId`: CP 用户 ID<br>`extension`: 扩展字段<br>`callback`: 回调接口 |
| `updateGameCharacterInfo(...)` | 更新游戏角色信息 | `characterId`: 角色 ID<br>`areaId`: 区服 ID<br>`characterFaction`: 角色阵营<br>`characterLevel`: 角色等级<br>`characterName`: 角色名称<br>`characterProfession`: 角色职业<br>`characterStatus`: 角色状态<br>`characterType`: 角色类型<br>`characterVipLevel`: 角色 VIP 等级<br>`cpUserId`: CP 用户 ID<br>`extension`: 扩展字段<br>`callback`: 回调接口 |
| `deleteGameCharacter(String, String, String, RXRequestCallback)` | 删除游戏角色 | `areaId`: 区服 ID<br>`characterId`: 角色 ID<br>`cpUserId`: CP 用户 ID<br>`callback`: 回调接口 |
| `searchGameCharacterInfo(String, String, String, RXRequestCallback)` | 查询具体角色信息 | `cpUserId`: CP 用户 ID<br>`areaId`: 区服 ID<br>`characterId`: 角色 ID<br>`callback`: 回调接口 |
| `searchGameCharacterListInfo(String, RXRequestCallback)` | 查询账号下角色信息列表 | `cpUserId`: CP 用户 ID<br>`callback`: 回调接口 |
| `searchGameCharacterListInArea(String, String, RXRequestCallback)` | 查询账号下某个区服下的角色信息列表 | `cpUserId`: CP 用户 ID<br>`areaId`: 区服 ID<br>`callback`: 回调接口 |

### 游戏信息

| 方法 | 说明 | 参数 |
|------|------|------|
| `setGameInfo(String, String)` | 设置游戏信息 | `roleId`: 角色 ID<br>`regionTag`: 地区标签 |
| `setGameInfo(GameInfo)` | 设置游戏信息 | `gameInfo`: 游戏信息 |
| `searchGameAccount(RXRequestCallback)` | 查询角色信息 | `callback`: 回调接口 |
| `updateGameVersion(Map, RXRequestCallback)` | 更新游戏版本 | `body`: 请求体<br>`callback`: 回调接口 |

---

## 支付相关接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `pay(Activity, HQParams, RXRequestCallback)` | 支付 | `activity`: Activity<br>`payParams`: 支付参数<br>`callback`: 回调接口 |
| `pay(Activity, Map, RXRequestCallback)` | 支付（Map 参数版本） | `activity`: Activity<br>`hashMap`: 支付参数 Map<br>`callback`: 回调接口 |
| `tradeQuery(String, RXRequestCallback)` | 查询订单状态 | `orderNo`: 订单号<br>`callback`: 回调接口 |

---

## 分享相关接口

### 基础分享

| 方法 | 说明 | 参数 |
|------|------|------|
| `share(Activity, RXShareConfig, RXRequestCallback)` | 分享 | `activity`: Activity<br>`shareConfig`: 分享配置<br>`callback`: 回调接口 |
| `shareCustom(Activity, RXCustomShareConfig, RXRequestCallback)` | 分享（自定义配置） | `activity`: Activity<br>`config`: 分享配置<br>`callback`: 回调接口 |
| `getShareInfo(RXShareConfig, RXRequestCallback)` | 获取分享信息 | `shareConfig`: 分享配置<br>`callback`: 回调接口 |

### 分享数据

| 方法 | 说明 | 参数 |
|------|------|------|
| `getShareData(Map, RXRequestCallback)` | 获取分享埋点数据 | `hashMap`: 参数 Map<br>`callback`: 回调接口 |
| `getShareData(Map, RXCallback<ShareDataResult>)` | 获取分享埋点数据（带回调类型） | `map`: 参数 Map<br>`callback`: 回调接口 |
| `shareReport(String, Map)` | 分享上报 | `distinctId`: 用户唯一标识<br>`properties`: 属性 |
| `shareReport(ShareDataResult)` | 分享上报 | `shareDataResult`: 分享数据结果 |

### 分享调度

| 方法 | 说明 | 参数 |
|------|------|------|
| `shareSchedulingInit(String[], RXRequestCallback)` | 分享调度初始化 | `funcs`: 功能数组<br>`callback`: 回调接口 |
| `getShareScheduling(String...)` | 获取分享调度 | `func`: 功能 |
| `shareSchedulingReport(String, String, String, boolean, String, String, Map, RXRequestCallback)` | 分享调度上报 | `func`: 功能<br>`platform`: 平台<br>`region`: 地区<br>`schedulingEvent`: 调度事件<br>`schedulingType`: 调度类型<br>`transmits`: 透传参数<br>`properties`: 属性<br>`callback`: 回调接口 |

### 其他分享功能

| 方法 | 说明 | 参数 |
|------|------|------|
| `getShortUrl(String, RXRequestCallback)` | 获取短链接 | `url`: 原始 URL<br>`callback`: 回调接口 |
| `getShortUrl(String, String, String, String, Map, RXRequestCallback)` | 获取短链接（带 OG 标签） | `url`: 原始 URL<br>`title`: 标题<br>`content`: 描述<br>`image`: 图片地址<br>`ext`: 透传参数<br>`callback`: 回调接口 |
| `getSharePlatforms(RXRequestCallback)` | 获取分享通路配置 | `callback`: 回调接口 |

---

## 版本更新相关接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `updateApp(String, String, Map, RXStringCallback)` | 更新应用 | `version`: 客户端版本号<br>`region`: 地区码<br>`queryMap`: 查询参数<br>`callback`: 回调接口 |
| `checkUpdateApp(String, String, String, Map, RXStringCallback)` | 检查应用更新 | `version`: 客户端版本号<br>`region`: 地区码<br>`type`: 脚本类型<br>`queryMap`: 查询参数<br>`callback`: 回调接口 |
| `updateActivity(String, String, String, Map, RXStringCallback)` | 活动版本检查 | `activityShortname`: 活动别名<br>`activityVersion`: 客户端版本号<br>`activityCheckVersion`: 优先检查这个版本<br>`queryMap`: 查询参数<br>`callback`: 回调接口 |
| `updateGame(String, String, String, Map, RXStringCallback)` | 游戏版本检查 | `gameId`: 游戏 ID<br>`gameVersion`: 客户端版本号<br>`gameCheckVersion`: 优先检查这个版本<br>`queryMap`: 查询参数<br>`callback`: 回调接口 |

---

## 反馈相关接口

### 基础反馈

| 方法 | 说明 | 参数 |
|------|------|------|
| `getFeedbackKindList(RXRequestCallback)` | 获取反馈类型列表 | `callback`: 回调接口 |
| `createFeedback(Map, RXRequestCallback)` | 创建反馈 | `map`: 反馈参数<br>`callback`: 回调接口 |
| `satisfactionEvaluation(Map, RXRequestCallback)` | 满意度评价 | `map`: 评价参数<br>`callback`: 回调接口 |

### 详细反馈（新增）

| 方法 | 说明 | 参数 |
|------|------|------|
| `feedbackCreate(String, String[], String, String[], RXRequestCallback)` | 创建意见反馈（详细版） | `content`: 反馈内容<br>`attachments`: 附件地址数组<br>`phone`: 手机号<br>`tags`: 游戏透传标识<br>`callback`: 回调接口 |
| `getFeedbackList(int, int, int, RXRequestCallback)` | 获取反馈列表 | `page`: 页数<br>`size`: 每页大小<br>`status`: 状态（1 未处理，2 已处理，0 所有）<br>`callback`: 回调接口 |
| `getFeedbackDetail(int, RXRequestCallback)` | 获取反馈详情 | `feedbackId`: 反馈 ID<br>`callback`: 回调接口 |
| `feedbackGetprop(int, RXRequestCallback)` | 领取反馈回复中的道具 | `feedbackId`: 反馈 ID<br>`callback`: 回调接口 |

---

## 达人福利相关接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `getPromoDisplayKEY(boolean, RXRequestCallback)` | 获取达人游戏内显示福利码 | `authRefresh`: 是否自动刷新<br>`callback`: 回调接口 |
| `exchangePromoCDKEY(String, RXRequestCallback)` | 兑换达人福利码 | `cdKey`: 福利码<br>`callback`: 回调接口 |

---

## 埋点和运营相关接口

### 埋点上报

| 方法 | 说明 | 参数 |
|------|------|------|
| `dataTrack(String, String, Map)` | 埋点数据上报 | `eventName`: 埋点标识事件<br>`distinctId`: 用户唯一标识<br>`properties`: 自定义属性 |
| `dataTrack(String, String, Map, int, int)` | 埋点数据上报（带缓存配置） | `eventName`: 埋点标识事件<br>`distinctId`: 用户唯一标识<br>`properties`: 自定义属性<br>`flushInterval`: 上报时间间隔<br>`maxCacheCount`: 最大缓存条数 |
| `reportWindowExposure(Map)` | 上报窗口曝光 | `properties`: 属性 |
| `trackUserAction(String, Map)` | 上报用户行为 | `distinctId`: 用户唯一标识<br>`properties`: 属性 |
| `stopTrackUserAction()` | 停止用户行为上报 | - |

### 运营场景

| 方法 | 说明 | 参数 |
|------|------|------|
| `getOperationScene(RXRequestCallback)` | 获取运营场景 | `callback`: 回调接口 |

---

## 法务相关接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `legal(Map, RXRequestCallback)` | 法务接口 | `hashMap`: 参数<br>`callback`: 回调接口 |
| `legal(RXRequestCallback)` | 法务接口 | `callback`: 回调接口 |
| `legalTerms(Map, RXRequestCallback)` | 法务条款接口 | `hashMap`: 参数<br>`callback`: 回调接口 |
| `legalTerms(String, RXRequestCallback)` | 法务条款接口 | `keys`: 条款 key<br>`callback`: 回调接口 |

---

## 公告和邮件相关接口

### 公告

| 方法 | 说明 | 参数 |
|------|------|------|
| `getAnnouncement(int, RXRequestCallback)` | 获取公告列表 | `limit`: 获取条数（1-100）<br>`callback`: 回调接口 |
| `getTempNotice(RXRequestCallback)` | 获取临时公告 | `callback`: 回调接口 |

### 邮件

| 方法 | 说明 | 参数 |
|------|------|------|
| `getEmailList(String, RXRequestCallback)` | 获取邮件列表 | `cpUserId`: CP 用户 ID<br>`callback`: 回调接口 |
| `getEmailDetail(String, int, RXRequestCallback)` | 获取邮件详情 | `cpUserId`: CP 用户 ID<br>`emailId`: 邮件 ID<br>`callback`: 回调接口 |
| `getEmailAward(String, int, int, RXRequestCallback)` | 领取邮件道具 | `cpUserId`: CP 用户 ID<br>`type`: 1 领取当前，2 一键领取所有<br>`emailId`: 邮件 ID<br>`callback`: 回调接口 |
| `deleteEmail(String, int, int, RXRequestCallback)` | 删除邮件 | `cpUserId`: CP 用户 ID<br>`type`: 1 删除当前，2 一键删除所有<br>`emailId`: 邮件 ID<br>`callback`: 回调接口 |

---

## 配置和信息获取接口

### 配置

| 方法 | 说明 | 参数 |
|------|------|------|
| `setLanguage(Context, String)` | 设置当前语言 | `context`: Context<br>`language`: 语言码（如 en、zh-Hans） |
| `setSubChannelId(String)` | 设置子渠道 ID | `subChannelId`: 子渠道 ID |
| `setGameInfo(String, String)` | 设置游戏信息 | `roleId`: 角色 ID<br>`regionTag`: 地区标签 |
| `setGameInfo(GameInfo)` | 设置游戏信息 | `gameInfo`: 游戏信息对象 |

### 信息获取

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getFirstBaseUrl()` | 获取当前 BaseUrl | `String` |
| `getOpenId()` | 获取 OpenID | `String` |
| `getDeviceCode(Context)` | 获取设备码 | `String` |
| `getTimeZoneOffset()` | 获取当前时区与 UTC 时差 | `String`（如 +08:00） |
| `getSystemLanguage()` | 获取当前系统语言 | `String` |

---

## 登录状态接口

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `isLogin()` | 判断用户是否已登录 | `boolean` |
| `getLoginData()` | 获取当前登录数据 | `LoginData` |
| `loginOpenidExpireInvalid()` | login_openid 是否失效 | `boolean` |

---

## 生命周期接口

### 自动跟踪

| 方法 | 说明 | 参数 |
|------|------|------|
| `trackingLifecycle(LifecycleOwner)` | 自动跟踪 Activity 生命周期 | `lifecycleOwner`: 生命周期拥有者（AppCompatActivity） |

### Application 生命周期

| 方法 | 说明 | 参数 |
|------|------|------|
| `attachBaseContext(Context)` | Application attachBaseContext 回调 | `context`: Context |
| `onApplicationCreate(Application)` | Application onCreate 回调 | `application`: Application 实例 |

### Activity 生命周期

| 方法 | 说明 | 参数 |
|------|------|------|
| `onCreate(Activity)` | Activity onCreate 回调 | `activity`: Activity 实例 |
| `onCreate(Activity, Bundle)` | Activity onCreate 回调（带状态） | `activity`: Activity 实例<br>`savedInstanceState`: 保存的状态 |
| `onStart(Activity)` | Activity onStart 回调 | `activity`: Activity 实例 |
| `onRestart(Activity)` | Activity onRestart 回调 | `activity`: Activity 实例 |
| `onResume(Activity)` | Activity onResume 回调 | `activity`: Activity 实例 |
| `onPause(Activity)` | Activity onPause 回调 | `activity`: Activity 实例 |
| `onStop(Activity)` | Activity onStop 回调 | `activity`: Activity 实例 |
| `onDestroy(Activity)` | Activity onDestroy 回调 | `activity`: Activity 实例 |

### Activity 事件回调

| 方法 | 说明 | 参数 |
|------|------|------|
| `onNewIntent(Activity, Intent)` | onNewIntent 回调 | `activity`: Activity<br>`intent`: 新的 Intent |
| `onActivityResult(Activity, int, int, Intent)` | onActivityResult 回调 | `activity`: Activity<br>`requestCode`: 请求码<br>`resultCode`: 结果码<br>`data`: 返回数据 |
| `onRequestPermissionsResult(Activity, int, String[], int[])` | 权限请求结果回调 | `activity`: Activity<br>`requestCode`: 请求码<br>`permissions`: 权限数组<br>`grantResults`: 结果数组 |
| `onConfigurationChanged(Activity, Configuration)` | 配置变更回调 | `activity`: Activity<br>`newConfig`: 新配置 |
| `onBackPressed()` | 返回键回调 | - |
| `onWindowFocusChanged(boolean)` | 窗口焦点变更回调 | `hasFocus`: 是否获得焦点 |

---

## 其他接口

### 客服相关

| 方法 | 说明 | 参数 |
|------|------|------|
| `getServiceChatUnreadCount(RXRequestCallback)` | 获取客服未读消息数量 | `callback`: 回调接口 |
| `clearServiceChatUnreadCount(RXRequestCallback)` | 清空客服未读消息数量 | `callback`: 回调接口 |

### 广告归因

| 方法 | 说明 | 参数 |
|------|------|------|
| `addAttribution(Map, RXRequestCallback)` | 媒体平台自定义行为上报 | `params`: 上报数据<br>`callback`: 回调接口 |

---

## 接口统计

### 按模块统计

| 模块 | 接口数量 |
|------|---------|
| SDK 基础功能 | 13 |
| 通行证相关接口 | 25 |
| 社交相关接口 | 19 |
| 游戏区服相关接口 | 12 |
| 支付相关接口 | 3 |
| 分享相关接口 | 11 |
| 版本更新相关接口 | 4 |
| 反馈相关接口 | 7 |
| 达人福利相关接口 | 2 |
| 埋点和运营相关接口 | 6 |
| 法务相关接口 | 4 |
| 公告和邮件相关接口 | 6 |
| 配置和信息获取接口 | 9 |
| 登录状态接口 | 3 |
| 生命周期接口 | 17 |
| 其他接口 | 3 |
| **总计** | **144** |

### 回调类型统计

| 回调类型 | 使用场景 |
|---------|---------|
| `RXRequestCallback` | 大部分异步接口 |
| `RXStringCallback` | 版本更新相关接口 |
| `RXCallback<ShareDataResult>` | 分享数据获取 |
| `OnLogoutCallback` | 登出回调 |
| `OnAppExitCallback` | 退出应用回调 |
| `PrivacyCallback` | 隐私政策回调 |
| `RuiXueSdkCallback` | SDK 全局回调 |

---

## 使用说明

### 基本用法

```java
// 1. 获取 SDK 实例
RXSDK sdk = RXSDK.getInstance();

// 2. 调用接口
LoginParams params = new LoginParams();
params.setMethod("wechat");
sdk.login(params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // 处理响应
    }
    
    @Override
    public void onError(RXException e) {
        // 处理错误
    }
});
```

### 响应格式

所有使用 `RXRequestCallback` 的接口，响应格式统一为：

**成功响应**：

```json
{
  "code": 0,
  "data": {
    // 具体数据
  }
}
```

**失败响应**：

```json
{
  "code": 302001,
  "msg": "token 过期",
  "trace_id": "abc123"
}
```

### 错误码说明

- `1000-1999`: 网络相关错误
- `2000-2999`: 初始化相关错误
- `3000-3999`: 登录相关错误
- `4000-4999`: 支付相关错误
- `5000-5999`: 分享相关错误
- `6000-6999`: 权限相关错误
- `6位整数`: 服务端错误码

详细错误码说明请参考：[错误码文档](../common/specs/error_codes.md)

---

## 相关文档

- [通行证 API 详细文档](./passport_api.md)
- [社交 API 详细文档](./social_api.md)
- [游戏区服 API 详细文档](./gamearea_api.md)
- [回调机制说明](./callback.md)
- [迁移指南](./migration_guide.md)
- [API 设计规范](../common/guidelines/api_design_spec.md)

---

**最后更新**: 2026-01-26  
**维护者**: ROC LEE
