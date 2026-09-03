//
//  RXFeedbackService.m
//  RXSDK
//
//  Created by 陈汉 on 2023/10/12.
//

#import "RXFeedbackService.h"
#import "RXCommonHeader.h"
#import "RXOSSPutManager.h"

@implementation RXFeedbackService

static RXFeedbackService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFeedbackService alloc] init];
    });
    return sharedSDK;
}

/**
 * 获取意见反馈类型
 */
- (void)getFeedbackKindListWithComplete:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/feedbackapi/kind/list" andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取意见反馈类型成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取意见反馈类型失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 创建意见反馈
 * @note params 说明
 - game_id:游戏ID    #NSInteger
 - kind_id:意见反馈ID    #NSInteger
 - kind_name:"意见反馈类型"    #NSString
 - priority:紧急程度 1:紧急 2:不紧急    #NSInteger
 - content:"反馈内容"    #NSString
 - picture:"图片url"    #NSString
 - player_gameid:"玩家游戏id"    #NSString
 - send_voided_mails:作废是否发邮件 1:发 2:不发    #NSInteger
 */
- (void)createFeedbackWithParams:(NSDictionary *)params
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
 
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/feedbackapi/player/create" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"创建意见反馈成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"创建意见反馈失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 满意度评价
 * @note params 说明
 - key_number:创建意见反馈的ID    #NSInteger
 - pleased_status:满意度 1:满意 2:不满意    #NSInteger
 - reason:"理由"    #NSString
 */
- (void)satisfactionEvaluationWithParams:(NSDictionary *)params
                                complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params];
 
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/feedbackapi/pleased/update" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"满意度评价成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"满意度评价失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 上报反馈日志
 * @note 客服后台创建反馈时生效
 * @param data 文件二进制
 */
- (void)reportFeedbackLogWithData:(NSData *)data
                         complete:(RequestComplete)complete
{
    NSInteger limit = 2 * 1024 * 1024;
    
    if ([RXUserUtility sharedManager].feedbackLogLimit > 0) {
        limit = [RXUserUtility sharedManager].feedbackLogLimit;
    }
    
    if ([data length] > limit) {
        if (complete) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            NSString *errorMsg = [NSString stringWithFormat:@"File size %ld, %@ %ld", [data length], [RXErrorTool getRXErrorMsg:RXTrackError_byteLimit], limit];
            err.responesObject = @{@"msg" : errorMsg,
                                   @"code" : @(RXTrackError_byteLimit)
            };
            if (err != nil) {
                err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
            }
            
            complete(nil, err);
        }
    }
    
    NSString *openid = [RXUserUtility valueForKey:keyUserData_openId];
    if ([NSString rx_isNullToString:openid].length <= 0) {
        openid = @"default";
    }
    NSString *path = [NSString stringWithFormat:@"feed_log/%@_%d", openid, self.feedbackId];
    [[RXOSSPutManager sharedSDK] uploadWithBodyData:data ossPath:path process:^(float process) {
        
    } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [self requestUserLogWithUrl:response[@"url"] complete:complete];
        } else {
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

- (void)requestUserLogWithUrl:(NSString *)url
                     complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(self.feedbackId) forKey:@"id"];
    [dic setValue:url forKey:@"log_url"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/feedbackapi/report/userlog" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"反馈日志上报成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"反馈日志上报失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

@end
