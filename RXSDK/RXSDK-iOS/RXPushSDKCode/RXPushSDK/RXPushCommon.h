//
//  RXPushCommon.h
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import <Foundation/Foundation.h>
#import "RXRequest.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const sdkVersion = @"3.8.0";

static NSString *RXNotiKey_token = @"RXNotiKey_token";

static NSString *RXUserDefault_pushInfo = @"RXNotiKey_pushInfo";

#ifdef DEBUG
#define NSLog(...) NSLog(__VA_ARGS__)
#define sLog( s, ... ) printf("class: <%p %s:(%d) > method: %s \n%s\n", self, [[[NSString stringWithUTF8String:__FILE__] lastPathComponent] UTF8String], __LINE__, __PRETTY_FUNCTION__, [[NSString stringWithFormat:(s), ##__VA_ARGS__] UTF8String] )
#define debugMethod() NSLog(@"%s", __func__)
#else// 发布状态, 关闭LOG功能
#define NSLog(...)
#define sLog( s, ... )
#define debugMethod()
#endif

@interface RXPushCommon : NSObject

@property (nonatomic, copy) NSString *productid;
@property (nonatomic, copy) NSString *cpid;
@property (nonatomic, copy) NSString *channelid;
@property (nonatomic, strong) NSArray *baseUrlList;
@property (nonatomic, copy) NSString *deviceToken;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 获取请求头
 */
- (NSMutableDictionary *)getHeaderParams;

/**
 * deviceToken转换
 */
- (NSString *)getDeviceToken:(NSData *)deviceTokenData;

/**
 * 保存deviceToken
 */
- (void)saveDeviceToken:(NSString *)deviceToken;

/**
 * 保存productid
 */
- (void)saveProductid:(NSString *)productid;

/**
 * 保存cpid
 */
- (void)saveCpid:(NSString *)cpid;

/**
 * 保存channelid
 */
- (void)saveChannelid:(NSString *)channelid;

/**
 * 保存baseUrlList
 */
- (void)saveBaseUrlList:(NSArray *)baseUrlList;

/**
 * 是否需要上报
 */
- (BOOL)needReportWithDeviceToken:(NSString *)deviceToken;

@end

NS_ASSUME_NONNULL_END
