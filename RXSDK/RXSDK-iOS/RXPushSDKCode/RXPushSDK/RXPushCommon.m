//
//  RXPushCommon.m
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import "RXPushCommon.h"
#import <Security/Security.h>
#import <UIKit/UIKit.h>
#import "SAMKeychain.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

//NSString * const KEY_UDID_INSTEAD = @"com.wiele.udid";

@implementation RXPushCommon

static RXPushCommon *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXPushCommon alloc] init];
    });
    return sharedSDK;
}

/**
 * 获取请求头
 */
- (NSMutableDictionary *)getHeaderParams
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    NSString *language = [self getSystemLanguage];
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_setLanguage"];
    NSMutableDictionary *profile = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_initProfile"];
    if (setLanguage && setLanguage.length > 0) {
        language = setLanguage;
    } else if (profile && profile.allKeys.count > 0) {
        NSDictionary *profile_passport = profile[@"passport"];
        if ([profile_passport valueForKey:@"language_default"]) {
            language = [profile_passport valueForKey:@"language_default"];
        }
    }
    
    [dic setValue:language forKey:@"ruixue-language"];
    [dic setValue:[self uuid] forKey:@"ruixue-traceid"];
    [dic setValue:[self getToken] forKey:@"ruixue-accesstoken"];
    [dic setValue:self.productid forKey:@"ruixue-productid"];
    [dic setValue:self.cpid forKey:@"ruixue-cpid"];
    [dic setValue:self.channelid forKey:@"ruixue-channelid"];
    [dic setValue:@"2" forKey:@"ruixue-platformid"];
    [dic setValue:[self getDeviceIDInKeychain] forKey:@"ruixue-devicecode"];
    [dic setValue:sdkVersion forKey:@"ruixue-version"];
    [dic setValue:@"application/json" forKey:@"Content-Type"];
    
    NSString *appInfo = [self getAppInfo];
    if (appInfo.length > 0) {
        [dic setValue:appInfo forKey:@"ruixue-appinfo"];
    }
    
    NSLog(@"请求头:\n %@",dic);
    
    return dic;
}

/**
 * 获取手机语言地区
 */
- (NSMutableArray *)getLanguageCountry
{
    NSMutableArray *langArr = [NSMutableArray array];
    NSString *langStr = [[[NSUserDefaults standardUserDefaults] objectForKey:@"AppleLanguages"] firstObject];
    NSArray *compontArr = [langStr componentsSeparatedByString:@"-"];
    if (compontArr.count > 2) {
        NSString *language = [NSString stringWithFormat:@"%@-%@", compontArr[0], compontArr[1]];
        [langArr addObject:language];
        [langArr addObject:compontArr[2]];
    } else if (compontArr.count == 2) {
        [langArr addObjectsFromArray:compontArr];
    } else {
        compontArr = @[@"zh-Hans", @"CN"];
        [langArr addObjectsFromArray:compontArr];
    }
    return langArr;
}

/**
 * 获取当前手机语言
 */
- (NSString *)getSystemLanguage
{
    NSArray *languageArr = [self getLanguageCountry];
    NSString *language = languageArr[0];
    if (languageArr.count > 1) {
        NSArray *compareLan = [[languageArr[0] description] componentsSeparatedByString:@"-"];
        if (compareLan.count > 1) {
            language = [NSString stringWithFormat:@"%@-%@", compareLan[0], languageArr[1]];
        } else {
            language = [NSString stringWithFormat:@"%@-%@", languageArr[0], languageArr[1]];
        }
    }
    if (!language) {
        language = @"zh-cn";
    }
    return language;
}

/**
 * 获取uuid
 */
- (NSString *)uuid
{
    CFUUIDRef uuidref = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef uuid = CFUUIDCreateString(kCFAllocatorDefault, uuidref);
    NSString *result = (__bridge NSString *)uuid;
    CFRelease(uuidref);
    CFRelease(uuid);
    return result;
}

