package rxsdk

import (
	"context"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const HARMONY_DEFAULT_VERSION = "3.7.12"

const HarmonyInitCheckGuide = `【Harmony / OpenHarmony 前置检查】

1. 确认项目依赖 hmssdk：
   - oh-package.json5 中 dependencies 包含 "hmssdk"
   - 或本地模块 hmssdk 可被 entry 引用

2. 关键入口：
   - import { RXApi, RXConfig, RXResult } from 'hmssdk'
   - 初始化：RXApi.getInstance().init(config, uiContext)
   - 登录：RXApi.getInstance().login(...)
   - 支付：RXApi.getInstance().pay(...)

3. UI 相关接口必须传 UIContext：
   - ArkUI 页面内使用 this.getUIContext()
   - 初始化建议在 aboutToAppear 中调用`

func HarmonyUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature       string `json:"feature"`
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	version := strings.TrimSpace(input.Version)
	if version == "" {
		version = HARMONY_DEFAULT_VERSION
	}

	output := map[string]any{
		"platform":  "harmony",
		"version":   version,
		"initCheck": HarmonyInitCheckGuide,
	}

	switch input.Feature {
	case "init":
		output["usage"] = "Harmony SDK 初始化"
		output["code"] = harmonyInitSpec
	case "dependency":
		output["usage"] = "Harmony SDK 依赖配置"
		output["code"] = strings.ReplaceAll(harmonyDependencySpec, "{{version}}", version)
	case "setup":
		output["usage"] = "Harmony SDK 接入步骤"
		output["instructions"] = strings.ReplaceAll(strings.ReplaceAll(harmonySetupSpec, "{{version}}", version), "{{workspacePath}}", input.WorkspacePath)
	case "agent":
		output["usage"] = "Harmony SDK Agent 指南"
		output["guide"] = harmonyAgentSpec
	case "login":
		output["usage"] = "Harmony 登录"
		output["spec"] = harmonyLoginSpec
	case "payment":
		output["usage"] = "Harmony 支付"
		output["spec"] = harmonyPaymentSpec
	case "share":
		output["usage"] = "Harmony 分享"
		output["spec"] = harmonyShareSpec
	case "tracking":
		output["usage"] = "Harmony 数据埋点"
		output["spec"] = harmonyTrackingSpec
	default:
		output["error"] = "未知 Harmony 功能模块: " + input.Feature + "；当前支持 init, dependency, setup, agent, login, payment, share, tracking"
	}

	return nil, output, nil
}

func registerHarmonyTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "harmony",
			Description: `Harmony / OpenHarmony 瑞雪 SDK 代码生成工具。根据 feature 参数生成 ArkTS 接入代码。

【可用功能模块】
- init: SDK 初始化
- dependency: oh-package.json5 依赖配置
- setup: 接入步骤
- agent: AI Agent 接入指南
- login: 登录
- payment: 支付
- share: 分享
- tracking: 数据埋点

【参数说明】
- feature: 必填，功能模块名称
- version: hmssdk 版本号，默认 3.7.12
- workspacePath: 项目路径，setup 可选`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的 Harmony 功能模块",
						"enum":        []string{"init", "dependency", "setup", "agent", "login", "payment", "share", "tracking"},
					},
					"version": map[string]any{
						"type":        "string",
						"description": "hmssdk 版本号，默认 3.7.12",
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "Harmony 项目工作目录的绝对路径",
					},
				},
				"required": []string{"feature"},
			},
		},
		HarmonyUnifiedHandler,
	)
}

const harmonyDependencySpec = `# Harmony hmssdk 依赖配置

entry/oh-package.json5:

当前仓库内本地模块接入（推荐）：

{
  "dependencies": {
    "hmssdk": "file:../hmssdk"
  }
}

如果使用已发布 ohpm 包：

{
  "dependencies": {
    "hmssdk": "{{version}}"
  }
}`

const harmonySetupSpec = `# Harmony SDK 接入步骤

workspacePath: {{workspacePath}}
hmssdk version: {{version}}

1. 在 entry/oh-package.json5 增加 hmssdk 依赖；当前仓库本地模块用 "hmssdk": "file:../hmssdk"。
2. 在页面中导入：
   import { RXApi, RXConfig, RXResult } from 'hmssdk';
3. 在 ArkUI 页面内用 this.getUIContext() 初始化。
4. 初始化成功后再调用 login/pay/share/trackData。
5. 若使用分享、微信等能力，按渠道补 module.json5 / Want / scheme 等平台配置。`

