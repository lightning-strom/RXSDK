//
//  RXIMSDKApi.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/27.
//

#import <Foundation/Foundation.h>
#import <RXNetworkingKit/RXNetworkingKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSDKApi : NSObject

/**
 * 登陆
 * @param userid 用户id
 */
+ (RXCommonRequest *)buildLoginRequestWithUserId:(NSString *)userid;

@end

NS_ASSUME_NONNULL_END
