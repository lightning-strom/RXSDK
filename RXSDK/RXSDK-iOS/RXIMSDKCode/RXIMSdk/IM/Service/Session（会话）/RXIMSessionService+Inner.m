//
//  RXIMSessionService+Inner.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//

#import "RXIMSessionService+Inner.h"
#import "RXIMUserUtility.h"
#import "RXIMSDKApi.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"
#import "RXIMMsgContinuityModel.h"
#import "RXIMInternalApi.h"
#import "RXIMSessionInterfaceModel.h"
#import "RXIMNetworkError.h"
#import "RXIMGroupMember.h"
#import "RXIMCommonTool.h"
#import "NSObject+RXUAddition.h"

@interface RXIMSessionService (Inner)

@end

@implementation RXIMSessionService (Inner)

- (void)receiveMessageHandle:(NSArray *)msgs
{
    __block NSMutableArray *sessionsAry = [NSMutableArray array];
    __block NSMutableArray *redPointAry = [NSMutableArray array];
    RXLogDebug(prefixStr, nil);
    [msgs enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMMessageIMS *message;
        if ([obj isKindOfClass:[RXIMMsgContinuityModel class]]) {
            RXIMMsgContinuityModel *model = (RXIMMsgContinuityModel *)obj;
            message = model.msg;
        }else if([obj isKindOfClass:[RXIMMessageIMS class]]){
            RXIMMessageIMS *msg = (RXIMMessageIMS *)obj;
            message = msg;
        }
        if (message != nil){
            if (message.sessionID == nil) {
                return;
            }
            RXIMSession *rxSession = [[RXIMWCDB sharedSDK] getSessionWithTarget:message.sessionID];
            if (rxSession!=nil) {
                //本地存在会话
                if (rxSession.isArchive) {
                    //取消归档
                    [self unarchiveConversation:message.sessionID completionHandler:^(RXIMError *error) {
                        if (!error) {
                            RXLogInfo(prefixStr, @"unarchive success");
                        }else{
                            RXLogInfo(prefixStr, @"unarchive failure");
                        }
                    }];
                }
                if (message.msgType == RXIMMessageType_Tips) {
                    NSDictionary *imsExt = message.imsExt;
                    NSString *tipsValue = [imsExt objectForKey:@"tips"];
                    if ([tipsValue isEqualToString:@"leave"]) {
                        if (![RXIMUserUtility sharedManager].isBusiness) {
                            if ([[RXIMUserUtility sharedManager].userId isEqualToString:message.fromId]) {
                                [[RXIMWCDB sharedSDK] deleteSessionWithTarget:message.sessionID];
                            }else{
                                NSMutableArray *members = [NSMutableArray arrayWithArray:rxSession.members];
                                [members removeObject:message.fromId];
                                [[RXIMWCDB sharedSDK] updateSessionWithMembers:members target:rxSession.sessionID state:0];
                            }
                        }
                        return;
                    }
                }
                if (message.msgType == RXIMMessageType_Custom) {
                    //添加成员
                    if (message.subType == JoinConversation) {
                        if (![RXIMUserUtility sharedManager].isBusiness) {
                            NSMutableArray *members = [NSMutableArray arrayWithArray:rxSession.members];
                            BOOL isExist = false;
                            for (NSString *userId in members) {
                                if ([userId isEqualToString:message.fromId]) {
                                    isExist = true;
                                }
                            }
                            if (!isExist) {
                                [members addObject:message.fromId];
                                [[RXIMWCDB sharedSDK] updateSessionWithMembers:members target:rxSession.sessionID state:0];
                                RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:rxSession.sessionID];
                                if (self.delegate && [self.delegate respondsToSelector:@selector(onSesssionMembersChange:)]) {
                                    [self.delegate onSesssionMembersChange:session];
                                }
                            }
                        }
                        return;
                    }
                    //移除成员
                    else if(message.subType == LeaveConversation){
                        if (![RXIMUserUtility sharedManager].isBusiness) {
                            NSMutableArray *members = [NSMutableArray arrayWithArray:rxSession.members];
                            [members removeObject:message.fromId];
                            [[RXIMWCDB sharedSDK] updateSessionWithMembers:members target:rxSession.sessionID state:0];
                            RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:rxSession.sessionID];
                            if (self.delegate && [self.delegate respondsToSelector:@selector(onSesssionMembersChange:)]) {
                                [self.delegate onSesssionMembersChange:session];
                            }
                        }
                        return;
                    }
                }
                
                if (message.msgType == RXIMMessageType_recall) {
                    if ([message.msgId isEqualToString:rxSession.lastMessage.msgId]) {
                        rxSession.lastMessage.isRecall = YES;
                        [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:rxSession.lastMessage target: message.sessionID];
                        [sessionsAry addObject:rxSession];
                    }
                }else if(message.msgType == RXIMMessageType_read){
                    if ([message.msgId isEqualToString:rxSession.lastMessage.msgId]) {
                        rxSession.lastMessage.unreadCount = 0;
                        [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:rxSession.lastMessage target: message.sessionID];
                    }
                    //已读消息不保存，需要返回上层
                    if (message && [message.fromId isEqualToString:[RXIMUserUtility sharedManager].userId]) {
                        //自己已读的消息会话减1
                        rxSession.unreadCount -= 1;
                        if (rxSession.unreadCount<0) {
                            rxSession.unreadCount = 0;
                        }
                    }
                    [[RXIMWCDB sharedSDK] updateSessionWithRedPoint:rxSession.unreadCount target:message.sessionID];
                    [sessionsAry addObject:rxSession];
                }else if(message.msgType == RXIMServerMessageType_deleteConv){
                    if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionDelete:)]) {
                        [self.delegate onSessionDelete:rxSession];
                    }
