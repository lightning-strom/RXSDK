# 瑞雪 SDK iOS 初始化

# ==================== 方法签名规范 ====================
signature:
  class: RXSDK
  singleton: sharedSDK
  method_name: "initWithConfig:complete:"
  parameters:
    - name: config
      type: RXSdkInitConfig *
      required: true
      description: 初始化配置对象
    - name: complete
      type: RXSDKRequestComplete
      required: true
      description: 初始化结果回调

# ==================== RXSdkInitConfig 配置类 ====================
config_class:
  name: RXSdkInitConfig
  description: SDK 初始化配置类
  properties:
    # 必须参数
    - name: cpId
      type: NSString *
      required: true
      description: CP 唯一 ID，从 7 位数 1000000 开始递增
    - name: productId
      type: NSString *
      required: true
      description: 瑞雪内部的应用 ID，由各 CP 自行在后台创建
    - name: channelId
      type: NSString *
      required: true
      description: 瑞雪内部 CP 某应用的渠道 ID
    - name: baseUrlList
      type: NSArray *
      required: true
      description: 瑞雪域名地址数组，格式 https://domain.com/
    # 可选参数
    - name: isLogEnable
      type: NSString *
      required: false
      description: 日志开关，debug 默认开启，release 默认关闭
    - name: usePrivacy
      type: BOOL
      required: false
      description: 首次启动是否展示用户隐私授权页面，默认 NO
    - name: agreementMap
      type: NSMutableDictionary *
      required: false
      description: 自定义协议键值对，key 为协议 key 或链接，value 为协议名称
    - name: agreementTitle
      type: NSString *
      required: false
      description: 协议标题，默认 "用户协议和隐私政策"
    - name: isUseDNS
      type: BOOL
      required: false
      description: 是否打开 DNS，默认 NO
    - name: openRacing
      type: BOOL
      required: false
      description: 是否开启竞速，默认 NO
    - name: launchOptions
      type: NSDictionary *
      required: false
      description: 启动参数
    - name: connectionOptions
      type: UISceneConnectionOptions *
      required: false
      description: SceneDelegate 启动参数，使用 SceneDelegate 时需要传

# ==================== 样板代码 (Objective-C) ====================
code_objc: |
  // ========== AppDelegate.m ==========
  #import <RXSDK_Pure/RXSDK_Pure.h>
  // 国内环境需引入
  #import <RXUIKit/RXUIKitService.h>
  // 海外环境需引入
  // #import <RXOSUIKit/RXOSUIKitService.h>

  @implementation AppDelegate

  - (BOOL)application:(UIApplication *)application 
          didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      
      // 1. 初始化 UI 组件（国内环境）
      [[RXUIKitService sharedSDK] regist];
      
      // 1. 初始化 UI 组件（海外环境）
      // [[RXOSUIKitService sharedSDK] regist];
      
      // 2. 创建初始化配置
      RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
      config.cpId = @"YOUR_CP_ID";                       // CP 唯一 ID（必须）
      config.productId = @"YOUR_PRODUCT_ID";          // 应用 ID（必须）
      config.channelId = @"YOUR_CHANNEL_ID";          // 渠道 ID（必须）
      config.baseUrlList = @[@"https://api.example.com/"]; // 域名列表（必须）
      config.launchOptions = launchOptions;          // 启动参数
      // config.usePrivacy = YES;                    // 是否展示隐私授权页面
      // config.agreementMap = @{@"00001": @"《用户协议》", @"00002": @"《隐私政策》"};
      
      // 3. 初始化 SDK
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

  @end

# ==================== UI 组件初始化 ====================
ui_init:
  domestic:
    class: RXUIKitService
    method: regist
    import: "#import <RXUIKit/RXUIKitService.h>"
    description: 国内版 UI 组件初始化
  overseas:
    class: RXOSUIKitService
    method: regist
    import: "#import <RXOSUIKit/RXOSUIKitService.h>"
    description: 海外版 UI 组件初始化

# ==================== 微信初始化 ====================
wx_init:
  class: RXWXService
  singleton: sharedSDK
  method: "configUniversallink:"
  import: "#import <RXWXSDK/RXWXSDK.h>"
  pod: "pod 'RXWXSDK'"
  description: 微信 SDK 初始化配置
  note: "必须在瑞雪 SDK 初始化之前调用"
  code_objc: |
    // ========== 微信初始化（必须在瑞雪 SDK 初始化之前！）==========
    #import <RXWXSDK/RXWXSDK.h>
    
    // 在 application:didFinishLaunchingWithOptions: 最开始调用
    // ⚠️ 必须在 [[RXSDK sharedSDK] initWithConfig:] 之前！
    [[RXWXService sharedSDK] configUniversallink:@"{{.UniversalLink}}"];
  code_full_example: |
    // ========== AppDelegate.m 完整示例（含微信配置）==========
    #import <RXSDK_Pure/RXSDK_Pure.h>
    #import <RXWXSDK/RXWXSDK.h>  // 微信 SDK
    #import <RXUIKit/RXUIKitService.h>  // 国内 UI 组件
    
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        
        // ========== 步骤 1: 微信配置（必须在瑞雪 SDK 初始化之前！）==========
        [[RXWXService sharedSDK] configUniversallink:@"{{.UniversalLink}}"];
        
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
    }

# ==================== 注意事项 ====================
note: |
  1. 初始化必须在 application:didFinishLaunchingWithOptions: 中调用
  2. cpId、productId、channelId、baseUrlList 为必须参数
  3. UI 组件初始化（regist）必须在 SDK initWithConfig 之前执行
  4. 国内环境使用 RXUIKitService，海外环境使用 RXOSUIKitService
  5. cpId、productId、channelId 从瑞雪后台获取
  6. 发布时请将 isLogEnable 设为 @"0"
  7. 使用 SceneDelegate 时需要传 connectionOptions 参数
  8. 【必须实现】application:openURL:options: 方法，用于处理 URL Scheme 回调（微信/支付宝等）
  9. 【必须实现】application:continueUserActivity:restorationHandler: 方法，用于处理 Universal Link 回调
