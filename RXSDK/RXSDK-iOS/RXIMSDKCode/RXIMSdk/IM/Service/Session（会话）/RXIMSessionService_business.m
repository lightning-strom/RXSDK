//
//  RXIMSessionService+business.m
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/10.
//

#import "RXIMSessionService_business.h"
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

@interface RXIMSessionService_business()<RXIMSocketInternalDelegate>

@end

@implementation RXIMSessionService_business

static RXIMSessionService_business *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSessionService_business alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
            [RXIMWebSocket sharedSDK].sessionDelegate_business = self;
        }else{
            [RXIMSocket sharedSDK].sessionDelegate_business = self;
        }
    }
    return self;
}

- (void)setDelegate_business:(id<RXIMSessionServiceDelegate_business>)delegate_business
{
    _delegate_business = delegate_business;
    [RXIMSessionService sharedSDK].delegate = (id)delegate_business;
    [RXIMSessionService_business sharedSDK].delegate = (id)delegate_business;
}

#pragma mark - 设置会话置顶/取消置顶
- (void)setTopTimestamp:(NSInteger)topTimestamp
                  covId:(NSString *)covId
      completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConTopConv topTimestamp:topTimestamp silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:topTimestamp silent:false topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConTopConv];
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

#pragma mark - 设置会话免打扰
- (void)setSilentState:(BOOL)state
            covId:(NSString *)covId
completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConSilent topTimestamp:0 silent:state cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:state topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConSilent];
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

#pragma mark - 置顶/取消置顶会话内消息
- (void)topMessageInConversation:(NSString * _Nonnull)covId
                           msgId:(NSString * _Nonnull)msgId
                           state:(BOOL)state
                   cancelTopType:(NSInteger)cancelTopType
               completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    if (state == 1 || (state == 0 && cancelTopType == 1)) {
        [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildTopMessageInConversation:covId msgId:msgId state:state] success:^(id  _Nullable responseObject) {
            RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
            if (model.isSuccess) {
                NSString *msgIdDB = msgId;
                if (state == 0) {
                    msgIdDB = nil;
                }
                [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:FALSE topMsg:msgIdDB topMsgUser:[RXIMUserUtility sharedManager].userId target:covId eventType:EventTypeUserConv_EvTypeUserConTopMsg];
                if (completionHandler) {
                    completionHandler(nil);
                }
            }else{
                [RXIMNetworkError internalError:model complete:completionHandler];
            }
        } failure:^(RXCommonRequestError * _Nullable error) {
            [RXIMNetworkError networkError:error complete:completionHandler];
        }];
    }else{
        [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConTopMsg topTimestamp:0 silent:false cancelTopMsg:msgId] success:^(id  _Nullable responseObject) {
            RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
            if (model.isSuccess) {
                [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConTopMsg];
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
}

#pragma mark - 标记/取消标记会话
- (void)markConversation:(NSString * _Nonnull)covId
                   state:(NSInteger)state
       completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:[NSString stringWithFormat:@"%ld",state] forKey:@"mark"];
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

#pragma mark - 归档会话
- (void)archiveConversation:(NSString *)covId
          completionHandler:(void (^)(RXIMError *))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:@"1" forKey:@"archive"];
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

#pragma mark - ====== 接收的事件处理 ======
- (void)socketReceiveEvent:(RXIMMsgModel *)data tag:(NSInteger)tag
{
    EventMessage *eventMsg = (EventMessage *)data.messageObj;
    NSInteger evType = eventMsg.eventData.evType;
    switch (data.commandId_event) {
        case CommandId_Event_conversation:{
            if ((evType&EventTypeConversation_EvTypeConTopMsg)==EventTypeConversation_EvTypeConTopMsg) {
                [self topMsgEvent:data.messageObj];
            }
            if ((evType&EventTypeConversation_EvTypeConSetManager) == EventTypeConversation_EvTypeConSetManager) {
                [self convSetGroupManagers:eventMsg];
            }
            if((evType&EventTypeConversation_EvTypeConUpdateCreator)==EventTypeConversation_EvTypeConUpdateCreator) {
                [self convTransferGroupOwner:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeConExt)==EventTypeConversation_EvTypeConExt) {
                [self convExt:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeConOption) == EventTypeConversation_EvTypeConOption) {
                [self convOption:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeCreateConversation) == EventTypeConversation_EvTypeCreateConversation) {
                [self createConversationEvent:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeConAddMembers) == EventTypeConversation_EvTypeConAddMembers) {
                [self convMembersUpdate:eventMsg state:1];
            }
            if ((evType&EventTypeConversation_EvTypeConDelMembers) == EventTypeConversation_EvTypeConDelMembers) {
                [self convMembersUpdate:eventMsg state:0];
            }
            if ((evType&EventTypeConversation_EvTypeUserNickName) == EventTypeConversation_EvTypeUserNickName) {
                [self convUserNicknameUpdate:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeConvName) == EventTypeConversation_EvTypeConvName) {
                [self convGroupNameUpdate:eventMsg];
            }
            if ((evType&EventTypeConversation_EvTypeConvDescribe) == EventTypeConversation_EvTypeConvDescribe) {
                [self convGroupDescUpdate:eventMsg];
            }
        }
            break;
        case CommandId_Event_userConversation:{
            if ((evType&EventTypeUserConv_EvTypeUserConSilent) == EventTypeUserConv_EvTypeUserConSilent) {
                [self silentConvEvent:eventMsg];
            }
            if ((evType&EventTypeUserConv_EvTypeUserConTopConv) == EventTypeUserConv_EvTypeUserConTopConv) {
                [self topConvEvent:eventMsg];
            }
            if ((evType&EventTypeUserConv_EvTypeUserConExt) == EventTypeUserConv_EvTypeUserConExt) {
                [self convUserExt:eventMsg];
            }
            if ((evType&EventTypeUserConv_EvTypeUserConOption) == EventTypeUserConv_EvTypeUserConOption) {
                [self convUserOption:eventMsg];
            }
            if ((evType&EventTypeUserConv_EvTypeUserConImsext) == EventTypeUserConv_EvTypeUserConImsext) {
                [self convUserImsExt:eventMsg];
            }
            
        }
            break;
        default:
            break;
    }
}

