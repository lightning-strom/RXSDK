package rxsdk

import (
	"context"
	"strings"
	"testing"
)

func TestUnityTJUnifiedFlowByVersion(t *testing.T) {
	result := UnityTJUnifiedOutput("payment", "ruixue_tj_unity", "source", "")
	if result["sdkApiVersion"] != "tj" {
		t.Fatalf("expected tj route, got %+v", result["sdkApiVersion"])
	}
	spec, ok := result["spec"].(string)
	if !ok {
		t.Fatalf("expected spec string, got %+v", result["spec"])
	}
	for _, want := range []string{"RuiXueSdk.Pay", "PayArgs", "goods_tag", "trade_no", "custom_ext"} {
		if !strings.Contains(spec, want) {
			t.Fatalf("expected Unity TJ payment spec to contain %q, got:\n%s", want, spec)
		}
	}
}

func TestHarmonyUnifiedFlow(t *testing.T) {
	_, dep, err := HarmonyUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
	}{
		Feature: "dependency",
	})
	if err != nil {
		t.Fatalf("unexpected dependency error: %v", err)
	}
	if dep["version"] != HARMONY_DEFAULT_VERSION {
		t.Fatalf("expected default version %s, got %+v", HARMONY_DEFAULT_VERSION, dep["version"])
	}
	depCode, ok := dep["code"].(string)
	if !ok {
		t.Fatalf("expected dependency code string, got %+v", dep["code"])
	}
	if !strings.Contains(depCode, `"hmssdk": "file:../hmssdk"`) {
		t.Fatalf("expected local hmssdk dependency, got:\n%s", depCode)
	}

	_, initOutput, err := HarmonyUnifiedHandler(context.Background(), nil, struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
	}{
		Feature: "init",
	})
	if err != nil {
		t.Fatalf("unexpected init error: %v", err)
	}
	code, ok := initOutput["code"].(string)
	if !ok {
		t.Fatalf("expected init code string, got %+v", initOutput["code"])
	}
	for _, want := range []string{"RXApi.getInstance().init", "this.getUIContext()", "RXConfig"} {
		if !strings.Contains(code, want) {
			t.Fatalf("expected Harmony init code to contain %q, got:\n%s", want, code)
		}
	}
}
