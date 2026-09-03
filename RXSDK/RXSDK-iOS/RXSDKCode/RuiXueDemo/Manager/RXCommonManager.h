//
//  RXCommonManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/3/28.
//

#import <Foundation/Foundation.h>
#import "RXCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXCommonManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 上报已安装应用
 */
- (void)reportAppInfo;

/**
 * 设置默认语言
 */
- (void)setDefaultLanguage;

/**
 * 上报用户属性
 */
- (void)reportUserSetWithAction:(NSString *)action properties:(NSDictionary *)properties;

@end

NS_ASSUME_NONNULL_END
