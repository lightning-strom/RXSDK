//
//  RXOSLogManager.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2024/6/14.
//

#import <Foundation/Foundation.h>
#import "RXOSCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXOSLogManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 添加点击登录/三方授权日志
 */
- (void)addClickLoginLogWithLoginType:(LoginType)loginType;

/**
 * 添加三方授权日志
 */
- (void)addThirdLoginLogWithLoginType:(LoginType)loginType
                                begin:(BOOL)begin
                            errorInfo:(NSDictionary *)errorInfo;

@end

NS_ASSUME_NONNULL_END
