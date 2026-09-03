#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXPushSDK/RXPushSDK.h>

#import "RuiXueIOSBridgePushLifeCycle.h"
#import "RuiXueIOSBridgePushManager.h"
#import "AppDelegateListener.h"
@implementation RuiXueIOSBridgePushLifeCycle

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgePushLifeCycle sharedInstance];
    });
}

/// <#Description#>
+ (instancetype)sharedInstance {
    static RuiXueIOSBridgePushLifeCycle *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgePushLifeCycle alloc] init];
        
        NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
        [nc addObserverForName: UIApplicationDidBecomeActiveNotification
         object: nil
         queue: [NSOperationQueue mainQueue]
         usingBlock:^(NSNotification *notification) {
            RuiXueIOSBridgePushManager* manager = [RuiXueIOSBridgePushManager sharedInstance];
         }];
    
        [nc addObserverForName: kUnityWillFinishLaunchingWithOptions
         object: nil
         queue: [NSOperationQueue mainQueue]
         usingBlock:^(NSNotification *notification) {
            
            RuiXueIOSBridgePushManager* manager = [RuiXueIOSBridgePushManager sharedInstance];
            
            [[RXPushService sharedSDK] initUserNotificationCenter:manager];
         }];
        
        [nc addObserverForName: kUnityDidRegisterForRemoteNotificationsWithDeviceToken
         object: nil
         queue: [NSOperationQueue mainQueue]
        usingBlock:^(NSNotification *notification) {
            NSLog(@"didRegisterForRemoteNotificationsWithDeviceToken");
             RuiXueIOSBridgePushManager* manager = [RuiXueIOSBridgePushManager sharedInstance];

             [manager finishRemoteNotificationRegistration: notification];
         }];

        [nc addObserverForName: kUnityDidFailToRegisterForRemoteNotificationsWithError
         object: nil
         queue: [NSOperationQueue mainQueue]
         usingBlock:^(NSNotification *notification) {
             NSLog(@"didFailToRegisterForRemoteNotificationsWithError");
         }];
    });
    return sharedInstance;
}

@end
