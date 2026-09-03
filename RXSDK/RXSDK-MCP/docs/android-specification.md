# 瑞雪 SDK Android 接入规范

## 1. 依赖配置

### 1.1 Maven 仓库配置

在项目根目录 `build.gradle` 中添加 Maven 仓库:

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }

        //瑞雪库地址
        maven {
        url 'http://60.205.123.114:8081/repository/maven-releases/'
            allowInsecureProtocol = true
        }

        //备用地址[可选]
        maven {
            credentials {
            username '600685104fb2132a19e09a29'
            password '2IfrbLKz50J1'
            }
            url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
        }
    }
}
```

### 1.2 SDK 渠道选择

根据上架的应用商店选择对应的渠道包 (**必选其一**):

| 渠道名称 | Artifact | 说明 |
|---------|----------|------|
| 自运营 | `rxsdk_weile` | 自运营渠道库 |
| 百度网讯 | `rxsdk_baidu_wahngxun` | 百度游戏中心 |
| YSDK 应用宝 | `rxsdk_ysdk` | 用于应用宝应用商店上架 |
| vivo | `rxsdk_vivo` | 用于 vivo 应用商店上架 |
| oppo | `rxsdk_oppo` | 用于 oppo 应用商店上架 |
| 华为 | `rxsdk_huawei` | 用于华为应用商店上架 |
| 小米 | `rxsdk_xiaomi` | 用于小米应用商店上架 |
| 抖音 | `rxsdk_douyin_gb` | 用于抖音联运 |
| 快手 | `rxsdk_kwaiallin` | 用于快手联运 |
| TapTap | `rxsdk_taptap` | 用于 TapTap 应用商店上架 |
| Google Play | `rxsdk_overseas` | 用于 Google Play 应用商店上架 |
| Qoo | `overseas:rxsdk_qoo` | 用于 Qoo 应用商店上架 |
| 九游 | `rxsdk_9game` | 用于九游应用上架 |
| 007 | `rxsdk_007` | 用于 007 应用上架 |
| Quick | `rxsdk_quick` | 用于 Quick 应用上架 |
| 哔哩哔哩 | `rxsdk_bilibili` | 用于 Bilibili 渠道 |
| 4399 | `rxsdk_4399` | 用于 4399 渠道 |
| 荣耀 | `rxsdk_honor` | 用于荣耀渠道 |
| 雷电模拟器 | `rxsdk_ld` | 用于雷电模拟器渠道 |
| MuMu 模拟器 | `rxsdk_yofun` | 用于 MuMu 模拟器渠道 |
| 虎牙联运 | `rxsdk_huya` | 用于虎牙联运上架；接入说明见 [android-huya.md](android-huya.md) |
| 海外 oppo | `rxsdk_overseas_oppo` | 用于海外 oppo 应用商店上架 |

### 1.3 SDK 依赖

在 `app/build.gradle` 中添加依赖 (根据渠道选择对应的 Artifact):

```groovy
dependencies {
    // 瑞雪渠道 SDK（根据上架渠道选择一个）
    // 示例: 自运营渠道
    implementation 'com.ruixue:rxsdk_weile:3.7.33'
    
    // 其他渠道示例:
    // implementation 'com.ruixue:rxsdk_huawei:3.7.33'    // 华为
    // implementation 'com.ruixue:rxsdk_xiaomi:3.7.33'    // 小米
    // implementation 'com.ruixue:rxsdk_vivo:3.7.33'      // vivo
    // implementation 'com.ruixue:rxsdk_oppo:3.7.33'      // oppo
}

```

### 1.4 Java 版本配置

在 `build.gradle` 文件的 `android {}` 块中添加, JavaVersion 至少 1.8 以上:

```groovy
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

### 1.5 混淆配置

在应用级根目录下打开混淆配置文件 `proguard-rules.pro`，加入排除 SDK 的混淆配置:

```proguard
-keep class com.ruixue.** { *; }
```

