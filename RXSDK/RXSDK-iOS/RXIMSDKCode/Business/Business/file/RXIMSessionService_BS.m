//
//  RXIMSessionService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSessionService_BS.h"
#import "RXIMSdk_business/RXIMInternalApi.h"
#import "RXIMSdk_business/RXIMSocket.h"
#import "RXIMSdk_business/RXIMWebSocket.h"
#import "RXIMSdk_business/RXIMNetworkError.h"
#import "RXIMSdk_business/RXIMSessionInterfaceModel.h"
#import "RXIMSdk_business/RXIMWCDB.h"
#import "RXIMSdk_business/RXIMSessionService+Inner.h"
#import "RXIMSdk_business/RXIMChatService+Inner.h"
#import "RXIMSdk_business/RXIMLogManager.h"
#import "RXIMSdk_business/RXIMMsgHandle.h"
#import "RXIMSdk_business/RXIMUserUtility.h"
#import "RXIMSdk_business/RXIMCommonTool.h"
#import "RXIMSdk_business/RXIMErrorCode.h"
#import "RXIMSdk_business/NSObject+RXUAddition.h"


@implementation RXIMSessionService_BS

+ (instancetype)sharedSDK {
    static RXIMSessionService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMSessionService_BS alloc] init];
//        [RXIMSessionService sharedSDK].delegate = sharedInstance;
//        sharedInstance.delegate = [RXIMSessionService sharedSDK].delegate;

    });
    return sharedInstance;
}

- (id<RXIMSessionServiceDelegate>)delegate{
    return [RXIMSessionService sharedSDK].delegate;
}

- (void)setDelegate:(id<RXIMSessionServiceDelegate>)delegate{
    [RXIMSessionService sharedSDK].delegate = delegate;
}

#pragma mark 方法拦截转发

- (void)creatConversation:(NSString * _Nonnull)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray * _Nullable)members
                      ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] creatConversation:covId option:option creatorOption:creatorOption members:members ext:ext completionHandler:completionHandler];
}

- (void)creatConversation:(NSString * _Nonnull)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray * _Nullable)members
                groupName:(NSString * _Nullable)groupName
                groupDesc:(NSString * _Nullable)groupDesc
                      ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] creatConversation:covId option:option creatorOption:creatorOption members:members groupName:groupName groupDesc:groupDesc ext:ext completionHandler:completionHandler];
}

- (void)fetchConversationList:(void (^)(NSArray<RXIMSession *> *sessionInfoAry,RXIMError *error))completionHandler {
//    [[RXIMSessionService sharedSDK] fetchConversationList:completionHandler];
    
    if (![[RXIMWCDB sharedSDK] isExistDB]) {
        [[RXIMWCDB sharedSDK] createDB];
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetConversationList] success:^(id  _Nullable responseObject) {
        RXIMSessionsInterfaceModel *model = [RXIMSessionsInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            NSMutableArray *sessions = [NSMutableArray array];
            for (NSDictionary *sessionDic in model.data) {
                RXIMSessionServer *sessionServer = [RXIMSessionServer rx_modelWithDictionary:sessionDic];
                RXIMSession *session = [self sessionServerToSession:sessionServer];
                //缓存服务器会话列表，用来筛选已删除的会话的消息
                [[RXIMUserUtility sharedManager].serverCovListArr addObject:session];
                RXIMSession *sessionDB = [[RXIMWCDB sharedSDK] getSessionWithTarget:session.sessionID];
                if (sessionDB==nil) {
                    BOOL res = [[RXIMWCDB sharedSDK] insertSession:session];
                    if (res) {
                        RXLogInfo(prefixStr, @"insert session %@ success!",session.sessionID);
                    }else{
                        RXLogError(prefixStr, @"insert session %@ failure",session.sessionID);
                    }
                }
                [sessions addObject:session];
                if (session.type == RXIMSessionType_group || session.type == RXIMSessionType_single || session.type == RXIMSessionType_custom) {
                    [[RXIMSessionService sharedSDK] fetchConversationInfo:session.sessionID completionHandler:^(RXIMSession * _Nonnull session, RXIMError * _Nonnull error) {
                        if (!error) {
                            RXIMSession *sessionDB = [[RXIMWCDB sharedSDK] getSessionWithTarget:session.sessionID];
                            if (sessionDB!=nil) {
                                session.unreadCount = sessionDB.unreadCount;
                            }
                            [[RXIMWCDB sharedSDK] insertSession:session];
                        }
                    }];
                }
            }
            [self judgeIsInConversation];
            if (completionHandler) {
                completionHandler(sessions,nil);
            }
        }else{
            [RXIMNetworkError internalError:model completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
    
}

#pragma mark - 判断自己是否在会话中
- (void)judgeIsInConversation
{
    NSMutableArray *unExistArr = [NSMutableArray array];
    NSArray *localSessions = [self getConversationList];
    for (RXIMSession *obj in localSessions) {
        if (obj.type == RXIMSessionType_group) {
            BOOL isFind = false;
            for (RXIMSession *objServer in [RXIMUserUtility sharedManager].serverCovListArr) {
                if ([objServer.sessionID isEqualToString:obj.sessionID]) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                [unExistArr addObject:obj.sessionID];
            }
        }
    }
    if ([unExistArr count]>0) {
        for (NSString *sessionId in unExistArr) {
            [self deleteLocalConversation:sessionId];
        }
    }
}

- (void)updateConversationInfo:(NSString * _Nonnull)covId
                        option:(NSInteger)option
                           ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
             completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] updateConversationInfo:covId option:option ext:ext completionHandler:completionHandler];
}

