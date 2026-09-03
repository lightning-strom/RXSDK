package rxsdk

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestVersionCheckTemplatesReturnV2Only(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		_, output, err := AndroidVersionCheckHandler(context.Background(), nil, struct{}{})
		if err != nil {
			t.Fatalf("AndroidVersionCheckHandler failed: %v", err)
		}
		for _, want := range []string{
			"瑞雪 SDK 版本检查 v2",
			"Android SDK >= 4.0.13",
			"RXSDK.getInstance().updateGameVersion",
			"preflight_check",
			`module_tag: "String，必填，模块标识"`,
			`category_tag: "String，必填，分类标识"`,
			`module_tag: "String，模块标识"`,
			`category_tag: "String，分类标识"`,
			`uri: "String，版本包下载地址"`,
			`moduleDsa.put("module_tag", "@test")`,
			`moduleDsa.put("category_tag", "@test")`,
		} {
			if !strings.Contains(output.Spec, want) {
				t.Fatalf("expected Android version_check spec to contain %q", want)
			}
		}
		for _, oldMethod := range []string{
			`method_name: "RXSDK.getInstance().checkUpdateApp"`,
			`method_name: "RXSDK.getInstance().updateApp"`,
			`method_name: "RXSDK.getInstance().updateGame"`,
			`method_name: "RXSDK.getInstance().updateActivity"`,
		} {
			if strings.Contains(output.Spec, oldMethod) {
				t.Fatalf("Android version_check spec still exposes old method %q", oldMethod)
			}
		}
	})

	t.Run("ios", func(t *testing.T) {
		_, output, err := IOSVersionCheckHandler(context.Background(), nil, struct{}{})
		if err != nil {
			t.Fatalf("IOSVersionCheckHandler failed: %v", err)
		}
		for _, want := range []string{
			"瑞雪 SDK iOS 版本检查 v2",
			"RXSDK_Pure >= 4.0.8",
			"updateGameVersionWithInfo",
			"preflight_check",
			`module_tag: "NSString，必填，模块标识"`,
			`category_tag: "NSString，必填，分类标识"`,
			`module_tag: "NSString，模块标识"`,
			`category_tag: "NSString，分类标识"`,
			`uri: "NSString，版本包下载地址"`,
			`@"module_tag": @"@test"`,
			`@"category_tag": @"@test"`,
		} {
			if !strings.Contains(output.Spec, want) {
				t.Fatalf("expected iOS version_check spec to contain %q", want)
			}
		}
	})

	t.Run("unity", func(t *testing.T) {
		_, output, err := UnityVersionCheckHandler(context.Background(), nil, struct{}{})
		if err != nil {
			t.Fatalf("UnityVersionCheckHandler failed: %v", err)
		}
		for _, want := range []string{
			"瑞雪 SDK Unity 版本检查 v2",
			"Unity UPM >= 1.6.39",
			"RXVersionCheck.UpdateGameVersion",
			"native_version_check",
			"4.0.13",
			"RXSDK_Pure: \"4.0.8\"",
			`module_tag: "String，必填，模块标识"`,
			`category_tag: "String，必填，分类标识"`,
			`module_tag: "String，模块标识"`,
			`category_tag: "String，分类标识"`,
			`uri: "String，版本包下载地址"`,
			`new VersionCheckModule("@test", "@test", 0, 0)`,
		} {
			if !strings.Contains(output.Spec, want) {
				t.Fatalf("expected Unity version_check spec to contain %q", want)
			}
		}
		for _, oldMethod := range []string{
			`method: "RXSDK.UpdateApp`,
			`method: "RXSDK.CheckUpdateApp`,
			`method: "RXSDK.UpdateGame`,
			`method: "RXSDK.UpdateActivity`,
		} {
			if strings.Contains(output.Spec, oldMethod) {
				t.Fatalf("Unity version_check spec still exposes old method %q", oldMethod)
			}
		}
	})
}

