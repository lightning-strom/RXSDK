//
//  RXUWAService.m
//  RXSDK-Pure
//
//  Created by root11 on 2024/8/27.
//

#import "RXUWAService.h"
#import <UIKit/UIKit.h>
#import <objc/message.h>
#import "RXLogService.h"
#import "RXCommonHeader.h"
#import "RXApiService.h"

@interface RXUWAService ()

@property (nonatomic, assign) NSInteger reportTime;
@property (nonatomic, strong) NSTimer *timer;

@end

@implementation RXUWAService

static RXUWAService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXUWAService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

/**
 * GPM性能指标上报
 * SDK会根据配置定期上报,上报间隔（秒），默认60s
 */
- (void)configWithReportTime
{
    NSString *sdk_ts = [RXUserUtility valueForKey:keyUserData_sdk_ts];
    self.reportTime = [sdk_ts integerValue];
    if (self.reportTime == 0) {
        return;
    }
    
    /*上报时间间隔不为0，且类型为both或sdk时启动gpm sdk定时器；
    因为uwa类型的指标收集与定时器均由C#代码完成，只有上传时采用iOS原生方法
     */
    NSString *gpmType = [RXUserUtility valueForKey:keyUserData_gpmType];
    if ([gpmType isEqualToString:@"both"] || [gpmType isEqualToString:@"sdk"]) {
        [self addMTimer];
    }
}

#pragma mark -- <timer>
- (void)addMTimer
{
    [self timerAction];//调用后先立即执行一次，然后再按照定时器的时间轮循执行
    if (!_timer) {
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    } else {
        [self closeTime];
        _timer = [NSTimer scheduledTimerWithTimeInterval:self.reportTime target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
    }
}

- (void)timerAction
{
    NSString *gpmType = [RXUserUtility valueForKey:keyUserData_gpmType];
    if ([gpmType isEqualToString:@"both"]) {
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aRXGPM) {
            NSLog(@"未接入RXGPMSDK");
        }else{
            [self getRXGPMDataAndUpload];//sdk上传
        }
        
#pragma mark -  UWA由C#单独判断开关并发起定时上报
        
    }else if ([gpmType isEqualToString:@"uwa"]){
#pragma mark -  UWA由C#单独判断开关并发起定时上报
        
    }else if ([gpmType isEqualToString:@"sdk"]){
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aRXGPM) {
            NSLog(@"未接入RXGPMSDK");
        }else{
            [self getRXGPMDataAndUpload];
        }
    }
}

- (void)closeTime
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

#pragma mark - RXGPMSDK
- (void)getRXGPMDataAndUpload
{
    // 创建block
    void (^completionBlock)(NSDictionary *) = ^(NSDictionary *propertiesDict) {
        NSString *deviceCode = [[RXApiService sharedSDK] getDeviceCode];
        NSMutableDictionary *mDic = [NSMutableDictionary dictionaryWithDictionary:propertiesDict];
        [mDic setValue:deviceCode forKey:@"DEVICE_ID"];//DEVICE_ID采用主库中方法获取值，不通过sdk获取
        
        NSMutableDictionary *gpmPropertiesDic = [self configUserPropertyOrGpmWithInfo:mDic eventType:@"gpm" platformType:@"rx"];
        [[RXLogService sharedSDK] addLogSingleWithEvent:@"#rx_gpm" distinctId:@"" properties:gpmPropertiesDic];
        
        NSMutableDictionary *userPropertiesDict = [self configUserPropertyOrGpmWithInfo:mDic eventType:@"property" platformType:@"rx"];
        [RXUserUtility sharedManager].sdkPropertyDic = userPropertiesDict;
    };
    
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
    [notiDic setValue:completionBlock forKey:@"callback"];
    [RXNotificationCenter postNoti:rxUserDefault_rx_gpm object:nil userInfo:notiDic];
}

#pragma mark - UWA SDK
/**
 * Unity获取UWA上传类型与上传间隔
 */
