#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXGoogleSDK/RXGoogleSDK.h>
#include "AppDelegateListener.h"
#include "RuiXueIOSBridgeGoogle.h"
#import <objc/runtime.h>

// 注册
void ios_GRegistWithClientID(const char* clientID)
{
    [[RXGoogleService sharedSDK] GRegistWithClientID:[RuiXueIOSBridgeUtils toNSString:clientID]];
}


@implementation RuiXueIOSBridgeGoogleDelegate

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgeGoogleDelegate sharedInstance];
    });
}

+ (instancetype)sharedInstance;
{
    static RuiXueIOSBridgeGoogleDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgeGoogleDelegate alloc] init];
        UnityRegisterAppDelegateListener(sharedInstance);
    });
    
    return sharedInstance;
}

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification
{
    NSDictionary* info = notification.userInfo;
    [[RXGoogleService sharedSDK] GOpenURL:[info objectForKey:@"url"]];
}
@end
