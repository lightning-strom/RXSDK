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

func TestXutengPreflightRequiresWorkspaceAndIOSUnsupported(t *testing.T) {
	checks := []PassportPreflightResult{
		iosXutengPreflight(""),
		androidXutengPreflight(""),
		unityXutengPreflight(""),
		cocos2dxXutengPreflight(""),
	}
	for _, result := range checks {
		if result.Checked || result.Satisfied || len(result.NextSteps) == 0 {
			t.Fatalf("expected unchecked actionable result: %+v", result)
		}
	}
	result := iosXutengPreflight(t.TempDir())
	if !result.Checked || result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "不支持") {
		t.Fatalf("expected checked structured iOS unsupported result: %+v", result)
	}
}

func TestAndroidXutengPreflightUpgradeAndIdempotency(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, gradle, `
android { defaultConfig { minSdkVersion 21
manifestPlaceholders.put("CHANNELSDK_ID", "real")
manifestPlaceholders.put("CHANNELSDK_GAME_VERSION", "1")
}}
dependencies {
implementation 'com.ruixue:rxsdk_base:4.0.10'
implementation 'com.ruixue:rxsdk_xuteng:4.0.18'
}`)
	writeXutengAndroidConfig(t, dir, filepath.Join("app", "src", "main"))
	writeTestFile(t, filepath.Join(dir, "app", "src", "main", "java", "Main.java"), `
RXSdkInitConfig config = new RXSdkInitConfig();
RXSDK.initialize(this, config);
RuiXueSdk.getApi().initThirdSdk(this, new HashMap<>(), callback);`)

	first := androidXutengPreflight(dir)
	if !first.Satisfied || len(first.Modified) == 0 {
		t.Fatalf("expected satisfied upgraded preflight: %+v", first)
	}
	content := readTestFile(t, gradle)
	for _, want := range []string{"minSdkVersion 23", "rxsdk_base:4.0.19", "rxsdk_xuteng:4.0.19"} {
		if !strings.Contains(content, want) {
			t.Fatalf("upgraded Gradle missing %q:\n%s", want, content)
		}
	}
	second := androidXutengPreflight(dir)
	if !second.Satisfied || len(second.Modified) != 0 || readTestFile(t, gradle) != content {
		t.Fatalf("expected idempotent second run: %+v", second)
	}
}

func TestAndroidXutengMissingDependencyIsNotAdded(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "app", "build.gradle")
	writeTestFile(t, gradle, `android { defaultConfig { minSdkVersion 23 } }
implementation 'com.ruixue:rxsdk_base:4.0.19'`)
	result := androidXutengPreflight(dir)
	if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "rxsdk_xuteng") {
		t.Fatalf("expected missing dedicated dependency: %+v", result)
	}
	if strings.Contains(readTestFile(t, gradle), "rxsdk_xuteng") {
		t.Fatal("missing dedicated dependency must not be silently added")
	}
}

