package rxsdk

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const (
	xingyiAndroidMinVersion = "4.0.14"
	xingyiUnityMinVersion   = "4.0.0"
)

func normalizeXingYiPaymentMode(mode string) (string, string) {
	mode = strings.ToLower(strings.TrimSpace(mode))
	if mode == "" {
		return "both", ""
	}
	switch mode {
	case "app", "h5", "both":
		return mode, ""
	default:
		return "", "paymentMode 必须是 app、h5 或 both"
	}
}

func xingyiPaymentModeFromRequest(req *mcp.CallToolRequest) (string, string) {
	if req == nil || req.Params == nil {
		return "both", ""
	}
	var input struct {
		PaymentMode string `json:"paymentMode"`
	}
	if err := json.Unmarshal(req.Params.Arguments, &input); err != nil {
		return "", "无法解析 paymentMode"
	}
	return normalizeXingYiPaymentMode(input.PaymentMode)
}

func xingyiRequiredAndroidArtifacts(mode string) []string {
	switch mode {
	case "app":
		return []string{"rxsdk_xingyi"}
	case "h5":
		return []string{"rxsdk_h5pay"}
	default:
		return []string{"rxsdk_xingyi", "rxsdk_h5pay"}
	}
}

func xingyiPreflightNeedsWorkspace(platform, mode string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能检查星驿依赖、初始化并安全升级固定低版本",
			fmt.Sprintf("重新调用 %s feature=xingyi_payment paymentMode=%s workspacePath=/path/to/project", platform, mode),
		},
	}
}

func iosXingYiPaymentPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		result := xingyiPreflightNeedsWorkspace("ios", "both")
		result.Missing = []string{"iOS 平台不支持星驿支付"}
		result.NextSteps = append(result.NextSteps, "改用 Android、Unity Android 或 Cocos2dx Android 接入")
		return result
	}
	return PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
		Satisfied:     false,
		Missing:       []string{"iOS 平台不支持星驿支付"},
		NextSteps:     []string{"改用 Android、Unity Android 或 Cocos2dx Android 接入；不要生成 iOS 伪支付调用"},
	}
}

func androidPaymentPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:  "android",
			Checked:   false,
			Satisfied: false,
			NextSteps: []string{"重新调用 android feature=payment workspacePath=/path/to/project，检查普通支付所需的基础 SDK 依赖与初始化；具体支付渠道使用对应独立 feature"},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 || !containsRuixueGradleDependency(gradleFiles) {
		result.Missing = append(result.Missing, "未检测到普通支付所需的瑞雪 Android SDK 基础依赖")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先完成基础 SDK 接入；星驿或 RuStore 支付请分别调用对应独立功能")
	}
	return result
}

func androidXingYiPaymentPreflight(workspacePath, mode string) PassportPreflightResult {
	mode, _ = normalizeXingYiPaymentMode(mode)
	if strings.TrimSpace(workspacePath) == "" {
		return xingyiPreflightNeedsWorkspace("android", mode)
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	checkXingYiGradle(gradleFiles, mode, &result)
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	finishXingYiPreflight(&result, "补齐星驿依赖和初始化后重新调用 android feature=xingyi_payment paymentMode="+mode)
	return result
}

func unityXingYiPaymentPreflight(workspacePath, mode string) PassportPreflightResult {
	mode, _ = normalizeXingYiPaymentMode(mode)
	if strings.TrimSpace(workspacePath) == "" {
		return xingyiPreflightNeedsWorkspace("unity", mode)
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	checkXingYiUnityManifest(filepath.Join(workspacePath, "Packages", "manifest.json"), &result)
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	checkXingYiGradle(gradleFiles, mode, &result)
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity 瑞雪 SDK 基础初始化")
	}
	finishXingYiPreflight(&result, "补齐 UPM、Android 原生依赖和初始化后重新调用 unity feature=xingyi_payment paymentMode="+mode)
	return result
}

func cocos2dxXingYiPaymentPreflight(workspacePath, mode string) PassportPreflightResult {
	mode, _ = normalizeXingYiPaymentMode(mode)
	if strings.TrimSpace(workspacePath) == "" {
		return xingyiPreflightNeedsWorkspace("cocos2dx", mode)
	}
	result := PassportPreflightResult{Platform: "cocos2dx", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	checkXingYiGradle(gradleFiles, mode, &result)
	if !fileContainsAny(workspacePath, []string{".cpp", ".cc", ".cxx", ".h", ".hpp"}, []string{"bridge->init(", "RuixueBridge::init", "getInstance()->init("}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge 基础初始化")
	}
	finishXingYiPreflight(&result, "补齐 Android Gradle 依赖和 RuixueBridge 初始化后重新调用 cocos2dx feature=xingyi_payment paymentMode="+mode)
	return result
}

func checkXingYiGradle(gradleFiles []string, mode string, result *PassportPreflightResult) {
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到可识别的 Gradle 配置，无法检查星驿 Android 依赖")
		return
	}
	upgradeRuixueGradleVersions(gradleFiles, xingyiAndroidMinVersion, result)
	for _, artifact := range xingyiRequiredAndroidArtifacts(mode) {
		if !gradleDependencyMeetsMinimum(gradleFiles, artifact, xingyiAndroidMinVersion) {
			result.Missing = append(result.Missing,
				fmt.Sprintf("未检测到 com.ruixue:%s 固定依赖（要求 >= %s）", artifact, xingyiAndroidMinVersion))
		}
	}
}

func containsRuixueGradleDependency(paths []string) bool {
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err == nil && strings.Contains(string(content), "com.ruixue:") {
			return true
		}
	}
	return false
}

func checkXingYiUnityManifest(path string, result *PassportPreflightResult) {
	content, err := os.ReadFile(path)
	if err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json")
		return
	}
	var root map[string]any
	if err := json.Unmarshal(content, &root); err != nil {
		result.Missing = append(result.Missing, "Packages/manifest.json 格式无效")
		return
	}
	dependencies, ok := root["dependencies"].(map[string]any)
	if !ok {
		result.Missing = append(result.Missing, "Packages/manifest.json 缺少 dependencies")
		return
	}
	const targetPackage = "com.ruixue.unitysdk.xingyi"
	if _, exists := dependencies[targetPackage]; !exists {
		result.Missing = append(result.Missing, "未检测到 com.ruixue.unitysdk.xingyi（要求固定版本 >= 4.0.0）")
	}

	fixedVersion := regexp.MustCompile(`^v?[0-9]+\.[0-9]+\.[0-9]+(?:[-.][0-9A-Za-z]+)*$`)
	changed := false
	for name, rawValue := range dependencies {
		if !strings.HasPrefix(name, "com.ruixue.unitysdk.") {
			continue
		}
		current, stringValue := rawValue.(string)
		current = strings.TrimSpace(current)
		if !stringValue || !fixedVersion.MatchString(current) {
			result.Missing = append(result.Missing, fmt.Sprintf("%s 使用非固定版本，无法安全校验或升级", name))
			continue
		}
		if compareVersion(cleanVersion(strings.TrimPrefix(current, "v")), xingyiUnityMinVersion) >= 0 {
			continue
		}
		dependencies[name] = xingyiUnityMinVersion
		changed = true
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, name, current, xingyiUnityMinVersion))
	}
	if changed {
		root["dependencies"] = dependencies
		updated, marshalErr := json.MarshalIndent(root, "", "  ")
		if marshalErr != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, marshalErr))
			return
		}
		if err := os.WriteFile(path, append(updated, '\n'), 0644); err != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
		}
	}
}

func finishXingYiPreflight(result *PassportPreflightResult, nextStep string) {
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, nextStep)
	}
}
