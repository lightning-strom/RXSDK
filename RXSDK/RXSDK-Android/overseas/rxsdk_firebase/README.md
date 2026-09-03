# rxsdk_firebase — Firebase 分析 / 推送 / Crashlytics 插件

## 功能简介

接入 Firebase SDK，提供事件上报（Analytics）、远程推送（FCM）及崩溃统计（Crashlytics）能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_firebase:${version}'
```

## 参数配置

### 初始化参数

Firebase 本身通过 `google-services.json` 文件进行配置，**无需在 ext 中传入额外字段**。

> 宿主工程必须在根目录和 `app/` 目录引入 Google Services 插件：
>
> ```groovy
> // 根 build.gradle
> classpath 'com.google.gms:google-services:x.x.x'
> // app/build.gradle
> apply plugin: 'com.google.gms.google-services'
> ```
>
> 并将 `google-services.json` 放置在 `app/` 目录下。

### 权限说明

- `INTERNET`
- `ACCESS_NETWORK_STATE`
- `WAKE_LOCK`

## 接口调用

### FCM 推送说明

模块已声明 `FcmPushReceiver` 服务，监听 `com.google.firebase.MESSAGING_EVENT`，宿主无需额外配置。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 集成自查

> 历史上出现过多次"集成了本插件但 push / Analytics / Crashlytics 全部失效"的案例，根因都是宿主工程漏做了下面三件事中的一件。发包前务必逐条核对。

### 1. `google-services.json` 放入 app 模块

```text
<app_module>/
├── build.gradle
└── google-services.json     ← 必须放这里（或 src/<flavor>/google-services.json）
```

- 多 flavor 项目可放到 `src/<flavor>/google-services.json`，插件按 flavor 自动挑选。
- **`google-services.json` 里的 `client[].client_info.android_client_info.package_name` 必须与宿主 `applicationId` 完全一致**，否则 google-services 插件会报 `No matching client found for package name '…'`。

### 2. app 模块 apply `com.google.gms.google-services` 插件

```groovy
// 根 build.gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.10'     // 或更新
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.5.2'  // 需要 Crashlytics 时
    }
}

// app/build.gradle
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'
    id 'com.google.firebase.crashlytics'     // 需要 Crashlytics 时
}
```

### 3. 签名 SHA-1 与 Firebase 控制台登记一致

在 Firebase 控制台 → 项目设置 → 你的应用 → 「SHA 证书指纹」里，**每一个打包用的 keystore 的 SHA-1 都要登记**，否则 Google Sign-In 会 `DEVELOPER_ERROR (statusCode=10)`（FCM 不受此影响，但登录会炸）。

获取 keystore 的 SHA-1：

```bash
keytool -list -v -keystore <path/to.keystore> -storepass <pwd> -alias <alias> \
    | grep SHA1
```

### 典型失败症状与定位

### 症状 A：push 初始化失败

```text
E/rxsdk: rxpush:ruixue push plugin init failed, no push channel plugin support.
```

**根因几乎都是第 1 / 第 2 条没做对**。插件升级后，`FcmPushProvider.isSupport()` 会打出更明确的日志，按日志定位：

| 日志 | 含义 | 修复方向 |
| --- | --- | --- |
| `Default FirebaseApp is not initialized. Check google-services.json...` | 第 1 / 第 2 条漏了 | 补 json 或 apply 插件 |
| `Google Play services unavailable, code=1/2/3/9` | 设备无 GMS 或 GMS 版本过低 | 换测试机 / 升级 GMS |

同时 logcat 会伴随 Firebase 官方的兜底日志，最直接的信号是：

```text
W/FirebaseApp: Default FirebaseApp failed to initialize because no default options were found.
               This usually means that com.google.gms:google-services was not applied to your gradle project.
I/FirebaseInitProvider: FirebaseApp initialization unsuccessful
```

### 症状 B：Analytics / Crashlytics 一条数据都不上报

**同样是第 1 / 第 2 条没做对**。Analytics 和 Crashlytics 都依赖默认 `FirebaseApp`，`google-services.json` 缺失时会静默失败，不抛异常也不打红日志，最容易被漏掉。

### 症状 C：Google 登录 `DEVELOPER_ERROR` (code 10)

当前 keystore 的 SHA-1 没登记到 Firebase / Google Cloud Console 的 OAuth 客户端。按第 3 条补登记后重新下载 `google-services.json`。

### 自助诊断命令

### 3 秒确认 `google-services` 插件是否生效

```bash
./gradlew :app:processReleaseGoogleServices --info 2>&1 | head -20
```

- **正常**：看到 `Parsing json file: .../google-services.json`
- **异常**：`Task :app:processReleaseGoogleServices SKIPPED`，或根本找不到这个 task → 第 1 / 第 2 条没做。

### 打出来的 APK 里是否带了 Firebase 配置

```bash
APKA=~/Library/Android/sdk/cmdline-tools/latest/bin/apkanalyzer   # 路径按本机 SDK 调整
"$APKA" resources names --type string --config default <your.apk> \
    | grep -E '^(google_app_id|google_api_key|gcm_defaultSenderId|project_id)$'
```

- **正常**：四条都能 grep 到（由 `google-services` 插件自动生成的 string 资源）
- **异常**：四条一条都没有 → 插件在构建时没跑。

### 运行时确认 Firebase 是否初始化成功

```bash
adb logcat -d | grep -iE 'FirebaseApp|FirebaseInitProvider|rxpush'
```

看到 `FirebaseInitProvider: FirebaseApp initialization unsuccessful` 就直接回到症状 A 的清单。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
