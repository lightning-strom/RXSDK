//
//  RXConfig.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXConfig.h"
#import "RXCommonHeader.h"

@implementation RXConfig

+ (instancetype)sharedManager
{
    static RXConfig *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXConfig alloc] init];
    });
    return manager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.envSer = 0;
        self.isOS = NO;
    }
    return self;
}

- (NSInteger)envSer
{
    return 0;
}

- (NSString *)apiDomain
{
    NSArray *baseUrlList = [RXUserUtility sharedManager].baseUrlList;
    if ([RXUserUtility sharedManager].baseUrlCount > baseUrlList.count - 1) {
        [RXUserUtility sharedManager].baseUrlCount = 0;
    }
    NSString *baseUrl = baseUrlList[[RXUserUtility sharedManager].baseUrlCount];
    
    return baseUrl;
}

@end

