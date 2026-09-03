package rxsdk

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// ==================== 三方渠道声明式配置类型 ====================

type unityChannelParam struct {
	Key         string
	Description string
}

type unityChannelKeyValue struct {
	Key   string
	Value string // 可包含 {{paramKey}} 占位符
}

// unityChannelAssetFile 描述需要从使用方提供的源文件复制到 Unity 工程的配置文件。
type unityChannelAssetFile struct {
	SourceParamKey string // params 中保存源文件绝对路径的 key
	DestRelPath    string // 相对 Assets/Plugins/Android 的目标路径
}

// unityChannelIOSAsset 描述需要写入的 iOS Xcode 设置资产。
type unityChannelIOSAsset struct {
	AssetRelPath string // 相对工程根目录，例如 Assets/RuiXueSettings/RuiXueSDK_ZaloXcodeSetting.asset
	Fields       []unityChannelKeyValue
}

type unityChannelSpec struct {
	DisplayName       string
	AndroidMinVersion string

	// 依赖
	RuixueLibs       []string // 需要拼 androidVersion 的瑞雪库名，例如 rxsdk_zalo
	FixedLibs        []string // 固定坐标依赖，例如 com.jakewharton.timber:timber:5.0.1
	DependencyTarget string   // main(默认) | launcher

	// 参数（@your 占位，必须由使用方提供）
	Params []unityChannelParam

	// AndroidManifest <application> 写入
	ManifestMeta     []unityChannelKeyValue // name -> value
	ManifestSnippets []string               // 原样注入 <application> 的 XML 片段（支持 {{param}}）

	// launcherTemplate.gradle defaultConfig 写入
	LauncherResValues            []unityChannelKeyValue
	LauncherManifestPlaceholders []unityChannelKeyValue
	LauncherDefaultConfigLines   []string

	// settingsTemplate.gradle 仓库
	SettingsMavenRepos []string // 每项为完整的 maven { ... } 块

	// proguard-user.txt 规则
	ProguardRules []string

	// 需要复制的渠道配置文件
	AssetFiles []unityChannelAssetFile

	// iOS Xcode 设置资产
	IOSAssets []unityChannelIOSAsset

	// InitThirdSdk 初始化参数（仅用于生成示例说明，不写文件）
	InitParams []unityChannelKeyValue

	Notes []string
}

var unityRuixueMavenRepositories = []string{
	`google()`,
	`mavenCentral()`,
	`jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }`,
	`maven {
    url 'http://60.205.123.114:8081/repository/maven-releases/'
    allowInsecureProtocol = true
}`,
	`def rxMavenUsername = System.getenv('RUIXUE_MAVEN_USERNAME')
def rxMavenPassword = System.getenv('RUIXUE_MAVEN_PASSWORD')
if (rxMavenUsername && rxMavenPassword) {
  maven {
    credentials {
      username rxMavenUsername
      password rxMavenPassword
    }
    url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
  }
}`,
}

// UnityChannelConfigResult 渠道配置返回结构。
type UnityChannelConfigResult struct {
	Instructions string                  `json:"instructions"`
	Channel      string                  `json:"channel"`
	Preflight    PassportPreflightResult `json:"preflight"`
}

var unityChannelPlaceholderRe = regexp.MustCompile(`\{\{([a-zA-Z0-9_]+)\}\}`)

// ==================== Handler ====================

func UnityChannelConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath  string            `json:"workspacePath"`
		ThirdChannel   string            `json:"thirdChannel"`
		AndroidVersion string            `json:"androidVersion"`
		Params         map[string]string `json:"params"`
	},
) (*mcp.CallToolResult, UnityChannelConfigResult, error) {
	_ = ctx
	_ = req

	slug := strings.TrimSpace(input.ThirdChannel)
	androidVersion := unityChannelAndroidVersion(slug, input.AndroidVersion)
	preflight := unityChannelConfigPreflight(input.WorkspacePath, slug, androidVersion, input.Params)
	return nil, UnityChannelConfigResult{
		Instructions: unityChannelConfigInstructions(slug, androidVersion, input.Params, preflight),
		Channel:      slug,
		Preflight:    preflight,
	}, nil
}

