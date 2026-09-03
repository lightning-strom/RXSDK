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
	gdtAndroidMinVersion = "4.0.16"
	gdtIOSMinVersion     = "1.0.2"
	gdtIOSPureMinVersion = "4.0.8"
	gdtUnityMinVersion   = "1.6.38"
	gdtMinigameVersion   = "4.0.2"
)

func androidGDTPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return gdtPreflightNeedsWorkspace("android")
	}

	result := PassportPreflightResult{
		Platform:      "android",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Gradle 配置，无法检查 com.ruixue:rxsdk_gdt:4.0.16")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, gdtAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_gdt", gdtAndroidMinVersion) {
			result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_gdt 依赖（要求 >= 4.0.16）")
		}
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{
		"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig",
	}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	hasManualInit := fileContainsAll(workspacePath, []string{".java", ".kt"}, []string{
		"GDTSdkWrapper", ".init(",
	})
	hasAutomaticConfig := fileContainsAll(workspacePath, []string{".json", ".java", ".kt"}, []string{
		"advertise_channel", "gdt", "tm",
	})
	if !hasManualInit && !hasAutomaticConfig {
		result.Missing = append(result.Missing, "未检测到 GDT 自动生命周期配置或 GDTSdkWrapper 手动初始化")
	}
	if !fileContainsAll(workspacePath, []string{".java", ".kt"}, []string{
		"GDTSdkWrapper",
		"reportCreateRole(",
		"reportCheckout(",
		"reportPurchase(",
	}) {
		result.Missing = append(result.Missing, "当前工程未检测到 GDTSdkWrapper 创角、下单、支付目标 API")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐依赖、基础初始化、GDT 生命周期和目标 API 后重新调用 android feature=gdt")
	}
	return result
}

func iosGDTPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return gdtPreflightNeedsWorkspace("ios")
	}

	result := PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	podfiles := existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "ios", "Podfile"),
	)
	if len(podfiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Podfile，无法检查 RXGDTSDK 1.0.2 与 RXSDK_Pure 4.0.8")
	} else {
		hasGDT := false
		hasPure := false
		allRuixuePodsValid := true
		for _, path := range podfiles {
			if upgradeExactPodMinimum(path, "RXGDTSDK", gdtIOSMinVersion, &result) {
				hasGDT = true
			}
			if upgradeExactPodMinimum(path, "RXSDK_Pure", gdtIOSPureMinVersion, &result) {
				hasPure = true
			}
			upgradeMatchingPodMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion, &result)
			allRuixuePodsValid = matchingPodsMeetMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion) && allRuixuePodsValid
		}
		if !hasGDT {
			result.Missing = append(result.Missing, "Podfile 未包含带明确版本的 RXGDTSDK（要求 >= 1.0.2）")
		}
		if !hasPure {
			result.Missing = append(result.Missing, "Podfile 未包含带明确版本的 RXSDK_Pure（要求 >= 4.0.8）")
		}
		if !allRuixuePodsValid {
			result.Missing = append(result.Missing, "Podfile 中 RXSDK* Pod 必须使用 >= 4.0.8 的明确固定版本")
		}
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到瑞雪 SDK 基础初始化")
	}
	if !fileContainsInOrder(workspacePath, []string{".m", ".mm", ".swift"},
		"[[RXGDTService sharedSDK] regist]", "initWithConfig:") {
		result.Missing = append(result.Missing, "未检测到 RXGDTService regist 在瑞雪 SDK 初始化之前调用")
	}
	if !fileContainsAll(workspacePath, []string{".m", ".mm", ".swift"}, []string{
		"applicationDidBecomeActive", `logAction:@"START_APP"`,
	}) {
		result.Missing = append(result.Missing, "未检测到 applicationDidBecomeActive 中的 START_APP 上报")
	}
	if !fileContainsAll(workspacePath, []string{".m", ".mm", ".swift"}, []string{
		"openURL", "handleOpenUrl:",
	}) {
		result.Missing = append(result.Missing, "未检测到 openURL 生命周期中的 RXGDTService handleOpenUrl")
	}
	if !fileContainsAll(workspacePath, []string{".h", ".m", ".mm", ".swift"}, []string{
		"reportCreateRoleActionWithRole:",
		"reportCheckoutActionWithContentType:",
		"reportPurchaseActionWithContentType:",
	}) {
		result.Missing = append(result.Missing, "当前工程未检测到 RXGDTService 创角、下单、支付目标 API")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐 Pod、初始化顺序、生命周期和目标 API 后重新调用 ios feature=gdt")
	}
	return result
}

func unityGDTPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return gdtPreflightNeedsWorkspace("unity")
	}

	result := PassportPreflightResult{
		Platform:      "unity",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	manifestBytes, err := os.ReadFile(manifestPath)
	if err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json")
		result.NextSteps = append(result.NextSteps, "创建有效的 Unity Packages/manifest.json 并接入目标 GDT 包后重试")
		result.Satisfied = false
		return result
	}
	var manifestRoot struct {
		Dependencies map[string]any `json:"dependencies"`
	}
	if err := json.Unmarshal(manifestBytes, &manifestRoot); err != nil || manifestRoot.Dependencies == nil {
		result.Missing = append(result.Missing, "Packages/manifest.json 格式无效或缺少 dependencies")
		result.NextSteps = append(result.NextSteps, "修复 Packages/manifest.json 后重新调用 unity feature=gdt")
		return result
	}
	_, hasMobile := manifestRoot.Dependencies["com.ruixue.unitysdk.gdt"]
	_, hasMinigame := manifestRoot.Dependencies["com.ruixue.unitysdk.minigame.weixin"]
	_, hasBase := manifestRoot.Dependencies["com.ruixue.unitysdk.base"]
	if !hasMobile && !hasMinigame {
		result.Missing = append(result.Missing, "未检测到移动 GDT 包或微信小游戏包，请按目标平台选择接入")
	}
	if !hasBase {
		result.Missing = append(result.Missing, "Packages/manifest.json 未检测到 com.ruixue.unitysdk.base")
	}
	upgradeGDTUnityManifest(manifestPath, manifestBytes, manifestRoot.Dependencies, &result)

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity 瑞雪 SDK 基础初始化")
	}
	if hasMobile {
		checkUnityMobileGDT(workspacePath, &result)
	}
	if hasMinigame {
		checkUnityMinigameGDT(workspacePath, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "按目标平台补齐移动 GDT 或微信小游戏 GDT 后重新调用 unity feature=gdt")
	}
	return result
}

func checkUnityMobileGDT(workspacePath string, result *PassportPreflightResult) {
	if !fileContainsInOrder(workspacePath, []string{".cs"}, "RXGDT.RegisterSdk()", "RuiXueSdk.Initialize") {
		result.Missing = append(result.Missing, "移动端未检测到 RXGDT.RegisterSdk 在 RuiXueSdk.Initialize 前调用")
	}
	if !fileContainsAll(workspacePath, []string{".cs"}, []string{
		"RXGDT.", "ReportCreateRole(", "ReportCheckout(", "ReportPurchase(",
	}) {
		result.Missing = append(result.Missing, "移动端未检测到 RXGDT 创角、下单、支付目标 API")
	}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Unity Android mainTemplate.gradle，无法验证 rxsdk_gdt 4.0.16")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, gdtAndroidMinVersion, result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_gdt", gdtAndroidMinVersion) {
			result.Missing = append(result.Missing, "Unity Android 导出配置未包含 com.ruixue:rxsdk_gdt")
		}
	}

	podfiles := existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "PodfileTemplate"),
		filepath.Join(workspacePath, "Assets", "Plugins", "iOS", "Podfile"),
	)
	if len(podfiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Unity iOS Podfile/PodfileTemplate，无法验证 RXGDTSDK 1.0.2")
	} else {
		hasGDT := false
		hasPure := false
		allRuixuePodsValid := true
		for _, path := range podfiles {
			hasGDT = upgradeExactPodMinimum(path, "RXGDTSDK", gdtIOSMinVersion, result) || hasGDT
			hasPure = upgradeExactPodMinimum(path, "RXSDK_Pure", gdtIOSPureMinVersion, result) || hasPure
			upgradeMatchingPodMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion, result)
			allRuixuePodsValid = matchingPodsMeetMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion) && allRuixuePodsValid
		}
		if !hasGDT || !hasPure || !allRuixuePodsValid {
			result.Missing = append(result.Missing, "Unity iOS 导出配置需包含明确版本 RXGDTSDK 1.0.2 与 RXSDK_Pure 4.0.8")
		}
	}
}

