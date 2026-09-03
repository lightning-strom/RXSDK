package rxsdk

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const (
	unityAndroidDepsBegin = "// ========== RuiXue SDK Dependencies BEGIN =========="
	unityAndroidDepsEnd   = "// ========== RuiXue SDK Dependencies END =========="
	unityProguardKeepRule = "-keep class com.ruixue.** { *; }"
)

var unityAndroidChannelNames = []string{
	"rxsdk_weile",
	"rxsdk_baidu_wangxun",
	"rxsdk_douyin_gb",
	"rxsdk_huawei",
	"rxsdk_kwaiallin",
	"rxsdk_xiaomi",
	"rxsdk_vivo",
	"rxsdk_oppo",
	"rxsdk_ysdk",
	"rxsdk_taptap",
	"rxsdk_overseas",
}

var unityAndroidComponentNames = []string{
	"rxsdk_base_ui",
	"rxsdk_weixin",
	"rxsdk_alimobile",
	"rxsdk_gaode",
	"rxsdk_unifypay",
	"rxsdk_oaid",
	"rxsdk_firebase",
	"rxsdk_adjust",
}

var (
	unityAndroidChannelSet   = stringSet(unityAndroidChannelNames)
	unityAndroidComponentSet = stringSet(unityAndroidComponentNames)
)

type UnityAndroidNativeSetupResult struct {
	Instructions          string                  `json:"instructions"`
	ApplicationID         string                  `json:"applicationId,omitempty"`
	Channel               string                  `json:"channel,omitempty"`
	Components            []string                `json:"components,omitempty"`
	PushPlatforms         []string                `json:"pushPlatforms,omitempty"`
	AndroidVersion        string                  `json:"androidVersion,omitempty"`
	GradleDependencyBlock string                  `json:"gradleDependencyBlock,omitempty"`
	ProguardConfig        string                  `json:"proguardConfig,omitempty"`
	Preflight             PassportPreflightResult `json:"preflight"`
}

func UnityAndroidNativeSetupHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath  string   `json:"workspacePath"`
		Region         string   `json:"region"`
		Channel        string   `json:"channel"`
		AndroidVersion string   `json:"androidVersion"`
		Components     []string `json:"components"`
		ApplicationID  string   `json:"applicationId"`
	},
) (*mcp.CallToolResult, UnityAndroidNativeSetupResult, error) {
	_ = ctx
	_ = req

	channel := strings.TrimSpace(input.Channel)
	region := strings.TrimSpace(input.Region)

	version := strings.TrimSpace(input.AndroidVersion)
	components := normalizeUnityAndroidComponents(input.Components)
	pushPlatforms, pushSelectionError := pushPlatformsFromRequest(req, false)
	applicationID := resolveUnityAndroidApplicationID(input.WorkspacePath, input.ApplicationID)
	gradleBlock := buildUnityAndroidGradleDependencyBlockWithPush(channel, components, pushPlatforms, version)
	proguardConfig := unityProguardKeepRule
	preflight := unityAndroidNativeSetupPreflightWithPush(input.WorkspacePath, region, channel, version, components, pushPlatforms, pushSelectionError, applicationID)

	var buf bytes.Buffer
	if err := unityAndroidNativeSetupTpl.Execute(&buf, struct {
		WorkspacePath         string
		ApplicationID         string
		Region                string
		Channel               string
		Components            []string
		PushPlatforms         []string
		AndroidVersion        string
		GradleDependencyBlock string
		ProguardConfig        string
		ChannelNames          []string
		ComponentNames        []string
		Preflight             PassportPreflightResult
	}{
		WorkspacePath:         input.WorkspacePath,
		ApplicationID:         applicationID,
		Region:                region,
		Channel:               channel,
		Components:            components,
		PushPlatforms:         pushPlatforms,
		AndroidVersion:        version,
		GradleDependencyBlock: gradleBlock,
		ProguardConfig:        proguardConfig,
		ChannelNames:          unityAndroidChannelNames,
		ComponentNames:        unityAndroidComponentNames,
		Preflight:             preflight,
	}); err != nil {
		return nil, UnityAndroidNativeSetupResult{}, err
	}

	return nil, UnityAndroidNativeSetupResult{
		Instructions:          buf.String(),
		ApplicationID:         applicationID,
		Channel:               channel,
		Components:            components,
		PushPlatforms:         pushPlatforms,
		AndroidVersion:        version,
		GradleDependencyBlock: gradleBlock,
		ProguardConfig:        proguardConfig,
		Preflight:             preflight,
	}, nil
}

