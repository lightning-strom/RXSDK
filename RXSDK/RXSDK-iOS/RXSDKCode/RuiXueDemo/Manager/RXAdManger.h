//
//  RXAdManger.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/1/27.
//

#import <Foundation/Foundation.h>
#import "RXCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXAdManger : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 上报adid
 */
- (void)setAdid;

/**
 * 上报adid安装
 */
- (void)reportAdjustInstallWithDistinctId:(NSString *)distinctId;

/**
 * 上报adjust注册事件
 */
- (void)reportAdjustRegistEvent;

/**
 * 新用户首次登录条件下，上报用户的邮箱或手机号
 */
- (void)reportLoginEmailOrPhoneNumber;

/**
 * 注册成功后，上报用户的邮箱或手机号
 */
- (void)reportRegisterEmailOrPhoneNumber:(NSString *)accountStr;

@end

NS_ASSUME_NONNULL_END
