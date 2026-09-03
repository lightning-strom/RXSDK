//
//  RXApiManager.h
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMApiUrl : NSObject

/** 登陆 url  测试用*/
+ (NSString *)getLoginUrl;
/** 初始化 url */
+ (NSString *)getInitUrl;
/** 刷新token url */
+ (NSString *)getRefreshTokenUrl;
/** 创建会话 url */
+ (NSString *)creatSessionUrl;
/** 更新会话消息 url */
+ (NSString *)updateSessionUrl;
/** 删除会话 url */
+ (NSString *)deleteSessionUrl;
/** 获取会话信息 url */
+ (NSString *)getSessionUrl;
/** 加入会话 url */
+ (NSString *)joinSessionUrl;
/** 离开会话 url */
+ (NSString *)leaveSessionUrl;
/** 更新用户在会话内信息 url */
+ (NSString *)updateUserDataSessionUrl;
/** 获取会话列表 url */
+ (NSString *)getSessionListUrl;
/** 删除会话消息 */
+ (NSString *)deleteSessionMsgUrl;
/** 更新消息扩展字段 */
+ (NSString *)updateMsgExtUrl;
/** 置顶会话内消息 */
+ (NSString *)topConversationMsgUrl;
/** 设置群管理员 */
+ (NSString *)setGroupManagersUrl;
/** 群踢人 */
+ (NSString *)groupkickMembersUrl;
/** 群邀请人 */
+ (NSString *)groupInviteMembersUrl;
/** 添加收藏 */
+ (NSString *)addCollectionUrl;
/** 删除收藏 */
+ (NSString *)deleteCollectionUrl;
/** 获取收藏消息id列表 */
+ (NSString *)getCollectionListUrl;
/** 通过id获取收藏消息信息 */
+ (NSString *)getCollectionMsgsUrl;
/** 设置自己在群里的昵称 */
+ (NSString *)setNicknameInConvUrl;
/** 获取RTC鉴权信息  */
+ (NSString *)getRtcAutoInfoUrl;
/** 搜索消息 */
+ (NSString *)searchMessageUrl;
/** 设置群名称 */
+ (NSString *)setGroupNameUrl;
/** 设置群描述 */
+ (NSString *)setGroupDescUrl;

@end

NS_ASSUME_NONNULL_END
