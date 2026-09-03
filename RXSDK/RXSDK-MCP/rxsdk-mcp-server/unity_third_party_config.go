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

const (
	unityGoogleSettingAsset   = "Assets/RuiXueSettings/RuiXueSDK_GoogleXcodeSetting.asset"
	unityFacebookSettingAsset = "Assets/RuiXueSettings/RuiXueSDK_FacebookXcodeSetting.asset"
	unityLBSSettingAsset      = "Assets/RuiXueSettings/RuiXueSDK_LBSXcodeSetting.asset"
	unityApplePostBuildScript = "Assets/RuiXueSettings/Editor/RXMCPAppleLoginPostBuildProcessor.cs"
)

type UnityThirdPartyConfigResult struct {
	Instructions string                  `json:"instructions"`
	Provider     string                  `json:"provider"`
	Preflight    PassportPreflightResult `json:"preflight"`
}

func UnityGoogleConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath          string `json:"workspacePath"`
		GoogleServicesJSONPath string `json:"googleServicesJsonPath"`
		GIDClientID            string `json:"gidClientId"`
		GoogleURLScheme        string `json:"googleUrlScheme"`
	},
) (*mcp.CallToolResult, UnityThirdPartyConfigResult, error) {
	_ = ctx
	_ = req

	preflight := unityGoogleConfigPreflight(
		input.WorkspacePath,
		input.GoogleServicesJSONPath,
		input.GIDClientID,
		input.GoogleURLScheme,
	)
	return nil, UnityThirdPartyConfigResult{
		Instructions: unityGoogleConfigInstructions(input.WorkspacePath, input.GoogleServicesJSONPath, input.GIDClientID, input.GoogleURLScheme, preflight),
		Provider:     "google",
		Preflight:    preflight,
	}, nil
}

func UnityFacebookConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath       string `json:"workspacePath"`
		FacebookAppID       string `json:"facebookAppId"`
		FacebookClientToken string `json:"facebookClientToken"`
	},
) (*mcp.CallToolResult, UnityThirdPartyConfigResult, error) {
	_ = ctx
	_ = req

	preflight := unityFacebookConfigPreflight(input.WorkspacePath, input.FacebookAppID, input.FacebookClientToken)
	return nil, UnityThirdPartyConfigResult{
		Instructions: unityFacebookConfigInstructions(input.WorkspacePath, input.FacebookAppID, input.FacebookClientToken, preflight),
		Provider:     "facebook",
		Preflight:    preflight,
	}, nil
}

func UnityHuaweiConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath             string `json:"workspacePath"`
		AgconnectServicesJSONPath string `json:"agconnectServicesJsonPath"`
		AndroidVersion            string `json:"androidVersion"`
	},
) (*mcp.CallToolResult, UnityThirdPartyConfigResult, error) {
	_ = ctx
	_ = req

	preflight := unityHuaweiConfigPreflight(input.WorkspacePath, input.AgconnectServicesJSONPath, input.AndroidVersion)
	return nil, UnityThirdPartyConfigResult{
		Instructions: unityHuaweiConfigInstructions(input.WorkspacePath, input.AgconnectServicesJSONPath, input.AndroidVersion, preflight),
		Provider:     "huawei",
		Preflight:    preflight,
	}, nil
}

