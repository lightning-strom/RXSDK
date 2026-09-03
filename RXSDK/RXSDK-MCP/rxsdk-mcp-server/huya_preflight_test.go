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

func TestHuyaPreflightRequiresWorkspaceAndIOSUnsupported(t *testing.T) {
	checks := map[string]func() PassportPreflightResult{
		"ios":      func() PassportPreflightResult { return iosHuyaPreflight("") },
		"android":  func() PassportPreflightResult { return androidHuyaPreflight("") },
		"unity":    func() PassportPreflightResult { return unityHuyaPreflight("") },
		"cocos2dx": func() PassportPreflightResult { return cocos2dxHuyaPreflight("") },
	}
	for name, check := range checks {
		t.Run(name, func(t *testing.T) {
			result := check()
			if result.Checked || result.Satisfied || len(result.NextSteps) == 0 {
				t.Fatalf("expected unchecked, unsatisfied and actionable result, got %+v", result)
			}
		})
	}

	result := iosHuyaPreflight(t.TempDir())
	assertHuyaMissing(t, result, "不支持")
	if !result.Checked {
		t.Fatalf("workspace-backed iOS unsupported result must be checked: %+v", result)
	}
}

func TestAndroidHuyaPreflightDetectsMissingItems(t *testing.T) {
	dir := t.TempDir()
	writeHuyaTestFile(t, filepath.Join(dir, "app", "build.gradle"),
		`implementation 'com.ruixue:rxsdk_base:4.0.19'`)
	result := androidHuyaPreflight(dir)
	for _, want := range []string{"rxsdk_huya", "Volcengine", "基础初始化", "initThirdSdk", "onResume/onPause/onActivityResult/onRequestPermissionsResult"} {
		if !strings.Contains(strings.Join(result.Missing, "\n"), want) {
			t.Fatalf("missing %q in %+v", want, result)
		}
	}
	assertHuyaFileNotContains(t, filepath.Join(dir, "app", "build.gradle"), "rxsdk_huya:")
}

func TestAndroidHuyaPreflightBatchUpgradeIdempotentAndNoDowngrade(t *testing.T) {
	t.Run("batch_upgrade_and_idempotency", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "app", "build.gradle")
		writeHuyaTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.10'
implementation 'com.ruixue:rxsdk_login:4.0.16'
implementation 'com.ruixue:rxsdk_huya:4.0.15'`)
		writeHuyaVolcengineRepo(t, dir)
		writeHuyaAndroidCode(t, dir)

		first := androidHuyaPreflight(dir)
		assertHuyaSatisfiedModified(t, first)
		assertHuyaFileContains(t, gradle, "rxsdk_base:4.0.19", "rxsdk_login:4.0.19", "rxsdk_huya:4.0.19")
		after := readHuyaTestFile(t, gradle)
		second := androidHuyaPreflight(dir)
		if !second.Satisfied || len(second.Modified) != 0 || readHuyaTestFile(t, gradle) != after {
			t.Fatalf("expected idempotent satisfied preflight, got %+v", second)
		}
	})

	t.Run("higher_versions", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "app", "build.gradle")
		writeHuyaTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:5.0.0'
implementation 'com.ruixue:rxsdk_huya:4.1.0'`)
		writeHuyaVolcengineRepo(t, dir)
		writeHuyaAndroidCode(t, dir)
		before := readHuyaTestFile(t, gradle)
		result := androidHuyaPreflight(dir)
		if !result.Satisfied || len(result.Modified) != 0 || readHuyaTestFile(t, gradle) != before {
			t.Fatalf("higher versions must remain unchanged: %+v", result)
		}
	})
}

