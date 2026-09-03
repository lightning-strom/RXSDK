//
//  RXSnapChatService.h
//  RXSnapChatSDK
//
//  Created by 陈汉 on 2024/4/3.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class RX_CommonRequestError;

NS_ASSUME_NONNULL_BEGIN

@interface RXSnapChatService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * openUrl 处理跳转信息
 */
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

/**
 * 登录
 */
- (void)login;

/**
 * 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
