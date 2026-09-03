//
//  RXUserCenterConfig.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/26.
//

#import "RXUserCenterConfig.h"
#import "RXUICommonTool.h"

@implementation RXUserCenterConfig

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self fetchConfigParams];
        self.setLightTheme = YES;
    }
    return self;
}

- (void)fetchConfigParams
{
    
}

@end
