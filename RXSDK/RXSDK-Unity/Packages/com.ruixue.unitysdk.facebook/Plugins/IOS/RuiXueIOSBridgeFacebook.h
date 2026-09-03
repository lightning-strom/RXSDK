#ifndef __RuiXue__IOSBridge__Facebook__
#define __RuiXue__IOSBridge__Facebook__

@interface RuiXueIOSBridgeFacebookDelegate : NSObject<AppDelegateListener>

// notification will be posted from
// - (BOOL)application:(UIApplication*)application willFinishLaunchingWithOptions:(NSDictionary*)launchOptions
// notification user data is the NSDictionary containing launchOptions
-(void)applicationWillFinishLaunchingWithOptions:(NSNotification*)notification;

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification;

@end

#endif
