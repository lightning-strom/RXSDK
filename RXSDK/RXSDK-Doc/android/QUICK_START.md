# Android SDK 快速接入指南

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26  
> **来源**: 瑞雪官方文档 + RXSDK 新接口

本文档整合了 Android SDK 的完整接入流程，包括环境配置、SDK 集成、初始化及常用功能接入。

## 📋 目录

- [准备工作](#准备工作)
- [环境要求](#环境要求)
- [隐私权限](#隐私权限)
- [SDK 集成](#sdk-集成)
- [工程配置](#工程配置)
- [生命周期配置](#生命周期配置)
- [SDK 设置](#sdk-设置)
- [SDK 初始化（必须）](#sdk-初始化必须)
- [基础使用](#基础使用)
- [常见场景](#常见场景)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)
- [相关文档](#相关文档)

---

## 准备工作

请登录瑞雪系统初始化相关服务，如果还没有瑞雪账号请查看准备工作说明。

瑞雪系统地址，可登录企业管理后台 > 已部署项目中查看。

## 环境要求

- **Android 5.0（API level 21）或更高版本**

## 隐私权限

SDK 会获取一些设备相关信息，有些信息会涉及到隐私权限。部分渠道审核会有限制，请注意相关配置。

### 设备相关信息

设备相关：（imei、androidid、oaid、sn号、主板、系统 boot 版本号、系统定制商、abi、显示屏参数、无线固件版本号、硬件制造商、硬件序列号、硬件名称、主机名、系统用户名、系统编译类型）hash 32 位生成设备码和 oaid。

### 用途说明

| 用途 | 名称 | 备注 |
|------|------|------|
| 设备码 | 设备唯一标识 | 用于生成游客账号、大数据筛选条件 |
| oaid/caid | 广告标识 | 用于媒体平台投放归因 |

---

## SDK 集成

### 自动化集成（推荐）

在 `app/build.gradle` 文件的 `dependencies` 块中引用瑞雪 SDK 依赖：

```gradle
dependencies {
    implementation 'com.ruixue:rxsdk_base:3.7.36'
}
```

### 混淆配置

在 `proguard-rules.pro` 文件中添加：

```proguard
-keep class com.ruixue.** { *; }
```

---

## 工程配置

### 1. build.gradle (Project)

```gradle
classpath "com.android.tools.build:gradle:4.2.2"
```

### 2. gradle.properties 配置

```properties
android.useAndroidX=true
android.enableJetifier=true

# ysdk 渠道需要添加
android.useNewApkCreator=false

# vivo oppo 等设备无法调试安装加入此配置
android.injected.testOnly=false

# gradle 8.x版本，如果开启混淆功能请添加
android.enableR8.fullMode=false
```

### 3. build.gradle (Module)

```gradle
android {
    compileSdkVersion = 31
    buildToolsVersion = '30.0.3'

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 28
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

### 4. Maven 库地址配置

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }

        // 瑞雪库地址
        maven {
           url 'http://60.205.123.114:8081/repository/maven-releases/'
           allowInsecureProtocol = true
        }
    }
}
```

---

## 生命周期配置

### 方式一：继承 RXApplication（推荐）

```java
import com.ruixue.openapi.RXApplication;

public class GameApplication extends RXApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        // 初始化代码
    }
}
```

### 方式二：手动调用

```java
@Override
public void onCreate() {
    super.onCreate();
    RuiXueSdk.onApplicationCreate(this);
}

@Override
protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    RuiXueSdk.attachBaseContext(base);
}
```

### Activity 生命周期

**自动监听（推荐）**：继承 `AppCompatActivity` 时使用：

```java
RuiXueSdk.trackingLifecycle(this);
```

**手动调用**：继承 `Activity` 时使用：

```java
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RuiXueSdk.onCreate(this);
}

@Override
public void onResume() {
    super.onResume();
    RuiXueSdk.onResume(this);
}

// 其他生命周期方法类似...
```

### AndroidManifest.xml 配置

```xml
<application android:name=".GameApplication">
</application>
```

---

## SDK 设置

### 隐私协议（必须）

使用自定义隐私时，在用户同意隐私协议后调用：

```java
RuiXueSdk.setPrivacyAgree(new PrivacyCallback() {
    @Override
    public void onPrivacyAgree(boolean userClick) {
        // 同意隐私后的逻辑
    }
});

// 判断是否已同意隐私
boolean agreed = RuiXueSdk.isAgreedPrivacy();
```

### 敏感信息采集开关

```java
// 关闭敏感信息采集（需在初始化前调用）
// 注意：关闭后设备码可能重复，游客登录将不可用
RuiXueSdk.disableReadSensitiveInfo(true);
```

### 调试模式

```java
RuiXueSdk.setDebugEnabled(true);
```

### 设置子渠道

```java
// 必须在登录、注册前调用
RuiXueSdk.setSubChannelId("your_sub_channel_id");
```

### 设置语言

```java
RuiXueSdk.setLanguage(this, "zh");
```

**支持的语言**：zh（简体中文）、tc（繁体中文）、ja（日文）、en（英文）、th（泰文）、vi（越南语）、tl（菲律宾语）、id（印尼语）、ar（阿拉伯语）

### 设置地区

```java
RuiXueSdk.setArea("CN");
```

---

## SDK 初始化（必须）

### 初始化参数

- `productId`、`channelId`：在瑞雪游戏发行平台获取
- `cpid`、`baseUrlList`：在瑞雪企业管理后台获取

### 使用 RXSdkInitConfig

```java
String productId = "your_product_id";
String channelId = "your_channel_id";
String cpid = "your_cp_id";

List<String> baseUrlList = new ArrayList<>();
baseUrlList.add("https://api-prod.example.com");
baseUrlList.add("https://api-backup.example.com");

RXSdkInitConfig config = new RXSdkInitConfig(
    cpid, 
    productId, 
    channelId, 
    baseUrlList, 
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            int code = jsonObject.optInt("code", -1);
            if (code == 0) {
                // 初始化成功，可以使用 SDK 功能
            } else {
                // 初始化失败
            }
        }

        @Override
        public void onError(RXException e) {
            // 错误处理
        }
    }
);

// 可选配置
config.setLogEnable(true);
config.setActivity(activity);

// 初始化
RuiXueSdk.initialize(config);
```

---

## 基础使用

### 获取 SDK 实例

初始化完成后，可以通过以下方式获取 SDK 实例：

```java
// 方式一：使用新接口 RXSDK（推荐）
RXSDK sdk = RXSDK.getInstance();

// 方式二：使用底层 API（需要更多控制时）
RXSdkApi api = RXSDK.getApi();
```

### 回调接口

所有异步接口都使用 `RXRequestCallback` 作为回调：

```java
RXRequestCallback callback = new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code");
        if (code == 0) {
            // 成功
            JSONObject data = jsonObject.optJSONObject("data");
        } else {
            // 失败
            String msg = jsonObject.optString("msg");
        }
    }
    
    @Override
    public void onError(RXException e) {
        // 处理异常
    }
};
```

### 响应格式

**成功响应**：

```json
{
  "code": 0,
  "data": { }
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

---

## 常见场景

### 1. 用户登录

```java
RXSDK sdk = RXSDK.getInstance();

// 使用参数对象（推荐）
LoginParams params = new LoginParams();
params.setMethod("wechat");
params.setWxAppId("your_wechat_appid");

sdk.login(activity, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code");
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            String openId = data.optString("openid");
            // 登录成功
        }
    }
    
    @Override
    public void onError(RXException e) {
        // 处理错误
    }
});
```

**常见登录方式**：

```java
// 游客登录
params.setMethod("guest");

// 账号密码登录
params.setMethod("account");
params.setUsername("user");
params.setPassword("password");

// 验证码登录
params.setMethod("captcha");
params.setUsername("13800138000");
params.setCaptchaCode("123456");

// 微信登录
params.setMethod("wechat");

// Apple 登录
params.setMethod("apple");
```

### 2. 用户注册

```java
RegisterParams params = new RegisterParams();
params.setUsername("13800138000");
params.setPassword("password123");
params.setCaptcha_code("123456");

sdk.register(params, callback);
```

### 3. 获取用户信息

```java
sdk.getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            String nickname = data.optString("nickname");
            String avatar = data.optString("avatar");
        }
    }
    
    @Override
    public void onError(RXException e) { }
});
```

### 4. 更新用户信息

```java
UserInfoParams params = new UserInfoParams.Builder()
    .setNickname("新昵称")
    .setAvatarUrl("https://example.com/avatar.png")
    .setRegion("CN")
    .setSex("1")
    .build();

sdk.updateUserInfo(params, callback);
```

### 5. 支付

```java
HQParams payParams = new HQParams();
// 设置支付参数...

sdk.pay(activity, payParams, callback);
```

### 6. 分享

```java
RXShareConfig shareConfig = new RXShareConfig();
// 设置分享配置...

sdk.share(activity, shareConfig, callback);
```

### 7. 埋点上报

```java
Map<String, Object> properties = new HashMap<>();
properties.put("level", 10);
properties.put("scene", "main_menu");

sdk.dataTrack("user_action", openId, properties);
```

### 8. 自定义请求

```java
Map<String, Object> params = new HashMap<>();
String apiPath = "v1/operationapi/legal";

RXSDK.getApi().createRequest(apiPath, params)
    .setRestfulData(false)
    .setNeedLoggedIn(true)
    .postAsync(callback);
```

---

## 错误处理

### 错误码说明

| 区间 | 说明 |
|------|------|
| 1000-1999 | 网络相关错误 |
| 2000-2999 | 初始化相关错误 |
| 3000-3999 | 登录相关错误 |
| 4000-4999 | 支付相关错误 |
| 5000-5999 | 分享相关错误 |
| 6000-6999 | 权限相关错误 |
| 6位整数 | 服务端错误码 |

### 统一错误处理

```java
private void handleError(int code, String msg) {
    switch (code) {
        case 302001:
            // token 过期，需要重新登录
            showLoginDialog();
            break;
        case 3001:
            // 用户名或密码错误
            showToast("用户名或密码错误");
            break;
        default:
            showToast("操作失败：" + msg);
    }
}
```

---

## 最佳实践

### 1. 使用参数对象

```java
// ✅ 推荐
LoginParams params = new LoginParams();
params.setMethod("wechat");
sdk.login(activity, params, callback);

// ❌ 不推荐
sdk.login(activity, map, callback);
```

### 2. 统一回调处理

```java
public class ApiHelper {
    public static RXRequestCallback createCallback(
            Consumer<JSONObject> onSuccess,
            Consumer<RXException> onError) {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                int code = jsonObject.optInt("code");
                if (code == 0) {
                    onSuccess.accept(jsonObject.optJSONObject("data"));
                } else {
                    onError.accept(new RXException(code, jsonObject.optString("msg")));
                }
            }
            
            @Override
            public void onError(RXException e) {
                onError.accept(e);
            }
        };
    }
}
```

### 3. 单例管理

```java
public class SDKManager {
    private static RXSDK sdk;
    
    public static RXSDK getSDK() {
        if (sdk == null) {
            sdk = RXSDK.getInstance();
        }
        return sdk;
    }
}
```

### 4. 线程安全

所有回调都在主线程执行，可以直接更新 UI：

```java
sdk.getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // 已在主线程，可以直接更新 UI
        textView.setText(jsonObject.optString("nickname"));
    }
    
    @Override
    public void onError(RXException e) {
        Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT).show();
    }
});
```

---

## 可选能力

以下为按需接入的扩展能力，接入前请阅读官方说明。

| 能力 | 说明 | 参考文档 |
|------|------|----------|
| 阿里云 HTTPDNS | 海外或解析优化场景，依赖 `ruixue_aliyun_dns`，需在 `RuiXueSdk.initialize` 之前调用 `AliCloudDnsManager.initAppID` | 瑞雪文档中心 |
| 巨量引擎上报 | 投放归因与窗口期上报，依赖 `rxsdk_bytedance_log`，3.7.13 起不再使用 setContext | [巨量引擎接入](https://doc.ruixueyun.com) |
| Quick 渠道支付 | Quick 渠道专用支付接口 `pay()`，参数与 H5 支付类似 | [Quick 支付配置](https://doc.ruixueyun.com/main/#/view?path=9ea39ce6-7b01-40a7-8a28-f29c512b5b36) |
| Unity Android 渠道与推送 | Unity 打 Android 包时的渠道初始化（C# API）及厂商推送配置 | [Unity Android 文档](../unity/ANDROID.md) |

---

## 相关文档

- [接口清单](./api/API_LIST.md)：所有接口的完整列表
- [API 文档](./api/rxsdk_api.md)：详细的 API 文档
- [回调说明](./api/callback.md)：回调接口详细说明
- [通行证 API](./api/passport_api.md)：登录注册相关接口
- [社交 API](./api/social_api.md)：社交功能接口
- [游戏区服 API](./api/gamearea_api.md)：区服角色接口
- [瑞雪文档中心](https://doc.ruixueyun.com)

---

**最后更新**: 2026-02-04  
**维护者**: ROC LEE
