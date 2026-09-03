package rxsdk

// unityChannelSpecs 是三方渠道 Unity 接入的声明式配置表。
// 文档来源：RXSDK-Doc/unity/thirdchannel/*.md
// 带 @your 的参数统一抽象为 Params（需使用方提供），值中使用 {{paramKey}} 占位。
var unityChannelSpecs = map[string]unityChannelSpec{
	// ==================== 海外渠道 ====================
	"zalo": {
		DisplayName: "Zalo",
		RuixueLibs:  []string{"rxsdk_zalo"},
		Params: []unityChannelParam{
			{Key: "zaloAppId", Description: "Zalo App ID（纯数字），从 Zalo 开发者后台获取"},
		},
		LauncherResValues: []unityChannelKeyValue{
			{Key: "zalo_app_id", Value: "{{zaloAppId}}"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "com.zing.zalo.zalosdk.appID", Value: "{{zaloAppId}}"},
		},
		ManifestSnippets: []string{
			`        <activity android:name="com.zing.zalo.zalosdk.oauth.BrowserLoginActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="zalo-{{zaloAppId}}" />
            </intent-filter>
        </activity>`,
		},
		IOSAssets: []unityChannelIOSAsset{
			{AssetRelPath: "Assets/RuiXueSettings/RuiXueSDK_ZaloXcodeSetting.asset", Fields: []unityChannelKeyValue{
				{Key: "zaloAppID", Value: "zalo-{{zaloAppId}}"},
			}},
		},
		Notes: []string{"meta-data 不支持 long，App ID 必须配置在 launcherTemplate.gradle 的 resValue 中"},
	},
	"line": {
		DisplayName: "Line",
		RuixueLibs:  []string{"rxsdk_overseas", "rxsdk_line"},
		Params: []unityChannelParam{
			{Key: "lineChannelId", Description: "Line Channel ID，从 Line 开发者后台获取"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "line_channel_id", Value: "{{lineChannelId}}"},
		},
		IOSAssets: []unityChannelIOSAsset{
			{AssetRelPath: "Assets/RuiXueSettings/RuiXueSDK_LineXcodeSetting.asset", Fields: []unityChannelKeyValue{
				{Key: "ChannelID", Value: "{{lineChannelId}}"},
			}},
		},
	},
	"tiktok": {
		DisplayName: "TikTok",
		RuixueLibs:  []string{"rxsdk_tiktok"},
		Params: []unityChannelParam{
			{Key: "tiktokAppId", Description: "TikTok App ID（iOS 使用）"},
			{Key: "tiktokClientKey", Description: "TikTok clientKey，从开发者后台获取"},
			{Key: "tiktokAuthScheme", Description: "授权回跳 uri，例如 ruixue://sdkresponse"},
			{Key: "tiktokScheme", Description: "回跳 scheme，例如 ruixue"},
			{Key: "tiktokHost", Description: "回跳 host，例如 sdkresponse"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "com.ruixue.sdk.tiktok.clientKey", Value: "{{tiktokClientKey}}"},
			{Key: "com.ruixue.sdk.tiktok.auth.scheme", Value: "{{tiktokAuthScheme}}"},
		},
		ManifestSnippets: []string{
			`        <activity android:name="com.ruixue.sdk.tiktok.AuthResultActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:host="{{tiktokHost}}" android:scheme="{{tiktokScheme}}" />
            </intent-filter>
        </activity>`,
		},
		IOSAssets: []unityChannelIOSAsset{
			{AssetRelPath: "Assets/RuiXueSettings/RuiXueSDK_TikTokXcodeSetting.asset", Fields: []unityChannelKeyValue{
				{Key: "TikTokAppID", Value: "{{tiktokAppId}}"},
			}},
		},
		Notes: []string{"iOS 导出工程需在 Podfile 添加 pod 'RXTikTokSDK'"},
	},
	"snapchat": {
		DisplayName: "SnapChat",
		RuixueLibs:  []string{"rxsdk_snapchat"},
		Params: []unityChannelParam{
			{Key: "snapchatClientId", Description: "SnapChat Client ID"},
			{Key: "snapchatRedirectUrl", Description: "SnapChat Redirect URL，例如 myapp://snap-kit/oauth2"},
			{Key: "snapchatScheme", Description: "回跳 scheme，例如 myapp"},
			{Key: "snapchatScopes", Description: "申请的权限 scope 列表（JSON 数组字符串）"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "com.snap.kit.clientId", Value: "{{snapchatClientId}}"},
			{Key: "com.snap.kit.redirectUrl", Value: "{{snapchatRedirectUrl}}"},
		},
		ManifestSnippets: []string{
			`        <activity android:name="com.snap.corekit.SnapKitActivity" android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="{{snapchatScheme}}" android:host="snap-kit" android:path="/oauth2" />
            </intent-filter>
        </activity>`,
		},
		IOSAssets: []unityChannelIOSAsset{
			{AssetRelPath: "Assets/RuiXueSettings/RuiXueSDK_SnapChatXcodeSetting.asset", Fields: []unityChannelKeyValue{
				{Key: "SCSDKClientId", Value: "{{snapchatClientId}}"},
				{Key: "SCSDKRedirectUrl", Value: "{{snapchatRedirectUrl}}"},
				{Key: "SCSDKScopes", Value: "{{snapchatScopes}}"},
			}},
		},
	},
	"reddit": {
		DisplayName: "Reddit",
		RuixueLibs:  []string{"rxsdk_reddit"},
		Params: []unityChannelParam{
			{Key: "redditClientId", Description: "Reddit Client ID，从 Reddit 后台获取"},
			{Key: "redditRedirectUri", Description: "Reddit Redirect URI，从 Reddit 后台获取"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "reddit_clientid", Value: "{{redditClientId}}"},
			{Key: "reddit_redirecturi", Value: "{{redditRedirectUri}}"},
		},
		Notes: []string{"iOS 使用 RXReddit.init(clientId, redirectUri) 初始化"},
	},
	"instagram": {
		DisplayName: "Instagram",
		RuixueLibs:  []string{"rxsdk_instagram"},
		Params: []unityChannelParam{
			{Key: "instagramClientId", Description: "Instagram Client ID"},
			{Key: "instagramRedirectUrl", Description: "Instagram Redirect URL"},
		},
		LauncherResValues: []unityChannelKeyValue{
			{Key: "instagram_client_id", Value: "{{instagramClientId}}"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "com.ruixue.sdk.instagram.clientId", Value: "{{instagramClientId}}"},
			{Key: "com.ruixue.sdk.instagram.redirectUrl", Value: "{{instagramRedirectUrl}}"},
		},
		Notes: []string{"iOS 使用 RXInstagram.init(clientId, redirectUri) 初始化；仅支持系统分享"},
	},
	"qoo": {
		DisplayName: "QooApp",
		RuixueLibs:  []string{"rxsdk_qoo"},
		Params: []unityChannelParam{
			{Key: "qooAppId", Description: "QooApp App ID"},
			{Key: "qooPublicKey", Description: "QooApp Public Key"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "com.qooapp.APP_ID", Value: "{{qooAppId}}"},
			{Key: "com.qooapp.PUBLIC_KEY", Value: "{{qooPublicKey}}"},
			{Key: "com.qooapp.ENC_VERSION", Value: "2"},
		},
		ProguardRules: []string{
			"-keep class com.qooapp.opensdk.common.model.* {*;}",
			"-keep class com.qooapp.opensdk.common.* {*;}",
			"-keep class com.qooapp.opensdk.QooAppOpenSDK {\n    public <methods>;\n}",
		},
		Notes: []string{"package name 尾部必须包含 .qooapp，否则可能导致覆盖安装与审核被拒"},
	},
	"catappult": {
		DisplayName: "Aptoide/Catappult",
		RuixueLibs:  []string{"rxsdk_catappult"},
		Params: []unityChannelParam{
			{Key: "catappultPublicKey", Description: "Catappult API 密钥"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "catappult_public_key", Value: "{{catappultPublicKey}}"},
		},
	},
	"apkpure": {
		DisplayName: "APKPure",
		RuixueLibs:  []string{"rxsdk_apkpure"},
		Params: []unityChannelParam{
			{Key: "apkpureAppId", Description: "APKPure App ID"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "apkpure_appid", Value: "{{apkpureAppId}}"},
		},
	},
	"checkout": {
		DisplayName: "Checkout/H5Pay",
		RuixueLibs:  []string{"rxsdk_h5pay"},
		Notes:       []string{"仅支付能力，无需额外参数；支付接口参考瑞雪支付 API"},
	},

	// ==================== 国内渠道 ====================
	"vivo": {
		DisplayName: "vivo",
		RuixueLibs:  []string{"rxsdk_vivo"},
		Params: []unityChannelParam{
			{Key: "vivoAppId", Description: "vivo 联运 App ID"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "vivoUnionAppId", Value: "{{vivoAppId}}"},
			{Key: "vivoUnionAppType", Value: "1"},
		},
		AssetFiles: []unityChannelAssetFile{
			{SourceParamKey: "supplierconfigJsonPath", DestRelPath: "supplierconfig.json"},
		},
		ProguardRules: []string{
			"-keep class com.bun.miitmdid.core.** {*;}",
			"-keep class XI.CA.XI.**{*;}",
			"-keep class XI.K0.XI.**{*;}",
			"-keep class XI.XI.K0.**{*;}",
			"-keep class XI.xo.XI.XI.**{*;}",
			"-keep class com.asus.msa.SupplementaryDID.**{*;}",
			"-keep class com.asus.msa.sdid.**{*;}",
			"-keep class com.bun.lib.**{*;}",
			"-keep class com.bun.miitmdid.**{*;}",
			"-keep class com.huawei.hms.ads.identifier.**{*;}",
			"-keep class com.samsung.android.deviceidservice.**{*;}",
			"-keep class com.zui.opendeviceidlibrary.**{*;}",
			"-keep class org.json.**{*;}",
			"-keep public class com.netease.nis.sdkwrapper.Utils {public <methods>;}",
		},
	},
	"oppo": {
		DisplayName: "oppo",
		RuixueLibs:  []string{"rxsdk_oppo"},
		FixedLibs: []string{
			"com.jakewharton.timber:timber:5.0.1",
			"com.nearme.game.sdk:signal-sdk:1.0.1",
			"com.nearme.game.sdk:signal-log:1.0.1",
		},
		Params: []unityChannelParam{
			{Key: "oppoAppKey", Description: "oppo App Key"},
			{Key: "oppoAppSecret", Description: "oppo App Secret"},
		},
		LauncherManifestPlaceholders: []unityChannelKeyValue{
			{Key: "OPPO_APP_KEY", Value: "{{oppoAppKey}}"},
		},
		SettingsMavenRepos: []string{
			`maven {
    url 'https://maven.columbus.heytapmobi.com/repository/releases/'
    credentials {
        username 'nexus'
        password '<REDACTED>'
    }
}`,
		},
		InitParams: []unityChannelKeyValue{
			{Key: "appSecret", Value: "{{oppoAppSecret}}"},
		},
		ProguardRules: []string{
			"-keep class com.nearme.** { *; }",
			"-dontwarn com.nearme.**",
		},
	},
	"xiaomi": {
		DisplayName: "小米",
		RuixueLibs:  []string{"rxsdk_xiaomi"},
		Params: []unityChannelParam{
			{Key: "xiaomiAppId", Description: "小米 App ID"},
			{Key: "xiaomiAppKey", Description: "小米 App Key"},
		},
		LauncherManifestPlaceholders: []unityChannelKeyValue{
			{Key: "MI_APP_ID", Value: "{{xiaomiAppId}}"},
			{Key: "MI_APP_KEY", Value: "{{xiaomiAppKey}}"},
		},
		SettingsMavenRepos: []string{
			`maven {
    url "https://repos.xiaomi.com/maven"
    credentials {
        username 'mi-gamesdk'
        password '<REDACTED>'
    }
}`,
		},
		ProguardRules: []string{
			"-keep class com.xiaomi.** {*;}",
			"-keep class com.wali.** {*;}",
			"-keep class cn.com.wali.** {*;}",
			"-keep class com.miui.**{*;}",
			"-keep class com.alipay.android.app.IAlixPay{*;}",
			"-keep class com.alipay.android.app.IAlixPay$Stub{*;}",
			"-keep class com.alipay.android.app.IRemoteServiceCallback{*;}",
			"-keep class com.alipay.android.app.IRemoteServiceCallback$Stub{*;}",
			"-keep class com.alipay.sdk.app.PayTask{ public *;}",
			"-keep class com.alipay.sdk.app.AuthTask{ public *;}",
			"-keep class com.alipay.android.phone.mrpc.core.** { *; }",
			"-keep class com.alipay.apmobilesecuritysdk.** { *; }",
			"-keep class com.alipay.mobile.framework.service.annotation.** { *; }",
			"-keep class com.alipay.mobilesecuritysdk.face.** { *; }",
			"-keep class com.alipay.tscenter.biz.rpc.** { *; }",
			"-keep class org.json.alipay.** { *; }",
			"-keep class com.alipay.tscenter.** { *; }",
			"-keep class com.ta.utdid2.** { *;}",
			"-keep class com.ut.device.** { *;}",
			"-dontwarn com.ta.utdid2.**",
			"-dontwarn com.ut.device.**",
			"-dontwarn com.alipay.mobilesecuritysdk.**",
			"-dontwarn com.alipay.security.**",
			"-dontwarn android.net.SSLCertificateSocketFactory",
		},
	},
	"kwai": {
		DisplayName: "快手",
		RuixueLibs:  []string{"rxsdk_kwaiallin"},
		Params: []unityChannelParam{
			{Key: "kwaiAppId", Description: "快手 App ID"},
			{Key: "kwaiAppName", Description: "快手 App Name"},
		},
		LauncherManifestPlaceholders: []unityChannelKeyValue{
			{Key: "KWAI_APP_ID", Value: "{{kwaiAppId}}"},
			{Key: "KWAI_APP_NAME", Value: "{{kwaiAppName}}"},
		},
		Notes: []string{
			"必须配置瑞雪 RXApplication（AndroidManifest application 的 android:name=com.ruixue.openapi.RXApplication）",
			"游戏主 Activity 需配置 ks+游戏缩写://home 的 scheme",
		},
	},
	"honor": {
		DisplayName: "荣耀",
		RuixueLibs:  []string{"rxsdk_honor"},
		Params: []unityChannelParam{
			{Key: "honorAppId", Description: "荣耀 App ID"},
			{Key: "honorCpId", Description: "荣耀 CP ID"},
		},
		SettingsMavenRepos: []string{
			`maven { url 'https://developer.hihonor.com/repo' }`,
		},
		InitParams: []unityChannelKeyValue{
			{Key: "honor_appid", Value: "{{honorAppId}}"},
			{Key: "honor_cpid", Value: "{{honorCpId}}"},
		},
		Notes: []string{"沙盒支付需额外传 sandbox_token 参数"},
	},
	"douyin": {
		DisplayName: "抖音",
		RuixueLibs:  []string{"rxsdk_douyin_gb"},
		AssetFiles: []unityChannelAssetFile{
			{SourceParamKey: "configJsonPath", DestRelPath: "config.json"},
		},
		SettingsMavenRepos: []string{
			`maven {
    url 'https://jitpack.io'
}`,
			`maven {
    url 'https://artifact.bytedance.com/repository/ttgamesdk/'
}`,
		},
		Notes: []string{"config.json 中的 app_id 等需由使用方填写后再提供"},
	},
	"baidu": {
		DisplayName:       "百度",
		AndroidMinVersion: "4.0.18",
		RuixueLibs:        []string{"rxsdk_baidu_wangxun"},
		Params: []unityChannelParam{
			{Key: "baiduAppId", Description: "百度 App ID"},
			{Key: "baiduAppKey", Description: "百度 App Key"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "appid", Value: "{{baiduAppId}}"},
			{Key: "appkey", Value: "{{baiduAppKey}}"},
		},
		ProguardRules: []string{
			"-keep class com.baidu.** {\n    *;\n}",
			"-dontnote com.baidu.sapi2.**",
			"-dontwarn com.baidu.sapi2.**",
			"-dontwarn com.baidu.sofire.**",
		},
	},
	"huya": {
		DisplayName:       "虎牙联运",
		AndroidMinVersion: huyaAndroidMinVersion,
		RuixueLibs:        []string{"rxsdk_huya"},
		Params: []unityChannelParam{
			{Key: "huyaGameId", Description: "虎牙 game_id"},
			{Key: "huyaLoginClientId", Description: "虎牙 login_client_id"},
			{Key: "huyaLoginClientSecret", Description: "虎牙 login_client_secret；必须安全注入，禁止写入日志或提交仓库"},
			{Key: "huyaPayAppId", Description: "虎牙 pay_app_id"},
			{Key: "huyaDebugMode", Description: "联调为 true，生产必须为 false"},
			{Key: "huyaLandscapeMode", Description: "横屏为 true，竖屏为 false"},
			{Key: "huyaShowSwitchCount", Description: "是否在游戏中心显示切换账号入口"},
		},
		SettingsMavenRepos: []string{
			`maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}`,
		},
		InitParams: []unityChannelKeyValue{
			{Key: "game_id", Value: "{{huyaGameId}}"},
			{Key: "login_client_id", Value: "{{huyaLoginClientId}}"},
			{Key: "login_client_secret", Value: "{{huyaLoginClientSecret}}"},
			{Key: "pay_app_id", Value: "{{huyaPayAppId}}"},
			{Key: "huya_debug_mode", Value: "{{huyaDebugMode}}"},
			{Key: "landscape_mode", Value: "{{huyaLandscapeMode}}"},
			{Key: "show_switch_count_in_game_center", Value: "{{huyaShowSwitchCount}}"},
		},
		Notes: []string{
			"Unity 使用公共 Base/Login/Pay UPM 4.0.2 或更高版本，不需要虎牙专属 UPM",
			"先执行 RuiXueSdk.Initialize，再调用 InitThirdSdk；登录、支付、角色上报继续使用 RXLogin/RXPay/SetThirdGameInfo",
			"Android Activity 必须转发 onResume/onPause/onActivityResult/onRequestPermissionsResult",
		},
	},
	"xuteng": {
		DisplayName:       "栩腾",
		AndroidMinVersion: xutengAndroidMinVersion,
		RuixueLibs:        []string{"rxsdk_xuteng"},
		Params: []unityChannelParam{
			{Key: "xutengChannelSdkId", Description: "栩腾 CHANNELSDK_ID，由栩腾后台提供"},
			{Key: "xutengGameVersion", Description: "栩腾 CHANNELSDK_GAME_VERSION，由栩腾后台提供"},
		},
		LauncherManifestPlaceholders: []unityChannelKeyValue{
			{Key: "CHANNELSDK_ID", Value: "{{xutengChannelSdkId}}"},
			{Key: "CHANNELSDK_GAME_VERSION", Value: "{{xutengGameVersion}}"},
		},
		LauncherDefaultConfigLines: []string{
			"minSdkVersion 23",
		},
		AssetFiles: []unityChannelAssetFile{
			{SourceParamKey: "brsdkCfgPath", DestRelPath: "assets/brsdk.cfg"},
		},
		Notes: []string{
			"Unity 只使用公共 Base/Login/Pay UPM 4.0.3 或更高版本，不存在栩腾专属 UPM",
			"最终 AndroidManifest application 必须配置 com.ruixue.sdk.XTApplication；宿主自定义 Application 应继承 XTApplication",
			"brsdk.cfg 必须由栩腾母包工具生成并通过 brsdkCfgPath 提供，MCP 不生成假配置",
			"渠道 AAR 通过 consumer rules 透传混淆规则，无需复制专属混淆配置",
		},
	},
	"mumu": {
		DisplayName:       "MuMu/Yofun",
		AndroidMinVersion: mumuAndroidMinVersion,
		RuixueLibs:        []string{"rxsdk_yofun"},
		Params: []unityChannelParam{
			{Key: "mumuAppId", Description: "网易 Yofun 后台分配的 APP_ID"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "YOFUN_APP_ID", Value: "{{mumuAppId}}"},
		},
		LauncherDefaultConfigLines: []string{
			"multiDexEnabled true",
		},
		SettingsMavenRepos: []string{
			`maven { url "https://maven-release.webapp.163.com/repository/maven-releases/" }`,
		},
		Notes: []string{
			"Android 包名必须以 .yofun.mumu 结尾",
			"使用标准 RXApplication；其已自动处理 applicationAttach/applicationCreate，宿主不要重复转发",
			"公共 Base 已自动注入 MuMu 混淆规则，不需要专属 UPM BuildProcessor",
		},
	},
	"4399": {
		DisplayName: "4399",
		RuixueLibs:  []string{"rxsdk_4399"},
		Params: []unityChannelParam{
			{Key: "game4399AppId", Description: "4399 App ID"},
		},
		SettingsMavenRepos: []string{
			`maven {
    url 'https://mvn.4399doc.com/repository/maven-releases'
}`,
			`maven {
    url 'https://mvn.4399doc.com/repository/maven-snapshots'
}`,
		},
		InitParams: []unityChannelKeyValue{
			{Key: "appid", Value: "{{game4399AppId}}"},
		},
	},
	"ysdk": {
		DisplayName: "应用宝(YSDK)",
		RuixueLibs:  []string{"rxsdk_ysdk"},
		AssetFiles: []unityChannelAssetFile{
			{SourceParamKey: "ysdkconfIniPath", DestRelPath: "ysdkconf.ini"},
		},
		Notes: []string{
			"ysdkconf.ini 中需由使用方填写 QQ_APP_ID / WX_APP_ID / OFFER_ID",
			"应用宝渠道不需要带瑞雪微信组件库",
		},
	},
	"ninegame": {
		DisplayName: "九游(UC)",
		RuixueLibs:  []string{"rxsdk_9game"},
		Params: []unityChannelParam{
			{Key: "ucGameId", Description: "九游 uc_game_id"},
			{Key: "ninegamePackage", Description: "游戏包名（用于 PullupActivity 的 taskAffinity）"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "uc_game_id", Value: "{{ucGameId}}"},
		},
		ManifestSnippets: []string{
			`        <activity
            android:name="cn.uc.gamesdk.activity.PullupActivity"
            android:excludeFromRecents="true"
            android:exported="true"
            android:label="PullupActivity"
            android:launchMode="singleTop"
            android:taskAffinity="{{ninegamePackage}}.diff"
            android:theme="@android:style/Theme.Translucent"
            tools:node="replace"
            tools:replace="android:taskAffinity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="ng{{ucGameId}}" />
            </intent-filter>
        </activity>`,
		},
		ProguardRules: []string{
			"-keepclasseswithmembers class * extends cn.gundam.sdk.shell.even.SDKEventReceiver",
			"-keep class cn.uc.**{\n<methods>;\n<fields>;\n}",
			"-keep class cn.gundam.**{\n<methods>;\n<fields>;\n}",
		},
		Notes: []string{
			"全新游戏包名需使用 .aligames 后缀，游戏图标需添加九游角标",
			"还需在 res/values/strings.xml 配置 uc_game_id，并按文档处理重签名",
		},
	},
	"ld": {
		DisplayName: "雷电模拟器",
		RuixueLibs:  []string{"rxsdk_ld"},
		Params: []unityChannelParam{
			{Key: "ldGameId", Description: "雷电 GAME_ID"},
			{Key: "ldChannelId", Description: "雷电 CHANNEL_ID"},
			{Key: "ldSubChannelId", Description: "雷电 SUN_CHANNEL_ID"},
			{Key: "ldAppKey", Description: "雷电 ld_app_key"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "GAME_ID", Value: "{{ldGameId}}"},
			{Key: "CHANNEL_ID", Value: "{{ldChannelId}}"},
			{Key: "SUN_CHANNEL_ID", Value: "{{ldSubChannelId}}"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "ld_app_key", Value: "{{ldAppKey}}"},
		},
		ProguardRules: []string{
			"-keep class com.ld.sdk.** { *; }",
			"-keep class com.changzhi.net.** { *; }",
			"-dontwarn retrofit2.**",
			"-keep class retrofit2.** { *; }",
			"-keepattributes Signature",
			"-keepattributes Exceptions",
		},
		Notes: []string{"GAME_ID 如与游戏冲突可改为 LD_GAME_ID"},
	},
	"quick": {
		DisplayName: "Quick",
		RuixueLibs:  []string{"rxsdk_quick"},
		Params: []unityChannelParam{
			{Key: "quickProductCode", Description: "Quick product code"},
			{Key: "quickProductKey", Description: "Quick product key"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "quick_product_code", Value: "{{quickProductCode}}"},
			{Key: "quick_product_key", Value: "{{quickProductKey}}"},
		},
		Notes: []string{
			"需导出 Android Studio 工程：Application 继承 QuickSdkApplication，新增闪屏 QuickSdkSplashActivity",
			"AndroidManifest application 需配置 networkSecurityConfig",
		},
	},
	"taptap": {
		DisplayName: "TapTap",
		RuixueLibs:  []string{"rxsdk_taptap"},
		Params: []unityChannelParam{
			{Key: "taptapClientId", Description: "TapTap client_id"},
		},
		InitParams: []unityChannelKeyValue{
			{Key: "client_id", Value: "{{taptapClientId}}"},
		},
	},
	"bilibili": {
		DisplayName: "哔哩哔哩",
		RuixueLibs:  []string{"rxsdk_bilibili"},
		Params: []unityChannelParam{
			{Key: "bilibiliServerId", Description: "bilibili server_id"},
			{Key: "bilibiliServerName", Description: "bilibili server_name"},
			{Key: "bilibiliMerchantId", Description: "bilibili merchant_id"},
			{Key: "bilibiliAppId", Description: "bilibili appid"},
			{Key: "bilibiliAppKey", Description: "bilibili appkey"},
		},
		ManifestMeta: []unityChannelKeyValue{
			{Key: "BSGameSdk_PaidGame", Value: "false"},
		},
		ManifestSnippets: []string{
			`        <activity
            android:name="com.ruixue.sdk.BiliBiliWXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" />`,
		},
		InitParams: []unityChannelKeyValue{
			{Key: "server_id", Value: "{{bilibiliServerId}}"},
			{Key: "server_name", Value: "{{bilibiliServerName}}"},
			{Key: "merchant_id", Value: "{{bilibiliMerchantId}}"},
			{Key: "appid", Value: "{{bilibiliAppId}}"},
			{Key: "appkey", Value: "{{bilibiliAppKey}}"},
		},
		Notes: []string{"需在 AndroidManifest application 配置 android:name=com.ruixue.openapi.RXApplication"},
	},
	"oaid": {
		DisplayName: "OAID(信通院 MSA)",
		RuixueLibs:  []string{"rxsdk_oaidv2"},
		AssetFiles: []unityChannelAssetFile{
			{SourceParamKey: "supplierconfigJsonPath", DestRelPath: "supplierconfig.json"},
		},
		ProguardRules: []string{
			"-keep class com.bun.miitmdid.** { *; }",
			"-keep interface com.bun.supplier.** { *; }",
			"-keep class com.asus.msa.SupplementaryDID.** { *; }",
			"-keep class com.asus.msa.sdid.** { *; }",
			"-keep class com.android.creator.** { *; }",
			"-keep class com.android.msasdk.** { *; }",
			"-keep class com.huawei.hms.** {*;}",
			"-keep interface com.huawei.hms.** {*;}",
			"-keep class com.zui.deviceidservice.** { *; }",
			"-keep class com.zui.opendeviceidlibrary.** { *; }",
			"-keep class com.meizu.flyme.openidsdk.** { *; }",
			"-keep class com.heytap.openid.** { *; }",
			"-keep class com.samsung.android.deviceidservice.** { *; }",
			"-keep class com.vivo.identifier.** { *; }",
			"-keep class com.coolpad.deviceidsupport.** { *; }",
			"-keep class com.hihonor.ads.** {*; }",
		},
		Notes: []string{"通过 RXOaidv2.InitOaidSdk(certString) 传入 MSA 申请的 pem 证书内容"},
	},
	"weixin": {
		DisplayName: "微信",
		RuixueLibs:  []string{"rxsdk_weixin"},
		Params: []unityChannelParam{
			{Key: "weixinAppId", Description: "微信 AppID（iOS 写入设置资产，Android 在后台配置）"},
			{Key: "weixinAssociatedDomains", Description: "微信通用链接域名，形如 applinks:xxx.ruixue.com"},
			{Key: "weixinPackage", Description: "应用包名（用于 WXEntryActivity 的 taskAffinity）"},
		},
		ManifestSnippets: []string{
			`        <activity
            android:name="com.ruixue.wechat.WXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:taskAffinity="{{weixinPackage}}"
            android:launchMode="singleTask"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" />
        <activity-alias
            android:name="${applicationId}.wxapi.WXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:targetActivity="com.ruixue.wechat.WXEntryActivity" />`,
		},
		IOSAssets: []unityChannelIOSAsset{
			{AssetRelPath: "Assets/RuiXueSettings/RuiXueSDK_WeiXinXcodeSetting.asset", Fields: []unityChannelKeyValue{
				{Key: "AppID", Value: "{{weixinAppId}}"},
				{Key: "AssociatedDomains", Value: "{{weixinAssociatedDomains}}"},
			}},
		},
		Notes: []string{
			"如需支付能力，请将依赖改为 com.ruixue:rxsdk_weixin_withpay",
			"微信验证包名、签名、AppID 必须与开放平台配置完全一致",
		},
	},
	"yeepay": {
		DisplayName: "易宝支付",
		RuixueLibs:  []string{"rxsdk_yeepay"},
		Notes:       []string{"需配合微信 SDK 组件接收微信回调；支付接口参考瑞雪支付 API"},
	},
	"bytedance_ad": {
		DisplayName: "巨量广告",
		FixedLibs:   []string{"com.ruixue:rxsdk_bytedance_log:5.2.2"},
		SettingsMavenRepos: []string{
			`maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}`,
		},
		Notes: []string{
			"仅需接入 SDK，上报条件通过瑞雪投放模块窗口期配置，目前仅支持安卓",
			"在登录之前调用 RXBytedance.SetContext()",
		},
	},
}