#pragma mark - 事件-创建会话
- (void)createConversationEvent:(EventMessage *)eventMsg
{
    RXIMSession *rxSession = [[RXIMSession alloc]init];
    rxSession.sessionID = eventMsg.conversationId;
    rxSession.type = [self getCovTypeWithCovId:eventMsg.conversationId];
    [[RXIMWCDB sharedSDK] insertSession:rxSession];
    [[RXIMSessionService sharedSDK] fetchConversationInfo:eventMsg.conversationId completionHandler:^(RXIMSession * _Nonnull session, RXIMError * _Nonnull error) {
        if (!error) {
            [[RXIMWCDB sharedSDK] insertSession:session];
            if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onReceiveNewSession:)]) {
                [self.delegate_business onReceiveNewSession:session];
            }
        }else{
            if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onReceiveNewSession:)]) {
                [self.delegate_business onReceiveNewSession:rxSession];
            }
        }
    }];
}

#pragma mark - 事件-会话成员变更（增量）
- (void)convMembersUpdate:(EventMessage *)eventMsg state:(NSInteger)state
{
    if (state == 0) {
        for (ConvMemberSimpleInfo *obj in eventMsg.eventData.membersArray) {
            if ([obj.userId isEqualToString:[RXIMUserUtility sharedManager].userId]) {
                //自己被踢出会话
                RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        //        [[RXIMWCDB sharedSDK] deleteSessionWithTarget:eventMsg.conversationId]; //待定删除会话
                if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionKickGroup:)]) {
                    [self.delegate_business onSessionKickGroup:@[session]];
                }
                break;
            }
        }
    }
    [[RXIMWCDB sharedSDK] updateSessionWithMembers:eventMsg.eventData.membersArray target:eventMsg.conversationId state:state];
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
    if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSesssionMembersChange:)]) {
        [self.delegate_business onSesssionMembersChange:session];
    }
}

#pragma mark - 事件-成员在会话内的昵称变更
- (void)convUserNicknameUpdate:(EventMessage *)eventMsg
{
    ConvMemberSimpleInfo *member = [eventMsg.eventData.membersArray lastObject];
    NSString *userId = member.userId;
    NSString *nickname = member.userName;
    [[RXIMWCDB sharedSDK] updateSessionWithNickname:nickname userId:userId target:eventMsg.conversationId];
    if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserNicknameChange:userId:nickname:)]) {
        [self.delegate_business onSessionUserNicknameChange:eventMsg.conversationId userId:userId nickname:nickname];
    }
}

#pragma mark - 事件-群名称变更
- (void)convGroupNameUpdate:(EventMessage *)eventMsg
{
    NSString *groupName = eventMsg.eventData.convName;
    [[RXIMWCDB sharedSDK] updateGroupName:groupName target:eventMsg.conversationId];
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
    if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionGroupNameChange:)]) {
        [self.delegate_business onSessionGroupNameChange:session];
    }
}

#pragma mark - 事件-群描述变更
- (void)convGroupDescUpdate:(EventMessage *)eventMsg
{
    NSString *groupDesc = eventMsg.eventData.convDesc;
    [[RXIMWCDB sharedSDK] updateGroupDesc:groupDesc target:eventMsg.conversationId];
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
    if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionGroupDescChange:)]) {
        [self.delegate_business onSessionGroupDescChange:session];
    }
}

