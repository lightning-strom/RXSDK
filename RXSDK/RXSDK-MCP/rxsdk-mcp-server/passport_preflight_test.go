package rxsdk

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPassportTemplatesIncludeBaseSetupAndVersionChecks(t *testing.T) {
	cases := []struct {
		name    string
		spec    string
		wantAll []string
	}{
		{
			name: "android",
			spec: mustAndroidPassportSpec(t),
			wantAll: []string{
				"preflight_check",
				"android feature=setup version=4.0.9",
				"依赖版本 >= 4.0.9",
				"RXSDK.initialize",
				"account: [\"method\"]",
			},
		},
		{
			name: "ios",
			spec: mustIOSPassportSpec(t),
			wantAll: []string{
				"preflight_check",
				"RXSDK_Pure: \">= 4.0.4\"",
				"initWithConfig:complete:",
				"ios feature=init",
				"account: [\"method\"]",
			},
		},
		{
			name: "unity",
			spec: mustUnityPassportSpec(t),
			wantAll: []string{
				"preflight_check",
				"com.ruixue.unitysdk.login: \">= 1.6.26\"",
				"native_version_check",
				"RXSDK_Pure: \"4.0.4\"",
				"account: [\"method\"]",
			},
		},
		{
			name: "minigame",
			spec: mustMinigamePassportSpec(t),
			wantAll: []string{
				"0. 接入前强制检查",
				"getUserInfoByFieldApi",
				"productId、channelId、cpid、baseUrlList",
				"account: ['method']",
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			for _, want := range tc.wantAll {
				if !strings.Contains(tc.spec, want) {
					t.Fatalf("expected passport spec to contain %q", want)
				}
			}
		})
	}
}

func mustAndroidPassportSpec(t *testing.T) string {
	t.Helper()
	_, output, err := AndroidPassportHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidPassportHandler failed: %v", err)
	}
	return output.Spec
}

func mustIOSPassportSpec(t *testing.T) string {
	t.Helper()
	_, output, err := IOSPassportHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("IOSPassportHandler failed: %v", err)
	}
	return output.Spec
}

func mustUnityPassportSpec(t *testing.T) string {
	t.Helper()
	_, output, err := UnityPassportHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("UnityPassportHandler failed: %v", err)
	}
	return output.Spec
}

func mustMinigamePassportSpec(t *testing.T) string {
	t.Helper()
	_, output, err := MinigamePassportHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("MinigamePassportHandler failed: %v", err)
	}
	return output.Spec
}

func TestPassportPreflightAutoUpgradesSDKVersions(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.8'
}
`)
		writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
class App {
    void init() {
        RXSdkInitConfig config = null;
        RXSDK.initialize(null, config);
    }
}
`)
		result := androidPassportPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected android preflight satisfied, got: %+v", result)
		}
		content := readTestFile(t, filepath.Join(dir, "app", "build.gradle"))
		if !strings.Contains(content, "com.ruixue:rxsdk_base:4.0.9") {
			t.Fatalf("expected android dependency upgraded, got:\n%s", content)
		}
	})

	t.Run("ios", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Podfile"), `pod 'RXSDK_Pure', '4.0.3'`)
		writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), `
void initSDK() {
    RXSdkInitConfig *config = nil;
    [[RXSDK sharedSDK] initWithConfig:config complete:nil];
}
`)
		result := iosPassportPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected ios preflight satisfied, got: %+v", result)
		}
		content := readTestFile(t, filepath.Join(dir, "Podfile"))
		if !strings.Contains(content, "pod 'RXSDK_Pure', '4.0.4'") {
			t.Fatalf("expected iOS pod upgraded, got:\n%s", content)
		}
	})

	t.Run("unity", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.25"
  }
}`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
class Init {
    void Start() {
        RuiXueSdk.Initialize(null, null, null);
    }
}
`)
		result := unityPassportPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected unity preflight satisfied, got: %+v", result)
		}
		content := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
		for _, want := range []string{
			`"com.ruixue.unitysdk.base": "1.6.26"`,
			`"com.ruixue.unitysdk.login": "1.6.26"`,
		} {
			if !strings.Contains(content, want) {
				t.Fatalf("expected unity manifest to contain %s, got:\n%s", want, content)
			}
		}
	})
}

