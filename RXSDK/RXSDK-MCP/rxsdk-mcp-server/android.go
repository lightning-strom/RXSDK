package rxsdk

import (
	"bytes"
	"context"
	"encoding/json"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// ==================== Android 返回结构 ====================

// AndroidSpecResult 带初始化检查的返回结构
type AndroidSpecResult struct {
	Spec      string `json:"spec"`
	Usage     string `json:"usage"`
	InitCheck string `json:"initCheck"`
}

// ==================== Android Handlers ====================

// AndroidInitHandler 生成 Android SDK 初始化代码
func AndroidInitHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct{},
) (*mcp.CallToolResult, struct {
	Code           string `json:"code"`
	DependencyHint string `json:"dependencyHint"`
}, error) {

	var buf bytes.Buffer
	if err := androidInitTpl.Execute(&buf, nil); err != nil {
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
		DependencyHint: "Before using this code, please use android_add_dependency to add SDK dependencies first.",
	}, nil
}

// AndroidAddDependencyHandler 生成 Android Gradle 依赖配置
func AndroidAddDependencyHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Channel    string `json:"channel"`
		Version    string `json:"version"`
		GradleType string `json:"gradleType"`
	},
) (*mcp.CallToolResult, struct {
	Code string `json:"code"`
}, error) {

	channel := input.Channel
	if channel == "" {
		channel = DEFAULT_CHANNEL
	}

	gradleType := input.GradleType
	if gradleType == "" {
		gradleType = "groovy"
	}

	version := input.Version
	if version == "" {
		version = SDK_VERSION
	}

	data := DependencyData{
		Channel:    channel,
		Version:    version,
		GradleType: gradleType,
	}

	var buf bytes.Buffer
	if err := androidDependencyTpl.Execute(&buf, data); err != nil {
		return nil, struct {
			Code string `json:"code"`
		}{}, err
	}

	return nil, struct {
		Code string `json:"code"`
	}{
		Code: buf.String(),
	}, nil
}

// AndroidAgentHandler 返回 Android 接入流程指南
func AndroidAgentHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct{},
) (*mcp.CallToolResult, struct {
	Guide string `json:"guide"`
}, error) {
	data := AgentData{
		Channel: DEFAULT_CHANNEL,
		Version: SDK_VERSION,
	}

	var buf bytes.Buffer
	if err := androidAgentTpl.Execute(&buf, data); err != nil {
		return nil, struct {
			Guide string `json:"guide"`
		}{}, err
	}

	return nil, struct {
		Guide string `json:"guide"`
	}{
		Guide: buf.String(),
	}, nil
}

