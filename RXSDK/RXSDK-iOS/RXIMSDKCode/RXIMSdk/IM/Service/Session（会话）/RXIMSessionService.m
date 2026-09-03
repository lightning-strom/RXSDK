//
//  RXIMSessionService.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/16.
//

#import "RXIMSessionService.h"
#import "RXIMInternalApi.h"
#import "RXIMSocket.h"
#import "RXIMWebSocket.h"
#import "RXIMNetworkError.h"
#import "RXIMSessionInterfaceModel.h"
#import "RXIMWCDB.h"
#import "RXIMSessionService+Inner.h"
#import "RXIMChatService+Inner.h"
#import "RXIMLogManager.h"
#import "RXIMMsgHandle.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonTool.h"
#import "RXIMErrorCode.h"
#import "NSObject+RXUAddition.h"

@interface RXIMSessionService()<RXIMSocketInternalDelegate>

@end

@implementation RXIMSessionService

static RXIMSessionService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSessionService alloc] init];
        [RXIMUserUtility sharedManager].serverCovListArr = [NSMutableArray array];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
            [RXIMWebSocket sharedSDK].sessionDelegate = self;
        }else{
            [RXIMSocket sharedSDK].sessionDelegate = self;
        }
    }
    return self;
}

#pragma mark - ====== 服务器会话操作 ======
#pragma mark - 创建会话
- (void)creatConversation:(NSString *)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray *)members
                      ext:(NSDictionary<NSString *,NSString *> *)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildCreatConversation:covId option:option creatorOption:creatorOption members:members groupName:nil groupDesc:nil ext:ext imsExt:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
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

- (void)creatConversation:(NSString * _Nonnull)covId
                   option:(NSInteger)option
            creatorOption:(NSInteger)creatorOption
                  members:(NSArray * _Nullable)members
                groupName:(NSString * _Nullable)groupName
                groupDesc:(NSString * _Nullable)groupDesc
                      ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
        completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildCreatConversation:covId option:option creatorOption:creatorOption members:members groupName:groupName groupDesc:groupDesc ext:ext imsExt:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
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

#pragma mark - 更新会话数据
- (void)updateConversationInfo:(NSString *)covId
                        option:(NSInteger)option
                           ext:(NSDictionary<NSString *,NSString *> *)ext
             completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateConversationInfo:covId option:option ext:ext imsExt:nil evType:EventTypeConversation_EvTypeConExt|EventTypeConversation_EvTypeConOption creator:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithExt:ext option:option evType:EventTypeConversation_EvTypeConExt|EventTypeConversation_EvTypeConOption creator:nil target:covId];
            if (completionHandler) {
                completionHandler(nil);
            }
            RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
            if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionInfoChanged:)]) {
                [self.delegate onSessionInfoChanged:session];
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 删除或解散会话
- (void)disbandConversation:(NSString *)covId
          completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildDeleteConversation:covId] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] deleteSessionWithTarget:covId];
            [[RXIMWCDB sharedSDK] deleteMsgsWithTarget:covId];
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

#pragma mark - 获取会话信息
- (void)fetchConversationInfo:(NSString *)covId
            completionHandler:(void (^)(RXIMSession *session, RXIMError *error))completionHandler
{
    
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetConversationInfo:covId] success:^(id  _Nullable responseObject) {
        RXIMSessionInterfaceModel *interfaceModel = [RXIMSessionInterfaceModel rx_modelWithDictionary:responseObject];
        RXIMSession *session = [self sessionServerToSession:interfaceModel.data];
        if (interfaceModel.isSuccess) {
            if (completionHandler) {
                completionHandler(session,nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
}

#pragma mark - 加入会话
- (void)joinConversation:(RXIMJoinSession *)joinSession
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildJoinConversation:joinSession] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMSessionService sharedSDK] fetchConversationInfo:joinSession.conversation_id completionHandler:^(RXIMSession * _Nonnull session, RXIMError * _Nonnull error) {
                if (!error) {
                    BOOL res = [[RXIMWCDB sharedSDK] insertSession:session];
                    if (res) {
                        RXLogInfo(prefixStr, @"insert session %@ success!",session.sessionID);
                    }else{
                        RXLogError(prefixStr, @"insert session %@ failure",session.sessionID);
                    }
                    //发送加入会话自定义消息
                    [[RXIMChatService sharedSDK] sendCovCustomMsg:LeaveConversation covId:joinSession.conversation_id covType:session.type];
                }
            }];
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

