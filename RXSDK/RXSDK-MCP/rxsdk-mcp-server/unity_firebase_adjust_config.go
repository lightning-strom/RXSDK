package rxsdk

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// unityParam 从 params 读取指定 key；为空时回退到 fallback。
func unityParam(params map[string]string, key, fallback string) string {
	if params != nil {
		if v := strings.TrimSpace(params[key]); v != "" {
			return v
		}
	}
	return fallback
}

// Firebase / Adjust 海外组件的 Unity 工程配置，设计参考 google_config / facebook_config。
const (
	unityFirebaseSettingAsset = "Assets/RuiXueSettings/RuiXueSDK_FirebaseXcodeSetting.asset"
	unityAdjustSettingAsset   = "Assets/RuiXueSettings/RuiXueSDK_AdjustXcodeSetting.asset"

	// firebase / adjust 接入要求的 Unity SDK 最低版本。
	firebaseAdjustUnityMinVersion = "1.6.30"
)

// UnityFirebaseConfigHandler 配置 Unity Firebase 工程环境（Analytics/Crashlytics/FCM）。
func UnityFirebaseConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath              string `json:"workspacePath"`
		GoogleServicesJSONPath     string `json:"googleServicesJsonPath"`
		GoogleServiceInfoPlistPath string `json:"googleServiceInfoPlistPath"`
	},
) (*mcp.CallToolResult, UnityThirdPartyConfigResult, error) {
	_ = ctx
	_ = req

	preflight := unityFirebaseConfigPreflight(input.WorkspacePath, input.GoogleServicesJSONPath, input.GoogleServiceInfoPlistPath)
	return nil, UnityThirdPartyConfigResult{
		Instructions: unityFirebaseConfigInstructions(input.WorkspacePath, input.GoogleServicesJSONPath, input.GoogleServiceInfoPlistPath, preflight),
		Provider:     "firebase",
		Preflight:    preflight,
	}, nil
}

// UnityAdjustConfigHandler 配置 Unity Adjust 工程环境（归因）。
func UnityAdjustConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath     string `json:"workspacePath"`
		AdjustAppToken    string `json:"adjustAppToken"`
		AdjustEnvironment string `json:"adjustEnvironment"`
	},
) (*mcp.CallToolResult, UnityThirdPartyConfigResult, error) {
	_ = ctx
	_ = req

	preflight := unityAdjustConfigPreflight(input.WorkspacePath, input.AdjustAppToken, input.AdjustEnvironment)
	return nil, UnityThirdPartyConfigResult{
		Instructions: unityAdjustConfigInstructions(input.WorkspacePath, input.AdjustAppToken, input.AdjustEnvironment, preflight),
		Provider:     "adjust",
		Preflight:    preflight,
	}, nil
}

