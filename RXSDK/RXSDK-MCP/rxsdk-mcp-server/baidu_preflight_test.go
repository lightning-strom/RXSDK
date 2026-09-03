package rxsdk

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func TestBaiduPreflightRequiresWorkspaceAndIOSUnsupported(t *testing.T) {
	checks := map[string]func() PassportPreflightResult{
		"ios":      func() PassportPreflightResult { return iosBaiduPreflight("") },
		"android":  func() PassportPreflightResult { return androidBaiduPreflight("") },
		"unity":    func() PassportPreflightResult { return unityBaiduPreflight("") },
		"cocos2dx": func() PassportPreflightResult { return cocos2dxBaiduPreflight("") },
	}
	for name, check := range checks {
		t.Run(name, func(t *testing.T) {
			result := check()
			if result.Checked || result.Satisfied || len(result.NextSteps) == 0 {
				t.Fatalf("expected unchecked, unsatisfied and actionable result, got %+v", result)
			}
		})
	}

	result := iosBaiduPreflight(t.TempDir())
	assertBaiduMissing(t, result, "不支持")
	if !result.Checked {
		t.Fatalf("workspace-backed iOS unsupported result must be checked: %+v", result)
	}
}

func TestAndroidBaiduPreflightMissingDependencyDoesNotAdd(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "app", "build.gradle")
	writeBaiduFile(t, gradle, `implementation 'com.ruixue:rxsdk_base:4.0.18'`)
	result := androidBaiduPreflight(dir)
	for _, want := range []string{"rxsdk_baidu_wangxun", "基础初始化", "initThirdSdk", "showSplash"} {
		assertBaiduMissing(t, result, want)
	}
	assertBaiduFileNotContains(t, gradle, "rxsdk_baidu_wangxun:")
}

func TestAndroidBaiduPreflightBatchUpgradeIdempotentAndNoDowngrade(t *testing.T) {
	t.Run("batch_upgrade_and_idempotency", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "app", "build.gradle")
		writeBaiduFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.10'
implementation 'com.ruixue:rxsdk_login:4.0.17'
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.17'`)
		writeBaiduAndroidCode(t, dir)

		first := androidBaiduPreflight(dir)
		assertBaiduSatisfiedModified(t, first)
		assertBaiduFileContains(t, gradle, "rxsdk_base:4.0.18", "rxsdk_login:4.0.18", "rxsdk_baidu_wangxun:4.0.18")
		after := readBaiduFile(t, gradle)
		second := androidBaiduPreflight(dir)
		if !second.Satisfied || len(second.Modified) != 0 || readBaiduFile(t, gradle) != after {
			t.Fatalf("expected idempotent satisfied preflight, got %+v", second)
		}
	})

	t.Run("higher_versions", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "app", "build.gradle")
		writeBaiduFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:5.0.0'
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.1.0'`)
		writeBaiduAndroidCode(t, dir)
		before := readBaiduFile(t, gradle)
		result := androidBaiduPreflight(dir)
		if !result.Satisfied || len(result.Modified) != 0 || readBaiduFile(t, gradle) != before {
			t.Fatalf("higher versions must remain unchanged: %+v", result)
		}
	})
}

func TestUnityBaiduPreflightManifestAndCodeChecks(t *testing.T) {
	t.Run("missing_package", func(t *testing.T) {
		dir := t.TempDir()
		writeBaiduFile(t, filepath.Join(dir, "Packages", "manifest.json"),
			`{"dependencies":{"com.ruixue.unitysdk.base":"4.0.1"}}`)
		result := unityBaiduPreflight(dir)
		for _, want := range []string{"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay", "RuiXueSdk.Initialize", "InitThirdSdk", "InvokeChannelAction"} {
			assertBaiduMissing(t, result, want)
		}
	})

	t.Run("batch_upgrade_without_main_template", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeBaiduFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.0.0",
  "com.ruixue.unitysdk.login":"4.0.0",
  "com.ruixue.unitysdk.pay":"4.0.0",
  "com.ruixue.unitysdk.share":"4.0.0"
}}`)
		writeBaiduUnityCode(t, dir)
		first := unityBaiduPreflight(dir)
		assertBaiduSatisfiedModified(t, first)
		assertBaiduFileContains(t, manifest,
			`"com.ruixue.unitysdk.base": "4.0.1"`,
			`"com.ruixue.unitysdk.login": "4.0.1"`,
			`"com.ruixue.unitysdk.pay": "4.0.1"`,
			`"com.ruixue.unitysdk.share": "4.0.1"`)
		after := readBaiduFile(t, manifest)
		second := unityBaiduPreflight(dir)
		if !second.Satisfied || len(second.Modified) != 0 || readBaiduFile(t, manifest) != after {
			t.Fatalf("expected idempotent Unity preflight, got %+v", second)
		}
	})
}

func TestUnityBaiduPreflightVersionSafety(t *testing.T) {
	for name, version := range map[string]string{
		"file":  "file:../baidu",
		"git":   "https://example.com/baidu.git#v4.0.1",
		"range": ">=4.0.1",
	} {
		t.Run(name, func(t *testing.T) {
			dir := t.TempDir()
			manifest := filepath.Join(dir, "Packages", "manifest.json")
			writeBaiduFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.0.1",
  "com.ruixue.unitysdk.login":"`+version+`",
  "com.ruixue.unitysdk.pay":"4.0.1"
}}`)
			writeBaiduUnityCode(t, dir)
			before := readBaiduFile(t, manifest)
			result := unityBaiduPreflight(dir)
			assertBaiduMissing(t, result, "非固定版本")
			if readBaiduFile(t, manifest) != before {
				t.Fatal("non-fixed Unity dependency must not be overwritten")
			}
		})
	}

	t.Run("higher_versions", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeBaiduFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.2.0",
  "com.ruixue.unitysdk.login":"5.0.0",
  "com.ruixue.unitysdk.pay":"4.1.0"
}}`)
		writeBaiduUnityCode(t, dir)
		before := readBaiduFile(t, manifest)
		result := unityBaiduPreflight(dir)
		if !result.Satisfied || len(result.Modified) != 0 || readBaiduFile(t, manifest) != before {
			t.Fatalf("higher Unity versions must remain unchanged: %+v", result)
		}
	})

	t.Run("main_template_native_upgrade", func(t *testing.T) {
		dir := t.TempDir()
		writeBaiduFile(t, filepath.Join(dir, "Packages", "manifest.json"),
			`{"dependencies":{"com.ruixue.unitysdk.base":"4.0.1","com.ruixue.unitysdk.login":"4.0.1","com.ruixue.unitysdk.pay":"4.0.1"}}`)
		gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
		writeBaiduFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.17'
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.17'`)
		writeBaiduUnityCode(t, dir)
		result := unityBaiduPreflight(dir)
		assertBaiduSatisfiedModified(t, result)
		assertBaiduFileContains(t, gradle, "rxsdk_base:4.0.18", "rxsdk_baidu_wangxun:4.0.18")
	})
}

