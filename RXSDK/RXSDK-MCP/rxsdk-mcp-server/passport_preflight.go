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
	passportAndroidMinVersion      = "4.0.9"
	setGameInfoAndroidMinVersion   = "4.0.16"
	mumuAndroidMinVersion          = "4.0.19"
	iifaaAndroidMinVersion         = "4.0.14"
	rustoreAndroidMinVersion       = "4.0.11"
	iifaaIOSPureMinVersion         = "4.0.6"
	iifaaIOSUIKitMinVersion        = "4.0.4"
	iifaaUnityMinVersion           = "1.6.31"
	iosShareMinVersion             = "4.0.5"
	passportIOSMinVersion          = "4.0.4"
	passportUnityMinVersion        = "1.6.26"
	lbsIOSMinVersion               = "4.0.0"
	lbsUnityMinVersion             = "1.6.26"
	tempNoticeUnityMinVersion      = "1.6.28"
	versionCheckAndroidMinVersion  = "4.0.13"
	versionCheckIOSMinVersion      = "4.0.8"
	versionCheckUnityMinVersion    = "1.6.39"
	gameInfoUnityMinVersion        = "4.0.3"
	mumuUnityMinVersion            = "4.0.2"
	versionCheckMinigameMinVersion = "4.0.2"
)

type PassportPreflightResult struct {
	Platform      string   `json:"platform"`
	WorkspacePath string   `json:"workspacePath,omitempty"`
	Checked       bool     `json:"checked"`
	Satisfied     bool     `json:"satisfied"`
	Modified      []string `json:"modified,omitempty"`
	Missing       []string `json:"missing,omitempty"`
	Warnings      []string `json:"warnings,omitempty"`
	NextSteps     []string `json:"nextSteps,omitempty"`
}

func passportPreflightNeedsWorkspace(platform, workspacePath string) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:      platform,
		WorkspacePath: workspacePath,
		Checked:       false,
		Satisfied:     false,
		NextSteps: []string{
			"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
			fmt.Sprintf("重新调用 %s feature=passport workspacePath=/path/to/project", platform),
		},
	}
}

func androidPassportPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return passportPreflightNeedsWorkspace("android", workspacePath)
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先执行 android feature=setup version=4.0.9")
	} else if !upgradeRuixueGradleVersions(gradleFiles, passportAndroidMinVersion, &result) {
		result.Missing = append(result.Missing, "未发现 com.ruixue:* SDK 依赖，请先执行 android feature=setup version=4.0.9 或 android feature=dependency version=4.0.9")
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码，请先接入 android feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 getUserInfoByField 业务代码")
	}
	return result
}

func androidSetGameInfoPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 android feature=game_character workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先执行 android feature=setup version=4.0.16")
	} else if !upgradeRuixueGradleVersions(gradleFiles, setGameInfoAndroidMinVersion, &result) {
		result.Missing = append(result.Missing, "未发现 com.ruixue:* SDK 依赖，请先执行 android feature=setup version=4.0.16 或 android feature=dependency version=4.0.16")
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码，请先接入 android feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 SetGameInfo / SetThirdGameInfo 业务代码")
	}
	return result
}

func androidMumuPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查 MuMu 渠道接入和自动升级版本",
				"重新调用 android feature=mumu workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Gradle 配置，请先执行 android feature=setup channel=rxsdk_yofun version=4.0.16")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, mumuAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_yofun", mumuAndroidMinVersion) {
			result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_yofun:4.0.16 或更高版本")
		}
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码")
	}
	if !fileContainsAny(workspacePath, []string{".xml"}, []string{"YOFUN_APP_ID"}) {
		result.Missing = append(result.Missing, "AndroidManifest.xml 未配置 YOFUN_APP_ID")
	}
	if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"maven-release.webapp.163.com/repository/maven-releases"}) {
		result.Missing = append(result.Missing, "未配置 Yofun Maven 仓库")
	}
	if !fileContainsAny(workspacePath, []string{".gradle", ".kts", ".xml"}, []string{".yofun.mumu"}) {
		result.Missing = append(result.Missing, "未检测到以 .yofun.mumu 结尾的 Android 包名")
	}
	if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"multiDexEnabled true", "multiDexEnabled = true"}) {
		result.Missing = append(result.Missing, "Android 工程未启用 MultiDex")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"initThirdSdk"}) ||
		!fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"debugMode"}) {
		result.Missing = append(result.Missing, "未检测到带 debugMode 参数的 initThirdSdk")
	}
	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"invokeChannelAction"}) ||
		!fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{`"showSplash"`, `"splashType"`}) {
		result.Missing = append(result.Missing, "未检测到 invokeChannelAction(action=showSplash, splashType=0/1/2) 通用渠道调用")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐 Yofun Maven、APP_ID、包名、MultiDex、初始化和 rxsdk_yofun 依赖后重新调用")
	}
	return result
}

func androidVersionCheckPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 android feature=version_check workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先执行 android feature=setup version=4.0.13")
	} else if !upgradeRuixueGradleVersions(gradleFiles, versionCheckAndroidMinVersion, &result) {
		result.Missing = append(result.Missing, "未发现 com.ruixue:* SDK 依赖，请先执行 android feature=setup version=4.0.13 或 android feature=dependency version=4.0.13")
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码，请先接入 android feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 updateGameVersion v2 版本检查代码")
	}
	return result
}

func androidIifaaRealAuthPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 android feature=real_auth workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先执行 android feature=setup version=4.0.10")
	} else if !upgradeRuixueGradleVersions(gradleFiles, iifaaAndroidMinVersion, &result) {
		result.Missing = append(result.Missing, "未发现 com.ruixue:* SDK 依赖，请先执行 android feature=setup version=4.0.10 或 android feature=dependency version=4.0.10")
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码，请先接入 android feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 IIFAA 支付宝实名认证代码")
	}
	return result
}

func androidRustorePaymentPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 android feature=payment workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先执行 android feature=setup channel=rxsdk_rustore version=4.0.11")
	} else {
		if !upgradeRuixueGradleVersions(gradleFiles, rustoreAndroidMinVersion, &result) {
			result.Missing = append(result.Missing, "未发现 com.ruixue:* SDK 依赖，请先执行 android feature=setup channel=rxsdk_rustore version=4.0.11 或 android feature=dependency channel=rxsdk_rustore version=4.0.11")
		}
		if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.ruixue:rxsdk_rustore"}) {
			result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_rustore 依赖，请先接入 RuStore 渠道库 4.0.11 或更高版本")
		}
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"RXSDK.initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RXSDK.initialize / RXSdkInitConfig 初始化代码，请先接入 android feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RuStore 支付 hq_type=rupay 业务代码")
	}
	return result
}

func androidFirebasePreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查 Firebase 依赖和 google-services 配置",
				"重新调用 android feature=firebase workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
		filepath.Join(workspacePath, "settings.gradle"),
		filepath.Join(workspacePath, "settings.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先接入 com.ruixue:rxsdk_firebase:${version}")
	} else {
		if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.ruixue:rxsdk_firebase"}) {
			result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_firebase 依赖，请先在 app/build.gradle 添加 Firebase 组件依赖")
		}
		if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.google.gms.google-services"}) {
			result.Missing = append(result.Missing, "未检测到 com.google.gms.google-services 插件，请先在 app 模块应用 google-services 插件")
		}
	}

	if !fileExistsNamed(workspacePath, "google-services.json") {
		result.Missing = append(result.Missing, "未检测到 google-services.json，请放到 app/ 或 app/src/<flavor>/ 目录")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐 Firebase 依赖、google-services.json 和 google-services 插件，再插入 Firebase 业务代码")
	}
	return result
}

func androidAdjustPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查 Adjust 依赖、权限和初始化代码",
				"重新调用 android feature=adjust workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "android", WorkspacePath: workspacePath, Checked: true}

	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "build.gradle"),
		filepath.Join(workspacePath, "build.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 build.gradle / build.gradle.kts，请先接入 com.ruixue:rxsdk_adjust:${version}")
	} else if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.ruixue:rxsdk_adjust"}) {
		result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_adjust 依赖，请先在 app/build.gradle 添加 Adjust 组件依赖")
	}

	if !fileContainsAny(workspacePath, []string{".xml"}, []string{"android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE"}) {
		result.Missing = append(result.Missing, "未检测到 INTERNET / ACCESS_NETWORK_STATE 权限，请在 AndroidManifest.xml 添加 Adjust 必需权限")
	}

	if !fileContainsAny(workspacePath, []string{".java", ".kt"}, []string{"AdjustSdkWrapper.getInstance().init", "RxAdjustConfig"}) {
		result.Missing = append(result.Missing, "未检测到 AdjustSdkWrapper / RxAdjustConfig 初始化代码，请先在 Application 中初始化 Adjust")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐 Adjust 依赖、Manifest 权限和初始化代码，再插入 Adjust 业务代码")
	}
	return result
}

func iosPassportPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return passportPreflightNeedsWorkspace("ios", workspacePath)
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}

	podfilePath := filepath.Join(workspacePath, "Podfile")
	if _, err := os.Stat(podfilePath); err != nil {
		result.Missing = append(result.Missing, "未找到 Podfile，请先执行 ios feature=setup 或手动接入 RXSDK_Pure 4.0.4")
	} else if !upgradePodVersion(podfilePath, "RXSDK_Pure", passportIOSMinVersion, &result) {
		result.Missing = append(result.Missing, "Podfile 未包含 RXSDK_Pure，请先添加 pod 'RXSDK_Pure', '4.0.4'")
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码，请先接入 ios feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 getUserInfoByFieldWithParams 业务代码")
	}
	return result
}

func iosGameCharacterPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入",
				"重新调用 ios feature=game_character workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}
	podfiles := existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "ios", "Podfile"),
	)
	if len(podfiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Podfile，请先执行 ios feature=setup")
	} else {
		hasPure := false
		for _, path := range podfiles {
			content, err := os.ReadFile(path)
			if err == nil && strings.Contains(string(content), "RXSDK_Pure") {
				hasPure = true
				break
			}
		}
		if !hasPure {
			result.Missing = append(result.Missing, "Podfile 未检测到 RXSDK_Pure，请先完成 iOS 基础接入")
		}
	}
	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐 iOS 基础接入，再调用 setGameInfoWithRoleId:regionTag:")
	}
	return result
}

func iosAppleSigninConfigPreflight(workspacePath, targetName string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 和 targetName 后 MCP 才能配置 Sign in with Apple",
				"重新调用 ios feature=apple_signin_config workspacePath=/path/to/project targetName=YourTarget",
			},
		}
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}
	if strings.TrimSpace(targetName) == "" {
		result.Missing = append(result.Missing, "apple_signin_config 必须传入明确的 targetName，避免修改错误 Target")
		result.Satisfied = false
		return result
	}
	configureIOSSignInWithApple(workspacePath, targetName, &result)
	result.Satisfied = len(result.Missing) == 0
	result.NextSteps = append(result.NextSteps,
		"请在 Apple Developer 后台为 App ID 开启 Sign in with Apple 能力",
		"重新生成或刷新包含 Sign in with Apple 的 Provisioning Profile",
	)
	return result
}

func configureIOSSignInWithApple(workspacePath, targetName string, result *PassportPreflightResult) {
	target := strings.TrimSpace(targetName)
	if target == "" {
		target = findXcodeprojTarget(workspacePath)
	}
	if target == "" {
		result.Missing = append(result.Missing, "未找到 iOS Target，请传入 targetName")
		return
	}

	defaultPath := filepath.ToSlash(filepath.Join(target, target+".entitlements"))
	entitlementsPath, pbxprojPath, pbxModified, entitlementsModified, err := updateAndBindTargetEntitlements(
		workspacePath,
		target,
		defaultPath,
		addSignInWithAppleToEntitlements,
	)
	if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("配置 Sign in with Apple 失败: %v", err))
		return
	}
	if pbxModified {
		result.Modified = append(result.Modified, pbxprojPath+": added CODE_SIGN_ENTITLEMENTS for target "+target)
	}
	if entitlementsModified {
		result.Modified = append(result.Modified, entitlementsPath+": added com.apple.developer.applesignin")
	}
}

func updateAndBindTargetEntitlements(
	workspacePath,
	targetName,
	defaultPath string,
	update func(string) (bool, error),
) (string, string, bool, bool, error) {
	relativePath, pbxprojPath, pbxModified, err := configureTargetEntitlementsBinding(
		workspacePath,
		targetName,
		defaultPath,
		false,
	)
	if err != nil {
		return "", "", false, false, err
	}
	entitlementsPath, err := resolveProjectRelativePath(workspacePath, relativePath)
	if err != nil {
		return "", "", false, false, err
	}
	originalEntitlements, originalErr := os.ReadFile(entitlementsPath)
	entitlementsExisted := originalErr == nil
	if originalErr != nil && !os.IsNotExist(originalErr) {
		return "", "", false, false, fmt.Errorf("读取 entitlements 失败: %v", originalErr)
	}
	entitlementsModified, err := update(entitlementsPath)
	if err != nil {
		rollbackErr := rollbackEntitlementsFile(entitlementsPath, originalEntitlements, entitlementsExisted)
		if rollbackErr != nil {
			err = fmt.Errorf("%v；回滚 entitlements 失败: %v", err, rollbackErr)
		}
		return "", "", false, false, err
	}
	if pbxModified {
		if _, _, applied, err := configureTargetEntitlementsBinding(workspacePath, targetName, defaultPath, true); err != nil {
			rollbackErr := rollbackEntitlementsFile(entitlementsPath, originalEntitlements, entitlementsExisted)
			if rollbackErr != nil {
				err = fmt.Errorf("%v；回滚 entitlements 失败: %v", err, rollbackErr)
			}
			return "", "", false, false, err
		} else if !applied {
			err := fmt.Errorf("project.pbxproj 未发生预期修改")
			if rollbackErr := rollbackEntitlementsFile(entitlementsPath, originalEntitlements, entitlementsExisted); rollbackErr != nil {
				err = fmt.Errorf("%v；回滚 entitlements 失败: %v", err, rollbackErr)
			}
			return "", "", false, false, err
		}
	}
	return entitlementsPath, pbxprojPath, pbxModified, entitlementsModified, nil
}

