//
//  RXLogService.m
//  RXSDK
//
//  Created by 陈汉 on 2022/3/1.
//

#import "RXLogService.h"
#import "RXCommonHeader.h"
#import "RX_CommonNetworkExcuteManager.h"
#import "DeviceKey.h"
#import "NSData+GZIP.h"
#import "CHCid.h"
#import <objc/message.h>

@interface RXLogService ()

@property (nonatomic, assign) NSInteger reportTime;
@property (nonatomic, assign) NSInteger maxCount;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) NSMutableArray *logLocalArr; // 数据备份
@property (nonatomic, assign) BOOL isRequesting;
@property (nonatomic, assign) BOOL env;
//上报标识，接入UWA时使用，-1为重置，不上报；1 addLogWithEvent批量上报；2 addLogSingleWithEvent逐条上报；3 addLogSingleFirstLoginWithEvent首次登录事件上报；
@property (nonatomic, assign) NSInteger reportFunctionFlag;
//上报数据，接入UWA时使用
@property (nonatomic, strong) NSMutableDictionary *reportFunctionDic;
@property (nonatomic, copy) RequestComplete singleComplete;

@end

@implementation RXLogService

static RXLogService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXLogService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reportWithUwaInfo:) name:@"reportWithUwaInfo" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didEnterBackground:) name: UIApplicationDidEnterBackgroundNotification object:nil];
        self.logLocalArr = [NSMutableArray array];
        
        [self configWithReportTime:-1 maxCount:-1];
    }
    return self;
}

- (void)didEnterBackground:(NSNotification *)noti
{
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_logArr];
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
 * 埋点配置
 * 添加埋点后SDK会根据配置定期上报
 * @param reportTime 上报间隔（秒），-1 为默认值 [默认60s]
 * @param maxCount 最大缓存数--达到最大缓存数量触发上报条件（例：传100 缓存数据量达到100时触发上报），默认100条
 */
- (void)trackConfigWithReportTime:(NSInteger)reportTime
                         maxCount:(NSInteger)maxCount
{
    [self configWithReportTime:reportTime maxCount:maxCount];
}

/**
 * 是否为测试数据，YES 为测试数据，NO 为正式数据，默认 NO
 */
- (void)setTrackEnv:(BOOL)env
{
    self.env = env;
}

/**
 * 数据埋点（批量上报）
 * @note 需要在初始化后调用
 * @param event 埋点标识
 * @param distinctId 用户唯一标识
 * ！！注：登录后SDK会将openID保存，distinctId传空默认为openID。首次登录前需先调用getDistinctId获取distinctId作为标识。
 * ！！登录前的埋点行为可先调用[[RXService sharedSDK] getOpenID];查看本地是否存有openID，如果没有则调用getDistinctId获取distinctId作为标识。避免丢失埋点事件！！
 * @param properties 自定义属性
 */
- (BOOL)dataTrackWithEvent:(NSString *)event
                distinctId:(NSString * _Nullable)distinctId
                properties:(NSDictionary * _Nullable)properties
{
    return [self addLogWithEvent:event distinctId:distinctId properties:properties];
}

/**
 * 数据埋点（批量上报）
 * @param event 埋点标识
 * @param distinctId 用户唯一标识，传空默认为openID
 * @param properties 自定义属性
 */
