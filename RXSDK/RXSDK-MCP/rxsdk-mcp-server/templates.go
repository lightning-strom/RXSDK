package rxsdk

import (
	"embed"
	"text/template"
)

// ==================== 模板嵌入 ====================

//go:embed templates/android/*.tpl
var androidTemplatesFS embed.FS

//go:embed templates/ios/*.tpl
var iosTemplatesFS embed.FS

//go:embed templates/unity/*.tpl
var unityTemplatesFS embed.FS

//go:embed templates/unity_v2/*.tpl
var unityV2TemplatesFS embed.FS

//go:embed templates/minigame/*.tpl
var minigameTemplatesFS embed.FS

//go:embed templates/cocos2dx/*.tpl
var cocos2dxTemplatesFS embed.FS

//go:embed templates/ruixuego/*.tpl
var ruixuegoTemplatesFS embed.FS

func parseUnityV2TemplateOrFallback(fileName string) *template.Template {
	v2Path := "templates/unity_v2/" + fileName
	if _, err := unityV2TemplatesFS.ReadFile(v2Path); err == nil {
		return template.Must(template.ParseFS(unityV2TemplatesFS, v2Path))
	}

	v1Path := "templates/unity/" + fileName
	return template.Must(template.ParseFS(unityTemplatesFS, v1Path))
}

// ==================== Android 模板 ====================
var (
	// 基础模板
	androidInitTpl          = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/init.tpl"))
	androidDependencyTpl    = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/dependency.tpl"))
	androidAgentTpl         = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/agent_example.tpl"))
	androidLoginTpl         = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/login.tpl"))
	androidLoginApiTpl      = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/login_api.tpl"))
	androidPaymentTpl       = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/payment.tpl"))
	androidXingYiPaymentTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/xingyi_payment.tpl"))
	androidUnifypayTpl      = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/unifypay.tpl"))
	androidSetupTpl         = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/setup.tpl"))

	// 用户通行证模板
	androidPassportTpl       = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/passport.tpl"))
	androidCaptchaTpl        = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/captcha.tpl"))
	androidRealAuthTpl       = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/real_auth.tpl"))
	androidAccountBindingTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/account_binding.tpl"))
	androidPasswordTpl       = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/password.tpl"))
	androidDeregisterTpl     = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/deregister.tpl"))

	// 社交模板
	androidSocialTpl  = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/social.tpl"))
	androidFriendsTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/friends.tpl"))
	androidLbsTpl     = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/lbs.tpl"))
	androidRankTpl    = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/rank.tpl"))

	// 游戏区服角色模板
	androidGameAreaTpl      = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/game_area.tpl"))
	androidGameCharacterTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/game_character.tpl"))
	androidMumuTpl          = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/mumu.tpl"))
	androidGDTTpl           = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/gdt.tpl"))
	androidHuyaTpl          = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/huya.tpl"))
	androidBaiduTpl         = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/baidu.tpl"))
	androidXutengTpl        = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/xuteng.tpl"))

	// 其他功能模板
	androidShareTpl        = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/share.tpl"))
	androidFeedbackTpl     = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/feedback.tpl"))
	androidTrackingTpl     = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/tracking.tpl"))
	androidVersionCheckTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/version_check.tpl"))
	androidLegalTpl        = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/legal.tpl"))
	androidLegalUITpl      = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/legal_ui.tpl"))
	androidPromoTpl        = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/promo.tpl"))
	androidAnnouncementTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/announcement.tpl"))
	androidDeviceTpl       = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/device.tpl"))
	androidUserCenterTpl   = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/user_center_ui.tpl"))

	// 组件库模板
	androidTopOnTpl    = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/topon.tpl"))
	androidFirebaseTpl = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/firebase.tpl"))
	androidAdjustTpl   = template.Must(template.ParseFS(androidTemplatesFS, "templates/android/adjust.tpl"))
)

