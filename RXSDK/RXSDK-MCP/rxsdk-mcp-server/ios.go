package rxsdk

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// findXcodeprojTarget 从工作目录中查找 .xcodeproj 文件并提取 target 名称
func findXcodeprojTarget(workspacePath string) string {
	if workspacePath == "" {
		return ""
	}

	entries, err := os.ReadDir(workspacePath)
	if err != nil {
		return ""
	}

	for _, entry := range entries {
		name := entry.Name()
		if strings.HasSuffix(name, ".xcodeproj") {
			// 去掉 .xcodeproj 后缀得到 target 名称
			return strings.TrimSuffix(name, ".xcodeproj")
		}
	}

	return ""
}

// ==================== iOS 基础配置检查 ====================

// checkIOSBaseLibrary 检查是否已接入瑞雪基础库（Podfile 中包含 RXSDK）
// 返回: (是否已接入, 错误提示信息)
func checkIOSBaseLibrary(workspacePath string) (bool, string) {
	if workspacePath == "" {
		return false, `❌ 【错误：缺少 workspacePath 参数】

请提供 iOS 项目路径，用于检查和配置工程。

【调用示例】
ios feature=xxx workspacePath=/path/to/your/project`
	}

	// 检查 Podfile 是否存在
	podfilePath := filepath.Join(workspacePath, "Podfile")
	podfileContent, err := os.ReadFile(podfilePath)
	if err != nil {
		return false, `❌ 【未接入瑞雪基础库】

检测到项目中没有 Podfile 文件，需要先接入瑞雪 SDK 基础库。

【你需要执行的操作】
1. 先调用 ios feature=setup 配置基础库依赖
2. 执行 pod install 安装依赖
3. 然后再接入组件库

【调用示例】
ios feature=setup workspacePath=` + workspacePath + ` region=domestic`
	}

	// 检查 Podfile 是否包含 RXSDK
	if !strings.Contains(string(podfileContent), "RXSDK") {
		return false, `❌ 【未接入瑞雪基础库】

检测到 Podfile 中未包含 RXSDK 依赖，需要先接入瑞雪 SDK 基础库。

【你需要执行的操作】
1. 先调用 ios feature=setup 配置基础库依赖
2. 执行 pod install 安装依赖
3. 然后再接入组件库

【调用示例】
ios feature=setup workspacePath=` + workspacePath + ` region=domestic`
	}

	return true, ""
}

// checkIOSBaseConfig 检查 iOS 项目是否完成了基础配置
// 返回缺失的配置项列表
func checkIOSBaseConfig(workspacePath string) []string {
	var missing []string

	if workspacePath == "" {
		return missing
	}

	// 1. 检查 Podfile 是否存在且包含 RXSDK
	podfilePath := filepath.Join(workspacePath, "Podfile")
	podfileContent, err := os.ReadFile(podfilePath)
	if err != nil {
		missing = append(missing, "Pod 依赖配置：Podfile 不存在，请先调用 ios feature=setup 创建")
	} else if !strings.Contains(string(podfileContent), "RXSDK") {
		missing = append(missing, "Pod 依赖配置：Podfile 中未包含 RXSDK 依赖，请先调用 ios feature=setup 配置")
	}

	// 2. 检查是否执行了 pod install（检查 .xcworkspace 或 Pods 目录）
	podsDir := filepath.Join(workspacePath, "Pods")
	if _, err := os.Stat(podsDir); os.IsNotExist(err) {
		// 检查是否有 .xcworkspace
		hasWorkspace := false
		entries, _ := os.ReadDir(workspacePath)
		for _, entry := range entries {
			if strings.HasSuffix(entry.Name(), ".xcworkspace") {
				hasWorkspace = true
				break
			}
		}
		if !hasWorkspace {
			missing = append(missing, "Pod 安装：未执行 pod install，请在项目目录执行 pod install 命令")
		}
	}

	// 3. 查找 AppDelegate.m 文件
	appDelegatePath := findAppDelegatePath(workspacePath)
	if appDelegatePath == "" {
		// 如果找不到 AppDelegate，可能是 SwiftUI 项目或其他结构，跳过代码检查
		return missing
	}

	appDelegateContent, err := os.ReadFile(appDelegatePath)
	if err != nil {
		return missing
	}
	content := string(appDelegateContent)

	// 4. 检查是否有 SDK 初始化代码
	if !strings.Contains(content, "RX initWithAppId") && !strings.Contains(content, "[RX initWithAppId") {
		missing = append(missing, "SDK 初始化：AppDelegate 中未找到 [RX initWithAppId:] 初始化代码")
	}

	// 5. 检查是否有 openURL 回调
	if !strings.Contains(content, "openURL:") || !strings.Contains(content, "RX handleOpenURL") {
		missing = append(missing, "URL Scheme 回调：AppDelegate 中未实现 application:openURL:options: 方法或未调用 [RX handleOpenURL:]")
	}

	// 6. 检查是否有 Universal Link 回调
	if !strings.Contains(content, "continueUserActivity:") || !strings.Contains(content, "RX handleUniversalLink") {
		missing = append(missing, "Universal Link 回调：AppDelegate 中未实现 application:continueUserActivity:restorationHandler: 方法或未调用 [RX handleUniversalLink:]")
	}

	return missing
}

// findAppDelegatePath 查找 AppDelegate.m 文件路径
func findAppDelegatePath(workspacePath string) string {
	// 常见路径模式
	patterns := []string{
		"AppDelegate.m",
		"*/AppDelegate.m",
		"*/*/AppDelegate.m",
	}

	for _, pattern := range patterns {
		matches, _ := filepath.Glob(filepath.Join(workspacePath, pattern))
		for _, match := range matches {
			// 排除 Pods 目录
			if !strings.Contains(match, "/Pods/") {
				return match
			}
		}
	}

	return ""
}

// ==================== iOS 自动配置辅助函数 ====================

// findInfoPlistPath 查找 Info.plist 文件路径
func findInfoPlistPath(workspacePath, targetName string) string {
	// 1. 优先查找 targetName/Info.plist
	if targetName != "" {
		path := filepath.Join(workspacePath, targetName, "Info.plist")
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}

	// 2. 查找根目录下的 Info.plist
	path := filepath.Join(workspacePath, "Info.plist")
	if _, err := os.Stat(path); err == nil {
		return path
	}

	// 3. 递归查找 Info.plist（只查找一层子目录）
	entries, err := os.ReadDir(workspacePath)
	if err != nil {
		return ""
	}

	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") && entry.Name() != "Pods" {
			path := filepath.Join(workspacePath, entry.Name(), "Info.plist")
			if _, err := os.Stat(path); err == nil {
				return path
			}
		}
	}

	// 4. 查找两层子目录（项目名/项目名/Info.plist 的情况）
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") && entry.Name() != "Pods" {
			subEntries, err := os.ReadDir(filepath.Join(workspacePath, entry.Name()))
			if err != nil {
				continue
			}
			for _, subEntry := range subEntries {
				if subEntry.IsDir() && !strings.HasPrefix(subEntry.Name(), ".") {
					path := filepath.Join(workspacePath, entry.Name(), subEntry.Name(), "Info.plist")
					if _, err := os.Stat(path); err == nil {
						return path
					}
				}
			}
		}
	}

	return ""
}

func resolveLBSInfoPlistPath(workspacePath, targetName string) (string, error) {
	var candidates []string
	addCandidate := func(path string) {
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			candidates = append(candidates, path)
		}
	}
	addCandidate(filepath.Join(workspacePath, "Info.plist"))

	entries, err := os.ReadDir(workspacePath)
	if err != nil {
		return "", fmt.Errorf("读取工程目录失败: %v", err)
	}
	for _, entry := range entries {
		if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") || entry.Name() == "Pods" {
			continue
		}
		firstLevel := filepath.Join(workspacePath, entry.Name())
		addCandidate(filepath.Join(firstLevel, "Info.plist"))
		subEntries, err := os.ReadDir(firstLevel)
		if err != nil {
			continue
		}
		for _, subEntry := range subEntries {
			if subEntry.IsDir() && !strings.HasPrefix(subEntry.Name(), ".") && subEntry.Name() != "Pods" {
				addCandidate(filepath.Join(firstLevel, subEntry.Name(), "Info.plist"))
			}
		}
	}

	if targetName != "" {
		allCandidates := candidates
		filtered := candidates[:0]
		for _, candidate := range candidates {
			relative, err := filepath.Rel(workspacePath, candidate)
			if err != nil {
				continue
			}
			for _, segment := range strings.Split(relative, string(filepath.Separator)) {
				if segment == targetName {
					filtered = append(filtered, candidate)
					break
				}
			}
		}
		if len(filtered) == 0 && len(allCandidates) == 1 &&
			allCandidates[0] == filepath.Join(workspacePath, "Info.plist") {
			candidates = allCandidates
		} else {
			candidates = filtered
		}
	}

	switch len(candidates) {
	case 0:
		if targetName != "" {
			return "", fmt.Errorf("未找到 Target %s 对应的 Info.plist", targetName)
		}
		return "", fmt.Errorf("未找到 Info.plist")
	case 1:
		return candidates[0], nil
	default:
		return "", fmt.Errorf("发现多个 Info.plist，请通过 targetName 指定目标 Target: %s", strings.Join(candidates, ", "))
	}
}

// createEntitlementsFile 创建 .entitlements 文件（包含 Associated Domains + Sign in with Apple，配置方式参考 Associated Domains）
func createEntitlementsFile(entitlementsPath, domain string) error {
	content := `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:` + domain + `</string>
    </array>
</dict>
</plist>`

	// 确保目录存在
	dir := filepath.Dir(entitlementsPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("创建目录失败: %v", err)
	}

	return os.WriteFile(entitlementsPath, []byte(content), 0644)
}

// addDomainToEntitlements 向 entitlements 文件添加 Associated Domain（支持已存在的文件）
func addDomainToEntitlements(entitlementsPath, domain string) (bool, error) {
	// 检查文件是否存在
	content, err := os.ReadFile(entitlementsPath)
	if err != nil {
		if os.IsNotExist(err) {
			// 文件不存在，创建新文件
			if err := createEntitlementsFile(entitlementsPath, domain); err != nil {
				return false, err
			}
			return true, nil
		}
		return false, fmt.Errorf("读取 entitlements 文件失败: %v", err)
	}

	plistContent := string(content)
	applinksEntry := "applinks:" + domain

	// 检查是否已包含该域名
	if strings.Contains(plistContent, applinksEntry) {
		return false, nil // 已存在，无需添加
	}

	// 检查是否有 associated-domains 配置
	if strings.Contains(plistContent, "com.apple.developer.associated-domains") {
		// 已有配置，在 <array> 后添加新的域名
		arrayIndex := strings.Index(plistContent, "com.apple.developer.associated-domains")
		if arrayIndex == -1 {
			return false, fmt.Errorf("无法定位 associated-domains")
		}

		afterKey := plistContent[arrayIndex:]
		arrayStartIndex := strings.Index(afterKey, "<array>")
		if arrayStartIndex == -1 {
			return false, fmt.Errorf("associated-domains 格式错误: 未找到 <array>")
		}

		// 计算在原字符串中的绝对位置
		insertPos := arrayIndex + arrayStartIndex + len("<array>")
		newEntry := "\n        <string>" + applinksEntry + "</string>"
		plistContent = plistContent[:insertPos] + newEntry + plistContent[insertPos:]
	} else {
		// 没有 associated-domains 配置，在 </dict> 前添加
		lastDictIndex := strings.LastIndex(plistContent, "</dict>")
		if lastDictIndex == -1 {
			return false, fmt.Errorf("entitlements 格式错误: 未找到 </dict>")
		}

		newConfig := `    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>` + applinksEntry + `</string>
    </array>
`
		plistContent = plistContent[:lastDictIndex] + newConfig + plistContent[lastDictIndex:]
	}

	if err := os.WriteFile(entitlementsPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 entitlements 文件失败: %v", err)
	}

	return true, nil
}

// addSignInWithAppleToEntitlements 向 entitlements 文件添加 Sign in with Apple（配置方式参考 Associated Domains，与 Associated Domains 同文件）
func addSignInWithAppleToEntitlements(entitlementsPath string) (bool, error) {
	content, err := os.ReadFile(entitlementsPath)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(filepath.Dir(entitlementsPath), 0755); err != nil {
				return false, fmt.Errorf("创建 entitlements 目录失败: %v", err)
			}
			content := `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
</dict>
</plist>
`
			if err := atomicWriteFile(entitlementsPath, []byte(content)); err != nil {
				return false, fmt.Errorf("创建 entitlements 文件失败: %v", err)
			}
			return true, nil
		}
		return false, fmt.Errorf("读取 entitlements 文件失败: %v", err)
	}

	plistContent := string(content)
	if strings.Contains(plistContent, "com.apple.developer.applesignin") {
		applePattern := regexp.MustCompile(`(?s)<key>com\.apple\.developer\.applesignin</key>\s*<array>.*?<string>Default</string>.*?</array>`)
		if !applePattern.MatchString(plistContent) {
			return false, fmt.Errorf("Sign in with Apple entitlement 格式错误，必须为包含 Default 的 array")
		}
		return false, nil
	}

	// 在 </dict> 前添加 Sign in with Apple 配置
	lastDictIndex := strings.LastIndex(plistContent, "</dict>")
	if lastDictIndex == -1 {
		return false, fmt.Errorf("entitlements 格式错误: 未找到 </dict>")
	}

	newConfig := `    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
`
	plistContent = plistContent[:lastDictIndex] + newConfig + plistContent[lastDictIndex:]

	if err := atomicWriteFile(entitlementsPath, []byte(plistContent)); err != nil {
		return false, fmt.Errorf("写入 entitlements 文件失败: %v", err)
	}

	return true, nil
}

