//
//  RXLoginManager.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/29.

#import "RXLoginManager.h"
#import "NSObject+RXAddition.h"
#import "RXIAPService.h"
//#import "RXBusinessManager.h"
#import "CHCid.h"
#import <pthread.h>
#import "RXInitManager.h"
#import "RXAdManger.h"
#import "RXCommonManager.h"
#import "RXABManager.h"
#import "RXLogManager.h"
#import "RXUWAService.h"
#import "RXWelfareCodeManager.h"
#import "RXWebSocket.h"
#import "RXBDAManager.h"
#import "RXGDTManager.h"

@implementation RXLoginManager

+ (void)loginWithExtDic:(NSMutableDictionary * __nullable)extDic
               username:(NSString *)username
               password:(NSString *)password
            sign_fields:(NSArray * _Nullable)sign_fields
              loginType:(LoginType)loginType
           migrate_args:(id _Nullable)migrate_args
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
    NSMutableDictionary *oiParams = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].oiParams];
    [RXUserUtility sharedManager].oiParams = @{};
    [RXCommonTool deletePasteboard];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    
    if ([extDic1 valueForKey:@"adDic"]) {
        adDic = [NSMutableDictionary dictionaryWithDictionary:[extDic1 valueForKey:@"adDic"]];
        [extDic1 removeObjectForKey:@"adDic"];
    }
    
    if ([extDic1 valueForKey:@"oiParams"]) {
        oiParams = [NSMutableDictionary dictionaryWithDictionary:[extDic1 valueForKey:@"oiParams"]];
        [extDic1 removeObjectForKey:@"oiParams"];
    }
    
    switch (loginType) {
        case LoginTypeAuth:
        {
            [dic setValue:@"quickphone" forKey:@"method"];
            [RXUserUtility setValue:@"quickphone" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeAuth) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeEmail:
        {
            [dic setValue:@"email" forKey:@"method"];
            [RXUserUtility setValue:@"email" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeEmail) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeApple:
        {
            [dic setValue:@"apple" forKey:@"method"];
            [RXUserUtility setValue:@"apple" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeApple) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeW:
        {
            [dic setValue:@"wechat" forKey:@"method"];
            [RXUserUtility setValue:@"wechat" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeW) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeVisitor:
        {
            [dic setValue:@"guest" forKey:@"method"];
            [RXUserUtility setValue:@"guest" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeVisitor) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeAccount:
        {
            [dic setValue:@"username" forKey:@"method"];
            [dic setValue:username forKey:@"username"];
            [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
            [RXUserUtility setValue:@"username" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeAccount) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeVirtual:
        {
            [dic setValue:@"virtual" forKey:@"method"];
            [RXUserUtility setValue:@"virtual" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeVirtual) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeFacebook:
        {
            [dic setValue:@"facebook" forKey:@"method"];
            [RXUserUtility setValue:@"facebook" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeFacebook) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeGoogle:
        {
            [dic setValue:@"google" forKey:@"method"];
            [RXUserUtility setValue:@"google" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeGoogle) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeVK:
        {
            [dic setValue:@"vk" forKey:@"method"];
            [RXUserUtility setValue:@"vk" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeVK) ForKey:keyUserData_methodenum];
            break;
        }
        case LoginTypeCapCode:
        {
            [dic setValue:@"captchacode" forKey:@"method"];
            [dic setValue:username forKey:@"username"];
//            [dic setValue:extDic1[@"captchacode"] forKey:@"captchacode"];
            [RXUserUtility setValue:@"captchacode" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeCapCode) ForKey:keyUserData_methodenum];
//            [extDic1 removeObjectForKey:@"captchacode"];
            break;
        }
        case LoginTypeLine:
        {
            [dic setValue:@"line" forKey:@"method"];
            [RXUserUtility setValue:@"line" ForKey:keyUserData_method];
            [RXUserUtility setValue:@(LoginTypeLine) ForKey:keyUserData_methodenum];
        }
            break;
        default:
        {
            [RXUserUtility setValue:[RXUserUtility valueForKey:keyUserData_method] ForKey:keyUserData_method];
            [RXUserUtility setValue:@([[RXUserUtility valueForKey:keyUserData_methodenum] integerValue]) ForKey:keyUserData_methodenum];
        }
            break;
    }
    
    [[RXLogManager sharedSDK] addThirdLoginLogWithLoginType:loginType begin:NO errorInfo:nil];
    
    NSString *method = [extDic1 valueForKey:@"method"];
    if ([NSString rx_isNullToString:method].length > 0) {
        [dic setValue:method forKey:@"method"];
        [RXUserUtility setValue:method ForKey:keyUserData_method];
    }
    
    if (![RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
        NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
        [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
        [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
        [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
        
        [deviceDic setValue:[RXUserUtility valueForKey:keyUserData_cids] forKey:@"cid"];
        
        NSMutableDictionary *sourceAd = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_activityDevice]];
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
        
        NSString *ip1 = [RXUserUtility valueForKey:keyUserData_ipv4];
        if ([NSString rx_isNullToString:ip1].length > 0) {
            [deviceDic setValue:ip1 forKey:@"ipv4"];
        }
        
        [dic setValue:deviceDic forKey:@"device"];
        [dic setValue:[RXUserUtility valueForKey:keyUserData_distinct_id] forKey:@"distinct_id"];
        
        NSMutableDictionary *activateDic = [NSMutableDictionary dictionary];
        NSDictionary *activateResult = (NSDictionary *)[RXUserUtility valueForKey:keyUserData_activity];
        if (activateResult) {
            [activateDic setValue:[RXUserUtility valueForKey:keyUserData_activity] forKey:@"result"];
            [dic setValue:activateDic forKey:@"activate"];
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
            [activateDic setValue:sourceAdDic forKey:@"args"];
            [dic setValue:activateDic forKey:@"activate"];
        }
    } else {
        NSString *needContinue = extDic1[@"needContinue"];
        if ([RXUserUtility sharedManager].isOpenAdSwitch) {
            if (![needContinue isEqualToString:@"1"]) {
                [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        [extDic setValue:response[@"data"] forKey:@"cid"];
                    } else {
                        
                    }
                    
                    [extDic setValue:@"1" forKey:@"needContinue"];
                    [extDic setValue:response[@"data"] forKey:@"cid"];
                    [extDic setValue:adDic forKey:@"adDic"];
                    if ([oiParams isKindOfClass:[NSDictionary class]] && oiParams.allKeys.count > 0) {
                        [extDic setValue:oiParams forKey:@"oiParams"];
                    }
                    
                    [RXLoginManager loginWithExtDic:extDic username:username password:password sign_fields:sign_fields loginType:loginType migrate_args:migrate_args complete:complete];
                }];
                return;
            }
            NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
            [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
            [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
            [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
            [deviceDic setValue:extDic1[@"cid"] forKey:@"cid"];
            
            [extDic1 removeObjectForKey:@"cid"];
            [extDic1 removeObjectForKey:@"needContinue"];
            
            NSMutableDictionary *sourceAd = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_activityDevice]];
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
            
            NSString *ip1 = [RXUserUtility valueForKey:keyUserData_ipv4];
            if ([NSString rx_isNullToString:ip1].length > 0) {
                [deviceDic setValue:ip1 forKey:@"ipv4"];
            }
            
            [dic setValue:deviceDic forKey:@"device"];
            
            NSMutableDictionary *activateDic = [NSMutableDictionary dictionary];
            NSDictionary *activateResult = (NSDictionary *)[RXUserUtility valueForKey:keyUserData_activity];
            if (activateResult) {
                [activateDic setValue:[RXUserUtility valueForKey:keyUserData_activity] forKey:@"result"];
                [dic setValue:activateDic forKey:@"activate"];
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
                [activateDic setValue:sourceAdDic forKey:@"args"];
                [dic setValue:activateDic forKey:@"activate"];
            }
        }
    }
    
    NSMutableDictionary *target_user = [NSMutableDictionary dictionaryWithDictionary:extDic1[@"target_user"]];
    if (target_user && target_user.allKeys.count > 0) {
        [dic setValue:target_user forKey:@"target_user"];
        [extDic1 removeObjectForKey:@"target_user"];
    }
    
    
    // 处理账号迁移情况，bind_thirdparty不传默认为0，传1为绑定原账号，将上次登录的access传入
//    NSString *bind_thirdparty = extDic1[@"bind_thirdparty"];
    NSMutableDictionary *headParam = [NSMutableDictionary dictionary];
    headParam = [RX_CommonNetworkExcuteManager headParams];
//    if ([NSString rx_isNullToString:bind_thirdparty].length > 0) {
//        NSString *accessToken = extDic1[@"access_token"];
//        if ([NSString rx_isNullToString:accessToken].length > 0) {
//            [dic setValue:@([bind_thirdparty integerValue]) forKey:@"bind_thirdparty"];
//            [headParam setValue:accessToken forKey:@"ruixue-accesstoken"];
//        } else {
//            accessToken = [RXUserUtility valueForKey:[NSString stringWithFormat:@"%@_%@", [RXUserUtility valueForKey:keyUserData_openId], keyUserData_access]];
//            if ([NSString rx_isNullToString:accessToken].length > 0) {
//                [dic setValue:@([bind_thirdparty integerValue]) forKey:@"bind_thirdparty"];
//                [headParam setValue:accessToken forKey:@"ruixue-accesstoken"];
//            }
//        }
//    }
    
    // 支持自定义设备码
    NSString *devicecode = extDic1[@"devicecode"];
    if ([NSString rx_isNullToString:devicecode].length > 0) {
        [headParam setValue:devicecode forKey:@"ruixue-devicecode"];
    }
    
    // 是否断线重连
    __block BOOL reconnect_login = NO;
    if ([extDic1 valueForKey:@"reconnect_login"]) {
        reconnect_login = [[extDic1 valueForKey:@"reconnect_login"] boolValue];
        [dic setValue:[extDic1 valueForKey:@"reconnect_login"] forKey:@"reconnect_login"];
        [extDic1 removeObjectForKey:@"reconnect_login"];
    }
    
    // 是否有自定义透传参数
    if ([extDic1 valueForKey:@"custom_ext"]) {
        
        NSMutableDictionary *customExt = [NSMutableDictionary dictionaryWithDictionary:[extDic1 valueForKey:@"custom_ext"]];
        if ([customExt isKindOfClass:[NSDictionary class]] && customExt.allKeys.count > 0) {
            [dic setValue:customExt forKey:@"custom_ext"];
        }
        
        [extDic1 removeObjectForKey:@"custom_ext"];
    }

    [dic setValue:extDic1 forKey:@"ext"];
    
    // 传入子渠道
    NSString *subChannelId = [RXUserUtility sharedManager].subChannelId;
    NSMutableDictionary *subPackage = [NSMutableDictionary dictionary];
    [subPackage setValue:subChannelId forKey:@"sub_channel_id"];
    [subPackage setValue:@"promoter" forKey:@"package_type"];
    if ([NSString rx_isNullToString:subChannelId].length > 0) {
        NSMutableDictionary *user_source = [NSMutableDictionary dictionary];
        [user_source setValue:subPackage forKey:@"sub_package"];
        [dic setValue:user_source forKey:@"user_source"];
    }
    
    // 设置大数据用户属性，仅对本次登录新注册的用户有效，优先取客户端传入数据
    NSDictionary *user_attrs = extDic1[@"user_attrs"];
    if (user_attrs && [user_attrs isKindOfClass:[NSDictionary class]] && user_attrs.allKeys.count > 0) {
        [dic setValue:user_attrs forKey:@"user_attrs"];
        if (adDic && adDic.allKeys.count > 0) {
            [dic setValue:adDic forKey:@"user_source"];
        }
    } else {
        if (adDic.allKeys.count > 0) {
            if ([adDic.allKeys[0] isEqualToString:@"attr"]) {
                if (adDic[@"attr"] && [adDic[@"attr"] isKindOfClass:[NSDictionary class]]) {
                    NSDictionary *attrs = adDic[@"attr"];
                    NSMutableDictionary *attrsDic = [NSMutableDictionary dictionary];
                    for (int i = 0; i < attrs.allKeys.count; i++) {
                        [attrsDic setValue:attrs.allValues[i] forKey:attrs.allKeys[i]];
                    }
                    [dic setValue:attrsDic forKey:@"user_attrs"];
                }
            } else {
                if (adDic && adDic.allKeys.count > 0) {
                    [dic setValue:adDic forKey:@"user_source"];
                }
                
                if (oiParams && oiParams.allKeys.count > 0) {
                    NSMutableDictionary *userSourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
                    [userSourceDic setValue:oiParams forKey:@"openinstall"];
                    [dic setValue:userSourceDic forKey:@"user_source"];
                }
            }
        } else {
            if (oiParams && oiParams.allKeys.count > 0) {
                NSMutableDictionary *userSourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
                [userSourceDic setValue:oiParams forKey:@"openinstall"];
                [dic setValue:userSourceDic forKey:@"user_source"];
            }
        }
    }
    
    if ([NSString rx_isNullToString:[RXCommonTool getTaskid]].length > 0) {
        NSMutableDictionary *user_sourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
        if (user_sourceDic && user_sourceDic.allKeys.count > 0) {
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        } else {
            user_sourceDic = [NSMutableDictionary dictionary];
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        }
        [dic setValue:user_sourceDic forKey:@"user_source"];
    }
    
    [dic setValue:migrate_args forKey:@"migrate_args"];
    [dic setValue:sign_fields forKey:@"sign_fields"];
//    [dic setValue:[CHCid getCCountryCode] forKey:@"country"];
    
//    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
//    
//    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
    //设置大数据上报设备型号、设备网络状态
    BOOL mod = [RXUserUtility boolForKey:keyUserData_uploadMod];
    if (mod && [NSString rx_isNullToString:[RXCommonTool rxGetiPhoneDeviceType]].length > 0) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetiPhoneDeviceType] forKey:@"model"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    BOOL net = [RXUserUtility boolForKey:keyUserData_uploadNet];
    if (net) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetNetworkStatus] forKey:@"network_standard"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    
    NSString *url = @"v1/passport/account/login_by_credential";
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = headParam;
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    NSString *traceid = [header valueForKey:@"ruixue-traceid"];
    
    [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_invoke url:url header:header body:dic result:nil];
    [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_request url:url header:header body:dic result:nil];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"登录成功:\n %@", responseObject);
        
        [[RXLogManager sharedSDK] addLoginLogWithLoginType:loginType errorInfo:nil];
        
        [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:responseObject];
        
        NSDictionary *model = (NSDictionary *)responseObject[@"data"];
        [RXUserUtility setValue:model[@"openid"] ForKey:keyUserData_openId];
        [RXUserUtility setValue:model[@"topinviter_openid"] ForKey:keyUserData_topinviterOpenid];
        [RXUserUtility setValue:model[@"login_openid"] ForKey:keyUserData_loginOpenId];
        [RXUserUtility setValue:model[@"source_channel"] ForKey:keyUserData_sourceChannel];
        [RXUserUtility setValue:model[@"subchannelid"] ForKey:keyUserData_subchannelid];
        [RXUserUtility setValue:model[@"source"] ForKey:keyUserData_source];
        [RXUserUtility setValue:@([model[@"ts"] longValue]) ForKey:keyUserData_loginSuccessTime];
        [RXUserUtility setValue:@([model[@"login_openid_expire"] longValue]) ForKey:keyUserData_loginOpenidExpire];
        
//        NSLog(@"%ld")
        NSDictionary *tokenDic = responseObject[@"data"][@"token"];
        [RXUserUtility setValue:tokenDic[@"access"] ForKey:keyUserData_access];
        [RXUserUtility setValue:tokenDic[@"refresh"] ForKey:keyUserData_refresh];
        [RXUserUtility setValue:@([tokenDic[@"access_expire"] integerValue]) ForKey:keyUserData_accessExpire];
        [RXUserUtility setValue:@([RXCommonTool getTimestamp]) ForKey:keyUserData_refreshTime];
        
        [RXUserUtility sharedManager].isLogin = YES;
        [RXUserUtility sharedManager].age = [model[@"age"] integerValue];
        
        
//        if (loginType != LoginTypeAccount && model.method.length > 0) {
//            [RXUserUtility saveMethod:model.method];
//        }
                
        // 是否新用户
        BOOL isNewUser = ([model[@"flag"] integerValue] & 1) == 1;
        //上报新注册用户的邮箱或手机号
        if (isNewUser && ![RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
            [[RXAdManger sharedSDK] reportLoginEmailOrPhoneNumber];
        }
        
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstLogin];
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstReportLoginLog];
        
        NSDictionary *notiDic = @{@"loginData" : responseObject,
                                  @"loginType" : @(loginType)
        };
        
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
        
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxCloseAuth object:nil userInfo:nil];
        
        // UI 组件用，格式不同
        [RXUserUtility setValue:notiDic ForKey:keyUserData_loginData];
        
        // 通用
        [RXUserUtility sharedManager].loginData = responseObject[@"data"];
        
//        if (!reconnect_login) {
//            [[RXBusinessManager sharedSDK] getBusinessInfo];
//        }

        // 登录成功后补单
        BOOL needReIAP = [[RXIAPService sharedSDK] checkHasFailedOrder];
        if(needReIAP)
        {
            [[RXIAPService sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

            }];
        }
        
        // sk2 补单
        [[RXIAPService sharedSDK] sk2UnfinishUncompletedTransactionsWithOrderInfo:nil completeHandle:nil];
        
        // 上报adid
        [[RXAdManger sharedSDK] setAdid];
        
        //是否为新用户，新用户则上报事件
        NSString *reportMethod = model[@"method"];
        if (isNewUser) {
            [[RXAdManger sharedSDK] reportAdjustRegistEvent];
            // 上报广点通注册
            [[RXGDTManager sharedSDK] registerGDT:reportMethod];
        }
        
        // 上报已安装应用列表
        [[RXCommonManager sharedSDK] reportAppInfo];
        // 上报广点通登录
        [[RXGDTManager sharedSDK] loginGDT:reportMethod];
        
        [RXUserUtility setValue:@"" ForKey:keyUserData_distinct_id];
        
        // 上报通讯录信息
        [[RXABManager sharedSDK] reportAddressBookList];
        
        // 上报UWA获取的用户属性
        NSString *uwaKey = [NSString stringWithFormat:@"uwa_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *uwaUserProperty = [RXUserUtility valueForKey:uwaKey];
        if (uwaUserProperty) {//本地存在则对比是否有不同，如有不同之处则仅上报不同之处，否则不上传
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getUwaInfoCompareWithDict:[RXUserUtility sharedManager].uwaPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:differentUserProDic];
            }
        }else{//本地不存在，则存储本地一份，然后上报
            if ([RXUserUtility sharedManager].uwaPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].uwaPropertyDic ForKey:uwaKey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:[RXUserUtility sharedManager].uwaPropertyDic];
            }
            
        }
        
        // 上报gpm sdk获取的用户属性
        NSString *sdkkey = [NSString stringWithFormat:@"sdk_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *sdkUserProperty = [RXUserUtility valueForKey:sdkkey];
        if (sdkUserProperty) {
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getSDKInfoCompareWithDict:[RXUserUtility sharedManager].sdkPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:differentUserProDic];
            }
        }else{
            if ([RXUserUtility sharedManager].sdkPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].sdkPropertyDic ForKey:sdkkey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:[RXUserUtility sharedManager].sdkPropertyDic];
            }
        }
        
        //获取主播标识，做位运算，首位是1则为主播，否则不是主播
        BOOL isAnchor = ([model[@"user_flag"] integerValue] & 1) == 1;
        if (isAnchor) {
            [RXUserUtility sharedManager].isAnchor = YES;
        }else{
            [RXUserUtility sharedManager].isAnchor = NO;
        }
        NSString *cp_user_id = model[@"cp_user_id"];
        [RXUserUtility sharedManager].cp_user_id = cp_user_id;
        [[RXWelfareCodeManager sharedSDK] resetTimerAndPollingTimeAndPromoCode];
                
        [RXLoginManager loginSuccessWithRes:model];
        
        if (complete) {
            [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_callback url:url header:header body:dic result:responseObject];
            complete(responseObject, nil);
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:error.responesObject];
        NSLog(@"登录失败:\n %@", error.responesObject);
        
        [[RXLogManager sharedSDK] addLoginLogWithLoginType:loginType errorInfo:error.responesObject];
        
        NSDictionary *notiDic = @{@"loginData" : error.responesObject,
                                  @"loginType" : @(loginType)
        };
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
        
        if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:request.headParams
                                                           bodyDic:request.params
                                                            action:rxlog_error_login
                                                               url:[NSString stringWithFormat:@"%@%@",request.baseUrl, request.apiName]
                                                              code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                               msg:error.responesObject[@"msg"]
                                                         thirdType:[RXLoginManager loginTypeStringFromLoginType:loginType]
                                                         thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:error.responesObject[@"thirdmsg"]
                                                           traceid:@""];
        }
        
        if (complete) {
            [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:error.responesObject];
            complete(nil, error);
        }
    }];
}

