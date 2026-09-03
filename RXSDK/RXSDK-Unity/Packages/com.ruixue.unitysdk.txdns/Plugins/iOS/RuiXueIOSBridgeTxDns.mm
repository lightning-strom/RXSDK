#include "RuiXueIOSBridgeTxDns.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXTecentCloudDNSSDK/RXTecentCloudDNSSDK.h>

void ios_TxDns_initWithAppID(const char* appID, const char* dnsID, const char* dnsKey, bool debug)
{
    NSString *appIDStr = [RuiXueIOSBridgeUtils toNSString:appID];
    NSString *dnsIDStr = [RuiXueIOSBridgeUtils toNSString:dnsID];
    int dnsIDValue = [dnsIDStr intValue];
    NSString *dnsKeyStr = [RuiXueIOSBridgeUtils toNSString:dnsKey];
    [[RXTecentCloudDNSSDKService sharedSDK] initWithAppID:appIDStr dnsID:dnsIDValue dnsKey:dnsKeyStr debug:debug];
}