#pragma mark - 离开会话
- (void)leaveConversations:(NSArray *)covIds
         completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildLeaveConversations:covIds tips:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            for (NSString *covId in covIds) {
                RXIMSession*session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
                if (session!=nil) {
                    [[RXIMWCDB sharedSDK] deleteMsgsWithTarget:covId];
                    [[RXIMWCDB sharedSDK] deleteSessionWithTarget:covId];
                    //发送离开会话自定义消息
                    //                    [[RXIMChatService sharedSDK] sendCovCustomMsg:0 covId:covId covType:session.type];
                }
            }
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

#pragma mark - 离开会话带tips
- (void)leaveConversations:(NSArray * _Nonnull)covIds
                      tips:(RXIMMsgConvTipsContent * _Nullable)tips
         completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildLeaveConversations:covIds tips:tips] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            for (NSString *covId in covIds) {
                RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
                if (session!=nil) {
                    [[RXIMWCDB sharedSDK] deleteMsgsWithTarget:covId];
                    [[RXIMWCDB sharedSDK] deleteSessionWithTarget:covId];
                }
            }
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

#pragma mark - 更新用户在会话中信息
- (void)updateUserInfoInConversation:(NSString *)covId
                              option:(NSInteger)option
                                 ext:(NSDictionary<NSString *,NSString *> *)ext
                   completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:option ext:ext imsExt:nil eventType:EventTypeUserConv_EvTypeUserConExt|EventTypeUserConv_EvTypeUserConOption topTimestamp:0 silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:ext userImsExt:nil userOption:option topTimestamp:0 silent:false topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConExt|EventTypeUserConv_EvTypeUserConOption];
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



#pragma mark - 设置阅后即焚超时时间
- (void)setSnapchatTimeout:(NSInteger)timeout
                     covId:(NSString *)covId
         completionHandler:(void (^)(RXIMError *error))completionHandler
{
    
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:[NSString stringWithFormat:@"%ld",timeout] forKey:@"snapchat"];
    NSInteger option = [self getSetedOption:covId];
    if (timeout > 0) {
        option = option|RXIMMsgOption_snapchat;
    }else{
        option = option&(0<<3)|RXIMMsgOption_enableSync;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:option ext:nil imsExt:imsExt eventType:EventTypeUserConv_EvTypeUserConImsext|EventTypeUserConv_EvTypeUserConOption topTimestamp:0 silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:imsExt userOption:option topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConImsext|EventTypeUserConv_EvTypeUserConOption];
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

#pragma mark - 获取会话列表

- (void)fetchConversationList:(void (^)(NSArray<RXIMSession *> *sessionAry,RXIMError *error))completionHandler
{
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
            if ([RXIMUserUtility sharedManager].isBusiness) {//获取自己已经被移出的会话
                [self judgeIsInConversation];
            }
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

#pragma mark - 删除服务器消息
- (void)deleteServerMessages:(NSArray * _Nonnull)msgIds
                       covId:(NSString *)covId
           completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildDeleteServerMsgs:msgIds covId:covId] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMSessionService sharedSDK] deleteLocalMessages:msgIds covId:covId];
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
-(NSArray *)sortSession:(NSArray<RXIMSession *> *)sessions
{
    RXLogDebug(prefixStr, nil);
    NSArray* sorted = [sessions sortedArrayUsingComparator:
                       ^(RXIMSession *conv1, RXIMSession* conv2){
        RXIMMessage *message1 = conv1.lastMessage;
        RXIMMessage *message2 = conv2.lastMessage;
        if(message1.timestamp > message2.timestamp) {
            return(NSComparisonResult)NSOrderedAscending;
        }else {
            return(NSComparisonResult)NSOrderedDescending;
        }
        NSInteger conv1Top = conv1.topTimestamp;
        NSInteger conv2Top = conv2.topTimestamp;
        // 1 如果都设置了会话置顶 那么就对比时间,大的在前
        if (conv1Top>0 && conv2Top>0) {
            if (conv1Top > conv2Top) {
                return(NSComparisonResult)NSOrderedAscending;
            }else{
                return(NSComparisonResult)NSOrderedDescending;
            }
        }
        // 2 如果一个有设置,一个没有设置,那么返回设置了的
        else if (conv1Top>0 && conv2Top == 0){
            return(NSComparisonResult)NSOrderedAscending;
        }
        // 2.1 如果一个有设置,一个没有设置,那么返回设置了的
        else if (conv1Top == 0 && conv2Top>0){
            return(NSComparisonResult)NSOrderedDescending;
            
        }
        //3 都没有设置,按照时间排序
        else{
            if(message1.timestamp > message2.timestamp) {
                return(NSComparisonResult)NSOrderedAscending;
            }else {
                return(NSComparisonResult)NSOrderedDescending;
            }
        }
    }];
    return sorted;
}