/**
 * 二次登录
 */
+ (void)loginWithLoginOpenId:(NSString *)loginOpenId
                 sign_fields:(NSArray * _Nullable)sign_fields
                      extDic:(NSMutableDictionary * __nullable)extDic
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
    NSMutableDictionary *oiParams = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].oiParams];
    [RXUserUtility sharedManager].oiParams = @{};
    [RXCommonTool deletePasteboard];
    NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
    
    [dic setValue:loginOpenId forKey:@"login_openid"];
    
    NSString *method = [RXUserUtility valueForKey:keyUserData_method];
    if ([NSString rx_isNullToString:method].length > 0) {
        [dic setValue:method forKey:@"method"];
    } else {
        if (extDic1 && extDic1.allKeys.count > 0) {
            [dic setValue:extDic1[@"method"] forKey:@"method"];
        }
    }
    
    if (extDic1 && extDic1.allKeys.count > 0 && extDic1[@"method"]) {
        [dic setValue:extDic1[@"method"] forKey:@"method"];
    }
    
    [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
    [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
    [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
    [dic setValue:deviceDic forKey:@"device"];
    
    // 是否断线重连
    __block BOOL reconnect_login = NO;
    if ([extDic1 valueForKey:@"reconnect_login"]) {
        reconnect_login = [[extDic1 valueForKey:@"reconnect_login"] boolValue];
        [dic setValue:[extDic1 valueForKey:@"reconnect_login"] forKey:@"reconnect_login"];
        [extDic1 removeObjectForKey:@"reconnect_login"];
    }
    
    // 是否有自定义透传参数
    if ([extDic1 valueForKey:@"custom_ext"]) {
        
        NSMutableDictionary *customExt = [NSMutableDictionary dictionaryWithDictionary:[extDic1 valueForKey:@"custom_ext"]];
        if ([customExt isKindOfClass:[NSDictionary class]] && customExt.allKeys.count > 0) {
            [dic setValue:customExt forKey:@"custom_ext"];
        }
        
        [extDic1 removeObjectForKey:@"custom_ext"];
    }
    
    [dic setValue:extDic1 forKey:@"ext"];
    [dic setValue:sign_fields forKey:@"sign_fields"];
    
    // 传入子渠道
    NSString *subChannelId = [RXUserUtility sharedManager].subChannelId;
    NSMutableDictionary *subPackage = [NSMutableDictionary dictionary];
    [subPackage setValue:subChannelId forKey:@"sub_channel_id"];
    [subPackage setValue:@"promoter" forKey:@"package_type"];
    if ([NSString rx_isNullToString:subChannelId].length > 0) {
        NSMutableDictionary *user_source = [NSMutableDictionary dictionary];
        [user_source setValue:subPackage forKey:@"sub_package"];
        [dic setValue:user_source forKey:@"user_source"];
    }
    
    // 设置大数据用户属性，仅对本次登录新注册的用户有效，优先取客户端传入数据
    NSDictionary *user_attrs = extDic1[@"user_attrs"];
    if (user_attrs && [user_attrs isKindOfClass:[NSDictionary class]] && user_attrs.allKeys.count > 0) {
        [dic setValue:user_attrs forKey:@"user_attrs"];
        if (adDic && adDic.allKeys.count > 0) {
            [dic setValue:adDic forKey:@"user_source"];
        }
    } else {
        if (adDic.allKeys.count > 0) {
            if ([adDic.allKeys[0] isEqualToString:@"attr"]) {
                if (adDic[@"attr"] && [adDic[@"attr"] isKindOfClass:[NSDictionary class]]) {
                    NSDictionary *attrs = adDic[@"attr"];
                    NSMutableDictionary *attrsDic = [NSMutableDictionary dictionary];
                    for (int i = 0; i < attrs.allKeys.count; i++) {
                        [attrsDic setValue:attrs.allValues[i] forKey:attrs.allKeys[i]];
                    }
                    [dic setValue:attrsDic forKey:@"user_attrs"];
                }
            } else {
                if (adDic && adDic.allKeys.count > 0) {
                    [dic setValue:adDic forKey:@"user_source"];
                }
                if (oiParams && oiParams.allKeys.count > 0) {
                    NSMutableDictionary *userSourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
                    [userSourceDic setValue:oiParams forKey:@"openinstall"];
                    [dic setValue:userSourceDic forKey:@"user_source"];
                }
            }
        } else {
            if (oiParams && oiParams.allKeys.count > 0) {
                NSMutableDictionary *userSourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
                [userSourceDic setValue:oiParams forKey:@"openinstall"];
                [dic setValue:userSourceDic forKey:@"user_source"];
            }
        }
    }
    
    if ([NSString rx_isNullToString:[RXCommonTool getTaskid]].length > 0) {
        NSMutableDictionary *user_sourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
        if (user_sourceDic && user_sourceDic.allKeys.count > 0) {
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        } else {
            user_sourceDic = [NSMutableDictionary dictionary];
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        }
        [dic setValue:user_sourceDic forKey:@"user_source"];
    }
    
//    [dic setValue:[CHCid getCCountryCode] forKey:@"country"];
    
    //设置大数据上报设备型号、设备网络状态
    BOOL mod = [RXUserUtility boolForKey:keyUserData_uploadMod];
    if (mod) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetiPhoneDeviceType] forKey:@"model"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    BOOL net = [RXUserUtility boolForKey:keyUserData_uploadNet];
    if (net) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetNetworkStatus] forKey:@"network_standard"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    
    NSString *url = @"v1/passport/account/login_by_token";
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    NSString *traceid = [header valueForKey:@"ruixue-traceid"];
    
    [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_invoke url:url header:header body:dic result:nil];
    [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_request url:url header:header body:dic result:nil];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"登录成功:\n %@", responseObject);
        [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:responseObject];
        
        // 通用
        [RXUserUtility sharedManager].loginData = responseObject[@"data"];
        
        NSDictionary *model = (NSDictionary *)responseObject[@"data"];
        [RXUserUtility setValue:model[@"openid"] ForKey:keyUserData_openId];
        [RXUserUtility setValue:model[@"topinviter_openid"] ForKey:keyUserData_topinviterOpenid];
        [RXUserUtility setValue:model[@"login_openid"] ForKey:keyUserData_loginOpenId];
        [RXUserUtility setValue:model[@"source_channel"] ForKey:keyUserData_sourceChannel];
        [RXUserUtility setValue:model[@"subchannelid"] ForKey:keyUserData_subchannelid];
        [RXUserUtility setValue:model[@"source"] ForKey:keyUserData_source];
        [RXUserUtility setValue:@([model[@"ts"] longValue]) ForKey:keyUserData_loginSuccessTime];
        [RXUserUtility setValue:@([model[@"login_openid_expire"] longValue]) ForKey:keyUserData_loginOpenidExpire];
        
        NSDictionary *tokenDic = responseObject[@"data"][@"token"];
        [RXUserUtility setValue:tokenDic[@"access"] ForKey:keyUserData_access];
        [RXUserUtility setValue:tokenDic[@"refresh"] ForKey:keyUserData_refresh];
        [RXUserUtility setValue:@([tokenDic[@"access_expire"] integerValue]) ForKey:keyUserData_accessExpire];
        [RXUserUtility setValue:@([RXCommonTool getTimestamp]) ForKey:keyUserData_refreshTime];
        
        [RXUserUtility sharedManager].isLogin = YES;
        [RXUserUtility sharedManager].age = [model[@"age"] integerValue];
        
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstLogin];
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstReportLoginLog];
        
        NSDictionary *notiDic = @{@"loginData" : responseObject,
                                  @"loginType" : @(LoginTypeQuick)
        };
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
        
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxCloseAuth object:nil userInfo:nil];
        
        [RXUserUtility setValue:notiDic ForKey:keyUserData_loginData];
        