func checkUnityMinigameGDT(workspacePath string, result *PassportPreflightResult) {
	checkMinigameGDTArtifacts(workspacePath, result)
	if !fileContainsAll(workspacePath, []string{".cs"}, []string{
		"RXMiniGameWeiXin.ReportGdt",
		"RXMiniGameWeiXin.RegisterGdtMenuEventListeners",
		"RXMiniGameWeiXin.GetDirectAdStatusSync",
		"RXMiniGameWeiXin.OnDirectAdStatusChange",
	}) {
		result.Missing = append(result.Missing, "Unity 微信小游戏代码未覆盖 GDT 上报、菜单监听与直玩广告状态 API")
	}
}

func minigameGDTPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return gdtPreflightNeedsWorkspace("minigame")
	}
	result := PassportPreflightResult{
		Platform:      "minigame",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	checkMinigameGDTArtifacts(workspacePath, &result)
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps,
			"替换为 JSSDK 4.0.2 或更高版本构建产物，补齐 tencent-sdk.js、初始化、GDT 和直玩接口后重试")
	}
	return result
}

func cocos2dxGDTPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return gdtPreflightNeedsWorkspace("cocos2dx")
	}
	result := PassportPreflightResult{
		Platform:      "cocos2dx",
		WorkspacePath: workspacePath,
		Checked:       true,
	}

	if !fileContainsAll(workspacePath, []string{".h", ".hpp"}, []string{
		"gdtRegisterSdk", "gdtInitialize", "gdtReportRegister", "gdtReportLogin",
		"gdtReportCreateRole", "gdtReportCheckout", "gdtReportPurchase",
		"gdtReportQuestFinish", "gdtReportShare", "gdtReportUpdateLevel",
		"gdtReportRateApp", "gdtReportViewContent", "gdtReportAddToCart",
	}) {
		result.Missing = append(result.Missing, "RuixueBridge 头文件未声明完整 GDT API")
	}
	if !fileContainsAll(workspacePath, []string{".cpp"}, []string{
		"RuixueBridge::gdtInitialize", "gdtReportPurchase",
	}) || !fileContainsAll(workspacePath, []string{".java", ".kt"}, []string{
		"GDTSdkWrapper", "gdtReportPurchase",
	}) {
		result.Missing = append(result.Missing, "未检测到完整 Android JNI GDT 桥接实现")
	}
	if !fileContainsAll(workspacePath, []string{".mm"}, []string{
		"RuixueBridge::gdtRegisterSdk", "gdtReportPurchase",
	}) || !fileContainsAny(workspacePath, []string{".m", ".mm"}, []string{"RXGDTService"}) {
		result.Missing = append(result.Missing, "未检测到完整 iOS GDT 桥接实现")
	}
	if !fileContainsAny(workspacePath, []string{".cpp", ".cc", ".mm"}, []string{"->init(", ".init("}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx 瑞雪 SDK 基础初始化")
	}
	if !fileContainsInOrder(workspacePath, []string{".cpp", ".cc", ".mm"}, "gdtRegisterSdk", "->init(") {
		result.Missing = append(result.Missing, "未检测到 gdtRegisterSdk 在 RuixueBridge::init 前调用")
	}
	if !fileContainsAny(workspacePath, []string{".cpp", ".cc", ".mm"}, []string{"gdtInitialize("}) {
		result.Missing = append(result.Missing, "未检测到 RuixueBridge GDT 初始化调用")
	}

	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Cocos2dx Android Gradle 配置")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, gdtAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_gdt", gdtAndroidMinVersion) {
			result.Missing = append(result.Missing, "Cocos2dx Android 未包含 com.ruixue:rxsdk_gdt:4.0.16")
		}
	}

	podfiles := collectProjectFiles(workspacePath, map[string]bool{"Podfile": true, "PodfileTemplate": true})
	if len(podfiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Cocos2dx iOS Podfile")
	} else {
		hasGDT := false
		hasPure := false
		allRuixuePodsValid := true
		for _, path := range podfiles {
			hasGDT = upgradeExactPodMinimum(path, "RXGDTSDK", gdtIOSMinVersion, &result) || hasGDT
			hasPure = upgradeExactPodMinimum(path, "RXSDK_Pure", gdtIOSPureMinVersion, &result) || hasPure
			upgradeMatchingPodMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion, &result)
			allRuixuePodsValid = matchingPodsMeetMinimum(path, regexp.MustCompile(`^RXSDK`), gdtIOSPureMinVersion) && allRuixuePodsValid
		}
		if !hasGDT || !hasPure || !allRuixuePodsValid {
			result.Missing = append(result.Missing, "Cocos2dx iOS 需包含明确版本 RXGDTSDK 1.0.2 与 RXSDK_Pure 4.0.8")
		}
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐 RuixueBridge API、双端桥接、依赖和初始化顺序后重新调用 cocos2dx feature=gdt")
	}
	return result
}

