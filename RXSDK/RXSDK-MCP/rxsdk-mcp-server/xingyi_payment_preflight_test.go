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

func TestXingYiPaymentPreflightRequiresWorkspace(t *testing.T) {
	checks := map[string]func() PassportPreflightResult{
		"android":  func() PassportPreflightResult { return androidXingYiPaymentPreflight("", "both") },
		"unity":    func() PassportPreflightResult { return unityXingYiPaymentPreflight("", "both") },
		"cocos2dx": func() PassportPreflightResult { return cocos2dxXingYiPaymentPreflight("", "both") },
		"ios":      func() PassportPreflightResult { return iosXingYiPaymentPreflight("") },
	}
	for name, check := range checks {
		t.Run(name, func(t *testing.T) {
			result := check()
			if result.Checked || result.Satisfied || len(result.NextSteps) == 0 {
				t.Fatalf("expected unchecked, unsatisfied and actionable result, got %+v", result)
			}
		})
	}
}

func TestAndroidXingYiPaymentModesAndMissingDependencies(t *testing.T) {
	cases := []struct {
		mode        string
		deps        string
		wantMissing string
	}{
		{"app", `implementation 'com.ruixue:rxsdk_h5pay:4.0.14'`, "rxsdk_xingyi"},
		{"h5", `implementation 'com.ruixue:rxsdk_xingyi:4.0.14'`, "rxsdk_h5pay"},
		{"both", `implementation 'com.ruixue:rxsdk_xingyi:4.0.14'`, "rxsdk_h5pay"},
	}
	for _, tc := range cases {
		t.Run(tc.mode, func(t *testing.T) {
			dir := t.TempDir()
			writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), tc.deps)
			writeXingYiAndroidInit(t, dir)
			assertUnsatisfiedWithMissing(t, androidXingYiPaymentPreflight(dir, tc.mode), tc.wantMissing)
		})
	}
}

func TestAndroidXingYiPaymentDetectsMissingInitialization(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `
implementation 'com.ruixue:rxsdk_xingyi:4.0.14'
implementation 'com.ruixue:rxsdk_h5pay:4.0.14'`)
	assertUnsatisfiedWithMissing(t, androidXingYiPaymentPreflight(dir, "both"), "初始化")
}

func TestAndroidXingYiPaymentBatchUpgradeAndIdempotency(t *testing.T) {
	for _, mode := range []string{"app", "h5", "both"} {
		t.Run(mode, func(t *testing.T) {
			dir := t.TempDir()
			path := filepath.Join(dir, "app", "build.gradle")
			deps := `implementation 'com.ruixue:rxsdk_base:4.0.10'` + "\n"
			if mode != "h5" {
				deps += `implementation 'com.ruixue:rxsdk_xingyi:4.0.13'` + "\n"
			}
			if mode != "app" {
				deps += `implementation 'com.ruixue:rxsdk_h5pay:4.0.12'` + "\n"
			}
			writeTestFile(t, path, deps)
			writeXingYiAndroidInit(t, dir)

			first := androidXingYiPaymentPreflight(dir, mode)
			assertSatisfiedAndModified(t, first)
			assertFileContains(t, path, "rxsdk_base:4.0.14")
			for _, artifact := range xingyiRequiredAndroidArtifacts(mode) {
				assertFileContains(t, path, artifact+":4.0.14")
			}
			afterFirst := readTestFile(t, path)
			second := androidXingYiPaymentPreflight(dir, mode)
			if !second.Satisfied || len(second.Modified) != 0 || readTestFile(t, path) != afterFirst {
				t.Fatalf("expected idempotent satisfied preflight, got %+v", second)
			}
		})
	}
}

