package rxsdk

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestFetchLatestUnitySDKVersion(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/com.ruixue.unitysdk.base" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}

		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"dist-tags":{"latest":"3.8.0"}}`))
	}))
	defer server.Close()

	oldURL := unitySDKRegistryPackageURL
	oldClient := unitySDKRegistryHTTPClient
	unitySDKRegistryPackageURL = server.URL + "/com.ruixue.unitysdk.base"
	unitySDKRegistryHTTPClient = server.Client()
	t.Cleanup(func() {
		unitySDKRegistryPackageURL = oldURL
		unitySDKRegistryHTTPClient = oldClient
	})

	version, err := fetchLatestUnitySDKVersion(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if version != "3.8.0" {
		t.Fatalf("unexpected version: %s", version)
	}
}

func TestUnityInitTemplateIncludesThirdSDKConfig(t *testing.T) {
	_, output, err := UnityInitHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for _, want := range []string{
		"name: autoInitThird",
		`default: "true"`,
		"对应 Android setAutoInitThird",
		"name: thirdSdkParams",
		"对应 Android setThirdSdkParams",
		"autoInitThird = true",
		"thirdSdkParams = new Dictionary<string, object>",
	} {
		if !strings.Contains(output.Code, want) {
			t.Fatalf("expected Unity init template to contain %q, got:\n%s", want, output.Code)
		}
	}
}

func TestUnityInitReturnsUncheckedAndroidProjectConfigWithoutWorkspace(t *testing.T) {
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
		Feature:        "init",
		Channel:        "rxsdk_overseas",
		AndroidVersion: "4.0.9",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked Android project preflight, got: %+v", output["preflight"])
	}
	if _, ok := output["androidProjectConfig"].(string); !ok {
		t.Fatalf("expected init output to include androidProjectConfig, got: %+v", output)
	}
}

func TestUnityInitAutomaticallyConfiguresAndroidProject(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  applicationIdentifier:
    Android: com.example.game
  AndroidMinSdkVersion: 21
  AndroidTargetSdkVersion: 0
  useCustomMainGradleTemplate: 0
  useCustomGradleSettingsTemplate: 0
  useCustomGradlePropertiesTemplate: 0
  useCustomMainManifest: 0
  useCustomProguardFile: 0
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), `
package com.old.game;
import android.os.Bundle;
public class UnityPlayerActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
		Feature:        "init",
		WorkspacePath:  dir,
		Region:         "overseas",
		Channel:        "rxsdk_overseas",
		AndroidVersion: "4.0.9",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Checked || !preflight.Satisfied {
		t.Fatalf("expected init to satisfy Android project config, got: %+v", output["preflight"])
	}

	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	if !strings.Contains(manifest, `android:name="com.ruixue.openapi.RXApplication"`) ||
		!strings.Contains(manifest, `android:name="com.example.game.UnityPlayerActivity"`) {
		t.Fatalf("expected init to configure AndroidManifest.xml, got:\n%s", manifest)
	}
	activity := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"))
	if !strings.Contains(activity, "package com.example.game;") ||
		!strings.Contains(activity, "RuiXueSdk.onCreate(this);") {
		t.Fatalf("expected init to configure UnityPlayerActivity.java, got:\n%s", activity)
	}
}

