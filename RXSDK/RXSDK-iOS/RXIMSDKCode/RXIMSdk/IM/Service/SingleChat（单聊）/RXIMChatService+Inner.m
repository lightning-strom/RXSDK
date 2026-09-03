//
//  RXIMChatService+Inner.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//

#import "RXIMChatService+Inner.h"
#import "RXIMUserUtility.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"
#import "RXIMMsgContinuityModel.h"
#import "RXIMMsgContinuityHandle.h"
#import "RXIMSocketPacket.h"
#import "RXIMSocket.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMCommonTool.h"
#import "RXIMCommonDevice.h"
#import "RXModelTransform.h"
#import "RXIMWebSocket.h"
#import "RXIMChatService_business.h"

@implementation RXIMChatService (Inner)

- (void)receiveMessageHandle:(NSArray *)msgs
{
    RXLogDebug(prefixStr, nil);
    NSMutableArray *insertMsgsAry = [NSMutableArray array];
    NSMutableArray *resMsgsAry = [NSMutableArray array];
    [msgs enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMMessageIMS *message = nil;
        if ([obj isKindOfClass:[RXIMMsgContinuityModel class]]) {
            RXIMMsgContinuityModel *model = (RXIMMsgContinuityModel *)obj;
            message = model.msg;
        }else if([obj isKindOfClass:[RXIMMessageIMS class]]){
            RXIMMessageIMS *msg = (RXIMMessageIMS *)obj;
            message = msg;
        }
        if (message!=nil) {
            RXLogInfo(prefixStr, @"同步消息类型：%ld 消息id:%@ inboxid:%ld timestamp:%ld",message.msgType,message.msgId,message.inboxId,message.timestamp);
            if (message.msgType == RXIMMessageType_read) {
                //已读消息不保存，需要返回上层
                RXIMMessage *readMsg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:message.msgId];
                //发送的消息被读取了
                if (readMsg && [readMsg.fromId isEqualToString:[RXIMUserUtility sharedManager].userId]) {
                    NSInteger unreadCount = readMsg.unreadCount - 1;
                    if (unreadCount < 0) {
                        unreadCount = 0;
                    }
                    NSMutableArray *readArr = [NSMutableArray arrayWithArray:readMsg.readIdArr];
                    [readArr addObject:message.fromId];
                    NSLog(@"将要更新已读数组");
                    [[RXIMWCDB sharedSDK] updateMsgWithReadArr:readArr msgId:readMsg.msgId];
                    NSLog(@"将要更新消息未读数");

                    [[RXIMWCDB sharedSDK] updateMsgWithUnreadCount:unreadCount msgId:readMsg.msgId];
                }
            }else if(message.msgType == RXIMMessageType_recall){
                //撤回消息不保存,更新撤回消息状态,需要返回上层
                [[RXIMWCDB sharedSDK] updateMsgWithIsRevoke:YES msgId:message.msgId];
                [self handleReplyMsgFromRecallMsg:message.msgId target:message.sessionID];
            }else if(message.msgType == RXIMMessageType_snapchat){
                //阅后即焚消息不保存，删除本地原消息，需要返回上层
                [[RXIMWCDB sharedSDK] deleteMsgWithMsgId:message.msgId];
            }else if(message.msgType == RXIMMessageType_Custom){
                //加入会话消息,不保存，不需要返回上层
                if (message.subType == JoinConversation) {
                    return;
                }
                //离开会话消息
                else if(message.subType == LeaveConversation){
                    return;
                }else{
                    [insertMsgsAry addObject:message];
                }
            }else if(message.msgType == RXIMServerMessageType_deleteMsg){
                //消息删除，删除本地原消息，需要返回上层
                RXIMMessage *deleteMsg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:message.msgId];
                if (self.delegate && [self.delegate respondsToSelector:@selector(onServerMessageDelete:)]) {
                    [self.delegate onServerMessageDelete:deleteMsg];
                }
                [[RXIMWCDB sharedSDK] deleteMsgWithMsgId:message.msgId];
                return;
                
            }else if(message.msgType == RXIMServerMessageType_deleteConv){
                return;
            }else if(message.msgType == RXIMServerMessageType_SysMsgUrgent){
                RXIMMessage *originalMsg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:message.msgId];
                originalMsg.isUrgent = YES;
                originalMsg.urgentMillits = message.timestamp;
                originalMsg.urgentToMembers = message.receivers;
                id delegate_business = [RXIMChatService_business sharedSDK].delegate_business;
                if (delegate_business && [delegate_business respondsToSelector:@selector(onMessageUrgent:)]) {
                    [delegate_business onMessageUrgent:originalMsg];
                }
                [[RXIMWCDB sharedSDK] updateMsgWithIsUrgent:YES millits:message.timestamp toMembers:message.receivers msgId:message.msgId];
                return;
                
            }else if(message.msgType == RXIMServerMessageType_SysMsgUpdate){
                RXIMMessage *originalMsg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:message.msgId];
                originalMsg.isMark = [[message.imsExt objectForKey:@"mark"] boolValue];
                id delegate_business = [RXIMChatService_business sharedSDK].delegate_business;
                if (delegate_business && [delegate_business respondsToSelector:@selector(onMessageMark:)]) {
                    [delegate_business onMessageMark:originalMsg];
                }
                [[RXIMWCDB sharedSDK] updateMsgWithIsMark:originalMsg.isMark msgId:message.msgId];
                return;
                
            }else{
                if ([RXIMUserUtility sharedManager].maxInboxId != 0){
                    //不是新设备的接收消息未读数置为1，代表未读
                    message.unreadCount = 1;
                }
//                [insertMsgsAry addObject:message];
                RXLogInfo(prefixStr, @"covtype = %ld",message.sessionType);
                [[RXIMWCDB sharedSDK] insertMsg:message];
            }
            RXIMMessage *resMessage = [RXModelTransform msgImsToMsg:message];
            [resMsgsAry addObject:resMessage];
        }
    }];
