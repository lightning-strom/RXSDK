package rxsdk

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func callRuixuego(feature, workspace, version string) (map[string]any, error) {
	_, out, err := RuixuegoUnifiedHandler(context.Background(), &mcp.CallToolRequest{}, struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
	}{Feature: feature, WorkspacePath: workspace, Version: version})
	return out, err
}

func TestRuixuegoAllTemplatesExecute(t *testing.T) {
	list := []struct {
		name string
		fn   func() (string, error)
	}{
		{"init", func() (string, error) { return executeRuixuegoTpl(ruixuegoInitTpl, nil) }},
		{"dependency", func() (string, error) {
			return executeRuixuegoTpl(ruixuegoDependencyTpl, RuixuegoDependencyData{Version: "v0.1.57"})
		}},
		{"agent", func() (string, error) { return executeRuixuegoTpl(ruixuegoAgentTpl, nil) }},
		{"openid", func() (string, error) { return executeRuixuegoTpl(ruixuegoOpenIDTpl, nil) }},
		{"passport", func() (string, error) { return executeRuixuegoTpl(ruixuegoPassportTpl, nil) }},
		{"social", func() (string, error) { return executeRuixuegoTpl(ruixuegoSocialTpl, nil) }},
		{"lbs", func() (string, error) { return executeRuixuegoTpl(ruixuegoLBSTpl, nil) }},
		{"rank", func() (string, error) { return executeRuixuegoTpl(ruixuegoRankTpl, nil) }},
		{"bigdata", func() (string, error) { return executeRuixuegoTpl(ruixuegoBigdataTpl, nil) }},
		{"ims", func() (string, error) { return executeRuixuegoTpl(ruixuegoIMSTpl, nil) }},
		{"pusher", func() (string, error) { return executeRuixuegoTpl(ruixuegoPusherTpl, nil) }},
		{"risk", func() (string, error) { return executeRuixuegoTpl(ruixuegoRiskTpl, nil) }},
		{"pay", func() (string, error) { return executeRuixuegoTpl(ruixuegoPayTpl, nil) }},
		{"operation", func() (string, error) { return executeRuixuegoTpl(ruixuegoOperationTpl, nil) }},
		{"cp_role", func() (string, error) { return executeRuixuegoTpl(ruixuegoCPRoleTpl, nil) }},
		{"attribution", func() (string, error) { return executeRuixuegoTpl(ruixuegoAttributionTpl, nil) }},
		{"siyu", func() (string, error) { return executeRuixuegoTpl(ruixuegoSiyuTpl, nil) }},
	}

	for _, item := range list {
		spec, err := item.fn()
		if err != nil {
			t.Fatalf("%s execute: %v", item.name, err)
		}
		if !strings.Contains(spec, "placeholder") {
			t.Fatalf("%s: missing placeholder_note section", item.name)
		}
		if item.name == "dependency" {
			if !strings.Contains(spec, "v0.1.57") {
				t.Fatalf("dependency: version not injected: %s", spec)
			}
			continue
		}
		if !strings.Contains(spec, "@test") {
			t.Fatalf("%s: missing @test placeholder", item.name)
		}
	}
}

func TestRuixuegoUnifiedHandler_Init(t *testing.T) {
	out, err := callRuixuego("init", "", "")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] != nil {
		t.Fatalf("unexpected error: %v", out["error"])
	}
	spec, _ := out["spec"].(string)
	if !strings.Contains(spec, "ruixuego.Init") {
		t.Fatalf("init spec missing Init")
	}
	if out["placeholderNote"] == nil {
		t.Fatal("missing placeholderNote")
	}
}

func TestRuixuegoDependency_VersionInjected(t *testing.T) {
	out, err := callRuixuego("dependency", "", "v0.1.57")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] != nil {
		t.Fatalf("unexpected error: %v", out["error"])
	}
	spec, _ := out["spec"].(string)
	if !strings.Contains(spec, "github.com/ruixueyun/ruixuego@v0.1.57") {
		t.Fatalf("version not in spec: %s", spec)
	}
	usage, _ := out["usage"].(string)
	if !strings.Contains(usage, "v0.1.57") {
		t.Fatalf("version not in usage: %s", usage)
	}
}

func TestRuixuegoDependency_DefaultLatest(t *testing.T) {
	out, err := callRuixuego("dependency", "", "")
	if err != nil {
		t.Fatal(err)
	}
	spec, _ := out["spec"].(string)
	if !strings.Contains(spec, "@latest") {
		t.Fatalf("expected latest: %s", spec)
	}
}

