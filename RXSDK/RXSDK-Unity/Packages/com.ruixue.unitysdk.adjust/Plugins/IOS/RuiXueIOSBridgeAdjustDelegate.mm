#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeUtils.h"
#import <RXAdjustSDK/RXAdjustSDK.h>
#import <ADJConfig.h>
#import "RuiXueIOSBridgeAdjustDelegate.h"
#import "RuiXueIOSBridgeAdjust.h"



@implementation RuiXueIOSBridgeAdjustDelegate

static RuiXueIOSBridgeAdjustDelegate *_sharedInstance = nil;

+(instancetype) shareInstance
{
    static dispatch_once_t onceToken ;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[self alloc] init] ;
    }) ;

    return _sharedInstance ;
}

/**
 * @brief 归因回传
 * @param attribution 回传参数
 */
- (void)adjustAttributionChanged:(nullable RXADJAttribution *)attribution
{
    if(_onAttributionChanged != nil)
    {
        NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:attribution];
        
        _onAttributionChanged([RuiXueIOSBridgeUtils toJsonOut:dic]);
    }
}

/**
 * @brief 在成功跟踪事件时调用
 */
- (void)adjustEventTrackingSucceeded:(nullable RXADJEventSuccess *)eventSuccessResponseData
{
    if(_onEventTrackingSucceeded!=nil)
    {
        NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:eventSuccessResponseData];
        _onEventTrackingSucceeded([RuiXueIOSBridgeUtils toJsonOut:dic]);
    }
}

/**
 * @brief 在跟踪事件失败时调用
 */
- (void)adjustEventTrackingFailed:(nullable RXADJEventFailure *)eventFailureResponseData
{
    if(_onEventTrackingFailed!=nil)
    {
        NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:eventFailureResponseData];
        _onEventTrackingFailed([RuiXueIOSBridgeUtils toJsonOut:dic]);
    }
}

/**
 * @brief 在成功跟踪会话时调用
 */
- (void)adjustSessionTrackingSucceeded:(nullable RXADJSessionSuccess *)sessionSuccessResponseData
{
    if(_onSessionTrackingSucceeded!=nil)
    {
        NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:sessionSuccessResponseData];
        _onSessionTrackingSucceeded([RuiXueIOSBridgeUtils toJsonOut:dic]);
    }
}

/**
 * @brief 在跟踪会话失败时调用
 */
- (void)adjustSessionTrackingFailed:(nullable RXADJSessionFailure *)sessionFailureResponseData
{
    if(_onSessionTrackingFailed!=nil)
    {
        NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:sessionFailureResponseData];
        
        _onSessionTrackingFailed([RuiXueIOSBridgeUtils toJsonOut:dic]);
    }
}

- (void)adjustConversionValueUpdated:(nullable NSNumber *)conversionValue {
    
}


- (void)adjustConversionValueUpdated:(nullable NSNumber *)fineValue coarseValue:(nullable NSString *)coarseValue lockWindow:(nullable NSNumber *)lockWindow {
    
}


@end