### 1.6 工程配置

在您的项目中，打开 `your_app | Gradle Scripts | build.gradle (Project)` 并将以下内容添加到 `buildscript { dependencies {} }` 部分:

```groovy
buildscript {
    dependencies {
        // Gradle 插件版本 >= 7.3.1
        classpath "com.android.tools.build:gradle:7.3.1"
    }
}
```

在您的项目中，打开 `your_app | Gradle Scripts | gradle-wrapper.properties` 并替换 `distributionUrl` 值:

```properties
# Gradle 版本 >= 7.6
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6-bin.zip
```

> **注意**: Gradle 插件版本与 Gradle 版本需对应，保证 **大于等于** 上述版本即可。

在您的项目中，打开 `your_app | Gradle Scripts | gradle.properties` 并添加以下配置:

```properties
android.useAndroidX=true
android.enableJetifier=true

# ysdk 渠道需要添加
android.useNewApkCreator=false

# vivo oppo 等设备无法调试安装加入此配置，其他无需添加
android.injected.testOnly=false

# gradle 8.x 版本，如果开启混淆功能请添加此属性
android.enableR8.fullMode=false
```

---

## 2. SDK 代码设置

### 2.1 方式一: 直接继承 Application

游戏的 Application 直接继承 `com.ruixue.openapi.RXApplication`:

```java
import com.ruixue.openapi.RXApplication;

public class GameApplication extends RXApplication {
    // 你的代码...
}
```

### 2.2 方式二: 间接调用 Application

如果无法直接继承，在 Application 中调用 SDK 方法:

```java
import com.ruixue.openapi.RXSDK;

public class GameApplication extends Application {

    // 注意: 非 Activity 的 onCreate
    @Override
    public void onCreate() {
        super.onCreate();
        RXSDK.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RXSDK.attachBaseContext(base);
    }
}
```

### 2.3 方式三: 使用默认 Application

如果游戏没有自定义 Application，可直接使用瑞雪默认 Application (可省去上述 2.1、2.2 步配置):

```xml
<application android:name="com.ruixue.openapi.RXApplication">
</application>
```

### 2.4 注册 Application

在 `AndroidManifest.xml` 中配置 app 启动 Application，修改 `application` 标签的 `android:name` 属性:

```xml
<application android:name=".GameApplication">
</application>
```

### 2.5 配置 Activity 生命周期监听

#### 方式一: 自动监听生命周期

继承自 `LifecycleOwner` 接口的 `AppCompatActivity` 等可使用此方式:

```java
RXSDK.trackingLifecycle(this);
```

#### 方式二: 手动调用生命周期

继承自 `Activity` 的使用下面方式:

```java
import com.ruixue.openapi.RXSDK;

@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RXSDK.onCreate(this);
}

@Override
public void onStart() {
    super.onStart();
    RXSDK.onStart(this);
}

@Override
public void onRestart() {
    super.onRestart();
    RXSDK.onRestart(this);
}

@Override
public void onResume() {
    super.onResume();
    RXSDK.onResume(this);
}

@Override
public void onPause() {
    super.onPause();
    RXSDK.onPause(this);
}

@Override
public void onStop() {
    super.onStop();
    RXSDK.onStop(this);
}

@Override
public void onNewIntent(Intent newIntent) {
    super.onNewIntent(newIntent);
    RXSDK.onNewIntent(this, newIntent);
}

@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    RXSDK.onActivityResult(this, requestCode, resultCode, data);
}

@Override
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    RXSDK.onConfigurationChanged(this, newConfig);
}

@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    RXSDK.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
}
```

### 2.6 隐私协议配置 (可选)

如果需要使用 SDK 内置的隐私协议弹窗，在游戏主 Activity 的 `onCreate` 方法中添加以下代码:

