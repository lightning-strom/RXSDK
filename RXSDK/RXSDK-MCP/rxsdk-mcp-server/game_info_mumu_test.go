package rxsdk

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestIOSGameCharacterIncludesSetGameInfoSemantics(t *testing.T) {
	_, output, err := IOSGameCharacterHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("IOSGameCharacterHandler failed: %v", err)
	}
	for _, want := range []string{
		"setGameInfoWithRoleId:regionTag:",
		"上报到瑞雪",
		"Unity SetThirdGameInfo(GameInfo) 在 iOS 提取 roleId/serverId",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected iOS game character spec to contain %q", want)
		}
	}
}

func TestIOSGameCharacterPreflight(t *testing.T) {
	if result := iosGameCharacterPreflight(""); result.Checked || result.Satisfied {
		t.Fatalf("expected empty workspace to be unchecked: %+v", result)
	}
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), "pod 'RXSDK_Pure', '4.0.8'\n")
	writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), "RXSdkInitConfig *config; [sdk initWithConfig:config complete:nil];\n")
	if result := iosGameCharacterPreflight(dir); !result.Satisfied {
		t.Fatalf("expected iOS game character preflight satisfied: %+v", result)
	}
}

func TestAndroidGameCharacterUsesRequiredVersionsAndSemantics(t *testing.T) {
	_, output, err := AndroidGameCharacterHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidGameCharacterHandler failed: %v", err)
	}
	for _, want := range []string{
		"Android SDK >= 4.0.16",
		"SetGameInfo(roleId, regionTag) 上报到瑞雪",
		"SetThirdGameInfo(GameInfo) 上报到三方渠道",
		"mumu:",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Android game character spec to contain %q", want)
		}
	}
}

func TestAndroidGameInfoPreflightUpgradesAllRuixueDependencies(t *testing.T) {
	dir := t.TempDir()
	gradlePath := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, gradlePath, `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.15'
    implementation 'com.ruixue:rxsdk_base_ui:4.0.14'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"),
		"class App { void init() { RXSdkInitConfig c = null; RXSDK.initialize(null, c); } }\n")
	result := androidSetGameInfoPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected Android game info preflight satisfied: %+v", result)
	}
	content := readTestFile(t, gradlePath)
	if strings.Count(content, "4.0.16") != 2 {
		t.Fatalf("expected all Ruixue dependencies upgraded to 4.0.16:\n%s", content)
	}
}

func TestAndroidMumuPreflight(t *testing.T) {
	dir := t.TempDir()
	gradlePath := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, gradlePath, `
android { defaultConfig { applicationId "com.example.game.yofun.mumu" } }
repositories { maven { url "https://maven-release.webapp.163.com/repository/maven-releases/" } }
android { defaultConfig { multiDexEnabled true } }
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.15'
    implementation 'com.ruixue:rxsdk_yofun:4.0.15'
}
`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "AndroidManifest.xml"),
		`<manifest><application><meta-data android:name="YOFUN_APP_ID" /></application></manifest>`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"),
		`class App { void init() {
RXSdkInitConfig c = null; RXSDK.initialize(null, c);
Map p = new HashMap(); p.put("debugMode", false); p.put("splashType", 0); api.initThirdSdk(null, p, null);
RuiXueSdk.invokeChannelAction(null, "showSplash", p, null);
} }`)
	result := androidMumuPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected Android MuMu preflight satisfied: %+v", result)
	}
	content := readTestFile(t, gradlePath)
	if !strings.Contains(content, "rxsdk_yofun:4.0.19") {
		t.Fatalf("expected MuMu dependency upgraded:\n%s", content)
	}
}

func TestMumuPreflightRequiresWorkspace(t *testing.T) {
	for name, result := range map[string]PassportPreflightResult{
		"android": androidMumuPreflight(""),
		"unity":   unityMumuPreflight(""),
	} {
		if result.Checked || result.Satisfied {
			t.Fatalf("%s MuMu preflight should be unchecked without workspace: %+v", name, result)
		}
	}
}

func TestMumuHandlersUsePublicChannelAPIs(t *testing.T) {
	_, androidOutput, err := AndroidMumuHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("AndroidMumuHandler failed: %v", err)
	}
	for _, want := range []string{"debugMode", "invokeChannelAction", "CHANNEL_ACTION_SHOW_SPLASH", "splashType", "RXApplication"} {
		if !strings.Contains(androidOutput.Spec, want) {
			t.Fatalf("Android MuMu template missing %q", want)
		}
	}

	_, unityOutput, err := UnityMumuHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("UnityMumuHandler failed: %v", err)
	}
	for _, want := range []string{
		"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay",
		`unity: "4.0.2"`, "debugMode", "InvokeChannelAction", "ChannelActionShowSplash", "splashType",
	} {
		if !strings.Contains(unityOutput.Spec, want) {
			t.Fatalf("Unity MuMu template missing %q", want)
		}
	}

	_, response, err := UnityUnifiedHandler(context.Background(), nil, struct {
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
	}{Feature: "mumu"})
	if err != nil {
		t.Fatalf("UnityUnifiedHandler mumu failed: %v", err)
	}
	base, ok := response["componentDependency"].(*UnityComponentDependency)
	if !ok || base.PackageName != "com.ruixue.unitysdk.base" || base.Version != "4.0.2" {
		t.Fatalf("unexpected MuMu base dependency: %#v", response["componentDependency"])
	}
	additional, ok := response["additionalComponentDependencies"].([]UnityComponentDependency)
	if !ok || len(additional) != 2 ||
		additional[0].PackageName != "com.ruixue.unitysdk.login" ||
		additional[1].PackageName != "com.ruixue.unitysdk.pay" {
		t.Fatalf("unexpected MuMu public dependencies: %#v", response["additionalComponentDependencies"])
	}
}

func TestUnityGameCharacterTemplateAndPreflight(t *testing.T) {
	_, output, err := UnityGameCharacterHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("UnityGameCharacterHandler failed: %v", err)
	}
	for _, want := range []string{
		"RuiXueSdk.SetGameInfo",
		"RuiXueSdk.SetThirdGameInfo",
		`unity: "4.0.3"`,
		`android: "4.0.16"`,
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Unity game character spec to contain %q", want)
		}
	}

	dir := t.TempDir()
	manifestPath := filepath.Join(dir, "Packages", "manifest.json")
	writeTestFile(t, manifestPath, `{"dependencies":{"com.ruixue.unitysdk.base":"4.0.2","com.ruixue.unitysdk.login":"4.0.1"}}`)
	gradlePath := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
	writeTestFile(t, gradlePath, `dependencies { implementation "com.ruixue:rxsdk_base:4.0.15" }`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), "RuiXueSdk.Initialize(null);\n")
	result := unityGameInfoPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected Unity game info preflight satisfied: %+v", result)
	}
	if !strings.Contains(readTestFile(t, manifestPath), "4.0.3") {
		t.Fatalf("expected Unity packages upgraded:\n%s", readTestFile(t, manifestPath))
	}
	if !strings.Contains(readTestFile(t, gradlePath), "4.0.16") {
		t.Fatalf("expected Unity Android dependency upgraded:\n%s", readTestFile(t, gradlePath))
	}
}

func TestUnityMumuPreflightUpgradesPublicPackagesAndAndroidSDK(t *testing.T) {
	dir := t.TempDir()
	manifestPath := filepath.Join(dir, "Packages", "manifest.json")
	writeTestFile(t, manifestPath, `{"dependencies":{
"com.ruixue.unitysdk.base":"4.0.0",
"com.ruixue.unitysdk.login":"4.0.0",
"com.ruixue.unitysdk.pay":"4.0.0"
}}`)
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"),
		"applicationIdentifier:\n  Android: com.example.game.yofun.mumu\n")
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"),
		`RuiXueSdk.Initialize(null);
