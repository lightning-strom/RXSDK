/**
 * RuixueSDKWrapper.mm
 * 瑞雪 SDK iOS 原生层实现 - 核心模块
 * 
 * 包含核心功能：初始化、API 登录、登出、获取用户信息、IAP 支付
 * 依赖：RXSDK_Pure（IAP 支付为基础库自带功能）
 */

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#import "RuixueSDKWrapper.h"
#import <UIKit/UIKit.h>

// 瑞雪 SDK 核心头文件
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXUpdateCheckService.h>
#import <RXGDTSDK/RXGDTSDK.h>

// 条件引入 RXUIKit（用于初始化时注册 UI 服务）
#if __has_include(<RXUIKit/RXUIKitService.h>)
#import <RXUIKit/RXUIKitService.h>
#define RXUIKIT_AVAILABLE 1
#else
#define RXUIKIT_AVAILABLE 0
#endif

// 引入 C++ 桥接层
#include "../RuixueBridge.h"

@interface RuixueSDKWrapper ()

@property (nonatomic, copy) NSString *appId;
@property (nonatomic, copy) NSString *appKey;
@property (nonatomic, assign, readwrite) BOOL initialized;

@end

@implementation RuixueSDKWrapper

#pragma mark - 单例

+ (instancetype)sharedInstance {
    static RuixueSDKWrapper *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[RuixueSDKWrapper alloc] init];
    });
    return instance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _initialized = NO;
    }
    return self;
}

#pragma mark - JSON 辅助方法

- (NSDictionary *)parseJsonString:(NSString *)jsonString {
    if (!jsonString || jsonString.length == 0) {
        return @{};
    }
    
    NSError *error = nil;
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    id result = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    
    if (error || ![result isKindOfClass:[NSDictionary class]]) {
        NSLog(@"[RuixueSDK] JSON 解析失败: %@", error);
        return @{};
    }
    
    return result;
}

- (NSString *)dictToJsonString:(NSDictionary *)dict {
    if (!dict) {
        return @"{}";
    }
    
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:0 error:&error];
    if (error) {
        return @"{}";
    }
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (NSString *)buildResponseWithCode:(NSInteger)code msg:(NSString *)msg data:(NSDictionary *)data {
    NSDictionary *response = @{
        @"code": @(code),
        @"msg": msg ?: @"",
        @"data": data ?: @{}
    };
    return [self dictToJsonString:response];
}

- (void)callbackWithAction:(NSString *)action response:(NSDictionary *)response {
    NSString *responseJson = [self dictToJsonString:response];
    ruixue::RuixueBridge::getInstance()->onResult(std::string([action UTF8String]), std::string([responseJson UTF8String]));
}

- (void)callbackWithAction:(NSString *)action code:(NSInteger)code msg:(NSString *)msg data:(NSDictionary *)data {
    NSString *responseJson = [self buildResponseWithCode:code msg:msg data:data];
    ruixue::RuixueBridge::getInstance()->onResult(std::string([action UTF8String]), std::string([responseJson UTF8String]));
}

#pragma mark - Toast 提示

- (void)showToast:(NSString *)message {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        if (!window) {
            window = [UIApplication sharedApplication].windows.firstObject;
        }
        
        UILabel *toastLabel = [[UILabel alloc] init];
        toastLabel.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.7];
        toastLabel.textColor = [UIColor whiteColor];
        toastLabel.textAlignment = NSTextAlignmentCenter;
        toastLabel.font = [UIFont systemFontOfSize:14.0];
        toastLabel.text = message;
        toastLabel.alpha = 0.0;
        toastLabel.layer.cornerRadius = 8;
        toastLabel.clipsToBounds = YES;
        toastLabel.numberOfLines = 0;
        
        CGSize maxSize = CGSizeMake(window.bounds.size.width - 80, 100);
        CGSize expectedSize = [message boundingRectWithSize:maxSize
                                                    options:NSStringDrawingUsesLineFragmentOrigin
                                                 attributes:@{NSFontAttributeName: toastLabel.font}
                                                    context:nil].size;
        
        CGFloat labelWidth = expectedSize.width + 30;
        CGFloat labelHeight = expectedSize.height + 20;
        
        toastLabel.frame = CGRectMake((window.bounds.size.width - labelWidth) / 2,
                                      window.bounds.size.height - 150,
                                      labelWidth,
                                      labelHeight);
        
        [window addSubview:toastLabel];
        
        [UIView animateWithDuration:0.3 animations:^{
            toastLabel.alpha = 1.0;
        } completion:^(BOOL finished) {
            [UIView animateWithDuration:0.3 delay:2.0 options:UIViewAnimationOptionCurveEaseOut animations:^{
                toastLabel.alpha = 0.0;
            } completion:^(BOOL finished) {
                [toastLabel removeFromSuperview];
            }];
        }];
    });
}

