//
//  RXIMCommonTool.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMCommonTool : NSObject

/**
 * 获取当前屏幕方向
 * 1 竖屏  2横屏
 */
+ (NSInteger)getInterfaceOrientation;

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry;

/**
 * 获取广告信息
 */
+ (NSMutableDictionary *)getAdInfo;

/**
 * 获取当前时间戳
 */
+ (NSString *)getNowTimeTimestamp;

/**
 * 获取当前时间  yyyy-MM-dd HH:mm:ss.SSS
 */
+ (NSString *)getTimeForStr;

/**
 * md5加密然后转大写
 */
+ (NSString*)md532BitUpperWithStr:(NSString *)str;

/**
 * 密码校验
 */
+ (BOOL)checkPasswordWithPwd:(NSString *)pwd;

/**
 * 获取idfa
 */
+ (NSString *)getIDFA;

/**
 * 获取bundlId
 */
+ (NSString *)getBundleId;

/**
 * 获取uuid
 */
+ (NSString *)uuid;

/**
 * 保存埋点数据
 */
+ (void)addLogObj:(NSMutableDictionary *)obj;

/**
 * 清除埋点数据
 */
+ (void)deleteLogArr;

/**
 * 获取时间戳随机数
 */
+ (NSString *)getTimeStampV4;

/**
 * 判断是否为链接
 */
+ (BOOL)checkUrlWithString:(NSString *)urlStr;

/**
 * model->nsdictory
 */
+ (NSDictionary *)dicFromObject:(NSObject *)object;

/**
 * 获取请求头
 */
+ (NSMutableDictionary *)headParams;

/**
 * 验证是否支持扩展业务
 */
+ (RXIMError *)verifyIsSupportBusiness;

/**
 * 获取随机数
 */
+ (NSInteger)getRandomInt:(NSInteger)value;

@end

NS_ASSUME_NONNULL_END
