//
//  RXSubPackage.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/9/24.
//

#import "RXSubPackage.h"

@implementation RXSubPackage

static RXSubPackage *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXSubPackage alloc] init];
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

@end