#pragma mark - 事件-会话扩展字段
-(void)convExt:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithExt:body.ext option:0 evType:EventTypeConversation_EvTypeConExt creator:nil target:eventMsg.conversationId];
    if (res) {
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionInfoChanged:)]) {
            RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
            [self.delegate_business onSessionInfoChanged:session];
        }
    }
}

#pragma mark - 事件-会话选项
-(void)convOption:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithExt:nil option:body.option evType:EventTypeConversation_EvTypeConOption creator:nil target:eventMsg.conversationId];
    if (res) {
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionInfoChanged:)]) {
            RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
            [self.delegate_business onSessionInfoChanged:session];
        }
    }
}

#pragma mark - 事件-置顶/取消置顶消息
-(void)topMsgEvent:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    if (body.topMsg!=nil&&body.topMsg.length!=0) {
        RXIMMessage *msg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:body.topMsg];
        if (msg==nil) {
            return;
        }
    }
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:0 topMsg:eventMsg.eventData.topMsg topMsgUser:eventMsg.eventData.topMsgUser target:eventMsg.conversationId eventType:EventTypeUserConv_EvTypeUserConTopMsg];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionTopMsg:)]) {
            [self.delegate_business onSessionTopMsg:session];
        }
    }
}

#pragma mark - 事件-会话设置管理员
- (void)convSetGroupManagers:(EventMessage *)eventMsg
{
//    EventBody *body = eventMsg.eventData;
//    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithManagers:body.managers target:eventMsg.conversationId];
//    if (res) {
//        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
//        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionSetManagers:)]) {
//            [self.delegate_business onSessionSetManagers:session];
//        }
//    }
}

#pragma mark - 事件-转让群主
- (void)convTransferGroupOwner:(EventMessage *)eventMsg
{
    NSArray *members = eventMsg.eventData.membersArray;
    ConvMemberSimpleInfo *memberInfo = members.firstObject;
    NSString *creator = memberInfo.userId;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithExt:nil option:0 evType:EventTypeConversation_EvTypeConUpdateCreator creator:creator target:eventMsg.conversationId];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionTransferGroupOwner:)]) {
            [self.delegate_business onSessionTransferGroupOwner:session];
        }
    }
}

#pragma mark - 事件-用户会话免打扰
- (void)silentConvEvent:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:body.silent topMsg:nil topMsgUser:nil target:eventMsg.conversationId eventType:eventMsg.eventData.evType];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserSilent:)]) {
            [self.delegate_business onSessionUserSilent:session];
        }
    }
}

#pragma mark - 事件-用户会话置顶
- (void)topConvEvent:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:body.topTime silent:0 topMsg:nil topMsgUser:nil target:eventMsg.conversationId eventType:body.evType];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserTop:)]) {
            [self.delegate_business onSessionUserTop:session];
        }
    }
}

#pragma mark - 事件-会话用户扩展字段变更
- (void)convUserExt:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:body.ext userOption:body.option topTimestamp:0 silent:0 topMsg:nil topMsgUser:nil target:eventMsg.conversationId eventType:body.evType];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserExt:)]) {
            [self.delegate_business onSessionUserExt:session];
        }
    }
}

#pragma mark - 事件-会话用户选项变更
- (void)convUserOption:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:body.ext userImsExt:nil userOption:body.option topTimestamp:0 silent:0 topMsg:nil topMsgUser:nil target:eventMsg.conversationId eventType:body.evType];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserOption:)]) {
            [self.delegate_business onSessionUserOption:session];
        }
    }
}

#pragma mark - 事件-会话用户IMS扩展字段变动
- (void)convUserImsExt:(EventMessage *)eventMsg
{
    EventBody *body = eventMsg.eventData;
    BOOL res = [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:body.imsext userOption:0 topTimestamp:0 silent:0 topMsg:nil topMsgUser:nil target:eventMsg.conversationId eventType:body.evType];
    if (res) {
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:eventMsg.conversationId];
        if ([body.imsext objectForKey:@"snapchat"]) {
            if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserSnapchat:)]) {
                [self.delegate_business onSessionUserSnapchat:session];
            }
        }
        if ([body.imsext objectForKey:@"mark"]) {
            if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserMark:)]) {
                [self.delegate_business onSessionUserMark:session];
            }
        }
        if ([body.imsext objectForKey:@"archive"]) {
            if (self.delegate_business && [self.delegate_business respondsToSelector:@selector(onSessionUserArchive:)]) {
                [self.delegate_business onSessionUserArchive:session];
            }
        }
    }
}

#pragma mark - 通过会话id获取会话类型
-(RXIMSessionType)getCovTypeWithCovId:(NSString *)covId
{
    if (covId != nil) {
        NSString *typeStr = [covId substringWithRange:NSMakeRange(1, 1)];
        return [typeStr integerValue];
    }
    return 0;
}

#pragma mark - 获取已设置的option字段
- (NSInteger)getSetedOption:(NSString *)covId
{
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
    return session.userOption;
}

@end