//        if (!reconnect_login) {
//            [[RXBusinessManager sharedSDK] getBusinessInfo];
//        }
        
        // 登录成功后补单
        BOOL needRepay = [[RXIAPService sharedSDK] checkHasFailedOrder];
        if(needRepay)
        {
            [[RXIAPService sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

            }];
        }
        // sk2 补单
        [[RXIAPService sharedSDK] sk2UnfinishUncompletedTransactionsWithOrderInfo:nil completeHandle:nil];
        
        // 上报adid
        [[RXAdManger sharedSDK] setAdid];
        // 上报广点通登录
        NSString *reportMethod = model[@"method"];
        [[RXGDTManager sharedSDK] loginGDT:reportMethod];
        // 上报已安装应用列表
        [[RXCommonManager sharedSDK] reportAppInfo];
        
        // 上报通讯录信息
        [[RXABManager sharedSDK] reportAddressBookList];
        
        // 上报UWA获取的用户属性
        NSString *uwaKey = [NSString stringWithFormat:@"uwa_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *uwaUserProperty = [RXUserUtility valueForKey:uwaKey];
        if (uwaUserProperty) {//本地存在则对比是否有不同，如有不同之处则仅上报不同之处，否则不上传
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getUwaInfoCompareWithDict:[RXUserUtility sharedManager].uwaPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:differentUserProDic];
            }
        }else{//本地不存在，则存储本地一份，然后上报
            if ([RXUserUtility sharedManager].uwaPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].uwaPropertyDic ForKey:uwaKey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:[RXUserUtility sharedManager].uwaPropertyDic];
            }
            
        }
        
        // 上报gpm sdk获取的用户属性
        NSString *sdkkey = [NSString stringWithFormat:@"sdk_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *sdkUserProperty = [RXUserUtility valueForKey:sdkkey];
        if (sdkUserProperty) {
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getSDKInfoCompareWithDict:[RXUserUtility sharedManager].sdkPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:differentUserProDic];
            }
        }else{
            if ([RXUserUtility sharedManager].sdkPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].sdkPropertyDic ForKey:sdkkey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:[RXUserUtility sharedManager].sdkPropertyDic];
            }
        }
        
        //获取主播标识，做位运算，首位是1则为主播，否则不是主播
        BOOL isAnchor = ([model[@"user_flag"] integerValue] & 1) == 1;
        if (isAnchor) {
            [RXUserUtility sharedManager].isAnchor = YES;
        }else{
            [RXUserUtility sharedManager].isAnchor = NO;
        }
        NSString *cp_user_id = model[@"cp_user_id"];
        [RXUserUtility sharedManager].cp_user_id = cp_user_id;
        [[RXWelfareCodeManager sharedSDK] resetTimerAndPollingTimeAndPromoCode];
        
        [RXLoginManager loginSuccessWithRes:model];
        
        if (complete) {
            [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_callback url:url header:header body:dic result:responseObject];
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"登录失败:\n %@", error.error);
        [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:error.responesObject];
        NSDictionary *notiDic = @{@"loginData" : error.responesObject,
                                  @"loginType" : @(LoginTypeQuick)
        };
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
        
        if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:request.headParams
                                                           bodyDic:request.params
                                                            action:rxlog_error_login
                                                               url:[NSString stringWithFormat:@"%@%@",request.baseUrl, request.apiName]
                                                              code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                               msg:error.responesObject[@"msg"]
                                                         thirdType:@""
                                                         thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:error.responesObject[@"thirdmsg"]
                                                           traceid:@""];
        }
        
        if (complete) {
            [RXCommonTool saveLocalLogWithTraceid:traceid event:rxlog_login_result url:url header:header body:dic result:error.responesObject];
            complete(nil, error);
        }
    }];
}

