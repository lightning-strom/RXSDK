//
//  RXAuthLoginService.h
//  RXAuthLoginKit
//
//  Created by 陈汉 on 2022/5/14.
//

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXAuthLoginConfig.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXAuthLoginService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 一键登录弹窗  自动调用初始化授权，拉起页面
 * @param config 配置信息
 * ！登录结果由通行证delegate返回，页面授权错误及页面操作由block中的error.response返回
 */
- (void)authLoginAutomaticWithConfig:(RXAuthLoginConfig *)config
                            complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 一键登录初始化
 * @param config 配置信息
 */
- (void)initAuthLoginWithConfig:(RXAuthLoginConfig *)config;

/**
 * 拉起登录页面
 * ！登录结果由通行证delegate返回，页面授权错误及页面操作由block中的error.response返回
 */
- (void)setLoginPageWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 获取运营商名称
 */
- (NSString *)getCardName;

@end

NS_ASSUME_NONNULL_END