// ==================== iOS 模板 ====================
var (
	// 基础模板
	iosInitTpl          = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/init.tpl"))
	iosAgentTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/agent_example.tpl"))
	iosLoginTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/login.tpl"))
	iosAppleSigninTpl   = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/apple_signin_config.tpl"))
	iosSetupTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/setup.tpl"))
	iosProjectConfigTpl = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/project_config.tpl"))

	// 用户通行证模板
	iosPassportTpl       = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/passport.tpl"))
	iosCaptchaTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/captcha.tpl"))
	iosRealAuthTpl       = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/real_auth.tpl"))
	iosAccountBindingTpl = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/account_binding.tpl"))
	iosPasswordTpl       = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/password.tpl"))
	iosDeregisterTpl     = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/deregister.tpl"))

	// 游戏区服角色模板
	iosGameAreaTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/game_area.tpl"))
	iosGameCharacterTpl = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/game_character.tpl"))

	// 社交模板
	iosSocialTpl  = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/social.tpl"))
	iosFriendsTpl = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/friends.tpl"))
	iosLbsTpl     = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/lbs.tpl"))
	iosRankTpl    = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/rank.tpl"))

	// 其他功能模板
	iosIapTpl           = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/iap.tpl"))
	iosXingYiPaymentTpl = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/xingyi_payment.tpl"))
	iosUnifypayTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/unifypay.tpl"))
	iosHuyaTpl          = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/huya.tpl"))
	iosBaiduTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/baidu.tpl"))
	iosXutengTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/xuteng.tpl"))
	iosShareTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/share.tpl"))
	iosFeedbackTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/feedback.tpl"))
	iosTrackingTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/tracking.tpl"))
	iosPromoTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/promo.tpl"))
	iosLegalUITpl       = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/legal_ui.tpl"))
	iosAnnouncementTpl  = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/announcement.tpl"))
	iosDeviceTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/device.tpl"))
	iosVersionCheckTpl  = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/version_check.tpl"))
	iosStoreReviewTpl   = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/store_review.tpl"))
	iosDNSTpl           = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/dns.tpl"))
	iosOpeninstallTpl   = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/openinstall.tpl"))
	iosGPMTpl           = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/gpm.tpl"))
	iosBytedanceAdTpl   = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/bytedance_ad.tpl"))
	iosGDTTpl           = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/gdt.tpl"))
	iosTencentAdTpl     = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/tencent_ad.tpl"))
	iosAdjustTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/adjust.tpl"))
	iosFirebaseTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/firebase.tpl"))
	iosASATpl           = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/asa.tpl"))
	iosGameCenterTpl    = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/game_center.tpl"))
	iosUserCenterTpl    = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/user_center_ui.tpl"))
	iosGoogleTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/google.tpl"))
	iosFacebookTpl      = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/facebook.tpl"))
	iosLineTpl          = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/line.tpl"))
	iosZaloTpl          = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/zalo.tpl"))
	iosTikTokTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/tiktok.tpl"))
	iosInstagramTpl     = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/instagram.tpl"))
	iosRedditTpl        = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/reddit.tpl"))
	iosTopOnTpl         = template.Must(template.ParseFS(iosTemplatesFS, "templates/ios/topon.tpl"))
)

