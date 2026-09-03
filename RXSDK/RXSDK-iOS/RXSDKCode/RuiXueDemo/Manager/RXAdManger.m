//
//  RXAdManger.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/1/27.
//

#import "RXAdManger.h"
#import <objc/message.h>
#import "RXLogService.h"
#import "RXLogManager.h"

#define DelayStart 10
#define DelayRequest DelayStart + 3

@interface RXAdManger ()

@property (nonatomic, strong) NSString *distinctId;
@property (nonatomic, strong) NSString *reportedAdidKey;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) NSInteger reportTime;

@end

@implementation RXAdManger

static RXAdManger *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXAdManger alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSLog(@"接收回调通知");
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(adjustAttributionChanged:) name:@"RXSDK_adjustAttributionChanged" object:nil];
        
        self.reportTime = [RXUserUtility sharedManager].AdjustReConnectTime;
        
//        [self initAdjust];
    }
    return self;
}

- (void)initAdjust
{
    [self privateInit];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(DelayRequest * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if ([NSString rx_isNullToString:[RXSubPackage sharedSDK].adid].length > 0) {
            [self closeTimer];
            [self setAdid];
        } else {
        }
    });
}

- (void)privateInit
{
    if ([RXSubPackage sharedSDK].aAdjust) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:[RXUserUtility sharedManager].adjustAppToken forKey:@"appToken"];
        [notiDic setValue:@(DelayStart) forKey:@"delay"];
        [RXNotificationCenter postNoti:rxUserDefault_adjust_init object:nil userInfo:notiDic];
    }
}

#pragma mark -- notificationActions
- (void)adjustAttributionChanged:(NSNotification *)noti
{
    NSLog(@"执行回调通知");
    NSDictionary *dic = noti.userInfo;
    
    // 延迟 0.5s 执行，防止回调过快没取到 distinctid
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self reportBigDataWithInfo:dic];
    });
  
    // 上报激活事件
    NSMutableDictionary *activateDic = [NSMutableDictionary dictionary];
    [activateDic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [activateDic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [activateDic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    [activateDic setValue:[RXUserUtility valueForKey:keyUserData_adjust_distinct_id] forKey:@"client_distinct_id"];
    [activateDic setValue:[self getFirebaseInstanceId] forKey:@"firebase_instanceid"];

    // 避免失败，先初始化
    [self privateInit];
    
    if ([RXSubPackage sharedSDK].aAdjust) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:[RXUserUtility sharedManager].adjustActivateToken forKey:@"eventToken"];
        [notiDic setValue:activateDic forKey:@"params"];
        [RXNotificationCenter postNoti:rxUserDefault_adjust_event object:nil userInfo:notiDic];
    }
    
    [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_bind_bigdata distinctId:@"" properties:dic];
}

/**
 * 上报adjsut adid
 */
- (void)setAdid
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
  
    // 获取缓存的 adjust adid
    NSString *cacheAdjustAdid = [RXUserUtility valueForKey:keyUserData_adjustAdid];
    
    // 当前 openid 是否上报成功过
    NSString *isReport = [RXUserUtility valueForKey:self.reportedAdidKey];
    if ([isReport isEqualToString:@"1"]) {
        return;
    }
    
    NSLog(@"adjust adid = %@", cacheAdjustAdid);
    NSInteger delay = 0;
    if ([NSString rx_isNullToString:cacheAdjustAdid].length > 0) {
        // cacheAdjustAdid 不为空直接上报
    } else {
        // cacheAdjustAdid 为空先获取 adid
        [self privateInit];
        
        delay = DelayRequest;
    }
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSString *adjustAdid = [RXSubPackage sharedSDK].adid;
        
        if ([NSString rx_isNullToString:adjustAdid].length > 0) {
            [RXUserUtility setValue:adjustAdid ForKey:keyUserData_adjustAdid];
            
            [dic setValue:[RXUserUtility valueForKey:keyUserData_adjust_distinct_id] forKey:@"client_distinct_id"];
            [dic setValue:adjustAdid forKey:@"adjust_adid"];
            [dic setValue:[self getFirebaseInstanceId] forKey:@"firebase_instanceid"];
            [dic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
            [dic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/attribution/user/bind_adid" andParams:dic requsetMethod:RequestMethod_Post];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
                NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                NSLog(@"adjust adid上报成功:\n %@", jsonString);
                
                if ([NSString rx_isNullToString:adjustAdid].length > 0) {
                    [RXUserUtility setValue:@"1" ForKey:self.reportedAdidKey];
                }
                
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"adjust adid上报失败:\n %@", error.error);
            }];
        } else {
            [self addMTimer];
        }
    });

}

/**
 * 上报adjust安装
 */
- (void)reportAdjustInstallWithDistinctId:(NSString *)distinctId
{
    NSLog(@"开始上报 adjust 安装");
    self.distinctId = distinctId;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
  
    NSString *sdkVersion = [[RX_CommonNetworkExcuteManager headParams] valueForKey:@"ruixue-version"];
    // 设置会话回传参数
    if ([RXSubPackage sharedSDK].aAdjust) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:self.distinctId forKey:@"client_distinct_id"];
        [notiDic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
        [notiDic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
        [notiDic setValue:sdkVersion forKey:@"sdk_version"];
        [RXNotificationCenter postNoti:rxUserDefault_adjust_session object:nil userInfo:notiDic];
    }
    
    // 初始化
    [self privateInit];
    
    // 延迟获取 adid
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(DelayRequest * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSString *adjustAdid = [RXSubPackage sharedSDK].adid;
        
        [RXUserUtility setValue:adjustAdid ForKey:keyUserData_adjustAdid];
        
        // adjust 不为空
        NSLog(@"adjust adid = %@", adjustAdid);
        
        [dic setValue:adjustAdid forKey:@"adjust_adid"];
        [dic setValue:[self getFirebaseInstanceId] forKey:@"firebase_instanceid"];
        [dic setValue:distinctId forKey:@"client_distinct_id"];
        
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/attribution/user/adjust_jihuo" andParams:dic requsetMethod:RequestMethod_Post];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSLog(@"adjust安装上报成功:\n %@", jsonString);
            
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"adjust安装上报失败:\n %@", error.error);
        }];
    });

}

