#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#import <RXAdjustSDK/RXAdjustSDK.h>
#import <ADJConfig.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeUtils.h"
#import "RuiXueIOSBridgeFirebase.h"
#import <RXFirebaseSDK/RXFirebaseSDK.h>


// 初始化
void ios_firebase_configure()
{
    [[RXFirebaseService sharedSDK] configure];
}

// 发送事件
void ios_firebase_logEvent(const char* name, const char* parameters)
{
    NSString* eventName = [RuiXueIOSBridgeUtils toNSString:name];
    NSDictionary* dic = [RuiXueIOSBridgeUtils toNSDic:parameters];
    
    [[RXFirebaseService sharedSDK] logEventWithName:eventName parameters:dic];
}

// 设置默认事件参数
void ios_firebase_setDefaultEventParameters(const char* parameters)
{
    NSDictionary* dic = [RuiXueIOSBridgeUtils toNSDic:parameters];
    [[RXFirebaseService sharedSDK] setDefaultEventParameters:dic];
}

// 设置用户属性
void ios_firebase_setUserProperty(const char* name, const char* value)
{
    [[RXFirebaseService sharedSDK] setUserPropertyString:[RuiXueIOSBridgeUtils toNSString:value] forName:[RuiXueIOSBridgeUtils toNSString:name]];
}

// 设置用户id
void ios_firebase_setUserID(const char* userID)
{
    [[RXFirebaseService sharedSDK] setUserID:[RuiXueIOSBridgeUtils toNSString:userID]];
}

// 是否启用数据收集
void ios_firebase_setAnalyticsCollectionEnabled(bool enable)
{
    [[RXFirebaseService sharedSDK] setAnalyticsCollectionEnabled:enable];
}
