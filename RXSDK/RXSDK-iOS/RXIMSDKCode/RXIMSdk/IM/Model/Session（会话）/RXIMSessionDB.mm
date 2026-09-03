//
//  RXIMSessionDB.m
//  RXIMSdk
//
//  Created by 魏永健 on 2022/3/16.
//

#import "RXIMSessionDB.h"
#import "RXIMSessionDB+WCTTableCoding.h"

@implementation RXIMSessionDB

WCDB_IMPLEMENTATION(RXIMSessionDB)
WCDB_SYNTHESIZE(sessionID)
WCDB_SYNTHESIZE(attr)
WCDB_SYNTHESIZE(option)
WCDB_SYNTHESIZE(ext)
WCDB_SYNTHESIZE(createTimestamp)
WCDB_SYNTHESIZE(updateTimestamp)
WCDB_SYNTHESIZE(joinTimestamp)
WCDB_SYNTHESIZE(userAttr)
WCDB_SYNTHESIZE(userOption)
WCDB_SYNTHESIZE(userExt)
WCDB_SYNTHESIZE(creator)
WCDB_SYNTHESIZE(members)
WCDB_SYNTHESIZE(cpid)
WCDB_SYNTHESIZE(type)
WCDB_SYNTHESIZE(status)
WCDB_SYNTHESIZE(lastMessage)
WCDB_SYNTHESIZE(unreadCount)
WCDB_SYNTHESIZE(snapchatTimeout)
WCDB_SYNTHESIZE(topTimestamp)
WCDB_SYNTHESIZE(silent)
WCDB_SYNTHESIZE(isMark)
WCDB_SYNTHESIZE(isArchive)
WCDB_SYNTHESIZE(topMsg)
WCDB_SYNTHESIZE(topMsgUser)
WCDB_SYNTHESIZE(groupName)
WCDB_SYNTHESIZE(groupDesc)

WCDB_SYNTHESIZE(firstUnreadMsgId)

WCDB_PRIMARY(sessionID) //主键
WCDB_INDEX("_index",createTimestamp) //索引

//WCDB_SYNTHESIZE(RXIMSessionDB, sessionID)
//WCDB_SYNTHESIZE(RXIMSessionDB, attr)
//WCDB_SYNTHESIZE(RXIMSessionDB, option)
//WCDB_SYNTHESIZE(RXIMSessionDB, ext)
//WCDB_SYNTHESIZE(RXIMSessionDB, createTimestamp)
//WCDB_SYNTHESIZE(RXIMSessionDB, updateTimestamp)
//WCDB_SYNTHESIZE(RXIMSessionDB, joinTimestamp)
//WCDB_SYNTHESIZE(RXIMSessionDB, userAttr)
//WCDB_SYNTHESIZE(RXIMSessionDB, userOption)
//WCDB_SYNTHESIZE(RXIMSessionDB, userExt)
//WCDB_SYNTHESIZE(RXIMSessionDB, creator)
//WCDB_SYNTHESIZE(RXIMSessionDB, members)
//WCDB_SYNTHESIZE(RXIMSessionDB, cpid)
//WCDB_SYNTHESIZE(RXIMSessionDB, type)
//WCDB_SYNTHESIZE(RXIMSessionDB, status)
//WCDB_SYNTHESIZE(RXIMSessionDB, lastMessage)
//WCDB_SYNTHESIZE(RXIMSessionDB, unreadCount)
//WCDB_SYNTHESIZE(RXIMSessionDB, snapchatTimeout)
//WCDB_SYNTHESIZE(RXIMSessionDB, topTimestamp)
//WCDB_SYNTHESIZE(RXIMSessionDB, silent)
//WCDB_SYNTHESIZE(RXIMSessionDB, isMark)
//WCDB_SYNTHESIZE(RXIMSessionDB, isArchive)
//WCDB_SYNTHESIZE(RXIMSessionDB, topMsg)
//WCDB_SYNTHESIZE(RXIMSessionDB, topMsgUser)
//WCDB_SYNTHESIZE(RXIMSessionDB, groupName)
//WCDB_SYNTHESIZE(RXIMSessionDB, groupDesc)
//
//WCDB_SYNTHESIZE(RXIMSessionDB, firstUnreadMsgId)
//
//WCDB_PRIMARY(RXIMSessionDB, sessionID) //主键
//WCDB_INDEX(RXIMSessionDB,"_index",createTimestamp) //索引

@end
