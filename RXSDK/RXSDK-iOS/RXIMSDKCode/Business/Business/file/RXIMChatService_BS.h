//
//  RXIMChatService_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//


#import <Foundation/Foundation.h>
@import RXIMSdk_business.RXIMChatService;
@import RXIMSdk_business.RXIMSendMessage;
@import RXIMSdk_business.RXIMHistoryMsgResp;
@import RXIMSdk_business.RXIMError;

NS_ASSUME_NONNULL_BEGIN

@interface RXIMChatService_BS : RXIMChatService <RXIMMessageDelegate>

/**
 * 获取聊天SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/** 服务器操作 */

/**
 * 同步消息
 */
-(void)syncMessage;

/**
 * 发送消息
 * @param sendMessage 发送的消息对象
 * @param completionHandler 返回消息对象，处理本地逻辑用，发送成功以delegate方式回调。
 */
- (void)sendMessage:(RXIMSendMessage * _Nonnull)sendMessage
  completionHandler:(void (^)(RXIMMessage * message,RXIMError *error))completionHandler;

/**
 * 重发消息
 * @param message 发送的消息对象
 * @param completionHandler 返回消息对象，处理本地逻辑用，发送成功以delegate方式回调。
 */
- (void)resendMessage:(RXIMMessage * _Nonnull)message
  completionHandler:(void (^)(RXIMMessage * message,RXIMError *error))completionHandler;

/**
 * 转发消息
 * @param mids 消息id数组
 * @param receives 会话id数组
 * @param type 转发类型 1：单条转发 2：逐条转发 3：合并转发
 * @param note 留言
 * @Param exts 扩展数组
 * @param option 消息选项
 * @param completionHandler 返回消息对象，处理本地逻辑用，发送成功以delegate方式回调。
 */
- (void)forwardMessage:(NSArray * _Nonnull)mids
              receives:(NSArray * _Nonnull)receives
                  type:(NSInteger)type
                  note:(NSString * _Nullable)note
                   ext:(NSArray * _Nullable)exts
                option:(NSInteger)option
     completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler;

/**
 * 消息已读
 * @param message 已读的消息体
 * @param completionHandler 返回消息处理是否正常，发送成功以delegate方式回调。
 */
- (void)hasReadMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 消息撤回
 * @param message 撤回的消息体
 * @param completionHandler 返回消息处理是否正常，发送成功以delegate方式回调。
 */
- (void)revokeMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 获取服务端历史消息
 * @param msgId 消息锚点
 * @param target 会话id
 * @param limit 查询数量，最多一次拉取50条
 */
- (void)fetchHistoryMessages:(NSString * _Nullable)msgId
                            target:(NSString * _Nonnull)target
                             limit:(NSInteger)limit;

/**
 * 更新服务器消息扩展字段
 * @param msgIds 消息id数组（单次最多20条）
 * @param target 会话id
 * @param ext 扩展字段
 * @param completionHandler  更新结果（成功/失败）。
 */
- (void)updateServerMessageExt:(NSArray * _Nonnull)msgIds
                        target:(NSString * _Nonnull)target
                           ext:(NSDictionary<NSString *,NSString *> * _Nonnull)ext
             completionHandler:(void (^)(RXIMError *error))completionHandler;
                        

/** 本地数据库操作 */
/**
 * 获取本地历史消息
 * @param msgId 消息锚点
 * @param target 会话id
 * @param sessionType 会话类型
 * @param limit 查询数量
 * @param completionHandler 返回的消息数组。
 */
- (void)getHistoryMessages:(NSString * _Nullable)msgId
                                 target:(NSString * _Nonnull)target
                            sessionType:(RXIMSessionType)sessionType
                                  limit:(NSInteger)limit
                                 isUrgent:(BOOL)isurgent
                      completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler;

/**
 * 通过消息id获取消息体
 * @param msgId 消息id
 */
-(RXIMMessage *)getMessageWithMsgId:(NSString * _Nonnull)msgId;

/**
 * 更新本地消息扩展字段
 * @param msgIds 消息id数组
 * @param ext 扩展字段
 * @return 更新是否成功
 */
- (BOOL)updateLocalMessageExt:(NSArray * _Nonnull)msgIds
                     ext:(NSDictionary<NSString *,NSString *> * _Nonnull)ext;

/**
 * 设置语音消息已播放
 * @param msgId 消息id
 * @return 设置是否成功
 */
- (BOOL)setAudioMessagePlayed:(NSString *)msgId;

@end

NS_ASSUME_NONNULL_END
