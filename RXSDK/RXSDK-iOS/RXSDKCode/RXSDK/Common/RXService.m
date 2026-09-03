//
//  RXService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXService.h"
#import "RXCommonTool.h"
#import "AppleLogin.h"
#import "CHDownImage.h"
#import <RXSDK_Pure/RXSDK_Pure-swift.h>
#import "CHCid.h"
#import "RXInitManager.h"
#import <iAd/iAd.h>
#import <objc/message.h>
#import "RXAdManger.h"
#import "RXLogManager.h"
#import "RXCommonManager.h"
#import "RXCommonHeader.h"
#import "RXGDTManager.h"

typedef void(^LoginCallBackBlock)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);
typedef void(^ASABlock)(NSDictionary *response, NSDictionary *error);
typedef void(^PrivacyBlock)(BOOL agree);

@interface RXService ()

@property (nonatomic, strong) NSDictionary *sourceAd;
@property (nonatomic, strong) NSDictionary *asaInfo;
@property (nonatomic, copy) RequestComplete activatedCallback;
@property (nonatomic, copy) LoginCallBackBlock callBack;
@property (nonatomic, copy) ASABlock asaBlock;
@property (nonatomic, copy) PrivacyBlock privacyBlock;
@property (nonatomic, strong) NSString *distinctId;

@end

@implementation RXService

static RXService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(fbLoginFail:) name:noti_LoginFail object:nil];
        
        NSLog(@"RXSDK--RXSDK_Pure  Version: %@", sdkVersion);
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    
                } else {
                    
                }
                
            }];
        });
    }
    return self;
}

/**
 * 初始化SDK
 * 初始化后会 SDK 会自动激活
 * @param config 初始化配置
 */
- (void)initWithConfig:(RXSdkInitConfig *)config
              complete:(RequestComplete)complete
{
    self.sdkConfig = config;
    [RXUserUtility sharedManager].baseUrlList = config.baseUrlList;
    [RXUserUtility setValue:config.baseUrlList ForKey:keyUserData_baseUrlList];
    [RXUserUtility setValue:config.channelId ForKey:keyUserData_channelId];
    [RXUserUtility setValue:config.cpId ForKey:keyUserData_cpId];
    [RXUserUtility setValue:config.productId ForKey:keyUserData_productId];
//    [RXUserUtility setValue:ipv4Url ForKey:keyUserData_ipv4Url];
    [RXUserUtility sharedManager].cpid = config.cpId;
    [RXUserUtility sharedManager].openRacing = config.openRacing;
    [RXUserUtility sharedManager].isUseDNS = config.isUseDNS;
    [RXUserUtility sharedManager].launchOptions = config.launchOptions;

    BOOL isAgreePrivacy = [RXUserUtility boolForKey:keyUserData_agreePrivacy];
    if (config.usePrivacy && !isAgreePrivacy) {
        
        if ([RXSubPackage sharedSDK].aRXUI) {
            __typeof (self) __weak weakSelf = self;
            self.privacyBlock = ^(BOOL agree) {
                NSLog(@"点击回调");
                if (agree) {
                    [RXUserUtility setBool:YES ForKey:keyUserData_agreePrivacy];
                    [weakSelf initWithProductId:config.productId channelId:config.channelId cpid:config.cpId baseUrlList:config.baseUrlList complete:complete];
                } else {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    err.responesObject = @{@"msg" : [RXErrorTool getRXErrorMsg:RXLimitError_default],
                                           @"code" : @(RXLimitError_default)
                    };
                    
                    if (err != nil) {
                        err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                    }
                    
                    if (complete) {
                        complete(nil, err);
                    }
                }
            };
            
            // 展示协议页面
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:self.privacyBlock forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_ui_showPrivacy object:nil userInfo:notiDic];
            
        } else {
            [self initWithProductId:config.productId channelId:config.channelId cpid:config.cpId baseUrlList:config.baseUrlList complete:complete];
        }
        
    } else {
        [self initWithProductId:config.productId channelId:config.channelId cpid:config.cpId baseUrlList:config.baseUrlList complete:complete];
    }
}