- (BOOL)addLogWithEvent:(NSString *)event
             distinctId:(NSString * _Nullable)distinctId
             properties:(NSDictionary * _Nullable)properties
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@"track" forKey:@"type"];
        [dic setValue:[RXCommonTool getTimeForStr] forKey:@"time"];
        
        if (distinctId && distinctId.length > 0) {
            [dic setValue:distinctId forKey:@"distinct_id"];
        } else {
            [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"distinct_id"];
        }
        
        NSString *cpid = [RXUserUtility valueForKey:keyUserData_cpId];
        NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
        NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
        
        if (![RXUserUtility sharedManager].isInit) {
//            NSLog(@"日志上报错误\n\n\n\n\n 请先初始化 \n\n\n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:cpid].length <= 0) {
//            NSLog(@"日志上报错误\n\n\n\n\n cpid错误 \n\n\n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:productId].length <= 0) {
//            NSLog(@"日志上报错误\n\n\n\n\n 请先初始化 \n\n\n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:channelId].length <= 0) {
//            NSLog(@"日志上报错误\n\n\n\n\n 请先初始化 \n\n\n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:event].length <= 0) {
//            NSLog(@"日志上报错误\n\n\n 缺少event \n\n\n");
            return NO;
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

        if (self.env) {
            [mutProperties setValue:@"#env" forKey:@"1"];
        }
        
        [mutProperties setValue:sdkVersion forKey:@"sdk_version"];
        [mutProperties setValue:[CHCid getCSystemVersion] forKey:@"system_version"];
        
        NSString *stOffset = [RXUserUtility sharedManager].stOffset;
        if ([NSString rx_isNullToString:stOffset].length > 0) {
            [mutProperties setValue:stOffset forKey:@"st_offset"];
        }
        
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
    //    NSMutableDictionary *public = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
        NSMutableDictionary *public = [self fetchPublicPropertiesWithEvent:event];
        if (public && public.allKeys.count > 0) {
            for (int i = 0; i < mutProperties.allKeys.count; i++) {
                [public setValue:[mutProperties valueForKey:mutProperties.allKeys[i]] forKey:mutProperties.allKeys[i]];
            }
            [dic setValue:public forKey:@"properties"];
        } else {
            [dic setValue:mutProperties forKey:@"properties"];
        }
        
        if ([RXSubPackage sharedSDK].aUWA) {
            /*
            此处通过runtime+C#回调方法，调用C#中UWA即时获取性能数据，在reportWithUwaInfo:方法中得到数据并进行上报，因此后续如要修改上报的逻辑，需注意reportWithUwaInfo:方法中也存在埋点上报逻辑
            */
            if (![event isEqualToString:@"#rx_gpm"] && ![event isEqualToString:@"#uwa_gpm"]){
                self.reportFunctionFlag = 1;
                self.reportFunctionDic = dic;
                
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_uwa_gpm object:nil userInfo:notiDic];
                return YES;
            }
        }else{
            NSLog(@"未接入UWASDK");
        }
        
        if (self.isRequesting) {
            [self.logLocalArr addObject:dic];
        } else {
            for (int i = 0; i < self.logLocalArr.count; i++) {
                [RXCommonTool addLogObj:self.logLocalArr[i]];
            }
            [self.logLocalArr removeAllObjects];
            [RXCommonTool addLogObj:dic];
        }
        
        NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_logArr];
        if (logArr.count >= self.maxCount) {
            [self reportLogRequestWithLogArr:logArr];
        }
        
        return YES;
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

/**
 * 数据埋点（逐条上报）有回调
 * @param event 埋点标识
 * @param distinctId 用户唯一标识，传空默认为openID
 * @param properties 自定义属性
 */
- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties
                     complete:(RequestComplete)complete
{
    self.singleComplete = complete;
    [self addLogSingleWithEvent:event distinctId:distinctId properties:properties];
    
    return YES;
}

/**
 * 数据埋点（逐条上报）
 * @param event 埋点标识
 * @param distinctId 用户唯一标识，传空默认为openID
 * @param properties 自定义属性
 */
- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@"track" forKey:@"type"];
        [dic setValue:[RXCommonTool getTimeForStr] forKey:@"time"];
        
        if (distinctId && distinctId.length > 0) {
            [dic setValue:distinctId forKey:@"distinct_id"];
        } else {
            [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"distinct_id"];
        }
            
        NSString *cpid = [RXUserUtility valueForKey:keyUserData_cpId];
        NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
        NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
        
        if (![RXUserUtility sharedManager].isInit) {
            NSLog(@"日志上报错误\n\n\n 请先初始化 \n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:cpid].length <= 0) {
            NSLog(@"日志上报错误\n\n\n cpid错误 \n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:productId].length <= 0) {
            NSLog(@"日志上报错误\n\n\n 请先初始化 \n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:channelId].length <= 0) {
            NSLog(@"日志上报错误\n\n\n 请先初始化 \n\n\n");
            return NO;
        }
        if ([NSString rx_isNullToString:event].length <= 0) {
            NSLog(@"日志上报错误\n\n\n 缺少event \n\n\n");
            return NO;
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

        if (self.env) {
            [mutProperties setValue:@"#env" forKey:@"1"];
        }
        
        [mutProperties setValue:sdkVersion forKey:@"sdk_version"];
        [mutProperties setValue:[CHCid getCSystemVersion] forKey:@"system_version"];
        
        NSString *stOffset2 = [RXUserUtility sharedManager].stOffset;
        if ([NSString rx_isNullToString:stOffset2].length > 0) {
            [mutProperties setValue:stOffset2 forKey:@"st_offset"];
        }
        
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
           
        // 设置公共属性
    //    NSMutableDictionary *public = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
        NSMutableDictionary *public = [self fetchPublicPropertiesWithEvent:event];
        if (public && public.allKeys.count > 0 && ![event containsString:@"#rxsdk_"]) {
            for (int i = 0; i < mutProperties.allKeys.count; i++) {
                [public setValue:[mutProperties valueForKey:mutProperties.allKeys[i]] forKey:mutProperties.allKeys[i]];
            }
            [dic setValue:public forKey:@"properties"];
        } else {
            [dic setValue:mutProperties forKey:@"properties"];
        }
        
        if ([RXSubPackage sharedSDK].aUWA) {
            /*
            此处通过runtime+C#回调方法，调用C#中UWA即时获取性能数据，在reportWithUwaInfo:方法中得到数据并进行上报，因此后续如要修改上报的逻辑，需注意reportWithUwaInfo:方法中也存在埋点上报逻辑
            */
            if (![event isEqualToString:@"#rx_gpm"] && ![event isEqualToString:@"#uwa_gpm"]){
                self.reportFunctionFlag = 2;
                self.reportFunctionDic = dic;
                
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [RXNotificationCenter postNoti:rxUserDefault_uwa_gpm object:nil userInfo:notiDic];
                return YES;
            }
        }else{
            NSLog(@"未接入UWASDK");
        }

        NSError *parseError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[dic] options:NSJSONWritingPrettyPrinted  error:&parseError];
        NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                options:NSJSONReadingMutableContainers
                                                                  error:&parseError];
        
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
    //    request.isGzip = YES;
    //    request.gzipParam = param;
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        
        NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
        [header setValue:@"1" forKey:@"ruixue-datacount"];
        request.headParams = header;
        
    //    NSLog(@"上报数据:\n %@", dic);
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"上报成功:\n %@", responseObject);
            if (self.singleComplete) {
                self.singleComplete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"上报失败:\n %@", error.error);
            if (self.singleComplete) {
                self.singleComplete(nil, error);
            }
        }];
        
        return YES;
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

/**
 * 数据埋点（逐条上报）
 * @note 需要在初始化后调用，首次登录事件上报
 * @param event 埋点标识
 * @param distinctId 用户唯一标识，传空默认为openID
 * @param properties 自定义属性
 */