func TestUnitySetupHandlerUsesDefaultVersionWhenVersionEmpty(t *testing.T) {
	_, output, err := UnitySetupHandler(context.Background(), nil, struct {
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
		InstallType   string `json:"installType"`
	}{
		WorkspacePath: "/tmp/game",
		InstallType:   "upm",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !strings.Contains(output.Instructions, `"com.ruixue.unitysdk.base": "`+unitySDKDefaultVersion+`"`) {
		t.Fatalf("expected setup instructions to include default version, got:\n%s", output.Instructions)
	}
	for _, packageName := range []string{
		"com.ruixue.unitysdk.share",
		"com.ruixue.unitysdk.login",
		"com.ruixue.unitysdk.pay",
	} {
		if !strings.Contains(output.Instructions, `"`+packageName+`": "`+unitySDKDefaultVersion+`"`) {
			t.Fatalf("expected setup instructions to include %s, got:\n%s", packageName, output.Instructions)
		}
	}
}

func TestUnityUnifiedHandlerReturnsFeatureComponentDependency(t *testing.T) {
	result, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
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
		Feature: "rank",
		Version: "3.8.2",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != nil {
		t.Fatalf("unexpected tool result: %+v", result)
	}

	dependency, ok := output["componentDependency"].(*UnityComponentDependency)
	if !ok {
		t.Fatalf("expected componentDependency, got: %+v", output["componentDependency"])
	}
	if dependency.PackageName != "com.ruixue.unitysdk.rank" {
		t.Fatalf("unexpected package name: %s", dependency.PackageName)
	}
	if dependency.Version != "3.8.2" {
		t.Fatalf("unexpected dependency version: %s", dependency.Version)
	}
	if dependency.DefaultIncluded {
		t.Fatalf("rank should not be marked as default included")
	}
}

func TestUnityLbsTemplateDescribesAmapLocation(t *testing.T) {
	_, output, err := UnityLbsHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for _, want := range []string{
		"瑞雪定位功能基于高德定位 SDK",
		"using RuiXue.LBS;",
		"RXLBSAndroid.InitLocation",
		"RXLBSAndroid.StartLocation",
		"RXLBSIOS.Init",
		"RXLBSIOS.GetLocationInfo",
		"com.ruixue:rxsdk_gaode",
		"RXLBSKit",
		"AMAP_APIKEY",
		"RuiXueSDK_LBSXcodeSetting.asset",
		"NSLocationAlwaysAndWhenInUseUsageDescription",
		"UIBackgroundModes/location",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Unity LBS template to contain %q, got:\n%s", want, output.Spec)
		}
	}
	for _, unwanted := range []string{
		"using RuiXue.Social;",
		"lbs_radius:",
		"lbs_update:",
		"lbs_delete:",
	} {
		if strings.Contains(output.Spec, unwanted) {
			t.Fatalf("Unity LBS template should describe AMap location instead of %q, got:\n%s", unwanted, output.Spec)
		}
	}
	if !strings.Contains(output.Usage, "高德定位") {
		t.Fatalf("expected Unity LBS usage to mention AMap location, got: %s", output.Usage)
	}
}

func TestUnityLbsPreflightAddsRequiredPackages(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.20",
    "com.ruixue.unitysdk.share": "1.6.20"
  }
}`)

	preflight := unityLbsPreflight(dir)
	if !preflight.Checked || !preflight.Satisfied {
		t.Fatalf("expected Unity LBS preflight satisfied, got: %+v", preflight)
	}

	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	for _, want := range []string{
		`"com.ruixue.unitysdk.base": "` + lbsUnityMinVersion + `"`,
		`"com.ruixue.unitysdk.lbs": "` + lbsUnityMinVersion + `"`,
		`"com.ruixue.unitysdk.share": "` + lbsUnityMinVersion + `"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected manifest to contain %s, got:\n%s", want, manifest)
		}
	}
	asset := readTestFile(t, filepath.Join(dir, unityLBSSettingAsset))
	for _, want := range []string{
		"guid: a4b59fe4553ae4e8086ccc85e4a9e714",
		"PrivacyLocationAlwaysUsageDescription:",
		"PrivacyLocationAlwaysAndWhenInUseUsageDescription:",
		"PrivacyLocationWhenInUseUsageDescription:",
	} {
		if !strings.Contains(asset, want) {
			t.Fatalf("expected LBS Xcode setting asset to contain %q, got:\n%s", want, asset)
		}
	}
	nextSteps := strings.Join(preflight.NextSteps, "\n")
	for _, want := range []string{"rxsdk_gaode", "RuiXueSDK_LBSXcodeSetting.asset"} {
		if !strings.Contains(nextSteps, want) {
			t.Fatalf("expected LBS next steps to contain %q, got: %+v", want, preflight.NextSteps)
		}
	}

	secondPreflight := unityLbsPreflight(dir)
	for _, modified := range secondPreflight.Modified {
		if strings.Contains(modified, unityLBSSettingAsset) {
			t.Fatalf("expected LBS asset configuration to be idempotent, got: %+v", secondPreflight.Modified)
		}
	}
}

func TestUnityLbsPreflightRequiresWorkspace(t *testing.T) {
	preflight := unityLbsPreflight("")
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied LBS preflight without workspace, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "unity feature=lbs") {
		t.Fatalf("expected retry hint for Unity LBS preflight, got: %+v", preflight.NextSteps)
	}
}