func TestCocos2dxBaiduPreflight(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "proj.android", "app", "build.gradle")
	writeBaiduFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.17'
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.17'`)
	writeBaiduFile(t, filepath.Join(dir, "Classes", "Game.cpp"), `
bridge->init(base, callback);
bridge->initThirdSdk(third, callback);
bridge->invokeChannelAction("showSplash", "{}", callback);`)
	result := cocos2dxBaiduPreflight(dir)
	assertBaiduSatisfiedModified(t, result)
	assertBaiduFileContains(t, gradle, "rxsdk_base:4.0.18", "rxsdk_baidu_wangxun:4.0.18")

	missingDir := t.TempDir()
	writeBaiduFile(t, filepath.Join(missingDir, "proj.android", "build.gradle"),
		`implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.18'`)
	missing := cocos2dxBaiduPreflight(missingDir)
	for _, want := range []string{"RuixueBridge init", "initThirdSdk", "invokeChannelAction"} {
		assertBaiduMissing(t, missing, want)
	}
}

func TestBaiduSchemasAndRealHandlers(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "baidu-test", Version: "1.0.0"}, nil)
	session, err := client.Connect(ctx, clientTransport, nil)
	if err != nil {
		t.Fatalf("connect MCP client: %v", err)
	}
	defer session.Close()

	list, err := session.ListTools(ctx, nil)
	if err != nil {
		t.Fatalf("list tools: %v", err)
	}
	tools := map[string]*mcp.Tool{}
	for _, tool := range list.Tools {
		tools[tool.Name] = tool
	}
	for _, name := range []string{"ios", "android", "unity", "cocos2dx"} {
		schema, _ := json.Marshal(tools[name].InputSchema)
		if !strings.Contains(string(schema), `"baidu"`) || !strings.Contains(string(schema), `"workspacePath"`) {
			t.Fatalf("%s schema missing baidu/workspacePath: %s", name, schema)
		}
	}

	calls := []struct {
		tool string
		want []string
	}{
		{"ios", []string{"不支持百度", `"supported":false`}},
		{"android", []string{"rxsdk_baidu_wangxun:4.0.18", "invokeChannelAction", `"preflight"`}},
		{"unity", []string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay", `"minimumVersion":"4.0.1"`, "InvokeChannelAction"}},
		{"cocos2dx", []string{"invokeChannelAction", "baidunet", "iOS 不支持"}},
	}
	for _, tc := range calls {
		t.Run(tc.tool, func(t *testing.T) {
			output, err := session.CallTool(ctx, &mcp.CallToolParams{
				Name: tc.tool, Arguments: map[string]any{"feature": "baidu"},
			})
			if err != nil {
				t.Fatalf("call %s: %v", tc.tool, err)
			}
			encoded, _ := json.Marshal(output.StructuredContent)
			text := string(encoded)
			for _, want := range append(tc.want, `"checked":false`, `"satisfied":false`, `"nextSteps"`) {
				if !strings.Contains(text, want) {
					t.Fatalf("%s output missing %q: %s", tc.tool, want, text)
				}
			}
		})
	}
}

