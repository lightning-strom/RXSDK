package rxsdk

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const ruixuegoModulePath = "github.com/ruixueyun/ruixuego"

const ruixuegoPlaceholderHint = `

【占位符约定】返回的示例代码中，"@test" 表示必须替换为真实业务参数（APIDomain、CPKey、ProductID、ChannelID、OpenID 等）。
数字类型字段（如 CPID）在模板中会用明显假值并附旁注「必须替换」。落地到工程前禁止原样保留 @test / 示例数字。
`

// RuixuegoSpecResult 统一返回结构
type RuixuegoSpecResult struct {
	Spec      string `json:"spec"`
	Usage     string `json:"usage"`
	InitCheck string `json:"initCheck,omitempty"`
	Code      string `json:"code,omitempty"`
}

var ruixuegoBaseFeatures = map[string]bool{
	"init":       true,
	"dependency": true,
	"agent":      true,
}

var ruixuegoFeatureUsages = map[string]string{
	"init":        "初始化瑞雪 Go SDK：启动配置、获取客户端、退出关闭；埋点场景需配置大数据并在退出前关闭",
	"dependency":  "接入 SDK 依赖：拉取模块并写入 go.mod",
	"agent":       "接入指引：推荐调用顺序、占位符替换与常见问题排查",
	"openid":      "登录 OpenID：本地加解密、虚拟登录、登录结果签名校验与密钥管理",
	"passport":    "通行证：绑定或更新瑞雪 OpenID 与游戏侧用户 ID 的映射",
	"social":      "社交：设置自定义资料、管理自定义关系（单向/双向）与好友",
	"lbs":         "位置服务：上报或清除坐标，按半径查询附近用户",
	"rank":        "排行榜：创建与关闭榜单，加减分/设分，查个人排名、全榜、好友榜与榜详情",
	"bigdata":     "大数据埋点：异步批量上报与同步上报；须开启埋点配置，进程退出前关闭以免丢数",
	"ims":         "即时通讯：登录取令牌、发消息与拉历史、会话管理、频道人数，以及会话 ID 本地工具",
	"pusher":      "服务端推送：按 OpenID 或游戏用户 ID 等目标下发通知",
	"risk":        "风控：文本内容审核、图片内容审核、实名认证",
	"pay":         "支付查单：按瑞雪订单号查询平台支付状态，用于回调核对、客服查单或发货前确认",
	"operation":   "运营工具：兑换码换道具、查询主播游戏内显示码",
	"cp_role":     "角色上报：新增、更新、删除角色，以及按 OpenID 查询角色列表",
	"attribution": "投放归因：上报自定义转化行为，用于投放效果追踪",
	"siyu":        "私域：检查用户是否在私域池，返回建联状态与小游戏路径",
}

// RuixuegoDependencyData dependency.tpl 注入数据。
type RuixuegoDependencyData struct {
	Version string
}

func executeRuixuegoTpl(tpl *template.Template, data any) (string, error) {
	var buf bytes.Buffer
	if err := tpl.Execute(&buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func isRuixuegoKnownFeature(feature string) bool {
	_, ok := ruixuegoFeatureUsages[feature]
	return ok
}

func ruixuegoSpecFromTpl(tpl *template.Template, feature string) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	spec, err := executeRuixuegoTpl(tpl, nil)
	if err != nil {
		return nil, RuixuegoSpecResult{}, err
	}
	usage := ruixuegoFeatureUsages[feature]
	if usage == "" {
		usage = feature
	}
	return nil, RuixuegoSpecResult{
		Spec:      spec,
		Usage:     usage,
		InitCheck: RuixuegoInitCheckGuide,
	}, nil
}

// checkRuixuegoBaseConfig 检查 Go 工程是否已接入并初始化 ruixuego。
// workspacePath 为空时跳过检查。
func checkRuixuegoBaseConfig(workspacePath string) []string {
	var missing []string
	if workspacePath == "" {
		return missing
	}

	goModPath := filepath.Join(workspacePath, "go.mod")
	goModContent, err := os.ReadFile(goModPath)
	if err != nil {
		missing = append(missing, "依赖配置：未找到 go.mod，请先调用 ruixuego feature=dependency 或在 Go 模块根目录传入 workspacePath")
		return missing
	}
	if !strings.Contains(string(goModContent), ruixuegoModulePath) {
		missing = append(missing, "依赖配置：go.mod 中未包含 "+ruixuegoModulePath+"，请先调用 ruixuego feature=dependency 添加依赖")
	}

	if !ruixuegoHasInitInWorkspace(workspacePath) {
		missing = append(missing, "SDK 初始化：未在工程中找到 ruixuego.Init(，请先调用 ruixuego feature=init 完成初始化")
	}

	return missing
}

func ruixuegoHasInitInWorkspace(workspacePath string) bool {
	found := false
	_ = filepath.Walk(workspacePath, func(path string, info os.FileInfo, err error) error {
		if err != nil || found {
			return nil
		}
		if info.IsDir() {
			base := info.Name()
			if base == "vendor" || base == ".git" || base == "node_modules" || strings.HasPrefix(base, ".") {
				return filepath.SkipDir
			}
			return nil
		}
		if !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return nil
		}
		data, readErr := os.ReadFile(path)
		if readErr != nil {
			return nil
		}
		if strings.Contains(string(data), "ruixuego.Init(") {
			found = true
			return filepath.SkipAll
		}
		return nil
	})
	return found
}

func RuixuegoInitHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	spec, err := executeRuixuegoTpl(ruixuegoInitTpl, nil)
	if err != nil {
		return nil, RuixuegoSpecResult{}, err
	}
	return nil, RuixuegoSpecResult{
		Spec:  spec,
		Usage: ruixuegoFeatureUsages["init"],
		Code:  spec,
	}, nil
}

func RuixuegoDependencyHandler(ctx context.Context, req *mcp.CallToolRequest, input struct {
	Version string `json:"version"`
}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	version := strings.TrimSpace(input.Version)
	if version == "" {
		version = "latest"
	}
	spec, err := executeRuixuegoTpl(ruixuegoDependencyTpl, RuixuegoDependencyData{Version: version})
	if err != nil {
		return nil, RuixuegoSpecResult{}, err
	}
	return nil, RuixuegoSpecResult{
		Spec:  spec,
		Usage: ruixuegoFeatureUsages["dependency"] + "；版本: " + version,
		Code:  spec,
	}, nil
}

func RuixuegoAgentHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoAgentTpl, "agent")
}

func RuixuegoOpenIDHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoOpenIDTpl, "openid")
}

func RuixuegoPassportHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoPassportTpl, "passport")
}

func RuixuegoSocialHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoSocialTpl, "social")
}

func RuixuegoLBSHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoLBSTpl, "lbs")
}

func RuixuegoRankHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoRankTpl, "rank")
}

func RuixuegoBigdataHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoBigdataTpl, "bigdata")
}

func RuixuegoIMSHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoIMSTpl, "ims")
}

func RuixuegoPusherHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoPusherTpl, "pusher")
}

func RuixuegoRiskHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoRiskTpl, "risk")
}

func RuixuegoPayHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoPayTpl, "pay")
}

func RuixuegoOperationHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoOperationTpl, "operation")
}

func RuixuegoCPRoleHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoCPRoleTpl, "cp_role")
}

func RuixuegoAttributionHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoAttributionTpl, "attribution")
}

func RuixuegoSiyuHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, RuixuegoSpecResult, error) {
	_ = ctx
	_ = req
	_ = input
	return ruixuegoSpecFromTpl(ruixuegoSiyuTpl, "siyu")
}