func unityGoogleConfigPreflight(workspacePath, googleServicesJSONPath, gidClientID, googleURLScheme string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_google",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity Google 登录/支付环境",
				"重新调用 unity feature=google_config workspacePath=/path/to/unity-project googleServicesJsonPath=/path/to/google-services.json gidClientId=xxx googleUrlScheme=xxx",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_google", WorkspacePath: workspacePath, Checked: true}
	googleServicesJSONPath = strings.TrimSpace(googleServicesJSONPath)
	gidClientID = strings.TrimSpace(gidClientID)
	googleURLScheme = strings.TrimSpace(googleURLScheme)

	targetGoogleServices := filepath.Join(workspacePath, "Assets", "Plugins", "Android", "google-services.json")
	if googleServicesJSONPath == "" {
		if _, err := os.Stat(targetGoogleServices); err != nil {
			result.Missing = append(result.Missing, "缺少 googleServicesJsonPath，且 Assets/Plugins/Android/google-services.json 不存在")
		}
	} else if _, err := os.Stat(googleServicesJSONPath); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("googleServicesJsonPath 文件不存在: %s", googleServicesJSONPath))
	}
	if gidClientID == "" {
		result.Missing = append(result.Missing, "缺少 gidClientId，请传入 Google iOS Client ID")
	}
	if googleURLScheme == "" {
		result.Missing = append(result.Missing, "缺少 googleUrlScheme，请传入 Google REVERSED_CLIENT_ID")
	}
	if _, err := os.Stat(filepath.Join(workspacePath, unityGoogleSettingAsset)); err != nil {
		result.Missing = append(result.Missing, "未找到 Assets/RuiXueSettings/RuiXueSDK_GoogleXcodeSetting.asset")
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 Google 配置参数/文件后重新调用 unity feature=google_config")
		return result
	}

	if googleServicesJSONPath != "" {
		copyUnityFileIfChanged(googleServicesJSONPath, targetGoogleServices, &result)
	}
	updateUnityAssetFields(filepath.Join(workspacePath, unityGoogleSettingAsset), map[string]string{
		"GIDClientID":        gidClientID,
		"REVERSED_CLIENT_ID": googleURLScheme,
	}, &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "在 Unity 初始化阶段调用 RXGoogle.Regist(\""+gidClientID+"\")")
		result.NextSteps = append(result.NextSteps, "重新构建 Android/iOS，确认 Google 登录和支付配置生效")
	}
	return result
}

func unityFacebookConfigPreflight(workspacePath, facebookAppID, facebookClientToken string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_facebook",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity Facebook 登录环境",
				"重新调用 unity feature=facebook_config workspacePath=/path/to/unity-project facebookAppId=xxx facebookClientToken=xxx",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_facebook", WorkspacePath: workspacePath, Checked: true}
	facebookAppID = strings.TrimSpace(facebookAppID)
	facebookClientToken = strings.TrimSpace(facebookClientToken)

	if facebookAppID == "" {
		result.Missing = append(result.Missing, "缺少 facebookAppId，请传入 Facebook App ID")
	}
	if facebookClientToken == "" {
		result.Missing = append(result.Missing, "缺少 facebookClientToken，请传入 Facebook Client Token")
	}
	if _, err := os.Stat(filepath.Join(workspacePath, unityFacebookSettingAsset)); err != nil {
		result.Missing = append(result.Missing, "未找到 Assets/RuiXueSettings/RuiXueSDK_FacebookXcodeSetting.asset")
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 Facebook 配置参数/文件后重新调用 unity feature=facebook_config")
		return result
	}

	updateUnityAndroidProjectSettingsForFacebook(workspacePath, &result)
	upsertUnityFacebookAndroidManifest(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "AndroidManifest.xml"), &result)
	upsertUnityFacebookLauncherTemplate(
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "launcherTemplate.gradle"),
		facebookAppID,
		facebookClientToken,
		&result,
	)
	updateUnityAssetFields(filepath.Join(workspacePath, unityFacebookSettingAsset), map[string]string{
		"FbId":                facebookURLScheme(facebookAppID),
		"FacebookAppID":       facebookAppID,
		"FacebookClientToken": facebookClientToken,
	}, &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "重新构建 Android/iOS，确认 Facebook 登录配置生效")
	}
	return result
}