/**
 * 获取token
 */
- (NSString *)getToken
{
    NSString *token = [[NSUserDefaults standardUserDefaults] valueForKey:RXNotiKey_token];
    return token.length > 0 ? token : @"";
}

/**
 * 获取设备码
 */
- (NSString *)getDeviceIDInKeychain
{
    NSString *getUDIDInKeychain = (NSString *)[self load:@"com.wiele.udid"];
    NSLog(@"从keychain中获取到的 UDID_INSTEAD %@",getUDIDInKeychain);
    if (!getUDIDInKeychain ||[getUDIDInKeychain isEqualToString:@""]||[getUDIDInKeychain isKindOfClass:[NSNull class]]) {
        CFUUIDRef puuid = CFUUIDCreate( nil );
        CFStringRef uuidString = CFUUIDCreateString( nil, puuid );
        NSString * result = (NSString *)CFBridgingRelease(CFStringCreateCopy( NULL, uuidString));
        CFRelease(puuid);
        CFRelease(uuidString);
        NSLog(@"重新存储%@",result);
        [self save:@"com.wiele.udid" data:result];
        getUDIDInKeychain = (NSString *)[self load:@"com.wiele.udid"];
    }
    NSLog(@"最终%@",getUDIDInKeychain);
    return getUDIDInKeychain;
}
 
#pragma mark - private
- (NSMutableDictionary *)getKeychainQuery:(NSString *)service {
    return [NSMutableDictionary dictionaryWithObjectsAndKeys:
            (id)kSecClassGenericPassword,(id)kSecClass,
            service, (id)kSecAttrService,
            service, (id)kSecAttrAccount,
            (id)kSecAttrAccessibleAfterFirstUnlock,(id)kSecAttrAccessible,
            nil];
}
 
- (void)save:(NSString *)service data:(id)data {
    //Get search dictionary
    NSMutableDictionary *keychainQuery = [self getKeychainQuery:service];
    //Delete old item before add new item
    SecItemDelete((CFDictionaryRef)keychainQuery);
    //Add new object to search dictionary(Attention:the data format)
    [keychainQuery setObject:[NSKeyedArchiver archivedDataWithRootObject:data] forKey:(id)kSecValueData];
    //Add item to keychain with the search dictionary
    SecItemAdd((CFDictionaryRef)keychainQuery, NULL);
}
 
- (id)load:(NSString *)service {
    id ret = nil;
    NSMutableDictionary *keychainQuery = [self getKeychainQuery:service];
    //Configure the search setting
    //Since in our simple case we are expecting only a single attribute to be returned (the password) we can set the attribute kSecReturnData to kCFBooleanTrue
    [keychainQuery setObject:(id)kCFBooleanTrue forKey:(id)kSecReturnData];
    [keychainQuery setObject:(id)kSecMatchLimitOne forKey:(id)kSecMatchLimit];
    CFDataRef keyData = NULL;
    if (SecItemCopyMatching((CFDictionaryRef)keychainQuery, (CFTypeRef *)&keyData) == noErr) {
        @try {
            ret = [NSKeyedUnarchiver unarchiveObjectWithData:(__bridge NSData *)keyData];
        } @catch (NSException *e) {
            NSLog(@"Unarchive of %@ failed: %@", service, e);
        } @finally {
        }
    }
    if (keyData)
        CFRelease(keyData);
    return ret;
}
 
- (void)delete:(NSString *)service {
    NSMutableDictionary *keychainQuery = [self getKeychainQuery:service];
    SecItemDelete((CFDictionaryRef)keychainQuery);
}

/**
 * deviceToken转换
 */
