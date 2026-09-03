#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXPushSDK/RXPushSDK.h>
#import "RuiXueIOSBridgePushManager.h"


@implementation RuiXueIOSBridgePushManager

+ (instancetype)sharedInstance
{
    static RuiXueIOSBridgePushManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgePushManager alloc] init];
    });

    return sharedInstance;
}

#pragma mark -- delegate
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    NSLog(@"点击通知栏进入app");
}
 
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    NSLog(@"app在前台接到通知");
}


- (void)finishRemoteNotificationRegistration:(NSNotification*)notification
{
    NSData* deviceTokenData;
    if ([notification.userInfo isKindOfClass: [NSData class]])
        deviceTokenData = (NSData*)notification.userInfo;
    

    if(deviceTokenData!= nil)
    {
        NSLog(@"RXPush 收到DeviceToken %@", deviceTokenData.description);
        
        _deviceToken = deviceTokenData;
    }
}

@end
