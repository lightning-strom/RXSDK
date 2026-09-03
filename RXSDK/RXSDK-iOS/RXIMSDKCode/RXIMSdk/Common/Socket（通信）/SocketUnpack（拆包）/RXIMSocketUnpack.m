//
//  RXIMSocketUnpack.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMSocketUnpack.h"
#import "Control.pbobjc.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonDevice.h"
#import "NSData+RXIMCommonCategory.h"
#import "NSData+RXIMAES.h"
#import <CommonCrypto/CommonCryptor.h>
#import "NSString+RXIMCommon.h"
#import "RXModelTransform.h"
#import "RXIMSocket.h"
#import "RXIMSocketPacket.h"
#import "RXIMLogManager.h"
#import "RXIMMsgHandle.h"

@interface RXIMSocketUnpack ()

@property (nonatomic, strong) NSMutableArray *cacheMsgArr;
@property (nonatomic, strong) NSMutableArray *resMsgArr;
@property (nonatomic, strong) NSData *remainData;

@end

@implementation RXIMSocketUnpack

+ (instancetype)sharedManager
{
    static RXIMSocketUnpack *sharedManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedManager = [[RXIMSocketUnpack alloc] init];
    });
    return sharedManager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.cacheMsgArr = [NSMutableArray array];
        self.remainData = [NSData data];
    }
    return self;
}

#pragma mark -- <解析消息体>
- (NSMutableArray *)fetchReceiveMsg:(NSData *)data
{
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    // data转十六进制字符串
    NSString *converStr = [NSString converDataToString16:data];
    NSString *magicStr = [converStr substringToIndex:4];
    // 判断magic是否符合规则，不符合规则说明是断包，要拼接上次粘包截断的数据
    if ([magicStr isEqualToString:@"1415"]) {
        self.remainData = [NSData data];
        if (converStr.length < 36) {
            //包头不完整
            RXLogInfo(prefixStr, @"包头不完整");
            self.remainData = data;
            return nil;
        }else{
            model = [self transReceiveMsgHead:converStr];
        }
    } else {
        if (self.remainData.length > 0) {
            // 拼接断包并重新解析
            NSMutableData *appendData = [NSMutableData dataWithData:self.remainData];
            [appendData appendData:data];
            
            data = [NSData dataWithData:appendData];
            NSString *converStr = [NSString converDataToString16:data];
            model = [[RXIMMsgModel alloc] init];
            model = [self transReceiveMsgHead:converStr];

//            [[RXIMSocketUnpack sharedManager] fetchReceiveMsg:appendData];
        }
    }
    
    NSData *lengthData = [data subdataWithRange:NSMakeRange(18, data.length - 18)];
    NSInteger length = model.payloadLength;
    NSInteger ret = lengthData.length;
    NSData *payloadData;
    if (ret < length) {
        //包不完整
        RXLogInfo(prefixStr, @"包不完整");
        self.remainData = data;
        return nil;
    }else{
        //完整包或者有多余包
        payloadData = [lengthData subdataWithRange:NSMakeRange(0, length)];
    }
    if (model.flag.hasPayload) {
        if (model.flag.isEncrypt) {
            // 解密
            NSString *secKey = [RXIMUserUtility sharedManager].secret;
            NSData *decryptData = [NSData AES256DecryptWithCipherData:payloadData withKey:secKey];
            model.messageObj = [self transPayload:model payload:decryptData];
        } else {
            model.messageObj = [self transPayload:model payload:payloadData];
        }
    }
    //给服务器发送确认消息
    if (model.commandStack == CommandStack_control) {
        [RXIMMsgHandle fetchReceiveMsgAsMsgType:model];
    }
    // 计算剩余长度
    NSInteger remainLength = ret - length;
    if (remainLength > 0) {
        //有多余包
        RXLogInfo(prefixStr, @"有多余包");
        [self.cacheMsgArr addObject:model];
        //剩余字节继续解析
        NSData *remainData = [data subdataWithRange:NSMakeRange(18 + length, remainLength)];
        [[RXIMSocketUnpack sharedManager] fetchReceiveMsg:remainData];
    }else{
        [self.cacheMsgArr addObject:model];
        if (self.resMsgArr!=nil && self.resMsgArr.count>0) {
            if ([self.resMsgArr respondsToSelector:@selector(removeAllObjects)]) {
                [self.resMsgArr removeAllObjects];
            }
        }
        self.resMsgArr = [NSMutableArray arrayWithArray:self.cacheMsgArr];
        [self.cacheMsgArr removeAllObjects];
    }
    return self.resMsgArr;
}

