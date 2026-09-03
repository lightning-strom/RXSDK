package rxsdk

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const unitySDKPackageName = "com.ruixue.unitysdk.base"
const unitySDKDefaultVersion = "1.6.26"
const unityTempNoticeMinVersion = "1.6.28"
const unityPushIOSMinVersion = "4.0.8"

var (
	unitySDKRegistryPackageURL = "http://60.205.123.114:4873/" + unitySDKPackageName
	unitySDKRegistryHTTPClient = &http.Client{Timeout: 5 * time.Second}
)

var unityDefaultPackageNames = []string{
	"com.ruixue.unitysdk.base",
	"com.ruixue.unitysdk.share",
	"com.ruixue.unitysdk.login",
	"com.ruixue.unitysdk.pay",
}

var unityDefaultPackageSet = map[string]bool{
	"com.ruixue.unitysdk.base":  true,
	"com.ruixue.unitysdk.share": true,
	"com.ruixue.unitysdk.login": true,
	"com.ruixue.unitysdk.pay":   true,
}

var unityFeaturePackageNames = map[string]string{
	"init":            "com.ruixue.unitysdk.base",
	"login":           "com.ruixue.unitysdk.login",
	"payment":         "com.ruixue.unitysdk.pay",
	"xingyi_payment":  "com.ruixue.unitysdk.xingyi",
	"unifypay":        "com.ruixue.unitysdk.pay",
	"huya":            "com.ruixue.unitysdk.base",
	"baidu":           "com.ruixue.unitysdk.base",
	"xuteng":          "com.ruixue.unitysdk.base",
	"passport":        "com.ruixue.unitysdk.login",
	"captcha":         "com.ruixue.unitysdk.login",
	"real_auth":       "com.ruixue.unitysdk.login",
	"account_binding": "com.ruixue.unitysdk.login",
	"password":        "com.ruixue.unitysdk.login",
	"deregister":      "com.ruixue.unitysdk.login",
	"social":          "com.ruixue.unitysdk.social",
	"friends":         "com.ruixue.unitysdk.social",
	"lbs":             "com.ruixue.unitysdk.lbs",
	"rank":            "com.ruixue.unitysdk.rank",
	"game_character":  "com.ruixue.unitysdk.base",
	"mumu":            "com.ruixue.unitysdk.base",
	"gdt":             "com.ruixue.unitysdk.gdt",
	"share":           "com.ruixue.unitysdk.share",
	"feedback":        "com.ruixue.unitysdk.feedback",
	"tracking":        "com.ruixue.unitysdk.analysis",
	"legal_ui":        "com.ruixue.unitysdk.legal",
	"user_center":     "com.ruixue.unitysdk.helpcenter",
	"ad":              "com.ruixue.unitysdk.ad",
	"push":            "com.ruixue.unitysdk.push",
	"version_check":   "com.ruixue.unitysdk.versioncheck",
	"review":          "com.ruixue.unitysdk.review",
	"announcement":    "com.ruixue.unitysdk.base",
	"minigame_weixin": "com.ruixue.unitysdk.minigame.weixin",
	"minigame_douyin": "com.ruixue.unitysdk.minigame.douyin",
}

var unityFeatureAdditionalPackageNames = map[string][]string{
	"baidu":           {"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay"},
	"mumu":            {"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay"},
	"huya":            {"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay"},
	"xuteng":          {"com.ruixue.unitysdk.login", "com.ruixue.unitysdk.pay"},
	"payment":         {"com.ruixue.unitysdk.google"},
	"minigame_douyin": {"com.ruixue.unitysdk.share", "com.ruixue.unitysdk.pay"},
}

// ==================== Unity 返回结构 ====================

type UnitySpecResult struct {
	Spec      string `json:"spec"`
	Usage     string `json:"usage"`
	InitCheck string `json:"initCheck"`
}

type UnityComponentDependency struct {
	PackageName     string `json:"packageName"`
	Version         string `json:"version"`
	ManifestEntry   string `json:"manifestEntry"`
	DefaultIncluded bool   `json:"defaultIncluded"`
	Note            string `json:"note"`
}

type unityNativeDependencyUpgradeData struct {
	UnityMinVersion   string
	UnityPackages     []unityPackageVersion
	UnityPackageNames string
	UnityUpgradeSteps []string
	AndroidMinVersion string
	AndroidFailure    string
	IOSPods           []unityPodVersion
	IOSPodNames       string
	IOSUpgradeSteps   []string
	IOSFailure        string
}

type unityPackageVersion struct {
	Name    string
	Version string
}

type unityPodVersion struct {
	Name    string
	Version string
}

var unityBindAccountNativeDependencyUpgrade = unityNativeDependencyUpgradeData{
	UnityMinVersion:   "1.6.22",
	UnityPackages:     []unityPackageVersion{{Name: "com.ruixue.unitysdk.base", Version: "1.6.22"}},
	UnityPackageNames: "com.ruixue.unitysdk.base",
	UnityUpgradeSteps: []string{
		"编辑 Packages/manifest.json，将 com.ruixue.unitysdk.base 更新到 1.6.22 或更高版本",
		"如果已有 com.ruixue.unitysdk.login、share、pay 等 com.ruixue.* 依赖，将它们同步到同一版本",
	},
	AndroidMinVersion: "4.0.8",
	AndroidFailure:    "低于 4.0.8 时 RXSdkApiImpl 没有 bindAccount(Activity, Map, UnityRXRequestCallback) 重载，会触发 AndroidJavaException/NoSuchMethodError",
	IOSPods: []unityPodVersion{
		{Name: "RXSDK_Pure", Version: "4.0.2"},
		{Name: "RXFacebookSDK", Version: "4.0.0"},
		{Name: "RXGoogleSDK", Version: "4.0.0"},
	},
	IOSPodNames: "RXSDK_Pure、RXFacebookSDK、RXGoogleSDK",
	IOSUpgradeSteps: []string{
		"编辑 Podfile 或 Unity 使用的 PodfileTemplate，将 RXSDK_Pure 升级到 4.0.2 或更高",
		"如果使用 Facebook / Google 绑定，将 RXFacebookSDK / RXGoogleSDK 升级到 4.0.0 或更高",
		"在 iOS 工程目录执行 pod update RXSDK_Pure RXFacebookSDK RXGoogleSDK；如果仅使用其中部分 Pod，只更新实际存在的 Pod",
		"pod update 失败时执行 pod repo update 后重试",
	},
	IOSFailure: "低于要求版本时 bindAccountWithExt 或对应三方绑定实现可能不存在或行为不完整",
}

