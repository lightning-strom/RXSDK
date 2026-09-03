//
//  RXIMRTCService.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/12/20.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"
#import "RXIMRTCAuthInfo.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMRTCService : NSObject

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
