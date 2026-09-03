//
//  RXBDAManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/3/5.
//

#import "RXBDAManager.h"
#import <objc/message.h>
#import "RXLogService.h"
#import "RXCommonHeader.h"
#import "RXWebSocket.h"

@implementation RXBDAManager

static RXBDAManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXBDAManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

/**
 * 激活
 */
- (void)initBDA
{
    @try {
        NSString *method = [RXUserUtility sharedManager].wsMethod;
        if (![method isEqualToString:@"client"]) {
            return;
        }
        
        BOOL isOpen = [RXUserUtility sharedManager].oceanengineSwitch;
        if (!isOpen) {
            return;
        }
        
        if ([RXSubPackage sharedSDK].aBDA) {
            
        } else {
            NSLog(@"未接入RXBDAsignalSDK");
        }
        
        NSDictionary *launchDic = [RXUserUtility sharedManager].launchOptions;
        if (@available(iOS 13.0, *)) {
            UISceneConnectionOptions *connOpt = [RXUserUtility sharedManager].connectOptions;
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:launchDic forKey:@"launchDic"];
            if (connOpt) {
                [notiDic setValue:connOpt forKey:@"connectOptions"];
            }
            [RXNotificationCenter postNoti:rxUserDefault_bda_init object:nil userInfo:notiDic];
        } else {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:launchDic forKey:@"launchDic"];
            [RXNotificationCenter postNoti:rxUserDefault_bda_init object:nil userInfo:notiDic];
        }
        
    } @catch (NSException *exception) {
        
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"数据格式有误" forKey:@"msg"];
        
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_ws_fail distinctId:@"" properties:trackDic];
        
    } @finally {
        
    }
}

/**
 * 事件上报
 */
- (void)trackEssentialEventWithNameWithEvent:(NSString *)event
                                      params:(NSDictionary *)params
{
    @try {
        NSString *method = [RXUserUtility sharedManager].wsMethod;
        
        if (![method isEqualToString:@"client"]) {
            return;
        }
        
        BOOL isOpen = [RXUserUtility sharedManager].oceanengineSwitch;
        if (!isOpen) {
            return;
        }
        
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aBDA) {
            NSLog(@"未接入RXBDAsignalSDK");
            return;
        }
        
        // 开启上报事件
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [RXNotificationCenter postNoti:rxUserDefault_bda_start object:nil userInfo:notiDic];
        
        // 上报事件
        NSMutableDictionary *eventNotiDic = [NSMutableDictionary dictionary];
        [eventNotiDic setValue:event forKey:@"event"];
        [eventNotiDic setValue:params forKey:@"params"];
        [RXNotificationCenter postNoti:rxUserDefault_bda_event object:nil userInfo:eventNotiDic];
        
    } @catch (NSException *exception) {
        
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"数据格式有误" forKey:@"msg"];
        
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_ws_fail distinctId:@"" properties:trackDic];
        
    } @finally {
        
    }
}

/**
 * websocket 用
 */
- (void)ws_trackEssentialEventWithNameWithInfo:(NSDictionary *)info uuid:(NSString *)uuid
{
    @try {
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aBDA) {
            NSLog(@"未接入RXBDAsignalSDK");
            return;
        }
        
        if ([info isKindOfClass:[NSDictionary class]] && info.allKeys.count > 0) {
            
            NSString *event = info[@"event"];
            NSDictionary *params = info[@"info"];
            
            if ([event isEqualToString:@"pay"]) {
                event = @"purchase";
            } else if ([event isEqualToString:@"on_event_v3"]) {
                event = @"game_addiction";
            } else {
                
            }
            
            if ([event isEqualToString:@"activated"]) {
                NSDictionary *launchDic = [RXUserUtility sharedManager].launchOptions;
                if (@available(iOS 13.0, *)) {
                    UISceneConnectionOptions *connOpt = [RXUserUtility sharedManager].connectOptions;
                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                    [notiDic setValue:launchDic forKey:@"launchDic"];
                    if (connOpt) {
                        [notiDic setValue:connOpt forKey:@"connectOptions"];
                    }
                    [RXNotificationCenter postNoti:rxUserDefault_bda_init object:nil userInfo:notiDic];
                } else {
                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                    [notiDic setValue:launchDic forKey:@"launchDic"];
                    [RXNotificationCenter postNoti:rxUserDefault_bda_init object:nil userInfo:notiDic];
                }
            } else {
                // 开启上报事件
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_bda_start object:nil userInfo:notiDic];
                
                // 上报事件
                NSMutableDictionary *eventNotiDic = [NSMutableDictionary dictionary];
                [eventNotiDic setValue:event forKey:@"event"];
                [eventNotiDic setValue:params forKey:@"params"];
                [RXNotificationCenter postNoti:rxUserDefault_bda_event object:nil userInfo:eventNotiDic];
            }
            
            // 保存 uuid
            [RXUserUtility setValue:uuid ForKey:keyUserData_socketUUID];
            
            [[RXWebSocket sharedSDK] sendAck];
        }
        
    } @catch (NSException *exception) {
        
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"数据格式有误" forKey:@"msg"];
        
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_ws_fail distinctId:@"" properties:trackDic];
        
    } @finally {
        
    }
}

@end
