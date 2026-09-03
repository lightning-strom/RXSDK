# IRXSdkApi 接口文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> 瑞雪 SDK 主入口接口定义，包含接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`com.ruixue.openapi.IRXSdkApi`

**回调约定**：所有接口统一使用 `RXRequestCallback`，回调在主线程执行。详见[回调接口说明](./callback.md)

**继承关系**：

```java
public interface IRXSdkApi extends IPassportApi, ISocialApi, IGameAreaApi
```

**主要功能**：

- SDK 基础信息与插件管理
- 隐私政策与防沉迷
- 支付功能
- 分享功能
- 法务相关
- 版本更新
- 反馈与客服
- 埋点数据上报
- 游戏信息管理

**参考文档**：

- [瑞雪云文档](https://doc.ruixueyun.com/main/#/view?path=79e266cd-2224-44cd-afb0-4762bb3cd7ed)

---

## 🔧 SDK 基础功能

### `getSdkInfo`

获取 SDK 信息。

**方法签名**：

```java
SdkInfo getSdkInfo()
```

**返回值**：`SdkInfo` 对象，包含 SDK 版本、渠道等信息

---

### `getChannel`

获取渠道信息。

**方法签名**：

```java
String getChannel()
```

**返回值**：渠道标识字符串

---

### `registerPlugin`

注册第三方插件 SDK。

**方法签名**：

```java
void registerPlugin(IPluginSdk thirdSdk)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `thirdSdk` | `IPluginSdk` | 是 | 第三方插件 SDK 实例 |

---

### `unregisterPlugin`

注销第三方插件 SDK。

**方法签名**：

```java
void unregisterPlugin(IPluginSdk thirdSdk)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `thirdSdk` | `IPluginSdk` | 是 | 第三方插件 SDK 实例 |

---

### `getPlugins`

获取所有已注册的插件。

**方法签名**：

```java
Map<String, IPluginSdk> getPlugins()
```

**返回值**：插件 Map，key 为插件标识，value 为插件实例

---

### `createRequest`

创建自定义接口请求。

**方法签名**：

```java
IRXRequest createRequest(String api, Map<String, Object> bodyMap)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `api` | `String` | 是 | 接口路径 |
| `bodyMap` | `Map<String, Object>` | 是 | 接口参数 |

**返回值**：`IRXRequest` 请求对象，可用于进一步配置和发送请求

---

## 🔒 隐私与防沉迷

### `setPrivacyAgree` (重载方法 1)

同意隐私政策（带回调）。

**方法签名**：

```java
void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `context` | `Context` | 是 | 应用上下文 |
| `privacyCallBack` | `PrivacyCallback` | 是 | 隐私政策回调 |

---

### `setPrivacyAgree` (重载方法 2)

设置隐私政策同意状态。

**方法签名**：

```java
void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `context` | `Context` | 是 | 应用上下文 |
| `isAgree` | `boolean` | 是 | 是否同意 |
| `privacyCallback` | `PrivacyCallback` | 是 | 隐私政策回调 |

---

### `isAgreedPrivacy`

检查是否已同意隐私政策。

**方法签名**：

```java
boolean isAgreedPrivacy()
```

**返回值**：`boolean`，已同意返回 `true`

---

### `setupAddictDelegate`

初始化前调用防沉迷业务处理（快手、华为等渠道）。

**方法签名**：

```java
void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `antiAddictDelegate` | `AntiAddictDelegate` | 是 | 防沉迷回调 |

---

### `jumpToAppStore`

跳转到应用商店。

**方法签名**：

```java
boolean jumpToAppStore(Activity activity)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |

**返回值**：`boolean`，是否成功跳转

---

## 💰 支付功能

### `pay` (重载方法 1)

支付（Map 参数）。

**方法签名**：

```java
void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `hashMap` | `Map<String, Object>` | 是 | 支付参数 Map，参照参数表 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `pay` (重载方法 2)

支付（HQParams 参数）。

**方法签名**：

```java
void pay(Activity activity, HQParams payParams, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `payParams` | `HQParams` | 是 | 支付参数对象 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 📤 分享功能

### `share`

分享。

**方法签名**：

```java
void share(Activity activity, RXShareConfig shareConfig, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `shareConfig` | `RXShareConfig` | 是 | 分享配置对象，包含：<br>- `func`：埋点标识（string）<br>- `platform`：分享平台（string）<br>- `region`：地区码（string）<br>- `transmits`：透传参数（string）<br>- `protocol_ios`：iOS 唤醒协议（string）<br>- `protocol_android`：Android 唤醒协议（string）<br>- `use_scheme`：是否使用游戏协议（string，0/1）<br>- `read_cache`：是否读取缓存（bool）<br>- `auto_report`：是否自动上报（bool，默认 true）<br>- `shareScene`：分享场景（int）<br>- `useShortUrl`：是否使用短链接（bool）<br>- `ext`：扩展字段（Map）<br>- `properties`：属性（Map）<br>- `custom_ext`：自定义扩展（Map）<br>- `game_info`：游戏信息（Map） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `shareCustom`

自定义分享。

**方法签名**：

```java
void shareCustom(Activity activity, RXCustomShareConfig config, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `config` | `RXCustomShareConfig` | 是 | 自定义分享配置对象，包含：<br>- `show_content_in_circle`：是否在朋友圈显示内容（Boolean）<br>- `appid`：第三方 AppID（String）<br>- `openId`：微信 OpenID（String）<br>- `username`：用户名（String）<br>- `path`：路径（String）<br>- `use_scheme`：是否使用协议（String）<br>- `protocol_ios`：iOS 协议（String）<br>- `protocol_android`：Android 协议（String）<br>- `withShareTicket`：是否带 ShareTicket（Boolean，默认 true）<br>- `extData`：扩展数据（String） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getShareInfo`

获取分享信息。

**方法签名**：

```java
void getShareInfo(RXShareConfig shareConfig, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `shareConfig` | `RXShareConfig` | 是 | 分享配置对象 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getShareData` (重载方法 1)

获取分享埋点数据（RXRequestCallback）。

**方法签名**：

```java
void getShareData(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `appType`：应用类型（string，非必须，小游戏需要传 `minigame`）<br>- `func`：埋点标识（string，必须）<br>- `transmitargs`：透传参数，原样返回（string，非必须）<br>- `custom`：自定义参数，URLENCODE（string，非必须）<br>- `method`：分享方式（string，非必须），1 广告，2 好友列表，4 朋友圈（2+4 正常分享），8 指定分享<br>- `share_from`：分享人瑞雪 OpenID（string，非必须）<br>- `share_first`：首次分享人瑞雪 OpenID（string，非必须）<br>- `region`：地区码（string，必须，取不到传空字符串） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getShareData` (重载方法 2)

获取分享埋点数据（RXCallback）。

**方法签名**：

```java
void getShareData(Map<String, Object> map, RXCallback<ShareDataResult> callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `map` | `Map<String, Object>` | 是 | 参数 Map（同重载方法 1） |
| `callback` | `RXCallback<ShareDataResult>` | 是 | 回调接口，返回 `ShareDataResult` 对象 |

---

### `shareReport` (重载方法 1)

上报分享数据（Map 参数）。

**方法签名**：

```java
void shareReport(String distinctId, Map<String, Object> properties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `distinctId` | `String` | 是 | 用户唯一标识 |
| `properties` | `Map<String, Object>` | 是 | 属性 Map |

---

### `shareReport` (重载方法 2)

上报分享数据（ShareDataResult 对象）。

**方法签名**：

```java
void shareReport(ShareDataResult shareDataResult)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `shareDataResult` | `ShareDataResult` | 是 | 分享数据结果对象 |

---

### `shareSchedulingInit`

分享调度初始化。

**方法签名**：

```java
void shareSchedulingInit(String[] funcs, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `funcs` | `String[]` | 是 | 埋点标识数组 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getShareScheduling`

获取分享调度信息。

**方法签名**：

```java
Map<String, Object> getShareScheduling(String... func)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `func` | `String...` | 是 | 埋点标识（可变参数） |

**返回值**：`Map<String, Object>`，分享调度信息

---

### `shareSchedulingReport`

上报分享调度数据。

**方法签名**：

```java
void shareSchedulingReport(
    String func,
    String platform,
    String region,
    boolean scheduling_event,
    String scheduling_type,
    String transmits,
    @NonNull Map<String, Object> properties,
    RXRequestCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `func` | `String` | 是 | 埋点标识 |
| `platform` | `String` | 是 | 分享平台 |
| `region` | `String` | 是 | 地区码 |
| `scheduling_event` | `boolean` | 是 | 是否调度事件 |
| `scheduling_type` | `String` | 是 | 调度类型 |
| `transmits` | `String` | 是 | 透传参数 |
| `properties` | `Map<String, Object>` | 是 | 属性 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getShortUrl`

获取短链接。

**方法签名**：

```java
void getShortUrl(@NonNull String url, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `String` | 是 | 原始 URL |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## ⚖️ 法务相关

### `legal` (重载方法 1)

法务接口（Map 参数）。

**方法签名**：

```java
void legal(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `legal` (重载方法 2)

法务接口（无参数）。

**方法签名**：

```java
void legal(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `legalTerms` (重载方法 1)

获取法务条款（Map 参数）。

**方法签名**：

```java
void legalTerms(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `legalTerms` (重载方法 2)

获取法务条款（keys 参数）。

**方法签名**：

```java
void legalTerms(String keys, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keys` | `String` | 是 | 条款 key |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 🔄 版本更新

### `updateApp`

更新应用。

**方法签名**：

```java
void updateApp(String version, String region, Map<String, Object> queryMap, RXStringCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `version` | `String` | 是 | 客户端版本号，3 段或 4 段 |
| `region` | `String` | 是 | 地区码 |
| `queryMap` | `Map<String, Object>` | 是 | 查询参数，包含：<br>- `type`：脚本类型（默认 json，可选 lua、u3d）<br>- `format`：输出文件后缀（默认 json，可选 lua） |
| `callback` | `RXStringCallback` | 是 | 回调接口 |

---

### `checkUpdateApp`

检查应用更新。

**方法签名**：

```java
void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `version` | `String` | 是 | 客户端版本号，3 段或 4 段 |
| `region` | `String` | 是 | 地区码，默认 0 |
| `type` | `String` | 是 | 脚本类型（默认 js，可选 lua、u3d） |
| `queryMap` | `Map<String, Object>` | 是 | 查询参数，包含：<br>- `games`：`{"games":{"游戏id": 客户端游戏版本}}`<br>- `activities`：`{"activities":{"活动别名": 客户端活动版本}}` |
| `callback` | `RXStringCallback` | 是 | 回调接口 |

---

### `updateActivity`

活动版本检查。

**方法签名**：

```java
void updateActivity(
    String activityShortname,
    String activityVersion,
    String activityCheckVersion,
    Map<String, Object> queryMap,
    RXStringCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activityShortname` | `String` | 是 | 活动别名 |
| `activityVersion` | `String` | 是 | 客户端版本号 |
| `activityCheckVersion` | `String` | 是 | 优先检查这个版本，没用再返回最新版本 |
| `queryMap` | `Map<String, Object>` | 是 | 查询参数，包含：<br>- `type`：脚本类型（默认 json，可选 lua、u3d）<br>- `format`：输出文件后缀（默认 json，可选 lua） |
| `callback` | `RXStringCallback` | 是 | 回调接口 |

---

### `updateGame`

游戏版本检查。

**方法签名**：

```java
void updateGame(
    String gameId,
    String gameVersion,
    String gameCheckVersion,
    Map<String, Object> queryMap,
    RXStringCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `gameId` | `String` | 是 | 游戏 ID |
| `gameVersion` | `String` | 是 | 客户端版本号 |
| `gameCheckVersion` | `String` | 是 | 优先检查这个版本，没用再返回最新版本 |
| `queryMap` | `Map<String, Object>` | 是 | 查询参数，包含：<br>- `type`：脚本类型（默认 json，可选 lua、u3d）<br>- `format`：输出文件后缀（默认 json，可选 lua） |
| `callback` | `RXStringCallback` | 是 | 回调接口 |

---

## 💬 反馈与客服

### `getFeedbackKindList`

获取反馈类型列表。

**方法签名**：

```java
void getFeedbackKindList(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `createFeedback`

创建反馈。

**方法签名**：

```java
void createFeedback(Map<String, Object> map, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `map` | `Map<String, Object>` | 是 | 反馈参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `satisfactionEvaluation`

满意度评价。

**方法签名**：

```java
void satisfactionEvaluation(Map<String, Object> map, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `map` | `Map<String, Object>` | 是 | 评价参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getServiceChatUnreadCount`

获取客服未读消息数量。

**方法签名**：

```java
void getServiceChatUnreadCount(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `clearServiceChatUnreadCount`

清空客服未读消息数量。

**方法签名**：

```java
void clearServiceChatUnreadCount(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 🎁 福利码

### `getPromoDisplayKEY`

获取达人游戏内显示福利码。

**方法签名**：

```java
void getPromoDisplayKEY(boolean authRefresh, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `authRefresh` | `boolean` | 是 | 是否自动刷新 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `exchangePromoCDKEY`

兑换达人福利码。

**方法签名**：

```java
void exchangePromoCDKEY(String cdKey, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cdKey` | `String` | 是 | 福利码（dataKey） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 📊 埋点数据上报

### `dataTrack` (重载方法 1)

埋点数据上报（基础版本）。

**方法签名**：

```java
boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `eventName` | `String` | 是 | 埋点标识事件 |
| `distinctId` | `String` | 是 | 用户唯一标识，一般为 OpenID |
| `properties` | `Map<String, Object>` | 是 | CP 自定义属性（由 CP 调用时传入） |

**返回值**：`boolean`，是否上报成功

---

### `dataTrack` (重载方法 2)

埋点数据上报（带缓存配置）。

**方法签名**：

```java
boolean dataTrack(
    String eventName,
    String distinctId,
    Map<String, Object> properties,
    int flushInterval,
    int maxCacheCount
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `eventName` | `String` | 是 | 埋点标识事件 |
| `distinctId` | `String` | 是 | 用户唯一标识，一般为 OpenID |
| `properties` | `Map<String, Object>` | 是 | CP 自定义属性（由 CP 调用时传入） |
| `flushInterval` | `int` | 是 | 上报时间间隔（毫秒） |
| `maxCacheCount` | `int` | 是 | 最大缓存条数 |

**返回值**：`boolean`，是否上报成功

---

### `reportWindowExposure`

上报窗口曝光。

**方法签名**：

```java
void reportWindowExposure(Map<String, Object> properties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `properties` | `Map<String, Object>` | 是 | 属性 Map |

---

### `trackUserAction`

上报用户行为。

**方法签名**：

```java
void trackUserAction(String distinctId, Map<String, Object> properties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `distinctId` | `String` | 是 | 用户唯一标识 |
| `properties` | `Map<String, Object>` | 是 | 属性 Map |

---

### `stopTrackUserAction`

停止用户行为上报。

**方法签名**：

```java
void stopTrackUserAction()
```

---

### `getOperationScene`

获取运营场景。

**方法签名**：

```java
void getOperationScene(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 🎮 游戏信息管理

### `setGameInfo` (重载方法 1)

设置游戏信息（简单参数）。

**方法签名**：

```java
void setGameInfo(String roleId, String regionTag)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `roleId` | `String` | 是 | 角色 ID |
| `regionTag` | `String` | 是 | 区服标签 |

---

### `setGameInfo` (重载方法 2)

设置游戏信息（GameInfo 对象）。

**方法签名**：

```java
void setGameInfo(GameInfo gameInfo)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `gameInfo` | `GameInfo` | 是 | 游戏信息对象，包含：<br>- `serverName`：服务器名称（String）<br>- `serverId`：服务器 ID（String）<br>- `roleName`：角色名称（String）<br>- `roleId`：角色 ID（String）<br>- `gameRoleLevel`：角色等级（String，默认 "1"）<br>- `type`：操作类型（int，1-4）：1 角色创建，2 进入游戏，3 角色升级，4 角色退出<br>- `roleCreateTime`：角色创建时间（long，type=1 时必传）<br>- `partyId`：工会 ID（String，可选）<br>- `partyName`：工会名称（String，可选）<br>- `attach`：额外字段（String，可选）<br>- `experience`：经验值（String，可选）<br>- `vipLevel`：VIP 等级（int，可选）<br>- `gameRolePower`：战力（int，可选）<br>- `balance`：余额（String，可选） |

---

### `searchGameAccount`

查询角色信息。

**方法签名**：

```java
void searchGameAccount(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateGameVersion`

更新游戏版本。

**方法签名**：

```java
void updateGameVersion(Map<String, Object> body, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `body` | `Map<String, Object>` | 是 | 请求体 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 🔐 第三方 SDK 初始化

### `initThirdSdk`

初始化第三方 SDK（百度网讯、抖音、快手、YSDK 等）。

**方法签名**：

```java
void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `hashMap` | `Map<String, Object>` | 是 | 初始化参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**说明**：

- SDK 登出：百度网讯、抖音、快手、YSDK
- login 登录
- logoff/logout 登出：快手、抖音、百度
- exitApp 退出：快手

---

### `checkQuickAp`

检查快速 AP。

**方法签名**：

```java
void checkQuickAp(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `login` (重载方法)

登录（Map 参数，用于第三方 SDK 登录）。

**方法签名**：

```java
void login(Activity activity, Map<String, Object> map, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用 Activity |
| `map` | `Map<String, Object>` | 是 | 登录参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 📝 重构注意事项

### 1. 接口继承关系

- `IRXSdkApi` 继承了 `IPassportApi`、`ISocialApi`、`IGameAreaApi`
- 重构时需确保继承的方法签名保持一致
- 参考文档：
  - [`passport_api.md`](./passport_api.md)
  - [`social_api.md`](./social_api.md)
  - [`gamearea_api.md`](./gamearea_api.md)

### 2. 错误处理

- 所有接口失败必须返回统一错误结构：`code`（int）、`msg`（string）
- 服务端错误码为 6 位整数，需原样透传
- 客户端错误码使用 4 位（参考错误码规范）

### 3. 参数类型

- 大量接口使用 `Map<String, Object>` 作为参数，提供灵活性但缺少类型安全
- 重构时可考虑引入强类型参数对象，但需保持向后兼容

### 4. 分享配置对象

- `RXShareConfig` 和 `RXCustomShareConfig` 包含大量可选字段
- 重构时需保持字段的序列化/反序列化逻辑

### 5. 游戏信息对象

- `GameInfo` 包含必填和可选字段
- `type` 字段表示操作类型（1-4），需在文档中明确说明
- `type=1`（角色创建）时，`roleCreateTime` 为必填

### 6. 埋点数据上报

- `dataTrack` 方法提供两种重载：基础版本和带缓存配置版本
- 重构时需确保缓存逻辑的正确性

### 7. 版本更新

- 版本号格式：3 段或 4 段
- 脚本类型支持：json（默认）、lua、u3d
- 输出格式支持：json（默认）、lua

### 8. 第三方 SDK 集成

- `initThirdSdk` 用于初始化第三方 SDK（百度、抖音、快手、YSDK 等）
- 不同渠道的登录/登出/退出行为可能不同，需在文档中明确说明

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
- [错误格式说明](../../common/api/01_error_format.md)
- [Passport API 文档](./passport_api.md)
- [Social API 文档](./social_api.md)
- [GameArea API 文档](./gamearea_api.md)
- [瑞雪云文档](https://doc.ruixueyun.com/main/#/view?path=79e266cd-2224-44cd-afb0-4762bb3cd7ed)