func unityChannelConfigPreflight(workspacePath, slug, androidVersion string, params map[string]string) PassportPreflightResult {
	if strings.TrimSpace(workspacePath) == "" {
		return PassportPreflightResult{
			Platform:      "unity_channel",
			WorkspacePath: workspacePath,
			Checked:       false,
			Satisfied:     false,
			NextSteps: []string{
				"传入 workspacePath 后 MCP 才能实际配置 Unity 三方渠道环境",
				"重新调用 unity feature=channel_config workspacePath=/path/to/unity-project thirdChannel=" + defaultSlugHint(slug) + " androidVersion=4.x.x params={...}",
			},
		}
	}

	spec, ok := unityChannelSpecs[slug]
	if !ok {
		return PassportPreflightResult{
			Platform:      "unity_channel",
			WorkspacePath: workspacePath,
			Checked:       true,
			Satisfied:     false,
			Missing:       []string{fmt.Sprintf("不支持的三方渠道: %s；可选: %s", slug, strings.Join(unityChannelSlugs(), ", "))},
		}
	}

	if params == nil {
		params = map[string]string{}
	}
	result := PassportPreflightResult{Platform: "unity_channel", WorkspacePath: workspacePath, Checked: true}
	androidVersion = unityChannelAndroidVersion(slug, androidVersion)

	if len(spec.RuixueLibs) > 0 && androidVersion == "" {
		result.Missing = append(result.Missing, "缺少 androidVersion，请传入 Android 原生 SDK 版本号，例如 4.0.9；如需自动取最新可传 +")
	}

	// 校验声明参数（@your 占位，需使用方提供）
	for _, p := range spec.Params {
		if strings.TrimSpace(params[p.Key]) == "" {
			result.Missing = append(result.Missing, fmt.Sprintf("缺少参数 %s（%s），需由使用方提供", p.Key, p.Description))
		}
	}
	// 校验资产源文件
	for _, asset := range spec.AssetFiles {
		src := strings.TrimSpace(params[asset.SourceParamKey])
		if src == "" {
			result.Missing = append(result.Missing, fmt.Sprintf("缺少参数 %s，请提供 %s 源文件路径", asset.SourceParamKey, asset.DestRelPath))
			continue
		}
		if _, err := os.Stat(src); err != nil {
			result.Missing = append(result.Missing, fmt.Sprintf("%s 文件不存在: %s", asset.SourceParamKey, src))
		}
	}

	if len(result.Missing) > 0 {
		result.Satisfied = false
		result.NextSteps = append(result.NextSteps, "补齐 androidVersion 和 @your 占位参数后重新调用 unity feature=channel_config")
		return result
	}

	pluginsDir := filepath.Join(workspacePath, "Assets", "Plugins", "Android")
	if err := os.MkdirAll(pluginsDir, 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 Unity Android 插件目录失败: %v", err))
		result.Satisfied = false
		return result
	}

	applyUnityChannelConfig(workspacePath, pluginsDir, slug, spec, androidVersion, params, &result)

	result.Satisfied = len(result.Missing) == 0
	if result.Satisfied {
		result.NextSteps = append(result.NextSteps, "在 Unity 中重新构建 Android，确认 Gradle Resolve 和打包通过")
		if len(spec.InitParams) > 0 {
			result.NextSteps = append(result.NextSteps, "按 instructions 中的 InitThirdSdk 示例完成三方渠道初始化")
		}
	} else {
		result.NextSteps = append(result.NextSteps, "修复缺失项后重新调用 unity feature=channel_config")
	}
	return result
}

func unityChannelAndroidVersion(slug, androidVersion string) string {
	version := strings.TrimSpace(androidVersion)
	spec, ok := unityChannelSpecs[slug]
	if !ok || spec.AndroidMinVersion == "" {
		return version
	}
	if version == "" || version == "+" || compareVersion(cleanVersion(version), spec.AndroidMinVersion) < 0 {
		return spec.AndroidMinVersion
	}
	return version
}

