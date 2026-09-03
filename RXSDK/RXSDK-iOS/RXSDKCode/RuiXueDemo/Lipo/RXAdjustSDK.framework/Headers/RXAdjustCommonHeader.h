//
//  RXAdjustCommonHeader.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#ifndef RXAdjustCommonHeader_h
#define RXAdjustCommonHeader_h

/**** Environment环境变量 **/
static NSString * const RXADJEnvironmentSandbox = @"sandbox";        // 沙盒环境
static NSString * const RXADJEnvironmentProduction = @"production";  // 正式环境

static NSString * const RXADJAdRevenueSourceAppLovinMAX = @"applovin_max_sdk";
static NSString * const RXADJAdRevenueSourceMopub = @"mopub";
static NSString * const RXADJAdRevenueSourceAdMob = @"admob_sdk";
static NSString * const RXADJAdRevenueSourceIronSource = @"ironsource_sdk";
static NSString * const RXADJAdRevenueSourceAdMost = @"admost_sdk";
static NSString * const RXADJAdRevenueSourceUnity = @"unity_sdk";
static NSString * const RXADJAdRevenueSourceHeliumChartboost = @"helium_chartboost_sdk";
static NSString * const RXADJAdRevenueSourcePublisher = @"publisher_sdk";

static NSString * const RXADJUrlStrategyIndia = @"UrlStrategyIndia";
static NSString * const RXADJUrlStrategyChina = @"UrlStrategyChina";
static NSString * const RXADJUrlStrategyCn = @"UrlStrategyCn";

static NSString * const RXADJDataResidencyEU = @"DataResidencyEU";
static NSString * const RXADJDataResidencyTR = @"DataResidencyTR";
static NSString * const RXADJDataResidencyUS = @"DataResidencyUS";

/**** 日志等级 **/
typedef enum {
    RXADJLogLevelVerbose  = 1,
    RXADJLogLevelDebug    = 2,
    RXADJLogLevelInfo     = 3,
    RXADJLogLevelWarn     = 4,
    RXADJLogLevelError    = 5,
    RXADJLogLevelAssert   = 6,
    RXADJLogLevelSuppress = 7
} RXADJLogLevel;

#endif /* RXAdjustCommonHeader_h */
