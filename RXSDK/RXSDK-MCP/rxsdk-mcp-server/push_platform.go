package rxsdk

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type AndroidPushPlatform struct {
	Name        string   `json:"name"`
	Artifact    string   `json:"artifact"`
	Description string   `json:"description"`
	ConfigKeys  []string `json:"configKeys,omitempty"`
}

var androidPushPlatforms = []AndroidPushPlatform{
	{Name: "firebase", Artifact: "rxsdk_firebase", Description: "Firebase Cloud Messaging（FCM，海外/GMS 设备）", ConfigKeys: []string{"google-services.json", "com.google.gms.google-services"}},
	{Name: "huawei", Artifact: "rxsdk_push_huawei", Description: "华为 HMS Push", ConfigKeys: []string{"agconnect-services.json", "com.huawei.agconnect"}},
	{Name: "honor", Artifact: "rxsdk_push_honor", Description: "荣耀 Push", ConfigKeys: []string{"HONOR_APP_ID"}},
	{Name: "xiaomi", Artifact: "rxsdk_push_mi", Description: "小米 Mi Push", ConfigKeys: []string{"MI_APP_ID", "MI_APP_KEY"}},
	{Name: "oppo", Artifact: "rxsdk_push_oppo", Description: "OPPO Push", ConfigKeys: []string{"OPPO_APP_KEY", "OPPO_APP_SECRET"}},
	{Name: "vivo", Artifact: "rxsdk_push_vivo", Description: "vivo Push", ConfigKeys: []string{"VIVO_APP_ID", "VIVO_API_KEY"}},
	{Name: "meizu", Artifact: "rxsdk_push_meizu", Description: "魅族 Push", ConfigKeys: []string{"MZ_APP_ID", "MZ_APP_KEY"}},
}

var androidPushPlatformAliases = map[string]string{
	"fcm":    "firebase",
	"mi":     "xiaomi",
	"hms":    "huawei",
	"honour": "honor",
}

func androidPushPlatformNames() []string {
	names := make([]string, 0, len(androidPushPlatforms))
	for _, platform := range androidPushPlatforms {
		names = append(names, platform.Name)
	}
	return names
}

func androidPushPlatformOptions() []AndroidPushPlatform {
	return append([]AndroidPushPlatform(nil), androidPushPlatforms...)
}

func normalizeAndroidPushPlatforms(values []string) ([]string, string) {
	known := map[string]bool{}
	for _, platform := range androidPushPlatforms {
		known[platform.Name] = true
	}

	seen := map[string]bool{}
	var normalized []string
	var invalid []string
	for _, value := range values {
		name := strings.ToLower(strings.TrimSpace(value))
		if alias, ok := androidPushPlatformAliases[name]; ok {
			name = alias
		}
		if name == "" || seen[name] {
			continue
		}
		if !known[name] {
			invalid = append(invalid, name)
			continue
		}
		seen[name] = true
		normalized = append(normalized, name)
	}
	if len(invalid) > 0 {
		sort.Strings(invalid)
		return nil, fmt.Sprintf("不支持的 Android 推送平台: %s；可选值: %s", strings.Join(invalid, ", "), strings.Join(androidPushPlatformNames(), ", "))
	}
	return normalized, ""
}

func pushPlatformsFromRequest(req *mcp.CallToolRequest, required bool) ([]string, string) {
	if req == nil || req.Params == nil {
		if required {
			return nil, pushPlatformSelectionRequiredMessage()
		}
		return nil, ""
	}
	var input struct {
		PushPlatforms []string `json:"pushPlatforms"`
	}
	if err := json.Unmarshal(req.Params.Arguments, &input); err != nil {
		return nil, "无法解析 pushPlatforms"
	}
	platforms, validationError := normalizeAndroidPushPlatforms(input.PushPlatforms)
	if validationError != "" {
		return nil, validationError
	}
	if required && len(platforms) == 0 {
		return nil, pushPlatformSelectionRequiredMessage()
	}
	return platforms, ""
}

func pushPlatformSelectionRequiredMessage() string {
	return "缺少 pushPlatforms；接入推送前必须让用户选择至少一个 Android 推送平台，可选: " + strings.Join(androidPushPlatformNames(), ", ")
}

func androidPushArtifacts(platforms []string) []string {
	var artifacts []string
	seen := map[string]bool{}
	for _, name := range platforms {
		for _, platform := range androidPushPlatforms {
			if platform.Name != name || seen[platform.Artifact] {
				continue
			}
			seen[platform.Artifact] = true
			artifacts = append(artifacts, platform.Artifact)
		}
	}
	return artifacts
}

