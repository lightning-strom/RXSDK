//
//  RXUserActionLogManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/3/7.
//

#import "RXUserActionLogManager.h"
#import "RXCommonHeader.h"
#import "RX_CommonNetworkExcuteManager.h"
#import "DeviceKey.h"
#import "NSData+GZIP.h"
#import "CHCid.h"
#import <objc/message.h>

@interface RXUserActionLogManager ()

@property (nonatomic, assign) NSInteger reportTime;
@property (nonatomic, assign) NSInteger maxCount;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) NSMutableArray *logLocalArr; // 数据备份
@property (nonatomic, assign) BOOL isRequesting;
@property (nonatomic, assign) BOOL needReport;
@property (nonatomic, assign) NSInteger reportCount;
@property (nonatomic, assign) NSInteger reportMaxTime;
@property (nonatomic, strong) NSArray *whiteList;

@end

@implementation RXUserActionLogManager

static RXUserActionLogManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXUserActionLogManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        @try {
            // 进入后台监听
//            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didEnterBackground:) name: UIApplicationDidEnterBackgroundNotification object:nil];
            // 挂起状态监听
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationEnterBackground) name: UIApplicationWillResignActiveNotification object:nil];
            
            self.logLocalArr = [NSMutableArray array];
            
            [self configWithReportTime:-1 maxCount:-1];

            self.whiteList = @[
                @"v1/passport/account/login_by_token",
                @"v1/passport/account/login_by_credential",
                @"v1/vcapi/update",
                @"v1/passport/captcha/send",
                @"v1/passport/captcha/send_auth",
                @"v1/sdkconfig/init",
                @"v1/passport/user/realauth"
            ];
            
        } @catch (NSException *exception) {
            NSLog(@"数据结构错误");
        } @finally {
            
        }
    }
    return self;
}

- (void)initConfig
{
    NSMutableDictionary *logInfo = [RXUserUtility valueForKey:keyUserData_localLogInfo];
    if ([logInfo isKindOfClass:[NSDictionary class]] && logInfo.allKeys.count > 0 && logInfo[@"ua"]) {
        NSMutableDictionary *userActionInfo = [NSMutableDictionary dictionaryWithDictionary:logInfo[@"ua"]];
        
        self.needReport = [userActionInfo[@"of"] boolValue];
        self.reportCount = [userActionInfo[@"no"] integerValue];
        self.reportMaxTime = [userActionInfo[@"max"] integerValue];
    }
}

- (void)applicationEnterBackground
{
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
    if (logArr.count > 0) {
        [self reportLogRequestWithLogArr:logArr];
    }
}

- (void)didEnterBackground:(NSNotification *)noti
{
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
    if (logArr.count > 0) {
        [self reportLogRequestWithLogArr:logArr];
    }
}

/**
 * 埋点配置
 * 添加埋点后SDK会根据配置定期上报
 * @param reportTime 上报间隔（秒），默认60s
 * @param maxCount 最大缓存数--达到最大缓存数量触发上报条件（例：传100 缓存数据量达到100时触发上报），默认100条
 */
- (void)configWithReportTime:(NSInteger)reportTime
                    maxCount:(NSInteger)maxCount
{
    self.reportTime = reportTime == -1 ? 60 : reportTime;
    self.maxCount = maxCount == -1 ? 100 : maxCount;
    [self addMTimer];
}

/**
 * 终止用户行为统计
 */
- (void)stopTrackUserAction
{
    [RXUserUtility setBool:YES ForKey:keyUserData_userActionLog_stop];
    
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
    if (logArr.count > 0) {
        [self reportLogRequestWithLogArr:logArr];
    }
}

/**
 * 对比第一条数据，时间超过下发的最大值停止上报
 */
