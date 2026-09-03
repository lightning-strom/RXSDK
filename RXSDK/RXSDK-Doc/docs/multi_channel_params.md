# 瑞雪 SDK 多渠道参数配置文档

> 本文档从 `rxsdk-android/demo/app_rxsdk_demo/src` 目录检索整理，供 Unity/Android 多渠道打包与参数配置参考。  
> **说明**：文档中所有 ID、Key、Secret、Token 等均为占位或示例格式，实际值请从各平台后台获取，勿使用示例值。

---

## 目录

- [一、渠道参数总览](#一渠道参数总览)
  - [1.1 包名规则](#11-包名规则applicationid)
  - [1.2 基础配置参数](#12-基础配置参数每渠道可不同)
  - [1.3 配置文件](#13-配置文件特殊渠道需要)
  - [1.4 通用 Meta-data](#14-通用-meta-data-参数)
  - [1.5 SDK 初始化参数](#15-sdk-初始化参数json-配置)
- [二、渠道 SDK 参数](#二渠道-sdk-参数)
- [三、海外渠道参数](#三海外渠道参数)
- [四、工具 SDK 参数](#四工具-sdk-参数)
- [五、推送 SDK 参数](#五推送-sdk-参数)
- [六、签名配置](#六签名配置)
- [七、最佳实践](#七最佳实践)
- [八、常见问题](#八常见问题)
- [渠道速查表](#渠道速查表)

---

## 一、渠道参数总览

### 1.1 包名规则（applicationId）

不同渠道对包名有不同要求，请按以下规则配置。标注 **必须** 的渠道不满足将无法上架或影响审核。

| 渠道 | 包名规则 | 示例 |
|------|----------|------|
| 自运营 | 自定义包名 | `com.your.game` |
| 华为 | 建议 `.huawei` 后缀 | `com.your.game.huawei` |
| 荣耀 | 建议 `.honor` 后缀 | `com.your.game.honor` |
| **OPPO** | **必须** `.nearme.gamecenter` 后缀 | `com.your.game.nearme.gamecenter` |
| Vivo | 建议 `.vivo` 后缀 | `com.your.game.vivo` |
| 小米 | 建议 `.xiaomi` 后缀 | `com.your.game.xiaomi` |
| 魅族 | 建议 `.meizu` 后缀 | `com.your.game.meizu` |
| **应用宝/YSDK** | **必须** `com.tencent.tmgp.` 前缀 | `com.tencent.tmgp.your.game` |
| B站 | 建议 `.bilibili` 后缀 | `com.your.game.bilibili` |
| UC/九游 | 自定义包名 | `com.your.game` |
| 4399 | 建议 `.m4399` 后缀 | `com.your.game.m4399` |
| TapTap | 建议 `.taptap` 后缀 | `com.your.game.taptap` |
| 快手联运 | 建议 `.kuaishou` 后缀 | `com.your.game.kuaishou` |
| **抖音游戏中心** | **必须** `.bytedance.gamecenter` 后缀 | `com.your.game.bytedance.gamecenter` |
| 百度网讯 | 建议 `.g.baidu` 后缀 | `com.your.game.g.baidu` |
| 乐动LD | 建议 `.ld` 后缀 | `com.your.game.ld` |
| 海外 Google Play | 自定义包名 | `com.your.game` |
| 海外华为 | 建议 `.huawei` 后缀 | `com.your.game.huawei` |
| **海外OPPO** | **必须** `.nearme.gamecenter` 后缀 | `com.your.game.nearme.gamecenter` |

> **注意**：包名规则中标注 **必须** 的渠道为强制要求，不符合将无法上架或影响审核。

### 1.2 基础配置参数（每渠道可不同）

| 参数名 | 说明 | 是否必填 | 示例值 |
|--------|------|----------|--------|
| `applicationId` | 包名 | 必填 | `com.your.game.huawei` |
| `appName` | 应用显示名称 | 可选 | `我的游戏` |
| `versionCode` | 版本号（数字） | 可选 | `100` |
| `versionName` | 版本名称 | 可选 | `1.0.0` |
| `rx_channel_id` | 渠道标识 | 必填 | 瑞雪后台配置 |

> **说明**：应用名、版本号、版本名等参数不填写时，将使用 Unity 项目的默认设置。

### 1.3 配置文件（特殊渠道需要）

部分渠道需额外配置文件，且放置位置不同，批量打包时可由构建工具按渠道复制到目标位置。

#### 1.3.1 配置文件列表

| 配置文件 | 适用渠道 | 获取方式 | Android 目标位置 |
|----------|----------|----------|------------------|
| `agconnect-services.json` | 华为、荣耀、海外华为 | 华为开发者后台 | app 根目录 |
| `google-services.json` | 海外自运营、Firebase | Firebase 控制台 | app 根目录 |
| `config.json` | 抖音 | 抖音开放平台 | src/main/assets/ |
| `ysdkconf.ini` | YSDK/应用宝 | 腾讯游戏开放平台 | src/main/assets/ |

#### 1.3.2 配置文件详细说明

**1. 华为渠道（agconnect-services.json）**

从华为 AppGallery Connect 后台下载：
1. 登录 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 进入项目设置 → 应用
3. 下载 `agconnect-services.json`

**放置位置**: Android app 模块根目录（与 build.gradle 同级）

**2. Firebase/海外渠道（google-services.json）**

从 Firebase 控制台下载：
1. 登录 [Firebase Console](https://console.firebase.google.com/)
2. 进入项目设置
3. 下载 `google-services.json`

**放置位置**: Android app 模块根目录（与 build.gradle 同级）

**3. 抖音渠道（config.json）**

从抖音开放平台下载或手动配置：
1. 登录 [抖音开放平台](https://open.douyin.com/)
2. 创建应用获取 `app_id`
3. 配置 `config.json` 文件

配置内容示例：
```json
{
  "app_id": "从抖音开放平台获取",
  "screen_orientation": "sensorPortrait",
  "union_mode": 1,
  "is_necessary_permission": false,
  "login_fail_style": 0
}
```

**放置位置**: `src/main/assets/config.json`

**4. YSDK/应用宝渠道（ysdkconf.ini）**

从腾讯游戏开放平台获取配置信息：
1. 登录 [腾讯游戏开放平台](https://game.qq.com/)
2. 获取 QQ_APP_ID、WX_APP_ID、OFFER_ID
3. 配置 `ysdkconf.ini` 文件

配置内容示例：
```ini
; 游戏的 QQ APPID（从腾讯游戏开放平台获取）
QQ_APP_ID=your_qq_app_id

; 游戏的微信 APPID（从腾讯游戏开放平台获取）
WX_APP_ID=your_wx_app_id

; 游戏的 OFFER_ID（从腾讯游戏开放平台获取）
OFFER_ID=your_offer_id

; YSDK 环境：测试 https://ysdktest.qq.com，正式 https://ysdk.qq.com
YSDK_URL=https://ysdk.qq.com

; YSDK 游戏内 Icon 开关
YSDK_ICON_SWITCH=true

; YSDK 防沉迷开关
YSDK_ANTIADDICTION_SWITCH=true
```

**放置位置**: `src/main/assets/ysdkconf.ini`

#### 1.3.3 批量打包配置

使用 SDK 工具批量打包时：
- 在每个渠道配置中选择对应的配置文件
- 打包时会自动将配置文件复制到正确位置
- 不同渠道可使用不同的配置文件

建议目录结构：
```
项目目录/
├── ChannelConfigs/                    # 建议存放位置
│   ├── huawei/
│   │   └── agconnect-services.json   # → app 根目录
│   ├── overseas_huawei/
│   │   ├── agconnect-services.json   # → app 根目录
│   │   └── google-services.json      # → app 根目录
│   ├── overseas/
│   │   └── google-services.json      # → app 根目录
│   ├── douyin/
│   │   └── config.json               # → src/main/assets/
│   └── ysdk/
│       └── ysdkconf.ini              # → src/main/assets/
└── Assets/
    └── Plugins/
        └── Android/
```

### 1.4 通用 Meta-data 参数

| 参数名 | 说明 | 示例值 | 使用位置 |
|--------|------|--------|----------|
| `com.ruixue.APP_KEY` | 瑞雪 SDK App Key | 从瑞雪后台获取 | AndroidManifest.xml |
| `rx_cp_id` | CP ID（全局） | 从后台获取 | meta-data |
| `rx_product_id` | 产品 ID（全局） | 从后台获取 | meta-data |
| `rx_channel_id` | 渠道 ID（每渠道） | 渠道标识 | meta-data |

### 1.5 SDK 初始化参数（JSON 配置）

```json
{
  "cpid": "从瑞雪后台获取",
  "channel_id": "从瑞雪后台获取",
  "product_id": "从瑞雪后台获取",
  "domain": [
    "https://your-domain.ruixueyun.com"
  ]
}
```

---

## 二、渠道 SDK 参数

以下各渠道参数可通过 **Gradle manifestPlaceholders**、**resValue**、**AndroidManifest meta-data**、**strings.xml** 或 **assets 配置文件** 注入，具体见各小节。

### 2.1 华为渠道 (rxsdk_huawei)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `cp_id` | String | 华为 CP ID | 从华为 AGC 后台 / agconnect-services.json 获取 |
| `product_id` | String | 华为产品 ID | 从华为 AGC 后台 / agconnect-services.json 获取 |
| `app_id` | String | 华为应用 ID | 从 agconnect-services.json 获取 |

**配置文件**: `agconnect-services.json`（从华为 AppGallery Connect 下载，内含 cp_id、product_id、app_id）

### 2.2 荣耀渠道 (rxsdk_honor)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `HONOR_APP_ID` | String | 荣耀应用 ID | 从荣耀开放平台获取 |
| `com.hihonor.iap.sdk.appid` | String | 荣耀支付 App ID | 从荣耀开放平台获取 |
| `com.hihonor.iap.sdk.cpid` | String | 荣耀支付 CP ID | 从荣耀开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("HONOR_APP_ID", "从荣耀开放平台获取")
```

**strings.xml 配置**:
```xml
<string name="honor_appid">从荣耀开放平台获取</string>
<string name="honor_cpid">从荣耀开放平台获取</string>
```

### 2.3 OPPO 渠道 (rxsdk_oppo)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `OPPO_APP_KEY` | String | OPPO App Key | 从 OPPO 开放平台获取 |
| `OPPO_APP_SECRET` | String | OPPO App Secret | 从 OPPO 开放平台获取 |
| `rx_oppo_app_secret` | String | OPPO 补充配置 | 从 OPPO 开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("OPPO_APP_SECRET", "从OPPO开放平台获取")
manifestPlaceholders.put("OPPO_APP_KEY", "从OPPO开放平台获取")
```

### 2.4 Vivo 渠道 (rxsdk_vivo)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `VIVO_APP_ID` | String | Vivo 应用 ID | 从 Vivo 开放平台获取 |
| `VIVO_API_KEY` | String | Vivo API Key | 从 Vivo 开放平台获取 |
| `vivoUnionAppId` | String | Vivo 联盟 ID | 从 Vivo 开放平台获取 |
| `rx_vivo_appid` | String | Vivo 补充配置 | 从 Vivo 开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("VIVO_APP_ID", "从Vivo开放平台获取")
manifestPlaceholders.put("VIVO_API_KEY", "从Vivo开放平台获取")
```

### 2.5 小米渠道 (rxsdk_xiaomi)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `MI_APP_ID` | String | 小米应用 ID | 从小米开放平台获取 |
| `MI_APP_KEY` | String | 小米应用 Key | 从小米开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("MI_APP_ID", "从小米开放平台获取")
manifestPlaceholders.put("MI_APP_KEY", "从小米开放平台获取")
```

### 2.6 魅族渠道 (rxsdk_meizu)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `MZ_APP_ID` | String | 魅族应用 ID | 从魅族开放平台获取 |
| `MZ_APP_KEY` | String | 魅族应用 Key | 从魅族开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("MZ_APP_ID", "从魅族开放平台获取")
manifestPlaceholders.put("MZ_APP_KEY", "从魅族开放平台获取")
```

### 2.7 快手联运 (rxsdk_kwaiallin)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `KWAI_APP_ID` | String | 快手应用 ID | 从快手开放平台获取 |
| `KWAI_APP_NAME` | String | 快手应用名称 | 你的游戏名称 |
| `kwai_allow_tourist` | Boolean | 是否允许游客 | `true` |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("KWAI_APP_ID", "从快手开放平台获取")
manifestPlaceholders.put("KWAI_APP_NAME", "你的游戏名称")
```

### 2.8 应用宝/YSDK (rxsdk_ysdk)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `QQ_APP_ID` | String | QQ 应用 ID | 从腾讯游戏开放平台获取 |
| `WX_APP_ID` | String | 微信应用 ID | 从腾讯游戏开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("QQ_APP_ID", "从腾讯游戏开放平台获取")
manifestPlaceholders.put("WX_APP_ID", "从腾讯游戏开放平台获取")
```

**ysdkconf.ini 配置**: QQ_APP_ID 和 WX_APP_ID 需与此处一致

### 2.9 UC/九游 (rxsdk_9game)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `uc_game_id` | String | UC 游戏 ID | 从九游/UC 开放平台获取 |

**strings.xml 配置**:
```xml
<string name="uc_game_id">从九游开放平台获取</string>
```

### 2.10 乐动 LD (rxsdk_ld)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `LD_GAME_ID` | String | LD 游戏 ID | 从乐动开放平台获取 |
| `ld_app_key` | String | LD App Key | 从乐动开放平台获取 |

**AndroidManifest.xml 配置**:
```xml
<meta-data android:name="LD_GAME_ID" android:value="从乐动开放平台获取" />
```

### 2.11 B站/哔哩哔哩 (rxsdk_bilibili)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `BSGameSdk_PaidGame` | Boolean | 是否付费游戏 | `false` |

**AndroidManifest.xml 配置**:
```xml
<meta-data android:name="BSGameSdk_PaidGame" android:value="false" />
```

### 2.12 百度网讯 (rxsdk_baidu_wangxun)

无特殊参数配置

### 2.13 4399 (rxsdk_4399)

无特殊参数配置

### 2.14 抖音游戏中心 (rxsdk_douyin_gb)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `APPLOG_SCHEME` | String | 字节埋点协议 | `union_game` |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("APPLOG_SCHEME", "union_game")
```

### 2.15 栩腾 (rxsdk_xuteng)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `CHANNELSDK_ID` | String | 渠道 SDK ID | 从栩腾渠道获取 |
| `CHANNELSDK_GAME_VERSION` | String | 游戏版本号 | 与游戏版本一致 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("CHANNELSDK_ID", "从栩腾渠道获取")
manifestPlaceholders.put("CHANNELSDK_GAME_VERSION", "游戏版本号")
```

---

## 三、海外渠道参数

### 3.1 海外自运营 (rxsdk_overseas)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `FACEBOOK_APP_ID` | String | Facebook 应用 ID | 从 Facebook 开发者后台获取 |
| `facebook_app_id` | String | Facebook App ID (resValue) | 同上 |
| `facebook_client_token` | String | Facebook Client Token | 从 Facebook 开发者后台获取 |
| `google_app_id` | String | Google 应用 ID | 从 Google / Firebase 控制台获取 |
| `google_client_id` | String | Google Client ID | 从 Google 控制台获取（格式 xxx.apps.googleusercontent.com） |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("FACEBOOK_APP_ID", "从Facebook开发者后台获取")
resValue "string", "facebook_app_id", "从Facebook开发者后台获取"
resValue "string", "facebook_client_token", "从Facebook开发者后台获取"
resValue "string", "google_app_id", "从Google控制台获取"
resValue "string", "google_client_id", "从Google控制台获取"
```

### 3.2 海外华为 (rxsdk_overseas_huawei)

继承华为渠道参数 + 海外自运营参数

### 3.3 Line 登录 (rxsdk_line)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `line_channel_id` | String | Line Channel ID | 从 Line 开发者后台获取 |

**JSON 配置**:
```json
{
  "line_channel_id": "从Line开发者后台获取"
}
```

### 3.4 QooApp (rxsdk_qoo)

与海外自运营参数配置相同

---

## 四、工具 SDK 参数

### 4.1 微信登录/支付 (rxsdk_weixin / rxsdk_weixin_withpay)

通常与 YSDK 的 WX_APP_ID 一致

### 4.2 支付宝 (rxsdk_alipay)

无特殊参数配置（使用服务端下发参数）

### 4.3 H5 支付 (rxsdk_h5pay)

无特殊参数配置

### 4.4 高德地图 (rxsdk_gaode)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `AMAP_APIKEY` | String | 高德 API Key | 从高德开放平台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders.put("AMAP_APIKEY", "从高德开放平台获取")
```

### 4.5 Adjust 归因 (rxsdk_adjust)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `adjust_app_token` | String | Adjust App Token | 从 Adjust 控制台获取 |

**AndroidManifest.xml 配置**:
```xml
<meta-data android:name="adjust_app_token" android:value="从Adjust控制台获取" />
```

### 4.6 字节火山引擎 (rxsdk_bytedance_log)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `APPLOG_SCHEME` | String | 字节埋点协议 | `union_game` |

### 4.7 TopOn 广告 (rxsdk_topon)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `app_id` | String | TopOn App ID | 从 TopOn 后台获取 |

**Gradle 配置**:
```groovy
manifestPlaceholders = [
    "app_id": "从TopOn后台获取"
]
```

---

## 五、推送 SDK 参数

### 5.1 华为推送 (rxsdk_push_huawei)

使用华为渠道的 `agconnect-services.json` 配置

### 5.2 小米推送 (rxsdk_push_mi)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `MI_APP_ID` | String | 小米推送 App ID | 从小米开放平台推送服务获取 |
| `MI_APP_KEY` | String | 小米推送 App Key | 从小米开放平台推送服务获取 |

### 5.3 OPPO 推送 (rxsdk_push_oppo)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `OPPO_APP_KEY` | String | OPPO 推送 App Key | 从 OPPO 开放平台推送服务获取 |
| `OPPO_APP_SECRET` | String | OPPO 推送 Secret | 从 OPPO 开放平台推送服务获取 |

### 5.4 Vivo 推送 (rxsdk_push_vivo)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `VIVO_APP_ID` | String | Vivo 推送 App ID | 从 Vivo 开放平台推送服务获取 |
| `VIVO_API_KEY` | String | Vivo 推送 API Key | 从 Vivo 开放平台推送服务获取 |

### 5.5 荣耀推送 (rxsdk_push_honor)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `HONOR_APP_ID` | String | 荣耀推送 App ID | 从荣耀开放平台推送服务获取 |

### 5.6 魅族推送 (rxsdk_push_meizu)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `MZ_APP_ID` | String | 魅族推送 App ID | 从魅族开放平台推送服务获取 |
| `MZ_APP_KEY` | String | 魅族推送 App Key | 从魅族开放平台推送服务获取 |

---

## 六、签名配置

```groovy
signingConfigs {
    release {
        v1SigningEnabled true
        v2SigningEnabled true
        keyAlias "your_key_alias"
        keyPassword "***"   // 请使用 gradle.properties 或环境变量，勿提交明文
        storeFile file("keystore/your.keystore")
        storePassword "***" // 请使用 gradle.properties 或环境变量，勿提交明文
    }
}
```

---

## 七、最佳实践

### 7.1 参数配置优先级

1. **manifestPlaceholders**: 用于 AndroidManifest.xml 中的占位符替换
2. **resValue**: 用于生成 strings.xml 资源
3. **meta-data**: 直接在 AndroidManifest.xml 中声明
4. **assets JSON**: 用于 SDK 初始化配置

### 7.2 敏感信息处理

- **禁止**在代码或文档中硬编码真实密钥、App Secret、Token；本文档中所有 ID/Key/Secret 均为占位或「从 xx 获取」说明。
- 使用 `gradle.properties`（并加入 .gitignore）或环境变量存储敏感信息，通过 `${PROPERTY_NAME}` 引用。
- 签名密码、Store 路径等勿提交版本库。

```groovy
// gradle.properties（勿提交真实密码）
STORE_PASSWORD=your_password

// build.gradle
storePassword STORE_PASSWORD
```

### 7.3 多渠道打包流程

1. 定义 productFlavors
2. 配置对应渠道参数
3. 添加渠道特定依赖
4. 执行 `./gradlew assemble{FlavorName}Release`

---

## 八、常见问题

### Q: 为什么 manifestPlaceholders 中的值未生效？

A: 确保在 `build.gradle` 中正确声明，且 AndroidManifest.xml 中使用 `${PLACEHOLDER_NAME}` 格式引用。

### Q: 如何为同一工具库配置不同渠道参数？

A: 在 productFlavors 中为每个渠道配置独立的 manifestPlaceholders 和 resValue。

### Q: 华为渠道如何配置？

A: 将 `agconnect-services.json` 放置在对应 flavor 的 `src/{flavorName}/` 目录下。

---

## 渠道速查表

| 渠道 | 依赖模块 | 包名规则 | 配置文件 | 关键参数 |
|------|----------|----------|----------|----------|
| 自运营 | rxsdk_weile | 自定义 | — | rx_channel_id |
| 华为 | rxsdk_huawei | 建议 .huawei | agconnect-services.json | cp_id, product_id, app_id |
| 荣耀 | rxsdk_honor | 建议 .honor | — | HONOR_APP_ID, iap.sdk.appid/cpid |
| OPPO | rxsdk_oppo | **必须** .nearme.gamecenter | — | OPPO_APP_KEY, OPPO_APP_SECRET |
| Vivo | rxsdk_vivo | 建议 .vivo | — | VIVO_APP_ID, VIVO_API_KEY |
| 小米 | rxsdk_xiaomi | 建议 .xiaomi | — | MI_APP_ID, MI_APP_KEY |
| 魅族 | rxsdk_meizu | 建议 .meizu | — | MZ_APP_ID, MZ_APP_KEY |
| 应用宝/YSDK | rxsdk_ysdk | **必须** com.tencent.tmgp. 前缀 | ysdkconf.ini | QQ_APP_ID, WX_APP_ID |
| B站 | rxsdk_bilibili | 建议 .bilibili | — | BSGameSdk_PaidGame |
| 九游 | rxsdk_9game | 自定义 | — | uc_game_id |
| 4399 | rxsdk_4399 | 建议 .m4399 | — | — |
| TapTap | rxsdk_taptap | 建议 .taptap | — | — |
| 快手 | rxsdk_kwaiallin | 建议 .kuaishou | — | KWAI_APP_ID, KWAI_APP_NAME |
| 抖音 | rxsdk_douyin_gb | **必须** .bytedance.gamecenter | config.json (assets) | APPLOG_SCHEME |
| 百度网讯 | rxsdk_baidu_wangxun | 建议 .g.baidu | — | — |
| 乐动 LD | rxsdk_ld | 建议 .ld | — | LD_GAME_ID, ld_app_key |
| 栩腾 | rxsdk_xuteng | — | — | CHANNELSDK_ID, CHANNELSDK_GAME_VERSION |
| 海外自运营 | rxsdk_overseas | 自定义 | google-services.json | FACEBOOK_APP_ID, google_client_id |
| 海外华为 | rxsdk_overseas_huawei | 建议 .huawei | agconnect-services.json + google-services.json | 华为 + 海外自运营 |
| 海外 OPPO | rxsdk_overseas_oppo | **必须** .nearme.gamecenter | — | 同 OPPO |

---

## 相关文档

- [Android 渠道接入说明](../android/CHANNEL_INTEGRATION.md)：渠道列表与初始化
- [Unity Android 渠道与推送](../unity/ANDROID.md)：Unity 打 Android 包时的渠道与推送配置
- [Android 快速接入](../android/QUICK_START.md)：集成与工程配置
