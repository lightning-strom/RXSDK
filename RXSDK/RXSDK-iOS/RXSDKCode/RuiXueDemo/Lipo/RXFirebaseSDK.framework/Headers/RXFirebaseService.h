//
//  RXFirebaseService.h
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXFirebaseService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化配置
 */
- (void)configure;

/// 事件最多可以有25个参数
/// 以下事件名称是保留的，不能使用:
/// <ul>
///     <li>ad_activeview</li>
///     <li>ad_click</li>
///     <li>ad_exposure</li>
///     <li>ad_query</li>
///     <li>ad_reward</li>
///     <li>adunit_exposure</li>
///     <li>app_clear_data</li>
///     <li>app_exception</li>
///     <li>app_remove</li>
///     <li>app_store_refund</li>
///     <li>app_store_subscription_cancel</li>
///     <li>app_store_subscription_convert</li>
///     <li>app_store_subscription_renew</li>
///     <li>app_update</li>
///     <li>app_upgrade</li>
///     <li>dynamic_link_app_open</li>
///     <li>dynamic_link_app_update</li>
///     <li>dynamic_link_first_open</li>
///     <li>error</li>
///     <li>firebase_campaign</li>
///     <li>first_open</li>
///     <li>first_visit</li>
///     <li>in_app_purchase</li>
///     <li>notification_dismiss</li>
///     <li>notification_foreground</li>
///     <li>notification_open</li>
///     <li>notification_receive</li>
///     <li>os_update</li>
///     <li>session_start</li>
///     <li>session_start_with_rollout</li>
///     <li>user_engagement</li>
/// </ul>
///
/// @param name 事件的名称。应该包含1到40个字母数字字符或下划线。名称必须以字母开头。一些事件名称如下保留。请参阅FIREventNames.h查看保留的事件名称列表。“firebase_”,
///             "google_"和"ga_"前缀是保留的，不应该使用。注意，事件名称是区分大小写，记录两个仅大小写不同的事件将导致
///             两个不同的事件。要手动记录屏幕视图事件，请使用' screen_view '事件名称。
/// @param parameters 事件参数字典。传入' nil '表示该事件没有参数。参数名必须以“”开头，长度不超过40个字符只能包含字母、数字和下划线。只有字符串,
///                  支持Int和Double形参类型。字符串参数值最多可达100个字符。“firebase_”，“google_”和“ga_”前缀是保留的
- (void)logEventWithName:(NSString *)name
              parameters:(nullable NSDictionary<NSString *, id> *)parameters;

/**
 * 设置默认事件参数
 */
- (void)setDefaultEventParameters:(nullable NSDictionary<NSString *, id> *)parameters;

/**
 * 设置用户属性
 */
- (void)setUserPropertyString:(nullable NSString *)value forName:(NSString *)name;

/**
 * 设置用户 ID
 * @param userID 要赋予该设备上该应用程序用户的用户ID，该ID必须为非空，长度不超过256个字符。将userID设置为' nil '将删除用户ID。
 */
- (void)setUserID:(NSString *)userID;

/**
 * 是否启用数据收集
 * @param enable YES 为开启数据收集，NO 为关闭数据收集
 */
- (void)setAnalyticsCollectionEnabled:(BOOL)enable;

/**
 * 获取 instanceID
 */
- (NSString *)getInstanceId;

@end

NS_ASSUME_NONNULL_END
