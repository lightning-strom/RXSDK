package rxsdk

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

const (
	xutengUnityMinVersion   = "4.0.3"
	xutengAndroidMinVersion = "4.0.19"
	xutengAndroidMinSDK     = 23
)

func xutengPreflightNeedsWorkspace(platform string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能检查栩腾依赖、工程配置与公共 API 调用",
			fmt.Sprintf("重新调用 %s feature=xuteng workspacePath=/path/to/project", platform),
		},
	}
}

func iosXutengPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		result := xutengPreflightNeedsWorkspace("ios")
		result.Missing = []string{"iOS 平台不支持栩腾渠道"}
		result.NextSteps = append(result.NextSteps, "改用 Android、Unity Android 或 Cocos2dx Android 接入")
		return result
	}
	return PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
		Satisfied:     false,
		Missing:       []string{"iOS 平台不支持栩腾渠道"},
		NextSteps:     []string{"不要生成 iOS 栩腾伪接口；改用 Android、Unity Android 或 Cocos2dx Android 接入"},
	}
}

func androidXutengPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return xutengPreflightNeedsWorkspace("android")
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	checkXutengGradle(gradleFiles, "Android", &result)
	checkAndUpgradeXutengMinSdk(gradleFiles, &result)
	checkXutengAndroidConfig(workspacePath, gradleFiles, &result)
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RXSDK.initialize", "RuiXueSdk.Initialize", "RuiXueSdk.initialize", "RXSdkInitConfig",
	}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RuiXueSdk.getApi().initThirdSdk", "RXSdkApi.getInstance().initThirdSdk", "RXSDK.getInstance().initThirdSdk",
	}) {
		result.Missing = append(result.Missing, "未检测到 initThirdSdk 栩腾渠道初始化")
	}
	finishXutengPreflight(&result, "补齐固定依赖、minSdk 23、XTApplication、placeholder、brsdk.cfg 和两阶段初始化后重新调用 android feature=xuteng")
	return result
}

func unityXutengPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return xutengPreflightNeedsWorkspace("unity")
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	checkXutengUnityManifest(filepath.Join(workspacePath, "Packages", "manifest.json"), &result)

	codeChecks := []struct {
		needles []string
		missing string
	}{
		{[]string{"RuiXueSdk.Initialize"}, "未检测到 Unity RuiXueSdk.Initialize 基础初始化"},
		{[]string{"RuiXueSdk.InitThirdSdk"}, "未检测到 Unity RuiXueSdk.InitThirdSdk 栩腾渠道初始化"},
		{[]string{"RXLogin.Login", "LoginMethod.Xuteng"}, "未检测到 Unity RXLogin.Login + LoginMethod.Xuteng 登录"},
		{[]string{"RXPay.Pay", `"hq_type"`, `"xuteng"`}, "未检测到 Unity RXPay.Pay + hq_type=xuteng 支付"},
		{[]string{"RuiXueSdk.SetThirdGameInfo"}, "未检测到 Unity RuiXueSdk.SetThirdGameInfo 角色上报"},
		{[]string{"RuiXueSdk.ExitApp"}, "未检测到 Unity RuiXueSdk.ExitApp 渠道退出"},
	}
	for _, check := range codeChecks {
		if !fileContainsAll(workspacePath, []string{".cs"}, check.needles) {
			result.Missing = append(result.Missing, check.missing)
		}
	}

	pluginsDir := filepath.Join(workspacePath, "Assets", "Plugins", "Android")
	mainGradle := existingFiles(
		filepath.Join(pluginsDir, "mainTemplate.gradle"),
		filepath.Join(pluginsDir, "mainTemplate.gradle.kts"),
	)
	checkXutengGradle(mainGradle, "Unity mainTemplate", &result)
	gradleFiles := append([]string{}, mainGradle...)
	gradleFiles = append(gradleFiles, existingFiles(
		filepath.Join(pluginsDir, "launcherTemplate.gradle"),
		filepath.Join(pluginsDir, "launcherTemplate.gradle.kts"),
	)...)
	checkAndUpgradeXutengMinSdk(gradleFiles, &result)
	checkXutengAndroidConfig(workspacePath, gradleFiles, &result)
	finishXutengPreflight(&result, "补齐公共 Base/Login/Pay、Android 栩腾工程配置和公共 API 调用后重新调用 unity feature=xuteng")
	return result
}

