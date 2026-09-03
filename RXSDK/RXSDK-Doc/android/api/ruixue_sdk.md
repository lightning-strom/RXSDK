# RuiXueSdk 工具类文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> 瑞雪 SDK 主入口工具类，提供初始化、配置、工具方法等静态接口

## 📋 类概览

**类名**：`com.ruixue.RuiXueSdk`

**类型**：`public final class`（工具类，所有方法均为静态方法）

**主要功能**：

- SDK 初始化和配置
- 上下文和 Activity 管理
- SDK 信息获取
- 登录状态管理
- 设备信息管理
- 隐私协议管理
- 日志和调试
- 生命周期管理
- 反馈日志上报
- 其他工具方法

---

## 🔧 常量定义

### `TAG`

SDK 日志标签。

```java
public static final String TAG = "rxsdk";
```

### `SCHEME`

SDK 使用的 URI Scheme。

```java
@Keep
public static final String SCHEME = "ruixue";
```

### `PLATFORM_ID`

平台标识（0-未知，1-android，2-ios）。

```java
@Keep
public static final int PLATFORM_ID = 1;
```

### `START_TIME`

SDK 启动时间戳（毫秒）。

```java
public static final long START_TIME = System.currentTimeMillis();
```

### `DEFAULT_CALLBACK_REQUEST_CODE_OFFSET`

默认回调请求码偏移量。

```java
public static final int DEFAULT_CALLBACK_REQUEST_CODE_OFFSET = 9000;
```

---

## 📱 上下文和 Activity 管理

### `getContext`

获取应用上下文。

**方法签名**：

```java
public static Context getContext()
```

**返回值**：`Context` 应用上下文

**说明**：如果上下文未初始化，会抛出异常。

---

### `getCurrentActivity`

获取当前 Activity。

**方法签名**：

```java
public static Activity getCurrentActivity()
```

**返回值**：`Activity` 当前 Activity，可能为 `null`

---

## ⚙️ SDK 配置信息

### `getProductId`

获取瑞雪产品 ID。

**方法签名**：

```java
public static String getProductId()
```

**返回值**：产品 ID 字符串

---

### `getChannelId`

获取瑞雪渠道 ID。

**方法签名**：

```java
public static String getChannelId()
```

**返回值**：渠道 ID 字符串

---

### `setChannelId`

设置渠道 ID。

**方法签名**：

```java
public static void setChannelId(String channelId)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `channelId` | `String` | 是 | 渠道 ID |

---

### `getSubChannelId`

获取子渠道 ID。

**方法签名**：

```java
public static String getSubChannelId()
```

**返回值**：子渠道 ID 字符串

**说明**：
- 如果允许读取敏感信息，会尝试从 APK 渠道信息或用户数据中获取
- 否则返回全局设置的子渠道 ID

---

### `setSubChannelId`

设置子渠道 ID。

**方法签名**：

```java
public static void setSubChannelId(String subChannelid)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `subChannelid` | `String` | 是 | 子渠道 ID |

---

### `getCpId`

获取瑞雪平台 CPID（商户 ID）。

**方法签名**：

```java
public static String getCpId()
```

**返回值**：CPID 字符串

---

### `getSdkVersion`

获取 SDK 版本号。

**方法签名**：

```java
public static String getSdkVersion()
```

**返回值**：SDK 版本号字符串（如 "3.2.1"）

---

### `getSdkVersionCode`

获取 SDK 版本码。

**方法签名**：

```java
public static String getSdkVersionCode()
```

**返回值**：SDK 版本码字符串

---

### `isOasVersion`

判断是否为 OAS 版本。

**方法签名**：

```java
public static boolean isOasVersion()
```

**返回值**：`true` 表示是 OAS 版本，`false` 表示不是

---

## 🚀 SDK 初始化

### `setInitParams`

设置初始化参数。

**方法签名**：

```java
public static void setInitParams(String cpid, String productid, String channelid, List<String> baseUrls)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cpid` | `String` | 是 | 客户端 ID |
| `productid` | `String` | 是 | 产品 ID |
| `channelid` | `String` | 是 | 渠道 ID |
| `baseUrls` | `List<String>` | 是 | 请求域名队列 |

**异常**：如果参数为空，会抛出 `IllegalArgumentException`

---

### `initialize`（推荐）

使用配置初始化 SDK。

**方法签名**：

```java
public static void initialize(RXSdkInitConfig config)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config` | `RXSdkInitConfig` | 是 | SDK 初始化配置对象 |

**重载方法**：

```java
public static void initialize(Activity activity, RXSdkInitConfig config)
```