- (void)disbandConversation:(NSString * _Nonnull)covId
          completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] disbandConversation:covId completionHandler:completionHandler];
}

- (void)fetchConversationInfo:(NSString * _Nonnull)covId
            completionHandler:(void (^)(RXIMSession *session,RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] fetchConversationInfo:covId completionHandler:completionHandler];
}

- (void)joinConversation:(RXIMJoinSession * _Nonnull)joinSession
       completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] joinConversation:joinSession completionHandler:completionHandler];
}

- (void)leaveConversations:(NSArray * _Nonnull)covIds
         completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] leaveConversations:covIds completionHandler:completionHandler];
}

- (void)leaveConversations:(NSArray * _Nonnull)covIds
                      tips:(RXIMMsgConvTipsContent * _Nullable)tips
         completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] leaveConversations:covIds tips:tips completionHandler:completionHandler];
}

- (void)updateUserInfoInConversation:(NSString * _Nonnull)covId
                              option:(NSInteger)option
                                 ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                   completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] updateUserInfoInConversation:covId option:option ext:ext completionHandler:completionHandler];
}

- (void)setSnapchatTimeout:(NSInteger)timeout
                     covId:(NSString *)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMSessionService sharedSDK] setSnapchatTimeout:timeout covId:covId completionHandler:completionHandler];
}


-(NSArray *)getConversationList {
    return [[RXIMSessionService sharedSDK] getConversationList];
}

- (RXIMSession *)getConversationInfo:(NSString * _Nonnull)covId {
    return [[RXIMSessionService sharedSDK] getConversationInfo:covId];
}

-(RXIMMessage *)getLatestMessage:(NSString * _Nonnull)covId {
    return [[RXIMSessionService sharedSDK] getLatestMessage:covId];
}

- (BOOL)deleteLocalConversation:(NSString * _Nonnull)covId {
    return [[RXIMSessionService sharedSDK] deleteLocalConversation:covId];
}

- (BOOL)deleteLocalMessages:(NSArray * _Nonnull)msgIds
                      covId:(NSString *)covId {
    return [[RXIMSessionService sharedSDK] deleteLocalMessages:msgIds covId:covId];
}

- (BOOL)clearUnReadCount:(NSString * _Nonnull)covId {
    return [[RXIMSessionService sharedSDK] clearUnReadCount:covId];
}

- (BOOL)clearLocalMessages:(NSString * _Nonnull)covId {
    return [[RXIMSessionService sharedSDK] clearLocalMessages:covId];
}

#pragma mark 代理拦截转发

- (void)onSessionLastMessageChanged:(NSArray<RXIMSession *> *)sessions{
    if ([self.delegate respondsToSelector:@selector(onSessionLastMessageChanged:)]) {
        [self.delegate onSessionLastMessageChanged:sessions];
    }
}

- (void)onSessionUnreadCountChanged:(NSArray<RXIMSession *> *)sessions{
    if ([self.delegate respondsToSelector:@selector(onSessionUnreadCountChanged:)]) {
        [self.delegate onSessionUnreadCountChanged:sessions];
    }
}

- (void)onSessionInfoChanged:(RXIMSession *)session{
    if ([self.delegate respondsToSelector:@selector(onSessionInfoChanged:)]) {
        [self.delegate onSessionInfoChanged:session];
    }
}

- (void)onSesssionMembersChange:(RXIMSession *)session{
    if ([self.delegate respondsToSelector:@selector(onSesssionMembersChange:)]) {
        [self.delegate onSesssionMembersChange:session];
    }
}

- (void)onSessionDelete:(RXIMSession *)session{
    if ([self.delegate respondsToSelector:@selector(onSessionDelete:)]) {
        [self.delegate onSessionDelete:session];
    }
}

@end