/**
 * 初始化SDK
 * @param productId 产品id
 * @param channelId 渠道id
 * @param cpid 瑞雪为每个项目分配的一个唯一 ID
 * @param baseUrlList 请求域名队列
 * @param complete 初始化结果回调
 */
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList
                 complete:(RequestComplete)complete
{
//    if(@available(iOS 17.0, *)) {
//
//    } else {
//        [RXCommonTool getIDFA]; // 获取权限用
//        [RXUserUtility setValue:[RXCommonTool getIDFA] ForKey:keyUserData_idfa];
//    }
    
    // 获取 ua
    [[RXCommonTool sharedSDK] rx_getUserAgent:^(id  _Nullable result) {
        [RXUserUtility sharedManager].userAgent = result;
    }];
    
    if (![RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
        self.distinctId = [RXCommonTool getDistinct_id];
        // 保存 distinctid，防止当前 app 生命周期内没拿到回调，
        [RXUserUtility setValue:self.distinctId ForKey:keyUserData_adjust_distinct_id];
    }
    
    [RXUserUtility sharedManager].baseUrlList = baseUrlList;
    [RXUserUtility setValue:baseUrlList ForKey:keyUserData_baseUrlList];
    [RXUserUtility setValue:channelId ForKey:keyUserData_channelId];
    [RXUserUtility setValue:cpid ForKey:keyUserData_cpId];
    [RXUserUtility setValue:productId ForKey:keyUserData_productId];
    [RXUserUtility sharedManager].cpid = cpid;
        
    [[RXInitManager sharedSDK] initSDKWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [RXCommonTool getIDFA]; // 获取权限用
            [RXUserUtility setValue:[RXCommonTool getIDFA] ForKey:keyUserData_idfa];
        });
        if (!error) {
            // 初始化成功后获取通路配置
            [self getSharePlatforms];
            // 初始化成功后获取 openinstall 参数
            [RXCommonTool getOpeninstallParams];
            // 初始化广点通
            [[RXGDTManager sharedSDK] initGDT];
            // 初始化成功后激活
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(7 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self requestActivatedWithSourceAd:[RXCommonTool getAdInfo] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        // 上报adjust安装
                        [[RXAdManger sharedSDK] reportAdjustInstallWithDistinctId:self.distinctId];
                    }
                }];
            });
            
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:@(0) forKey:@"code"];
            [dic setValue:@"RXSDK初始化成功" forKey:@"msg"];
            
            if (complete) {
                complete(dic, nil);
            }
        } else {
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

/**
 * 设置子渠道id
 */
- (void)setSubChannelId:(NSString *)subChannelId
{
    [RXUserUtility sharedManager].subChannelId = subChannelId;
}

/**
 * 初始化SDK
 * @param profile 初始化配置表，需要符合 jsonString 格式
 * ！！注意：此方法和 initWithProductId 只会生效一种，后调用的会将前一份数据覆盖
 */
- (void)initWithProfile:(NSString *)profile
               complete:(RequestComplete)complete
{
    NSString *jsonString = profile;
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&error];
    
    [RXUserUtility setValue:dic ForKey:keyUserData_initProfile];
    
    dic = dic[@"init"];
    if (error) {
        NSLog(@"初始化数据解析失败：\n%@", error);
    }
    
    [RXCommonTool getIDFA]; // 获取权限用
    [RXUserUtility sharedManager].baseUrlList = dic[@"domain"];
    [RXUserUtility setValue:dic[@"domain"] ForKey:keyUserData_baseUrlList];
    [RXUserUtility setValue:dic[@"channel_id"] ForKey:keyUserData_channelId];
    [RXUserUtility setValue:dic[@"cpid"] ForKey:keyUserData_cpId];
    [RXUserUtility setValue:dic[@"product_id"] ForKey:keyUserData_productId];
    [RXUserUtility setValue:[RXCommonTool getIDFA] ForKey:keyUserData_idfa];
//    [RXUserUtility setValue:dic[@"ipv4_url"] ForKey:keyUserData_ipv4Url];
    [RXUserUtility sharedManager].cpid = dic[@"cpid"];

//    if (![RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
//        [RXUserUtility setValue:[[RXCommonTool sharedSDK] rx_getUserAgent] ForKey:keyUserData_ua];
//    }
    
    [self initWithProductId:dic[@"product_id"] channelId:dic[@"channel_id"] cpid:dic[@"cpid"] baseUrlList:dic[@"domain"] complete:complete];
}

/**
 * 初始化SDK
 * @note 调用后只保存初始化参数，不做激活等流程
 * @param productId 产品id
 * @param channelId 渠道id
 * @param cpid 瑞雪为每个项目分配的一个唯一 ID
 * @param baseUrlList 请求域名队列
 * @param complete 初始化结果回调
 */
- (void)setInitParamsWithProductId:(NSString *)productId
                         channelId:(NSString *)channelId
                              cpid:(NSString *)cpid
                       baseUrlList:(NSArray *)baseUrlList
                          complete:(RequestComplete)complete
{
    [RXUserUtility sharedManager].baseUrlList = baseUrlList;
    [RXUserUtility setValue:baseUrlList ForKey:keyUserData_baseUrlList];
    [RXUserUtility setValue:channelId ForKey:keyUserData_channelId];
    [RXUserUtility setValue:cpid ForKey:keyUserData_cpId];
    [RXUserUtility setValue:productId ForKey:keyUserData_productId];
//    [RXUserUtility setValue:ipv4Url ForKey:keyUserData_ipv4Url];
    [RXUserUtility sharedManager].cpid = cpid;
    [RXUserUtility sharedManager].isSetInit = YES;

    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(0) forKey:@"code"];
    [dic setValue:@"RXSDK初始化成功" forKey:@"msg"];
    if (complete) {
        complete(dic, nil);
    }
}

- (void)getSharePlatforms
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/share/platforms" andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (responseObject && [responseObject isKindOfClass:[NSDictionary class]]) {
            [RXUserUtility sharedManager].isGetSharePlatformSuccess = YES;
            [RXUserUtility sharedManager].sharePlatformsDic = responseObject;
        }
        NSLog(@"获取通路配置成功:\n %@", responseObject);
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (error.responesObject && [error.responesObject isKindOfClass:[NSDictionary class]]) {
            [RXUserUtility sharedManager].isGetSharePlatformSuccess = NO;
            [RXUserUtility sharedManager].sharePlatformsDic = error.responesObject;
        }
        NSLog(@"获取通路配置失败:\n %@", error.error);
    }];
}

/**
 * 获取法务配置信息
 */
