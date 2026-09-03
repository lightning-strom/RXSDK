package rxsdk

import (
	"bytes"
	"context"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// ==================== Minigame 返回结构 ====================

type MinigameSpecResult struct {
	Spec      string `json:"spec"`
	Usage     string `json:"usage"`
	InitCheck string `json:"initCheck"`
}

// ==================== Minigame Handlers ====================

func MinigameInitHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, struct {
	Code           string `json:"code"`
	DependencyHint string `json:"dependencyHint"`
}, error) {
	var buf bytes.Buffer
	if err := minigameInitTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Code           string `json:"code"`
			DependencyHint string `json:"dependencyHint"`
		}{}, err
	}

	return nil, struct {
		Code           string `json:"code"`
		DependencyHint string `json:"dependencyHint"`
	}{
		Code:           buf.String(),
		DependencyHint: "将 SDK 构建产物引入小游戏项目后，在入口文件中进行初始化。",
	}, nil
}

func MinigameLoginHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameLoginTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "登录功能：微信授权登录、指定 OpenID 登录",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigamePaymentHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigamePaymentTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "支付功能：下单、补单、订单查询、商户转账",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigamePassportHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigamePassportTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "用户通行证功能：获取指定用户信息、修改用户信息、短链接",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameCaptchaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameCaptchaTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "验证码功能：发送手机/邮箱验证码，支持微信防刷验证",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameAccountBindingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameAccountBindingTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "账号绑定功能：绑定/解绑/换绑手机号、邮箱，微信快速获取手机号",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameDeregisterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameDeregisterTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "账号注销功能：申请注销、撤销注销",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameShareHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameShareTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "分享功能：转发好友、海报分享、消息卡片、分享图片菜单",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameFeedbackHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameFeedbackTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "反馈功能：创建反馈、反馈列表、反馈详情、满意度评价",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameTrackingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameTrackingTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "数据埋点功能：自定义事件上报、调度上报属性设置",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameAdHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameAdTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "广告功能：激励视频广告、Banner 广告、插屏广告",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameLbsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameLbsTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "LBS 定位功能：上报位置、删除位置、获取附近玩家",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameGameAreaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameGameAreaTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "游戏区服功能：创建/查询/更新/删除区服",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameGameCharacterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameGameCharacterTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "游戏角色功能：创建/查询/更新/删除角色",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigamePromoHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigamePromoTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "达人福利功能：获取/兑换福利码",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameAnnouncementHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameAnnouncementTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "公告/邮件功能：获取公告、邮件列表、领取道具、删除邮件",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameDeviceHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameDeviceTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "设备信息功能：子渠道设置、错误信息管理、IP 查询",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameSocialHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameSocialTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "社交功能：开放数据域解密、搜索游戏账号",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameVersionCheckHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameVersionCheckTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "瑞雪版本检查 v2：updateGameVersion 统一模块版本检查",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

func MinigameGDTHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, MinigameSpecResult, error) {
	var buf bytes.Buffer
	if err := minigameGDTTpl.Execute(&buf, nil); err != nil {
		return nil, MinigameSpecResult{}, err
	}
	return nil, MinigameSpecResult{
		Spec:      buf.String(),
		Usage:     "微信小游戏 GDT：腾讯 SDK 注入、必报事件、通用上报与激励直玩状态",
		InitCheck: MinigameInitCheckGuide,
	}, nil
}

// ==================== Minigame 统一 Handler ====================

func MinigameUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	feature := input.Feature

	switch feature {
	case "init":
		result, output, err := MinigameInitHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"code": output.Code, "dependencyHint": output.DependencyHint}, nil

	case "login":
		result, output, err := MinigameLoginHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "payment":
		result, output, err := MinigamePaymentHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "passport":
		result, output, err := MinigamePassportHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": minigamePassportPreflight(input.WorkspacePath),
		}, nil

	case "captcha":
		result, output, err := MinigameCaptchaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "account_binding":
		result, output, err := MinigameAccountBindingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "deregister":
		result, output, err := MinigameDeregisterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "share":
		result, output, err := MinigameShareHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		responseSchema, err := operationAPIResponseSchemaReference("v1/operationapi/share/data")
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"responseSchemas": map[string]any{
				"getShareData": responseSchema,
				"getShareInfo": responseSchema,
			},
		}, nil

	case "feedback":
		result, output, err := MinigameFeedbackHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "tracking":
		result, output, err := MinigameTrackingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "ad":
		result, output, err := MinigameAdHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "lbs":
		result, output, err := MinigameLbsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_area":
		result, output, err := MinigameGameAreaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_character":
		result, output, err := MinigameGameCharacterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "promo":
		result, output, err := MinigamePromoHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "announcement":
		result, output, err := MinigameAnnouncementHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "device":
		result, output, err := MinigameDeviceHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "social":
		result, output, err := MinigameSocialHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "version_check":
		result, output, err := MinigameVersionCheckHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": minigameVersionCheckPreflight(input.WorkspacePath),
		}, nil

	case "gdt":
		result, output, err := MinigameGDTHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": minigameGDTPreflight(input.WorkspacePath),
		}, nil

	default:
		return nil, map[string]any{"error": "未知的功能模块: " + feature}, nil
	}
}

// ==================== Minigame 工具注册 ====================

func registerMinigameTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "minigame",
			Description: mcpToolCallRequirement + `

小游戏 SDK 代码生成工具。根据 feature 参数生成不同功能模块的 TypeScript/JavaScript 代码。

适用平台：微信小游戏、QQ 小游戏、H5 小游戏等。

【可用功能模块 (feature)】
基础接入:
- init: SDK 初始化代码

用户登录:
- login: 微信授权登录

支付:
- payment: 支付（下单、补单、订单查询）

用户通行证:
- passport: 用户信息（获取指定字段/修改）
- captcha: 验证码（手机/邮箱）
- account_binding: 账号绑定（手机/邮箱）
- deregister: 账号注销

社交功能:
- social: 社交（开放数据域、搜索账号）
- share: 分享（转发/海报/消息卡片）
- lbs: LBS 定位

游戏功能:
- game_area: 游戏区服
- game_character: 游戏角色

其他功能:
- feedback: 反馈/客服
- tracking: 数据埋点
- ad: 广告（激励视频/Banner/插屏）
- promo: 达人福利
- announcement: 公告/邮件
- device: 设备信息
- version_check: 瑞雪版本检查 v2（JSSDK >= 4.0.2）
- gdt: 腾讯广告 GDT 上报与激励直玩状态（JSSDK >= 4.0.2）

【参数说明】
- feature: 必填，功能模块名称
- workspacePath: gdt 传入后实际检查 tencent-sdk.js、wx.TencentSDK、JSSDK 版本和目标 API`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum": []string{
							"init", "login", "payment",
							"passport", "captcha", "account_binding", "deregister",
							"social", "share", "lbs",
							"game_area", "game_character",
							"feedback", "tracking", "ad", "promo", "announcement", "device", "version_check", "gdt",
						},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "项目路径；passport/gdt 功能传入后可实际检查 JSSDK 初始化、构建产物与目标 API",
					},
				},
				"required": []string{"feature"},
			},
		},
		MinigameUnifiedHandler,
	)
}