- (BOOL)compareTime
{
    @try {
        BOOL needStop = NO;
        
        NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
        if (logArr.count > 0) {
            NSInteger firstTimestamp = [[RXUserUtility valueForKey:keyUserData_userActionLog_firstTime] integerValue];
            if (firstTimestamp > 0) {
                NSInteger nowTimestamp = [RXCommonTool getTimestamp] / 1000;
                
                if (nowTimestamp - firstTimestamp >= self.reportMaxTime) {
                    needStop = YES;
                }
            }
        }
        
        if (needStop) {
            [self stopTrackUserAction];
        }
        
        return needStop;
    } @catch (NSException *exception) {
        NSLog(@"log catch");
    } @finally {
        
    }
}

/**
 * 数据埋点（批量上报）
 * @note private
 */
- (BOOL)addUserActionWithScene:(NSString *)scene
                        action:(NSString * _Nullable)action
                    properties:(NSDictionary * _Nullable)properties
{
    @try {
        NSMutableDictionary *mutProperties = [NSMutableDictionary dictionaryWithDictionary:properties];
        [mutProperties setValue:scene forKey:@"scene"];
        [mutProperties setValue:action forKey:@"action"];
        
        [self addUserActionWithEvent:@"#rx_user_action" distinctId:@"" properties:mutProperties];
        
        return YES;
    } @catch (NSException *exception) {
        NSLog(@"log catch");
    } @finally {
        
    }
}

/**
 * 数据埋点（批量上报）网络请求
 * @note private
 */
- (BOOL)addUserActionRequestWithHeader:(NSDictionary *)header
                                  body:(NSDictionary * _Nullable)body
                                   url:(NSString *)url
                             errorCode:(NSInteger)errorCode
                              errorMsg:(NSString *)errorMsg
                            properties:(NSDictionary * _Nullable)properties
{
    @try {
        BOOL needReport = NO;
        
        for (int i = 0; i < self.whiteList.count; i++) {
            if ([url containsString:self.whiteList[i]]) {
                needReport = YES;
            }
        }
        
        if (!needReport) {
            return NO;
        }
        
        NSMutableDictionary *mutProperties = [NSMutableDictionary dictionaryWithDictionary:properties];
        NSString *scene = [self fetchScene:url];
        NSString *action = [self fetchAction:errorCode scene:scene];
        NSString *method = [self fetchMethod:body];
        
        if ([url containsString:@"v1/passport/captcha/send"] || [url containsString:@"v1/passport/captcha/send_auth"]) {
            NSString *purpose = body[@"purpose"];
            if ([purpose isEqualToString:@"login"]) {
                method = @"captchacode";
            } else {
                return NO;
            }
        }
        
        if ([NSString rx_isNullToString:scene].length > 0) {
            [mutProperties setValue:scene forKey:@"scene"];
        }
        if ([NSString rx_isNullToString:action].length > 0) {
            [mutProperties setValue:action forKey:@"action"];
        }
        if ([scene isEqualToString:@"login"] && [NSString rx_isNullToString:method].length > 0) {
            [mutProperties setValue:method forKey:@"method"];
        }
        if (errorCode != 0) {
            if ([header isKindOfClass:[NSDictionary class]] && header.allKeys.count > 0) {
                [mutProperties setValue:header forKey:@"request_header"];
            }
            if ([body isKindOfClass:[NSDictionary class]] && body.allKeys.count > 0) {
                [mutProperties setValue:body forKey:@"request_body"];
            }
            if ([NSString rx_isNullToString:url].length > 0) {
                [mutProperties setValue:url forKey:@"url"];
            }
            if ([NSString rx_isNullToString:errorMsg].length > 0) {
                [mutProperties setValue:errorMsg forKey:@"error_msg"];
            }
            [mutProperties setValue:@(errorCode) forKey:@"error_code"];
        }
        
        [self addUserActionWithEvent:@"#rx_user_action" distinctId:@"" properties:mutProperties];
        
        return YES;
    } @catch (NSException *exception) {
        NSLog(@"log catch");
    } @finally {
        
    }
}

/**
 * 数据埋点（批量上报）
 * @param event 埋点标识
 * @param distinctId 用户唯一标识，传空默认为openID
 * @param properties 自定义属性
 */
