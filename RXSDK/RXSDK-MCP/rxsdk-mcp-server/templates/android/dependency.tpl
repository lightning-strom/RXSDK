// ========== 瑞雪 SDK 依赖配置 ==========

// 1. 在项目根目录 build.gradle 中添加仓库:
{{if eq .GradleType "kts" -}}
// settings.gradle.kts 或 build.gradle.kts
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://maven.aliyun.com/nexus/content/repositories/jcenter") }
        
        // 瑞雪库地址
        maven {
            url = uri("http://60.205.123.114:8081/repository/maven-releases/")
            isAllowInsecureProtocol = true
        }
        
        // 备用地址[可选]
        maven {
            credentials {
                username = "600685104fb2132a19e09a29"
                password = "2IfrbLKz50J1"
            }
            url = uri("https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/")
        }
    }
}
{{- else -}}
// build.gradle
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
        
        // 备用地址[可选]
        maven {
            credentials {
                username '600685104fb2132a19e09a29'
                password '2IfrbLKz50J1'
            }
            url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
        }
    }
}
{{- end}}

// 2. 在 app/build.gradle 中添加依赖 (根据渠道选择):
{{if eq .GradleType "kts" -}}
dependencies {
    // 瑞雪渠道 SDK（根据上架渠道选择一个）
    implementation("com.ruixue:{{.Channel}}:{{.Version}}")
}
{{- else -}}
dependencies {
    // 瑞雪渠道 SDK（根据上架渠道选择一个）
    implementation 'com.ruixue:{{.Channel}}:{{.Version}}'
}
{{- end}}

// 3. 在 android {} 块中添加 Java 版本配置:
{{if eq .GradleType "kts" -}}
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}
{{- else -}}
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
{{- end}}

// 4. 在 gradle.properties 中确保启用 Jetifier:
// 检查项目根目录的 gradle.properties 文件，确保包含以下配置:
android.useAndroidX=true
android.enableJetifier=true
// 注意: 如果 android.enableJetifier 未配置或设置为 false，请改为 true
// Jetifier 用于将第三方库中的旧版 Support Library 依赖自动转换为 AndroidX

// 5. 在 proguard-rules.pro 中添加混淆规则:
// -keep class com.ruixue.sdk.** { *; }
// -keep interface com.ruixue.sdk.** { *; }
// -keep enum com.ruixue.sdk.** { *; }

// ========== 可选渠道列表 ==========
// rxsdk_weile           - 自运营渠道库
// rxsdk_baidu_wangxun   - 百度游戏中心
// rxsdk_ysdk            - 应用宝（登录 ext 须 platform_type 或 ysdk_login_type=ysdk_login_ui）
// rxsdk_base_ui         - 内置登录 UI（RXSdkUI）；走 SDK UI 登录时必选，纯 YSDK API 登录可不引
// rxsdk_vivo            - vivo
// rxsdk_oppo            - oppo
// rxsdk_huawei          - 华为
// rxsdk_xiaomi          - 小米
// rxsdk_douyin_gb       - 抖音
// rxsdk_kwaiallin       - 快手联运
// rxsdk_kwai_buy        - 快手买量（需配合内置支付宝 SDK；宿主配 KWAI_APP_ID / KWAI_APP_NAME）
// rxsdk_taptap          - TapTap
// rxsdk_xuteng          - 旭腾渠道（BRSDK+xuteng-channel；宿主补 CHANNELSDK_GAME_VERSION 及 assets/brsdk.cfg）
// rxsdk_overseas        - Google Play
// rxsdk_9game           - 九游
// rxsdk_bilibili        - 哔哩哔哩
// rxsdk_4399            - 4399
// rxsdk_honor           - 荣耀
// rxsdk_007             - 007
// rxsdk_quick           - Quick
// rxsdk_ld              - 雷电模拟器
// rxsdk_yofun           - MuMu模拟器
// rxsdk_overseas_oppo   - 海外OPPO
// rxsdk_overseas_huawei - 华为海外版（HMS IAP；宿主放 agconnect-services.json）
// rxsdk_qoo             - QooApp（宿主 Manifest 配 App ID / App Key）
// rxsdk_overseas_weizhi - 微知/JF 渠道海外版
// rxsdk_rustore         - RuStore
// rxsdk_apkpure         - Apkpure（VGamePop）
//
// ========== 海外登录 & 分享辅助插件（与主渠道叠加引入）==========
// rxsdk_google          - Google 登录（Credential Manager）& Google Play Billing
// rxsdk_facebook        - Facebook / Messenger / Instagram 登录 & 分享
// rxsdk_line            - LINE 登录 & 分享（日本/东南亚）
// rxsdk_instagram       - Instagram OAuth 登录 & Story 分享
// rxsdk_reddit          - Reddit OAuth 登录 & 帖子分享
// rxsdk_snapchat        - Snapchat 登录 & Story 分享（Snap Kit SDK）
// rxsdk_tiktok          - TikTok OAuth 登录（PKCE）& 内容分享（TikTok Open SDK）
// rxsdk_twitter         - Twitter（X）账号登录
// rxsdk_zalo            - Zalo 登录 & 分享（越南市场）
// rxsdk_vk              - VK ID 登录（JDK 17+ 编译；宿主配 VKIDClientID / VKIDClientSecret / VKIDRedirectHost=vk.ru / VKIDRedirectScheme=vk{clientId}）
//
// ========== 分析 / 归因 / 广告插件（按需叠加引入）==========
// rxsdk_adjust          - Adjust 安装归因 & 事件上报
// rxsdk_firebase        - Firebase Analytics / FCM 推送 / Crashlytics
// rxsdk_infinix         - Infinix（Transsion）广告插件（插屏 / Banner / 激励视频 / 开屏）
//
// ========== 支付插件（叠加在渠道宿主之上，非渠道包）==========
// rxsdk_weixin / rxsdk_weixin_withpay - 微信登录/支付
// rxsdk_alipay          - 支付宝
// rxsdk_h5pay           - H5 聚合支付（含星驿/星轶 H5：hq_type=xy + ext.is_h5=1；≥4.0.14）
// rxsdk_xingyi          - 星驿/星轶 App 支付（DyPay；hq_type=xy；自 4.0.14 起支持；常与 rxsdk_h5pay 同引）
// rxsdk_unifypay        - 银联等（AUMS 等场景需配合 h5pay）
