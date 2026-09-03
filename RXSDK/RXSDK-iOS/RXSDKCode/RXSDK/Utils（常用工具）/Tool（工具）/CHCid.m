//
//  CHCid.m
//  RXSDK
//
//  Created by 陈汉 on 2023/6/5.
//

#import "CHCid.h"
#import "RXCommonTool.h"
#import <CoreTelephony/CTCellularData.h>
#include <sys/sysctl.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import <sys/mount.h>
#import <sys/stat.h>
#import "NSData+Encrypt.h"

@implementation CHCid

/**
 * 设备启动时间C
 */

static time_t bootSecTime()
{
    struct timeval boottime;
    size_t len = sizeof(boottime);
    int mib[2] = { CTL_KERN, KERN_BOOTTIME };
    if( sysctl(mib, 2, &boottime, &len, NULL, 0) < 0) {
        return 0;
    }
    return boottime.tv_sec;
}
+ (NSString *)getCTimeInsec
{
    NSString *secTime = [NSString stringWithFormat:@"%ld", bootSecTime()];
    return secTime;
}

/**
 * 获取国家C
 */
+ (NSString *)getCCountryCode
{
    NSLocale *locale = [NSLocale currentLocale];
    NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];
    return countryCode;
}

/**
 * 获取语言C
 */
+ (NSString *)getCLanguage
{
    NSString *language;
    NSLocale *locale = [NSLocale currentLocale];
    if ([[NSLocale preferredLanguages] count] > 0) {
        language = [[NSLocale preferredLanguages]objectAtIndex:0];
    } else {
        language = [locale objectForKey:NSLocaleLanguageCode];
    }
    return language;
}

/**
 * 获取设备名称C
 */
+ (NSString *)getCDeviceName
{
    if ([[[UIDevice currentDevice] name] length] == 0) {
        return nil;
    }
    
    NSString *deviceName = [[UIDevice currentDevice] name];
    
    if (@available(iOS 16.0, *)) {
        NSString *deviceModel = [UIDevice currentDevice].model;
        if ([deviceModel isEqualToString:@"iPad"]) {
            deviceName = @"iPad";
        } else {
            deviceName = @"iPhone";
        }
    }
    
    NSString *md5 = [RXCommonTool md532BitlowerWithStr:deviceName];
    
    return md5;
}

/**
 * 获取系统版本C
 */
+ (NSString *)getCSystemVersion
{
    NSString *systemVersion = [[UIDevice currentDevice] systemVersion];
    return systemVersion;
}

/**
 * 获取设备 MachineC
 */
+ (NSString *)getCMachine
{
    NSString *machine = getSystemHardwareByName(SIDFAMachine);
    return machine == nil ? @"" : machine;
}
static const char *SIDFAMachine = "hw.machine";
static NSString *getSystemHardwareByName(const char *typeSpecifier) {
    size_t size;
    sysctlbyname(typeSpecifier, NULL, &size, NULL, 0);
    char *answer = malloc(size);
    sysctlbyname(typeSpecifier, answer, &size, NULL, 0); NSString *results = [NSString stringWithUTF8String:answer]; free(answer);
    return results;
}

/**
 * 获取运营商C
 */
