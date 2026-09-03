# iOS 工程配置规范

## 概述

iOS SDK 功能开发常涉及以下工程配置，本文档定义标准配置方式。

---

## 一、配置类型总览

| 配置类型 | 文件/位置 | 常见场景 |
|----------|-----------|----------|
| Pod 依赖 | Podfile | 第三方库接入 |
| Info.plist | Info.plist | 权限、URL Scheme、自定义 Key |
| Associated Domains | .entitlements | Universal Link、App Clip |
| Sign in with Apple | .entitlements | 苹果登录 |
| URL Types | Info.plist / Xcode | Scheme 唤醒 |
| Capabilities | Xcode Project | Apple 服务能力 |

---

## 二、Pod 依赖配置

### 2.1 添加依赖

```ruby
# Podfile
target 'YourApp' do
  use_frameworks!
  
  # 基础库（必须）
  pod 'RXSDK_Pure'
  
  # 可选组件
  pod 'RXFeatureSDK'           # 功能组件
  pod 'RXWXSDKCode'            # 微信 SDK
  pod 'RXOpeninstallSDK'       # Openinstall（国内）
  pod 'RXOpeninstallOSSDK'     # Openinstall（海外）
end
```

### 2.2 自动化添加

```go
// Go 代码示例
func addPodDependency(workspacePath, podName string) error {
    podfilePath := filepath.Join(workspacePath, "Podfile")
    content, err := os.ReadFile(podfilePath)
    if err != nil {
        return err
    }
    
    // 检查是否已存在
    if strings.Contains(string(content), podName) {
        return nil // 已存在
    }
    
    // 在 target 块中添加
    // ...
}
```

---

## 三、Info.plist 配置

### 3.1 自定义 Key

```xml
<!-- 添加自定义配置 -->
<key>com.ruixue.APP_KEY</key>
<string>YOUR_APP_KEY</string>

<key>com.ruixue.FEATURE_CONFIG</key>
<dict>
    <key>param1</key>
    <string>value1</string>
</dict>
```

### 3.2 URL Types 配置

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.yourapp.scheme</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yourapp</string>
            <string>wx1234567890</string>
        </array>
    </dict>
</array>
```

### 3.3 权限配置

```xml
<!-- 相机 -->
<key>NSCameraUsageDescription</key>
<string>用于拍照上传</string>

<!-- 相册 -->
<key>NSPhotoLibraryUsageDescription</key>
<string>用于选择图片</string>

<!-- 网络 -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>

<!-- ATT (iOS 14+) -->
<key>NSUserTrackingUsageDescription</key>
<string>用于个性化推荐</string>
```

### 3.4 自动化修改

```go
// Go 代码示例 - 添加 Info.plist Key
func addInfoPlistKey(plistPath, key string, value interface{}) error {
    // 使用 plist 库读取和修改
    // ...
}

// 添加 URL Types
func addURLTypesToInfoPlist(plistPath, scheme string) (bool, error) {
    // ...
}
```

---

## 四、Associated Domains 配置

### 4.1 Entitlements 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:your-domain.com</string>
        <string>applinks:another-domain.com</string>
    </array>
</dict>
</plist>
```

### 4.2 创建 Entitlements 文件

```go
func createEntitlementsFile(path, domain string) error {
    content := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:%s</string>
    </array>
</dict>
</plist>`, domain)
    
    return os.WriteFile(path, []byte(content), 0644)
}
```

### 4.3 修改 pbxproj 引用

```go
func modifyPbxprojForEntitlements(workspacePath, targetName, entitlementsPath string) (bool, error) {
    // 在 project.pbxproj 中添加 CODE_SIGN_ENTITLEMENTS
    // ...
}
```

---

## 五、Sign in with Apple 配置

配置方式与 Associated Domains 一致：使用同一份 `.entitlements` 文件，在同一文件中增加对应 key，并在 Xcode 中通过同一处 **Signing & Capabilities** 引用该 entitlements 文件。

### 5.1 Entitlements 文件格式

```xml
<key>com.apple.developer.applesignin</key>
<array>
    <string>Default</string>