func TestUnityHuyaPreflightMissingAndBatchUpgrade(t *testing.T) {
	t.Run("missing_dependency_initialization_and_lifecycle", func(t *testing.T) {
		dir := t.TempDir()
		writeHuyaTestFile(t, filepath.Join(dir, "Packages", "manifest.json"),
			`{"dependencies":{"com.ruixue.unitysdk.base":"4.0.0"}}`)
		result := unityHuyaPreflight(dir)
		for _, want := range []string{"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay", "RuiXueSdk.Initialize", "InitThirdSdk", "Gradle", "Volcengine", "Activity"} {
			if !strings.Contains(strings.Join(result.Missing, "\n"), want) {
				t.Fatalf("missing %q in %+v", want, result)
			}
		}
		manifest := readHuyaTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
		if strings.Contains(manifest, "com.ruixue.unitysdk.login") || strings.Contains(manifest, "com.ruixue.unitysdk.pay") {
			t.Fatalf("missing public UPM dependencies must not be silently added: %s", manifest)
		}
	})

	t.Run("batch_upgrade_and_idempotency", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
		writeHuyaTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"3.9.0",
  "com.ruixue.unitysdk.login":"3.8.0",
  "com.ruixue.unitysdk.pay":"3.7.0",
  "com.ruixue.unitysdk.share":"3.6.0"
}}`)
		writeHuyaTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.10'
implementation 'com.ruixue:rxsdk_huya:4.0.16'`)
		writeHuyaVolcengineRepo(t, dir)
		writeHuyaTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"),
			`RuiXueSdk.Initialize(config, success, error); RuiXueSdk.InitThirdSdk(third, success, error);`)
		writeHuyaLifecycle(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), "RuiXueSdk")

		first := unityHuyaPreflight(dir)
		assertHuyaSatisfiedModified(t, first)
		assertHuyaFileContains(t, manifest,
			`"com.ruixue.unitysdk.base": "4.0.2"`,
			`"com.ruixue.unitysdk.login": "4.0.2"`,
			`"com.ruixue.unitysdk.pay": "4.0.2"`,
			`"com.ruixue.unitysdk.share": "4.0.2"`)
		assertHuyaFileContains(t, gradle, "rxsdk_base:4.0.19", "rxsdk_huya:4.0.19")
		manifestAfter, gradleAfter := readHuyaTestFile(t, manifest), readHuyaTestFile(t, gradle)
		second := unityHuyaPreflight(dir)
		if !second.Satisfied || len(second.Modified) != 0 ||
			readHuyaTestFile(t, manifest) != manifestAfter || readHuyaTestFile(t, gradle) != gradleAfter {
			t.Fatalf("expected idempotent Unity preflight, got %+v", second)
		}
	})
}

func TestUnityHuyaPreflightDoesNotOverwriteNonFixedOrDowngrade(t *testing.T) {
	for name, version := range map[string]string{
		"file":  "file:../huya",
		"git":   "https://example.com/huya.git#v4.0.0",
		"range": ">=4.0.0",
	} {
		t.Run(name, func(t *testing.T) {
			dir := t.TempDir()
			manifest := filepath.Join(dir, "Packages", "manifest.json")
			writeHuyaTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.0.2",
  "com.ruixue.unitysdk.login":"`+version+`",
  "com.ruixue.unitysdk.pay":"4.0.2"
}}`)
			writeHuyaUnityAndroid(t, dir, "4.0.19")
			before := readHuyaTestFile(t, manifest)
			result := unityHuyaPreflight(dir)
			assertHuyaMissing(t, result, "非固定版本")
			if readHuyaTestFile(t, manifest) != before {
				t.Fatal("non-fixed Unity dependency must not be overwritten")
			}
		})
	}

	t.Run("higher_versions", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeHuyaTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.2.0",
  "com.ruixue.unitysdk.login":"5.0.0",
  "com.ruixue.unitysdk.pay":"4.1.0"
}}`)
		writeHuyaUnityAndroid(t, dir, "4.1.0")
		before := readHuyaTestFile(t, manifest)
		result := unityHuyaPreflight(dir)
		if !result.Satisfied || len(result.Modified) != 0 || readHuyaTestFile(t, manifest) != before {
			t.Fatalf("higher Unity versions must remain unchanged: %+v", result)
		}
	})
}

func TestCocos2dxHuyaPreflight(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "proj.android", "app", "build.gradle")
	writeHuyaTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.15'