#pragma mark - SDK 生命周期

- (void)initWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSString *cpid = params[@"cpid"] ?: @"";
    NSString *productId = params[@"productId"] ?: @"";
    NSString *channelId = params[@"channelId"] ?: @"";
    
    self.appId = cpid;
    self.appKey = productId;
    
    NSLog(@"[RuixueSDK] 初始化 SDK: params=%@", params);
    
    NSArray<NSString *> *baseUrls = @[];
    id baseUrlsObj = params[@"baseUrls"];
    if ([baseUrlsObj isKindOfClass:[NSArray class]]) {
        baseUrls = baseUrlsObj;
    }
    
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.cpId = cpid;
    config.productId = productId;
    config.channelId = channelId;
    config.baseUrlList = baseUrls;
    
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *rxError) {
        if (rxError) {
            NSLog(@"[RuixueSDK] 初始化失败: %@", rxError.responesObject);
            if (rxError.responesObject) {
                [self callbackWithAction:@"init" response:rxError.responesObject];
            } else {
                [self callbackWithAction:@"init" code:-1 msg:@"初始化失败" data:nil];
            }
            return;
        }
        
        NSLog(@"[RuixueSDK] 初始化成功: %@", response);
        self.initialized = YES;
        
        // 如果 RXUIKit 可用，注册 UI 服务
#if RXUIKIT_AVAILABLE
        [[RXUIKitService sharedSDK] regist];
        NSLog(@"[RuixueSDK] RXUIKit 已注册");
#else
        NSLog(@"[RuixueSDK] RXUIKit 未引入，跳过 UI 服务注册");
#endif
        
        if (response) {
            [self callbackWithAction:@"init" response:response];
        } else {
            [self callbackWithAction:@"init" code:0 msg:@"初始化成功" data:nil];
        }
    }];
}

- (void)setGameInfoWithRoleId:(NSString *)roleId serverId:(NSString *)serverId {
    [[RXService sharedSDK] setGameInfoWithRoleId:roleId ?: @""
                                      regionTag:serverId ?: @"default"];
}

#pragma mark - 用户系统（核心）

- (void)loginWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 调用 API 登录, params=%@", params);
    
    if (!self.initialized) {
        [self callbackWithAction:@"login" code:-1 msg:@"SDK 未初始化" data:nil];
        return;
    }
    
    RXLoginConfig *config = [[RXLoginConfig alloc] init];
    
    NSString *loginType = params[@"loginType"] ?: @"guest";
    
    if ([loginType.lowercaseString isEqualToString:@"guest"]) {
        config.loginType = LoginTypeVisitor;
    } else if ([loginType.lowercaseString isEqualToString:@"username"]) {
        config.loginType = LoginTypeAccount;
    } else if ([loginType.lowercaseString isEqualToString:@"phone"]) {
        config.loginType = LoginTypeCapCode;
    } else if ([loginType.lowercaseString isEqualToString:@"apple"]) {
        config.loginType = LoginTypeApple;
    } else if ([loginType.lowercaseString isEqualToString:@"wechat"]) {
        config.loginType = LoginTypeW;
    } else if ([loginType.lowercaseString isEqualToString:@"google"]) {
        config.loginType = LoginTypeGoogle;
    } else if ([loginType.lowercaseString isEqualToString:@"facebook"]) {
        config.loginType = LoginTypeFacebook;
    } else {
        config.loginType = LoginTypeVisitor;
    }
    
    if (params[@"username"]) {
        config.username = params[@"username"];
    }
    if (params[@"password"]) {
        config.password = params[@"password"];
    }
    if (params[@"captchaCode"]) {
        config.captchaCode = params[@"captchaCode"];
    }
    
    [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] API 登录失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"login" response:error.responesObject];
            } else {
                [self callbackWithAction:@"login" code:-1 msg:@"登录失败" data:nil];
            }
            return;
        }
        
        NSLog(@"[RuixueSDK] API 登录成功: %@", response);
        
        if (response) {
            [self callbackWithAction:@"login" response:response];
        } else {
            [self callbackWithAction:@"login" code:0 msg:@"登录成功" data:nil];
        }
    }];
}

