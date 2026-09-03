//
//  RuiXueIOSBridgePushManager.h
//  Unity-iPhone
//
//  Created by LiYuBo on 2024/3/9.
//

#ifndef RuiXueIOSBridgePushManager_h
#define RuiXueIOSBridgePushManager_h

@interface RuiXueIOSBridgePushManager: NSObject <RXPushDelegate>

@property NSData* deviceToken;

/**
 * 点击通知栏进入app
 */
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void(^)(void))completionHandler
API_AVAILABLE(ios(10.0));

/**
 * app在前台接到通知
 */
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
         willPresentNotification:(UNNotification *)notification
           withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
API_AVAILABLE(ios(10.0));


+ (instancetype)sharedInstance;


-(void)finishRemoteNotificationRegistration:(NSNotification*)notification;

@end

#endif /* RuiXueIOSBridgePushManager_h */
