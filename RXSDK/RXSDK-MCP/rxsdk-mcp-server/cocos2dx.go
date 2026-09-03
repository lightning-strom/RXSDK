package rxsdk

import (
	"bytes"
	"context"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type Cocos2dxSpecResult struct {
	Spec      string                  `json:"spec"`
	Usage     string                  `json:"usage"`
	Preflight PassportPreflightResult `json:"preflight"`
}

func Cocos2dxUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	switch input.Feature {
	case "gdt":
		var buf bytes.Buffer
		if err := cocos2dxGDTTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "通过 ruixue::RuixueBridge 接入 Android/iOS GDT 初始化和转化事件上报",
			"preflight": cocos2dxGDTPreflight(input.WorkspacePath),
		}, nil
	case "share":
		var buf bytes.Buffer
		if err := cocos2dxShareTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		responseSchema, err := operationAPIResponseSchemaReference("v1/operationapi/share/data")
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "Cocos2dx 当前无分享桥接；仅返回 getShareData/getShareInfo 的 operation_api 响应结构",
			"supported": false,
			"responseSchemas": map[string]any{
				"getShareData": responseSchema,
				"getShareInfo": responseSchema,
			},
		}, nil
	case "xingyi_payment":
		mode, modeErr := xingyiPaymentModeFromRequest(req)
		if modeErr != "" {
			return nil, map[string]any{"error": modeErr}, nil
		}
		var buf bytes.Buffer
		if err := cocos2dxXingYiPaymentTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":        buf.String(),
			"usage":       "通过通用 RuixueBridge::pay JSON 接入 Android 星驿支付；iOS 不支持",
			"paymentMode": mode,
			"preflight":   cocos2dxXingYiPaymentPreflight(input.WorkspacePath, mode),
		}, nil
	case "unifypay":
		var buf bytes.Buffer
		if err := cocos2dxUnifypayTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "通过 RuixueBridge::pay 接入 Android 银联；原生插件调用 UPPaySdkWrapper.getInstance().doPay",
			"preflight": cocos2dxUnifypayPreflight(input.WorkspacePath),
		}, nil
	case "huya":
		var buf bytes.Buffer
		if err := cocos2dxHuyaTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "通过 RuixueBridge 通用新接口接入 Android 虎牙联运；iOS 不支持",
			"dependency": "com.ruixue:rxsdk_huya:4.0.17",
			"preflight":  cocos2dxHuyaPreflight(input.WorkspacePath),
		}, nil
	case "baidu":
		var buf bytes.Buffer
		if err := cocos2dxBaiduTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "通过 RuixueBridge 接入 Android 百度初始化、闪屏、登录、支付、角色上报、悬浮窗和退出；iOS 不支持",
			"dependency": "com.ruixue:rxsdk_baidu_wangxun:4.0.18",
			"preflight":  cocos2dxBaiduPreflight(input.WorkspacePath),
		}, nil
	case "xuteng":
		var buf bytes.Buffer
		if err := cocos2dxXutengTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "通过公共 RuixueBridge 接入 Android 栩腾初始化、登录、支付、角色上报、登出和退出；iOS 不支持",
			"dependency": "com.ruixue:rxsdk_xuteng:4.0.19",
			"preflight":  cocos2dxXutengPreflight(input.WorkspacePath),
		}, nil
	default:
		return nil, map[string]any{"error": "未知的功能模块: " + input.Feature}, nil
	}
}

func registerCocos2dxTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "cocos2dx",
			Description: mcpToolCallRequirement + `

Cocos2dx SDK 代码生成工具。

【可用功能模块 (feature)】
- gdt: RuixueBridge 腾讯广告 GDT/广点通双端桥接
- share: getShareData/getShareInfo 响应结构（当前无 Cocos2dx 分享桥接）
- xingyi_payment: Android 星驿 App/H5 支付（iOS 不支持）
- unifypay: Android 银联综合支付（iOS 不支持）
- huya: RuixueBridge 虎牙联运通用新接口（仅 Android）
- baidu: RuixueBridge 百度游戏渠道接口（仅 Android）
- xuteng: 公共 RuixueBridge 栩腾渠道接口（仅 Android）

【参数说明】
- feature: 必填，当前支持 gdt、share、xingyi_payment、unifypay、huya、baidu、xuteng
- paymentMode: xingyi_payment 支付模式 app/h5/both，默认 both
- workspacePath: Cocos2dx 项目根目录；gdt 用于实际检查桥接、双端依赖、初始化顺序和目标 API`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum":        []string{"gdt", "share", "xingyi_payment", "unifypay", "huya", "baidu", "xuteng"},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "Cocos2dx 项目工作目录的绝对路径",
					},
					"paymentMode": map[string]any{
						"type":        "string",
						"description": "星驿支付模式：app、h5 或 both（默认）",
						"enum":        []string{"app", "h5", "both"},
						"default":     "both",
					},
				},
				"required": []string{"feature"},
			},
		},
		Cocos2dxUnifiedHandler,
	)
}
