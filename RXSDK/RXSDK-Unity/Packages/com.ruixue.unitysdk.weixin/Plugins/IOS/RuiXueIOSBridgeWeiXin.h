#ifndef __RuiXue__IOSBridge__WeiXin__
#define __RuiXue__IOSBridge__WeiXin__


extern "C"
{
// 配置universallink
void ios_configUniversallink(const char* universallink);

// 检测是否安装微信
bool ios_isWXAppInstalled();


// 跳转到微信并打开小程序
void ios_openMiniProgram(const char* jsonDicParams);
}

@interface RuiXueIOSBridgeWeiXinDelegate : NSObject<AppDelegateListener>

// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification;

@end

#endif