// addGIDClientIDToInfoPlist 向 Info.plist 添加 GIDClientID
func addGIDClientIDToInfoPlist(plistPath, clientID string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	plistContent := string(content)

	// 检查是否已存在 GIDClientID
	if strings.Contains(plistContent, "GIDClientID") {
		return false, nil // 已存在，无需添加
	}

	// 在第一个 <dict> 后添加
	gidContent := `<dict>
	<key>GIDClientID</key>
	<string>` + clientID + `</string>`

	plistContent = strings.Replace(plistContent, "<dict>", gidContent, 1)

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addTikTokAppIDToInfoPlist 向 Info.plist 添加 TikTokAppID
func addTikTokAppIDToInfoPlist(plistPath, appID string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	plistContent := string(content)

	if strings.Contains(plistContent, "TikTokAppID") {
		return false, nil
	}

	ttConfig := `<dict>
	<key>TikTokAppID</key>
	<string>` + appID + `</string>`

	plistContent = strings.Replace(plistContent, "<dict>", ttConfig, 1)

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addLineSDKConfigToInfoPlist 向 Info.plist 添加 LineSDKConfig（Dictionary 含 ChannelID）
func addLineSDKConfigToInfoPlist(plistPath, channelID string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	plistContent := string(content)

	// 检查是否已存在 LineSDKConfig
	if strings.Contains(plistContent, "LineSDKConfig") {
		return false, nil // 已存在，无需添加
	}

	// 在第一个 <dict> 后添加 LineSDKConfig Dictionary
	lineConfig := `<dict>
	<key>LineSDKConfig</key>
	<dict>
		<key>ChannelID</key>
		<string>` + channelID + `</string>
	</dict>`

	plistContent = strings.Replace(plistContent, "<dict>", lineConfig, 1)

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addFacebookConfigToInfoPlist 向 Info.plist 添加 FacebookAppID 和 FacebookClientToken
func addFacebookConfigToInfoPlist(plistPath, appID, clientToken string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	plistContent := string(content)
	modified := false

	// 添加 FacebookAppID
	if !strings.Contains(plistContent, "FacebookAppID") {
		fbConfig := `<dict>
	<key>FacebookAppID</key>
	<string>` + appID + `</string>`
		plistContent = strings.Replace(plistContent, "<dict>", fbConfig, 1)
		modified = true
	}

	// 添加 FacebookClientToken
	if !strings.Contains(plistContent, "FacebookClientToken") {
		// 在 FacebookAppID 后面添加，如果 FacebookAppID 存在
		if strings.Contains(plistContent, "FacebookAppID") {
			// 找到 FacebookAppID 的 </string> 结束标签后添加
			fbAppIDIndex := strings.Index(plistContent, "FacebookAppID")
			if fbAppIDIndex != -1 {
				afterFBAppID := plistContent[fbAppIDIndex:]
				// 找到 FacebookAppID 值的 </string>
				stringEndIndex := strings.Index(afterFBAppID, "</string>")
				if stringEndIndex != -1 {
					insertPos := fbAppIDIndex + stringEndIndex + len("</string>")
					tokenConfig := "\n\t<key>FacebookClientToken</key>\n\t<string>" + clientToken + "</string>"
					plistContent = plistContent[:insertPos] + tokenConfig + plistContent[insertPos:]
					modified = true
				}
			}
		} else {
			// 在第一个 <dict> 后添加
			fbConfig := `<dict>
	<key>FacebookClientToken</key>
	<string>` + clientToken + `</string>`
			plistContent = strings.Replace(plistContent, "<dict>", fbConfig, 1)
			modified = true
		}
	}

	if !modified {
		return false, nil
	}

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addGameCenterToEntitlements 向 entitlements 文件添加 Game Center 配置
func addGameCenterToEntitlements(entitlementsPath string) (bool, error) {
	content, err := os.ReadFile(entitlementsPath)
	if err != nil {
		if os.IsNotExist(err) {
			// 文件不存在，创建包含 Game Center 的新文件
			gcContent := `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.game-center</key>
    <true/>
</dict>
</plist>`
			dir := filepath.Dir(entitlementsPath)
			if err := os.MkdirAll(dir, 0755); err != nil {
				return false, fmt.Errorf("创建目录失败: %v", err)
			}
			if err := os.WriteFile(entitlementsPath, []byte(gcContent), 0644); err != nil {
				return false, fmt.Errorf("写入 entitlements 文件失败: %v", err)
			}
			return true, nil
		}
		return false, fmt.Errorf("读取 entitlements 文件失败: %v", err)
	}

	plistContent := string(content)
	if strings.Contains(plistContent, "com.apple.developer.game-center") {
		return false, nil // 已存在，无需添加
	}

	// 在 </dict> 前添加 Game Center 配置
	lastDictIndex := strings.LastIndex(plistContent, "</dict>")
	if lastDictIndex == -1 {
		return false, fmt.Errorf("entitlements 格式错误: 未找到 </dict>")
	}

	newConfig := `    <key>com.apple.developer.game-center</key>
    <true/>
`
	plistContent = plistContent[:lastDictIndex] + newConfig + plistContent[lastDictIndex:]

	if err := os.WriteFile(entitlementsPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 entitlements 文件失败: %v", err)
	}

	return true, nil
}

// addURLTypesToInfoPlist 向 Info.plist 添加 URL Types
func addURLTypesToInfoPlist(plistPath, appKey string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	originalContent := string(content)
	plistContent := originalContent

	// 检查是否已包含该 appKey 的 URL Scheme
	if strings.Contains(plistContent, "<string>"+appKey+"</string>") && strings.Contains(plistContent, "CFBundleURLSchemes") {
		return false, nil // 已存在，无需添加
	}

	// URL Types 配置内容（新增完整配置）
	urlTypesEntry := `	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>` + appKey + `</string>
			</array>
		</dict>
	</array>
`

	// 检查是否已存在 CFBundleURLTypes
	modified := false
	if strings.Contains(plistContent, "CFBundleURLTypes") {
		// 已有 URL Types，在 CFBundleURLTypes 的 <array> 后添加新的 <dict>
		newDictEntry := `
		<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>` + appKey + `</string>
			</array>
		</dict>`

		// 查找 CFBundleURLTypes 后面的 <array> 标签位置
		urlTypesIndex := strings.Index(plistContent, "CFBundleURLTypes")
		if urlTypesIndex == -1 {
			return false, fmt.Errorf("无法定位 CFBundleURLTypes")
		}

		// 从 CFBundleURLTypes 位置开始找 <array>
		afterUrlTypes := plistContent[urlTypesIndex:]
		arrayIndex := strings.Index(afterUrlTypes, "<array>")
		if arrayIndex == -1 {
			return false, fmt.Errorf("CFBundleURLTypes 格式错误: 未找到 <array>")
		}

		// 计算在原字符串中的绝对位置
		insertPos := urlTypesIndex + arrayIndex + len("<array>")
		plistContent = plistContent[:insertPos] + newDictEntry + plistContent[insertPos:]
		modified = true
	} else {
		// 不存在 URL Types，在 </dict></plist> 之前添加
		// 查找 </plist> 前的 </dict>
		plistEndIndex := strings.LastIndex(plistContent, "</plist>")
		if plistEndIndex == -1 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </plist>")
		}

		// 在 </plist> 前面找最近的 </dict>
		beforePlist := plistContent[:plistEndIndex]
		lastDictIndex := strings.LastIndex(beforePlist, "</dict>")
		if lastDictIndex == -1 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </dict>")
		}

		// 在 </dict> 之前插入 URL Types
		plistContent = plistContent[:lastDictIndex] + urlTypesEntry + plistContent[lastDictIndex:]
		modified = true
	}

	// 检查是否真的修改了内容
	if !modified || plistContent == originalContent {
		return false, fmt.Errorf("URL Types 添加失败: 内容未发生变化")
	}

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addLSApplicationQueriesToInfoPlist 向 Info.plist 添加 LSApplicationQueriesSchemes
func addLSApplicationQueriesToInfoPlist(plistPath string, schemes []string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	originalContent := string(content)
	plistContent := originalContent

	// 检查是否所有 scheme 都已存在
	allExist := true
	for _, scheme := range schemes {
		if !strings.Contains(plistContent, "<string>"+scheme+"</string>") {
			allExist = false
			break
		}
	}
	if allExist && strings.Contains(plistContent, "LSApplicationQueriesSchemes") {
		return false, nil // 所有 scheme 都已存在，无需添加
	}

	// 构建 scheme 字符串
	var schemeStrings strings.Builder
	for _, scheme := range schemes {
		schemeStrings.WriteString("\t\t<string>" + scheme + "</string>\n")
	}

	// LSApplicationQueriesSchemes 配置内容
	lsQueriesEntry := `	<key>LSApplicationQueriesSchemes</key>
	<array>
` + schemeStrings.String() + `	</array>
`

	modified := false
	if strings.Contains(plistContent, "LSApplicationQueriesSchemes") {
		// 已有 LSApplicationQueriesSchemes，在其 <array> 后添加新的 scheme
		// 先检查哪些 scheme 需要添加
		var newSchemes []string
		for _, scheme := range schemes {
			if !strings.Contains(plistContent, "<string>"+scheme+"</string>") {
				newSchemes = append(newSchemes, scheme)
			}
		}
		if len(newSchemes) == 0 {
			return false, nil // 无需添加
		}

		// 构建新增的 scheme 字符串
		var newSchemeStrings strings.Builder
		for _, scheme := range newSchemes {
			newSchemeStrings.WriteString("\n\t\t<string>" + scheme + "</string>")
		}

		// 查找 LSApplicationQueriesSchemes 后面的 <array> 标签位置
		lsIndex := strings.Index(plistContent, "LSApplicationQueriesSchemes")
		if lsIndex == -1 {
			return false, fmt.Errorf("无法定位 LSApplicationQueriesSchemes")
		}

		// 从 LSApplicationQueriesSchemes 位置开始找 <array>
		afterLs := plistContent[lsIndex:]
		arrayIndex := strings.Index(afterLs, "<array>")
		if arrayIndex == -1 {
			return false, fmt.Errorf("LSApplicationQueriesSchemes 格式错误: 未找到 <array>")
		}

		// 计算在原字符串中的绝对位置
		insertPos := lsIndex + arrayIndex + len("<array>")
		plistContent = plistContent[:insertPos] + newSchemeStrings.String() + plistContent[insertPos:]
		modified = true
	} else {
		// 不存在 LSApplicationQueriesSchemes，在 </dict></plist> 之前添加
		plistEndIndex := strings.LastIndex(plistContent, "</plist>")
		if plistEndIndex == -1 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </plist>")
		}

		// 在 </plist> 前面找最近的 </dict>
		beforePlist := plistContent[:plistEndIndex]
		lastDictIndex := strings.LastIndex(beforePlist, "</dict>")
		if lastDictIndex == -1 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </dict>")
		}

		// 在 </dict> 之前插入 LSApplicationQueriesSchemes
		plistContent = plistContent[:lastDictIndex] + lsQueriesEntry + plistContent[lastDictIndex:]
		modified = true
	}

	// 检查是否真的修改了内容
	if !modified || plistContent == originalContent {
		return false, nil
	}

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// addLBSLocationConfigToInfoPlist 补齐高德定位权限及后台定位模式。
func addLBSLocationConfigToInfoPlist(plistPath string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	originalContent := string(content)
	plistContent := originalContent
	const usageDescription = "是否允许访问定位权限？"
	var entries strings.Builder
	for _, key := range []string{
		"NSLocationAlwaysUsageDescription",
		"NSLocationAlwaysAndWhenInUseUsageDescription",
		"NSLocationWhenInUseUsageDescription",
	} {
		if !strings.Contains(plistContent, "<key>"+key+"</key>") {
			entries.WriteString("\t<key>" + key + "</key>\n")
			entries.WriteString("\t<string>" + usageDescription + "</string>\n")
		}
	}

	const backgroundModesKey = "<key>UIBackgroundModes</key>"
	if strings.Contains(plistContent, backgroundModesKey) {
		backgroundModesPattern := regexp.MustCompile(`(?s)<key>UIBackgroundModes</key>\s*<array>.*?</array>`)
		backgroundModesEntry := backgroundModesPattern.FindString(plistContent)
		if backgroundModesEntry == "" {
			return false, fmt.Errorf("UIBackgroundModes 格式错误: 必须是 array")
		}
		if !strings.Contains(backgroundModesEntry, "<string>location</string>") {
			updatedEntry := strings.Replace(
				backgroundModesEntry,
				"</array>",
				"\t<string>location</string>\n\t</array>",
				1,
			)
			plistContent = strings.Replace(plistContent, backgroundModesEntry, updatedEntry, 1)
		}
	} else {
		entries.WriteString("\t<key>UIBackgroundModes</key>\n")
		entries.WriteString("\t<array>\n")
		entries.WriteString("\t\t<string>location</string>\n")
		entries.WriteString("\t</array>\n")
	}

	if entries.Len() > 0 {
		plistEndIndex := strings.LastIndex(plistContent, "</plist>")
		if plistEndIndex < 0 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </plist>")
		}
		lastDictIndex := strings.LastIndex(plistContent[:plistEndIndex], "</dict>")
		if lastDictIndex < 0 {
			return false, fmt.Errorf("Info.plist 格式错误: 未找到 </dict>")
		}
		plistContent = plistContent[:lastDictIndex] + entries.String() + plistContent[lastDictIndex:]
	}

	if plistContent == originalContent {
		return false, nil
	}
	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}
	return true, nil
}

// addAppKeyToInfoPlist 向 Info.plist 添加 APP_KEY
func addAppKeyToInfoPlist(plistPath, appKey string) (bool, error) {
	content, err := os.ReadFile(plistPath)
	if err != nil {
		return false, fmt.Errorf("读取 Info.plist 失败: %v", err)
	}

	plistContent := string(content)

	// 检查是否已存在 com.ruixue.APP_KEY
	if strings.Contains(plistContent, "com.ruixue.APP_KEY") {
		return false, nil // 已存在，无需添加
	}

	// 在第一个 <dict> 后添加
	appKeyContent := `<dict>
	<key>com.ruixue.APP_KEY</key>
	<string>` + appKey + `</string>`

	plistContent = strings.Replace(plistContent, "<dict>", appKeyContent, 1)

	if err := os.WriteFile(plistPath, []byte(plistContent), 0644); err != nil {
		return false, fmt.Errorf("写入 Info.plist 失败: %v", err)
	}

	return true, nil
}

// ==================== iOS 常量 ====================

// iOS SDK 版本
const IOSSDKVersion = "4.0.4"

// ==================== iOS 返回结构 ====================

// IOSSpecResult 带初始化检查的返回结构
type IOSSpecResult struct {
	Spec      string `json:"spec"`
	Usage     string `json:"usage"`
	InitCheck string `json:"initCheck"`
}

// ==================== iOS Handlers ====================

// IOSInitHandler 生成 iOS SDK 初始化代码
func IOSInitHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct{},
) (*mcp.CallToolResult, struct {
	Code           string `json:"code"`
	DependencyHint string `json:"dependencyHint"`
}, error) {

	var buf bytes.Buffer
	if err := iosInitTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Code           string `json:"code"`
			DependencyHint string `json:"dependencyHint"`
		}{}, err
	}

	return nil, struct {
		Code           string `json:"code"`
		DependencyHint string `json:"dependencyHint"`
	}{
		Code:           buf.String(),
		DependencyHint: "使用此代码前，请先通过 ios_setup 添加 SDK 依赖（CocoaPods）。",
	}, nil
}

// IOSProjectConfigHandler 工程配置（Info.plist 隐私权限）
func IOSProjectConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Region string `json:"region"` // domestic(国内) 或 overseas(海外)
	},
) (*mcp.CallToolResult, struct {
	PlistContent string `json:"plistContent"`
	FullSpec     string `json:"fullSpec"`
	Region       string `json:"region"`
	Instructions string `json:"instructions"`
	PodConfig    string `json:"podConfig"`
	InitCode     string `json:"initCode"`
}, error) {

	region := input.Region
	// ==================== 必填参数检查 ====================
	if region == "" {
		return nil, struct {
			PlistContent string `json:"plistContent"`
			FullSpec     string `json:"fullSpec"`
			Region       string `json:"region"`
			Instructions string `json:"instructions"`
			PodConfig    string `json:"podConfig"`
			InitCode     string `json:"initCode"`
		}{
			Instructions: `❌ 【错误：缺少必填参数 region】

请先询问用户选择环境版本：
- domestic（国内版）
- overseas（海外版）

【你需要询问用户】
"请选择要接入的环境版本：
1. domestic（国内版）- 使用 RXUIKit
2. overseas（海外版）- 使用 RXOSUIKit"

【调用示例】
ios feature=setup region=domestic
ios feature=setup region=overseas`,
		}, nil
	}

	// 根据环境生成不同的配置
	var plistContent string
	var regionDesc string
	var podConfig string
	var uiKitImport string
	var uiKitClass string
	if region == "overseas" {
		regionDesc = "海外"
		podConfig = `# 瑞雪 SDK 海外版基础依赖
pod 'RXSDK_Pure'
pod 'RXOSUIKit'`
		uiKitImport = "#import <RXOSUIKit/RXOSUIKitService.h>"
		uiKitClass = "RXOSUIKitService"
		plistContent = `<!-- Ruixue SDK Privacy Permissions (Overseas) -->
<key>NSCameraUsageDescription</key>
<string>Allow access to the camera?</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow access to the microphone?</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Allow saving photos to your photo library?</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow access to your photo library?</string>
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>`
	} else {
		region = "domestic"
		regionDesc = "国内"
		podConfig = `# 瑞雪 SDK 国内版基础依赖
pod 'RXSDK_Pure'
pod 'RXUIKit'`
		uiKitImport = "#import <RXUIKit/RXUIKitService.h>"
		uiKitClass = "RXUIKitService"
		plistContent = `<!-- 瑞雪 SDK 隐私权限配置（国内环境） -->
<key>NSCameraUsageDescription</key>
<string>是否允许使用相机</string>
<key>NSMicrophoneUsageDescription</key>
<string>是否允许使用麦克风</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>是否允许保存到相册</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>是否允许访问相册</string>
<key>NSUserTrackingUsageDescription</key>
<string>此标识符将用于向您推荐个性化广告。</string>`
	}

	// 生成完整的初始化代码
	initCode := `// ========== AppDelegate.m 完整示例 ==========
#import <RXSDK_Pure/RXSDK_Pure.h>
` + uiKitImport + `

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // ========== UI 组件初始化（必须在瑞雪 SDK 初始化之前！）==========
    [[` + uiKitClass + ` sharedSDK] regist];
    
    // ========== 瑞雪 SDK 初始化 ==========
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.cpId = @"YOUR_CP_ID";                       // CP 唯一 ID（必须，从瑞雪后台获取）
    config.productId = @"YOUR_PRODUCT_ID";             // 应用 ID（必须，从瑞雪后台获取）
    config.channelId = @"YOUR_CHANNEL_ID";             // 渠道 ID（必须，从瑞雪后台获取）
    config.baseUrlList = @[@"https://api.example.com/"]; // 域名列表（必须）
    config.launchOptions = launchOptions;              // 启动参数
    // config.usePrivacy = YES;                        // 是否展示隐私授权页面
    
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"SDK 初始化失败: %@", error.responesObject);
        } else {
            NSLog(@"SDK 初始化成功: %@", response);
        }
    }];
    
    return YES;
}

#pragma mark - URL Scheme 回调（必须实现）

// 处理 URL Scheme 回调（微信、支付宝等第三方登录/支付回调）
- (BOOL)application:(UIApplication *)app 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
    [[RXSDK sharedSDK] application:app openURL:url options:options];
    return YES;
}

#pragma mark - Universal Link 回调（必须实现）

// 处理 Universal Link 回调（微信、Openinstall 等通用链接跳转）
- (BOOL)application:(UIApplication *)application 
        continueUserActivity:(NSUserActivity *)userActivity 
        restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    [[RXSDK sharedSDK] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    return YES;
}

@end`

	// 获取完整的模板内容
	var buf bytes.Buffer
	if err := iosProjectConfigTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			PlistContent string `json:"plistContent"`
			FullSpec     string `json:"fullSpec"`
			Region       string `json:"region"`
			Instructions string `json:"instructions"`
			PodConfig    string `json:"podConfig"`
			InitCode     string `json:"initCode"`
		}{}, err
	}

	instructions := `【瑞雪 SDK 基础库接入指南 - ` + regionDesc + `环境】

================== 步骤 1：配置 Pod 依赖 ==================

编辑项目的 Podfile，添加以下依赖：

` + podConfig + `

然后执行：pod install

================== 步骤 2：配置 Info.plist 隐私权限 ==================

在 Info.plist 中添加以下隐私权限配置（右键 → Open As → Source Code）：

` + plistContent + `

================== 步骤 3：添加 AppDelegate 初始化代码 ==================

在 AppDelegate.m 中添加以下代码：

` + initCode + `

================== 重要说明 ==================

1. cpId、productId、channelId 从瑞雪后台获取
2. baseUrlList 填写瑞雪提供的域名地址
3. 【必须实现】application:openURL:options: 方法（用于微信/支付宝等回调）
4. 【必须实现】application:continueUserActivity:restorationHandler: 方法（用于 Universal Link 回调）
5. UI 组件初始化必须在 SDK initWithConfig 之前执行

================== 后续操作 ==================

基础库配置完成后，可以接入其他组件：
- ios feature=openinstall  → OpenInstall 归因
- ios feature=wechat_config → 微信登录/分享
- ios feature=passport → 用户通行证
- ios feature=iap → 内购支付
- 等等...`

	return nil, struct {
		PlistContent string `json:"plistContent"`
		FullSpec     string `json:"fullSpec"`
		Region       string `json:"region"`
		Instructions string `json:"instructions"`
		PodConfig    string `json:"podConfig"`
		InitCode     string `json:"initCode"`
	}{
		PlistContent: plistContent,
		FullSpec:     buf.String(),
		Region:       region,
		Instructions: instructions,
		PodConfig:    podConfig,
		InitCode:     initCode,
	}, nil
}

