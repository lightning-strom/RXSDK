//
//  RXSdkInitConfig.m
//  RXSDK
//
//  Created by 陈汉 on 2024/1/30.
//

#import "RXSdkInitConfig.h"

@implementation RXSdkInitConfig

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.usePrivacy = NO;
        self.openRacing = NO;
        self.agreementMap = [NSMutableDictionary dictionary];
        self.agreementTitle = @"用户协议和隐私政策";
    }
    return self;
}

@end
