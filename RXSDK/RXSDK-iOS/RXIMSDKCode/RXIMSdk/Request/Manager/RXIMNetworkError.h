//
//  RXIMNetworkError.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import <Foundation/Foundation.h>
#import "RXIMBaseInterfaceModel.h"
#import "RXIMError.h"
#import <RXNetworkingKit/RXNetworkingKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMNetworkError : NSObject

/** 不带返回参数 */
/**
 * 内部错误
 */
+ (void)internalError:(RXIMBaseInterfaceModel *)model complete:(void(^)(RXIMError *error))complete;

/**
 * 网络错误
 */
+ (void)networkError:(RXCommonRequestError *)error complete:(void(^)(RXIMError *error))complete;

/**
 * 内部错误
 */
+ (void)internalError:(RXIMBaseInterfaceModel *)model completeWithArgument:(void(^)(id argument,RXIMError *error))complete;

/** 带返回参数 */
/**
 * 网络错误
 */
+ (void)networkError:(RXCommonRequestError *)error completeWithArgument:(void(^)(id argument,RXIMError *error))complete;

@end

NS_ASSUME_NONNULL_END