// 消息接收头部数据处理（进制转换）
- (RXIMMsgModel *)transReceiveMsgHead:(NSString *)converStr
{
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    
    // magic
    NSString *magicStr = [converStr substringToIndex:4];
    // version(4) messageType(4)
    NSString *vmStr = [converStr substringWithRange:NSMakeRange(4, 2)];
    // command
    NSString *commandStr = [converStr substringWithRange:NSMakeRange(6, 4)];
    //flag
    NSString *flagStr = [converStr substringWithRange:NSMakeRange(10, 2)];
    //client sequence id
    NSString *clientSequenceIdStr = [converStr substringWithRange:NSMakeRange(12, 16)];
    //payload length
    NSString *payloadLengthStr = [converStr substringWithRange:NSMakeRange(28, 8)];
    /**
     * 十六进制转十进制
     */
    NSString *vmStr1 = [NSString getBinaryByHex:vmStr];
    // 版本号
    NSString *versionStr = [vmStr1 substringToIndex:4];
    NSInteger versionInt = [[NSString binaryToDecimal:versionStr] integerValue];
    // 消息类型
    NSString *msgType = [vmStr1 substringFromIndex:4];
    NSInteger msgTypeInt = [[NSString binaryToDecimal:msgType] integerValue];
    
    NSString *commandStr1 = [NSString getBinaryByHex:commandStr];
    // command stack
    NSString *commandStack = [commandStr1 substringToIndex:6];
    NSInteger commandStackInt = [[NSString binaryToDecimal:commandStack] integerValue];
    // command id
    NSString *commandId = [commandStr1 substringFromIndex:6];
    NSInteger commandIdInt = [[NSString binaryToDecimal:commandId] integerValue];
    
    NSString *flagStr1 = [NSString getBinaryByHex:flagStr];
    
    NSString *clientSequenceIdStr1 = [NSString getBinaryByHex:clientSequenceIdStr];
    long clientSequenceIdLong = [[NSString binaryToDecimal:clientSequenceIdStr1] longLongValue];
    model.protocolSeqId = clientSequenceIdLong;
    NSString *payloadLengthStr1 = [NSString getBinaryByHex:payloadLengthStr];
    NSInteger payloadLengthInt = [[NSString binaryToDecimal:payloadLengthStr1] integerValue];
    model.payloadLength = payloadLengthInt;
    
    // 赋值
    model.magic = magicStr;
    model.version = versionInt;
    model.messageType = [self transMessageType:msgTypeInt];
    model.commandStack = [self transCommandStack:commandStackInt];
    if (model.commandStack == CommandStack_control) {
        model.commandId_control = [self transCommandId_control:commandIdInt];
        //暂时注释 RXLogInfo(prefixStr, @"receive commandid：%ld,%ld,%ld",model.messageType,model.commandStack,model.commandId_control);
    } else if(model.commandStack == CommandStack_msg){
        model.commandId_chat = [self transCommandId_chat:commandIdInt];
        //暂时注释 RXLogInfo(prefixStr, @"receive commandid：%ld,%ld,%ld flagStr = %@" ,model.messageType,model.commandStack,model.commandId_chat,flagStr1);
        RXLogInfo(prefixStr, @"receive protocolSeqId: %ld",model.protocolSeqId);
    }else if(model.commandStack == CommandStack_Event){
        model.commandId_event = [self transCommandId_event:commandIdInt];
        //暂时注释  RXLogInfo(prefixStr, @"receive commandid：%ld,%ld,%ld",model.messageType,model.commandStack,model.commandId_event);
    }
    model.flag = [self transFlag:flagStr1];
    return model;
}

// messageType
- (RecMsgType)transMessageType:(NSInteger)messageType
{
    RecMsgType res;
    switch (messageType) {
        case 1:
            res = RecMsgType_request;
            break;
        case 2:
            res = RecMsgType_ack;
            break;
        case 3:
            res = RecMsgType_noti;
            break;
        default:
            res = 0;
            break;
    }
    return res;
}

// commandStack
- (CommandStack)transCommandStack:(NSInteger)commandStack
{
    CommandStack res;
    switch (commandStack) {
        case 1:
            res = CommandStack_control;
            break;
        case 2:
            res = CommandStack_msg;
            break;
        case 3:
            res = CommandStack_Event;
            break;
        default:
            res = 0;
            break;
    }
    return res;
}