func unityHuaweiConfigPreflight(workspacePath, agconnectServicesJSONPath, androidVersion string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_huawei",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity 华为渠道环境",
				"重新调用 unity feature=huawei_config workspacePath=/path/to/unity-project agconnectServicesJsonPath=/path/to/agconnect-services.json androidVersion=4.x.x",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_huawei", WorkspacePath: workspacePath, Checked: true}
	agconnectServicesJSONPath = strings.TrimSpace(agconnectServicesJSONPath)
	androidVersion = strings.TrimSpace(androidVersion)
	targetAgconnect := filepath.Join(workspacePath, "Assets", "Plugins", "Android", "agconnect-services.json")

	if androidVersion == "" {
		result.Missing = append(result.Missing, "缺少 androidVersion，请传入华为 Android 原生 SDK 版本号，例如 4.0.9")
	}
	if agconnectServicesJSONPath == "" {
		if _, err := os.Stat(targetAgconnect); err != nil {
			result.Missing = append(result.Missing, "缺少 agconnectServicesJsonPath，且 Assets/Plugins/Android/agconnect-services.json 不存在")
		}
	} else if _, err := os.Stat(agconnectServicesJSONPath); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("agconnectServicesJsonPath 文件不存在: %s", agconnectServicesJSONPath))
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐华为 agconnect-services.json 后重新调用 unity feature=huawei_config")
		return result
	}

	if agconnectServicesJSONPath != "" {
		copyUnityFileIfChanged(agconnectServicesJSONPath, targetAgconnect, &result)
	}
	updateUnityAndroidProjectSettingsForHuawei(workspacePath, &result)
	upsertUnityHuaweiLauncherTemplate(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "launcherTemplate.gradle"), androidVersion, &result)
	upsertUnityHuaweiBaseProjectTemplate(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "baseProjectTemplate.gradle"), &result)
	upsertUnityHuaweiSettingsTemplate(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "settingsTemplate.gradle"), &result)
	upsertUnityHuaweiAndroidManifest(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "AndroidManifest.xml"), &result)
	upsertUnityHuaweiProguard(filepath.Join(workspacePath, "Assets", "Plugins", "Android", "proguard-user.txt"), &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "Unity 构建导出 Android 时，HuaweiAfterBuildToDo 会将 agconnect-services.json 复制到 launcher 目录")
		result.NextSteps = append(result.NextSteps, "重新构建 Android，验证华为登录/支付配置生效")
	}
	return result
}

func copyUnityFileIfChanged(src, dst string, result *PassportPreflightResult) {
	srcBytes, err := os.ReadFile(src)
	if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("读取 %s 失败: %v", src, err))
		return
	}
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(dst), err))
		return
	}
	if dstBytes, err := os.ReadFile(dst); err == nil && string(dstBytes) == string(srcBytes) {
		return
	}
	if err := os.WriteFile(dst, srcBytes, 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", dst, err))
		return
	}
	result.Modified = append(result.Modified, dst+": copied "+filepath.Base(dst))
}

func updateUnityAssetFields(path string, fields map[string]string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return
	}
	content := string(contentBytes)
	updated := content
	for key, value := range fields {
		re := regexp.MustCompile(`(?m)^([ \t]*` + regexp.QuoteMeta(key) + `:[ \t]*).*$`)
		if re.MatchString(updated) {
			updated = re.ReplaceAllString(updated, "${1}"+value)
			continue
		}
		if !strings.HasSuffix(updated, "\n") {
			updated += "\n"
		}
		updated += "  " + key + ": " + value + "\n"
	}
	if updated == content {
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", path, err))
		return
	}
	result.Modified = append(result.Modified, path+": updated Unity Xcode setting asset")
}

func ensureUnityLBSSettingAsset(workspacePath string, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, unityLBSSettingAsset)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
			result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
			return
		}
		const content = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!114 &11400000
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 0}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {fileID: 11500000, guid: a4b59fe4553ae4e8086ccc85e4a9e714, type: 3}
  m_Name: RuiXueSDK_LBSXcodeSetting
  m_EditorClassIdentifier:
  PrivacyLocationAlwaysUsageDescription: "是否允许访问定位权限？"
  PrivacyLocationAlwaysAndWhenInUseUsageDescription: "是否允许访问定位权限？"
  PrivacyLocationWhenInUseUsageDescription: "是否允许访问定位权限？"