- (void)getLegalInfo:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSString *urlStr = [NSString stringWithFormat:@"v1/operationapi/legal?channel_id=%@", [RXUserUtility valueForKey:keyUserData_channelId]];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取法务配置成功:\n %@", responseObject);
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:responseObject[@"data"]];
        for (int i = 0; i < dic.allKeys.count; i++) {
            if (![dic valueForKey:dic.allKeys[i]] || [[dic valueForKey:dic.allKeys[i]] isKindOfClass:[NSNull class]] ||
                [[dic valueForKey:dic.allKeys[i]] isEqual:[NSNull null]]) {
                [dic removeObjectForKey:dic.allKeys[i]];
            }
            if ([[dic valueForKey:dic.allKeys[i]] isKindOfClass:[NSDictionary class]]) {
                NSMutableDictionary *subDic = [NSMutableDictionary dictionaryWithDictionary:[dic valueForKey:dic.allKeys[i]]];
                for (int j = 0; j < subDic.allKeys.count; j++) {
                    id subValue = [subDic valueForKey:subDic.allKeys[j]];
                    if (!subValue || [subValue isKindOfClass:[NSNull class]] ||
                        [subValue isEqual:[NSNull null]]) {
                        [subDic removeObjectForKey:subDic.allKeys[j]];
                    }
                }
                [dic setValue:subDic forKey:dic.allKeys[i]];
            }
        }
        [RXUserUtility setValue:dic ForKey:keyUserData_legal];
//        [RXUserUtility sharedManager].legalModel = responseObject[@"data"];
        if (complete) {
            complete(responseObject[@"data"], nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取法务配置失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 登录请求
 * @param extDic 扩展字段，可传nil
 * ！验证码登录需传captchacode  #NSString类型
 * ！extDic = @{@"captcha_code" : @"验证码"}
 * @param username 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
 * @param password 非账号登录传空
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param loginType 登录类型
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)loginWithExtDic:(NSMutableDictionary * _Nullable)extDic
               username:(NSString * _Nullable)username
               password:(NSString * _Nullable)password
            sign_fields:(NSArray * _Nullable)sign_fields
              loginType:(LoginType)loginType
           migrate_args:(id _Nullable)migrate_args
{
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    
    switch (loginType) {
        case LoginTypeW:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeApple:
        {
            [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeZalo begin:YES errorInfo:nil];
            
            AppleLogin *appleLogin = [[AppleLogin alloc] init];
            [[AppleLogin sharedManager] singInLogin:@"" block:^(NSInteger state, NSString * _Nonnull msg, id  _Nonnull data) {
                if (state == AppleLoginTypeSuccessful) {
                    
                    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)data];
                    for (int i = 0; i < dic.allKeys.count; i++) {
                        [extDic1 setValue:dic.allValues[i] forKey:dic.allKeys[i]];
                    }
                    
                    // 用户行为上报
                    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)data];
                    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"success" properties:@{@"method" : @"apple", @"third_res" : thirdRes}];
                    
                    [RXLoginManager loginWithExtDic:extDic1 username:username password:password sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                        if (!error) {
                        }
                        if (self.callBack) {
                            self.callBack(response, error);
                            self.callBack = nil;
                        }
                        [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
                    }];
                    
                } else if (state == AppleLoginTypeFailure) {
                    NSInteger thirdCode = [data[@"thirdcode"] integerValue];
                    NSInteger errCode = [data[@"code"] integerValue];
                    NSString *thirdMsg = [NSString rx_isNullToString:data[@"thirdmsg"]].length > 0 ? data[@"thirdmsg"] : @"";
                    NSString *errMsg = [NSString rx_isNullToString:data[@"errorMsg"]].length > 0 ? data[@"errorMsg"] : @"";
                    RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
                    NSDictionary *errorDic = @{@"code" : @(errCode),
                                               @"msg" : errMsg,
                                               @"thirdcode" : @(thirdCode),
                                               @"thirdmsg" : thirdMsg
                    };
                    error.responesObject = errorDic;
                    
                    NSDictionary *notiDic = @{@"loginData" : errorDic,
                                              @"loginType" : @(LoginTypeApple)
                    };
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:rxlog_error_login
                                                                       url:@""
                                                                      code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                       msg:error.responesObject[@"msg"]
                                                                 thirdType:@"apple"
                                                                 thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                                  thirdmsg:error.responesObject[@"thirdmsg"]
                                                                   traceid:@""];
                    
                    // 用户行为上报
                    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionaryWithDictionary:errorDic];
                    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"fail" properties:@{@"method" : @"apple", @"third_res" : thirdRes}];
                    if (self.callBack) {
                        self.callBack(nil, error);
                        self.callBack = nil;
                    }
                    [self.loginDelegate rx_LoginCallBackWithResponse:nil error:error];
                }
            }];
            break;
        }
        case LoginTypeAuth:
        {   
            [RXLoginManager loginWithExtDic:extDic1 username:username password:password sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeVisitor:
        {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setObject:@"unname" forKey:@"type"];
            [dic setObject:@0 forKey:@"account_type"];
            
            [RXLoginManager loginWithExtDic:extDic1 username:username password:password sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeAccount:
        {
            if ([NSString rx_isNullToString:password].length <= 0) {
                RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
                NSDictionary *errorDic = @{@"code" : @(RXLoginError_passwordEmpty),
                                           @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordEmpty]
                };
                error.responesObject = errorDic;
                
                if (error != nil) {
                    error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
                }
                
                if (self.callBack) {
                    self.callBack(nil, error);
                    self.callBack = nil;
                }
                
                [self.loginDelegate rx_LoginCallBackWithResponse:nil error:error];
                return;
            }
            [RXLoginManager loginWithExtDic:extDic1 username:username password:password sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeVirtual:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeFacebook:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeGoogle:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeVK:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeCapCode:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:username password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeLine:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        case LoginTypeZalo:
        {
            if ([RXSubPackage sharedSDK].aZalo) {
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [notiDic setValue:@(2) forKey:@"type"];
                [notiDic setValue:extDic forKey:@"ext"];
                [RXNotificationCenter postNoti:rxUserDefault_login_zalo object:nil userInfo:notiDic];
                
                [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeZalo begin:YES errorInfo:nil];
            } else {
                NSLog(@"未接入 RXZaloSDK");
            }
            break;
        }
        case LoginTypeTikTok:
        {
            if ([RXSubPackage sharedSDK].aTikTok) {
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_login_tiktok object:nil userInfo:notiDic];
                
                [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeTikTok begin:YES errorInfo:nil];
            } else {
                NSLog(@"未接入 RXTikTokSDK");
            }
            break;
        }
        case LoginTypeSnapChat:
        {
            if ([RXSubPackage sharedSDK].aSnapchat) {
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_login_snapchat object:nil userInfo:notiDic];
                
                [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeSnapChat begin:YES errorInfo:nil];
            } else {
                NSLog(@"未接入 RXSnapChatSDK");
            }
            break;
        }
        case LoginTypeInstagram:
        {
            if ([RXSubPackage sharedSDK].aInstagram) {
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_login_ins object:nil userInfo:notiDic];
                
                [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeInstagram begin:YES errorInfo:nil];
            } else {
                NSLog(@"未接入 RXInstagramSDK");
            }
            break;
        }
        case LoginTypeReddit:
        {
            if ([RXSubPackage sharedSDK].aReddit) {
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_login_reddit object:nil userInfo:notiDic];
                
                [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeReddit begin:YES errorInfo:nil];
            } else {
                NSLog(@"未接入 RXRedditSDK");
            }
            break;
        }
        case LoginTypeDefault:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
            break;
        }
        default:
        {
            [RXLoginManager loginWithExtDic:extDic1 username:@"" password:@"" sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                if (self.callBack) {
                    self.callBack(response, error);
                    self.callBack = nil;
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
        }
            break;
    }
}

