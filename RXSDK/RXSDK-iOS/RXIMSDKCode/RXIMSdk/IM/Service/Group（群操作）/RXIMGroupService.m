//
//  RXIMGroupService.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/6.
//

#import "RXIMGroupService.h"
#import "RXIMInternalApi.h"
#import "RXIMNetworkError.h"
#import "RXIMSessionInterfaceModel.h"
#import "RXIMWCDB.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonTool.h"
#import "RXIMErrorCode.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMGroupService

static RXIMGroupService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMGroupService alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 设置群管理员
- (void)setGroupManagers:(NSArray *)managers
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildSetGroupManagers:managers covId:covId] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
            NSMutableDictionary *managerDic = [NSMutableDictionary dictionary];
            for (NSString *manager in managers) {
                [managerDic setValue:@"2" forKey:manager];
            }
            [[RXIMWCDB sharedSDK] updateSessionWithManagers:managerDic target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 群踢人
- (void)groupKickMembers:(NSArray *)members
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGroupKickMembers:members covId:covId] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
//            [[RXIMWCDB sharedSDK] updateSessionWithMembers:members target:covId state:0];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 群邀请人
- (void)groupInviteMembers:(NSArray *)members
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGroupInviteMembers:members covId:covId] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
//            [[RXIMWCDB sharedSDK] updateSessionWithMembers:members target:covId state:1];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 转让群主
- (void)transferGroupOwner:(NSString * _Nonnull)owner
                     covId:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler;
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateConversationInfo:covId option:0 ext:nil imsExt:nil evType:EventTypeConversation_EvTypeConUpdateCreator creator:owner] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithExt:nil option:0 evType:EventTypeConversation_EvTypeConUpdateCreator creator:owner target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

- (void)setNicknameInCov:(NSString *)covId
                nickname:(NSString *)nickname
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildSetNicknameInCov:covId nickname:nickname] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithNickname:nickname userId:[RXIMUserUtility sharedManager].userId target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

- (void)setGroupNameWithCovId:(NSString *)covId
                    groupName:(NSString *)groupName
            completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildSetGroupNameWithCovId:covId groupName:groupName] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateGroupName:groupName target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

- (void)setGroupDescWithCovId:(NSString *)covId
                    groupDesc:(NSString *)groupDesc
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildSetGroupDescWithCovId:covId groupDesc:groupDesc] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateGroupDesc:groupDesc target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}


@end