func applyUnityChannelConfig(workspacePath, pluginsDir, slug string, spec unityChannelSpec, androidVersion string, params map[string]string, result *PassportPreflightResult) {
	togglesNeeded := map[string]bool{}
	mainDependencyPath := filepath.Join(pluginsDir, "mainTemplate.gradle")
	launcherDependencyPath := filepath.Join(pluginsDir, "launcherTemplate.gradle")

	// 1. 依赖
	if len(spec.RuixueLibs) > 0 || len(spec.FixedLibs) > 0 {
		target := spec.DependencyTarget
		if target == "launcher" {
			removeUnityChannelDependencies(mainDependencyPath, result)
			upsertUnityChannelDependencies(launcherDependencyPath, defaultUnityLauncherTemplate(), slug, spec.RuixueLibs, spec.FixedLibs, androidVersion, result)
			togglesNeeded["useCustomLauncherGradleManifest"] = true
		} else {
			removeUnityChannelDependencies(launcherDependencyPath, result)
			upsertUnityChannelDependencies(mainDependencyPath, defaultUnityAndroidMainTemplate(), slug, spec.RuixueLibs, spec.FixedLibs, androidVersion, result)
			togglesNeeded["useCustomMainGradleTemplate"] = true
		}
	} else {
		removeUnityChannelDependencies(mainDependencyPath, result)
		removeUnityChannelDependencies(launcherDependencyPath, result)
	}

	// 2. launcherTemplate.gradle defaultConfig（resValue / manifestPlaceholders）
	if len(spec.LauncherResValues) > 0 || len(spec.LauncherManifestPlaceholders) > 0 || len(spec.LauncherDefaultConfigLines) > 0 {
		path := filepath.Join(pluginsDir, "launcherTemplate.gradle")
		resValues := substituteKeyValues(spec.LauncherResValues, params, result)
		placeholders := substituteKeyValues(spec.LauncherManifestPlaceholders, params, result)
		upsertUnityChannelLauncherDefaultConfig(path, slug, resValues, placeholders, spec.LauncherDefaultConfigLines, result)
		togglesNeeded["useCustomLauncherGradleManifest"] = true
	}

	// 3. AndroidManifest.xml <application>
	if len(spec.ManifestMeta) > 0 || len(spec.ManifestSnippets) > 0 {
		path := filepath.Join(pluginsDir, "AndroidManifest.xml")
		meta := substituteKeyValues(spec.ManifestMeta, params, result)
		snippets := make([]string, 0, len(spec.ManifestSnippets))
		for _, snippet := range spec.ManifestSnippets {
			snippets = append(snippets, substituteUnityChannelParams(snippet, params, result))
		}
		upsertUnityChannelManifest(path, slug, meta, snippets, result)
		togglesNeeded["useCustomMainManifest"] = true
	}

	// 4. settingsTemplate.gradle 仓库
	path := filepath.Join(pluginsDir, "settingsTemplate.gradle")
	settingsRepos := append([]string{}, unityRuixueMavenRepositories...)
	settingsRepos = append(settingsRepos, spec.SettingsMavenRepos...)
	upsertUnityChannelSettingsRepos(path, settingsRepos, result)
	togglesNeeded["useCustomGradleSettingsTemplate"] = true

	// 5. proguard-user.txt
	if len(spec.ProguardRules) > 0 {
		path := filepath.Join(pluginsDir, "proguard-user.txt")
		upsertUnityChannelProguard(path, slug, spec.ProguardRules, result)
		togglesNeeded["useCustomProguardFile"] = true
	}

	// 6. 资产文件复制
	for _, asset := range spec.AssetFiles {
		src := strings.TrimSpace(params[asset.SourceParamKey])
		dst := filepath.Join(pluginsDir, filepath.FromSlash(asset.DestRelPath))
		copyUnityFileIfChanged(src, dst, result)
	}

	// 7. iOS Xcode 设置资产
	for _, iosAsset := range spec.IOSAssets {
		assetPath := filepath.Join(workspacePath, filepath.FromSlash(iosAsset.AssetRelPath))
		if _, err := os.Stat(assetPath); err != nil {
			result.Warnings = append(result.Warnings, fmt.Sprintf("未找到 iOS 设置资产 %s，已跳过；请确认已导入对应渠道 UPM 包", iosAsset.AssetRelPath))
			continue
		}
		fields := map[string]string{}
		for _, kv := range iosAsset.Fields {
			fields[kv.Key] = substituteUnityChannelParams(kv.Value, params, result)
		}
		updateUnityAssetFields(assetPath, fields, result)
	}

	// 8. ProjectSettings 自定义模板开关
	if len(togglesNeeded) > 0 {
		toggleUnityChannelProjectSettings(workspacePath, togglesNeeded, result)
	}
}

// ==================== 写入辅助 ====================