- (BOOL)addUserActionWithEvent:(NSString *)event
                    distinctId:(NSString * _Nullable)distinctId
                    properties:(NSDictionary * _Nullable)properties
{
    @try {
        [self initConfig];
        
        if ([RXUserUtility boolForKey:keyUserData_userActionLog_stop] || !self.needReport || [self compareTime]) {
            return YES;
        }
        
        // 在子线程处理数据逻辑
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSInteger nowTimestamp = [RXCommonTool getTimestamp] / 1000;
            // 保存首条记录时间
            NSInteger firstTimestamp = [[RXUserUtility valueForKey:keyUserData_userActionLog_firstTime] integerValue];
            if (firstTimestamp > 0) {
                
            } else {
                [RXUserUtility setValue:@(nowTimestamp) ForKey:keyUserData_userActionLog_firstTime];
            }
            
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:@"track" forKey:@"type"];
            [dic setValue:[RXCommonTool getTimeForStr] forKey:@"time"];
            
            [dic setValue:@([RXCommonTool getTimestamp]) forKey:@"timestamp"];
            
            if (distinctId && distinctId.length > 0) {
                [dic setValue:distinctId forKey:@"distinct_id"];
            } else {
                [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"distinct_id"];
            }
            
            NSString *cpid = [RXUserUtility valueForKey:keyUserData_cpId];
            NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
            NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
            
            if ([NSString rx_isNullToString:cpid].length <= 0) {
//                NSLog(@"日志上报错误\n\n\n\n\n cpid错误 \n\n\n\n\n");
                return;
            }
            if ([NSString rx_isNullToString:productId].length <= 0) {
//                NSLog(@"日志上报错误\n\n\n\n\n 请先初始化 \n\n\n\n\n");
                return;
            }
            if ([NSString rx_isNullToString:channelId].length <= 0) {
//                NSLog(@"日志上报错误\n\n\n\n\n 请先初始化 \n\n\n\n\n");
                return;
            }
            if ([NSString rx_isNullToString:event].length <= 0) {
//                NSLog(@"日志上报错误\n\n\n 缺少event \n\n\n");
                return;
            }
            
            [dic setValue:event forKey:@"event"];
            [dic setValue:[RXCommonTool uuid] forKey:@"uuid"];
            [dic setValue:@([cpid integerValue]) forKey:@"cpid"];
            [dic setValue:productId forKey:@"product_id"];
            [dic setValue:channelId forKey:@"channel_id"];
            [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
            [dic setValue:@(2) forKey:@"platform_id"];
            [dic setValue:[DeviceKey getDeviceIDInKeychain] forKey:@"devicecode"];
            
            NSMutableDictionary *mutProperties = [NSMutableDictionary dictionaryWithDictionary:properties];
            
            [mutProperties setValue:sdkVersion forKey:@"sdk_version"];
            [mutProperties setValue:[CHCid getCSystemVersion] forKey:@"system_version"];
            
            NSMutableDictionary *appInfoDic = [self getAppInfo];
            if (appInfoDic && appInfoDic.allKeys.count > 0) {
                [mutProperties setValue:appInfoDic forKey:@"rx_app_info"];
            }
            
            NSString *cpRegionTag = [RXUserUtility sharedManager].cpRegionTag;
            if ([NSString rx_isNullToString:cpRegionTag].length > 0) {
                [mutProperties setValue:cpRegionTag forKey:@"rx_region_tag"];
            }
            
            NSString *cpRoleId = [RXUserUtility sharedManager].cpRoleId;
            if ([NSString rx_isNullToString:cpRoleId].length > 0) {
                [mutProperties setValue:cpRoleId forKey:@"#role_id"];
            }
            
            // 根据事件过滤公共属性
            // 设置公共属性
            NSMutableDictionary *public = [self fetchPublicPropertiesWithEvent:event];
            if (public && public.allKeys.count > 0) {
                for (int i = 0; i < mutProperties.allKeys.count; i++) {
                    [public setValue:[mutProperties valueForKey:mutProperties.allKeys[i]] forKey:mutProperties.allKeys[i]];
                }
                [dic setValue:public forKey:@"properties"];
            } else {
                [dic setValue:mutProperties forKey:@"properties"];
            }
            
            if (self.isRequesting) {
                [self.logLocalArr addObject:dic];
            } else {
                for (int i = 0; i < self.logLocalArr.count; i++) {
                    [RXCommonTool addUserActionLogObj:self.logLocalArr[i]];
                }
                [self.logLocalArr removeAllObjects];
                [RXCommonTool addUserActionLogObj:dic];
            }
            
            NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
            if (logArr.count >= self.maxCount) {
                [self reportLogRequestWithLogArr:logArr];
            }
        });
        
        return YES;
    } @catch (NSException *exception) {
        NSLog(@"log catch");
    } @finally {
        
    }
}

