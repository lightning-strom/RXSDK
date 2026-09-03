#include "RuiXueIOSBridgeAliDns.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXAliCloudDNSSDK/RXAliCloudDNSSDK.h>

//阿里DNS初始化
void ios_AliDns_initWithAppID(const char* accountID, const char* secretKey, bool debug)
{
    NSString *accountIDStr = [RuiXueIOSBridgeUtils toNSString:accountID];
    int accountIDValue = [accountIDStr intValue];
    NSString *secretKeyStr = [RuiXueIOSBridgeUtils toNSString:secretKey];
    [[RXAliCloudDNSSDKService sharedSDK] initWithAccountID:accountIDValue secretKey:secretKeyStr debug:debug];
}