+ (void)refreshTokenWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/token/refresh" andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    [header setValue:[RXUserUtility valueForKey:keyUserData_refresh] forKey:@"ruixue-refreshtoken"];
    request.headParams = header;
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"刷新token成功:\n %@", responseObject);
        NSDictionary *tokenDic = responseObject[@"data"];
        
        [RXUserUtility setValue:tokenDic[@"access"] ForKey:keyUserData_access];
        [RXUserUtility setValue:tokenDic[@"refresh"] ForKey:keyUserData_refresh];
        [RXUserUtility setValue:@([tokenDic[@"access_expire"] integerValue]) ForKey:keyUserData_accessExpire];
        [RXUserUtility setValue:@([RXCommonTool getTimestamp]) ForKey:keyUserData_refreshTime];
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"刷新token失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

+ (void)loginSuccessWithRes:(NSDictionary *)res
{
    // 链接 websocket
    [RXLoginManager connectWebsocket];
    
    // 上报登录注册事件
    // 是否新用户
    BOOL isNew = ([res[@"flag"] integerValue] & 1) == 1;
    
    if (isNew) {
        [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"register" params:@{}];
        [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"login" params:@{}];
    } else {
        [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"login" params:@{}];
    }
}

// 链接 websocket
+ (void)connectWebsocket
{
    // 不存在给出提示
    if (![RXSubPackage sharedSDK].aBDA) {
        NSLog(@"未接入RXBDAsignalSDK");
        return;
    }
    
    NSArray *wsList = [RXUserUtility sharedManager].wsList;
    NSString *method = [RXUserUtility sharedManager].wsMethod;
    if (wsList.count > 0 && [method.uppercaseString isEqualToString:@"SDK"]) {
        [RXWebSocket sharedSDK].addrs = wsList;
        [[RXWebSocket sharedSDK] connectSocketWithHost:wsList[0] port:0 timeout:10];
    }
}

