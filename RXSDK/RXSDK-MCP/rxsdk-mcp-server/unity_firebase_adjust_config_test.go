package rxsdk

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestUnityFirebaseConfigPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := UnityFirebaseConfigHandler(context.Background(), nil, struct {
		WorkspacePath              string `json:"workspacePath"`
		GoogleServicesJSONPath     string `json:"googleServicesJsonPath"`
		GoogleServiceInfoPlistPath string `json:"googleServiceInfoPlistPath"`
	}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if output.Preflight.Checked || output.Preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", output.Preflight)
	}
	if !strings.Contains(strings.Join(output.Preflight.NextSteps, "\n"), "unity feature=firebase_config") {
		t.Fatalf("expected firebase_config retry hint, got: %+v", output.Preflight.NextSteps)
	}
}

func TestUnityFirebaseConfigPreflightSatisfied(t *testing.T) {
	dir := t.TempDir()
	src := filepath.Join(dir, "src", "google-services.json")
	writeTestFile(t, src, `{"project_info":{}}`)
	writeTestFile(t, filepath.Join(dir, unityFirebaseSettingAsset), `MonoBehaviour:
  ConfigReady: 0
`)
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.29",
    "com.ruixue.unitysdk.firebase": "1.6.29"
  }
}`)

	_, output, err := UnityFirebaseConfigHandler(context.Background(), nil, struct {
		WorkspacePath              string `json:"workspacePath"`
		GoogleServicesJSONPath     string `json:"googleServicesJsonPath"`
		GoogleServiceInfoPlistPath string `json:"googleServiceInfoPlistPath"`
	}{
		WorkspacePath:          dir,
		GoogleServicesJSONPath: src,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !output.Preflight.Satisfied {
		t.Fatalf("expected satisfied firebase preflight, got: %+v", output.Preflight)
	}
	copied := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "google-services.json"))
	if !strings.Contains(copied, "project_info") {
		t.Fatalf("expected google-services.json copied, got:\n%s", copied)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	if !strings.Contains(manifest, `"com.ruixue.unitysdk.firebase": "1.6.30"`) {
		t.Fatalf("expected firebase package upgraded to 1.6.30, got:\n%s", manifest)
	}
	if !strings.Contains(manifest, `"com.ruixue.unitysdk.base": "1.6.30"`) {
		t.Fatalf("expected below-version ruixue package force-upgraded to 1.6.30, got:\n%s", manifest)
	}
}

func TestUnityAdjustConfigPreflightRequiresWorkspace(t *testing.T) {
	_, output, err := UnityAdjustConfigHandler(context.Background(), nil, struct {
		WorkspacePath     string `json:"workspacePath"`
		AdjustAppToken    string `json:"adjustAppToken"`
		AdjustEnvironment string `json:"adjustEnvironment"`
	}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if output.Preflight.Checked || output.Preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", output.Preflight)
	}
	if !strings.Contains(strings.Join(output.Preflight.NextSteps, "\n"), "unity feature=adjust_config") {
		t.Fatalf("expected adjust_config retry hint, got: %+v", output.Preflight.NextSteps)
	}
}

func TestUnityAdjustConfigPreflightSatisfied(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, unityAdjustSettingAsset), `MonoBehaviour:
  AppToken: 
  Environment: production
`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
    </application>
</manifest>
`)
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.29",
    "com.ruixue.unitysdk.adjust": "1.6.29"
  }
}`)

	_, output, err := UnityAdjustConfigHandler(context.Background(), nil, struct {
		WorkspacePath     string `json:"workspacePath"`
		AdjustAppToken    string `json:"adjustAppToken"`
		AdjustEnvironment string `json:"adjustEnvironment"`
	}{
		WorkspacePath:     dir,
		AdjustAppToken:    "@test",
		AdjustEnvironment: "sandbox",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !output.Preflight.Satisfied {
		t.Fatalf("expected satisfied adjust preflight, got: %+v", output.Preflight)
	}
	manifest := readTestFile(t, filepath.Join(dir, "Assets", "Plugins", "Android", "AndroidManifest.xml"))
	if !strings.Contains(manifest, "android.permission.INTERNET") {
		t.Fatalf("expected INTERNET permission added, got:\n%s", manifest)
	}
	asset := readTestFile(t, filepath.Join(dir, unityAdjustSettingAsset))
	if !strings.Contains(asset, "AppToken: @test") {
		t.Fatalf("expected AppToken written, got:\n%s", asset)
	}
	pkgManifest := readTestFile(t, filepath.Join(dir, "Packages", "manifest.json"))
	if !strings.Contains(pkgManifest, `"com.ruixue.unitysdk.adjust": "1.6.30"`) {
		t.Fatalf("expected adjust package upgraded to 1.6.30, got:\n%s", pkgManifest)
	}
	if !strings.Contains(pkgManifest, `"com.ruixue.unitysdk.base": "1.6.30"`) {
		t.Fatalf("expected below-version ruixue package force-upgraded to 1.6.30, got:\n%s", pkgManifest)
	}
}

func TestUnityAndroidComponentsIncludeFirebaseAdjust(t *testing.T) {
	for _, name := range []string{"rxsdk_firebase", "rxsdk_adjust"} {
		if !unityAndroidComponentSet[name] {
			t.Fatalf("expected overseas component %q registered in unityAndroidComponentNames", name)
		}
	}
}