```java
// 通知 SDK 已同意隐私协议
RXSDK.getInstance().setPrivacyAgree(context, new PrivacyCallback() {
    @Override
    public void onPrivacyAgree(boolean userClick) {
        // 如果使用 SDK 的隐私弹窗，需要在此回调后再初始化第三方 SDK
    }
});
```

> **注意**: 此配置为可选项，根据游戏实际需求决定是否使用 SDK 的隐私协议弹窗。

---

## 3. SDK 初始化

### 3.1 初始化方法

```java
/**
 * 使用配置初始化 SDK
 * @param activity 当前 Activity
 * @param config   初始化配置对象 {@link RXSdkInitConfig}
 */
RXSDK.initialize(Activity activity, RXSdkInitConfig config);

// 或者（config 中需已设置 Activity）
RXSDK.initialize(RXSdkInitConfig config);
```

### 3.2 RXSdkInitConfig 构造函数参数

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| cpId | String | 是 | CP 唯一 ID |
| productId | String | 是 | 产品 ID |
| channelId | String | 是 | 渠道 ID |
| baseUrlList | List\<String\> | 是 | 请求域名队列 |
| callback | RXRequestCallback | 是 | 初始化回调函数 |

### 3.3 RXSdkInitConfig 可选配置

| 方法 | 类型 | 说明 |
|-----|------|------|
| setAutoInitThird | boolean | 是否自动初始化第三方 SDK |
| setUsePrivacy | boolean | 首次启动是否展示用户隐私授权页面，默认 true |
| setLogEnable | boolean | 日志开关，默认开启 |
| setAgreementTitle | String | 协议标题，默认 "用户协议和隐私政策" |
| setAgreementMap | Map\<String, String\> | 自定义协议键值对 |

### 3.4 初始化代码示例

```java
import com.ruixue.openapi.RXSDK;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RXRequestCallback;

import java.util.Arrays;
import java.util.List;

// 必填参数
String cpid = "your_cpid";              // CP 唯一 ID
String productId = "your_product_id";   // 应用 ID
String channelId = "your_channel_id";   // 渠道 ID
List<String> baseUrlList = Arrays.asList(
    "https://api1.ruixueyun.com",
    "https://api2.ruixueyun.com"
);

// 创建初始化配置（使用构造函数）
RXSdkInitConfig config = new RXSdkInitConfig(
    cpid,
    productId,
    channelId,
    baseUrlList,
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject response) {
            int code = response.optInt("code", -1);
            if (code == 0) {
                // 初始化成功，data 字段可能为空
                JSONObject data = response.optJSONObject("data");
                // TODO: 初始化成功，可以进行登录等操作
            } else {
                // 初始化失败，读取 msg 字段获取错误信息
                String msg = response.optString("msg", "未知错误");
                // TODO: 处理初始化失败
            }
        }
    }
);

// 可选配置
config.setAutoInitThird(true);      // 是否自动初始化第三方 SDK
config.setUsePrivacy(true);         // 是否展示隐私协议弹窗

// 初始化 SDK
RXSDK.initialize(this, config);
```

---

## 4. 接入检查清单

### 依赖配置
- [ ] 添加 Maven 仓库配置 (1.1)
- [ ] 选择并添加对应渠道 SDK 依赖 (1.2, 1.3)
- [ ] 配置 Java 版本 >= 1.8 (1.4)
- [ ] 配置代码混淆规则 (1.5)
- [ ] 配置 Gradle 版本和插件 (1.6)
- [ ] 配置 gradle.properties (1.6)
- [ ] 添加必要权限 (1.7)

### 代码设置
- [ ] Application 继承或调用 SDK (2.1/2.2/2.3)
- [ ] AndroidManifest.xml 注册 Application (2.4)
- [ ] 配置 Activity 生命周期监听 (2.5)
- [ ] 隐私协议配置 (2.6, 可选)
- [ ] 调试模式配置 (2.7, 可选)

### SDK 初始化
- [ ] 配置 RXSdkInitConfig 参数 (3.2)
- [ ] 调用 RXSDK.initialize() 初始化 (3.4)