var unityVersionCheckNativeDependencyUpgrade = unityNativeDependencyUpgradeData{
	UnityMinVersion: versionCheckUnityMinVersion,
	UnityPackages: []unityPackageVersion{
		{Name: "com.ruixue.unitysdk.base", Version: versionCheckUnityMinVersion},
		{Name: "com.ruixue.unitysdk.versioncheck", Version: versionCheckUnityMinVersion},
	},
	UnityPackageNames: "com.ruixue.unitysdk.base、com.ruixue.unitysdk.versioncheck",
	UnityUpgradeSteps: []string{
		"编辑 Packages/manifest.json，将 com.ruixue.unitysdk.base 与 com.ruixue.unitysdk.versioncheck 更新到 1.6.39 或更高版本",
		"如果已有 com.ruixue.* 依赖，将它们同步到 1.6.39 或更高版本",
	},
	AndroidMinVersion: versionCheckAndroidMinVersion,
	AndroidFailure:    "低于 4.0.13 时 Android 原生 SDK 可能没有 updateGameVersion(Map, UnityRXRequestCallback) 桥接重载，Unity 调用会失败",
	IOSPods: []unityPodVersion{
		{Name: "RXSDK_Pure", Version: versionCheckIOSMinVersion},
	},
	IOSPodNames: "RXSDK_Pure",
	IOSUpgradeSteps: []string{
		"编辑 Unity iOS 导出工程 Podfile 或 PodfileTemplate，将 RXSDK_Pure 升级到 4.0.8 或更高",
		"在 iOS 工程目录执行 pod update RXSDK_Pure；失败时执行 pod repo update 后重试",
	},
	IOSFailure: "低于 4.0.8 时 updateGameVersionWithInfo:complete: 缺少版本检查 v2 初始化白名单支持",
}

var unityIifaaRealAuthNativeDependencyUpgrade = unityNativeDependencyUpgradeData{
	UnityMinVersion: "1.6.31",
	UnityPackages: []unityPackageVersion{
		{Name: "com.ruixue.unitysdk.base", Version: "1.6.31"},
		{Name: "com.ruixue.unitysdk.login", Version: "1.6.31"},
		{Name: "com.ruixue.unitysdk.ui", Version: "1.6.31"},
	},
	UnityPackageNames: "com.ruixue.unitysdk.base、com.ruixue.unitysdk.login、com.ruixue.unitysdk.ui",
	UnityUpgradeSteps: []string{
		"编辑 Packages/manifest.json，将 com.ruixue.unitysdk.base、com.ruixue.unitysdk.login、com.ruixue.unitysdk.ui 更新到 1.6.31 或更高版本",
		"如果项目使用海外 UI，将 com.ruixue.unitysdk.uioverseas 也同步到 1.6.31 或更高版本",
	},
	AndroidMinVersion: "4.0.14",
	AndroidFailure:    "低于 4.0.14 时支付宝 IIFAA 实名接口可能不存在或缺少 Unity 回调重载，无法完成授权跳转和认证结果查询",
	IOSPods: []unityPodVersion{
		{Name: "RXSDK_Pure", Version: "4.0.6"},
		{Name: "RXUIKit", Version: "4.0.4"},
	},
	IOSPodNames: "RXSDK_Pure、RXUIKit",
	IOSUpgradeSteps: []string{
		"编辑 Podfile 或 Unity 使用的 PodfileTemplate，将 RXSDK_Pure 升级到 4.0.6 或更高",
		"如果使用瑞雪实名认证 UI，将 RXUIKit 升级到 4.0.4 或更高",
		"在 iOS 工程目录执行 pod update RXSDK_Pure RXUIKit；如果仅使用其中部分 Pod，只更新实际存在的 Pod",
		"pod update 失败时执行 pod repo update 后重试",
	},
	IOSFailure: "低于要求版本时 getIIFAARedirectURLWithAppName、getIIFAAResultWithSource 或 RXUIKit 实名 UI 可能不存在或行为不完整",
}

var unityUserInfoByFieldNativeDependencyUpgrade = unityNativeDependencyUpgradeData{
	UnityMinVersion: "1.6.26",
	UnityPackages: []unityPackageVersion{
		{Name: "com.ruixue.unitysdk.base", Version: "1.6.26"},
		{Name: "com.ruixue.unitysdk.login", Version: "1.6.26"},
	},
	UnityPackageNames: "com.ruixue.unitysdk.base、com.ruixue.unitysdk.login",
	UnityUpgradeSteps: []string{
		"编辑 Packages/manifest.json，将 com.ruixue.unitysdk.base、com.ruixue.unitysdk.login 更新到 1.6.26 或更高版本",
		"如果已有 com.ruixue.* 其他依赖，将它们同步到同一版本以避免桥接方法不一致",
	},
	AndroidMinVersion: "4.0.9",
	AndroidFailure:    "低于 4.0.9 时 Android 原生 RXSdkApi 可能不存在 getUserInfoByField 相关能力",
	IOSPods: []unityPodVersion{
		{Name: "RXSDK_Pure", Version: "4.0.4"},
	},
	IOSPodNames: "RXSDK_Pure",
	IOSUpgradeSteps: []string{
		"编辑 Podfile 或 Unity 使用的 PodfileTemplate，将 RXSDK_Pure 升级到 4.0.4 或更高",
		"在 iOS 工程目录执行 pod update RXSDK_Pure",
		"pod update 失败时执行 pod repo update 后重试",
	},
	IOSFailure: "低于 4.0.4 时 iOS 原生 getUserInfoByFieldWithParams:complete: 接口可能不存在",
}

var unityTempNoticeNativeDependencyUpgrade = unityNativeDependencyUpgradeData{
	UnityMinVersion: "1.6.28",
	UnityPackages: []unityPackageVersion{
		{Name: "com.ruixue.unitysdk.base", Version: "1.6.28"},
	},
	UnityPackageNames: "com.ruixue.unitysdk.base",
	UnityUpgradeSteps: []string{
		"编辑 Packages/manifest.json，将 com.ruixue.unitysdk.base 更新到 1.6.28 或更高版本",
		"如果已有 com.ruixue.unitysdk.login、share、pay 等 com.ruixue.* 依赖，将它们同步到 1.6.28 或更高版本，避免桥接方法版本不一致",
	},
	AndroidMinVersion: "4.0.9",
	AndroidFailure:    "低于 4.0.9 时 Android 原生 SDK 可能不存在 getTempNotice 回调接口或 Unity 桥接方法",
	IOSPods: []unityPodVersion{
		{Name: "RXSDK_Pure", Version: "4.0.4"},
	},
	IOSPodNames: "RXSDK_Pure",
	IOSUpgradeSteps: []string{
		"编辑 Podfile 或 Unity 使用的 PodfileTemplate，将 RXSDK_Pure 升级到 4.0.4 或更高",
		"在 iOS 工程目录执行 pod update RXSDK_Pure",
		"pod update 失败时执行 pod repo update 后重试",
	},
	IOSFailure: "低于 4.0.4 时 iOS 原生 getTempNotice: 接口可能不存在",
}

// ==================== Unity Handlers ====================

func UnityInitHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, struct {
	Code           string `json:"code"`
	DependencyHint string `json:"dependencyHint"`
}, error) {
	var buf bytes.Buffer
	if err := unityInitTpl.Execute(&buf, nil); err != nil {
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
		DependencyHint: "Before using this code, please install the SDK via UPM or .unitypackage first. Use unity feature=dependency for installation instructions.",
	}, nil
}

func UnityAddDependencyHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Version     string `json:"version"`
		InstallType string `json:"installType"`
	},
) (*mcp.CallToolResult, struct {
	Code string `json:"code"`
}, error) {
	version := input.Version
	if version == "" {
		version = unitySDKDefaultVersion
	}

	var buf bytes.Buffer
	if err := unityDependencyTpl.Execute(&buf, struct {
		Version             string
		DefaultDependencies string
	}{
		Version:             version,
		DefaultDependencies: unityDependencyLines(unityDefaultPackageNames, version),
	}); err != nil {
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

func unityFeatureDependencyVersion(feature string, version string) string {
	if version == "" {
		version = unitySDKDefaultVersion
	}
	if feature == "announcement" && compareVersion(cleanVersion(version), unityTempNoticeMinVersion) < 0 {
		return unityTempNoticeMinVersion
	}
	if feature == "version_check" && compareVersion(cleanVersion(version), versionCheckUnityMinVersion) < 0 {
		return versionCheckUnityMinVersion
	}
	if feature == "game_character" &&
		compareVersion(cleanVersion(version), gameInfoUnityMinVersion) < 0 {
		return gameInfoUnityMinVersion
	}
	if feature == "mumu" && compareVersion(cleanVersion(version), mumuUnityMinVersion) < 0 {
		return mumuUnityMinVersion
	}
	if feature == "gdt" && compareVersion(cleanVersion(version), gdtUnityMinVersion) < 0 {
		return gdtUnityMinVersion
	}
	if feature == "huya" && compareVersion(cleanVersion(version), huyaUnityMinVersion) < 0 {
		return huyaUnityMinVersion
	}
	if feature == "baidu" && compareVersion(cleanVersion(version), baiduUnityMinVersion) < 0 {
		return baiduUnityMinVersion
	}
	if feature == "xuteng" && compareVersion(cleanVersion(version), xutengUnityMinVersion) < 0 {
		return xutengUnityMinVersion
	}
	if feature == "push" && compareVersion(cleanVersion(version), unityPushIOSMinVersion) < 0 {
		return unityPushIOSMinVersion
	}
	return version
}

func fetchLatestUnitySDKVersion(ctx context.Context) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, unitySDKRegistryPackageURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "application/json")

	resp, err := unitySDKRegistryHTTPClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("获取 %s 最新版本失败: %w", unitySDKPackageName, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return "", fmt.Errorf("获取 %s 最新版本失败: registry 返回状态码 %d", unitySDKPackageName, resp.StatusCode)
	}

	var metadata struct {
		DistTags map[string]string `json:"dist-tags"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&metadata); err != nil {
		return "", fmt.Errorf("解析 %s registry 元数据失败: %w", unitySDKPackageName, err)
	}

	latest := strings.TrimSpace(metadata.DistTags["latest"])
	if latest == "" {
		return "", fmt.Errorf("registry 元数据中未找到 %s 的 dist-tags.latest", unitySDKPackageName)
	}

	return latest, nil
}

func unityDependencyLines(packages []string, version string) string {
	var builder strings.Builder
	for i, packageName := range packages {
		if i > 0 {
			builder.WriteByte('\n')
		}
		comma := ","
		if i == len(packages)-1 {
			comma = ""
		}
		builder.WriteString(fmt.Sprintf(`      "%s": "%s"%s`, packageName, version, comma))
	}
	return builder.String()
}

func unityComponentDependency(ctx context.Context, feature string, version string) (*UnityComponentDependency, error) {
	packageName, ok := unityFeaturePackageNames[feature]
	if !ok {
		return nil, nil
	}

	return unityComponentDependencyForPackage(packageName, version), nil
}

func unityComponentDependencyForPackage(packageName string, version string) *UnityComponentDependency {
	if version == "" {
		version = unitySDKDefaultVersion
	}

	defaultIncluded := unityDefaultPackageSet[packageName]
	note := "此功能依赖默认接入包，执行 unity feature=setup 时会自动写入。"
	if !defaultIncluded {
		note = "如果当前项目编译提示接口/类型不存在，请将此组件库追加到 Packages/manifest.json 的 dependencies，版本号与 base 保持一致。"
	}

	return &UnityComponentDependency{
		PackageName:     packageName,
		Version:         version,
		ManifestEntry:   fmt.Sprintf(`"%s": "%s"`, packageName, version),
		DefaultIncluded: defaultIncluded,
		Note:            note,
	}
}

func unityAdditionalComponentDependencies(feature string, version string) []UnityComponentDependency {
	packageNames := unityFeatureAdditionalPackageNames[feature]
	if len(packageNames) == 0 {
		return nil
	}

	dependencies := make([]UnityComponentDependency, 0, len(packageNames))
	for _, packageName := range packageNames {
		dependencies = append(dependencies, *unityComponentDependencyForPackage(packageName, version))
	}
	return dependencies
}

func unitySpecResponse(ctx context.Context, result *mcp.CallToolResult, output UnitySpecResult, feature string, version string) (*mcp.CallToolResult, map[string]any, error) {
	version = unityFeatureDependencyVersion(feature, version)
	response := map[string]any{
		"spec":      output.Spec,
		"usage":     output.Usage,
		"initCheck": output.InitCheck,
	}

	dependency, err := unityComponentDependency(ctx, feature, version)
	if err != nil {
		return nil, nil, err
	}
	if dependency != nil {
		response["componentDependency"] = dependency
	}
	if additionalDependencies := unityAdditionalComponentDependencies(feature, version); len(additionalDependencies) > 0 {
		response["additionalComponentDependencies"] = additionalDependencies
	}

	return result, response, nil
}

func UnityAgentHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, struct {
	Guide string `json:"guide"`
}, error) {
	version := unitySDKDefaultVersion

	data := AgentData{
		Channel: DEFAULT_CHANNEL,
		Version: version,
	}

	var buf bytes.Buffer
	if err := unityAgentTpl.Execute(&buf, data); err != nil {
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

func UnityLoginHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityLoginTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "登录功能：游客登录、账号密码登录、验证码登录、第三方登录",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityAppleSigninConfigHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityAppleSigninTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "Unity Sign in with Apple 工程配置：生成显式 iOS PostBuild 并复用宿主 entitlements",
		InitCheck: "该功能只配置 Unity iOS 导出工程；必须显式调用，不影响普通 login 和其他登录方式。",
	}, nil
}

func UnityPaymentHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityPaymentTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "支付功能：下单、Android Google 商品详情查询、iOS 商品信息查询",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityPassportHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityPassportTpl.Execute(&buf, map[string]any{
		"NativeDependencyUpgrade": unityUserInfoByFieldNativeDependencyUpgrade,
	}); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "用户通行证功能：登录、注册、登出、指定用户信息查询、用户信息管理、全局回调",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityCaptchaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityCaptchaTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "验证码功能：发送验证码、校验验证码",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityRealAuthHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityRealAuthTpl.Execute(&buf, map[string]any{
		"NativeDependencyUpgrade": unityIifaaRealAuthNativeDependencyUpgrade,
	}); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "实名认证功能：身份验证、支付宝 IIFAA 实名",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityAccountBindingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityAccountBindingTpl.Execute(&buf, map[string]any{
		"NativeDependencyUpgrade": unityBindAccountNativeDependencyUpgrade,
	}); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "账号绑定功能：绑定第三方账号，绑定/解绑/修改手机号、邮箱",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityPasswordHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityPasswordTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "密码管理功能：修改密码、重置密码、密码强度设置",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityDeregisterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityDeregisterTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "账号注销功能：申请注销、撤销注销",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnitySocialHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unitySocialTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "社交关系功能：设置自定义关系、查询关系列表",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityFriendsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityFriendsTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "好友管理功能：添加/删除好友、好友列表",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityLbsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityLbsTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:  buf.String(),
		Usage: "瑞雪 LBS 高德定位：Android/iOS 定位初始化、权限配置、获取位置及 Android 定时上报",
		InitCheck: `【前置条件检查】
1. 安装 com.ruixue.unitysdk.lbs，版本与 com.ruixue.unitysdk.base 保持一致。
2. Android 接入 com.ruixue:rxsdk_gaode 并配置高德 AMAP_APIKEY，调用 RXLBSAndroid.InitLocation 后再开始定位。
3. iOS 确认 RXLBSKit Pod 已安装；MCP 会维护 RuiXueSDK_LBSXcodeSetting.asset，导出时自动写入定位权限和 UIBackgroundModes/location。
4. 调用 RXLBSIOS.Init(appKey) 后再获取位置。
5. 仅使用设备定位时无需调用社交 LBS；使用 Android 定时定位上报重载前，需先完成瑞雪 SDK 初始化。`,
	}, nil
}

func UnityRankHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityRankTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "排行榜功能：增加/设置分数、查询排名、好友排行榜",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityShareHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityShareTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "分享功能：分享调度、获取分享数据、发起分享、短链接",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityFeedbackHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityFeedbackTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "反馈功能：创建反馈、满意度评价、帮助中心、客服会话",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityTrackingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityTrackingTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "数据埋点功能：事件上报、公共属性管理",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityLegalUIHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityLegalUITpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "法务功能：获取法务配置、隐私协议",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityPromoHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityPromoTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "达人福利功能：获取/兑换福利码",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityAnnouncementHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityAnnouncementTpl.Execute(&buf, map[string]any{
		"NativeDependencyUpgrade": unityTempNoticeNativeDependencyUpgrade,
	}); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "公告/邮件功能：获取公告、临时维护公告、邮件列表、领取道具",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityDeviceHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityDeviceTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "设备信息功能：获取设备码、配置管理、自定义请求、跳转商店",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityUserCenterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityUserCenterTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "用户中心功能：帮助中心、客服会话、图形验证码",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityAdHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityAdTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "广告功能：激励广告、Banner 广告、插屏广告",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityPushHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityPushTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "推送功能：初始化推送、注册/反注册、推送别名",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityVersionCheckHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityVersionCheckTpl.Execute(&buf, unityVersionCheckNativeDependencyUpgrade); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "瑞雪版本检查 v2：RXVersionCheck.UpdateGameVersion 统一模块版本检查",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityReviewHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityReviewTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "应用商店评分：跳转应用商店",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityGameAreaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityGameAreaTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "游戏区服功能：查询区服信息、区服列表",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityGameCharacterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityGameCharacterTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "游戏角色功能：SetGameInfo 上报瑞雪、SetThirdGameInfo 上报三方渠道、角色 CRUD",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityMumuHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityMumuTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "MuMu/Yofun Unity Android 渠道：公共 UPM、Android 配置、通用闪屏、登录和角色事件",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityGDTHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityGDTTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "GDT：移动 Android/iOS 转化归因与微信小游戏 ReportGdt/直玩广告能力",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityMiniGameWeiXinHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityMiniGameWeiXinTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "微信小游戏（WebGL）专属能力：内容安全、客服、补单、开放数据域/云存储、分享、订阅消息、广告、公告/邮件、反馈、达人福利、数据上报、区服角色",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

func UnityMiniGameDouYinHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, UnitySpecResult, error) {
	var buf bytes.Buffer
	if err := unityMiniGameDouYinTpl.Execute(&buf, nil); err != nil {
		return nil, UnitySpecResult{}, err
	}
	return nil, UnitySpecResult{
		Spec:      buf.String(),
		Usage:     "抖音小游戏（WebGL）专属能力：抖音支付扩展、录屏、分享（视频/邀请）、客服、启动参数（依赖 StarkSDK）",
		InitCheck: UnityInitCheckGuide,
	}, nil
}

// ==================== Unity Setup Handler ====================

func UnitySetupHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		Version       string `json:"version"`
		InstallType   string `json:"installType"`
	},
) (*mcp.CallToolResult, struct {
	Instructions string `json:"instructions"`
	InstallType  string `json:"installType"`
}, error) {

	version := input.Version
	if version == "" {
		version = unitySDKDefaultVersion
	}

	workspacePath := input.WorkspacePath
	installType := input.InstallType
	if installType == "" {
		installType = "upm"
	}

	var buf bytes.Buffer
	if err := unitySetupTpl.Execute(&buf, struct {
		WorkspacePath       string
		Version             string
		InstallType         string
		DefaultDependencies string
	}{
		WorkspacePath:       workspacePath,
		Version:             version,
		InstallType:         installType,
		DefaultDependencies: unityDependencyLines(unityDefaultPackageNames, version),
	}); err != nil {
		return nil, struct {
			Instructions string `json:"instructions"`
			InstallType  string `json:"installType"`
		}{}, err
	}

	return nil, struct {
		Instructions string `json:"instructions"`
		InstallType  string `json:"installType"`
	}{
		Instructions: buf.String(),
		InstallType:  installType,
	}, nil
}

// ==================== Unity 统一 Handler ====================

func UnityUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
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
	},
) (toolResult *mcp.CallToolResult, response map[string]any, handlerErr error) {
	if unityProjectSupportsAsmdefPreflight(input.WorkspacePath) {
		defer func() {
			if handlerErr != nil || response == nil {
				return
			}
			asmdefPreflight := unityAsmdefPreflight(input.WorkspacePath)
			if existing, ok := response["preflight"].(PassportPreflightResult); ok {
				response["preflight"] = mergePassportPreflightResults(existing, asmdefPreflight)
			} else {
				response["preflight"] = asmdefPreflight
			}
		}()
	}
	feature := normalizeUnityFeature(input.Feature)

	switch feature {
	case "init":
		result, output, err := UnityInitHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, androidSetup, err := UnityAndroidNativeSetupHandler(ctx, req, struct {
			WorkspacePath  string   `json:"workspacePath"`
			Region         string   `json:"region"`
			Channel        string   `json:"channel"`
			AndroidVersion string   `json:"androidVersion"`
			Components     []string `json:"components"`
			ApplicationID  string   `json:"applicationId"`
		}{
			WorkspacePath:  input.WorkspacePath,
			Region:         input.Region,
			Channel:        input.Channel,
			AndroidVersion: input.AndroidVersion,
			Components:     input.Components,
			ApplicationID:  unityParam(input.Params, "applicationId", ""),
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"code":                 output.Code,
			"dependencyHint":       output.DependencyHint,
			"androidProjectConfig": androidSetup.Instructions,
			"applicationId":        androidSetup.ApplicationID,
			"preflight":            androidSetup.Preflight,
		}, nil

	case "agent":
		result, output, err := UnityAgentHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"guide": output.Guide}, nil

	case "dependency":
		result, output, err := UnityAddDependencyHandler(ctx, req, struct {
			Version     string `json:"version"`
			InstallType string `json:"installType"`
		}{Version: input.Version, InstallType: input.InstallType})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"code": output.Code}, nil

	case "setup":
		result, output, err := UnitySetupHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			Version       string `json:"version"`
			InstallType   string `json:"installType"`
		}{WorkspacePath: input.WorkspacePath, Version: input.Version, InstallType: input.InstallType})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"instructions": output.Instructions, "installType": output.InstallType}, nil

	case "android_native_setup":
		result, output, err := UnityAndroidNativeSetupHandler(ctx, req, struct {
			WorkspacePath  string   `json:"workspacePath"`
			Region         string   `json:"region"`
			Channel        string   `json:"channel"`
			AndroidVersion string   `json:"androidVersion"`
			Components     []string `json:"components"`
			ApplicationID  string   `json:"applicationId"`
		}{
			WorkspacePath:  input.WorkspacePath,
			Region:         input.Region,
			Channel:        input.Channel,
			AndroidVersion: input.AndroidVersion,
			Components:     input.Components,
			ApplicationID:  unityParam(input.Params, "applicationId", ""),
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions":          output.Instructions,
			"applicationId":         output.ApplicationID,
			"channel":               output.Channel,
			"components":            output.Components,
			"pushPlatforms":         output.PushPlatforms,
			"androidVersion":        output.AndroidVersion,
			"gradleDependencyBlock": output.GradleDependencyBlock,
			"proguardConfig":        output.ProguardConfig,
			"preflight":             output.Preflight,
		}, nil

	case "google_config":
		result, output, err := UnityGoogleConfigHandler(ctx, req, struct {
			WorkspacePath          string `json:"workspacePath"`
			GoogleServicesJSONPath string `json:"googleServicesJsonPath"`
			GIDClientID            string `json:"gidClientId"`
			GoogleURLScheme        string `json:"googleUrlScheme"`
		}{
			WorkspacePath:          input.WorkspacePath,
			GoogleServicesJSONPath: input.GoogleServicesJSONPath,
			GIDClientID:            input.GIDClientID,
			GoogleURLScheme:        input.GoogleURLScheme,
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"provider":     output.Provider,
			"preflight":    output.Preflight,
		}, nil

	case "facebook_config":
		result, output, err := UnityFacebookConfigHandler(ctx, req, struct {
			WorkspacePath       string `json:"workspacePath"`
			FacebookAppID       string `json:"facebookAppId"`
			FacebookClientToken string `json:"facebookClientToken"`
		}{
			WorkspacePath:       input.WorkspacePath,
			FacebookAppID:       input.FacebookAppID,
			FacebookClientToken: input.FacebookClientToken,
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"provider":     output.Provider,
			"preflight":    output.Preflight,
		}, nil

	case "firebase_config":
		result, output, err := UnityFirebaseConfigHandler(ctx, req, struct {
			WorkspacePath              string `json:"workspacePath"`
			GoogleServicesJSONPath     string `json:"googleServicesJsonPath"`
			GoogleServiceInfoPlistPath string `json:"googleServiceInfoPlistPath"`
		}{
			WorkspacePath:              input.WorkspacePath,
			GoogleServicesJSONPath:     unityParam(input.Params, "googleServicesJsonPath", input.GoogleServicesJSONPath),
			GoogleServiceInfoPlistPath: unityParam(input.Params, "googleServiceInfoPlistPath", ""),
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"provider":     output.Provider,
			"preflight":    output.Preflight,
		}, nil

	case "adjust_config":
		result, output, err := UnityAdjustConfigHandler(ctx, req, struct {
			WorkspacePath     string `json:"workspacePath"`
			AdjustAppToken    string `json:"adjustAppToken"`
			AdjustEnvironment string `json:"adjustEnvironment"`
		}{
			WorkspacePath:     input.WorkspacePath,
			AdjustAppToken:    unityParam(input.Params, "adjustAppToken", ""),
			AdjustEnvironment: unityParam(input.Params, "adjustEnvironment", ""),
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"provider":     output.Provider,
			"preflight":    output.Preflight,
		}, nil

	case "huawei_config":
		result, output, err := UnityHuaweiConfigHandler(ctx, req, struct {
			WorkspacePath             string `json:"workspacePath"`
			AgconnectServicesJSONPath string `json:"agconnectServicesJsonPath"`
			AndroidVersion            string `json:"androidVersion"`
		}{
			WorkspacePath:             input.WorkspacePath,
			AgconnectServicesJSONPath: input.AgconnectServicesJSONPath,
			AndroidVersion:            input.AndroidVersion,
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"provider":     output.Provider,
			"preflight":    output.Preflight,
		}, nil

	case "channel_config":
		result, output, err := UnityChannelConfigHandler(ctx, req, struct {
			WorkspacePath  string            `json:"workspacePath"`
			ThirdChannel   string            `json:"thirdChannel"`
			AndroidVersion string            `json:"androidVersion"`
			Params         map[string]string `json:"params"`
		}{
			WorkspacePath:  input.WorkspacePath,
			ThirdChannel:   input.ThirdChannel,
			AndroidVersion: input.AndroidVersion,
			Params:         input.Params,
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"channel":      output.Channel,
			"preflight":    output.Preflight,
		}, nil

	case "login":
		result, output, err := UnityLoginHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "apple_signin_config":
		result, output, err := UnityAppleSigninConfigHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": unityAppleSigninConfigPreflight(input.WorkspacePath),
		}, nil

	case "payment":
		result, output, err := UnityPaymentHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityPaymentPreflight(input.WorkspacePath)
		return toolResult, response, nil

	case "xingyi_payment":
		mode, modeErr := xingyiPaymentModeFromRequest(req)
		if modeErr != "" {
			return nil, map[string]any{"error": modeErr}, nil
		}
		var buf bytes.Buffer
		if err := unityXingYiPaymentTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":        buf.String(),
			"usage":       "使用 RXXingYiPay.PayApp/PayH5 接入 Android 星驿支付",
			"paymentMode": mode,
			"dependency": map[string]any{
				"packageName":    "com.ruixue.unitysdk.xingyi",
				"minimumVersion": xingyiUnityMinVersion,
			},
			"preflight": unityXingYiPaymentPreflight(input.WorkspacePath, mode),
		}, nil

	case "unifypay":
		var buf bytes.Buffer
		if err := unityUnifypayTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":  buf.String(),
			"usage": "Unity 使用 RXPay.Pay 接入银联；Android 原生插件内部调用 UPPaySdkWrapper.getInstance().doPay",
			"dependency": map[string]any{
				"packageName":       "com.ruixue.unitysdk.pay",
				"minimumVersion":    "4.0.0",
				"androidDependency": "com.ruixue:rxsdk_unifypay:4.0.17",
				"androidMinSdk":     22,
			},
			"preflight": unityUnifypayPreflight(input.WorkspacePath),
		}, nil

	case "huya":
		var buf bytes.Buffer
		if err := unityHuyaTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":  buf.String(),
			"usage": "使用公共 Base/Login/Pay 与 RuiXueSdk/RXLogin/RXPay 通用 API 接入虎牙联运；Android 选择 rxsdk_huya，仅支持 Android",
			"dependency": map[string]any{
				"packageNames": []string{
					"com.ruixue.unitysdk.base",
					"com.ruixue.unitysdk.login",
					"com.ruixue.unitysdk.pay",
				},
				"minimumVersion":        huyaUnityMinVersion,
				"androidDependency":     "com.ruixue:rxsdk_huya:4.0.19",
				"androidMinimumVersion": huyaAndroidMinVersion,
			},
			"preflight": unityHuyaPreflight(input.WorkspacePath),
		}, nil

	case "baidu":
		var buf bytes.Buffer
		if err := unityBaiduTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":  buf.String(),
			"usage": "使用 RuiXueSdk/RXLogin/RXPay 公共 API 接入百度游戏渠道；仅支持 Android",
			"dependency": map[string]any{
				"packageNames": []string{
					"com.ruixue.unitysdk.base",
					"com.ruixue.unitysdk.login",
					"com.ruixue.unitysdk.pay",
				},
				"minimumVersion":        baiduUnityMinVersion,
				"androidDependency":     "com.ruixue:rxsdk_baidu_wangxun:4.0.18",
				"androidMinimumVersion": baiduAndroidMinVersion,
			},
			"preflight": unityBaiduPreflight(input.WorkspacePath),
		}, nil

	case "xuteng":
		var buf bytes.Buffer
		if err := unityXutengTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":  buf.String(),
			"usage": "使用公共 Base/Login/Pay 与 RuiXueSdk/RXLogin/RXPay 通用 API 接入栩腾渠道；Android 选择 rxsdk_xuteng，仅支持 Android",
			"dependency": map[string]any{
				"packageNames": []string{
					"com.ruixue.unitysdk.base",
					"com.ruixue.unitysdk.login",
					"com.ruixue.unitysdk.pay",
				},
				"minimumVersion":        xutengUnityMinVersion,
				"androidDependency":     "com.ruixue:rxsdk_xuteng:4.0.19",
				"androidMinimumVersion": xutengAndroidMinVersion,
			},
			"preflight": unityXutengPreflight(input.WorkspacePath),
		}, nil

	case "passport":
		result, output, err := UnityPassportHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityPassportPreflight(input.WorkspacePath)
		return toolResult, response, nil

	case "captcha":
		result, output, err := UnityCaptchaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "real_auth":
		result, output, err := UnityRealAuthHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityIifaaRealAuthPreflight(input.WorkspacePath)
		return toolResult, response, nil

	case "account_binding":
		result, output, err := UnityAccountBindingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "password":
		result, output, err := UnityPasswordHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "deregister":
		result, output, err := UnityDeregisterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "social":
		result, output, err := UnitySocialHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "friends":
		result, output, err := UnityFriendsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "lbs":
		result, output, err := UnityLbsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityLbsPreflight(input.WorkspacePath)
		return toolResult, response, nil

	case "rank":
		result, output, err := UnityRankHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "share":
		result, output, err := UnityShareHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		responseSchema, err := operationAPIResponseSchemaReference("v1/operationapi/share/data")
		if err != nil {
			return nil, nil, err
		}
		response["responseSchemas"] = map[string]any{
			"getShareData": responseSchema,
			"getShareInfo": responseSchema,
		}
		return toolResult, response, nil

	case "feedback":
		result, output, err := UnityFeedbackHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "tracking":
		result, output, err := UnityTrackingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "legal_ui":
		result, output, err := UnityLegalUIHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "promo":
		result, output, err := UnityPromoHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "announcement":
		result, output, err := UnityAnnouncementHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		toolResult, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityTempNoticePreflight(input.WorkspacePath)
		return toolResult, response, nil

	case "device":
		result, output, err := UnityDeviceHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "user_center":
		result, output, err := UnityUserCenterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "ad":
		result, output, err := UnityAdHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "push":
		result, output, err := UnityPushHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		pushPlatform, platformError := unityPushPlatformFromRequest(req)
		if platformError != "" {
			response["error"] = platformError
			response["preflight"] = PassportPreflightResult{
				Platform:  "unity_push",
				Checked:   false,
				Satisfied: false,
				Missing:   []string{platformError},
				NextSteps: []string{"使用 platform=ios、platform=android 或 platform=both 重新调用 unity feature=push"},
			}
			return result, response, nil
		}
		response["platform"] = pushPlatform

		var iosPreflight PassportPreflightResult
		if pushPlatform == "ios" || pushPlatform == "both" {
			iosPreflight = unityPushIOSPreflight(input.WorkspacePath)
			response["iosNotificationService"] = map[string]any{
				"targetName":     "NotificationService",
				"bundleIDSuffix": ".NotificationService",
				"minimumVersion": unityPushIOSMinVersion,
				"payload":        map[string]any{"aps.mutable-content": 1},
				"reportMethod":   "[[RXPushService sharedSDK] pushReceivedWithUserInfo:userInfo]",
			}
			if pushPlatform == "ios" {
				response["preflight"] = iosPreflight
				return result, response, nil
			}
		}

		platforms, selectionError := pushPlatformsFromRequest(req, true)
		response["supportedPushPlatforms"] = androidPushPlatformOptions()
		if selectionError != "" {
			response["error"] = selectionError
			response["selectionRequired"] = true
			androidPreflight := androidPushPreflight(input.WorkspacePath, nil)
			if pushPlatform == "both" {
				response["preflight"] = mergeUnityPushPreflights(iosPreflight, androidPreflight)
			} else {
				response["preflight"] = androidPreflight
			}
			return result, response, nil
		}
		androidVersion := input.AndroidVersion
		if androidVersion == "" {
			androidVersion = "<androidVersion>"
		}
		response["selectedPushPlatforms"] = platforms
		response["androidArtifacts"] = androidPushArtifacts(platforms)
		response["androidPushDependencyNote"] = "所选平台组件会传递引入 rxsdk_push_base，无需额外声明"
		response["androidGradleDependencies"] = buildAndroidPushGradleDependencies(platforms, androidVersion, "groovy")
		if pushPlatformSelected(platforms, "firebase") {
			response["firebaseComponentDependency"] = unityComponentDependencyForPackage("com.ruixue.unitysdk.firebase", input.Version)
		}
		_, androidSetup, err := UnityAndroidNativeSetupHandler(ctx, req, struct {
			WorkspacePath  string   `json:"workspacePath"`
			Region         string   `json:"region"`
			Channel        string   `json:"channel"`
			AndroidVersion string   `json:"androidVersion"`
			Components     []string `json:"components"`
			ApplicationID  string   `json:"applicationId"`
		}{
			WorkspacePath:  input.WorkspacePath,
			Region:         input.Region,
			Channel:        input.Channel,
			AndroidVersion: input.AndroidVersion,
			Components:     input.Components,
			ApplicationID:  unityParam(input.Params, "applicationId", ""),
		})
		if err != nil {
			return nil, nil, err
		}
		response["androidProjectConfig"] = androidSetup.Instructions
		if pushPlatform == "both" {
			response["preflight"] = mergeUnityPushPreflights(iosPreflight, androidSetup.Preflight)
		} else {
			response["preflight"] = androidSetup.Preflight
		}
		return result, response, nil

	case "version_check":
		result, output, err := UnityVersionCheckHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityVersionCheckPreflight(input.WorkspacePath)
		return result, response, nil

	case "review":
		result, output, err := UnityReviewHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "game_area":
		result, output, err := UnityGameAreaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "game_character":
		result, output, err := UnityGameCharacterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityGameInfoPreflight(input.WorkspacePath)
		return result, response, nil

	case "mumu":
		result, output, err := UnityMumuHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityMumuPreflight(input.WorkspacePath)
		return result, response, nil

	case "gdt":
		result, output, err := UnityGDTHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		_, response, err := unitySpecResponse(ctx, result, output, feature, input.Version)
		if err != nil {
			return nil, nil, err
		}
		response["preflight"] = unityGDTPreflight(input.WorkspacePath)
		return result, response, nil

	case "minigame_weixin":
		result, output, err := UnityMiniGameWeiXinHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	case "minigame_douyin":
		result, output, err := UnityMiniGameDouYinHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return unitySpecResponse(ctx, result, output, feature, input.Version)

	default:
		return nil, map[string]any{"error": "未知的功能模块: " + feature}, nil
	}
}

func normalizeUnityFeature(feature string) string {
	normalized := strings.ToLower(strings.TrimSpace(feature))
	normalized = strings.ReplaceAll(normalized, "-", "_")
	switch normalized {
	case "setsdkcallback", "set_sdk_callback", "ruixuesdk.setsdkcallback", "rxsdk.setsdkcallback":
		return "passport"
	case "productinfo", "product_info", "get_product_info", "query_product_info":
		return "payment"
	case "minigame_weixin", "weixin_minigame", "webgl_weixin", "weixin_webgl", "wechat_minigame", "minigame_wechat":
		return "minigame_weixin"
	case "minigame_douyin", "douyin_minigame", "webgl_douyin", "douyin_webgl", "tiktok_minigame", "minigame_tiktok":
		return "minigame_douyin"
	case "mumu", "yofun", "rxsdk_yofun":
		return "mumu"
	default:
		return normalized
	}
}

// ==================== Unity 工具注册 ====================

func registerUnityTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "unity",
			Description: mcpToolCallRequirement + `

Unity SDK 代码生成工具。根据 feature 参数生成不同功能模块的 C# 代码。

【可用功能模块 (feature)】
基础接入:
- init: SDK 初始化代码；传入 workspacePath、channel、androidVersion 时自动检查并补齐 Android 工程配置和生命周期
- agent: 接入流程指南
- dependency: 依赖配置说明（UPM / .unitypackage）
- setup: 自动化接入
- android_native_setup: Unity Android 原生依赖自动接入（mainTemplate.gradle / proguard-user.txt）
- google_config: Unity Google 登录/支付配置（google-services.json / Google iOS XcodeSetting）
- facebook_config: Unity Facebook 登录配置（AndroidManifest / launcherTemplate.gradle / Facebook iOS XcodeSetting）
- firebase_config: Unity Firebase 配置（google-services.json / GoogleService-Info.plist / Firebase iOS XcodeSetting）
- adjust_config: Unity Adjust 配置（AndroidManifest 权限 / Adjust XcodeSetting，appToken/environment 通过 params 提供）
- huawei_config: Unity 华为渠道配置（agconnect-services.json）
- apple_signin_config: Unity iOS Sign in with Apple Capability 配置（显式调用）
- channel_config: Unity 三方渠道一键配置（依赖/manifest/launcher/settings/proguard/资产/iOS资产），thirdChannel 选择渠道，@your 占位参数通过 params 提供

用户登录:
- login: 登录（游客/账号密码/验证码/第三方）

支付:
- payment: 支付功能（下单、Android Google 商品详情查询、iOS 商品信息查询）
- xingyi_payment: 独立星驿支付（Android；UPM >= 4.0.0，原生 SDK >= 4.0.14）
- unifypay: 银联综合支付（仅 Android；RXPay.Pay 进入原生 UPPaySdkWrapper.doPay）
- huya: 虎牙联运（仅 Android；公共 Base/Login/Pay UPM >= 4.0.2，Android 选择 rxsdk_huya >= 4.0.19，并配置 Volcengine Maven）
- baidu: 百度游戏渠道（仅 Android；UPM >= 4.0.1，原生 SDK >= 4.0.18）
- xuteng: 栩腾渠道（仅 Android；公共 Base/Login/Pay UPM >= 4.0.3，无专属 UPM，rxsdk_xuteng >= 4.0.19，minSdkVersion >= 23）
- product_info / get_product_info / query_product_info: 获取商品信息（payment 别名）

用户通行证:
- passport: 登录/注册/指定用户信息
- set_sdk_callback / setsdkcallback: 设置全局 SDK 回调（别名，返回 passport 中 SetSdkCallback 方法说明）
- captcha: 验证码（手机/邮箱）
- real_auth: 实名认证 / 支付宝 IIFAA 实名
- account_binding: 账号绑定（第三方账号/手机/邮箱）
- password: 密码管理
- deregister: 账号注销

社交功能:
- social: 社交关系
- friends: 好友管理
- lbs: 瑞雪 LBS 高德定位（RuiXue.LBS；Android RXLBSAndroid / iOS RXLBSIOS）
- rank: 排行榜

游戏功能:
- game_area: 游戏区服
- game_character: 游戏信息与角色（SetGameInfo 上报瑞雪；SetThirdGameInfo Android 上报完整渠道信息、iOS 复用 roleId/serverId，最低 Unity 4.0.3 / Android 4.0.16）
- mumu: MuMu/Yofun Unity Android 渠道接入（公共 Base/Login/Pay UPM >= 4.0.2 / Android >= 4.0.19）
- gdt: 腾讯广告 GDT；区分移动端 RXGDT 1.6.38 与微信小游戏 ReportGdt/直玩能力

小游戏（WebGL）:
- minigame_weixin: 微信小游戏专属能力（内容安全/客服/补单/开放数据域/分享/订阅消息/广告/公告邮件/反馈/达人福利/数据上报/区服角色，命名空间 RuiXue.MiniGame.WeiXin）
- minigame_douyin: 抖音小游戏专属能力（抖音支付扩展/录屏/分享/客服/启动参数，依赖 StarkSDK，命名空间 RuiXue.MiniGame.DouYin）

其他功能:
- share: 分享
- feedback: 反馈/客服
- tracking: 数据埋点
- legal_ui: 法务（协议、隐私）
- promo: 达人福利
- announcement: 公告/邮件
- device: 设备信息与配置
- user_center: 帮助中心/客服会话
- ad: 广告（激励/Banner/插屏）
- push: 推送；platform=ios 时检查 iOS NotificationService 自动接入（UPM >= 4.0.8），platform=android 时必须先通过 pushPlatforms 选择 Android 推送平台
- version_check: 瑞雪版本检查 v2（RXVersionCheck.UpdateGameVersion）
- review: 应用商店评分

【参数说明】
- feature: 必填，功能模块名称
- platform: push 使用；ios、android 或 both，默认 android
- paymentMode: xingyi_payment 支付模式 app/h5/both，默认 both
- workspacePath: Unity 项目路径；传入后会检查 Assets 下业务 .asmdef，并自动补充源码实际引用但尚未声明的 RuiXue.* 程序集；部分功能还会执行对应工程检查和自动配置
- version: SDK 版本号（setup/dependency 可选；未传入时从 UPM registry 获取最新版本）
- installType: 安装方式 upm 或 unitypackage，setup/dependency 需要
- region: 环境类型 domestic(国内)/overseas(海外)，android_native_setup 可选，仅用于说明环境，不会自动选择渠道库
- channel: Android 渠道库，init/android_native_setup 需要，必须让用户从渠道库中单选一个
- androidVersion: Android 原生 SDK 版本号，init/android_native_setup/huawei_config 需要；如需最新版本可传 +
- components: Android 组件库列表，android_native_setup 可选，可多选
- pushPlatforms: Android 推送平台列表，push/android_native_setup 可选；feature=push 时必须先询问用户并至少选择一个
- googleServicesJsonPath: google-services.json 源文件路径，google_config 需要（目标文件已存在时可不传）
- gidClientId: Google iOS Client ID，google_config 需要
- googleUrlScheme: Google REVERSED_CLIENT_ID，google_config 需要
- facebookAppId: Facebook App ID，facebook_config 需要
- facebookClientToken: Facebook Client Token，facebook_config 需要
- agconnectServicesJsonPath: 华为 agconnect-services.json 源文件路径，huawei_config 需要（目标文件已存在时可不传）
- thirdChannel: 三方渠道标识，channel_config 需要（如 zalo/vivo/oppo/xiaomi/line/instagram/qoo 等）
- params: 渠道/组件参数对象；android_native_setup 可用 applicationId 指定 Android 包名；channel_config 用于 @your 占位参数（如 zaloAppId、配置文件源路径）；firebase_config 用 googleServicesJsonPath/googleServiceInfoPlistPath；adjust_config 用 adjustAppToken/adjustEnvironment`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum": []string{
							"init", "agent", "dependency", "setup", "android_native_setup", "google_config", "facebook_config", "firebase_config", "adjust_config", "huawei_config", "apple_signin_config", "channel_config",
							"login", "payment", "xingyi_payment", "unifypay", "huya", "baidu", "xuteng", "product_info", "get_product_info", "query_product_info",
							"passport", "set_sdk_callback", "setsdkcallback", "SetSdkCallback", "captcha", "real_auth", "account_binding", "password", "deregister",
							"social", "friends", "lbs", "rank",
							"game_area", "game_character", "mumu", "gdt",
							"share", "feedback", "tracking", "legal_ui", "promo", "announcement", "device", "user_center",
							"ad", "push", "version_check", "review",
							"minigame_weixin", "minigame_douyin",
						},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "Unity 项目工作目录的绝对路径",
					},
					"platform": map[string]any{
						"type":        "string",
						"description": "推送目标平台：ios、android 或 both；feature=push 时可选，默认 android",
						"enum":        []string{"ios", "android", "both"},
						"default":     "android",
					},
					"paymentMode": map[string]any{
						"type":        "string",
						"description": "星驿支付模式：app、h5 或 both（默认）",
						"enum":        []string{"app", "h5", "both"},
						"default":     "both",
					},
					"version": map[string]any{
						"type":        "string",
						"description": "SDK 版本号（如 3.0.0）",
					},
					"installType": map[string]any{
						"type":        "string",
						"description": "安装方式：upm（Unity Package Manager）或 unitypackage（.unitypackage 导入）",
						"enum":        []string{"upm", "unitypackage"},
					},
					"region": map[string]any{
						"type":        "string",
						"description": "环境类型：domestic(国内) 或 overseas(海外)，android_native_setup 可选，仅用于说明环境，不会自动选择渠道库",
						"enum":        []string{"domestic", "overseas"},
					},
					"channel": map[string]any{
						"type":        "string",
						"description": "Unity Android 渠道库，android_native_setup 使用，必须让用户从渠道库中单选一个",
						"enum": []string{
							"rxsdk_weile", "rxsdk_baidu_wangxun", "rxsdk_douyin_gb", "rxsdk_huawei",
							"rxsdk_kwaiallin", "rxsdk_xiaomi", "rxsdk_vivo", "rxsdk_oppo",
							"rxsdk_ysdk", "rxsdk_taptap", "rxsdk_yofun", "rxsdk_overseas",
							"rxsdk_huya", "rxsdk_xuteng",
						},
					},
					"androidVersion": map[string]any{
						"type":        "string",
						"description": "Android 原生 SDK 版本号，如 4.0.9；如需自动更新最新版本可传 +",
					},
					"components": map[string]any{
						"type":        "array",
						"description": "Unity Android 组件库列表，可多选",
						"items": map[string]any{
							"type": "string",
							"enum": []string{
								"rxsdk_base_ui", "rxsdk_weixin", "rxsdk_alimobile",
								"rxsdk_gaode", "rxsdk_unifypay", "rxsdk_oaid",
								"rxsdk_firebase", "rxsdk_adjust",
							},
						},
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
					"googleServicesJsonPath": map[string]any{
						"type":        "string",
						"description": "google-services.json 源文件路径，google_config 使用；会复制到 Assets/Plugins/Android/google-services.json",
					},
					"gidClientId": map[string]any{
						"type":        "string",
						"description": "Google iOS Client ID，google_config 使用，会写入 RuiXueSDK_GoogleXcodeSetting.asset 的 GIDClientID",
					},
					"googleUrlScheme": map[string]any{
						"type":        "string",
						"description": "Google REVERSED_CLIENT_ID，google_config 使用，会写入 RuiXueSDK_GoogleXcodeSetting.asset 的 REVERSED_CLIENT_ID",
					},
					"facebookAppId": map[string]any{
						"type":        "string",
						"description": "Facebook App ID，facebook_config 使用",
					},
					"facebookClientToken": map[string]any{
						"type":        "string",
						"description": "Facebook Client Token，facebook_config 使用",
					},
					"agconnectServicesJsonPath": map[string]any{
						"type":        "string",
						"description": "华为 agconnect-services.json 源文件路径，huawei_config 使用；会复制到 Assets/Plugins/Android/agconnect-services.json",
					},
					"thirdChannel": map[string]any{
						"type":        "string",
						"description": "三方渠道标识，channel_config 使用",
						"enum": []string{
							"zalo", "line", "tiktok", "snapchat", "reddit", "instagram", "qoo", "catappult", "apkpure", "checkout",
							"vivo", "oppo", "xiaomi", "kwai", "honor", "douyin", "baidu", "4399", "ysdk", "ninegame",
							"ld", "quick", "taptap", "bilibili", "oaid", "weixin", "yeepay", "bytedance_ad", "mumu", "huya", "xuteng",
						},
					},
					"params": map[string]any{
						"type":                 "object",
						"description":          "扩展参数对象；android_native_setup 可传 applicationId；channel_config 的 @your 占位参数与配置文件源路径必须由使用方提供",
						"additionalProperties": map[string]any{"type": "string"},
					},
				},
				"required": []string{"feature"},
			},
		},
		UnityUnifiedHandler,
	)
}
