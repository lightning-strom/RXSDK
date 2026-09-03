//
//  RXIMMessage.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMMessageDB.h"
#import "RXIMMessageDB+WCTTableCoding.h"

@implementation RXIMMessageDB

WCDB_IMPLEMENTATION(RXIMMessageDB)
WCDB_SYNTHESIZE(fromId)
WCDB_SYNTHESIZE(toId)
WCDB_SYNTHESIZE(sessionID)
WCDB_SYNTHESIZE(receivers)
WCDB_SYNTHESIZE(sessionType)
WCDB_SYNTHESIZE(msgType)
WCDB_SYNTHESIZE(status)
WCDB_SYNTHESIZE(attr)
WCDB_SYNTHESIZE(option)
WCDB_SYNTHESIZE(subType)
WCDB_SYNTHESIZE(clientType)
WCDB_SYNTHESIZE(msgId)
WCDB_SYNTHESIZE(localId)
WCDB_SYNTHESIZE(inboxId)
WCDB_SYNTHESIZE(timestamp)
WCDB_SYNTHESIZE(pushBody)
WCDB_SYNTHESIZE(ext)
WCDB_SYNTHESIZE(isRecall)
WCDB_SYNTHESIZE(content)
WCDB_SYNTHESIZE(receiverNum)
WCDB_SYNTHESIZE(contentStr)
WCDB_SYNTHESIZE(unreadCount)
WCDB_SYNTHESIZE(snapchatTimeout)
WCDB_SYNTHESIZE(isUrgent)
WCDB_SYNTHESIZE(urgentMillits)
WCDB_SYNTHESIZE(urgentToMembers)
WCDB_SYNTHESIZE(isMark)
WCDB_SYNTHESIZE(readIdArr)
WCDB_SYNTHESIZE(replyEmoji)


WCDB_PRIMARY(localId) //主键

//联合主键
//WCDB_MULTI_PRIMARY(RXIMMessageDB, "MultiPrimaryConstraint", msgId)
//WCDB_MULTI_PRIMARY(RXIMMessageDB, "MultiPrimaryConstraint", localId)

WCDB_INDEX("_index",timestamp) //索引

 
//WCDB_SYNTHESIZE(RXIMMessageDB, fromId)
//WCDB_SYNTHESIZE(RXIMMessageDB, toId)
//WCDB_SYNTHESIZE(RXIMMessageDB, sessionID)
//WCDB_SYNTHESIZE(RXIMMessageDB, receivers)
//WCDB_SYNTHESIZE(RXIMMessageDB, sessionType)
//WCDB_SYNTHESIZE(RXIMMessageDB, msgType)
//WCDB_SYNTHESIZE(RXIMMessageDB, status)
//WCDB_SYNTHESIZE(RXIMMessageDB, attr)
//WCDB_SYNTHESIZE(RXIMMessageDB, option)
//WCDB_SYNTHESIZE(RXIMMessageDB, subType)
//WCDB_SYNTHESIZE(RXIMMessageDB, clientType)
//WCDB_SYNTHESIZE(RXIMMessageDB, msgId)
//WCDB_SYNTHESIZE(RXIMMessageDB, localId)
//WCDB_SYNTHESIZE(RXIMMessageDB, inboxId)
//WCDB_SYNTHESIZE(RXIMMessageDB, timestamp)
//WCDB_SYNTHESIZE(RXIMMessageDB, pushBody)
//WCDB_SYNTHESIZE(RXIMMessageDB, ext)
//WCDB_SYNTHESIZE(RXIMMessageDB, isRecall)
//WCDB_SYNTHESIZE(RXIMMessageDB, content)
//WCDB_SYNTHESIZE(RXIMMessageDB, receiverNum)
//WCDB_SYNTHESIZE(RXIMMessageDB, contentStr)
//WCDB_SYNTHESIZE(RXIMMessageDB, unreadCount)
//WCDB_SYNTHESIZE(RXIMMessageDB, snapchatTimeout)
//WCDB_SYNTHESIZE(RXIMMessageDB, isUrgent)
//WCDB_SYNTHESIZE(RXIMMessageDB, urgentMillits)
//WCDB_SYNTHESIZE(RXIMMessageDB, urgentToMembers)
//WCDB_SYNTHESIZE(RXIMMessageDB, isMark)
//WCDB_SYNTHESIZE(RXIMMessageDB, readIdArr)
//
//WCDB_PRIMARY(RXIMMessageDB,localId) //主键
////联合主键
////WCDB_MULTI_PRIMARY(RXIMMessageDB, "MultiPrimaryConstraint", msgId)
////WCDB_MULTI_PRIMARY(RXIMMessageDB, "MultiPrimaryConstraint", localId)
//
//WCDB_INDEX(RXIMMessageDB,"_index",timestamp) //索引

- (instancetype)init
{
    self = [super init];
    if (self) {
        // 消息默认发送失败，发送成功后更改状态
        self.status = RXIMMsgStatus_sending;
    }
    return self;
}

//- (instancetype)initWithCoder:(NSCoder *)aDecoder
//{
//    self = [super init];
//    if (self)
//    {
//        self.fromId = [aDecoder decodeObjectForKey:@"sender"];
//        self.target = [aDecoder decodeObjectForKey:@"target"];
//        self.pushBody = [aDecoder decodeObjectForKey:@"pushBody"];
//        self.ext = [aDecoder decodeObjectForKey:@"ext"];
//        self.content = [aDecoder decodeObjectForKey:@"content"];
//        self.contentStr = [aDecoder decodeObjectForKey:@"contentStr"];
//        self.atPushBody = [aDecoder decodeObjectForKey:@"atPushBody"];
//        self.at = [aDecoder decodeObjectForKey:@"at"];
//    }
//    return self;
//}

//- (void)encodeWithCoder:(NSCoder *)aCoder
//{
//    [aCoder encodeObject:_sender forKey:@"sender"];
//    [aCoder encodeObject:_target forKey:@"target"];
//    [aCoder encodeObject:_pushBody forKey:@"pushBody"];
//    [aCoder encodeObject:_ext forKey:@"ext"];
//    [aCoder encodeObject:_content forKey:@"content"];
//    [aCoder encodeObject:_contentStr forKey:@"contentStr"];
//    [aCoder encodeObject:_atPushBody forKey:@"atPushBody"];
//    [aCoder encodeObject:_at forKey:@"at"];
//}

@end