---

## 5. MCP 工具列表

瑞雪 SDK MCP 服务器提供以下工具，用于辅助 AI 生成和检查 SDK 接入代码。

### 5.1 基础接入工具

| 工具名 | 说明 | 使用场景 |
|--------|------|----------|
| `android_agent` | 接入流程指南 | 了解 SDK 接入的完整流程 |
| `android_add_dependency` | 依赖配置生成 | 生成 Gradle 依赖配置代码 |
| `android_init` | SDK 初始化代码 | 生成 SDK 初始化代码片段 |

### 5.2 用户通行证工具

| 工具名 | 说明 | 包含方法 |
|--------|------|----------|
| `android_login` | UI 登录 | 使用 SDK 内置登录界面 |
| `android_login_api` | API 登录 | 自定义登录 UI 场景，支持账号密码/验证码/游客/Google 登录 |
| `android_passport` | 用户通行证 | login, register, logout, getUserInfoByField, updateUserInfo, setRuiXueSdkCallback, searchBindingAccounts |
| `android_captcha` | 验证码 | sendCaptcha, verifyCaptcha |
| `android_real_auth` | 实名认证 | realAuth (普通版/快速版)、支付宝 IIFAA 实名 |
| `android_account_binding` | 账号绑定 | bindAccount, bindPhone, unBindPhone, changePhone, bindEmail, unBindEmail, changeEmail |
| `android_password` | 密码管理 | changePassword, resetPassword |
| `android_deregister` | 账号注销 | deregister, deregisterCancel |

### 5.3 社交功能工具

| 工具名 | 说明 | 包含方法 |
|--------|------|----------|
| `android_social` | 社交关系 | userSetCustom, relationAdd, relationDelete, updateRemarks, hasRelation, relationList |
| `android_friends` | 好友管理 | addFriends, removeFriends, updateFriendRemarks, isFriend, relationFriends |
| `android_lbs` | LBS 定位 | lbsUpdate, lbsRadius, lbsDelete |
| `android_rank` | 排行榜 | addScore, setScore, queryUserRank, getRankList, friendsRank |

### 5.4 游戏功能工具

| 工具名 | 说明 | 包含方法 |
|--------|------|----------|
| `android_payment` | 支付 | pay（微信 / 支付宝 / 星驿·星轶 xy App+H5 等） |
| `android_game_area` | 游戏区服 | searchGameAreaInfo, searchGameAreaListInfo, createGameArea, updateGameAreaInfo, deleteGameArea |
| `android_game_character` | 游戏角色 | SetGameInfo 上报瑞雪、SetThirdGameInfo 上报三方渠道、角色 CRUD |
| `android_mumu` | MuMu/Yofun 渠道 | 依赖、APP_ID、生命周期、登录与角色事件（4.0.16+） |

### 5.5 其他功能工具

| 工具名 | 说明 | 包含方法 |
|--------|------|----------|
| `android_share` | 分享 | share, shareCustom, getShareInfo, getShareData, shareReport, getShortUrl |
| `android_feedback` | 反馈 | getFeedbackKindList, createFeedback, satisfactionEvaluation, getServiceChatUnreadCount, clearServiceChatUnreadCount |
| `android_tracking` | 数据埋点 | dataTrack, trackUserAction, stopTrackUserAction |
| `android_version_check` | 瑞雪版本检查 v2 | updateGameVersion |
| `android_legal` | 法务条款 | legal, legalTerms |
| `android_promo` | 达人福利 | getPromoDisplayKEY, exchangePromoCDKEY |
| `android_announcement` | 公告/邮件 | getAnnouncement, getTempNotice, getEmailList, getEmailDetail, getEmailAward, deleteEmail |
| `android_device` | 设备信息与配置 | getDeviceCode, getTimeZoneOffset, getSystemLanguage, getSdkInfo, getChannel, getOpenId, getFirstBaseUrl, setLanguage, setSubChannelId, setGameInfo, isLogin, getLoginData, loginOpenidExpireInvalid, isAgreedPrivacy, jumpToAppStore, createRequest, setupAddictDelegate, addAttribution, setPasswordStrength, setPwdPattern, setArea, setErrorMsg, trackConfig, setDataTrackFlushInterval, setDataTrackMaxCacheCount, getProductId, getChannelId, getSubChannelId, getCpId, getSdkVersion, getLanguage, getSDKLog, getDistinctId |

