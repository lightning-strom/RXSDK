#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "AppDelegateListener.h"
#import <RXZaloSDK/RXZaloSDK.h>
#include "RuiXueIOSBridgeZalo.h"
#import <objc/runtime.h>

@implementation RuiXueIOSBridgeZaloDelegate

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgeZaloDelegate sharedInstance];
    });
}

+ (instancetype)sharedInstance;
{
    static RuiXueIOSBridgeZaloDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgeZaloDelegate alloc] init];
        UnityRegisterAppDelegateListener(sharedInstance);
    });
    
    return sharedInstance;
}

// notification will be posted from
// - (BOOL)application:(UIApplication*)application willFinishLaunchingWithOptions:(NSDictionary*)launchOptions
// notification user data is the NSDictionary containing launchOptions
-(void)applicationWillFinishLaunchingWithOptions:(NSNotification*)notification
{
    
}

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification
{
    NSDictionary* info = notification.userInfo;
    NSMutableDictionary<NSString*, id>* options = [NSMutableDictionary dictionaryWithCapacity: 2];
    
    options[UIApplicationOpenURLOptionsSourceApplicationKey]=[info objectForKey:@"sourceApplication"];
    
    options[UIApplicationOpenURLOptionsAnnotationKey] = [info objectForKey:@"annotation"];
    
    [[RXZaloService sharedSDK] application:[UIApplication sharedApplication] openURL:[info objectForKey:@"url"] options:options];
}
@end


void iOS_zalo_init(const char* appID)
{
    [[RXZaloService sharedSDK] initWithAppId:[RuiXueIOSBridgeUtils toNSString:appID]];
}
