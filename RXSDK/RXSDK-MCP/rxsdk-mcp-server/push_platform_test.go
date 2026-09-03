package rxsdk

import (
	"context"
	"encoding/json"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func TestNormalizeAndroidPushPlatformsAndArtifacts(t *testing.T) {
	platforms, validationError := normalizeAndroidPushPlatforms([]string{"FCM", "mi", "huawei", "fcm"})
	if validationError != "" {
		t.Fatalf("unexpected validation error: %s", validationError)
	}
	if strings.Join(platforms, ",") != "firebase,xiaomi,huawei" {
		t.Fatalf("unexpected normalized platforms: %v", platforms)
	}
	artifacts := androidPushArtifacts(platforms)
	want := "rxsdk_firebase,rxsdk_push_mi,rxsdk_push_huawei"
	if strings.Join(artifacts, ",") != want {
		t.Fatalf("unexpected artifacts: %v", artifacts)
	}

	if _, validationError := normalizeAndroidPushPlatforms([]string{"unknown"}); validationError == "" {
		t.Fatal("expected unsupported platform validation error")
	}
}

func TestPushFeaturesRequireExplicitPlatformSelection(t *testing.T) {
	session := newPushTestSession(t)
	for _, tool := range []string{"android", "unity"} {
		t.Run(tool, func(t *testing.T) {
			output, err := session.CallTool(context.Background(), &mcp.CallToolParams{
				Name:      tool,
				Arguments: map[string]any{"feature": "push"},
			})
			if err != nil {
				t.Fatalf("call %s push: %v", tool, err)
			}
			encoded, _ := json.Marshal(output.StructuredContent)
			text := string(encoded)
			for _, want := range []string{"selectionRequired", "pushPlatforms", "firebase", "huawei", "xiaomi"} {
				if !strings.Contains(text, want) {
					t.Fatalf("%s missing %q in selection response: %s", tool, want, text)
				}
			}
		})
	}
}

func TestAndroidPushFeatureGeneratesSelectedDependencies(t *testing.T) {
	session := newPushTestSession(t)
	output, err := session.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "android",
		Arguments: map[string]any{
			"feature":       "push",
			"version":       "4.0.13",
			"pushPlatforms": []string{"firebase", "huawei"},
		},
	})
	if err != nil {
		t.Fatalf("call android push: %v", err)
	}
	encoded, _ := json.Marshal(output.StructuredContent)
	text := string(encoded)
	for _, want := range []string{
		"com.ruixue:rxsdk_firebase:4.0.13",
		"com.ruixue:rxsdk_push_huawei:4.0.13",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("android push output missing %q: %s", want, text)
		}
	}
	if strings.Contains(text, "com.ruixue:rxsdk_push_base:4.0.13") {
		t.Fatalf("android push output should rely on transitive rxsdk_push_base dependency: %s", text)
	}
}

