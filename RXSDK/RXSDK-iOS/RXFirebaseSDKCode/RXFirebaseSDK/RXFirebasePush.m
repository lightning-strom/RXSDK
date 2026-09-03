//
//  RXFirebasePush.m
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2023/8/14.
//

#import "RXFirebasePush.h"
#import <FirebaseCore/FirebaseCore.h>

@interface RXFirebasePush () <FIRMessagingDelegate>

@end

@implementation RXFirebasePush

static RXFirebasePush *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFirebasePush alloc] init];
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
 * 设置代理
 */
- (void)setDelegate:(id<FIRMessagingDelegate>)delegate
{
    [FIRMessaging messaging].delegate = delegate;
}

/**
 * 设置deviceToken
 */
- (void)setDeviceToken:(NSData *)deviceToken
{
    [FIRMessaging messaging].APNSToken = deviceToken;
}

/**
 * 获取当前的注册令牌
 */
- (void)tokenWithCompletion:(void(^)(NSString *token, NSError *error))completion
{
    [[FIRMessaging messaging] tokenWithCompletion:completion];
}

/**
 * 开启自动初始化
 */
- (void)autoInitEnabled:(BOOL)enable
{
    [FIRMessaging messaging].autoInitEnabled = YES;
}

@end
