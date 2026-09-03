//
//  RXIMInternalApi.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import "NSObject+RXUAddition.h"
#import "RXIMInternalApi.h"
#import "RXIMCommonTool.h"
#import "RXIMApiUrl.h"
#import "RXIMUserUtility.h"
#import "RXIMWCDB.h"

@implementation RXIMInternalApi

#pragma mark - 刷新token

+ (RXCommonRequest *)buildRefreshTokenRequestWithRefreshToken:(NSString *)refreshToken
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:refreshToken forKey:@"refresh_token"];
    
    RXCommonRequest *request = [[RXCommonRequest alloc] initWithApiName:[RXIMApiUrl getRefreshTokenUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

//获取/更换entry地址
+ (RXCommonRequest *)buildGetEntryAddressWithOldEntryAddress:(NSArray *)oldEntryAddress
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if (oldEntryAddress!=nil) {
        [dic setValue:oldEntryAddress forKey:@"entry_addrs"];
    }
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl getInitUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildCreatConversation:(NSString * _Nonnull)conversationId
                                     option:(NSInteger)option
                              creatorOption:(NSInteger)creatorOption
                                    members:(NSArray * _Nullable)members
                                  groupName:(NSString * _Nullable)groupName
                                  groupDesc:(NSString * _Nullable)groupDesc
                                        ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                     imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    [dic setValue:@(option) forKey:@"option"];
    [dic setValue:@(creatorOption) forKey:@"creator_option"];
    if (members != nil && [members count]>0) {
        [dic setValue:members forKey:@"members"];
    }
    if (!IsEmpty(groupName)) {
        [dic setValue:groupName forKey:@"conv_name"];
    }
    if (!IsEmpty(groupDesc)) {
        [dic setValue:groupDesc forKey:@"conv_desc"];
    }
    [dic setValue:ext forKey:@"ext"];
    [dic setValue:imsExt forKey:@"ims_ext"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl creatSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildUpdateConversationInfo:(NSString * _Nonnull)conversationId
                                          option:(NSInteger)option
                                             ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext
                                          imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt
                                          evType:(NSInteger)evType
                                         creator:(NSString *)creator
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    if ([RXIMUserUtility sharedManager].isBusiness) {
        [dic setValue:@(evType) forKey:@"event_type"];
        if ((evType&EventTypeConversation_EvTypeConExt)==EventTypeConversation_EvTypeConExt) {
            [dic setValue:ext forKey:@"ext"];
        }
        if ((evType&EventTypeConversation_EvTypeConOption)==EventTypeConversation_EvTypeConOption) {
            [dic setValue:@(option) forKey:@"option"];
        }
        if ((evType&EventTypeConversation_EvTypeConImsext)==EventTypeConversation_EvTypeConImsext) {
            [dic setValue:imsExt forKey:@"ims_ext"];
        }
        if ((evType&EventTypeConversation_EvTypeConUpdateCreator)==EventTypeConversation_EvTypeConUpdateCreator) {
            [dic setValue:creator forKey:@"creator"];
        }
    }else{
        [dic setValue:@(option) forKey:@"option"];
        [dic setValue:ext forKey:@"ext"];
        [dic setValue:imsExt forKey:@"ims_ext"];
    }
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl updateSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}


+ (RXCommonRequest *)buildDeleteConversation:(NSString *)conversationId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl deleteSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGetConversationInfo:(NSString *)conversationId
{
    NSString *urlString = [NSString stringWithFormat:@"%@?conversation_id=%@", [RXIMApiUrl getSessionUrl], conversationId];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:urlString andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildJoinConversation:(RXIMJoinSession *)joinSession
{
    NSDictionary *joinSessionDic = joinSession.rx_modelToJSONObject;
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl joinSessionUrl] andParams:joinSessionDic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildLeaveConversations:(NSArray * _Nonnull)conversationIds tips:(RXIMMsgConvTipsContent *)tips
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationIds forKey:@"conversation_ids"];
    if (tips != nil) {
        NSString *tipsStr = [tips rx_modelToJSONString];
        [dic setValue:tipsStr forKey:@"content"];
    }
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl leaveSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildUpdateUserInfoToConversation:(NSString *)conversationId
                                                option:(NSInteger)option
                                                   ext:(NSDictionary<NSString *,NSString *> *)ext
                                                imsExt:(NSDictionary<NSString *,NSString *> *)imsExt
                                             eventType:(NSInteger)eventType
                                          topTimestamp:(NSInteger)topTimestamp
                                                silent:(BOOL)silent
                                          cancelTopMsg:(NSString *)cancelTopMsg
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    if ([RXIMUserUtility sharedManager].isBusiness) {
        [dic setValue:@(eventType) forKey:@"event_type"];
        if ((eventType&EventTypeUserConv_EvTypeUserConTopConv)==EventTypeUserConv_EvTypeUserConTopConv) {
            [dic setValue:@(topTimestamp) forKey:@"top"];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConSilent)==EventTypeUserConv_EvTypeUserConSilent) {
            [dic setValue:@(silent) forKey:@"silent"];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConTopMsg)==EventTypeUserConv_EvTypeUserConTopMsg) {
            if (cancelTopMsg != nil) {
                [dic setValue:cancelTopMsg forKey:@"cancel_top_msg"];
            }
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConImsext)==EventTypeUserConv_EvTypeUserConImsext) {
            [dic setValue:imsExt forKey:@"ims_ext"];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConExt)==EventTypeUserConv_EvTypeUserConExt) {
            [dic setValue:ext forKey:@"ext"];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConOption)==EventTypeUserConv_EvTypeUserConOption) {
            [dic setValue:@(option) forKey:@"option"];
        }
    }else{
        [dic setValue:imsExt forKey:@"ims_ext"];
        [dic setValue:ext forKey:@"ext"];
        [dic setValue:@(option) forKey:@"option"];
    }
    
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl updateUserDataSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGetConversationList
{
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl getSessionListUrl] andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildDeleteServerMsgs:(NSArray *)msgIds
                                     covId:(NSString *)covId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableArray *msgArr = [NSMutableArray array];
    for (NSString *msgId in msgIds) {
        RXIMMessage *msg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
        NSMutableDictionary *msgDic = [NSMutableDictionary dictionary];
        [msgDic setValue:msgId forKey:@"msg_id"];
        [msgDic setValue:@(msg.inboxId) forKey:@"inbox_id"];
        [msgArr addObject:msgDic];
    }
    [dic setValue:msgArr forKey:@"msgs"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    [dic setValue:covId forKey:@"conversation_id"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl deleteSessionMsgUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildUpdateServerMessageExt:(NSArray * _Nonnull)msgIds
                                          target:(NSString * _Nonnull)target
                                             ext:(NSDictionary<NSString *,NSString *> *)ext
                                          imsExt:(NSDictionary <NSString *,NSString *> *)imsExt
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableArray *msgs = [NSMutableArray array];
    NSInteger option;
    for (NSString *msgId in msgIds) {
        RXIMMessage *msgObj = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
        NSMutableDictionary *msgDic = [NSMutableDictionary dictionary];
        option = msgObj.option;
        [msgDic setValue:msgId forKey:@"msg_id"];
        [msgDic setValue:@(msgObj.inboxId) forKey:@"inbox_id"];
        [msgs addObject:msgDic];
    }
    [dic setValue:target forKey:@"conversation_id"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    [dic setValue:msgs forKey:@"msgs"];
    [dic setValue:ext forKey:@"ext"];
    [dic setValue:imsExt forKey:@"ims_ext"];
    [dic setValue:@(option) forKey:@"option"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl updateMsgExtUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildTopMessageInConversation:(NSString *)target
                                             msgId:(NSString *)msgId
                                             state:(NSInteger)state
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if (state == 1) {
        [dic setValue:msgId forKey:@"top_msg"];
    }else{
        [dic setValue:@"" forKey:@"top_msg"];
    }
    [dic setValue:target forKey:@"conversation_id"];
    [dic setValue:@(0) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl topConversationMsgUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildSetGroupManagers:(NSArray *)managers
                                     covId:(NSString *)covId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:managers forKey:@"members"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl setGroupManagersUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGroupKickMembers:(NSArray *)members
                                     covId:(NSString *)covId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:members forKey:@"members"];
    [dic setValue:@(0) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl groupkickMembersUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGroupInviteMembers:(NSArray *)members
                                     covId:(NSString *)covId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:members forKey:@"members"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl groupInviteMembersUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildAddCollection:(NSArray *)msgIds
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:msgIds forKey:@"msgids"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl addCollectionUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildDeleteCollection:(NSArray *)msgIds
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:msgIds forKey:@"msgids"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl deleteCollectionUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGetCollectionList
{
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl getCollectionListUrl] andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGetCollectionMsgs:(NSArray *)msgIds
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:msgIds forKey:@"msgids"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl getCollectionMsgsUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildSetNicknameInCov:(NSString *)covId
                                  nickname:(NSString *)nickname
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:nickname forKey:@"nickname"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl setNicknameInConvUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildSetGroupNameWithCovId:(NSString *)covId
                                      groupName:(NSString *)groupName
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:groupName forKey:@"conv_name"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl setGroupNameUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildSetGroupDescWithCovId:(NSString *)covId
                                      groupDesc:(NSString *)groupDesc
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:covId forKey:@"conversation_id"];
    [dic setValue:groupDesc forKey:@"conv_desc"];
    [dic setValue:@([RXIMUserUtility sharedManager].clientType) forKey:@"client_type"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl setGroupDescUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildGetRtcAuthInfo:(NSString *)channelId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:channelId forKey:@"channelid"];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl getRtcAutoInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (RXCommonRequest *)buildSearchMessage:(RXIMSearchRequestModel *)model
{
    NSDictionary *dic = [model rx_modelToJSONObject];
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl searchMessageUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

@end
