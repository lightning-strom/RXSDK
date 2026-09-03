//
//  RXPublicService.m
//  RXSDK
//
//  Created by 陈汉 on 2023/12/18.
//

#import "RXPublicService.h"
#import "RXCommonHeader.h"

@implementation RXPublicService

static RXPublicService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXPublicService alloc] init];
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
 * 获取登录方式
 */
- (NSMutableArray *)getLoginMethods
{
    return [RXUserUtility sharedManager].loginMethods;
}

@end
