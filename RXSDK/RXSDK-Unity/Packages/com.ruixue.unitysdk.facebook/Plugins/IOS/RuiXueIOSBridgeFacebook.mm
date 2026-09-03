#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "AppDelegateListener.h"
#import <RXFacebookSDK/RXFacebookSDK.h>
#include "RuiXueIOSBridgeFacebook.h"
#import <objc/runtime.h>

@implementation RuiXueIOSBridgeFacebookDelegate

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgeFacebookDelegate sharedInstance];
    });
}

+ (instancetype)sharedInstance;
{
    static RuiXueIOSBridgeFacebookDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgeFacebookDelegate alloc] init];
        UnityRegisterAppDelegateListener(sharedInstance);
    });
    
    return sharedInstance;
}

// notification will be posted from
// - (BOOL)application:(UIApplication*)application willFinishLaunchingWithOptions:(NSDictionary*)launchOptions
// notification user data is the NSDictionary containing launchOptions
-(void)applicationWillFinishLaunchingWithOptions:(NSNotification*)notification
{
    [[RXFacebookService sharedSDK] FBRegistWithApplication:[UIApplication sharedApplication] launchOptions:notification.userInfo];
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

    [[RXFacebookService sharedSDK] FBApplication:[UIApplication sharedApplication] openURL:[info objectForKey:@"url"] options:options];
}
@end
