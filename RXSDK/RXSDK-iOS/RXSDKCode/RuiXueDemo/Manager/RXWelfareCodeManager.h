//
//  RXWelfareCodeManager.h
//  RXSDK-Pure
//
//  Created by root11 on 2024/9/3.
//

#import <Foundation/Foundation.h>
#import "RX_CommonRequestError.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^wcodeBlock)(NSDictionary *_Nullable response, RX_CommonRequestError * _Nullable error);

@interface RXWelfareCodeManager : NSObject

/**
 * 单例
 */
+ (instancetype)sharedSDK;

/**
 * 请求福利码
 * autoRefresh 是否自动刷新，YES自动刷新并返回福利码，NO不自动刷新
 */
- (void)getPromoDisplayKeyWithAutoRefresh:(BOOL)autoRefresh complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete;

/**
 * 先开启定时器，然后请求福利码
 */
- (void)startTimer:(NSInteger)interval;

/**
 * 重置定时器、轮循时间、本地的福利码
 */
- (void)resetTimerAndPollingTimeAndPromoCode;

/**
 * 获取福利码
 */
- (void)exchangePromoCDKEY:(NSString *)cdkey complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete;



@end

NS_ASSUME_NONNULL_END
