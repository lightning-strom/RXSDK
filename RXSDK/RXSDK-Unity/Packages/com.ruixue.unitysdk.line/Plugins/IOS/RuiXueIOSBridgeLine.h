#ifndef __RuiXue__IOSBridge__Line__
#define __RuiXue__IOSBridge__Line__

@interface RuiXueIOSBridgeLineDelegate : NSObject<AppDelegateListener>

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification;
@end

#endif
