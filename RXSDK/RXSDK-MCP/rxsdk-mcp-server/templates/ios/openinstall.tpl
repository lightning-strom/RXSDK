# 瑞雪 SDK iOS Openinstall 组件库接入规范

# ==================== 概述 ====================
overview:
  description: Openinstall 组件库用于 App 推广追踪、渠道统计、一键拉起等功能
  note: |
    1. Openinstall 是可选组件，需要根据业务需求选择接入
    2. 国内和海外使用不同的 pod 库
    3. 需要在 openinstall 后台获取相关配置参数
    4. 需要配置 Associated Domains、URL Types 和 Info.plist

# ==================== 国内环境 ====================
domestic:
  pod_name: RXOpeninstallSDK
  description: 国内环境使用的 Openinstall SDK

# ==================== 海外环境 ====================
overseas:
  pod_name: RXOpeninstallOSSDK
  description: 海外环境使用的 Openinstall SDK

# ==================== 工程配置 ====================
project_config:
  # Associated Domains 配置
  associated_domains:
    description: 用于 Universal Links 支持一键拉起功能
    location: Target → Signing & Capabilities → Associated Domains
    format: "applinks:your-universallink-domain"
    note: |
      1. 在 Xcode 中选择项目 Target
      2. 点击 "Signing & Capabilities" 标签
      3. 点击 "+ Capability" 按钮
      4. 选择 "Associated Domains"
      5. 点击 "+" 添加域名，格式为: applinks:xxx.xxx.com
      6. Universal Link 域名在 openinstall 后台获取

  # Info.plist 配置
  info_plist:
    key: com.ruixue.APP_KEY
    description: Openinstall 应用唯一标识
    location: Info.plist
    note: |
      1. 打开 Info.plist 文件
      2. 添加一个新的 Key: com.ruixue.APP_KEY
      3. Type 选择 String
      4. Value 填写在 openinstall 后台获取的 APP_KEY

  # URL Types 配置
  url_types:
    description: 用于 Scheme 唤醒
    location: Target → Info → URL Types
    note: |
      1. 在 Xcode 中选择项目 Target
      2. 点击 "Info" 标签
      3. 展开 "URL Types" 部分
      4. 点击 "+" 添加新的 URL Type
      5. URL Schemes 填写与 Info.plist 中 com.ruixue.APP_KEY 相同的值
      6. Identifier 可填写 Bundle ID 或留空

# ==================== 代码示例 ====================
code_example:
  # 初始化代码（必须在瑞雪 SDK 初始化之前）
  init_code: |
    // ========== Openinstall 初始化（必须在瑞雪 SDK 初始化之前）==========
    #import <RXOpeninstallSDK/RXOpeninstallService.h>
    
    - (BOOL)application:(UIApplication *)application 
            didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        
        // 1. 【必须在瑞雪 SDK 初始化之前】注册 Openinstall
        [[RXOpeninstallService sharedSDK] regist];
        
        // 2. 初始化瑞雪 SDK
        RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
        // ... 配置参数 ...
        [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
            // ...
        }];
        
        return YES;
    }
  
  # 回调处理代码
  callback_code: |
    // ========== AppDelegate.m - Openinstall 回调处理 ==========
    #import <RXSDK_Pure/RXSDK_Pure.h>
    
    // Universal Link 回调（iOS 9+）
    - (BOOL)application:(UIApplication *)application 
        continueUserActivity:(NSUserActivity *)userActivity 
        restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
        
        // 处理 Universal Link
        if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
            NSURL *url = userActivity.webpageURL;
            // Openinstall 会自动处理
        }
        return YES;
    }
    
    // URL Scheme 回调
    - (BOOL)application:(UIApplication *)app 
                openURL:(NSURL *)url 
                options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
        // Openinstall 会自动处理
        return YES;
    }

# ==================== 注意事项 ====================
note: |
  1. 【重要】[[RXOpeninstallService sharedSDK] regist] 必须在瑞雪 SDK 初始化之前调用
  2. 国内环境使用 RXOpeninstallSDK，海外环境使用 RXOpeninstallOSSDK
  3. 所有配置参数（Universal Link、APP_KEY）均在 openinstall 后台获取
  4. Associated Domains 格式必须是 applinks:域名，不要加 https://
  5. URL Types 中的 Scheme 值必须与 Info.plist 中的 com.ruixue.APP_KEY 保持一致
  6. 添加 pod 依赖后必须执行 pod install 安装组件
  7. 如果已有 Podfile，在 target 块中添加依赖即可
