#ifndef __RuiXue__IOSBridge__Google__
#define __RuiXue__IOSBridge__Google__


extern "C"
{
// 注册
void ios_GRegistWithClientID(const char* clientID);
}

@interface RuiXueIOSBridgeGoogleDelegate : NSObject<AppDelegateListener>

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification;

@end

#endif
