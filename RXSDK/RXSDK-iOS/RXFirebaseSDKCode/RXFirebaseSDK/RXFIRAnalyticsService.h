//
//  RXFIRAnalyticsService.h
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2024/6/5.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXFIRAnalyticsService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 导入邮箱
 */
- (void)initiateOnDeviceConversionMeasurementWithEmailAddress:(NSString *)email;

/**
 * 导入手机号
 */
- (void)initiateOnDeviceConversionMeasurementWithPhoneNumber:(NSString *)phone;

@end

NS_ASSUME_NONNULL_END