func rollbackEntitlementsFile(path string, original []byte, existed bool) error {
	if existed {
		return atomicWriteFile(path, original)
	}
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func configureTargetEntitlementsBinding(workspacePath, targetName, defaultPath string, apply bool) (string, string, bool, error) {
	if info, err := os.Lstat(workspacePath); err != nil {
		return "", "", false, fmt.Errorf("检查工程目录失败: %v", err)
	} else if info.Mode()&os.ModeSymlink != 0 {
		return "", "", false, fmt.Errorf("workspacePath 不允许是符号链接: %s", workspacePath)
	}
	entries, err := os.ReadDir(workspacePath)
	if err != nil {
		return "", "", false, fmt.Errorf("读取工程目录失败: %v", err)
	}
	var projectPath string
	var projectContent string
	configListPattern := regexp.MustCompile(`buildConfigurationList = ([A-Fa-f0-9]{24}) /\* Build configuration list for PBXNativeTarget "` + regexp.QuoteMeta(targetName) + `" \*/;`)
	for _, entry := range entries {
		if !strings.HasSuffix(entry.Name(), ".xcodeproj") {
			continue
		}
		xcodeprojPath := filepath.Join(workspacePath, entry.Name())
		if info, err := os.Lstat(xcodeprojPath); err != nil || info.Mode()&os.ModeSymlink != 0 {
			continue
		}
		path := filepath.Join(xcodeprojPath, "project.pbxproj")
		if info, err := os.Lstat(path); err != nil || info.Mode()&os.ModeSymlink != 0 {
			continue
		}
		content, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		if configListPattern.Match(content) {
			if projectPath != "" {
				return "", "", false, fmt.Errorf("多个 .xcodeproj 包含 Target %s，请缩小 workspacePath", targetName)
			}
			projectPath = path
			projectContent = string(content)
		}
	}
	if projectPath == "" {
		return "", "", false, fmt.Errorf("未找到 Target %s 对应的 PBXNativeTarget", targetName)
	}

	configListMatch := configListPattern.FindStringSubmatch(projectContent)
	configListID := configListMatch[1]
	configurationsPattern := regexp.MustCompile(`(?s)` + configListID + ` /\* Build configuration list for PBXNativeTarget "[^"]+" \*/ = \{.*?buildConfigurations = \((.*?)\);`)
	configurationsMatch := configurationsPattern.FindStringSubmatch(projectContent)
	if len(configurationsMatch) != 2 {
		return "", "", false, fmt.Errorf("无法解析 Target %s 的 buildConfigurations", targetName)
	}
	idPattern := regexp.MustCompile(`[A-Fa-f0-9]{24}`)
	configurationIDs := idPattern.FindAllString(configurationsMatch[1], -1)
	if len(configurationIDs) == 0 {
		return "", "", false, fmt.Errorf("Target %s 没有 build configuration", targetName)
	}

	type configurationBlock struct {
		full       string
		prefix     string
		body       string
		suffix     string
		configured bool
	}
	var blocks []configurationBlock
	pathPattern := regexp.MustCompile(`CODE_SIGN_ENTITLEMENTS\s*=\s*"?([^";\r\n]+)"?;`)
	paths := map[string]bool{}
	for _, configurationID := range configurationIDs {
		blockPattern := regexp.MustCompile(`(?s)(` + configurationID + ` /\* [^*]+ \*/ = \{.*?isa = XCBuildConfiguration;.*?buildSettings = \{)(.*?)(\n\s*\};\s*name = [^;]+;\s*\};)`)
		match := blockPattern.FindStringSubmatch(projectContent)
		if len(match) != 4 {
			return "", "", false, fmt.Errorf("无法解析 Target %s 的 buildSettings %s", targetName, configurationID)
		}
		block := configurationBlock{full: match[0], prefix: match[1], body: match[2], suffix: match[3]}
		if pathMatch := pathPattern.FindStringSubmatch(match[2]); len(pathMatch) == 2 {
			paths[strings.TrimSpace(pathMatch[1])] = true
			block.configured = true
		} else if xcconfigPath, found, err := configuredEntitlementsFromXCConfig(workspacePath, projectContent, match[0]); err != nil {
			return "", "", false, err
		} else if found {
			paths[xcconfigPath] = true
			block.configured = true
		}
		blocks = append(blocks, block)
	}
	if len(paths) > 1 {
		return "", "", false, fmt.Errorf("Target %s 的 CODE_SIGN_ENTITLEMENTS 路径不一致", targetName)
	}
	relativePath := defaultPath
	for path := range paths {
		relativePath = path
	}

	updated := projectContent
	for _, block := range blocks {
		if block.configured {
			continue
		}
		insert := fmt.Sprintf("\n\t\t\t\tCODE_SIGN_ENTITLEMENTS = \"%s\";", relativePath)
		updatedBlock := block.prefix + insert + block.body + block.suffix
		updated = strings.Replace(updated, block.full, updatedBlock, 1)
	}
	if updated == projectContent {
		return relativePath, projectPath, false, nil
	}
	if !apply {
		return relativePath, projectPath, true, nil
	}
	if err := atomicWriteFile(projectPath, []byte(updated)); err != nil {
		return "", "", false, fmt.Errorf("写入 project.pbxproj 失败: %v", err)
	}
	return relativePath, projectPath, true, nil
}

func configuredEntitlementsFromXCConfig(workspacePath, projectContent, configurationBlock string) (string, bool, error) {
	baseConfigPattern := regexp.MustCompile(`baseConfigurationReference = ([A-Fa-f0-9]{24}) /\* ([^*]+) \*/;`)
	baseConfigMatch := baseConfigPattern.FindStringSubmatch(configurationBlock)
	if len(baseConfigMatch) != 3 {
		return "", false, nil
	}
	fileReferencePattern := regexp.MustCompile(`(?s)` + baseConfigMatch[1] + ` /\* [^*]+ \*/ = \{.*?isa = PBXFileReference;.*?path = ("[^"]+"|[^;]+);.*?\};`)
	fileReferenceMatch := fileReferencePattern.FindStringSubmatch(projectContent)
	if len(fileReferenceMatch) != 2 {
		return "", false, fmt.Errorf("无法解析 xcconfig 引用 %s", baseConfigMatch[2])
	}
	referencePath := strings.Trim(strings.TrimSpace(fileReferenceMatch[1]), `"`)
	xcconfigPath := filepath.Join(workspacePath, filepath.FromSlash(referencePath))
	if _, err := os.Stat(xcconfigPath); err != nil {
		var candidates []string
		_ = filepath.WalkDir(workspacePath, func(path string, entry os.DirEntry, walkErr error) error {
			if walkErr != nil {
				return nil
			}
			if entry.IsDir() && (entry.Name() == ".git" || entry.Name() == "build" || entry.Name() == "DerivedData") {
				return filepath.SkipDir
			}
			if !entry.IsDir() && entry.Name() == filepath.Base(referencePath) {
				candidates = append(candidates, path)
			}
			return nil
		})
		if len(candidates) != 1 {
			return "", false, fmt.Errorf("无法安全定位 xcconfig %s", referencePath)
		}
		xcconfigPath = candidates[0]
	}
	return readXCConfigEntitlements(xcconfigPath, map[string]bool{})
}

func readXCConfigEntitlements(path string, visited map[string]bool) (string, bool, error) {
	path = filepath.Clean(path)
	if visited[path] {
		return "", false, fmt.Errorf("xcconfig include 存在循环: %s", path)
	}
	visited[path] = true
	defer delete(visited, path)
	content, err := os.ReadFile(path)
	if err != nil {
		return "", false, fmt.Errorf("读取 xcconfig 失败: %v", err)
	}
	entitlementsPattern := regexp.MustCompile(`^[ \t]*CODE_SIGN_ENTITLEMENTS[ \t]*=[ \t]*(.+)$`)
	includePattern := regexp.MustCompile(`^[ \t]*#include(\??)[ \t]+"([^"]+)"`)
	var effectiveValue string
	for _, line := range strings.Split(string(content), "\n") {
		if match := includePattern.FindStringSubmatch(line); len(match) == 3 {
			includePath := filepath.Join(filepath.Dir(path), filepath.FromSlash(match[2]))
			if match[1] == "?" {
				if _, err := os.Stat(includePath); os.IsNotExist(err) {
					continue
				}
			}
			value, found, err := readXCConfigEntitlements(includePath, visited)
			if err != nil {
				return "", false, err
			}
			if found {
				effectiveValue = value
			}
			continue
		}
		if match := entitlementsPattern.FindStringSubmatch(line); len(match) == 2 {
			value := strings.Trim(strings.TrimSpace(strings.Split(match[1], "//")[0]), `"`)
			if value == "" {
				return "", false, fmt.Errorf("xcconfig 中 CODE_SIGN_ENTITLEMENTS 为空: %s", path)
			}
			effectiveValue = value
		}
	}
	return effectiveValue, effectiveValue != "", nil
}

func atomicWriteFile(path string, content []byte) error {
	mode := os.FileMode(0644)
	info, err := os.Stat(path)
	if err == nil {
		mode = info.Mode().Perm()
	} else if !os.IsNotExist(err) {
		return err
	}
	temp, err := os.CreateTemp(filepath.Dir(path), "."+filepath.Base(path)+".tmp-*")
	if err != nil {
		return err
	}
	tempPath := temp.Name()
	defer os.Remove(tempPath)
	if err := temp.Chmod(mode); err != nil {
		temp.Close()
		return err
	}
	if _, err := temp.Write(content); err != nil {
		temp.Close()
		return err
	}
	if err := temp.Sync(); err != nil {
		temp.Close()
		return err
	}
	if err := temp.Close(); err != nil {
		return err
	}
	return os.Rename(tempPath, path)
}

func resolveProjectRelativePath(workspacePath, path string) (string, error) {
	replacer := strings.NewReplacer(
		"$(SRCROOT)/", "",
		"${SRCROOT}/", "",
		"$(PROJECT_DIR)/", "",
		"${PROJECT_DIR}/", "",
	)
	path = strings.Trim(strings.TrimSpace(path), `"`)
	path = replacer.Replace(path)
	if strings.Contains(path, "$(") || strings.Contains(path, "${") {
		return "", fmt.Errorf("不支持未展开的 Xcode build setting: %s", path)
	}
	if filepath.IsAbs(path) {
		return "", fmt.Errorf("不允许 workspacePath 外的绝对路径: %s", path)
	}
	resolved := filepath.Clean(filepath.Join(workspacePath, filepath.FromSlash(path)))
	relative, err := filepath.Rel(workspacePath, resolved)
	if err != nil || relative == ".." || strings.HasPrefix(relative, ".."+string(filepath.Separator)) {
		return "", fmt.Errorf("entitlements 路径超出 workspacePath: %s", path)
	}
	current := filepath.Clean(workspacePath)
	for _, segment := range strings.Split(relative, string(filepath.Separator)) {
		current = filepath.Join(current, segment)
		info, err := os.Lstat(current)
		if os.IsNotExist(err) {
			continue
		}
		if err != nil {
			return "", fmt.Errorf("检查 entitlements 路径失败: %v", err)
		}
		if info.Mode()&os.ModeSymlink != 0 {
			return "", fmt.Errorf("entitlements 路径不允许包含符号链接: %s", current)
		}
	}
	return resolved, nil
}

func iosVersionCheckPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 ios feature=version_check workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}

	podfilePath := filepath.Join(workspacePath, "Podfile")
	if _, err := os.Stat(podfilePath); err != nil {
		result.Missing = append(result.Missing, "未找到 Podfile，请先执行 ios feature=setup 或手动接入 RXSDK_Pure 4.0.8")
	} else if !upgradePodVersion(podfilePath, "RXSDK_Pure", versionCheckIOSMinVersion, &result) {
		result.Missing = append(result.Missing, "Podfile 未包含 RXSDK_Pure，请先添加 pod 'RXSDK_Pure', '4.0.8'")
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码，请先接入 ios feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 updateGameVersionWithInfo v2 版本检查代码")
	}
	return result
}

func iosIifaaRealAuthPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 ios feature=real_auth workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}

	podfilePath := filepath.Join(workspacePath, "Podfile")
	if _, err := os.Stat(podfilePath); err != nil {
		result.Missing = append(result.Missing, "未找到 Podfile，请先执行 ios feature=setup 或手动接入 RXSDK_Pure 4.0.3")
	} else {
		if !upgradePodVersion(podfilePath, "RXSDK_Pure", iifaaIOSPureMinVersion, &result) {
			result.Missing = append(result.Missing, "Podfile 未包含 RXSDK_Pure，请先添加 pod 'RXSDK_Pure', '4.0.3'")
		}
		// RXUIKit 仅在使用瑞雪实名认证 UI 时必需；已存在则强制升级到最低支持版本。
		upgradePodVersion(podfilePath, "RXUIKit", iifaaIOSUIKitMinVersion, &result)
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码，请先接入 ios feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 IIFAA 支付宝实名认证代码")
	}
	return result
}

func iosSharePreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 ios feature=share workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}

	podfilePath := filepath.Join(workspacePath, "Podfile")
	if _, err := os.Stat(podfilePath); err != nil {
		result.Missing = append(result.Missing, "未找到 Podfile，请先执行 ios feature=setup 或手动接入 RXSDK_Pure 4.0.5")
	} else if !upgradePodVersion(podfilePath, "RXSDK_Pure", iosShareMinVersion, &result) {
		result.Missing = append(result.Missing, "Podfile 未包含 RXSDK_Pure，请先添加 pod 'RXSDK_Pure', '4.0.5'")
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码，请先接入 ios feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 show_content_in_circle 分享代码")
	}
	return result
}

func unityPassportPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return passportPreflightNeedsWorkspace("unity", workspacePath)
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version=1.6.26")
	} else {
		upgradeUnityManifest(manifestPath, passportUnityMinVersion, &result)
	}

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity SDK 初始化代码，请先接入 unity feature=init")
	}

	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	) {
		upgradeRuixueGradleVersions([]string{path}, passportAndroidMinVersion, &result)
	}
	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "PodfileTemplate"),
	) {
		upgradePodVersion(path, "RXSDK_Pure", passportIOSMinVersion, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RXLogin.GetUserInfoByField 业务代码")
	}
	return result
}

func unityGameInfoPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查 Unity/Android 依赖并自动升级版本",
				"重新调用 unity feature=game_character workspacePath=/path/to/unity-project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version=4.0.3")
	} else {
		upgradeUnityManifestPackages(
			manifestPath,
			gameInfoUnityMinVersion,
			[]string{"com.ruixue.unitysdk.base"},
			true,
			&result,
		)
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Unity Android mainTemplate.gradle，无法验证原生 SDK >= 4.0.16")
	} else if !upgradeRuixueGradleVersions(gradleFiles, setGameInfoAndroidMinVersion, &result) {
		result.Missing = append(result.Missing, "mainTemplate.gradle 未检测到 com.ruixue:* Android 原生依赖")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RuiXueSdk.Initialize / RXSdkInitConfig 初始化代码")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐 Unity 4.0.3 与 Android 4.0.16 基础接入，再调用 SetGameInfo / SetThirdGameInfo")
	}
	return result
}

func unityMumuPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查公共 UPM、APP_ID、包名和 Android SDK 配置",
				"重新调用 unity feature=mumu workspacePath=/path/to/unity-project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先安装公共 Base/Login/Pay UPM 4.0.1")
	} else {
		checkBaiduUnityManifest(manifestPath, &result)
	}
	projectSettingsPath := filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset")
	if content, err := os.ReadFile(projectSettingsPath); err != nil {
		result.Missing = append(result.Missing, "未找到 ProjectSettings/ProjectSettings.asset，无法检查 Android 包名")
	} else if !strings.Contains(string(content), ".yofun.mumu") {
		result.Missing = append(result.Missing, "Unity Android applicationIdentifier 必须以 .yofun.mumu 结尾")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 RuiXueSdk.Initialize / RXSdkInitConfig 初始化代码")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.InitThirdSdk"}) ||
		!fileContainsAny(workspacePath, []string{".cs"}, []string{"debugMode"}) {
		result.Missing = append(result.Missing, "未检测到带 debugMode 参数的 RuiXueSdk.InitThirdSdk")
	}
	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.InvokeChannelAction"}) ||
		!fileContainsAny(workspacePath, []string{".cs"}, []string{`"showSplash"`, `"splashType"`}) {
		result.Missing = append(result.Missing, "未检测到 RuiXueSdk.InvokeChannelAction(action=showSplash, splashType=0/1/2) 通用渠道调用")
	}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	)
	if len(gradleFiles) == 0 {
		result.Missing = append(result.Missing, "未找到 Unity Android mainTemplate.gradle，无法验证 rxsdk_yofun")
	} else {
		upgradeRuixueGradleVersions(gradleFiles, mumuAndroidMinVersion, &result)
		if !gradleDependencyMeetsMinimum(gradleFiles, "rxsdk_yofun", mumuAndroidMinVersion) {
			result.Missing = append(result.Missing, "未检测到 com.ruixue:rxsdk_yofun:4.0.16 或更高版本")
		}
	}
	if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"maven-release.webapp.163.com/repository/maven-releases"}) {
		result.Missing = append(result.Missing, "未配置 Yofun Maven 仓库")
	}
	if !fileContainsAny(workspacePath, []string{".xml"}, []string{"YOFUN_APP_ID"}) {
		result.Missing = append(result.Missing, "AndroidManifest.xml 未配置 YOFUN_APP_ID")
	}
	if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"multiDexEnabled true", "multiDexEnabled = true"}) {
		result.Missing = append(result.Missing, "Unity Android 工程未启用 MultiDex")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "执行 unity feature=channel_config thirdChannel=mumu 配置 Android 工程，并补齐公共 UPM 与通用渠道调用")
	}
	return result
}

func unityPaymentPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入并自动补齐支付/Google 商品查询 UPM 依赖",
				"重新调用 unity feature=payment workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version="+unitySDKDefaultVersion)
	} else {
		upgradeUnityManifestPackages(
			manifestPath,
			unitySDKDefaultVersion,
			[]string{"com.ruixue.unitysdk.pay", "com.ruixue.unitysdk.google"},
			false,
			&result,
		)
	}

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity SDK 初始化代码，请先接入 unity feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RXPay/RXGoogle 支付与商品信息查询代码")
	}
	return result
}