/**
 * 二次登录
 * @param loginOpenId 登录返回的login_openid
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param extDic 扩展字段，可传nil
 */
- (void)loginWithLoginOpenId:(NSString *)loginOpenId
                 sign_fields:(NSArray * _Nullable)sign_fields
                      extDic:(NSMutableDictionary * __nullable)extDic
{
    [RXLoginManager loginWithLoginOpenId:loginOpenId sign_fields:sign_fields extDic:extDic complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
        }
        [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
    }];
}

/**
 * 苹果登录
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)loginReq_appleWithMigrate_args:(id _Nullable)migrate_args
                           sign_fields:(NSArray * _Nullable)sign_fields
{
    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
    AppleLogin *appleLogin = [[AppleLogin alloc] init];
    [[AppleLogin sharedManager] singInLogin:@"" block:^(NSInteger state, NSString * _Nonnull msg, id  _Nonnull data) {
        if (state == AppleLoginTypeSuccessful) {
            NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)data];
            for (int i = 0; i < dic.allKeys.count; i++) {
                [extDic setValue:dic.allValues[i] forKey:dic.allKeys[i]];
            }
            
            [RXLoginManager loginWithExtDic:extDic username:@"" password:@"" sign_fields:sign_fields loginType:LoginTypeApple migrate_args:migrate_args complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                }
                [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
            }];
        } else if (state == AppleLoginTypeFailure) {
            RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
            NSDictionary *errorDic = @{@"code" : data[@"code"],
                                       @"msg" : data[@"errorMsg"]
            };
            error.responesObject = errorDic;
            
            NSDictionary *notiDic = @{@"loginData" : errorDic,
                                      @"loginType" : @(LoginTypeApple)
            };
            [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:rxlog_error_login
                                                               url:@""
                                                              code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                               msg:error.responesObject[@"msg"]
                                                         thirdType:@"apple"
                                                         thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:error.responesObject[@"thirdmsg"]
                                                           traceid:@""];
            
            [self.loginDelegate rx_LoginCallBackWithResponse:nil error:error];
        }
    }];
}

/**
 * 登录请求
 * @note 建议使用新方法，旧方法如出现问题在以后的版本不再维护
 * @param loginType 登录类型
 * @param username 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
 * @param password 非账号登录传空
 * @param captchaCode 验证码，登录方式为验证码时必传，其他登录方式可传空
 * @param permissions 登录获取的权限数组，FaceBook、Line时必传，其他登录方式可传空
 * @param loginOpenId 二次登录openId，nil或空为普通登录
 * @param extDic 扩展字段，可传nil
 * ！断线重连 ext 中可传 reconnect_login = YES
 * @param signFields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param migrateArgs 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)loginWithLoginType:(LoginType)loginType
                  username:(NSString * _Nullable)username
                  password:(NSString * _Nullable)password
               captchaCode:(NSString * _Nullable)captchaCode
               permissions:(NSArray * _Nullable)permissions
               loginOpenId:(NSString *)loginOpenId
                    extDic:(NSMutableDictionary * _Nullable)extDic
                signFields:(NSArray * _Nullable)signFields
               migrateArgs:(id _Nullable)migrateArgs
{
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    if ([NSString rx_isNullToString:loginOpenId].length > 0) {
        [self loginWithLoginOpenId:loginOpenId sign_fields:signFields extDic:extDic1];
    }else if (loginType == LoginTypeFacebook) {
        if ([RXSubPackage sharedSDK].aFacebook) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:permissions forKey:@"permissions"];
            [notiDic setValue:extDic forKey:@"ext"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [RXNotificationCenter postNoti:rxUserDefault_login_fb object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXFacebookSDK");
        }
    }else if (loginType == LoginTypeGoogle) {
        if ([RXSubPackage sharedSDK].aGoogle) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [RXNotificationCenter postNoti:rxUserDefault_login_google object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXGoogleSDK");
        }
    }else if (loginType == LoginTypeVK) {
        if ([RXSubPackage sharedSDK].aVK) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [RXNotificationCenter postNoti:rxUserDefault_login_vk object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXVKSDK");
        }
    }else if (loginType == LoginTypeLine) {
        if ([RXSubPackage sharedSDK].aLine) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:permissions forKey:@"permissions"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [RXNotificationCenter postNoti:rxUserDefault_login_line object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXLineSDK");
        }
    } else {
        if (loginType == LoginTypeCapCode) {
            [extDic1 setValue:captchaCode forKey:@"captcha_code"];
        }
        [self loginWithExtDic:extDic1 username:username password:password sign_fields:signFields loginType:loginType migrate_args:migrateArgs];
    }
}

/**
 * 登录请求
 * @note 建议使用新方法，旧方法如出现问题在以后的版本不再维护
 * @param loginType 登录类型
 * @param username 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
 * @param password 非账号登录传空
 * @param captchaCode 验证码，登录方式为验证码时必传，其他登录方式可传空
 * @param permissions 登录获取的权限数组，FaceBook、Line时必传，其他登录方式可传空
 * @param loginOpenId 二次登录openId，nil或空为普通登录
 * @param extDic 扩展字段，可传nil
 * ！断线重连 ext 中可传 reconnect_login = YES
 * @param signFields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param migrateArgs 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param complete 登录回调
 */
