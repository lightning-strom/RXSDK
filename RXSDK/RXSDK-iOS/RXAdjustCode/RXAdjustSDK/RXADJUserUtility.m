//
//  RXADJUserUtility.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/11.
//

#import "RXADJUserUtility.h"

@implementation RXADJUserUtility

+ (instancetype)sharedManager
{
    static RXADJUserUtility *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXADJUserUtility alloc] init];
    });
    return manager;
}

@end
