//
//  RXIMMessageDB+WCTTableCoding.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/3/15.
//
#import <WCDB/WCDB.h>
#import "RXIMMessageDB.h"

NS_ASSUME_NONNULL_BEGIN

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
WCDB_PROPERTY(replyEmoji)

@end

NS_ASSUME_NONNULL_END