+ (NSString* )getCCarrierInfo
{
    @try {
#if TARGET_IPHONE_SIMULATOR
        return @"SIMULATOR";
#else
    static dispatch_queue_t _queue; static dispatch_once_t once;
    dispatch_once(&once, ^{
        _queue = dispatch_queue_create([[NSString stringWithFormat:@"com.carr.%@", self] UTF8String], NULL);
    });
    __block NSString * carr = nil;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    dispatch_async(_queue, ^(){
        CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
        CTCarrier *carrier = nil;
        if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 12.1) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunguarded-availability-new"
            NSArray *carrierKeysArray = [info.serviceSubscriberCellularProviders.allKeys sortedArrayUsingSelector:@selector(compare:)];
            carrier = info.serviceSubscriberCellularProviders[carrierKeysArray.firstObject];
            if (!carrier.mobileNetworkCode) {
                carrier = info.serviceSubscriberCellularProviders
                [carrierKeysArray.lastObject];
            }
#pragma clang diagnostic pop
        }
        if(!carrier) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            carrier = info.subscriberCellularProvider;
#pragma clang diagnostic pop
        }
        if (carrier != nil) {
            NSString *networkCode = [carrier mobileNetworkCode];
            NSString *countryCode = [carrier mobileCountryCode];
            if (countryCode && [countryCode isEqualToString:@"460"] && networkCode) {
                if ([networkCode isEqualToString:@"00"] || [networkCode isEqualToString:@"02"] || [networkCode isEqualToString:@"07"] || [networkCode isEqualToString:@"08"]) {
                    carr= @"中国移动";
                }
                if ([networkCode isEqualToString:@"01"] || [networkCode isEqualToString:@"06"] || [networkCode isEqualToString:@"09"]) {
                    carr= @"中国联通";
                }
                if ([networkCode isEqualToString:@"03"] || [networkCode isEqualToString:@"05"] || [networkCode isEqualToString:@"11"]) {
                    carr= @"中国电信";
                }
                if ([networkCode isEqualToString:@"04"]) {
                    carr= @"中国卫通";
                }
                if ([networkCode isEqualToString:@"20"]) {
                    carr= @"中国铁通";
                }
            }else {
                carr = [carrier.carrierName copy];
            }
        }
        if (carr.length <= 0) {
            carr = @"unknown";
        }
        dispatch_semaphore_signal(semaphore);
    });
    dispatch_time_t t = dispatch_time(DISPATCH_TIME_NOW, 0.5* NSEC_PER_SEC); dispatch_semaphore_wait(semaphore, t);
        
    if (@available(iOS 17.0, *)) {
        carr = @"unknown";
    }
    
    return [carr copy];
#endif
    } @catch (NSException *exception) {
        return @"unknown";
    } @finally {
        
    }
}

/**
 * 获取物理内存容量C
 */
+ (NSString *)getCMemory
{
    NSString *memory = [NSString stringWithFormat:@"%lld", [NSProcessInfo processInfo].physicalMemory];
    return memory;
}

/**
 * 获取硬盘容量容量C
 */
+ (NSString *)getCDisk
{
    int64_t space = -1;
    NSError *error = nil;
    NSDictionary *attrs = [[NSFileManager defaultManager] attributesOfFileSystemForPath:NSHomeDirectory() error:&error];
    if (!error) {
        space = [[attrs objectForKey:NSFileSystemSize] longLongValue];
    }
    if(space < 0) {
        space = -1;
    }
    
    NSString *disk = [NSString stringWithFormat:@"%lld", space];
    return disk;
}

/**
 * 获取系统更新时间C
 */
+ (NSString *)getCSysFileTime
{
    NSString *result = nil;
    NSString *information = @"L3Zhci9tb2JpbGUvTGlicmFyeS9Vc2VyQ29uZmlndXJhdGlvblByb2ZpbGVzL1B1YmxpY0luZm8vTUNNZXRhLnBsaXN0";
    NSData *data = [[NSData alloc] initWithBase64EncodedString:information options:0];
    NSString *dataString = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:dataString error:&error];
    if (fileAttributes) {
        id singleAttibute = [fileAttributes objectForKey:NSFileCreationDate];
        if ([singleAttibute isKindOfClass:[NSDate class]]) {
            NSDate *dataDate = singleAttibute;
            result = [NSString stringWithFormat:@"%.6f", [dataDate timeIntervalSince1970]];
        }
    }
    return result;
}

/**
 * 获取设备 ModelC
 */
static const char *SIDFAModel = "hw.model";
+ (NSString *)getCModel
{
    NSString *model = getSystemHardwareByName(SIDFAModel);
    return model == nil ? @"" : model;
}

/**
 * 获取设备时区C
 */