/**
 * 根据登录枚举，获取对应的类型字符串
 */
+ (NSString *)loginTypeStringFromLoginType:(LoginType)loginType{
    switch (loginType) {
        case LoginTypeVisitor: return @"guest";
        case LoginTypeAccount: return @"username";
        case LoginTypeEmail: return @"email";
        case LoginTypeAuth: return @"auth";
        case LoginTypeW: return @"wechat";
        case LoginTypeApple: return @"apple";
        case LoginTypeQuick: return @"quickphone";
        case LoginTypeGoogle: return @"google";
        case LoginTypeFacebook: return @"facebook";
        case LoginTypeVirtual: return @"virtual";
        case LoginTypeCapCode: return @"captchacode";
        case LoginTypeLine: return @"line";
        case LoginTypeZalo: return @"zalo";
        case LoginTypeTikTok: return @"tiktok";
        case LoginTypeSnapChat: return @"snapchat";
        case LoginTypeInstagram: return @"instagram";
        case LoginTypeReddit: return @"reddit";
        case LoginTypeVK: return @"vk";
        case LoginTypeDefault: return @"default";
        default: return @"Unknown LoginType";
    }
}

/**
 * 解析初始化三方配置
 */
+ (void)fetchThirdConfig
{
    // 初始化下发的登录配置
    NSMutableArray *loginMethods = [RXUserUtility sharedManager].loginMethods;
    
    NSMutableArray *fetchLoginMethods = [NSMutableArray array];
    
    for (int i = 0; i < loginMethods.count; i++) {
        NSDictionary *dic = loginMethods[i];
        NSString *method = dic[@"method"];
        [fetchLoginMethods addObject:dic[@"method"]];
        
        // 一键登录
        if ([method isEqualToString:@"quickphone"]) {
            NSString *quickKey = dic[@"quickphone_key"];
            if ([NSString rx_isNullToString:quickKey].length > 0) {
                [RXUserUtility sharedManager].quickphoneKey = quickKey;
            }
        }
        // 微信登录
        if ([method isEqualToString:@"wechat"]) {
            NSString *appid = dic[@"wx_appid"];
            if ([NSString rx_isNullToString:appid].length > 0) {
                [RXUserUtility sharedManager].wxAppid = appid;
            }
        }
        // google登录
        if ([method isEqualToString:@"google"]) {
            NSString *clientid = dic[@"google_clientid"];
            if ([NSString rx_isNullToString:clientid].length > 0) {
                [RXUserUtility sharedManager].googleClientid = clientid;
            }
        }
    }
}

@end