var config = new Dictionary<string, object> { ["debugMode"] = false };
RuiXueSdk.InitThirdSdk(config, null, null);
RuiXueSdk.InvokeChannelAction("showSplash", new Dictionary<string, object> { ["splashType"] = 0 }, null, null);`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		`dependencies { implementation "com.ruixue:rxsdk_yofun:4.0.15" }`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"),
		`repositories { maven { url "https://maven-release.webapp.163.com/repository/maven-releases/" } }`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"),
		`android { defaultConfig { multiDexEnabled true } }`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"),
		`<manifest><application><meta-data android:name="YOFUN_APP_ID" /></application></manifest>`)
	result := unityMumuPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected Unity MuMu preflight satisfied: %+v", result)
	}
	manifest := readTestFile(t, manifestPath)
	for _, pkg := range []string{
		"com.ruixue.unitysdk.base",
		"com.ruixue.unitysdk.login",
		"com.ruixue.unitysdk.pay",
	} {
		if !strings.Contains(manifest, pkg) {
			t.Fatalf("expected manifest to contain %s:\n%s", pkg, manifest)
		}
	}
	gradlePath := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
	if !strings.Contains(readTestFile(t, gradlePath), "rxsdk_yofun:4.0.19") {
		t.Fatalf("expected MuMu Android SDK upgraded:\n%s", readTestFile(t, gradlePath))
	}
}

func TestUnityMumuPreflightReportsMissingAndroidConfig(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{"dependencies":{}}`)
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"),
		"applicationIdentifier:\n  Android: com.example.game.yofun.mumu\n")
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), "RuiXueSdk.Initialize(null);\n")
	result := unityMumuPreflight(dir)
	if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "rxsdk_yofun") {
		t.Fatalf("expected missing MuMu Android config: %+v", result)
	}
}

func TestUnityMumuPreflightProtectsNonFixedPackageVersion(t *testing.T) {
	dir := t.TempDir()
	manifestPath := filepath.Join(dir, "Packages", "manifest.json")
	writeTestFile(t, manifestPath, `{"dependencies":{
"com.ruixue.unitysdk.base":"4.0.2",
"com.ruixue.unitysdk.login":"file:../login",
"com.ruixue.unitysdk.pay":"4.0.2"
}}`)
	before := readTestFile(t, manifestPath)
	result := unityMumuPreflight(dir)
	if !strings.Contains(strings.Join(result.Missing, "\n"), "非固定版本") {
		t.Fatalf("expected non-fixed dependency warning: %+v", result)
	}
	if readTestFile(t, manifestPath) != before {
		t.Fatal("non-fixed Unity dependency must not be overwritten")
	}
}