// ==================== Unity 模板 ====================
var (
	// 基础模板
	unityInitTpl               = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/init.tpl"))
	unityDependencyTpl         = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/dependency.tpl"))
	unityAgentTpl              = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/agent_example.tpl"))
	unityLoginTpl              = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/login.tpl"))
	unityAppleSigninTpl        = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/apple_signin_config.tpl"))
	unitySetupTpl              = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/setup.tpl"))
	unityAndroidNativeSetupTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/android_native_setup.tpl"))
	unityPaymentTpl            = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/payment.tpl"))
	unityXingYiPaymentTpl      = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/xingyi_payment.tpl"))
	unityUnifypayTpl           = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/unifypay.tpl"))

	// 用户通行证模板
	unityPassportTpl = template.Must(template.ParseFS(
		unityTemplatesFS,
		"templates/unity/passport.tpl",
		"templates/unity/native_dependency_upgrade.tpl",
	))
	unityCaptchaTpl  = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/captcha.tpl"))
	unityRealAuthTpl = template.Must(template.ParseFS(
		unityTemplatesFS,
		"templates/unity/real_auth.tpl",
		"templates/unity/native_dependency_upgrade.tpl",
	))
	unityAccountBindingTpl = template.Must(template.ParseFS(
		unityTemplatesFS,
		"templates/unity/account_binding.tpl",
		"templates/unity/native_dependency_upgrade.tpl",
	))
	unityPasswordTpl   = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/password.tpl"))
	unityDeregisterTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/deregister.tpl"))

	// 社交模板
	unitySocialTpl  = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/social.tpl"))
	unityFriendsTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/friends.tpl"))
	unityLbsTpl     = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/lbs.tpl"))
	unityRankTpl    = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/rank.tpl"))

	// 游戏区服角色模板
	unityGameAreaTpl      = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/game_area.tpl"))
	unityGameCharacterTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/game_character.tpl"))
	unityMumuTpl          = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/mumu.tpl"))
	unityGDTTpl           = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/gdt.tpl"))
	unityHuyaTpl          = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/huya.tpl"))
	unityBaiduTpl         = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/baidu.tpl"))
	unityXutengTpl        = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/xuteng.tpl"))

	// 其他功能模板
	unityShareTpl        = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/share.tpl"))
	unityFeedbackTpl     = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/feedback.tpl"))
	unityTrackingTpl     = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/tracking.tpl"))
	unityLegalUITpl      = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/legal_ui.tpl"))
	unityPromoTpl        = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/promo.tpl"))
	unityAnnouncementTpl = template.Must(template.ParseFS(
		unityTemplatesFS,
		"templates/unity/announcement.tpl",
		"templates/unity/native_dependency_upgrade.tpl",
	))
	unityDeviceTpl       = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/device.tpl"))
	unityUserCenterTpl   = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/user_center_ui.tpl"))
	unityAdTpl           = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/ad.tpl"))
	unityPushTpl         = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/push.tpl"))
	unityVersionCheckTpl = template.Must(template.ParseFS(
		unityTemplatesFS,
		"templates/unity/version_check.tpl",
		"templates/unity/native_dependency_upgrade.tpl",
	))
	unityReviewTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/review.tpl"))

	// 小游戏（WebGL）模板
	unityMiniGameWeiXinTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/minigame_weixin.tpl"))
	unityMiniGameDouYinTpl = template.Must(template.ParseFS(unityTemplatesFS, "templates/unity/minigame_douyin.tpl"))
)

// ==================== Unity v2 模板 ====================
var (
	unityV2InitTpl       = parseUnityV2TemplateOrFallback("init.tpl")
	unityV2DependencyTpl = parseUnityV2TemplateOrFallback("dependency.tpl")
	unityV2AgentTpl      = parseUnityV2TemplateOrFallback("agent_example.tpl")
	unityV2LoginTpl      = parseUnityV2TemplateOrFallback("login.tpl")
	unityV2SetupTpl      = parseUnityV2TemplateOrFallback("setup.tpl")
	unityV2PaymentTpl    = parseUnityV2TemplateOrFallback("payment.tpl")

	// 其余功能：优先加载 templates/unity_v2/*.tpl，不存在时回退到 templates/unity/*.tpl
	unityV2PassportTpl       = parseUnityV2TemplateOrFallback("passport.tpl")
	unityV2CaptchaTpl        = parseUnityV2TemplateOrFallback("captcha.tpl")
	unityV2RealAuthTpl       = parseUnityV2TemplateOrFallback("real_auth.tpl")
	unityV2AccountBindingTpl = parseUnityV2TemplateOrFallback("account_binding.tpl")
	unityV2PasswordTpl       = parseUnityV2TemplateOrFallback("password.tpl")
	unityV2DeregisterTpl     = parseUnityV2TemplateOrFallback("deregister.tpl")
	unityV2SocialTpl         = parseUnityV2TemplateOrFallback("social.tpl")
	unityV2FriendsTpl        = parseUnityV2TemplateOrFallback("friends.tpl")
	unityV2LbsTpl            = parseUnityV2TemplateOrFallback("lbs.tpl")
	unityV2RankTpl           = parseUnityV2TemplateOrFallback("rank.tpl")
	unityV2ShareTpl          = parseUnityV2TemplateOrFallback("share.tpl")
	unityV2FeedbackTpl       = parseUnityV2TemplateOrFallback("feedback.tpl")
	unityV2TrackingTpl       = parseUnityV2TemplateOrFallback("tracking.tpl")
	unityV2LegalUITpl        = parseUnityV2TemplateOrFallback("legal_ui.tpl")
	unityV2PromoTpl          = parseUnityV2TemplateOrFallback("promo.tpl")
	unityV2AnnouncementTpl   = parseUnityV2TemplateOrFallback("announcement.tpl")
	unityV2DeviceTpl         = parseUnityV2TemplateOrFallback("device.tpl")
	unityV2UserCenterTpl     = parseUnityV2TemplateOrFallback("user_center_ui.tpl")
	unityV2AdTpl             = parseUnityV2TemplateOrFallback("ad.tpl")
	unityV2PushTpl           = parseUnityV2TemplateOrFallback("push.tpl")
	unityV2VersionCheckTpl   = parseUnityV2TemplateOrFallback("version_check.tpl")
	unityV2ReviewTpl         = parseUnityV2TemplateOrFallback("review.tpl")
	unityV2GameAreaTpl       = parseUnityV2TemplateOrFallback("game_area.tpl")
	unityV2GameCharacterTpl  = parseUnityV2TemplateOrFallback("game_character.tpl")
)