// IOSPassportHandler 用户通行证
func IOSPassportHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosPassportTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 用户通行证功能：登录、注册、登出、指定用户信息查询、用户信息管理",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

func IOSAppleSigninConfigHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosAppleSigninTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS Sign in with Apple 工程配置：指定 Target 的 entitlements 与 CODE_SIGN_ENTITLEMENTS",
		InitCheck: "该功能只配置 Xcode 工程，不要求瑞雪 SDK 已初始化；Apple Developer 后台能力仍需人工开启。",
	}, nil
}

// IOSCaptchaHandler 验证码
func IOSCaptchaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosCaptchaTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 验证码功能：发送验证码、验证验证码",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSRealAuthHandler 实名认证
func IOSRealAuthHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosRealAuthTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 实名认证功能：身份验证、防沉迷、支付宝 IIFAA 实名",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSAccountBindingHandler 账号绑定
func IOSAccountBindingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosAccountBindingTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 账号绑定功能：绑定第三方账号，绑定/解绑/修改手机号、邮箱",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSPasswordHandler 密码管理
func IOSPasswordHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosPasswordTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 密码管理功能：修改密码、重置密码",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSDeregisterHandler 账号注销
func IOSDeregisterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosDeregisterTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 账号注销功能：申请注销、撤销注销",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSGameAreaHandler 游戏区服
func IOSGameAreaHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosGameAreaTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 游戏区服功能：创建/查询/更新/删除区服",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSGameCharacterHandler 游戏角色
func IOSGameCharacterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosGameCharacterTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 游戏角色功能：SetGameInfo 上报瑞雪、角色 CRUD；SetThirdGameInfo 不支持 iOS",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSIapHandler 内购支付
func IOSIapHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosIapTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 内购支付功能：IAP 支付、补单、商品查询",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSShareHandler 分享
func IOSShareHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosShareTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 分享功能：一键分享、系统分享、短链接",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSFeedbackHandler 反馈
func IOSFeedbackHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosFeedbackTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 反馈功能：提交反馈、满意度评价、客服消息",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSTrackingHandler 数据埋点
func IOSTrackingHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosTrackingTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 数据埋点功能：事件上报、用户行为上报、公共属性",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSLegalUIHandler 法务 UI（协议页面、隐私政策弹窗）
func IOSLegalUIHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosLegalUITpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 法务 UI 功能：协议声明弹窗、隐私政策弹窗",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSPromoHandler 达人福利
func IOSPromoHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosPromoTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 达人福利功能：获取/兑换福利码",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSAnnouncementHandler 公告/邮件
func IOSAnnouncementHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosAnnouncementTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 公告/邮件功能：获取公告、邮件列表、领取道具",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSDeviceHandler 设备信息
func IOSDeviceHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosDeviceTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 设备信息功能：设备码、时区、语言、IDFA",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSVersionCheckHandler 版本检查 v2
func IOSVersionCheckHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosVersionCheckTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "瑞雪版本检查 v2：updateGameVersionWithInfo 统一模块版本检查",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSStoreReviewHandler App Store 评分
func IOSStoreReviewHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosStoreReviewTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS App Store 评分功能：应用内评分、跳转评分",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSLbsHandler LBS 定位功能
func IOSLbsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosLbsTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS LBS：高德设备定位工程配置与位置获取，以及瑞雪社交坐标上报、附近用户和坐标删除",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSUserCenterHandler 用户中心
func IOSUserCenterHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosUserCenterTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 用户中心功能：用户中心弹窗、帮助中心弹窗、客服弹窗、关闭用户中心",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSFriendsHandler 好友管理功能
func IOSFriendsHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosFriendsTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 好友管理功能：添加/删除好友、更新备注、好友列表、判断好友关系",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSRankHandler 排行榜功能
func IOSRankHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosRankTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 排行榜功能：增加/设置分数、查询排名、获取排行榜、好友排行榜",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSSocialHandler 社交关系功能
func IOSSocialHandler(ctx context.Context, req *mcp.CallToolRequest, input struct{}) (*mcp.CallToolResult, IOSSpecResult, error) {
	var buf bytes.Buffer
	if err := iosSocialTpl.Execute(&buf, nil); err != nil {
		return nil, IOSSpecResult{}, err
	}
	return nil, IOSSpecResult{
		Spec:      buf.String(),
		Usage:     "iOS 社交关系功能：设置用户自定义信息、添加/删除/更新关系、获取关系列表",
		InitCheck: IOSInitCheckGuide,
	}, nil
}

// IOSGPMHandler 性能分析（GPM）组件接入
func IOSGPMHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXGPMSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXGPMSDK/RXGPMService.h>

// 注册性能分析组件（必须在瑞雪 SDK 初始化之前）
[[RXGPMService sharedSDK] regist];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosGPMTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - 性能分析（GPM）接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加 GPM 注册代码
- 参考 initCode 中的代码

【重要提醒】
- [[RXGPMService sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用
- GPM 组件无需额外配置参数，只需调用 regist 方法即可`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSASAHandler ASA（Apple Search Ads）组件接入
func IOSASAHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXASAKit'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXASAKit/RXASAService.h>

// 注册 ASA 组件（必须在瑞雪 SDK 初始化之前）
[[RXASAService sharedSDK] regist];`

	var buf bytes.Buffer
	if err := iosASATpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - ASA（Apple Search Ads）接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加 ASA 注册代码
- 参考 initCode 中的代码

【重要提醒】
- [[RXASAService sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用
- ASA 组件无需额外配置参数，只需调用 regist 方法即可`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSGameCenterHandler GameCenter 组件接入（含自动配置 entitlements）
func IOSGameCenterHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		TargetName    string `json:"targetName"`
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	EntitlementsPath string `json:"entitlementsPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName

	// 检查基础库
	if workspacePath != "" {
		hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
		if !hasBaseLib {
			return nil, struct {
				Instructions     string `json:"instructions"`
				PodDependency    string `json:"podDependency"`
				InitCode         string `json:"initCode"`
				AutoConfigResult string `json:"autoConfigResult"`
				EntitlementsPath string `json:"entitlementsPath"`
				FullSpec         string `json:"fullSpec"`
			}{
				Instructions: baseLibError,
			}, nil
		}
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	podDependency := "pod 'RXGameCenterSDK'"
	initCode := `#import <RXGameCenterSDK/RXGameCenterService.h>

// 1. 登录 Game Center
[[RXGameCenterService sharedSDK] authenticateWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
        return;
    }
    NSLog(@"登录成功");
}];

// 2. 上传排行榜分数
[[RXGameCenterService sharedSDK] submitScoreWithScore:1000
                                        leaderboardID:@"leaderboard_001"
                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"上传分数结果: %@", response);
}];

// 3. 解锁成就进度（0-100）
[[RXGameCenterService sharedSDK] unlockGKAchievementWithAchievementID:@"achievement_001"
                                                      percentComplete:100
                                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"成就解锁结果: %@", response);
}];

// 4. 展示 Game Center 主界面
[[RXGameCenterService sharedSDK] showGameCenterWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 5. 展示排行榜界面
[[RXGameCenterService sharedSDK] showLeaderboardWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 6. 展示成就界面
[[RXGameCenterService sharedSDK] showAchievementsWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {}];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosGameCenterTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			EntitlementsPath string `json:"entitlementsPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 entitlements ====================
	var autoConfigResult strings.Builder
	var entitlementsPathResult string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n\n", targetPlaceholder))

	if workspacePath != "" {
		entitlementsRelativePath := targetPlaceholder + "/" + targetPlaceholder + ".entitlements"
		resolvedPath, _, pbxModified, entitlementsModified, err := updateAndBindTargetEntitlements(
			workspacePath,
			targetPlaceholder,
			entitlementsRelativePath,
			addGameCenterToEntitlements,
		)
		if err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 解析或绑定 entitlements 失败: %v\n", err))
			autoConfigResult.WriteString("   请手动在 Xcode 中: Target → Build Settings → Code Signing Entitlements 添加引用\n")
		} else {
			entitlementsPathResult = resolvedPath
			if entitlementsModified {
				autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 Game Center 配置到: %s\n", entitlementsPathResult))
			} else {
				autoConfigResult.WriteString("ℹ️  entitlements 已包含 Game Center 配置\n")
			}
			if pbxModified {
				autoConfigResult.WriteString("✅ 已修改指定 Target 的 CODE_SIGN_ENTITLEMENTS\n")
			} else {
				autoConfigResult.WriteString("ℹ️  指定 Target 已绑定 CODE_SIGN_ENTITLEMENTS\n")
			}
		}

		autoConfigResult.WriteString("\n【重要提醒】\n")
		autoConfigResult.WriteString("- 请在 Apple Developer 后台为 App ID 开启 Game Center 能力\n")
		autoConfigResult.WriteString("- 排行榜 ID 和成就 ID 需要在 App Store Connect 中预先配置\n")
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【GameCenter 组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- Game Center Capability (entitlements 文件)
- project.pbxproj CODE_SIGN_ENTITLEMENTS 引用

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】使用 GameCenter API
- 参考 initCode 中的代码

【步骤 3】Apple Developer 后台配置（需手动完成）
- 登录 Apple Developer 后台
- 为 App ID 开启 "Game Center" 能力
- 在 App Store Connect 中配置排行榜和成就

【可用 API 列表】
- authenticateWithComplete: 登录 Game Center
- submitScoreWithScore:leaderboardID:complete: 上传排行榜分数
- unlockGKAchievementWithAchievementID:percentComplete:complete: 解锁成就进度
- showGameCenterWithComplete: 展示 Game Center 主界面
- showLeaderboardWithComplete: 展示排行榜界面
- showAchievementsWithComplete: 展示成就界面`

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		EntitlementsPath string `json:"entitlementsPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		EntitlementsPath: entitlementsPathResult,
		FullSpec:         buf.String(),
	}, nil
}

// IOSGoogleHandler Google 登录组件接入（含自动配置 Info.plist）
func IOSGoogleHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath   string `json:"workspacePath"`
		TargetName      string `json:"targetName"`
		GIDClientID     string `json:"gidClientId"`     // Google Client ID
		GoogleURLScheme string `json:"googleUrlScheme"` // Google iOS 网址架构
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	gidClientID := input.GIDClientID
	googleURLScheme := input.GoogleURLScheme

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 Info.plist）")
	}
	if gidClientID == "" {
		missingParams = append(missingParams, "gidClientId（Google Client ID，从 Google Cloud Console 获取）")
	}
	if googleURLScheme == "" {
		missingParams = append(missingParams, "googleUrlScheme（Google 后台凭据中的 iOS 网址架构/反向客户端 ID）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

Google 登录配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- gidClientId: 从 Google Cloud Console 获取的 Client ID
- googleUrlScheme: Google 后台凭据中的 iOS 网址架构（反向客户端 ID，格式如 com.googleusercontent.apps.xxx）

【调用示例】
ios feature=google workspacePath=/path/to/project gidClientId=xxx.apps.googleusercontent.com googleUrlScheme=com.googleusercontent.apps.xxx`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// 检查基础库
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	podDependency := "pod 'RXGoogleSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXGoogleSDK/RXGoogleService.h>

// 注册 Google 组件（必须在瑞雪 SDK 初始化之前）
[[RXGoogleService sharedSDK] regist];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosGoogleTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 Info.plist ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🔑 GIDClientID: %s\n", gidClientID))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 URL Scheme: %s\n\n", googleURLScheme))

	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - GIDClientID: %s\n", gidClientID))
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", googleURLScheme))
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 1. 添加 GIDClientID
		if modified, err := addGIDClientIDToInfoPlist(infoPlistPath, gidClientID); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 GIDClientID 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 GIDClientID: %s\n", gidClientID))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 GIDClientID\n")
		}

		// 2. 添加 URL Types
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, googleURLScheme); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", googleURLScheme))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", googleURLScheme))
		}
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	instructions := `【Google 登录组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- GIDClientID (Info.plist)
- URL Types (Info.plist)

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile: ` + podfilePath + `
- 添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXGoogleService sharedSDK] regist];

【步骤 3】处理 URL 回调
- 在 application:openURL:options: 中添加:
  [[RXGoogleService sharedSDK] GOpenURL:url];

【配置信息汇总】
- GIDClientID: ` + gidClientID + `
- URL Scheme: ` + googleURLScheme

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		FullSpec:         buf.String(),
	}, nil
}

// IOSFacebookHandler Facebook 组件接入（含自动配置 Info.plist）
func IOSFacebookHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath       string `json:"workspacePath"`
		TargetName          string `json:"targetName"`
		FacebookAppID       string `json:"facebookAppId"`
		FacebookClientToken string `json:"facebookClientToken"`
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	facebookAppID := input.FacebookAppID
	facebookClientToken := input.FacebookClientToken

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 Info.plist）")
	}
	if facebookAppID == "" {
		missingParams = append(missingParams, "facebookAppId（Facebook App ID，从 Facebook 开发者后台获取）")
	}
	if facebookClientToken == "" {
		missingParams = append(missingParams, "facebookClientToken（Facebook Client Token，从 Facebook 开发者后台获取）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

Facebook 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- facebookAppId: 从 Facebook 开发者后台获取的 App ID
- facebookClientToken: 从 Facebook 开发者后台获取的 Client Token

【调用示例】
ios feature=facebook workspacePath=/path/to/project facebookAppId=123456789 facebookClientToken=your_client_token`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// 检查基础库
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	// 处理 URL Scheme: 检测是否有 fb 前缀，没有则自动添加
	fbURLScheme := facebookAppID
	if !strings.HasPrefix(fbURLScheme, "fb") {
		fbURLScheme = "fb" + fbURLScheme
	}

	podDependency := "pod 'RXFacebookSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXFacebookSDK/RXFacebookService.h>

// 注册 Facebook（必须在瑞雪 SDK 初始化之前）
[[RXFacebookService sharedSDK] FBRegistWithApplication:application
                                         launchOptions:launchOptions];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosFacebookTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 Info.plist ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("📱 Facebook App ID: %s\n", facebookAppID))
	autoConfigResult.WriteString(fmt.Sprintf("🔑 Facebook Client Token: %s\n", facebookClientToken))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 URL Scheme: %s\n\n", fbURLScheme))

	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - FacebookAppID: %s\n", facebookAppID))
		autoConfigResult.WriteString(fmt.Sprintf("   - FacebookClientToken: %s\n", facebookClientToken))
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", fbURLScheme))
		autoConfigResult.WriteString("   - LSApplicationQueriesSchemes: fbapi, fb-messenger-share-api\n")
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 1. 添加 FacebookAppID 和 FacebookClientToken
		if modified, err := addFacebookConfigToInfoPlist(infoPlistPath, facebookAppID, facebookClientToken); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 Facebook 配置失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 FacebookAppID: %s\n", facebookAppID))
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 FacebookClientToken: %s\n", facebookClientToken))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 Facebook 配置\n")
		}

		// 2. 添加 URL Types（fb + AppID）
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, fbURLScheme); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", fbURLScheme))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", fbURLScheme))
		}

		// 3. 添加 LSApplicationQueriesSchemes
		fbSchemes := []string{"fbapi", "fb-messenger-share-api"}
		if modified, err := addLSApplicationQueriesToInfoPlist(infoPlistPath, fbSchemes); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LSApplicationQueriesSchemes 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString("✅ 已添加 LSApplicationQueriesSchemes:\n")
			for _, scheme := range fbSchemes {
				autoConfigResult.WriteString(fmt.Sprintf("   - %s\n", scheme))
			}
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含所有 Facebook 相关的 LSApplicationQueriesSchemes\n")
		}
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	instructions := `【Facebook 组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- FacebookAppID (Info.plist)
- FacebookClientToken (Info.plist)
- URL Types (Info.plist): ` + fbURLScheme + `
- LSApplicationQueriesSchemes (Info.plist): fbapi, fb-messenger-share-api

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile: ` + podfilePath + `
- 添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXFacebookService sharedSDK] FBRegistWithApplication:application launchOptions:launchOptions];

【步骤 3】处理 URL 回调
- 在 application:openURL:options: 中添加:
  [[RXFacebookService sharedSDK] FBApplication:app openURL:url options:options];

【配置信息汇总】
- Facebook App ID: ` + facebookAppID + `
- Facebook Client Token: ` + facebookClientToken + `
- URL Scheme: ` + fbURLScheme

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		FullSpec:         buf.String(),
	}, nil
}

