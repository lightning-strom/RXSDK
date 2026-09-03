//
//  RXIMGroupService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMGroupService_BS.h"

@implementation RXIMGroupService_BS

+ (instancetype)sharedSDK {
    static RXIMGroupService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMGroupService_BS alloc] init];
    });
    return sharedInstance;
}


- (void)groupInviteMembers:(NSArray * _Nonnull)members
                     covId:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] groupInviteMembers:members covId:covId completionHandler:completionHandler];
}

- (void)groupKickMembers:(NSArray * _Nonnull)members
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] groupKickMembers:members covId:covId completionHandler:completionHandler];
}

- (void)setGroupManagers:(NSArray * _Nonnull)managers
                   covId:(NSString * _Nonnull)covId
       completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] setGroupManagers:managers covId:covId completionHandler:completionHandler];
}

- (void)transferGroupOwner:(NSString * _Nonnull)owner
                     covId:(NSString * _Nonnull)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] transferGroupOwner:owner covId:covId completionHandler:completionHandler];
}

- (void)setNicknameInCov:(NSString *)covId
                nickname:(NSString *)nickname
       completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] setNicknameInCov:covId nickname:nickname completionHandler:completionHandler];
}

- (void)setGroupNameWithCovId:(NSString *)covId
                    groupName:(NSString *)groupName
            completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] setGroupNameWithCovId:covId groupName:groupName completionHandler:completionHandler];
}

- (void)setGroupDescWithCovId:(NSString *)covId
                    groupDesc:(NSString *)groupDesc
            completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMGroupService sharedSDK] setGroupDescWithCovId:covId groupDesc:groupDesc completionHandler:completionHandler];
}

@end