func checkMinigameGDTArtifacts(workspacePath string, result *PassportPreflightResult) {
	version := detectMinigameSDKVersion(workspacePath)
	if version == "" {
		result.Missing = append(result.Missing, "无法识别 JSSDK 构建产物版本（要求 >= 4.0.2）")
	} else if compareVersion(version, gdtMinigameVersion) < 0 {
		result.Missing = append(result.Missing,
			fmt.Sprintf("JSSDK 当前版本 %s，GDT 要求 >= %s；构建产物需手动替换", version, gdtMinigameVersion))
	}
	if !fileExistsNamed(workspacePath, "tencent-sdk.js") {
		result.Missing = append(result.Missing, "未检测到 tencent-sdk.js")
	}
	if !fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{"wx.TencentSDK"}) {
		result.Missing = append(result.Missing, "未检测到 wx.TencentSDK = SDK 注入")
	}
	if !fileContainsAll(workspacePath, []string{".js", ".ts"}, []string{
		"productId", "channelId", "cpid", "baseUrlList",
	}) {
		result.Missing = append(result.Missing, "未检测到完整 JSSDK 初始化参数")
	}
	if !fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{
		"new RxSdk", "new RXSDK", "new channelSDK",
	}) {
		result.Missing = append(result.Missing, "未检测到小游戏 JSSDK 初始化代码")
	}
	if !fileContainsAll(workspacePath, []string{".js", ".ts"}, []string{
		"reportGdt", "reportCreateRole", "reportUpdateLevel", "reportViewContent",
	}) {
		result.Missing = append(result.Missing, "JSSDK 构建产物缺少 GDT 必报目标 API")
	}
	if !fileContainsAll(workspacePath, []string{".js", ".ts"}, []string{
		"getDirectAdStatusSync", "onDirectAdStatusChange",
	}) {
		result.Missing = append(result.Missing, "JSSDK 构建产物缺少直玩广告状态 API")
	}
}

func collectProjectFiles(root string, names map[string]bool) []string {
	var paths []string
	_ = filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if entry.IsDir() {
			switch entry.Name() {
			case ".git", "build", ".gradle", "node_modules", "Library", "DerivedData", "Pods":
				return filepath.SkipDir
			}
			return nil
		}
		if names[entry.Name()] {
			paths = append(paths, path)
		}
		return nil
	})
	return paths
}

func gradleDependencyMeetsMinimum(paths []string, artifact, minVersion string) bool {
	re := regexp.MustCompile(`com\.ruixue:` + regexp.QuoteMeta(artifact) + `:([0-9]+\.[0-9]+\.[0-9]+(?:[.\-\w]*)?)`)
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		match := re.FindSubmatch(content)
		if len(match) == 2 && compareVersion(string(match[1]), minVersion) >= 0 {
			return true
		}
	}
	return false
}

func upgradeGDTUnityManifest(path string, original []byte, dependencies map[string]any, result *PassportPreflightResult) {
	versionPattern := regexp.MustCompile(`^v?[0-9]+\.[0-9]+\.[0-9]+(?:[-.][0-9A-Za-z]+)*$`)
	changed := false
	for name, rawValue := range dependencies {
		if !strings.HasPrefix(name, "com.ruixue.unitysdk.") {
			continue
		}
		current, ok := rawValue.(string)
		if !ok || !versionPattern.MatchString(strings.TrimSpace(current)) {
			result.Missing = append(result.Missing,
				fmt.Sprintf("%s 使用非固定语义版本，无法安全校验或升级", name))
			continue
		}
		if compareVersion(cleanVersion(current), gdtUnityMinVersion) >= 0 {
			continue
		}
		dependencies[name] = gdtUnityMinVersion
		changed = true
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, name, current, gdtUnityMinVersion))
	}
	if !changed {
		return
	}
	var root map[string]any
	if err := json.Unmarshal(original, &root); err != nil {
		return
	}
	root["dependencies"] = dependencies
	updated, err := json.MarshalIndent(root, "", "  ")
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, err))
		return
	}
	writePreflightUpdate(path, string(original), string(append(updated, '\n')), result)
}

