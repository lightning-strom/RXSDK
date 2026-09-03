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

func TestGDTPreflightRequiresWorkspace(t *testing.T) {
	cases := map[string]func(string) PassportPreflightResult{
		"android":  androidGDTPreflight,
		"ios":      iosGDTPreflight,
		"unity":    unityGDTPreflight,
		"minigame": minigameGDTPreflight,
		"cocos2dx": cocos2dxGDTPreflight,
	}
	for name, check := range cases {
		t.Run(name, func(t *testing.T) {
			result := check("")
			if result.Checked || result.Satisfied {
				t.Fatalf("expected unchecked and unsatisfied, got %+v", result)
			}
			if len(result.NextSteps) == 0 {
				t.Fatalf("expected actionable nextSteps, got %+v", result)
			}
		})
	}
}

func TestGDTPreflightDetectsMissingDependencies(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "app", "build.gradle"), `implementation 'com.ruixue:rxsdk_base:4.0.16'`)
		writeAndroidGDTUsage(t, dir)
		assertUnsatisfiedWithMissing(t, androidGDTPreflight(dir), "rxsdk_gdt")
	})

	t.Run("ios", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Podfile"), `pod 'RXSDK_Pure', '4.0.8'`)
		writeIOSGDTUsage(t, dir)
		assertUnsatisfiedWithMissing(t, iosGDTPreflight(dir), "RXGDTSDK")
	})

	t.Run("unity", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{"dependencies":{"com.ruixue.unitysdk.base":"1.6.38"}}`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `RuiXueSdk.Initialize(config, ok, fail);`)
		assertUnsatisfiedWithMissing(t, unityGDTPreflight(dir), "GDT")
	})

	t.Run("minigame", func(t *testing.T) {
		dir := t.TempDir()
		writeTestFile(t, filepath.Join(dir, "index.js"), minigameGDTJS("4.0.2"))
		assertUnsatisfiedWithMissing(t, minigameGDTPreflight(dir), "tencent-sdk.js")
	})

	t.Run("cocos2dx", func(t *testing.T) {
		dir := t.TempDir()
		writeCocosGDTBridge(t, dir)
		assertUnsatisfiedWithMissing(t, cocos2dxGDTPreflight(dir), "Gradle")
	})
}

func TestGDTPreflightUpgradesLowVersions(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		gradle := filepath.Join(dir, "app", "build.gradle")
		writeTestFile(t, gradle, `
dependencies {
    implementation 'com.ruixue:rxsdk_gdt:4.0.15'
    implementation 'com.ruixue:rxsdk_base:4.0.14'
}`)
		writeAndroidGDTUsage(t, dir)
		result := androidGDTPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, gradle, "rxsdk_gdt:4.0.16", "rxsdk_base:4.0.16")
	})

	t.Run("ios", func(t *testing.T) {
		dir := t.TempDir()
		podfile := filepath.Join(dir, "Podfile")
		writeTestFile(t, podfile, `
pod 'RXGDTSDK', '1.0.1'
pod 'RXSDK_Pure', '4.0.7'
pod 'RXSDKLogin', '4.0.6'`)
		writeIOSGDTUsage(t, dir)
		result := iosGDTPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, podfile,
			"pod 'RXGDTSDK', '1.0.2'",
			"pod 'RXSDK_Pure', '4.0.8'",
			"pod 'RXSDKLogin', '4.0.8'")
	})

	t.Run("unity_mobile", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		gradle := filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle")
		podfile := filepath.Join(dir, "PodfileTemplate")
		writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"1.6.37",
  "com.ruixue.unitysdk.gdt":"1.6.37",
  "com.ruixue.unitysdk.login":"1.6.36"
}}`)
		writeUnityMobileGDTUsage(t, dir)
		writeTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_gdt:4.0.15'
implementation 'com.ruixue:rxsdk_base:4.0.14'`)
		writeTestFile(t, podfile, `