func TestUnityLbsPreflightRejectsInvalidXcodeSettingAsset(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.26",
    "com.ruixue.unitysdk.lbs": "1.6.26"
  }
}`)
	writeTestFile(t, filepath.Join(dir, unityLBSSettingAsset), "invalid asset\n")

	preflight := unityLbsPreflight(dir)
	if preflight.Satisfied || !strings.Contains(strings.Join(preflight.Missing, "\n"), "不是有效") {
		t.Fatalf("expected invalid LBS Xcode setting asset error, got: %+v", preflight)
	}
}

func TestUnityAppleSigninConfigTemplateIsExplicit(t *testing.T) {
	_, loginOutput, err := UnityLoginHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if strings.Contains(loginOutput.Spec, "RXMCPAppleLoginPostBuildProcessor.cs") {
		t.Fatalf("expected normal login template not to generate Apple project config, got:\n%s", loginOutput.Spec)
	}

	_, output, err := UnityAppleSigninConfigHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	for _, want := range []string{
		"LoginMethod.Apple",
		"RXMCPAppleLoginPostBuildProcessor.cs",
		"ProjectCapabilityManager.AddSignInWithApple()",
		"普通 login 不会生成 Apple PostBuild",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Unity login template to contain %q, got:\n%s", want, output.Spec)
		}
	}
}

func TestUnityLoginUnifiedHandlerDoesNotRunAppleConfig(t *testing.T) {
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
		Feature:       "login",
		WorkspacePath: t.TempDir(),
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if _, exists := output["preflight"]; exists {
		t.Fatalf("expected normal login not to run Apple config preflight, got: %+v", output)
	}
}

func TestUnityAppleSigninConfigPreflightConfiguresPostBuild(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "file:../local-base",
    "com.ruixue.unitysdk.login": "https://example.com/login.git#dev"
  }
}`)
	preflight := unityAppleSigninConfigPreflight(dir)
	if !preflight.Checked || !preflight.Satisfied {
		t.Fatalf("expected Unity Apple login preflight satisfied, got: %+v", preflight)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	for _, want := range []string{
		`"com.ruixue.unitysdk.base": "file:../local-base"`,
		`"com.ruixue.unitysdk.login": "https://example.com/login.git#dev"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected manifest dependency preserved as %s, got:\n%s", want, manifest)
		}
	}
	script := readTestFile(t, filepath.Join(dir, unityApplePostBuildScript))
	for _, want := range []string{
		"PostProcessBuild(3)",
		"GetBuildPropertyForAnyConfig",
		"CODE_SIGN_ENTITLEMENTS",
		"$(PROJECT_DIR)/",
		"AddSignInWithApple()",
		"WriteToFile()",
	} {
		if !strings.Contains(script, want) {
			t.Fatalf("expected Apple PostBuild to contain %q, got:\n%s", want, script)
		}
	}

	secondPreflight := unityAppleSigninConfigPreflight(dir)
	for _, modified := range secondPreflight.Modified {
		if strings.Contains(modified, unityApplePostBuildScript) {
			t.Fatalf("expected Apple PostBuild generation idempotent, got: %+v", secondPreflight.Modified)
		}
	}
}

func TestUnityAppleSigninConfigDetectsEmbeddedAndLockedPackages(t *testing.T) {
	t.Run("embedded packages", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{"dependencies":{}}`)
		for _, packageName := range []string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login"} {
			writeTestFile(t, filepath.Join(dir, "Packages", packageName, "package.json"), `{"name":"`+packageName+`","version":"1.0.0"}`)
		}
		preflight := unityAppleSigninConfigPreflight(dir)
		if !preflight.Satisfied {
			t.Fatalf("expected embedded packages accepted, got: %+v", preflight)
		}
	})

	t.Run("transitive package lock", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.login": "1.6.34"
  }
}`)
		writeTestFile(t, filepath.Join(dir, "Packages", "packages-lock.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": {
      "version": "1.6.34",
      "depth": 1,
      "source": "registry"
    }
  }
}`)
		preflight := unityAppleSigninConfigPreflight(dir)
		if !preflight.Satisfied {
			t.Fatalf("expected package lock dependency accepted, got: %+v", preflight)
		}
	})
}