- (void)getTypeAndTsWithBlock:(IOSOnPerformanceCallback)callBack{
    NSString *gpmType = @"";
    if ([NSString rx_isNullToString:[RXUserUtility valueForKey:keyUserData_gpmType]].length > 0) {
        gpmType = [RXUserUtility valueForKey:keyUserData_gpmType];
    }
    
    NSString *uwa_ts = @"";
    if ([NSString rx_isNullToString:[RXUserUtility valueForKey:keyUserData_uwa_ts]].length > 0) {
        uwa_ts = [RXUserUtility valueForKey:keyUserData_uwa_ts];
    }
    
    NSString *dataStr = [NSString stringWithFormat:@"%@**%@", gpmType, uwa_ts];
    if (callBack) {
        callBack(dataStr);
    }
}

/**
 * 上传Unity UWA信息，用于Unity调用此方法上传新能指标
 */
- (void)uploadUWAInfo:(NSString *)infoString{
    NSDictionary *properties = [self jsonToObject_pure:infoString];
    NSMutableDictionary *uwaProperties = [self configUserPropertyOrGpmWithInfo:properties eventType:@"gpm" platformType:@"uwa"];
    [[RXLogService sharedSDK] addLogSingleWithEvent:@"#uwa_gpm" distinctId:@"" properties:uwaProperties];
    
    NSMutableDictionary *userPropertyDic = [self configUserPropertyOrGpmWithInfo:properties eventType:@"property" platformType:@"uwa"];
    [RXUserUtility sharedManager].uwaPropertyDic = userPropertyDic;
}

#pragma mark - json
// JSON串解析为NSArray、NSDictionary
- (id)jsonToObject_pure:(NSString *)json
{
    // string转data
    NSData *jsonData = [json dataUsingEncoding:NSUTF8StringEncoding];
    // JSON解析
    id obj = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
    return obj;
}

#pragma mark - 根据传入的字典区分属于用户属性或者是性能指标
/**
 * 根据传入的字典区分属于用户属性或者是性能指标，并根据平台类型区分返回哪些值
 * properties 属性
 * eventType gpm 性能指标  property 用户属性
 * platformType uwa uwa平台 rx 瑞雪平台
 */
- (NSMutableDictionary *)configUserPropertyOrGpmWithInfo:(NSDictionary *)properties eventType:(NSString *)eventType platformType:(NSString *)platformType{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    
    if (properties == nil) {
        return dict;
    }
    
    if ([eventType isEqualToString:@"gpm"]) {
        
        [dict setValue:properties[@"gpm_fps"] forKey:@"gpm_fps"];
        [dict setValue:properties[@"gpm_jank"] forKey:@"gpm_jank"];
        [dict setValue:properties[@"gpm_process_memory_mb"] forKey:@"gpm_process_memory_mb"];
        [dict setValue:properties[@"gpm_battery_level"] forKey:@"gpm_battery_level"];
        [dict setValue:properties[@"gpm_battery_capacity"] forKey:@"gpm_battery_capacity"];
        [dict setValue:properties[@"gpm_power"] forKey:@"gpm_power"];
        [dict setValue:properties[@"gpm_current"] forKey:@"gpm_current"];
        [dict setValue:properties[@"gpm_battery_temp"] forKey:@"gpm_battery_temp"];
        [dict setValue:properties[@"gpm_cpu_temp"] forKey:@"gpm_cpu_temp"];
        [dict setValue:properties[@"gpm_gpu_temp"] forKey:@"gpm_gpu_temp"];
        [dict setValue:properties[@"gpm_cpu_usage"] forKey:@"gpm_cpu_usage"];
        
    }else if ([eventType isEqualToString:@"property"]) {
        if ([platformType isEqualToString:@"uwa"]){//uwa则包含DEVICE_ID属性
            if ([NSString rx_isNullToString:properties[@"DEVICE_ID"]].length <= 0) {
                [dict setValue:@"" forKey:@"DEVICE_ID"];
            }else{
                [dict setValue:properties[@"DEVICE_ID"] forKey:@"DEVICE_ID"];
            }
        }
        if ([platformType isEqualToString:@"rx"]){//rx则包含DEVICE_MODEL、SYSTEM属性
            [dict setValue:properties[@"DEVICE_MODEL"] forKey:@"DEVICE_MODEL"];
            [dict setValue:properties[@"SYSTEM"] forKey:@"SYSTEM"];
        }
        
        if ([NSString rx_isNullToString:properties[@"RESOLUTION"]].length <= 0) {
            [dict setValue:@"" forKey:@"RESOLUTION"];
        }else{
            [dict setValue:properties[@"RESOLUTION"] forKey:@"RESOLUTION"];
        }
        if ([NSString rx_isNullToString:properties[@"GRAPHIC_API"]].length <= 0) {
            [dict setValue:@"" forKey:@"GRAPHIC_API"];
        }else{
            [dict setValue:properties[@"GRAPHIC_API"] forKey:@"GRAPHIC_API"];
        }
        
        [dict setValue:properties[@"EMULATOR"] forKey:@"EMULATOR"];
        [dict setValue:properties[@"ROOT"] forKey:@"ROOT"];
        [dict setValue:properties[@"CPU_CORE"] forKey:@"CPU_CORE"];
        
        if ([NSString rx_isNullToString:properties[@"GPU_MODEL"]].length <= 0) {
            [dict setValue:@"" forKey:@"GPU_MODEL"];
        }else{
            [dict setValue:properties[@"GPU_MODEL"] forKey:@"GPU_MODEL"];
        }
        
        [dict setValue:properties[@"RAM_MB"] forKey:@"RAM_MB"];
        [dict setValue:properties[@"ROM_GB"] forKey:@"ROM_GB"];
        
    }
    
    return dict;
}

