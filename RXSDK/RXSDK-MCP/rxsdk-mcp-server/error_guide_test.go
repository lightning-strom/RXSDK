package rxsdk

import (
	"context"
	"strings"
	"testing"
)

func TestErrorGuideHandlerMatchesAndroidPushKeyword(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "ruixue push plugin init failed, no push channel plugin support.",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected keyword to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "推送插件初始化失败") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerMatchesIOSExactCode(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "ios",
		Code:     "3001",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected exact code to match, got unmatched result: %+v", result)
	}
	if result.ErrorCode != "3001" {
		t.Fatalf("unexpected error code: %s", result.ErrorCode)
	}
}

func TestErrorGuideHandlerMatchesIOSWechatLoginCallbackIntercepted(t *testing.T) {
	testCases := []struct {
		platform string
		keyword  string
	}{
		{platform: "ios", keyword: "微信登录授权成功返回后没有登录成功回调"},
		{platform: "ios", keyword: "微信授权成功返回但没有登录成功回调"},
		{platform: "ios", keyword: "项目重写了 onOpenURL，微信登录没有成功回调"},
		{platform: "unity", keyword: "iOS 微信登录授权成功返回后没有登录成功回调"},
	}

	for _, testCase := range testCases {
		t.Run(testCase.platform+"/"+testCase.keyword, func(t *testing.T) {
			_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
				Platform: testCase.platform,
				Keyword:  testCase.keyword,
				Scene:    "login",
			})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !result.Matched {
				t.Fatalf("expected keyword to match, got unmatched result: %+v", result)
			}
			if !strings.Contains(result.RawSource, "ios-wechat-login-callback-intercepted") {
				t.Fatalf("unexpected raw source: %s", result.RawSource)
			}
			if !strings.Contains(result.Solutions[0], "[[RXSDK sharedSDK] application:app openURL:url options:options];") {
				t.Fatalf("missing manual openURL forwarding code: %+v", result.Solutions)
			}
			if !strings.Contains(result.Solutions[0], "正常情况 SDK 内部会自动监听 onOpenURL") {
				t.Fatalf("missing requested explanation comment: %+v", result.Solutions)
			}
		})
	}
}