---

## 6. API 接口速查

### 6.1 RXSDK 单例入口

所有 API 通过 `RXSDK.getInstance()` 调用：

```java
import com.ruixue.openapi.RXSDK;

// 获取单例
RXSDK sdk = RXSDK.getInstance();

// 调用 API
sdk.login(activity, params, callback);
sdk.getUserInfoByField(userInfoFieldParams, callback);
sdk.pay(activity, payParams, callback);
```

### 6.2 回调接口

统一使用 `RXRequestCallback` 回调：

```java
new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 成功
            JSONObject data = jsonObject.optJSONObject("data");
        } else {
            // 失败
            String msg = jsonObject.optString("msg");
        }
    }
}
```

### 6.3 常用 API 示例

#### 登录

```java
LoginParams params = new LoginParams.Builder()
        .setLoginType(LoginType.USERNAME)
        .setUsername("user@example.com")
        .setPassword("password123")
        .build();

RXSDK.getInstance().login(activity, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            // 登录成功
        }
    }
});
```

#### 支付

```java
Map<String, Object> payParams = new HashMap<>();
payParams.put("hq_type", "wechat");        // wechat / alipay / xy …
payParams.put("goods_tag", "商品ID");       // 计费点
payParams.put("trade_no", "订单号");        // CP 订单号

RXSDK.getInstance().pay(activity, payParams, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            // 支付成功（以服务端回调为准）
        }
    }
});
```

#### 星驿 / 星轶支付（`hq_type=xy`）

> **版本要求**：自 Android SDK **4.0.14** 起支持；宿主与 `rxsdk_xingyi` / `rxsdk_h5pay` 请使用 **≥4.0.14**。

| 场景 | 依赖 | 关键参数 | 实现 |
|------|------|----------|------|
| App（DyPay） | `com.ruixue:rxsdk_xingyi`（≥4.0.14） | `hq_type=xy`，不传 `is_h5` 或 `is_h5=0` | `XingYiBillingImpl` |
| H5 | `com.ruixue:rxsdk_h5pay`（≥4.0.14，可同时引 xingyi） | `hq_type=xy` + `ext.is_h5=1` | `XingYiH5` |

说明：

- 后台支付方式 type 统一为 `xy`；旧 `hq_type=xyh5` 仅兼容，新接入不要写。
- H5 URL 字段优先级：`plug_url` / `ext.h5PayData.payUrl` / `ext.url` / `url` / `ext.h5` / `h5`。
- H5 回跳：`ruixue://pay/success|failure|cancel`。
- 依赖进包后需宿主白名单含 `RX_PLUGIN_PAY_XINGYI`（App）与 `RX_PLUGIN_HQ`（H5）。

```java
// App
Map<String, Object> appPay = new HashMap<>();
appPay.put("hq_type", "xy");
appPay.put("goods_tag", goodsTag);
appPay.put("trade_no", tradeNo);
RXSDK.getInstance().pay(activity, appPay, callback);

// H5
Map<String, Object> ext = new HashMap<>();
ext.put("is_h5", 1);
Map<String, Object> h5Pay = new HashMap<>();
h5Pay.put("hq_type", "xy");
h5Pay.put("goods_tag", goodsTag);
h5Pay.put("trade_no", tradeNo);
h5Pay.put("ext", ext);
RXSDK.getInstance().pay(activity, h5Pay, callback);
```

