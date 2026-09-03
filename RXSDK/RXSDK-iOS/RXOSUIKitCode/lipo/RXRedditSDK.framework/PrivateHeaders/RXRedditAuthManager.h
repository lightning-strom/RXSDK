//
//  RXRedditAuthManager.h
//  RXRedditSDK
//
//  Created by root11 on 2024/4/11.
//

#import <Foundation/Foundation.h>


NS_ASSUME_NONNULL_BEGIN

/**
 * 返回modhash的block
 * @param isNeedLogin 是否需要登录授权，默认为NO
 * @param accesstoken token令牌
 * @param errorDic 错误信息
 *
 */
typedef void(^RedditAuthCompletionBlock)(BOOL isNeedLogin, NSString *accesstoken, NSDictionary *errorDic);



@interface RXRedditAuthManager : NSObject


/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 存储accesstoken
 * @param accessToken 获取到的reddit的token
 * @param seconds reddit的token过期时间
 * @param type 操作类型 0登录授权 1分享
 */
- (void)saveAccessToken:(NSString *)accessToken expires_inSeconds:(NSString *)seconds operationType:(NSInteger)type;

/**
 * 分享之前，检查并获取accessToken与modhash，是否过期
 * 未过期则返回modHash；过期则isNeedLogin为YES，需重新登录授权
 */
- (void)checkAccessTokenAndModHashWithCompletion:(RedditAuthCompletionBlock)completion;


@end

NS_ASSUME_NONNULL_END