// AndroidLoginHandler 生成 Android 登录代码
func AndroidLoginHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		CheckOnly bool `json:"checkOnly"`
	},
) (*mcp.CallToolResult, struct {
	Spec       string `json:"spec"`
	Usage      string `json:"usage"`
	CheckGuide string `json:"checkGuide"`
	InitCheck  string `json:"initCheck"`
}, error) {
	var buf bytes.Buffer
	if err := androidLoginTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Spec       string `json:"spec"`
			Usage      string `json:"usage"`
			CheckGuide string `json:"checkGuide"`
			InitCheck  string `json:"initCheck"`
		}{}, err
	}

	usage := "Insert login code at cursor position, or check existing code"
	if input.CheckOnly {
		usage = "Check existing login code for correctness"
	}

	return nil, struct {
		Spec       string `json:"spec"`
		Usage      string `json:"usage"`
		CheckGuide string `json:"checkGuide"`
		InitCheck  string `json:"initCheck"`
	}{
		Spec:  buf.String(),
		Usage: usage,
		CheckGuide: `1. Search for "RXSDK.getInstance().login" or "RXSdkUI.getInstance().showLoginUI" in current file
2. If NOT found: Insert the sample code from 'code' section
3. If found: Verify parameters match signature (Activity, LoginParams/RXLoginUIModel, RXRequestCallback)
4. Check callback implements: onLoginSuccess, onLoginCancel, onLoginFailure
5. Report any missing or incorrect parameters`,
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidLoginApiHandler 生成 Android API 登录代码（非 UI 方式）
func AndroidLoginApiHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		LoginType string `json:"loginType"`
		CheckOnly bool   `json:"checkOnly"`
	},
) (*mcp.CallToolResult, struct {
	Spec       string `json:"spec"`
	Usage      string `json:"usage"`
	CheckGuide string `json:"checkGuide"`
	InitCheck  string `json:"initCheck"`
}, error) {
	var buf bytes.Buffer
	if err := androidLoginApiTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Spec       string `json:"spec"`
			Usage      string `json:"usage"`
			CheckGuide string `json:"checkGuide"`
			InitCheck  string `json:"initCheck"`
		}{}, err
	}

	loginType := input.LoginType
	if loginType == "" {
		loginType = "all"
	}

	usage := "Insert API login code at cursor position (login type: " + loginType + ")"
	if input.CheckOnly {
		usage = "Check existing API login code for correctness"
	}

	return nil, struct {
		Spec       string `json:"spec"`
		Usage      string `json:"usage"`
		CheckGuide string `json:"checkGuide"`
		InitCheck  string `json:"initCheck"`
	}{
		Spec:  buf.String(),
		Usage: usage,
		CheckGuide: `1. Search for "RXSDK.getInstance().login" in current file
2. If NOT found: Insert the sample code based on loginType
3. If found: Verify LoginParams is correctly constructed
4. Check callback implements: onResponse(JSONObject)
5. Verify loginType matches: LoginType.USERNAME/CAPTCHACODE/GUEST/GOOGLE
6. Report any missing or incorrect parameters`,
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidPaymentHandler 生成 Android 支付代码
func AndroidPaymentHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		CheckOnly bool `json:"checkOnly"`
	},
) (*mcp.CallToolResult, struct {
	Spec       string `json:"spec"`
	Usage      string `json:"usage"`
	CheckGuide string `json:"checkGuide"`
	InitCheck  string `json:"initCheck"`
}, error) {
	var buf bytes.Buffer
	if err := androidPaymentTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Spec       string `json:"spec"`
			Usage      string `json:"usage"`
			CheckGuide string `json:"checkGuide"`
			InitCheck  string `json:"initCheck"`
		}{}, err
	}

	usage := "Insert payment code at cursor position, or check existing code"
	if input.CheckOnly {
		usage = "Check existing payment code for correctness"
	}

	return nil, struct {
		Spec       string `json:"spec"`
		Usage      string `json:"usage"`
		CheckGuide string `json:"checkGuide"`
		InitCheck  string `json:"initCheck"`
	}{
		Spec:  buf.String(),
		Usage: usage,
		CheckGuide: `1. Search for "RXSDK.getInstance().pay" in current file
2. If NOT found: Insert the sample code from the matching section (code / code_alipay / code_xingyi_app / code_xingyi_h5)
3. If found: Verify parameters match signature (Activity, Map<String, Object> or HQParams, RXRequestCallback)
4. Check payParams has required fields: hq_type, goods_tag, trade_no
5. Check callback implements: onResponse(JSONObject)
6. If using WeChat pay (hq_type="wechat"), check for dependency 'com.ruixue:rxsdk_weixin_withpay'
7. If using XingYi/星驿/星轶 (hq_type="xy" or legacy "xyh5"):
   - Require Android SDK / plugins ≥ 4.0.14 (星驿支付自 4.0.14 起支持)
   - App: dependency 'com.ruixue:rxsdk_xingyi'; do NOT force ext.is_h5=1
   - H5: ext.is_h5=1 and dependency 'com.ruixue:rxsdk_h5pay' (prefer keep both xingyi+h5pay)
   - Prefer hq_type="xy"; treat xyh5 as legacy alias only
8. Report any missing or incorrect parameters`,
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// ==================== 通用 Android Handler ====================

// androidHandlerWithInitCheck 创建带初始化检查的通用 handler
func androidHandlerWithInitCheck(tpl interface {
	Execute(w *bytes.Buffer, data any) error
}, usage string) func(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct{},
) (*mcp.CallToolResult, AndroidSpecResult, error) {
	return func(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
		var buf bytes.Buffer
		if err := tpl.Execute(&buf, nil); err != nil {
			return nil, AndroidSpecResult{}, err
		}
		return nil, AndroidSpecResult{
			Spec:      buf.String(),
			Usage:     usage,
			InitCheck: AndroidInitCheckGuide,
		}, nil
	}
}

// AndroidPassportHandler 用户通行证
func AndroidPassportHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidPassportTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "用户通行证功能：登录、注册、登出、指定用户信息查询、用户信息管理",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidCaptchaHandler 验证码
func AndroidCaptchaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidCaptchaTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "验证码功能：发送验证码、验证验证码",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidRealAuthHandler 实名认证
func AndroidRealAuthHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidRealAuthTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "实名认证功能：身份验证、防沉迷、支付宝 IIFAA 实名",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidAccountBindingHandler 账号绑定
func AndroidAccountBindingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidAccountBindingTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "账号绑定功能：绑定第三方账号，绑定/解绑/修改手机号、邮箱",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidPasswordHandler 密码管理
func AndroidPasswordHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidPasswordTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "密码管理功能：修改密码、重置密码",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidDeregisterHandler 账号注销
func AndroidDeregisterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidDeregisterTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "账号注销功能：申请注销、撤销注销",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidSocialHandler 社交关系
func AndroidSocialHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidSocialTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "社交关系功能：添加/删除/查询自定义关系",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidFriendsHandler 好友管理
func AndroidFriendsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidFriendsTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "好友管理功能：添加/删除好友、好友列表",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidLbsHandler LBS 定位
func AndroidLbsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidLbsTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "LBS 定位功能：上报位置、获取附近用户",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidRankHandler 排行榜
func AndroidRankHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidRankTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "排行榜功能：增加/设置分数、查询排名、好友排行榜",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidGameAreaHandler 游戏区服
func AndroidGameAreaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidGameAreaTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "游戏区服功能：创建/查询/更新/删除区服",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidGameCharacterHandler 游戏角色
func AndroidGameCharacterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidGameCharacterTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "游戏角色功能：SetGameInfo 上报瑞雪、SetThirdGameInfo 上报三方渠道、角色 CRUD",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidMumuHandler MuMu/Yofun 渠道
func AndroidMumuHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidMumuTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "MuMu/Yofun Android 渠道：依赖、APP_ID、生命周期、登录和角色事件",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidGDTHandler 腾讯广告 GDT/广点通转化上报
func AndroidGDTHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidGDTTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "腾讯广告 GDT：自动/手动初始化以及创角、下单、支付等转化事件上报",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidShareHandler 分享
func AndroidShareHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidShareTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "分享功能：分享到微信/QQ、获取短链接",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidFeedbackHandler 反馈
func AndroidFeedbackHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidFeedbackTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "反馈功能：提交反馈、满意度评价、客服消息",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidTrackingHandler 数据埋点
func AndroidTrackingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidTrackingTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "数据埋点功能：事件上报、用户行为上报",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidVersionCheckHandler 版本检查 v2
func AndroidVersionCheckHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidVersionCheckTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "瑞雪版本检查 v2：updateGameVersion 统一模块版本检查",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidLegalHandler 法务条款
func AndroidLegalHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidLegalTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "法务条款功能：用户协议、隐私政策",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidLegalUIHandler 法务 UI（协议页面、隐私政策弹窗）
func AndroidLegalUIHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidLegalUITpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "法务 UI 功能：协议声明弹窗、隐私政策弹窗、协议视图页面",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidPromoHandler 达人福利
func AndroidPromoHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidPromoTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "达人福利功能：获取/兑换福利码",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidAnnouncementHandler 公告/邮件
func AndroidAnnouncementHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidAnnouncementTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "公告/邮件功能：获取公告列表、临时公告、邮件列表、邮件详情、领取道具、删除邮件",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidDeviceHandler 设备信息
func AndroidDeviceHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidDeviceTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "设备信息功能：获取设备码、时区、语言、SDK信息、渠道、OpenID、登录状态等",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidUserCenterHandler 用户中心
func AndroidUserCenterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidUserCenterTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "用户中心功能：用户中心弹窗、帮助中心弹窗、客服弹窗",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidTopOnHandler TopOn 广告聚合组件
func AndroidTopOnHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidTopOnTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "TopOn 广告聚合组件：初始化、激励视频、插屏、开屏、横幅、原生广告",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidFirebaseHandler Firebase 组件
func AndroidFirebaseHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidFirebaseTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "Firebase 组件：Analytics、Crashlytics、FCM 推送、瑞雪推送封装",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// AndroidAdjustHandler Adjust 组件
func AndroidAdjustHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, AndroidSpecResult, error) {
	var buf bytes.Buffer
	if err := androidAdjustTpl.Execute(&buf, nil); err != nil {
		return nil, AndroidSpecResult{}, err
	}
	return nil, AndroidSpecResult{
		Spec:      buf.String(),
		Usage:     "Adjust 组件：归因、事件跟踪、深度链接、隐私合规、广告收入",
		InitCheck: AndroidInitCheckGuide,
	}, nil
}