- (BOOL)addLogSingleFirstLoginWithEvent:(NSString *)event
                             distinctId:(NSString * _Nullable)distinctId
                             properties:(NSMutableDictionary * _Nullable)properties
{
    @try {
        NSMutableDictionary *logInfo = [RXUserUtility valueForKey:keyUserData_localLogInfo];
        BOOL of = [logInfo[@"lp"] boolValue];
        
        NSString *uuid = [RXUserUtility valueForKey:keyUserData_distinct_id];
        if ([NSString rx_isNullToString:uuid].length <= 0) {
            NSLog(@"登录路径上报过，不再重复上报");
            return NO;
        }
        
        if (of && ![RXUserUtility valueForKey:keyUserData_isFirstReportLoginLog]) {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:@"track" forKey:@"type"];
            [dic setValue:[RXCommonTool getTimeForStr] forKey:@"time"];
            
            if (distinctId && distinctId.length > 0) {
                [dic setValue:distinctId forKey:@"distinct_id"];
            } else {
                [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"distinct_id"];
            }
                
            NSString *cpid = [RXUserUtility valueForKey:keyUserData_cpId];
            NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
            NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
            
            if ([NSString rx_isNullToString:cpid].length <= 0) {
                NSLog(@"日志上报错误\n\n\n cpid错误 \n\n\n");
                return NO;
            }
            if ([NSString rx_isNullToString:productId].length <= 0) {
                NSLog(@"日志上报错误\n\n\n 请先初始化 \n\n\n");
                return NO;
            }
            if ([NSString rx_isNullToString:channelId].length <= 0) {
                NSLog(@"日志上报错误\n\n\n 请先初始化 \n\n\n");
                return NO;
            }
            if ([NSString rx_isNullToString:event].length <= 0) {
                NSLog(@"日志上报错误\n\n\n 缺少event \n\n\n");
                return NO;
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

            if (self.env) {
                [mutProperties setValue:@"#env" forKey:@"1"];
            }
            
            [mutProperties setValue:[RXUserUtility valueForKey:keyUserData_adjust_distinct_id] forKey:@"client_distinct_id"];
            
            [mutProperties setValue:sdkVersion forKey:@"sdk_version"];
            [mutProperties setValue:[CHCid getCSystemVersion] forKey:@"system_version"];
            
            NSString *stOffset3 = [RXUserUtility sharedManager].stOffset;
            if ([NSString rx_isNullToString:stOffset3].length > 0) {
                [mutProperties setValue:stOffset3 forKey:@"st_offset"];
            }
            
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
            
            // 设置公共属性
        //    NSMutableDictionary *public = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_publicProperties]];
            NSMutableDictionary *public = [self fetchPublicPropertiesWithEvent:event];
            if (public && public.allKeys.count > 0 && ![event containsString:@"#rxsdk_"]) {
                for (int i = 0; i < mutProperties.allKeys.count; i++) {
                    [public setValue:[mutProperties valueForKey:mutProperties.allKeys[i]] forKey:mutProperties.allKeys[i]];
                }
                [dic setValue:public forKey:@"properties"];
            } else {
                [dic setValue:mutProperties forKey:@"properties"];
            }
            
            if ([RXSubPackage sharedSDK].aUWA) {
                /*
                此处通过runtime+C#回调方法，调用C#中UWA即时获取性能数据，在reportWithUwaInfo:方法中得到数据并进行上报，因此后续如要修改上报的逻辑，需注意reportWithUwaInfo:方法中也存在埋点上报逻辑
                */
                if (![event isEqualToString:@"#rx_gpm"] && ![event isEqualToString:@"#uwa_gpm"]){
                    self.reportFunctionFlag = 3;
                    self.reportFunctionDic = dic;
                    
                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                    [RXNotificationCenter postNoti:rxUserDefault_uwa_gpm object:nil userInfo:notiDic];
                    return YES;
                }
            }else{
                NSLog(@"未接入UWASDK");
            }

            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[dic] options:NSJSONWritingPrettyPrinted  error:&parseError];
            NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&parseError];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
            request.whiteList = YES;
        //    request.isGzip = YES;
        //    request.gzipParam = param;
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            
            NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
            [header setValue:@"1" forKey:@"ruixue-datacount"];
            request.headParams = header;
            
    //        NSLog(@"上报数据:\n %@", dic);
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"登录路径上报成功:\n %@", responseObject);
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"登录路径上报失败:\n %@", error.error);
            }];
        }
        return YES;
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

#pragma mark -- <request>
- (void)reportLogRequestWithLogArr:(NSMutableArray *)logArr
{
    self.isRequesting = YES;
    
    NSError *parseError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:logArr options:NSJSONWritingPrettyPrinted  error:&parseError];
    NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                            options:NSJSONReadingMutableContainers
                                                              error:&parseError];
    NSData *contactData = [NSJSONSerialization dataWithJSONObject:jsonDic options:NSJSONWritingPrettyPrinted error:nil];    
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
    request.isGzip = YES;
    request.gzipParam = [contactData gzippedData];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    [header setValue:[NSString stringWithFormat:@"%d", logArr.count] forKey:@"ruixue-datacount"];
    [header setValue:@"gzip" forKey:@"content-encoding"];
    request.headParams = header;
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"埋点上报成功:\n %@", responseObject);
        self.isRequesting = NO;
        [RXCommonTool deleteLogArr];
    } failure:^(RX_CommonRequestError * _Nullable error) {
        self.isRequesting = NO;
        NSLog(@"埋点上报失败:\n %@", error.error);
    }];
}