// IOSLineHandler Line 组件接入（含自动配置 Info.plist）
func IOSLineHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		TargetName    string `json:"targetName"`
		LineChannelID string `json:"lineChannelId"`
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	lineChannelID := input.LineChannelID

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 Info.plist）")
	}
	if lineChannelID == "" {
		missingParams = append(missingParams, "lineChannelId（Line Channel ID，从 Line 开发者后台获取）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

Line 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- lineChannelId: 从 Line 开发者后台获取的 Channel ID

【调用示例】
ios feature=line workspacePath=/path/to/project lineChannelId=1234567890`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// 检查基础库
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	lineURLScheme := "line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)"

	podDependency := "pod 'RXLineSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXLineSDK/RXLineService.h>

// 注册 Line 组件（必须在瑞雪 SDK 初始化之前）
[[RXLineService sharedSDK] regist];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosLineTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 Info.plist ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🔑 Line Channel ID: %s\n", lineChannelID))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 URL Scheme: %s\n\n", lineURLScheme))

	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - LineSDKConfig → ChannelID: %s\n", lineChannelID))
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", lineURLScheme))
		autoConfigResult.WriteString("   - LSApplicationQueriesSchemes: lineauth2\n")
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 1. 添加 LineSDKConfig（Dictionary 含 ChannelID）
		if modified, err := addLineSDKConfigToInfoPlist(infoPlistPath, lineChannelID); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LineSDKConfig 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 LineSDKConfig → ChannelID: %s\n", lineChannelID))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 LineSDKConfig\n")
		}

		// 2. 添加 URL Types
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, lineURLScheme); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", lineURLScheme))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", lineURLScheme))
		}

		// 3. 添加 LSApplicationQueriesSchemes
		lineSchemes := []string{"lineauth2"}
		if modified, err := addLSApplicationQueriesToInfoPlist(infoPlistPath, lineSchemes); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LSApplicationQueriesSchemes 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString("✅ 已添加 LSApplicationQueriesSchemes: lineauth2\n")
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 lineauth2\n")
		}
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	instructions := `【Line 组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- LineSDKConfig → ChannelID (Info.plist)
- URL Types (Info.plist): ` + lineURLScheme + `
- LSApplicationQueriesSchemes (Info.plist): lineauth2

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile: ` + podfilePath + `
- 添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXLineService sharedSDK] regist];

【步骤 3】处理 URL 回调
- 在 application:openURL:options: 中添加:
  [[RXLineService sharedSDK] handleOpenURL:url];

【配置信息汇总】
- Line Channel ID: ` + lineChannelID + `
- URL Scheme: ` + lineURLScheme

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		FullSpec:         buf.String(),
	}, nil
}

// IOSZaloHandler Zalo 组件接入（含自动配置 Info.plist）
func IOSZaloHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		TargetName    string `json:"targetName"`
		ZaloAppID     string `json:"zaloAppId"`
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	zaloAppID := input.ZaloAppID

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 Info.plist）")
	}
	if zaloAppID == "" {
		missingParams = append(missingParams, "zaloAppId（Zalo App ID，从 Zalo 开发者后台获取）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

Zalo 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- zaloAppId: Zalo App ID（纯数字或 zalo- 前缀均可）

【调用示例】
ios feature=zalo workspacePath=/path/to/project zaloAppId=1234567`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// 检查基础库
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	// 智能处理 zalo- 前缀
	// URL Scheme 需要 zalo- 前缀，initWithAppId 需要纯数字
	pureAppID := strings.TrimPrefix(zaloAppID, "zalo-")
	zaloURLScheme := "zalo-" + pureAppID

	podDependency := "pod 'RXZaloSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXZaloSDK/RXZaloService.h>

// 初始化 Zalo（必须在瑞雪 SDK 初始化之前）
// 注意：App ID 使用纯数字，不含 zalo- 前缀
[[RXZaloService sharedSDK] initWithAppId:@"` + pureAppID + `"];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosZaloTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 Info.plist ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("📱 Zalo App ID: %s\n", pureAppID))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 URL Scheme: %s\n\n", zaloURLScheme))

	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", zaloURLScheme))
		autoConfigResult.WriteString("   - LSApplicationQueriesSchemes: zalosdk, zaloshareext\n")
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 1. 添加 URL Types
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, zaloURLScheme); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", zaloURLScheme))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", zaloURLScheme))
		}

		// 2. 添加 LSApplicationQueriesSchemes
		zaloSchemes := []string{"zalosdk", "zaloshareext"}
		if modified, err := addLSApplicationQueriesToInfoPlist(infoPlistPath, zaloSchemes); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LSApplicationQueriesSchemes 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString("✅ 已添加 LSApplicationQueriesSchemes:\n")
			for _, scheme := range zaloSchemes {
				autoConfigResult.WriteString(fmt.Sprintf("   - %s\n", scheme))
			}
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含所有 Zalo 相关的 LSApplicationQueriesSchemes\n")
		}
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	instructions := `【Zalo 组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- URL Types (Info.plist): ` + zaloURLScheme + `
- LSApplicationQueriesSchemes (Info.plist): zalosdk, zaloshareext

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile: ` + podfilePath + `
- 添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXZaloService sharedSDK] initWithAppId:@"` + pureAppID + `"];
  ⚠️ 注意：initWithAppId 使用纯数字 App ID，不含 zalo- 前缀

【配置信息汇总】
- Zalo App ID: ` + pureAppID + `
- URL Scheme: ` + zaloURLScheme + `（zalo- 前缀 + App ID）`

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		FullSpec:         buf.String(),
	}, nil
}

// IOSTikTokHandler TikTok 组件接入（含自动配置 Info.plist）
func IOSTikTokHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		TargetName    string `json:"targetName"`
		TikTokAppID   string `json:"tiktokAppId"`
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	PodDependency    string `json:"podDependency"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	FullSpec         string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	tiktokAppID := input.TikTokAppID

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 Info.plist）")
	}
	if tiktokAppID == "" {
		missingParams = append(missingParams, "tiktokAppId（TikTok App ID，从 TikTok 开发者后台获取）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

TikTok 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- tiktokAppId: 从 TikTok 开发者后台获取的 App ID

【调用示例】
ios feature=tiktok workspacePath=/path/to/project tiktokAppId=your_app_id`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// 检查基础库
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	podDependency := "pod 'RXTikTokSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXTikTokSDK/RXTikTokService.h>

// 注册 TikTok（必须在瑞雪 SDK 初始化之前）
[[RXTikTokService sharedSDK] TTRegistWithApplication:application
                                       launchOptions:launchOptions];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosTikTokTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions     string `json:"instructions"`
			PodDependency    string `json:"podDependency"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			FullSpec         string `json:"fullSpec"`
		}{}, err
	}

	// ==================== 自动配置 Info.plist ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("📱 TikTok App ID: %s\n\n", tiktokAppID))

	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - TikTokAppID: %s\n", tiktokAppID))
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", tiktokAppID))
		autoConfigResult.WriteString("   - LSApplicationQueriesSchemes: tiktokopensdk, tiktoksharesdk, snssdk1180, snssdk1233\n")
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 1. 添加 TikTokAppID
		if modified, err := addTikTokAppIDToInfoPlist(infoPlistPath, tiktokAppID); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 TikTokAppID 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 TikTokAppID: %s\n", tiktokAppID))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 TikTokAppID\n")
		}

		// 2. 添加 URL Types（TikTok App ID 作为 Scheme）
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, tiktokAppID); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", tiktokAppID))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", tiktokAppID))
		}

		// 3. 添加 LSApplicationQueriesSchemes
		ttSchemes := []string{"tiktokopensdk", "tiktoksharesdk", "snssdk1180", "snssdk1233"}
		if modified, err := addLSApplicationQueriesToInfoPlist(infoPlistPath, ttSchemes); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LSApplicationQueriesSchemes 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString("✅ 已添加 LSApplicationQueriesSchemes:\n")
			for _, scheme := range ttSchemes {
				autoConfigResult.WriteString(fmt.Sprintf("   - %s\n", scheme))
			}
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含所有 TikTok 相关的 LSApplicationQueriesSchemes\n")
		}
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	instructions := `【TikTok 组件接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成：
- TikTokAppID (Info.plist)
- URL Types (Info.plist): ` + tiktokAppID + `
- LSApplicationQueriesSchemes (Info.plist): tiktokopensdk, tiktoksharesdk, snssdk1180, snssdk1233

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
- 编辑 Podfile: ` + podfilePath + `
- 添加: ` + podDependency + `
- 然后执行: cd ` + workspacePath + ` && pod install

【步骤 2】添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXTikTokService sharedSDK] TTRegistWithApplication:application launchOptions:launchOptions];

【配置信息汇总】
- TikTok App ID: ` + tiktokAppID

	return nil, struct {
		Instructions     string `json:"instructions"`
		PodDependency    string `json:"podDependency"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		FullSpec         string `json:"fullSpec"`
	}{
		Instructions:     instructions,
		PodDependency:    podDependency,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		FullSpec:         buf.String(),
	}, nil
}

// IOSInstagramHandler Instagram 组件接入
func IOSInstagramHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath        string `json:"workspacePath"`
		InstagramClientID    string `json:"instagramClientId"`
		InstagramRedirectURI string `json:"instagramRedirectUri"`
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	clientID := input.InstagramClientID
	redirectURI := input.InstagramRedirectURI

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if clientID == "" {
		missingParams = append(missingParams, "instagramClientId（Instagram Client ID，从 Instagram/Meta 开发者后台获取）")
	}
	if redirectURI == "" {
		missingParams = append(missingParams, "instagramRedirectUri（Instagram Redirect URI，在 Instagram/Meta 开发者后台配置）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法生成代码】

Instagram 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- instagramClientId: 从 Instagram/Meta 开发者后台获取的 Client ID
- instagramRedirectUri: 在 Instagram/Meta 开发者后台配置的 Redirect URI

【调用示例】
ios feature=instagram instagramClientId=your_client_id instagramRedirectUri=https://your-redirect-uri.com/callback`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	podDependency := "pod 'RXInstagramSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXInstagramSDK/RXInstagramService.h>

// 初始化 Instagram（必须在瑞雪 SDK 初始化之前）
[[RXInstagramService sharedSDK] initWithClientID:@"` + clientID + `"
                                     redirectURI:@"` + redirectURI + `"];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosInstagramTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - Instagram 组件接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXInstagramService sharedSDK] initWithClientID:@"` + clientID + `"
                                       redirectURI:@"` + redirectURI + `"];

【配置信息汇总】
- Instagram Client ID: ` + clientID + `
- Instagram Redirect URI: ` + redirectURI + `

【重要提醒】
- initWithClientID:redirectURI: 必须在瑞雪 SDK 初始化之前调用
- 无需额外工程配置（不需要修改 Info.plist）`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSRedditHandler Reddit 组件接入
func IOSRedditHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath     string `json:"workspacePath"`
		RedditClientID    string `json:"redditClientId"`
		RedditRedirectURI string `json:"redditRedirectUri"`
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath
	clientID := input.RedditClientID
	redirectURI := input.RedditRedirectURI

	// ==================== 必填参数检查 ====================
	var missingParams []string
	if clientID == "" {
		missingParams = append(missingParams, "redditClientId（Reddit Client ID，从 Reddit 开发者后台获取）")
	}
	if redirectURI == "" {
		missingParams = append(missingParams, "redditRedirectUri（Reddit Redirect URI，在 Reddit 开发者后台配置）")
	}

	if len(missingParams) > 0 {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法生成代码】

Reddit 配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- redditClientId: 从 Reddit 开发者后台获取的 Client ID
- redditRedirectUri: 在 Reddit 开发者后台配置的 Redirect URI

【调用示例】
ios feature=reddit redditClientId=your_client_id redditRedirectUri=your_redirect_uri`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	podDependency := "pod 'RXRedditKit'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXRedditKit/RXRedditService.h>

// 初始化 Reddit（必须在瑞雪 SDK 初始化之前）
[[RXRedditService sharedSDK] initWithClientID:@"` + clientID + `"
                                  redirectURI:@"` + redirectURI + `"];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosRedditTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - Reddit 组件接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加:
  [[RXRedditService sharedSDK] initWithClientID:@"` + clientID + `"
                                    redirectURI:@"` + redirectURI + `"];

【配置信息汇总】
- Reddit Client ID: ` + clientID + `
- Reddit Redirect URI: ` + redirectURI + `

【重要提醒】
- initWithClientID:redirectURI: 必须在瑞雪 SDK 初始化之前调用
- 无需额外工程配置（不需要修改 Info.plist）`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSBytedanceAdHandler 广告投放（字节/巨量广告）组件接入
func IOSBytedanceAdHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXBDASignalSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXBDASignalSDK/RXBDAsignalService.h>

// 注册广告投放组件（必须在瑞雪 SDK 初始化之前）
[[RXBDAsignalService sharedSDK] regist];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosBytedanceAdTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - 广告投放（字节/巨量广告）接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加广告投放注册代码
- 参考 initCode 中的代码

【重要提醒】
- [[RXBDAsignalService sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用
- 广告投放组件无需额外配置参数，只需调用 regist 方法即可
- 此组件用于对接字节跳动/巨量引擎广告归因和转化追踪`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSTencentAdHandler 广告投放（腾讯/广点通）组件接入
func IOSTencentAdHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXGDTSDK', '1.0.2'\npod 'RXSDK_Pure', '4.0.8'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXGDTSDK/RXGDTSDK.h>

// 注册广点通组件（必须在瑞雪 SDK 初始化之前）
[[RXGDTService sharedSDK] regist];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosGDTTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - 广告投放（腾讯/广点通）接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 确认版本门槛
- RXGDTSDK >= 1.0.2
- RXSDK_Pure 及同一 Podfile 中 RXSDK* 依赖 >= 4.0.8
- MCP 仅升级低版本，不会降级高版本

步骤 3: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 4: 添加初始化和生命周期代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加广点通注册代码
- applicationDidBecomeActive 上报 START_APP
- openURL 回调调用 handleOpenUrl
- 参考 fullSpec 中的真实 RXGDTService API

