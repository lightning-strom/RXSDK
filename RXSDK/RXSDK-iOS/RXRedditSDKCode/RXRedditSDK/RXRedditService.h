//
//  RXRedditService.h
//  RxRedditSDK
//
//  Created by root11 on 2024/4/9.
//

#import <Foundation/Foundation.h>

@class RX_CommonRequestError;

typedef void(^RequestComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);


NS_ASSUME_NONNULL_BEGIN

// 分享类型
typedef NS_ENUM(NSUInteger, RXRedditShareType) {
    RXRedditShareTypeUrl = 0,     // URL类型
    RXRedditShareTypeText = 1,     // 文字类型
};

typedef void(^resposeBlock)(NSDictionary *successDic, NSDictionary *failDic);

@interface RXRedditService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册 Reddit
 * @param clientID 应用ID
 * @param redirectURI 应用重定向网址
 * 您在使用Reddit登录前需要在https://www.reddit.com/prefs/apps注册应用
 * 注册应用时自动生成应用ID，并设置重定向网址redirectURI
 */
- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI;

/**
 * Reddit 登录
 */
- (void)login;


/**
 * Reddit 分享URL或文本
 * @param type 分享类型
 * @param title 分享标题
 * @param url 分享类型为url地址时传此值，text传空@""
 * @param text 分享类型为文字类型时传此值，url传空@“”
 * @param srString reddit的Subreddit社区名称，需要填写您分享的目标社区名称
 * response {"code":0},分享成功；error为nil
 * error    {"code":"","msg":""}有值则分享失败；response为nil
 */
- (void)sendShareTypeWithType:(RXRedditShareType)type
                        title:(NSString *)title
                          url:(NSString *)url
                         text:(NSString *)text
                           sr:(NSString *)srString
                   completion:(void (^)(NSDictionary *response, NSDictionary *error))completion;

/**
 * reddit 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(RequestComplete)complete;


@end

NS_ASSUME_NONNULL_END