func TestAndroidXingYiPaymentDoesNotDowngrade(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, path, `
implementation 'com.ruixue:rxsdk_base:4.1.0'
implementation 'com.ruixue:rxsdk_xingyi:4.0.15'
implementation 'com.ruixue:rxsdk_h5pay:5.0.0'`)
	writeXingYiAndroidInit(t, dir)
	assertStableSatisfied(t, path, func() PassportPreflightResult {
		return androidXingYiPaymentPreflight(dir, "both")
	})
}

func TestUnityXingYiPaymentMissingDependencyAndInitialization(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"),
		`{"dependencies":{"com.ruixue.unitysdk.base":"4.0.0"}}`)
	result := unityXingYiPaymentPreflight(dir, "app")
	assertUnsatisfiedWithMissing(t, result, "com.ruixue.unitysdk.xingyi")
	if !strings.Contains(strings.Join(result.Missing, "\n"), "初始化") {
		t.Fatalf("expected initialization missing item, got %+v", result.Missing)
	}
}

func TestUnityXingYiPaymentBatchUpgradeAndIdempotency(t *testing.T) {
	dir := t.TempDir()
	manifest := filepath.Join(dir, "Packages", "manifest.json")
	gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
	writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"3.9.9",
  "com.ruixue.unitysdk.login":"3.8.0",
  "com.ruixue.unitysdk.xingyi":"3.9.0"
}}`)
	writeTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_base:4.0.10'
implementation 'com.ruixue:rxsdk_xingyi:4.0.13'
implementation 'com.ruixue:rxsdk_h5pay:4.0.12'`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `RuiXueSdk.Initialize(config, ok, fail);`)

	first := unityXingYiPaymentPreflight(dir, "both")
	assertSatisfiedAndModified(t, first)
	assertFileContains(t, manifest,
		`"com.ruixue.unitysdk.base": "4.0.0"`,
		`"com.ruixue.unitysdk.login": "4.0.0"`,
		`"com.ruixue.unitysdk.xingyi": "4.0.0"`)
	assertFileContains(t, gradle, "rxsdk_base:4.0.14", "rxsdk_xingyi:4.0.14", "rxsdk_h5pay:4.0.14")

	manifestAfter := readTestFile(t, manifest)
	gradleAfter := readTestFile(t, gradle)
	second := unityXingYiPaymentPreflight(dir, "both")
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent Unity preflight, got %+v", second)
	}
	if readTestFile(t, manifest) != manifestAfter || readTestFile(t, gradle) != gradleAfter {
		t.Fatal("idempotent Unity preflight rewrote satisfied files")
	}
}

func TestUnityXingYiPaymentDoesNotDowngradeOrOverwriteNonFixed(t *testing.T) {
	t.Run("higher_versions", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.1.0",
  "com.ruixue.unitysdk.xingyi":"5.0.0"
}}`)
		writeXingYiUnityAndroid(t, dir, "both", "4.0.15")
		assertStableSatisfied(t, manifest, func() PassportPreflightResult {
			return unityXingYiPaymentPreflight(dir, "both")
		})
	})

	for name, version := range map[string]string{
		"file":  "file:../local-xingyi",
		"git":   "https://example.com/xingyi.git#v4.0.0",
		"range": ">=4.0.0",
	} {
		t.Run(name, func(t *testing.T) {
			dir := t.TempDir()
			manifest := filepath.Join(dir, "Packages", "manifest.json")
			writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"4.0.0",
  "com.ruixue.unitysdk.xingyi":"`+version+`"
}}`)
			writeXingYiUnityAndroid(t, dir, "app", "4.0.14")
			before := readTestFile(t, manifest)
			result := unityXingYiPaymentPreflight(dir, "app")
			assertUnsatisfiedWithMissing(t, result, "非固定版本")
			if readTestFile(t, manifest) != before {
				t.Fatalf("non-fixed Unity dependency must not be overwritten: %s", readTestFile(t, manifest))
			}
		})
	}
}