【重要提醒】
- [[RXGDTService sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用
- 手动初始化可调用 initWithActionSetId:secretKey:
- 创角、下单和支付为关键业务上报；支付金额单位为分
- feature=tencent_ad 为 feature=gdt 的兼容别名`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSAdjustHandler Adjust 组件接入
func IOSAdjustHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXAdjustSDK'"
	initCode := `// 在 AppDelegate.m 中添加以下代码
#import <RXAdjustSDK/RXAdjust.h>

// 初始化 Adjust
RXADJConfig *config = [[RXADJConfig alloc] initWithAppToken:@"your_app_token" 
                                                 environment:@"production"];
[[RXAdjust sharedSDK] appDidLaunch:config];

// 设置代理（可选）
[RXAdjust sharedSDK].delegate = self;

// ========== 事件追踪 ==========
RXADJEvent *event = [[RXADJEvent alloc] initWithEventToken:@"abc123"];
[event setRevenue:9.99 currency:@"USD"];
[[RXAdjust sharedSDK] trackEvent:event];

// ========== 标识符获取 ==========
RXADJAttribution *attribution = [[RXAdjust sharedSDK] attribution];
NSString *idfa = [[RXAdjust sharedSDK] idfa];
NSString *adid = [[RXAdjust sharedSDK] adid];

// ========== 隐私合规 ==========
[[RXAdjust sharedSDK] gdprForgetMe];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosAdjustTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - Adjust 组件接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中添加 Adjust 初始化代码:
  RXADJConfig *config = [[RXADJConfig alloc] initWithAppToken:@"your_app_token" environment:@"production"];
  [[RXAdjust sharedSDK] appDidLaunch:config];

【可用 API 列表】
初始化:
- appDidLaunch: 初始化 Adjust（传入 RXADJConfig）
- setLogLevel: 设置日志等级

事件追踪:
- trackEvent: 记录事件
- addEventCallbackWithEventToken:params: 添加回传参数
- trackAdRevenue:payload: 跟踪广告收入
- trackSubscription: 跟踪订阅

会话参数:
- setDelayStart: 延迟启动
- addSessionCallbackParameter:value: 添加会话回传参数
- addSessionPartnerParameter:value: 添加会话伙伴参数

隐私合规:
- gdprForgetMe: GDPR 被遗忘权
- trackThirdPartySharing: 三方分享处理
- disableThirdPartySharing: 禁用第三方数据分享
- trackMeasurementConsent: 许可监测

标识符:
- idfa: 获取 IDFA
- adid: 获取 ADID
- attribution: 获取归因信息

【重要提醒】
- environment 参数：正式环境用 @"production"，测试环境用 @"sandbox"
- 实现 RXAdjustDelegate 协议可获取归因回传、事件/会话跟踪回调`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSFirebaseHandler Firebase 组件接入
func IOSFirebaseHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := "pod 'RXFirebaseSDK'"
	initCode := `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXFirebaseSDK/RXFirebaseService.h>
#import <RXFirebaseSDK/RXFirebasePush.h>
#import <FirebaseMessaging/FirebaseMessaging.h>

// 初始化 Firebase（必须在瑞雪 SDK 初始化之前）
[[RXFirebaseService sharedSDK] configure];
[[RXFirebasePush sharedSDK] setDelegate:self];

// ========== 以下方法在需要时调用 ==========

// 设置默认事件参数（会自动附加到所有后续事件）
[[RXFirebaseService sharedSDK] setDefaultEventParameters:@{
    @"app_version": @"1.0.0",
    @"platform": @"iOS"
}];

// 设置用户属性
[[RXFirebaseService sharedSDK] setUserPropertyString:@"premium" forName:@"user_type"];

// 设置用户 ID（最长 256 字符）
[[RXFirebaseService sharedSDK] setUserID:@"user_123"];

// 启用/禁用数据收集（默认 YES）
[[RXFirebaseService sharedSDK] setAnalyticsCollectionEnabled:YES];

// 记录事件
[[RXFirebaseService sharedSDK] logEventWithName:@"purchase"
                                     parameters:@{
    @"item_id": @"diamond_100",
    @"price": @(6.0)
}];

// 获取 instanceID
NSString *instanceId = [[RXFirebaseService sharedSDK] getInstanceId];

// 获取 FCM 注册令牌
[[RXFirebasePush sharedSDK] tokenWithCompletion:^(NSString *token, NSError *error) {
    if (error) {
        NSLog(@"Error getting FCM registration token: %@", error);
    } else {
        NSLog(@"FCM registration token: %@", token);
    }
}];

// 如 FirebaseAppDelegateProxyEnabled=NO，在 didRegisterForRemoteNotificationsWithDeviceToken 中设置 APNs token
// [[RXFirebasePush sharedSDK] setDeviceToken:deviceToken];
// 控制 FCM 自动初始化；关闭时需 Info.plist 添加 FirebaseMessagingAutoInitEnabled = NO
// [[RXFirebasePush sharedSDK] autoInitEnabled:YES];`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosFirebaseTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - Firebase 组件接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码和推送配置
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前调用:
  [[RXFirebaseService sharedSDK] configure];
- 如需 FCM 推送，设置代理并注册远程通知:
  [[RXFirebasePush sharedSDK] setDelegate:self];

【可用 API 列表】
- configure: 初始化配置（必须在瑞雪 SDK 初始化之前）
- setDefaultEventParameters: 设置默认事件参数
- setUserPropertyString:forName: 设置用户属性
- setUserID: 设置用户 ID（最长 256 字符）
- setAnalyticsCollectionEnabled: 启用/禁用数据收集（默认 YES）
- logEventWithName:parameters: 记录事件
- getInstanceId: 获取 instanceID
- RXFirebasePush setDelegate: 设置 FIRMessagingDelegate
- RXFirebasePush setDeviceToken: 设置 APNs deviceToken
- RXFirebasePush tokenWithCompletion: 获取 FCM 注册令牌
- RXFirebasePush autoInitEnabled: 设置 FCM 自动初始化

【重要提醒】
- [[RXFirebaseService sharedSDK] configure] 必须在瑞雪 SDK 初始化之前调用
- FCM 推送需在 Firebase 控制台上传 APNs 身份验证密钥，并在 AppDelegate 注册远程通知
- setAnalyticsCollectionEnabled 默认为 YES
- 事件名 1-40 个字符，必须以字母开头，每个事件最多 25 个参数
- 用户 ID 最长 256 字符`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSTopOnHandler TopOn 广告聚合组件接入
func IOSTopOnHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	workspacePath := input.WorkspacePath

	podDependency := `# TopOn 核心 SDK（版本锁定 6.3.50）
pod 'TPNiOS','6.3.50'
pod 'TraminiSDK','6.3.50'
# 各广告平台 Adapter 按需添加（版本号统一为 6.3.50.x），例如：
pod 'TPNAdmobSDKAdapter','6.3.50.2'
pod 'TPNGDTSDKAdapter','6.3.50.4'
pod 'TPNPangleSDKAdapter','6.3.50.4'
# 瑞雪 TopOn 封装
pod 'RXTopOnSDK'`

	initCode := `// 在 AppDelegate.m 中添加（确保用户已同意《隐私政策》后再初始化）
#import <RXTopOnSDK/RXTopOnSDK.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

[RXTopOnInitManager setLogEnabled:NO]; // 上线前需关闭
[[RXTopOnInitManager sharedSDK] setSystemPlatformType:ATSystemPlatformTypeIOS];
if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
        [[RXTopOnInitManager sharedSDK] startWithAppID:@"your TopOn AppId" appKey:@"your TopOn AppKey" error:nil];
    }];
} else {
    [[RXTopOnInitManager sharedSDK] startWithAppID:@"your TopOn AppId" appKey:@"your TopOn AppKey" error:nil];
}

// ========== 广告加载与展示统一通过 RXTopOnATAdManager sharedSDK ==========
// 激励视频: loadADWithPlacementID:extra: / rewardedVideoReadyForPlacementID: / showRewardedVideoWithPlacementID:scene:inViewController:
// 插屏:    loadADWithPlacementID:extra: / interstitialReadyForPlacementID: / showInterstitialWithPlacementID:scene:inViewController:
// 开屏:    loadADWithPlacementID:extra:containerView: / splashReadyForPlacementID: / showSplashWithPlacementID:scene:window:inViewController:extra:
// 横幅:    loadADWithPlacementID:extra: / bannerAdReadyForPlacementID: / retrieveBannerViewForPlacementID:scene:
// 原生:    loadADWithPlacementID:extra: / nativeAdReadyForPlacementID: / getNativeAdOfferWithPlacementID:scene:`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosTopOnTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - TopOn 广告聚合组件接入】

步骤 1: 添加 Pod 依赖
- 前往 TopOn SDK 下载页面选择需要的广告平台并生成接入代码: https://portal.toponad.com/m/sdk/download
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加 TopOn 核心 SDK（版本锁定 6.3.50）、各平台 Adapter 及 pod 'RXTopOnSDK'

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 配置 Info.plist（如集成 Admob）
- 添加 GADApplicationIdentifier 与 GADIsAdManagerApp，否则 Admob 会导致 crash

步骤 4: 添加初始化代码
- 在 AppDelegate.m 的 didFinishLaunchingWithOptions 中初始化（确保用户已同意《隐私政策》）:
  [[RXTopOnInitManager sharedSDK] startWithAppID:@"your TopOn AppId" appKey:@"your TopOn AppKey" error:nil];

步骤 5: 按需接入广告
- 激励视频、插屏、开屏、横幅、原生广告均通过 [RXTopOnATAdManager sharedSDK] 加载与展示

【可用广告类型】
- 激励视频（手动 / 全自动加载）
- 插屏广告（手动 / 全自动加载）
- 开屏广告
- 横幅广告
- 原生广告

【重要提醒】
- TopOn 为独立组件，使用 RXTopOnInitManager 初始化，不依赖瑞雪主 SDK
- 必须确保用户同意《隐私政策》之后再初始化
- TopOn 自动生成的 Pod 依赖必须将版本号统一锁定为 6.3.50（部分 Adapter 为 6.3.50.x）
- 仅支持 iOS 13 及以上版本
- 所有广告类型都需设置 loadingDelegate 及各自专属代理
- 禁止在 didFailToLoadADWithPlacementID 回调中执行加载方法重试
- 上线前需关闭 setLogEnabled 并移除 integrationChecking 调用`

	return nil, struct {
		Instructions  string `json:"instructions"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		PodDependency: podDependency,
		InitCode:      initCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSDNSHandler DNS 组件库接入
func IOSDNSHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Provider      string `json:"provider"`      // ali(阿里云) 或 tencent(腾讯云)
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
	},
) (*mcp.CallToolResult, struct {
	Instructions  string `json:"instructions"`
	Provider      string `json:"provider"`
	PodDependency string `json:"podDependency"`
	InitCode      string `json:"initCode"`
	ConfigCode    string `json:"configCode"`
	FullSpec      string `json:"fullSpec"`
}, error) {

	provider := input.Provider
	workspacePath := input.WorkspacePath

	// ==================== 必填参数检查：provider ====================
	// 如果没有提供 provider 参数，返回提示让用户选择
	if provider == "" {
		return nil, struct {
			Instructions  string `json:"instructions"`
			Provider      string `json:"provider"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			ConfigCode    string `json:"configCode"`
			FullSpec      string `json:"fullSpec"`
		}{
			Instructions: `❌ 【错误：缺少必填参数 provider】

DNS 组件库需要选择服务商，请先询问用户：

【你现在必须询问用户】
"请选择要接入的 DNS 服务商：
1. 阿里云 DNS (ali) - 阿里云 HTTPDNS 服务，提供域名解析加速
2. 腾讯云 DNS (tencent) - 腾讯云 HTTPDNS 服务，提供域名解析加速

⚠️ 注意：两种 DNS 只需选择其一接入，不要同时接入"

【用户选择后调用示例】
阿里云 DNS：ios feature=dns provider=ali workspacePath=/path/to/project
腾讯云 DNS：ios feature=dns provider=tencent workspacePath=/path/to/project`,
		}, nil
	}

	var providerName string
	var podDependency string
	var initCode string

	if provider == "tencent" {
		providerName = "腾讯云"
		podDependency = "pod 'RXTecentCloudDNSSDK'"
		initCode = `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXTecentCloudDNSSDK/RXTecentCloudDNSSDKService.h>

// 初始化腾讯云 DNS（必须在瑞雪 SDK 初始化之前）
[[RXTecentCloudDNSSDKService sharedSDK] initWithAppID:@"your appID" 
                                                dnsID:@"your dnsID" 
                                               dnsKey:@"your dnsKey" 
                                                debug:YES];`
	} else if provider == "ali" {
		providerName = "阿里云"
		podDependency = "pod 'RXAliCloudDNSSDK'"
		initCode = `// 在瑞雪 SDK 初始化之前添加以下代码
#import <RXAliCloudDNSSDK/RXAliCloudDNSSDKService.h>

// 初始化阿里云 DNS（必须在瑞雪 SDK 初始化之前）
[[RXAliCloudDNSSDKService sharedSDK] initWithAccountID:@"your account id" 
                                             secretKey:@"your secretKey" 
                                                 debug:YES];`
	} else {
		// 无效的 provider 参数
		return nil, struct {
			Instructions  string `json:"instructions"`
			Provider      string `json:"provider"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			ConfigCode    string `json:"configCode"`
			FullSpec      string `json:"fullSpec"`
		}{
			Instructions: `❌ 【错误：无效的 provider 参数】

provider 参数值 "` + provider + `" 无效，只支持以下两种：
- ali: 阿里云 DNS
- tencent: 腾讯云 DNS

【调用示例】
阿里云 DNS：ios feature=dns provider=ali workspacePath=/path/to/project
腾讯云 DNS：ios feature=dns provider=tencent workspacePath=/path/to/project`,
		}, nil
	}

	configCode := `// 在 RXSdkInitConfig 中添加
config.isUseDNS = YES;`

	// 获取完整模板内容
	var buf bytes.Buffer
	if err := iosDNSTpl.Execute(&buf, nil); err != nil {
		return nil, struct {
			Instructions  string `json:"instructions"`
			Provider      string `json:"provider"`
			PodDependency string `json:"podDependency"`
			InitCode      string `json:"initCode"`
			ConfigCode    string `json:"configCode"`
			FullSpec      string `json:"fullSpec"`
		}{}, err
	}

	podfilePath := workspacePath + "/Podfile"
	if workspacePath == "" {
		podfilePath = "项目根目录/Podfile"
	}

	instructions := `【你现在必须执行以下操作 - ` + providerName + ` DNS 接入】

步骤 1: 添加 Pod 依赖
- 编辑 Podfile 文件: ` + podfilePath + `
- 在 target 块中添加: ` + podDependency + `

步骤 2: 执行 pod install
- 工作目录: ` + workspacePath + `
- 命令: pod install
- 如果失败尝试: pod install --repo-update

步骤 3: 添加初始化代码
- 在 AppDelegate.m 中，瑞雪 SDK 初始化之前添加 DNS 初始化代码
- 参考 initCode 中的代码

步骤 4: 修改瑞雪 SDK 配置
- 在 RXSdkInitConfig 中添加: config.isUseDNS = YES;

【重要提醒】
- DNS 初始化必须在瑞雪 SDK 初始化之前
- 参数（accountID/secretKey 或 appID/dnsID/dnsKey）从对应云服务商后台获取
- debug 参数正式发布时请设为 NO`

	return nil, struct {
		Instructions  string `json:"instructions"`
		Provider      string `json:"provider"`
		PodDependency string `json:"podDependency"`
		InitCode      string `json:"initCode"`
		ConfigCode    string `json:"configCode"`
		FullSpec      string `json:"fullSpec"`
	}{
		Instructions:  instructions,
		Provider:      provider,
		PodDependency: podDependency,
		InitCode:      initCode,
		ConfigCode:    configCode,
		FullSpec:      buf.String(),
	}, nil
}