// ==================== Android Setup Handler ====================

// AndroidSetupHandler 返回 Android 项目自动化接入的直接执行指令
func AndroidSetupHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Region        string `json:"region"`  // domestic(国内) 或 overseas(海外)
		Version       string `json:"version"` // SDK 版本号（必填）
	},
) (*mcp.CallToolResult, struct {
	Instructions      string `json:"instructions"`
	MavenRepoConfig   string `json:"mavenRepoConfig"`
	DependencyConfig  string `json:"dependencyConfig"`
	GradlePropsConfig string `json:"gradlePropsConfig"`
	Region            string `json:"region"`
}, error) {

	// 版本号必填校验
	version := input.Version
	if version == "" {
		return nil, struct {
			Instructions      string `json:"instructions"`
			MavenRepoConfig   string `json:"mavenRepoConfig"`
			DependencyConfig  string `json:"dependencyConfig"`
			GradlePropsConfig string `json:"gradlePropsConfig"`
			Region            string `json:"region"`
		}{
			Instructions: `【错误】版本号（version）为必填参数，请指定 SDK 版本号。

请重新调用并传入 version 参数，例如：
  android feature=setup version=4.0.14 region=domestic

获取最新版本号请咨询瑞雪技术支持或查看文档。`,
		}, nil
	}

	workspacePath := input.WorkspacePath
	channel := input.Channel
	if channel == "" {
		channel = DEFAULT_CHANNEL
	}

	region := input.Region
	if region == "" {
		region = "domestic" // 默认国内环境
	}

	// 根据环境生成不同的 UI 依赖
	var uiDependency string
	var regionDesc string
	if region == "overseas" {
		uiDependency = "implementation 'com.ruixue:rxsdk_overseas:" + version + "'  // 海外 UI 组件库"
		regionDesc = "海外"
	} else {
		uiDependency = "implementation 'com.ruixue:rxsdk_base_ui:" + version + "'  // 国内 UI 组件库"
		regionDesc = "国内"
	}

	// Maven 仓库配置
	mavenRepoConfig := `// ========== 瑞雪 SDK Maven 仓库 ==========
// jcenter 阿里云镜像（部分依赖需要）
jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }

// 瑞雪 SDK 仓库
maven {
    url 'http://60.205.123.114:8081/repository/maven-releases/'
    allowInsecureProtocol = true
}

// 备用地址
maven {
    credentials {
        username '600685104fb2132a19e09a29'
        password '2IfrbLKz50J1'
    }
    url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
}
// ========== 瑞雪 SDK Maven 仓库 END ==========`

	// 依赖配置
	dependencyConfig := `// ========== 瑞雪 SDK 依赖（` + regionDesc + `环境）==========
// 核心库
implementation 'com.ruixue:` + channel + `:` + version + `'
// UI 组件库
` + uiDependency + `
// ========== 瑞雪 SDK 依赖 END ==========`

	// Gradle Properties 配置
	gradlePropsConfig := `# ========== 瑞雪 SDK 配置 ==========
android.useAndroidX=true
android.enableJetifier=true
# ========== 瑞雪 SDK 配置 END ==========`

	return nil, struct {
		Instructions      string `json:"instructions"`
		MavenRepoConfig   string `json:"mavenRepoConfig"`
		DependencyConfig  string `json:"dependencyConfig"`
		GradlePropsConfig string `json:"gradlePropsConfig"`
		Region            string `json:"region"`
	}{
		Instructions: `【你现在必须执行以下操作】

项目路径: ` + workspacePath + `
环境: ` + regionDesc + `
渠道: ` + channel + `

1. 添加 Maven 仓库配置
   - 检查项目使用的是 settings.gradle 还是 build.gradle 配置仓库
   - 文件路径: ` + workspacePath + `/settings.gradle 或 ` + workspacePath + `/build.gradle
   - 新版 Gradle: 在 settings.gradle 的 dependencyResolutionManagement.repositories 中添加
   - 旧版 Gradle: 在 build.gradle 的 allprojects.repositories 中添加
   - 使用下方 mavenRepoConfig 中的内容

2. 添加 SDK 依赖
   - 文件路径: ` + workspacePath + `/app/build.gradle
   - 在 dependencies 块中添加
   - 使用下方 dependencyConfig 中的内容

3. 配置 gradle.properties
   - 文件路径: ` + workspacePath + `/gradle.properties
   - 检查是否已有 android.enableJetifier=true
   - 如果没有，在文件末尾添加 gradlePropsConfig 中的内容

4. 同步 Gradle
   - 在 Android Studio 中点击 "Sync Project with Gradle Files"
   - 或执行: cd ` + workspacePath + ` && ./gradlew --refresh-dependencies

5. 完成后提醒用户:
   - 在 Application 类中配置 SDK 初始化
   - 调用 android_init 获取初始化代码`,

		MavenRepoConfig:   mavenRepoConfig,
		DependencyConfig:  dependencyConfig,
		GradlePropsConfig: gradlePropsConfig,
		Region:            region,
	}, nil
}