func TestCocosAndIOSXingYiPaymentPreflight(t *testing.T) {
	t.Run("cocos_android_only", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "proj.android", "app", "build.gradle")
		writeTestFile(t, path, `
implementation 'com.ruixue:rxsdk_base:4.0.13'
implementation 'com.ruixue:rxsdk_xingyi:4.0.13'`)
		writeTestFile(t, filepath.Join(dir, "Classes", "App.cpp"), `bridge->init("{}", callback);`)
		result := cocos2dxXingYiPaymentPreflight(dir, "app")
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, path, "rxsdk_base:4.0.14", "rxsdk_xingyi:4.0.14")
	})

	t.Run("ios_unsupported", func(t *testing.T) {
		result := iosXingYiPaymentPreflight(t.TempDir())
		assertUnsatisfiedWithMissing(t, result, "不支持")
	})
}

func TestXingYiPaymentSchemasAndRealHandlers(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "xingyi-payment-test", Version: "1.0.0"}, nil)
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
		if !strings.Contains(string(schema), `"xingyi_payment"`) ||
			!strings.Contains(string(schema), `"paymentMode"`) {
			t.Fatalf("%s schema missing xingyi_payment/paymentMode: %s", name, schema)
		}
	}

	calls := []struct {
		tool string
		mode string
		want []string
	}{
		{"ios", "app", []string{"不支持", `"supported":false`}},
		{"android", "h5", []string{"hq_type", "rxsdk_h5pay", `"paymentMode":"h5"`}},
		{"unity", "app", []string{"RXXingYiPay.PayApp", "com.ruixue.unitysdk.xingyi"}},
		{"cocos2dx", "both", []string{"RuixueBridge::pay", "iOS 不支持"}},
	}
	for _, tc := range calls {
		t.Run(tc.tool, func(t *testing.T) {
			output, err := session.CallTool(ctx, &mcp.CallToolParams{
				Name: tc.tool,
				Arguments: map[string]any{
					"feature":     "xingyi_payment",
					"paymentMode": tc.mode,
				},
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
		})
	}
}

func writeXingYiAndroidInit(t *testing.T, dir string) {
	t.Helper()
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"),
		`RXSdkInitConfig config = new RXSdkInitConfig(); RXSDK.initialize(this, config);`)
}

func writeXingYiUnityAndroid(t *testing.T, dir, mode, version string) {
	t.Helper()
	deps := `implementation 'com.ruixue:rxsdk_base:` + version + `'` + "\n"
	for _, artifact := range xingyiRequiredAndroidArtifacts(mode) {
		deps += `implementation 'com.ruixue:` + artifact + `:` + version + `'` + "\n"
	}
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"), deps)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `RuiXueSdk.Initialize(config, ok, fail);`)
}

func TestXingYiPaymentTemplateH5UsesIntegerFlag(t *testing.T) {
	androidContent, err := os.ReadFile(filepath.Join("templates", "android", "xingyi_payment.tpl"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(androidContent), `ext.put("is_h5", 1)`) {
		t.Fatalf("Android H5 example must use integer is_h5=1: %s", androidContent)
	}

	unityContent, err := os.ReadFile(filepath.Join("templates", "unity", "xingyi_payment.tpl"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{"Dictionary<string, object>", "RXXingYiPay.PayApp(", "RXXingYiPay.PayH5(", "error =>"} {
		if !strings.Contains(string(unityContent), want) {
			t.Fatalf("Unity example must match RXXingYiPay dictionary/callback API, missing %q: %s", want, unityContent)
		}
	}

	cocosContent, err := os.ReadFile(filepath.Join("templates", "cocos2dx", "xingyi_payment.tpl"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{`"payType":"xy"`, `"goodsTag":"YOUR_GOODS_TAG"`, `"tradeNo":"YOUR_TRADE_NO"`, `"is_h5":1`} {
		if !strings.Contains(string(cocosContent), want) {
			t.Fatalf("Cocos2dx example must match RuixueSDKPay JSON contract, missing %q: %s", want, cocosContent)
		}
	}
}
