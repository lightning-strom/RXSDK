//
//  RXGameInfoService.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/1/2.
//

#import "RXGameInfoService.h"
#import "RXBDAManager.h"

@implementation RXGameInfoService

static RXGameInfoService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXGameInfoService alloc] init];
    });
    return sharedSDK;
}

/**
 * 游戏区服信息查询
 * @param areaId 区服 id
 */
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    NSString *url = [NSString stringWithFormat:@"/v1/report/sdk/cp/game_area?area_id=%@", areaId];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"游戏区服信息查询成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"游戏区服信息查询失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

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
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    if ([NSString rx_isNullToString:areaName].length > 0) {
        [dic setValue:areaName forKey:@"area_name"];
    }
    if ([NSString rx_isNullToString:areaStatus].length > 0) {
        [dic setValue:areaStatus forKey:@"area_status"];
    }
    if ([NSString rx_isNullToString:areaType].length > 0) {
        [dic setValue:areaType forKey:@"area_type"];
    }
    if ([extension isKindOfClass:[NSDictionary class]] && extension.allKeys.count > 0) {
        [dic setValue:extension forKey:@"extension"];
    }
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_area" andParams:dic requsetMethod:RequestMethod_Put];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"游戏区服信息修改成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"游戏区服信息修改失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

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
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    if ([NSString rx_isNullToString:areaName].length > 0) {
        [dic setValue:areaName forKey:@"area_name"];
    }
    if ([NSString rx_isNullToString:areaStatus].length > 0) {
        [dic setValue:areaStatus forKey:@"area_status"];
    }
    if ([NSString rx_isNullToString:areaType].length > 0) {
        [dic setValue:areaType forKey:@"area_type"];
    }
    if ([extension isKindOfClass:[NSDictionary class]] && extension.allKeys.count > 0) {
        [dic setValue:extension forKey:@"extension"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_area" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"创建游戏区服成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"创建游戏区服失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除游戏区服
 * @param areaId 区服 id
 */
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_area" andParams:dic requsetMethod:RequestMethod_Delete];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"删除游戏区服成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"删除游戏区服失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询区服列表信息
 */
- (void)searchGameAreaListInfoWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_area/list" andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询区服列表信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询区服列表信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

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
                             complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    if ([NSString rx_isNullToString:characterFaction].length > 0) {
        [dic setValue:characterFaction forKey:@"character_faction"];
    }
    if ([NSString rx_isNullToString:characterId].length > 0) {
        [dic setValue:characterId forKey:@"character_id"];
    }
    if ([NSString rx_isNullToString:characterLevel].length > 0) {
        [dic setValue:characterLevel forKey:@"character_level"];
    }
    if ([NSString rx_isNullToString:characterName].length > 0) {
        [dic setValue:characterName forKey:@"character_name"];
    }
    if ([NSString rx_isNullToString:characterProfession].length > 0) {
        [dic setValue:characterProfession forKey:@"character_profession"];
    }
    if ([NSString rx_isNullToString:characterStatus].length > 0) {
        [dic setValue:characterStatus forKey:@"character_status"];
    }
    if ([NSString rx_isNullToString:characterType].length > 0) {
        [dic setValue:characterType forKey:@"character_type"];
    }
    if ([NSString rx_isNullToString:characterVipLevel].length > 0) {
        [dic setValue:characterVipLevel forKey:@"character_vip_level"];
    }
    if ([NSString rx_isNullToString:cpUserId].length > 0) {
        [dic setValue:cpUserId forKey:@"cp_user_id"];
    }
    if ([extension isKindOfClass:[NSDictionary class]] && extension.allKeys.count > 0) {
        [dic setValue:extension forKey:@"extension"];
    }
    
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"rx_openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_character" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"创建角色成功:\n %@", responseObject);
        
        // 上报巨量
        [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"create_game_role" params:@{@"role_id" : characterId ?: @""}];
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"创建角色失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

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
                                 complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    if ([NSString rx_isNullToString:characterFaction].length > 0) {
        [dic setValue:characterFaction forKey:@"character_faction"];
    }
    if ([NSString rx_isNullToString:characterId].length > 0) {
        [dic setValue:characterId forKey:@"character_id"];
    }
    if ([NSString rx_isNullToString:characterLevel].length > 0) {
        [dic setValue:characterLevel forKey:@"character_level"];
    }
    if ([NSString rx_isNullToString:characterName].length > 0) {
        [dic setValue:characterName forKey:@"character_name"];
    }
    if ([NSString rx_isNullToString:characterProfession].length > 0) {
        [dic setValue:characterProfession forKey:@"character_profession"];
    }
    if ([NSString rx_isNullToString:characterStatus].length > 0) {
        [dic setValue:characterStatus forKey:@"character_status"];
    }
    if ([NSString rx_isNullToString:characterType].length > 0) {
        [dic setValue:characterType forKey:@"character_type"];
    }
    if ([NSString rx_isNullToString:characterVipLevel].length > 0) {
        [dic setValue:characterVipLevel forKey:@"character_vip_level"];
    }
    if ([NSString rx_isNullToString:cpUserId].length > 0) {
        [dic setValue:cpUserId forKey:@"cp_user_id"];
    }
    if ([extension isKindOfClass:[NSDictionary class]] && extension.allKeys.count > 0) {
        [dic setValue:extension forKey:@"extension"];
    }
    
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"rx_openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_character" andParams:dic requsetMethod:RequestMethod_Put];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"修改游戏角色信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"修改游戏角色信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除游戏角色
 * @param areaId 区服 id
 * @param characterId 角色id
 * @param cpUserId 游戏用户 id
 */
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:areaId].length > 0) {
        [dic setValue:areaId forKey:@"area_id"];
    }
    if ([NSString rx_isNullToString:characterId].length > 0) {
        [dic setValue:characterId forKey:@"character_id"];
    }
    if ([NSString rx_isNullToString:cpUserId].length > 0) {
        [dic setValue:cpUserId forKey:@"cp_user_id"];
    }
    
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"rx_openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/report/sdk/cp/game_character" andParams:dic requsetMethod:RequestMethod_Delete];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"删除游戏区服成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"删除游戏区服失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询账号下角色信息列表
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    NSString *url = [NSString stringWithFormat:@"/v1/report/sdk/cp/game_character/account?cp_user_id=%@&rx_openid=%@", cpUserId, [RXUserUtility valueForKey:keyUserData_openId]];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询账号下角色信息列表成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询账号下角色信息列表失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询账号下某个区服下的角色信息列表
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    NSString *url = [NSString stringWithFormat:@"/v1/report/sdk/cp/game_character/account/area?cp_user_id=%@&rx_openid=%@&area_id=%@", cpUserId, [RXUserUtility valueForKey:keyUserData_openId], areaId];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询账号下角色信息列表成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询账号下角色信息列表失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询具体角色信息
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 * @param characterId 角色id
 */
- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    NSString *url = [NSString stringWithFormat:@"/v1/report/sdk/cp/game_character/account/area/character?cp_user_id=%@&rx_openid=%@&area_id=%@&character_id=%@", cpUserId, [RXUserUtility valueForKey:keyUserData_openId], areaId, characterId];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询具体角色信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询具体角色信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询游戏角色信息
 */
- (void)searchGameAccountWithComplete:(RequestComplete)complete
{
    NSString *url = @"/v1/report/sdk/cp_role";
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询游戏角色信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询游戏角色信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

@end