#pragma mark - unity uwa通知返回来的性能数据，用于与事件上报一并上传
- (void)reportWithUwaInfo:(NSNotification *)noti {
    if (self.reportFunctionFlag != -1) {//增加此判断是为避免通知全局调用reportWithUwaInfo:时，分享类的上报导致此处上报被重复调用
        NSData *data = [noti.object dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *infoDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        if (infoDict != nil && infoDict.count > 0) {
            NSMutableDictionary *dict = [NSMutableDictionary dictionary];
            [dict setValue:infoDict[@"gpm_fps"] forKey:@"gpm_fps"];
            [dict setValue:infoDict[@"gpm_jank"] forKey:@"gpm_jank"];
            [dict setValue:infoDict[@"gpm_process_memory_mb"] forKey:@"gpm_process_memory_mb"];
            [dict setValue:infoDict[@"gpm_battery_level"] forKey:@"gpm_battery_level"];
            [dict setValue:infoDict[@"gpm_battery_capacity"] forKey:@"gpm_battery_capacity"];
            [dict setValue:infoDict[@"gpm_power"] forKey:@"gpm_power"];
            [dict setValue:infoDict[@"gpm_current"] forKey:@"gpm_current"];
            [dict setValue:infoDict[@"gpm_battery_temp"] forKey:@"gpm_battery_temp"];
            [dict setValue:infoDict[@"gpm_cpu_temp"] forKey:@"gpm_cpu_temp"];
            [dict setValue:infoDict[@"gpm_gpu_temp"] forKey:@"gpm_gpu_temp"];
            NSMutableDictionary *propertiesDict = [NSMutableDictionary dictionaryWithDictionary:[self.reportFunctionDic objectForKey:@"properties"]];
            [propertiesDict addEntriesFromDictionary:dict];
            self.reportFunctionDic[@"properties"] = propertiesDict;
        }
        
        if (self.reportFunctionFlag == 1) {
            if (self.isRequesting) {
                [self.logLocalArr addObject:self.reportFunctionDic];
            } else {
                for (int i = 0; i < self.logLocalArr.count; i++) {
                    [RXCommonTool addLogObj:self.logLocalArr[i]];
                }
                [self.logLocalArr removeAllObjects];
                [RXCommonTool addLogObj:self.reportFunctionDic];
            }
            
            NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_logArr];
            if (logArr.count >= self.maxCount) {
                [self reportLogRequestWithLogArr:logArr];
            }
            
        }else if (self.reportFunctionFlag == 2) {
            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[self.reportFunctionDic] options:NSJSONWritingPrettyPrinted  error:&parseError];
            NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&parseError];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
        //    request.isGzip = YES;
        //    request.gzipParam = param;
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            
            NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
            [header setValue:@"1" forKey:@"ruixue-datacount"];
            request.headParams = header;
            
        //    NSLog(@"上报数据:\n %@", dic);
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        //        NSLog(@"上报成功:\n %@", responseObject);
            } failure:^(RX_CommonRequestError * _Nullable error) {
        //        NSLog(@"上报失败:\n %@", error.error);
            }];
            
        }else if (self.reportFunctionFlag == 3) {
            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[self.reportFunctionDic] options:NSJSONWritingPrettyPrinted  error:&parseError];
            NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&parseError];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
            request.whiteList = YES;
        //    request.isGzip = YES;
        //    request.gzipParam = param;
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            
            NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
            [header setValue:@"1" forKey:@"ruixue-datacount"];
            request.headParams = header;
            
    //        NSLog(@"上报数据:\n %@", dic);
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"登录路径上报成功:\n %@", responseObject);
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"登录路径上报失败:\n %@", error.error);
            }];
            
        }
        self.reportFunctionFlag = -1;
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
    NSMutableArray *logArr = [RXUserUtility valueForKey:keyUserData_logArr];
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

/**
 * 获取日志
 * @note 记录登录和iap关键节点的日志，存在本地，默认最大 200 条，超过 200 条清空当前缓存重新记录
 */
- (NSString *)getSDKLog
{
    NSMutableArray *logArr = [RXCommonTool getLocalLog];
    NSString *jsonString = @"";
    
    if (logArr && logArr.count > 0) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:logArr options:0 error:nil];

        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    
    return jsonString;
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