func iosLbsPreflight(workspacePath, targetName string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "ios",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能检查 LBS 依赖并自动补齐定位工程配置",
				"重新调用 ios feature=lbs workspacePath=/path/to/ios-project",
			},
		}
	}

	result := PassportPreflightResult{Platform: "ios", WorkspacePath: workspacePath, Checked: true}
	podfilePath := filepath.Join(workspacePath, "Podfile")
	if _, err := os.Stat(podfilePath); err != nil {
		result.Missing = append(result.Missing, "未找到 Podfile，请添加 RXSDK_Pure 与 RXLBSKit 依赖")
	} else {
		if !podfileContainsActivePod(podfilePath, "RXSDK_Pure") {
			result.Missing = append(result.Missing, "Podfile 未包含 RXSDK_Pure，请先完成瑞雪 SDK 基础接入")
		} else {
			upgradePodVersion(podfilePath, "RXSDK_Pure", passportIOSMinVersion, &result)
		}
		if !podfileContainsActivePod(podfilePath, "RXLBSKit") {
			result.Missing = append(result.Missing, "Podfile 未包含 RXLBSKit，请添加 pod 'RXLBSKit', '4.0.0'")
		} else if !ensureLBSIOSPodMinimumVersion(podfilePath, &result) {
			result.Missing = append(result.Missing, "无法确认 RXLBSKit 版本，请使用明确版本声明 pod 'RXLBSKit', '4.0.0'")
		}
	}

	if !fileContainsAny(workspacePath, []string{".m", ".mm", ".swift"}, []string{"RXSdkInitConfig", "initWithConfig:complete:"}) {
		result.Missing = append(result.Missing, "未检测到 RXSdkInitConfig / initWithConfig:complete: 初始化代码")
	}

	infoPlistPath, resolveErr := resolveLBSInfoPlistPath(workspacePath, targetName)
	if resolveErr != nil {
		result.Missing = append(result.Missing, resolveErr.Error()+"，无法写入定位权限与 UIBackgroundModes/location")
	} else if modified, err := addLBSLocationConfigToInfoPlist(infoPlistPath); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("补齐 LBS 工程配置失败: %v", err))
	} else if modified {
		result.Modified = append(result.Modified, infoPlistPath+": added location usage descriptions and UIBackgroundModes/location")
	}

	result.Satisfied = len(result.Missing) == 0
	result.NextSteps = append(result.NextSteps, "使用前通过 [[RXLBSKitService sharedSDK] registeAMWithAppkey:] 注册与 Bundle ID 匹配的高德 Key")
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐缺失项后重新调用 ios feature=lbs")
	}
	return result
}

func podfileContainsActivePod(path, podName string) bool {
	content, err := os.ReadFile(path)
	if err != nil {
		return false
	}
	pattern := regexp.MustCompile(`(?m)^[ \t]*pod[ \t]+['"]` + regexp.QuoteMeta(podName) + `['"](?:[ \t]*,|[ \t]*$)`)
	return pattern.Match(content)
}

func ensureLBSIOSPodMinimumVersion(path string, result *PassportPreflightResult) bool {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return false
	}
	content := string(contentBytes)
	versionedPattern := regexp.MustCompile(`(?m)^([ \t]*pod[ \t]+['"]RXLBSKit['"][ \t]*,[ \t]*['"])([^'"]+)(['"].*)$`)
	if versionedPattern.MatchString(content) {
		updated := versionedPattern.ReplaceAllStringFunc(content, func(match string) string {
			parts := versionedPattern.FindStringSubmatch(match)
			if len(parts) != 4 || compareVersion(cleanVersion(parts[2]), lbsIOSMinVersion) >= 0 {
				return match
			}
			result.Modified = append(result.Modified, fmt.Sprintf("%s: RXLBSKit %s -> %s", path, parts[2], lbsIOSMinVersion))
			return parts[1] + lbsIOSMinVersion + parts[3]
		})
		if updated != content {
			if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
				result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
				return false
			}
		}
		return true
	}

	unversionedPattern := regexp.MustCompile(`(?m)^([ \t]*pod[ \t]+['"]RXLBSKit['"])[ \t]*$`)
	if !unversionedPattern.MatchString(content) {
		return false
	}
	updated := unversionedPattern.ReplaceAllString(content, "${1}, '"+lbsIOSMinVersion+"'")
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
		return false
	}
	result.Modified = append(result.Modified, fmt.Sprintf("%s: RXLBSKit unversioned -> %s", path, lbsIOSMinVersion))
	return true
}

func unityLbsPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查并补齐瑞雪高德定位 UPM 依赖",
				"重新调用 unity feature=lbs workspacePath=/path/to/unity-project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version="+lbsUnityMinVersion)
	} else {
		upgradeUnityManifestPackages(
			manifestPath,
			lbsUnityMinVersion,
			[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.lbs"},
			true,
			&result,
		)
	}
	ensureUnityLBSSettingAsset(workspacePath, &result)

	result.Satisfied = len(result.Missing) == 0
	result.NextSteps = append(result.NextSteps,
		"Android：调用 unity feature=android_native_setup components=[rxsdk_gaode] 并配置 AMAP_APIKEY",
		"iOS：Unity PostBuild 会根据 RuiXueSDK_LBSXcodeSetting.asset 写入三个定位权限 Key 与 UIBackgroundModes/location；仍需配置高德 AppKey",
	)
	return result
}

func unityAppleSigninConfigPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能补齐 Unity Apple 登录导出工程配置",
				"重新调用 unity feature=apple_signin_config workspacePath=/path/to/unity-project",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	manifestBytes, err := os.ReadFile(manifestPath)
	if err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup")
	} else {
		var manifest struct {
			Dependencies map[string]any `json:"dependencies"`
		}
		if err := json.Unmarshal(manifestBytes, &manifest); err != nil {
			result.Missing = append(result.Missing, fmt.Sprintf("解析 Packages/manifest.json 失败: %v", err))
		} else {
			for _, packageName := range []string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login"} {
				installed, err := unityProjectHasPackage(workspacePath, manifest.Dependencies, packageName)
				if err != nil {
					result.Missing = append(result.Missing, err.Error())
				} else if !installed {
					result.Missing = append(result.Missing, "未在 manifest、packages-lock 或嵌入式 Packages 中检测到 "+packageName)
				}
			}
		}
	}

	if len(result.Missing) == 0 {
		ensureUnityAppleLoginPostBuild(workspacePath, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	result.NextSteps = append(result.NextSteps,
		"Unity 导出 iOS 后检查 Target -> Signing & Capabilities -> Sign in with Apple",
		"请在 Apple Developer 后台为 App ID 开启 Sign in with Apple 能力",
	)
	return result
}

func unityProjectHasPackage(workspacePath string, manifestDependencies map[string]any, packageName string) (bool, error) {
	if value, exists := manifestDependencies[packageName]; exists {
		dependency, validString := value.(string)
		if !validString || strings.TrimSpace(dependency) == "" {
			return false, fmt.Errorf("Packages/manifest.json 中 %s 依赖格式无效", packageName)
		}
		return true, nil
	}

	embeddedPackage := filepath.Join(workspacePath, "Packages", packageName, "package.json")
	if content, err := os.ReadFile(embeddedPackage); err == nil {
		var metadata struct {
			Name string `json:"name"`
		}
		if err := json.Unmarshal(content, &metadata); err != nil {
			return false, fmt.Errorf("解析嵌入式包 %s 失败: %v", embeddedPackage, err)
		}
		if metadata.Name == packageName {
			return true, nil
		}
	}

	lockPath := filepath.Join(workspacePath, "Packages", "packages-lock.json")
	if content, err := os.ReadFile(lockPath); err == nil {
		var lock struct {
			Dependencies map[string]json.RawMessage `json:"dependencies"`
		}
		if err := json.Unmarshal(content, &lock); err != nil {
			return false, fmt.Errorf("解析 Packages/packages-lock.json 失败: %v", err)
		}
		if value, exists := lock.Dependencies[packageName]; exists && len(value) > 0 && string(value) != "null" {
			return true, nil
		}
	}
	return false, nil
}

func unityIifaaRealAuthPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 unity feature=real_auth workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version=1.6.25")
	} else {
		upgradeUnityManifestPackages(
			manifestPath,
			iifaaUnityMinVersion,
			[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login", "com.ruixue.unitysdk.ui"},
			false,
			&result,
		)
	}

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity SDK 初始化代码，请先接入 unity feature=init")
	}

	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	) {
		upgradeRuixueGradleVersions([]string{path}, iifaaAndroidMinVersion, &result)
	}
	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "PodfileTemplate"),
	) {
		upgradePodVersion(path, "RXSDK_Pure", iifaaIOSPureMinVersion, &result)
		upgradePodVersion(path, "RXUIKit", iifaaIOSUIKitMinVersion, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RuiXueSdk IIFAA 支付宝实名认证代码")
	}
	return result
}

func unityTempNoticePreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 unity feature=announcement workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version=1.6.28")
	} else {
		upgradeUnityManifestPackages(manifestPath, tempNoticeUnityMinVersion, []string{"com.ruixue.unitysdk.base"}, true, &result)
	}

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity SDK 初始化代码，请先接入 unity feature=init")
	}

	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	) {
		upgradeRuixueGradleVersions([]string{path}, passportAndroidMinVersion, &result)
	}
	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "PodfileTemplate"),
	) {
		upgradePodVersion(path, "RXSDK_Pure", passportIOSMinVersion, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RuiXueSdk.GetTempNotice 业务代码")
	}
	return result
}

func unityVersionCheckPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际检查基础接入和自动升级版本",
				"重新调用 unity feature=version_check workspacePath=/path/to/project",
			},
		}
	}
	result := PassportPreflightResult{Platform: "unity", WorkspacePath: workspacePath, Checked: true}

	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		result.Missing = append(result.Missing, "未找到 Packages/manifest.json，请先执行 unity feature=setup version=1.6.39")
	} else {
		upgradeUnityManifestPackages(
			manifestPath,
			versionCheckUnityMinVersion,
			[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.versioncheck"},
			true,
			&result,
		)
	}

	if !fileContainsAny(workspacePath, []string{".cs"}, []string{"RuiXueSdk.Initialize", "RXSDK.Initialize", "RXSdkInitConfig"}) {
		result.Missing = append(result.Missing, "未检测到 Unity SDK 初始化代码，请先接入 unity feature=init")
	}

	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle.kts"),
	) {
		upgradeRuixueGradleVersions([]string{path}, versionCheckAndroidMinVersion, &result)
	}
	for _, path := range existingFiles(
		filepath.Join(workspacePath, "Podfile"),
		filepath.Join(workspacePath, "PodfileTemplate"),
	) {
		upgradePodVersion(path, "RXSDK_Pure", versionCheckIOSMinVersion, &result)
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 RXVersionCheck.UpdateGameVersion v2 版本检查代码")
	}
	return result
}

func minigamePassportPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return passportPreflightNeedsWorkspace("minigame", workspacePath)
	}
	result := PassportPreflightResult{Platform: "minigame", WorkspacePath: workspacePath, Checked: true}
	if !fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{"new RxSdk", "new RXSDK", "getUserInfoByField", "getUserInfoByFieldApi"}) {
		result.Missing = append(result.Missing, "未检测到 JSSDK 初始化或 getUserInfoByFieldApi，请先接入 minigame feature=init 并替换为包含 getUserInfoByFieldApi 的构建产物")
	}
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "先补齐缺失项，再插入 sdk.getUserInfoByField 业务代码")
	}
	return result
}

func minigameVersionCheckPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "minigame",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能检查 JSSDK 构建版本和版本检查 v2 接口",
				"重新调用 minigame feature=version_check workspacePath=/path/to/project",
			},
		}
	}

	result := PassportPreflightResult{Platform: "minigame", WorkspacePath: workspacePath, Checked: true}
	version := detectMinigameSDKVersion(workspacePath)
	if version == "" {
		result.Missing = append(result.Missing, "无法识别 JSSDK 版本，请使用 JSSDKFile/v4.0.2 或更高版本构建产物")
	} else if compareVersion(version, versionCheckMinigameMinVersion) < 0 {
		result.Missing = append(result.Missing, fmt.Sprintf(
			"JSSDK 当前版本 %s，版本检查 v2 要求 >= %s；构建产物无法安全自动升级，请手动替换",
			version,
			versionCheckMinigameMinVersion,
		))
	}

	if !fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{"updateGameVersion"}) ||
		!fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{"update_module_version"}) {
		result.Missing = append(result.Missing, "JSSDK 构建产物缺少 updateGameVersion 或 update_module_version 版本检查 v2 实现")
	}
	if !fileContainsAny(workspacePath, []string{".js", ".ts"}, []string{"new RxSdk", "new RXSDK", "new channelSDK"}) {
		result.Missing = append(result.Missing, "未检测到小游戏 JSSDK 初始化代码，请先接入 minigame feature=init")
	}

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "替换为 JSSDK 4.0.2 或更高版本构建产物并完成初始化后，再插入 updateGameVersion v2 代码")
	}
	return result
}

func detectMinigameSDKVersion(root string) string {
	versionPattern := regexp.MustCompile(`^v?(\d+\.\d+\.\d+)$`)
	contentPatterns := []*regexp.Regexp{
		regexp.MustCompile(`SDK_VERSION\s*=\s*['"](\d+\.\d+\.\d+)['"]`),
		regexp.MustCompile(`__RX_SDK_VERSION\s*[:=]\s*['"](\d+\.\d+\.\d+)['"]`),
	}
	detected := ""
	_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			switch d.Name() {
			case ".git", "node_modules", "Pods", "Library":
				return filepath.SkipDir
			}
			if matches := versionPattern.FindStringSubmatch(d.Name()); len(matches) == 2 &&
				(detected == "" || compareVersion(matches[1], detected) > 0) {
				detected = matches[1]
			}
			return nil
		}
		ext := filepath.Ext(path)
		if ext != ".js" && ext != ".ts" && ext != ".json" {
			return nil
		}
		content, readErr := os.ReadFile(path)
		if readErr != nil {
			return nil
		}
		for _, pattern := range contentPatterns {
			if matches := pattern.FindSubmatch(content); len(matches) == 2 {
				version := string(matches[1])
				if detected == "" || compareVersion(version, detected) > 0 {
					detected = version
				}
			}
		}
		return nil
	})
	return detected
}

