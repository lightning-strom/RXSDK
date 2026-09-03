//
//  RXIMMessage.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"

NS_ASSUME_NONNULL_BEGIN


@interface RXIMMessageDB : NSObject

/** 发送人id */
@property(nonatomic, copy) NSString *fromId;

/** 接收人id */
@property(nonatomic, copy) NSString *toId;

/** 目标id 单聊为对方id，群聊为群id */
@property(nonatomic, copy) NSString *sessionID;

/** 接收人列表。对于群聊标@列表*/
@property (nonatomic, copy) NSMutableArray *receivers;

/** 会话类型 */
@property (nonatomic, assign) RXIMSessionType sessionType;

/** 消息类型 */
@property(nonatomic, assign) RXIMMessageType msgType;

/** 消息状态 */
@property(nonatomic, assign) RXIMMsgStatus status;

/** 消息属性，位运算组合，只读*/
@property (nonatomic, assign) NSInteger attr;

/** 消息选项 RXIMMsgOption 位运算组合  */
@property (nonatomic, assign) NSInteger option;

/** 子消息类型 */
@property(nonatomic, assign) NSInteger subType;

/** 发送人客户端类型 */
@property(nonatomic, assign) NSInteger clientType;

/** 服务端唯一消息号 */
@property(nonatomic, copy) NSString *msgId;

/** 消息发送者本地消息序号, 仅在客户端发送消息时有值 */
@property(nonatomic, copy) NSString *localId;

/** 当前用户同步序列号 */
@property (nonatomic,assign) NSInteger inboxId;

/** 时间戳, 精确到毫秒 */
@property(nonatomic, assign) NSInteger timestamp;

/** 推送信息(json) */
@property(nonatomic, copy) NSString *pushBody;

/** 扩展信息 */
@property(nonatomic, copy) NSDictionary<NSString *,NSString *> *ext;

/** 消息内容 */
@property (nonatomic, strong) NSString *content;

/** 搜索内容 */
@property (nonatomic, strong) NSString *contentStr;

/** 用户在该消息中的接收者编号 */
@property (nonatomic, assign) NSInteger receiverNum;

/** 是否为撤回消息 */
@property (nonatomic, assign) BOOL isRecall;

/** 消息未读数 */
@property (nonatomic, assign) NSInteger unreadCount;

/** 已读用户数组 */
@property (nonatomic, strong) NSArray *readIdArr;

/** 阅后即焚的超时时间，单位毫秒 */
@property (nonatomic, assign) NSInteger snapchatTimeout;

/** 是否加急*/
@property (nonatomic, assign) BOOL isUrgent;

/** 加急的毫秒时间戳 */
@property (nonatomic, assign) NSInteger urgentMillits;

/** 加急的接收者数组 */
@property (nonatomic, strong) NSArray *urgentToMembers;

/** 是否标记 */
@property (nonatomic, assign) BOOL isMark;

/** 回复表情数组 */
@property (nonatomic, strong) NSArray * replyEmoji;

@end

NS_ASSUME_NONNULL_END
