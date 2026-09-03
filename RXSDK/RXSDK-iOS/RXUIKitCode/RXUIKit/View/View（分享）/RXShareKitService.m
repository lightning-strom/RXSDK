//
//  RXShareKitService.m
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import "RXShareKitService.h"
#import "RXSView.h"

@implementation RXShareKitService

+ (instancetype)sharedManger
{
    static RXShareKitService *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXShareKitService alloc] init];
    });
    return manager;
}

/**
 * @param types 分享类型
 * @param round 是否设置圆形背景，默认NO
 * @param clickBlock 点击回调
 */
- (void)showShareWithTypes:(NSArray *)types
                     round:(BOOL)round
                clickBlock:(RXShareClickBlock)clickBlock
{    
    RXSView *shareView = [[RXSView alloc] initWithShareTypes:types round:round clickBlock:clickBlock];
}

@end