// AndroidSetupOldHandler 旧版 Android Setup Handler（保留兼容性，后续可删除）
func AndroidSetupOldHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
		Channel       string `json:"channel"`
	},
) (*mcp.CallToolResult, struct {
	Steps       json.RawMessage `json:"steps"`
	AgentGuide  string          `json:"agentGuide"`
	UserMessage string          `json:"userMessage"`
	Platform    string          `json:"platform"`
	Version     string          `json:"version"`
	Channel     string          `json:"channel"`
}, error) {

	// 设置默认值
	workspacePath := input.WorkspacePath
	if workspacePath == "" {
		workspacePath = "{workspace}"
	}

	version := input.Version
	if version == "" {
		version = SDK_VERSION
	}

	channel := input.Channel
	if channel == "" {
		channel = DEFAULT_CHANNEL
	}

	// 构建步骤列表（简化版）
	steps := []SetupStep{
		{
			ID:          "check_gradle_properties",
			Type:        StepTypeCheckFile,
			Description: "检查 gradle.properties 是否已配置 Jetifier",
			Target:      workspacePath + "/gradle.properties",
			Condition:   "文件内容包含 android.enableJetifier=true",
			Required:    false,
			OnSuccess:   "sync_gradle",
			OnFailure:   "add_jetifier",
			Note:        "Jetifier 用于 Support Library 到 AndroidX 的迁移",
		},
		{
			ID:          "add_jetifier",
			Type:        StepTypeEditFile,
			Description: "启用 Jetifier",
			Target:      workspacePath + "/gradle.properties",
			InsertAfter: "$",
			Content:     "\n# ========== 瑞雪 SDK 配置 ==========\nandroid.useAndroidX=true\nandroid.enableJetifier=true\n# ========== 瑞雪 SDK 配置 END ==========",
			Required:    true,
			OnSuccess:   "sync_gradle",
			Note:        "在文件末尾添加 Jetifier 配置",
		},
		{
			ID:          "sync_gradle",
			Type:        StepTypeRunCommand,
			Description: "同步 Gradle 项目",
			Target:      "./gradlew --refresh-dependencies",
			WorkingDir:  workspacePath,
			Required:    false,
			OnSuccess:   "setup_complete",
			OnFailure:   "sync_gradle_tip",
			Note:        "下载依赖并验证配置",
		},
		{
			ID:          "sync_gradle_tip",
			Type:        StepTypeUserInput,
			Description: "Gradle 同步提示",
			Content:     "请在 Android Studio 中点击 'Sync Project with Gradle Files' 按钮同步项目。\n如果同步失败，请检查网络连接和 Maven 仓库配置。",
			Required:    false,
			OnSuccess:   "setup_complete",
			Note:        "提示用户手动同步",
		},
		{
			ID:          "setup_complete",
			Type:        StepTypeUserInput,
			Description: "SDK 依赖配置完成",
			Content:     "瑞雪 SDK 依赖已成功配置！\n\n后续步骤：\n1. 在 Application 类中配置 SDK 初始化\n2. 在主 Activity 中调用初始化方法\n3. 配置 ProGuard 混淆规则（如开启混淆）\n\n提示：执行 android_init 可获取 SDK 初始化代码示例",
			Required:    false,
			Note:        "依赖配置完成后的提示信息",
		},
	}

	stepsJSON, _ := json.Marshal(steps)

	return nil, struct {
		Steps       json.RawMessage `json:"steps"`
		AgentGuide  string          `json:"agentGuide"`
		UserMessage string          `json:"userMessage"`
		Platform    string          `json:"platform"`
		Version     string          `json:"version"`
		Channel     string          `json:"channel"`
	}{
		Steps: stepsJSON,
		AgentGuide: `请按以下步骤执行 Android SDK 接入：
1. 检测项目使用的是 Groovy DSL 还是 Kotlin DSL（检查 settings.gradle.kts 是否存在）
2. 根据 Gradle 版本，在 settings.gradle 或 build.gradle 中添加 Maven 仓库配置
   - 新版 Gradle：在 settings.gradle 的 dependencyResolutionManagement.repositories 中添加
   - 旧版 Gradle：在 build.gradle 的 allprojects.repositories 中添加
3. 在 app/build.gradle 中添加 SDK 依赖
4. 检查并配置 gradle.properties 的 Jetifier 设置
5. 执行 Gradle Sync 或提示用户在 Android Studio 中同步

注意：
- 所有文件修改需要用户确认
- 根据渠道选择正确的 SDK 模块名称
- 如果同步失败，检查网络连接和仓库配置`,
		UserMessage: "即将为您的 Android 项目接入瑞雪 SDK " + version + "（渠道：" + channel + "）。\n完成后请在 Android Studio 中同步项目。",
		Platform:    "android",
		Version:     version,
		Channel:     channel,
	}, nil
}

