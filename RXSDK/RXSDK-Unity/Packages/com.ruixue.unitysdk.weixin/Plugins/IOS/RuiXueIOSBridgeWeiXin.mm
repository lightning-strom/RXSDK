#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXWXSDK/RXWXSDK.h>
#include "AppDelegateListener.h"
#include "RuiXueIOSBridgeWeiXin.h"

// 配置universallink
void ios_configUniversallink(const char* universallink)
{
    [[RXWXService sharedSDK] configUniversallink:[RuiXueIOSBridgeUtils toNSString:universallink]];
}

// 检测是否安装微信
bool ios_isWXAppInstalled()
{
    return [[RXWXService sharedSDK] isWXAppInstalled];
}


// 跳转到微信并打开小程序
void ios_openMiniProgram(const char* jsonDicParams)
{
    [[RXWXService sharedSDK] openMiniProgram:[RuiXueIOSBridgeUtils toNSDic:jsonDicParams] complete:^(NSString * _Nonnull extMsg) {
            
    }];
}


@implementation RuiXueIOSBridgeWeiXinDelegate

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgeWeiXinDelegate sharedInstance];
    });
}

+ (instancetype)sharedInstance;
{
    static RuiXueIOSBridgeWeiXinDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[RuiXueIOSBridgeWeiXinDelegate alloc] init];
        UnityRegisterAppDelegateListener(sharedInstance);
    });
    
    return sharedInstance;
}


// notification will be posted from
// - (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
// notification user data is the NSDictionary containing all the params
- (void)onOpenURL:(NSNotification*)notification
{
    NSDictionary* info = notification.userInfo;
    [[RXWXService sharedSDK] handleOpenUrl:[info objectForKey:@"url"]];
}
@end