func TestUnityAnnouncementTemplateIncludesTempNoticeAndVersionCheck(t *testing.T) {
	_, output, err := UnityAnnouncementHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("UnityAnnouncementHandler failed: %v", err)
	}
	for _, want := range []string{
		"RuiXueSdk.GetTempNotice",
		"1.6.28",
		"native_version_check",
		"com.ruixue.unitysdk.base",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected announcement spec to contain %q", want)
		}
	}
}

func TestAndroidGameCharacterTemplateIncludesSetGameInfoVersionCheck(t *testing.T) {
	_, output, err := AndroidGameCharacterHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidGameCharacterHandler failed: %v", err)
	}
	for _, want := range []string{
		"setGameInfo(GameInfo)",
		"Android SDK >= 4.0.16",
		"preflight_check",
		"android feature=setup version=4.0.16",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected game_character spec to contain %q", want)
		}
	}
}

func TestIOSShareTemplateIncludesShowContentInCircle(t *testing.T) {
	_, output, err := IOSShareHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("IOSShareHandler failed: %v", err)
	}
	for _, want := range []string{
		"show_content_in_circle",
		"RXSDK_Pure: \">= 4.0.5\"",
		"低于 4.0.5 时会自动升级到 4.0.5",
		"分享到朋友圈的文案是否展示 content，true 展示 content，false 展示 title，默认 false",
		"朋友圈只支持展示 title",
		`将 "title" 内容替换成 "content" 内容`,
		"YES 时用 content 替换 title",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected iOS share spec to contain %q", want)
		}
	}
}

func TestIOSSharePreflightRequiresWorkspace(t *testing.T) {
	_, output, err := IOSUnifiedHandler(context.Background(), nil, struct {
		Feature              string `json:"feature"`
		Region               string `json:"region"`
		WorkspacePath        string `json:"workspacePath"`
		TargetName           string `json:"targetName"`
		Provider             string `json:"provider"`
		UniversalLinkDomain  string `json:"universalLinkDomain"`
		AppKey               string `json:"appKey"`
		WechatAppId          string `json:"wechatAppId"`
		UniversalLink        string `json:"universalLink"`
		GIDClientID          string `json:"gidClientId"`
		GoogleURLScheme      string `json:"googleUrlScheme"`
		FacebookAppID        string `json:"facebookAppId"`
		FacebookClientToken  string `json:"facebookClientToken"`
		LineChannelID        string `json:"lineChannelId"`
		ZaloAppID            string `json:"zaloAppId"`
		TikTokAppID          string `json:"tiktokAppId"`
		InstagramClientID    string `json:"instagramClientId"`
		InstagramRedirectURI string `json:"instagramRedirectUri"`
		RedditClientID       string `json:"redditClientId"`
		RedditRedirectURI    string `json:"redditRedirectUri"`
	}{
		Feature: "share",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "ios feature=share") {
		t.Fatalf("expected share retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestIOSSharePreflightAutoUpgradesSDKVersion(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), `pod 'RXSDK_Pure', '4.0.4'`)
	writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), `
void initSDK() {
    RXSdkInitConfig *config = nil;
    [[RXSDK sharedSDK] initWithConfig:config complete:nil];
}
`)

	preflight := iosSharePreflight(dir)
	if !preflight.Satisfied {
		t.Fatalf("expected iOS share preflight satisfied, got: %+v", preflight)
	}
	content := readTestFile(t, filepath.Join(dir, "Podfile"))
	if !strings.Contains(content, "pod 'RXSDK_Pure', '4.0.5'") {
		t.Fatalf("expected Podfile upgraded, got:\n%s", content)
	}
}

func TestAndroidPaymentTemplateIncludesRustoreVersionCheck(t *testing.T) {
	_, output, err := AndroidPaymentHandler(context.Background(), nil, struct {
		CheckOnly bool `json:"checkOnly"`
	}{})
	if err != nil {
		t.Fatalf("AndroidPaymentHandler failed: %v", err)
	}
	for _, want := range []string{
		"preflight_check",
		"com.ruixue:rxsdk_rustore:4.0.11",
		"min_android_sdk: \"4.0.11\"",
		"hq_type=\"rupay\"",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Android payment spec to contain %q", want)
		}
	}
}

