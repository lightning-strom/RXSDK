package rxsdk

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestUnityAsmdefPreflightAddsReferencedRuiXueAssembly(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	asmdefPath := filepath.Join(dir, "Assets", "Game", "Game.Runtime.asmdef")
	writeTestFile(t, asmdefPath, `{
  "name": "Game.Runtime",
  "references": ["RuiXue.Base"],
  "allowUnsafeCode": false
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Game", "CustomerService.cs"), `
using RuiXue.Help;

public class CustomerService {
    public void Open() {
        RXHelp.ChatServiceUI(null, null, null);
    }
}`)

	preflight := unityAsmdefPreflight(dir)
	if !preflight.Checked || !preflight.Satisfied {
		t.Fatalf("expected satisfied asmdef preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.Modified, "\n"), "RuiXue.Help") {
		t.Fatalf("expected Help reference modification, got: %+v", preflight.Modified)
	}
	asmdef := readTestFile(t, asmdefPath)
	if strings.Count(asmdef, `"RuiXue.Help"`) != 1 {
		t.Fatalf("expected exactly one Help reference, got:\n%s", asmdef)
	}
	if !strings.Contains(asmdef, `"allowUnsafeCode": false`) {
		t.Fatalf("expected unrelated asmdef fields preserved, got:\n%s", asmdef)
	}

	second := unityAsmdefPreflight(dir)
	if !second.Satisfied || len(second.Modified) != 0 {
		t.Fatalf("expected idempotent asmdef preflight, got: %+v", second)
	}
}

func TestUnityAsmdefPreflightRecognizesExistingGuidReference(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	asmdefPath := filepath.Join(dir, "Assets", "Game", "Game.Runtime.asmdef")
	writeTestFile(t, asmdefPath, `{
  "name": "Game.Runtime",
  "references": ["GUID:help-guid"]
}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Game", "CustomerService.cs"), `
using RuiXue.Help;
public class CustomerService {}
`)

	preflight := unityAsmdefPreflight(dir)
	if !preflight.Satisfied || len(preflight.Modified) != 0 {
		t.Fatalf("expected GUID reference to be accepted without changes, got: %+v", preflight)
	}
	asmdef := readTestFile(t, asmdefPath)
	if strings.Contains(asmdef, `"RuiXue.Help"`) {
		t.Fatalf("expected no duplicate name reference when GUID exists, got:\n%s", asmdef)
	}
}

func TestUnityAsmdefPreflightUsesClosestNestedAssembly(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	parentPath := filepath.Join(dir, "Assets", "Game", "Game.Runtime.asmdef")
	childPath := filepath.Join(dir, "Assets", "Game", "Feature", "Feature.Runtime.asmdef")
	writeTestFile(t, parentPath, `{"name":"Game.Runtime","references":[]}`)
	writeTestFile(t, childPath, `{"name":"Feature.Runtime","references":[]}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Game", "Feature", "HelpView.cs"), `
using RuiXue.Help;
public class HelpView {}
`)

	preflight := unityAsmdefPreflight(dir)
	if !preflight.Satisfied {
		t.Fatalf("expected satisfied nested asmdef preflight, got: %+v", preflight)
	}
	if strings.Contains(readTestFile(t, parentPath), "RuiXue.Help") {
		t.Fatalf("parent asmdef must not receive a nested assembly's reference")
	}
	if !strings.Contains(readTestFile(t, childPath), "RuiXue.Help") {
		t.Fatalf("closest nested asmdef should receive Help reference")
	}
}

func TestUnityAsmdefPreflightDoesNotRequireAsmdefForAssemblyCSharp(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	writeTestFile(t, filepath.Join(dir, "Assets", "CustomerService.cs"), `
using RuiXue.Help;
public class CustomerService {}
`)

	preflight := unityAsmdefPreflight(dir)
	if !preflight.Satisfied || len(preflight.Modified) != 0 {
		t.Fatalf("Assembly-CSharp should not require an explicit asmdef reference, got: %+v", preflight)
	}
}

func TestUnityAsmdefPreflightDoesNotCorruptInvalidAsmdef(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	asmdefPath := filepath.Join(dir, "Assets", "Game", "Game.Runtime.asmdef")
	original := `{"name":"Game.Runtime","references":"invalid"}`
	writeTestFile(t, asmdefPath, original)

	preflight := unityAsmdefPreflight(dir)
	if preflight.Satisfied || !strings.Contains(strings.Join(preflight.Missing, "\n"), "references 不是字符串数组") {
		t.Fatalf("expected invalid references to fail preflight, got: %+v", preflight)
	}
	if got := readTestFile(t, asmdefPath); got != original {
		t.Fatalf("invalid asmdef must remain unchanged, got: %s", got)
	}
}

func TestUnityUnifiedHandlerRunsAsmdefPreflight(t *testing.T) {
	dir := createUnityAsmdefTestProject(t)
	asmdefPath := filepath.Join(dir, "Assets", "Game", "Game.Runtime.asmdef")
	writeTestFile(t, asmdefPath, `{"name":"Game.Runtime","references":[]}`)
	writeTestFile(t, filepath.Join(dir, "Assets", "Game", "CustomerService.cs"), `
using RuiXue.Help;
public class CustomerService {}
`)

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
		Feature:       "login",
		WorkspacePath: dir,
	})
	if err != nil {
		t.Fatalf("unexpected handler error: %v", err)
	}
	preflight, ok := output["preflight"].(PassportPreflightResult)
	if !ok || !preflight.Satisfied {
		t.Fatalf("expected handler asmdef preflight, got: %+v", output["preflight"])
	}
	if !strings.Contains(readTestFile(t, asmdefPath), `"RuiXue.Help"`) {
		t.Fatalf("expected unified handler to update business asmdef")
	}
}

func createUnityAsmdefTestProject(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Packages", "manifest.json"), `{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.39",
    "com.ruixue.unitysdk.helpcenter": "1.6.39"
  }
}`)
	writeTestFile(t, filepath.Join(dir, "Packages", "com.ruixue.unitysdk.base", "Runtime", "RuiXue.Base.asmdef"), `{
  "name": "RuiXue.Base",
  "references": []
}`)
	writeTestFile(t, filepath.Join(dir, "Packages", "com.ruixue.unitysdk.base", "Runtime", "RuiXue.Base.asmdef.meta"), "guid: base-guid\n")
	writeTestFile(t, filepath.Join(dir, "Packages", "com.ruixue.unitysdk.helpcenter", "Runtime", "RuiXue.Help.asmdef"), `{
  "name": "RuiXue.Help",
  "references": ["GUID:base-guid"]
}`)
	writeTestFile(t, filepath.Join(dir, "Packages", "com.ruixue.unitysdk.helpcenter", "Runtime", "RuiXue.Help.asmdef.meta"), "guid: help-guid\n")
	writeTestFile(t, filepath.Join(dir, "Assets", ".keep"), "")
	return dir
}