//    [[RXIMWCDB sharedSDK] insertMsgs:insertMsgsAry];
//    if ([RXIMUserUtility sharedManager].maxInboxId != 0){
        if ([resMsgsAry count]!=0) {
            if (self.delegate && [self.delegate respondsToSelector:@selector(receiveMessage:)]) {
                [self.delegate receiveMessage:resMsgsAry];
            }
        }

//    }
}



#pragma mark - 获取离线消息
- (void)getServerOfflineMsgWithStartinboxId:(NSInteger)startinboxId endinboxId:(NSInteger)endinboxId limit:(NSInteger)limit
{
    /* 请求的是闭开区间 */
    [RXIMUserUtility sharedManager].startInboxId=startinboxId;
    [RXIMUserUtility sharedManager].endInboxId=endinboxId;
    [RXIMMsgContinuityHandle sharedSDK].isSync = true;
    RXLogInfo(prefixStr, @"sync count = %ld",limit);
    RXLogDebug(prefixStr, nil);
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.commandId_chat = CommandId_Chat_sync;
    model.protocolSeqId = 0;
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = YES;
    flag.hasPayload = YES;
    model.flag = flag;
    
    InboxReq *req = [[InboxReq alloc]init];
    req.fetchCount = (int)limit;
    req.startInboxId = startinboxId;
    req.endInboxId = endinboxId;
    
    NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:[req data] model:model needEncrypt:YES];
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }else{
        [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }
}

#pragma mark - 发送会话操作自定义消息
-(void)sendCovCustomMsg:(NSInteger)state covId:(NSString *)covId covType:(RXIMSessionType)covType
{
    RXIMMsgCustomContent *content = [[RXIMMsgCustomContent alloc]init];
    content.data = nil;
    RXIMMessageIMS *message = [[RXIMMessageIMS alloc]init];
    message.sessionType = covType;
    message.fromId = [RXIMUserUtility sharedManager].userId;
    message.sessionID = covId;
    message.content = content;
    message.ext = @{};
//    message.localId = [RXIMUserUtility sharedManager].msgLocalId += 1;
    message.msgType = RXIMMessageType_Custom;
    message.subType = state;
    message.timestamp = [RXIMCommonDevice getTimestamp];
    message.status = RXIMMsgStatus_sending;
    message.clientType = [RXIMUserUtility sharedManager].clientType;
    message.receivers = @[].mutableCopy;
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.commandId_chat = CommandId_Chat_msg;
    message.status = RXIMMsgStatus_sending;
    NSInteger timestamp = [RXIMCommonDevice getTimestamp];
    message.timestamp = timestamp;
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = YES;
    flag.hasPayload = YES;
    model.flag = flag;
    NSData *msgData = [RXModelTransform configMessageModelToData:message];
    NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:msgData model:model needEncrypt:YES];
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }else{
        [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }
}

-(NSString *)getLocalIdStr
{
    NSString *localIdStr=[NSString stringWithFormat:@"%ld%ld",[RXIMCommonTool getRandomInt:1000],[RXIMCommonDevice getTimestamp]];
    [RXIMUserUtility sharedManager].msgLocalId = localIdStr.integerValue;
    return localIdStr;
}

- (void)handleReplyMsgFromRecallMsg:(NSString *)msgId target:(NSString *)target
{
    NSArray *msgArr = [[RXIMWCDB sharedSDK] updateReplyMsgWithOriginMsgId:msgId target:target];
    if (msgArr!=nil && [msgArr count]>0) {
        if (self.delegate && [self.delegate respondsToSelector:@selector(onReplyOriginMessageRecalled:)]) {
            [self.delegate onReplyOriginMessageRecalled:msgArr];
        }
    }
}

@end