- (void)logout {
    NSLog(@"[RuixueSDK] 调用登出");
    [self callbackWithAction:@"logout" code:0 msg:@"登出成功" data:nil];
}

- (void)getUserInfo {
    NSLog(@"[RuixueSDK] 获取用户信息");
    
    [[RXSDK sharedSDK] getUserInfoWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"[RuixueSDK] 获取用户信息失败: %@", error.responesObject);
            [self callbackWithAction:@"userInfo" code:-1 msg:@"获取用户信息失败" data:nil];
        } else {
            NSLog(@"[RuixueSDK] 获取用户信息成功: %@", response);
            NSDictionary *data = response[@"data"];
            if (data) {
                [self callbackWithAction:@"userInfo" code:0 msg:@"获取用户信息成功" data:data];
            } else {
                [self callbackWithAction:@"userInfo" code:0 msg:@"获取用户信息成功" data:response];
            }
        }
    }];
}

- (void)getUserInfoByFieldWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 获取指定用户信息: params=%@", params);
    
    [[RXSDK sharedSDK] getUserInfoByFieldWithParams:params complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"[RuixueSDK] 获取指定用户信息失败: %@", error.responesObject);
            [self callbackWithAction:@"userInfoByField" code:-1 msg:@"获取指定用户信息失败" data:nil];
        } else {
            NSLog(@"[RuixueSDK] 获取指定用户信息成功: %@", response);
            NSDictionary *data = response[@"data"];
            if (data) {
                [self callbackWithAction:@"userInfoByField" code:0 msg:@"获取指定用户信息成功" data:data];
            } else {
                [self callbackWithAction:@"userInfoByField" code:0 msg:@"获取指定用户信息成功" data:response];
            }
        }
    }];
}

- (void)updateGameVersionWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 游戏版本检查 V2: params=%@", params);

    [[RXUpdateCheckService sharedSDK] updateGameVersionWithInfo:params complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            if (error.responesObject) {
                [self callbackWithAction:@"updateGameVersion" response:error.responesObject];
            } else {
                [self callbackWithAction:@"updateGameVersion" code:-1 msg:@"版本检查失败" data:nil];
            }
        } else {
            [self callbackWithAction:@"updateGameVersion" response:response ?: @{}];
        }
    }];
}

#pragma mark - GDT 转化归因

- (void)gdtRegisterSdk {
    [[RXGDTService sharedSDK] regist];
}

- (void)gdtInitializeWithActionSetId:(NSString *)actionSetId secretKey:(NSString *)secretKey {
    [[RXGDTService sharedSDK] initWithActionSetId:actionSetId secretKey:secretKey];
}

- (void)gdtReportRegisterWithMethod:(NSString *)method success:(BOOL)success {
    [[RXGDTService sharedSDK] reportRegisterActionWithMethod:method isSuccess:success];
}

- (void)gdtReportLoginWithMethod:(NSString *)method success:(BOOL)success {
    [[RXGDTService sharedSDK] reportLoginActionWithMethod:method isSuccess:success];
}

- (void)gdtReportCreateRole:(NSString *)role {
    [[RXGDTService sharedSDK] reportCreateRoleActionWithRole:role];
}

- (void)gdtReportCheckoutWithType:(NSString *)type
                             name:(NSString *)name
                        contentId:(NSString *)contentId
                           number:(NSInteger)number
                  virtualCurrency:(BOOL)isVirtualCurrency
              virtualCurrencyType:(NSString *)virtualCurrencyType
                         currency:(NSString *)currency
                          success:(BOOL)success {
    [[RXGDTService sharedSDK] reportCheckoutActionWithContentType:type
                                                     contentName:name
                                                       contentID:contentId
                                                   contentNumber:(NSUInteger)number
                                               isVirtualCurrency:isVirtualCurrency
                                             virtualCurrencyType:virtualCurrencyType
                                                realCurrencyType:currency
                                                       isSuccess:success];
}

