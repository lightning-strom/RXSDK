//
//  RXIMGroupService.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/6.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"
NS_ASSUME_NONNULL_BEGIN

@interface RXIMGroupService : NSObject

/**
 * 获取群组操作SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/** ###### 以下为扩展业务（暂不支持）######  */
/**
 * 群邀请人
 */
- (void)groupInviteMembers:(NSArray * _Nonnull)members
                     covId:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 群踢人
 * @param members 被踢的群成员数组
 * @param covId 会话id
 */
- (void)groupKickMembers:(NSArray * _Nonnull)members
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置群管理员(全量操作，添加和删除)
 * @param managers 管理员数组
 * @param covId 会话id
 */
- (void)setGroupManagers:(NSArray * _Nonnull)managers
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 转让群主
 * @param owner 新群主
 * @param covId 会话id
 */
- (void)transferGroupOwner:(NSString * _Nonnull)owner
                     covId:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置自己在群里的昵称
 * @param covId 会话id
 * @param nickname 昵称
 */
- (void)setNicknameInCov:(NSString *)covId
                nickname:(NSString *)nickname
       completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置群名称
 * @param covId 会话id
 * @param groupName 群名
 */
- (void)setGroupNameWithCovId:(NSString *)covId
                    groupName:(NSString *)groupName
            completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置群名称
 * @param covId 会话id
 * @param groupDesc 群描述
 */
- (void)setGroupDescWithCovId:(NSString *)covId
                    groupDesc:(NSString *)groupDesc
            completionHandler:(void (^)(RXIMError *error))completionHandler;


@end

NS_ASSUME_NONNULL_END
