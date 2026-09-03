//
//  RXOSLogManager.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2024/6/14.
//

#import "RXOSLogManager.h"
#import <RXSDK_Pure/RXLogManager.h>

@implementation RXOSLogManager

static RXOSLogManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOSLogManager alloc] init];
    });
    return sharedSDK;
}

/**
 * 添加点击登录日志
 */
- (void)addClickLoginLogWithLoginType:(LoginType)loginType
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    switch (loginType) {
        case LoginTypeAccount:
        {
            [trackDic setValue:@"1" forKey:@"login_type"];
            [trackDic setValue:@"1-1" forKey:@"login_category"];
            [trackDic setValue:@"1-1" forKey:@"login_action"];
            break;
        }
        case LoginTypeCapCode:
        {
            [trackDic setValue:@"3" forKey:@"login_type"];
            [trackDic setValue:@"3-1" forKey:@"login_category"];
            [trackDic setValue:@"3-1" forKey:@"login_action"];
            break;
        }
        case LoginTypeVisitor:
        {
            [trackDic setValue:@"4" forKey:@"login_type"];
            [trackDic setValue:@"4-1" forKey:@"login_category"];
            [trackDic setValue:@"4-1" forKey:@"login_action"];
            break;
        }
        case LoginTypeGoogle:
        {
            [self addThirdLoginLogWithLoginType:LoginTypeGoogle begin:YES errorInfo:nil];
            break;
        }
        case LoginTypeFacebook:
        {
            [self addThirdLoginLogWithLoginType:LoginTypeFacebook begin:YES errorInfo:nil];
            break;
        }
        case LoginTypeLine:
        {
            [self addThirdLoginLogWithLoginType:LoginTypeLine begin:YES errorInfo:nil];
            break;
        }
        default:
            break;
    }
    
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
}

/**
 * 添加三方授权日志
 */
- (void)addThirdLoginLogWithLoginType:(LoginType)loginType
                                begin:(BOOL)begin
                            errorInfo:(NSDictionary *)errorInfo
{
    [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:loginType begin:begin errorInfo:errorInfo];
}

@end
