//
//  RXPushService.m
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import "RXPushService.h"
#import "RXPushCommon.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface RXPushService () <UNUserNotificationCenterDelegate>

@property (nonatomic, strong) NSString *deviceToken;
@property (nonatomic, weak) id <RXPushDelegate> delegate;
@property (nonatomic, assign) BOOL isInit;
@property (nonatomic, strong) NSDictionary *pushInfo;
@property (nonatomic, strong) NSDictionary *clickPushInfo;

@end

@implementation RXPushService

static RXPushService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXPushService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSLog(@"RXSDK--RXPushSDK  Version: %@", sdkVersion);
    }
    return self;
}

/**
 * 初始化SDK
 * @param productId 产品id
 * @param channelId 渠道id
 * @param cpid 客户端id
 * @param baseUrlList 请求域名队列
 */
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList;
{
    [[RXPushCommon sharedSDK] saveProductid:productId];
    [[RXPushCommon sharedSDK] saveChannelid:channelId];
    [[RXPushCommon sharedSDK] saveCpid:cpid];
    [[RXPushCommon sharedSDK] saveBaseUrlList:baseUrlList];
//    [RXPushCommon sharedSDK].appid = appId;
//    [RXPushCommon sharedSDK].channelid = channelId;
//    [RXPushCommon sharedSDK].cpid = cpid;
//    [RXPushCommon sharedSDK].baseUrlList = baseUrlList;
    NSLog(@"notification调用成功");
    self.isInit = YES;
}

- (void)setIsInit:(BOOL)isInit
{
    _isInit = YES;
    if (isInit && self.pushInfo) {
        NSString *taskId = self.pushInfo[@"taskid"];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self reportPushLogWithTaskId:taskId status:3 complete:^(NSString *msg) {
                
            }];
        });
    }
}

/**
 * 注册通知
 */
- (void)initUserNotificationCenter:(id<RXPushDelegate>)delegate
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            //点击允许
//                NSLog(@"注册通知成功");
            dispatch_async(dispatch_get_main_queue(), ^{
                [[UIApplication sharedApplication] registerForRemoteNotifications];
                [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
                    NSLog(@"%@", settings);
                }];
            });
        } else {
            //点击不允许
            NSLog(@"注册通知失败");
        }
    }];
    self.delegate = delegate;
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
}

//应用在前台
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler API_AVAILABLE(ios(10.0))
{
//    NSLog(@"willPresentNotification:%@",notification.request.content.title);
    
    // 获取通知所带的数据
    NSDictionary *userInfo = [NSDictionary dictionaryWithDictionary:notification.request.content.userInfo];
    
    [self pushReceivedWithUserInfo:userInfo];
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(RXUserNotificationCenter:willPresentNotification:withCompletionHandler:)]) {
        [self.delegate RXUserNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
    }
    
    // 系统要求执行这个方法
    // 比如如果应用在前台,就不需要系统的提醒
    if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
        completionHandler(UNNotificationPresentationOptionNone);
    }
    else {
        completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
    }
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler API_AVAILABLE(ios(10.0))
{
    NSLog(@"接受点击事件");
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    
    if (self.isInit) {
        // 消息点击统计
        NSString *taskId = userInfo[@"taskid"];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self reportPushLogWithTaskId:taskId status:3 complete:^(NSString *msg) {
                
            }];
        });
    } else {
        self.pushInfo = userInfo;
    }
    
    if (userInfo && userInfo.allKeys.count > 0) {
        self.clickPushInfo = userInfo;
        [[NSUserDefaults standardUserDefaults] setValue:userInfo forKey:RXUserDefault_pushInfo];
    }
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(RXUserNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:)]) {
        [self.delegate RXUserNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
    }
    
    completionHandler();
}

/**
 * 消息接收统计
 * @param userInfo 推送参数
 */
- (void)pushReceivedWithUserInfo:(NSDictionary *)userInfo
{
    if (userInfo) {
        NSString *taskId = userInfo[@"taskid"];
        [self reportPushLogWithTaskId:taskId status:2 complete:^(NSString *msg) {
            
        }];
    }
}

/**
 * 上传deviceToken
 * 登录后调用
 * @param deviceToken APNS返回的设备码
 */