#### 获取指定用户信息

```java
Map<String, Object> params = new HashMap<>();
params.put("user", Arrays.asList("openid", "nickname", "avatar", "real_auth_name"));
params.put("login", Arrays.asList("login_time", "method"));
params.put("current", Arrays.asList("ip", "os"));
params.put("aas", Arrays.asList("limit", "aas"));

RXSDK.getInstance().getUserInfoByField(params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            JSONObject user = data.optJSONObject("user");
            String nickname = user != null ? user.optString("nickname") : "";
            String avatar = user != null ? user.optString("avatar") : "";
        }
    }
});
```

常见字段组合：

```java
// 获取用户实名信息 + 用户绑定的登录方式信息
Map<String, Object> params = new HashMap<>();
params.put("user", Arrays.asList("real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex"));
params.put("account", Arrays.asList("method"));

// 仅查询用户绑定信息 / 绑定的登录方式
Map<String, Object> bindParams = new HashMap<>();
bindParams.put("account", Arrays.asList("method"));

// 注意：“用户绑定的登录方式信息 / 查询用户绑定信息” 对应 account 当前应用下全部登录凭证列表字段。
```

#### 发送验证码

```java
RXSDK.getInstance().sendCaptcha(
        CaptchaType.PHONE,    // 类型：手机或邮箱
        "13800138000",        // 手机号
        "register",           // 用途
        new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (jsonObject.optInt("code") == 0) {
                    // 验证码发送成功
                }
            }
        }
);
```

#### 实名认证

```java
RXSDK.getInstance().realAuth("张三", "110101199001011234", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            int age = data.optInt("age");
            boolean isAdult = age >= 18;
        }
    }
});
```

#### 排行榜

```java
// 增加分数
RXSDK.getInstance().addScore("daily_rank", 100, callback);

// 获取排行榜
RXSDK.getInstance().getRankList("daily_rank", 1, 100, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONArray list = jsonObject.optJSONArray("data");
            // 解析排行榜数据
        }
    }
});
```

#### 埋点上报

```java
Map<String, Object> properties = new HashMap<>();
properties.put("level", 10);
properties.put("vip_level", 5);

RXSDK.getInstance().dataTrack("game_login", userId, properties);
```

#### 获取公告列表

```java
RXSDK.getInstance().getAnnouncement(10, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONArray list = jsonObject.optJSONArray("data");
            // 解析公告列表
        }
    }
});
```

#### 获取邮件列表

```java
RXSDK.getInstance().getEmailList(cpUserId, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code") == 0) {
            JSONArray list = jsonObject.optJSONArray("data");
            // 解析邮件列表
        }
    }
});
```

#### 设备信息获取

```java
// 获取设备码
String deviceCode = RXSDK.getInstance().getDeviceCode(context);

// 获取时区偏移
String offset = RXSDK.getInstance().getTimeZoneOffset();

// 获取系统语言
String language = RXSDK.getInstance().getSystemLanguage();

// 获取渠道信息
String channel = RXSDK.getInstance().getChannel();

// 获取 OpenID
String openId = RXSDK.getInstance().getOpenId();

// 判断登录状态
boolean isLoggedIn = RXSDK.getInstance().isLogin();
```

#### 上报区服角色

版本要求：`setGameInfo(GameInfo gameInfo)` 需要 Android SDK `>= 4.0.9`。