- (void)loginWithLoginType:(LoginType)loginType
                  username:(NSString * _Nullable)username
                  password:(NSString * _Nullable)password
               captchaCode:(NSString * _Nullable)captchaCode
               permissions:(NSArray * _Nullable)permissions
               loginOpenId:(NSString * _Nullable)loginOpenId
                    extDic:(NSMutableDictionary * _Nullable)extDic
                signFields:(NSArray * _Nullable)signFields
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete
{
    self.callBack = complete;
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    if ([NSString rx_isNullToString:loginOpenId].length > 0) {
        [self loginWithLoginOpenId:loginOpenId sign_fields:signFields extDic:extDic1];
    } else if (loginType == LoginTypeFacebook) {
        if ([RXSubPackage sharedSDK].aFacebook) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:permissions forKey:@"permissions"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [RXNotificationCenter postNoti:rxUserDefault_login_fb object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXFacebookSDK");
        }
    } else if (loginType == LoginTypeGoogle) {
        if ([RXSubPackage sharedSDK].aGoogle) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:[RXUserUtility sharedManager].googleClientid forKey:@"appid"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [RXNotificationCenter postNoti:rxUserDefault_login_google object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXGoogleSDK");
        }
    } else if (loginType == LoginTypeVK) {
        if ([RXSubPackage sharedSDK].aVK) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [RXNotificationCenter postNoti:rxUserDefault_login_vk object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXVKSDK");
        }
    } else if (loginType == LoginTypeLine) {
        if ([RXSubPackage sharedSDK].aLine) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:permissions forKey:@"permissions"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [RXNotificationCenter postNoti:rxUserDefault_login_line object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXLineSDK");
        }
    } else if (loginType == LoginTypeW) {
        if ([RXSubPackage sharedSDK].aW) {
            NSString *appid = extDic1[@"appid"];
            
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:appid forKey:@"appid"];
            [notiDic setValue:migrateArgs forKey:@"migrateArgs"];
            [notiDic setValue:signFields forKey:@"signFields"];
            [notiDic setValue:extDic1 forKey:@"ext"];
            [RXNotificationCenter postNoti:rxUserDefault_login_w object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXWXSDK");
        }
    } else {
        if (loginType == LoginTypeCapCode) {
            [extDic1 setValue:captchaCode forKey:@"captcha_code"];
        }
        [self loginWithExtDic:extDic1 username:username password:password sign_fields:signFields loginType:loginType migrate_args:migrateArgs];
    }
}

/**
 * 自定义请求
 * @param url 接口名，可传路径或完整url，传路径则拼接初始化的baseUrl
 * @param header 请求头
 * @param body 请求参数
 * @param method 请求类型  1 Post请求，2 Get请求
 * @param needLogin 接口是否需要登录，不需要登录则请求头中的ruixue-accesstoken会被清空
 */
- (void)createRequestWithUrl:(NSString *)url
                      header:(NSMutableDictionary * _Nullable)header
                        body:(NSMutableDictionary * _Nullable)body
                      method:(NSInteger)method
                   needLogin:(BOOL)needLogin
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSMutableDictionary *headParams = [NSMutableDictionary dictionary];
    headParams = [RX_CommonNetworkExcuteManager headParams];
    
    if (!needLogin) {
        [headParams setValue:@"" forKey:@"ruixue-accesstoken"];
    }
    
    for (int i = 0; i < header.allKeys.count; i++) {
        [headParams setValue:header.allValues[i] forKey:header.allKeys[i]];
    }
    
    NSString *urlStr = url;
    
    NSMutableDictionary *bodyDic = [NSMutableDictionary dictionary];
    bodyDic = body;
    
    if (method == 2) { // get请求参数拼接
        for (int i = 0; i < bodyDic.allKeys.count; i++) {
            if (i == 0) {
                urlStr = [NSString stringWithFormat:@"%@?%@=%@", urlStr, bodyDic.allKeys[i], bodyDic.allValues[i]];
            } else {
                urlStr = [NSString stringWithFormat:@"%@&%@=%@", urlStr, bodyDic.allKeys[i], bodyDic.allValues[i]];
            }
        }
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:body requsetMethod:method == 1 ? RequestMethod_Post : RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
//    if (![url containsString:@"http"]) {
//        urlStr = [NSString stringWithFormat:@"%@%@", , url];
//    }
    request.headParams = headParams;
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"自定义请求成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"自定义请求失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 用户激活
 * @param sourceAd 扩展信息
 * ！sourceAd参数说明：
 * ！source_ad 客户端采集到的广告相关的信息    #NSDictionary类型
 * ！user_agent 一种方式获取的 user_agent，若为空，则取 user-agent header 的值    #NSString类型
 * ！user_agent1 其他方式获取的 user_agent    #NSString类型
 * ！user_agent2 其他方式获取的 user_agent    #NSString类型
 */
- (void)requestActivatedWithSourceAd:(NSDictionary *)sourceAd
                            complete:(RequestComplete)complete
{
    self.sourceAd = sourceAd;
    self.activatedCallback = complete;
    [RXUserUtility setValue:sourceAd ForKey:keyUserData_activityDevice];
    // 开启网络监听，授权网络后调用用户激活
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openNetwork) name:noti_openNetwork object:nil];
    [[RXCommonTool sharedSDK] hasNetwork];
}