**说明**：推荐使用此方法进行初始化。

---

### `initialize`（已废弃）

使用参数初始化 SDK（已废弃，推荐使用 `initialize(RXSdkInitConfig)`）。

**方法签名**：

```java
@Deprecated
public static void initialize(String cpid, String productid, String channelid, List<String> urls, @NonNull RXJSONCallback callback)
```

---

### `isFullyInitialized`

判断 SDK 是否完全初始化完成。

**方法签名**：

```java
public static boolean isFullyInitialized()
```

**返回值**：`true` 表示已完全初始化，`false` 表示未完全初始化

---

## 📝 日志和调试

### `setLogEnable`

设置日志开关。

**方法签名**：

```java
public static void setLogEnable(boolean logEnabled)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `logEnabled` | `boolean` | 是 | `true` 开启日志，`false` 关闭日志 |

---

### `setDebugEnabled`

设置调试模式开关。

**方法签名**：

```java
public static void setDebugEnabled(boolean isDebugEnabled)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `isDebugEnabled` | `boolean` | 是 | `true` 开启调试，`false` 关闭调试 |

---

### `getSDKLog`

获取 SDK 日志列表。

**方法签名**：

```java
public static List<String> getSDKLog()
```

**返回值**：日志字符串列表

---

### `setLogConfig`

设置日志配置。

**方法签名**：

```java
public static void setLogConfig(boolean enable, int maxCount)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 是 | 是否启用日志 |
| `maxCount` | `int` | 是 | 最大日志条数 |

---

### `setErrorMsg`

设置自定义错误码信息。

**方法签名**：

```java
public static void setErrorMsg(Map<String, Map<String, String>> customErrorMsg)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `customErrorMsg` | `Map<String, Map<String, String>>` | 是 | 自定义错误码字典，格式：`{错误码: {语言: 错误信息}}` |

---

## 🔐 密码强度配置

### `setPasswordStrength`

设置密码强度要求。

**方法签名**：

```java
public static void setPasswordStrength(PasswordStrength passwordStrength)
```

**重载方法**：

```java
public static void setPasswordStrength(int passwordStrength)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `passwordStrength` | `PasswordStrength` 或 `int` | 是 | 密码强度枚举或整数值 |

---

### `setPwdPattern`

设置密码格式正则表达式。

**方法签名**：

```java
public static void setPwdPattern(String pwdPattern)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pwdPattern` | `String` | 是 | 密码格式正则表达式 |

---

## 🔒 隐私协议管理

### `isAgreedPrivacy`

判断是否已同意隐私协议。

**方法签名**：

```java
public static boolean isAgreedPrivacy()
```

**返回值**：`true` 表示已同意，`false` 表示未同意

---

### `setPrivacyAgree`

同意用户隐私协议。

**方法签名**：

```java
public static void setPrivacyAgree(PrivacyCallback privacyCallBack)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `privacyCallBack` | `PrivacyCallback` | 是 | 隐私协议回调 |

---

## 👤 登录状态管理

### `isLoggedIn`

判断是否已登录。

**方法签名**：

```java
public static boolean isLoggedIn()
```

**返回值**：`true` 表示已登录，`false` 表示未登录

---

### `logout`

用户登出。

**方法签名**：