#pragma mark - ====== 本地数据库会话操作 ======
#pragma mark - 获取本地会话列表
-(NSArray *)getConversationList
{
    RXLogDebug(prefixStr, nil);
    if (![[RXIMWCDB sharedSDK] isExistDB]) {
        [[RXIMWCDB sharedSDK] createDB];
    }
    NSArray *allAry = [[RXIMWCDB sharedSDK] getAllSession];
    if (IsEmpty(allAry)) {
        return allAry;
    }
    NSArray *sortedAry = [self sortSession:allAry];
    return sortedAry;
}

#pragma mark - 通过id获取会话
- (RXIMSession *)getConversationInfo:(NSString * _Nonnull)covId
{
    RXLogDebug(prefixStr, nil);
    RXIMSession *session;
    //    BOOL isExist = [self judgeCovFromServerCovList:covId];
    //    if (!isExist) {
    //        //已经被踢出会话
    //        [[RXIMWCDB sharedSDK] deleteSessionWithTarget:covId];
    //        session = nil;
    //    }else{
    session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
    //    }
    return session;
}

#pragma mark - 判断服务器会话是否存在
-(BOOL)judgeCovFromServerCovList:(NSString *)covId
{
    BOOL isExist = false;
    RXIMSession *session = nil;
    for (RXIMSession *obj in [RXIMUserUtility sharedManager].serverCovListArr) {
        if ([covId isEqualToString:obj.sessionID]) {
            //1.服务器会话存在
            isExist = true;
            break;
        }
    }
    if (isExist) {
        return true;
    }
    return false;
}

#pragma mark - 获取会话最后一条消息
-(RXIMMessage *)getLatestMessage:(NSString * _Nonnull)covId
{
    RXLogDebug(prefixStr, nil);
    RXIMMessage *msg = [[RXIMWCDB sharedSDK] getLastMsgWithTarget:covId];
    //更新会话最后一条消息
    [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:msg target:covId];
    return msg;
}

#pragma mark - 清空未读消息数
- (BOOL)clearUnReadCount:(NSString *)covId
{
    RXLogDebug(prefixStr, nil);
    BOOL res = true;
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
    if (session!=nil) {
        if (session.unreadCount == 0) {
            return YES;
        }
        session.unreadCount = 0;
        res = [[RXIMWCDB sharedSDK] updateSessionWithRedPoint:0 target:covId];
        if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionUnreadCountChanged:)]) {
            [self.delegate onSessionUnreadCountChanged:@[session]];
        }
    }
    return res;
}

#pragma mark - 删除单个会话
- (BOOL)deleteLocalConversation:(NSString * _Nonnull)covId
{
    RXLogDebug(prefixStr, nil);
    BOOL isSuccess_session = [[RXIMWCDB sharedSDK] deleteSessionWithTarget:covId];
    BOOL isSuccess_msg = [[RXIMWCDB sharedSDK] deleteMsgsWithTarget:covId];
    if (isSuccess_session && isSuccess_msg) {
        return true;
    }else{
        return false;
    }
}

