# RXSDK-iOS Public 类列表

> 统计日期：2026-01-19
> 
> 基于 Xcode 项目 `project.pbxproj` 中 `ATTRIBUTES = (Public, );` 标记
> 
> **筛选条件**：同时拥有 `.h` 和 `.m` 文件的类（排除纯头文件）
> 
> 排除 Pods 依赖，共计 **190** 个 public 类

---

## RXSDKCode（核心 SDK）- 30 个

### 配置类
- RXConfig
- RXSdkInitConfig
- RXDeregisterConfig

### 核心服务
- RXService
- RXApiService
- RXPrivateService

### 用户相关
- RXDestroyAccountService
- RXUserActionLogManager
- RXLoginUIModel

### 日志服务
- RXLogManager
- RXLogService

### 支付服务
- RXIAPService
- RXStoreKitService

### 分享服务
- RXShareService
- RXShareConfig
- RXCustomShareConfig

### 反馈服务
- RXFeedbackService

### 其他服务
- RXOSSPutManager
- RXUWAService
- RXUpdateCheckService
- RXSubPackage
- RXNotificationCenter

### 错误处理
- RXError
- RXErrorTool

### UI 组件
- RXKeyboard
- RXKeyboardPanel

### 网络请求
- RX_CommonRequest
- RX_CommonRequestConfigure
- RX_CommonRequestError
- RX_CommonNetworkExcute
- RX_CommonNetworkExcuteManager

### 工具类
- AppleLogin
- CHDownImage
- NSObject+RXAddition

---

## RXUIKitCode（UI 组件库）- 8 个

### 配置类
- RXLoginUIConfig
- RXUserCenterConfig

### UI 组件
- RXCloseBtn
- RXHUD
- RXWKWebView
- MBProgressHUD

### 服务
- RXUIKitService

### 错误处理
- RXUICommonRequestError

---

## RXOSUIKitCode（海外版 UI）- 3 个

- RXOSUIKitService
- RXOSUILoginConfig
- RXOSUserCenterConfig

---

## RXToolKitCode（工具库）- 4 个

- RXToolKit
- RXPublicWebView
- RXPublicWebBtn
- RXPublicWebViewNaviBarView

---

## RXIMSDKCode（即时通讯 SDK）- 77 个

### 管理器
- RXIMSDKManager
- RXIMInternalManager
- RXIMInternalApi

### 聊天服务
- RXIMChatService
- RXIMChatService+Inner
- RXIMChatService_business

### 会话服务
- RXIMSessionService
- RXIMSessionService+Inner
- RXIMSessionService_business
- RXIMSession
- RXIMSessionServer
- RXIMSessionInterfaceModel
- RXIMJoinSession

### 群组服务
- RXIMGroupService
- RXIMGroupMember

### 搜索服务
- RXIMSearchService
- RXIMSearch
- RXIMSearchRequestModel
- RXIMSearchResultModel

### 收藏服务
- RXIMCollectionService

### RTC 服务
- RXIMRTCService
- RXIMRTCAuthInfo

### 消息相关
- RXIMMessage
- RXIMMessageIMS
- RXIMSendMessage
- RXIMHistoryMsgResp
- RXIMMsgModel
- RXIMMsgHandle
- RXIMMsgContinuityHandle

### 消息内容类型
- RXIMMsgTextContent
- RXIMMsgImageContent
- RXIMMsgAudioContent
- RXIMMsgVideoContent
- RXIMMsgFileContent
- RXIMMsgLBSContent
- RXIMMsgFaceContent
- RXIMMsgCustomContent
- RXIMMsgReplyContent
- RXIMMsgConvTipsContent
- RXIMMsgCombineTransmitContent

### Socket 通信
- RXIMSocket
- RXIMSocketEngine
- RXIMSocketPacket
- RXIMSocketParent
- RXIMSocketUnpack
- RXIMWebSocket
- RXIMDisconnectHandle

### 下载服务
- RXIMDownload

### 工具类
- RXIMCommonDevice
- RXIMCommonTool
- RXIMUserUtility
- RXIMLogManager
- RXModelTransform
- NSObject+RXUAddition

### 错误处理
- RXIMError
- RXIMNetworkError

### 数据模型
- RXIMBaseInterfaceModel
- RXIMApiUrl
- RXIMReplyEmoji