- (NSString *)fetchScene:(NSString *)url
{
    NSString *scene = @"";
    
    if ([url containsString:@"v1/sdkconfig/init"]) {
        scene = @"init";
    } else if ([url containsString:@"v1/vcapi/update"]) {
        scene = @"version_check";
    } else if ([url containsString:@"v1/passport/account/login_by_token"] || [url containsString:@"v1/passport/account/login_by_credential"] || [url containsString:@"v1/passport/captcha/send"] || [url containsString:@"v1/passport/captcha/send_auth"]) {
        scene = @"login";
    } else if ([url containsString:@"v1/passport/user/realauth"]) {
        scene = @"realauth";
    }
    
    return scene;
}

- (NSString *)fetchMethod:(NSDictionary *)requestBody
{
    NSString *method = @"";
    
    if ([requestBody isKindOfClass:[NSDictionary class]] && requestBody.allKeys.count > 0 && [requestBody valueForKey:@"method"]) {
        method = [requestBody valueForKey:@"method"];
    }
    
    return method;
}

- (NSString *)fetchAction:(NSInteger)code
                    scene:(NSString *)scene
{
    NSString *action = @"";
    
    if ([scene isEqualToString:@"init"] ||
        [scene isEqualToString:@"version_check"] ||
        [scene isEqualToString:@"realauth"]) {
        if (code == 0) {
            action = @"success";
        } else {
            action = @"fail";
        }
    } else if ([scene isEqualToString:@"login"]) {
        if (code == 0) {
            action = @"login_success";
        } else {
            action = @"login_fail";
        }
    }
    
    return action;
}

#pragma mark -- <request>
- (void)reportLogRequestWithLogArr:(NSMutableArray *)logArr
{
    if (!self.needReport) {
        return;
    }
    
    @try {
        self.isRequesting = YES;
        
        // 在子线程处理数据压缩等耗时操作
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSError *parseError = nil;
            
            if ([logArr isKindOfClass:[NSArray class]] && logArr.count > 0) {
                __block NSMutableArray *processedLogArr = [self keepLastItems:logArr maxCount:10];
                
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:processedLogArr options:NSJSONWritingPrettyPrinted  error:&parseError];
                NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
                NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&parseError];
                NSData *contactData = [NSJSONSerialization dataWithJSONObject:jsonDic options:NSJSONWritingPrettyPrinted error:nil];
                
                // 回到主线程发起网络请求
                dispatch_async(dispatch_get_main_queue(), ^{
                    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
                    request.isGzip = YES;
                    request.gzipParam = [contactData gzippedData];
                    request.baseUrl = [RXConfig sharedManager].apiDomain;
                    
                    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
                    [header setValue:[NSString stringWithFormat:@"%d", (int)processedLogArr.count] forKey:@"ruixue-datacount"];
                    [header setValue:@"gzip" forKey:@"content-encoding"];
                    request.headParams = header;
                    
                    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                        NSLog(@"用户行为上报成功:\n %@", responseObject);
                        self.isRequesting = NO;
                        [RXCommonTool deleteUserActionLogArr];
                    } failure:^(RX_CommonRequestError * _Nullable error) {
                        self.isRequesting = NO;
                        NSLog(@"用户行为上报成功:\n %@", error.error);
                    }];
                });
            }
        });
    } @catch (NSException *exception) {
        NSLog(@"log catch");
    } @finally {
        
    }
}