- (void)gdtReportPurchaseWithType:(NSString *)type
                             name:(NSString *)name
                        contentId:(NSString *)contentId
                           number:(NSInteger)number
                          channel:(NSString *)channel
                         currency:(NSString *)currency
                     valueInCents:(NSInteger)valueInCents
                          success:(BOOL)success {
    [[RXGDTService sharedSDK] reportPurchaseActionWithContentType:type
                                                     contentName:name
                                                       contentID:contentId
                                                   contentNumber:(NSUInteger)number
                                                  paymentChannel:channel
                                                    realCurrency:currency
                                                  currencyAmount:(unsigned long long)valueInCents
                                                       isSuccess:success];
}

- (void)gdtReportQuestFinishWithId:(NSString *)questId
                              type:(NSString *)type
                              name:(NSString *)name
                            number:(NSInteger)number
                       description:(NSString *)description
                           success:(BOOL)success {
    [[RXGDTService sharedSDK] reportFinishQuestActionWithQuestID:questId
                                                       questType:type
                                                       questName:name
                                                      questNumer:(NSUInteger)number
                                                     description:description
                                                       isSuccess:success];
}

- (void)gdtReportShareWithChannel:(NSString *)channel success:(BOOL)success {
    [[RXGDTService sharedSDK] reportShareActionWithChannel:channel isSuccess:success];
}

- (void)gdtReportUpdateLevel:(NSInteger)level {
    [[RXGDTService sharedSDK] reportUpgradeLevelActionWithLevel:(NSUInteger)level];
}

- (void)gdtReportRateApp:(CGFloat)value {
    [[RXGDTService sharedSDK] reportRateActionWithRate:value];
}

- (void)gdtReportViewContentWithType:(NSString *)type
                                name:(NSString *)name
                           contentId:(NSString *)contentId {
    [[RXGDTService sharedSDK] reportViewContentActionWithContentType:type
                                                        contentName:name
                                                          contentID:contentId];
}

- (void)gdtReportAddToCartWithType:(NSString *)type
                              name:(NSString *)name
                         contentId:(NSString *)contentId
                            number:(NSInteger)number
                           success:(BOOL)success {
    [[RXGDTService sharedSDK] reportAddingToCartActionWithContentType:type
                                                         contentName:name
                                                           contentID:contentId
                                                       contentNumber:(NSUInteger)number
                                                           isSuccess:success];
}

- (void)gdtApplicationDidBecomeActive {
    [[RXGDTService sharedSDK] logAction:@"START_APP" actionParam:@{}];
}

- (void)gdtHandleOpenURL:(NSURL *)url {
    if (url) {
        [[RXGDTService sharedSDK] handleOpenUrl:url];
    }
}

#pragma mark - 支付系统（IAP，基础库自带）

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
            [self callbackWithAction:@"pay" response:response];
        } else {
            NSLog(@"[RuixueSDK] IAP 支付业务失败: %@", response);
            [self callbackWithAction:@"pay" response:response];
        }
    }];
}

#pragma mark - 分享系统（基础库自带）

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

- (void)shareCustomWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 自定义分享: params=%@", params);
    
    NSString *platform = params[@"platform"] ?: @"wechat";
    NSString *materialType = params[@"type"] ?: @"link";
    
    RXCustomShareConfig *config = [[RXCustomShareConfig alloc] init];
    config.platform = platform;
    config.materialType = materialType;
    
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

#pragma mark - 账号扩展（基础库自带）

- (void)registerAccountWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 注册: params=%@", params);
    // TODO: 调用 [[RXSDK sharedSDK] registerWithConfig:complete:]
    [self callbackWithAction:@"register" code:-1 msg:@"iOS 注册接口待对接" data:nil];
}

