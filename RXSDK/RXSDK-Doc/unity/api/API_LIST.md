# Unity SDK 接口清单

> **版本**: 1.6.17  
> **更新日期**: 2026-01-26

本文档列出了 Unity SDK 所有公开接口，按功能模块分类整理。

---

## 目录

- [RuiXueSdk 基础模块](#ruixuesdk-基础模块)
- [RXLogin 登录模块](#rxlogin-登录模块)
- [RXPay 支付模块](#rxpay-支付模块)
- [RXShare 分享模块](#rxshare-分享模块)
- [RXSocial 社交模块](#rxsocial-社交模块)
- [RXLBS 位置服务](#rxlbs-位置服务)
- [RXRank 排行榜](#rxrank-排行榜)
- [其他模块](#其他模块)

---

## RuiXueSdk 基础模块

**命名空间**: `RuiXue`  
**入口类**: `RuiXueSdk`

### 初始化

| 方法 | 说明 | 参数 |
|------|------|------|
| `Initialize(cpid, productid, channelid, urls, onSuccess, onFail)` | SDK 初始化 | cpid, productid, channelid, urls: 服务器列表 |
| `Initialize(config, onResponse, onError)` | SDK 初始化（配置对象） | config: RXSdkInitConfig |
| `InitThirdSdk(map, onResponse, onError)` | 初始化三方渠道 | map: 参数字典 |

### 配置

| 方法 | 说明 | 参数 |
|------|------|------|
| `SetLogEnable(logEnabled)` | 设置日志开关 | logEnabled: bool |
| `SetSubChannelId(subChannelId)` | 设置子渠道 ID | subChannelId: string |
| `SetLanguage(language)` | 设置语言 | language: zh/en/ja 等 |
| `SetArea(area)` | 设置地区 | area: CN/US 等 |
| `SetPasswordStrength(type)` | 设置密码强度 | type: RXPasswordStrength |
| `SetPwdPattern(pattern)` | 设置密码正则 | pattern: string |
| `SetScreenCaptureDisable(disable)` | 禁止截屏 | disable: bool |

### 隐私与防沉迷

| 方法 | 说明 | 参数 |
|------|------|------|
| `IsAgreedPrivacy()` | 是否已同意隐私协议 | 返回 bool |
| `SetPrivacyAgree(callback)` | 同意隐私协议 | callback: PrivacyAgreeDelegate |
| `SetupAddictDelegate(delegate)` | 设置防沉迷代理 | delegate: IAntiAddictDelegate |
| `DisableReadSensitiveInfo(disabled)` | 禁止读取敏感信息 | disabled: bool |

### 网络请求

| 方法 | 说明 | 参数 |
|------|------|------|
| `CreateRequest(url, header, body, method, needLogin, onResponse, onError)` | 创建自定义请求 | 见参数说明 |

### 回调设置

| 方法 | 说明 | 参数 |
|------|------|------|
| `SetSdkCallback(publicDelegate, onLogout, onSwitchAccount)` | 设置全局回调 | 三个回调委托 |

### 邮件系统

| 方法 | 说明 | 参数 |
|------|------|------|
| `GetEmailList(cpUserId, onResponse, onError)` | 获取邮件列表 | cpUserId |
| `GetEmailDetail(cpUserId, emailId, onResponse, onError)` | 获取邮件详情 | cpUserId, emailId |
| `GetEmailAward(cpUserId, type, emailId, onResponse, onError)` | 领取邮件道具 | type: 1单个/2全部 |
| `DeleteEmail(cpUserId, type, emailId, onResponse, onError)` | 删除邮件 | type: 1单个/2全部 |

### 公告系统

| 方法 | 说明 | 参数 |
|------|------|------|
| `GetAnnouncement(limit, onResponse, onError)` | 获取公告列表 | limit: 1-100 |

### 反馈系统

| 方法 | 说明 | 参数 |
|------|------|------|
| `FeedbackCreate(content, attachments, phone, tags, onResponse, onError)` | 创建反馈 | 内容、附件、电话、标签 |
| `GetFeedbackList(page, size, status, onResponse, onError)` | 获取反馈列表 | status: 0全部/1未处理/2已处理 |
| `GetFeedbackDetail(feedbackId, onResponse, onError)` | 获取反馈详情 | feedbackId |
| `FeedbackGetprop(feedbackId, onResponse, onError)` | 领取反馈道具 | feedbackId |

### 福利码

| 方法 | 说明 | 参数 |
|------|------|------|
| `GetPromoDisplayKEY(authRefresh, onResponse, onError)` | 获取达人福利码 | authRefresh: bool |
| `ExchangePromoCDKEY(cdKey, onResponse, onError)` | 兑换福利码 | cdKey: string |

### 其他

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `GetDeviceCode()` | 获取设备码 | string |
| `GetDistinctId()` | 获取客户端随机生成的 distinctId | string |
| `ShowCaptchaVerifyUI(appid, onResponse, onError)` | 显示验证码 UI | - |
| `CheckQuickAp(onResponse, onError)` | 检查免密支付 | - |

---

## RXLogin 登录模块

**命名空间**: `RuiXue.Login`  
**入口类**: `RXLogin`

### 登录注册

| 方法 | 说明 | 参数 |
|------|------|------|
| `Login(config, onResponse, onError)` | 用户登录 | config: LoginConfig |
| `Register(username, password, captchaCode, ext, onResponse, onError)` | 用户注册 | username, password, captchaCode, ext |
| `Logout(onResponse, onError)` | 退出登录 | - |

### 验证码

| 方法 | 说明 | 参数 |
|------|------|------|
| `SendCaptcha(type, target, purpose, onResponse, onError)` | 发送验证码 | type: CaptchaType, target: 手机/邮箱, purpose: 用途 |
| `VerifyCaptcha(type, target, purpose, captchaCode, onResponse, onError)` | 验证验证码 | captchaCode: 验证码 |

### 用户信息

| 方法 | 说明 | 参数 |
|------|------|------|
| `GetUserInfo(onResponse, onError)` | 获取用户信息 | - |
| `GetUserInfoByField(param, onResponse, onError)` | 获取指定用户信息 | param: 请求参数 map |
| `UpdateUserInfo(nickname, avatarUrl, region, sex, onResponse, onError)` | 更新用户信息 | nickname, avatarUrl, region, sex |

### 密码管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `ChangePassword(oldPassword, newPassword, onResponse, onError)` | 修改密码 | oldPassword, newPassword |
| `ResetPassword(username, password, captchaCode, migrateArgs, onResponse, onError)` | 重置密码 | username, password, captchaCode |

### 实名认证

| 方法 | 说明 | 参数 |
|------|------|------|
| `RealAuth(realname, idcard, onResponse, onError)` | 实名认证 | realname: 姓名, idcard: 身份证号 |

### 手机绑定

| 方法 | 说明 | 参数 |
|------|------|------|
| `BindPhone(phone, password, captchaCode, migrateArgs, onResponse, onError)` | 绑定手机 | phone, password, captchaCode |
| `UnBindPhone(phone, captchaCode, onResponse, onError)` | 解绑手机 | phone, captchaCode |
| `ChangePhone(newPhone, newCaptcha, oldCaptcha, migrateArgs, onResponse, onError)` | 修改手机 | 新旧手机号验证码 |

### 邮箱绑定

| 方法 | 说明 | 参数 |
|------|------|------|
| `BindEmail(email, password, captchaCode, migrateArgs, onResponse, onError)` | 绑定邮箱 | email, password, captchaCode |
| `UnBindEmail(email, captchaCode, onResponse, onError)` | 解绑邮箱 | email, captchaCode |

### 账号管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `SearchBindingAccounts(onResponse, onError)` | 查询绑定账号 | - |
| `Deregister(config, onResponse, onError)` | 申请注销账号 | config: RXDeregisterConfig |
| `DeregisterCancel(onResponse, onError)` | 撤销注销申请 | - |

### 配置类

**LoginConfig**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `loginType` | string | 登录类型: guest/account/wechat/captcha 等 |
| `username` | string | 用户名 |
| `password` | string | 密码 |
| `captchaCode` | string | 验证码 |
| `loginOpenId` | string | 二次登录 openid |
| `ext` | Dictionary | 扩展字段 |
| `signFields` | string[] | 签名字段 |
| `migrateArgs` | object | 迁移参数 |
| `permissions` | string[] | 权限列表 |
| `force` | bool | 强制登录 |
| `forbid_visitor` | bool | 禁止游客 |

**CaptchaType**:
| 值 | 说明 |
|------|------|
| `Phone` | 手机验证码 |
| `Email` | 邮箱验证码 |

---

## RXPay 支付模块

**命名空间**: `RuiXue.Pay`  
**入口类**: `RXPay`

### 支付接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `Pay(params, onResponse, onError)` | 发起支付 | params: Dictionary<string, object> |
| `IOS_GetProductInfos(productIds, onResponse, onError)` | [iOS] 获取商品信息 | productIds: List<string> |

### 支付参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `productId` | string | 商品 ID |
| `productName` | string | 商品名称 |
| `amount` | int | 金额（分） |
| `cpOrderId` | string | CP 订单号 |
| `ext` | string | 透传参数 |

---

## RXShare 分享模块

**命名空间**: `RuiXue.Share`  
**入口类**: `RXShare`

### 分享接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `Share(config, onResponse, onError)` | 发起分享 | config: RXShareConfig |
| `GetShareInfo(config, onResponse, onError)` | 获取分享信息 | config: RXShareConfig |
| `GetShortUrl(url, onResponse, onError)` | 获取短链接 | url: string |
| `ShareSchedulingInit(funcs, onResponse, onError)` | 分享调度初始化 | funcs: string[] |
| `GetShareScheduling(funcs)` | 获取分享调度 | funcs: string[] |

---

## RXSocial 社交模块

**命名空间**: `RuiXue.Social`  
**入口类**: `RXSocial`

### 好友管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `AddFriends(target, targetRemarks, userRemarks, onResponse, onError)` | 添加好友 | target: OpenID |
| `RemoveFriends(target, onResponse, onError)` | 删除好友 | target: OpenID |
| `UpdateFriendRemarks(target, remarks, onResponse, onError)` | 更新好友备注 | target, remarks |
| `IsFriend(target, onResponse, onError)` | 判断好友关系 | target: OpenID |
| `RelationFriends(onResponse, onError)` | 获取好友列表 | - |

### 自定义关系

| 方法 | 说明 | 参数 |
|------|------|------|
| `RelationAdd(target, types, targetRemarks, userRemarks, onResponse, onError)` | 添加关系 | types: Dictionary |
| `RelationDelete(target, types, onResponse, onError)` | 删除关系 | types: Dictionary |
| `HasRelation(target, type, onResponse, onError)` | 判断关系 | type: string |
| `RelationList(type, onResponse, onError)` | 关系列表 | type: string |
| `UpdateRemarks(target, type, remarks, onResponse, onError)` | 更新备注 | type, remarks |

### 用户自定义

| 方法 | 说明 | 参数 |
|------|------|------|
| `UserSetCustom(custom, onResponse, onError)` | 设置用户自定义信息 | custom: string |

---

## RXLBS 位置服务

**命名空间**: `RuiXue.LBS`  
**入口类**: `RXLBS`

### LBS 接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `LbsUpdate(types, longitude, latitude, onResponse, onError)` | 更新位置 | types: string[], lon/lat: float |
| `LbsRadius(types, longitude, latitude, radius, count, page, pageSize, onResponse, onError)` | 查询附近 | radius: 半径, count: 数量 |
| `LbsDelete(types, onResponse, onError)` | 删除位置 | types: string[] |

---

## RXRank 排行榜

**命名空间**: `RuiXue.Rank`  
**入口类**: `RXRank`

### 排行榜接口

| 方法 | 说明 | 参数 |
|------|------|------|
| `AddScore(rankId, score, onResponse, onError)` | 增加分数 | rankId, score |
| `SetScore(rankId, score, onResponse, onError)` | 设置分数 | rankId, score |
| `QueryUserRank(rankId, openId, onResponse, onError)` | 查询排名 | rankId, openId |
| `GetRankList(rankId, startRank, endRank, onResponse, onError)` | 排行榜列表 | startRank, endRank |
| `FriendsRank(rankId, onResponse, onError)` | 好友排行榜 | rankId |

---

## 其他模块

### RXLegal 法务模块

**命名空间**: `RuiXue.Legal`

| 方法 | 说明 |
|------|------|
| `Legal(params, onResponse, onError)` | 法务接口 |
| `LegalTerms(keys, onResponse, onError)` | 法务条款 |

### RXFeedback 反馈模块

**命名空间**: `RuiXue.Feedback`

| 方法 | 说明 |
|------|------|
| `GetFeedbackKindList(onResponse, onError)` | 获取反馈类型列表 |
| `CreateFeedback(params, onResponse, onError)` | 创建反馈 |
| `SatisfactionEvaluation(params, onResponse, onError)` | 满意度评价 |

### RXVersionCheck 版本更新

**命名空间**: `RuiXue.VersionCheck`

| 方法 | 说明 |
|------|------|
| `UpdateApp(version, region, queryMap, onResponse, onError)` | 应用更新 |
| `CheckUpdateApp(version, region, type, queryMap, onResponse, onError)` | 检查更新 |

### RXAnalysis 数据埋点

**命名空间**: `RuiXue.Analysis`

| 方法 | 说明 |
|------|------|
| `DataTrack(eventName, distinctId, properties)` | 埋点上报 |
| `ReportWindowExposure(properties)` | 窗口曝光上报 |
| `TrackUserAction(distinctId, properties)` | 用户行为上报 |
| `StopTrackUserAction()` | 停止行为上报 |

### RXFirebase Firebase 服务

**命名空间**: `RuiXue.Firebase`

| 方法 | 说明 |
|------|------|
| `Configure()` | 配置 Firebase |
| `LogEvent(name, parameters)` | 事件上报 |
| `SetUserProperty(name, value)` | 设置用户属性 |
| `SetUserId(userId)` | 设置用户 ID |

### RXAdjust 归因

**命名空间**: `RuiXue.Adjust`

| 方法 | 说明 |
|------|------|
| `AppDidLaunch(config)` | 启动 Adjust |
| `TrackEvent(event)` | 事件追踪 |
| `GetAdid()` | 获取 Adjust ID |

---

## 接口统计

| 模块 | 接口数量 |
|------|---------|
| RuiXueSdk 基础模块 | 25+ |
| RXLogin 登录模块 | 18+ |
| RXPay 支付模块 | 2+ |
| RXShare 分享模块 | 5+ |
| RXSocial 社交模块 | 10+ |
| RXLBS 位置服务 | 3 |
| RXRank 排行榜 | 5 |
| 其他模块 | 20+ |
| **总计** | **90+** |

---

## 回调类型

| 委托类型 | 使用场景 |
|---------|---------|
| `RequestResponseDelegate` | 大部分异步接口成功回调 |
| `RequestErrorDelegate` | 大部分异步接口失败回调 |
| `LogoutDelegate` | 登出回调 |
| `SwitchAccountDelegate` | 切换账号回调 |
| `PublicDelegate` | 全局通用回调 |
| `PrivacyAgreeDelegate` | 隐私协议回调 |

---

## 相关文档

- [回调机制说明](./callback.md)
- [初始化与配置](./01_init.md)
- [账号登录](./02_login.md)
- [支付](./03_pay.md)

---

**最后更新**: 2026-01-26  
**维护者**: ROC LEE