// commandId_control
- (CommandId_Control)transCommandId_control:(NSInteger)commandId_control
{
    CommandId_Control res;
    switch (commandId_control) {
        case 1:
            res = CommandId_Control_heart;
            break;
        case 2:
            res = CommandId_Control_conn;
            break;
        case 3:
            res = CommandId_Control_ack;
            break;
        case 4:
            res = CommandId_Control_disconnect;
            break;
        case 5:
            res = CommandId_Control_serverKick;
            break;
        case 6:
            res = CommandId_Control_rebalance;
            break;
        default:
            res = 0;
            break;
    }
    return res;
}

// commandId_chat
- (CommandId_Chat)transCommandId_chat:(NSInteger)commandId_chat
{
    CommandId_Chat res;
    switch (commandId_chat) {
        case 1:
            res = CommandId_Chat_newMsgNotice;
            break;
        case 2:
            res = CommandId_Chat_sync;
            break;
        case 3:
            res = CommandId_Chat_history;
            break;
        case 4:
            res = CommandId_Chat_msg;
            break;
        case 5:
            res = CommandId_Chat_readList;
            break;
        default:
            res = 0;
            break;
    }
    return res;
}

// commandId_event
- (CommandId_Event)transCommandId_event:(NSInteger)commandId_event
{
    CommandId_Event res;
    switch (commandId_event) {
        case 1:
            res = CommandId_Event_conversation;
            break;
        case 2:
            res = CommandId_Event_userConversation;
            break;
        case 3:
            res = CommandId_Event_collection;
            break;
        default:
            res = 0;
            break;
    }
    return res;
}

// flag
- (RXIMMsgFlag *)transFlag:(NSString *)flag
{
    RXIMMsgFlag *msgFlag = [[RXIMMsgFlag alloc] init];
    msgFlag.hasPayload = [[flag substringFromIndex:flag.length - 1] boolValue];
    msgFlag.isEncrypt = [[flag substringWithRange:NSMakeRange(flag.length - 2, 1)] boolValue];
    msgFlag.isCompress = [[flag substringWithRange:NSMakeRange(flag.length - 3, 1)] boolValue];
    msgFlag.isError = [[flag substringWithRange:NSMakeRange(flag.length-4, 1)] boolValue];
    
    return msgFlag;
}

#pragma mark -- <处理payload>
- (id)transPayload:(RXIMMsgModel *)message payload:(NSData *)payload
{
    RXIMMsgModel *msgModel = message;
    NSError *error;
    if (message.flag.isError) {
        msgModel.messageObj = (Error *)[Error parseFromData:payload error:&error];
        return msgModel.messageObj;
    }
    if (msgModel.commandStack == CommandStack_control) {
        switch (msgModel.commandId_control) {
            //socket连接回执
            case CommandId_Control_ack:
            {
                ConnectAck *ack = (ConnectAck *)[ConnectAck parseFromData:payload error:&error];
                msgModel.messageObj = ack;
                [RXIMUserUtility sharedManager].protocolSeqId = 0;
                [RXIMUserUtility sharedManager].PingIntervalMilli = ack.pingIntervalMilli;
                [RXIMUserUtility sharedManager].discontinuousinboxIddelayMilliTs = ack.discontinuousInboxIddelayMilliTs;
                break;
            }
            //服务器断开回执
            case CommandId_Control_serverKick:
            {
                msgModel.messageObj = (Error *)[Error parseFromData:payload error:&error];
            }
                break;
                
            default:
                break;
        }
    } else if (msgModel.commandStack == CommandStack_msg) {
        if (msgModel.messageType == RecMsgType_ack) {
            switch (msgModel.commandId_chat) {
                case CommandId_Chat_msg:{
                    msgModel.messageObj = (ChatMessageAck *)[ChatMessageAck parseFromData:payload error:&error];
                    break;
                }
                case CommandId_Chat_sync:{
                    msgModel.messageObj = (InboxResp *)[InboxResp parseFromData:payload error:&error];
                    break;
                }
                case CommandId_Chat_history:{
                    msgModel.messageObj = (HistoryResp *)[HistoryResp parseFromData:payload error:&error];
                    break;
                }
                default:
                    break;
            }
        }else{
            switch (msgModel.commandId_chat) {
                case CommandId_Chat_msg:
                {
                    msgModel.messageObj = (ChatMessage *)[ChatMessage parseFromData:payload error:&error];
                    break;
                }
                default:
                    break;
            }
        }
    }else if (msgModel.commandStack == CommandStack_Event) {
        msgModel.messageObj = (EventMessage *)[EventMessage parseFromData:payload error:&error];
    }
    return msgModel.messageObj;
}

@end