func androidPushArtifactsForSelection(platforms []string) []string {
	if len(platforms) == 0 {
		return nil
	}
	return androidPushArtifacts(platforms)
}

func buildAndroidPushGradleDependencies(platforms []string, version, gradleType string) string {
	if strings.TrimSpace(version) == "" {
		version = SDK_VERSION
	}
	quote := "'"
	if strings.EqualFold(strings.TrimSpace(gradleType), "kts") {
		var lines []string
		for _, artifact := range androidPushArtifacts(platforms) {
			lines = append(lines, fmt.Sprintf("implementation(\"com.ruixue:%s:%s\")", artifact, version))
		}
		return strings.Join(lines, "\n")
	}
	var lines []string
	for _, artifact := range androidPushArtifacts(platforms) {
		lines = append(lines, fmt.Sprintf("implementation %scom.ruixue:%s:%s%s", quote, artifact, version, quote))
	}
	return strings.Join(lines, "\n")
}

func androidPushPreflight(workspacePath string, platforms []string) PassportPreflightResult {
	if len(platforms) == 0 {
		return PassportPreflightResult{
			Platform:  "android_push",
			Checked:   false,
			Satisfied: false,
			Missing:   []string{pushPlatformSelectionRequiredMessage()},
			NextSteps: []string{"询问用户需要接入哪些 Android 推送平台，再使用 pushPlatforms 重新调用推送功能"},
		}
	}
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:  "android_push",
			Checked:   false,
			Satisfied: false,
			NextSteps: []string{
				fmt.Sprintf("重新调用推送功能并传入 workspacePath；当前选择: %s", strings.Join(platforms, ", ")),
			},
		}
	}

	result := PassportPreflightResult{Platform: "android_push", WorkspacePath: workspacePath, Checked: true}
	gradleFiles := existingFiles(
		filepath.Join(workspacePath, "app", "build.gradle"),
		filepath.Join(workspacePath, "app", "build.gradle.kts"),
		filepath.Join(workspacePath, "Assets", "Plugins", "Android", "mainTemplate.gradle"),
	)
	for _, artifact := range androidPushArtifacts(platforms) {
		if !filesContainAny(gradleFiles, []string{"com.ruixue:" + artifact + ":"}) {
			result.Missing = append(result.Missing, "未检测到 Android 推送依赖 com.ruixue:"+artifact)
		}
	}
	validateAndroidPushPlatformConfig(workspacePath, platforms, &result)
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "补齐所选推送平台的 Gradle 依赖和平台配置后重新检查")
	}
	return result
}

func validateAndroidPushPlatformConfig(workspacePath string, platforms []string, result *PassportPreflightResult) {
	for _, platform := range platforms {
		switch platform {
		case "firebase":
			if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.google.gms.google-services"}) {
				result.Missing = append(result.Missing, "Firebase 推送未检测到 com.google.gms.google-services 插件")
			}
			if !fileExistsNamed(workspacePath, "google-services.json") {
				result.Missing = append(result.Missing, "Firebase 推送未检测到 google-services.json")
			}
		case "huawei":
			if !fileExistsNamed(workspacePath, "agconnect-services.json") {
				result.Missing = append(result.Missing, "华为推送未检测到 agconnect-services.json")
			}
			if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{"com.huawei.agconnect"}) {
				result.Missing = append(result.Missing, "华为推送未检测到 com.huawei.agconnect Gradle 插件；Unity 项目请调用 huawei_config")
			}
		default:
			definition, ok := androidPushPlatformDefinition(platform)
			if !ok || len(definition.ConfigKeys) == 0 {
				continue
			}
			for _, key := range definition.ConfigKeys {
				if !fileContainsAny(workspacePath, []string{".gradle", ".kts"}, []string{key}) {
					result.Missing = append(result.Missing, fmt.Sprintf("%s 推送未检测到 Manifest placeholder %s", definition.Description, key))
				}
			}
		}
	}
}

func androidPushPlatformDefinition(name string) (AndroidPushPlatform, bool) {
	for _, platform := range androidPushPlatforms {
		if platform.Name == name {
			return platform, true
		}
	}
	return AndroidPushPlatform{}, false
}

func filesContainAny(paths []string, needles []string) bool {
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		for _, needle := range needles {
			if strings.Contains(string(content), needle) {
				return true
			}
		}
	}
	return false
}

func pushPlatformSelected(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}
