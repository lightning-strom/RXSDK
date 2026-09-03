//
//  RXGameInfoService.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/1/2.
//

#import <Foundation/Foundation.h>
#import "RXCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXGameInfoService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 游戏区服信息查询
 * @param areaId 区服 id
 */
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RequestComplete)complete;

/**
 * 游戏区服信息修改
 * @param areaId 区服 id
 * @param areaName 区服名
 * @param areaStatus 区服状态
 * @param areaType 区服类型
 * @param extension 扩展字段
 */
- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RequestComplete)complete;

/**
 * 创建游戏区服
 * @param areaId 区服 id
 * @param areaName 区服名
 * @param areaStatus 区服状态
 * @param areaType 区服类型
 * @param extension 扩展字段
 */
- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RequestComplete)complete;

/**
 * 删除游戏区服
 * @param areaId 区服 id
 */
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RequestComplete)complete;

/**
 * 查询区服列表信息
 */
- (void)searchGameAreaListInfoWithComplete:(RequestComplete)complete;

/**
 * 创建角色
 * @param areaId 区服 id
 * @param characterFaction 角色阵营
 * @param characterId 角色id
 * @param characterLevel 角色等级
 * @param characterName 角色名
 * @param characterProfession 角色职业
 * @param characterStatus 角色状态
 * @param characterType 角色类型
 * @param characterVipLevel 角色VIP等级
 * @param cpUserId 游戏用户 id
 * @param extension 扩展字段
 */
- (void)createGameCharacterWithAreaId:(NSString *)areaId
                     characterFaction:(NSString *)characterFaction
                          characterId:(NSString *)characterId
                       characterLevel:(NSString *)characterLevel
                        characterName:(NSString *)characterName
                  characterProfession:(NSString *)characterProfession
                      characterStatus:(NSString *)characterStatus
                        characterType:(NSString *)characterType
                    characterVipLevel:(NSString *)characterVipLevel
                             cpUserId:(NSString *)cpUserId
                            extension:(NSDictionary *)extension
                             complete:(RequestComplete)complete;

/**
 * 修改游戏角色信息
 * @param areaId 区服 id
 * @param characterFaction 角色阵营
 * @param characterId 角色id
 * @param characterLevel 角色等级
 * @param characterName 角色名
 * @param characterProfession 角色职业
 * @param characterStatus 角色状态
 * @param characterType 角色类型
 * @param characterVipLevel 角色VIP等级
 * @param cpUserId 游戏用户 id
 * @param extension 扩展字段
 */
- (void)updateGameCharacterInfoWithAreaId:(NSString *)areaId
                         characterFaction:(NSString *)characterFaction
                              characterId:(NSString *)characterId
                           characterLevel:(NSString *)characterLevel
                            characterName:(NSString *)characterName
                      characterProfession:(NSString *)characterProfession
                          characterStatus:(NSString *)characterStatus
                            characterType:(NSString *)characterType
                        characterVipLevel:(NSString *)characterVipLevel
                                 cpUserId:(NSString *)cpUserId
                                extension:(NSDictionary *)extension
                                 complete:(RequestComplete)complete;

/**
 * 删除游戏区服
 * @param areaId 区服 id
 * @param characterId 角色id
 * @param cpUserId 游戏用户 id
 */
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RequestComplete)complete;

/**
 * 查询账号下角色信息列表
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;

/**
 * 查询账号下某个区服下的角色信息列表
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;

/**
 * 查询具体角色信息
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 * @param characterId 角色id
 */
- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RequestComplete)complete;

/**
 * 查询游戏角色信息
 */
- (void)searchGameAccountWithComplete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