func TestErrorGuideHandlerMatchesUnityNotSupport(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "unity",
		Code:     "-1001",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected unity code -1001 to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "不支持") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureGoogleLoginTimeout(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  `{"msg":"登录失败","code":3000,"thirdcode":-1,"thirdmsg":"login time out."}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected apkpure google login timeout to match, got unmatched result: %+v", result)
	}
	if len(result.Solutions) != 1 || result.Solutions[0] != "请确认当前网络环境是否能访问外网" {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureLineChannelMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  `{"msg":"登录失败","code":3000,"thirdcode":-1,"thirdmsg":"LINE Channel ID未配置"}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected apkpure line config error to match, got unmatched result: %+v", result)
	}
	if len(result.Solutions) != 1 || !strings.Contains(result.Solutions[0], "请确认渠道是否配置了 Line 登录") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureVKWebLoginFailure(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "APKPure 渠道 VK登录，拉起网页失败",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected vk web login failure to match, got unmatched result: %+v", result)
	}
	if len(result.Solutions) != 1 || result.Solutions[0] != "请确认当前网络环境是否能访问外网" {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureGoogleSdkNotInit(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "2002",
		Keyword:  "google sdk not init",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected google sdk not init to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "Google 登录") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureVKClientIdMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "2002",
		Keyword:  "VK not initialized, check vk_client_id in ext",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected vk client id error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "vk_client_id") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureInstagramConfigMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "client id is null or redirect url is null.",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected instagram config error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "Instagram 登录") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureTiktokLoginError(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "tiktok login error resp is null",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected tiktok login error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "外网") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidApkpureRedditNotInitialized(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "2000",
		Keyword:  "reddit_clientid reddit_redirecturi 没有初始化",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected reddit init error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "reddit_clientid") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidHuaweiProductIdMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4102",
		Keyword:  "huawei product id is null error.",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected huawei product id error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "华为计费点") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidRuStoreThirdTagMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4101",
		Keyword:  "RuStore product id (third_tag) is null",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected rustore third_tag error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "RuStore 计费点") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidHQUnsupportedPayType(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4102",
		Keyword:  "不支持的方式！HQT_UNKNOWN",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected unsupported hq type to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "支付方式") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerMatchesAndroidXingYiH5UrlEmpty(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "xingyi h5 pay url is empty, check order plug_url / ext.h5PayData.payUrl",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected xingyi h5 url empty to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "星驿") && !strings.Contains(result.Summary, "星轶") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
	joined := strings.Join(result.Solutions, " ")
	if !strings.Contains(joined, "is_h5") && !strings.Contains(joined, "rxsdk_h5pay") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesIOSIAPNoProducts(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "ios",
		Code:     "4202",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected ios iap no products to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "App Store Connect") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidGoogleSkuNameEmpty(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  `{"msg":"支付錯誤","code":4002,"thirdcode":5,"thirdmsg":"SKU name can't be empty."}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected Google sku name empty error to match, got unmatched result: %+v", result)
	}
	expectedSolutions := []string{
		"检查瑞雪后台是否配置了三方计费点",
		"检查 google 后台该计费点是否可用",
		"用户 Google play 账号所在地区是否支持付费",
	}
	if strings.Join(result.Solutions, "\n") != strings.Join(expectedSolutions, "\n") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesUnityPayParamsError(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "unity",
		Code:     "4000",
		Keyword:  "支付参数错误 productId tradeNo",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected unity pay params error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "RXPay") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesCocosPayGoodsTagMissing(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "cocos2dx",
		Code:     "-1",
		Keyword:  "goodsTag 商品标签不能为空",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected cocos pay params error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "goodsTag") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesMinigamePayTypeError(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "minigame",
		Code:     "4300",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected minigame pay type error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "支付方式") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerFallsBackToCommonRange(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "cocos2dx",
		Code:     "6100",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected common range to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "权限") && !strings.Contains(result.Summary, "未安装") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerMatchesAndroidThirdTagNullPrecisely(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4101",
		Keyword:  "Error third_tag is null.",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected exact error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "Google 支付订单缺少 third_tag") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
	if len(result.Solutions) != 1 || result.Solutions[0] != "瑞雪后台未配置 Google 计费点，请前往后台进行配置" {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidExtProductIDNullPrecisely(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4101",
		Keyword:  `{"msg":"ext.product_id is null","code":4101}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected exact ext.product_id error to match, got unmatched result: %+v", result)
	}
	if len(result.Solutions) != 1 || result.Solutions[0] != "瑞雪后台未配置三方计费点，请前往后台进行配置" {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidProductIDNullFromRawCodePayload(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     `{"code":4101,"msg":"支付错误","thirdcode":-1,"thirdmsg":"product_id is null"}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected raw code payload to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "三方支付订单缺少 ext.product_id") {
		t.Fatalf("expected product_id precise match, got: %+v", result)
	}
	if result.RawSource != "knowledge/errors/android.json#android-third-party-product-id-null-4101" {
		t.Fatalf("expected android precise raw source, got: %s", result.RawSource)
	}
}

func TestErrorGuideHandlerMatchesNativeAndroidErrorFromUnityPlatform(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "unity",
		Code:     "4101",
		Keyword:  `{"code":4101,"msg":"支付错误","thirdcode":-1,"thirdmsg":"product_id is null"}`,
		Scene:    "pay",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected unity surfaced native android error to match, got unmatched result: %+v", result)
	}
	if result.Platform != "android" {
		t.Fatalf("expected native android platform result, got: %s", result.Platform)
	}
	if result.RawSource != "knowledge/errors/android.json#android-third-party-product-id-null-4101" {
		t.Fatalf("expected android precise raw source, got: %s", result.RawSource)
	}
}

func TestErrorGuideHandlerMatchesNativeAndroidErrorWithoutPlatform(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Code:    "4101",
		Keyword: `{"code":4101,"msg":"支付错误","thirdcode":-1,"thirdmsg":"product_id is null"}`,
		Scene:   "pay",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected platform-free query to match, got unmatched result: %+v", result)
	}
	if result.RawSource != "knowledge/errors/android.json#android-third-party-product-id-null-4101" {
		t.Fatalf("expected android precise raw source, got: %s", result.RawSource)
	}
}

func TestErrorGuideHandlerDoesNotTreatPlain4101AsThirdTagNull(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4101",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Matched {
		t.Fatalf("plain 4101 should ask for more details instead of matching generic guidance: %+v", result)
	}
	if result.RawSource != "knowledge/errors/*#ambiguous-code-4101" {
		t.Fatalf("plain 4101 should prefer cross-platform ambiguous result, got: %s", result.RawSource)
	}
	if !strings.Contains(result.Summary, "需要补充完整错误信息") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
	if !containsString(result.PossibleCauses, "android-third-party-product-id-null-4101") {
		t.Fatalf("expected product_id candidate, got: %+v", result.PossibleCauses)
	}
	if !containsString(result.PossibleCauses, "android-google-third-tag-null-4101") {
		t.Fatalf("expected third_tag candidate, got: %+v", result.PossibleCauses)
	}
}

func TestErrorGuideHandlerMatchesAndroidJiuyouInvalidAppGoods(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4001",
		Keyword:  `jiuyou pay result 4001 Auth {"error_code":"INVALID_APP_GOODS","error_msg":"暂未开通支付功能，敬请期待"}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected Jiuyou INVALID_APP_GOODS to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "INVALID_APP_GOODS") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
	if !strings.Contains(strings.Join(result.Solutions, "\n"), "九游后台") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerDoesNotTreatPlain4001AsJiuyouInvalidAppGoods(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "4001",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected 4001 to still fall back to generic pay cancel guidance, got unmatched result: %+v", result)
	}
	if strings.Contains(result.Summary, "INVALID_APP_GOODS") {
		t.Fatalf("plain 4001 should not be treated as Jiuyou INVALID_APP_GOODS: %+v", result)
	}
}