func unityFirebaseConfigPreflight(workspacePath, googleServicesJSONPath, googleServiceInfoPlistPath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_firebase",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity Firebase 工程环境",
				"重新调用 unity feature=firebase_config workspacePath=/path/to/unity-project googleServicesJsonPath=/path/to/google-services.json googleServiceInfoPlistPath=/path/to/GoogleService-Info.plist",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_firebase", WorkspacePath: workspacePath, Checked: true}
	googleServicesJSONPath = strings.TrimSpace(googleServicesJSONPath)
	googleServiceInfoPlistPath = strings.TrimSpace(googleServiceInfoPlistPath)

	targetAndroid := filepath.Join(workspacePath, "Assets", "Plugins", "Android", "google-services.json")
	targetIOS := filepath.Join(workspacePath, "Assets", "Plugins", "IOS", "GoogleService-Info.plist")

	hasAndroid := googleServicesJSONPath != ""
	if !hasAndroid {
		if _, err := os.Stat(targetAndroid); err == nil {
			hasAndroid = true
		}
	} else if _, err := os.Stat(googleServicesJSONPath); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("googleServicesJsonPath 文件不存在: %s", googleServicesJSONPath))
	}

	hasIOS := googleServiceInfoPlistPath != ""
	if !hasIOS {
		if _, err := os.Stat(targetIOS); err == nil {
			hasIOS = true
		}
	} else if _, err := os.Stat(googleServiceInfoPlistPath); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("googleServiceInfoPlistPath 文件不存在: %s", googleServiceInfoPlistPath))
	}

	if !hasAndroid && !hasIOS {
		result.Missing = append(result.Missing, "缺少 Firebase 配置文件：Android 需要 google-services.json，iOS 需要 GoogleService-Info.plist，至少提供一个")
	}
	if _, err := os.Stat(filepath.Join(workspacePath, unityFirebaseSettingAsset)); err != nil {
		result.Missing = append(result.Missing, "未找到 Assets/RuiXueSettings/RuiXueSDK_FirebaseXcodeSetting.asset，请先在 Unity 菜单 瑞雪SDK/XCode Settings/Firebase 中创建")
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 Firebase 配置文件/资产后重新调用 unity feature=firebase_config")
		return result
	}

	if googleServicesJSONPath != "" {
		copyUnityFileIfChanged(googleServicesJSONPath, targetAndroid, &result)
	}
	if googleServiceInfoPlistPath != "" {
		copyUnityFileIfChanged(googleServiceInfoPlistPath, targetIOS, &result)
	}
	upgradeUnityManifestPackages(
		filepath.Join(workspacePath, "Packages", "manifest.json"),
		firebaseAdjustUnityMinVersion,
		[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.firebase"},
		true,
		&result,
	)
	updateUnityAssetFields(filepath.Join(workspacePath, unityFirebaseSettingAsset), map[string]string{
		"ConfigReady": "1",
	}, &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "Unity SDK 强制版本要求 >= "+firebaseAdjustUnityMinVersion+"：低于该版本的 com.ruixue.unitysdk.* 依赖已自动升级")
		result.NextSteps = append(result.NextSteps, "Android: 确认 google-services.json 与 com.ruixue:rxsdk_firebase 已通过 android_native_setup 接入")
		result.NextSteps = append(result.NextSteps, "iOS: PostBuild 会把 GoogleService-Info.plist 加入 Xcode 工程，并确保 Podfile 含 RXFirebaseSDK")
		result.NextSteps = append(result.NextSteps, "在 SDK 初始化前调用 RXFirebase 初始化逻辑，并重新构建 Android/iOS 验证")
	}
	return result
}

func unityAdjustConfigPreflight(workspacePath, adjustAppToken, adjustEnvironment string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_adjust",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity Adjust 工程环境",
				"重新调用 unity feature=adjust_config workspacePath=/path/to/unity-project adjustAppToken=xxx adjustEnvironment=sandbox",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_adjust", WorkspacePath: workspacePath, Checked: true}
	adjustAppToken = strings.TrimSpace(adjustAppToken)
	adjustEnvironment = strings.TrimSpace(adjustEnvironment)
	if adjustEnvironment == "" {
		adjustEnvironment = "production"
	}
	if adjustEnvironment != "production" && adjustEnvironment != "sandbox" {
		result.Missing = append(result.Missing, "adjustEnvironment 仅支持 production 或 sandbox")
	}

	if adjustAppToken == "" {
		result.Missing = append(result.Missing, "缺少 adjustAppToken，请传入 Adjust 控制台的 App Token")
	}
	if _, err := os.Stat(filepath.Join(workspacePath, unityAdjustSettingAsset)); err != nil {
		result.Missing = append(result.Missing, "未找到 Assets/RuiXueSettings/RuiXueSDK_AdjustXcodeSetting.asset，请先在 Unity 菜单 瑞雪SDK/XCode Settings/Adjust 中创建")
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 Adjust 配置参数/资产后重新调用 unity feature=adjust_config")
		return result
	}

	updateUnityAndroidProjectSettingsForFacebook(workspacePath, &result)
	upsertUnityAndroidManifestPermissions(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "AndroidManifest.xml"),
		[]string{
			"android.permission.INTERNET",
			"android.permission.ACCESS_NETWORK_STATE",
			"android.permission.ACCESS_WIFI_STATE",
		},
		&result,
	)
	upgradeUnityManifestPackages(
		filepath.Join(workspacePath, "Packages", "manifest.json"),
		firebaseAdjustUnityMinVersion,
		[]string{"com.ruixue.unitysdk.base", "com.ruixue.unitysdk.adjust"},
		true,
		&result,
	)
	updateUnityAssetFields(filepath.Join(workspacePath, unityAdjustSettingAsset), map[string]string{
		"AppToken":    adjustAppToken,
		"Environment": adjustEnvironment,
	}, &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "Unity SDK 强制版本要求 >= "+firebaseAdjustUnityMinVersion+"：低于该版本的 com.ruixue.unitysdk.* 依赖已自动升级")
		result.NextSteps = append(result.NextSteps, "在瑞雪 SDK 初始化参数设置后调用 RXAdjust 初始化（appToken="+adjustAppToken+", environment="+adjustEnvironment+"）")
		result.NextSteps = append(result.NextSteps, "重新构建 Android/iOS，验证 Adjust 归因数据上报")
	}
	return result
}