`
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", path, err))
			return
		}
		result.Modified = append(result.Modified, path+": created Unity LBS Xcode setting asset")
		return
	} else if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("检查 %s 失败: %v", path, err))
		return
	}

	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return
	}
	content := string(contentBytes)
	if !strings.Contains(content, "MonoBehaviour:") ||
		!strings.Contains(content, "guid: a4b59fe4553ae4e8086ccc85e4a9e714") {
		result.Missing = append(result.Missing, path+" 不是有效的 RuiXueSDK_LBSXcodeSetting asset，请删除后重新调用 unity feature=lbs")
		return
	}
	defaults := map[string]string{}
	for _, key := range []string{
		"PrivacyLocationAlwaysUsageDescription",
		"PrivacyLocationAlwaysAndWhenInUseUsageDescription",
		"PrivacyLocationWhenInUseUsageDescription",
	} {
		re := regexp.MustCompile(`(?m)^[ \t]*` + regexp.QuoteMeta(key) + `:[ \t]*(\S.*)?$`)
		match := re.FindStringSubmatch(content)
		if len(match) < 2 || strings.TrimSpace(match[1]) == "" {
			defaults[key] = `"是否允许访问定位权限？"`
		}
	}
	if len(defaults) > 0 {
		updateUnityAssetFields(path, defaults, result)
	}
}

func ensureUnityAppleLoginPostBuild(workspacePath string, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, unityApplePostBuildScript)
	const content = `#if UNITY_IOS && UNITY_EDITOR
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public static class RXMCPAppleLoginPostBuildProcessor
{
    [PostProcessBuild(3)]
    public static void OnPostProcessBuild(BuildTarget target, string path)
    {
        if (target != BuildTarget.iOS)
        {
            return;
        }

        string projectPath = PBXProject.GetPBXProjectPath(path);
        var project = new PBXProject();
        project.ReadFromFile(projectPath);
        string targetGuid = project.GetUnityMainTargetGuid();
        string entitlementsPath = project.GetBuildPropertyForAnyConfig(
            targetGuid,
            "CODE_SIGN_ENTITLEMENTS");
        if (string.IsNullOrEmpty(entitlementsPath))
        {
            entitlementsPath = "Unity-iPhone/Unity-iPhone.entitlements";
        }
        entitlementsPath = entitlementsPath
            .Trim('"')
            .Replace("$(SRCROOT)/", string.Empty)
            .Replace("${SRCROOT}/", string.Empty)
            .Replace("$(PROJECT_DIR)/", string.Empty)
            .Replace("${PROJECT_DIR}/", string.Empty);

        var capabilityManager = new ProjectCapabilityManager(
            projectPath,
            entitlementsPath,
            "Unity-iPhone");
        capabilityManager.AddSignInWithApple();
        capabilityManager.WriteToFile();
    }
}
#endif
`
	existing, err := os.ReadFile(path)
	if err == nil {
		if string(existing) != content {
			result.Missing = append(result.Missing, path+" 已存在但内容与 MCP Apple 登录 PostBuild 不一致，请人工确认后重试")
		}
		return
	}
	if !os.IsNotExist(err) {
		result.Missing = append(result.Missing, fmt.Sprintf("读取 %s 失败: %v", path, err))
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", path, err))
		return
	}
	result.Modified = append(result.Modified, path+": created Sign in with Apple PostBuild")
}

func updateUnityAndroidProjectSettingsForFacebook(workspacePath string, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset")
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, "未找到 ProjectSettings/ProjectSettings.asset，已写入模板文件；请在 Unity Player Settings 中确认 Custom Main Manifest 和 Custom Launcher Gradle Template 已勾选")
		return
	}
	content := string(contentBytes)
	updated := replaceUnityProjectSetting(content, "useCustomMainManifest")
	updated = replaceUnityProjectSetting(updated, "useCustomLauncherGradleManifest")
	if updated == content {
		result.Warnings = append(result.Warnings, "ProjectSettings.asset 中未找到可更新的 Facebook Android 自定义模板开关，请在 Unity Player Settings 中手动确认")
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 ProjectSettings.asset 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": enabled Custom Main Manifest / Custom Launcher Gradle Template")
}

func updateUnityAndroidProjectSettingsForHuawei(workspacePath string, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset")
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, "未找到 ProjectSettings/ProjectSettings.asset，已写入华为模板文件；请在 Unity Player Settings 中确认 Custom Launcher Gradle/Base Gradle/Gradle Settings/Main Manifest/Proguard File 已勾选")
		return
	}
	content := string(contentBytes)
	updated := content
	for _, key := range []string{
		"useCustomLauncherGradleManifest",
		"useCustomBaseGradleTemplate",
		"useCustomGradleSettingsTemplate",
		"useCustomMainManifest",
		"useCustomProguardFile",
	} {
		updated = replaceUnityProjectSetting(updated, key)
	}
	if updated == content {
		result.Warnings = append(result.Warnings, "ProjectSettings.asset 中未找到可更新的华为 Android 自定义模板开关，请在 Unity Player Settings 中手动确认")
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 ProjectSettings.asset 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": enabled Huawei Android custom templates")
}

func upsertUnityFacebookAndroidManifest(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityAndroidManifest()
	} else {
		content = string(contentBytes)
	}
	updated := removeFacebookManifestEntries(content)
	block := `        <!-- RuiXue Facebook Config BEGIN -->
        <meta-data
                android:name="com.facebook.sdk.ApplicationId"
                android:value="@string/facebook_app_id" />
        <meta-data
                android:name="com.facebook.sdk.ClientToken"
                android:value="@string/facebook_client_token" />
        <!-- RuiXue Facebook Config END -->