func TestVersionCheckPreflightAutoUpgradesSDKVersions(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
dependencies {
    implementation 'com.ruixue:rxsdk_base:4.0.12'
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
		result := androidVersionCheckPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected Android version_check preflight satisfied, got: %+v", result)
		}
		content := readTestFile(t, filepath.Join(dir, "app", "build.gradle"))
		if !strings.Contains(content, "com.ruixue:rxsdk_base:4.0.13") {
			t.Fatalf("expected Android dependency upgraded, got:\n%s", content)
		}
	})

	t.Run("ios", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Podfile"), `pod 'RXSDK_Pure', '4.0.7'`)
		writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), `
void initSDK() {
    RXSdkInitConfig *config = nil;
    [[RXSDK sharedSDK] initWithConfig:config complete:nil];
}
`)
		result := iosVersionCheckPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected iOS version_check preflight satisfied, got: %+v", result)
		}
		content := readTestFile(t, filepath.Join(dir, "Podfile"))
		if !strings.Contains(content, "pod 'RXSDK_Pure', '4.0.8'") {
			t.Fatalf("expected iOS pod upgraded, got:\n%s", content)
		}
	})

	t.Run("unity", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.35",
    "com.ruixue.unitysdk.versioncheck": "1.6.35"
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
    implementation 'com.ruixue:rxsdk_base:4.0.12'
}
`)
		writeTestFile(t, filepath.Join(dir, "Podfile"), `pod 'RXSDK_Pure', '4.0.7'`)

		result := unityVersionCheckPreflight(dir)
		if !result.Satisfied {
			t.Fatalf("expected Unity version_check preflight satisfied, got: %+v", result)
		}
		manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
		for _, want := range []string{
			`"com.ruixue.unitysdk.base": "1.6.39"`,
			`"com.ruixue.unitysdk.versioncheck": "1.6.39"`,
		} {
			if !strings.Contains(manifest, want) {
				t.Fatalf("expected Unity manifest to contain %s, got:\n%s", want, manifest)
			}
		}
		gradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
		if !strings.Contains(gradle, "com.ruixue:rxsdk_base:4.0.13") {
			t.Fatalf("expected Unity Android template dependency upgraded, got:\n%s", gradle)
		}
		podfile := readTestFile(t, filepath.Join(dir, "Podfile"))
		if !strings.Contains(podfile, "pod 'RXSDK_Pure', '4.0.8'") {
			t.Fatalf("expected Unity iOS pod upgraded, got:\n%s", podfile)
		}
	})
}

func TestUnityVersionCheckDependencyUsesMinimumVersion(t *testing.T) {
	if got := unityFeatureDependencyVersion("version_check", ""); got != "1.6.39" {
		t.Fatalf("expected default version_check dependency 1.6.39, got %s", got)
	}
	if got := unityFeatureDependencyVersion("version_check", "1.6.38"); got != "1.6.39" {
		t.Fatalf("expected old version_check dependency upgraded to 1.6.39, got %s", got)
	}
	if got := unityFeatureDependencyVersion("version_check", "1.6.40"); got != "1.6.40" {
		t.Fatalf("expected newer version_check dependency preserved, got %s", got)
	}
}

func TestMinigameVersionCheckV2RequiresJSSDK402(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "build", "common.config.ts"), `const SDK_VERSION = '4.0.2'`)
	writeTestFile(t, filepath.Join(dir, "src", "game.ts"), `
const sdk = new RxSdk({})
sdk.updateGameVersion({}, { complete() {} })
const endpoint = '/v1/vcapi/update_module_version'
`)

	_, output, err := MinigameUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
	}{Feature: "version_check", WorkspacePath: dir})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	for _, want := range []string{
		"小游戏版本检查 v2",
		"JSSDK >= 4.0.2",
		"sdk.updateGameVersion",
		`module_tag: "String，必填，模块标识"`,
		`category_tag: "String，必填，分类标识"`,
		`module_tag: "String，模块标识"`,
		`category_tag: "String，分类标识"`,
		`uri: "String，版本包下载地址"`,
		`module_tag: "@test"`,
		`category_tag: "@test"`,
	} {
		if !strings.Contains(output["spec"].(string), want) {
			t.Fatalf("expected minigame version_check spec to contain %q", want)
		}
	}
	if strings.Contains(output["spec"].(string), "module_id") {
		t.Fatalf("minigame version_check spec must not expose legacy module_id")
	}
	preflight := output["preflight"].(PassportPreflightResult)
	if !preflight.Satisfied {
		t.Fatalf("expected JSSDK 4.0.2 preflight satisfied, got: %+v", preflight)
	}
}

func TestMinigameVersionCheckPreflightRejectsOldOrUnknownBuilds(t *testing.T) {
	t.Run("without workspace", func(t *testing.T) {
		result := minigameVersionCheckPreflight("")
		if result.Checked || result.Satisfied {
			t.Fatalf("expected unchecked and unsatisfied result, got: %+v", result)
		}
	})

	t.Run("old version", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "common.config.ts"), `const SDK_VERSION = '4.0.1'`)
		writeTestFile(t, filepath.Join(dir, "game.ts"), `
const sdk = new RxSdk({})
sdk.updateGameVersion({}, { complete() {} })
const endpoint = '/v1/vcapi/update_module_version'
`)
		result := minigameVersionCheckPreflight(dir)
		if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "4.0.1") {
			t.Fatalf("expected old JSSDK rejected, got: %+v", result)
		}
	})

	t.Run("missing v2 api", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "common.config.ts"), `const SDK_VERSION = '4.0.3'`)
		writeTestFile(t, filepath.Join(dir, "game.ts"), `const sdk = new RxSdk({})`)
		result := minigameVersionCheckPreflight(dir)
		if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "updateGameVersion") {
			t.Fatalf("expected missing v2 API rejected, got: %+v", result)
		}
	})

	t.Run("newer version remains unchanged", func(t *testing.T) {
		dir := t.TempDir()
		configPath := filepath.Join(dir, "common.config.ts")
		writeTestFile(t, configPath, `const SDK_VERSION = '4.0.3'`)
		writeTestFile(t, filepath.Join(dir, "game.ts"), `
const sdk = new RxSdk({})
sdk.updateGameVersion({}, { complete() {} })
const endpoint = '/v1/vcapi/update_module_version'
`)
		result := minigameVersionCheckPreflight(dir)
		if !result.Satisfied || len(result.Modified) != 0 {
			t.Fatalf("expected newer JSSDK accepted without modification, got: %+v", result)
		}
		if content := readTestFile(t, configPath); !strings.Contains(content, "4.0.3") {
			t.Fatalf("expected newer JSSDK version preserved, got: %s", content)
		}
	})
}