func TestUnityAppleSigninConfigPreflightRequiresWorkspace(t *testing.T) {
	preflight := unityAppleSigninConfigPreflight("")
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight without workspace, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "unity feature=apple_signin_config") {
		t.Fatalf("expected retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestUnityAppleSigninConfigPreflightDoesNotWriteScriptWhenManifestInvalid(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), "{invalid json")
	preflight := unityAppleSigninConfigPreflight(dir)
	if preflight.Satisfied || !strings.Contains(strings.Join(preflight.Missing, "\n"), "解析 Packages/manifest.json 失败") {
		t.Fatalf("expected invalid manifest error, got: %+v", preflight)
	}
	if _, err := os.Stat(filepath.Join(dir, unityApplePostBuildScript)); !os.IsNotExist(err) {
		t.Fatalf("expected no PostBuild script when manifest is invalid, err=%v", err)
	}
}

func TestUnityAppleSigninConfigPreflightRejectsInvalidDependencyType(t *testing.T) {
	for _, testCase := range []struct {
		name     string
		manifest string
	}{
		{
			name: "invalid dependency type",
			manifest: `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.26",
    "com.ruixue.unitysdk.login": {"path": "../login"}
  }
}`,
		},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			dir := t.TempDir()
			writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), testCase.manifest)
			preflight := unityAppleSigninConfigPreflight(dir)
			if preflight.Satisfied {
				t.Fatalf("expected unsupported dependency rejected, got: %+v", preflight)
			}
			if _, err := os.Stat(filepath.Join(dir, unityApplePostBuildScript)); !os.IsNotExist(err) {
				t.Fatalf("expected no PostBuild script for unsupported dependency, err=%v", err)
			}
		})
	}
}

func TestUnityPaymentTemplateIncludesAndroidAndIOSProductInfo(t *testing.T) {
	result, output, err := UnityUnifiedHandler(context.Background(), nil, struct {
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
		Feature: "product_info",
		Version: "1.6.28",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != nil {
		t.Fatalf("unexpected tool result: %+v", result)
	}

	spec, ok := output["spec"].(string)
	if !ok {
		t.Fatalf("expected spec output, got: %+v", output)
	}
	for _, want := range []string{
		"RXGoogle.QueryProductDetailsAsync",
		"RXPay.IOS_GetProductInfos",
		"#if UNITY_ANDROID",
		"#elif UNITY_IOS",
		"using RuiXue.Google;",
		"using RuiXue.Pay;",
	} {
		if !strings.Contains(spec, want) {
			t.Fatalf("expected payment spec to contain %q, got:\n%s", want, spec)
		}
	}
	if strings.Contains(spec, "RXSDK.GetProductInfos") {
		t.Fatalf("payment spec should not use removed RXSDK.GetProductInfos alias, got:\n%s", spec)
	}
	if !strings.Contains(output["usage"].(string), "Android Google 商品详情查询") {
		t.Fatalf("expected usage to mention Android product info, got: %s", output["usage"])
	}

	dependency, ok := output["componentDependency"].(*UnityComponentDependency)
	if !ok || dependency.PackageName != "com.ruixue.unitysdk.pay" {
		t.Fatalf("expected pay package dependency, got: %+v", output["componentDependency"])
	}
	additionalDependencies, ok := output["additionalComponentDependencies"].([]UnityComponentDependency)
	if !ok || len(additionalDependencies) != 1 {
		t.Fatalf("expected one additional dependency, got: %+v", output["additionalComponentDependencies"])
	}
	if additionalDependencies[0].PackageName != "com.ruixue.unitysdk.google" {
		t.Fatalf("expected google package dependency, got: %+v", additionalDependencies[0])
	}
	if additionalDependencies[0].DefaultIncluded {
		t.Fatalf("google package should not be marked as default included")
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected payment preflight result, got: %+v", output["preflight"])
	}
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight without workspace, got: %+v", preflight)
	}
}

func TestUnityPaymentPreflightAutoAddsPayAndGooglePackages(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.28",
    "com.ruixue.unitysdk.pay": "1.6.20"
  }
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
using RuiXue;

public class Init {
    void Start() {
        RuiXueSdk.Initialize("cpid", "productid", "channelid", null, null, null);
    }
}`)

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
		Feature:       "get_product_info",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected payment preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected payment preflight satisfied, got: %+v", preflight)
	}

	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	for _, want := range []string{
		`"com.ruixue.unitysdk.pay": "` + unitySDKDefaultVersion + `"`,
		`"com.ruixue.unitysdk.google": "` + unitySDKDefaultVersion + `"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected manifest to contain %s, got:\n%s", want, manifest)
		}
	}
}