- (void)openNetwork
{
    if ([RXUserUtility valueForKey:keyUserData_isFirstOpen] || [RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
        [[RXAdManger sharedSDK] reportAdjustInstallWithDistinctId:[RXUserUtility valueForKey:keyUserData_adjust_distinct_id]];
        return;
    }
    
    NSString *ua = [RXUserUtility sharedManager].userAgent;
    [RXUserUtility setValue:ua ForKey:keyUserData_ua];
    
    NSString *domain = [RXUserUtility valueForKey:keyUserData_ipv4Url];
    if ([NSString rx_isNullToString:domain].length > 0) {
        if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
            domain = [NSString stringWithFormat:@"%@/", domain];
        }

        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"getip" andParams:nil requsetMethod:RequestMethod_Get];
        request.baseUrl = domain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];

        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"获取ip成功:\n %@", responseObject);
            [RXUserUtility setValue:responseObject[@"ip"] ForKey:keyUserData_ipv4];

            // 获取cid
            [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    if ([response isKindOfClass:[NSDictionary class]] && response && response[@"data"]) {
                        [RXUserUtility setValue:response[@"data"] ForKey:keyUserData_cids];
                    }
//                    [self requestActiveWithIP:responseObject[@"ip"] cids:response[@"data"]];
                    [self getASATokenWithIP:responseObject[@"ip"] cids:response[@"data"]];
                } else {
//                    [self requestActiveWithIP:responseObject[@"ip"] cids:nil];
                    [self getASATokenWithIP:responseObject[@"ip"] cids:nil];
                }

            }];

        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"获取ip失败:\n %@", error.error);
            // 获取cid
            [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                [RXUserUtility setValue:error.responesObject[@"client_ip"] ForKey:keyUserData_ipv4];
                if (!error) {
                    if ([response isKindOfClass:[NSDictionary class]] && response && response[@"data"]) {
                        [RXUserUtility setValue:response[@"data"] ForKey:keyUserData_cids];
                    }
//                    [self requestActiveWithIP:error.responesObject[@"client_ip"] cids:response[@"data"]];
                    [self getASATokenWithIP:error.responesObject[@"client_ip"] cids:response[@"data"]];
                } else {
//                    [self requestActiveWithIP:error.responesObject[@"client_ip"] cids:nil];
                    [self getASATokenWithIP:error.responesObject[@"client_ip"] cids:nil];
                }
            }];
        }];

    } else {
        // 获取cid
        [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                if ([response isKindOfClass:[NSDictionary class]] && response && response[@"data"]) {                
                    [RXUserUtility setValue:response[@"data"] ForKey:keyUserData_cids];
                }
    //            [self requestActiveWithIP:@"" cids:response[@"data"]];
                [self getASATokenWithIP:@"" cids:response[@"data"]];
            } else {
    //            [self requestActiveWithIP:@"" cids:nil];
                [self getASATokenWithIP:@"" cids:nil];
            }
            
        }];
    }
}