pod 'RXGDTSDK', '1.0.1'
pod 'RXSDK_Pure', '4.0.7'
pod 'RXSDKLogin', '4.0.6'`)
		result := unityGDTPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, manifest,
			`"com.ruixue.unitysdk.base": "1.6.38"`,
			`"com.ruixue.unitysdk.gdt": "1.6.38"`,
			`"com.ruixue.unitysdk.login": "1.6.38"`)
		assertFileContains(t, gradle, "rxsdk_gdt:4.0.16", "rxsdk_base:4.0.16")
		assertFileContains(t, podfile, "RXGDTSDK', '1.0.2", "RXSDK_Pure', '4.0.8", "RXSDKLogin', '4.0.8")
	})

	t.Run("minigame_build_artifact_cannot_be_rewritten", func(t *testing.T) {
		dir := t.TempDir()
		index := filepath.Join(dir, "index.js")
		writeTestFile(t, index, minigameGDTJS("4.0.1"))
		writeTestFile(t, filepath.Join(dir, "tencent-sdk.js"), `export const SDK = {};`)
		before := readTestFile(t, index)
		result := minigameGDTPreflight(dir)
		if result.Satisfied || len(result.Modified) != 0 {
			t.Fatalf("expected low immutable JSSDK to be rejected without modification, got %+v", result)
		}
		if readTestFile(t, index) != before {
			t.Fatal("JSSDK build artifact must not be rewritten")
		}
	})

	t.Run("cocos2dx", func(t *testing.T) {
		dir := t.TempDir()
		writeCocosGDTBridge(t, dir)
		gradle := filepath.Join(dir, "proj.android", "app", "build.gradle")
		podfile := filepath.Join(dir, "proj.ios_mac", "Podfile")
		writeTestFile(t, gradle, `
implementation 'com.ruixue:rxsdk_gdt:4.0.15'
implementation 'com.ruixue:rxsdk_base:4.0.14'`)
		writeTestFile(t, podfile, `
pod 'RXGDTSDK', '1.0.1'
pod 'RXSDK_Pure', '4.0.7'
pod 'RXSDKLogin', '4.0.6'`)
		result := cocos2dxGDTPreflight(dir)
		assertSatisfiedAndModified(t, result)
		assertFileContains(t, gradle, "rxsdk_gdt:4.0.16", "rxsdk_base:4.0.16")
		assertFileContains(t, podfile, "RXGDTSDK', '1.0.2", "RXSDK_Pure', '4.0.8", "RXSDKLogin', '4.0.8")
	})
}

func TestGDTPreflightSatisfiedDoesNotRepeatOrDowngrade(t *testing.T) {
	t.Run("android", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "app", "build.gradle")
		writeTestFile(t, path, `
implementation 'com.ruixue:rxsdk_gdt:4.0.17'
implementation 'com.ruixue:rxsdk_base:4.1.0'`)
		writeAndroidGDTUsage(t, dir)
		assertStableSatisfied(t, path, func() PassportPreflightResult { return androidGDTPreflight(dir) })
	})

	t.Run("ios_alias_versions", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "Podfile")
		writeTestFile(t, path, `
pod 'RXGDTSDK', '1.0.3'
pod 'RXSDK_Pure', '4.1.0'
pod 'RXSDKLogin', '4.0.9'`)
		writeIOSGDTUsage(t, dir)
		assertStableSatisfied(t, path, func() PassportPreflightResult { return iosGDTPreflight(dir) })
	})

	t.Run("unity_mobile", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"1.6.39",
  "com.ruixue.unitysdk.gdt":"1.6.39"
}}`)
		writeUnityMobileGDTUsage(t, dir)
		writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
			`implementation 'com.ruixue:rxsdk_gdt:4.0.17'`)
		writeTestFile(t, filepath.Join(dir, "PodfileTemplate"), `
pod 'RXGDTSDK', '1.0.3'
pod 'RXSDK_Pure', '4.0.9'`)
		assertStableSatisfied(t, manifest, func() PassportPreflightResult { return unityGDTPreflight(dir) })
	})

	t.Run("unity_weixin_minigame", func(t *testing.T) {
		dir := t.TempDir()
		manifest := filepath.Join(dir, "Packages", "manifest.json")
		writeTestFile(t, manifest, `{"dependencies":{
  "com.ruixue.unitysdk.base":"1.6.38",
  "com.ruixue.unitysdk.minigame.weixin":"1.6.38"
}}`)
		writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "GDT.cs"), `
RuiXueSdk.Initialize(config, ok, fail);
RXMiniGameWeiXin.ReportGdt("QUEST", data);
RXMiniGameWeiXin.RegisterGdtMenuEventListeners();
RXMiniGameWeiXin.GetDirectAdStatusSync();
RXMiniGameWeiXin.OnDirectAdStatusChange(OnStatus);`)
		writeTestFile(t, filepath.Join(dir, "Build", "v4.0.2", "index.js"), minigameGDTJS("4.0.2"))
		writeTestFile(t, filepath.Join(dir, "Build", "v4.0.2", "tencent-sdk.js"), `export const SDK = {};`)
		assertStableSatisfied(t, manifest, func() PassportPreflightResult { return unityGDTPreflight(dir) })
	})

	t.Run("minigame", func(t *testing.T) {
		dir := t.TempDir()
		path := filepath.Join(dir, "v4.0.2", "index.js")
		writeTestFile(t, path, minigameGDTJS("4.0.2"))
		writeTestFile(t, filepath.Join(dir, "v4.0.2", "tencent-sdk.js"), `export const SDK = {};`)
		assertStableSatisfied(t, path, func() PassportPreflightResult { return minigameGDTPreflight(dir) })
	})

	t.Run("cocos2dx", func(t *testing.T) {
		dir := t.TempDir()
		writeCocosGDTBridge(t, dir)
		path := filepath.Join(dir, "proj.android", "app", "build.gradle")
		writeTestFile(t, path, `
implementation 'com.ruixue:rxsdk_gdt:4.0.17'
implementation 'com.ruixue:rxsdk_base:4.1.0'`)
		writeTestFile(t, filepath.Join(dir, "proj.ios_mac", "Podfile"), `
pod 'RXGDTSDK', '1.0.3'
pod 'RXSDK_Pure', '4.1.0'`)
		assertStableSatisfied(t, path, func() PassportPreflightResult { return cocos2dxGDTPreflight(dir) })
	})
}