func TestAndroidFirebaseTemplateIncludesAnalyticsCrashPush(t *testing.T) {
	_, output, err := AndroidFirebaseHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidFirebaseHandler failed: %v", err)
	}
	for _, want := range []string{
		"com.ruixue:rxsdk_firebase",
		"google-services.json",
		"FirebaseSdkWrapper.getInstance().initFirebaseAnalytics",
		"getFirebaseCrashlytics().setCustomKey",
		"RxPushManager.registerToken",
		"RxPushManager.unRegisterToken",
		"RxPushManager.getDeviceToken",
		"RxPushManager.bindAlias",
		"onNewToken",
		"getFirebaseMessaging().getToken",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Android Firebase spec to contain %q", want)
		}
	}
}

func TestAndroidFirebasePreflightRequiresWorkspace(t *testing.T) {
	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature: "firebase",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android feature=firebase") {
		t.Fatalf("expected firebase retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestAndroidFirebasePreflightSatisfied(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'
}

dependencies {
    implementation 'com.ruixue:rxsdk_firebase:4.0.11'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "google-services.json"), `{
  "project_info": {},
  "client": [
    {
      "client_info": {
        "android_client_info": {
          "package_name": "com.demo.app"
        }
      }
    }
  ]
}`)

	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature:       "firebase",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected Android Firebase preflight satisfied, got: %+v", preflight)
	}
}

func TestAndroidAdjustTemplateIncludesCoreAndAdvancedFeatures(t *testing.T) {
	_, output, err := AndroidAdjustHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidAdjustHandler failed: %v", err)
	}
	for _, want := range []string{
		"com.ruixue:rxsdk_adjust",
		"AdjustSdkWrapper.getInstance().init",
		"RxAdjustConfig.ENVIRONMENT_SANDBOX",
		"AdjustSdkWrapper.getInstance().trackEvent",
		"appWillOpenUrl",
		"addSessionCallbackParameter",
		"setNeedsCost",
		"getAttribution",
		"sendFirstPackages",
		"adjust-android-signature",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Android Adjust spec to contain %q", want)
		}
	}
}

func TestAndroidAdjustPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature: "adjust",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android feature=adjust") {
		t.Fatalf("expected adjust retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestAndroidAdjustPreflightSatisfied(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_adjust:4.0.11'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "AndroidManifest.xml"), `
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
</manifest>
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
class App {
    void initAdjust() {
        RxAdjustConfig config = new RxAdjustConfig(this, "token", RxAdjustConfig.ENVIRONMENT_SANDBOX);
        AdjustSdkWrapper.getInstance().init(this, config);
    }
}
`)

	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature:       "adjust",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected Android Adjust preflight satisfied, got: %+v", preflight)
	}
}

func TestIOSFirebaseTemplateIncludesPushAPI(t *testing.T) {
	_, output, err := IOSFirebaseHandler(context.Background(), nil, struct {
		WorkspacePath string `json:"workspacePath"`
	}{})
	if err != nil {
		t.Fatalf("IOSFirebaseHandler failed: %v", err)
	}
	spec := output.FullSpec + "\n" + output.InitCode + "\n" + output.Instructions
	for _, want := range []string{
		"RXFirebasePush",
		"setDelegate",
		"setDeviceToken",
		"tokenWithCompletion",
		"autoInitEnabled",
		"FirebaseMessagingAutoInitEnabled",
	} {
		if !strings.Contains(spec, want) {
			t.Fatalf("expected iOS Firebase spec to contain %q", want)
		}
	}
}

func TestIOSAdjustTemplateIncludesAdvancedFeatures(t *testing.T) {
	_, output, err := IOSAdjustHandler(context.Background(), nil, struct {
		WorkspacePath string `json:"workspacePath"`
	}{})
	if err != nil {
		t.Fatalf("IOSAdjustHandler failed: %v", err)
	}
	spec := output.FullSpec + "\n" + output.InitCode + "\n" + output.Instructions
	for _, want := range []string{
		"addSessionCallbackParameter",
		"addSessionPartnerParameter",
		"setOfflineMode",
		"setEventBufferingEnabled",
		"trackThirdPartySharing",
		"disableThirdPartySharing",
		"setUrlStrategy",
		"trackMeasurementConsent",
		"setDeviceToken",
		"setSendInBackground",
		"setEnabled",
		"setExternalDeviceId",
		"RXAdjustSigSDK",
		"AdSupport.framework",
		"AppTrackingTransparency.framework",
	} {
		if !strings.Contains(spec, want) {
			t.Fatalf("expected iOS Adjust spec to contain %q", want)
		}
	}
}

func TestAndroidRustorePaymentPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature: "payment",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android feature=payment") {
		t.Fatalf("expected payment retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestAndroidPaymentPreflightDoesNotAssumeOrUpgradeRustore(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_rustore:4.0.10'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
class App {
    void init() {
        RXSdkInitConfig config = null;
        RXSDK.initialize(null, config);
    }
}
`)

	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature:       "payment",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected generic Android payment preflight satisfied, got: %+v", preflight)
	}
	content := readTestFile(t, filepath.Join(dir, "app", "build.gradle"))
	if !strings.Contains(content, "com.ruixue:rxsdk_rustore:4.0.10") {
		t.Fatalf("ordinary payment must not upgrade or claim a specific channel dependency, got:\n%s", content)
	}
}

func TestAndroidSetGameInfoPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature: "game_character",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android feature=game_character") {
		t.Fatalf("expected game_character retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestAndroidSetGameInfoPreflightAutoUpgradesSDKVersion(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.8'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
class App {
    void init() {
        RXSdkInitConfig config = null;
        RXSDK.initialize(null, config);
    }
}
`)

	_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	}{
		Feature:       "game_character",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected android setGameInfo preflight satisfied, got: %+v", preflight)
	}
	content := readTestFile(t, filepath.Join(dir, "app", "build.gradle"))
	if !strings.Contains(content, "com.ruixue:rxsdk_base:4.0.16") {
		t.Fatalf("expected android dependency upgraded, got:\n%s", content)
	}
}

func TestIifaaRealAuthPreflightRequiresWorkspace(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
			Feature       string `json:"feature"`
			Region        string `json:"region"`
			WorkspacePath string `json:"workspacePath"`
			Channel       string `json:"channel"`
			Version       string `json:"version"`
			GradleType    string `json:"gradleType"`
			LoginType     string `json:"loginType"`
			CheckOnly     bool   `json:"checkOnly"`
		}{
			Feature: "real_auth",
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok {
			t.Fatalf("expected preflight result, got: %+v", output["preflight"])
		}
		if preflight.Checked || preflight.Satisfied {
			t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
		}
		if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android feature=real_auth") {
			t.Fatalf("expected real_auth retry hint, got: %+v", preflight.NextSteps)
		}
	})

	t.Run("ios", func(t *testing.T) {
		_, output, err := IOSUnifiedHandler(context.Background(), nil, struct {
			Feature              string `json:"feature"`
			Region               string `json:"region"`
			WorkspacePath        string `json:"workspacePath"`
			TargetName           string `json:"targetName"`
			Provider             string `json:"provider"`
			UniversalLinkDomain  string `json:"universalLinkDomain"`
			AppKey               string `json:"appKey"`
			WechatAppId          string `json:"wechatAppId"`
			UniversalLink        string `json:"universalLink"`
			GIDClientID          string `json:"gidClientId"`
			GoogleURLScheme      string `json:"googleUrlScheme"`
			FacebookAppID        string `json:"facebookAppId"`
			FacebookClientToken  string `json:"facebookClientToken"`
			LineChannelID        string `json:"lineChannelId"`
			ZaloAppID            string `json:"zaloAppId"`
			TikTokAppID          string `json:"tiktokAppId"`
			InstagramClientID    string `json:"instagramClientId"`
			InstagramRedirectURI string `json:"instagramRedirectUri"`
			RedditClientID       string `json:"redditClientId"`
			RedditRedirectURI    string `json:"redditRedirectUri"`
		}{
			Feature: "real_auth",
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok {
			t.Fatalf("expected preflight result, got: %+v", output["preflight"])
		}
		if preflight.Checked || preflight.Satisfied {
			t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
		}
		if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "ios feature=real_auth") {
			t.Fatalf("expected real_auth retry hint, got: %+v", preflight.NextSteps)
		}
	})

	t.Run("unity", func(t *testing.T) {
		_, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
			Feature                   string            `json:"feature"`
			WorkspacePath             string            `json:"workspacePath"`
			Version                   string            `json:"version"`
			InstallType               string            `json:"installType"`
			Region                    string            `json:"region"`
			Channel                   string            `json:"channel"`
			AndroidVersion            string            `json:"androidVersion"`
			Components                []string          `json:"components"`
			GoogleServicesJSONPath    string            `json:"googleServicesJsonPath"`
			GIDClientID               string            `json:"gidClientId"`
			GoogleURLScheme           string            `json:"googleUrlScheme"`
			FacebookAppID             string            `json:"facebookAppId"`
			FacebookClientToken       string            `json:"facebookClientToken"`
			AgconnectServicesJSONPath string            `json:"agconnectServicesJsonPath"`
			ThirdChannel              string            `json:"thirdChannel"`
			Params                    map[string]string `json:"params"`
		}{
			Feature: "real_auth",
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok {
			t.Fatalf("expected preflight result, got: %+v", output["preflight"])
		}
		if preflight.Checked || preflight.Satisfied {
			t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
		}
		if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "unity feature=real_auth") {
			t.Fatalf("expected real_auth retry hint, got: %+v", preflight.NextSteps)
		}
	})
}

func TestIifaaRealAuthPreflightAutoUpgradesSDKVersions(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.9'
}
`)
		writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
