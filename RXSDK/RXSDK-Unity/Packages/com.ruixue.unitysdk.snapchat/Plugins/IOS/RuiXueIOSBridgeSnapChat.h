#ifndef __RuiXue__IOSBridge__SnapChat__
#define __RuiXue__IOSBridge__SnapChat__

@interface RuiXueIOSBridgeSnapChatDelegate : NSObject<AppDelegateListener>

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification;

@end

#endif