func TestErrorGuideHandlerMatchesAndroidYsdkMissingPlatformType(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  `error: required for platform_type params {"msg":"登录失败","code":3000}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected ysdk platform_type error to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Summary, "platform_type") {
		t.Fatalf("unexpected summary: %s", result.Summary)
	}
}

func TestErrorGuideHandlerMatchesAndroidMissingRXSdkUI(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "java.lang.ClassNotFoundException: com.ruixue.openapi.RXSdkUI",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected RXSdkUI ClassNotFoundException to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "rxsdk_base_ui") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerMatchesAndroidIIFAAValidateRetry(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Code:     "310039",
		Keyword:  "iifaa validate",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Matched {
		t.Fatalf("expected IIFAA 310039 to match, got unmatched result: %+v", result)
	}
	if !strings.Contains(result.Solutions[0], "getIIFAAResultWithRetryCount") {
		t.Fatalf("unexpected solutions: %+v", result.Solutions)
	}
}

func TestErrorGuideHandlerReturnsHelpfulUnmatchedResult(t *testing.T) {
	_, result, err := ErrorGuideHandler(context.Background(), nil, ErrorGuideInput{
		Platform: "android",
		Keyword:  "this is a brand new error",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Matched {
		t.Fatalf("expected unmatched result, got: %+v", result)
	}
	if len(result.Solutions) == 0 {
		t.Fatalf("expected unmatched result to include solutions")
	}
}

func containsString(values []string, keyword string) bool {
	for _, value := range values {
		if strings.Contains(value, keyword) {
			return true
		}
	}
	return false
}
