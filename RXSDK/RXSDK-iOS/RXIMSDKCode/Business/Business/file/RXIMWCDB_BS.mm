//
//  RXIMWCDB_BS.m
//  Business
//
//  Created by Elbay on 2024/6/3.
//
#import "RXIMWCDB_BS.h"
#import <WCDB/WCDB.h>
#import <RXIMSdk_business/RXIMMessageDB.h>
#import <RXIMSdk_business/RXIMSessionDB.h>

#import <RXIMSdk_business/RXIMUserUtility.h>
#import <RXIMSdk_business/RXModelTransform.h>
#import <RXIMSdk_business/NSObject+RXUAddition.h>
#import <RXIMSdk_business/RXIMMsgTextContent.h>
#import <RXIMSdk_business/RXIMMsgFaceContent.h>
#import <RXIMSdk_business/RXIMMsgImageContent.h>
#import <RXIMSdk_business/RXIMCommonTool.h>
#import <RXIMSdk_business/RXIMLogManager.h>
#import <RXIMSdk_business/RXIMGroupMember.h>
#import <RXIMSdk_business/RXIMMsgReplyContent.h>

@interface RXIMMessageDB (WCTTableCoding) <WCTTableCoding>
WCDB_PROPERTY(fromId)
WCDB_PROPERTY(toId)
WCDB_PROPERTY(sessionID)
WCDB_PROPERTY(sessionType)
WCDB_PROPERTY(msgType)
WCDB_PROPERTY(status)
WCDB_PROPERTY(attr)
WCDB_PROPERTY(option)
WCDB_PROPERTY(subType)
WCDB_PROPERTY(clientType)
WCDB_PROPERTY(msgId)
WCDB_PROPERTY(localId)
WCDB_PROPERTY(timestamp)
WCDB_PROPERTY(pushBody)
WCDB_PROPERTY(ext)
WCDB_PROPERTY(content)
WCDB_PROPERTY(contentStr)
WCDB_PROPERTY(receivers)
WCDB_PROPERTY(inboxId)
WCDB_PROPERTY(receiverNum)
WCDB_PROPERTY(unreadCount)
WCDB_PROPERTY(isRecall)
WCDB_PROPERTY(snapchatTimeout)
WCDB_PROPERTY(isUrgent)
WCDB_PROPERTY(urgentMillits)
WCDB_PROPERTY(urgentToMembers)
WCDB_PROPERTY(isMark)
WCDB_PROPERTY(readIdArr)

@end


@interface RXIMSessionDB (WCTTableCoding) <WCTTableCoding>

WCDB_PROPERTY(sessionID)
WCDB_PROPERTY(attr)
WCDB_PROPERTY(option)
WCDB_PROPERTY(ext)
WCDB_PROPERTY(createTimestamp)
WCDB_PROPERTY(updateTimestamp)
WCDB_PROPERTY(joinTimestamp)
WCDB_PROPERTY(creator)
WCDB_PROPERTY(userAttr)
WCDB_PROPERTY(userOption)
WCDB_PROPERTY(userExt)
WCDB_PROPERTY(members)
WCDB_PROPERTY(cpid)
WCDB_PROPERTY(type)
WCDB_PROPERTY(status)
WCDB_PROPERTY(lastMessage)
WCDB_PROPERTY(unreadCount)
WCDB_PROPERTY(snapchatTimeout)
WCDB_PROPERTY(topTimestamp)
WCDB_PROPERTY(silent)
WCDB_PROPERTY(isArchive)
WCDB_PROPERTY(isMark)
WCDB_PROPERTY(topMsg)
WCDB_PROPERTY(topMsgUser)
WCDB_PROPERTY(groupName)
WCDB_PROPERTY(groupDesc)

@end
//@interface RXIMWCDB()
//
//@property (nonatomic,strong) WCTDatabase *databaseOrigin;
//
//@end
@implementation RXIMWCDB_BS