func upsertUnityChannelDependencies(path, defaultContent, slug string, ruixueLibs, fixedLibs []string, androidVersion string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := defaultContent
	if err == nil {
		content = string(contentBytes)
	}
	contentWithoutChannelDependencies := removeUnityChannelDependencyBlocks(content)

	begin := fmt.Sprintf("// ========== RuiXue %s Dependencies BEGIN ==========", slug)
	end := fmt.Sprintf("// ========== RuiXue %s Dependencies END ==========", slug)
	var b strings.Builder
	b.WriteString("    " + begin + "\n")
	for _, lib := range ruixueLibs {
		b.WriteString(fmt.Sprintf("    implementation \"com.ruixue:%s:%s\"\n", lib, androidVersion))
	}
	for _, lib := range fixedLibs {
		b.WriteString(fmt.Sprintf("    implementation '%s'\n", lib))
	}
	b.WriteString("    " + end)

	anchor := regexp.MustCompile(`(?s)dependencies\s*\{\s*\n`)
	updated, ok := upsertUnityManagedBlock(contentWithoutChannelDependencies, begin, end, b.String(), anchor)
	if !ok {
		result.Missing = append(result.Missing, fmt.Sprintf("%s 中未找到 dependencies 块，无法自动添加渠道依赖", filepath.Base(path)))
		return
	}
	writeUnityChannelFile(path, content, updated, err == nil, fmt.Sprintf("updated %s dependencies", slug), result)
}

func removeUnityChannelDependencies(path string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		return
	}
	content := string(contentBytes)
	updated := removeUnityChannelDependencyBlocks(content)
	if updated == content {
		return
	}
	writeUnityChannelFile(path, content, updated, true, "removed previous channel dependencies", result)
}

func removeUnityChannelDependencyBlocks(content string) string {
	blockRe := regexp.MustCompile(`(?s)\s*// ========== RuiXue [a-z0-9_]+ Dependencies BEGIN ==========.*?// ========== RuiXue [a-z0-9_]+ Dependencies END ==========`)
	return blockRe.ReplaceAllString(content, "")
}

func upsertUnityChannelLauncherDefaultConfig(path, slug string, resValues, placeholders []unityChannelKeyValue, lines []string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := defaultUnityLauncherTemplate()
	if err == nil {
		content = string(contentBytes)
	}

	begin := fmt.Sprintf("// ========== RuiXue %s Launcher BEGIN ==========", slug)
	end := fmt.Sprintf("// ========== RuiXue %s Launcher END ==========", slug)
	var b strings.Builder
	b.WriteString("        " + begin + "\n")
	for _, kv := range resValues {
		b.WriteString(fmt.Sprintf("        resValue \"string\", \"%s\", \"%s\"\n", kv.Key, kv.Value))
	}
	for _, line := range lines {
		b.WriteString("        " + line + "\n")
	}
	if len(placeholders) > 0 {
		b.WriteString("        manifestPlaceholders = [\n")
		for i, kv := range placeholders {
			comma := ","
			if i == len(placeholders)-1 {
				comma = ""
			}
			b.WriteString(fmt.Sprintf("            %s : \"%s\"%s\n", kv.Key, kv.Value, comma))
		}
		b.WriteString("        ]\n")
	}
	b.WriteString("        " + end)

	anchor := regexp.MustCompile(`(?s)defaultConfig\s*\{\s*\n`)
	updated, ok := upsertUnityManagedBlock(content, begin, end, b.String(), anchor)
	if !ok {
		result.Missing = append(result.Missing, "launcherTemplate.gradle 中未找到 defaultConfig 块，无法自动添加 resValue/manifestPlaceholders")
		return
	}
	writeUnityChannelFile(path, content, updated, err == nil, fmt.Sprintf("updated %s launcher defaultConfig", slug), result)
}

