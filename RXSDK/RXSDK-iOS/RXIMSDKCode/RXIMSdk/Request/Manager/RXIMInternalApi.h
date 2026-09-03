//
//  RXIMInternalApi.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import <Foundation/Foundation.h>
#import <RXNetworkingKit/RXNetworkingKit.h>
#import "RXIMJoinSession.h"
#import "RXIMMsgConvTipsContent.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMSearchRequestModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMInternalApi : NSObject
/**
 * 刷新token
 * @param refreshToken 刷新token
 */
+ (RXCommonRequest *)buildRefreshTokenRequestWithRefreshToken:(NSString * _Nullable)refreshToken;

/**
 * 获取/更换entry地址
 * @param oldEntryAddress 上一个地址
 */

+ (RXCommonRequest *)buildGetEntryAddressWithOldEntryAddress:(NSArray *)oldEntryAddress;

/**
 * 创建会话
 * @param conversationId 会话id
 * @param option 选项
 * @param creatorOption 创建者选项
 * @param members 成员
 * @param groupName 群名
 * @param groupDesc 群描述
 * @param ext 扩展字段
 * @param imsExt 内部扩展字段
*/
+ (RXCommonRequest *)buildCreatConversation:(NSString * _Nonnull)conversationId
                                     option:(NSInteger)option
                              creatorOption:(NSInteger)creatorOption
                                    members:(NSArray * _Nullable)members
                                  groupName:(NSString * _Nullable)groupName
                                  groupDesc:(NSString * _Nullable)groupDesc
                                        ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                     imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt;

/**
 * 更新会话数据
 * @param conversationId 会话id
 * @param option 选项
 * @param ext 扩展字段
 * @param imsExt 内部扩展字段
 * @param evType 事件类型 位运算
 * @param creator 新的群主
 */
+ (RXCommonRequest *)buildUpdateConversationInfo:(NSString * _Nonnull)conversationId
                                          option:(NSInteger)option
                                             ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                          imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt
                                          evType:(NSInteger)evType
                                         creator:(NSString * _Nullable)creator;

/**
 * 删除或解散会话
 * @param conversationId 会话id
 */
+ (RXCommonRequest *)buildDeleteConversation:(NSString * _Nonnull)conversationId;

/**
 * 获取会话信息
 * @param conversationId 会话id
 */
+ (RXCommonRequest *)buildGetConversationInfo:(NSString * _Nonnull)conversationId;

/**
 * 加入会话
 * @param joinSession 加入会话模型
 */
+ (RXCommonRequest *)buildJoinConversation:(RXIMJoinSession *)joinSession;

/**
 * 离开会话
 * @param conversationIds 会话id
 */
+ (RXCommonRequest *)buildLeaveConversations:(NSArray * _Nonnull)conversationIds tips:(RXIMMsgConvTipsContent * _Nullable)tips;

/**
 * 更新用户在会话中信息
 * @param conversationId 会话id
 * @param option 选项
 * @param ext 扩展字段
 * @param imsExt 内部扩展字段
 * @param topTimestamp 置顶时间戳
 * @param silent 免打扰
 */
+ (RXCommonRequest *)buildUpdateUserInfoToConversation:(NSString * _Nonnull)conversationId
                                                option:(NSInteger)option
                                                   ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                                imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt
                                             eventType:(NSInteger)eventType
                                          topTimestamp:(NSInteger)topTimestamp
                                                silent:(BOOL)silent
                                          cancelTopMsg:(NSString * _Nullable)cancelTopMsg;

/**
 * 获取会话列表
 */
+ (RXCommonRequest *)buildGetConversationList;

/**
 * 删除会话消息
 * @param msgIds 消息数组
 * @param covId 会话id
 */
+ (RXCommonRequest *)buildDeleteServerMsgs:(NSArray *)msgIds
                                     covId:(NSString *)covId;

/**
 * 更新服务器消息扩展字段
 * @param msgIds 消息id数组（单次最多20条）
 * @param target 会话id
 * @param ext 扩展字段
 */
+ (RXCommonRequest *)buildUpdateServerMessageExt:(NSArray * _Nonnull)msgIds
                                          target:(NSString * _Nonnull)target
                                             ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                          imsExt:(NSDictionary <NSString *,NSString *> * _Nullable)imsExt;
;

/**
 * 置顶/取消置顶会话内消息
 * @param msgId 消息id
 * @param target 会话id
 * @param state 置顶/取消置顶
 */
+ (RXCommonRequest *)buildTopMessageInConversation:(NSString *)target
                                             msgId:(NSString *)msgId
                                             state:(NSInteger)state;

/**
 * 设置群管理员
 * @param covId 会话id
 * @param managers 管理员数组
 */
+ (RXCommonRequest *)buildSetGroupManagers:(NSArray *)managers
                                     covId:(NSString *)covId;

/**
 * 群踢人
 * @param covId 会话id
 * @param members 群成员数组
 */
+ (RXCommonRequest *)buildGroupKickMembers:(NSArray *)members
                                     covId:(NSString *)covId;

/**
 * 群邀请人
 * @param covId 会话id
 * @param members 群成员数组
 */
+ (RXCommonRequest *)buildGroupInviteMembers:(NSArray *)members
                                     covId:(NSString *)covId;

/**
 * 添加收藏
 * @param msgIds 消息id数组
 */
+ (RXCommonRequest *)buildAddCollection:(NSArray *)msgIds;

/**
 * 删除收藏
 * @param msgIds 消息id数组
 */
+ (RXCommonRequest *)buildDeleteCollection:(NSArray *)msgIds;

/**
 * 获取收藏列表
 */
+ (RXCommonRequest *)buildGetCollectionList;

/**
 * 通过消息id获取收藏消息信息
 * @param msgIds 消息id数组
 */
+ (RXCommonRequest *)buildGetCollectionMsgs:(NSArray *)msgIds;

/**
 * 设置自己在群里的昵称
 * @param covId 会话id
 * @param nickname 昵称
 */
+ (RXCommonRequest *)buildSetNicknameInCov:(NSString *)covId
                                  nickname:(NSString *)nickname;

/**
 * 设置群名称
 * @param covId 会话id
 * @param groupName 群名
 */
+ (RXCommonRequest *)buildSetGroupNameWithCovId:(NSString *)covId
                                      groupName:(NSString *)groupName;

/**
 * 设置群描述
 * @param covId 会话id
 * @param groupDesc 群描述
 */
+ (RXCommonRequest *)buildSetGroupDescWithCovId:(NSString *)covId
                                      groupDesc:(NSString *)groupDesc;


/**
 * 获取RTC 鉴权信息
 */
+ (RXCommonRequest *)buildGetRtcAuthInfo:(NSString *)channelId;

/**
 * 消息搜索
 */
+ (RXCommonRequest *)buildSearchMessage:(RXIMSearchRequestModel *)model;

@end

NS_ASSUME_NONNULL_END