func unityAndroidNativeSetupPreflight(workspacePath, region, channel, version string, components []string, applicationID string) PassportPreflightResult {
	return unityAndroidNativeSetupPreflightWithPush(workspacePath, region, channel, version, components, nil, "", applicationID)
}

func unityAndroidNativeSetupPreflightWithPush(workspacePath, region, channel, version string, components, pushPlatforms []string, pushSelectionError, applicationID string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_android",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity Android 原生依赖",
				"重新调用 unity feature=android_native_setup workspacePath=/path/to/unity-project androidVersion=4.x.x channel=rxsdk_overseas",
			},
		}
	}

	result := PassportPreflightResult{Platform: "unity_android", WorkspacePath: workspacePath, Checked: true}
	channel = strings.TrimSpace(channel)
	version = strings.TrimSpace(version)

	if version == "" {
		result.Missing = append(result.Missing, "缺少 androidVersion，请传入 Android 原生 SDK 版本号，例如 4.0.9；如需自动取最新可传 +")
	}
	if channel == "" {
		result.Missing = append(result.Missing, "缺少 channel，渠道库必须由用户从 channel_libraries 中单选一个；海外 Android 通常选择 rxsdk_overseas，但仍需用户确认")
	}
	if channel != "" && !unityAndroidChannelSet[channel] {
		result.Missing = append(result.Missing, fmt.Sprintf("不支持的 Unity Android 渠道库: %s", channel))
	}
	if applicationID == "" {
		result.Missing = append(result.Missing, "未找到 Android applicationId，请通过 params.applicationId 提供项目包名，或先在 Player Settings 配置 Package Name")
	} else if !isValidUnityAndroidApplicationID(applicationID) {
		result.Missing = append(result.Missing, fmt.Sprintf("Android applicationId 格式无效: %s", applicationID))
	}
	for _, component := range components {
		if !unityAndroidComponentSet[component] {
			result.Missing = append(result.Missing, fmt.Sprintf("不支持的 Unity Android 组件库: %s", component))
		}
	}
	if pushSelectionError != "" {
		result.Missing = append(result.Missing, pushSelectionError)
	}
	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 androidVersion、channel/components 参数后重新调用 android_native_setup")
		return result
	}

	pluginsDir := filepath.Join(workspacePath, "Assets", "Plugins", "Android")
	if err := os.MkdirAll(pluginsDir, 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 Unity Android 插件目录失败: %v", err))
		result.Satisfied = false
		return result
	}

	updateUnityAndroidProjectSettings(workspacePath, &result)
	upsertUnityAndroidManifest(filepath.Join(pluginsDir, "AndroidManifest.xml"), applicationID, &result)
	upsertUnityPlayerActivity(filepath.Join(pluginsDir, "UnityPlayerActivity.java"), applicationID, &result)
	upsertUnityAndroidMainTemplateWithPush(filepath.Join(pluginsDir, "mainTemplate.gradle"), channel, components, pushPlatforms, version, &result)
	upsertUnityRuixueMavenRepositories(filepath.Join(pluginsDir, "settingsTemplate.gradle"), &result)
	upsertUnityAndroidGradleProperties(filepath.Join(pluginsDir, "gradleTemplate.properties"), channel, &result)
	upsertUnityAndroidProguard(filepath.Join(pluginsDir, "proguard-user.txt"), &result)
	validateAndroidPushPlatformConfig(workspacePath, pushPlatforms, &result)

	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "修复缺失项后重新调用 unity feature=android_native_setup")
	} else {
		result.NextSteps = append(result.NextSteps, "在 Unity 中重新构建 Android，确认 Gradle Resolve 和打包通过")
	}
	return result
}