// ==================== Minigame 模板 ====================
var (
	minigameInitTpl           = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/init.tpl"))
	minigameLoginTpl          = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/login.tpl"))
	minigamePaymentTpl        = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/payment.tpl"))
	minigamePassportTpl       = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/passport.tpl"))
	minigameCaptchaTpl        = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/captcha.tpl"))
	minigameAccountBindingTpl = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/account_binding.tpl"))
	minigameDeregisterTpl     = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/deregister.tpl"))
	minigameShareTpl          = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/share.tpl"))
	minigameFeedbackTpl       = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/feedback.tpl"))
	minigameTrackingTpl       = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/tracking.tpl"))
	minigameAdTpl             = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/ad.tpl"))
	minigameLbsTpl            = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/lbs.tpl"))
	minigameGameAreaTpl       = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/game_area.tpl"))
	minigameGameCharacterTpl  = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/game_character.tpl"))
	minigamePromoTpl          = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/promo.tpl"))
	minigameAnnouncementTpl   = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/announcement.tpl"))
	minigameDeviceTpl         = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/device.tpl"))
	minigameSocialTpl         = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/social.tpl"))
	minigameVersionCheckTpl   = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/version_check.tpl"))
	minigameGDTTpl            = template.Must(template.ParseFS(minigameTemplatesFS, "templates/minigame/gdt.tpl"))
)

// ==================== Cocos2dx 模板 ====================
var (
	cocos2dxGDTTpl           = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/gdt.tpl"))
	cocos2dxShareTpl         = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/share.tpl"))
	cocos2dxXingYiPaymentTpl = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/xingyi_payment.tpl"))
	cocos2dxUnifypayTpl      = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/unifypay.tpl"))
	cocos2dxHuyaTpl          = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/huya.tpl"))
	cocos2dxBaiduTpl         = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/baidu.tpl"))
	cocos2dxXutengTpl        = template.Must(template.ParseFS(cocos2dxTemplatesFS, "templates/cocos2dx/xuteng.tpl"))
)

// ==================== Ruixuego（Go 服务端 SDK）模板 ====================
var (
	ruixuegoInitTpl        = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/init.tpl"))
	ruixuegoDependencyTpl  = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/dependency.tpl"))
	ruixuegoAgentTpl       = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/agent.tpl"))
	ruixuegoOpenIDTpl      = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/openid.tpl"))
	ruixuegoPassportTpl    = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/passport.tpl"))
	ruixuegoSocialTpl      = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/social.tpl"))
	ruixuegoLBSTpl         = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/lbs.tpl"))
	ruixuegoRankTpl        = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/rank.tpl"))
	ruixuegoBigdataTpl     = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/bigdata.tpl"))
	ruixuegoIMSTpl         = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/ims.tpl"))
	ruixuegoPusherTpl      = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/pusher.tpl"))
	ruixuegoRiskTpl        = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/risk.tpl"))
	ruixuegoPayTpl         = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/pay.tpl"))
	ruixuegoOperationTpl   = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/operation.tpl"))
	ruixuegoCPRoleTpl      = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/cp_role.tpl"))
	ruixuegoAttributionTpl = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/attribution.tpl"))
	ruixuegoSiyuTpl        = template.Must(template.ParseFS(ruixuegoTemplatesFS, "templates/ruixuego/siyu.tpl"))
)
