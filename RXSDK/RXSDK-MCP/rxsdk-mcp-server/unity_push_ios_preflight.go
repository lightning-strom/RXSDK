package rxsdk

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

var unityRegistryVersionPattern = regexp.MustCompile(`^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$`)

func normalizeUnityPushPlatform(platform string) (string, string) {
	platform = strings.ToLower(strings.TrimSpace(platform))
	if platform == "" {
		return "android", ""
	}
	switch platform {
	case "ios", "android", "both":
		return platform, ""
	default:
		return "", "不支持的 push platform: " + platform
	}
}

func unityPushPlatformFromRequest(req *mcp.CallToolRequest) (string, string) {
	if req == nil || req.Params == nil {
		return "android", ""
	}
	var input struct {
		Platform string `json:"platform"`
	}
	if err := json.Unmarshal(req.Params.Arguments, &input); err != nil {
		return "", "无法解析 push platform"
	}
	return normalizeUnityPushPlatform(input.Platform)
}

func unityPushIOSPreflight(workspacePath string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_ios_push",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能检查并升级 com.ruixue.unitysdk.push",
				"重新调用 unity feature=push platform=ios workspacePath=/path/to/unity-project",
			},
		}
	}

	result := PassportPreflightResult{
		Platform:      "unity_ios_push",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if err := upgradeUnityPushManifest(manifestPath, &result); err != nil {
		result.Missing = append(result.Missing, err.Error())
	}

	assetsPath := filepath.Join(workspacePath, "Assets")
	if !fileContainsAny(assetsPath, []string{".cs"}, []string{"RuiXueSdk.Initialize("}) {
		result.Missing = append(result.Missing, "未在 Assets 下找到 RuiXueSdk.Initialize(...) 初始化代码")
	}

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps,
			"重新导出 iOS 工程，确认已创建 NotificationService Extension Target",
			"确认 Extension Bundle ID 为主应用 Bundle ID + .NotificationService",
			"推送 payload 必须包含 aps.mutable-content=1，并使用真机验证后台/退出状态的接收统计",
		)
	} else {
		result.NextSteps = append(result.NextSteps, "处理 missing 项后重新调用 unity feature=push platform=ios")
	}
	return result
}

func upgradeUnityPushManifest(path string, result *PassportPreflightResult) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("未找到 Unity Packages/manifest.json: %s", path)
	}

	var root map[string]any
	if err := json.Unmarshal(content, &root); err != nil {
		return fmt.Errorf("解析 %s 失败: %v", path, err)
	}
	dependencies, ok := root["dependencies"].(map[string]any)
	if !ok {
		dependencies = map[string]any{}
		root["dependencies"] = dependencies
	}

	changed := false
	const pushPackage = "com.ruixue.unitysdk.push"
	currentPush, _ := dependencies[pushPackage].(string)
	switch {
	case currentPush == "":
		dependencies[pushPackage] = unityPushIOSMinVersion
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: 添加 %s %s", path, pushPackage, unityPushIOSMinVersion))
		changed = true
	case !isUnityRegistryVersion(currentPush):
		result.Missing = append(result.Missing,
			fmt.Sprintf("%s 使用非 Registry 版本 %q，无法安全判断是否包含 NotificationService 自动接入", pushPackage, currentPush))
	case compareVersion(cleanVersion(currentPush), unityPushIOSMinVersion) < 0:
		dependencies[pushPackage] = unityPushIOSMinVersion
		result.Modified = append(result.Modified,
			fmt.Sprintf("%s: %s %s -> %s", path, pushPackage, currentPush, unityPushIOSMinVersion))
		changed = true
	}

	for packageName, rawVersion := range dependencies {
		if packageName == pushPackage || !strings.HasPrefix(packageName, "com.ruixue.unitysdk.") {
			continue
		}
		version, _ := rawVersion.(string)
		if version == "" || !isUnityRegistryVersion(version) {
			if version != "" {
				result.Warnings = append(result.Warnings,
					fmt.Sprintf("保留非 Registry 依赖 %s=%q，未自动改写", packageName, version))
			}
			continue
		}
		if compareVersion(cleanVersion(version), unityPushIOSMinVersion) < 0 {
			dependencies[packageName] = unityPushIOSMinVersion
			result.Modified = append(result.Modified,
				fmt.Sprintf("%s: %s %s -> %s", path, packageName, version, unityPushIOSMinVersion))
			changed = true
		}
	}

	if !changed {
		return nil
	}
	updated, err := json.MarshalIndent(root, "", "  ")
	if err != nil {
		return fmt.Errorf("序列化 %s 失败: %v", path, err)
	}
	updated = append(updated, '\n')
	if err := os.WriteFile(path, updated, 0644); err != nil {
		return fmt.Errorf("写入 %s 失败: %v", path, err)
	}
	return nil
}

func isUnityRegistryVersion(version string) bool {
	return unityRegistryVersionPattern.MatchString(strings.TrimSpace(version))
}

func mergeUnityPushPreflights(iosResult, androidResult PassportPreflightResult) PassportPreflightResult {
	return PassportPreflightResult{
		Platform:      "unity_push",
		WorkspacePath: iosResult.WorkspacePath,
		Checked:       iosResult.Checked && androidResult.Checked,
		Satisfied:     iosResult.Satisfied && androidResult.Satisfied,
		Modified:      appendUniqueStrings(iosResult.Modified, androidResult.Modified...),
		Missing:       appendUniqueStrings(iosResult.Missing, androidResult.Missing...),
		Warnings:      appendUniqueStrings(iosResult.Warnings, androidResult.Warnings...),
		NextSteps:     appendUniqueStrings(iosResult.NextSteps, androidResult.NextSteps...),
	}
}