// IOSOpeninstallHandler Openinstall 组件库接入
func IOSOpeninstallHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Region              string `json:"region"`              // domestic(国内) 或 overseas(海外)
		WorkspacePath       string `json:"workspacePath"`       // iOS 项目工作目录
		TargetName          string `json:"targetName"`          // Xcode Target 名称（用于生成 entitlements 文件路径）
		UniversalLinkDomain string `json:"universalLinkDomain"` // Universal Link 域名（必填）
		AppKey              string `json:"appKey"`              // Openinstall APP_KEY（必填）
	},
) (*mcp.CallToolResult, struct {
	Instructions       string `json:"instructions"`
	Region             string `json:"region"`
	TargetName         string `json:"targetName"`
	TargetAutoDetected bool   `json:"targetAutoDetected"`
	PodDependency      string `json:"podDependency"`
	InitCode           string `json:"initCode"`
	AutoConfigResult   string `json:"autoConfigResult"`
	InfoPlistPath      string `json:"infoPlistPath"`
	EntitlementsPath   string `json:"entitlementsPath"`
}, error) {

	region := input.Region
	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	universalLinkDomain := input.UniversalLinkDomain
	appKey := input.AppKey

	// ==================== 步骤 1: 检查基础库是否已接入 ====================
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions       string `json:"instructions"`
			Region             string `json:"region"`
			TargetName         string `json:"targetName"`
			TargetAutoDetected bool   `json:"targetAutoDetected"`
			PodDependency      string `json:"podDependency"`
			InitCode           string `json:"initCode"`
			AutoConfigResult   string `json:"autoConfigResult"`
			InfoPlistPath      string `json:"infoPlistPath"`
			EntitlementsPath   string `json:"entitlementsPath"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	var regionName string
	var podDependency string
	var sdkImport string
	var sdkClass string

	if region == "overseas" {
		regionName = "海外"
		podDependency = "pod 'RXOpeninstallOSSDK'"
		sdkImport = "#import <RXOpeninstallOSSDK/RXOpeninstallOSService.h>"
		sdkClass = "RXOpeninstallOSService"
	} else {
		region = "domestic"
		regionName = "国内"
		podDependency = "pod 'RXOpeninstallSDK'"
		sdkImport = "#import <RXOpeninstallSDK/RXOpeninstallService.h>"
		sdkClass = "RXOpeninstallService"
	}

	// 处理 Universal Link 域名（移除 https:// 前缀）
	domainPlaceholder := "your-universallink-domain"
	if universalLinkDomain != "" {
		// 清理域名格式
		domain := universalLinkDomain
		if len(domain) > 8 && domain[:8] == "https://" {
			domain = domain[8:]
		}
		if len(domain) > 7 && domain[:7] == "http://" {
			domain = domain[7:]
		}
		// 移除尾部斜杠
		for len(domain) > 0 && domain[len(domain)-1] == '/' {
			domain = domain[:len(domain)-1]
		}
		domainPlaceholder = domain
	}

	// 处理 APP_KEY
	appKeyPlaceholder := "your-app-key"
	if appKey != "" {
		appKeyPlaceholder = appKey
	}

	// 处理 Target 名称：优先使用用户提供的，其次从工作目录自动获取
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		// 尝试从工作目录自动获取 target 名称
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	// ==================== 自动配置逻辑 ====================
	var autoConfigResult strings.Builder
	var infoPlistPath string
	var entitlementsPathResult string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 Universal Link: %s\n", domainPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🔑 APP_KEY: %s\n\n", appKeyPlaceholder))

	// 1. 复用或创建指定 Target 的 entitlements，再添加 Associated Domains
	entitlementsRelativePath := targetPlaceholder + "/" + targetPlaceholder + ".entitlements"
	resolvedPath, _, pbxModified, entitlementsModified, err := updateAndBindTargetEntitlements(
		workspacePath,
		targetPlaceholder,
		entitlementsRelativePath,
		func(path string) (bool, error) {
			return addDomainToEntitlements(path, domainPlaceholder)
		},
	)
	if err != nil {
		autoConfigResult.WriteString(fmt.Sprintf("❌ 解析或绑定 entitlements 失败: %v\n", err))
	} else {
		entitlementsPathResult = resolvedPath
		if entitlementsModified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 Associated Domain 到: %s\n", entitlementsPathResult))
			autoConfigResult.WriteString(fmt.Sprintf("   Associated Domain: applinks:%s\n", domainPlaceholder))
		} else {
			autoConfigResult.WriteString("ℹ️  entitlements 已包含 Associated Domain\n")
		}
		if pbxModified {
			autoConfigResult.WriteString("✅ 已修改指定 Target 的 CODE_SIGN_ENTITLEMENTS\n")
		} else {
			autoConfigResult.WriteString("ℹ️  指定 Target 已绑定 CODE_SIGN_ENTITLEMENTS\n")
		}
	}

	autoConfigResult.WriteString("\n")

	// 3. 修改 Info.plist 添加 APP_KEY 和 URL Types
	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - com.ruixue.APP_KEY: %s\n", appKeyPlaceholder))
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", appKeyPlaceholder))
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 添加 APP_KEY
		if modified, err := addAppKeyToInfoPlist(infoPlistPath, appKeyPlaceholder); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 com.ruixue.APP_KEY 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 com.ruixue.APP_KEY: %s\n", appKeyPlaceholder))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含 com.ruixue.APP_KEY\n")
		}

		// 添加 URL Types
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, appKeyPlaceholder); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", appKeyPlaceholder))
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含该 URL Scheme\n")
		}
	}

	autoConfigResult.WriteString("\n【重要提醒】\n")
	autoConfigResult.WriteString("- 请在 Apple Developer 后台为 App ID 开启 Associated Domains 能力\n")
	autoConfigResult.WriteString("- 请在 Apple Developer 后台为 App ID 开启 Sign in with Apple 能力\n")
	autoConfigResult.WriteString("- 自动配置完成后，建议在 Xcode 中验证配置是否正确\n")

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	podfilePath := workspacePath + "/Podfile"

	// 生成初始化代码（根据 region 动态生成）
	initCode := `// ========== Openinstall 初始化（必须在瑞雪 SDK 初始化之前）==========
` + sdkImport + `

// 在 AppDelegate.m 的 application:didFinishLaunchingWithOptions: 中
// 【重要】必须在瑞雪 SDK 初始化之前调用
[[` + sdkClass + ` sharedSDK] regist];

// 然后再初始化瑞雪 SDK
// [[RXSDK sharedSDK] initWithConfig:config complete:^(...)];`

	instructions := `Openinstall 组件接入 - ` + regionName + `环境 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成，无需手动操作：
- Associated Domains (entitlements 文件): applinks:` + domainPlaceholder + `
- APP_KEY (Info.plist): ` + appKeyPlaceholder + `
- URL Types (Info.plist)
- project.pbxproj CODE_SIGN_ENTITLEMENTS 引用

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
编辑 Podfile: ` + podfilePath + `
添加: ` + podDependency + `

然后执行：cd ` + workspacePath + ` && pod install

【步骤 2】修改 AppDelegate.m
在 AppDelegate.m 中添加初始化代码：

` + initCode + `

⚠️ [[` + sdkClass + ` sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用！

【步骤 3】Apple Developer 后台配置（用户需手动完成）
- 登录 Apple Developer 后台
- 为 App ID 开启 "Associated Domains" 能力
- 这一步无法自动完成，需要用户手动操作

【配置信息汇总】
- Universal Link 域名: ` + domainPlaceholder + `
- APP_KEY: ` + appKeyPlaceholder + `
- entitlements 文件: ` + entitlementsPathResult

	return nil, struct {
		Instructions       string `json:"instructions"`
		Region             string `json:"region"`
		TargetName         string `json:"targetName"`
		TargetAutoDetected bool   `json:"targetAutoDetected"`
		PodDependency      string `json:"podDependency"`
		InitCode           string `json:"initCode"`
		AutoConfigResult   string `json:"autoConfigResult"`
		InfoPlistPath      string `json:"infoPlistPath"`
		EntitlementsPath   string `json:"entitlementsPath"`
	}{
		Instructions:       instructions,
		Region:             region,
		TargetName:         targetPlaceholder,
		TargetAutoDetected: targetAutoDetected,
		PodDependency:      podDependency,
		InitCode:           initCode,
		AutoConfigResult:   autoConfigResult.String(),
		InfoPlistPath:      infoPlistPath,
		EntitlementsPath:   entitlementsPathResult,
	}, nil
}

// ==================== iOS Wechat Config Handler ====================

// generateWxInitCode 生成微信初始化代码（引用自 init.tpl 的 wx_init 定义）
// wx_init:
//
//	class: RXWXService
//	singleton: sharedSDK
//	method: "configUniversallink:"
//	import: "#import <RXWXSDK/RXWXSDK.h>"
//	pod: "pod 'RXWXSDK'"
//	note: "必须在瑞雪 SDK 初始化之前调用"
func generateWxInitCode(universalLink string) string {
	return `// ========== AppDelegate.m 完整示例（含微信配置）==========
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXWXSDK/RXWXSDK.h>  // 微信 SDK
#import <RXUIKit/RXUIKitService.h>  // 国内 UI 组件

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // ========== 步骤 1: 微信配置（必须在瑞雪 SDK 初始化之前！）==========
    [[RXWXService sharedSDK] configUniversallink:@"` + universalLink + `"];
    
    // ========== 步骤 2: 初始化 UI 组件（必须在瑞雪 SDK 初始化之前！）==========
    [[RXUIKitService sharedSDK] regist];
    
    // ========== 步骤 3: 瑞雪 SDK 初始化 ==========
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.cpId = @"YOUR_CP_ID";
    config.productId = @"YOUR_PRODUCT_ID";
    config.channelId = @"YOUR_CHANNEL_ID";
    config.baseUrlList = @[@"https://api.example.com/"];
    config.launchOptions = launchOptions;
    
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"SDK 初始化失败: %@", error.responesObject);
        } else {
            NSLog(@"SDK 初始化成功: %@", response);
        }
    }];
    
    return YES;
}`
}

// IOSWechatConfigHandler 微信配置接入
func IOSWechatConfigHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"` // iOS 项目工作目录
		TargetName    string `json:"targetName"`    // Xcode Target 名称（可选）
		WechatAppID   string `json:"wechatAppId"`   // 微信 AppID（必填）
		UniversalLink string `json:"universalLink"` // 微信 Universal Link（必填）
	},
) (*mcp.CallToolResult, struct {
	Instructions     string `json:"instructions"`
	InitCode         string `json:"initCode"`
	AutoConfigResult string `json:"autoConfigResult"`
	InfoPlistPath    string `json:"infoPlistPath"`
	EntitlementsPath string `json:"entitlementsPath"`
	WechatAppID      string `json:"wechatAppId"`
	UniversalLink    string `json:"universalLink"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName
	wechatAppID := input.WechatAppID
	universalLink := input.UniversalLink

	// ==================== 必填参数检查 ====================
	// 如果缺少必填参数，返回提示信息要求 AI 询问用户
	var missingParams []string
	if workspacePath == "" {
		missingParams = append(missingParams, "workspacePath（iOS 项目路径，用于自动配置 entitlements 和 Info.plist）")
	}
	if wechatAppID == "" {
		missingParams = append(missingParams, "wechatAppId（微信 AppID，从微信开放平台获取）")
	}
	if universalLink == "" {
		missingParams = append(missingParams, "universalLink（微信 Universal Link，从微信开放平台获取）")
	}

	if len(missingParams) > 0 {
		// 返回错误信息，强制 AI 询问用户
		return nil, struct {
			Instructions     string `json:"instructions"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			EntitlementsPath string `json:"entitlementsPath"`
			WechatAppID      string `json:"wechatAppId"`
			UniversalLink    string `json:"universalLink"`
		}{
			Instructions: fmt.Sprintf(`❌ 【错误：缺少必填参数，无法继续自动配置】

微信配置需要以下参数：

%s

【你现在必须做的事情】
1. 停止所有代码修改操作
2. 询问用户提供以上缺失的参数
3. 用户提供参数后，使用完整参数重新调用此工具

【参数说明】
- workspacePath: iOS 项目根目录路径（包含 .xcodeproj 的目录）
- wechatAppId: 从微信开放平台 (https://open.weixin.qq.com) 获取的 AppID
- universalLink: 微信开放平台配置的 Universal Link，格式如 https://your-domain.com/app/

【调用示例】
ios feature=wechat_config workspacePath=/Users/xxx/项目路径 wechatAppId=wxXXXXXXXX universalLink=https://domain.com/app/`, func() string {
				var s string
				for i, p := range missingParams {
					s += fmt.Sprintf("%d. %s\n", i+1, p)
				}
				return s
			}()),
		}, nil
	}

	// ==================== 步骤 2: 检查基础库是否已接入 ====================
	hasBaseLib, baseLibError := checkIOSBaseLibrary(workspacePath)
	if !hasBaseLib {
		return nil, struct {
			Instructions     string `json:"instructions"`
			InitCode         string `json:"initCode"`
			AutoConfigResult string `json:"autoConfigResult"`
			InfoPlistPath    string `json:"infoPlistPath"`
			EntitlementsPath string `json:"entitlementsPath"`
			WechatAppID      string `json:"wechatAppId"`
			UniversalLink    string `json:"universalLink"`
		}{
			Instructions: baseLibError,
		}, nil
	}

	// 处理 Target 名称：优先使用用户提供的，其次从工作目录自动获取
	targetPlaceholder := "YourAppTarget"
	targetAutoDetected := false
	if targetName != "" {
		targetPlaceholder = targetName
	} else if workspacePath != "" {
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetPlaceholder = detected
			targetAutoDetected = true
		}
	}

	// 微信 AppID（已验证非空）
	wechatAppIDPlaceholder := wechatAppID

	// Universal Link（已验证非空）
	universalLinkPlaceholder := universalLink

	// 从 Universal Link 提取域名（用于 Associated Domains）
	// 处理方式与 Openinstall 一致：移除 https:// 前缀和尾部路径
	wechatDomain := universalLink
	if len(wechatDomain) > 8 && wechatDomain[:8] == "https://" {
		wechatDomain = wechatDomain[8:]
	}
	if len(wechatDomain) > 7 && wechatDomain[:7] == "http://" {
		wechatDomain = wechatDomain[7:]
	}
	// 移除路径部分，只保留域名
	if slashIdx := strings.Index(wechatDomain, "/"); slashIdx != -1 {
		wechatDomain = wechatDomain[:slashIdx]
	}
	// 移除尾部斜杠
	for len(wechatDomain) > 0 && wechatDomain[len(wechatDomain)-1] == '/' {
		wechatDomain = wechatDomain[:len(wechatDomain)-1]
	}

	// ==================== 自动配置逻辑（与 Openinstall 一致）====================
	var autoConfigResult strings.Builder
	var infoPlistPath string
	var entitlementsPathResult string

	autoConfigResult.WriteString("【自动配置结果】\n\n")
	autoConfigResult.WriteString(fmt.Sprintf("📁 工作目录: %s\n", workspacePath))
	autoConfigResult.WriteString(fmt.Sprintf("🎯 Target: %s\n", targetPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("📱 微信 AppID: %s\n", wechatAppIDPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🔗 Universal Link: %s\n", universalLinkPlaceholder))
	autoConfigResult.WriteString(fmt.Sprintf("🌐 Universal Link 域名: %s\n\n", wechatDomain))

	entitlementsRelativePath := targetPlaceholder + "/" + targetPlaceholder + ".entitlements"
	resolvedPath, _, pbxModified, _, err := updateAndBindTargetEntitlements(
		workspacePath,
		targetPlaceholder,
		entitlementsRelativePath,
		func(path string) (bool, error) {
			domainModified, err := addDomainToEntitlements(path, wechatDomain)
			if err != nil {
				return false, err
			}
			appleModified, err := addSignInWithAppleToEntitlements(path)
			return domainModified || appleModified, err
		},
	)
	if err != nil {
		autoConfigResult.WriteString(fmt.Sprintf("❌ 解析或绑定 entitlements 失败: %v\n", err))
	} else {
		entitlementsPathResult = resolvedPath
		autoConfigResult.WriteString(fmt.Sprintf("📝 entitlements 目标路径: %s\n", entitlementsPathResult))
		autoConfigResult.WriteString(fmt.Sprintf("✅ 已确保 Associated Domain: applinks:%s\n", wechatDomain))
		autoConfigResult.WriteString("✅ 已确保 Sign in with Apple 位于同一 entitlements\n")
		if pbxModified {
			autoConfigResult.WriteString("✅ 已修改指定 Target 的 CODE_SIGN_ENTITLEMENTS\n")
		} else {
			autoConfigResult.WriteString("ℹ️  指定 Target 已绑定 CODE_SIGN_ENTITLEMENTS\n")
		}
	}

	autoConfigResult.WriteString("\n")

	// 3. 修改 Info.plist 添加 URL Types 和 LSApplicationQueriesSchemes（与 Openinstall 添加 APP_KEY 类似）
	infoPlistPath = findInfoPlistPath(workspacePath, targetPlaceholder)
	if infoPlistPath == "" {
		autoConfigResult.WriteString("❌ 未找到 Info.plist 文件\n")
		autoConfigResult.WriteString("   请检查项目结构，手动添加以下配置:\n")
		autoConfigResult.WriteString(fmt.Sprintf("   - URL Types Scheme: %s\n", wechatAppIDPlaceholder))
		autoConfigResult.WriteString("   - LSApplicationQueriesSchemes: wechat, weixin, weixinULAPI, weixinURLParamsAPI\n")
	} else {
		autoConfigResult.WriteString(fmt.Sprintf("📄 找到 Info.plist: %s\n", infoPlistPath))

		// 添加 URL Types（微信 AppID 作为 Scheme）
		if modified, err := addURLTypesToInfoPlist(infoPlistPath, wechatAppIDPlaceholder); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 URL Types 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString(fmt.Sprintf("✅ 已添加 URL Types (Scheme: %s)\n", wechatAppIDPlaceholder))
		} else {
			autoConfigResult.WriteString(fmt.Sprintf("ℹ️  Info.plist 已包含 URL Scheme: %s\n", wechatAppIDPlaceholder))
		}

		// 添加 LSApplicationQueriesSchemes
		wechatSchemes := []string{"wechat", "weixin", "weixinULAPI", "weixinURLParamsAPI"}
		if modified, err := addLSApplicationQueriesToInfoPlist(infoPlistPath, wechatSchemes); err != nil {
			autoConfigResult.WriteString(fmt.Sprintf("❌ 添加 LSApplicationQueriesSchemes 失败: %v\n", err))
		} else if modified {
			autoConfigResult.WriteString("✅ 已添加 LSApplicationQueriesSchemes:\n")
			for _, scheme := range wechatSchemes {
				autoConfigResult.WriteString(fmt.Sprintf("   - %s\n", scheme))
			}
		} else {
			autoConfigResult.WriteString("ℹ️  Info.plist 已包含所有微信相关的 LSApplicationQueriesSchemes\n")
		}
	}

	autoConfigResult.WriteString("\n【重要提醒】\n")
	autoConfigResult.WriteString("- 请在 Apple Developer 后台为 App ID 开启 Associated Domains 能力\n")
	autoConfigResult.WriteString("- 请在 Apple Developer 后台为 App ID 开启 Sign in with Apple 能力\n")
	autoConfigResult.WriteString("- 微信 Universal Link 与 Openinstall Universal Link 是不同的域名！\n")
	autoConfigResult.WriteString("- 自动配置完成后，建议在 Xcode 中验证配置是否正确\n")

	// 生成初始化代码（引用自 init.tpl 的 wx_init.code_full_example）
	initCode := generateWxInitCode(universalLinkPlaceholder)

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetPlaceholder + `）`
	} else if targetName != "" {
		targetInfo = `（` + targetPlaceholder + `）`
	} else {
		targetInfo = `（未检测到，请确认 Target 名称）`
	}

	instructions := `【微信配置接入 - 自动配置完成】` + targetInfo + `

✅ 以下工程配置已自动完成，无需手动操作：
- Associated Domains (entitlements 文件)
- URL Types (Info.plist)
- LSApplicationQueriesSchemes (Info.plist)
- project.pbxproj CODE_SIGN_ENTITLEMENTS 引用

` + autoConfigResult.String() + `

================== 你需要执行的操作 ==================

【步骤 1】添加 Pod 依赖
在 Podfile 中添加：
pod 'RXWXSDK'

然后执行：cd ` + workspacePath + ` && pod install

【步骤 2】修改 AppDelegate.m
按照以下代码修改 AppDelegate.m：

` + initCode + `

⚠️ 【重要：调用顺序】
[[RXWXService sharedSDK] configUniversallink:] 必须在 [[RXSDK sharedSDK] initWithConfig:] 之前调用！

【步骤 3】Apple Developer 后台配置（用户需手动完成）
- 登录 Apple Developer 后台
- 为 App ID 开启 "Associated Domains" 能力
- 这一步无法自动完成，需要用户手动操作

【配置信息汇总】
- 微信 AppID: ` + wechatAppIDPlaceholder + `
- Universal Link: ` + universalLinkPlaceholder + `
- Universal Link 域名: ` + wechatDomain + `
- entitlements 文件: ` + entitlementsPathResult + `
- ⚠️ 微信 Universal Link 与 Openinstall Universal Link 是不同的域名！`

	return nil, struct {
		Instructions     string `json:"instructions"`
		InitCode         string `json:"initCode"`
		AutoConfigResult string `json:"autoConfigResult"`
		InfoPlistPath    string `json:"infoPlistPath"`
		EntitlementsPath string `json:"entitlementsPath"`
		WechatAppID      string `json:"wechatAppId"`
		UniversalLink    string `json:"universalLink"`
	}{
		Instructions:     instructions,
		InitCode:         initCode,
		AutoConfigResult: autoConfigResult.String(),
		InfoPlistPath:    infoPlistPath,
		EntitlementsPath: entitlementsPathResult,
		WechatAppID:      wechatAppIDPlaceholder,
		UniversalLink:    universalLinkPlaceholder,
	}, nil
}