func existingFiles(paths ...string) []string {
	var result []string
	for _, path := range paths {
		if _, err := os.Stat(path); err == nil {
			result = append(result, path)
		}
	}
	return result
}

func fileExistsNamed(root, filename string) bool {
	found := false
	_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil || found {
			return nil
		}
		if d.IsDir() {
			name := d.Name()
			if name == "Pods" || name == "build" || name == ".gradle" || name == "node_modules" || name == "Library" {
				return filepath.SkipDir
			}
			return nil
		}
		if d.Name() == filename {
			found = true
		}
		return nil
	})
	return found
}

func upgradeRuixueGradleVersions(paths []string, minVersion string, result *PassportPreflightResult) bool {
	found := false
	re := regexp.MustCompile(`(com\.ruixue:[^:'"\s]+:)([0-9]+\.[0-9]+\.[0-9]+(?:[.\-\w]*)?)`)
	for _, path := range paths {
		contentBytes, err := os.ReadFile(path)
		if err != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("读取 %s 失败: %v", path, err))
			continue
		}
		content := string(contentBytes)
		if !strings.Contains(content, "com.ruixue:") {
			continue
		}
		found = true
		updated := re.ReplaceAllStringFunc(content, func(match string) string {
			parts := re.FindStringSubmatch(match)
			if len(parts) != 3 || compareVersion(parts[2], minVersion) >= 0 {
				return match
			}
			result.Modified = append(result.Modified, fmt.Sprintf("%s: %s -> %s", path, parts[2], minVersion))
			return parts[1] + minVersion
		})
		if updated != content {
			if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
				result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
			}
		}
	}
	return found
}

func upgradePodVersion(path, podName, minVersion string, result *PassportPreflightResult) bool {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return false
	}
	content := string(contentBytes)
	if !strings.Contains(content, podName) {
		return false
	}
	re := regexp.MustCompile(`(pod\s+['"]` + regexp.QuoteMeta(podName) + `['"]\s*,\s*['"])([^'"]+)(['"])`)
	updated := re.ReplaceAllStringFunc(content, func(match string) string {
		parts := re.FindStringSubmatch(match)
		if len(parts) != 4 || compareVersion(cleanVersion(parts[2]), minVersion) >= 0 {
			return match
		}
		result.Modified = append(result.Modified, fmt.Sprintf("%s: %s %s -> %s", path, podName, parts[2], minVersion))
		return parts[1] + minVersion + parts[3]
	})
	if updated != content {
		if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
		}
	}
	return true
}

func upgradeUnityManifest(path, minVersion string, result *PassportPreflightResult) {
	upgradeUnityManifestPackages(path, minVersion, []string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.login"}, false, result)
}

func upgradeUnityManifestPackages(path, minVersion string, requiredPackages []string, syncExistingRuixuePackages bool, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return
	}
	var root map[string]any
	if err := json.Unmarshal(contentBytes, &root); err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("解析 %s 失败: %v", path, err))
		return
	}
	deps, _ := root["dependencies"].(map[string]any)
	if deps == nil {
		deps = map[string]any{}
		root["dependencies"] = deps
	}
	changed := false
	for _, pkg := range requiredPackages {
		current, _ := deps[pkg].(string)
		if current == "" || compareVersion(cleanVersion(current), minVersion) < 0 {
			deps[pkg] = minVersion
			changed = true
			result.Modified = append(result.Modified, fmt.Sprintf("%s: %s %s -> %s", path, pkg, current, minVersion))
		}
	}
	if syncExistingRuixuePackages {
		for pkg, value := range deps {
			if !strings.HasPrefix(pkg, "com.ruixue.unitysdk.") {
				continue
			}
			current, _ := value.(string)
			if current != "" && compareVersion(cleanVersion(current), minVersion) < 0 {
				deps[pkg] = minVersion
				changed = true
				result.Modified = append(result.Modified, fmt.Sprintf("%s: %s %s -> %s", path, pkg, current, minVersion))
			}
		}
	}
	if !changed {
		return
	}
	updated, err := json.MarshalIndent(root, "", "  ")
	if err != nil {
		result.Warnings = append(result.Warnings, fmt.Sprintf("序列化 %s 失败: %v", path, err))
		return
	}
	updated = append(updated, '\n')
	if string(updated) != string(contentBytes) {
		if err := os.WriteFile(path, updated, 0644); err != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("写入 %s 失败: %v", path, err))
		}
	}
}

func fileContainsAny(root string, exts []string, needles []string) bool {
	found := false
	extSet := map[string]bool{}
	for _, ext := range exts {
		extSet[ext] = true
	}
	_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil || found {
			return nil
		}
		if d.IsDir() {
			name := d.Name()
			if name == "Pods" || name == "build" || name == ".gradle" || name == "node_modules" || name == "Library" {
				return filepath.SkipDir
			}
			return nil
		}
		if !extSet[filepath.Ext(path)] {
			return nil
		}
		contentBytes, err := os.ReadFile(path)
		if err != nil {
			return nil
		}
		content := string(contentBytes)
		for _, needle := range needles {
			if strings.Contains(content, needle) {
				found = true
				return nil
			}
		}
		return nil
	})
	return found
}

func compareVersion(a, b string) int {
	aa := parseVersionParts(a)
	bb := parseVersionParts(b)
	for i := 0; i < 3; i++ {
		if aa[i] > bb[i] {
			return 1
		}
		if aa[i] < bb[i] {
			return -1
		}
	}
	return 0
}

func parseVersionParts(version string) [3]int {
	var result [3]int
	parts := strings.Split(cleanVersion(version), ".")
	for i := 0; i < len(parts) && i < 3; i++ {
		n, _ := strconv.Atoi(parts[i])
		result[i] = n
	}
	return result
}

func cleanVersion(version string) string {
	version = strings.TrimSpace(version)
	version = strings.TrimPrefix(version, "~>")
	version = strings.TrimPrefix(version, ">=")
	version = strings.TrimSpace(version)
	re := regexp.MustCompile(`[^0-9.].*$`)
	return re.ReplaceAllString(version, "")
}
