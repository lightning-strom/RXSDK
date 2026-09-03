#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeUtils.h"
#import "NSString+JSONCategories.h"
#import "RuiXueIOSBridgeLoginDelegate.h"

@implementation RuiXueIOSBridgeLoginDelegate

static RuiXueIOSBridgeLoginDelegate *_sharedInstance = nil;

+(instancetype) shareInstance
{
    static dispatch_once_t onceToken ;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[self alloc] init] ;
    }) ;

    return _sharedInstance ;
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary * _Nullable)response error:(RX_CommonRequestError *)error
{
    if(!error)
    {
        NSLog(@"登录成功");
        if(_onLoginSuccess)
            _onLoginSuccess("ios_loginWithLoginType",[RuiXueIOSBridgeUtils toJsonOut:response]);
    }
    else
    {
        NSLog(@"登录失败");
        if(_onLoginError)
            _onLoginError("ios_loginWithLoginType", [RuiXueIOSBridgeUtils toJsonOut:error.responesObject]);
    }
}


- (void)rx_antiCallBackWithResponse:(NSDictionary *)response error:(NSError *)error
{
    if(!error)
    {
        NSLog(@"反沉迷成功");
        if(_onAntiSuccess)
            _onAntiSuccess("ios_antiAddition", [RuiXueIOSBridgeUtils toJsonOut:response]);
    }
    else
    {
        NSLog(@"反沉迷失败");
        if(_onAntiError)
            _onAntiError("ios_antiAddition", [RuiXueIOSBridgeUtils toStrOut:error.localizedDescription]);
    }
}


@end
