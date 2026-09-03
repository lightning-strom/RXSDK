package rxsdk

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

const unifypayAndroidMinVersion = "4.0.17"

func unifypayPreflightNeedsWorkspace(platform string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:  platform,
		Checked:   false,
		Satisfied: false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能检查银联支付依赖与瑞雪 SDK 初始化",
			fmt.Sprintf("重新调用 %s feature=unifypay workspacePath=/path/to/project", platform),
		},
	}
}

func iosUnifypayPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		result := unifypayPreflightNeedsWorkspace("ios")
		result.Missing = []string{"iOS 平台不支持 Android 银联综合支付插件 rxsdk_unifypay"}
		result.NextSteps = append(result.NextSteps, "改用 Android 接入 UPPaySdkWrapper.getInstance().doPay")
		return result
	}
	return PassportPreflightResult{
		Platform:      "ios",
		WorkspacePath: workspacePath,
		Checked:       true,
		Satisfied:     false,
		Missing:       []string{"iOS 平台不支持 Android 银联综合支付插件 rxsdk_unifypay"},
		NextSteps:     []string{"改用 Android 接入；不要生成 iOS 伪支付调用"},
	}
}

func androidUnifypayPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return unifypayPreflightNeedsWorkspace("android")
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到可识别的 Gradle 配置")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, unifypayAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_unifypay", unifypayAndroidMinVersion) {
			result.Missing = append(result.Missing,
				"未检测到 com.ruixue:rxsdk_unifypay 固定依赖（要求 >= "+unifypayAndroidMinVersion+"）")
		}
		checkAndUpgradeUnifypayMinSdk(gradleFiles, &result)
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"},
		[]string{"RXSDK.initialize", "RuiXueSdk.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Android 瑞雪 SDK 基础初始化")
	}
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps,
			"补齐 rxsdk_unifypay、minSdkVersion 22 和基础初始化后重新调用 android feature=unifypay")
	}
	return result
}

func unityUnifypayPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return unifypayPreflightNeedsWorkspace("unity")
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	manifest := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifest); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json")
	} else {
		upgradeUnityManifestPackages(manifest, "4.0.0",
			[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.pay"}, true, &result)
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Unity Android mainTemplate.gradle")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, unifypayAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_unifypay", unifypayAndroidMinVersion) {
			result.Missing = append(result.Missing,
				"未检测到 com.ruixue:rxsdk_unifypay 固定依赖（要求 >= "+unifypayAndroidMinVersion+"）")
		}
		checkAndUpgradeUnifypayMinSdk(gradleFiles, &result)
	}
	if !fileContainsAny(workspacePath, []string{".cs"},
		[]string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity 瑞雪 SDK 基础初始化")
	}
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps,
			"补齐 UPM、rxsdk_unifypay、minSdkVersion 22 和初始化后重新调用 unity feature=unifypay")
	}
	return result
}

func cocos2dxUnifypayPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return unifypayPreflightNeedsWorkspace("cocos2dx")
	}
	result := PassportPreflightResult{Platform: "cocos2dx", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := collectProjectFiles(workspacePath, map[string]bool{
		"build.gradle": true, "build.gradle.kts": true,
	})
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Cocos2dx Android Gradle 配置")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, unifypayAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_unifypay", unifypayAndroidMinVersion) {
			result.Missing = append(result.Missing,
				"未检测到 com.ruixue:rxsdk_unifypay 固定依赖（要求 >= "+unifypayAndroidMinVersion+"）")
		}
		checkAndUpgradeUnifypayMinSdk(gradleFiles, &result)
	}
	if !fileContainsAny(workspacePath, []string{".cpp", ".cc", ".cxx", ".h", ".hpp"},
		[]string{"bridge->init(", "RuixueBridge::init", "getInstance()->init("}) {
		result.Missing = append(result.Missing, "未检测到 Cocos2dx RuixueBridge 基础初始化")
	}
	result.Satisfied = len(result.Missing) == 0 && len(result.Warnings) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps,
			"补齐 rxsdk_unifypay、minSdkVersion 22 和 RuixueBridge 初始化后重新调用 cocos2dx feature=unifypay")
	}
	return result
}

func checkAndUpgradeUnifypayMinSdk(paths []string, result *PassportPreflightResult) {
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
		updated := content
		changed := false
		for i := len(matches) - 1; i >= 0; i-- {
			match := matches[i]
			current, _ := strconv.Atoi(string(content[match[4]:match[5]]))
			if current >= 22 {
				continue
			}
			updated = append(append(append([]byte{}, updated[:match[4]]...), []byte("22")...), updated[match[5]:]...)
			changed = true
			result.Modified = append(result.Modified,
				fmt.Sprintf("%s: minSdkVersion %d -> 22", path, current))
		}
		if changed {
			if err := os.WriteFile(path, updated, 0644); err != nil {
				result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
			}
		}
	}
	if !found {
		result.Missing = append(result.Missing, "未检测到可校验的数字 minSdkVersion（银联要求 >= 22）")
	}
}
