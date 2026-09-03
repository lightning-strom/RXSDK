//
//  RXIMRTCService_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import <Foundation/Foundation.h>

@import RXIMSdk_business.RXIMError;
@import RXIMSdk_business.RXIMRTCAuthInfo;
@import RXIMSdk_business.RXIMRTCService;

NS_ASSUME_NONNULL_BEGIN

@interface RXIMRTCService_BS : RXIMRTCService

/**
 * 获取RTC操作SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 获取rtc token
 * @param channelId 频道id 发起者传nil内部去生成；接收端传值
 */
- (void)getRtcAuthInfo:(NSString * _Nullable)channelId
     completionHandler:(void (^)(RXIMRTCAuthInfo *authInfo,RXIMError *error))completionHandler;
@end

NS_ASSUME_NONNULL_END
