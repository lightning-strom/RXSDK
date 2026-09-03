//
//  RXAdjust.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import "RXAdjust.h"
#import <Adjust/Adjust.h>
#import "RXADJTool.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXAdjust () <AdjustDelegate>

@property (nonatomic, strong) ADJConfig *adjustConfig;
@property (nonatomic, assign) BOOL isInit;

@end

@implementation RXAdjust

static RXAdjust *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXAdjust alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isInit = NO;
        
        [RXSubPackage sharedSDK].aAdjust = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustInit:) name:rxUserDefault_adjust_init object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustEvnet:) name:rxUserDefault_adjust_event object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustSession:) name:rxUserDefault_adjust_session object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)adjustInit:(NSNotification *)noti
{
    NSString *appToken = noti.userInfo[@"appToken"];
    NSInteger delay = [noti.userInfo[@"delay"] integerValue];
    [RXSubPackage sharedSDK].adid = [self getAdidWithAppToken:appToken delayStart:delay];
}

- (void)adjustEvnet:(NSNotification *)noti
{
    NSString *eventToken = noti.userInfo[@"eventToken"];
    NSDictionary *params = noti.userInfo[@"params"];
    [self addEventCallbackWithEventToken:eventToken params:params];
}

- (void)adjustSession:(NSNotification *)noti
{
    NSDictionary *userInfo = noti.userInfo;
    
    for (int i = 0; i < userInfo.allKeys.count; i++) {
        if (userInfo.allValues[i]) {
            [self addSessionCallbackParameter:userInfo.allKeys[i] value:userInfo.allValues[i]];
        }
    }
}

/**
 * 初始化
 * @param adjustConfig 初始化配置
 */
- (void)appDidLaunch:(RXADJConfig *)adjustConfig
{
    self.adjustConfig = [ADJConfig configWithAppToken:adjustConfig.appToken
                                          environment:adjustConfig.environment];
//    [self.adjustConfig setDelayStart:adjustConfig.delayStart];
//    [self.adjustConfig setLogLevel:[RXADJTool getADJLogLevel:adjustConfig.logLevel]];
    self.adjustConfig.delegate = self;
    [Adjust appDidLaunch:self.adjustConfig];
    
//    self.isInit = YES;
}

/**
 * 设置日志
 * @param logLevel 日志等级
 */
- (void)setLogLevel:(RXADJLogLevel)logLevel
{
    [self.adjustConfig setLogLevel:[RXADJTool getADJLogLevel:logLevel]];
}

/**
 * 记录事件
 */
- (void)trackEvent:(RXADJEvent *)event
{
    [Adjust trackEvent:[RXADJTool getADJEvent:event]];
}

/**
 * 添加回传参数
 * @param eventToken 事件 token
 * @param params 回传参数
 */
- (void)addEventCallbackWithEventToken:(NSString *)eventToken
                                params:(NSDictionary *)params
{
    ADJEvent *event = [ADJEvent eventWithEventToken:eventToken];
    
    for (int i = 0; i < params.allKeys.count; i++) {
        NSString *key = params.allKeys[i];
        NSString *value = [NSString stringWithFormat:@"%@", params[key]];
        
        if (value && value.length > 0) {
            [event addCallbackParameter:key value:value];
        }
    }
    
    NSLog(@"添加回传参数\neventToken = %@\nparams=%@", eventToken, params);
    
    [Adjust trackEvent:event];
}

/**
 * 延迟启动
 * 默认情况下，Adjust SDK 会在应用打开时启动。如果您想通过会话参数发送的数据在应用打开时不可用，那么则可以延迟 SDK 启动。
 * 当您想发送唯一标识符等信息时，这一方法尤其有效。
 */
- (void)setDelayStart:(double)delayStart
{
    [self.adjustConfig setDelayStart:delayStart];
}

/**
 * 会话回传参数
 */
- (void)addSessionCallbackParameter:(nonnull NSString *)key value:(nonnull NSString *)value
{
    NSLog(@"设置会话回传参数: key = %@  value = %@", key, value);
    [Adjust addSessionCallbackParameter:key value:value];
}