/**
 * 获取distinctId
 */
- (NSString *)getDistinctId
{
    return [RXUserUtility valueForKey:keyUserData_adjust_distinct_id];
}

/**
 * 设置公共属性
 * 设置后由SDK填入自定义属性中进行上报，设置后SDK进行缓存，多次设置则会覆盖
 * @properties 公共属性
 */
- (void)setPublicProperties:(NSDictionary *)properties
{
    [RXUserUtility setValue:properties ForKey:keyUserData_publicProperties];
}

/**
 * 修改公共属性
 * 修改的属性会将原有属性覆盖，未设置的属性则会补入缓存中
 * @properties 公共属性
 */
- (void)updatePublicProperties:(NSDictionary *)properties
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
    
    for (int i = 0; i < properties.allKeys.count; i++) {
        [dic setValue:[properties valueForKey:properties.allKeys[i]] forKey:properties.allKeys[i]];
    }
    
    [RXUserUtility setValue:dic ForKey:keyUserData_publicProperties];
}

/**
 * 删除公共属性
 * 删除缓存的某个公共属性
 * @properties 公共属性key
 */
- (void)deletePublicProperties:(NSArray *)properties
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
    
    for (int i = 0; i < properties.count; i++) {
        [dic removeObjectForKey:properties[i]];
    }
    
    [RXUserUtility setValue:dic ForKey:keyUserData_publicProperties];
}

#pragma mark -- <timer>
- (void)addMTimer
{
    if (!_timer) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    } else {
        [self closeTime];
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    }
}

- (void)timerAction
{
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_userActionLog];
    if (logArr.count > 0) {
        [self reportLogRequestWithLogArr:logArr];
    }
}

- (void)closeTime
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

/**
 * 过滤公共属性
 */
- (NSMutableDictionary *)fetchPublicPropertiesWithEvent:(NSString *)event
{
    // 取出本地缓存的公共属性列表
    NSMutableDictionary *publicPropertiesDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicData]];
    // 过滤后的公共属性
    NSMutableDictionary *fetchPublicProperties = [NSMutableDictionary dictionary];
    
    NSMutableArray *properties = [NSMutableArray array];
    for (int i = 0; i < publicPropertiesDic.allKeys.count; i++) {
        NSString *key = publicPropertiesDic.allKeys[i];
        NSArray *value = publicPropertiesDic.allValues[i];
        
        // 找到相同事件
        if ([event isEqualToString:key]) {
            // 取出该事件对应的公共属性
            properties = [NSMutableArray arrayWithArray:value];
            break;
        }
    }
    
    // 对属性进行过滤
    NSMutableDictionary *public = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
    for (int i = 0; i < public.allKeys.count; i++) {
        NSString *key = public.allKeys[i];
        NSArray *value = public.allValues[i];
        
        for (int j = 0; j < properties.count; j++) {
            NSString *property = properties[j];
            
            // 将客户端设置的公共属性和服务端获取的对比，没有的过滤掉
            if ([property isEqualToString:key]) {
                [fetchPublicProperties setValue:value forKey:key];
            }
        }
    }
    
    return fetchPublicProperties;
}

- (NSMutableArray *)keepLastItems:(NSMutableArray *)array maxCount:(NSInteger)maxCount
{
    NSMutableArray *fetchArr = [NSMutableArray arrayWithArray:array];
    if (fetchArr.count > maxCount) {
        NSRange range = NSMakeRange(0, fetchArr.count - maxCount);
        [fetchArr removeObjectsInRange:range];
    }
    
    return fetchArr;
}

- (NSMutableDictionary *)getAppInfo
{
    // app 版本号
    NSString *appVersion = [RXCommonTool getAppVersion];
    NSMutableDictionary *appInfoDic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:appVersion].length > 0) {
        [appInfoDic setValue:appVersion forKey:@"version"];
    }
    
    return appInfoDic;
}

@end
