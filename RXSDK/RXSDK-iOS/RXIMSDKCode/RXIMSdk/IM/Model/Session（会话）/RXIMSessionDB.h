//
//  RXIMSessionDB.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/3/16.
//

#import <Foundation/Foundation.h>
#import "RXIMSession.h"
#import "RXIMSession.h"
#import "RXIMMessageDB.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSessionDB : NSObject

/** Session ID */
@property(nonatomic, copy) NSString *sessionID;

/** 会话属性，位运算 */
@property (nonatomic,assign) NSInteger attr;

/** 会话选项，位运算 */
@property (nonatomic,assign) NSInteger option;

/** 会话创建毫秒时间戳 */
@property (nonatomic,assign) NSInteger createTimestamp;

/** 会话最后更新的毫秒时间戳 */
@property (nonatomic,assign) NSInteger updateTimestamp;

/** 会话创建者 */
@property (nonatomic,copy) NSString *creator;

/** 会话cp扩展字段 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *ext;

/** 会话成员列表 */
@property (nonatomic, strong) NSArray *members;

/** 会话类型 */
@property (nonatomic, assign) RXIMSessionType type;

/** 会话状态 */
@property (nonatomic, assign) NSInteger status;

/** 用户cpid */
@property (nonatomic, assign) NSInteger cpid;

/** 用户加入时间啊 */
@property (nonatomic, assign) NSInteger joinTimestamp;

/** 会话属性，位运算 */
@property (nonatomic,assign) NSInteger userAttr;

/** 会话选项，位运算 */
@property (nonatomic,assign) NSInteger userOption;

/** 用户cp扩展字段 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *userExt;

/** 最后一条消息 */
@property(nonatomic, strong) NSString *lastMessage;

/** 未读消息数 */
@property (nonatomic, assign) NSInteger unreadCount;

/** 阅后即焚的超时时间，单位毫秒 */
@property (nonatomic, assign) NSInteger snapchatTimeout;

/** 置顶时间戳 */
@property (nonatomic, assign) NSInteger topTimestamp;

/** 是否免打扰 */
@property (nonatomic, assign) BOOL silent;

/** 是否标记 */
@property (nonatomic, assign) BOOL isMark;

/** 是否归档 */
@property (nonatomic, assign) BOOL isArchive;

/** 置顶的消息id */
@property (nonatomic, strong) NSString *topMsg;

/** 由谁置顶的消息 */
@property (nonatomic, strong) NSString *topMsgUser;

/** 群名称 */
@property (nonatomic, strong) NSString *groupName;

/** 群描述 */
@property (nonatomic, strong) NSString *groupDesc;

/** 第一条未读消息id */
@property (nonatomic, copy) NSString * firstUnreadMsgId;
@end

NS_ASSUME_NONNULL_END
