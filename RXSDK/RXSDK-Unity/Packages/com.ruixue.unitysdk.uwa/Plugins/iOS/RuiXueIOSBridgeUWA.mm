#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeUWA.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

//获取UWA开关与上传时间间隔
void ios_uwaGetInfoWithFuncs(getInfoCallBack onGetInfo)
{
    [[RXUWAService sharedSDK] getTypeAndTsWithBlock:^(NSString * _Nonnull data) {
        onGetInfo([data UTF8String]);
    }];
}

//上传UWA信息
void ios_uploadUwaInfoFunc(const char* uwaInfo)
{
    [[RXUWAService sharedSDK] uploadUWAInfo:[RuiXueIOSBridgeUtils toNSString:uwaInfo]];
}

//携带UWA信息发送通知
void ios_postNotiWithUwaInfoFunc(const char* uwaInfo)
{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"reportWithUwaInfo" object:[RuiXueIOSBridgeUtils toNSString:uwaInfo]];
}

void ios_registerCallback(CallbackDelegate cb)
{
    callback = cb;
}

void callbackGetUwaNotiInfo()
{
    if (callback) {
        callback();
    } else {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"reportWithUwaInfo" object:@"{\"version\":\"1.0.0\"}"];
    }
}


@implementation RuiXueIOSBridgeUWA

static RuiXueIOSBridgeUWA *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化属性
        [RXSubPackage sharedSDK].aUWA = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gpmAction:) name:rxUserDefault_uwa_gpm object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)gpmAction:(NSNotification *)noti
{   
    [self callCSharpMethodFunction];
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (void)callCSharpMethodFunction {
    callbackGetUwaNotiInfo();
}

@end
