package rxsdk

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"testing"
)

type unityChannelConfigInput = struct {
	WorkspacePath  string            `json:"workspacePath"`
	ThirdChannel   string            `json:"thirdChannel"`
	AndroidVersion string            `json:"androidVersion"`
	Params         map[string]string `json:"params"`
}

func callUnityChannelConfig(t *testing.T, dir, slug, version string, params map[string]string) PassportPreflightResult {
	t.Helper()
	_, output, err := UnityChannelConfigHandler(context.Background(), nil, unityChannelConfigInput{
		WorkspacePath:  dir,
		ThirdChannel:   slug,
		AndroidVersion: version,
		Params:         params,
	})
	if err != nil {
		t.Fatalf("channel %s: unexpected error: %v", slug, err)
	}
	return output.Preflight
}

func writeUnityProjectScaffold(t *testing.T, dir string) {
	t.Helper()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `PlayerSettings:
  useCustomMainManifest: 0
  useCustomMainGradleTemplate: 0
  useCustomLauncherGradleManifest: 0
  useCustomBaseGradleTemplate: 0
  useCustomGradleSettingsTemplate: 0
  useCustomProguardFile: 0
`)
}

func TestUnityChannelConfigRequiresWorkspace(t *testing.T) {
	preflight := callUnityChannelConfig(t, "", "zalo", "4.0.9", map[string]string{"zaloAppId": "123"})
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "channel_config") {
		t.Fatalf("expected channel_config retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestUnityChannelConfigUnknownChannel(t *testing.T) {
	dir := t.TempDir()
	preflight := callUnityChannelConfig(t, dir, "not_exist", "4.0.9", nil)
	if preflight.Satisfied {
		t.Fatalf("expected unsatisfied for unknown channel, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.Missing, "\n"), "不支持的三方渠道") {
		t.Fatalf("expected unsupported channel missing, got: %+v", preflight.Missing)
	}
}

func TestUnityChannelConfigMissingParams(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	preflight := callUnityChannelConfig(t, dir, "zalo", "4.0.9", nil)
	if preflight.Satisfied {
		t.Fatalf("expected unsatisfied when zaloAppId missing, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.Missing, "\n"), "zaloAppId") {
		t.Fatalf("expected missing zaloAppId, got: %+v", preflight.Missing)
	}
}

func TestUnityChannelConfigMissingAndroidVersion(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	preflight := callUnityChannelConfig(t, dir, "taptap", "", map[string]string{"taptapClientId": "abc"})
	if preflight.Satisfied {
		t.Fatalf("expected unsatisfied when androidVersion missing, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.Missing, "\n"), "androidVersion") {
		t.Fatalf("expected missing androidVersion, got: %+v", preflight.Missing)
	}
}

func TestUnityChannelConfigZaloWritesAllTargets(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	writeTestFile(t, filepath.Join(dir, "Assets", "RuiXueSettings", "RuiXueSDK_ZaloXcodeSetting.asset"), `MonoBehaviour:
  zaloAppID: old
`)

	preflight := callUnityChannelConfig(t, dir, "zalo", "4.0.9", map[string]string{"zaloAppId": "1234567"})
	if !preflight.Satisfied {
		t.Fatalf("expected satisfied zalo preflight, got: %+v", preflight)
	}

	mainGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	if !strings.Contains(mainGradle, `implementation "com.ruixue:rxsdk_zalo:4.0.9"`) {
		t.Fatalf("expected zalo dependency, got:\n%s", mainGradle)
	}
	launcher := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"))
	if !strings.Contains(launcher, `resValue "string", "zalo_app_id", "1234567"`) {
		t.Fatalf("expected zalo resValue, got:\n%s", launcher)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	for _, want := range []string{
		`android:name="com.zing.zalo.zalosdk.appID"`,
		`android:scheme="zalo-1234567"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("expected manifest to contain %s, got:\n%s", want, manifest)
		}
	}
	iosAsset := readTestFile(t, filepath.Join(dir, "Assets", "RuiXueSettings", "RuiXueSDK_ZaloXcodeSetting.asset"))
	if !strings.Contains(iosAsset, "zaloAppID: zalo-1234567") {
		t.Fatalf("expected zalo iOS asset updated, got:\n%s", iosAsset)
	}
	settings := readTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"))
	for _, want := range []string{"useCustomMainGradleTemplate: 1", "useCustomLauncherGradleManifest: 1", "useCustomMainManifest: 1", "useCustomGradleSettingsTemplate: 1"} {
		if !strings.Contains(settings, want) {
			t.Fatalf("expected ProjectSettings toggle %s, got:\n%s", want, settings)
		}
	}
	settingsGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"))
	for _, want := range []string{
		`https://maven.aliyun.com/nexus/content/repositories/jcenter`,
		`http://60.205.123.114:8081/repository/maven-releases/`,
		`allowInsecureProtocol = true`,
		`https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/`,
	} {
		if !strings.Contains(settingsGradle, want) {
			t.Fatalf("expected settingsTemplate.gradle to contain %s, got:\n%s", want, settingsGradle)
		}
	}
}

func TestUnityChannelConfigViaUnifiedHandler(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
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
		Feature:        "channel_config",
		WorkspacePath:  dir,
		ThirdChannel:   "taptap",
		AndroidVersion: "4.0.9",
		Params:         map[string]string{"taptapClientId": "abc"},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Satisfied {
		t.Fatalf("expected satisfied preflight via unified handler, got: %+v", output["preflight"])
	}
}

func TestUnityChannelConfigMumuWritesGenericAndroidConfigIdempotently(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	params := map[string]string{"mumuAppId": "REAL_YOFUN_APP_ID"}

	first := callUnityChannelConfig(t, dir, "mumu", "4.0.15", params)
	if !first.Satisfied {
		t.Fatalf("expected MuMu channel config satisfied: %+v", first)
	}
	manifestPath := filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml")
	manifestAfterFirst := readTestFile(t, manifestPath)
	second := callUnityChannelConfig(t, dir, "mumu", "4.0.15", params)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent MuMu channel config: %+v\nfirst:\n%q\nsecond:\n%q", second, manifestAfterFirst, readTestFile(t, manifestPath))
	}

	mainGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	if !strings.Contains(mainGradle, `com.ruixue:rxsdk_yofun:4.0.19`) {
		t.Fatalf("expected minimum rxsdk_yofun dependency:\n%s", mainGradle)
	}
	launcher := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"))
	if strings.Count(launcher, "multiDexEnabled true") != 1 {
		t.Fatalf("expected one MultiDex config:\n%s", launcher)
	}
	manifest := readTestFile(t, manifestPath)
	if !strings.Contains(manifest, `android:name="YOFUN_APP_ID" android:value="REAL_YOFUN_APP_ID"`) {
		t.Fatalf("expected YOFUN_APP_ID metadata:\n%s", manifest)
	}
	settings := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"))
	if !strings.Contains(settings, "maven-release.webapp.163.com/repository/maven-releases") {
		t.Fatalf("expected Yofun Maven repository:\n%s", settings)
	}
}

func TestUnityChannelConfigHuyaWritesMinimumDependencyRepositoryAndParamsIdempotently(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	params := map[string]string{
		"huyaGameId":            "GAME_ID",
		"huyaLoginClientId":     "LOGIN_CLIENT_ID",
		"huyaLoginClientSecret": "LOGIN_CLIENT_SECRET",
		"huyaPayAppId":          "PAY_APP_ID",
		"huyaDebugMode":         "false",
		"huyaLandscapeMode":     "true",
		"huyaShowSwitchCount":   "true",
	}

	_, output, err := UnityChannelConfigHandler(context.Background(), nil, unityChannelConfigInput{
		WorkspacePath:  dir,
		ThirdChannel:   "huya",
		AndroidVersion: "4.0.10",
		Params:         params,
	})
	if err != nil || !output.Preflight.Satisfied {
		t.Fatalf("expected Huya channel config satisfied, err=%v output=%+v", err, output)
	}
	mainGradlePath := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
	mainGradle := readTestFile(t, mainGradlePath)
	if !strings.Contains(mainGradle, `com.ruixue:rxsdk_huya:4.0.19`) {
		t.Fatalf("expected Huya minimum dependency:\n%s", mainGradle)
	}
	settingsPath := filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle")
	settings := readTestFile(t, settingsPath)
	if !strings.Contains(settings, "https://artifact.bytedance.com/repository/Volcengine/") {
		t.Fatalf("expected Volcengine Maven repository:\n%s", settings)
	}
	for _, want := range []string{
		`map.Add("game_id", "GAME_ID")`,
		`map.Add("login_client_id", "LOGIN_CLIENT_ID")`,
		`map.Add("login_client_secret", "LOGIN_CLIENT_SECRET")`,
		`map.Add("pay_app_id", "PAY_APP_ID")`,
		`map.Add("huya_debug_mode", "false")`,
		`map.Add("landscape_mode", "true")`,
		`map.Add("show_switch_count_in_game_center", "true")`,
	} {
		if !strings.Contains(output.Instructions, want) {
			t.Fatalf("expected Huya instructions to contain %q:\n%s", want, output.Instructions)
		}
	}

	second := callUnityChannelConfig(t, dir, "huya", "4.0.10", params)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent Huya channel config: %+v", second)
	}
	if strings.Count(readTestFile(t, settingsPath), "https://artifact.bytedance.com/repository/Volcengine/") != 2 {
		t.Fatalf("expected one Volcengine repository per settings repositories block:\n%s", readTestFile(t, settingsPath))
	}
}

func TestUnityChannelConfigChannelDependenciesAreExclusive(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	mumuParams := map[string]string{"mumuAppId": "MUMU_APP_ID"}
	if first := callUnityChannelConfig(t, dir, "mumu", "4.0.19", mumuParams); !first.Satisfied {
		t.Fatalf("expected initial MuMu config satisfied: %+v", first)
	}
	huyaParams := map[string]string{
		"huyaGameId":            "GAME_ID",
		"huyaLoginClientId":     "LOGIN_CLIENT_ID",
		"huyaLoginClientSecret": "LOGIN_CLIENT_SECRET",
		"huyaPayAppId":          "PAY_APP_ID",
		"huyaDebugMode":         "false",
		"huyaLandscapeMode":     "true",
		"huyaShowSwitchCount":   "true",
	}
	if second := callUnityChannelConfig(t, dir, "huya", "4.0.19", huyaParams); !second.Satisfied {
		t.Fatalf("expected Huya config satisfied: %+v", second)
	}
	mainGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	if strings.Contains(mainGradle, "rxsdk_yofun") || strings.Contains(mainGradle, "RuiXue mumu Dependencies") {
		t.Fatalf("previous channel dependency must be removed:\n%s", mainGradle)
	}
	if !strings.Contains(mainGradle, "rxsdk_huya:4.0.19") {
		t.Fatalf("selected Huya dependency missing:\n%s", mainGradle)
	}
}

// TestUnityChannelConfigAllChannels 为每个注册渠道构造合成工程，提供全部 @your 参数与资产源文件，
// 校验自动写入可成功（satisfied）且重复执行幂等。
func TestUnityChannelConfigAllChannels(t *testing.T) {
	for slug, spec := range unityChannelSpecs {
		slug, spec := slug, spec
		t.Run(slug, func(t *testing.T) {
			dir := t.TempDir()
			writeUnityProjectScaffold(t, dir)

			params := map[string]string{}
			for _, p := range spec.Params {
				params[p.Key] = "dummy_" + p.Key
			}
			// 资产源文件
			for _, asset := range spec.AssetFiles {
				src := filepath.Join(dir, "src_"+filepath.Base(asset.DestRelPath))
				writeTestFile(t, src, "{}\n")
				params[asset.SourceParamKey] = src
			}
			// iOS 设置资产需预先存在
			for _, iosAsset := range spec.IOSAssets {
				writeTestFile(t, filepath.Join(dir, filepath.FromSlash(iosAsset.AssetRelPath)), "MonoBehaviour:\n")
			}

			preflight := callUnityChannelConfig(t, dir, slug, "4.0.9", params)
			if !preflight.Satisfied {
				t.Fatalf("channel %s expected satisfied, got: %+v", slug, preflight)
			}

			// 再次执行应保持幂等
			preflight2 := callUnityChannelConfig(t, dir, slug, "4.0.9", params)
			if !preflight2.Satisfied {
				t.Fatalf("channel %s second run expected satisfied, got: %+v", slug, preflight2)
			}

			if len(spec.RuixueLibs) > 0 || len(spec.FixedLibs) > 0 {
				targetFile := "mainTemplate.gradle"
				if spec.DependencyTarget == "launcher" {
					targetFile = "launcherTemplate.gradle"
				}
				gradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", targetFile))
				marker := fmt.Sprintf("// ========== RuiXue %s Dependencies BEGIN ==========", slug)
				if strings.Count(gradle, marker) != 1 {
					t.Fatalf("channel %s expected idempotent dependency block, got count %d:\n%s", slug, strings.Count(gradle, marker), gradle)
				}
				expectedVersion := unityChannelAndroidVersion(slug, "4.0.9")
				for _, lib := range spec.RuixueLibs {
					if !strings.Contains(gradle, fmt.Sprintf(`implementation "com.ruixue:%s:%s"`, lib, expectedVersion)) {
						t.Fatalf("channel %s missing lib %s, got:\n%s", slug, lib, gradle)
					}
				}
			}
			settingsGradle := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"))
			if strings.Count(settingsGradle, "http://60.205.123.114:8081/repository/maven-releases/") != 2 {
				t.Fatalf("channel %s expected idempotent RuiXue Maven repository in both settings repositories blocks, got:\n%s", slug, settingsGradle)
			}
		})
	}
}