func TestRuixuegoUnknownFeature_BeforePreflight(t *testing.T) {
	dir := t.TempDir()
	out, err := callRuixuego("socail", dir, "")
	if err != nil {
		t.Fatal(err)
	}
	errMsg, _ := out["error"].(string)
	if !strings.Contains(errMsg, "未知的功能模块") {
		t.Fatalf("expected unknown feature first, got: %v", out["error"])
	}
	if out["instructions"] != nil {
		t.Fatalf("should not return preflight instructions for unknown feature: %v", out["instructions"])
	}
}

func TestRuixuegoSocial_ReturnsInitCheck(t *testing.T) {
	out, err := callRuixuego("social", "", "")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] != nil {
		t.Fatalf("unexpected: %v", out["error"])
	}
	initCheck, _ := out["initCheck"].(string)
	if initCheck == "" || !strings.Contains(initCheck, "ruixuego") {
		t.Fatalf("missing initCheck: %v", out["initCheck"])
	}
	spec, _ := out["spec"].(string)
	for _, want := range []string{"AddRelationV2", "RelationTypes", "双向"} {
		if !strings.Contains(spec, want) {
			t.Fatalf("social spec missing %q", want)
		}
	}
}

func TestRuixuegoOpenID_WithKeySignatures(t *testing.T) {
	out, err := callRuixuego("openid", "", "")
	if err != nil {
		t.Fatal(err)
	}
	spec, _ := out["spec"].(string)
	wants := []string{
		"func EncryptOpenIDDataWithKey(aesData *AESData, traceID, productID, channelID, method, openID, ext string)",
		"func DecryptOpenIDDataWithKey(aesData *AESData, openIDCipherText string)",
		"func GenerateVirtualLoginDataWithKey(aesData *AESData, traceID, productID, channelID, userID string)",
		"NewAESData",
	}
	for _, want := range wants {
		if !strings.Contains(spec, want) {
			t.Fatalf("openid missing accurate signature %q", want)
		}
	}
	// 旧错误签名不得再出现
	bads := []string{
		"DecryptOpenIDDataWithKey(productID, channelID, openIDCipherText string, key []byte)",
		"EncryptOpenIDDataWithKey(traceID, productID, channelID, method, openID, ext string, key []byte)",
		"GenerateVirtualLoginDataWithKey(traceID, productID, channelID, userID string, key []byte)",
	}
	for _, bad := range bads {
		if strings.Contains(spec, bad) {
			t.Fatalf("openid still contains incorrect signature %q", bad)
		}
	}
}


func TestRuixuegoPay_APIName(t *testing.T) {
	out, err := callRuixuego("pay", "", "")
	if err != nil {
		t.Fatal(err)
	}
	spec, _ := out["spec"].(string)
	if !strings.Contains(spec, "TradeOrderStatusByNoV2") {
		t.Fatal("pay missing TradeOrderStatusByNoV2")
	}
}

func TestRuixuegoUnifiedHandler_UnknownFeature(t *testing.T) {
	out, err := callRuixuego("nope", "", "")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] == nil {
		t.Fatal("expected error for unknown feature")
	}
}

func TestRuixuegoPreflight_MissingGoMod(t *testing.T) {
	dir := t.TempDir()
	missing := checkRuixuegoBaseConfig(dir)
	if len(missing) == 0 {
		t.Fatal("expected missing go.mod")
	}
}

func TestRuixuegoPreflight_WithGoModAndInit(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "go.mod"), []byte("module demo\n\nrequire github.com/ruixueyun/ruixuego v0.1.57\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "main.go"), []byte("package main\nimport \"github.com/ruixueyun/ruixuego\"\nfunc main() { _ = ruixuego.Init(nil) }\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	missing := checkRuixuegoBaseConfig(dir)
	if len(missing) != 0 {
		t.Fatalf("expected no missing, got %v", missing)
	}
}

func TestRuixuegoUnifiedHandler_PreflightBlocksSocial(t *testing.T) {
	dir := t.TempDir()
	out, err := callRuixuego("social", dir, "")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] == nil {
		t.Fatal("expected preflight error")
	}
	instr, _ := out["instructions"].(string)
	if !strings.Contains(instr, "基础配置未完成") {
		t.Fatalf("unexpected instructions: %s", instr)
	}
}

func TestRuixuegoBaseFeaturesSkipPreflight(t *testing.T) {
	dir := t.TempDir()
	out, err := callRuixuego("dependency", dir, "v0.1.57")
	if err != nil {
		t.Fatal(err)
	}
	if out["error"] != nil {
		t.Fatalf("dependency should skip preflight: %v", out["error"])
	}
}