implementation 'com.ruixue:rxsdk_huya:4.0.16'`)
	writeHuyaVolcengineRepo(t, dir)
	writeHuyaTestFile(t, filepath.Join(dir, "Classes", "Game.cpp"), `
bridge->init(base, callback);
bridge->initThirdSdk(third, callback);`)
	writeHuyaLifecycle(t, filepath.Join(dir, "proj.android", "app", "src", "AppActivity.java"), "RXSDK")
	result := cocos2dxHuyaPreflight(dir)
	assertHuyaSatisfiedModified(t, result)
	assertHuyaFileContains(t, gradle, "rxsdk_base:4.0.19", "rxsdk_huya:4.0.19")
}

func TestHuyaSchemasAndRealHandlers(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "huya-test", Version: "1.0.0"}, nil)
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
		if !strings.Contains(string(schema), `"huya"`) || !strings.Contains(string(schema), `"workspacePath"`) {
			t.Fatalf("%s schema missing huya/workspacePath: %s", name, schema)
		}
	}

	calls := []struct {
		tool string
		want []string
	}{
		{"ios", []string{"不支持虎牙", `"supported":false`}},
		{"android", []string{"RuiXueSdk.getApi().initThirdSdk", "method", "huya", "hq_type"}},
		{"unity", []string{"RuiXueSdk.InitThirdSdk", "LoginMethod.Huya", "RXPay.Pay", "SetThirdGameInfo"}},
		{"cocos2dx", []string{"initThirdSdk", "loginType", "payType", "setGameInfo", "iOS 不支持"}},
	}
	for _, tc := range calls {
		t.Run(tc.tool, func(t *testing.T) {
			output, err := session.CallTool(ctx, &mcp.CallToolParams{
				Name: tc.tool, Arguments: map[string]any{"feature": "huya"},
			})
			if err != nil {
				t.Fatalf("call %s: %v", tc.tool, err)
			}
			encoded, _ := json.Marshal(output.StructuredContent)
			text := string(encoded)
			for _, want := range append(tc.want,
				`"preflight"`, `"checked":false`, `"satisfied":false`, `"nextSteps"`) {
				if !strings.Contains(text, want) {
					t.Fatalf("%s output missing %q: %s", tc.tool, want, text)
				}
			}
			if tc.tool == "unity" {
				for _, want := range []string{`"minimumVersion":"4.0.2"`, `"com.ruixue.unitysdk.base"`, `"com.ruixue.unitysdk.login"`, `"com.ruixue.unitysdk.pay"`} {
					if !strings.Contains(text, want) {
						t.Fatalf("Unity handler output missing public dependency %q: %s", want, text)
					}
				}
				if strings.Contains(text, "com.ruixue.unitysdk."+"huya") {
					t.Fatalf("Unity handler must not recommend a dedicated Huya UPM: %s", text)
				}
			}
		})
	}

	channelOutput, err := session.CallTool(ctx, &mcp.CallToolParams{
		Name: "unity", Arguments: map[string]any{
			"feature":      "channel_config",
			"thirdChannel": "huya",
		},
	})
	if err != nil {
		t.Fatalf("call Unity Huya channel_config through real schema/handler: %v", err)
	}
	encodedChannel, _ := json.Marshal(channelOutput.StructuredContent)
	if !strings.Contains(string(encodedChannel), `"channel":"huya"`) ||
		!strings.Contains(string(encodedChannel), `"checked":false`) {
		t.Fatalf("unexpected Unity Huya channel_config output: %s", encodedChannel)
	}
}

func TestHuyaTemplatesUseExactGenericAPIs(t *testing.T) {
	checks := map[string][]string{
		"android": {
			"com.ruixue:rxsdk_huya:4.0.19", "RuiXueSdk.getApi().initThirdSdk",
			`login.put("method", "huya")`, `pay.put("hq_type", "huya")`,
			"RuiXueSdk.getApi().setGameInfo", "berry:1.4.5-698", "后端支付通知",
		},
		"unity": {
			"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay",
			"RuiXueSdk.InitThirdSdk", "LoginMethod.Huya",
			"RXPay.Pay", `["hq_type"] = "huya"`, "RuiXueSdk.SetThirdGameInfo",
			"rxsdk_huya", "Volcengine", "login_client_secret", "禁止写入日志或提交到公开仓库",
		},
		"cocos2dx": {
			"bridge->init(", "bridge->initThirdSdk", `bridge->login(R"({"loginType":"huya"})`,
			`"payType":"huya"`, `"goodsTag":"YOUR_GOODS_TAG"`, `"tradeNo":"YOUR_TRADE_NO"`,
			"bridge->setGameInfo", "iOS 不支持",
		},
		"ios": {"iOS SDK 不提供", "不要为 iOS 生成"},
	}
	for platform, wants := range checks {
		content, err := os.ReadFile(filepath.Join("templates", platform, "huya.tpl"))
		if err != nil {
			t.Fatal(err)
		}
		text := string(content)
		for _, want := range wants {
			if !strings.Contains(text, want) {
				t.Fatalf("%s template missing %q: %s", platform, want, text)
			}
		}
		if platform == "unity" && (strings.Contains(text, "RXHuya") || strings.Contains(text, "unitysdk."+"huya")) {
			t.Fatalf("Unity template must not use a Huya-specific wrapper or UPM: %s", text)
		}
	}
}

