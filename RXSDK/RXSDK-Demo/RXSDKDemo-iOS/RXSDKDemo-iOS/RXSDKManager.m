//
//  RXSDKManager.m
//  RXSDKDemo-iOS
//
//  Created by RXSDK on 2026/1/22.
//

#import "RXSDKManager.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXUIKitService.h>

// 国内环境默认参数
NSString * const RXSDKDomesticCPID = @"114";
NSString * const RXSDKDomesticProductID = @"1002";
NSString * const RXSDKDomesticChannelID = @"iOS";
NSString * const RXSDKDomesticBaseURL = @"https://cn-api-test.ruixueyun.com/";

// 海外环境默认参数
NSString * const RXSDKOverseasCPID = @"119";
NSString * const RXSDKOverseasProductID = @"SDKOS";
NSString * const RXSDKOverseasChannelID = @"iOSOS";
NSString * const RXSDKOverseasBaseURL = @"https://os-api-test.ruixueyun.com/";

// 默认初始化参数（保持兼容）
NSString * const RXSDKDefaultCPID = @"114";
NSString * const RXSDKDefaultProductID = @"1002";
NSString * const RXSDKDefaultChannelID = @"iOS";
NSString * const RXSDKDefaultBaseURL = @"https://cn-api-test.ruixueyun.com/";

// 默认语言
NSString * const RXSDKDefaultLanguage = @"zh-Hans";

@interface RXSDKManager ()

@property (nonatomic, assign, readwrite) BOOL isInitialized;
@property (nonatomic, copy, readwrite) NSString *currentCpid;
@property (nonatomic, copy, readwrite) NSString *currentProductId;
@property (nonatomic, copy, readwrite) NSString *currentChannelId;
@property (nonatomic, copy, readwrite) NSString *currentBaseUrl;
@property (nonatomic, copy, readwrite) NSString *currentLanguage;
@property (nonatomic, assign, readwrite) RXSDKOrientation currentOrientation;
@property (nonatomic, assign, readwrite) RXSDKEnvironment currentEnvironment;

@end

@implementation RXSDKManager

#pragma mark - 单例

+ (instancetype)sharedManager {
    static RXSDKManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXSDKManager alloc] init];
    });
    return manager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _isInitialized = NO;
        _currentLanguage = RXSDKDefaultLanguage;
        _currentOrientation = RXSDKOrientationPortrait;
        _currentEnvironment = RXSDKEnvironmentDomestic;
    }
    return self;
}

#pragma mark - 环境设置

+ (NSArray<NSDictionary *> *)supportedEnvironments {
    return @[
        @{@"value": @(RXSDKEnvironmentDomestic), @"name": @"国内"},
        @{@"value": @(RXSDKEnvironmentOverseas), @"name": @"海外"}
    ];
}

- (void)setEnvironment:(RXSDKEnvironment)environment {
    self.currentEnvironment = environment;
}

- (NSString *)currentEnvironmentDisplayName {
    NSArray *environments = [RXSDKManager supportedEnvironments];
    if (self.currentEnvironment < environments.count) {
        return environments[self.currentEnvironment][@"name"];
    }
    return environments[0][@"name"];
}

- (BOOL)isDomestic {
    return self.currentEnvironment == RXSDKEnvironmentDomestic;
}

- (NSString *)envDefaultCpid {
    return [self isDomestic] ? RXSDKDomesticCPID : RXSDKOverseasCPID;
}

- (NSString *)envDefaultProductId {
    return [self isDomestic] ? RXSDKDomesticProductID : RXSDKOverseasProductID;
}

- (NSString *)envDefaultChannelId {
    return [self isDomestic] ? RXSDKDomesticChannelID : RXSDKOverseasChannelID;
}

- (NSString *)envDefaultBaseUrl {
    return [self isDomestic] ? RXSDKDomesticBaseURL : RXSDKOverseasBaseURL;
}

#pragma mark - 语言设置