// ==================== iOS Setup Handler ====================

// IOSSetupHandler 返回 iOS 项目自动化接入的直接执行指令
func IOSSetupHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		WorkspacePath string `json:"workspacePath"`
		TargetName    string `json:"targetName"`
		Region        string `json:"region"` // domestic(国内) 或 overseas(海外)
	},
) (*mcp.CallToolResult, struct {
	Instructions       string `json:"instructions"`
	PodfileContent     string `json:"podfileContent"`
	PodfilePath        string `json:"podfilePath"`
	Commands           string `json:"commands"`
	Region             string `json:"region"`
	TargetName         string `json:"targetName"`
	TargetAutoDetected bool   `json:"targetAutoDetected"`
	PlistContent       string `json:"plistContent"`
	InitCode           string `json:"initCode"`
}, error) {

	workspacePath := input.WorkspacePath
	targetName := input.TargetName

	// 自动检测 target 名称
	targetAutoDetected := false
	if targetName == "" {
		// 尝试从工作目录自动获取 target 名称
		if detected := findXcodeprojTarget(workspacePath); detected != "" {
			targetName = detected
			targetAutoDetected = true
		} else {
			targetName = "YourAppTarget" // 默认占位符
		}
	}

	region := input.Region

	// ==================== 必填参数检查 ====================
	// 如果缺少 region，返回提示信息要求 AI 询问用户
	if region == "" {
		return nil, struct {
			Instructions       string `json:"instructions"`
			PodfileContent     string `json:"podfileContent"`
			PodfilePath        string `json:"podfilePath"`
			Commands           string `json:"commands"`
			Region             string `json:"region"`
			TargetName         string `json:"targetName"`
			TargetAutoDetected bool   `json:"targetAutoDetected"`
			PlistContent       string `json:"plistContent"`
			InitCode           string `json:"initCode"`
		}{
			Instructions: `❌ 【错误：缺少环境配置参数】

请先询问用户选择环境类型：

1. domestic（国内环境）
   - 使用 RXUIKit UI 组件库
   - 适用于中国大陆地区发布的应用

2. overseas（海外环境）
   - 使用 RXOSUIKit UI 组件库
   - 适用于海外地区发布的应用

【你现在必须做的事情】
1. 询问用户：项目是发布到国内还是海外？
2. 用户回答后，使用对应的 region 参数重新调用

【调用示例】
国内环境：ios feature=setup workspacePath=/path/to/project region=domestic
海外环境：ios feature=setup workspacePath=/path/to/project region=overseas`,
		}, nil
	}

	podfilePath := workspacePath + "/Podfile"

	// 根据环境生成不同的依赖和代码
	var uiKitDependency string
	var regionDesc string
	var uiKitImport string
	var uiKitClass string
	var plistContent string
	if region == "overseas" {
		uiKitDependency = "pod 'RXOSUIKit'  # 海外 UI 组件库"
		regionDesc = "海外"
		uiKitImport = "#import <RXOSUIKit/RXOSUIKitService.h>"
		uiKitClass = "RXOSUIKitService"
		plistContent = `<!-- Ruixue SDK Privacy Permissions (Overseas) -->
<key>NSCameraUsageDescription</key>
<string>Allow access to the camera?</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow access to the microphone?</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Allow saving photos to your photo library?</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow access to your photo library?</string>
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>`
	} else {
		region = "domestic"
		uiKitDependency = "pod 'RXUIKit'  # 国内 UI 组件库"
		regionDesc = "国内"
		uiKitImport = "#import <RXUIKit/RXUIKitService.h>"
		uiKitClass = "RXUIKitService"
		plistContent = `<!-- 瑞雪 SDK 隐私权限配置（国内环境） -->
<key>NSCameraUsageDescription</key>
<string>是否允许使用相机</string>
<key>NSMicrophoneUsageDescription</key>
<string>是否允许使用麦克风</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>是否允许保存到相册</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>是否允许访问相册</string>
<key>NSUserTrackingUsageDescription</key>
<string>此标识符将用于向您推荐个性化广告。</string>`
	}

	// 生成 target 名称说明
	var targetInfo string
	if targetAutoDetected {
		targetInfo = `（已自动检测: ` + targetName + `）`
	} else if input.TargetName != "" {
		targetInfo = ``
	} else {
		targetInfo = `（占位符，请确认实际 Target 名称）`
	}

	// 生成 Podfile 内容
	podfileContent := `platform :ios, '12.0'
source 'https://github.com/CocoaPods/Specs.git'

target '` + targetName + `' do
  use_frameworks!
  
  # ========== 瑞雪 SDK 依赖（` + regionDesc + `环境）==========
  # 核心库
  pod 'RXSDK_Pure'
  # UI 组件库
  ` + uiKitDependency + `
  # ========== 瑞雪 SDK 依赖 END ==========
  
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
    end
  end
end
`

	// 生成完整的初始化代码
	initCode := `// ========== AppDelegate.m 完整示例 ==========
#import <RXSDK_Pure/RXSDK_Pure.h>
` + uiKitImport + `

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // ========== UI 组件初始化（必须在瑞雪 SDK 初始化之前！）==========
    [[` + uiKitClass + ` sharedSDK] regist];
    
    // ========== 瑞雪 SDK 初始化 ==========
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.cpId = @"YOUR_CP_ID";                       // CP 唯一 ID（必须，从瑞雪后台获取）
    config.productId = @"YOUR_PRODUCT_ID";             // 应用 ID（必须，从瑞雪后台获取）
    config.channelId = @"YOUR_CHANNEL_ID";             // 渠道 ID（必须，从瑞雪后台获取）
    config.baseUrlList = @[@"https://api.example.com/"]; // 域名列表（必须）
    config.launchOptions = launchOptions;              // 启动参数
    // config.usePrivacy = YES;                        // 是否展示隐私授权页面
    
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"SDK 初始化失败: %@", error.responesObject);
        } else {
            NSLog(@"SDK 初始化成功: %@", response);
        }
    }];
    
    return YES;
}

#pragma mark - URL Scheme 回调（必须实现）

// 处理 URL Scheme 回调（微信、支付宝等第三方登录/支付回调）
- (BOOL)application:(UIApplication *)app 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
    [[RXSDK sharedSDK] application:app openURL:url options:options];
    return YES;
}

#pragma mark - Universal Link 回调（必须实现）

// 处理 Universal Link 回调（微信、Openinstall 等通用链接跳转）
- (BOOL)application:(UIApplication *)application 
        continueUserActivity:(NSUserActivity *)userActivity 
        restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    [[RXSDK sharedSDK] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    return YES;
}

@end`

	return nil, struct {
		Instructions       string `json:"instructions"`
		PodfileContent     string `json:"podfileContent"`
		PodfilePath        string `json:"podfilePath"`
		Commands           string `json:"commands"`
		Region             string `json:"region"`
		TargetName         string `json:"targetName"`
		TargetAutoDetected bool   `json:"targetAutoDetected"`
		PlistContent       string `json:"plistContent"`
		InitCode           string `json:"initCode"`
	}{
		Instructions: `【瑞雪 SDK 基础库接入指南 - ` + regionDesc + `环境】

Target: ` + targetName + targetInfo + `

================== 步骤 1：配置 Podfile ==================

创建/编辑 Podfile 文件：` + podfilePath + `
使用下方 podfileContent 中的内容

================== 步骤 2：执行 pod install ==================

cd ` + workspacePath + ` && pod install

如果失败，执行：pod install --repo-update

⚠️ 完成后使用 .xcworkspace 文件打开项目（不是 .xcodeproj）

================== 步骤 3：配置 Info.plist ==================

在 Info.plist 中添加隐私权限（右键 → Open As → Source Code）：

` + plistContent + `

================== 步骤 4：添加 AppDelegate 初始化代码 ==================

在 AppDelegate.m 中添加初始化代码（见 initCode 字段）

================== 重要说明 ==================

1. cpId、productId、channelId 从瑞雪后台获取
2. baseUrlList 填写瑞雪提供的域名地址
3. 【必须实现】application:openURL:options: 方法（用于微信/支付宝等回调）
4. 【必须实现】application:continueUserActivity:restorationHandler: 方法（用于 Universal Link 回调）
5. UI 组件初始化必须在 SDK initWithConfig 之前执行

================== 后续操作 ==================

基础库配置完成后，可以接入其他组件：
- ios feature=openinstall  → OpenInstall 归因
- ios feature=wechat_config → 微信登录/分享
- ios feature=passport → 用户通行证
- ios feature=iap → 内购支付
- 等等...`,

		PodfileContent:     podfileContent,
		PodfilePath:        podfilePath,
		Commands:           "cd " + workspacePath + " && pod install",
		Region:             region,
		TargetName:         targetName,
		TargetAutoDetected: targetAutoDetected,
		PlistContent:       plistContent,
		InitCode:           initCode,
	}, nil
}

// ==================== iOS 统一 Handler ====================

// 工具描述前置条件
const iosPrerequisite = "【前置条件】使用前必须确保 SDK 已初始化，请先检查项目中是否有初始化代码（搜索 RXSdkInitConfig 或 initWithConfig:complete:），如未初始化请先调用 ios feature=setup 和 ios feature=init。"

