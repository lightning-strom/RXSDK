//
//  RXIMChatService+Inner.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//

//#import <RXIMSdk/RXIMSdk.h>
#ifdef RXIMSDK
#import <RXIMSdk/RXIMSdk.h>
#else
#import <RXIMSdk_business/RXIMSdk_business.h>
#endif

@interface RXIMChatService (Inner)

/**
 * 接收消息处理
 */
- (void)receiveMessageHandle:(NSArray *)msgs;

/**
 * 获取离线消息
 * @param startInboxId 起始同步序列号
 * @param endInboxId 结束同步序列号（选填）
 * @param limit 会话id
 */
- (void)getServerOfflineMsgWithStartinboxId:(NSInteger)startInboxId
                                 endinboxId:(NSInteger)endInboxId
                                        limit:(NSInteger)limit;


/**
 * 加入会话发送自定义消息
 * @param state  1：加入会话 0 离开会话
 * @param covId 会话id
 * @param covType 会话类型
 */

-(void)sendCovCustomMsg:(NSInteger)state covId:(NSString *)covId covType:(RXIMSessionType)covType;

/**
 * 获取本地id
 */
-(NSString *)getLocalIdStr;

/**
 * 缓存消息
 */
- (void)saveTmpMessage:(RXIMMessage *)msg;

/**
 * 发送消息
 */
- (void)sendMessage:(RXIMMessage *)message;

/**
 * 处理撤回消息的引用消息
 */
- (void)handleReplyMsgFromRecallMsg:(NSString *)msgId target:(NSString *)target;

@end
