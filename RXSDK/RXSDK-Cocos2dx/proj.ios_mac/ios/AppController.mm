/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"

// 瑞雪 SDK 头文件
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXUIKitService.h>
#import "RuixueSDKWrapper.h"

@implementation AppController

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate s_sharedApplication;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    cocos2d::Application *app = cocos2d::Application::getInstance();
    
    // Initialize the GLView attributes
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();
    
    // Override point for customization after application launch.

    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];

    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
    _viewController.wantsFullScreenLayout = YES;
    

    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }

    [window makeKeyAndVisible];

    [[UIApplication sharedApplication] setStatusBarHidden:true];
    
    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)_viewController.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    // ========== 瑞雪 SDK 初始化 ==========
    // GDT 必须先于瑞雪 SDK 注册，确保首次 applicationDidBecomeActive 可上报 START_APP。
    [[RuixueSDKWrapper sharedInstance] gdtRegisterSdk];
    [self initRuixueSDKWithLaunchOptions:launchOptions];
    
    //run the cocos2d-x game scene
    app->run();

    return YES;
}

#pragma mark - 瑞雪 SDK 初始化

- (void)initRuixueSDKWithLaunchOptions:(NSDictionary *)launchOptions {
    // 创建初始化配置
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    
    // ========== 必须参数（国内测试环境）==========
    config.cpId = @"114";                                     // CP 唯一 ID
    config.productId = @"1002";                               // 瑞雪内部的应用 ID
    config.channelId = @"100";                                // 渠道 ID
    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];  // 服务器地址列表
    
    // ========== 可选参数 ==========
    config.launchOptions = launchOptions;                     // 启动参数
    // config.isLogEnable = @"1";                             // 日志开关：@"1" 开启，@"0" 关闭
    // config.usePrivacy = YES;                               // 是否展示隐私授权页面
    // config.agreementMap = @{@"00001": @"《用户协议》", @"00002": @"《隐私政策》"};
    // config.isUseDNS = NO;                                  // 是否使用 DNS
    // config.openRacing = NO;                                // 是否开启竞速
    
    // 初始化 SDK（由按钮点击触发，此处不自动执行）
    // [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    //     if (error) {
    //         NSLog(@"[RuixueSDK] 初始化失败: code=%@, msg=%@", error.responesObject[@"code"], error.responesObject[@"msg"]);
    //         return;
    //     }
    //     NSLog(@"[RuixueSDK] 初始化成功: %@", response);
    //     
    //     // 初始化 UI 组件（国内环境）
    //     [[RXUIKitService sharedSDK] regist];
    //     NSLog(@"[RuixueSDK] UI 组件初始化完成");
    // }];
}

#pragma mark - URL Scheme 回调（瑞雪 SDK 必须实现）

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
    // 处理 URL Scheme 回调（微信、支付宝等第三方登录/支付回调）
    [[RXSDK sharedSDK] application:app openURL:url options:options];
    [[RuixueSDKWrapper sharedInstance] gdtHandleOpenURL:url];
    return YES;
}

#pragma mark - Universal Link 回调（瑞雪 SDK 必须实现）

- (BOOL)application:(UIApplication *)application
        continueUserActivity:(NSUserActivity *)userActivity
        restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    // 处理 Universal Link 回调（微信、OpenInstall 等通用链接跳转）
    [[RXSDK sharedSDK] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    return YES;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->pause(); */
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->resume(); */
    [[RuixueSDKWrapper sharedInstance] gdtApplicationDidBecomeActive];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    cocos2d::Application::getInstance()->applicationWillEnterForeground();
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
     Called when the application is about to terminate.
     See also applicationDidEnterBackground:.
     */
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}


#if __has_feature(objc_arc)
#else
- (void)dealloc {
    [window release];
    [_viewController release];
    [super dealloc];
}
#endif


@end
