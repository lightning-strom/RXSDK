//
//  RXIMWCDB.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/3/10.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"
#import "RXIMSession.h"
#import "RXIMSessionService.h"
#import "RXIMReplyEmoji.h"

@class WCTDatabase;
@interface RXIMWCDB : NSObject

//为外界使用，特意挪出
@property (nonatomic,strong) WCTDatabase *databaseOrigin;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 判断数据库是否存在
 */
-(BOOL)isExistDB;

/**
 * 创建数据库
 */
-(void)createDB;

/**
 * 判断消息是否存在
 */
-(BOOL)isExistMsg:(NSString *)msgId;

// ***********************增*********************
/**
 * 插入单条消息
 */
-(BOOL)insertMsg:(RXIMMessage *)message;

/**
 * 插入多条消息
 */
-(BOOL)insertMsgs:(NSArray<RXIMMessage *> *)messages;

/**
 * 插入单个会话
 */
-(BOOL)insertSession:(RXIMSession *)session;

/**
 * 插入多个会话
 */
-(BOOL)insertSessions:(NSArray<RXIMSession *> *)sessions;


// ***********************删*********************
/**
 * 删除单条消息
 */
-(BOOL)deleteMsgWithMsgId:(NSString *)msgId;

/**
 * 删除单条消息
 */
-(BOOL)deleteMsgWithLocalId:(NSString *)localId;

/**
 * 删除单个会话消息
 */
-(BOOL)deleteMsgsWithTarget:(NSString *)target;

/**
 * 删除单个会话
 */
-(BOOL)deleteSessionWithTarget:(NSString *)target;

/**
 * 删除群信息
 */
-(BOOL)deleteGroupInfoWithGroupId:(NSString *)groupId;

/**
 * 删除渠道消息
 */
-(BOOL)deleteMsgsWithSessionType:(RXIMSessionType)sessionType;

/**
 * 删除某个渠道
 */
-(BOOL)deleteSessionWithSessionType:(RXIMSessionType)sessionType;

// ***********************改*********************
/**
 * 更新消息发送状态
 */
-(BOOL)updateMsgWithMsgStatus:(RXIMMsgStatus)status localId:(NSString *)localId;

/**
 * 更新消息id、消息状态、时间戳
 */
-(BOOL)updateMsgWithMsgId:(NSString *)msgId inboxId:(NSInteger)inboxId status:(RXIMMsgStatus)status timestamp:(NSInteger)timestamp localId:(NSString *)localId;

/**
 * 更新消息时间戳
 */
-(BOOL)updateMsgWithTimestamp:(NSInteger)timestamp localId:(NSString *)localId;

/**
 * 更新消息已读状态
 */
-(BOOL)updateMsgWithIsRead:(BOOL)isRead msgId:(NSString *)msgId;

/**
 * 更新消息撤回状态
 */
-(BOOL)updateMsgWithIsRevoke:(BOOL)isRevoke msgId:(NSString *)msgId;

/**
 * 更新消息加急状态
 */
-(BOOL)updateMsgWithIsUrgent:(BOOL)isUrgent millits:(NSInteger)millits toMembers:(NSArray *)toMembers msgId:(NSString *)msgId;

/**
 * 更新消息标记状态
 */
-(BOOL)updateMsgWithIsMark:(BOOL)isMark msgId:(NSString *)msgId;

/**
 * 更新回复表情消息
 */
-(BOOL)updateMsgWithReplyEmoji:(NSArray<RXIMReplyEmoji*> *)emoji msgId:(NSString *)msgId;

/**
 * 更新消息删除状态
 */
-(BOOL)updateMsgWithIsDelete:(BOOL)isDelete msgId:(NSString *)msgId;

/**
 * 更新消息内容
 */
-(BOOL)updateMsgWithContent:(NSString *)content msgId:(NSString *)msgId;

/**
 * 更新消息未读数
 */
-(BOOL)updateMsgWithUnreadCount:(NSInteger)unreadCount msgId:(NSString *)msgId;

/**
 * 更新第一条未读消息id
 */
-(BOOL)updateSessionWithFirstRedPointMsgId:(NSString *)msgId target:(NSString *)target;

/**
 * 更新消息已读的id数组
 */
-(BOOL)updateMsgWithReadArr:(NSArray *)readArr msgId:(NSString *)msgId;

/**
 * 更新消息扩展字段
 */
-(BOOL)updateMsgWithExt:(NSDictionary *)ext msgId:(NSString *)msgId;