- (NSString *)getDeviceToken:(NSData *)deviceTokenData
{
    NSString *pushToken=@"";
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.0) {
        const unsigned *tokenBytes = [deviceTokenData bytes];
        pushToken = [NSString stringWithFormat:@"%08x %08x %08x %08x %08x %08x %08x %08x",
                     ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                     ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                     ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    }
    else{
        pushToken = [NSString stringWithFormat:@"%@", deviceTokenData];
        if (pushToken != nil && pushToken.length> 3) {
            pushToken = [pushToken substringFromIndex:1];
            pushToken = [pushToken substringToIndex:pushToken.length -1];
        }
    }
    return pushToken;
}

/**
 * 保存deviceToken
 */
- (void)saveDeviceToken:(NSString *)deviceToken
{
    [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:@"rxpush_deviceToken"];
    [SAMKeychain setPassword:deviceToken forService:@"RXPushSDK" account:@"RXPushSDK_deviceToken"];
}

- (NSString *)deviceToken
{
    NSString *token = [SAMKeychain passwordForService:@"RXPushSDK" account:@"RXPushSDK_deviceToken"];
    return token.length > 0 ? token : @"";
}

/**
 * 保存productid
 */
- (void)saveProductid:(NSString *)productid
{
    [SAMKeychain setPassword:productid forService:@"RXPushSDK" account:@"RXPushSDK_productid"];
}

- (NSString *)productid
{
    return [SAMKeychain passwordForService:@"RXPushSDK" account:@"RXPushSDK_productid"];
}

/**
 * 保存cpid
 */
- (void)saveCpid:(NSString *)cpid
{
    [SAMKeychain setPassword:cpid forService:@"RXPushSDK" account:@"RXPushSDK_cpid"];
}

- (NSString *)cpid
{
    return [SAMKeychain passwordForService:@"RXPushSDK" account:@"RXPushSDK_cpid"];
}

/**
 * 保存channelid
 */
- (void)saveChannelid:(NSString *)channelid
{
    [SAMKeychain setPassword:channelid forService:@"RXPushSDK" account:@"RXPushSDK_channelid"];
}

- (NSString *)channelid
{
    return [SAMKeychain passwordForService:@"RXPushSDK" account:@"RXPushSDK_channelid"];
}

/**
 * 保存baseUrlList
 */
- (void)saveBaseUrlList:(NSArray *)baseUrlList
{
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:baseUrlList];
    [SAMKeychain setPasswordData:data forService:@"RXPushSDK" account:@"RXPushSDK_baseUrlList"];
}

- (NSArray *)baseUrlList
{
    NSArray *arr = [NSKeyedUnarchiver unarchiveObjectWithData:[SAMKeychain passwordDataForService:@"RXPushSDK" account:@"RXPushSDK_baseUrlList"]];
    return arr;
}

- (NSString *)getAppInfo
{
    // app 版本号
    NSString *appVersion = [self getAppVersion];
    NSString *appInfoStr = @"";
    if (appVersion.length > 0) {
        appInfoStr = [NSString stringWithFormat:@"version=%@", appVersion];
    }
    
    return appInfoStr;
}

/**
 * 获取 app 版本号
 */
- (NSString *)getAppVersion
{
    NSDictionary *appInfo = [[NSBundle mainBundle] infoDictionary];
    NSString *appVersion = [appInfo objectForKey:@"CFBundleShortVersionString"];
    
    return appVersion;
}

/**
 * 是否需要上报
 */
- (BOOL)needReportWithDeviceToken:(NSString *)deviceToken
{
    @try {
        BOOL needReport = NO;
        
        if (deviceToken && deviceToken.length > 0) {
            NSString *cacheKey = [NSString stringWithFormat:@"pushDevice_%@", [[RXService sharedSDK] getOpenID]];
            
            NSString *cacheDeviceToken = [[NSUserDefaults standardUserDefaults] valueForKey:cacheKey];
            
            if (cacheDeviceToken.length > 0 && [cacheDeviceToken isEqualToString:deviceToken]) {
                needReport = NO;
            } else {
                needReport = YES;
                [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:cacheKey];
            }
        }
        
        return needReport;
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
        return YES;
    } @finally {
        
    }
}

@end
