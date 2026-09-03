//
//  RXAliCloudDNSSDKService.h
//  RXAliCloudDNSSDK
//
//  Created by root11 on 2024/8/6.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXAliCloudDNSSDKService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化方法
 * accountID appkey
 * secretKey 秘钥
 * debug 调试日志模式，YES开启，NO关闭，默认NO
 */
- (void)initWithAccountID:(int)accountID secretKey:(NSString *)secretKey debug:(BOOL)debug;

/**
 * 根据请求对象解析DNS并发起请求，返回请求结果
 * originalRequest 原请求对象
 * successBlock 请求成功回调
 * errorBlock 请求失败回调
 */
- (void)httpDNSQueryWithRequest:(NSMutableURLRequest *)originalRequest
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock;

/**
 * 根据url地址的host解析对应ip，成功返回ip，失败返回nil
 * host url的host,例如"https://www.baidu.com"中的www.baidu.com
 */
- (NSString *)resolveAvailableIp:(NSString *)host;

/**
 * 设置region节点
 */
- (void)setRegion:(NSString *)region;

@end

NS_ASSUME_NONNULL_END