//获取uwa上报的用户属性的不同，并同步到本地
- (NSDictionary *)getUwaInfoCompareWithDict:(NSDictionary *)dict{
    NSString *uwaKey = [NSString stringWithFormat:@"uwa_%@", [[RXService sharedSDK] getOpenID]];
    NSMutableDictionary *uwaUserProperty = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:uwaKey]];
    
    NSMutableDictionary *differentPairs = [NSMutableDictionary dictionary];
    for (NSString *key in [dict allKeys]) {
        if ([[uwaUserProperty allKeys] containsObject:key]) {
            id value1 = uwaUserProperty[key];
            if (![uwaUserProperty[key] isKindOfClass:[NSString class]]) {
                value1 = [uwaUserProperty[key] stringValue];
            }
            id value2 = dict[key];
            if (![dict[key] isKindOfClass:[NSString class]]) {
                value2 = [dict[key] stringValue];
            }
            if (![value1 isEqualToString:value2]) {
                [differentPairs setObject:dict[key] forKey:key];
                [uwaUserProperty setObject:dict[key] forKey:key];
                [RXUserUtility setValue:uwaUserProperty ForKey:uwaKey];
            }
        }else{
            [differentPairs setObject:dict[key] forKey:key];
            [uwaUserProperty setObject:dict[key] forKey:key];
            [RXUserUtility setValue:uwaUserProperty ForKey:uwaKey];
        }
    }
    return differentPairs;
}

//获取sdk上报的属性的不同，并同步到本地
- (NSDictionary *)getSDKInfoCompareWithDict:(NSDictionary *)dict{
    NSString *sdkKey = [NSString stringWithFormat:@"sdk_%@", [[RXService sharedSDK] getOpenID]];
    NSMutableDictionary *sdkUserProperty = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:sdkKey]];
    
    NSMutableDictionary *differentPairs = [NSMutableDictionary dictionary];
    for (NSString *key in [dict allKeys]) {
        if ([[sdkUserProperty allKeys] containsObject:key]) {
            id value1 = sdkUserProperty[key];
            if (![sdkUserProperty[key] isKindOfClass:[NSString class]]) {
                value1 = [sdkUserProperty[key] stringValue];
            }
            id value2 = dict[key];
            if (![dict[key] isKindOfClass:[NSString class]]) {
                value2 = [dict[key] stringValue];
            }
            if (![value1 isEqualToString:value2]) {
                [differentPairs setObject:dict[key] forKey:key];
                [sdkUserProperty setObject:dict[key] forKey:key];
                [RXUserUtility setValue:sdkUserProperty ForKey:sdkKey];
            }
        }else{
            [differentPairs setObject:dict[key] forKey:key];
            [sdkUserProperty setObject:dict[key] forKey:key];
            [RXUserUtility setValue:sdkUserProperty ForKey:sdkKey];
        }
    }
    return differentPairs;
}

@end
