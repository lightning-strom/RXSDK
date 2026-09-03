//
//  RXFirebaseService.m
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import "RXFirebaseService.h"
#import <FirebaseAnalytics/FirebaseAnalytics.h>
#import <FirebaseCore/FirebaseCore.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>
#import "RXFIRAnalyticsService.h"

@implementation RXFirebaseService

static RXFirebaseService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFirebaseService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aAdjust = YES;
        [RXSubPackage sharedSDK].aFirebase = YES;
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustEmail:) name:rxUserDefault_adjust_email object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustPhone:) name:rxUserDefault_adjust_phone object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getid:) name:rxUserDefault_firebase_instanceid object:nil];
    }
    return self;
}

- (void)adjustEmail:(NSNotification *)noti
{
    NSString *email = noti.userInfo[@"email"];
    [[RXFIRAnalyticsService sharedSDK] initiateOnDeviceConversionMeasurementWithEmailAddress:email];
}

- (void)adjustPhone:(NSNotification *)noti
{
    NSString *phone = noti.userInfo[@"phone"];
    [[RXFIRAnalyticsService sharedSDK] initiateOnDeviceConversionMeasurementWithPhoneNumber:phone];
}

- (void)getid:(NSNotification *)noti
{
    [RXSubPackage sharedSDK].instanceId = [self getInstanceId];
}

/**
 * 初始化配置
 */
- (void)configure
{
//    [FIRApp configure];
    if ([FIRApp defaultApp] == nil) {
        [FIRApp configure];
    }
}

/**
 * 记录事件
 */
- (void)logEventWithName:(NSString *)name
              parameters:(nullable NSDictionary<NSString *, id> *)parameters
{
    [FIRAnalytics logEventWithName:name
                        parameters:parameters];
}

/**
 * 设置默认事件参数
 */
- (void)setDefaultEventParameters:(nullable NSDictionary<NSString *, id> *)parameters
{
    [FIRAnalytics setDefaultEventParameters:parameters];
}

/**
 * 设置用户属性
 */
- (void)setUserPropertyString:(nullable NSString *)value forName:(NSString *)name
{
    [FIRAnalytics setUserPropertyString:value forName:name];
}

/**
 * 设置用户 ID
 */
- (void)setUserID:(NSString *)userID
{
    [FIRAnalytics setUserID:userID];
}

/**
 * 是否启用数据收集
 * @param enable YES 为开启数据收集，NO 为关闭数据收集
 */
- (void)setAnalyticsCollectionEnabled:(BOOL)enable
{
    [FIRAnalytics setAnalyticsCollectionEnabled:enable];
}

/**
 * 获取 instanceID
 */
- (NSString *)getInstanceId
{
    return [FIRAnalytics appInstanceID];
}

@end
