//
//  RXIMMessageFTS.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/3/10.
//

#import "RXIMMessageFTS.h"
#import "RXIMMessageFTS+WCTTableCoding.h"
@implementation RXIMMessageFTS

WCDB_IMPLEMENTATION(RXIMMessageFTS)

WCDB_SYNTHESIZE(msgId)
WCDB_SYNTHESIZE(sessionID)
WCDB_SYNTHESIZE(contentStr)
WCDB_SYNTHESIZE(sessionType)
WCDB_SYNTHESIZE(localId)

//WCDB_SYNTHESIZE(fromId)
//WCDB_SYNTHESIZE(toId)
//WCDB_SYNTHESIZE(sessionID)
//WCDB_SYNTHESIZE(receivers)
//WCDB_SYNTHESIZE(sessionType)
//WCDB_SYNTHESIZE(msgType)
//WCDB_SYNTHESIZE(status)
//WCDB_SYNTHESIZE(attr)
//WCDB_SYNTHESIZE(option)
//WCDB_SYNTHESIZE(subType)
//WCDB_SYNTHESIZE(clientType)
//WCDB_SYNTHESIZE(localId)
//WCDB_SYNTHESIZE(inboxId)
//WCDB_SYNTHESIZE(timestamp)
//WCDB_SYNTHESIZE(pushBody)
//WCDB_SYNTHESIZE(ext)
//WCDB_SYNTHESIZE(isRecall)
//WCDB_SYNTHESIZE(content)
//WCDB_SYNTHESIZE(receiverNum)
//WCDB_SYNTHESIZE(unreadCount)
//WCDB_SYNTHESIZE(snapchatTimeout)
//WCDB_SYNTHESIZE(isUrgent)
//WCDB_SYNTHESIZE(urgentMillits)
//WCDB_SYNTHESIZE(urgentToMembers)
//WCDB_SYNTHESIZE(isMark)
//WCDB_SYNTHESIZE(readIdArr)

//WCDB_SYNTHESIZE(RXIMMessageFTS,contentStr)
//WCDB_SYNTHESIZE(RXIMMessageFTS,msgId)
//WCDB_SYNTHESIZE(RXIMMessageFTS,target)
//
//
//WCDB_SYNTHESIZE(RXIMMessageFTS,fromId)
//WCDB_SYNTHESIZE(RXIMMessageFTS,toId)
//WCDB_SYNTHESIZE(RXIMMessageFTS,sessionID)
//WCDB_SYNTHESIZE(RXIMMessageFTS,receivers)
//WCDB_SYNTHESIZE(RXIMMessageFTS,sessionType)
//WCDB_SYNTHESIZE(RXIMMessageFTS,msgType)
//WCDB_SYNTHESIZE(RXIMMessageFTS,status)
//WCDB_SYNTHESIZE(RXIMMessageFTS,attr)
//WCDB_SYNTHESIZE(RXIMMessageFTS,option)
//WCDB_SYNTHESIZE(RXIMMessageFTS,subType)
//WCDB_SYNTHESIZE(RXIMMessageFTS,clientType)
//WCDB_SYNTHESIZE(RXIMMessageFTS,localId)
//WCDB_SYNTHESIZE(RXIMMessageFTS,inboxId)
//WCDB_SYNTHESIZE(RXIMMessageFTS,timestamp)
//WCDB_SYNTHESIZE(RXIMMessageFTS,pushBody)
//WCDB_SYNTHESIZE(RXIMMessageFTS,ext)
//WCDB_SYNTHESIZE(RXIMMessageFTS,isRecall)
//WCDB_SYNTHESIZE(RXIMMessageFTS,content)
//WCDB_SYNTHESIZE(RXIMMessageFTS,receiverNum)
//WCDB_SYNTHESIZE(RXIMMessageFTS,unreadCount)
//WCDB_SYNTHESIZE(RXIMMessageFTS,snapchatTimeout)
//WCDB_SYNTHESIZE(RXIMMessageFTS,isUrgent)
//WCDB_SYNTHESIZE(RXIMMessageFTS,urgentMillits)
//WCDB_SYNTHESIZE(RXIMMessageFTS,urgentToMembers)
//WCDB_SYNTHESIZE(RXIMMessageFTS,isMark)
//WCDB_SYNTHESIZE(RXIMMessageFTS,readIdArr)

//WCDB_INDEX(RXIMMessageFTS,"_index",timestamp) //设置identifier列不建立fts索引
//WCDB_PRIMARY(RXIMMessageFTS,localId) //主键
//WCDB_VIRTUAL_TABLE_MODULE(RXIMMessageFTS, WCTModuleNameFTS3)//设置fts版本
//WCDB_VIRTUAL_TABLE_MODULE(RXIMMessageFTS, @"FTS5")
//WCDB_VIRTUAL_TABLE_TOKENIZE(RXIMMessageFTS, WCTTokenizerNameWCDB) //设置分词器

WCDB_PRIMARY(localId) //主键
WCDB_VIRTUAL_TABLE_MODULE(WCTModuleFTS5) //设置fts版本
WCDB_VIRTUAL_TABLE_TOKENIZE(WCTTokenizerVerbatim) //设置分词器

- (instancetype)initWithMessageDB:(RXIMMessageDB *)msg {
    self = [super init];
        if (self) {

            self.msgId = msg.msgId;
            self.sessionID = msg.sessionID;
            self.contentStr = msg.contentStr;
            self.sessionType = msg.sessionType;
            self.localId = msg.localId;

//            self.fromId = msg.fromId;
//            self.toId = msg.toId;
//            self.receivers = [msg.receivers mutableCopy];
//            self.sessionType = msg.sessionType;
//            self.msgType = msg.msgType;
//            self.attr = msg.attr;
//            self.option = msg.option;
//            self.subType = msg.subType;
//            self.clientType = msg.clientType;
//            self.localId = msg.localId;
//            self.inboxId = msg.inboxId;
//            self.timestamp = msg.timestamp;
//            self.pushBody = msg.pushBody;
//            self.ext = [msg.ext copy];
//            self.receiverNum = msg.receiverNum;
//            self.isRecall = msg.isRecall;
//            self.unreadCount = msg.unreadCount;
//            self.readIdArr = [msg.readIdArr copy];
//            self.snapchatTimeout = msg.snapchatTimeout;
//            self.isUrgent = msg.isUrgent;
//            self.urgentMillits = msg.urgentMillits;
//            self.urgentToMembers = [msg.urgentToMembers copy];
//            self.isMark = msg.isMark;
        }
        return self;
}


@end
