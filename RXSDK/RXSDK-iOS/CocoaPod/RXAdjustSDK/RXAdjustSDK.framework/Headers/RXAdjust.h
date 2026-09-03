//
//  RXAdjust.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import <Foundation/Foundation.h>
#import "RXAdjustCommonHeader.h"
#import "RXADJConfig.h"
#import "RXADJEvent.h"
#import "RXADJEventSuccess.h"
#import "RXADJEventFailure.h"
#import "RXADJSessionSuccess.h"
#import "RXADJSessionFailure.h"
#import "RXADJAttribution.h"
#import "RXADJThirdPartySharing.h"
#import "RXADJAdRevenue.h"
#import "RXADJSubscription.h"

/**
 * @brief 可选委托，将获得跟踪结果的通知
 */
@protocol RXAdjustDelegate <NSObject>

/**
 * @brief 归因回传
 * @param attribution 回传参数
 */
- (void)adjustAttributionChanged:(nullable RXADJAttribution *)attribution;

/**
 * @brief 在成功跟踪事件时调用
 */
- (void)adjustEventTrackingSucceeded:(nullable RXADJEventSuccess *)eventSuccessResponseData;

/**
 * @brief 在跟踪事件失败时调用
 */
- (void)adjustEventTrackingFailed:(nullable RXADJEventFailure *)eventFailureResponseData;

/**
 * @brief 在成功跟踪会话时调用
 */
- (void)adjustSessionTrackingSucceeded:(nullable RXADJSessionSuccess *)sessionSuccessResponseData;

/**
 * @brief 在跟踪会话失败时调用
 */
- (void)adjustSessionTrackingFailed:(nullable RXADJSessionFailure *)sessionFailureResponseData;

/**
 * @brief 可选的 SKAdNetwork pre 4.0 风格委托方法，当 Adjust SDK 为用户设置转换值时调用
 * @param conversionValue 调整SDK调用updateConversionValue时使用的转换值:API
 */
- (void)adjustConversionValueUpdated:(nullable NSNumber *)conversionValue;

/**
 * @brief 当调整SDK为用户设置转换值时调用的可选skadnetwork4.0样式委托方法。
 *        你可以使用这个回调，即使使用 pre 4.0 SKAdNetwork。
 *        在这种情况下，你可以期望粗值和 lockWindow 值为 nil。
 *
 * @param fineValue 设置的转换值
 * @param coarseValue 设置的粗略值
 * @param lockWindow 锁定窗口。
 */
- (void)adjustConversionValueUpdated:(nullable NSNumber *)fineValue
                         coarseValue:(nullable NSString *)coarseValue
                          lockWindow:(nullable NSNumber *)lockWindow;

@end


NS_ASSUME_NONNULL_BEGIN

@interface RXAdjust : NSObject

@property (nonatomic, weak) id <RXAdjustDelegate> delegate;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 * @param adjustConfig 初始化配置
 */
- (void)appDidLaunch:(RXADJConfig *)adjustConfig;

/**
 * 设置日志
 * @param logLevel 日志等级
 */
- (void)setLogLevel:(RXADJLogLevel)logLevel;

/**
 * 记录事件
 * @param event 事件名称
 */
- (void)trackEvent:(RXADJEvent *)event;

/**
 * 添加回传参数
 * @param eventToken 事件 token
 * @param params 回传参数
 */
- (void)addEventCallbackWithEventToken:(NSString *)eventToken
                                params:(NSDictionary *)params;

/**
 * 延迟启动
 * 默认情况下，Adjust SDK 会在应用打开时启动。如果您想通过会话参数发送的数据在应用打开时不可用，那么则可以延迟 SDK 启动。
 * 当您想发送唯一标识符等信息时，这一方法尤其有效。
 * @param delayStart 延迟时间（秒）
 */
- (void)setDelayStart:(double)delayStart;

/**
 * 会话回传参数
 * @param key 默认回调key
 * @param value 默认回调value
 */
- (void)addSessionCallbackParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/**
 * 从会话包中删除默认回调参数
 * @param key 要删除的key
 */
- (void)removeSessionCallbackParameter:(nonnull NSString *)key;

/**
 * 删除所有回调参数
 */
- (void)resetSessionCallbackParameters;

/**
 * 添加默认伙伴参数，该参数将随每个跟踪会话一起发送
 * @param key 默认伙伴参数key.
 * @param value 默认伙伴参数value.
 */