// ==================== Android 统一 Handler ====================

// 工具描述前置条件
const androidPrerequisite = "【前置条件】使用前必须确保 SDK 已初始化，请先检查项目中是否有初始化代码，如未初始化请先调用 android feature=setup 和 android feature=init。"

// AndroidUnifiedHandler 统一处理所有 Android 功能请求
func AndroidUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature       string `json:"feature"`
		Region        string `json:"region"`
		WorkspacePath string `json:"workspacePath"`
		Channel       string `json:"channel"`
		Version       string `json:"version"`
		GradleType    string `json:"gradleType"`
		LoginType     string `json:"loginType"`
		CheckOnly     bool   `json:"checkOnly"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	feature := input.Feature

	switch feature {
	case "init":
		result, output, err := AndroidInitHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"code": output.Code, "dependencyHint": output.DependencyHint}, nil

	case "agent":
		result, output, err := AndroidAgentHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"guide": output.Guide}, nil

	case "dependency":
		result, output, err := AndroidAddDependencyHandler(ctx, req, struct {
			Channel    string `json:"channel"`
			Version    string `json:"version"`
			GradleType string `json:"gradleType"`
		}{Channel: input.Channel, Version: input.Version, GradleType: input.GradleType})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"code": output.Code}, nil

	case "setup":
		result, output, err := AndroidSetupHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			Channel       string `json:"channel"`
			Region        string `json:"region"`
			Version       string `json:"version"`
		}{WorkspacePath: input.WorkspacePath, Channel: input.Channel, Region: input.Region, Version: input.Version})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions":      output.Instructions,
			"mavenRepoConfig":   output.MavenRepoConfig,
			"dependencyConfig":  output.DependencyConfig,
			"gradlePropsConfig": output.GradlePropsConfig,
			"region":            output.Region,
		}, nil

	case "login":
		result, output, err := AndroidLoginHandler(ctx, req, struct {
			CheckOnly bool `json:"checkOnly"`
		}{CheckOnly: input.CheckOnly})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":       output.Spec,
			"usage":      output.Usage,
			"checkGuide": output.CheckGuide,
			"initCheck":  output.InitCheck,
		}, nil

	case "login_api":
		result, output, err := AndroidLoginApiHandler(ctx, req, struct {
			LoginType string `json:"loginType"`
			CheckOnly bool   `json:"checkOnly"`
		}{LoginType: input.LoginType, CheckOnly: input.CheckOnly})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":       output.Spec,
			"usage":      output.Usage,
			"checkGuide": output.CheckGuide,
			"initCheck":  output.InitCheck,
		}, nil

	case "payment":
		result, output, err := AndroidPaymentHandler(ctx, req, struct {
			CheckOnly bool `json:"checkOnly"`
		}{CheckOnly: input.CheckOnly})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":       output.Spec,
			"usage":      output.Usage,
			"checkGuide": output.CheckGuide,
			"initCheck":  output.InitCheck,
			"preflight":  androidPaymentPreflight(input.WorkspacePath),
		}, nil

	case "xingyi_payment":
		mode, modeErr := xingyiPaymentModeFromRequest(req)
		if modeErr != "" {
			return nil, map[string]any{"error": modeErr}, nil
		}
		var buf bytes.Buffer
		if err := androidXingYiPaymentTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":        buf.String(),
			"usage":       "按 paymentMode 接入星驿 App/H5 支付；hq_type 固定为 xy",
			"paymentMode": mode,
			"preflight":   androidXingYiPaymentPreflight(input.WorkspacePath, mode),
		}, nil

	case "unifypay":
		var buf bytes.Buffer
		if err := androidUnifypayTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "使用 UPPaySdkWrapper.getInstance().doPay 直接调用银联综合支付插件",
			"dependency": "com.ruixue:rxsdk_unifypay:4.0.17",
			"preflight":  androidUnifypayPreflight(input.WorkspacePath),
		}, nil

	case "huya":
		var buf bytes.Buffer
		if err := androidHuyaTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "使用瑞雪通用 API 接入虎牙初始化、method=huya 登录、hq_type=huya 支付和角色信息上报",
			"dependency": "com.ruixue:rxsdk_huya:4.0.17",
			"preflight":  androidHuyaPreflight(input.WorkspacePath),
		}, nil

	case "baidu":
		var buf bytes.Buffer
		if err := androidBaiduTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "接入百度 Android 渠道初始化、闪屏、method=baidunet 登录、通用支付、角色上报、悬浮窗和退出",
			"dependency": "com.ruixue:rxsdk_baidu_wangxun:4.0.18",
			"preflight":  androidBaiduPreflight(input.WorkspacePath),
		}, nil

	case "xuteng":
		var buf bytes.Buffer
		if err := androidXutengTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":       buf.String(),
			"usage":      "使用瑞雪通用 API 接入栩腾初始化、method=xuteng 登录、hq_type=xuteng 支付、角色上报、登出和退出",
			"dependency": "com.ruixue:rxsdk_xuteng:4.0.19",
			"preflight":  androidXutengPreflight(input.WorkspacePath),
		}, nil

	case "passport":
		result, output, err := AndroidPassportHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidPassportPreflight(input.WorkspacePath),
		}, nil

	case "captcha":
		result, output, err := AndroidCaptchaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "real_auth":
		result, output, err := AndroidRealAuthHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidIifaaRealAuthPreflight(input.WorkspacePath),
		}, nil

	case "account_binding":
		result, output, err := AndroidAccountBindingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "password":
		result, output, err := AndroidPasswordHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "deregister":
		result, output, err := AndroidDeregisterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "social":
		result, output, err := AndroidSocialHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "friends":
		result, output, err := AndroidFriendsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "lbs":
		result, output, err := AndroidLbsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "rank":
		result, output, err := AndroidRankHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_area":
		result, output, err := AndroidGameAreaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_character":
		result, output, err := AndroidGameCharacterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidSetGameInfoPreflight(input.WorkspacePath),
		}, nil

	case "mumu":
		result, output, err := AndroidMumuHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidMumuPreflight(input.WorkspacePath),
		}, nil

	case "gdt":
		result, output, err := AndroidGDTHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidGDTPreflight(input.WorkspacePath),
		}, nil

	case "share":
		result, output, err := AndroidShareHandler(ctx, req, struct{}{})
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
		result, output, err := AndroidFeedbackHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "tracking":
		result, output, err := AndroidTrackingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "version_check":
		result, output, err := AndroidVersionCheckHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidVersionCheckPreflight(input.WorkspacePath),
		}, nil

	case "legal":
		result, output, err := AndroidLegalHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "legal_ui":
		result, output, err := AndroidLegalUIHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "promo":
		result, output, err := AndroidPromoHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "announcement":
		result, output, err := AndroidAnnouncementHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "device":
		result, output, err := AndroidDeviceHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "user_center":
		result, output, err := AndroidUserCenterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "push":
		platforms, selectionError := pushPlatformsFromRequest(req, true)
		if selectionError != "" {
			return nil, map[string]any{
				"error":                  selectionError,
				"selectionRequired":      true,
				"supportedPushPlatforms": androidPushPlatformOptions(),
				"preflight":              androidPushPreflight(input.WorkspacePath, nil),
			}, nil
		}
		version := input.Version
		if version == "" {
			version = SDK_VERSION
		}
		return nil, map[string]any{
			"usage":                   "按用户选择接入 Android 推送平台，并使用 RxPushManager 初始化、注册 token 和处理通知点击",
			"selectedPushPlatforms":   platforms,
			"supportedPushPlatforms":  androidPushPlatformOptions(),
			"androidArtifacts":        androidPushArtifacts(platforms),
			"dependencyNote":          "所选平台组件会传递引入 rxsdk_push_base，无需额外声明",
			"gradleDependencies":      buildAndroidPushGradleDependencies(platforms, version, input.GradleType),
			"proguardConfig":          "-keep class com.ruixue.push.** { *; }",
			"android13Permission":     "Android 13+ 运行时请求 android.permission.POST_NOTIFICATIONS",
			"firebaseAdditionalSetup": pushPlatformSelected(platforms, "firebase"),
			"spec":                    "调用 RxPushManager.init(context)，登录成功后调用 registerToken；在 onCreate/onNewIntent 中调用 openAppCallback(intent)。",
			"preflight":               androidPushPreflight(input.WorkspacePath, platforms),
		}, nil

	case "topon":
		result, output, err := AndroidTopOnHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "firebase":
		result, output, err := AndroidFirebaseHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidFirebasePreflight(input.WorkspacePath),
		}, nil

	case "adjust":
		result, output, err := AndroidAdjustHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": androidAdjustPreflight(input.WorkspacePath),
		}, nil

	default:
		return nil, map[string]any{"error": "未知的功能模块: " + feature}, nil
	}
}

// ==================== Android 工具注册 ====================

func registerAndroidTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "android",
			Description: mcpToolCallRequirement + `