`
	re := regexp.MustCompile(`(?s)<application\b[^>]*>\s*`)
	loc := re.FindStringIndex(updated)
	if loc == nil {
		result.Missing = append(result.Missing, "AndroidManifest.xml 中未找到 application 标签，无法自动添加 Facebook meta-data")
		return
	}
	updated = updated[:loc[1]] + "\n" + block + updated[loc[1]:]
	if updated == content && err == nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 AndroidManifest.xml 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": updated Facebook meta-data")
}

func upsertUnityHuaweiAndroidManifest(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityAndroidManifest()
	} else {
		content = string(contentBytes)
	}
	updated := removeHuaweiManifestEntries(content)
	block := `        <!-- RuiXue Huawei Config BEGIN -->
        <meta-data
                android:name="com.huawei.agconnect.AccessNetwork"
                android:value="false" />
        <!-- RuiXue Huawei Config END -->

`
	re := regexp.MustCompile(`(?s)<application\b[^>]*>\s*`)
	loc := re.FindStringIndex(updated)
	if loc == nil {
		result.Missing = append(result.Missing, "AndroidManifest.xml 中未找到 application 标签，无法自动添加华为 AccessNetwork meta-data")
		return
	}
	updated = updated[:loc[1]] + "\n" + block + updated[loc[1]:]
	if updated == content && err == nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 AndroidManifest.xml 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": updated Huawei AccessNetwork meta-data")
}

func removeFacebookManifestEntries(content string) string {
	blockRe := regexp.MustCompile(`(?s)\s*<!-- RuiXue Facebook Config BEGIN -->.*?<!-- RuiXue Facebook Config END -->\s*`)
	content = blockRe.ReplaceAllString(content, "\n")
	appIDRe := regexp.MustCompile(`(?s)\s*<meta-data\b[^>]*android:name="com\.facebook\.sdk\.ApplicationId"[^>]*/>\s*`)
	content = appIDRe.ReplaceAllString(content, "\n")
	tokenRe := regexp.MustCompile(`(?s)\s*<meta-data\b[^>]*android:name="com\.facebook\.sdk\.ClientToken"[^>]*/>\s*`)
	return tokenRe.ReplaceAllString(content, "\n")
}

func removeHuaweiManifestEntries(content string) string {
	blockRe := regexp.MustCompile(`(?s)\s*<!-- RuiXue Huawei Config BEGIN -->.*?<!-- RuiXue Huawei Config END -->\s*`)
	content = blockRe.ReplaceAllString(content, "\n")
	accessNetworkRe := regexp.MustCompile(`(?s)\s*<meta-data\b[^>]*android:name="com\.huawei\.agconnect\.AccessNetwork"[^>]*/>\s*`)
	return accessNetworkRe.ReplaceAllString(content, "\n")
}

func upsertUnityFacebookLauncherTemplate(path, facebookAppID, facebookClientToken string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityLauncherTemplate()
	} else {
		content = string(contentBytes)
	}
	updated := removeFacebookLauncherConfig(content)
	block := fmt.Sprintf(`        // ========== RuiXue Facebook Config BEGIN ==========
        resValue "string", "facebook_app_id", "%s"
        resValue "string", "facebook_client_token", "%s"
        manifestPlaceholders = [
            FACEBOOK_APP_ID : "%s"
        ]
        // ========== RuiXue Facebook Config END ==========