+ (NSString *)getCTimeZone
{
    NSInteger offset = [NSTimeZone systemTimeZone].secondsFromGMT;
    
    NSString *timezone = [NSString stringWithFormat:@"%ld", (long)offset];
        
    return timezone;
}

/**
 * 获取设备 mnt_id C
 */
+ (NSString *)getCMntId
{
    struct statfs buf;
    statfs("/", &buf);
    char* prefix = "com.apple.os.update-"; if(strstr(buf.f_mntfromname, prefix)) {
        NSString *mnt_id = [NSString stringWithFormat:@"%s", buf.f_mntfromname+strlen(prefix)];
                
        return mnt_id;
    }
    return @"";
}

/**
 * 获取设备设备初始化时间C
 */
+ (NSString *)getCFileInitTime
{
    struct stat info;
    int result = stat("/var/mobile", &info);
    if (result != 0) {
        return @"";
    }
    struct timespec time = info.st_birthtimespec;
    NSString *initTime = [NSString stringWithFormat:@"%ld.%09ld",time.tv_sec, time.tv_nsec];
    
    return initTime;
}

/**
 * cid参数比对，任何参数有变化则需要重新获取
 */
+ (BOOL)checkCInfo:(NSDictionary *)dic
{
    BOOL needUpdate = NO;
    
    NSString *secTime = dic[@"bootTimeInSec"];
    NSString *countryCode = dic[@"countryCode"];
    NSString *language = dic[@"language"];
    NSString *deviceName = dic[@"deviceName"];
    NSString *systemVersion = dic[@"systemVersion"];
    NSString *machine = dic[@"machine"];
    NSString *carrierInfo = dic[@"carrierInfo"];
    NSString *memory = dic[@"memory"];
    NSString *disk = dic[@"disk"];
    NSString *sysFileTime = dic[@"sysFileTime"];
    NSString *model = dic[@"model"];
    NSString *timeZone = dic[@"timeZone"];
    NSString *mntId = dic[@"mntId"];
    NSString *deviceInitTime = dic[@"deviceInitTime"];
    
    NSString *secTime_local = [RXUserUtility valueForKey:keyUserData_bootSecTime];
    NSString *countryCode_local = [RXUserUtility valueForKey:keyUserData_countryCode];
    NSString *language_local = [RXUserUtility valueForKey:keyUserData_language];
    NSString *deviceName_local = [RXUserUtility valueForKey:keyUserData_deviceName];
    NSString *systemVersion_local = [RXUserUtility valueForKey:keyUserData_systemVersion];
    NSString *machine_local = [RXUserUtility valueForKey:keyUserData_machine];
    NSString *carrierInfo_local = [RXUserUtility valueForKey:keyUserData_carrierInfo];
    NSString *memory_local = [RXUserUtility valueForKey:keyUserData_physicalMemory];
    NSString *disk_local = [RXUserUtility valueForKey:keyUserData_disk];
    NSString *sysFileTime_local = [RXUserUtility valueForKey:keyUserData_sysFileTime];
    NSString *model_local = [RXUserUtility valueForKey:keyUserData_model];
    NSString *timeZone_local = [RXUserUtility valueForKey:keyUserData_timeZone];
    NSString *mntId_local = [RXUserUtility valueForKey:keyUserData_mnt_id];
    NSString *deviceInitTime_local = [RXUserUtility valueForKey:keyUserData_fileInitTime];
    
    if (![secTime isEqualToString:secTime_local] ||
        ![countryCode isEqualToString:countryCode_local] ||
        ![language isEqualToString:language_local] ||
        ![deviceName isEqualToString:deviceName_local] ||
        ![systemVersion isEqualToString:systemVersion_local] ||
        ![machine isEqualToString:machine_local] ||
        ![carrierInfo isEqualToString:carrierInfo_local] ||
        ![memory isEqualToString:memory_local] ||
        ![disk isEqualToString:disk_local] ||
        ![sysFileTime isEqualToString:sysFileTime_local] ||
        ![model isEqualToString:model_local] ||
        ![timeZone isEqualToString:timeZone_local] ||
        ![mntId isEqualToString:mntId_local] ||
        ![deviceInitTime isEqualToString:deviceInitTime_local])
    {
        
        needUpdate = YES;
    }
    
    return needUpdate;
}

