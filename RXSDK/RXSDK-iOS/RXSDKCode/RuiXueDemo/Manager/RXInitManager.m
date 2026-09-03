//
//  RXInitManager.m
//  RXSDK
//
//  Created by 陈汉 on 2023/9/6.
//

#import "RXInitManager.h"
#import "RXCommonManager.h"
#import "RXIAPManager.h"
#import "RXExtension.h"
#import <objc/message.h>
#import "RXUWAService.h"
#import "RXApiService.h"
#import "RXBDAManager.h"

@interface RXInitManager ()

@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) NSInteger reportTime;

@end

@implementation RXInitManager

static RXInitManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXInitManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {

//        NSString *str = @"67e821126e86d067754c89ae4eeee3a5b519bb328ad0fde4703d3ad7c359591c7222653d01d0f9e8e0823189a11ece5f3153ad93d3a411170d0399fbeae05930e167a1a7e3e078d2c17079252beeb553dcdc9e01c57917643de8ac6650f6ef51b9d57d631ec029b9def3a1169b27e48a3a99b84b8d630bf236a3daf70d1e68";
//        NSString *key = @"427a3236761bd0a13fb8816a770d5100";
//        NSString *iv = [key substringToIndex:16];
//        NSString *result = [RXExtension decrypt128String:str withKey:key andIV:iv];
//        NSLog(@"");
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationWillEnterForeground:)
                                                     name:UIApplicationWillEnterForegroundNotification
                                                   object:nil];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)applicationWillEnterForeground:(NSNotification *)noti
{
    if (![RXUserUtility sharedManager].isInit) {
        return;
    }
    [self refreshServerTimeOffset];
}

/**
 * 初始化
 */
- (void)initSDKWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 开启竞速后根据 baseUrlList 并发请求，当有一个结果回调时终止或不处理其他请求
    if ([RXUserUtility sharedManager].openRacing) {
        __block BOOL initSuccess = NO;
        __block NSInteger requestCount = 0;
        __block NSMutableArray *baseUrlList = [NSMutableArray array];
        __block NSMutableArray *sucBaseUrlList = [NSMutableArray array];
        __block NSMutableArray *failBaseUrlList = [NSMutableArray array];
        
        for (int i = 0; i < [RXUserUtility sharedManager].baseUrlList.count; i++) {
            
            NSString *baseUrl = [RXUserUtility sharedManager].baseUrlList[i];
            
            [self initRXSDKWithOpenRacing:YES needRetry:NO baseUrl:baseUrl complete:^(NSDictionary *response, RX_CommonRequestError *error) {
                requestCount++;
                NSLog(@"baseUrl = %@", baseUrl);
                if (!error) {
                    [sucBaseUrlList addObject:baseUrl];
                    if (!initSuccess) {
                        initSuccess = YES;
                        if (complete) {
                            [self fetchInitResult:response error:nil];
                            NSLog(@"RXSDK初始化成功");
                            complete(response, nil);
                        }
                    }
                } else {
                    [failBaseUrlList addObject:baseUrl];
                    if (!initSuccess) {
                        if (requestCount >= [RXUserUtility sharedManager].baseUrlList.count) {
                            if (complete) {
                                [self fetchInitResult:nil error:error];
                                complete(nil, error);
                                NSLog(@"RXSDK初始化失败:\n %@", error.error);
                            }
                        }
                    }
                }
                
                if (requestCount >= [RXUserUtility sharedManager].baseUrlList.count) {
                    if (sucBaseUrlList.count > 0) {
                        [baseUrlList addObjectsFromArray:sucBaseUrlList];
                    }
                    if (failBaseUrlList.count > 0) {
                        [baseUrlList addObjectsFromArray:failBaseUrlList];
                    }
                    [RXUserUtility sharedManager].baseUrlList = baseUrlList;
                    
                    NSLog(@"baseUrlList = %@", [RXUserUtility sharedManager].baseUrlList);
//                    
//                    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//                    }];
//                    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"1111" message:[NSString stringWithFormat:@"%@", [RXUserUtility sharedManager].baseUrlList] preferredStyle:UIAlertControllerStyleAlert];
//                    [alertController addAction:cancelAction];
//                    [[UIViewController currentViewController] presentViewController:alertController animated:YES completion:nil];
                }
            }];
        }
        return;
    }
    
    [self initRXSDKWithOpenRacing:NO needRetry:YES baseUrl:[RXConfig sharedManager].apiDomain complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!error) {
            if (complete) {
                [self fetchInitResult:response error:nil];
                NSLog(@"RXSDK初始化成功");
                complete(response, nil);
            }
        } else {
            if (complete) {
                [self fetchInitResult:nil error:error];
                NSLog(@"RXSDK初始化失败:\n %@", error.error);
                complete(nil, error);
            }
        }
    }];
}