/**
 * 从会话包中删除默认回调参数
 */
- (void)removeSessionCallbackParameter:(nonnull NSString *)key
{
    [Adjust removeSessionCallbackParameter:key];
}

/**
 * 删除所有回调参数
 */
- (void)resetSessionCallbackParameters
{
    [Adjust resetSessionCallbackParameters];
}

/**
 * 添加默认伙伴参数，该参数将随每个跟踪会话一起发送
 */
- (void)addSessionPartnerParameter:(nonnull NSString *)key value:(nonnull NSString *)value
{
    [Adjust addSessionPartnerParameter:key value:value];
}

/**
 * 删除默认伙伴参数
 */
- (void)removeSessionPartnerParameter:(nonnull NSString *)key
{
    [Adjust removeSessionPartnerParameter:key];
}

/**
 * 删除所有伙伴参数
 */
- (void)resetSessionPartnerParameters
{
    [Adjust resetSessionPartnerParameters];
}

/**
 * 更新转化值
 */
- (void)updateConversionValue:(NSInteger)conversionValue
{
    [Adjust updateConversionValue:conversionValue];
}

/**
 * 用户归因
 */
- (nullable RXADJAttribution *)attribution
{
    ADJAttribution *attribution = [Adjust attribution];
    return [RXADJTool getADJAttribution:attribution];
}

/**
 * 离线模式
 */
- (void)setOfflineMode:(BOOL)enabled
{
    [Adjust setOfflineMode:enabled];
}

/**
 * 事件缓冲
 * @param enabled YES 为激活事件缓冲，NO 为关闭事件缓冲
 */
- (void)setEventBufferingEnabled:(BOOL)enabled
{
    [self.adjustConfig setEventBufferingEnabled:enabled];
}

/**
 * GDPR 的被遗忘权
 */
- (void)gdprForgetMe
{
    [Adjust gdprForgetMe];
}

/**
 * 针对三方分享的处理
 */
- (void)trackThirdPartySharing:(nonnull RXADJThirdPartySharing *)thirdPartySharing
{
    ADJThirdPartySharing *adjustThirdPartySharing = [[ADJThirdPartySharing alloc] initWithIsEnabledNumberBool:thirdPartySharing.enabled];
    
    if (thirdPartySharing.granularPName.count > 0) {
        for (int i = 0; i < thirdPartySharing.granularPName.count; i++) {
            [adjustThirdPartySharing addGranularOption:thirdPartySharing.granularPName[i] key:thirdPartySharing.granularKeys[i] value:thirdPartySharing.granularValues[i]];
        }
    }
    
    if (thirdPartySharing.partnerPName.count > 0) {
        for (int i = 0; i < thirdPartySharing.partnerPName.count; i++) {
            [adjustThirdPartySharing addPartnerSharingSetting:thirdPartySharing.partnerPName[i] key:thirdPartySharing.partnerKeys[i] value:thirdPartySharing.partnerValues[i]];
        }
    }
    
    [Adjust trackThirdPartySharing:adjustThirdPartySharing];
}

/**
 * 禁用第三方数据分享
 * 你可以在 SDK 层级禁用第三方分享。这意味着 Adjust 不会与第三方分享任何用户信息。要完成此操作，请调用disableThirdPartySharing方法。
 */
- (void)disableThirdPartySharing
{
    [Adjust disableThirdPartySharing];
}

/**
 * 数据驻留
 */
- (void)setUrlStrategy:(NSString *)urlStrategy
{
    [self.adjustConfig setUrlStrategy:urlStrategy];
}

/**
 * 针对特定用户的许可监测
 */
- (void)trackMeasurementConsent:(BOOL)enabled
{
    [Adjust trackMeasurementConsent:enabled];
}

/**
 * 跟踪广告收入
 */
- (void)trackAdRevenue:(nonnull NSString *)source payload:(nonnull NSData *)payload
{
    [Adjust trackAdRevenue:source payload:payload];
}