func TestUnityXutengPreflightUpgradeSafetyAndGenericCalls(t *testing.T) {
	dir := t.TempDir()
	manifest := filepath.Join(dir, "Packages", "manifest.json")
	writeTestFile(t, manifest, `{"dependencies":{
"com.ruixue.unitysdk.base":"4.0.1",
"com.ruixue.unitysdk.login":"4.0.2",
"com.ruixue.unitysdk.pay":"4.0.3",
"com.ruixue.unitysdk.share":"4.0.0"
}}`)
	plugins := filepath.Join(dir, "Assets", "Plugins", "Android")
	writeTestFile(t, filepath.Join(plugins, "mainTemplate.gradle"),
		`android { defaultConfig { minSdkVersion 22 } }
implementation 'com.ruixue:rxsdk_xuteng:4.0.18'`)
	writeTestFile(t, filepath.Join(plugins, "launcherTemplate.gradle"),
		`defaultConfig {
manifestPlaceholders = [CHANNELSDK_ID:"real", CHANNELSDK_GAME_VERSION:"1"]
}`)
	writeXutengAndroidConfig(t, dir, filepath.Join("Assets", "Plugins", "Android"))
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Xuteng.cs"), `
RuiXueSdk.Initialize(cp, product, channel, urls, ok, error);
RuiXueSdk.InitThirdSdk(new Dictionary<string, object>(), ok, error);
RXLogin.Login(new LoginConfig { loginType = LoginMethod.Xuteng }, ok, error);
RXPay.Pay(new Dictionary<string, object> { ["hq_type"] = "xuteng" }, ok, error);
RuiXueSdk.SetThirdGameInfo(info);
RuiXueSdk.ExitApp(ok, cancel);`)

	first := unityXutengPreflight(dir)
	if !first.Satisfied || len(first.Modified) == 0 {
		t.Fatalf("expected satisfied Unity upgrade: %+v", first)
	}
	updated := readTestFile(t, manifest)
	for _, want := range []string{
		`"com.ruixue.unitysdk.base": "4.0.3"`,
		`"com.ruixue.unitysdk.login": "4.0.3"`,
		`"com.ruixue.unitysdk.share": "4.0.3"`,
	} {
		if !strings.Contains(updated, want) {
			t.Fatalf("manifest missing %q:\n%s", want, updated)
		}
	}
	second := unityXutengPreflight(dir)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent Unity preflight: %+v", second)
	}

	nonFixedDir := t.TempDir()
	nonFixedManifest := filepath.Join(nonFixedDir, "Packages", "manifest.json")
	writeTestFile(t, nonFixedManifest, `{"dependencies":{
"com.ruixue.unitysdk.base":"4.0.3",
"com.ruixue.unitysdk.login":"file:../login",
"com.ruixue.unitysdk.pay":"4.0.3"
}}`)
	before := readTestFile(t, nonFixedManifest)
	result := unityXutengPreflight(nonFixedDir)
	if result.Satisfied || !strings.Contains(strings.Join(result.Missing, "\n"), "非固定版本") {
		t.Fatalf("expected non-fixed version failure: %+v", result)
	}
	if readTestFile(t, nonFixedManifest) != before {
		t.Fatal("non-fixed UPM dependency must not be overwritten")
	}
}

func TestCocos2dxXutengPreflightGenericBridge(t *testing.T) {
	dir := t.TempDir()
	gradle := filepath.Join(dir, "proj.android", "app", "build.gradle")
	writeTestFile(t, gradle, `
android { defaultConfig {
minSdkVersion 23
manifestPlaceholders = [CHANNELSDK_ID:"real", CHANNELSDK_GAME_VERSION:"1"]
}}
implementation 'com.ruixue:rxsdk_xuteng:4.0.19'`)
	writeXutengAndroidConfig(t, dir, filepath.Join("proj.android", "app", "src", "main"))
	writeTestFile(t, filepath.Join(dir, "Classes", "Game.cpp"), `
bridge->init(base, callback);
bridge->initThirdSdk("{}", callback);
bridge->login(R"({"loginType":"xuteng"})", callback);
bridge->pay(R"({"payType":"xuteng"})", callback);
bridge->setGameInfo(info, callback);
bridge->logout(callback);
bridge->exitApp(callback);`)
	result := cocos2dxXutengPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected satisfied Cocos2dx preflight: %+v", result)
	}
}

func TestXutengChannelConfigWritesExclusiveDependencyAndRealConfig(t *testing.T) {
	dir := t.TempDir()
	writeUnityProjectScaffold(t, dir)
	cfg := filepath.Join(dir, "source", "brsdk.cfg")
	writeTestFile(t, cfg, "real-tool-generated-config")
	params := map[string]string{
		"xutengChannelSdkId": "CHANNEL_ID",
		"xutengGameVersion":  "GAME_VERSION",
		"brsdkCfgPath":       cfg,
	}
	first := callUnityChannelConfig(t, dir, "xuteng", "4.0.10", params)
	if !first.Satisfied {
		t.Fatalf("expected xuteng channel config satisfied: %+v", first)
	}
	main := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	if !strings.Contains(main, "com.ruixue:rxsdk_xuteng:4.0.19") {
		t.Fatalf("missing xuteng dependency:\n%s", main)
	}
	launcher := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "launcherTemplate.gradle"))
	for _, want := range []string{"CHANNELSDK_ID", "CHANNEL_ID", "CHANNELSDK_GAME_VERSION", "GAME_VERSION", "minSdkVersion 23"} {
		if !strings.Contains(launcher, want) {
			t.Fatalf("launcher missing %q:\n%s", want, launcher)
		}
	}
	copied := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "assets", "brsdk.cfg"))
	if copied != "real-tool-generated-config" {
		t.Fatalf("unexpected copied brsdk.cfg: %q", copied)
	}
	second := callUnityChannelConfig(t, dir, "xuteng", "4.0.10", params)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent channel config: %+v", second)
	}
}

func TestXutengSchemasHandlersAndTemplates(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "xuteng-test", Version: "1.0.0"}, nil)
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
		if !strings.Contains(string(schema), `"xuteng"`) {
			t.Fatalf("%s schema missing xuteng: %s", name, schema)
		}
		output, callErr := session.CallTool(ctx, &mcp.CallToolParams{
			Name: name, Arguments: map[string]any{"feature": "xuteng"},
		})
		if callErr != nil {
			t.Fatalf("call %s: %v", name, callErr)
		}
		encoded, _ := json.Marshal(output.StructuredContent)
		if !strings.Contains(string(encoded), `"preflight"`) {
			t.Fatalf("%s handler missing preflight: %s", name, encoded)
		}
		if name == "unity" {
			for _, want := range []string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay", `"minimumVersion":"4.0.3"`} {
				if !strings.Contains(string(encoded), want) {
					t.Fatalf("Unity output missing %q: %s", want, encoded)
				}
			}
			if strings.Contains(string(encoded), "com.ruixue.unitysdk."+"xuteng") {
				t.Fatalf("must not recommend dedicated xuteng UPM: %s", encoded)
			}
		}
	}

	for _, platform := range []string{"ios", "android", "unity", "cocos2dx"} {
		content, err := os.ReadFile(filepath.Join("templates", platform, "xuteng.tpl"))
		if err != nil || !strings.Contains(string(content), "xuteng") {
			t.Fatalf("%s template invalid: err=%v content=%s", platform, err, content)
		}
		if platform == "unity" && strings.Contains(string(content), "com.ruixue.unitysdk."+"xuteng") {
			t.Fatalf("Unity template must not recommend dedicated xuteng UPM: %s", content)
		}
	}
}

func writeXutengAndroidConfig(t *testing.T, dir, mainRel string) {
	t.Helper()
	main := filepath.Join(dir, mainRel)
	writeTestFile(t, filepath.Join(main, "AndroidManifest.xml"),
		`<manifest><application android:name="com.ruixue.sdk.XTApplication"/></manifest>`)
	writeTestFile(t, filepath.Join(main, "assets", "brsdk.cfg"), "tool-generated")
}