+ (NSArray<NSDictionary *> *)supportedLanguages {
    return @[
        @{@"code": @"zh-Hans", @"name": @"简体中文"},
        @{@"code": @"zh-Hant", @"name": @"繁体中文"},
        @{@"code": @"en", @"name": @"英语"},
        @{@"code": @"ja", @"name": @"日语"},
        @{@"code": @"th", @"name": @"泰语"},
        @{@"code": @"vi", @"name": @"越南语"},
        @{@"code": @"fil", @"name": @"菲律宾语"},
        @{@"code": @"ar", @"name": @"阿拉伯语"}
    ];
}

- (void)setLanguage:(NSString *)languageCode {
    self.currentLanguage = languageCode;
    // TODO: 调用 RXSDK 设置语言
    // [[RXSDK sharedSDK] setLanguage:languageCode];
}

- (NSString *)currentLanguageDisplayName {
    NSArray *languages = [RXSDKManager supportedLanguages];
    for (NSDictionary *lang in languages) {
        if ([lang[@"code"] isEqualToString:self.currentLanguage]) {
            return lang[@"name"];
        }
    }
    return languages[0][@"name"]; // 默认简体中文
}

- (NSInteger)languageIndex {
    NSArray *languages = [RXSDKManager supportedLanguages];
    for (NSInteger i = 0; i < languages.count; i++) {
        if ([languages[i][@"code"] isEqualToString:self.currentLanguage]) {
            return i;
        }
    }
    return 0;
}

#pragma mark - 屏幕方向设置

+ (NSArray<NSDictionary *> *)supportedOrientations {
    return @[
        @{@"value": @(RXSDKOrientationPortrait), @"name": @"竖屏"},
        @{@"value": @(RXSDKOrientationLandscape), @"name": @"横屏"}
    ];
}

- (void)setOrientation:(RXSDKOrientation)orientation {
    self.currentOrientation = orientation;
}

- (NSString *)currentOrientationDisplayName {
    NSArray *orientations = [RXSDKManager supportedOrientations];
    if (self.currentOrientation < orientations.count) {
        return orientations[self.currentOrientation][@"name"];
    }
    return orientations[0][@"name"];
}

- (BOOL)isPortrait {
    return self.currentOrientation == RXSDKOrientationPortrait;
}

#pragma mark - 初始化

- (void)initWithDefaultParamsWithCallback:(RXSDKInitCallback)callback {
    [self initWithCpid:[self envDefaultCpid]
             productId:[self envDefaultProductId]
             channelId:[self envDefaultChannelId]
               baseUrl:[self envDefaultBaseUrl]
              callback:callback];
}

- (void)initWithCpid:(NSString *)cpid
           productId:(NSString *)productId
           channelId:(NSString *)channelId
             baseUrl:(NSString *)baseUrl
            callback:(RXSDKInitCallback)callback {
    
    // 保存当前参数
    self.currentCpid = cpid;
    self.currentProductId = productId;
    self.currentChannelId = channelId;
    self.currentBaseUrl = baseUrl;
    
    // 创建初始化配置
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.cpId = cpid;
    config.productId = productId;
    config.channelId = channelId;
    config.baseUrlList = @[baseUrl];
    config.isLogEnable = @"1";  // 开启日志
    
    // 调用 SDK 初始化
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 初始化失败: code=%ld, msg=%@", (long)error.code, error.msg);
            self.isInitialized = NO;
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" 
                                                      code:error.code 
                                                  userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @"未知错误"}];
                callback(NO, @{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        
        NSLog(@"[RXSDK] 初始化成功: %@", response);
        self.isInitialized = YES;
        
        // 初始化 UI 组件（国内环境）
        if ([self isDomestic]) {
            [[RXUIKitService sharedSDK] regist];
        }
        // 海外环境使用 RXOSUIKitService
        // else {
        //     [[RXOSUIKitService sharedSDK] regist];
        // }
        
        if (callback) {
            callback(YES, response, nil);
        }
    }];
}

