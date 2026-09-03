//
//  RXNotification.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/8/21.
//

#import "RXNotification.h"

@implementation RXNotification

static RXNotification *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXNotification alloc] init];
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

- (void)addNotification:(id)observer selector:(SEL)aSelector name:(NSNotificationName)aName object:(id)anObject
{
    [[NSNotificationCenter defaultCenter] addObserver:observer selector:aSelector name:aName object:anObject];
}

- (void)postNotification:(NSString *)aName object:(id)anObject userInfo:(NSDictionary *)aUserInfo
{
    [[NSNotificationCenter defaultCenter] postNotificationName:aName object:anObject userInfo:aUserInfo];
}

@end