- (void)initRXSDKWithOpenRacing:(BOOL)openRacing
                      needRetry:(BOOL)needRetry
                        baseUrl:(NSString *)baseUrl
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *versionDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_initVersions]];
    [dic setValue:versionDic forKey:@"version"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/sdkconfig/init" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = baseUrl;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    request.needRetry = needRetry;
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
//        NSLog(@"RXSDK初始化失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

- (void)fetchInitResult:(id  _Nullable)responseObject
                  error:(RX_CommonRequestError * _Nullable)error
{
    if (!error) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//        NSLog(@"RXSDK初始化成功:\n %@", jsonString);
        
        // 保存配置的key和版本号
        NSMutableDictionary *responseDic = [NSMutableDictionary dictionaryWithDictionary:responseObject[@"data"]];
        NSMutableDictionary *initVersionDic = [NSMutableDictionary dictionary];
        for (int i = 0; i < responseDic.allKeys.count; i++) {
            NSDictionary *subData = responseDic.allValues[i];
            if ([subData isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:subData[@"version"]].length > 0) {
                [initVersionDic setValue:subData[@"version"] forKey:responseDic.allKeys[i]];
            }
        }
        
        [RXUserUtility sharedManager].configData = responseDic;
        [RXUserUtility setValue:initVersionDic ForKey:keyUserData_initVersions];
        
        // 保存大数据公共属性配置
        NSMutableDictionary *eventPublicDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"event_public_attr"]];
        if (eventPublicDic && eventPublicDic.allKeys.count > 0) {
            [RXUserUtility setValue:eventPublicDic[@"version"] ForKey:keyUserData_publicVersion];
            
            if (eventPublicDic[@"public_attr"]) {
                NSDictionary *public_attr = eventPublicDic[@"public_attr"];
                if ([public_attr isKindOfClass:[NSDictionary class]] && public_attr.allKeys.count > 0) {
                    [RXUserUtility setValue:public_attr ForKey:keyUserData_publicData];
                }
            }
            // 保存刷新时间
            self.reportTime = [[eventPublicDic valueForKey:@"refresh"] integerValue] / 1000;
            
            [self addMTimer];
        }
        
        // 保存投放开关
        NSMutableDictionary *adSwitchDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"advertise_switch"]];
        if (adSwitchDic && adSwitchDic.allKeys.count > 0) {
            NSInteger openSwitch = [adSwitchDic[@"switch"] integerValue];
            // 1 为开启 其他值为关闭
            if (openSwitch == 1) {
                [RXUserUtility sharedManager].isOpenAdSwitch = YES;
            } else {
                [RXUserUtility sharedManager].isOpenAdSwitch = NO;
            }
        }
        
        // 保存计费点
        NSMutableDictionary *productInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"pay_third_goods"][@"third_goods"][@"appstore"] isKindOfClass:[NSDictionary class]]) {
            productInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"pay_third_goods"][@"third_goods"][@"appstore"]];
        }
        if (productInfoDic && productInfoDic.allKeys.count > 0) {
            [RXUserUtility sharedManager].allProductInfo = productInfoDic;
//            [[RXIAPManager sharedSDK] saveProductInfo];
        }
        
        // 保存意见反馈上传文件大小限制
        NSMutableDictionary *feedbackInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"feedback"] isKindOfClass:[NSDictionary class]]) {
            feedbackInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"feedback"]];
            [RXUserUtility sharedManager].feedbackLogLimit = [feedbackInfoDic[@"log_limit"] integerValue];
        }
        
        // 保存登录配置
        NSMutableDictionary *loginMethodsDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"client_login"] isKindOfClass:[NSDictionary class]]) {
            loginMethodsDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"client_login"]];
            NSMutableArray *loginMethods = [NSMutableArray arrayWithArray:loginMethodsDic[@"list"]];
            if (loginMethods.count > 0) {
                [RXUserUtility sharedManager].loginMethods = loginMethods;
                [RXLoginManager fetchThirdConfig];
            }
            
            BOOL cer = [loginMethodsDic[@"cer"] boolValue];
