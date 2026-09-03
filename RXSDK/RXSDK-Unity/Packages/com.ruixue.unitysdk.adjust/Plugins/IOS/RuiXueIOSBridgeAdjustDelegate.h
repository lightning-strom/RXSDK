#ifndef __RuiXue__IOSBridge__Adjust__Delegate__
#define __RuiXue__IOSBridge__Adjust__Delegate__

extern "C"
{
    
typedef void (*DelegateAdjustAttributionChanged)(const char* data);

typedef void (*DelegateAdjustEventTrackingSucceeded)(const char* data);

typedef void (*DelegateAdjustEventTrackingFailed)(const char* data);

typedef void (*DelegateAdjustSessionTrackingSucceeded)(const char* data);

typedef void (*DelegateAdjustSessionTrackingFailed)(const char* data);

}

@interface RuiXueIOSBridgeAdjustDelegate : NSObject<RXAdjustDelegate>

+(instancetype) shareInstance ;

@property DelegateAdjustAttributionChanged onAttributionChanged;
@property DelegateAdjustEventTrackingSucceeded onEventTrackingSucceeded;
@property DelegateAdjustEventTrackingFailed onEventTrackingFailed;
@property DelegateAdjustSessionTrackingSucceeded onSessionTrackingSucceeded;
@property DelegateAdjustSessionTrackingFailed  onSessionTrackingFailed;

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

@end


#endif