- (void)getASATokenWithIP:(NSString *)ip cids:(NSArray *)cids
{
    if ([RXSubPackage sharedSDK].aASA) {
        __typeof (self) __weak weakSelf = self;

        self.asaBlock = ^(NSDictionary *response, NSDictionary *error) {
            if(response != nil) {
                weakSelf.asaInfo = response;
                [weakSelf requestActiveWithIP:ip cids:cids];
            } else {
                [weakSelf requestActiveWithIP:ip cids:cids];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:self.asaBlock forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_asa object:nil userInfo:notiDic];
    } else {
        [self requestActiveWithIP:ip cids:cids];
        NSLog(@"未接入ASA");
    }
}

- (void)requestActiveWithIP:(NSString *)ip cids:(NSArray *)cids
{
    NSMutableDictionary *sourceAd = [NSMutableDictionary dictionaryWithDictionary:self.sourceAd];
    if ([NSString rx_isNullToString:ip].length > 0) {
        [sourceAd setValue:ip forKey:@"ip"];
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
//    self.distinctId = [RXCommonTool getDistinct_id];
//    // 保存 distinctid，防止当前 app 生命周期内没拿到回调，
//    [RXUserUtility setValue:self.distinctId ForKey:keyUserData_adjust_distinct_id];
    
    [dic setValue:self.distinctId forKey:@"distinct_id"];
    
    NSDictionary *source_ad = self.sourceAd[@"source_ad"];
    if (source_ad && source_ad.allKeys.count > 0) {
        [dic setValue:[RXCommonTool fetchAdInfo:sourceAd] forKey:@"source_ad"];
    } else {
        NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
        NSMutableDictionary *sourceAdDic = [NSMutableDictionary dictionary];
        if (adDic.allKeys.count > 0 && [adDic.allKeys[0] isEqualToString:@"ad"]) {
            if (adDic[@"ad"] && [adDic[@"ad"] isKindOfClass:[NSDictionary class]]) {
                NSDictionary *ad = adDic[@"ad"];
                for (int i = 0; i < ad.allKeys.count; i++) {
                    [sourceAdDic setValue:ad.allValues[i] forKey:ad.allKeys[i]];
                }
            }
        }
        [dic setValue:[RXCommonTool fetchAdInfo:sourceAdDic] forKey:@"source_ad"];
    }
    
    if ([[RXUserUtility sharedManager].oiParams isKindOfClass:[NSDictionary class]] && [RXUserUtility sharedManager].oiParams.allKeys.count > 0) {
        NSMutableDictionary *sourceMut = [NSMutableDictionary dictionaryWithDictionary:dic[@"source_ad"]];
        [sourceMut setValue:[RXUserUtility sharedManager].oiParams forKey:@"openinstall"];
        [dic setValue:sourceMut forKey:@"source_ad"];
    }
    
    if (self.asaInfo && self.asaInfo.allKeys.count > 0) {
        NSMutableDictionary *asaMut = [NSMutableDictionary dictionaryWithDictionary:dic[@"source_ad"]];
        for (int i = 0; i < self.asaInfo.allKeys.count; i++) {
            [asaMut setValue:self.asaInfo.allValues[i] forKey:self.asaInfo.allKeys[i]];
        }
        [dic setValue:asaMut forKey:@"source_ad"];
    }
    
    NSMutableDictionary *userSource = [NSMutableDictionary dictionaryWithDictionary:dic[@"source_ad"]];
    if ([userSource isKindOfClass:[NSDictionary class]] && userSource.allKeys.count > 0) {
        [dic setValue:userSource forKey:@"user_source"];
        
        [RXUserUtility setValue:userSource ForKey:keyUserData_activityDevice];
    }
    
    NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
    [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
    [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
    [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
    
    NSString *user_agent = sourceAd[@"user_agent"];
    NSString *user_agent1 = sourceAd[@"user_agent1"];
    NSString *user_agent2 = sourceAd[@"user_agent2"];
    
    if ([NSString rx_isNullToString:user_agent].length > 0) {
        [deviceDic setValue:user_agent forKey:@"user_agent"];
    } else {
        [deviceDic setValue:[RXUserUtility valueForKey:keyUserData_ua] forKey:@"user_agent"];
    }
    
    if ([NSString rx_isNullToString:user_agent1].length > 0) {
        [deviceDic setValue:user_agent1 forKey:@"user_agent1"];
    }
    
    if ([NSString rx_isNullToString:user_agent2].length > 0) {
        [deviceDic setValue:user_agent2 forKey:@"user_agent2"];
    }
    
    NSString *ip1 = sourceAd[@"ip"];
    if ([NSString rx_isNullToString:ip].length > 0) {
        [deviceDic setValue:ip1 forKey:@"ipv4"];
    }
    
    if (cids && cids.count > 0) {    
        [deviceDic setValue:cids forKey:@"cid"];
    }
    [dic setValue:deviceDic forKey:@"device"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/attribution/user/activated" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"用户激活成功:\n %@", responseObject);
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstOpen];
        [RXUserUtility setValue:responseObject[@"data"] ForKey:keyUserData_activity];
        if (self.activatedCallback) {
            self.activatedCallback(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"用户激活失败:\n %@", error.error);
        if (self.activatedCallback) {
            self.activatedCallback(nil, error);
        }
    }];
}

/**
 * 获取当前请求域名
 */
- (NSString *)getApiDomain
{
    return [RXConfig sharedManager].apiDomain;
}

/**
 * 获取广告信息
 */
- (NSDictionary *)getAdInfo
{
    return [RXUserUtility valueForKey:keyUserData_pasteInfo];
}

/**
 * 清空广告信息
 */
- (void)deleteAdInfo
{
    [RXUserUtility setValue:[NSMutableDictionary dictionary] ForKey:keyUserData_pasteInfo];
}

/**
 * 获取openID
 */
- (NSString *)getOpenID
{
    return [RXUserUtility valueForKey:keyUserData_openId];
}

/**
 * 获取当前baseUrl
 */
- (NSString *)getFirstBaseUrl
{
    return [RXConfig sharedManager].apiDomain;;
}

/**
 * 设置当前语言
 * @param language  语言需符合标准格式，如en、cn等
 */
- (void)setLanguage:(NSString *)language
{
    [RXUserUtility sharedManager].isSetLanguage = YES;
    [RXUserUtility setValue:language ForKey:keyUserData_setLanguage];
    
    [[RXCommonManager sharedSDK] reportUserSetWithAction:@"language" properties:@{@"language" : language}];
    //保存公告数据以及本地是否已读未读记录
    [[RXApiService sharedSDK] getLocalAnnouncementAndSetReadOrNotRecord];
}

/**
 * 设置密码等级
 * @param type 密码强度等级枚举
 */
- (void)setPasswordStrength:(RXPasswordStrength)type
{
    [RXUserUtility setValue:@(type) ForKey:keyUserData_simplePassword];
}

/**
 * 设置密码正则
 * 需要先将密码强度设置为自定义
 */
- (void)setPwdPattern:(NSString *)pattern
{
    [RXUserUtility setValue:pattern ForKey:keyUserData_pwdPattern];
}

/**
 * 设置自定义错误码信息
 */
- (void)configErrorMsg:(NSDictionary *)msgDic{
    [RXErrorTool configErrorMsg:msgDic];
}

- (NSDictionary *)getConfigData
{
    return [RXUserUtility sharedManager].configData ?: nil;
}

/**
 * 设置商品 id 和 超时时间
 * @param productId  商品 id
 * @param timeout 超时时间，默认 2 秒
 */
- (void)setIAPProductId:(NSString *)productId timeout:(NSInteger)timeout
{
    [RXUserUtility sharedManager].iapProductId = productId;
    if (timeout > 0) {
        [RXUserUtility sharedManager].iapTimeout = timeout;
    } else {
        [RXUserUtility sharedManager].iapTimeout = 2;
    }
}

/**
 * 设置游戏角色 id
 * @param roleId 游戏角色 id
 * @param regionTag 区服信息
 */
- (void)setGameInfoWithRoleId:(NSString *)roleId
                    regionTag:(NSString *)regionTag
{
    [RXUserUtility sharedManager].cpRoleId = roleId;
    [RXUserUtility sharedManager].cpRegionTag = regionTag;
}

/**
 * 设置当前地区
 */
- (void)setArea:(NSString *)area
{
    [RXUserUtility sharedManager].area = area;
}

#pragma mark -- <notiActions>
- (void)fbLoginFail:(NSNotification *)noti
{
    RX_CommonRequestError *error = (RX_CommonRequestError *)noti.userInfo[@"error"];
//    error.error = noti.userInfo[@"error"];
    [self.loginDelegate rx_LoginCallBackWithResponse:nil error:error];
}

#pragma mark -- <getters>
- (BOOL)isUseFastAuth
{
    BOOL useFastAuth = YES;
    
    NSDictionary *channelInfo = [RXUserUtility valueForKey:keyUserData_channel];
    useFastAuth = [channelInfo[@"ra"][@"fa"] boolValue];
    
    return useFastAuth;
}

- (BOOL)useCustomKeyboard
{
    BOOL useCKB = YES;
    
    NSDictionary *channelInfo = [RXUserUtility valueForKey:keyUserData_channel];
    useCKB = [channelInfo[@"ra"][@"ckb"] boolValue];
    
    return useCKB;
}

- (NSDictionary *)getLaunchOptions
{
    return [RXUserUtility sharedManager].launchOptions ?: nil;
}

- (UISceneConnectionOptions *)getConnectOptions
{
    return [RXUserUtility sharedManager].connectOptions ?: nil;
}

/**
 * 绑定账号
 */
- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete
{
    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
    if ([ext isKindOfClass:[NSDictionary class]]) {
        [extDic addEntriesFromDictionary:ext];
    }

    NSString *method = extDic[@"method"] ? [NSString stringWithFormat:@"%@", extDic[@"method"]] : @"";
    NSString *scene = extDic[@"scene"] ? [NSString stringWithFormat:@"%@", extDic[@"scene"]] : @"";
    if (scene.length <= 0) {
        scene = @"authorization";
        [extDic setValue:scene forKey:@"scene"];
    }

    if ([scene isEqualToString:@"bind"] && [method isEqualToString:@"wechat"]) {
        if ([RXSubPackage sharedSDK].aW) {
            NSString *appid = [RXUserUtility sharedManager].wxAppid;
            if (extDic.allKeys.count > 0) {
                if (extDic[@"appid"] && [NSString stringWithFormat:@"%@", extDic[@"appid"]].length > 0) {
                    appid = extDic[@"appid"];
                }
            }
            
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:appid forKey:@"appid"];
            [notiDic setValue:extDic forKey:@"ext"];
            [notiDic setValue:complete forKey:@"callback"];
            
            [RXNotificationCenter postNoti:rxUserDefault_bind_w object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXWXSDK");
        }
    } else if ([scene isEqualToString:@"authorization"] && [method isEqualToString:@"facebook"]) {
        if ([RXSubPackage sharedSDK].aFacebook) {
            NSArray *permissions = extDic[@"permissions"];
            if (![permissions isKindOfClass:[NSArray class]]) {
                permissions = @[@"public_profile"];
            }

            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:permissions forKey:@"permissions"];
            [notiDic setValue:extDic forKey:@"ext"];
            [notiDic setValue:complete forKey:@"callback"];

            [RXNotificationCenter postNoti:rxUserDefault_bind_fb object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXFacebookSDK");
        }
    } else if ([scene isEqualToString:@"authorization"] && [method isEqualToString:@"google"]) {
        if ([RXSubPackage sharedSDK].aGoogle) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:extDic forKey:@"ext"];
            [notiDic setValue:complete forKey:@"callback"];

            [RXNotificationCenter postNoti:rxUserDefault_bind_google object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXGoogleSDK");
        }
    } else if ([scene isEqualToString:@"authorization"] && [method isEqualToString:@"vk"]) {
        if ([RXSubPackage sharedSDK].aVK) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:extDic forKey:@"ext"];
            [notiDic setValue:complete forKey:@"callback"];

            [RXNotificationCenter postNoti:rxUserDefault_bind_vk object:nil userInfo:notiDic];
        } else {
            NSLog(@"未接入 RXVKSDK");
        }
    } else if ([scene isEqualToString:@"authorization"] && [method isEqualToString:@"apple"]) {
        [[AppleLogin sharedManager] bindAccountWithExt:extDic complete:complete];
    }
}

@end
