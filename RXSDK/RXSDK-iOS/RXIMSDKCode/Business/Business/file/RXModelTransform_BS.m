//
//  RXModelTransform_BS.m
//  Business
//
//  Created by Elbay on 2024/6/3.
//

#import "RXModelTransform_BS.h"
#import <RXIMSdk_business/RXIMSessionDB.h>
#import <RXIMSdk_business/RXIMMessageDB.h>
#import <RXIMSdk_business/RXIMSession.h>
#import <RXIMSdk_business/RXIMUserUtility.h>
#import <RXIMSdk_business/RXIMGroupMember.h>
#import <RXIMSdk_business/NSObject+RXUAddition.h>
@implementation RXModelTransform_BS

+(RXIMSessionDB *)sessionTosessionDB:(RXIMSession *)session
{
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.sessionID = session.sessionID;
    sessionDB.attr = session.attr;
    sessionDB.ext = session.ext;
    sessionDB.option = session.option;
    sessionDB.createTimestamp = session.createTimestamp;
    sessionDB.updateTimestamp = session.updateTimestamp;
    sessionDB.joinTimestamp = session.joinTimestamp;
    sessionDB.userAttr = session.userAttr;
    sessionDB.userExt = session.userExt;
    sessionDB.userOption = session.userOption;
    NSMutableArray *membersObj = [NSMutableArray array];
    for (RXIMGroupMember *obj in session.members) {
        NSDictionary *dic = [obj rx_modelToJSONObject];
        [membersObj addObject:dic];
    }
    sessionDB.members = membersObj;
    sessionDB.cpid = session.cpid;
    sessionDB.type = session.type;
    sessionDB.status = session.status;
    sessionDB.unreadCount = session.unreadCount;
    sessionDB.firstUnreadMsgId = session.firstUnreadMsgId;
    RXIMMessageDB *msgDB = [RXModelTransform msgToMsgDB:session.lastMessage];
    sessionDB.lastMessage = msgDB.rx_modelToJSONString;
    sessionDB.snapchatTimeout = session.snapchatTimeout;
    sessionDB.topTimestamp = session.topTimestamp;
    sessionDB.silent = session.silent;
    sessionDB.isMark = session.isMark;
    sessionDB.isArchive = session.isArchive;
    sessionDB.topMsg = session.topMsg;
    sessionDB.topMsgUser = session.topMsgUser;
    sessionDB.creator = session.creator;
    sessionDB.groupName = session.groupName;
    sessionDB.groupDesc = session.groupDesc;
    return sessionDB;
}

+(RXIMSession *)sessionDBTosession:(RXIMSessionDB *)sessionDB
{
    RXIMSession *session = [[RXIMSession alloc]init];
    session.sessionID = sessionDB.sessionID;
    session.attr = sessionDB.attr;
    session.ext = sessionDB.ext;
    session.option = sessionDB.option;
    session.createTimestamp = sessionDB.createTimestamp;
    session.updateTimestamp = sessionDB.updateTimestamp;
    session.joinTimestamp = sessionDB.joinTimestamp;
    session.userAttr = sessionDB.userAttr;
    session.userExt = sessionDB.userExt;
    session.userOption = sessionDB.userOption;
    NSMutableArray *membersArr = [NSMutableArray array];
    for (NSDictionary *obj in sessionDB.members) {
        RXIMGroupMember *memberObj = [RXIMGroupMember rx_modelWithDictionary:obj];
        [membersArr addObject:memberObj];
    }
    session.members = membersArr;
    session.cpid = sessionDB.cpid;
    session.type = sessionDB.type;
    session.status = sessionDB.status;
    session.unreadCount = sessionDB.unreadCount;
    session.firstUnreadMsgId = sessionDB.firstUnreadMsgId;
    RXIMMessageDB *msgDB = [RXIMMessageDB rx_modelWithJSON:sessionDB.lastMessage];
    session.lastMessage = [RXModelTransform msgDBToMsg:msgDB];
    session.snapchatTimeout = sessionDB.snapchatTimeout;
    session.topTimestamp = sessionDB.topTimestamp;
    session.silent = sessionDB.silent;
    session.isMark = sessionDB.isMark;
    session.isArchive = sessionDB.isArchive;
    session.topMsg = sessionDB.topMsg;
    session.topMsgUser = sessionDB.topMsgUser;
    session.creator = sessionDB.creator;
    session.groupName = sessionDB.groupName;
    session.groupDesc = sessionDB.groupDesc;
    return session;
}

@end
