
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeReddit.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXRedditSDK/RXRedditSDK.h>

void iOS_reddit_init(const char* clientID, const char* redirectURI)
{
    [[RXRedditService sharedSDK] initWithClientID:[RuiXueIOSBridgeUtils toNSString:clientID] redirectURI:[RuiXueIOSBridgeUtils toNSString:redirectURI]];
}
