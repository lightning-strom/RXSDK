//
//  RXNotificationCenter.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/9/24.
//

#import "RXNotificationCenter.h"

@implementation RXNotificationCenter

+ (void)postNoti:(NSString *)name object:(nullable id)anObject userInfo:(nullable NSDictionary *)aUserInfo
{
    [[NSNotificationCenter defaultCenter] postNotificationName:name object:anObject userInfo:aUserInfo];
}

@end
