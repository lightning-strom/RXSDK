//
//  RXDestroyAccountService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/16.
//

#import "RXDestroyAccountService.h"
#import "RXCommonHeader.h"
//#import "RXDeregisterConfig.h"

@implementation RXDestroyAccountService

static RXDestroyAccountService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXDestroyAccountService alloc] init];
    });
    return sharedSDK;
}

/**
 * 申请注销账号
 * @param IDCard 身份证  必须
 * @param realname 真实姓名  必须
 * @param cpdata CP自定义数据 非必须
 */
- (void)destroyAccountWithIDCard:(NSString *)IDCard
                        realname:(NSString *)realname
                          cpdata:(NSString * _Nullable)cpdata
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:IDCard forKey:@"idcard"];
    [dic setValue:realname forKey:@"realname"];
    [dic setValue:cpdata forKey:@"cpdata"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/deregister" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"申请账号注销成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"申请账号注销失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 申请注销账号
 * @param config 注销参数配置
 */
- (void)deregisterWithConfig:(RXDeregisterConfig *)config
                    complete:(RequestComplete)complete
{
    [self destroyAccountWithIDCard:config.idCard realname:config.realname cpdata:config.cpdata complete:complete];
}

/**
 * 撤销注销申请
 */
- (void)repealDestroyAccountWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/cancel_deregister" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"撤销注销申请成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"撤销注销申请失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 撤销注销申请
 */
- (void)deregisterCancelWithComplete:(RequestComplete)complete
{
    [self repealDestroyAccountWithComplete:complete];
}

@end