</array>
```

### 5.2 添加方式

- 新建 entitlements 时：与 Associated Domains 一起写入（同一 `<dict>` 内多组 key）。
- 已有 entitlements 时：在 `</dict>` 前追加上述 key 与 array，若已存在 `com.apple.developer.applesignin` 则不再添加。
- 无需单独修改 pbxproj，与 Associated Domains 共用同一 `CODE_SIGN_ENTITLEMENTS` 引用。
- 请在 Apple Developer 后台为 App ID 开启 **Sign in with Apple** 能力。

---

## 六、配置模式参考

### 6.1 Openinstall 模式

完整配置流程：Pod + Info.plist + URL Types + Associated Domains

```
【Openinstall 接入配置】

1. Pod 依赖
   pod 'RXOpeninstallSDK'        # 国内
   pod 'RXOpeninstallOSSDK'      # 海外

2. Info.plist
   - com.ruixue.APP_KEY: 从后台获取
   
3. URL Types
   - Scheme: 与 APP_KEY 相同
   
4. Associated Domains
   - applinks:your-universallink-domain

5. 代码初始化
   [[RXOpeninstallService sharedSDK] regist];
   // 必须在 RXSDK 初始化之前
```

### 6.2 微信模式

配置流程：Pod + Universal Link

```
【微信接入配置】

1. Pod 依赖
   pod 'RXWXSDKCode'

2. Universal Link
   配置微信开放平台的 Universal Link

3. 代码配置
   [[RXWXService sharedSDK] configUniversallink:@"your-universal-link"];
   // 必须在 RXSDK 初始化之前
```

### 6.3 自动配置输出格式

```
【自动配置结果】

📁 工作目录: /path/to/project
🎯 Target: YourApp
🔗 Universal Link: your-domain.com
🔑 APP_KEY: your_app_key

✅ 已创建 entitlements 文件: /path/to/YourApp.entitlements
   Associated Domain: applinks:your-domain.com
✅ 已修改 project.pbxproj 添加 CODE_SIGN_ENTITLEMENTS
📄 找到 Info.plist: /path/to/Info.plist
✅ 已添加 com.ruixue.APP_KEY: your_app_key
✅ 已添加 URL Types (Scheme: your_app_key)

【重要提醒】
- 请在 Apple Developer 后台为 App ID 开启 Associated Domains 能力
- 自动配置完成后，建议在 Xcode 中验证配置是否正确
```

---

## 七、回调处理配置

### 7.1 AppDelegate 回调

```objc
// Universal Link 回调
- (BOOL)application:(UIApplication *)application 
    continueUserActivity:(NSUserActivity *)userActivity 
    restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *))restorationHandler {
    
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
        NSURL *url = userActivity.webpageURL;
        // SDK 自动处理
    }
    return YES;
}

// URL Scheme 回调
- (BOOL)application:(UIApplication *)app 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    // SDK 自动处理
    return YES;
}
```

### 7.2 SceneDelegate 回调 (iOS 13+)

```objc
// Universal Link
- (void)scene:(UIScene *)scene 
    continueUserActivity:(NSUserActivity *)userActivity {
    // SDK 自动处理
}

// URL Scheme
- (void)scene:(UIScene *)scene 
    openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts {
    // SDK 自动处理
}
```

---

## 八、检查清单

```
iOS 工程配置检查清单：[功能名]

[ ] Pod 依赖
    [ ] Podfile 添加依赖
    [ ] pod install 执行成功
    
[ ] Info.plist
    [ ] 添加必要的 Key
    [ ] 配置 URL Types（如需要）
    [ ] 配置权限说明（如需要）
    
[ ] Associated Domains（如需要）
    [ ] 创建/更新 entitlements 文件
    [ ] pbxproj 添加引用
    [ ] Apple Developer 后台开启能力
    
[ ] Sign in with Apple（如需要）
    [ ] 创建/更新 entitlements 文件（与 Associated Domains 同文件）
    [ ] Apple Developer 后台开启 Sign in with Apple 能力
    
[ ] 回调处理
    [ ] AppDelegate 添加回调方法
    [ ] SceneDelegate 添加回调方法（iOS 13+）
    
[ ] 验证
    [ ] Xcode 编译通过
    [ ] 功能测试正常
```
