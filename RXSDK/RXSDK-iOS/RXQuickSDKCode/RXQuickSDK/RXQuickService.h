//
//  RXQuickService.h
//  RXQuickSDK
//
//  Created by 陈汉 on 2024/11/21.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXQuickSDK/RXQuickInitConfig.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXQuickService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 * @param config 初始化配置
 */
//- (void)initWithConfig:(RXQuickInitConfig *)config
//           application:(UIApplication *)application
//         launchOptions:(NSDictionary *)launchOptions;


@end

NS_ASSUME_NONNULL_END
