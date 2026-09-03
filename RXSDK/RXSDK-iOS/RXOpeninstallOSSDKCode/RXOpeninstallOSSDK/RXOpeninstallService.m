//
//  RXOpeninstallService.m
//  RXOpeninstallSDK
//
//  Created by 陈汉 on 2025/11/18.
//

#import "RXOpeninstallService.h"
#import "RuixueOISDK.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXOpeninstallService () <RuixueOIDelegate>

@property (nonatomic, strong) NSMutableDictionary *params;

@end

@implementation RXOpeninstallService

static RXOpeninstallService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOpeninstallService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.params = [NSMutableDictionary dictionary];
        
        [RXSubPackage sharedSDK].aRXOpeninstall = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getOIParams:) name:rxUserDefault_oi object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(ulinkAction:) name:rxUserDefault_ulink object:nil];
    }
    return self;
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    NSURL *url = noti.userInfo[@"url"];
    
    [self handleOpenUrl:url];
}

- (void)ulinkAction:(NSNotification *)noti
{
    NSUserActivity *userActivity = noti.userInfo[@"userActivity"];
    
    [self continueUserActivity:userActivity];
}

#pragma mark -- from main framework
- (void)getOIParams:(NSNotification *)noti
{
    @try {
        self.installParamsBlock = noti.userInfo[@"callback"];
        
        if (self.params && self.params.allKeys.count > 0) {
            if (self.installParamsBlock) {
                self.installParamsBlock(self.params);
            }
        }
        
        NSString *appkey = noti.userInfo[@"appkey"];
        NSString *domain = noti.userInfo[@"domain"];
        NSString *oiPaste = noti.userInfo[@"oi"];
        
        [RuixueOISDK setTrackData:oiPaste];
        [RuixueOISDK setServerDomain:domain withAppkey:appkey];
        [RuixueOISDK initWithDelegate:self];
        [self getInstallParamsWithComplete:self.installParamsBlock];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)regist
{
//    [OpenInstallSDK initWithDelegate:self];
    NSLog(@"RXOpeninstallSDK 初始化成功");
}

/**
 * 处理 openUrl 唤起数据
 */
- (void)handleOpenUrl:(NSURL *)url
{
    [RuixueOISDK handLinkURL:url];
}

/**
 * 处理 通用链接
 * @param userActivity 存储了页面信息，包括url
 * @return bool URL是否被OpenInstall识别
 */
- (BOOL)continueUserActivity:(NSUserActivity *_Nullable)userActivity
{
    return [RuixueOISDK continueUserActivity:userActivity];
}

#pragma mark -- OpenInstallDelegate
/**
 * 获取唤醒参数
 */
- (void)getWakeUpParams:(RuixueOIData *)appData{
    NSMutableDictionary *params = [NSMutableDictionary dictionary];
    if (appData.data) {//自定义参数
        [params setValue:appData.data forKey:@"data"];
    }
    if (appData.channelCode) {//渠道编号参数
        [params setValue:appData.channelCode forKey:@"channel_code"];
    }
    
    self.params = params;
    
    if (self.installParamsBlock) {
        self.installParamsBlock(params);
    }
}

/**
 * 获取安装参数
 */
- (void)getInstallParamsWithComplete:(InstallParamsBlock)complete
{
    @try {
        [[RuixueOISDK defaultManager] getInstallParmsWithTimeoutInterval:10 completed:^(RuixueOIData * _Nullable appData) {
            if (appData.opCode == RuixueOICode_timeout) {//初始化超时
                
            }
            
            NSMutableDictionary *params = [NSMutableDictionary dictionary];
            if (appData.data) {//自定义参数
                [params setValue:appData.data forKey:@"data"];
            }
            if (appData.channelCode) {//渠道编号参数
                [params setValue:appData.channelCode forKey:@"channel_code"];
            }
            
            if (params.allKeys.count > 0) {
                if (complete) {
                    complete(params);
                }
            }
            
        }];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

@end