```java
public static void logout(OnLogoutCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `OnLogoutCallback` | 否 | 登出回调 |

---

### `exitApp`

退出应用。

**方法签名**：

```java
public static void exitApp(Activity activity, OnAppExitCallback callback)
```

**重载方法**（Unity）：

```java
public static void exitApp(Activity activity, UnityOnAppExitCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | Activity 实例 |
| `callback` | `OnAppExitCallback` 或 `UnityOnAppExitCallback` | 否 | 退出回调 |

**返回值**：`boolean` 是否成功处理退出

---

### `getLoginMethod`

获取当前登录方式。

**方法签名**：

```java
public static String getLoginMethod()
```

**返回值**：登录方式字符串（如 "wechat", "username" 等）

---

### `getOpenid`

获取瑞雪 OpenID。

**方法签名**：

```java
public static String getOpenid()
```

**返回值**：OpenID 字符串，未登录时可能返回 `null`

---

### `getLoginOpenid`

获取加密后的瑞雪 OpenID（二次登录时使用）。

**方法签名**：

```java
public static String getLoginOpenid()
```

**返回值**：加密后的 OpenID 字符串

---

### `loginOpenidExpireInvalid`

判断 `login_openid` 是否失效。

**方法签名**：

```java
public static boolean loginOpenidExpireInvalid()
```

**返回值**：`true` 表示已失效，`false` 表示有效

---

### `getLoginData`

获取当前登录数据。

**方法签名**：

```java
public static @Nullable LoginData getLoginData()
```

**返回值**：`LoginData` 登录数据对象，未登录时返回 `null`

---

### `getCurrentAccessToken`

获取当前登录的 AccessToken。

**方法签名**：

```java
public static AccessToken getCurrentAccessToken()
```

**返回值**：`AccessToken` 对象，未登录时可能返回 `null`

---

### `setAccessTokenChangeCallback`

设置 AccessToken 变更通知回调。

**方法签名**：

```java
public static void setAccessTokenChangeCallback(AccessTokenCallback accessTokenChangeCallback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessTokenChangeCallback` | `AccessTokenCallback` | 否 | AccessToken 变更回调 |

**回调接口**：

```java
public interface AccessTokenCallback {
    void onAccessTokenChanged(AccessToken oldAccessToken, AccessToken newAccessToken);
}
```

---

## 📱 设备信息管理

### `getDeviceCode`

获取设备码。

**方法签名**：

```java
public static String getDeviceCode()
```

**返回值**：设备码字符串

---

### `setDeviceCode`

自定义设备码（在 SDK 初始化前调用，否则 SDK 会自动生成设备码）。

**方法签名**：

```java
public static String setDeviceCode(Context context, String deviceId, boolean replace)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `context` | `Context` | 是 | 上下文 |
| `deviceId` | `String` | 是 | 设备码，建议使用 32 位 hash 字符串 |
| `replace` | `boolean` | 是 | 如果设备码已生成是否强制替换 |

**返回值**：最终生效的设备码

---

### `getDeviceOAID`

获取设备 OAID。

**方法签名**：

```java
public static String getDeviceOAID()
```

**返回值**：OAID 字符串

---

### `setOAID`

设置设备 OAID。

**方法签名**：

```java
public static void setOAID(String oaid)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `oaid` | `String` | 是 | OAID 字符串 |

---

### `getAndroidID`

获取设备 Android ID。

**方法签名**：

```java
public static String getAndroidID()
```

**返回值**：Android ID 字符串

---

### `getDistinctId`

获取客户端随机生成的 ID。

**方法签名**：

```java
public static String getDistinctId()
```

**返回值**：客户端生成的唯一标识符

---

### `disableReadSensitiveInfo`

设置是否禁止读取敏感信息（IMEI、MAC 地址等）。

**方法签名**：

```java
public static void disableReadSensitiveInfo(boolean disabled)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `disabled` | `boolean` | 是 | `true` 禁止读取，`false` 允许读取 |

---

## 📋 反馈日志上报

### `reportFeedbackLog`

上报反馈日志。

**方法签名**：

```java
public static void reportFeedbackLog(Context context, byte[] data, RXJSONCallback callback)
```

**重载方法**：

```java
public static void reportFeedbackLog(Context context, byte[] data, UnityRXRequestCallback callback)

public static void reportFeedbackLog(Context context, String path, RXJSONCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `context` | `Context` | 是 | 上下文 |
| `data` | `byte[]` | 是 | 日志数据（字节数组） |
| `path` | `String` | 是 | 日志文件路径 |
| `callback` | `RXJSONCallback` 或 `UnityRXRequestCallback` | 否 | 回调接口 |

**说明**：
- 文件大小限制：不能超过 `RXGlobalData.LOG_LIMIT`
- 上传流程：先上传到 OSS，然后上报日志 URL 到服务器

---

### `getFeedbackObjectKey`

获取反馈日志的 OSS 对象键。

**方法签名**：

```java
public static String getFeedbackObjectKey()
```

**返回值**：OSS 对象键字符串

---

## 🌐 网络和域名配置

### `sdkBaseUrls`

设置 SDK API 域名地址列表。

**方法签名**：

```java
public static void sdkBaseUrls(List<String> urls)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `urls` | `List<String>` | 是 | 域名地址列表 |

---

### `getBaseUrls`

获取 SDK API 域名地址列表。

**方法签名**：

```java
public static List<String> getBaseUrls()
```

**返回值**：域名地址列表

---

### `getFirstBaseUrl`

获取第一个域名地址。

**方法签名**：

```java
public static String getFirstBaseUrl()
```

**返回值**：第一个域名地址字符串

---

## 🌍 语言和地区配置

### `setLanguage`

设置语言。

**方法签名**：

```java
public static void setLanguage(Activity activity, String language)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | Activity 实例 |
| `language` | `String` | 是 | 语言代码（如 "zh-CN", "en-US"） |

---

### `getLanguage`

获取当前语言。

**方法签名**：

```java
public static String getLanguage()
```

**返回值**：语言代码字符串

---

### `setArea`

设置地区。

**方法签名**：

```java
public static void setArea(String area)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `area` | `String` | 是 | 地区代码 |

---

### `setUnityLanguage`

设置语言（Unity 版本，自动切回主线程）。

**方法签名**：

```java
public static void setUnityLanguage(Activity activity, String language)
```

---

## 📊 埋点和公共属性

### `trackConfig`

配置埋点上报参数。

**方法签名**：

```java
public static void trackConfig(int reportTime, int maxCount)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `reportTime` | `int` | 是 | 上报时间间隔（毫秒） |
| `maxCount` | `int` | 是 | 最大缓存条数 |

---

### `setTrackEnv`

设置埋点环境。

**方法签名**：

```java
public static void setTrackEnv(boolean env)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `env` | `boolean` | 是 | `true` 生产环境，`false` 测试环境 |

---

### `setPublicProperties`

设置公共属性（埋点上报时自动带上）。

**方法签名**：

```java
public static void setPublicProperties(Map<String, Object> publicProperties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `publicProperties` | `Map<String, Object>` | 是 | 公共属性字典 |

---

### `updatePublicProperties`

更新单个公共属性。

**方法签名**：

```java
public static void updatePublicProperties(String key, Object value)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `String` | 是 | 属性键 |
| `value` | `Object` | 是 | 属性值 |

---

### `deletePublicProperties`

删除公共属性。

**方法签名**：

```java
public static void deletePublicProperties(String key)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `String` | 是 | 属性键 |

---

### `setActivatedMap`

设置用户激活时的参数（用于归因分析）。

**方法签名**：

```java
public static void setActivatedMap(Map<String, Object> activatedMap)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activatedMap` | `Map<String, Object>` | 是 | 激活参数字典 |

---

## 🔧 其他工具方法

### `getLoginConfig`

获取登录配置列表。

**方法签名**：

```java
public static List<Map<String, Object>> getLoginConfig()
```

**返回值**：登录配置列表

---

### `jumpToAppStore`

跳转到应用商店。

**方法签名**：

```java
public static boolean jumpToAppStore(Activity activity)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | Activity 实例 |

**返回值**：`true` 表示成功跳转，`false` 表示失败

---

### `getJSONConfig`

获取 SDK 配置的 JSON 字符串。

**方法签名**：

```java
public static String getJSONConfig()
```

**返回值**：JSON 配置字符串

---

### `getWebViewUA`

获取 WebView User-Agent。

**方法签名**：

```java
public static String getWebViewUA()
```

**返回值**：User-Agent 字符串

---

### `getClipboardData`

获取剪贴板数据。

**方法签名**：

```java
public static String getClipboardData()
```

**返回值**：剪贴板内容字符串

---

### `clearClipboardData`

清空剪贴板数据。

**方法签名**：

```java
public static void clearClipboardData()
```

---

### `setScreenCaptureDisable`

设置是否禁止截屏。

**方法签名**：

```java
public static void setScreenCaptureDisable(Activity activity, boolean disable)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | Activity 实例 |
| `disable` | `boolean` | 是 | `true` 禁止截屏，`false` 允许截屏 |

---

### `setUnityScreenCaptureDisable`

设置是否禁止截屏（Unity 版本）。

**方法签名**：

```java
public static void setUnityScreenCaptureDisable(Activity activity, boolean disable)
```

---

### `openURL`

打开 URL（支持 Scheme 跳转）。

**方法签名**：

```java
public static boolean openURL(String url)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `String` | 是 | URL 字符串 |

**返回值**：`true` 表示成功打开，`false` 表示失败

---

### `setRuiXueSdkCallback`

设置瑞雪 SDK 回调。

**方法签名**：

```java
public static void setRuiXueSdkCallback(RuiXueSdkCallback ruiXueSdkCallback)
```

**重载方法**（Unity）：

```java
public static void setRuiXueSdkCallback(UnityRuiXueSdkCallback ruiXueSdkCallback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ruiXueSdkCallback` | `RuiXueSdkCallback` 或 `UnityRuiXueSdkCallback` | 否 | SDK 回调接口 |

---

### `getApi`

获取 SDK API 接口实例。

**方法签名**：

```java
public static IRXSdkApi getApi()
```

**返回值**：`IRXSdkApi` 接口实例

**说明**：推荐使用此方法获取 API 实例，而不是使用已废弃的 `getRXSdkApi()`。

---

## 🔄 生命周期管理

### `trackingLifecycle`

开始跟踪生命周期（使用 LifecycleOwner）。

**方法签名**：

```java
public static void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lifecycleOwner` | `LifecycleOwner` | 是 | 生命周期所有者（如 Activity、Fragment） |

**说明**：使用此方法后，SDK 会自动跟踪生命周期，无需手动调用各个生命周期方法。

---

### `attachBaseContext`

Application 的 `attachBaseContext` 方法（在 `onCreate` 之前执行）。

**方法签名**：

```java
public static void attachBaseContext(Context context)
```

**调用时机**：在 `Application.attachBaseContext()` 中调用。

---

### `onApplicationCreate`

Application 的 `onCreate` 方法。

**方法签名**：

```java
public static void onApplicationCreate(Application application)
```

**调用时机**：在 `Application.onCreate()` 中调用。

---

### `onCreate`

Activity 的 `onCreate` 方法。

**方法签名**：

```java
public static void onCreate(Activity activity)

public static void onCreate(Activity activity, @Nullable Bundle savedInstanceState)
```

**调用时机**：在 `Activity.onCreate()` 中调用。

**说明**：如果已使用 `trackingLifecycle()`，则无需手动调用此方法。

---

### `onNewIntent`

Activity 的 `onNewIntent` 方法。

**方法签名**：

```java
public static void onNewIntent(Activity activity, Intent intent)
```

**调用时机**：在 `Activity.onNewIntent()` 中调用。

---

### `onRestart`

Activity 的 `onRestart` 方法。

**方法签名**：

```java
public static void onRestart(Activity activity)
```

---

### `onStart`

Activity 的 `onStart` 方法。

**方法签名**：

```java
public static void onStart(Activity activity)
```

---

### `onResume`

Activity 的 `onResume` 方法。

**方法签名**：

```java
public static void onResume(Activity activity)
```

---

### `onPause`

Activity 的 `onPause` 方法。

**方法签名**：

```java
public static void onPause(Activity activity)
```

---

### `onStop`

Activity 的 `onStop` 方法。

**方法签名**：

```java
public static void onStop(Activity activity)
```

---

### `onDestroy`

Activity 的 `onDestroy` 方法。

**方法签名**：

```java
public static void onDestroy(Activity activity)
```

---

### `onActivityResult`

Activity 的 `onActivityResult` 方法。

**方法签名**：

```java
public static void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | Activity 实例 |
| `requestCode` | `int` | 是 | 请求码 |
| `resultCode` | `int` | 是 | 结果码 |
| `data` | `Intent` | 否 | 返回数据 |

---

### `onWindowFocusChanged`

Activity 的 `onWindowFocusChanged` 方法。

**方法签名**：

```java
public static void onWindowFocusChanged(boolean hasFocus)
```

---

### `onBackPressed`

Activity 的 `onBackPressed` 方法。

**方法签名**：

```java
public static void onBackPressed()
```

---

### `onRequestPermissionsResult`

Activity 的 `onRequestPermissionsResult` 方法。

**方法签名**：

```java
public static void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults)
```

---

### `onConfigurationChanged`

Activity 的 `onConfigurationChanged` 方法。

**方法签名**：

```java
public static void onConfigurationChanged(Activity activity, Configuration newConfig)
```

---

## 📝 注意事项

1. **初始化顺序**：
   - 必须先调用 `setInitParams()` 或 `initialize()` 初始化 SDK
   - 建议在 `Application.onCreate()` 中初始化

2. **生命周期管理**：
   - 推荐使用 `trackingLifecycle()` 自动管理生命周期
   - 如果未使用自动跟踪，需要在各个生命周期方法中手动调用对应的方法

3. **线程安全**：
   - 所有静态方法都是线程安全的
   - 回调方法会在主线程执行

4. **已废弃方法**：
   - `getRXSdkApi()` → 使用 `getApi()` 替代
   - `init()` / `initialize(String, String, String, List, Callback)` → 使用 `initialize(RXSdkInitConfig)` 替代
   - `setIsDebugEnabled()` → 使用 `setDebugEnabled()` 替代

5. **Unity 支持**：
   - 部分方法提供了 Unity 版本的重载（使用 `Unity*` 回调类型）
   - Unity 版本的方法会自动切回主线程

---

## 🔗 相关文档

- [IRXSdkApi 接口文档](./rxsdk_api.md)：SDK 主要功能接口
- [回调接口说明](./callback.md)：回调接口使用说明
- [多端通用接口设计规范](../common/guidelines/api_design_spec.md)：新接口设计规范
