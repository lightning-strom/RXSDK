/**
 * RuixueSDKWrapper+Pay.mm
 * 瑞雪 SDK iOS 原生层实现 - 支付模块（Apple IAP）
 * 
 * iOS 端仅支持 Apple IAP 内购支付
 * 使用 RXSDK_Pure 的 [[RXSDK sharedSDK] iap:complete:] 接口
 * 
 * C++ 传入参数格式:
 * {
 *     "goodsTag": "com.game.product001",   // 商品标签/计费点（必填）
 *     "tradeNo": "cp_order_001",           // CP 订单号（必填）
 *     "currency": "CNY",                   // 币种（可选，默认 CNY）
 *     "transmitArgs": "",                  // CP 透传参数（可选）
 *     "ext": {},                           // 扩展参数（可选）
 *     "notifyUrl": "",                     // 发货回调地址（可选）
 * }
 */

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#import "RuixueSDKWrapper+Pay.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@implementation RuixueSDKWrapper (Pay)

- (void)payWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 发起 Apple IAP 支付: params=%@", params);
    
    // 解析 C++ 传入的参数
    NSString *goodsTag = params[@"goodsTag"] ?: @"";
    NSString *tradeNo = params[@"tradeNo"] ?: @"";
    NSString *currency = params[@"currency"] ?: @"CNY";
    NSString *transmitArgs = params[@"transmitArgs"] ?: @"";
    
    // 参数校验
    if (goodsTag.length == 0) {
        [self callbackWithAction:@"pay" code:-1 msg:@"goodsTag（商品标签）不能为空" data:nil];
        return;
    }
    if (tradeNo.length == 0) {
        [self callbackWithAction:@"pay" code:-1 msg:@"tradeNo（CP 订单号）不能为空" data:nil];
        return;
    }
    
    // 解析扩展参数
    NSDictionary *extDict = params[@"ext"];
    if (![extDict isKindOfClass:[NSDictionary class]]) {
        extDict = @{};
    }
    
    // 构造 IAP 订单参数（按 MCP IAP 模板规范）
    NSMutableDictionary *orderDict = [NSMutableDictionary dictionaryWithDictionary:@{
        @"trade_no": tradeNo,               // 必填，订单号
        @"currency": currency,              // 币种，默认 CNY
        @"goods_tag": goodsTag,             // 商品标签
        @"env": @(0),                       // 0 正式 1 沙盒
        @"indulge_auth": @(0),              // 0 不验证防沉迷 1 验证
        @"is_debug": @(0),                  // 0 正式订单 1 测试订单
        @"ext": extDict                     // 扩展字段
    }];
    
    // 可选：透传参数
    if (transmitArgs.length > 0) {
        orderDict[@"transmit_args"] = transmitArgs;
    }
    
    // 可选：发货回调地址
    NSString *notifyUrl = params[@"notifyUrl"];
    if (notifyUrl.length > 0) {
        orderDict[@"notify_url"] = notifyUrl;
    }
    
    // 调用瑞雪 SDK IAP 支付
    [[RXSDK sharedSDK] iap:orderDict complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] IAP 支付失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"pay" response:error.responesObject];
            } else {
                [self callbackWithAction:@"pay" code:-1 msg:@"IAP 支付失败" data:nil];
            }
            return;
        }
        
        NSInteger code = [response[@"code"] integerValue];
        if (code == 0) {
            NSLog(@"[RuixueSDK] IAP 支付成功: %@", response);
            // 直接返回 SDK 完整响应
            [self callbackWithAction:@"pay" response:response];
        } else {
            NSLog(@"[RuixueSDK] IAP 支付业务失败: %@", response);
            [self callbackWithAction:@"pay" response:response];
        }
    }];
}

@end

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