- (void)addSessionPartnerParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/**
 * 删除默认伙伴参数
 * @param key 要删除的key
 */
- (void)removeSessionPartnerParameter:(nonnull NSString *)key;

/**
 * 删除所有伙伴参数
 */
- (void)resetSessionPartnerParameters;

/**
 * 更新转化值
 * @param conversionValue 给定用户设置的转换值
 */
- (void)updateConversionValue:(NSInteger)conversionValue;

/**
 * 用户归因
 */
- (nullable RXADJAttribution *)attribution;

/**
 * 离线模式
 * @param enabled YES 为激活离线模式，NO 为关闭离线模式
 */
- (void)setOfflineMode:(BOOL)enabled;

/**
 * 事件缓冲
 * @param enabled YES 为激活事件缓冲，NO 为关闭事件缓冲
 */
- (void)setEventBufferingEnabled:(BOOL)enabled;

/**
 * GDPR 的被遗忘权
 * 根据欧盟的《一般数据保护条例》(GDPR) 第 17 条规定，用户行使被遗忘权时 (RTBF)，您可以通知 Adjust。调用gdprForgetMe方法让 Adjust SDK 将用户的 RTBF 请求发送至 Adjust 后端。
 */
- (void)gdprForgetMe;

/**
 * 针对三方分享的处理
 */
- (void)trackThirdPartySharing:(nonnull RXADJThirdPartySharing *)thirdPartySharing;

/**
 * 禁用第三方数据分享
 * 你可以在 SDK 层级禁用第三方分享。这意味着 Adjust 不会与第三方分享任何用户信息。要完成此操作，请调用disableThirdPartySharing方法。
 */
- (void)disableThirdPartySharing;

/**
 * 数据驻留
 * 通过数据驻留 (data residency) 功能，您可以选择 Adjust 将您的数据存储在哪个国家。当应用运营的国家拥有严格的隐私规定时，此功能会非常有用。设置数据驻留后，Adjust 会将您的数据存储在所选地区的数据中心。
 */
- (void)setUrlStrategy:(NSString *)urlStrategy;

/**
 * 针对特定用户的许可监测
 */
- (void)trackMeasurementConsent:(BOOL)enabled;

/**
 * 跟踪广告收入
 * @param source Ad revenue source.
 * @param payload Ad revenue payload.
 */
- (void)trackAdRevenue:(nonnull NSString *)source payload:(nonnull NSData *)payload;

/**
 * 跟踪订阅
 */
- (void)trackSubscription:(nonnull RXADJSubscription *)subscription;

/**
 * 预装应用
 * 您可以通过 Adjust SDK 查看您的应用是否被预安装在了用户设备上。要完成此操作，您需要设置一个默认跟踪链接：
 * 在控制面板中创建新跟踪链接。该链接将作为默认跟踪链接，用来跟踪应用是否已被预安装。
 * 控制面板会用如下方式将识别码显示在链接中：https://app.adjust.com/abc123 跟踪码是位于链接最后的六位至八位代码。
 */
- (void)setDefaultTracker:(NSString *)tracker;

/**
 * 推送标签
 * 推送标签 (Push token) 用于受众分群工具和客户回传。
 * 您可以在获得推送标签或推送标签发生更新时将其发送至Adjust。
 * 要完成此操作，请使用推动标签调用setDeviceToken方法。您应该在委托文件的didRegisterForRemoveNotificationsWithDeviceToken方法中进行调用。
 */
- (void)setDeviceToken:(NSData *)deviceToken;

/**
 * 开启后台跟踪
 * 默认情况下，应用在后台运行时，Adjust SDK 会暂停发送请求。您可以通过在设置实例中调用setSendInBackground方法来进行变更。
 */
- (void)setSendInBackground:(BOOL)enabled;

/**
 * 停用 Adjust SDK
 * 可以通过停用和重启 Adjust SDK 来停止和恢复信息发送
 * @note 该设置在会话间保存
 */
- (void)setEnabled:(BOOL)enable;

/**
 * 获取idfa
 */
- (NSString *)idfa;

/**
 * 获取adid
 */
- (NSString *)adid;

/**
 * 获取adid
 * 未初始化时调用
 * @param delayStart 延迟启动时间，默认不延迟
 */
- (NSString *)getAdidWithAppToken:(NSString *)appToken
                       delayStart:(NSInteger)delayStart;

/**
 * 设置外部设备 ID
 */
- (void)setExternalDeviceId:(NSString *)deviceId;

@end

NS_ASSUME_NONNULL_END
