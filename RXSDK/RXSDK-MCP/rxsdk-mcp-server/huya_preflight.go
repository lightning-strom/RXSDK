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
	huyaAndroidMinVersion = "4.0.19"
	huyaUnityMinVersion   = "4.0.2"
	huyaVolcengineMaven   = "https://artifact.bytedance.com/repository/Volcengine/"
)

func huyaPreflightNeedsWorkspace(platform string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能检查虎牙依赖、初始化与 Activity 生命周期转发",
			fmt.Sprintf("重新调用 %s feature=huya workspacePath=/path/to/project", platform),
		},
	}
}

func iosHuyaPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		result := huyaPreflightNeedsWorkspace("ios")
		result.Missing = []string{"iOS 平台不支持虎牙联运"}
		result.NextSteps = append(result.NextSteps, "改用 Android、Unity Android 或 Cocos2dx Android 接入")
		return result
	}
	return PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
		Satisfied:     false,
		Missing:       []string{"iOS 平台不支持虎牙联运"},
		NextSteps:     []string{"不要生成 iOS 虎牙伪接口；改用 Android、Unity Android 或 Cocos2dx Android 接入"},
	}
}

func androidHuyaPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return huyaPreflightNeedsWorkspace("android")
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	checkHuyaGradle(gradleFiles, "Android", &result)
	checkHuyaVolcengineMaven(collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
		"settings.gradle": true, "settings.gradle.kts": true,
	}), "Android", &result)
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig",
	}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RuiXueSdk.getApi().initThirdSdk", "RXSdkApi.getInstance().initThirdSdk", "RXSDK.getInstance().initThirdSdk",
	}) {
		result.Missing = append(result.Missing, "未检测到 RuiXueSdk.getApi().initThirdSdk 虎牙渠道初始化")
	}
	if !hasHuyaActivityLifecycle(workspacePath, true) {
		result.Missing = append(result.Missing, "未检测到 Activity 转发 onResume/onPause/onActivityResult/onRequestPermissionsResult")
	}
	finishHuyaPreflight(&result, "补齐固定依赖、SDK/initThirdSdk 初始化与 Activity 生命周期转发后重新调用 android feature=huya")
	return result
}

func unityHuyaPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return huyaPreflightNeedsWorkspace("unity")
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	checkHuyaUnityManifest(filepath.Join(workspacePath, "Packages", "manifest.json"), &result)
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize"}) {
		result.Missing = append(result.Missing, "未检测到 Unity RuiXueSdk.Initialize 基础初始化")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.InitThirdSdk"}) {
		result.Missing = append(result.Missing, "未检测到 Unity RuiXueSdk.InitThirdSdk 虎牙渠道初始化")
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	checkHuyaGradle(gradleFiles, "Unity Android 导出配置", &result)
	checkHuyaVolcengineMaven(existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "settingsTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "baseProjectTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
	), "Unity Android 导出配置", &result)
	if !hasHuyaActivityLifecycle(workspacePath, false) {
		result.Missing = append(result.Missing, "Unity Android Activity 未完整转发 RuiXueSdk onResume/onPause/onActivityResult/onRequestPermissionsResult")
	}
	finishHuyaPreflight(&result, "补齐 UPM、Android 原生依赖、两阶段初始化与 Activity 生命周期转发后重新调用 unity feature=huya")
	return result
}

func cocos2dxHuyaPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return huyaPreflightNeedsWorkspace("cocos2dx")
	}
	result := PassportPreflightResult{Platform: "cocos2dx", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	checkHuyaGradle(gradleFiles, "Cocos2dx Android", &result)
	checkHuyaVolcengineMaven(collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
		"settings.gradle": true, "settings.gradle.kts": true,
	}), "Cocos2dx Android", &result)
	cppExtensions := []string{".cpp", ".cc", ".cxx", ".h", ".hpp"}
	if !fileContainsAny(workspacePath, cppExtensions, []string{
		"bridge->init(", "getInstance()->init(", "RuixueBridge::init(",
	}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge init 基础初始化")
	}
	if !fileContainsAny(workspacePath, cppExtensions, []string{
		"bridge->initThirdSdk(", "getInstance()->initThirdSdk(", "RuixueBridge::initThirdSdk(",
	}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge initThirdSdk 虎牙渠道初始化")
	}
	if !hasHuyaActivityLifecycle(workspacePath, true) {
		result.Missing = append(result.Missing, "Cocos2dx AppActivity 未完整转发 onResume/onPause/onActivityResult/onRequestPermissionsResult")
	}
	finishHuyaPreflight(&result, "补齐 Android 依赖、RuixueBridge init/initThirdSdk 与 AppActivity 生命周期转发后重新调用 cocos2dx feature=huya")
	return result
}

func checkHuyaGradle(gradleFiles []string, scope string, result *PassportPreflightResult) {
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, scope+" 未找到可识别的 Gradle 配置")
		return
	}
	upgradeRuixueGradleVersions(gradleFiles, huyaAndroidMinVersion, result)
	if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_huya", huyaAndroidMinVersion) {
		result.Missing = append(result.Missing,
			fmt.Sprintf("%s 未检测到 com.ruixue:rxsdk_huya 固定依赖（要求 >= %s）；不会静默添加", scope, huyaAndroidMinVersion))
	}
}

func checkHuyaVolcengineMaven(gradleFiles []string, scope string, result *PassportPreflightResult) {
	for _, path := range gradleFiles {
		content, err := os.ReadFile(path)
		if err == nil && strings.Contains(string(content), huyaVolcengineMaven) {
			return
		}
	}
	result.Missing = append(result.Missing, scope+" 未检测到 Volcengine Maven 仓库 "+huyaVolcengineMaven)
}

func checkHuyaUnityManifest(path string, result *PassportPreflightResult) {
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
				fmt.Sprintf("未检测到 %s 固定依赖（要求 >= %s）；不会静默添加", packageName, huyaUnityMinVersion))
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
		if compareVersion(cleanVersion(strings.TrimPrefix(current, "v")), huyaUnityMinVersion) >= 0 {
			continue
		}
		dependencies[name] = huyaUnityMinVersion
		changed = true
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, name, current, huyaUnityMinVersion))
	}
	if changed {
		root["dependencies"] = dependencies
		updated, marshalErr := json.MarshalIndent(root, "", "  ")
		if marshalErr != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, marshalErr))
			return
		}
		writePreflightUpdate(path, string(content), string(append(updated, '\n')), result)
	}
}

func hasHuyaActivityLifecycle(root string, allowRXSDK bool) bool {
	required := []string{
		"RuiXueSdk.onResume",
		"RuiXueSdk.onPause",
		"RuiXueSdk.onActivityResult",
		"RuiXueSdk.onRequestPermissionsResult",
	}
	if fileContainsAll(root, []string{".java", ".kt"}, required) {
		return true
	}
	if !allowRXSDK {
		return false
	}
	return fileContainsAll(root, []string{".java", ".kt"}, []string{
		"RXSDK.onResume",
		"RXSDK.onPause",
		"RXSDK.onActivityResult",
		"RXSDK.onRequestPermissionsResult",
	})
}

func finishHuyaPreflight(result *PassportPreflightResult, nextStep string) {
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, nextStep)
	}
}
