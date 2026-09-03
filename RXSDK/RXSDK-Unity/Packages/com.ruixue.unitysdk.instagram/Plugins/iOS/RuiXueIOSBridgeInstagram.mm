
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeInstagram.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXInstagramSDK/RXInstagramSDK.h>

void iOS_Instagram_init(const char* clientID, const char* redirectURI)
{
    [[RXInstagramService sharedSDK] initWithClientID:[RuiXueIOSBridgeUtils toNSString:clientID] redirectURI:[RuiXueIOSBridgeUtils toNSString:redirectURI]];
}