class App {
    void init() {
        RXSdkInitConfig config = null;
        RXSDK.initialize(null, config);
    }
}
`)
		_, output, err := AndroidUnifiedHandler(context.Background(), nil, struct {
			Feature       string `json:"feature"`
			Region        string `json:"region"`
			WorkspacePath string `json:"workspacePath"`
			Channel       string `json:"channel"`
			Version       string `json:"version"`
			GradleType    string `json:"gradleType"`
			LoginType     string `json:"loginType"`
			CheckOnly     bool   `json:"checkOnly"`
		}{
			Feature:       "real_auth",
			WorkspacePath: dir,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok {
			t.Fatalf("expected preflight result, got: %+v", output["preflight"])
		}
		if !preflight.Satisfied {
			t.Fatalf("expected android IIFAA preflight satisfied, got: %+v", preflight)
		}
		content := readTestFile(t, filepath.Join(dir, "app", "build.gradle"))
		if !strings.Contains(content, "com.ruixue:rxsdk_base:4.0.14") {
			t.Fatalf("expected android dependency upgraded, got:\n%s", content)
		}
	})

	t.Run("ios", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Podfile"), `
pod 'RXSDK_Pure', '4.0.2'
pod 'RXUIKit', '4.0.3'
`)
		writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), `
void initSDK() {
    RXSdkInitConfig *config = nil;
    [[RXSDK sharedSDK] initWithConfig:config complete:nil];
}
`)
		preflight := iosIifaaRealAuthPreflight(dir)
		if !preflight.Satisfied {
			t.Fatalf("expected iOS IIFAA preflight satisfied, got: %+v", preflight)
		}
		content := readTestFile(t, filepath.Join(dir, "Podfile"))
		for _, want := range []string{"pod 'RXSDK_Pure', '4.0.6'", "pod 'RXUIKit', '4.0.4'"} {
			if !strings.Contains(content, want) {
				t.Fatalf("expected Podfile to contain %s, got:\n%s", want, content)
			}
		}
	})

	t.Run("unity", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.24",
    "com.ruixue.unitysdk.login": "1.6.24"
  }
}`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
class Init {
    void Start() {
        RuiXueSdk.Initialize(null, null, null);
    }
}
`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.9'
}
`)
		writeTestFile(t, filepath.Join(dir, "Podfile"), `
pod 'RXSDK_Pure', '4.0.2'
pod 'RXUIKit', '4.0.3'
`)
		_, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
			Feature                   string            `json:"feature"`
			WorkspacePath             string            `json:"workspacePath"`
			Version                   string            `json:"version"`
			InstallType               string            `json:"installType"`
			Region                    string            `json:"region"`
			Channel                   string            `json:"channel"`
			AndroidVersion            string            `json:"androidVersion"`
			Components                []string          `json:"components"`
			GoogleServicesJSONPath    string            `json:"googleServicesJsonPath"`
			GIDClientID               string            `json:"gidClientId"`
			GoogleURLScheme           string            `json:"googleUrlScheme"`
			FacebookAppID             string            `json:"facebookAppId"`
			FacebookClientToken       string            `json:"facebookClientToken"`
			AgconnectServicesJSONPath string            `json:"agconnectServicesJsonPath"`
			ThirdChannel              string            `json:"thirdChannel"`
			Params                    map[string]string `json:"params"`
		}{
			Feature:       "real_auth",
			WorkspacePath: dir,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok {
			t.Fatalf("expected preflight result, got: %+v", output["preflight"])
		}
		if !preflight.Satisfied {
			t.Fatalf("expected Unity IIFAA preflight satisfied, got: %+v", preflight)
		}
		manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
		for _, want := range []string{
			`"com.ruixue.unitysdk.base": "1.6.31"`,
			`"com.ruixue.unitysdk.login": "1.6.31"`,
			`"com.ruixue.unitysdk.ui": "1.6.31"`,
		} {
			if !strings.Contains(manifest, want) {
				t.Fatalf("expected Unity manifest to contain %s, got:\n%s", want, manifest)
			}
		}
		gradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
		if !strings.Contains(gradle, "com.ruixue:rxsdk_base:4.0.14") {
			t.Fatalf("expected Android template dependency upgraded, got:\n%s", gradle)
		}
		podfile := readTestFile(t, filepath.Join(dir, "Podfile"))
		for _, want := range []string{"pod 'RXSDK_Pure', '4.0.6'", "pod 'RXUIKit', '4.0.4'"} {
			if !strings.Contains(podfile, want) {
				t.Fatalf("expected Podfile to contain %s, got:\n%s", want, podfile)
			}
		}
	})
}

func TestUnityAnnouncementPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
		Feature                   string            `json:"feature"`
		WorkspacePath             string            `json:"workspacePath"`
		Version                   string            `json:"version"`
		InstallType               string            `json:"installType"`
		Region                    string            `json:"region"`
		Channel                   string            `json:"channel"`
		AndroidVersion            string            `json:"androidVersion"`
		Components                []string          `json:"components"`
		GoogleServicesJSONPath    string            `json:"googleServicesJsonPath"`
		GIDClientID               string            `json:"gidClientId"`
		GoogleURLScheme           string            `json:"googleUrlScheme"`
		FacebookAppID             string            `json:"facebookAppId"`
		FacebookClientToken       string            `json:"facebookClientToken"`
		AgconnectServicesJSONPath string            `json:"agconnectServicesJsonPath"`
		ThirdChannel              string            `json:"thirdChannel"`
		Params                    map[string]string `json:"params"`
	}{
		Feature: "announcement",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "unity feature=announcement") {
		t.Fatalf("expected announcement retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestUnityAnnouncementPreflightAutoUpgradesSDKVersion(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.27",
    "com.ruixue.unitysdk.login": "1.6.27"
  }
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
class Init {
    void Start() {
        RuiXueSdk.Initialize(null, null, null);
    }
}
`)

	_, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
		Feature                   string            `json:"feature"`
		WorkspacePath             string            `json:"workspacePath"`
		Version                   string            `json:"version"`
		InstallType               string            `json:"installType"`
		Region                    string            `json:"region"`
		Channel                   string            `json:"channel"`
		AndroidVersion            string            `json:"androidVersion"`
		Components                []string          `json:"components"`
		GoogleServicesJSONPath    string            `json:"googleServicesJsonPath"`
		GIDClientID               string            `json:"gidClientId"`
		GoogleURLScheme           string            `json:"googleUrlScheme"`
		FacebookAppID             string            `json:"facebookAppId"`
		FacebookClientToken       string            `json:"facebookClientToken"`
		AgconnectServicesJSONPath string            `json:"agconnectServicesJsonPath"`
		ThirdChannel              string            `json:"thirdChannel"`
		Params                    map[string]string `json:"params"`
	}{
		Feature:       "announcement",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected unity announcement preflight satisfied, got: %+v", preflight)
	}
	content := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	for _, want := range []string{
		`"com.ruixue.unitysdk.base": "1.6.28"`,
		`"com.ruixue.unitysdk.login": "1.6.28"`,
	} {
		if !strings.Contains(content, want) {
			t.Fatalf("expected unity manifest to contain %s, got:\n%s", want, content)
		}
	}
}

func writeTestFile(t *testing.T, path string, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		t.Fatalf("mkdir failed: %v", err)
	}
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatalf("write failed: %v", err)
	}
}

func readTestFile(t *testing.T, path string) string {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read failed: %v", err)
	}
	return string(content)
}
