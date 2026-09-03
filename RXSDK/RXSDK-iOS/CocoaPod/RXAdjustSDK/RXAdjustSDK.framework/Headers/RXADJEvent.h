//
//  RXADJEvent.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXADJEvent : NSObject

/**
 * @brief Event token
 */
@property (nonatomic, copy, readonly, nonnull) NSString *eventToken;

/**
 * @brief 金额
 */
@property (nonatomic, assign, readonly) double amount;

/**
 * @brief 币种
 */
@property (nonatomic, copy, readonly, nonnull) NSString *currency;

/**
 * @brief 是否设置事件收入
 */
@property (nonatomic, assign, readonly) BOOL isSetRevenue;

/**
 * @brief IAP 交易凭证
 */
@property (nonatomic, copy, readonly, nonnull) NSString *transactionId;

/**
 * @brief 是否设置去重事件
 */
@property (nonatomic, assign, readonly) BOOL isSetTransactionId;

/**
 * @brief 回传参数
 */
@property (nonatomic, strong) NSMutableDictionary *callbackMutableParameters;

/**
 * @brief 合作伙伴参数
 */
@property (nonatomic, strong) NSMutableDictionary *partnerMutableParameters;

/**
 * @brief 自定义用户定义的事件标识符
 */
@property (nonatomic, copy, readonly, nonnull) NSString *callbackId;

/**
 * @brief 是否添加回传标识符
 */
@property (nonatomic, assign, readonly) BOOL isSetCallbackId;

/**
 * @brief 创建事件token
 *
 * @param eventToken 在 adjust 后台中创建事件token
 *                   http://adjust.com 长度需要超过6个字符
 */
+ (nullable RXADJEvent *)eventWithEventToken:(nonnull NSString *)eventToken;

/**
 * @brief 记录事件收入
 * @param amount 以单位表示的金额(例如:1.50欧元为1.5欧元)。
 * @param currency 采用ISO 4217格式的货币字符串。
 * 它应该是3个字符长(例如:1.50欧元是@“EUR”)。
 * @note 事件可以包含一些收入。收入是以单位计算的。
 * 必须包含ISO 4217格式的货币。
 */
- (void)setRevenue:(double)amount currency:(nonnull NSString *)currency;

/**
 * @brief 设置应用内购买的交易ID，以避免收入重复。
 * @note 交易ID可以用来避免重复的收入事件。最后十个事务标识符被记住。
 * @param transactionId 用于避免重复收入事件的标识符。
 */
- (void)setTransactionId:(nonnull NSString *)transactionId;

/**
 * @brief 添加回传参数
 * @param key 回调URL中的字符串键。
 * @param value 回调URL中键的字符串值。
 *
 * @note 在 adjust 后台中 http://adjust.com 可以分配一个回调URL给每个 事件类型。该URL将在每次触发事件时被调用。
 * 添加回调参数到下面的方法将被转发到这些回调。
 */
- (void)addCallbackParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/**
 * @brief 添加合作伙伴参数
 *
 * @param key 要转发给合作伙伴的字符串密钥
 * @param value 要转发给伙伴的密钥的字符串值
 */
- (void)addPartnerParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/**
 * @brief 添加回传标识符
 *
 * @param callbackId 自定义用户定义的事件标识符
 */
- (void)setCallbackId:(nonnull NSString *)callbackId;

@end

NS_ASSUME_NONNULL_END