func TestUnityUnifiedHandlerSupportsSetSdkCallbackAlias(t *testing.T) {
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
		Feature: "setsdkcallback",
		Version: "1.6.26",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	spec, ok := output["spec"].(string)
	if !ok {
		t.Fatalf("expected spec output, got: %+v", output)
	}
	if !strings.Contains(spec, "RuiXueSdk.SetSdkCallback") {
		t.Fatalf("expected SetSdkCallback spec, got:\n%s", spec)
	}
	dependency, ok := output["componentDependency"].(*UnityComponentDependency)
	if !ok || dependency.PackageName != "com.ruixue.unitysdk.login" {
		t.Fatalf("expected login package dependency, got: %+v", output["componentDependency"])
	}
}

func TestUnityAndroidNativeSetupRequiresWorkspace(t *testing.T) {
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
		Feature:        "android_native_setup",
		Region:         "overseas",
		AndroidVersion: "4.0.9",
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
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "android_native_setup") {
		t.Fatalf("expected android_native_setup retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestUnityAndroidNativeSetupWritesOverseasDependencies(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  applicationIdentifier:
    Android: com.example.game
  AndroidMinSdkVersion: 21
  AndroidTargetSdkVersion: 0
  useCustomMainGradleTemplate: 0
  useCustomGradleSettingsTemplate: 0
  useCustomGradlePropertiesTemplate: 0
  useCustomMainManifest: 0
  useCustomProguardFile: 0
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"), `
apply plugin: 'com.android.library'

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
**DEPS**}
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"), `
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.old.game">
  <application>
    <activity android:name="com.old.game.UnityPlayerActivity" />
  </application>
</manifest>
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), `
package com.old.game;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

public class UnityPlayerActivity {
    protected void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }
    protected void onStart() { super.onStart(); }
    protected void onRestart() { super.onRestart(); }
    protected void onResume() { super.onResume(); }
    protected void onPause() { super.onPause(); }
    protected void onStop() { super.onStop(); }
    protected void onNewIntent(Intent intent) { setIntent(intent); }
    protected void onActivityResult(int requestCode, int resultCode, Intent data) { super.onActivityResult(requestCode, resultCode, data); }
    public void onConfigurationChanged(Configuration newConfig) { super.onConfigurationChanged(newConfig); }
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) { super.onRequestPermissionsResult(requestCode, permissions, grantResults); }
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
		Feature:        "android_native_setup",
		WorkspacePath:  dir,
		Region:         "overseas",
		Channel:        "rxsdk_overseas",
		AndroidVersion: "4.0.9",
		Components:     []string{"rxsdk_base_ui", "rxsdk_weixin", "rxsdk_base_ui"},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if !preflight.Satisfied {
		t.Fatalf("expected Unity Android setup satisfied, got: %+v", preflight)
	}

	gradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	for _, want := range []string{
		`def rxVersion = "4.0.9"`,
		`implementation "com.ruixue:rxsdk_overseas:${rxVersion}"`,
		`implementation "com.ruixue:rxsdk_base_ui:${rxVersion}"`,
		`implementation "com.ruixue:rxsdk_weixin:${rxVersion}"`,
	} {
		if !strings.Contains(gradle, want) {
			t.Fatalf("expected mainTemplate.gradle to contain %s, got:\n%s", want, gradle)
		}
	}
	if strings.Count(gradle, `com.ruixue:rxsdk_base_ui`) != 1 {
		t.Fatalf("expected component dependency to be deduplicated, got:\n%s", gradle)
	}

	proguard := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "proguard-user.txt"))
	if !strings.Contains(proguard, "-keep class com.ruixue.** { *; }") {
		t.Fatalf("expected proguard keep rule, got:\n%s", proguard)
	}
	settingsGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"))
	for _, want := range []string{
		`google()`,
		`mavenCentral()`,
		`https://maven.aliyun.com/nexus/content/repositories/jcenter`,
		`http://60.205.123.114:8081/repository/maven-releases/`,
		`allowInsecureProtocol = true`,
		`https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/`,
		`RUIXUE_MAVEN_USERNAME`,
		`RUIXUE_MAVEN_PASSWORD`,
	} {
		if !strings.Contains(settingsGradle, want) {
			t.Fatalf("expected settingsTemplate.gradle to contain %s, got:\n%s", want, settingsGradle)
		}
	}
	if strings.Contains(settingsGradle, "username '") || strings.Contains(settingsGradle, "password '") {
		t.Fatalf("settingsTemplate.gradle must not contain hard-coded Maven credentials")
	}

	settings := readTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"))
	for _, want := range []string{
		"AndroidMinSdkVersion: 22",
		"AndroidTargetSdkVersion: 31",
		"useCustomMainGradleTemplate: 1",
		"useCustomGradleSettingsTemplate: 1",
		"useCustomGradlePropertiesTemplate: 1",
		"useCustomMainManifest: 1",
		"useCustomProguardFile: 1",
	} {
		if !strings.Contains(settings, want) {
			t.Fatalf("expected ProjectSettings.asset to contain %s, got:\n%s", want, settings)
		}
	}

	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	for _, want := range []string{
		`package="com.example.game"`,
		`android:name="com.ruixue.openapi.RXApplication"`,
		`android:name="com.example.game.UnityPlayerActivity"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected AndroidManifest.xml to contain %s, got:\n%s", want, manifest)
		}
	}

	activity := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"))
	for _, want := range []string{
		"package com.example.game;",
		"RuiXueSdk.onCreate(this);",
		"RuiXueSdk.onStart(this);",
		"RuiXueSdk.onNewIntent(this, intent);",
		"RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);",
		"RuiXueSdk.onConfigurationChanged(this, newConfig);",
		"RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);",
	} {
		if !strings.Contains(activity, want) {
			t.Fatalf("expected UnityPlayerActivity.java to contain %s, got:\n%s", want, activity)
		}
	}

	properties := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "gradleTemplate.properties"))
	for _, want := range []string{"android.useAndroidX=true", "android.enableJetifier=true"} {
		if !strings.Contains(properties, want) {
			t.Fatalf("expected gradleTemplate.properties to contain %s, got:\n%s", want, properties)
		}
	}
}

func TestUnityAndroidGradlePropertiesAreChannelSpecific(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "gradleTemplate.properties")
	result := PassportPreflightResult{}

	upsertUnityAndroidGradleProperties(path, "rxsdk_ysdk", &result)
	properties := readTestFile(t, path)
	if !strings.Contains(properties, "android.useNewApkCreator=false") {
		t.Fatalf("expected YSDK Gradle property, got:\n%s", properties)
	}
	if strings.Contains(properties, "android.injected.testOnly=false") {
		t.Fatalf("YSDK should not add vivo/oppo testOnly property, got:\n%s", properties)
	}

	upsertUnityAndroidGradleProperties(path, "rxsdk_vivo", &result)
	properties = readTestFile(t, path)
	if !strings.Contains(properties, "android.injected.testOnly=false") {
		t.Fatalf("expected vivo/oppo Gradle property, got:\n%s", properties)
	}
	if strings.Contains(properties, "android.useNewApkCreator=false") {
		t.Fatalf("vivo should replace the managed YSDK property, got:\n%s", properties)
	}
}

func TestUnityAndroidNativeSetupRequiresExplicitChannel(t *testing.T) {
	dir := t.TempDir()
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
		Feature:        "android_native_setup",
		WorkspacePath:  dir,
		Region:         "overseas",
		AndroidVersion: "4.0.9",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Satisfied {
		t.Fatalf("expected missing channel to be unsatisfied, got: %+v", preflight)
	}
	missing := strings.Join(preflight.Missing, "\n")
	if !strings.Contains(missing, "缺少 channel") || !strings.Contains(missing, "用户") {
		t.Fatalf("expected explicit user channel selection hint, got: %+v", preflight.Missing)
	}
	if _, err := os.Stat(filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")); !os.IsNotExist(err) {
		t.Fatalf("mainTemplate.gradle should not be created before channel is selected")
	}
}

func TestUnityAndroidNativeSetupIsIdempotent(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  applicationIdentifier:
    Android: com.example.game
  AndroidMinSdkVersion: 22
  AndroidTargetSdkVersion: 31
  useCustomMainGradleTemplate: 1
  useCustomGradleSettingsTemplate: 1
  useCustomGradlePropertiesTemplate: 1
  useCustomMainManifest: 1
  useCustomProguardFile: 1
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"), `
dependencies {
    // ========== RuiXue SDK Dependencies BEGIN ==========
    def rxVersion = "4.0.8"
    implementation "com.ruixue:rxsdk_weile:${rxVersion}"
    // ========== RuiXue SDK Dependencies END ==========
}
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "proguard-user.txt"), "-keep class com.ruixue.** { *; }\n")
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), `
package com.example.game;
import com.ruixue.RuiXueSdk;
public class UnityPlayerActivity {
    protected void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RuiXueSdk.onCreate(this);
    }
}
`)

	for i := 0; i < 2; i++ {
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
			Feature:        "android_native_setup",
			WorkspacePath:  dir,
			Channel:        "rxsdk_huawei",
			AndroidVersion: "+",
			Components:     []string{"rxsdk_oaid"},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		preflight, ok := output["preflight"].(PassportPreflightResult)
		if !ok || !preflight.Satisfied {
			t.Fatalf("expected satisfied preflight, got: %+v", output["preflight"])
		}
	}

	gradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	if strings.Count(gradle, unityAndroidDepsBegin) != 1 || strings.Count(gradle, `com.ruixue:rxsdk_huawei`) != 1 {
		t.Fatalf("expected idempotent dependency block, got:\n%s", gradle)
	}
	proguard := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "proguard-user.txt"))
	if strings.Count(proguard, "-keep class com.ruixue.**") != 1 {
		t.Fatalf("expected idempotent proguard, got:\n%s", proguard)
	}
}