//                    [[RXIMWCDB sharedSDK] deleteSessionWithTarget:message.sessionID];
                    return;
                }else if(message.msgType == RXIMServerMessageType_deleteMsg){
                    RXIMMessage *lastMessage = [[RXIMSessionService sharedSDK] getLatestMessage:message.sessionID];
                    rxSession.lastMessage = lastMessage;
                    [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:rxSession.lastMessage target:message.sessionID];
                    [sessionsAry addObject:rxSession];
                }else if(message.msgType == RXIMServerMessageType_SysMsgUrgent){
                    return;
                }else{
                    rxSession.lastMessage = message;
                    
                    
                    if (rxSession.unreadCount == 0){
                        // 添加最早一次未读消息id ，重新启动后会被覆盖，所以暂时未实装
                        rxSession.firstUnreadMsgId = message.msgId;
                        [[RXIMWCDB sharedSDK] updateSessionWithFirstRedPointMsgId:message.msgId target:message.sessionID];
                    }
//
                    if (/*[RXIMUserUtility sharedManager].maxInboxId != 0 &&*/ message.msgType != RXIMMessageType_snapchat && message.msgType != RXIMServerMessageType_deleteMsg && message.msgType != RXIMMessageType_Tips && ![message.fromId isEqualToString:message.toId]){
                        rxSession.unreadCount+=1;
                    }
                    [[RXIMWCDB sharedSDK] updateSessionWithLastMsg:message target: message.sessionID];
                    [[RXIMWCDB sharedSDK] updateSessionWithRedPoint:rxSession.unreadCount target:message.sessionID];
                    [sessionsAry addObject:rxSession];
//                    [redPointAry addObject:rxSession];
                }
                
            }else{
                //本地未找到会话
                if (message.msgType == RXIMMessageType_Custom) {
                    if (message.subType == LeaveConversation || message.subType == JoinConversation) {
                        return;
                    }
                }
                if (message.msgType == RXIMMessageType_read || message.msgType == RXIMMessageType_recall) {
                    return;
                }
                if (message.msgType == RXIMServerMessageType_deleteConv) {
                    return;
                }
                if (message.msgType == RXIMMessageType_Tips && [[RXIMUserUtility sharedManager].userId isEqualToString:message.fromId]) {
                    return;
                }
                rxSession = [[RXIMSession alloc]init];
                rxSession.sessionID = message.sessionID;
                rxSession.lastMessage = message;
                rxSession.type = message.sessionType;
                if ([RXIMUserUtility sharedManager].maxInboxId != 0){
                    rxSession.unreadCount+=1;
                }
                if (message.sessionType == RXIMSessionType_custom) {
                    rxSession.members = @[message.fromId];
                }
                [[RXIMWCDB sharedSDK] insertSession:rxSession];
                if (message.sessionType == RXIMSessionType_group) {
                    [[RXIMSessionService sharedSDK] fetchConversationInfo:message.sessionID completionHandler:^(RXIMSession * _Nonnull session, RXIMError * _Nonnull error) {
                        if (!error) {
                            session.lastMessage = message;
//                            if ([RXIMUserUtility sharedManager].maxInboxId != 0){
//                                rxSession.unreadCount+=1;
//                            }
                            session.unreadCount = rxSession.unreadCount;
                            [[RXIMWCDB sharedSDK] insertSession:session];
                        }
                    }];
                }
                
                [sessionsAry addObject:rxSession];
//                [redPointAry addObject:rxSession];
            }
            
        }
    }];