- (void)sendCaptchaWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 发送验证码: params=%@", params);
    NSString *typeStr = params[@"type"] ?: @"phone";
    NSString *target = params[@"target"] ?: @"";
    NSString *purpose = params[@"purpose"] ?: @"login";
    
    [[RXSDK sharedSDK] sendCaptcha:[typeStr isEqualToString:@"email"] ? 1 : 0
                            target:target
                           purpose:purpose
                          complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            [self callbackWithAction:@"sendCaptcha" code:-1 msg:@"发送验证码失败" data:nil];
        } else {
            [self callbackWithAction:@"sendCaptcha" response:response];
        }
    }];
}

- (void)realAuthWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 实名认证API: params=%@", params);
    [[RXSDK sharedSDK] realAuth:params[@"realname"] ?: @""
                         idcard:params[@"idcard"] ?: @""
                       complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            if (error.responesObject) { [self callbackWithAction:@"realAuth" response:error.responesObject]; }
            else { [self callbackWithAction:@"realAuth" code:-1 msg:@"实名认证失败" data:nil]; }
        } else {
            [self callbackWithAction:@"realAuth" response:response];
        }
    }];
}

- (void)getIIFAARedirectURLWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    NSLog(@"[RuixueSDK] 获取IIFAA跳转地址: params=%@", params);
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:params[@"app_name"] ?: @""
                                      thirdPartSchema:params[@"third_part_schema"] ?: @""
                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            if (error.responesObject) { [self callbackWithAction:@"getIIFAARedirectURL" response:error.responesObject]; }
            else { [self callbackWithAction:@"getIIFAARedirectURL" code:-1 msg:@"获取IIFAA跳转地址失败" data:nil]; }
        } else {
            [self callbackWithAction:@"getIIFAARedirectURL" response:response];
        }
    }];
}

- (void)searchBindingAccounts {
    NSLog(@"[RuixueSDK] 查询绑定账号");
    [[RXSDK sharedSDK] searchBindingAccountsWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) { [self callbackWithAction:@"searchBindingAccounts" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"searchBindingAccounts" response:response]; }
    }];
}

#pragma mark - 游戏区服/角色（基础库自带）

- (void)createGameAreaWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] createGameAreaWithAreaId:p[@"areaId"]
                                       areaName:p[@"areaName"]
                                     areaStatus:p[@"areaStatus"] ?: @"1"
                                       areaType:p[@"areaType"] ?: @"1"
                                      extension:nil
                                       complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"createGameArea" code:-1 msg:@"创建区服失败" data:nil]; }
        else { [self callbackWithAction:@"createGameArea" response:resp]; }
    }];
}

- (void)searchGameAreaList {
    [[RXSDK sharedSDK] searchGameAreaListInfoWithComplete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"searchGameAreaList" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"searchGameAreaList" response:resp]; }
    }];
}

- (void)searchGameAreaInfoWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] searchGameAreaInfoWithAreaId:p[@"areaId"]
                                           complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"searchGameAreaInfo" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"searchGameAreaInfo" response:resp]; }
    }];
}

- (void)createGameCharacterWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] createGameCharacterWithAreaId:p[@"areaId"]
                                    characterFaction:nil
                                         characterId:p[@"characterId"] ?: @""
                                      characterLevel:p[@"characterLevel"] ?: @"1"
                                       characterName:p[@"characterName"]
                                 characterProfession:nil
                                     characterStatus:nil
                                       characterType:nil
                                   characterVipLevel:nil
                                            cpUserId:p[@"cpUserId"]
                                           extension:nil
                                            complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"createGameCharacter" code:-1 msg:@"创建角色失败" data:nil]; }
        else { [self callbackWithAction:@"createGameCharacter" response:resp]; }
    }];
}

- (void)searchGameCharacterListWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] searchGameCharacterListInfoWithCpUserId:p[@"cpUserId"]
                                                      complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"searchGameCharacterList" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"searchGameCharacterList" response:resp]; }
    }];
}

- (void)searchGameCharacterInfoWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] searchGameCharacterInfoWithAreaId:p[@"areaId"]
                                                cpUserId:p[@"cpUserId"]
                                             characterId:p[@"characterId"]
                                                complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"searchGameCharacterInfo" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"searchGameCharacterInfo" response:resp]; }
    }];
}