// IOSUnifiedHandler 统一处理所有 iOS 功能请求
func IOSUnifiedHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input struct {
		Feature              string `json:"feature"`
		Region               string `json:"region"`
		WorkspacePath        string `json:"workspacePath"`
		TargetName           string `json:"targetName"`
		Provider             string `json:"provider"`
		UniversalLinkDomain  string `json:"universalLinkDomain"`
		AppKey               string `json:"appKey"`
		WechatAppId          string `json:"wechatAppId"`
		UniversalLink        string `json:"universalLink"`
		GIDClientID          string `json:"gidClientId"`
		GoogleURLScheme      string `json:"googleUrlScheme"`
		FacebookAppID        string `json:"facebookAppId"`
		FacebookClientToken  string `json:"facebookClientToken"`
		LineChannelID        string `json:"lineChannelId"`
		ZaloAppID            string `json:"zaloAppId"`
		TikTokAppID          string `json:"tiktokAppId"`
		InstagramClientID    string `json:"instagramClientId"`
		InstagramRedirectURI string `json:"instagramRedirectUri"`
		RedditClientID       string `json:"redditClientId"`
		RedditRedirectURI    string `json:"redditRedirectUri"`
	},
) (*mcp.CallToolResult, map[string]any, error) {
	feature := input.Feature

	// ==================== 基础配置检查 ====================
	// 定义不需要检查基础配置的 feature（它们本身就是基础配置或需要在 SDK 初始化之前配置）
	baseFeatures := map[string]bool{
		"init":           true,
		"setup":          true,
		"project_config": true,
		// 以下组件需要在 SDK 初始化之前配置，所以不检查基础配置
		"openinstall":    true,
		"wechat_config":  true,
		"dns":            true,
		"gpm":            true,
		"bytedance_ad":   true,
		"gdt":            true,
		"tencent_ad":     true,
		"adjust":         true,
		"firebase":       true,
		"asa":            true,
		"game_center":    true,
		"google":         true,
		"facebook":       true,
		"line":           true,
		"zalo":           true,
		"tiktok":         true,
		"instagram":      true,
		"reddit":         true,
		"topon":          true,
		"xingyi_payment": true,
		"unifypay":       true,
		"huya":           true,
		"baidu":          true,
		// Apple Capability 必须显式调用专用工程配置 feature。
		"apple_signin_config": true,
		// LBS 同时包含 RXLBSKit 高德定位与 RXSDK 社交 LBS，由专用 preflight 统一检查。
		"lbs": true,
	}

	// 如果不是基础配置 feature，则检查基础配置是否完成
	if !baseFeatures[feature] && input.WorkspacePath != "" {
		missingConfigs := checkIOSBaseConfig(input.WorkspacePath)
		if len(missingConfigs) > 0 {
			promptMsg := `【iOS 基础配置检查 - 未完成】

⚠️ 在接入「` + feature + `」功能之前，请先完成以下基础配置：

`
			for i, config := range missingConfigs {
				promptMsg += fmt.Sprintf("%d. %s\n", i+1, config)
			}
			promptMsg += `
【基础配置步骤】
1. 首先调用 ios feature=setup 配置 Pod 依赖并执行 pod install
2. 然后调用 ios feature=init 获取初始化代码
3. 将初始化代码添加到 AppDelegate.m 中，包括:
   - didFinishLaunchingWithOptions 中的 SDK 初始化
   - application:openURL:options: URL Scheme 回调
   - application:continueUserActivity:restorationHandler: Universal Link 回调

请先完成基础配置后，再接入「` + feature + `」功能。`

			return nil, map[string]any{
				"error":          "base_config_missing",
				"instructions":   promptMsg,
				"missingConfigs": missingConfigs,
			}, nil
		}
	}

	switch feature {
	case "init":
		result, output, err := IOSInitHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"code": output.Code, "dependencyHint": output.DependencyHint}, nil

	case "setup":
		result, output, err := IOSSetupHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
			Region        string `json:"region"`
		}{WorkspacePath: input.WorkspacePath, TargetName: input.TargetName, Region: input.Region})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions":       output.Instructions,
			"podfileContent":     output.PodfileContent,
			"podfilePath":        output.PodfilePath,
			"commands":           output.Commands,
			"region":             output.Region,
			"targetName":         output.TargetName,
			"targetAutoDetected": output.TargetAutoDetected,
			"plistContent":       output.PlistContent,
			"initCode":           output.InitCode,
		}, nil

	case "project_config":
		result, output, err := IOSProjectConfigHandler(ctx, req, struct {
			Region string `json:"region"`
		}{Region: input.Region})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions": output.Instructions,
			"plistContent": output.PlistContent,
			"fullSpec":     output.FullSpec,
			"podConfig":    output.PodConfig,
			"initCode":     output.InitCode,
		}, nil

	case "passport":
		result, output, err := IOSPassportHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosPassportPreflight(input.WorkspacePath),
		}, nil

	case "apple_signin_config":
		result, output, err := IOSAppleSigninConfigHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosAppleSigninConfigPreflight(input.WorkspacePath, input.TargetName),
		}, nil

	case "captcha":
		result, output, err := IOSCaptchaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "real_auth":
		result, output, err := IOSRealAuthHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosIifaaRealAuthPreflight(input.WorkspacePath),
		}, nil

	case "account_binding":
		result, output, err := IOSAccountBindingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "password":
		result, output, err := IOSPasswordHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "deregister":
		result, output, err := IOSDeregisterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_area":
		result, output, err := IOSGameAreaHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "game_character":
		result, output, err := IOSGameCharacterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosGameCharacterPreflight(input.WorkspacePath),
		}, nil

	case "iap":
		result, output, err := IOSIapHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "xingyi_payment":
		mode, modeErr := xingyiPaymentModeFromRequest(req)
		if modeErr != "" {
			return nil, map[string]any{"error": modeErr}, nil
		}
		var buf bytes.Buffer
		if err := iosXingYiPaymentTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":        buf.String(),
			"usage":       "iOS 不支持星驿支付，不生成支付调用",
			"supported":   false,
			"paymentMode": mode,
			"preflight":   iosXingYiPaymentPreflight(input.WorkspacePath),
		}, nil

	case "unifypay":
		var buf bytes.Buffer
		if err := iosUnifypayTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "iOS 不支持 Android 银联综合支付插件，不生成伪接口",
			"supported": false,
			"preflight": iosUnifypayPreflight(input.WorkspacePath),
		}, nil

	case "huya":
		var buf bytes.Buffer
		if err := iosHuyaTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "iOS 不支持虎牙联运，不生成登录、支付、初始化或角色上报伪接口",
			"supported": false,
			"preflight": iosHuyaPreflight(input.WorkspacePath),
		}, nil

	case "baidu":
		var buf bytes.Buffer
		if err := iosBaiduTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "iOS 不支持百度游戏渠道，不生成初始化、闪屏、登录、支付、角色上报、悬浮窗或退出伪接口",
			"supported": false,
			"preflight": iosBaiduPreflight(input.WorkspacePath),
		}, nil

	case "xuteng":
		var buf bytes.Buffer
		if err := iosXutengTpl.Execute(&buf, nil); err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"spec":      buf.String(),
			"usage":     "iOS 不支持栩腾渠道，不生成初始化、登录、支付、角色上报、登出或退出伪接口",
			"supported": false,
			"preflight": iosXutengPreflight(input.WorkspacePath),
		}, nil

	case "share":
		result, output, err := IOSShareHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		responseSchema, err := operationAPIResponseSchemaReference("v1/operationapi/share/data")
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosSharePreflight(input.WorkspacePath),
			"responseSchemas": map[string]any{
				"getShareData": responseSchema,
				"getShareInfo": responseSchema,
			},
		}, nil

	case "feedback":
		result, output, err := IOSFeedbackHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "tracking":
		result, output, err := IOSTrackingHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "legal_ui":
		result, output, err := IOSLegalUIHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "promo":
		result, output, err := IOSPromoHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "announcement":
		result, output, err := IOSAnnouncementHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "device":
		result, output, err := IOSDeviceHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "version_check":
		result, output, err := IOSVersionCheckHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosVersionCheckPreflight(input.WorkspacePath),
		}, nil

	case "store_review":
		result, output, err := IOSStoreReviewHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "lbs":
		result, output, err := IOSLbsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"spec":      output.Spec,
			"usage":     output.Usage,
			"initCheck": output.InitCheck,
			"preflight": iosLbsPreflight(input.WorkspacePath, input.TargetName),
		}, nil

	case "friends":
		result, output, err := IOSFriendsHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "rank":
		result, output, err := IOSRankHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "social":
		result, output, err := IOSSocialHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "user_center":
		result, output, err := IOSUserCenterHandler(ctx, req, struct{}{})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{"spec": output.Spec, "usage": output.Usage, "initCheck": output.InitCheck}, nil

	case "dns":
		result, output, err := IOSDNSHandler(ctx, req, struct {
			Provider      string `json:"provider"`
			WorkspacePath string `json:"workspacePath"`
		}{Provider: input.Provider, WorkspacePath: input.WorkspacePath})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions":  output.Instructions,
			"provider":      output.Provider,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"configCode":    output.ConfigCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "openinstall":
		result, output, err := IOSOpeninstallHandler(ctx, req, struct {
			Region              string `json:"region"`
			WorkspacePath       string `json:"workspacePath"`
			TargetName          string `json:"targetName"`
			UniversalLinkDomain string `json:"universalLinkDomain"`
			AppKey              string `json:"appKey"`
		}{
			Region:              input.Region,
			WorkspacePath:       input.WorkspacePath,
			TargetName:          input.TargetName,
			UniversalLinkDomain: input.UniversalLinkDomain,
			AppKey:              input.AppKey,
		})
		if err != nil {
			return nil, nil, err
		}
		return result, map[string]any{
			"instructions":       output.Instructions,
			"region":             output.Region,
			"targetName":         output.TargetName,
			"targetAutoDetected": output.TargetAutoDetected,
			"podDependency":      output.PodDependency,
			"initCode":           output.InitCode,
			"autoConfigResult":   output.AutoConfigResult,
			"infoPlistPath":      output.InfoPlistPath,
			"entitlementsPath":   output.EntitlementsPath,
		}, nil

	case "wechat_config":
		_, output, err := IOSWechatConfigHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
			WechatAppID   string `json:"wechatAppId"`
			UniversalLink string `json:"universalLink"`
		}{
			WorkspacePath: input.WorkspacePath,
			TargetName:    input.TargetName,
			WechatAppID:   input.WechatAppId,
			UniversalLink: input.UniversalLink,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"entitlementsPath": output.EntitlementsPath,
			"wechatAppId":      output.WechatAppID,
			"universalLink":    output.UniversalLink,
		}, nil

	case "gpm":
		_, output, err := IOSGPMHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "bytedance_ad":
		_, output, err := IOSBytedanceAdHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "gdt", "tencent_ad":
		_, output, err := IOSTencentAdHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
			"preflight":     iosGDTPreflight(input.WorkspacePath),
		}, nil

	case "adjust":
		_, output, err := IOSAdjustHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "firebase":
		_, output, err := IOSFirebaseHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "asa":
		_, output, err := IOSASAHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "game_center":
		_, output, err := IOSGameCenterHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
		}{
			WorkspacePath: input.WorkspacePath,
			TargetName:    input.TargetName,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"entitlementsPath": output.EntitlementsPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "google":
		_, output, err := IOSGoogleHandler(ctx, req, struct {
			WorkspacePath   string `json:"workspacePath"`
			TargetName      string `json:"targetName"`
			GIDClientID     string `json:"gidClientId"`
			GoogleURLScheme string `json:"googleUrlScheme"`
		}{
			WorkspacePath:   input.WorkspacePath,
			TargetName:      input.TargetName,
			GIDClientID:     input.GIDClientID,
			GoogleURLScheme: input.GoogleURLScheme,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "facebook":
		_, output, err := IOSFacebookHandler(ctx, req, struct {
			WorkspacePath       string `json:"workspacePath"`
			TargetName          string `json:"targetName"`
			FacebookAppID       string `json:"facebookAppId"`
			FacebookClientToken string `json:"facebookClientToken"`
		}{
			WorkspacePath:       input.WorkspacePath,
			TargetName:          input.TargetName,
			FacebookAppID:       input.FacebookAppID,
			FacebookClientToken: input.FacebookClientToken,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "line":
		_, output, err := IOSLineHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
			LineChannelID string `json:"lineChannelId"`
		}{
			WorkspacePath: input.WorkspacePath,
			TargetName:    input.TargetName,
			LineChannelID: input.LineChannelID,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "zalo":
		_, output, err := IOSZaloHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
			ZaloAppID     string `json:"zaloAppId"`
		}{
			WorkspacePath: input.WorkspacePath,
			TargetName:    input.TargetName,
			ZaloAppID:     input.ZaloAppID,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "tiktok":
		_, output, err := IOSTikTokHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
			TargetName    string `json:"targetName"`
			TikTokAppID   string `json:"tiktokAppId"`
		}{
			WorkspacePath: input.WorkspacePath,
			TargetName:    input.TargetName,
			TikTokAppID:   input.TikTokAppID,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":     output.Instructions,
			"podDependency":    output.PodDependency,
			"initCode":         output.InitCode,
			"autoConfigResult": output.AutoConfigResult,
			"infoPlistPath":    output.InfoPlistPath,
			"fullSpec":         output.FullSpec,
		}, nil

	case "instagram":
		_, output, err := IOSInstagramHandler(ctx, req, struct {
			WorkspacePath        string `json:"workspacePath"`
			InstagramClientID    string `json:"instagramClientId"`
			InstagramRedirectURI string `json:"instagramRedirectUri"`
		}{
			WorkspacePath:        input.WorkspacePath,
			InstagramClientID:    input.InstagramClientID,
			InstagramRedirectURI: input.InstagramRedirectURI,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "reddit":
		_, output, err := IOSRedditHandler(ctx, req, struct {
			WorkspacePath     string `json:"workspacePath"`
			RedditClientID    string `json:"redditClientId"`
			RedditRedirectURI string `json:"redditRedirectUri"`
		}{
			WorkspacePath:     input.WorkspacePath,
			RedditClientID:    input.RedditClientID,
			RedditRedirectURI: input.RedditRedirectURI,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	case "topon":
		_, output, err := IOSTopOnHandler(ctx, req, struct {
			WorkspacePath string `json:"workspacePath"`
		}{
			WorkspacePath: input.WorkspacePath,
		})
		if err != nil {
			return nil, nil, err
		}
		return nil, map[string]any{
			"instructions":  output.Instructions,
			"podDependency": output.PodDependency,
			"initCode":      output.InitCode,
			"fullSpec":      output.FullSpec,
		}, nil

	default:
		return nil, map[string]any{"error": "未知的功能模块: " + feature}, nil
	}
}

// ==================== iOS 工具注册 ====================

func registerIOSTools(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "ios",
			Description: mcpToolCallRequirement + `

iOS SDK 代码生成工具。根据 feature 参数生成不同功能模块的代码。

【可用功能模块 (feature)】
基础接入:
- init: SDK 初始化代码
- setup: 自动化接入（CocoaPods 配置）
- project_config: 工程配置（Info.plist 隐私权限）

用户通行证:
- passport: 登录/注册/指定用户信息
- captcha: 验证码（手机/邮箱）
- real_auth: 实名认证 / 支付宝 IIFAA 实名
- account_binding: 账号绑定（第三方账号/手机/邮箱）
- password: 密码管理
- deregister: 账号注销

游戏功能:
- game_area: 游戏区服
- game_character: 游戏角色
- iap: 内购支付
- xingyi_payment: 星驿支付（iOS 明确不支持，仅返回说明与结构化 preflight）
- unifypay: 银联综合支付（iOS 明确不支持，仅返回说明与结构化 preflight）
- huya: 虎牙联运（iOS 明确不支持，不生成伪接口）
- baidu: 百度游戏渠道（iOS 明确不支持，不生成伪接口）
- xuteng: 栩腾渠道（iOS 明确不支持，不生成伪接口）

社交功能:
- share: 分享
- feedback: 反馈/客服
- lbs: 高德设备定位工程配置（RXLBSKit 4.0.0+）+ 瑞雪社交 LBS
- friends: 好友管理
- rank: 排行榜
- social: 社交关系

其他功能:
- tracking: 数据埋点
- legal_ui: 法务 UI（协议页面、隐私政策弹窗）
- promo: 达人福利
- announcement: 公告/邮件
- device: 设备信息
- version_check: 瑞雪版本检查 v2（updateGameVersionWithInfo）
- store_review: App Store 评分
- user_center: 用户中心/帮助中心/客服

组件库接入:
- apple_signin_config: Sign in with Apple 工程配置（显式调用，不影响普通 passport）
- dns: DNS 组件库（阿里云/腾讯云）
- openinstall: Openinstall 组件库
- wechat_config: 微信配置
- gpm: 性能分析（GPM）组件
- bytedance_ad: 广告投放（字节/巨量广告）
- gdt: 腾讯广告 GDT/广点通（RXGDTSDK 1.0.2 + RXSDK_Pure 4.0.8）
- tencent_ad: gdt 兼容别名
- adjust: Adjust 归因分析
- firebase: Firebase Analytics
- asa: ASA（Apple Search Ads）
- game_center: GameCenter（排行榜/成就）
- google: Google 登录
- facebook: Facebook 登录/分享
- line: Line 登录/分享
- zalo: Zalo 登录/分享
- tiktok: TikTok 登录/分享
- instagram: Instagram 登录/分享
- reddit: Reddit 登录
- topon: TopOn（AnyThink）广告聚合（激励视频/插屏/开屏/横幅/原生）

【参数说明】
- feature: 必填，功能模块名称
- paymentMode: 星驿支付模式 app/h5/both，默认 both（iOS 均不支持）
- region: 环境类型 domestic(国内)/overseas(海外)，setup/project_config/openinstall 需要
- workspacePath: 项目路径，setup/passport/game_character/apple_signin_config/lbs/dns/openinstall/wechat_config/gdt 需要
- targetName: Xcode Target 名称（apple_signin_config 必填；其他支持该参数的功能可自动检测）
- provider: DNS 服务商 ali/tencent，dns 功能需要
- universalLinkDomain: Universal Link 域名，openinstall 需要
- appKey: Openinstall APP_KEY，openinstall 需要
- wechatAppId: 【必填】微信 AppID，wechat_config 必须提供，从微信开放平台获取
- universalLink: 【必填】微信 Universal Link，wechat_config 必须提供，从微信开放平台获取
- gidClientId: 【必填】Google Client ID，google 必须提供，从 Google Cloud Console 获取
- googleUrlScheme: 【必填】Google iOS 网址架构（反向客户端 ID），google 必须提供
- facebookAppId: 【必填】Facebook App ID，facebook 必须提供，从 Facebook 开发者后台获取
- facebookClientToken: 【必填】Facebook Client Token，facebook 必须提供
- lineChannelId: 【必填】Line Channel ID，line 必须提供，从 Line 开发者后台获取
- zaloAppId: 【必填】Zalo App ID，zalo 必须提供，纯数字或 zalo- 前缀均可
- tiktokAppId: 【必填】TikTok App ID，tiktok 必须提供
- instagramClientId: 【必填】Instagram Client ID，instagram 必须提供
- instagramRedirectUri: 【必填】Instagram Redirect URI，instagram 必须提供
- redditClientId: 【必填】Reddit Client ID，reddit 必须提供
- redditRedirectUri: 【必填】Reddit Redirect URI，reddit 必须提供`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"feature": map[string]any{
						"type":        "string",
						"description": "要生成的功能模块",
						"enum": []string{
							"init", "setup", "project_config",
							"passport", "captcha", "real_auth", "account_binding", "password", "deregister",
							"game_area", "game_character", "iap", "xingyi_payment", "unifypay", "huya", "baidu", "xuteng",
							"share", "feedback", "lbs", "friends", "rank", "social",
							"tracking", "legal_ui", "promo", "announcement", "device", "version_check", "store_review",
							"apple_signin_config", "dns", "openinstall", "wechat_config", "gpm", "bytedance_ad", "gdt", "tencent_ad", "user_center", "adjust", "firebase", "asa", "game_center", "google", "facebook", "line", "zalo", "tiktok", "instagram", "reddit", "topon",
						},
					},
					"region": map[string]any{
						"type":        "string",
						"description": "环境类型：domestic(国内) 或 overseas(海外)",
						"enum":        []string{"domestic", "overseas"},
					},
					"workspacePath": map[string]any{
						"type":        "string",
						"description": "iOS 项目工作目录的绝对路径",
					},
					"paymentMode": map[string]any{
						"type":        "string",
						"description": "星驿支付模式，默认 both；iOS 不支持任何模式",
						"enum":        []string{"app", "h5", "both"},
						"default":     "both",
					},
					"targetName": map[string]any{
						"type":        "string",
						"description": "Xcode Target 名称（可选，自动从 .xcodeproj 获取）",
					},
					"provider": map[string]any{
						"type":        "string",
						"description": "DNS 服务商：ali(阿里云) 或 tencent(腾讯云)",
						"enum":        []string{"ali", "tencent"},
					},
					"universalLinkDomain": map[string]any{
						"type":        "string",
						"description": "Universal Link 域名（openinstall 需要）",
					},
					"appKey": map[string]any{
						"type":        "string",
						"description": "Openinstall APP_KEY（openinstall 需要）",
					},
					"wechatAppId": map[string]any{
						"type":        "string",
						"description": "【必填】微信 AppID，从微信开放平台获取（wechat_config 必须提供）",
					},
					"universalLink": map[string]any{
						"type":        "string",
						"description": "【必填】微信 Universal Link，从微信开放平台获取（wechat_config 必须提供）",
					},
					"gidClientId": map[string]any{
						"type":        "string",
						"description": "【必填】Google Client ID，从 Google Cloud Console 获取（google 必须提供）",
					},
					"googleUrlScheme": map[string]any{
						"type":        "string",
						"description": "【必填】Google iOS 网址架构（反向客户端 ID），从 Google 后台凭据获取（google 必须提供）",
					},
					"facebookAppId": map[string]any{
						"type":        "string",
						"description": "【必填】Facebook App ID，从 Facebook 开发者后台获取（facebook 必须提供）",
					},
					"facebookClientToken": map[string]any{
						"type":        "string",
						"description": "【必填】Facebook Client Token，从 Facebook 开发者后台获取（facebook 必须提供）",
					},
					"lineChannelId": map[string]any{
						"type":        "string",
						"description": "【必填】Line Channel ID，从 Line 开发者后台获取（line 必须提供）",
					},
					"zaloAppId": map[string]any{
						"type":        "string",
						"description": "【必填】Zalo App ID，从 Zalo 开发者后台获取（zalo 必须提供，纯数字或 zalo- 前缀均可）",
					},
					"tiktokAppId": map[string]any{
						"type":        "string",
						"description": "【必填】TikTok App ID，从 TikTok 开发者后台获取（tiktok 必须提供）",
					},
					"instagramClientId": map[string]any{
						"type":        "string",
						"description": "【必填】Instagram Client ID，从 Instagram/Meta 开发者后台获取（instagram 必须提供）",
					},
					"instagramRedirectUri": map[string]any{
						"type":        "string",
						"description": "【必填】Instagram Redirect URI，在 Instagram/Meta 开发者后台配置（instagram 必须提供）",
					},
					"redditClientId": map[string]any{
						"type":        "string",
						"description": "【必填】Reddit Client ID，从 Reddit 开发者后台获取（reddit 必须提供）",
					},
					"redditRedirectUri": map[string]any{
						"type":        "string",
						"description": "【必填】Reddit Redirect URI，在 Reddit 开发者后台配置（reddit 必须提供）",
					},
				},
				"required": []string{"feature"},
			},
		},
		IOSUnifiedHandler,
	)
}