#pragma mark - 删除本地消息
- (BOOL)deleteLocalMessages:(NSArray * _Nonnull)msgIds covId:(NSString *)covId
{
    RXIMMessage *lastMsg = [[RXIMWCDB sharedSDK] getLastMsgWithTarget:covId];
    BOOL isExist = false;
    for (NSString *msgId in msgIds) {
        if ([msgId isEqualToString:lastMsg.msgId]) {
            isExist = true;
        }
        [[RXIMWCDB sharedSDK] deleteMsgWithMsgId:msgId];
    }
    if (isExist) {
        //最后一条消息被删除
        lastMsg = [[RXIMWCDB sharedSDK] getLastMsgWithTarget:covId];
        [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:lastMsg target:covId];
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
        if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionLastMessageChanged:)]) {
            [self.delegate onSessionLastMessageChanged:@[session]];
        }
    }
    return true;
}

#pragma mark - 清空聊天记录
- (BOOL)clearLocalMessages:(NSString * _Nonnull)covId
{
    BOOL res = [[RXIMWCDB sharedSDK] deleteMsgsWithTarget:covId];
    if (res) {
        [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:nil target:covId];
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
        if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionLastMessageChanged:)]) {
            [self.delegate onSessionLastMessageChanged:@[session]];
        }
    }
    return res;
}

#pragma mark - <RXIMSocketInternalDelegate>
#pragma mark - 处理接收端最后一条消息变化
- (void)socketReceiveMessage:(NSArray *)msgs {
    RXLogDebug(prefixStr, nil);
    [self receiveMessageHandle:msgs];
}

#pragma mark - 处理发送端最后一条消息变化
- (void)socketSendMessageSuccess:(nonnull RXIMMsgModel *)data tag:(NSInteger)tag {
    RXLogDebug(prefixStr, nil);
    RXIMMessage *message = [RXIMMsgHandle handleSendSuccessSession:data];
    if (message != nil) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:message.sessionID];
        if (session!=nil) {
            //本地找到会话、
            [[RXIMWCDB sharedSDK] updateSessionWithIsArchive:false target:session.sessionID];
            if (message.msgType == RXIMMessageType_recall) {
                if ([message.msgId isEqualToString:session.lastMessage.msgId]) {
                    session.lastMessage.isRecall = YES;
                    [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:session.lastMessage target:message.sessionID];
                }
                [[RXIMWCDB sharedSDK] deleteMsgWithLocalId:message.localId];
            }else if(message.msgType == RXIMMessageType_read){
                [[RXIMWCDB sharedSDK] deleteMsgWithLocalId:message.localId];
            }else if(message.msgType == RXIMServerMessageType_SysMsgUrgent){
                [[RXIMWCDB sharedSDK] deleteMsgWithLocalId:message.localId];
            }else{
                session.lastMessage = message;
                [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:message target:message.sessionID];
            }
            
        }else{
            //本地未找到会话
            session = [[RXIMSession alloc]init];
            session.sessionID = message.sessionID;
            session.lastMessage = message;
            session.type = message.sessionType;
            [[RXIMWCDB sharedSDK] insertSession:session];
            [[RXIMSessionService sharedSDK] fetchConversationInfo:message.sessionID completionHandler:^(RXIMSession * _Nonnull session, RXIMError * _Nonnull error) {
                if (!error) {
                    session.lastMessage = message;
                    [[RXIMWCDB sharedSDK] insertSession:session];
                }
            }];
        }
        //已读消息处理
        if (message.msgType == RXIMMessageType_read) {
            session.unreadCount -= 1;
            if (session.unreadCount < 0) {
                session.unreadCount = 0;
            }else{
                if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionUnreadCountChanged:)]) {
                    [self.delegate onSessionUnreadCountChanged:@[session]];
                }
            }
            [[RXIMWCDB sharedSDK] updateSessionWithRedPoint:session.unreadCount target:message.sessionID];
        }
        if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionLastMessageChanged:)]) {
            [self.delegate onSessionLastMessageChanged:@[session]];
        }
    }
}

#pragma mark - 获取已设置的option字段
- (NSInteger)getSetedOption:(NSString *)covId
{
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
    return session.userOption;
}

@end