func TestUnityPushFeatureWritesSelectedNativeDependencies(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "ProjectSettings", "ProjectSettings.asset"), `
PlayerSettings:
  applicationIdentifier:
    Android: com.example.push
  AndroidMinSdkVersion: 21
  AndroidTargetSdkVersion: 0
  useCustomMainGradleTemplate: 0
  useCustomGradleSettingsTemplate: 0
  useCustomGradlePropertiesTemplate: 0
  useCustomMainManifest: 0
  useCustomProguardFile: 0
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "UnityPlayerActivity.java"), `
package com.example.push;
import android.os.Bundle;
public class UnityPlayerActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
`)

	session := newPushTestSession(t)
	output, err := session.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "unity",
		Arguments: map[string]any{
			"feature":        "push",
			"workspacePath":  dir,
			"channel":        "rxsdk_overseas",
			"androidVersion": "4.0.13",
			"version":        "4.0.13",
			"pushPlatforms":  []string{"firebase", "xiaomi"},
		},
	})
	if err != nil {
		t.Fatalf("call unity push: %v", err)
	}
	encoded, _ := json.Marshal(output.StructuredContent)
	text := string(encoded)
	for _, want := range []string{"com.ruixue.unitysdk.push", "com.ruixue.unitysdk.firebase", "firebase", "xiaomi"} {
		if !strings.Contains(text, want) {
			t.Fatalf("unity push output missing %q: %s", want, text)
		}
	}

	mainTemplate := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "mainTemplate.gradle"))
	for _, want := range []string{
		`implementation "com.ruixue:rxsdk_firebase:${rxVersion}"`,
		`implementation "com.ruixue:rxsdk_push_mi:${rxVersion}"`,
	} {
		if !strings.Contains(mainTemplate, want) {
			t.Fatalf("mainTemplate.gradle missing %q:\n%s", want, mainTemplate)
		}
	}
	if strings.Contains(mainTemplate, `com.ruixue:rxsdk_push_base:`) {
		t.Fatalf("mainTemplate.gradle should rely on the selected platform's transitive rxsdk_push_base dependency:\n%s", mainTemplate)
	}
}

func TestUnityIOSPushFeatureReturnsNotificationServiceGuideWithoutAndroidSelection(t *testing.T) {
	session := newPushTestSession(t)
	output, err := session.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "unity",
		Arguments: map[string]any{
			"feature":  "push",
			"platform": "ios",
		},
	})
	if err != nil {
		t.Fatalf("call unity iOS push: %v", err)
	}
	encoded, _ := json.Marshal(output.StructuredContent)
	text := string(encoded)
	for _, want := range []string{
		"NotificationService",
		".NotificationService",
		"pushReceivedWithUserInfo",
		"aps.mutable-content",
		`"checked":false`,
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("unity iOS push output missing %q: %s", want, text)
		}
	}
	if strings.Contains(text, `"selectionRequired":true`) {
		t.Fatalf("iOS push must not require Android pushPlatforms: %s", text)
	}
}

func TestUnityIOSPushPreflightUpgradesRegistryPackagesSafely(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "4.0.7",
    "com.ruixue.unitysdk.push": "4.0.7",
    "com.ruixue.unitysdk.login": "file:../local-login",
    "com.example.other": "1.0.0"
  }
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
class Init {
    void Start() {
        RuiXueSdk.Initialize(null, null, null);
    }
}
`)

	result := unityPushIOSPreflight(dir)
	if !result.Satisfied {
		t.Fatalf("expected iOS push preflight satisfied, got: %+v", result)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	for _, want := range []string{
		`"com.ruixue.unitysdk.base": "4.0.8"`,
		`"com.ruixue.unitysdk.push": "4.0.8"`,
		`"com.ruixue.unitysdk.login": "file:../local-login"`,
	} {
		if !strings.Contains(manifest, want) {
			t.Fatalf("upgraded manifest missing %q:\n%s", want, manifest)
		}
	}
	if len(result.Warnings) == 0 {
		t.Fatalf("expected warning for preserved non-registry dependency: %+v", result)
	}

	second := unityPushIOSPreflight(dir)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent preflight, got: %+v", second)
	}
}

func TestUnityIOSPushPreflightRejectsUnsafePushDependency(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.push": "file:../local-push"
  }
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Scripts", "Init.cs"), `
class Init {
    void Start() {
        RuiXueSdk.Initialize(null, null, null);
    }
}
`)

	result := unityPushIOSPreflight(dir)
	if result.Satisfied || len(result.Missing) == 0 {
		t.Fatalf("expected unsafe push dependency to block preflight: %+v", result)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	if !strings.Contains(manifest, `"com.ruixue.unitysdk.push": "file:../local-push"`) {
		t.Fatalf("non-registry push dependency was unexpectedly replaced:\n%s", manifest)
	}
}

func TestUnityPushDependencyUsesIOSMinimumVersion(t *testing.T) {
	if got := unityFeatureDependencyVersion("push", "4.0.7"); got != "4.0.8" {
		t.Fatalf("expected push dependency upgraded to 4.0.8, got %s", got)
	}
	if got := unityFeatureDependencyVersion("push", "4.0.9"); got != "4.0.9" {
		t.Fatalf("expected newer push dependency preserved, got %s", got)
	}
}

func newPushTestSession(t *testing.T) *mcp.ClientSession {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "push-platform-test", Version: "1.0.0"}, nil)
	session, err := client.Connect(ctx, clientTransport, nil)
	if err != nil {
		cancel()
		t.Fatalf("connect MCP client: %v", err)
	}
	t.Cleanup(func() {
		_ = session.Close()
		cancel()
	})
	return session
}
