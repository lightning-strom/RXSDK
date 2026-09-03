#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#import <RXAdjustSDK/RXAdjustSDK.h>
#import <ADJConfig.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeUtils.h"
#import "RuiXueIOSBridgeAdjustDelegate.h"
#import "RuiXueIOSBridgeAdjust.h"


// 初始化
void ios_adjust_init(const char* config)
{
    NSMutableDictionary* dic = [RuiXueIOSBridgeUtils fetchDicNotNull:config];
    
    NSString* appToken = (NSString *)[dic objectForKey:@"appToken"];
    NSString* environment = (NSString *)[dic objectForKey:@"environment"];
    
    RXADJConfig* adjustConfig = [RXADJConfig configWithAppToken:appToken environment:environment];
    
    adjustConfig.delayStart = [[dic objectForKey:@"delayStart"] intValue];
    adjustConfig.logLevel = (RXADJLogLevel)[[dic objectForKey:@"rxLogLevel"] intValue];
    
    [[RXAdjust sharedSDK] appDidLaunch: adjustConfig];
    
    bool bufferEnable = [[dic objectForKey:@"eventBufferingEnabled"] boolValue];
    [[RXAdjust sharedSDK] setEventBufferingEnabled:bufferEnable];
    
    bool sendInBackground = [[dic objectForKey:@"sendInBackground"] boolValue];
    [[RXAdjust sharedSDK] setSendInBackground:sendInBackground];
    
    NSString* externalDeviceId = (NSString *)[dic objectForKey:@"externalDeviceId"];
    
    if(externalDeviceId != nil)
    {
        [[RXAdjust sharedSDK] setExternalDeviceId:externalDeviceId];
    }
    
    NSString* urlStrategy = (NSString *)[dic objectForKey:@"urlStrategy"];
    
    if(urlStrategy!=nil)
    {
        [[RXAdjust sharedSDK] setUrlStrategy:urlStrategy];
    }
}

// 设置delegate
void ios_adjust_setDelegate(DelegateAdjustAttributionChanged onAttributionChanged, DelegateAdjustEventTrackingSucceeded onEventTrackingSucceeded, DelegateAdjustEventTrackingFailed onEventTrackingFailed, DelegateAdjustSessionTrackingSucceeded onSessionTrackingSucceeded, DelegateAdjustSessionTrackingFailed onSessionTrackingFailed)
{
    RuiXueIOSBridgeAdjustDelegate* delegate = [RuiXueIOSBridgeAdjustDelegate shareInstance];
    [RXAdjust sharedSDK].delegate = delegate;
    if(onAttributionChanged != nil)
    {
        delegate.onAttributionChanged = onAttributionChanged;
    }
    
    if(onEventTrackingSucceeded !=nil)
    {
        delegate.onEventTrackingSucceeded = onEventTrackingSucceeded;
    }
    
    if(onEventTrackingFailed != nil)
    {
        delegate.onEventTrackingFailed = onEventTrackingFailed;
    }
    
    if(onSessionTrackingSucceeded != nil)
    {
        delegate.onSessionTrackingSucceeded = onSessionTrackingSucceeded;
    }
    
    if(onSessionTrackingFailed != nil)
    {
        delegate.onSessionTrackingFailed = onSessionTrackingFailed;
    }
}

// 记录事件
void ios_adjust_trackEvent(const char* event)
{
    NSMutableDictionary* dic = [RuiXueIOSBridgeUtils fetchDicNotNull:event];
    
    NSString* eventToken = (NSString *)[dic objectForKey:@"eventToken"];
    RXADJEvent* adjEvent = [RXADJEvent eventWithEventToken:eventToken];
    double revenue = [[dic objectForKey:@"revenue"] doubleValue];
    NSString* currency = (NSString *)[dic objectForKey:@"eventToken"];
    
    if(currency != nil && revenue>0)
    {
        [adjEvent setRevenue:revenue currency:currency];
    }
    
    NSString* orderId = (NSString *)[dic objectForKey:@"orderId"];
    if(orderId != nil)
    {
        [adjEvent setTransactionId:orderId];
    }
    
    NSDictionary* callBackParameter = [dic objectForKey:@"callbackParameters"];
    if(callBackParameter!= nil)
    {
        for (NSString *key in callBackParameter) {
            NSString* value = callBackParameter[key];
            [adjEvent addCallbackParameter:key value:value];
        }
    }
    
    NSDictionary* partnerParameters = [dic objectForKey:@"partnerParameters"];
    if(partnerParameters!=nil)
    {
        for (NSString *key in partnerParameters) {
            NSString* value = partnerParameters[key];
            [adjEvent addPartnerParameter:key value:value];
        }
    }
    
    NSString* callbackId = (NSString *)[dic objectForKey:@"callbackId"];
    if(callbackId!= nil)
    {
        [adjEvent setCallbackId:callbackId];
    }
    
    [[RXAdjust sharedSDK] trackEvent:adjEvent];
}

// 添加默认伙伴参数
void ios_adjust_addSessionPartnerParameter(const char* key, const char* value)
{
    [[RXAdjust sharedSDK] addSessionPartnerParameter:[RuiXueIOSBridgeUtils toNSString:key] value:[RuiXueIOSBridgeUtils toNSString:value]];
}

// 删除默认伙伴参数
void ios_adjust_removeSessionPartnerParameter(const char* key)
{
    [[RXAdjust sharedSDK] removeSessionPartnerParameter:[RuiXueIOSBridgeUtils toNSString:key]];
}

// 删除所有伙伴参数
void ios_adjust_resetSessionPartnerParameters()
{
    [[RXAdjust sharedSDK] resetSessionPartnerParameters];
}

// 添加会话回调参数
void ios_adjust_addSessionCallbackParameter(const char* key, const char* value)
{
    [[RXAdjust sharedSDK] addSessionCallbackParameter:[RuiXueIOSBridgeUtils toNSString:key] value:[RuiXueIOSBridgeUtils toNSString:value]];
}

// 从会话包中删除默认回调参数
void ios_adjust_removeSessionCallbackParameter(const char* key)
{
    [[RXAdjust sharedSDK] removeSessionCallbackParameter:[RuiXueIOSBridgeUtils toNSString:key]];
}

// 删除所有回调参数
void ios_adjust_resetSessionCallbackParameters()
{
    [[RXAdjust sharedSDK] resetSessionCallbackParameters];
}

// 获取用户归因
const char* ios_adjust_getAttribution()
{
    RXADJAttribution *attribution = [[RXAdjust sharedSDK] attribution];
    NSDictionary* dic = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:attribution];
    const char* json = [RuiXueIOSBridgeUtils toJsonOut:dic];
    return strdup(json);
}
