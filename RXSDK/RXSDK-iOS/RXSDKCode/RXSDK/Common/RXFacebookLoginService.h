//
//  RXFacebookService.h
//  RXSDK
//
//  Created by 陈汉 on 2022/2/10.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RXPublicHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXFacebookService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册Facebook
 */
- (void)FBRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions;

/**
 * 跳转openURL
 */
- (BOOL)FBApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

/**
 * Facebook登录
 * @param permissions 权限  必须
 */
- (void)FBLoginWithPermissions:(NSArray *)permissions;

/**
 * Facebook退出登录
 */
- (void)FBLogout;

@end

NS_ASSUME_NONNULL_END