/**
 * 跟踪订阅
 */
- (void)trackSubscription:(nonnull RXADJSubscription *)subscription
{
    [Adjust trackSubscription:[RXADJTool getADJSubscription:subscription]];
}

/**
 * 获取idfa
 */
- (NSString *)idfa
{
    return [Adjust idfa];
}

/**
 * 获取adid
 */
- (NSString *)adid
{
    return [Adjust adid];
}

/**
 * 获取adid
 * 未初始化时调用
 * @param delayStart 延迟启动时间，默认不延迟
 */
- (NSString *)getAdidWithAppToken:(NSString *)appToken
                       delayStart:(NSInteger)delayStart
{
    if (!self.isInit) {
        RXADJConfig *config = [RXADJConfig configWithAppToken:appToken environment:RXADJEnvironmentProduction];
        if (delayStart > 0) {
            config.delayStart = delayStart;
        }
        [[RXAdjust sharedSDK] appDidLaunch:config];
    }
    return [Adjust adid];
}

/**
 * 设置外部设备 ID
 */
- (void)setExternalDeviceId:(NSString *)deviceId
{
    [self.adjustConfig setExternalDeviceId:deviceId];
}

/**
 * 预装应用
 */
- (void)setDefaultTracker:(NSString *)tracker
{
    [self.adjustConfig setDefaultTracker:tracker];
}

/**
 * 推送标签
 */
- (void)setDeviceToken:(NSData *)deviceToken
{
    [Adjust setDeviceToken:deviceToken];
}

/**
 * 开启后台跟踪
 */
- (void)setSendInBackground:(BOOL)enabled
{
    [self.adjustConfig setSendInBackground:enabled];
}

/**
 * 停用 Adjust SDK
 * 可以通过停用和重启 Adjust SDK 来停止和恢复信息发送
 */
- (void)setEnabled:(BOOL)enable
{
    [Adjust setEnabled:enable];
}

#pragma mark -- AdjustDelegate
// 归因回传
- (void)adjustAttributionChanged:(ADJAttribution *)attribution
{
    NSLog(@"收到 Adjutst 回调");
    RXADJAttribution *rxAttribution = [RXADJTool getADJAttribution:attribution];
    NSDictionary *rxAttributionDic = [RXADJTool dicFromObject:rxAttribution];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotificationName:@"RXSDK_adjustAttributionChanged" object:nil userInfo:rxAttributionDic];
    });
    if (self.delegate && [self.delegate respondsToSelector:@selector(adjustAttributionChanged:)]) {
        [self.delegate adjustAttributionChanged:rxAttribution];
    }
}

// 事件成功回调
- (void)adjustEventTrackingSucceeded:(ADJEventSuccess *)eventSuccessResponseData
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(adjustEventTrackingSucceeded:)]) {
        [self.delegate adjustEventTrackingSucceeded:[RXADJTool getRXEventSuccess:eventSuccessResponseData]];
    }
}

// 事件回调失败
- (void)adjustEventTrackingFailed:(ADJEventFailure *)eventFailureResponseData
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(adjustEventTrackingFailed:)]) {
        [self.delegate adjustEventTrackingFailed:[RXADJTool getRXEventFailure:eventFailureResponseData]];
    }
}

// 会话跟踪成功
- (void)adjustSessionTrackingSucceeded:(ADJSessionSuccess *)sessionSuccessResponseData
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(adjustSessionTrackingSucceeded:)]) {
        [self.delegate adjustSessionTrackingSucceeded:[RXADJTool getRXSessionSuccess:sessionSuccessResponseData]];
    }
}

// 会话跟踪失败
- (void)adjustSessionTrackingFailed:(ADJSessionFailure *)sessionFailureResponseData
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(adjustSessionTrackingFailed:)]) {
        [self.delegate adjustSessionTrackingFailed:[RXADJTool getRXSessionFailure:sessionFailureResponseData]];
    }
}

@end