- (void)registerDeviceToken:(NSData *)deviceToken
{
    if (![deviceToken isKindOfClass:[NSData class]]) return;
    self.deviceToken = [[RXPushCommon sharedSDK] getDeviceToken:deviceToken];
    [[RXPushCommon sharedSDK] saveDeviceToken:self.deviceToken];
    NSLog(@"devicetoken = %@", self.deviceToken);
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.deviceToken forKey:@"device_code"];
    [dic setValue:@"apnspush" forKey:@"type"];
    [RXRequest requestWithUrl:@"v1/pusher/device/bind_device" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"上传deviceToken成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"上传deviceToken失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/bind_device" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"上传deviceToken成功:\n %@", response);
//        } else {
//            NSLog(@"上传deviceToken失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 上传deviceToken
 * 登录后调用
 * @param deviceToken APNS返回的设备码  必须
 * @param complete 回调结果
 */
- (void)registerDeviceToken:(NSData *)deviceToken
                   complete:(void(^)(NSDictionary *response, NSDictionary *error))complete
{
    if (![deviceToken isKindOfClass:[NSData class]]) return;
    self.deviceToken = [[RXPushCommon sharedSDK] getDeviceToken:deviceToken];
    
    if (![[RXPushCommon sharedSDK] needReportWithDeviceToken:self.deviceToken]) return;
    
    [[RXPushCommon sharedSDK] saveDeviceToken:self.deviceToken];
    NSLog(@"devicetoken = %@", self.deviceToken);
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.deviceToken forKey:@"device_code"];
    [dic setValue:@"apnspush" forKey:@"type"];
    [RXRequest requestWithUrl:@"v1/pusher/device/bind_device" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"上传deviceToken成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } ErrorBlock:^(id error) {
        NSLog(@"上传deviceToken失败:\n %@", error);
        if (complete) {
            if ([error isKindOfClass:[NSError class]]) {
                NSError *err = error;
                complete(nil, err.userInfo);
            } else if ([error isKindOfClass:[NSDictionary class]]) {
                complete(nil, error);
            }
        }
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/bind_device" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"上传deviceToken成功:\n %@", response);
//        } else {
//            NSLog(@"上传deviceToken失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 绑定别名
 * 登录后调用
 * @param alias 别名  必须
 */
- (void)bindingAlias:(NSString *)alias
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:alias forKey:@"alias"];
    [RXRequest requestWithUrl:@"v1/pusher/device/bind_alias" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"绑定别名成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"绑定别名失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/bind_alias" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"绑定别名成功:\n %@", response);
//        } else {
//            NSLog(@"绑定别名失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 解绑别名
 * 登录后调用
 */
- (void)reliveBinding
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@"" forKey:@"alias"];
    [RXRequest requestWithUrl:@"v1/pusher/device/bind_alias" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"解绑别名成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"解绑别名失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/bind_alias" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"解绑别名成功:\n %@", response);
//        } else {
//            NSLog(@"解绑别名失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 增加用户标签
 * 登录后调用
 * @param tags 标签数组 一个用户最多绑定10个标签  必须
 */
- (void)addTags:(NSArray *)tags
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:tags forKey:@"tags"];
    [RXRequest requestWithUrl:@"v1/pusher/device/add_tags" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"增加用户标签成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"增加用户标签失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/add_tags" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"增加用户标签成功:\n %@", response);
//        } else {
//            NSLog(@"增加用户标签失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 移除用户标签
 * 登录后调用
 * @param tags 标签数组
 */
- (void)deleteTags:(NSArray *)tags
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:tags forKey:@"tags"];
    [RXRequest requestWithUrl:@"v1/pusher/device/del_tags" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"移除用户标签成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"移除用户标签失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/del_tags" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"移除用户标签成功:\n %@", response);
//        } else {
//            NSLog(@"移除用户标签失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 解绑用户与渠道SDK的关联
 * 登录后调用
 */
- (void)reliveBindingPushDevice
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.deviceToken forKey:@"device_code"];
    [dic setValue:@"apnspush" forKey:@"type"];
    [RXRequest requestWithUrl:@"v1/pusher/device/unbind_device" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        NSLog(@"解绑渠道成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"解绑渠道失败:\n %@", error);
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/device/unbind_device" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"解绑渠道成功:\n %@", response);
//        } else {
//            NSLog(@"解绑渠道失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 上报推送日志
 * 登录后调用
 * @param taskId 消息id  必须
 * @param status 上报状态 1 消息已接收 2 消息已到达展示 3 消息已点击  必须
 */
- (void)reportPushLogWithTaskId:(NSString *)taskId
                         status:(NSInteger)status
                       complete:(void(^)(NSString *msg))complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:taskId forKey:@"task_id"];
    [dic setValue:@(status) forKey:@"status"];
    [dic setValue:[RXPushCommon sharedSDK].deviceToken forKey:@"device_code"];
    [dic setValue:@"apnspush" forKey:@"type"];
    [RXRequest requestWithUrl:@"v1/pusher/notify/device" requestType:@"POST" dictionary:dic SuccessBlock:^(NSDictionary * _Nonnull responseObject) {
        if (complete) {
            complete(@"success");
        }
        NSLog(@"上传推送日志成功:\n %@", responseObject);
    } ErrorBlock:^(id error) {
        NSLog(@"上传推送日志失败:\n %@", error);
        if (complete) {
            complete(@"fail");
        }
    }];
    
//    [[RXService sharedSDK] createRequestWithUrl:@"v1/pusher/notify/device" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSLog(@"上传推送日志成功:\n %@", response);
//        } else {
//            NSLog(@"上传推送日志失败:\n %@", error.responesObject);
//        }
//    }];
}

/**
 * 消息接收统计
 * @param userInfo 推送参数
 */
- (void)pushReceivedWithUserInfo1:(NSDictionary *)userInfo
                         complete:(void(^)(NSString *msg))complete
{
    if (userInfo) {
        NSString *taskId = userInfo[@"taskid"];
        [self reportPushLogWithTaskId:taskId status:2 complete:complete];
    }
}

/**
 * 设置角标badge数量
 * @note 0 为清空角标
 */
- (void)setApplicationIconBadgeNumber:(NSInteger)badgeNumber
{
    NSLog(@"RXPushSDK--角标数量为 == %ld", (long)badgeNumber);
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:badgeNumber];
}

- (NSDictionary *)getClickPushInfo
{
    return self.clickPushInfo;
}

@end
