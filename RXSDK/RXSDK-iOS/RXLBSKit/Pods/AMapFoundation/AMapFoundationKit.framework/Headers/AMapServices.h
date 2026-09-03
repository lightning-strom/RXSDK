//
//  AMapSearchServices.h
//  AMapSearchKit
//
//  Created by xiaoming han on 15/6/18.
//  Copyright (c) 2015年 xiaoming han. All rights reserved.
//

#import <Foundation/Foundation.h>


//语言类型 language type
typedef NS_ENUM(int, AMapRegionLanguageType)
{
    /// 简体中文 (Simplified Chinese)
    AMapRegionLanguageTypeZhHans = 0,
    
    /// 香港繁体中文 (Traditional Chinese - Hong Kong)
    AMapRegionLanguageTypeZhHantHk,
    
    /// 英文 (English)
    AMapRegionLanguageTypeEn,
    
    /// 西班牙语 (Spanish)
    AMapRegionLanguageTypeEs,
    
    /// 葡萄牙语 (Portuguese)
    AMapRegionLanguageTypePt,
    
    /// 法语 (French)
    AMapRegionLanguageTypeFr,
    
    /// 德语 (German)
    AMapRegionLanguageTypeDe,
    
    /// 泰语 (Thai)
    AMapRegionLanguageTypeTh,
    
    /// 日语 (Japanese)
    AMapRegionLanguageTypeJa,
    
    /// 韩语 (Korean)
    AMapRegionLanguageTypeKo,
    
    /// 阿拉伯语 (Arabic)
    AMapRegionLanguageTypeAr,
    
    /// 土耳其语 (Turkish)
    AMapRegionLanguageTypeTr,
    
    /// 希伯来语 (Hebrew)
    AMapRegionLanguageTypeHe,
    
    /// 意大利语 (Italian)
    AMapRegionLanguageTypeIt,
    
    /// 俄语 (Russian)
    AMapRegionLanguageTypeRu,
    
    /// 马来语 (Malay)
    AMapRegionLanguageTypeMs,
    
    /// 印尼语 (Indonesian)
    AMapRegionLanguageTypeId,
    
    /// 越南语 (Vietnamese)
    AMapRegionLanguageTypeVi,
    
    /// 波兰语 (Polish)
    AMapRegionLanguageTypePl,
    
    /// 捷克语 (Czech)
    AMapRegionLanguageTypeCs,
    
    /// 乌克兰语 (Ukrainian)
    AMapRegionLanguageTypeUk,
    
    /// 阿塞拜疆语 (Azerbaijani)
    AMapRegionLanguageTypeAz,
    
    /// 最大值标识 (Max Value Marker)
    AMapRegionLanguageTypeMax
};

/**
 * 是否为海外用户...海外用户,SDK内部会屏蔽一些操作 默认为NO.
 * @warning AMapServices初始化之前,设置才能生效
 */
extern BOOL _amapLocationOverseas;

// 显示隐私弹窗状态  -1: unknow , 0 : 未显示 ， 1 ： 已显示
typedef NS_ENUM(NSInteger, AMapPrivacyShowStatus)
{
    AMapPrivacyShowStatusUnknow = -1,
    AMapPrivacyShowStatusNotShow = 0,
    AMapPrivacyShowStatusDidShow = 1,
};

// RTL状态  0: 未设置，跟随全局 , 1 : 关闭 ， 2 ： 强制开启
typedef NS_ENUM(NSInteger, AMapAttributeRTLState)
{
    AMapAttributeRTLStateDefault = 0,
    AMapAttributeRTLStateDisabled,
    AMapAttributeRTLStateEnabled
};

// 集成SDK隐私信息状态  -1: unknow , 0 : 未集成 ， 1 ： 已集成
typedef NS_ENUM(NSInteger, AMapPrivacyInfoStatus)
{
    AMapPrivacyInfoStatusUnknow = -1,
    AMapPrivacyInfoStatusNotContain = 0,
    AMapPrivacyInfoStatusDidContain = 1,
};

// 用户同意隐私状态 -1: unknow , 0 : 未同意 ， 1 ： 已同意
typedef NS_ENUM(NSInteger, AMapPrivacyAgreeStatus)
{
    AMapPrivacyAgreeStatusUnknow = -1,
    AMapPrivacyAgreeStatusNotAgree = 0,
    AMapPrivacyAgreeStatusDidAgree = 1,
};

///高德SDK服务类
@interface AMapServices : NSObject

/**
 * @brief 获取单例
 */
+ (AMapServices *)sharedServices;

///语言类型属性
///language type property
@property (nonatomic, assign) AMapRegionLanguageType regionLanguageType;

///国家代码属性
///country code property
@property (nonatomic, copy) NSString *countryCode;

///APIkey。设置key，需要在高德官网控制台绑定对应的bundleid。
@property (nonatomic, copy) NSString *apiKey;

///是否开启HTTPS，从1.3.3版本开始默认为YES。
@property (nonatomic, assign) BOOL enableHTTPS;


///是否启用崩溃日志上传。默认为YES, 只有在真机上设置有效。\n开启崩溃日志上传有助于我们更好的了解SDK的状况，可以帮助我们持续优化和改进SDK。需要注意的是，SDK内部是通过设置NSUncaughtExceptionHandler来捕获异常的，如果您的APP中使用了其他收集崩溃日志的SDK，或者自己有设置NSUncaughtExceptionHandler的话，请保证 AMapServices 的初始化是在其他设置NSUncaughtExceptionHandler操作之后进行的，我们的handler会再处理完异常后调用前一次设置的handler，保证之前设置的handler会被执行。
@property (nonatomic, assign) BOOL crashReportEnabled __attribute__((deprecated("从v1.5.7开始废弃，调用无任何作用")));

///设备标识，取自idfv。用于排查问题时提供。
@property (nonatomic, readonly) NSString *identifier;

///用户是否同意数据用于安全保障。默认为YES。since 1.8.7
///Whether the user agrees to use data for security assurance. Default: YES. Since 1.8.7
@property (nonatomic, assign) BOOL securityAgree;

///用户是否同意数据用于统计分析。默认为YES。since 1.8.7
///Whether the user agrees to use data for statistical analysis. Default: YES. Since 1.8.7
@property (nonatomic, assign) BOOL analysisAgree;

///当前位置经度。since 1.8.7
///Current location longitude. Since 1.8.7
@property (nonatomic, assign) double longitude;

///当前位置纬度。since 1.8.7
///Current location latitude. Since 1.8.7
@property (nonatomic, assign) double latitude;

///是否启用从右向左（RTL）布局，默认为AMapAttributeRTLStateDefault
///Whether to enable right-to-left (RTL) layout, default is AMapAttributeRTLStateDefault
@property (nonatomic, assign) AMapAttributeRTLState enableRTLLayout;

///获取regionLanguageType对应的anguageCode
- (NSString *)getRegionLanguageCode;

@end