func TestRuixuegoAllFeaturesRoute(t *testing.T) {
	features := []string{
		"init", "dependency", "agent", "openid", "passport",
		"social", "lbs", "rank", "bigdata", "ims", "pusher",
		"risk", "pay", "operation", "cp_role", "attribution", "siyu",
	}
	for _, f := range features {
		out, err := callRuixuego(f, "", "")
		if err != nil {
			t.Fatalf("%s: %v", f, err)
		}
		if out["error"] != nil {
			t.Fatalf("%s error: %v", f, out["error"])
		}
		if out["spec"] == nil || out["spec"] == "" {
			t.Fatalf("%s: empty spec", f)
		}
	}
}

func TestRuixuegoSiyu_BindStatusDocs(t *testing.T) {
	out, err := callRuixuego("siyu", "", "")
	if err != nil {
		t.Fatal(err)
	}
	spec, _ := out["spec"].(string)
	if !strings.Contains(spec, "BindStatus") || !strings.Contains(spec, "未建联") {
		t.Fatalf("siyu missing BindStatus docs")
	}
}

func TestRuixuegoBusinessFeatures_DetailedSchema(t *testing.T) {
	// dependency / agent 为接入指南；其余业务与 init/openid 等应含详细结构标记
	features := []string{
		"init", "openid", "passport",
		"social", "lbs", "rank", "bigdata", "ims", "pusher",
		"risk", "pay", "operation", "cp_role", "attribution", "siyu",
	}
	required := []string{"api_details:", "when_to_use:", "request_fields", "code_go:"}
	for _, f := range features {
		out, err := callRuixuego(f, "", "")
		if err != nil {
			t.Fatalf("%s: %v", f, err)
		}
		spec, _ := out["spec"].(string)
		for _, want := range required {
			if !strings.Contains(spec, want) {
				t.Fatalf("%s missing detailed schema marker %q", f, want)
			}
		}
	}
}

func TestRuixuegoV2MethodCoverage(t *testing.T) {
	cases := map[string][]string{
		"social": {
			"SetCustomV2", "AddRelationV2", "DelRelationV2", "UpdateRelationRemarksV2",
			"RelationListV2", "HasRelationV2", "AddFriendV2", "DelFriendV2",
			"UpdateFriendRemarksV2", "FriendListV2", "GetRelationUserV2", "IsFriendV2",
		},
		"rank": {
			"CreateRankV2", "CloseRankV2", "RankAddScoreV2", "RankSetScoreV2",
			"DeleteRankUserV2", "QueryUserRankV2", "GetRankListV2",
			"GetFriendRankListV2", "GetRankDetailV2", "GetAllRankIDListV2",
		},
		"ims": {
			"IMSLogin", "IMSSendMessage", "IMSGetHistory",
			"IMSCreateConversation", "IMSUpdateConversation", "IMSDeleteConversation",
			"IMSGetConversation", "IMSJoinConversation", "IMSLeaveConversation",
			"IMSUpdateConversationUserData", "IMSConversationUserList",
			"IMSChannelUsersCountV2", "IMSParseMsgID", "IMSGetCustomSingleConversationID",
		},
		"lbs": {"LBSUpdateV2", "LBSDeleteV2", "LBSRadiusV2"},
		"pay": {"TradeOrderStatusByNoV2", "api_details:", "PlatformStatus"},
		"openid": {
			"EncryptOpenIDData", "DecryptOpenIDDataWithKey",
			"GenerateVirtualLoginDataWithKey", "GetSign",
		},
		"bigdata": {"SyncTrackV2", "SetUpdateEvent", "SetFirstEvent", "Tracks"},
		"passport": {"UpdateCPuserIDV2"},
		"pusher": {"PusherPushV2"},
		"risk": {"RiskContentTextScan", "RiskContentImageScanV2", "RealAuthV2"},
		"operation": {"ExtensionExchange", "ExtensionGameDisplayV2"},
		"cp_role": {"CPRoleAdd", "CPRoleUpdate", "CPRoleDel", "CPRoleListByOpenID"},
		"attribution": {"ReportCustomActionV2"},
		"siyu": {"CheckUserInSiyuV2", "BindStatus"},
	}
	for feature, wants := range cases {
		out, err := callRuixuego(feature, "", "")
		if err != nil {
			t.Fatalf("%s: %v", feature, err)
		}
		spec, _ := out["spec"].(string)
		for _, want := range wants {
			if !strings.Contains(spec, want) {
				t.Fatalf("%s missing %q", feature, want)
			}
		}
	}
}
