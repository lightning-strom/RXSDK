//
//  RXIMSessionService.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/16.
//

#import <Foundation/Foundation.h>
#import "RXIMSession.h"
#import "RXIMError.h"
#import "RXIMJoinSession.h"
#import "RXIMMsgConvTipsContent.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RXIMSessionServiceDelegate <NSObject>
@optional
/**
 * 会话最后一条消息变更
 * @param sessions 会话数组
 */
- (void)onSessionLastMessageChanged:(NSArray<RXIMSession *> *)sessions;

/**
 * 会话未读消息数变更
 * @param sessions 会话数组
 */
- (void)onSessionUnreadCountChanged:(NSArray<RXIMSession *> *)sessions;

/** 会话扩展字段变更
 * @param session 会话
 */
- (void)onSessionInfoChanged:(RXIMSession *)session;

/**
 * 会话内成员变更回执（全量）
 * @param session 会话
 */
- (void)onSesssionMembersChange:(RXIMSession *)session;

/**
 * 会话删除回执
 * @param session 会话
 */
- (void)onSessionDelete:(RXIMSession *)session;

@end

@interface RXIMSessionService : NSObject

@property (nonatomic, weak) id <RXIMSessionServiceDelegate> delegate;

/**
 * 获取会话SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/** 服务器操作 */
/**
* 创建会话
* @param covId 会话id
* @param option 选项
* @param creatorOption 创建者选项
* @param members 成员
* @param ext 扩展字段
*/
- (void)creatConversation:(NSString * _Nonnull)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray * _Nullable)members
                      ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
* 创建会话
* @param covId 会话id
* @param option 选项
* @param creatorOption 创建者选项
* @param members 成员
* @param groupName 群名
* @param groupDesc 群描述
* @param ext 扩展字段
*/
- (void)creatConversation:(NSString * _Nonnull)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray * _Nullable)members
                groupName:(NSString * _Nullable)groupName
                groupDesc:(NSString * _Nullable)groupDesc
                      ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 获取服务器会话列表
 */
- (void)fetchConversationList:(void (^)(NSArray<RXIMSession *> *sessionInfoAry,RXIMError *error))completionHandler;

/**
 * 更新会话扩展字段
 * @param covId 会话id
 * @param option 选项
 * @param ext 扩展字段
 */
- (void)updateConversationInfo:(NSString * _Nonnull)covId
                        option:(NSInteger)option
                           ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
              completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 删除或解散会话
 * @param covId 会话id
 */
- (void)disbandConversation:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 获取会话信息
 * @param covId 会话id
 */
- (void)fetchConversationInfo:(NSString * _Nonnull)covId
          completionHandler:(void (^)(RXIMSession *session,RXIMError *error))completionHandler;

/**
 * 加入会话
 * @param joinSession 加入会话数组
 */
- (void)joinConversation:(RXIMJoinSession * _Nonnull)joinSession
        completionHandler:(void (^)(RXIMError *error))completionHandler;

#pragma mark -【可弃用】
/**
 * 离开会话
 * @param covIds 会话id数组
 */
- (void)leaveConversations:(NSArray * _Nonnull)covIds
         completionHandler:(void (^)(RXIMError *error))completionHandler DEPRECATED_MSG_ATTRIBUTE("use leaveConversations:tips:completionHandler: instead");

/**
 * 离开会话（带tips）
 * @param covIds 会话id数组
 * @param tips 会话内提示内容
 */
- (void)leaveConversations:(NSArray * _Nonnull)covIds
                      tips:(RXIMMsgConvTipsContent * _Nullable)tips
         completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 更新用户在会话中扩展字段
 * @param covId 会话id
 * @param option 选项
 * @param ext 扩展字段
 */
- (void)updateUserInfoInConversation:(NSString * _Nonnull)covId
                              option:(NSInteger)option
                                 ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                    completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置阅后即焚超时时间
 * @param timeout 超时时间（毫秒） 0：取消阅后即焚 >0:阅后即焚超时时间
 * @param covId 会话id
 */
- (void)setSnapchatTimeout:(NSInteger)timeout
                        covId:(NSString *)covId
            completionHandler:(void (^)(RXIMError *error))completionHandler;


/** 本地数据库操作 */
/**
 * 获取本地所有会话列表
 */
-(NSArray *)getConversationList;

/**
 * 根据会话id获取会话
 * @param covId 会话id
 */
- (RXIMSession *)getConversationInfo:(NSString * _Nonnull)covId;

/**
 * 获取会话最后一条消息
 * @param covId 会话id
 */
-(RXIMMessage *)getLatestMessage:(NSString * _Nonnull)covId;

/**
 * 删除本地单个会话
 * @param covId 会话id
*/
- (BOOL)deleteLocalConversation:(NSString * _Nonnull)covId;

/**
 * 删除本地消息
 * @param msgIds 消息数组
 */
- (BOOL)deleteLocalMessages:(NSArray * _Nonnull)msgIds
                      covId:(NSString *)covId;

/**
 * 清空会话的未读消息数
 * @param covId 会话id
 */
- (BOOL)clearUnReadCount:(NSString * _Nonnull)covId;

/**
 * 清空本地聊天记录
 * @param covId 会话id
 */
- (BOOL)clearLocalMessages:(NSString * _Nonnull)covId;

@end

NS_ASSUME_NONNULL_END
