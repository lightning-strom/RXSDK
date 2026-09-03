#include "RuiXueIOSBridgePush.h"
#import <RXSDK_Pure/RXService.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#import <RXPushSDK/RXPushSDK.h>
#include "RuiXueIOSBridgeUtils.h"
#import "RuiXueIOSBridgePushManager.h"
#import <string.h>

void ios_push_initWithProductId(const char* productid,
                           const char* channelid,
                           const char* cpid,
                           const char* baseUrlArrayJson)
{
     
    [[RXPushService sharedSDK] initWithProductId:[RuiXueIOSBridgeUtils toNSString:productid] channelId:[RuiXueIOSBridgeUtils toNSString:channelid] cpid:[RuiXueIOSBridgeUtils toNSString:cpid] baseUrlList:[RuiXueIOSBridgeUtils toNSArray:baseUrlArrayJson]];
}


// 注册通知
void ios_push_registerDeviceToken()
{
    NSData* deviceToken = [RuiXueIOSBridgePushManager sharedInstance].deviceToken;
    
    NSLog(@"注册 deviceToken = %@", deviceToken.description);
    
    [[RXPushService sharedSDK] registerDeviceToken:deviceToken];
}

// 获取token
const char* ios_push_getDeviceToken()
{
    NSData* deviceToken = [RuiXueIOSBridgePushManager sharedInstance].deviceToken;
    
    NSUInteger dataLength = deviceToken.length;
    if (dataLength == 0) {
      return "";
    }
    const unsigned char *dataBuffer = (const unsigned char *)deviceToken.bytes;
    NSMutableString *hexTokenString  = [NSMutableString stringWithCapacity:(dataLength * 2)];
    for (int i = 0; i < dataLength; ++i) {
      [hexTokenString appendFormat:@"%02x", dataBuffer[i]];
    }

    const char* token = [RuiXueIOSBridgeUtils toStrOut:hexTokenString];
    
    return strdup(token);
}

// 绑定别名
void ios_push_bindingAlias(const char* alias)
{
    [[RXPushService sharedSDK] bindingAlias:[RuiXueIOSBridgeUtils toNSString:alias]];
}


// 解绑别名
void ios_push_reliveBinding()
{
    [[RXPushService sharedSDK] reliveBinding];
}

// 增加用户标签
void ios_push_addTags(const char* tags)
{
    [[RXPushService sharedSDK] addTags:[RuiXueIOSBridgeUtils toNSArray:tags]];
}

// 移除用户标签
void ios_push_deleteTags(const char* tags)
{
    [[RXPushService sharedSDK] deleteTags:[RuiXueIOSBridgeUtils toNSArray:tags]];
}


// 解绑用户与渠道SDK的关联
void ios_push_reliveBindingPushDevice()
{
    [[RXPushService sharedSDK] reliveBindingPushDevice];
}
