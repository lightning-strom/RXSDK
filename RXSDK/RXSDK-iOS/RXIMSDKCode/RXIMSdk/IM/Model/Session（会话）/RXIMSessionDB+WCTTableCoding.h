//
//  RXIMSession+WCTTableCoding.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/3/14.
//

#import "RXIMSessionDB.h"
#import <WCDB/WCDB.h>

NS_ASSUME_NONNULL_BEGIN

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
WCDB_PROPERTY(firstUnreadMsgId)

@end

NS_ASSUME_NONNULL_END