`, facebookAppID, facebookClientToken, facebookAppID)
	re := regexp.MustCompile(`(?s)defaultConfig\s*\{\s*\n`)
	loc := re.FindStringIndex(updated)
	if loc == nil {
		result.Missing = append(result.Missing, "launcherTemplate.gradle 中未找到 defaultConfig 块，无法自动添加 Facebook resValue/manifestPlaceholders")
		return
	}
	updated = updated[:loc[1]] + block + updated[loc[1]:]
	if updated == content && err == nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 launcherTemplate.gradle 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": updated Facebook resValue and manifestPlaceholders")
}

func upsertUnityHuaweiLauncherTemplate(path, androidVersion string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityLauncherTemplate()
	} else {
		content = string(contentBytes)
	}
	updated := upsertHuaweiAgconnectPlugin(content)
	updated = removeHuaweiLauncherDependencies(updated)
	block := fmt.Sprintf(`    // ========== RuiXue Huawei Dependencies BEGIN ==========
    def rxVersion = "%s"
    implementation "com.ruixue:rxsdk_huawei:${rxVersion}"
    // ========== RuiXue Huawei Dependencies END ==========

`, androidVersion)
	re := regexp.MustCompile(`(?s)dependencies\s*\{\s*\n`)
	loc := re.FindStringIndex(updated)
	if loc == nil {
		result.Missing = append(result.Missing, "launcherTemplate.gradle 中未找到 dependencies 块，无法自动添加华为渠道依赖")
		return
	}
	updated = updated[:loc[1]] + block + updated[loc[1]:]
	if updated == content && err == nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 launcherTemplate.gradle 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": updated Huawei launcher Gradle config")
}

func upsertHuaweiAgconnectPlugin(content string) string {
	if strings.Contains(content, "com.huawei.agconnect") {
		return content
	}
	re := regexp.MustCompile(`(?m)^apply plugin: ['"]com\.android\.application['"]\s*$`)
	loc := re.FindStringIndex(content)
	if loc == nil {
		return "apply plugin: 'com.huawei.agconnect'\n" + content
	}
	return content[:loc[1]] + "\napply plugin: 'com.huawei.agconnect'" + content[loc[1]:]
}

func removeHuaweiLauncherDependencies(content string) string {
	blockRe := regexp.MustCompile(`(?s)\s*// ========== RuiXue Huawei Dependencies BEGIN ==========.*?// ========== RuiXue Huawei Dependencies END ==========\s*`)
	content = blockRe.ReplaceAllString(content, "\n")
	huaweiDepRe := regexp.MustCompile(`(?m)^\s*implementation\s+["']com\.ruixue:rxsdk_huawei:[^"']+["']\s*\n`)
	return huaweiDepRe.ReplaceAllString(content, "")
}

func removeFacebookLauncherConfig(content string) string {
	blockRe := regexp.MustCompile(`(?s)\s*// ========== RuiXue Facebook Config BEGIN ==========.*?// ========== RuiXue Facebook Config END ==========\s*`)
	content = blockRe.ReplaceAllString(content, "\n")
	appIDRe := regexp.MustCompile(`(?m)^\s*resValue\s+["']string["']\s*,\s*["']facebook_app_id["'].*\n`)
	content = appIDRe.ReplaceAllString(content, "")
	tokenRe := regexp.MustCompile(`(?m)^\s*resValue\s+["']string["']\s*,\s*["']facebook_client_token["'].*\n`)
	content = tokenRe.ReplaceAllString(content, "")
	placeholderRe := regexp.MustCompile(`(?s)\n\s*manifestPlaceholders\s*=\s*\[\s*FACEBOOK_APP_ID\s*:\s*["'][^"']+["']\s*,?\s*\]\s*`)
	return placeholderRe.ReplaceAllString(content, "\n")
}

func upsertUnityHuaweiBaseProjectTemplate(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityBaseProjectTemplate()
	} else {
		content = string(contentBytes)
	}
	if strings.Contains(content, "com.huawei.agconnect:agcp") {
		return
	}
	re := regexp.MustCompile(`(?s)dependencies\s*\{\s*\n`)
	loc := re.FindStringIndex(content)
	if loc == nil {
		result.Missing = append(result.Missing, "baseProjectTemplate.gradle 中未找到 buildscript dependencies 块，无法自动添加华为 AGC 插件 classpath")
		return
	}
	updated := content[:loc[1]] + `        classpath "com.huawei.agconnect:agcp:1.6.0.300"
` + content[loc[1]:]
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 baseProjectTemplate.gradle 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": added Huawei AGC classpath")
}