Android SDK 代码生成工具。根据 feature 参数生成不同功能模块的代码。

【可用功能模块 (feature)】
基础接入:
- init: SDK 初始化代码
- agent: 接入流程指南
- dependency: Gradle 依赖配置
- setup: 自动化接入

用户登录:
- login: UI 登录
- login_api: API 登录（非 UI，自定义界面）

支付:
- payment: 通用支付功能（保留原有渠道兼容说明）
- xingyi_payment: 独立星驿支付（App/H5，Android SDK >= 4.0.14）
- unifypay: 银联综合支付（UPPaySdkWrapper.getInstance().doPay，minSdkVersion >= 22）
- huya: 虎牙联运（Android SDK >= 4.0.17）
- baidu: 百度游戏渠道（仅 Android，Android SDK >= 4.0.18）
- xuteng: 栩腾渠道（仅 Android，Android SDK >= 4.0.19，minSdkVersion >= 23）

用户通行证:
- passport: 登录/注册/指定用户信息
- captcha: 验证码（手机/邮箱）
- real_auth: 实名认证 / 支付宝 IIFAA 实名
- account_binding: 账号绑定（第三方账号/手机/邮箱）
- password: 密码管理
- deregister: 账号注销

社交功能:
- social: 社交关系
- friends: 好友管理
- lbs: LBS 定位
- rank: 排行榜

