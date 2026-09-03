/**
 * RuixueSDKWrapper+Share.mm
 * 瑞雪 SDK iOS 原生层实现 - 分享模块
 * 
 * 包含：一键分享（share）、自定义分享（shareCustom）
 * 使用 RXSDK_Pure 的 share / shareCustom 接口
 */

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#import "RuixueSDKWrapper+Share.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@implementation RuixueSDKWrapper (Share)

#pragma mark - 一键分享

- (void)shareWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 一键分享: params=%@", params);
    
    NSString *func = params[@"func"] ?: @"";
    NSString *platform = params[@"platform"] ?: @"wechat";
    
    if (func.length == 0) {
        [self callbackWithAction:@"share" code:-1 msg:@"func（埋点标识）不能为空" data:nil];
        return;
    }
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = func;
    config.platform = platform;
    
    // 可选参数
    if (params[@"shareScene"]) {
        config.shareScene = [params[@"shareScene"] integerValue];
    }
    if (params[@"region"]) {
        config.region = params[@"region"];
    }
    if (params[@"transmits"]) {
        config.transmits = params[@"transmits"];
    }
    if (params[@"iOSScheme"]) {
        config.iOSScheme = params[@"iOSScheme"];
    }
    if (params[@"useScheme"]) {
        config.useScheme = params[@"useScheme"];
    }
    if (params[@"useShortUrl"]) {
        config.useShortUrl = [params[@"useShortUrl"] boolValue];
    }
    if (params[@"autoReport"]) {
        config.autoReport = [params[@"autoReport"] boolValue];
    }
    if ([params[@"game_info"] isKindOfClass:[NSDictionary class]]) {
        config.game_info = params[@"game_info"];
    }
    if ([params[@"ext"] isKindOfClass:[NSDictionary class]]) {
        config.ext = params[@"ext"];
    }
    
    [[RXSDK sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] 一键分享失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"share" response:error.responesObject];
            } else {
                [self callbackWithAction:@"share" code:-1 msg:@"分享失败" data:nil];
            }
            return;
        }
        
        NSLog(@"[RuixueSDK] 一键分享成功: %@", response);
        [self callbackWithAction:@"share" response:response];
    }];
}

#pragma mark - 自定义分享

- (void)shareCustomWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 自定义分享: params=%@", params);
    
    NSString *platform = params[@"platform"] ?: @"wechat";
    NSString *materialType = params[@"type"] ?: @"link";
    
    RXCustomShareConfig *config = [[RXCustomShareConfig alloc] init];
    config.platform = platform;
    config.materialType = materialType;
    
    // 可选参数
    if (params[@"title"]) {
        config.title = params[@"title"];
    }
    if (params[@"content"]) {
        config.content = params[@"content"];
    }
    if (params[@"url"]) {
        config.url = params[@"url"];
    }
    if (params[@"image"]) {
        config.image = params[@"image"];
    }
    if (params[@"video"]) {
        config.video = params[@"video"];
    }
    if (params[@"shareScene"]) {
        config.shareScene = [params[@"shareScene"] integerValue];
    }
    if (params[@"thirdAppid"]) {
        config.thirdAppid = params[@"thirdAppid"];
    }
    if (params[@"iOSScheme"]) {
        config.iOSScheme = params[@"iOSScheme"];
    }
    if (params[@"useScheme"]) {
        config.useScheme = params[@"useScheme"];
    }
    if ([params[@"game_info"] isKindOfClass:[NSDictionary class]]) {
        config.game_info = params[@"game_info"];
    }
    if ([params[@"ext"] isKindOfClass:[NSDictionary class]]) {
        config.ext = params[@"ext"];
    }
    
    [[RXSDK sharedSDK] shareCustom:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] 自定义分享失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"shareCustom" response:error.responesObject];
            } else {
                [self callbackWithAction:@"shareCustom" code:-1 msg:@"分享失败" data:nil];
            }
            return;
        }
        
        NSLog(@"[RuixueSDK] 自定义分享成功: %@", response);
        [self callbackWithAction:@"shareCustom" response:response];
    }];
}

#pragma mark - 客服

- (void)openCustomerService {
    NSLog(@"[RuixueSDK] 打开客服");
    // TODO: 调用瑞雪 SDK 客服功能
}

@end

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
