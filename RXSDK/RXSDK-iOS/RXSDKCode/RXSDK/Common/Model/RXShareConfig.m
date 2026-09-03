//
//  RXShareConfig.m
//  RXSDK
//
//  Created by 陈汉 on 2024/1/25.
//

#import "RXShareConfig.h"

@implementation RXShareConfig

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.readCache = NO;
        self.autoReport = YES;
    }
    return self;
}

@end