func normalizeUnityAndroidComponents(components []string) []string {
	seen := map[string]bool{}
	var result []string
	for _, component := range components {
		component = strings.TrimSpace(component)
		if component == "" || seen[component] {
			continue
		}
		seen[component] = true
		result = append(result, component)
	}
	sort.Strings(result)
	return result
}

func buildUnityAndroidGradleDependencyBlock(channel string, components []string, version string) string {
	return buildUnityAndroidGradleDependencyBlockWithPush(channel, components, nil, version)
}

func buildUnityAndroidGradleDependencyBlockWithPush(channel string, components, pushPlatforms []string, version string) string {
	if channel == "" || version == "" {
		return ""
	}

	var builder strings.Builder
	builder.WriteString("    ")
	builder.WriteString(unityAndroidDepsBegin)
	builder.WriteByte('\n')
	builder.WriteString(fmt.Sprintf("    def rxVersion = \"%s\"\n", version))
	builder.WriteString(fmt.Sprintf("    implementation \"com.ruixue:%s:${rxVersion}\"\n", channel))
	artifacts := append([]string(nil), components...)
	artifacts = append(artifacts, androidPushArtifactsForSelection(pushPlatforms)...)
	seen := map[string]bool{channel: true}
	for _, artifact := range artifacts {
		if seen[artifact] {
			continue
		}
		seen[artifact] = true
		builder.WriteString(fmt.Sprintf("    implementation \"com.ruixue:%s:${rxVersion}\"\n", artifact))
	}
	builder.WriteString("    ")
	builder.WriteString(unityAndroidDepsEnd)
	return builder.String()
}

func updateUnityAndroidProjectSettings(workspacePath string, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset")
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, "未找到 ProjectSettings/ProjectSettings.asset，已写入模板文件；请在 Unity Player Settings 中确认 Custom Main Gradle Template、Custom Gradle Settings Template 和 Custom Proguard File 已勾选")
		return
	}

	content := string(contentBytes)
	updated := content
	updated = replaceUnityProjectSetting(updated, "useCustomMainGradleTemplate")
	updated = replaceUnityProjectSetting(updated, "useCustomGradleSettingsTemplate")
	updated = replaceUnityProjectSetting(updated, "useCustomGradlePropertiesTemplate")
	updated = replaceUnityProjectSetting(updated, "useCustomMainManifest")
	updated = replaceUnityProjectSetting(updated, "useCustomProguardFile")
	updated = replaceUnityProjectSettingValue(updated, "AndroidMinSdkVersion", "22")
	updated = replaceUnityProjectSettingValue(updated, "AndroidTargetSdkVersion", "31")
	if updated == content {
		result.Warnings = append(result.Warnings, "ProjectSettings.asset 中未找到可更新的 Unity Android 自定义模板开关，请在 Unity Player Settings 中手动确认")
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 ProjectSettings.asset 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": configured Android API 22/31 and enabled custom Android templates")
}

func replaceUnityProjectSetting(content string, key string) string {
	re := regexp.MustCompile(`(?m)^(\s*` + regexp.QuoteMeta(key) + `:\s*)[01](\s*)$`)
	return re.ReplaceAllString(content, "${1}1${2}")
}

func replaceUnityProjectSettingValue(content, key, value string) string {
	re := regexp.MustCompile(`(?m)^(\s*` + regexp.QuoteMeta(key) + `:\s*)[^\s]+(\s*)$`)
	return re.ReplaceAllString(content, "${1}"+value+"${2}")
}

func upsertUnityAndroidMainTemplate(path, channel string, components []string, version string, result *PassportPreflightResult) {
	upsertUnityAndroidMainTemplateWithPush(path, channel, components, nil, version, result)
}

