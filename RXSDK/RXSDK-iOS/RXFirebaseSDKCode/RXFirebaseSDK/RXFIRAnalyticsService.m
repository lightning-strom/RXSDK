//
//  RXFIRAnalyticsService.m
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2024/6/5.
//

#import "RXFIRAnalyticsService.h"
#import <FirebaseAnalytics/FirebaseAnalytics.h>

@implementation RXFIRAnalyticsService

static RXFIRAnalyticsService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFIRAnalyticsService alloc] init];
    });
    return sharedSDK;
}

/**
 * 导入邮箱
 */
- (void)initiateOnDeviceConversionMeasurementWithEmailAddress:(NSString *)email
{
    if (email.length > 0) {
        [FIRAnalytics initiateOnDeviceConversionMeasurementWithEmailAddress:email];
    }
}

/**
 * 导入手机号
 */
- (void)initiateOnDeviceConversionMeasurementWithPhoneNumber:(NSString *)phone
{
    if (phone.length > 0) {
        [FIRAnalytics initiateOnDeviceConversionMeasurementWithPhoneNumber:phone];
    }
}

@end