// RuixuegoUnifiedHandler 按 feature 路由到各模块模板。
func RuixuegoUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	feature := strings.TrimSpace(input.Feature)
	if feature == "" {
		return nil, map[string]any{
			"error":        "缺少必填参数 feature",
			"instructions": "请传入 feature，例如 ruixuego feature=init",
		}, nil
	}

	// 先校验白名单，再 preflight，避免拼写错误被误报成「基础配置未完成」
	if !isRuixuegoKnownFeature(feature) {
		return nil, map[string]any{
			"error": "未知的功能模块: " + feature,
			"hint":  "可用 feature 见工具描述 enum 列表",
		}, nil
	}

	if !ruixuegoBaseFeatures[feature] {
		if missing := checkRuixuegoBaseConfig(input.WorkspacePath); len(missing) > 0 {
			msg := "❌ 【ruixuego 基础配置未完成】\n\n"
			for i, m := range missing {
				msg += fmt.Sprintf("%d. %s\n", i+1, m)
			}
			msg += "\n【建议步骤】\n1. ruixuego feature=dependency\n2. ruixuego feature=init\n3. 将生成代码写入工程并替换所有 @test\n4. 再调用本功能模块"
			if input.WorkspacePath != "" {
				msg += "\n\n【调用示例】\nruixuego feature=init workspacePath=" + input.WorkspacePath
			}
			return nil, map[string]any{
				"error":        "基础配置未完成",
				"missing":      missing,
				"instructions": msg,
			}, nil
		}
	}

	var (
		result *mcp.CallToolResult
		output RuixuegoSpecResult
		err    error
	)

	switch feature {
	case "init":
		result, output, err = RuixuegoInitHandler(ctx, req, struct{}{})
	case "dependency":
		result, output, err = RuixuegoDependencyHandler(ctx, req, struct {
			Version string `json:"version"`
		}{Version: input.Version})
	case "agent":
		result, output, err = RuixuegoAgentHandler(ctx, req, struct{}{})
	case "openid":
		result, output, err = RuixuegoOpenIDHandler(ctx, req, struct{}{})
	case "passport":
		result, output, err = RuixuegoPassportHandler(ctx, req, struct{}{})
	case "social":
		result, output, err = RuixuegoSocialHandler(ctx, req, struct{}{})
	case "lbs":
		result, output, err = RuixuegoLBSHandler(ctx, req, struct{}{})
	case "rank":
		result, output, err = RuixuegoRankHandler(ctx, req, struct{}{})
	case "bigdata":
		result, output, err = RuixuegoBigdataHandler(ctx, req, struct{}{})
	case "ims":
		result, output, err = RuixuegoIMSHandler(ctx, req, struct{}{})
	case "pusher":
		result, output, err = RuixuegoPusherHandler(ctx, req, struct{}{})
	case "risk":
		result, output, err = RuixuegoRiskHandler(ctx, req, struct{}{})
	case "pay":
		result, output, err = RuixuegoPayHandler(ctx, req, struct{}{})
	case "operation":
		result, output, err = RuixuegoOperationHandler(ctx, req, struct{}{})
	case "cp_role":
		result, output, err = RuixuegoCPRoleHandler(ctx, req, struct{}{})
	case "attribution":
		result, output, err = RuixuegoAttributionHandler(ctx, req, struct{}{})
	case "siyu":
		result, output, err = RuixuegoSiyuHandler(ctx, req, struct{}{})
	default:
		// 理论上不可达：已知 feature 已在上方白名单校验
		return nil, map[string]any{
			"error": "未知的功能模块: " + feature,
			"hint":  "可用 feature 见工具描述 enum 列表",
		}, nil
	}
	if err != nil {
		return nil, nil, err
	}

	out := map[string]any{
		"spec":  output.Spec,
		"usage": output.Usage,
	}
	if output.InitCheck != "" {
		out["initCheck"] = output.InitCheck
	}
	if output.Code != "" {
		out["code"] = output.Code
	}
	out["placeholderNote"] = `@test 是占位符，接入时必须替换为真实业务参数。`
	_ = result
	return nil, out, nil
}

func registerRuixuegoTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "ruixuego",
			Description: mcpToolCallRequirement + `

瑞雪 Go 服务端 SDK（github.com/ruixueyun/ruixuego）代码生成工具。
根据 feature 生成接入规范与 Go 示例，供 CP 游戏服 / 后端集成。

【占位符】示例中的 "@test" 必须替换为真实业务参数后再写入工程。
` + ruixuegoPlaceholderHint + `

【可用功能模块 (feature)】
基础接入:
- init: 初始化 SDK、获取客户端、退出关闭
- dependency: 拉取依赖并写入 go.mod
- agent: 接入顺序、占位符替换与排查指引

OpenID / 通行证:
- openid: 登录 OpenID 加解密、虚拟登录、签名校验
- passport: 绑定瑞雪 OpenID 与游戏用户 ID

社交 / LBS / 排行榜:
- social: 自定义资料、自定义关系、好友
- lbs: 坐标上报/清除、附近用户查询
- rank: 排行榜创建关闭、加减分、榜单查询

大数据 / IMS / 推送:
- bigdata: 埋点异步/同步上报（退出前关闭）
- ims: 即时通讯登录、消息、会话与频道人数
- pusher: 服务端推送通知

风控 / 支付 / 运营:
- risk: 文本/图片审核、实名认证
- pay: 按订单号查询支付状态
- operation: 兑换码、主播显示码

角色 / 归因 / 私域:
- cp_role: 角色增删改查
- attribution: 自定义投放归因上报
- siyu: 私域池检查与建联状态

【参数说明】
- feature: 必填
- workspacePath: 可选，Go 模块根路径；非 base feature 时检查 go.mod 与 Init
- version: 可选，依赖版本提示（dependency）

【调用示例】
ruixuego feature=init
ruixuego feature=dependency version=v0.1.57
ruixuego feature=social workspacePath=/path/to/game-server
ruixuego feature=bigdata workspacePath=/path/to/game-server`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum": []string{
							"init", "dependency", "agent",
							"openid", "passport",
							"social", "lbs", "rank",
							"bigdata", "ims", "pusher",
							"risk", "pay", "operation",
							"cp_role", "attribution", "siyu",
						},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "Go 项目根路径；传入后会检查 go.mod 是否含 ruixuego，以及是否已有 ruixuego.Init(",
					},
					"version": map[string]any{
						"type":        "string",
						"description": "SDK 版本提示，如 v0.1.57；主要用于 dependency 示例",
					},
				},
				"required": []string{"feature"},
			},
		},
		RuixuegoUnifiedHandler,
	)
}