//            BOOL cer = YES;
            [RXUserUtility sharedManager].closeEmailRegister = cer;
            [RXUserUtility setBool:cer ForKey:keyUserData_closeEmailRegister];
        }
        
        // 保存投放媒体信息
        NSMutableDictionary *advertiseInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"advertise_channel"] isKindOfClass:[NSDictionary class]]) {
            advertiseInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"advertise_channel"]];
            if ([advertiseInfoDic[@"adjust"] isKindOfClass:[NSDictionary class]]) {
                NSMutableDictionary *adjustDic = [NSMutableDictionary dictionaryWithDictionary:advertiseInfoDic[@"adjust"]];
                [RXUserUtility sharedManager].adjustAppToken = adjustDic[@"tk"];
                [RXUserUtility sharedManager].adjustSwitch = [adjustDic[@"of"] integerValue] == 1 ? YES : NO;
                [RXUserUtility sharedManager].adjustRegistToken = adjustDic[@"rt"];
                [RXUserUtility sharedManager].adjustActivateToken = adjustDic[@"at"];
                [RXUserUtility sharedManager].AdjustReConnectTime = [adjustDic[@"rc"] integerValue];
            }
            if ([advertiseInfoDic[@"gdt"] isKindOfClass:[NSDictionary class]]) {
                NSMutableDictionary *gdtDic = [NSMutableDictionary dictionaryWithDictionary:advertiseInfoDic[@"gdt"]];
                [RXUserUtility sharedManager].gdtSid = gdtDic[@"sid"];
                [RXUserUtility sharedManager].gdtKey = gdtDic[@"sk"];
                [RXUserUtility sharedManager].gdtSwitch = [gdtDic[@"tm"] integerValue] == 1 ? YES : NO;
            }
            if ([advertiseInfoDic[@"oceanengine"] isKindOfClass:[NSDictionary class]]) {
                NSMutableDictionary *oceanengineDic = [NSMutableDictionary dictionaryWithDictionary:advertiseInfoDic[@"oceanengine"]];
                [RXUserUtility sharedManager].oceanengineSwitch = [oceanengineDic[@"tm"] integerValue] == 1 ? YES : NO;
            }
        }
        
        // 保存 websocket 信息
        NSMutableDictionary *websocketInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"websocket"] isKindOfClass:[NSDictionary class]]) {
            websocketInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"websocket"]];
            if ([websocketInfoDic[@"ws_list"] isKindOfClass:[NSArray class]]) {
                [RXUserUtility sharedManager].wsList = websocketInfoDic[@"ws_list"];
                [RXUserUtility sharedManager].wsMethod = websocketInfoDic[@"method"];
            }
        }
        
        // 保存 ipv4 域名
        NSMutableDictionary *ipInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"ip"] isKindOfClass:[NSDictionary class]]) {
            ipInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"ip"]];
            NSString *ipv4Url = ipInfoDic[@"api"];
            if ([NSString rx_isNullToString:ipv4Url].length > 0) {
                [RXUserUtility setValue:ipv4Url ForKey:keyUserData_ipv4Url];
            }
        }
        
        // 保存 log 配置
        NSMutableDictionary *logInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"log"] isKindOfClass:[NSDictionary class]]) {
            logInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"log"]];
            [RXUserUtility setValue:logInfoDic ForKey:keyUserData_localLogInfo];
        }
        
        // 保存 apps 配置
        NSMutableDictionary *appsInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"apps"] isKindOfClass:[NSDictionary class]]) {
            appsInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"apps"]];
            [RXUserUtility setValue:appsInfoDic ForKey:keyUserData_appsInfo];
        }
        
        // 保存 lang 配置
        NSMutableDictionary *langInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"lang"] isKindOfClass:[NSDictionary class]]) {
            langInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"lang"]];
            [RXUserUtility setValue:langInfoDic ForKey:keyUserData_configLanguage];
            
            // 如果 cp 没设置语言则设置默认语言
            if (![RXUserUtility sharedManager].isSetLanguage) {
                [[RXCommonManager sharedSDK] setDefaultLanguage];
            }
        }
        
        // 保存 uab 配置
        NSMutableDictionary *uabInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"uab"] isKindOfClass:[NSDictionary class]]) {
            uabInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"uab"]];
            [RXUserUtility setValue:responseDic[@"uab"] ForKey:keyUserData_deviceUab];
        }
        
        // 保存 channel 配置
        NSMutableDictionary *channelInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"channel"] isKindOfClass:[NSDictionary class]]) {
            channelInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"channel"]];
            [RXUserUtility setValue:responseDic[@"channel"] ForKey:keyUserData_channel];
            
            BOOL iifaaVisible = NO;
            NSDictionary *realAuthInfo = channelInfoDic[@"ra"];
            if ([realAuthInfo isKindOfClass:[NSDictionary class]]) {
                id iifaa = realAuthInfo[@"iifaa"];
                if (iifaa && iifaa != [NSNull null]) {
                    iifaaVisible = [iifaa boolValue];
                }
            }
            [RXUserUtility setBool:iifaaVisible ForKey:keyUserData_iifaaVisible];
            
            NSString *scheme = @"";
            id schemeInfo = channelInfoDic[@"sh"];
            if ([schemeInfo isKindOfClass:[NSDictionary class]]) {
                id schemeValue = schemeInfo[@"scheme"];
                if ([schemeValue isKindOfClass:[NSString class]]) {
                    scheme = (NSString *)schemeValue;
                }
            } else if ([schemeInfo isKindOfClass:[NSString class]]) {
                scheme = (NSString *)schemeInfo;
            }
            if (scheme.length > 0 && ![scheme containsString:@"://"]) {
                scheme = [NSString stringWithFormat:@"%@://", scheme];
            }
            [RXUserUtility setValue:scheme ForKey:keyUserData_iifaaScheme];
            
            NSString *universalLink = channelInfoDic[@"ulink"];
            [self configUniversalLink:universalLink];
        }
        
        //保存device配置
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"device"] isKindOfClass:[NSDictionary class]]) {
            deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"device"]];
            BOOL net = [deviceInfoDic[@"net"][@"of"] boolValue];
            [RXUserUtility sharedManager].uploadNet = net;
            [RXUserUtility setBool:net ForKey:keyUserData_uploadNet];
            BOOL mod = [deviceInfoDic[@"mod"][@"of"] boolValue];
            [RXUserUtility sharedManager].uploadMod = mod;
            [RXUserUtility setBool:mod ForKey:keyUserData_uploadMod];
        }
        
        //保存gpm定时上传配置，pm不存在、或者gpm存在但其中时间间隔为0时，不上报
        if ([[responseDic allKeys] containsObject:@"gpm"]) {
            NSMutableDictionary *gpmDic = [NSMutableDictionary dictionary];
            if ([responseDic[@"gpm"] isKindOfClass:[NSDictionary class]]) {
                gpmDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"gpm"]];
                NSString *gpmType = gpmDic[@"type"];
                [RXUserUtility sharedManager].gpmType = gpmType;
                [RXUserUtility setValue:gpmType ForKey:keyUserData_gpmType];
                
                NSString *sdk_ts = [gpmDic[@"sdk_ts"] stringValue];
                [RXUserUtility sharedManager].sdk_ts = sdk_ts;
                [RXUserUtility setValue:sdk_ts ForKey:keyUserData_sdk_ts];
                
                NSString *uwa_ts = [gpmDic[@"uwa_ts"] stringValue];
                [RXUserUtility sharedManager].uwa_ts = uwa_ts;
                [RXUserUtility setValue:uwa_ts ForKey:keyUserData_uwa_ts];
                
                //gpm sdk自动调用定时器收集并上传gpm指标
                [[RXUWAService sharedSDK] configWithReportTime];
            }
        }
        
        NSMutableDictionary *iaDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"ia"] isKindOfClass:[NSDictionary class]]) {
            iaDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"ia"]];
            BOOL isOpen = [iaDic[@"sk2"] boolValue];
            [RXUserUtility sharedManager].sk2 = isOpen;
        }
        
        // 保存加密信息
        NSMutableDictionary *cpDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"cp"] isKindOfClass:[NSDictionary class]]) {
            cpDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"cp"]];
            BOOL isOpen = [cpDic[@"of"] boolValue];
            [RXUserUtility sharedManager].needEncrypt = isOpen;
        }
        
        // 保存 openinstall 信息
        NSMutableDictionary *oiDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"oi"] isKindOfClass:[NSDictionary class]]) {
            oiDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"oi"]];
            NSString *oiAppid = [oiDic valueForKey:@"appid"];
            NSString *oiDomain = [oiDic valueForKey:@"domain"];
            
            [RXUserUtility sharedManager].oiDomain = oiDomain;
            [RXUserUtility sharedManager].oiAppKey = oiAppid;
            
            if (oiAppid.length > 0 && oiDomain.length > 0) {
                [RXUserUtility sharedManager].openOI = YES;
            } else {
                [RXUserUtility sharedManager].openOI = NO;
            }
        }
        
        // 保存服务器时间偏移量
        NSMutableDictionary *serverDic = [NSMutableDictionary dictionary];
        if ([responseDic[@"server"] isKindOfClass:[NSDictionary class]]) {
            serverDic = [NSMutableDictionary dictionaryWithDictionary:responseDic[@"server"]];
            NSString *serverTimeStr = [NSString stringWithFormat:@"%@", serverDic[@"time"]];
            [self updateStOffsetWithServerTimeString:serverTimeStr];
        }
        
        [RXUserUtility sharedManager].isInit = YES;
        
        //保存公告数据以及本地是否已读未读记录
        [[RXApiService sharedSDK] getLocalAnnouncementAndSetReadOrNotRecord];
        
        // 激活巨量
        [[RXBDAManager sharedSDK] initBDA];
    } else {
        [RXUserUtility sharedManager].isInit = NO;
    }
}