func upsertUnityChannelManifest(path, slug string, meta []unityChannelKeyValue, snippets []string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := defaultUnityAndroidManifest()
	if err == nil {
		content = string(contentBytes)
	}

	begin := fmt.Sprintf("<!-- RuiXue %s Manifest BEGIN -->", slug)
	end := fmt.Sprintf("<!-- RuiXue %s Manifest END -->", slug)
	var b strings.Builder
	b.WriteString("        " + begin + "\n")
	for _, kv := range meta {
		b.WriteString(fmt.Sprintf("        <meta-data android:name=\"%s\" android:value=\"%s\" />\n", kv.Key, kv.Value))
	}
	for _, snippet := range snippets {
		b.WriteString(snippet)
		if !strings.HasSuffix(snippet, "\n") {
			b.WriteString("\n")
		}
	}
	b.WriteString("        " + end)

	anchor := regexp.MustCompile(`(?m)<application\b[^>]*>[ \t]*\n?`)
	updated, ok := upsertUnityManagedBlock(content, begin, end, b.String(), anchor)
	if !ok {
		result.Missing = append(result.Missing, "AndroidManifest.xml 中未找到 application 标签，无法自动添加渠道配置")
		return
	}
	writeUnityChannelFile(path, content, updated, err == nil, fmt.Sprintf("updated %s manifest", slug), result)
}

func upsertUnityChannelSettingsRepos(path string, repos []string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := defaultUnitySettingsTemplate()
	if err == nil {
		content = string(contentBytes)
	}

	anchor := regexp.MustCompile(`(?s)repositories\s*\{\s*\n`)
	matches := anchor.FindAllStringIndex(content, -1)
	if len(matches) == 0 {
		result.Missing = append(result.Missing, "settingsTemplate.gradle 中未找到 repositories 块，无法自动添加渠道 Maven 仓库")
		return
	}

	var toInsert []string
	for _, repo := range repos {
		if unitySettingsRepoExists(content, repo) {
			continue
		}
		toInsert = append(toInsert, repo)
	}
	if len(toInsert) == 0 {
		return
	}

	block := indentUnityBlock(strings.Join(toInsert, "\n"), "        ") + "\n"
	var builder strings.Builder
	last := 0
	for _, loc := range matches {
		builder.WriteString(content[last:loc[1]])
		builder.WriteString(block)
		last = loc[1]
	}
	builder.WriteString(content[last:])
	writeUnityChannelFile(path, content, builder.String(), err == nil, "added settings maven repositories", result)
}

func upsertUnityRuixueMavenRepositories(path string, result *PassportPreflightResult) {
	upsertUnityChannelSettingsRepos(path, unityRuixueMavenRepositories, result)
}

func unitySettingsRepoExists(content, repo string) bool {
	repo = strings.TrimSpace(repo)
	switch repo {
	case "google()":
		return regexp.MustCompile(`(?m)^\s*google\(\)\s*$`).MatchString(content)
	case "mavenCentral()":
		return regexp.MustCompile(`(?m)^\s*mavenCentral\(\)\s*$`).MatchString(content)
	}
	if urlMatch := regexp.MustCompile(`url\s+['"]([^'"]+)['"]`).FindStringSubmatch(repo); len(urlMatch) == 2 {
		return strings.Contains(content, urlMatch[1])
	}
	return strings.Contains(content, repo)
}

func upsertUnityChannelProguard(path, slug string, rules []string, result *PassportPreflightResult) {
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
	writeUnityChannelFile(path, content, updated, err == nil, fmt.Sprintf("added %s proguard rules", slug), result)
}

func toggleUnityChannelProjectSettings(workspacePath string, toggles map[string]bool, result *PassportPreflightResult) {
	path := filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset")
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Warnings = append(result.Warnings, "未找到 ProjectSettings/ProjectSettings.asset，已写入模板文件；请在 Unity Player Settings 中确认对应 Custom Template 开关已勾选")
		return
	}
	content := string(contentBytes)
	updated := content
	keys := make([]string, 0, len(toggles))
	for key := range toggles {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		updated = replaceUnityProjectSetting(updated, key)
	}
	if updated == content {
		result.Warnings = append(result.Warnings, "ProjectSettings.asset 中未找到可更新的自定义模板开关，请在 Unity Player Settings 中手动确认")
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 ProjectSettings.asset 失败: %v", err))
		return
	}
	result.Modified = append(result.Modified, path+": enabled custom templates")
}

// ==================== 通用工具 ====================

func upsertUnityManagedBlock(content, begin, end, block string, anchor *regexp.Regexp) (string, bool) {
	removeRe := regexp.MustCompile(`(?s)\s*` + regexp.QuoteMeta(begin) + `.*?` + regexp.QuoteMeta(end))
	content = removeRe.ReplaceAllString(content, "")
	loc := anchor.FindStringIndex(content)
	if loc == nil {
		return content, false
	}
	return content[:loc[1]] + block + "\n" + content[loc[1]:], true
}