func gdtPreflightNeedsWorkspace(platform string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能实际检查 GDT 接入并安全升级低版本依赖",
			fmt.Sprintf("重新调用 %s feature=gdt workspacePath=/path/to/project", platform),
		},
	}
}

func upgradeExactPodMinimum(path, podName, minVersion string, result *PassportPreflightResult) bool {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return false
	}
	content := string(contentBytes)
	re := regexp.MustCompile(`(?m)^([ \t]*pod[ \t]+['"]` + regexp.QuoteMeta(podName) + `['"][ \t]*,[ \t]*['"])([^'"]+)(['"].*)$`)
	if !re.MatchString(content) {
		return false
	}
	updated := re.ReplaceAllStringFunc(content, func(match string) string {
		parts := re.FindStringSubmatch(match)
		if len(parts) != 4 || compareVersion(cleanVersion(parts[2]), minVersion) >= 0 {
			return match
		}
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, podName, parts[2], minVersion))
		return parts[1] + minVersion + parts[3]
	})
	writePreflightUpdate(path, content, updated, result)
	return true
}

func upgradeMatchingPodMinimum(path string, namePattern *regexp.Regexp, minVersion string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		return
	}
	content := string(contentBytes)
	re := regexp.MustCompile(`(?m)^([ \t]*pod[ \t]+['"])([^'"]+)(['"][ \t]*,[ \t]*['"])([^'"]+)(['"].*)$`)
	updated := re.ReplaceAllStringFunc(content, func(match string) string {
		parts := re.FindStringSubmatch(match)
		if len(parts) != 6 || !namePattern.MatchString(parts[2]) ||
			compareVersion(cleanVersion(parts[4]), minVersion) >= 0 {
			return match
		}
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, parts[2], parts[4], minVersion))
		return parts[1] + parts[2] + parts[3] + minVersion + parts[5]
	})
	writePreflightUpdate(path, content, updated, result)
}

func matchingPodsMeetMinimum(path string, namePattern *regexp.Regexp, minVersion string) bool {
	content, err := os.ReadFile(path)
	if err != nil {
		return false
	}
	activePod := regexp.MustCompile(`(?m)^[ \t]*pod[ \t]+['"]([^'"]+)['"]([^\r\n]*)$`)
	version := regexp.MustCompile(`^[ \t]*,[ \t]*['"]([^'"]+)['"]`)
	valid := true
	for _, match := range activePod.FindAllStringSubmatch(string(content), -1) {
		if len(match) != 3 || !namePattern.MatchString(match[1]) {
			continue
		}
		versionMatch := version.FindStringSubmatch(match[2])
		if len(versionMatch) != 2 || compareVersion(cleanVersion(versionMatch[1]), minVersion) < 0 {
			valid = false
		}
	}
	return valid
}

func writePreflightUpdate(path, original, updated string, result *PassportPreflightResult) {
	if updated == original {
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
	}
}

func fileContainsInOrder(root string, exts []string, first, second string) bool {
	return walkTextFiles(root, exts, func(content string) bool {
		firstIndex := strings.Index(content, first)
		secondIndex := strings.Index(content, second)
		return firstIndex >= 0 && secondIndex > firstIndex
	})
}

func fileContainsAll(root string, exts, needles []string) bool {
	return walkTextFiles(root, exts, func(content string) bool {
		for _, needle := range needles {
			if !strings.Contains(content, needle) {
				return false
			}
		}
		return true
	})
}

func walkTextFiles(root string, exts []string, match func(string) bool) bool {
	extSet := make(map[string]bool, len(exts))
	for _, ext := range exts {
		extSet[ext] = true
	}
	found := false
	_ = filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil || found {
			return nil
		}
		if entry.IsDir() {
			switch entry.Name() {
			case ".git", "build", ".gradle", "node_modules", "Library", "DerivedData":
				return filepath.SkipDir
			}
			return nil
		}
		if !extSet[filepath.Ext(path)] {
			return nil
		}
		content, readErr := os.ReadFile(path)
		if readErr == nil && match(string(content)) {
			found = true
		}
		return nil
	})
	return found
}
