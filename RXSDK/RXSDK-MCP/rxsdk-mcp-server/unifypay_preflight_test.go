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

func TestUnifypayPreflightRequiresWorkspace(t *testing.T) {
	checks := map[string]func() PassportPreflightResult{
		"ios":      func() PassportPreflightResult { return iosUnifypayPreflight("") },
		"android":  func() PassportPreflightResult { return androidUnifypayPreflight("") },
		"unity":    func() PassportPreflightResult { return unityUnifypayPreflight("") },
		"cocos2dx": func() PassportPreflightResult { return cocos2dxUnifypayPreflight("") },
	}
	for name, check := range checks {
		t.Run(name, func(t *testing.T) {
			result := check()
			if result.Checked || result.Satisfied || len(result.NextSteps) == 0 {
				t.Fatalf("expected unchecked actionable result, got %+v", result)
			}
		})
	}
}

func TestIOSUnifypayIsUnsupported(t *testing.T) {
	assertUnsatisfiedWithMissing(t, iosUnifypayPreflight(t.TempDir()), "不支持")
}

func TestAndroidUnifypayMissingDependencyAndInitialization(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), "android { defaultConfig { minSdkVersion 22 } }")
	result := androidUnifypayPreflight(dir)
	assertUnsatisfiedWithMissing(t, result, "rxsdk_unifypay")
	if !strings.Contains(strings.Join(result.Missing, "\n"), "初始化") {
		t.Fatalf("expected missing initialization, got %+v", result.Missing)
	}
}

func TestAndroidUnifypayUpgradeAndIdempotency(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, gradle, `
android { defaultConfig { minSdkVersion 21 } }
implementation 'com.ruixue:rxsdk_base:3.9.0'
implementation 'com.ruixue:rxsdk_unifypay:3.8.0'`)
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"),
		`RXSdkInitConfig config = new RXSdkInitConfig(); RXSDK.initialize(this, config);`)

	first := androidUnifypayPreflight(dir)
	assertSatisfiedAndModified(t, first)
	assertFileContains(t, gradle, "minSdkVersion 22", "rxsdk_base:4.0.17", "rxsdk_unifypay:4.0.17")
	after := readTestFile(t, gradle)
	second := androidUnifypayPreflight(dir)
	if !second.Satisfied || len(second.Modified) != 0 || readTestFile(t, gradle) != after {
		t.Fatalf("expected idempotent satisfied preflight, got %+v", second)
	}
}

func TestUnityAndCocosUnifypayPreflight(t *testing.T) {
	t.Run("unity", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
		writeTestFile(t, manifest, `{"dependencies":{"com.ruixue.unitysdk.base":"3.9.0"}}`)
		writeTestFile(t, gradle, `
android { defaultConfig { minSdk = 21 } }
implementation 'com.ruixue:rxsdk_base:3.9.0'
implementation 'com.ruixue:rxsdk_unifypay:3.9.0'`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `RuiXueSdk.Initialize(config, ok, fail);`)
		result := unityUnifypayPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, manifest, `"com.ruixue.unitysdk.pay": "4.0.0"`)
		assertFileContains(t, gradle, "minSdk = 22", "rxsdk_unifypay:4.0.17")
	})

	t.Run("cocos2dx", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "proj.android", "app", "build.gradle")
		writeTestFile(t, gradle, `
android { defaultConfig { minSdkVersion 21 } }
implementation 'com.ruixue:rxsdk_base:3.9.0'
implementation 'com.ruixue:rxsdk_unifypay:3.9.0'`)
		writeTestFile(t, filepath.Join(dir, "Classes", "App.cpp"), `bridge->init("{}", callback);`)
		result := cocos2dxUnifypayPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, gradle, "minSdkVersion 22", "rxsdk_unifypay:4.0.17")
	})
}

func TestUnifypaySchemasHandlersAndAndroidDirectAPI(t *testing.T) {
	androidTemplate, err := os.ReadFile(filepath.Join("templates", "android", "unifypay.tpl"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{
		"UPPaySdkWrapper.getInstance().doPay(",
		`payParams.put("hq_type", "aums")`,
		"RXJSONCallback",
		"UPPaySdkWrapper.getInstance().onNewIntent",
		"UPPaySdkWrapper.getInstance().onActivityResult",
	} {
		if !strings.Contains(string(androidTemplate), want) {
			t.Fatalf("Android template missing %q", want)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "unifypay-test", Version: "1.0.0"}, nil)
	session, err := client.Connect(ctx, clientTransport, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer session.Close()

	list, err := session.ListTools(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	tools := map[string]*mcp.Tool{}
	for _, tool := range list.Tools {
		tools[tool.Name] = tool
	}
	for _, name := range []string{"ios", "android", "unity", "cocos2dx"} {
		schema, _ := json.Marshal(tools[name].InputSchema)
		if !strings.Contains(string(schema), `"unifypay"`) {
			t.Fatalf("%s schema missing unifypay", name)
		}
		output, callErr := session.CallTool(ctx, &mcp.CallToolParams{
			Name: name, Arguments: map[string]any{"feature": "unifypay"},
		})
		if callErr != nil {
			t.Fatalf("call %s: %v", name, callErr)
		}
		encoded, _ := json.Marshal(output.StructuredContent)
		text := string(encoded)
		for _, want := range []string{`"preflight"`, `"checked":false`, `"satisfied":false`} {
			if !strings.Contains(text, want) {
				t.Fatalf("%s output missing %q: %s", name, want, text)
			}
		}
	}
}