- (void)updateGameCharacterWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] updateGameCharacterInfoWithAreaId:p[@"areaId"]
                                        characterFaction:nil
                                             characterId:p[@"characterId"]
                                          characterLevel:p[@"characterLevel"]
                                           characterName:p[@"characterName"]
                                     characterProfession:nil
                                         characterStatus:nil
                                           characterType:nil
                                       characterVipLevel:nil
                                                cpUserId:p[@"cpUserId"]
                                               extension:nil
                                                complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"updateGameCharacter" code:-1 msg:@"更新失败" data:nil]; }
        else { [self callbackWithAction:@"updateGameCharacter" response:resp]; }
    }];
}

- (void)deleteGameCharacterWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    [[RXSDK sharedSDK] deleteGameCharacterWithAreaId:p[@"areaId"]
                                         characterId:p[@"characterId"]
                                            cpUserId:p[@"cpUserId"]
                                            complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"deleteGameCharacter" code:-1 msg:@"删除失败" data:nil]; }
        else { [self callbackWithAction:@"deleteGameCharacter" response:resp]; }
    }];
}

#pragma mark - 数据埋点（基础库自带）

- (void)getDistinctId {
    NSString *distinctId = [[RXSDK sharedSDK] getDistinctId] ?: @"";
    [self callbackWithAction:@"getDistinctId" code:0 msg:@"获取成功" data:@{@"distinctId": distinctId}];
}

- (void)dataTrackWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    NSString *eventName = p[@"eventName"] ?: @"";
    NSString *distinctId = p[@"distinctId"] ?: @"";
    NSDictionary *properties = p[@"properties"];
    [[RXSDK sharedSDK] dataTrackWithEvent:eventName distinctId:distinctId properties:properties];
    [self callbackWithAction:@"dataTrack" code:0 msg:@"埋点成功" data:nil];
}

- (void)trackUserActionWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    NSString *distinctId = p[@"distinctId"] ?: @"";
    NSDictionary *properties = p[@"properties"];
    [[RXSDK sharedSDK] trackUserActionWithDistinctId:distinctId properties:properties];
    [self callbackWithAction:@"trackUserAction" code:0 msg:@"行为上报成功" data:nil];
}

#pragma mark - 运营功能（基础库自带）

- (void)createFeedbackWithParamsJson:(NSString *)paramsJson {
    NSDictionary *p = [self parseJsonString:paramsJson];
    NSMutableDictionary *params = [NSMutableDictionary dictionary];
    params[@"kind_id"] = p[@"kindId"] ?: @"bug_report";
    params[@"content"] = p[@"content"] ?: @"";
    if (p[@"contact"]) params[@"contact"] = p[@"contact"];
    [[RXSDK sharedSDK] createFeedbackWithParams:params complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"createFeedback" code:-1 msg:@"提交失败" data:nil]; }
        else { [self callbackWithAction:@"createFeedback" response:resp]; }
    }];
}

- (void)getTempNotice {
    [[RXSDK sharedSDK] getTempNotice:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"getTempNotice" code:-1 msg:@"获取失败" data:nil]; }
        else { [self callbackWithAction:@"getTempNotice" response:resp]; }
    }];
}

- (void)getUnreadMessageCount {
    [[RXSDK sharedSDK] getServiceChatUnreadCount:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"getUnreadMsgCount" code:-1 msg:@"查询失败" data:nil]; }
        else { [self callbackWithAction:@"getUnreadMsgCount" response:resp]; }
    }];
}

- (void)getPromoDisplayKey {
    [[RXSDK sharedSDK] getPromoDisplayKEY:YES complete:^(NSDictionary *resp, RX_CommonRequestError *err) {
        if (err) { [self callbackWithAction:@"getPromoDisplayKey" code:-1 msg:@"获取失败" data:nil]; }
        else { [self callbackWithAction:@"getPromoDisplayKey" response:resp]; }
    }];
}

#pragma mark - 其他功能（核心）

- (NSString *)getDeviceInfo {
    NSMutableDictionary *info = [NSMutableDictionary dictionary];
    
    info[@"platform"] = @"iOS";
    info[@"model"] = [[UIDevice currentDevice] model];
    info[@"systemName"] = [[UIDevice currentDevice] systemName];
    info[@"systemVersion"] = [[UIDevice currentDevice] systemVersion];
    info[@"name"] = [[UIDevice currentDevice] name];
    
    return [self dictToJsonString:info];
}

@end

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
