//
//  RXIMMessageFTS+WCTTableCoding.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/3/10.
//

#import "RXIMMessageFTS.h"
#import <WCDB/WCDB.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMessageFTS (WCTTableCoding) <WCTTableCoding>

WCDB_PROPERTY(contentStr)
WCDB_PROPERTY(msgId)
WCDB_PROPERTY(localId)
WCDB_PROPERTY(sessionType)
WCDB_PROPERTY(sessionID)

//
//
//
//
//WCDB_PROPERTY(fromId)
//WCDB_PROPERTY(toId)
//WCDB_PROPERTY(sessionID)
//WCDB_PROPERTY(receivers)
//WCDB_PROPERTY(sessionType)
//WCDB_PROPERTY(msgType)
//WCDB_PROPERTY(status)
//WCDB_PROPERTY(attr)
//WCDB_PROPERTY(option)
//WCDB_PROPERTY(subType)
//WCDB_PROPERTY(clientType)
//WCDB_PROPERTY(localId)
//WCDB_PROPERTY(inboxId)
//WCDB_PROPERTY(timestamp)
//WCDB_PROPERTY(pushBody)
//WCDB_PROPERTY(ext)
//WCDB_PROPERTY(isRecall)
//WCDB_PROPERTY(content)
//WCDB_PROPERTY(receiverNum)
//WCDB_PROPERTY(unreadCount)
//WCDB_PROPERTY(snapchatTimeout)
//WCDB_PROPERTY(isUrgent)
//WCDB_PROPERTY(urgentMillits)
//WCDB_PROPERTY(urgentToMembers)
//WCDB_PROPERTY(isMark)
//WCDB_PROPERTY(readIdArr)


@end

NS_ASSUME_NONNULL_END