func upsertUnityHuaweiSettingsTemplate(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnitySettingsTemplate()
	} else {
		content = string(contentBytes)
	}
	if strings.Contains(content, "https://developer.huawei.com/repo/") {
		return
	}
	re := regexp.MustCompile(`(?s)repositories\s*\{\s*\n`)
	matches := re.FindAllStringIndex(content, -1)
	if len(matches) == 0 {
		result.Missing = append(result.Missing, "settingsTemplate.gradle 中未找到 repositories 块，无法自动添加华为 Maven 仓库")
		return
	}
	repo := `        maven {
            allowInsecureProtocol true
            url 'https://developer.huawei.com/repo/'
        }
`
	var builder strings.Builder
	last := 0
	for _, loc := range matches {
		builder.WriteString(content[last:loc[1]])
		builder.WriteString(repo)
		last = loc[1]
	}
	builder.WriteString(content[last:])
	updated := builder.String()
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 settingsTemplate.gradle 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": added Huawei Maven repository")
}

func upsertUnityHuaweiProguard(path string, result *PassportPreflightResult) {
	rules := []string{
		"-ignorewarnings",
		"-keepattributes *Annotation*",
		"-keepattributes Exceptions",
		"-keepattributes InnerClasses",
		"-keepattributes Signature",
		"-keepattributes SourceFile,LineNumberTable",
		"-keep class com.huawei.hianalytics.**{*;}",
		"-keep class com.huawei.updatesdk.**{*;}",
		"-keep class com.huawei.hms.**{*;}",
		"-keep interface com.huawei.hms.analytics.type.HAEventType{*;}",
		"-keep interface com.huawei.hms.analytics.type.HAParamType{*;}",
		"-keep class com.huawei.hms.analytics.HiAnalyticsInstance{*;}",
		"-keep class com.huawei.hms.analytics.HiAnalytics{*;}",
	}
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err == nil {
		content = string(contentBytes)
	}
	updated := content
	if strings.TrimSpace(updated) != "" && !strings.HasSuffix(updated, "\n") {
		updated += "\n"
	}
	for _, rule := range rules {
		if strings.Contains(updated, rule) {
			continue
		}
		updated += rule + "\n"
	}
	if updated == content {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 proguard-user.txt 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": added Huawei Proguard rules")
}

func facebookURLScheme(facebookAppID string) string {
	if strings.HasPrefix(facebookAppID, "fb") {
		return facebookAppID
	}
	return "fb" + facebookAppID
}