func TestUnityAndroidNativeSetupRejectsInvalidInputs(t *testing.T) {
	dir := t.TempDir()
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
		Feature:       "android_native_setup",
		WorkspacePath: dir,
		Channel:       "rxsdk_unknown",
		Components:    []string{"rxsdk_bad_component"},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok {
		t.Fatalf("expected preflight result, got: %+v", output["preflight"])
	}
	if preflight.Satisfied {
		t.Fatalf("expected invalid inputs to be unsatisfied, got: %+v", preflight)
	}
	missing := strings.Join(preflight.Missing, "\n")
	for _, want := range []string{"androidVersion", "rxsdk_unknown", "rxsdk_bad_component"} {
		if !strings.Contains(missing, want) {
			t.Fatalf("expected missing to contain %s, got: %+v", want, preflight.Missing)
		}
	}
}

func TestUnityGoogleConfigWritesAndroidAndIOSSettings(t *testing.T) {
	dir := t.TempDir()
	googleServicesPath := filepath.Join(dir, "google-services-source.json")
	writeTestFile(t, googleServicesPath, `{"project_info":{"project_id":"demo"}}`)
	writeTestFile(t, filepath.Join(dir, unityGoogleSettingAsset), `%YAML 1.1
MonoBehaviour:
  GIDClientID: old-client-id
  REVERSED_CLIENT_ID: old-reversed-id
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
		Feature:                "google_config",
		WorkspacePath:          dir,
		GoogleServicesJSONPath: googleServicesPath,
		GIDClientID:            "client.apps.googleusercontent.com",
		GoogleURLScheme:        "com.googleusercontent.apps.client",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Satisfied {
		t.Fatalf("expected satisfied Google preflight, got: %+v", output["preflight"])
	}
	copied := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "google-services.json"))
	if !strings.Contains(copied, `"project_id":"demo"`) {
		t.Fatalf("expected google-services.json copied, got:\n%s", copied)
	}
	asset := readTestFile(t, filepath.Join(dir, unityGoogleSettingAsset))
	for _, want := range []string{
		"GIDClientID: client.apps.googleusercontent.com",
		"REVERSED_CLIENT_ID: com.googleusercontent.apps.client",
	} {
		if !strings.Contains(asset, want) {
			t.Fatalf("expected Google asset to contain %s, got:\n%s", want, asset)
		}
	}
}

func TestUnityFacebookConfigWritesAndroidAndIOSSettings(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  useCustomMainManifest: 0
  useCustomLauncherGradleManifest: 0
`)
	writeTestFile(t, filepath.Join(dir, unityFacebookSettingAsset), `%YAML 1.1
MonoBehaviour:
  FbId: old
  FacebookAppID: old
  FacebookClientToken: old
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
    </application>
</manifest>
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"), `android {
    defaultConfig {
        applicationId '**APPLICATIONID**'
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
		Feature:             "facebook_config",
		WorkspacePath:       dir,
		FacebookAppID:       "123456",
		FacebookClientToken: "token_abc",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Satisfied {
		t.Fatalf("expected satisfied Facebook preflight, got: %+v", output["preflight"])
	}
	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	for _, want := range []string{
		`android:name="com.facebook.sdk.ApplicationId"`,
		`android:value="@string/facebook_app_id"`,
		`android:name="com.facebook.sdk.ClientToken"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected manifest to contain %s, got:\n%s", want, manifest)
		}
	}
	launcher := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"))
	for _, want := range []string{
		`resValue "string", "facebook_app_id", "123456"`,
		`resValue "string", "facebook_client_token", "token_abc"`,
		`FACEBOOK_APP_ID : "123456"`,
	} {
		if !strings.Contains(launcher, want) {
			t.Fatalf("expected launcherTemplate.gradle to contain %s, got:\n%s", want, launcher)
		}
	}
	asset := readTestFile(t, filepath.Join(dir, unityFacebookSettingAsset))
	for _, want := range []string{
		"FbId: fb123456",
		"FacebookAppID: 123456",
		"FacebookClientToken: token_abc",
	} {
		if !strings.Contains(asset, want) {
			t.Fatalf("expected Facebook asset to contain %s, got:\n%s", want, asset)
		}
	}
	settings := readTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"))
	for _, want := range []string{
		"useCustomMainManifest: 1",
		"useCustomLauncherGradleManifest: 1",
	} {
		if !strings.Contains(settings, want) {
			t.Fatalf("expected ProjectSettings.asset to contain %s, got:\n%s", want, settings)
		}
	}
}

func TestUnityHuaweiConfigCopiesAgconnectServices(t *testing.T) {
	dir := t.TempDir()
	agconnectPath := filepath.Join(dir, "agconnect-source.json")
	writeTestFile(t, agconnectPath, `{"client":{"app_id":"102680789"}}`)
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  useCustomLauncherGradleManifest: 0
  useCustomBaseGradleTemplate: 0
  useCustomGradleSettingsTemplate: 0
  useCustomMainManifest: 0
  useCustomProguardFile: 0
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"), `apply plugin: 'com.android.application'

dependencies {
    implementation project(':unityLibrary')
}

android {
    defaultConfig {
        applicationId '**APPLICATIONID**'
    }
}
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "baseProjectTemplate.gradle"), `buildscript {
    dependencies {
        classpath "com.android.tools.build:gradle:7.1.2"
    }
}
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"), `pluginManagement {
    repositories {
        google()
    }
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
    </application>
</manifest>
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
		Feature:                   "huawei_config",
		WorkspacePath:             dir,
		AndroidVersion:            "4.0.9",
		AgconnectServicesJSONPath: agconnectPath,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Satisfied {
		t.Fatalf("expected satisfied Huawei preflight, got: %+v", output["preflight"])
	}
	copied := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "agconnect-services.json"))
	if !strings.Contains(copied, `"app_id":"102680789"`) {
		t.Fatalf("expected agconnect-services.json copied, got:\n%s", copied)
	}
	launcher := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"))
	for _, want := range []string{
		"apply plugin: 'com.huawei.agconnect'",
		`def rxVersion = "4.0.9"`,
		`implementation "com.ruixue:rxsdk_huawei:${rxVersion}"`,
	} {
		if !strings.Contains(launcher, want) {
			t.Fatalf("expected launcherTemplate.gradle to contain %s, got:\n%s", want, launcher)
		}
	}
	baseProject := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "baseProjectTemplate.gradle"))
	if !strings.Contains(baseProject, `classpath "com.huawei.agconnect:agcp:1.6.0.300"`) {
		t.Fatalf("expected baseProjectTemplate.gradle to contain Huawei classpath, got:\n%s", baseProject)
	}
	settings := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"))
	if strings.Count(settings, "https://developer.huawei.com/repo/") != 2 {
		t.Fatalf("expected settingsTemplate.gradle to contain Huawei repositories in both blocks, got:\n%s", settings)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	for _, want := range []string{
		`android:name="com.huawei.agconnect.AccessNetwork"`,
		`android:value="false"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected AndroidManifest.xml to contain %s, got:\n%s", want, manifest)
		}
	}
	proguard := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "proguard-user.txt"))
	for _, want := range []string{
		"-keep class com.huawei.hms.**{*;}",
		"-keep class com.huawei.hianalytics.**{*;}",
	} {
		if !strings.Contains(proguard, want) {
			t.Fatalf("expected proguard-user.txt to contain %s, got:\n%s", want, proguard)
		}
	}
	projectSettings := readTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"))
	for _, want := range []string{
		"useCustomLauncherGradleManifest: 1",
		"useCustomBaseGradleTemplate: 1",
		"useCustomGradleSettingsTemplate: 1",
		"useCustomMainManifest: 1",
		"useCustomProguardFile: 1",
	} {
		if !strings.Contains(projectSettings, want) {
			t.Fatalf("expected ProjectSettings.asset to contain %s, got:\n%s", want, projectSettings)
		}
	}
	nextSteps := strings.Join(preflight.NextSteps, "\n")
	if !strings.Contains(nextSteps, "HuaweiAfterBuildToDo") {
		t.Fatalf("expected Huawei next steps, got: %+v", preflight.NextSteps)
	}
}