/**
 * 更新引用消息
 */
- (NSArray<RXIMMessage *> *)updateReplyMsgWithOriginMsgId:(NSString *)msgId target:(NSString *)target;

/**
 * 更新会话最后一条消息
 */
-(BOOL)updateSessionWithLastMsg:(RXIMMessage *)msg target:(NSString *)target;

/**
 * 更新会话未读数
 */
-(BOOL)updateSessionWithRedPoint:(NSInteger)redPoint target:(NSString *)target;

/**
 * 更新会话信息
 */
-(BOOL)updateSessionWithExt:(NSDictionary *)ext option:(NSInteger)option evType:(NSInteger)evType creator:(NSString *)creator target:(NSString *)target;

/**
 * 更新用户会话信息
 */
-(BOOL)updateSessionWithUserExt:(NSDictionary *)userExt
                     userImsExt:(NSDictionary *)userImsExt
                     userOption:(NSInteger)userOption
                   topTimestamp:(NSInteger)topTimestamp
                         silent:(BOOL)silent
                         topMsg:(NSString *)topMsg
                     topMsgUser:(NSString *)topMsgUser
                         target:(NSString *)target
                      eventType:(NSInteger)eventType;

/**
 * 更新会话扩展字段
 */
-(BOOL)updateSessionWithExt:(NSDictionary *)ext target:(NSString *)target;

/**
 * 更新会话成员
 */
-(BOOL)updateSessionWithMembers:(NSArray *)members target:(NSString *)target state:(NSInteger)state;

/**
 * 更新群管理员
 */
-(BOOL)updateSessionWithManagers:(NSMutableDictionary *)managers target:(NSString *)target;

/**
 * 更新会话归档状态
 */
- (BOOL)updateSessionWithIsArchive:(BOOL)state target:(NSString *)target;

/**
 * 更新自己在群里的群昵称
 */
- (BOOL)updateSessionWithNickname:(NSString *)nickname userId:(NSString *)userId target:(NSString *)target;

/**
 * 更新群名称
 */
- (BOOL)updateGroupName:(NSString *)groupName target:(NSString *)target;

/**
 * 更新群描述
 */
- (BOOL)updateGroupDesc:(NSString *)groupDesc target:(NSString *)target;

/**
 * 更新@我状态
 */
//-(BOOL)updateSessionWithIsATMe:(BOOL)isATMe target:(NSString *)target;

// ***********************查*********************
/**
 * 获取单条消息（msgid）
 */
-(RXIMMessage *)getMsgWithMsgid:(NSString *)msgId;

/**
 * 获取单条消息（localid）
 */
-(RXIMMessage *)getMsgWithLocalId:(NSString *)localId;

/**
 * 获取单条消息（inboxId）
 */
-(RXIMMessage *)getMsgWithinboxId:(NSInteger)inboxId;

/**
 * 获取历史消息
 */
-(NSArray *)getMsgsWithMsgId:(NSString *)msgId timestamp:(NSInteger)timestamp target:(NSString *)target limit:(NSInteger)limit isAfterTimestamp:(BOOL)isAfterTimestamp;

/**
 * 获取多媒体消息
 */
-(NSArray *)getMediaMsgsWithTarget:(NSString *)target;

/**
 * 获取会话最后一条消息
 */
-(RXIMMessage *)getLastMsgWithTarget:(NSString *)target;

/**
 * 获取单个会话
 */
-(RXIMSession *)getSessionWithTarget:(NSString *)target;

/**
 * 获取所有会话
 */
-(NSArray *)getAllSession;

// ***********************搜索*********************
// 全文检索
/**
 * 搜索文本消息
 */
-(NSArray *)searchTextMsg:(NSString *)searchStr;

-(NSArray<RXIMMessage *> *)searchMessagesWithKeyword:(NSString *)keyword;

/**
 * 搜索单个会话文本消息
 */
-(NSArray *)searchTextMsgWithTarget:(NSString *)target searchStr:(NSString *)searchStr;

/**
 * 搜索图片消息
 */
-(NSArray *)searchPicMsg:(NSString *)target;

/**
 * 搜索所有文件
 */
-(NSArray *)searchAllFileMsg;

/**
 * 搜索会话文件消息
 */
-(NSArray *)searchFileMsgWithTarget:(NSString *)target;

/**
 * 搜索会话链接消息
 */
-(NSArray *)searchLinkMsgWithTarget:(NSString *)target;

@end
