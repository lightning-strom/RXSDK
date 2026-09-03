//
//  RXIMCommonDevice.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMCommonDevice : NSObject

/**
 * 获取DeviceCode
 */
+ (NSString *)getDeviceCodeInKeychain;

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry;

/**
 * 获取app名称
 */
+ (NSString *)getAppName;

/**
 *  获取时间戳
 */
+ (NSInteger)getTimestamp;

/**
 *  通过时间获取毫秒数
 */
+ (NSInteger)getTimeStrWithString:(NSString *)str;

/**
 * 获取设备UUID
 */
+ (NSString *)mockDeviceId;

/**
 * 获取系统版本
 */
+ (NSString *)getSystemVersion;

/**
 * 获取手机型号
 */
+ (NSString *)platformString;

/**
 * 获取app版本号
 */
+ (NSString *)getAppVersion;

@end

NS_ASSUME_NONNULL_END
