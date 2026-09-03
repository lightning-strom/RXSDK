package rxsdk

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

const (
	unityAndroidPropertiesBegin = "# ========== RuiXue SDK Properties BEGIN =========="
	unityAndroidPropertiesEnd   = "# ========== RuiXue SDK Properties END =========="
)

func resolveUnityAndroidApplicationID(workspacePath, explicit string) string {
	if value := strings.TrimSpace(explicit); value != "" {
		return value
	}
	content, err := os.ReadFile(filepath.Join(workspacePath, "ProjectSettings", "ProjectSettings.asset"))
	if err != nil {
		return ""
	}
	match := regexp.MustCompile(`(?m)^\s+Android:\s*([A-Za-z_][A-Za-z0-9_.]*)\s*$`).FindStringSubmatch(string(content))
	if len(match) == 2 {
		return match[1]
	}
	return ""
}

func isValidUnityAndroidApplicationID(applicationID string) bool {
	return regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+$`).MatchString(applicationID)
}

func upsertUnityAndroidManifest(path, applicationID string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	content := ""
	if err != nil {
		content = defaultUnityRuiXueAndroidManifest(applicationID)
	} else {
		content = string(contentBytes)
	}

	manifestTagRe := regexp.MustCompile(`(?s)<manifest\b[^>]*>`)
	manifestTag := manifestTagRe.FindString(content)
	if manifestTag == "" {
		result.Missing = append(result.Missing, "AndroidManifest.xml 缺少 manifest 根节点")
		return
	}
	updatedTag := upsertXMLAttribute(manifestTag, "package", applicationID)
	if !strings.Contains(updatedTag, "xmlns:tools=") {
		updatedTag = strings.TrimSuffix(updatedTag, ">") + ` xmlns:tools="http://schemas.android.com/tools">`
	}
	updated := manifestTagRe.ReplaceAllString(content, updatedTag)

	applicationTagRe := regexp.MustCompile(`(?s)<application\b[^>]*>`)
	applicationTag := applicationTagRe.FindString(updated)
	if applicationTag == "" {
		result.Missing = append(result.Missing, "AndroidManifest.xml 缺少 application 节点")
		return
	}
	updated = applicationTagRe.ReplaceAllString(updated,
		upsertXMLAttribute(applicationTag, "android:name", "com.ruixue.openapi.RXApplication"))

	activityTagRe := regexp.MustCompile(`(?s)<activity\b[^>]*android:name\s*=\s*["'][^"']*UnityPlayerActivity["'][^>]*>`)
	activityTag := activityTagRe.FindString(updated)
	if activityTag == "" {
		result.Missing = append(result.Missing, "AndroidManifest.xml 未找到 UnityPlayerActivity，请确认 Custom Main Manifest 使用自定义 Activity")
		return
	}
	updated = activityTagRe.ReplaceAllString(updated,
		upsertXMLAttribute(activityTag, "android:name", applicationID+".UnityPlayerActivity"))

	if updated == content && err == nil {
		return
	}
	writeUnityAndroidProjectFile(path, content, updated, "configured package, RXApplication and UnityPlayerActivity", result)
}

func upsertXMLAttribute(tag, name, value string) string {
	re := regexp.MustCompile(`\s+` + regexp.QuoteMeta(name) + `\s*=\s*["'][^"']*["']`)
	attribute := fmt.Sprintf(` %s="%s"`, name, value)
	if re.MatchString(tag) {
		return re.ReplaceAllString(tag, attribute)
	}
	return strings.TrimSuffix(tag, ">") + attribute + ">"
}

func defaultUnityRuiXueAndroidManifest(applicationID string) string {
	return fmt.Sprintf(`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="%s">
    <application android:name="com.ruixue.openapi.RXApplication">
        <activity
            android:name="%s.UnityPlayerActivity"
            android:exported="true"
            android:theme="@style/UnityThemeSelector">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="unityplayer.UnityActivity" android:value="true" />
        </activity>
    </application>
</manifest>
`, applicationID, applicationID)
}

func upsertUnityPlayerActivity(path, applicationID string, result *PassportPreflightResult) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		result.Missing = append(result.Missing,
			"缺少 Assets/Plugins/Android/UnityPlayerActivity.java：请先导出 Android 工程，将 unityLibrary/src/main/java/<包名>/UnityPlayerActivity.java 复制到该目录后重试")
		return
	}
	content := string(contentBytes)
	updated := regexp.MustCompile(`(?m)^\s*package\s+[^;]+;`).ReplaceAllString(content, "package "+applicationID+";")
	if !strings.Contains(updated, "import com.ruixue.RuiXueSdk;") {
		packageRe := regexp.MustCompile(`(?m)^package\s+[^;]+;\s*$`)
		updated = packageRe.ReplaceAllString(updated, "$0\n\nimport com.ruixue.RuiXueSdk;")
	}

	lifecycleCalls := []struct {
		superCall string
		sdkCall   string
	}{
		{"super.onCreate(savedInstanceState);", "RuiXueSdk.onCreate(this);"},
		{"super.onStart();", "RuiXueSdk.onStart(this);"},
		{"super.onRestart();", "RuiXueSdk.onRestart(this);"},
		{"super.onResume();", "RuiXueSdk.onResume(this);"},
		{"super.onPause();", "RuiXueSdk.onPause(this);"},
		{"super.onStop();", "RuiXueSdk.onStop(this);"},
		{"super.onActivityResult(requestCode, resultCode, data);", "RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);"},
		{"super.onConfigurationChanged(newConfig);", "RuiXueSdk.onConfigurationChanged(this, newConfig);"},
		{"super.onRequestPermissionsResult(requestCode, permissions, grantResults);", "RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);"},
	}
	for _, call := range lifecycleCalls {
		updated = moveJavaCallAfterSuper(updated, call.superCall, call.sdkCall)
	}
	updated = upsertUnityOnNewIntent(updated)

	if updated == content {
		return
	}
	writeUnityAndroidProjectFile(path, content, updated, "configured package and RuiXue lifecycle forwarding", result)
}

func moveJavaCallAfterSuper(content, superCall, sdkCall string) string {
	if !strings.Contains(content, superCall) {
		return content
	}
	callLineRe := regexp.MustCompile(`(?m)^\s*` + regexp.QuoteMeta(sdkCall) + `\s*\n?`)
	content = callLineRe.ReplaceAllString(content, "")
	return strings.Replace(content, superCall, superCall+"\n        "+sdkCall, 1)
}

func upsertUnityOnNewIntent(content string) string {
	signatureRe := regexp.MustCompile(`(?m)(onNewIntent\s*\(\s*Intent\s+([A-Za-z_][A-Za-z0-9_]*)\s*\)\s*\{)`)
	match := signatureRe.FindStringSubmatch(content)
	if len(match) != 3 {
		return content
	}
	intentName := match[2]
	superCall := "super.onNewIntent(" + intentName + ");"
	sdkCall := "RuiXueSdk.onNewIntent(this, " + intentName + ");"
	content = regexp.MustCompile(`(?m)^\s*RuiXueSdk\.onNewIntent\(this,\s*[A-Za-z_][A-Za-z0-9_]*\);\s*\n?`).ReplaceAllString(content, "")
	if strings.Contains(content, superCall) {
		return strings.Replace(content, superCall, superCall+"\n        "+sdkCall, 1)
	}
	return strings.Replace(content, match[1], match[1]+"\n        "+superCall+"\n        "+sdkCall, 1)
}

func upsertUnityAndroidGradleProperties(path, channel string, result *PassportPreflightResult) {
	lines := []string{
		unityAndroidPropertiesBegin,
		"android.useAndroidX=true",
		"android.enableJetifier=true",
	}
	if channel == "rxsdk_ysdk" {
		lines = append(lines, "android.useNewApkCreator=false")
	}
	if channel == "rxsdk_vivo" || channel == "rxsdk_oppo" {
		lines = append(lines, "android.injected.testOnly=false")
	}
	lines = append(lines, unityAndroidPropertiesEnd)
	block := strings.Join(lines, "\n")

	contentBytes, err := os.ReadFile(path)
	content := ""
	if err == nil {
		content = string(contentBytes)
	}
	managedRe := regexp.MustCompile(`(?s)` + regexp.QuoteMeta(unityAndroidPropertiesBegin) + `.*?` + regexp.QuoteMeta(unityAndroidPropertiesEnd))
	updated := content
	if managedRe.MatchString(updated) {
		updated = managedRe.ReplaceAllString(updated, block)
	} else {
		if strings.TrimSpace(updated) != "" && !strings.HasSuffix(updated, "\n") {
			updated += "\n"
		}
		updated += block + "\n"
	}
	if updated == content && err == nil {
		return
	}
	writeUnityAndroidProjectFile(path, content, updated, "configured AndroidX and channel Gradle properties", result)
}

func writeUnityAndroidProjectFile(path, original, updated, note string, result *PassportPreflightResult) {
	_ = original
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("创建目录失败 %s: %v", filepath.Dir(path), err))
		return
	}
	if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("写入 %s 失败: %v", path, err))
		return
	}
	result.Modified = append(result.Modified, path+": "+note)
}
