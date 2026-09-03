//
//  RXBDAsignalService.m
//  RXBDASignalSDK
//
//  Created by 陈汉 on 2025/3/5.
//

#import "RXBDAsignalService.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@implementation RXBDAsignalService

static RXBDAsignalService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXBDAsignalService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isRegist = NO;
        self.isWindowRegist = NO;
        
        [RXSubPackage sharedSDK].aBDA = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(initAction:) name:rxUserDefault_bda_init object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(startAction:) name:rxUserDefault_bda_start object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(eventAction:) name:rxUserDefault_bda_event object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)initAction:(NSNotification *)noti
{
    NSDictionary *launchDic = noti.userInfo[@"launchDic"];
    
    if (@available(iOS 13.0, *)) {
        UISceneConnectionOptions *connectOptions = (UISceneConnectionOptions *)
            noti.userInfo[@"connectOptions"];
        if (connectOptions) {
            [self didFinishLaunchingWithOptions:launchDic connectOptions:connectOptions];
        } else {
            [self didFinishLaunchingWithOptions:launchDic connectOptions:nil];
        }
    } else {
        [self didFinishLaunchingWithOptions:launchDic connectOptions:nil];
    }
}

- (void)startAction:(NSNotification *)noti
{
    [self startSendingEvents];
}

- (void)eventAction:(NSNotification *)noti
{
    NSDictionary *params = noti.userInfo[@"params"];
    NSString *event = noti.userInfo[@"event"];
    
    [self trackEssentialEventWithName:event params:params];
}

- (void)regist
{
    NSLog(@"RXBDAsignalSDK 初始化成功");
}

/**
 * 注册可选参数
 */
- (void)registerWithOptionalData:(NSDictionary *)data
{
    [BDASignalManager registerWithOptionalData:data];
}

/**
 * 上报冷启动事件
 */
- (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions connectOptions:(UISceneConnectionOptions *)connetOptions
{
    NSLog(@"巨量初始化：%@\n%@", launchOptions, connetOptions);
    [BDASignalManager didFinishLaunchingWithOptions:launchOptions connectOptions:connetOptions];
    
    self.isRegist = YES;
}

/**
 * 上报冷启动事件（激活）
 * @note 调用后不会立即激活，根据窗口期上报
 */
- (void)windowDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions connectOptions:(UISceneConnectionOptions *)connetOptions
API_AVAILABLE(ios(13.0)){
    self.isWindowRegist = YES;
    self.launchOptions = launchOptions;
    self.connetOptions = connetOptions;
}

/**
 * 开启 IDFA 采集，默认关闭
 */
- (void)enableIdfa:(BOOL)enable
{
    [BDASignalManager enableIdfa:enable];
}

/**
 * 获取 clickid
 */
+ (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    // 将url参数转换成string类型之后，传递给SDK
    NSString *openUrl = url.absoluteString;
    [BDASignalManager anylyseDeeplinkClickidWithOpenUrl:openUrl];
    return YES;
}

/**
 * 开启延时上报
 */
- (void)enableDelayUpload
{
    [BDASignalManager enableDelayUpload];
}

/**
 * 允许数据上报
 */
- (void)startSendingEvents
{
    if (!self.isRegist) {
        [self didFinishLaunchingWithOptions:self.launchOptions connectOptions:self.connetOptions];
        [BDASignalManager getClickId];
    } else {
        [BDASignalManager getClickId];
    }
}

/**
 上报关键事件
 */
- (void)trackEssentialEventWithName:(NSString *)key params:(NSDictionary *)params
{
    if (!self.isRegist) {
        // 未初始化先调用初始化，延迟 5 秒上报
        [self didFinishLaunchingWithOptions:self.launchOptions connectOptions:self.connetOptions];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            if ([params isKindOfClass:[NSDictionary class]] && params.allKeys.count > 0) {
                NSLog(@"巨量上报：%@\n%@", key, params);
                [BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventRegister params:params];
            } else {
                NSLog(@"巨量上报：%@\n%@", key, params);
                [BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventRegister params:@{}];
            }
        });
    } else {
        if ([params isKindOfClass:[NSDictionary class]] && params.allKeys.count > 0) {
            NSLog(@"巨量上报：%@\n%@", key, params);
            [BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventRegister params:params];
        } else {
            NSLog(@"巨量上报：%@\n%@", key, params);
            [BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventRegister params:@{}];
        }
    }
}

@end