func upsertUnityAndroidMainTemplateWithPush(path, channel string, components, pushPlatforms []string, version string, result *PassportPreflightResult) {
	block := buildUnityAndroidGradleDependencyBlockWithPush(channel, components, pushPlatforms, version)
	if block == "" {
		return
	}

	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityAndroidMainTemplate()
	} else {
		content = string(contentBytes)
	}

	warnUnmanagedUnityAndroidChannels(content, channel, result)

	updated, ok := replaceUnityAndroidManagedDependencyBlock(content, block)
	if !ok {
		updated, ok = insertUnityAndroidDependencyBlock(content, block)
	}
	if !ok {
		result.Missing = append(result.Missing, "mainTemplate.gradle 中未找到 dependencies 块，无法自动插入瑞雪 Android 依赖")
		return
	}
	if updated == content && err == nil {
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 mainTemplate.gradle 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": updated RuiXue Android dependencies")
}

func replaceUnityAndroidManagedDependencyBlock(content string, block string) (string, bool) {
	re := regexp.MustCompile(`(?s)\s*` + regexp.QuoteMeta(unityAndroidDepsBegin) + `.*?` + regexp.QuoteMeta(unityAndroidDepsEnd))
	if !re.MatchString(content) {
		return content, false
	}
	return re.ReplaceAllString(content, "\n"+block), true
}

func insertUnityAndroidDependencyBlock(content string, block string) (string, bool) {
	re := regexp.MustCompile(`dependencies\s*\{\s*\n`)
	loc := re.FindStringIndex(content)
	if loc == nil {
		return content, false
	}
	return content[:loc[1]] + "\n" + block + "\n" + content[loc[1]:], true
}

func warnUnmanagedUnityAndroidChannels(content, selectedChannel string, result *PassportPreflightResult) {
	withoutManaged := removeUnityAndroidManagedDependencyBlock(content)
	re := regexp.MustCompile(`(?m)^\s*implementation\s+["']com\.ruixue:(rxsdk_[^:"']+):`)
	matches := re.FindAllStringSubmatch(withoutManaged, -1)
	for _, match := range matches {
		if len(match) < 2 || !unityAndroidChannelSet[match[1]] || match[1] == selectedChannel {
			continue
		}
		result.Warnings = append(result.Warnings, fmt.Sprintf("检测到托管块外已有渠道库 %s，请确认渠道库保持单选", match[1]))
	}
}

func removeUnityAndroidManagedDependencyBlock(content string) string {
	re := regexp.MustCompile(`(?s)` + regexp.QuoteMeta(unityAndroidDepsBegin) + `.*?` + regexp.QuoteMeta(unityAndroidDepsEnd))
	return re.ReplaceAllString(content, "")
}

func upsertUnityAndroidProguard(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err == nil {
		content = string(contentBytes)
	}
	if strings.Contains(content, "-keep class com.ruixue.**") {
		return
	}
	if strings.TrimSpace(content) != "" && !strings.HasSuffix(content, "\n") {
		content += "\n"
	}
	content += unityProguardKeepRule + "\n"
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 proguard-user.txt 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": added RuiXue Proguard keep rule")
}

func defaultUnityAndroidMainTemplate() string {
	return `apply plugin: 'com.android.library'
**APPLY_PLUGINS**

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
**DEPS**}

android {
    namespace "com.unity3d.player"
    ndkPath "**NDKPATH**"
    compileSdkVersion **APIVERSION**
    buildToolsVersion '**BUILDTOOLS**'

    defaultConfig {
        minSdkVersion **MINSDKVERSION**
        targetSdkVersion **TARGETSDKVERSION**
        ndk {
            abiFilters **ABIFILTERS**
        }
        versionCode **VERSIONCODE**
        versionName '**VERSIONNAME**'
        consumerProguardFiles 'proguard-unity.txt'**USER_PROGUARD**
    }
}
**IL_CPP_BUILD_SETUP**
**SOURCE_BUILD_SETUP**
**EXTERNAL_SOURCES**
`
}

func stringSet(values []string) map[string]bool {
	result := map[string]bool{}
	for _, value := range values {
		result[value] = true
	}
	return result
}
