package rxsdk

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

const (
	baiduUnityMinVersion   = "4.0.1"
	baiduAndroidMinVersion = "4.0.18"
)

func baiduPreflightNeedsWorkspace(platform string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能检查百度依赖、初始化顺序与渠道 API",
			fmt.Sprintf("重新调用 %s feature=baidu workspacePath=/path/to/project", platform),
		},
	}
}

func iosBaiduPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		result := baiduPreflightNeedsWorkspace("ios")
		result.Missing = []string{"iOS 平台不支持百度游戏渠道"}
		result.NextSteps = append(result.NextSteps, "改用 Android、Unity Android 或 Cocos2dx Android 接入")
		return result
	}
	return PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
		Satisfied:     false,
		Missing:       []string{"iOS 平台不支持百度游戏渠道"},
		NextSteps:     []string{"不要生成 iOS 百度伪接口；改用 Android、Unity Android 或 Cocos2dx Android 接入"},
	}
}

func androidBaiduPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return baiduPreflightNeedsWorkspace("android")
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	checkBaiduGradle(gradleFiles, "Android", &result)
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig",
	}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RuiXueSdk.getApi().initThirdSdk", "RXSdkApi.getInstance().initThirdSdk", "RXSDK.getInstance().initThirdSdk",
	}) {
		result.Missing = append(result.Missing, "未检测到 initThirdSdk 百度渠道初始化")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"invokeChannelAction"}) ||
		!fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{`"showSplash"`}) {
		result.Missing = append(result.Missing, "未检测到 invokeChannelAction(action=showSplash) 百度闪屏调用")
	}
	finishBaiduPreflight(&result, "补齐固定依赖、基础初始化、initThirdSdk 与 invokeChannelAction 后重新调用 android feature=baidu")
	return result
}

func unityBaiduPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return baiduPreflightNeedsWorkspace("unity")
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	checkBaiduUnityManifest(filepath.Join(workspacePath, "Packages", "manifest.json"), &result)
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize"}) {
		result.Missing = append(result.Missing, "未检测到 Unity RuiXueSdk.Initialize 基础初始化")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.InitThirdSdk"}) {
		result.Missing = append(result.Missing, "未检测到 Unity RuiXueSdk.InitThirdSdk 百度渠道初始化")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.InvokeChannelAction"}) {
		result.Missing = append(result.Missing, "未检测到 Unity RuiXueSdk.InvokeChannelAction 百度渠道调用")
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	if len(gradleFiles) > 0 {
		checkBaiduGradle(gradleFiles, "Unity Android 导出配置", &result)
	}
	finishBaiduPreflight(&result, "补齐公共 Base/Login/Pay UPM、两阶段初始化和 InvokeChannelAction；已有 mainTemplate.gradle 时补齐原生依赖后重新调用 unity feature=baidu")
	return result
}

func cocos2dxBaiduPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return baiduPreflightNeedsWorkspace("cocos2dx")
	}
	result := PassportPreflightResult{Platform: "cocos2dx", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	checkBaiduGradle(gradleFiles, "Cocos2dx Android", &result)
	cppExtensions := []string{".cpp", ".cc", ".cxx", ".h", ".hpp"}
	if !fileContainsAny(workspacePath, cppExtensions, []string{
		"bridge->init(", "getInstance()->init(", "RuixueBridge::init(",
	}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge init 基础初始化")
	}
	if !fileContainsAny(workspacePath, cppExtensions, []string{
		"bridge->initThirdSdk(", "getInstance()->initThirdSdk(", "RuixueBridge::initThirdSdk(",
	}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge initThirdSdk 百度渠道初始化")
	}
	if !fileContainsAny(workspacePath, cppExtensions, []string{"invokeChannelAction("}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge invokeChannelAction")
	}
	finishBaiduPreflight(&result, "补齐 Android 依赖、RuixueBridge init/initThirdSdk/invokeChannelAction 后重新调用 cocos2dx feature=baidu")
	return result
}

func checkBaiduGradle(gradleFiles []string, scope string, result *PassportPreflightResult) {
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, scope+" 未找到可识别的 Gradle 配置")
		return
	}
	upgradeRuixueGradleVersions(gradleFiles, baiduAndroidMinVersion, result)
	if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_baidu_wangxun", baiduAndroidMinVersion) {
		result.Missing = append(result.Missing,
			fmt.Sprintf("%s 未检测到 com.ruixue:rxsdk_baidu_wangxun 固定依赖（要求 >= %s）；不会静默添加", scope, baiduAndroidMinVersion))
	}
}

func checkBaiduUnityManifest(path string, result *PassportPreflightResult) {
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

	requiredPackages := []string{
		"com.ruixue.unitysdk.base",
		"com.ruixue.unitysdk.login",
		"com.ruixue.unitysdk.pay",
	}
	for _, packageName := range requiredPackages {
		if _, exists := dependencies[packageName]; !exists {
			result.Missing = append(result.Missing,
				fmt.Sprintf("未检测到 %s 固定依赖（要求 >= %s）；不会静默添加", packageName, baiduUnityMinVersion))
		}
	}

	fixedVersion := regexp.MustCompile(`^v?[0-9]+\.[0-9]+\.[0-9]+(?:[-.][0-9A-Za-z]+)*$`)
	changed := false
	for name, rawValue := range dependencies {
		if !strings.HasPrefix(name, "com.ruixue.unitysdk.") {
			continue
		}
		current, isString := rawValue.(string)
		current = strings.TrimSpace(current)
		if !isString || !fixedVersion.MatchString(current) {
			result.Missing = append(result.Missing, fmt.Sprintf("%s 使用非固定版本，无法安全校验或升级", name))
			continue
		}
		if compareVersion(cleanVersion(strings.TrimPrefix(current, "v")), baiduUnityMinVersion) >= 0 {
			continue
		}
		dependencies[name] = baiduUnityMinVersion
		changed = true
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, name, current, baiduUnityMinVersion))
	}
	if !changed {
		return
	}
	root["dependencies"] = dependencies
	updated, marshalErr := json.MarshalIndent(root, "", "  ")
	if marshalErr != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, marshalErr))
		return
	}
	writePreflightUpdate(path, string(content), string(append(updated, '\n')), result)
}

func finishBaiduPreflight(result *PassportPreflightResult, nextStep string) {
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, nextStep)
	}
}
