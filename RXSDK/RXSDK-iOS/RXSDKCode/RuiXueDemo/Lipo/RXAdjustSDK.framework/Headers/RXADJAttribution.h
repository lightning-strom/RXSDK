//
//  RXADJAttribution.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/11.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXADJAttribution : NSObject

/**
 * @brief 设备当前归因跟踪链接的跟踪码
 */
@property (nonatomic, copy, nullable) NSString *trackerToken;

/**
 * @brief 设备当前归因跟踪链接的名称
 */
@property (nonatomic, copy, nullable) NSString *trackerName;

/**
 * @brief 设备当前归因渠道的名称
 */
@property (nonatomic, copy, nullable) NSString *network;

/**
 * @brief 设备当前归因推广活动的名称
 */
@property (nonatomic, copy, nullable) NSString *campaign;

/**
 * @brief 设备当前归因广告组的名称
 */
@property (nonatomic, copy, nullable) NSString *adgroup;

/**
 * @brief 设备当前归因素材的名称
 */
@property (nonatomic, copy, nullable) NSString *creative;

/**
 * @brief 安装被标记的 点击标签
 */
@property (nonatomic, copy, nullable) NSString *clickLabel;

/**
 * @brief 设备的唯一 Adjust ID
 */
@property (nonatomic, copy, nullable) NSString *adid;

/**
 * @brief 推广活动定价模型 (如 cpi)
 */
@property (nonatomic, copy, nullable) NSString *costType;

/**
 * @brief 安装成本
 */
@property (nonatomic, copy, nullable) NSNumber *costAmount;

/**
 * @brief 成本相关的货币代码。应符合 ISO 4217 标准且包含 3 个字符。
 */
@property (nonatomic, copy, nullable) NSString *costCurrency;

@end

NS_ASSUME_NONNULL_END