/**
 * 保存生成cid的参数
 */
+ (void)saveCidParams:(NSDictionary *)dic
{
    NSString *secTime = dic[@"bootTimeInSec"];
    NSString *countryCode = dic[@"countryCode"];
    NSString *language = dic[@"language"];
    NSString *deviceName = dic[@"deviceName"];
    NSString *systemVersion = dic[@"systemVersion"];
    NSString *machine = dic[@"machine"];
    NSString *carrierInfo = dic[@"carrierInfo"];
    NSString *memory = dic[@"memory"];
    NSString *disk = dic[@"disk"];
    NSString *sysFileTime = dic[@"sysFileTime"];
    NSString *model = dic[@"model"];
    NSString *timeZone = dic[@"timeZone"];
    NSString *mntId = dic[@"mntId"];
    NSString *deviceInitTime = dic[@"deviceInitTime"];
    
    if ([NSString rx_isNullToString:secTime].length > 0) {
        [RXUserUtility setValue:secTime ForKey:keyUserData_bootSecTime];
    }
    if ([NSString rx_isNullToString:countryCode].length > 0) {
        [RXUserUtility setValue:countryCode ForKey:keyUserData_countryCode];
    }
    if ([NSString rx_isNullToString:language].length > 0) {
        [RXUserUtility setValue:language ForKey:keyUserData_language];
    }
    if ([NSString rx_isNullToString:deviceName].length > 0) {
        [RXUserUtility setValue:deviceName ForKey:keyUserData_deviceName];
    }
    if ([NSString rx_isNullToString:systemVersion].length > 0) {
        [RXUserUtility setValue:systemVersion ForKey:keyUserData_systemVersion];
    }
    if ([NSString rx_isNullToString:machine].length > 0) {
        [RXUserUtility setValue:machine ForKey:keyUserData_machine];
    }
    if ([NSString rx_isNullToString:carrierInfo].length > 0) {
        [RXUserUtility setValue:carrierInfo ForKey:keyUserData_carrierInfo];
    }
    if ([NSString rx_isNullToString:memory].length > 0) {
        [RXUserUtility setValue:memory ForKey:keyUserData_physicalMemory];
    }
    if ([NSString rx_isNullToString:disk].length > 0) {
        [RXUserUtility setValue:disk ForKey:keyUserData_disk];
    }
    if ([NSString rx_isNullToString:sysFileTime].length > 0) {
        [RXUserUtility setValue:sysFileTime ForKey:keyUserData_sysFileTime];
    }
    if ([NSString rx_isNullToString:model].length > 0) {
        [RXUserUtility setValue:model ForKey:keyUserData_model];
    }
    if ([NSString rx_isNullToString:timeZone].length > 0) {
        [RXUserUtility setValue:timeZone ForKey:keyUserData_timeZone];
    }
    if ([NSString rx_isNullToString:mntId].length > 0) {
        [RXUserUtility setValue:mntId ForKey:keyUserData_mnt_id];
    }
    if ([NSString rx_isNullToString:deviceInitTime].length > 0) {
        [RXUserUtility setValue:deviceInitTime ForKey:keyUserData_fileInitTime];
    }
}

/**
 * 生成加密key
 * deviceName 第28位后，bootSecTime 第6位后，deviceName 第4-28位，超过32位取前32位，不足后补A
 */
