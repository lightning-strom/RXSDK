//
//  RXIMMsgHandle.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/14.
//

#import "RXIMMsgHandle.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonDevice.h"
#import "RXIMWCDB.h"
#import "NSData+RXIMAES.h"
#import <CommonCrypto/CommonCryptor.h>
#import "Control.pbobjc.h"
#import "RXIMSocketPacket.h"
#import "RXIMSocket.h"
#import "RXIMWebSocket.h"
#import "NSString+RXIMCommon.h"

@implementation RXIMMsgHandle

/**
 * 处理发送成功的消息
 * 修改消息发送状态和服务器消息id
 */
+ (RXIMMessage *)handleSendSuccessMsg:(RXIMMsgModel *)msgModel
{
    ChatMessageAck *sendAck = (ChatMessageAck *)msgModel.messageObj;
    RXIMMessage *msg;
    switch (msgModel.commandId_chat) {
            //发送消息回执
        case CommandId_Chat_msg:{
            msg = [[RXIMWCDB sharedSDK] getMsgWithLocalId:sendAck.uuid];
            //渠道消息inboxid不更新
            if (msg.sessionType != RXIMSessionType_channel) {
                [RXIMUserUtility sharedManager].maxInboxId = (NSInteger)sendAck.inboxId;
            }
            if (msg.msgType == RXIMMessageType_read) {
                msg.msgType = RXIMMessageType_read;
                msg.status = RXIMMsgStatus_success;
                msg.timestamp = (NSInteger)sendAck.milliTs;
                msg.inboxId = (NSInteger)sendAck.inboxId;
                [[RXIMWCDB sharedSDK] updateMsgWithUnreadCount:0 msgId:sendAck.msgId];
            }else if(msg.msgType == RXIMMessageType_recall) {
                msg.msgType = RXIMMessageType_recall;
                msg.status = RXIMMsgStatus_success;
                msg.timestamp = (NSInteger)sendAck.milliTs;
                msg.inboxId = (NSInteger)sendAck.inboxId;
                [[RXIMWCDB sharedSDK] updateMsgWithIsRevoke:YES msgId:sendAck.msgId];
            }else if(msg.msgType == RXIMServerMessageType_SysMsgUrgent) {
                [[RXIMWCDB sharedSDK] updateMsgWithIsUrgent:YES millits:sendAck.milliTs toMembers:msg.receivers msgId:sendAck.msgId];
                msg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:sendAck.msgId];
            }else{
                [[RXIMWCDB sharedSDK] updateMsgWithMsgId:sendAck.msgId inboxId:(NSInteger)sendAck.inboxId status:RXIMMsgStatus_success timestamp:(NSInteger)sendAck.milliTs localId:sendAck.uuid];
                msg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:sendAck.msgId];
            }
            
        }
            break;
        default:
            break;
    }
    return msg;
}

+ (RXIMError *)handleSendFailureMsg:(RXIMMsgModel *)msgModel
{
    RXIMError *rxError = [[RXIMError alloc]init];
    Error *error = (Error *)msgModel.messageObj;
    rxError.code = error.code;
    rxError.developerMessage = error.content;
    return rxError;
}

+ (RXIMMessage *)handleSendSuccessSession:(RXIMMsgModel *)msgModel
{
    ChatMessageAck *sendAck = (ChatMessageAck *)msgModel.messageObj;
    RXIMMessage *msg = [[RXIMWCDB sharedSDK] getMsgWithLocalId:sendAck.uuid];
    return msg;
}

/**
 * 根据接收的消息类型做处理
 */
