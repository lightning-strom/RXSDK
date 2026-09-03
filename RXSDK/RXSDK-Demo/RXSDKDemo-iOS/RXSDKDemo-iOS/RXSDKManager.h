//
//  RXSDKManager.h
//  RXSDKDemo-iOS
//
//  Created by RXSDK on 2026/1/22.
//
//  RXSDK 管理类
//  负责管理 SDK 的初始化、登录、支付等接口调用
//  与 UI 代码分离，便于维护和测试
//
//  API 文档关联：
//  - 初始化: RXSDK-Doc/ios/api/rxservice_api.md
//  - 登录:   RXSDK-Doc/ios/api/rxservice_api.md#登录相关
//  - 支付:   RXSDK-Doc/ios/api/iap_api.md
//  - 分享:   RXSDK-Doc/ios/api/rxservice_api.md#分享

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// 环境类型
typedef NS_ENUM(NSInteger, RXSDKEnvironment) {
    RXSDKEnvironmentDomestic = 0,   // 国内环境
    RXSDKEnvironmentOverseas = 1    // 海外环境
};

// 国内环境默认参数
extern NSString * const RXSDKDomesticCPID;
extern NSString * const RXSDKDomesticProductID;
extern NSString * const RXSDKDomesticChannelID;
extern NSString * const RXSDKDomesticBaseURL;

// 海外环境默认参数
extern NSString * const RXSDKOverseasCPID;
extern NSString * const RXSDKOverseasProductID;
extern NSString * const RXSDKOverseasChannelID;
extern NSString * const RXSDKOverseasBaseURL;

// 默认初始化参数（根据当前环境动态获取）
extern NSString * const RXSDKDefaultCPID;
extern NSString * const RXSDKDefaultProductID;
extern NSString * const RXSDKDefaultChannelID;
extern NSString * const RXSDKDefaultBaseURL;

// 默认语言
extern NSString * const RXSDKDefaultLanguage;

// 屏幕方向
typedef NS_ENUM(NSInteger, RXSDKOrientation) {
    RXSDKOrientationPortrait = 0,   // 竖屏
    RXSDKOrientationLandscape = 1   // 横屏
};

/**
 * 初始化回调
 */
typedef void(^RXSDKInitCallback)(BOOL success, NSDictionary * _Nullable response, NSError * _Nullable error);

/**
 * 通用请求回调
 */
typedef void(^RXSDKRequestCallback)(NSDictionary * _Nullable response, NSError * _Nullable error);

@interface RXSDKManager : NSObject

#pragma mark - 单例

/**
 * 获取单例实例
 */
+ (instancetype)sharedManager;

#pragma mark - SDK 状态

/**
 * SDK 是否已初始化
 */
@property (nonatomic, assign, readonly) BOOL isInitialized;

/**
 * 当前初始化参数
 */
@property (nonatomic, copy, readonly, nullable) NSString *currentCpid;
@property (nonatomic, copy, readonly, nullable) NSString *currentProductId;
@property (nonatomic, copy, readonly, nullable) NSString *currentChannelId;
@property (nonatomic, copy, readonly, nullable) NSString *currentBaseUrl;

/**
 * 当前语言
 */
@property (nonatomic, copy, readonly) NSString *currentLanguage;

/**
 * 当前屏幕方向
 */
@property (nonatomic, assign, readonly) RXSDKOrientation currentOrientation;

/**
 * 当前环境
 */
@property (nonatomic, assign, readonly) RXSDKEnvironment currentEnvironment;

#pragma mark - 环境设置

/**
 * 获取支持的环境列表
 * @return 环境数组，每个元素为 @{@"value": @0, @"name": @"国内"}
 */
+ (NSArray<NSDictionary *> *)supportedEnvironments;

/**
 * 设置环境
 * @param environment 环境类型
 */
- (void)setEnvironment:(RXSDKEnvironment)environment;

/**
 * 获取当前环境显示名称
 */
- (NSString *)currentEnvironmentDisplayName;

/**
 * 是否为国内环境
 */
- (BOOL)isDomestic;

/**
 * 获取当前环境的默认 CPID
 */
- (NSString *)envDefaultCpid;

/**
 * 获取当前环境的默认 Product ID
 */
- (NSString *)envDefaultProductId;

/**
 * 获取当前环境的默认 Channel ID
 */
- (NSString *)envDefaultChannelId;

/**
 * 获取当前环境的默认 Base URL
 */