```java
// 简化方式：只设置当前角色 ID 和区服/服务器 ID
RXSDK.getInstance().setGameInfo("role_001", "server_001");

// 对象方式：登录后在选服、创角、进入游戏、升级、退出等节点调用
// 不同渠道 type 取值不同：
// 栩腾：1=选服页面，2=创建角色，3=进入游戏，4=等级提升
// quick：1=创建角色，2=进入游戏，3=角色升级，4=角色退出
int type = 2;
GameInfo gameInfo = new GameInfo(type, "role_001", "server_001");
gameInfo.setRoleName("角色名");
gameInfo.setServerName("服务器名");
gameInfo.setGameRoleLevel("50");

// 创角事件必须传角色创建时间。只有 type=1 构造时 SDK 会自动填当前时间；
// 若当前渠道的“创建角色”不是 type=1（如栩腾 type=2），请显式设置。
gameInfo.setRoleCreateTime(System.currentTimeMillis());

gameInfo.setPartyId("guild_001");
gameInfo.setPartyName("瑞雪公会");
gameInfo.setVipLevel(5);
gameInfo.setGameRolePower(100000);
gameInfo.setExperience("1000");
gameInfo.setBalance("100");
gameInfo.setAttach("{\"scene\":\"enter_game\"}");

RXSDK.getInstance().setGameInfo(gameInfo);
```

#### 配置类 API（静态方法）

```java
// 设置密码强度（1=弱, 2=中, 3=强）
RXSDK.setPasswordStrength(2);

// 设置密码正则表达式
RXSDK.setPwdPattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");

// 设置地区
RXSDK.setArea("CN");

// 设置自定义错误码
Map<String, Map<String, String>> customErrorMsg = new HashMap<>();
Map<String, String> errorMap = new HashMap<>();
errorMap.put("zh-Hans", "自定义错误信息");
errorMap.put("en", "Custom error message");
customErrorMsg.put("10001", errorMap);
RXSDK.setErrorMsg(customErrorMsg);

// 配置埋点上报参数
RXSDK.trackConfig(60, 100);  // 上报间隔60秒, 最大缓存100条

// 单独设置埋点上报参数（可分别调用）
RXSDK.getInstance().setDataTrackFlushInterval(60000);  // 上报间隔（毫秒），默认 60s
RXSDK.getInstance().setDataTrackMaxCacheCount(100);    // 最大缓存条数，默认 100

// 获取产品/渠道信息
String productId = RXSDK.getProductId();
String channelId = RXSDK.getChannelId();
String subChannelId = RXSDK.getSubChannelId();
String cpId = RXSDK.getCpId();
String sdkVersion = RXSDK.getSdkVersion();
String language = RXSDK.getLanguage();
String distinctId = RXSDK.getDistinctId();
List<String> logs = RXSDK.getSDKLog();
```

---

## 7. 模板文件列表

MCP 服务器使用以下模板文件生成代码规范：

| 模板文件 | 功能分类 |
|----------|----------|
| `init.tpl` | SDK 初始化 |
| `dependency.tpl` | 依赖配置 |
| `agent_example.tpl` | 接入流程指南 |
| `setup.tpl` | 自动化接入 |
| `login.tpl` | UI 登录 |
| `login_api.tpl` | API 登录 |
| `payment.tpl` | 支付 |
| `passport.tpl` | 用户通行证 |
| `captcha.tpl` | 验证码 |
| `real_auth.tpl` | 实名认证 |
| `account_binding.tpl` | 账号绑定 |
| `password.tpl` | 密码管理 |
| `deregister.tpl` | 账号注销 |
| `social.tpl` | 社交关系 |
| `friends.tpl` | 好友管理 |
| `lbs.tpl` | LBS 定位 |
| `rank.tpl` | 排行榜 |
| `game_area.tpl` | 游戏区服 |
| `game_character.tpl` | 游戏角色 |
| `mumu.tpl` | MuMu/Yofun 渠道 |
| `share.tpl` | 分享 |
| `feedback.tpl` | 反馈 |
| `tracking.tpl` | 数据埋点 |
| `version_check.tpl` | 瑞雪版本检查 v2 |
| `legal.tpl` | 法务条款 |
| `promo.tpl` | 达人福利 |
| `announcement.tpl` | 公告/邮件 |
| `device.tpl` | 设备信息 |

模板位置：`rxsdk-mcp/rxsdk-mcp-server/templates/android/`