//    if ([RXIMUserUtility sharedManager].maxInboxId != 0){
        if (sessionsAry!=nil && sessionsAry.count > 0) {
            if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionLastMessageChanged:)]) {
                [self.delegate onSessionLastMessageChanged:sessionsAry];
            }
        }
        
//        if (redPointAry!=nil && redPointAry.count > 0) {
//            if (self.delegate && [self.delegate respondsToSelector:@selector(onSessionUnreadCountChanged:)]) {
//                [self.delegate onSessionUnreadCountChanged:redPointAry];
//            }
//        }
//    }
}

#pragma mark - 获取会话列表（同步消息syncMessage用）
- (void)fetchConversationListInternal:(void (^)(RXIMError *error))completionHandler
{
    if (![[RXIMWCDB sharedSDK] isExistDB]) {
        [[RXIMWCDB sharedSDK] createDB];
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetConversationList] success:^(id  _Nullable responseObject) {
        RXIMSessionsInterfaceModel *model = [RXIMSessionsInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            for (NSDictionary *sessionDic in model.data) {
                RXIMSessionServer *sessionServer = [RXIMSessionServer rx_modelWithDictionary:sessionDic];
                RXIMSession *session = [self sessionServerToSession:sessionServer];
                //缓存服务器会话列表，用来筛选已删除的会话的消息
                [[RXIMUserUtility sharedManager].serverCovListArr addObject:session];
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

#pragma mark - 取消归档
#pragma mark - 归档会话
- (void)unarchiveConversation:(NSString *)covId
          completionHandler:(void (^)(RXIMError *))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:@"0" forKey:@"archive"];
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:imsExt eventType:EventTypeUserConv_EvTypeUserConImsext topTimestamp:0 silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:imsExt userOption:0 topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConImsext];
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

#pragma mark - 获取已设置的ims字段
- (NSMutableDictionary *)getSetedImsExt:(NSString *)covId
{
    NSMutableDictionary *imsExtDic = [NSMutableDictionary dictionary];
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
    if (session.snapchatTimeout > 0) {
        [imsExtDic setValue:[NSString stringWithFormat:@"%ld",session.snapchatTimeout] forKey:@"snapchat"];
    }
    if (session.isMark) {
        [imsExtDic setValue:[NSString stringWithFormat:@"%d",session.isMark] forKey:@"mark"];
    }
    if (session.isArchive) {
        [imsExtDic setValue:[NSString stringWithFormat:@"%d",session.isArchive] forKey:@"archive"];
    }
    return imsExtDic;
}

#pragma mark - 模型转换
-(RXIMSession *)sessionServerToSession:(RXIMSessionServer *)serverModel
{
    RXIMSession *model = [[RXIMSession alloc]init];
    model.sessionID = serverModel.conversation_id;
    model.attr = serverModel.attr;
    model.option = serverModel.option;
    model.creator = serverModel.creator;
    model.createTimestamp = serverModel.create_milli_ts;
    model.updateTimestamp = serverModel.update_milli_ts;
    model.ext = serverModel.ext;
    if ([RXIMUserUtility sharedManager].isBusiness) {
        NSMutableArray *memberArr = [NSMutableArray array];
        for (NSDictionary *dic in serverModel.members) {
            RXIMGroupMember *member = [RXIMGroupMember rx_modelWithDictionary:dic];
            if (member){
                [memberArr addObject:member];
            }
            
        }
        model.members = memberArr;
    }else{
        model.members = serverModel.members;
    }
    
    model.type = serverModel.type;
    model.status = serverModel.status;
    model.lastMessage = serverModel.lastMessage;
    model.cpid = serverModel.cpid;
    model.joinTimestamp = serverModel.join_milli_ts;
    model.userAttr = serverModel.user_attr;
    model.userOption = serverModel.user_option;
    model.userExt = serverModel.user_ext;
    NSInteger snapchatTimeout = [[serverModel.user_ims_ext objectForKey:@"snapchat"] integerValue];
    model.snapchatTimeout = snapchatTimeout;
    BOOL isMark = [[serverModel.user_ims_ext objectForKey:@"mark"] boolValue];
    model.isMark = isMark;
    BOOL isArchive = [[serverModel.user_ims_ext objectForKey:@"archive"] boolValue];
    model.isArchive = isArchive;
    model.unreadCount = serverModel.unreadCount;
    model.topTimestamp = serverModel.top;
    model.silent = serverModel.silent;
    model.topMsg = serverModel.top_msg;
    model.topMsgUser = serverModel.top_msg_user;
    model.groupName = serverModel.conv_name;
    model.groupDesc = serverModel.conv_desc;
    return model;
}

@end