func cocos2dxXutengPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return xutengPreflightNeedsWorkspace("cocos2dx")
	}
	result := PassportPreflightResult{Platform: "cocos2dx", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	checkXutengGradle(gradleFiles, "Cocos2dx Android", &result)
	checkAndUpgradeXutengMinSdk(gradleFiles, &result)
	checkXutengAndroidConfig(workspacePath, gradleFiles, &result)

	cppExtensions := []string{".cpp", ".cc", ".cxx", ".h", ".hpp"}
	checks := []struct {
		needles []string
		missing string
	}{
		{[]string{"->init("}, "未检测到 Cocos2dx RuixueBridge init 基础初始化"},
		{[]string{"->initThirdSdk("}, "未检测到 Cocos2dx RuixueBridge initThirdSdk 渠道初始化"},
		{[]string{"->login(", `"loginType"`, `"xuteng"`}, "未检测到 Cocos2dx login(loginType=xuteng)"},
		{[]string{"->pay(", `"payType"`, `"xuteng"`}, "未检测到 Cocos2dx pay(payType=xuteng)"},
		{[]string{"->setGameInfo("}, "未检测到 Cocos2dx setGameInfo 角色上报"},
		{[]string{"->logout("}, "未检测到 Cocos2dx logout 登出"},
		{[]string{"->exitApp("}, "未检测到 Cocos2dx exitApp 渠道退出"},
	}
	for _, check := range checks {
		if !fileContainsAll(workspacePath, cppExtensions, check.needles) {
			result.Missing = append(result.Missing, check.missing)
		}
	}
	finishXutengPreflight(&result, "补齐 Android 栩腾工程配置和公共 RuixueBridge 方法后重新调用 cocos2dx feature=xuteng")
	return result
}

func checkXutengGradle(gradleFiles []string, scope string, result *PassportPreflightResult) {
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, scope+" 未找到可识别的 Gradle 配置")
		return
	}
	upgradeRuixueGradleVersions(gradleFiles, xutengAndroidMinVersion, result)
	if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_xuteng", xutengAndroidMinVersion) {
		result.Missing = append(result.Missing,
			fmt.Sprintf("%s 未检测到 com.ruixue:rxsdk_xuteng 固定依赖（要求 >= %s）；不会静默添加", scope, xutengAndroidMinVersion))
	}
}

func checkAndUpgradeXutengMinSdk(paths []string, result *PassportPreflightResult) {
	pattern := regexp.MustCompile(`(?m)(minSdk(?:Version)?\s*(?:=|\s)\s*)([0-9]+)`)
	found := false
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		matches := pattern.FindAllSubmatchIndex(content, -1)
		if len(matches) == 0 {
			continue
		}
		found = true
		updated := append([]byte(nil), content...)
		for i := len(matches) - 1; i >= 0; i-- {
			match := matches[i]
			current, _ := strconv.Atoi(string(content[match[4]:match[5]]))
			if current >= xutengAndroidMinSDK {
				continue
			}
			updated = append(append(append([]byte{}, updated[:match[4]]...), []byte(strconv.Itoa(xutengAndroidMinSDK))...), updated[match[5]:]...)
			result.Modified = append(result.Modified,
				fmt.Sprintf("%s: minSdkVersion %d -> %d", path, current, xutengAndroidMinSDK))
		}
		writePreflightUpdate(path, string(content), string(updated), result)
	}
	if !found {
		result.Missing = append(result.Missing, "未检测到可校验的数字 minSdkVersion（栩腾要求 >= 23）")
	}
}

func checkXutengAndroidConfig(workspacePath string, gradleFiles []string, result *PassportPreflightResult) {
	manifests := collectProjectFiles(workspacePath, map[string]bool{"AndroidManifest.xml": true})
	if !filesContainAll(manifests, []string{"com.ruixue.sdk.XTApplication"}) {
		result.Missing = append(result.Missing, "AndroidManifest.xml 未配置宿主 Application 为 com.ruixue.sdk.XTApplication")
	}
	for _, placeholder := range []string{"CHANNELSDK_ID", "CHANNELSDK_GAME_VERSION"} {
		if !filesContainAll(gradleFiles, []string{placeholder}) {
			result.Missing = append(result.Missing, "Gradle defaultConfig 未配置 manifest placeholder "+placeholder)
		}
	}
	if !fileExistsNamed(workspacePath, "brsdk.cfg") {
		result.Missing = append(result.Missing, "未检测到母包工具生成的 assets/brsdk.cfg；不会生成假配置")
	}
}

func filesContainAll(paths, needles []string) bool {
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		matched := true
		for _, needle := range needles {
			if !strings.Contains(string(content), needle) {
				matched = false
				break
			}
		}
		if matched {
			return true
		}
	}
	return false
}

func checkXutengUnityManifest(path string, result *PassportPreflightResult) {
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
	required := []string{
		"com.ruixue.unitysdk.base",
		"com.ruixue.unitysdk.login",
		"com.ruixue.unitysdk.pay",
	}
	for _, packageName := range required {
		if _, exists := dependencies[packageName]; !exists {
			result.Missing = append(result.Missing,
				fmt.Sprintf("未检测到 %s 固定依赖（要求 >= %s）；不会静默添加", packageName, xutengUnityMinVersion))
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
		if compareVersion(cleanVersion(strings.TrimPrefix(current, "v")), xutengUnityMinVersion) >= 0 {
			continue
		}
		dependencies[name] = xutengUnityMinVersion
		changed = true
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, name, current, xutengUnityMinVersion))
	}
	if !changed {
		return
	}
	root["dependencies"] = dependencies
	updated, err := json.MarshalIndent(root, "", "  ")
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, err))
		return
	}
	writePreflightUpdate(path, string(content), string(append(updated, '\n')), result)
}

func finishXutengPreflight(result *PassportPreflightResult, nextStep string) {
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, nextStep)
	}
}