func TestGDTTemplatesHandlersAndSchemas(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "gdt-test", Version: "1.0.0"}, nil)
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
	for _, name := range []string{"android", "ios", "unity", "minigame", "cocos2dx"} {
		tool := tools[name]
		if tool == nil {
			t.Fatalf("tool %s is not registered", name)
		}
		schema, _ := json.Marshal(tool.InputSchema)
		if !strings.Contains(string(schema), `"gdt"`) {
			t.Fatalf("tool %s schema does not enumerate gdt: %s", name, schema)
		}
	}
	iosSchema, _ := json.Marshal(tools["ios"].InputSchema)
	if !strings.Contains(string(iosSchema), `"tencent_ad"`) {
		t.Fatalf("iOS schema must retain tencent_ad alias: %s", iosSchema)
	}

	calls := []struct {
		tool    string
		feature string
		want    []string
	}{
		{"android", "gdt", []string{"GDTSdkWrapper", "4.0.16"}},
		{"ios", "gdt", []string{"RXGDTService", "1.0.2", "4.0.8"}},
		{"ios", "tencent_ad", []string{"RXGDTService", "compatibility_alias"}},
		{"unity", "gdt", []string{"RXGDT", "ReportGdt", "1.6.38"}},
		{"minigame", "gdt", []string{"tencent-sdk.js", "getDirectAdStatusSync", "4.0.2"}},
		{"cocos2dx", "gdt", []string{"RuixueBridge", "gdtReportPurchase"}},
	}
	for _, tc := range calls {
		t.Run(tc.tool+"_"+tc.feature, func(t *testing.T) {
			output, err := session.CallTool(ctx, &mcp.CallToolParams{
				Name:      tc.tool,
				Arguments: map[string]any{"feature": tc.feature},
			})
			if err != nil {
				t.Fatalf("call tool: %v", err)
			}
			encoded, _ := json.Marshal(output.StructuredContent)
			text := string(encoded)
			for _, want := range tc.want {
				if !strings.Contains(text, want) {
					t.Fatalf("expected output to contain %q: %s", want, text)
				}
			}
			for _, want := range []string{`"preflight"`, `"checked":false`, `"satisfied":false`, `"nextSteps"`} {
				if !strings.Contains(text, want) {
					t.Fatalf("expected structured preflight %q: %s", want, text)
				}
			}
		})
	}
}

func writeAndroidGDTUsage(t *testing.T, dir string) {
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "demo", "App.java"), `
RXSdkInitConfig config = new RXSdkInitConfig();
RXSDK.initialize(this, config);
GDTSdkWrapper gdt = GDTSdkWrapper.getInstance();
gdt.init(this, sid, sk, "tencent", "tencent");
gdt.reportCreateRole("role");
gdt.reportCheckout("item", "name", "id", 1, false, "", "CNY", true);
gdt.reportPurchase("item", "name", "id", 1, "wechat", "CNY", 600, true);`)
}

func writeIOSGDTUsage(t *testing.T, dir string) {
	writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), `
[[RXGDTService sharedSDK] regist];
RXSdkInitConfig *config = [RXSdkInitConfig new];
[[RXSDK sharedSDK] initWithConfig:config complete:nil];
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[RXGDTService sharedSDK] logAction:@"START_APP" actionParam:@{}];
}
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
  [[RXGDTService sharedSDK] handleOpenUrl:url];
  return YES;
}
[[RXGDTService sharedSDK] reportCreateRoleActionWithRole:@"role"];
[[RXGDTService sharedSDK] reportCheckoutActionWithContentType:@"item" contentName:@"name" contentID:@"id" contentNumber:1 isVirtualCurrency:NO virtualCurrencyType:@"" realCurrencyType:@"CNY" isSuccess:YES];
[[RXGDTService sharedSDK] reportPurchaseActionWithContentType:@"item" contentName:@"name" contentID:@"id" contentNumber:1 paymentChannel:@"wechat" realCurrency:@"CNY" currencyAmount:600 isSuccess:YES];`)
}

