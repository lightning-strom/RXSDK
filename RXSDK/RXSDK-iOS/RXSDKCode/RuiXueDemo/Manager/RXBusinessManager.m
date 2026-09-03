//
//  RXBusinessManager.m
//  RXSDK
//
//  Created by 陈汉 on 2023/5/29.
//

#import "RXBusinessManager.h"

@interface RXBusinessManager ()

@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) NSInteger reportTime;
@property (nonatomic, assign) BOOL isRequestSuc; // 是否请求成功
@property (nonatomic, assign) BOOL isFirstFail;  // 是否第一次请求失败

@end

@implementation RXBusinessManager

static RXBusinessManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXBusinessManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isFirstFail = YES;
    }
    return self;
}

/**
 * 获取商业化数据
 */
- (void)getBusinessInfo
{
    [self closeTimer];
    
    NSString *version = [RXUserUtility valueForKey:keyUserData_busVersion];
    NSString *url = @"v1/business/rule";
    if ([NSString rx_isNullToString:version].length > 0) {
        url = [NSString stringWithFormat:@"v1/business/rule?version=%@", version];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"获取商业化数据成功:\n %@", jsonString);

        self.isRequestSuc = YES;

        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:responseObject[@"data"]];
        [RXUserUtility setValue:resDic[@"version"] ForKey:keyUserData_busVersion];
        
        BOOL hit_cache = [[resDic valueForKey:@"hit_cache"] boolValue];
        if (!hit_cache) {
            NSDictionary *main_window_list = [resDic valueForKey:@"main_window_list"];
            NSDictionary *window_list = [resDic valueForKey:@"window_list"];
            if (main_window_list && ![main_window_list isEqual:[NSNull null]] &&
                window_list && ![window_list isEqual:[NSNull null]]) {
                [RXUserUtility setValue:resDic ForKey:keyUserData_busData];
            }
        }
        
        // 保存刷新时间
        self.reportTime = [[resDic valueForKey:@"refresh_time"] integerValue] / 1000;
        
        [self addMTimer];
        
        // 请求完成打标记并发送通知
        [RXUserUtility sharedManager].isBusSuccess = YES;
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_busRequestSuc object:nil userInfo:nil];
        
//        if (complete) {
//            complete(responseObject, nil);
//        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取商业化数据失败:\n %@", error.error);
        // 请求完成打标记并发送通知
        [RXUserUtility sharedManager].isBusSuccess = YES;
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_busRequestSuc object:nil userInfo:nil];
        
        // 首次失败3秒后重试，再失败每10分钟重试
        if (!self.isRequestSuc) {
            if (self.isFirstFail) {
                self.reportTime = 3;
                self.isFirstFail = NO;
            } else {
                self.reportTime = 60 * 10;
            }
            [self addMTimer];
        }
    }];
}

/**
 * 商业化下单
 * @param trade_no CP订单号
 * @param sign 获取商业化数据返回的sign
 */
- (void)requestBusinessOrderWithTrade_no:(NSString *)trade_no
                                    sign:(NSString *)sign
                                complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:trade_no forKey:@"trade_no"];
    [dic setValue:sign forKey:@"sign"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/business/p" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"商业化下单成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"商业化下单失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

#pragma mark -- <timer>
- (void)addMTimer
{
    if (!_timer) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    } else {
        [self closeTimer];
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    }
}

- (void)timerAction
{
    [self getBusinessInfo];
}

- (void)closeTimer
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

@end