static RXIMWCDB_BS *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMWCDB_BS alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 更新会话信息
-(BOOL)updateSessionWithExt:(NSDictionary *)ext option:(NSInteger)option evType:(NSInteger)evType creator:(NSString *)creator target:(NSString *)target
{
    
    BOOL res = true;
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    if ((evType&EventTypeConversation_EvTypeConExt)==EventTypeConversation_EvTypeConExt) {
        sessionDB.ext = ext;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.ext toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((evType&EventTypeConversation_EvTypeConOption)==EventTypeConversation_EvTypeConOption) {
        sessionDB.option = option;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.option toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((evType&EventTypeConversation_EvTypeConUpdateCreator)==EventTypeConversation_EvTypeConUpdateCreator) {
        sessionDB.creator = creator;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.creator toValue:sessionDB where:RXIMSessionDB.sessionID == target];
        RXIMSession *originSession = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
        NSMutableArray *memberArr = [NSMutableArray array];
        for (int i = 0; i<originSession.members.count; i++) {
            RXIMGroupMember *member = [originSession.members objectAtIndex:i];
            if (member.identity == CapacityType_creator&&![member.user_id isEqualToString:creator]) {
                member.identity = CapacityType_common;
            }
            if ([member.user_id isEqualToString:creator]) {
                member.identity = CapacityType_creator;
            }
            NSDictionary *dic = [member rx_modelToJSONObject];
            [memberArr addObject:dic];
        }
        sessionDB.members = memberArr;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.members toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    return res;
}

#pragma mark - 更新会话用户信息
-(BOOL)updateSessionWithUserExt:(NSDictionary *)userExt
                     userImsExt:(NSDictionary *)userImsExt
                     userOption:(NSInteger)userOption
                   topTimestamp:(NSInteger)topTimestamp
                         silent:(BOOL)silent
                         topMsg:(NSString *)topMsg
                     topMsgUser:(NSString *)topMsgUser
                         target:(NSString *)target
                      eventType:(NSInteger)eventType
{
    BOOL res = true;
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    if ((eventType&EventTypeUserConv_EvTypeUserConExt) == EventTypeUserConv_EvTypeUserConExt ) {
        sessionDB.userExt = userExt;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.userExt toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConOption) == EventTypeUserConv_EvTypeUserConOption ) {
        sessionDB.userOption = userOption;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.userOption toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConTopConv) == EventTypeUserConv_EvTypeUserConTopConv ) {
        sessionDB.topTimestamp = topTimestamp;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.topTimestamp toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConSilent) == EventTypeUserConv_EvTypeUserConSilent ) {
        sessionDB.silent = silent;
        res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.silent toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConTopMsg) == EventTypeUserConv_EvTypeUserConTopMsg ) {
        sessionDB.topMsg = topMsg;
        sessionDB.topMsgUser = topMsgUser;
        res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.topMsg,RXIMSessionDB.topMsgUser} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConImsext) == EventTypeUserConv_EvTypeUserConImsext ) {
        if ([userImsExt objectForKey:@"snapchat"]) {
            sessionDB.snapchatTimeout = [[userImsExt objectForKey:@"snapchat"] integerValue];
            sessionDB.userOption = userOption;
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.snapchatTimeout,RXIMSessionDB.userOption} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ([userImsExt objectForKey:@"mark"]) {
            sessionDB.isMark = [[userImsExt objectForKey:@"mark"] boolValue];
            res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.isMark toValue:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ([userImsExt objectForKey:@"archive"]) {
            sessionDB.isArchive = [[userImsExt objectForKey:@"archive"] boolValue];
            res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.isArchive toValue:sessionDB where:RXIMSessionDB.sessionID == target];
        }
    }
    
    return res;
}

#pragma mark - 更新会话成员
-(BOOL)updateSessionWithMembers:(NSArray *)members target:(NSString *)target state:(NSInteger)state
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    RXIMSessionDB *originSessionDB = [self.databaseOrigin getObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    __block NSMutableArray *memberArr = [NSMutableArray arrayWithArray:originSessionDB.members];
    if (state == 1) { //新增
        for (ConvMemberSimpleInfo *convMember in members) {
            RXIMGroupMember *memberObj = [[RXIMGroupMember alloc]init];
            memberObj.user_id = convMember.userId;
            memberObj.nickname = convMember.userName;
            memberObj.join_milli_ts = convMember.joinMilliTs;
            memberObj.identity = CapacityType_common;
            NSDictionary *dic = memberObj.rx_modelToJSONObject;
            [memberArr addObject:dic];
        }
    }else{//删除
        for (ConvMemberSimpleInfo *convMember in members) {
            [originSessionDB.members enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(NSDictionary * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                RXIMGroupMember *memberObj = [RXIMGroupMember rx_modelWithDictionary:obj];
                if([convMember.userId isEqualToString:memberObj.user_id]){
                    [memberArr removeObjectAtIndex:idx];
                }
            }];
        }
    }
    sessionDB.members = memberArr;
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperty:RXIMSessionDB.members toValue:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}


@end
