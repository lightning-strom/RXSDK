//
//  RXADJConfig.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import "RXADJConfig.h"

@interface RXADJConfig ()

@end

@implementation RXADJConfig

+ (nullable RXADJConfig *)configWithAppToken:(nonnull NSString *)appToken
                     environment:(nonnull NSString *)environment
{
    return [[RXADJConfig alloc] initWithAppToken:appToken environment:environment];
}

- (id)initWithAppToken:(NSString *)appToken
           environment:(NSString *)environment {
    self = [super init];
    if (self) {
        _appToken = appToken;
        _environment = environment;
    }
    return self;
}

@end