- (void)reset {
    self.isInitialized = NO;
    self.currentCpid = nil;
    self.currentProductId = nil;
    self.currentChannelId = nil;
    self.currentBaseUrl = nil;
}

#pragma mark - 登录

- (void)loginAsGuestWithCallback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    RXLoginConfig *config = [[RXLoginConfig alloc] init];
    config.loginType = LoginTypeVisitor;
    
    [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 游客登录失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 游客登录成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
                 callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    RXLoginConfig *config = [[RXLoginConfig alloc] init];
    config.loginType = LoginTypeAccount;
    config.username = username;
    config.password = password;
    
    [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 账号密码登录失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 账号密码登录成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

- (void)loginWithPhone:(NSString *)phone
               captcha:(NSString *)captcha
              callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    RXLoginConfig *config = [[RXLoginConfig alloc] init];
    config.loginType = LoginTypeCapCode;
    config.username = phone;
    config.captchaCode = captcha;
    
    [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 验证码登录失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 验证码登录成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

- (void)sendCaptchaWithPhone:(NSString *)phone
                    callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    [[RXSDK sharedSDK] sendCapCodeWithType:@"phone" 
                                    target:phone 
                                   purpose:@"login" 
                                  complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 发送验证码失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 发送验证码成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

- (void)getLegalInfoWithCallback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    [[RXSDK sharedSDK] getLegalInfo:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 获取法务配置失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 获取法务配置成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

#pragma mark - 用户信息

- (void)getUserInfoWithCallback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 获取用户信息
    // [[RXSDK sharedSDK] getUserInfoWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    //     if (callback) callback(response, error ? ... : nil);
    // }];
}

- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    [[RXSDK sharedSDK] getUserInfoByFieldWithParams:params complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RXSDK] 获取指定用户信息失败: code=%ld, msg=%@", (long)error.code, error.msg);
            if (callback) {
                NSError *nsError = [NSError errorWithDomain:@"RXSDKError" code:error.code userInfo:@{NSLocalizedDescriptionKey: error.msg ?: @""}];
                callback(@{@"code": @(error.code), @"msg": error.msg ?: @""}, nsError);
            }
            return;
        }
        NSLog(@"[RXSDK] 获取指定用户信息成功: %@", response);
        if (callback) callback(response, nil);
    }];
}

#pragma mark - 支付

- (void)payWithProductId:(NSString *)productId
                 orderId:(NSString *)orderId
                callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 支付
    // NSDictionary *dict = @{
    //     @"trade_no": orderId,
    //     @"product_id": productId,
    //     // ...其他参数
    // };
    // [[RXSDK sharedSDK] iap:dict complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    //     if (callback) callback(response, error ? ... : nil);
    // }];
}

#pragma mark - 分享

- (void)shareWithPlatform:(NSString *)platform
                 callback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 分享
    // RXShareConfig *config = [[RXShareConfig alloc] init];
    // config.platform = platform;
    // [[RXSDK sharedSDK] share:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    //     if (callback) callback(response, error ? ... : nil);
    // }];
}

#pragma mark - 埋点

- (void)trackWithEvent:(NSString *)event
            properties:(NSDictionary *)properties {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 埋点
    // [[RXSDK sharedSDK] dataTrackWithEvent:event distinctId:nil properties:properties];
}

#pragma mark - 其他功能

- (void)openFeedback {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 反馈
    // [[RXUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // }];
}

- (void)deregisterWithCallback:(RXSDKRequestCallback)callback {
    if (![self checkInitialized]) return;
    
    // TODO: 调用 RXSDK 注销
    // RXDeregisterConfig *config = [[RXDeregisterConfig alloc] init];
    // [[RXSDK sharedSDK] deregisterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    //     if (callback) callback(response, error ? ... : nil);
    // }];
}

#pragma mark - 辅助方法

- (BOOL)checkInitialized {
    if (!self.isInitialized) {
        NSLog(@"[RXSDKManager] SDK 未初始化，请先调用初始化方法");
        return NO;
    }
    return YES;
}

@end
