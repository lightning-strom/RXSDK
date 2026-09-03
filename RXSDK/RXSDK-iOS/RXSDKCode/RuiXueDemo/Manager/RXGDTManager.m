//
//  RXGDTManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/12/2.
//

#import "RXGDTManager.h"
#import "RXCommonTool.h"
#import "RXLogService.h"

@implementation RXGDTManager

static RXGDTManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXGDTManager alloc] init];
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
- (void)initGDT
{
    @try {
        BOOL isOpen = [RXUserUtility sharedManager].gdtSwitch;
        if (isOpen) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:[RXUserUtility sharedManager].gdtSid forKey:@"actionSetId"];
            [notiDic setValue:[RXUserUtility sharedManager].gdtKey forKey:@"secretKey"];
            [RXNotificationCenter postNoti:rxUserDefault_gdt_init object:nil userInfo:notiDic];
        }
   
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 注册
 */
- (void)registerGDT:(NSString *)method
{
    @try {
        BOOL isOpen = [RXUserUtility sharedManager].gdtSwitch;
        if (isOpen) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:method forKey:@"method"];
            [RXNotificationCenter postNoti:rxUserDefault_gdt_register object:nil userInfo:notiDic];
        }
   
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 登录
 */
- (void)loginGDT:(NSString *)method
{
    @try {
        BOOL isOpen = [RXUserUtility sharedManager].gdtSwitch;
        if (isOpen) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:method forKey:@"method"];
            [RXNotificationCenter postNoti:rxUserDefault_gdt_login object:nil userInfo:notiDic];
        }
   
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

@end
