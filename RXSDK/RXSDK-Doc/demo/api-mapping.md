# Demo 功能与 API 文档关联

> 本文档记录 RXSDKDemo 中各功能按钮对应的 API 文档位置
> 方便开发者快速查阅对应的接口说明

## 📋 关联总览

| Demo 功能 | Android API 文档 | iOS API 文档 |
|---|---|---|
| Initialize | [rxsdk_api.md](../android/api/rxsdk_api.md) | [rxservice_api.md](../ios/api/rxservice_api.md) |
| Login | [passport_api.md](../android/api/passport_api.md) | [rxservice_api.md](../ios/api/rxservice_api.md) |
| User Info | [passport_api.md](../android/api/passport_api.md) | [rxapi_service.md](../ios/api/rxapi_service.md) |
| Gameplay | [gamearea_api.md](../android/api/gamearea_api.md) | [rxapi_service.md](../ios/api/rxapi_service.md) |
| Payment | [rxsdk_api.md](../android/api/rxsdk_api.md) | [iap_api.md](../ios/api/iap_api.md) |
| Share | [rxsdk_api.md](../android/api/rxsdk_api.md) | [rxservice_api.md](../ios/api/rxservice_api.md) |
| Analytics | [rxsdk_api.md](../android/api/rxsdk_api.md) | [rxservice_api.md](../ios/api/rxservice_api.md) |
| Feedback | [rxsdk_api.md](../android/api/rxsdk_api.md) | [rxapi_service.md](../ios/api/rxapi_service.md) |
| Deregister | [passport_api.md](../android/api/passport_api.md) | [rxapi_service.md](../ios/api/rxapi_service.md) |

---

## 🔧 Initialize（初始化）

初始化 SDK，是使用所有其他 API 的前提。

### Android

**文档位置**：[rxsdk_api.md](../android/api/rxsdk_api.md)

**相关方法**：
- `RuiXueSdk.init()` - SDK 初始化
- `RuiXueSdk.getApi().getSdkInfo()` - 获取 SDK 信息
- `setPrivacyAgree()` - 隐私政策同意

### iOS

**文档位置**：[rxservice_api.md](../ios/api/rxservice_api.md)

**相关方法**：
- `[[RXService sharedSDK] initWithConfig:complete:]` - 使用配置初始化
- `[[RXService sharedSDK] initWithProductId:channelId:cpid:baseUrlList:complete:]` - 参数初始化

---

## 🔐 Login（登录）

用户登录，支持多种登录方式。

### Android

**文档位置**：[passport_api.md](../android/api/passport_api.md)

**相关方法**：
- `login()` - 登录请求（支持游客、账号、微信、手机等）
- `logout()` - 登出
- `searchHasAccounts()` - 查询账号是否存在

**登录类型**：
- `GUEST` - 游客登录
- `USERNAME` - 账号登录
- `WECHAT` - 微信登录
- `QUICKPHONE` - 快速手机登录
- `CAPTCHACODE` - 验证码登录

### iOS

**文档位置**：[rxservice_api.md](../ios/api/rxservice_api.md)

**相关方法**：
- `loginWithType:args:complete:` - 登录
- `logout:` - 登出
- `autoLoginComplete:` - 自动登录
- `appleLoginComplete:` - Apple 登录

---

## 👤 User Info（用户信息）

获取和管理用户信息。

### Android

**文档位置**：[passport_api.md](../android/api/passport_api.md)

**相关方法**：
- `getUserInfo()` - 获取用户信息
- `editUserInfo()` - 编辑用户信息
- `getNickName()` / `getOpenid()` / `getAvatar()` - 获取用户属性
- `bindPhone()` / `unbindPhone()` - 绑定/解绑手机
- `bindEmail()` / `unbindEmail()` - 绑定/解绑邮箱

### iOS

**文档位置**：[rxapi_service.md](../ios/api/rxapi_service.md)

**相关方法**：
- `getUserInfoComplete:` - 获取用户信息
- `modifyUserInfoWithNickname:avatar:sex:birthday:complete:` - 修改用户信息
- `bindPhoneWithPhone:captchaCode:complete:` - 绑定手机
- `bindEmailWithEmail:captchaCode:complete:` - 绑定邮箱

---

## 🎮 Gameplay（游戏区服）

游戏区服和角色管理。

### Android

**文档位置**：[gamearea_api.md](../android/api/gamearea_api.md)