// upsertUnityAndroidManifestPermissions 确保 AndroidManifest.xml 的 manifest 标签下包含指定权限。
func upsertUnityAndroidManifestPermissions(path string, permissions []string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	created := false
	if err != nil {
		content = defaultUnityAndroidManifest()
		created = true
	} else {
		content = string(contentBytes)
	}

	manifestRe := regexp.MustCompile(`(?s)<manifest\b[^>]*>`)
	loc := manifestRe.FindStringIndex(content)
	if loc == nil {
		result.Missing = append(result.Missing, "AndroidManifest.xml 中未找到 manifest 标签，无法自动添加 Adjust 权限")
		return
	}

	var toAdd []string
	for _, perm := range permissions {
		if strings.Contains(content, `android:name="`+perm+`"`) {
			continue
		}
		toAdd = append(toAdd, perm)
	}
	if len(toAdd) == 0 && !created {
		return
	}

	var block strings.Builder
	for _, perm := range toAdd {
		block.WriteString("\n    <uses-permission android:name=\"" + perm + "\" />")
	}
	updated := content[:loc[1]] + block.String() + content[loc[1]:]

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 AndroidManifest.xml 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": ensured Adjust 必需 Android 权限")
}

func unityFirebaseConfigInstructions(workspacePath, googleServicesJSONPath, googleServiceInfoPlistPath string, preflight PassportPreflightResult) string {
	return fmt.Sprintf(`# 瑞雪 SDK Unity Firebase 配置

workspacePath: %s
googleServicesJsonPath: %s
googleServiceInfoPlistPath: %s

配置项:
- Android: 将 google-services.json 放入 Assets/Plugins/Android/google-services.json
- iOS: 将 GoogleService-Info.plist 放入 Assets/Plugins/IOS/GoogleService-Info.plist（PostBuild 会自动加入 Xcode 工程）
- iOS: 写入 Assets/RuiXueSettings/RuiXueSDK_FirebaseXcodeSetting.asset
- 强制版本要求: com.ruixue.unitysdk.firebase >= %s（Packages/manifest.json 中低于该版本的 com.ruixue.unitysdk.* 依赖会被强制升级）
- 原生依赖: 通过 android_native_setup components 引入 rxsdk_firebase；iOS Podfile 含 RXFirebaseSDK

preflight:
  checked: %t
  satisfied: %t
  missing: %v
  modified: %v
  warnings: %v
  nextSteps: %v
`, workspacePath, googleServicesJSONPath, googleServiceInfoPlistPath, firebaseAdjustUnityMinVersion, preflight.Checked, preflight.Satisfied, preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
}

func unityAdjustConfigInstructions(workspacePath, adjustAppToken, adjustEnvironment string, preflight PassportPreflightResult) string {
	return fmt.Sprintf(`# 瑞雪 SDK Unity Adjust 配置

workspacePath: %s
adjustAppToken: %s
adjustEnvironment: %s

配置项:
- AndroidManifest.xml: manifest 标签下添加 INTERNET / ACCESS_NETWORK_STATE / ACCESS_WIFI_STATE 权限
- iOS/Android: 写入 Assets/RuiXueSettings/RuiXueSDK_AdjustXcodeSetting.asset 的 AppToken / Environment
- 强制版本要求: com.ruixue.unitysdk.adjust >= %s（Packages/manifest.json 中低于该版本的 com.ruixue.unitysdk.* 依赖会被强制升级）
- 原生依赖: 通过 android_native_setup components 引入 rxsdk_adjust；iOS Podfile 含 RXAdjustSDK
- 初始化: 先设置瑞雪初始化参数，再调用 RXAdjust 初始化

preflight:
  checked: %t
  satisfied: %t
  missing: %v
  modified: %v
  warnings: %v
  nextSteps: %v
`, workspacePath, adjustAppToken, adjustEnvironment, firebaseAdjustUnityMinVersion, preflight.Checked, preflight.Satisfied, preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
}
