//
//  RXInstagramService.h
//  RXInstagramSDK
//
//  Created by 陈汉 on 2024/4/9.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXInstagramService : NSObject

/**
 * 初始化 instagram
 * @param clientID 应用ID
 * @param redirectURI 应用重定向网址
 * 注册应用时自动生成应用ID，并设置重定向网址redirectURI
 */
- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 登录
 */
- (void)login;

@end

NS_ASSUME_NONNULL_END