func writeUnityChannelFile(path, original, updated string, existed bool, modifiedNote string, result *PassportPreflightResult) {
	if updated == original && existed {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建 %s 失败: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", path, err))
		return
	}
	result.Modified = append(result.Modified, path+": "+modifiedNote)
}

func substituteKeyValues(items []unityChannelKeyValue, params map[string]string, result *PassportPreflightResult) []unityChannelKeyValue {
	out := make([]unityChannelKeyValue, 0, len(items))
	for _, kv := range items {
		out = append(out, unityChannelKeyValue{Key: kv.Key, Value: substituteUnityChannelParams(kv.Value, params, result)})
	}
	return out
}

func substituteUnityChannelParams(s string, params map[string]string, result *PassportPreflightResult) string {
	return unityChannelPlaceholderRe.ReplaceAllStringFunc(s, func(token string) string {
		key := unityChannelPlaceholderRe.FindStringSubmatch(token)[1]
		value, ok := params[key]
		if !ok || strings.TrimSpace(value) == "" {
			result.Missing = appendUnique(result.Missing, fmt.Sprintf("缺少参数 %s，需由使用方提供", key))
			return token
		}
		return value
	})
}

func indentUnityBlock(block, indent string) string {
	lines := strings.Split(block, "\n")
	for i, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}
		lines[i] = indent + line
	}
	return strings.Join(lines, "\n")
}

func appendUnique(list []string, value string) []string {
	for _, item := range list {
		if item == value {
			return list
		}
	}
	return append(list, value)
}

func unityChannelSlugs() []string {
	slugs := make([]string, 0, len(unityChannelSpecs))
	for slug := range unityChannelSpecs {
		slugs = append(slugs, slug)
	}
	sort.Strings(slugs)
	return slugs
}

func defaultSlugHint(slug string) string {
	if slug != "" {
		return slug
	}
	return "<channel>"
}

func unityChannelConfigInstructions(slug, androidVersion string, params map[string]string, preflight PassportPreflightResult) string {
	spec, ok := unityChannelSpecs[slug]
	if !ok {
		return fmt.Sprintf("# 瑞雪 SDK Unity 三方渠道配置\n\n不支持的渠道: %s\n可选渠道: %s\n", slug, strings.Join(unityChannelSlugs(), ", "))
	}

	var b strings.Builder
	fmt.Fprintf(&b, "# 瑞雪 SDK Unity 三方渠道配置：%s\n\n", spec.DisplayName)
	fmt.Fprintf(&b, "thirdChannel: %s\n", slug)
	fmt.Fprintf(&b, "androidVersion: %s\n\n", androidVersion)

	if len(spec.Params) > 0 {
		b.WriteString("需使用方提供的参数(@your):\n")
		for _, p := range spec.Params {
			fmt.Fprintf(&b, "  - %s: %s\n", p.Key, p.Description)
		}
		b.WriteString("\n")
	}
	if len(spec.AssetFiles) > 0 {
		b.WriteString("需提供源文件路径的参数:\n")
		for _, a := range spec.AssetFiles {
			fmt.Fprintf(&b, "  - %s -> Assets/Plugins/Android/%s\n", a.SourceParamKey, a.DestRelPath)
		}
		b.WriteString("\n")
	}
	if len(spec.InitParams) > 0 {
		b.WriteString("InitThirdSdk 初始化参数示例:\n")
		b.WriteString("```csharp\nDictionary<string, object> map = new();\n")
		for _, kv := range spec.InitParams {
			value := substituteUnityChannelParams(kv.Value, params, &PassportPreflightResult{})
			fmt.Fprintf(&b, "map.Add(\"%s\", \"%s\");\n", kv.Key, value)
		}
		b.WriteString("RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);\n```\n\n")
	}
	for _, note := range spec.Notes {
		fmt.Fprintf(&b, "注意: %s\n", note)
	}

	fmt.Fprintf(&b, "\npreflight:\n  checked: %t\n  satisfied: %t\n", preflight.Checked, preflight.Satisfied)
	fmt.Fprintf(&b, "  missing: %v\n  modified: %v\n  warnings: %v\n  nextSteps: %v\n",
		preflight.Missing, preflight.Modified, preflight.Warnings, preflight.NextSteps)
	return b.String()
}