/**
 * 获取大数据公共属性列表
 */
- (void)getEventPublicProperties:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [self closeTimer];
    
    NSString *version = [RXUserUtility valueForKey:keyUserData_publicVersion];
    if ([NSString rx_isNullToString:version].length <= 0) {
        version = @"0";
    }
    
    NSString *url = [NSString stringWithFormat:@"v1/sdkconfig/sync/event_attrs?version=%@", version];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"获取公共属性成功:\n %@", jsonString);
        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:responseObject[@"data"]];
        [RXUserUtility setValue:resDic[@"version"] ForKey:keyUserData_publicVersion];
        
        if (resDic[@"public_attr"]) {
            NSDictionary *public_attr = resDic[@"public_attr"];
            if ([public_attr isKindOfClass:[NSDictionary class]] && public_attr.allKeys.count > 0) {
                [RXUserUtility setValue:public_attr ForKey:keyUserData_publicData];
            }
        }
        
        // 保存刷新时间
        self.reportTime = [[resDic valueForKey:@"refresh"] integerValue] / 1000;
        
        [self addMTimer];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取公共属性失败:\n %@", error.error);        
        // 再失败每10分钟重试
        self.reportTime = 60 * 10;
        [self addMTimer];
    }];
}

#pragma mark -- 服务器时间偏移量