游戏功能:
- game_area: 游戏区服
- game_character: 游戏角色
- mumu: MuMu/Yofun Android 渠道接入（最低 4.0.16）
- gdt: 腾讯广告 GDT/广点通转化上报（GDTSdkWrapper，最低 4.0.16）

其他功能:
- share: 分享
- feedback: 反馈/客服
- tracking: 数据埋点
- version_check: 瑞雪版本检查 v2（updateGameVersion）
- legal: 法务条款（API）
- legal_ui: 法务 UI（协议页面、隐私政策弹窗）
- promo: 达人福利
- announcement: 公告/邮件
- device: 设备信息
- user_center: 用户中心/帮助中心/客服
- push: Android 推送；必须先通过 pushPlatforms 让用户选择 FCM/厂商推送平台

组件库接入:
- topon: TopOn（AnyThink）广告聚合（激励视频/插屏/开屏/横幅/原生）
- firebase: Firebase（Analytics / Crashlytics / FCM 推送）
- adjust: Adjust 归因分析（事件/收入/深链/隐私合规）

【参数说明】
- feature: 必填，功能模块名称
- paymentMode: xingyi_payment 支付模式 app/h5/both，默认 both
- region: 环境类型 domestic(国内)/overseas(海外)，setup 需要
- workspacePath: 项目路径；setup、game_character、mumu、gdt 等需要实际 preflight 的功能应传入
- channel: SDK 渠道，dependency/setup 需要
- version: SDK 版本号（setup/dependency 必填，请向瑞雪技术支持获取最新版本）
- gradleType: groovy 或 kts，dependency 需要
- loginType: 登录类型，login_api 需要
- checkOnly: 仅检查模式，login/login_api/payment 需要
- pushPlatforms: Android 推送平台列表，feature=push 必填；必须先询问用户，可多选 firebase/huawei/honor/xiaomi/oppo/vivo/meizu`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum": []string{
							"init", "agent", "dependency", "setup",
							"login", "login_api", "payment", "xingyi_payment", "unifypay", "huya", "baidu", "xuteng",
							"passport", "captcha", "real_auth", "account_binding", "password", "deregister",
							"social", "friends", "lbs", "rank",
							"game_area", "game_character", "mumu", "gdt",
							"share", "feedback", "tracking", "version_check", "legal", "legal_ui", "promo", "announcement", "device", "user_center", "push",
							"topon", "firebase", "adjust",
						},
					},
					"region": map[string]any{
						"type":        "string",
						"description": "环境类型：domestic(国内) 或 overseas(海外)",
						"enum":        []string{"domestic", "overseas"},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "Android 项目工作目录的绝对路径",
					},
					"channel": map[string]any{
						"type":        "string",
						"description": "SDK 渠道。国内：rxsdk_weile(自运营)、rxsdk_huawei(华为)、rxsdk_xiaomi(小米)、rxsdk_vivo、rxsdk_oppo、rxsdk_ysdk(应用宝)、rxsdk_taptap、rxsdk_bilibili、rxsdk_9game(九游)、rxsdk_4399、rxsdk_honor(荣耀)、rxsdk_kwaiallin(快手联运)、rxsdk_kwai_buy(快手买量)、rxsdk_douyin_gb(抖音)、rxsdk_xuteng(旭腾)、rxsdk_baidu_wangxun(百度网讯)、rxsdk_007、rxsdk_quick、rxsdk_ld(雷电模拟器)、rxsdk_yofun(MuMu)、rxsdk_huya(虎牙联运)。海外渠道：rxsdk_overseas(Google Play)、rxsdk_rustore(RuStore)、rxsdk_apkpure(Apkpure/VGamePop)、rxsdk_overseas_oppo(海外OPPO)、rxsdk_overseas_huawei(华为HMS海外)、rxsdk_qoo(QooApp)、rxsdk_overseas_weizhi(微知/JF)。海外辅助插件：rxsdk_google(Google登录/Pay)、rxsdk_facebook、rxsdk_line、rxsdk_instagram、rxsdk_reddit、rxsdk_snapchat、rxsdk_tiktok、rxsdk_twitter、rxsdk_zalo、rxsdk_vk(JDK17+)。分析插件：rxsdk_adjust、rxsdk_firebase、rxsdk_infinix(Transsion广告)。支付插件（叠加宿主）：rxsdk_xingyi(星驿/星轶 App，≥4.0.14)、rxsdk_h5pay(含星驿 H5，≥4.0.14)、rxsdk_weixin_withpay、rxsdk_alipay",
					},
					"version": map[string]any{
						"type":        "string",
						"description": "SDK 版本号（setup/dependency 必填，请向瑞雪技术支持获取最新版本，如 4.0.14；星驿/星轶支付要求 ≥4.0.14）",
					},
					"gradleType": map[string]any{
						"type":        "string",
						"description": "Gradle 类型：groovy 或 kts",
						"enum":        []string{"groovy", "kts"},
					},
					"loginType": map[string]any{
						"type":        "string",
						"description": "登录类型：USERNAME/CAPTCHACODE/GUEST/GOOGLE/WECHAT/all",
						"enum":        []string{"USERNAME", "CAPTCHACODE", "GUEST", "GOOGLE", "WECHAT", "all"},
					},
					"checkOnly": map[string]any{
						"type":        "boolean",
						"description": "仅检查现有代码，不插入新代码",
					},
					"paymentMode": map[string]any{
						"type":        "string",
						"description": "星驿支付模式：app、h5 或 both（默认）",
						"enum":        []string{"app", "h5", "both"},
						"default":     "both",
					},
					"pushPlatforms": map[string]any{
						"type":        "array",
						"description": "需要接入的 Android 推送平台，可多选；feature=push 时禁止默认猜测，必须先询问用户",
						"minItems":    1,
						"uniqueItems": true,
						"items": map[string]any{
							"type": "string",
							"enum": androidPushPlatformNames(),
						},
					},
				},
				"required": []string{"feature"},
			},
		},
		AndroidUnifiedHandler,
	)
}
