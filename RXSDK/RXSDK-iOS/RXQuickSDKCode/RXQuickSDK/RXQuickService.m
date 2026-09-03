//
//  RXQuickService.m
//  RXQuickSDK
//
//  Created by 陈汉 on 2024/11/21.
//

#import "RXQuickService.h"

@implementation RXQuickService

static RXQuickService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXQuickService alloc] init];
    });
    return sharedSDK;
}



@end