func writeHuyaAndroidCode(t *testing.T, dir string) {
	t.Helper()
	writeHuyaTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "MainActivity.java"), `
RXSdkInitConfig config = new RXSdkInitConfig();
RXSDK.initialize(this, config);
RuiXueSdk.getApi().initThirdSdk(this, third, callback);
RuiXueSdk.onResume(this);
RuiXueSdk.onPause(this);
RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);`)
}

func writeHuyaUnityAndroid(t *testing.T, dir, version string) {
	t.Helper()
	writeHuyaTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		`implementation 'com.ruixue:rxsdk_huya:`+version+`'`)
	writeHuyaVolcengineRepo(t, dir)
	writeHuyaTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"),
		`RuiXueSdk.Initialize(config, success, error); RuiXueSdk.InitThirdSdk(third, success, error);`)
	writeHuyaLifecycle(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), "RuiXueSdk")
}

func writeHuyaVolcengineRepo(t *testing.T, dir string) {
	t.Helper()
	writeHuyaTestFile(t, filepath.Join(dir, "settings.gradle"),
		`maven { url 'https://artifact.bytedance.com/repository/Volcengine/' }`)
	writeHuyaTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "settingsTemplate.gradle"),
		`repositories { maven { url 'https://artifact.bytedance.com/repository/Volcengine/' } }`)
}

func writeHuyaLifecycle(t *testing.T, path, sdk string) {
	t.Helper()
	writeHuyaTestFile(t, path, sdk+`.onResume(this);
`+sdk+`.onPause(this);
`+sdk+`.onActivityResult(this, requestCode, resultCode, data);
`+sdk+`.onRequestPermissionsResult(this, requestCode, permissions, grantResults);`)
}

func writeHuyaTestFile(t *testing.T, path, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}
}

func readHuyaTestFile(t *testing.T, path string) string {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(content)
}

func assertHuyaMissing(t *testing.T, result PassportPreflightResult, want string) {
	t.Helper()
	if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), want) {
		t.Fatalf("expected unsatisfied result containing %q, got %+v", want, result)
	}
}

func assertHuyaSatisfiedModified(t *testing.T, result PassportPreflightResult) {
	t.Helper()
	if !result.Satisfied || len(result.Modified) == 0 {
		t.Fatalf("expected satisfied modified result, got %+v", result)
	}
}

func assertHuyaFileContains(t *testing.T, path string, wants ...string) {
	t.Helper()
	content := readHuyaTestFile(t, path)
	for _, want := range wants {
		if !strings.Contains(content, want) {
			t.Fatalf("%s missing %q: %s", path, want, content)
		}
	}
}

func assertHuyaFileNotContains(t *testing.T, path, want string) {
	t.Helper()
	if strings.Contains(readHuyaTestFile(t, path), want) {
		t.Fatalf("%s unexpectedly contains %q", path, want)
	}
}