**相关方法**：
- `searchGameAreaInfo()` - 查询游戏区服信息
- `searchGameAreaListInfo()` - 查询区服列表
- `updateGameAreaInfo()` - 更新区服信息
- `createGameRoleInfo()` - 创建角色
- `updateGameRoleInfo()` - 更新角色
- `searchGameRoleInfo()` - 查询角色信息

### iOS

**文档位置**：[rxapi_service.md](../ios/api/rxapi_service.md)

**相关方法**：
- `createGameAreaWithAreaInfo:complete:` - 创建区服
- `updateGameAreaWithAreaInfo:complete:` - 更新区服
- `createGameRoleWithRoleInfo:complete:` - 创建角色
- `updateGameRoleWithRoleInfo:complete:` - 更新角色

---

## 💰 Payment（支付）

内购支付功能。

### Android

**文档位置**：[rxsdk_api.md](../android/api/rxsdk_api.md)

**相关方法**：
- `pay()` - 支付请求
- `queryPayList()` - 查询支付方式列表
- `queryUnconsumedPurchases()` - 查询未消费订单
- `consumePurchase()` - 消费订单

### iOS

**文档位置**：[iap_api.md](../ios/api/iap_api.md)

**相关方法**：
- `[[RXIAPService sharedSDK] iap:complete:]` - 发起内购
- `queryGoodsInfo:complete:` - 查询商品信息
- `queryUnfinishedOrders:` - 查询未完成订单
- `finishOrder:complete:` - 完成订单
- `getCurrencyInfo:complete:` - 获取货币信息

---

## 📤 Share（分享）

分享功能。

### Android

**文档位置**：[rxsdk_api.md](../android/api/rxsdk_api.md)

**相关方法**：
- `share()` - 分享内容
- `shareToTarget()` - 分享到指定平台

### iOS

**文档位置**：[rxservice_api.md](../ios/api/rxservice_api.md)

**相关方法**：
- `shareWithPlatform:type:content:complete:` - 分享

---

## 📊 Analytics（数据埋点）

数据上报与埋点。

### Android

**文档位置**：[rxsdk_api.md](../android/api/rxsdk_api.md)

**相关方法**：
- `tracking()` - 埋点上报
- `trackingEvent()` - 事件上报
- `uploadCommonInfo()` - 上传通用信息

### iOS

**文档位置**：[rxservice_api.md](../ios/api/rxservice_api.md)

**相关方法**：
- `trackingWithEventName:params:complete:` - 埋点上报

---

## 💬 Feedback（反馈）

用户反馈与客服。

### Android

**文档位置**：[rxsdk_api.md](../android/api/rxsdk_api.md)

**相关方法**：
- `openFeedback()` - 打开反馈页面
- `submitFeedback()` - 提交反馈
- `getFeedbackList()` - 获取反馈列表

### iOS

**文档位置**：[rxapi_service.md](../ios/api/rxapi_service.md)

**相关方法**：
- `submitFeedbackWithContent:imageUrls:complete:` - 提交反馈
- `getFeedbackListWithPage:pageSize:complete:` - 获取反馈列表

---

## 🗑️ Deregister（账号注销）

账号注销功能。

### Android

**文档位置**：[passport_api.md](../android/api/passport_api.md)

**相关方法**：
- `deregister()` - 账号注销
- `cancelDeregister()` - 取消注销

### iOS

**文档位置**：[rxapi_service.md](../ios/api/rxapi_service.md)

**相关方法**：
- `deregisterAccountComplete:` - 账号注销
- `cancelDeregisterAccountComplete:` - 取消注销

---

## 📚 其他参考文档

### Android

| 文档 | 说明 |
|---|---|
| [callback.md](../android/api/callback.md) | 回调接口说明 |
| [QUICK_START.md](../android/api/QUICK_START.md) | 快速开始 |
| [README.md](../android/api/README.md) | 概述 |
| [social_api.md](../android/api/social_api.md) | 社交 API |
| [rxsdk_ui_api.md](../android/api/rxsdk_ui_api.md) | UI 组件 API |
| [ruixue_sdk.md](../android/api/ruixue_sdk.md) | SDK 入口 |

### iOS

| 文档 | 说明 |
|---|---|
| [callback.md](../ios/api/callback.md) | 回调接口说明 |
| [README.md](../ios/api/README.md) | 概述 |