const harmonyAgentSpec = `# Harmony Agent 指南

识别规则：
- 项目包含 hmssdk/src/main/ets 或 import { RXApi } from 'hmssdk' 时，按 Harmony SDK 处理。
- 不要生成 Android Java/Kotlin 或 Unity C# 代码。
- ArkTS 页面内 UI 接口必须使用 this.getUIContext()。

核心入口：
- RXApi.getInstance().init(config, uiContext)
- RXApi.getInstance().login(params)
- RXApi.getInstance().pay(params)
- RXApi.getInstance().share().share(context, params, callback)
- RXApi.getInstance().trackData({ event_name, properties, distinct_id })`

const harmonyInitSpec = `# Harmony 初始化

signature:
  import: "import { RXApi, RXConfig, RXResult } from 'hmssdk';"
  method: "RXApi.getInstance().init(config, uiContext)"

code: |
  import { RXApi, RXConfig, RXResult } from 'hmssdk';
  import { promptAction } from '@kit.ArkUI';
  import { BusinessError } from '@kit.BasicServicesKit';

  @Component
  struct GamePage {
    private config: RXConfig = {
      cpId: '114',
      productId: '1002',
      channelId: '214',
      baseUrls: ['https://cn-api-test.ruixueyun.com'],
      privacyEnable: true
    };

    aboutToAppear(): void {
      this.initSDK();
    }

    private initSDK() {
      RXApi.getInstance().init(this.config, this.getUIContext())
        .then((resp: RXResult<object>) => {
          promptAction.showToast({ message: resp.code === 0 ? '初始化成功' : JSON.stringify(resp) });
        })
        .catch((e: BusinessError) => {
          promptAction.showToast({ message: '初始化失败: ' + JSON.stringify(e) });
        });
    }
  }`

const harmonyLoginSpec = `# Harmony 登录

signature:
  method: "RXApi.getInstance().login(params, callback?)"
  params: LoginParams

code: |
  import { RXApi, LoginMethod, LoginData, RXResult } from 'hmssdk';

  async function loginGuest() {
    const resp: RXResult<LoginData> = await RXApi.getInstance().login({
      method: LoginMethod.Guest
    });
    console.info('guest login result: ' + JSON.stringify(resp));
  }

  async function loginByPassword(username: string, password: string) {
    const resp = await RXApi.getInstance().login({
      method: LoginMethod.UserName,
      username,
      password
    });
    console.info('password login result: ' + JSON.stringify(resp));
  }`

const harmonyPaymentSpec = `# Harmony 支付

signature:
  method: "RXApi.getInstance().pay(params, callback?)"
  params: PayParams

pay_params:
  - pay_type: 支付类型，Harmony 默认 "harmony"，微信可传 "wechat"
  - goods_tag: 瑞雪计费点，必填
  - trade_no: 商户订单号，必填且唯一
  - currency: 币种，可选

code: |
  import { RXApi, RXResult } from 'hmssdk';

  async function payDiamond() {
    const resp: RXResult<object> = await RXApi.getInstance().pay({
      pay_type: 'harmony',
      goods_tag: 'goods_diamond_first_3',
      trade_no: String(Date.now())
    });
    console.info('pay result: ' + JSON.stringify(resp));
  }`

const harmonyShareSpec = `# Harmony 分享

signature:
  method: "RXApi.getInstance().share().share(context, params, callback)"

code: |
  import { RXApi } from 'hmssdk';

  function shareKnockCard() {
    RXApi.getInstance().share().share(getContext(), {
      platform: 'hw_knock',
      func: 'peng-big'
    }, (ret) => {
      console.info('share result: ' + JSON.stringify(ret));
    });
  }`

const harmonyTrackingSpec = `# Harmony 数据埋点

signature:
  method: "RXApi.getInstance().trackData({ event_name, properties, distinct_id })"

code: |
  import { RXApi } from 'hmssdk';

  function trackPayButtonClick() {
    RXApi.getInstance().trackData({
      event_name: 'pay_button_click',
      properties: {
        goods_tag: 'goods_diamond_first_3',
        scene: 'shop'
      }
    });
  }`
