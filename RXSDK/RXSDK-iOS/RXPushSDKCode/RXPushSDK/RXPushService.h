//
//  RXPushService.h
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RXPushDelegate <NSObject>

/**
 * 点击通知栏进入app
 */
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void(^)(void))completionHandler
                                 API_AVAILABLE(ios(10.0));

/**
 * app在前台接到通知
 */
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
         willPresentNotification:(UNNotification *)notification
           withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
                                 API_AVAILABLE(ios(10.0));

@end

@interface RXPushService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化SDK
 * @param productId 产品id
 * @param channelId 渠道id
 * @param cpid 客户端id
 * @param baseUrlList 请求域名队列
 */
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList;

/**
 * 注册通知
 */
- (void)initUserNotificationCenter:(id<RXPushDelegate>)delegate;

/**
 * 上传deviceToken
 * 登录后调用
 * @param deviceToken APNS返回的设备码  必须
 */
- (void)registerDeviceToken:(NSData *)deviceToken;

/**
 * 上传deviceToken
 * 登录后调用
 * @param deviceToken APNS返回的设备码  必须
 * @param complete 回调结果
 */
- (void)registerDeviceToken:(NSData *)deviceToken
                   complete:(void(^)(NSDictionary *response, NSDictionary *error))complete;

/**
 * 绑定别名
 * 登录后调用
 * @param alias 别名  必须
 */
- (void)bindingAlias:(NSString *)alias;

/**
 * 解绑别名
 * 登录后调用
 */
- (void)reliveBinding;

/**
 * 增加用户标签
 * 登录后调用
 * @param tags 标签数组 一个用户最多绑定10个标签  必须
 */
- (void)addTags:(NSArray *)tags;

/**
 * 移除用户标签
 * 登录后调用
 * @param tags 标签数组
 */
- (void)deleteTags:(NSArray *)tags;

/**
 * 解绑用户与渠道SDK的关联
 * 登录后调用
 */
- (void)reliveBindingPushDevice;

/**
 * 消息接收统计
 * 登录后调用
 * @param userInfo 推送参数
 */
- (void)pushReceivedWithUserInfo:(NSDictionary *)userInfo;
- (void)pushReceivedWithUserInfo1:(NSDictionary *)userInfo
                         complete:(void(^)(NSString *msg))complete;

/**
 * 设置角标badge数量
 * @note 0 为清空角标
 */
- (void)setApplicationIconBadgeNumber:(NSInteger)badgeNumber;

/**
 * 获取推送内容
 */
- (NSDictionary *)getClickPushInfo;

@end

NS_ASSUME_NONNULL_END