func writeUnityMobileGDTUsage(t *testing.T, dir string) {
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "GDT.cs"), `
RXGDT.RegisterSdk();
RuiXueSdk.Initialize(config, ok, fail);
RXGDT.Initialize(sid, sk, "tencent", "tencent");
RXGDT.ReportCreateRole("role");
RXGDT.ReportCheckout("item", "name", "id", 1, false, "", "CNY", true);
RXGDT.ReportPurchase("item", "name", "id", 1, "wechat", "CNY", 600, true);`)
}

func minigameGDTJS(version string) string {
	return `
const SDK_VERSION = '` + version + `'
wx.TencentSDK = SDK
const sdk = new RxSdk({productId:'p', channelId:'c', cpid:'cp', baseUrlList:['https://example.com']})
sdk.reportGdt('QUEST', {})
sdk.reportCreateRole('role')
sdk.reportUpdateLevel({level: 1})
sdk.reportViewContent('Mall')
sdk.getDirectAdStatusSync()
sdk.onDirectAdStatusChange(() => {})`
}

func writeCocosGDTBridge(t *testing.T, dir string) {
	writeTestFile(t, filepath.Join(dir, "Classes", "RuixueSDK", "RuixueBridge.h"), `
gdtRegisterSdk gdtInitialize gdtReportRegister gdtReportLogin
gdtReportCreateRole gdtReportCheckout gdtReportPurchase gdtReportQuestFinish
gdtReportShare gdtReportUpdateLevel gdtReportRateApp gdtReportViewContent gdtReportAddToCart`)
	writeTestFile(t, filepath.Join(dir, "Classes", "RuixueSDK", "android", "RuixueBridge_android.cpp"), `
RuixueBridge::gdtInitialize() {} void gdtReportPurchase() {}`)
	writeTestFile(t, filepath.Join(dir, "proj.android", "app", "src", "RuixueSDK.java"), `
class RuixueSDK { void gdtReportPurchase() { GDTSdkWrapper.getInstance().reportPurchase(); } }`)
	writeTestFile(t, filepath.Join(dir, "Classes", "RuixueSDK", "ios", "RuixueBridge_ios.mm"), `
RuixueBridge::gdtRegisterSdk() {} void gdtReportPurchase() {} RXGDTService *service;`)
	writeTestFile(t, filepath.Join(dir, "Classes", "App.cpp"), `
auto bridge = RuixueBridge::getInstance();
bridge->gdtRegisterSdk();
bridge->init("{}", callback);
bridge->gdtInitialize("sid", "sk", "tencent", "tencent");`)
}

func assertUnsatisfiedWithMissing(t *testing.T, result PassportPreflightResult, want string) {
	t.Helper()
	if result.Satisfied || len(result.Missing) == 0 {
		t.Fatalf("expected unsatisfied result with missing items, got %+v", result)
	}
	if !strings.Contains(strings.Join(result.Missing, "\n"), want) {
		t.Fatalf("expected missing to contain %q, got %+v", want, result.Missing)
	}
	if len(result.NextSteps) == 0 {
		t.Fatalf("expected nextSteps, got %+v", result)
	}
}

func assertSatisfiedAndModified(t *testing.T, result PassportPreflightResult) {
	t.Helper()
	if !result.Satisfied || len(result.Modified) == 0 {
		t.Fatalf("expected satisfied result with modifications, got %+v", result)
	}
}

func assertStableSatisfied(t *testing.T, trackedPath string, check func() PassportPreflightResult) {
	t.Helper()
	before := readTestFile(t, trackedPath)
	first := check()
	if !first.Satisfied || len(first.Modified) != 0 {
		t.Fatalf("expected already satisfied without modification, got %+v", first)
	}
	second := check()
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected repeated preflight to remain stable, got %+v", second)
	}
	if after := readTestFile(t, trackedPath); after != before {
		t.Fatalf("preflight changed high/satisfied dependency:\nbefore=%s\nafter=%s", before, after)
	}
}

func assertFileContains(t *testing.T, path string, wants ...string) {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read %s: %v", path, err)
	}
	for _, want := range wants {
		if !strings.Contains(string(content), want) {
			t.Fatalf("expected %s to contain %q:\n%s", path, want, content)
		}
	}
}