func defaultUnityAndroidManifest() string {
	return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application>
    </application>
</manifest>
`
}

func defaultUnityLauncherTemplate() string {
	return `apply plugin: 'com.android.application'

dependencies {
    implementation project(':unityLibrary')
}

android {
    defaultConfig {
        applicationId '**APPLICATIONID**'
        minSdkVersion **MINSDKVERSION**
        targetSdkVersion **TARGETSDKVERSION**
        versionCode **VERSIONCODE**
        versionName '**VERSIONNAME**'
    }
}
`
}

func defaultUnityBaseProjectTemplate() string {
	return `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:7.0.1"
    }
}
`
}

func defaultUnitySettingsTemplate() string {
	return `pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
    }
}
`
}

func unityGoogleConfigInstructions(workspacePath, googleServicesJSONPath, gidClientID, googleURLScheme string, preflight PassportPreflightResult) string {
	return fmt.Sprintf(`# 瑞雪 SDK Unity Google 配置

workspacePath: %s
googleServicesJsonPath: %s
gidClientId: %s
googleUrlScheme: %s

配置项:
- Android: 将 google-services.json 放入 Assets/Plugins/Android/google-services.json
- iOS: 写入 Assets/RuiXueSettings/RuiXueSDK_GoogleXcodeSetting.asset 的 GIDClientID / REVERSED_CLIENT_ID
- 初始化: RXGoogle.Regist("%s")

preflight:
  checked: %t
  satisfied: %t
  missing: %v
  modified: %v
  warnings: %v
  nextSteps: %v
`, workspacePath, googleServicesJSONPath, gidClientID, googleURLScheme, gidClientID, preflight.Checked, preflight.Satisfied, preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
}

func unityFacebookConfigInstructions(workspacePath, facebookAppID, facebookClientToken string, preflight PassportPreflightResult) string {
	return fmt.Sprintf(`# 瑞雪 SDK Unity Facebook 配置

workspacePath: %s
facebookAppId: %s
facebookClientToken: %s

配置项:
- AndroidManifest.xml: application 标签下添加 Facebook ApplicationId / ClientToken meta-data
- launcherTemplate.gradle: defaultConfig 下添加 facebook_app_id / facebook_client_token resValue 和 FACEBOOK_APP_ID manifestPlaceholders
- iOS: 写入 Assets/RuiXueSettings/RuiXueSDK_FacebookXcodeSetting.asset 的 FbId / FacebookAppID / FacebookClientToken

preflight:
  checked: %t
  satisfied: %t
  missing: %v
  modified: %v
  warnings: %v
  nextSteps: %v
`, workspacePath, facebookAppID, facebookClientToken, preflight.Checked, preflight.Satisfied, preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
}

func unityHuaweiConfigInstructions(workspacePath, agconnectServicesJSONPath, androidVersion string, preflight PassportPreflightResult) string {
	return fmt.Sprintf(`# 瑞雪 SDK Unity 华为渠道配置

workspacePath: %s
agconnectServicesJsonPath: %s
androidVersion: %s

配置项:
- Android: 将 agconnect-services.json 放入 Assets/Plugins/Android/agconnect-services.json
- launcherTemplate.gradle: 添加 apply plugin 'com.huawei.agconnect'，并在 dependencies 添加 rxsdk_huawei
- baseProjectTemplate.gradle: 添加 classpath "com.huawei.agconnect:agcp:1.6.0.300"
- settingsTemplate.gradle: 添加 https://developer.huawei.com/repo/ 仓库
- AndroidManifest.xml: 在 application 下添加 com.huawei.agconnect.AccessNetwork=false
- proguard-user.txt: 添加华为 HMS/Analytics 混淆保留规则
- 构建后: Unity Editor 脚本 HuaweiAfterBuildToDo 会将该文件复制到导出的 launcher/agconnect-services.json

preflight:
  checked: %t
  satisfied: %t
  missing: %v
  modified: %v
  warnings: %v
  nextSteps: %v
`, workspacePath, agconnectServicesJSONPath, androidVersion, preflight.Checked, preflight.Satisfied, preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
}