- (NSString *)envDefaultBaseUrl;

#pragma mark - 语言设置

/**
 * 获取支持的语言列表
 * @return 语言数组，每个元素为 @{@"code": @"zh-Hans", @"name": @"简体中文"}
 */
+ (NSArray<NSDictionary *> *)supportedLanguages;

/**
 * 设置 SDK 语言
 * @param languageCode 语言代码（如 zh-Hans, en, ja 等）
 */
- (void)setLanguage:(NSString *)languageCode;

/**
 * 获取当前语言显示名称
 */
- (NSString *)currentLanguageDisplayName;

/**
 * 获取当前语言索引
 */
- (NSInteger)languageIndex;

#pragma mark - 屏幕方向设置

/**
 * 获取支持的屏幕方向列表
 * @return 方向数组，每个元素为 @{@"value": @0, @"name": @"竖屏"}
 */
+ (NSArray<NSDictionary *> *)supportedOrientations;

/**
 * 设置屏幕方向
 * @param orientation 屏幕方向
 */
- (void)setOrientation:(RXSDKOrientation)orientation;

/**
 * 获取当前屏幕方向显示名称
 */
- (NSString *)currentOrientationDisplayName;

/**
 * 是否为竖屏
 */
- (BOOL)isPortrait;

#pragma mark - 初始化

/**
 * 使用默认参数初始化 SDK
 * @param callback 初始化回调
 */
- (void)initWithDefaultParamsWithCallback:(RXSDKInitCallback)callback;

/**
 * 使用自定义参数初始化 SDK
 * @param cpid      瑞雪分配的唯一 ID
 * @param productId 产品 ID
 * @param channelId 渠道 ID
 * @param baseUrl   API 域名
 * @param callback  初始化回调
 */
- (void)initWithCpid:(NSString *)cpid
           productId:(NSString *)productId
           channelId:(NSString *)channelId
             baseUrl:(NSString *)baseUrl
            callback:(RXSDKInitCallback)callback;

/**
 * 重置 SDK 状态
 */
- (void)reset;

#pragma mark - 登录

/**
 * 游客登录
 * @param callback 登录回调
 */
- (void)loginAsGuestWithCallback:(RXSDKRequestCallback)callback;

/**
 * 账号密码登录
 * @param username 用户名
 * @param password 密码
 * @param callback 登录回调
 */
- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
                 callback:(RXSDKRequestCallback)callback;

/**
 * 验证码登录
 * @param phone    手机号
 * @param captcha  验证码
 * @param callback 登录回调
 */
- (void)loginWithPhone:(NSString *)phone
               captcha:(NSString *)captcha
              callback:(RXSDKRequestCallback)callback;

/**
 * 发送验证码
 * @param phone    手机号
 * @param callback 回调
 */
- (void)sendCaptchaWithPhone:(NSString *)phone
                    callback:(RXSDKRequestCallback)callback;

/**
 * 获取法务配置
 * @param callback 回调
 */
- (void)getLegalInfoWithCallback:(RXSDKRequestCallback)callback;

#pragma mark - 用户信息

/**
 * 获取用户信息
 * @param callback 回调
 */
- (void)getUserInfoWithCallback:(RXSDKRequestCallback)callback;

/**
 * 获取指定用户信息
 * @param params   请求参数 map
 * @param callback 回调
 */
- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            callback:(RXSDKRequestCallback)callback;

#pragma mark - 支付

/**
 * 发起支付
 * @param productId 商品 ID
 * @param orderId   订单号
 * @param callback  支付回调
 */
- (void)payWithProductId:(NSString *)productId
                 orderId:(NSString *)orderId
                callback:(RXSDKRequestCallback)callback;

#pragma mark - 分享

/**
 * 分享
 * @param platform 分享平台
 * @param callback 分享回调
 */
- (void)shareWithPlatform:(NSString *)platform
                 callback:(RXSDKRequestCallback)callback;

#pragma mark - 埋点

/**
 * 数据埋点
 * @param event      事件名
 * @param properties 属性
 */
- (void)trackWithEvent:(NSString *)event
            properties:(NSDictionary * _Nullable)properties;

#pragma mark - 其他功能

/**
 * 打开反馈页面
 */
- (void)openFeedback;

/**
 * 申请注销账号
 * @param callback 回调
 */
- (void)deregisterWithCallback:(RXSDKRequestCallback)callback;

@end

NS_ASSUME_NONNULL_END