/**
 * 根据服务器时间字符串计算并保存 st_offset
 */
- (void)updateStOffsetWithServerTimeString:(NSString *)serverTimeStr
{
    if ([NSString rx_isNullToString:serverTimeStr].length <= 0) {
        return;
    }
    long long serverTime = [serverTimeStr longLongValue];
    if (serverTime <= 0) {
        return;
    }
    long long deviceTime = (long long)([[NSDate date] timeIntervalSince1970] * 1000);
    long long offset = serverTime - deviceTime;
    [RXUserUtility sharedManager].stOffset = [NSString stringWithFormat:@"%lld", offset];
}

/**
 * 获取服务器时间并刷新 st_offset
 */
- (void)refreshServerTimeOffset
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/sdkconfig/detection" andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSDictionary *dataDic = nil;
        if ([responseObject isKindOfClass:[NSDictionary class]] &&
            [responseObject[@"data"] isKindOfClass:[NSDictionary class]]) {
            dataDic = responseObject[@"data"];
        }
        if (!dataDic) {
            return;
        }
        NSString *serverTimeStr = [NSString stringWithFormat:@"%@", dataDic[@"time"]];
        [self updateStOffsetWithServerTimeString:serverTimeStr];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"刷新服务器时间失败:\n %@", error.error);
    }];
}

#pragma mark -- <timer>
- (void)addMTimer
{
    if (self.reportTime <= 0) {
        return;
    }
    if (!_timer) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    } else {
        [self closeTimer];
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    }
}

- (void)timerAction
{
    [self getEventPublicProperties:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
    }];
}

- (void)closeTimer
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

#pragma mark -- 配置 wUniversalLink
- (void)configUniversalLink:(NSString *)universalLink
{
    if ([NSString rx_isNullToString:universalLink].length > 0) {
        [[NSUserDefaults standardUserDefaults] setValue:universalLink forKey:keyUserData_ulink];
    }
}

@end