+ (void)fetchReceiveMsgAsMsgType:(RXIMMsgModel *)msgModel
{
//    NSError *error;
    if (msgModel.commandStack == CommandStack_control) {
        switch (msgModel.commandId_control) {
            case CommandId_Control_ack:
            {
                // 头部内容
                NSLog(@"CommandId_Control_ack");
                RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
                model.version = 0;
                model.messageType = RecMsgType_request;
                model.commandStack = CommandStack_control;
                model.commandId_control = CommandId_Control_heart;
                
                RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
                flag.isEncrypt = NO;
                flag.hasPayload = YES;
                model.flag = flag;
                
                int timestamp = (int)[RXIMCommonDevice getTimestamp];
                NSData *heartData = [[RXIMSocketPacket sharedManager] handleSendData:[NSData dataWithBytes:&timestamp length: sizeof(timestamp)] model:model needEncrypt:NO];
                
                // 发送心跳消息
                if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                    [[RXIMWebSocket sharedSDK] sendData:heartData commandStack:model.commandStack];
                    [[RXIMWebSocket sharedSDK] openHeartThread];
                }else{
                    [[RXIMSocket sharedSDK] sendData:heartData commandStack:model.commandStack];
                    [[RXIMSocket sharedSDK] openHeartThread];
                }
                break;
            }
            case CommandId_Control_heart:
            {
                break;
            }
            default:
                break;
        }
    } else if (msgModel.commandStack == CommandStack_msg) {
        switch (msgModel.commandId_chat) {
            case CommandId_Chat_msg:
            {
                if (msgModel.messageType == RecMsgType_noti) {
                    // 头部内容
                    // 给服务器发送确认消息
                    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
                    model.version = 0;
                    model.messageType = RecMsgType_ack;
                    model.commandStack = CommandStack_msg;
                    model.commandId_chat = CommandId_Chat_msg;
                    model.protocolSeqId = msgModel.protocolSeqId;
                    
                    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
                    flag.isEncrypt = YES;
                    flag.hasPayload = YES;
                    model.flag = flag;
                    
                    ChatMessage *singleMsg = (ChatMessage *)msgModel.messageObj;
                    ChatMessageAck *payload = [[ChatMessageAck alloc] init];
                    payload.inboxId = singleMsg.inboxId;
                    payload.msgId = singleMsg.msgId;
                    [RXIMUserUtility sharedManager].msgLocalId+=1;
//                    payload.localId = [NSString stringWithFormat:@"%ld",[RXIMUserUtility sharedManager].msgLocalId];
                    payload.uuid = singleMsg.uuid;
//                    payload.timestamp = singleMsg.timestamp;
                    payload.milliTs = [RXIMCommonDevice getTimestamp];
                    
                    NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:[payload data] model:model needEncrypt:YES];
                    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                        [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
                    }else{
                        [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
                    }
                }
                break;
            }
            default:
                break;
        }
    }
}

#pragma mark - 封装客户端连接服务器消息
+ (NSData *)getConnectData
{
    NSInteger timestamp = [RXIMCommonDevice getTimestamp];
    // 获取key
    NSString *secKey = [RXIMUserUtility sharedManager].secret;
//    Timestamp+UserID+CPID+ProductID+ChannelID
    NSString *sign = [NSString stringWithFormat:@"%ld%@%ld%@%@", (long)timestamp, [RXIMUserUtility sharedManager].userId,[RXIMUserUtility sharedManager].cpid, [RXIMUserUtility sharedManager].appId,[RXIMUserUtility sharedManager].channelId];
    
    // 签名加密
    NSData *secret = [NSData AEC256EncryptWithPlainText:sign withKey:secKey];
    NSData *base64Data = [secret base64EncodedDataWithOptions:0];
    NSString *baseString = [[NSString alloc]initWithData:base64Data encoding:NSUTF8StringEncoding];
    ClientInfo *clientinfo = [[ClientInfo alloc]init];
    clientinfo.cpid = (uint32_t)[RXIMUserUtility sharedManager].cpid;
    clientinfo.clientType = (int32_t)[RXIMUserUtility sharedManager].clientType;
    clientinfo.productId = [RXIMUserUtility sharedManager].appId;
    clientinfo.channelId = [RXIMUserUtility sharedManager].channelId;
    clientinfo.deviceCode = [RXIMCommonDevice getDeviceCodeInKeychain];
    clientinfo.userId = [RXIMUserUtility sharedManager].userId;
    clientinfo.language = @"zh-CN";
    
    Connect *connect = [[Connect alloc] init];
    connect.hasClientInfo = NO;
//    connect.option = RXIMMsgOption_enableSync|RXIMMsgOption_saveHistory;
    connect.option = 1;
    connect.clientInfo = clientinfo;
    connect.token = [RXIMUserUtility sharedManager].token;
    connect.milliTs = timestamp;
    connect.sign = baseString;
    return [connect data];
}

@end