### Protobuf（有 .m 实现）
- GPBArray
- GPBCodedInputStream
- GPBCodedOutputStream
- GPBDescriptor
- GPBDictionary
- GPBExtensionRegistry
- GPBMessage
- GPBRootObject
- GPBUnknownField
- GPBUnknownFieldSet
- GPBUtilities
- GPBWellKnownTypes
- GPBWireFormat
- GPBAny.pbobjc
- GPBApi.pbobjc
- GPBDuration.pbobjc
- GPBEmpty.pbobjc
- GPBFieldMask.pbobjc
- GPBSourceContext.pbobjc
- GPBStruct.pbobjc
- GPBTimestamp.pbobjc
- GPBType.pbobjc
- GPBWrappers.pbobjc
- Control.pbobjc
- RximmessageP.pbobjc

---

## Business（IM 业务层）- 13 个

- ExtendedRXIMInternalApi
- RXIMSDKManager_BS
- RXIMChatService_BS
- RXIMChatService_business_BS
- RXIMSessionService_BS
- RXIMSessionService_business_BS
- RXIMGroupService_BS
- RXIMSearchService_BS
- RXIMSearch_BS
- RXIMCollectionService_BS
- RXIMRTCService_BS
- RXIMSocketEngine_BS
- RXIMDownload_BS

---

## RXAdjustCode（Adjust 归因）- 11 个

- RXAdjust
- RXADJConfig
- RXADJEvent
- RXADJAdRevenue
- RXADJAttribution
- RXADJEventFailure
- RXADJEventSuccess
- RXADJSessionFailure
- RXADJSessionSuccess
- RXADJSubscription
- RXADJThirdPartySharing

---

## RXFacebookSDKCode（Facebook）- 4 个

- RXFacebookService
- RXFBShareLinkContent
- RXFBSharePhotoContent
- RXFBShareVideoContent

---

## RXFirebaseSDKCode（Firebase）- 4 个

- RXFirebaseService
- RXFirebasePush
- RXFIRAnalyticsService
- RXFIRAuthService

---

## RXWXSDKCode（微信）- 2 个

- RXWXService
- RXWXBusinessModel

---

## 其他第三方 SDK（各 1 个服务类）

| 项目 | Public 类 |
|------|-----------|
| RXGoogleSDKCode | RXGoogleService |
| RXLineSDKCode | RXLineService |
| RXTikTokSDK | RXTikTokService |
| RXZaloSDK / Example | RXZaloService |
| RXSnapChatSDKCode | RXSnapChatService |
| RXInsgramSDKCode | RXInstagramService |
| RXRedditSDKCode | RXRedditService |
| RXGameCenterCode | RXGameCenterService |
| RXGPMSDKCode | RXGPMService |
| RXGDTSDKCode | RXGDTService |
| RXASAKitCode | RXASAService |
| RXBDASignalSDKCode | RXBDAsignalService |
| RXPushSDKCode | RXPushService |
| RXOpeninstallSDK | RXOpeninstallService |
| RXOpeninstallOSSDKCode | RXOpeninstallService |
| RXAliDNSSDKCode | RXAliCloudDNSSDKService |
| RXTecentDNSSDKCode | RXTecentCloudDNSSDKService |
| RXAddressBookCode | RXAddressBookService |
| RXAppListSDKCode | RXAppListService |
| RXFeedbackSDKCode | RXPlayerFeedbackService |
| RXLanguageKitCode | RXLanguageService |
| RXUnipinSDKCode | RXUniPinPayService |

### RXQuickSDKCode（Quick SDK）- 2 个
- RXQuickService
- RXQuickInitConfig

---

## 统计摘要

| 项目 | Public 类数量 |
|------|--------------|
| RXIMSDKCode | 77 |
| RXSDKCode | 30 |
| Business | 13 |
| RXAdjustCode | 11 |
| RXUIKitCode | 8 |
| RXToolKitCode | 4 |
| RXFirebaseSDKCode | 4 |
| RXFacebookSDKCode | 4 |
| RXOSUIKitCode | 3 |
| RXWXSDKCode | 2 |
| RXQuickSDKCode | 2 |
| 其他 SDK（各 1 个） | 22 |
| **总计** | **190** |