func TestBaiduTemplatesUseExactAPIs(t *testing.T) {
	checks := map[string][]string{
		"ios": {"仅支持 Android", "不要为 iOS 生成"},
		"android": {
			"com.ruixue:rxsdk_baidu_wangxun:4.0.18", `config.put("appid", "YOUR_BAIDU_APP_ID")`,
			"invokeChannelAction", "CHANNEL_ACTION_SHOW_SPLASH", `login.put("method", "baidunet")`,
			"CHANNEL_ACTION_SHOW_FLOAT_VIEW", "CHANNEL_ACTION_HIDE_FLOAT_VIEW",
			`pay.put("hq_type", "baidunet")`, "RuiXueSdk.getApi().pay", "setGameInfo", "exitApp",
		},
		"unity": {
			"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay", "4.0.1",
			"InvokeChannelAction", "ChannelActionShowSplash", "ChannelActionShowFloatView", "ChannelActionHideFloatView",
			"LoginMethod.BaiduNet", "RXPay.Pay", `["hq_type"] = "baidunet"`,
			"SetThirdGameInfo", "RuiXueSdk.ExitApp",
		},
		"cocos2dx": {
			"rxsdk_baidu_wangxun:4.0.18", "bridge->init(", "bridge->initThirdSdk", "invokeChannelAction",
			`"loginType":"baidunet"`, `"hq_type":"baidunet"`, "bridge->pay", "setGameInfo", "exitApp",
		},
	}
	for platform, wants := range checks {
		content, err := os.ReadFile(filepath.Join("templates", platform, "baidu.tpl"))
		if err != nil {
			t.Fatal(err)
		}
		text := string(content)
		for _, want := range wants {
			if !strings.Contains(text, want) {
				t.Fatalf("%s template missing %q: %s", platform, want, text)
			}
		}
	}
}

func TestBaiduChannelConfigEnforcesAndroidMinimum(t *testing.T) {
	for name, requested := range map[string]string{
		"empty": "",
		"plus":  "+",
		"low":   "4.0.17",
	} {
		t.Run(name, func(t *testing.T) {
			dir := t.TempDir()
			writeUnityProjectScaffold(t, dir)
			result := callUnityChannelConfig(t, dir, "baidu", requested, map[string]string{
				"baiduAppId":  "YOUR_BAIDU_APP_ID",
				"baiduAppKey": "YOUR_BAIDU_APP_KEY",
			})
			if !result.Satisfied {
				t.Fatalf("expected baidu channel config satisfied: %+v", result)
			}
			gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
			assertBaiduFileContains(t, gradle, "com.ruixue:rxsdk_baidu_wangxun:4.0.18")
			assertBaiduFileNotContains(t, gradle, "rxsdk_baidu_wangxun:+")
		})
	}

	t.Run("higher_version", func(t *testing.T) {
		dir := t.TempDir()
		writeUnityProjectScaffold(t, dir)
		result := callUnityChannelConfig(t, dir, "baidu", "4.1.0", map[string]string{
			"baiduAppId":  "YOUR_BAIDU_APP_ID",
			"baiduAppKey": "YOUR_BAIDU_APP_KEY",
		})
		if !result.Satisfied {
			t.Fatalf("expected baidu channel config satisfied: %+v", result)
		}
		assertBaiduFileContains(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
			"com.ruixue:rxsdk_baidu_wangxun:4.1.0")
	})
}

func writeBaiduAndroidCode(t *testing.T, dir string) {
	t.Helper()
	writeBaiduFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "MainActivity.java"), `
RXSdkInitConfig config = new RXSdkInitConfig();
RXSDK.initialize(this, config);
RuiXueSdk.getApi().initThirdSdk(this, third, callback);
RuiXueSdk.invokeChannelAction(this, "showSplash", new HashMap<>(), callback);`)
}

func writeBaiduUnityCode(t *testing.T, dir string) {
	t.Helper()
	writeBaiduFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"),
		`RuiXueSdk.Initialize(config, success, error); RuiXueSdk.InitThirdSdk(third, success, error); RuiXueSdk.InvokeChannelAction("showSplash", data, success, error);`)
}

func writeBaiduFile(t *testing.T, path, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}
}

func readBaiduFile(t *testing.T, path string) string {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(content)
}

func assertBaiduMissing(t *testing.T, result PassportPreflightResult, want string) {
	t.Helper()
	if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), want) {
		t.Fatalf("expected unsatisfied result containing %q, got %+v", want, result)
	}
}

func assertBaiduSatisfiedModified(t *testing.T, result PassportPreflightResult) {
	t.Helper()
	if !result.Satisfied || len(result.Modified) == 0 {
		t.Fatalf("expected satisfied modified result, got %+v", result)
	}
}

func assertBaiduFileContains(t *testing.T, path string, wants ...string) {
	t.Helper()
	content := readBaiduFile(t, path)
	for _, want := range wants {
		if !strings.Contains(content, want) {
			t.Fatalf("%s missing %q: %s", path, want, content)
		}
	}
}

func assertBaiduFileNotContains(t *testing.T, path, want string) {
	t.Helper()
	if strings.Contains(readBaiduFile(t, path), want) {
		t.Fatalf("%s unexpectedly contains %q", path, want)
	}
}