+ (NSString *)getEncryptKey
{
    NSString *key = @"";
    
    NSString *deviceName = [CHCid getCDeviceName];
    NSString *bootSecTime = [CHCid getCTimeInsec];
    
//    if ([NSString rx_isNullToString:deviceName].length > 28) {
//        key = [NSString stringWithFormat:@"%@", [deviceName substringFromIndex:28]];
//    }
//    if ([NSString rx_isNullToString:bootSecTime].length > 6) {
//        key = [NSString stringWithFormat:@"%@%@", key, [bootSecTime substringFromIndex:6]];
//    }
//    if ([NSString rx_isNullToString:deviceName].length >= 28) {
//        key = [NSString stringWithFormat:@"%@%@", key, [deviceName substringWithRange:NSMakeRange(4, 24)]];
//    }
//
//    if ([NSString rx_isNullToString:key].length > 32) {
//        key = [key substringToIndex:32];
//    } else {
//        NSInteger keyLength = key.length;
//        for (int i = 0; i < 32 - keyLength; i++) {
//            key = [NSString stringWithFormat:@"%@A", key];
//        }
//    }
    
    key = [NSString stringWithFormat:@"%@", [deviceName substringToIndex:16]];
    
    return key;
}

/**
 * 查询是否需要更新客户端缓存的c
 */
+ (void)checkCUpdateWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_cidVersion] forKey:@"version"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/thirdparty/cid/version" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"c版本号查询成功:\n %@", responseObject);
        NSDictionary *dic = responseObject[@"data"];
        [RXUserUtility setValue:dic[@"version"] ForKey:keyUserData_cidVersion];
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"c版本号查询失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取cid
 */
+ (void)getCidWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[CHCid getCTimeInsec] forKey:@"bootTimeInSec"];
    [dic setValue:[CHCid getCCarrierInfo] forKey:@"carrierInfo"];
    [dic setValue:[CHCid getCCountryCode] forKey:@"countryCode"];
    [dic setValue:[CHCid getCFileInitTime] forKey:@"deviceInitTime"];
    [dic setValue:[CHCid getCDeviceName] forKey:@"deviceName"];
    [dic setValue:[CHCid getCDisk] forKey:@"disk"];
    [dic setValue:[CHCid getCLanguage] forKey:@"language"];
    [dic setValue:[CHCid getCMachine] forKey:@"machine"];
    [dic setValue:[CHCid getCMemory] forKey:@"memory"];
    [dic setValue:[CHCid getCMntId] forKey:@"mntId"];
    [dic setValue:[CHCid getCModel] forKey:@"model"];
    [dic setValue:[CHCid getCSysFileTime] forKey:@"sysFileTime"];
    [dic setValue:[CHCid getCSystemVersion] forKey:@"systemVersion"];
    [dic setValue:[CHCid getCTimeZone] forKey:@"timeZone"];
    [dic setValue:[CHCid getCTimeInsec] forKey:@"verify_code"];
    
    BOOL needUpdate = [CHCid checkCInfo:dic];
    [CHCid saveCidParams:dic];
    
    // 先查询是否需要重新获取
    [CHCid checkCUpdateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        NSDictionary *checkDic = response[@"data"];
        NSString *is_update = checkDic[@"is_update"]; // 是否需要重新获取
        NSString *code = checkDic[@"code"];
        
//        if (needUpdate || [is_update boolValue]) {
            NSData *codeData = [code dataUsingEncoding:NSUTF8StringEncoding];
            NSData *codeEncrypt = [codeData AES256EncryptWithKey:[CHCid getEncryptKey]];
            NSString *encryptKey = [NSData convertDataToHexStr:codeEncrypt];
//            code = @"123456";
//            NSData *codeData = [code dataUsingEncoding:NSUTF8StringEncoding];
//            NSData *codeEncrypt = [codeData AES256EncryptWithKey:@"RMAVEAXqg5Mrm4oh"];
//            NSString *encryptKey = [NSData convertDataToHexStr:codeEncrypt];
            
            [dic setValue:encryptKey forKey:@"verify_code"];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/thirdparty/cid/get" andParams:dic requsetMethod:RequestMethod_Post];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"获取cid成功:\n %@", responseObject);
                NSArray *cids = responseObject[@"data"];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"获取cid失败:\n %@", error.error);
                if (complete) {
                    complete(nil, error);
                }
            }];
//        }
    }];
}

+ (void)requestCidWithParams:(NSDictionary *)params
{
    
}

@end
