#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeShare.h"
#include "RuiXueIOSBridgeUtils.h"

// 分享调度初始化
void ios_shareSchedulingInitWithFuncs(const char* funcsJson,
                                      RequestResponseCallBack onSuccess,
                                      RequestErrorCallBack onError)
{
    NSArray* funcs = [RuiXueIOSBridgeUtils toNSArray:funcsJson];
    
    [[RXShareService sharedSDK] shareSchedulingInitWithFuncs:funcs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"分享调度初始化成功");
            onSuccess("ios_shareSchedulingInitWithFuncs",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"分享调度初始化失败");
            onError("ios_shareSchedulingInitWithFuncs",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 获取埋点调度
void ios_getShareSchedulingWithFuncs(const char* funcsJson,
                                     RequestResponseCallBack onSuccess,
                                     RequestErrorCallBack onError)
{
    NSArray* funcs = [RuiXueIOSBridgeUtils toNSArray:funcsJson];
    
    [[RXShareService sharedSDK] getShareSchedulingWithFuncs:funcs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"获取埋点调度成功");
            onSuccess("ios_getShareSchedulingWithFuncs",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取埋点调度失败");
            onError("ios_getShareSchedulingWithFuncs",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 分享
void ios_share(const char* config,
               RequestResponseCallBack onSuccess,
               RequestErrorCallBack onError)
{
    RXShareConfig* shareConfig = [[RXShareConfig alloc] init];
    NSMutableDictionary* dic = [RuiXueIOSBridgeUtils fetchDicNotNull:config];
    
    shareConfig.func = (NSString*)[dic objectForKey:@"func"];
    shareConfig.platform = (NSString*)[dic objectForKey:@"platform"];
    shareConfig.region = (NSString*)[dic objectForKey:@"region"];
    shareConfig.transmits =(NSString*)[dic objectForKey:@"transmits"];
    shareConfig.iOSScheme =(NSString*)[dic objectForKey:@"protocol_ios"];
    shareConfig.androidScheme = (NSString*)[dic objectForKey:@"protocol_android"];
    shareConfig.useScheme = (NSString*)[dic objectForKey:@"use_scheme"];
    shareConfig.readCache = [[dic objectForKey:@"read_cache"] boolValue];
    shareConfig.useShortUrl = [[dic objectForKey:@"useShortUrl"] boolValue];
    shareConfig.autoReport = [[dic objectForKey:@"auto_report"] boolValue];
    shareConfig.ext = [dic objectForKey:@"ext"];
    shareConfig.properties = [dic objectForKey:@"properties"];
    
    [[RXShareService sharedSDK] share:shareConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"拉起分享成功");
            onSuccess("ios_share",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"拉起分享失败");
            onError("ios_share",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 自定义分享
void ios_shareCustom(const char* customConfig,
               RequestResponseCallBack onSuccess,
               RequestErrorCallBack onError)
{
    RXCustomShareConfig* shareConfig = [[RXCustomShareConfig alloc] init];
    NSMutableDictionary* dic = [RuiXueIOSBridgeUtils fetchDicNotNull:customConfig];
    
    shareConfig.platform = (NSString*)[dic objectForKey:@"platform"];
    shareConfig.thirdAppid = (NSString*)[dic objectForKey:@"appid"];
    shareConfig.iOSScheme = [NSString stringWithFormat:@"%@", [dic objectForKey:@"protocol_ios"]];
    shareConfig.androidScheme =(NSString*)[dic objectForKey:@"protocol_android"];
    shareConfig.useScheme = (NSString*)[dic objectForKey:@"use_scheme"];
    shareConfig.materialType = (NSString*)[dic objectForKey:@"material_type"];
    shareConfig.image = (NSString*)[dic objectForKey:@"image"];
    shareConfig.url = (NSString*)[dic objectForKey:@"url"];
    shareConfig.title = (NSString*)[dic objectForKey:@"title"];
    shareConfig.content = (NSString*)[dic objectForKey:@"content"];
    shareConfig.shareScene = [[dic objectForKey:@"shareScene"] intValue];
    shareConfig.x = [[dic objectForKey:@"x"] intValue];
    shareConfig.y = [[dic objectForKey:@"y"] intValue];
    shareConfig.width = [[dic objectForKey:@"width"] intValue];
    shareConfig.height = [[dic objectForKey:@"height"] intValue];
    
    [[RXShareService sharedSDK] shareCustom:shareConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"拉起自定义分享成功");
            onSuccess("ios_shareCustom",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"拉起自定义分享失败");
            onError("ios_shareCustom",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取分享信息
void ios_getShareInfoWithConfig(const char* config,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError)
{
    RXShareConfig* shareConfig = [[RXShareConfig alloc] init];
    NSMutableDictionary* dic = [RuiXueIOSBridgeUtils fetchDicNotNull:config];
    
    shareConfig.func = (NSString*)[dic objectForKey:@"func"];
    shareConfig.platform = (NSString*)[dic objectForKey:@"platform"];
    shareConfig.region = (NSString*)[dic objectForKey:@"region"];
    shareConfig.transmits =(NSString*)[dic objectForKey:@"transmits"];
    shareConfig.iOSScheme =(NSString*)[dic objectForKey:@"protocol_ios"];
    shareConfig.androidScheme = (NSString*)[dic objectForKey:@"protocol_android"];
    shareConfig.useScheme = (NSString*)[dic objectForKey:@"use_scheme"];
    shareConfig.readCache = [[dic objectForKey:@"read_cache"] boolValue];
    [[RXShareService sharedSDK] getShareInfoWithConfig: shareConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"获取分享信息成功");
            onSuccess("ios_getShareInfoWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取分享信息失败");
            onError("ios_getShareInfoWithConfig", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 分享/广告结果上报
void ios_shareSchedulingReportWithFunc(const char* func,
                                       const char* platform,
                                       const char* region,
                                       const char* transmits,
                                       bool schedulingEvent,
                                       const char* schedulingType,
                                       const char* propertiesDicJson,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError
                                       )
{
    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:[RuiXueIOSBridgeUtils toNSString:func] platform:[RuiXueIOSBridgeUtils toNSString:platform] region:[RuiXueIOSBridgeUtils toNSString:region] transmits:[RuiXueIOSBridgeUtils toNSString:transmits] scheduling_event:schedulingEvent scheduling_type:[RuiXueIOSBridgeUtils toNSString:schedulingType] properties:[RuiXueIOSBridgeUtils toNSDic:propertiesDicJson] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"分享结果上报成功");
            onSuccess("ios_shareSchedulingReportWithFunc",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"分享结果上报失败");
            onError("ios_shareSchedulingReportWithFunc",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取自动重定向短链接
void ios_getShortUrl(const char* url,
                     RequestResponseCallBack onSuccess,
                     RequestErrorCallBack onError)
{
    [[RXShareService sharedSDK] getShortUrl:[RuiXueIOSBridgeUtils toNSString:url] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"获取自动重定向短链接成功");
            onSuccess("ios_getShortUrl", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取自动重定向短链接失败");
            onError("ios_getShortUrl", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