/**
 * 上报归因回传数据
 */
- (void)reportBigDataWithInfo:(NSDictionary *)info
{
    if (![RXUserUtility sharedManager].adjustSwitch) {
        return;
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:info forKey:@"adjust"];
    [dic setValue:[self getFirebaseInstanceId] forKey:@"firebase_instanceid"];
    [dic setValue:self.distinctId forKey:@"client_distinct_id"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/attribution/user/bind_bigdata" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"上报归因回传数据成功:\n %@", jsonString);
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"上报归因回传数据失败:\n %@", error.error);
    }];
}

/**
 * 上报adjust注册事件
 */
- (void)reportAdjustRegistEvent
{
    // 上报注册事件
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_adjust_distinct_id] forKey:@"client_distinct_id"];
    [dic setValue:[self getFirebaseInstanceId] forKey:@"firebase_instanceid"];

    // 初始化
    [self privateInit];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(DelayRequest * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if ([RXSubPackage sharedSDK].aAdjust) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:[RXUserUtility sharedManager].adjustRegistToken forKey:@"eventToken"];
            [notiDic setValue:dic forKey:@"params"];
            [RXNotificationCenter postNoti:rxUserDefault_adjust_event object:nil userInfo:notiDic];
        }
    });
}

- (NSString *)reportedAdidKey
{
    NSString *openid = [RXUserUtility valueForKey:keyUserData_openId];
    NSString *key = [NSString stringWithFormat:@"%@_%@", keyUserData_adjustAdidReported, openid];
    
    return key;
}

/**
 * 新用户首次登录条件下，上报用户的邮箱或手机号
 */
- (void)reportLoginEmailOrPhoneNumber
{
    [self getUserEncInfoWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!error) {
            NSString *dataString = [response objectForKey:@"data"];
            NSDictionary *dataDic = [NSJSONSerialization JSONObjectWithData:[dataString dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:nil];
            
            NSString *email = [dataDic objectForKey:@"email"];
            if (email.length == 0) {
                email = [dataDic objectForKey:@"external_email"];
            }
            NSString *phone = [dataDic objectForKey:@"phone"];
            if (phone.length == 0) {
                phone = [dataDic objectForKey:@"external_phone"];
            }
            
            if (email.length > 0) {
                if ([RXSubPackage sharedSDK].aAdjust) {
                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                    [notiDic setValue:email forKey:@"email"];
                    [RXNotificationCenter postNoti:rxUserDefault_adjust_email object:nil userInfo:notiDic];
                }
            }
            if (phone.length > 0) {
                if ([RXSubPackage sharedSDK].aAdjust) {
                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                    [notiDic setValue:phone forKey:@"phone"];
                    [RXNotificationCenter postNoti:rxUserDefault_adjust_phone object:nil userInfo:notiDic];
                }
            }
            
        }else{
            NSLog(@"获取用户邮箱、手机号失败");
        }
    }];
}

/**
 * 注册成功后，上报用户的邮箱或手机号
 */
- (void)reportRegisterEmailOrPhoneNumber:(NSString *)accountStr
{
    if ([RXCommonTool validateEmail:accountStr]) {
        if ([RXSubPackage sharedSDK].aAdjust) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:accountStr forKey:@"email"];
            [RXNotificationCenter postNoti:rxUserDefault_adjust_email object:nil userInfo:notiDic];
        }
    }
    if ([RXCommonTool validateMobile:accountStr]) {
        if ([RXSubPackage sharedSDK].aAdjust) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:accountStr forKey:@"phone"];
            [RXNotificationCenter postNoti:rxUserDefault_adjust_phone object:nil userInfo:notiDic];
        }
    }
}

#pragma mark -- Firebase
- (NSString *)getFirebaseInstanceId
{
    [RXNotificationCenter postNoti:rxUserDefault_firebase_instanceid object:nil userInfo:nil];
    
    NSString *firebaseInsID = [RXSubPackage sharedSDK].instanceId;

    return firebaseInsID;
}

#pragma mark - 获取登录用户邮箱
/**
 * 获取用户邮箱
 * @param complete 结果返回block
 */
- (void)getUserEncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/enc_info" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSString *resultString = responseObject[@"data"];
        NSString *key = [RXExtension getEncryptKey];
        NSString *iv = [key substringToIndex:16];
        NSString *result = [RXExtension decrypt128String:resultString withKey:key andIV:iv];
        if ([NSString rx_isNullToString:result].length > 0) {
            responseObject[@"data"] = result;
            if (complete) {
                complete(responseObject, nil);
            }
        }else{
            NSDictionary *errorInfo = @{@"code" : @(RXLoginError_default),
                                       @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_default],
            };
            RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
            error.responesObject = errorInfo;
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (complete) {
                complete(nil, error);
            }
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:request.headParams bodyDic:request.params action:rxlog_error_login url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] code:[error.responesObject[@"code"] integerValue] msg:error.responesObject[@"msg"] thirdType:@"" thirdcode:-123 thirdmsg:@"" traceid:@""];
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
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
    [self initAdjust];
}

- (void)closeTimer
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

@end
