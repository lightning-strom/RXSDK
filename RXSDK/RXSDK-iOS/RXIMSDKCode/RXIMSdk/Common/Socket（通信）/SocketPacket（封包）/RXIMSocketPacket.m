//
//  RXIMSocketPacket.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/26.
//

#import "RXIMSocketPacket.h"
#import "NSData+RXIMCommonCategory.h"
#import "NSData+RXIMAES.h"
#import "RXIMUserUtility.h"
#import "RXIMLogManager.h"

#define VARINT_FIX (0x80)

@interface RXIMSocketPacket ()

@property (nonatomic, strong) NSMutableData *dataBuffer;

@end

@implementation RXIMSocketPacket

+ (instancetype)sharedManager
{
    static RXIMSocketPacket *sharedManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedManager = [[RXIMSocketPacket alloc] init];
    });
    return sharedManager;
}

#pragma mark - 发送组包
- (NSData *)handleSendData:(NSData *)data model:(RXIMMsgModel *)model needEncrypt:(BOOL)needEncrypt
{
    NSMutableData *connectData = [[NSMutableData alloc] init];
    int dataValue = (int)data.length;
//    00000011
    Byte magicByte[2] = {0x14, 0x15};
//    Byte byte[] = {0x14, 0x15, 0x01, 0x04, 0x02, 0x01};
//    NSData *tempHead = [[NSData alloc] initWithBytes:byte length:6];
//    [connectData appendData:tempHead];
    
    // magicByte 2 + Version 1 + Command stack 1 + commandid 1  + FlagByte 1 + Eight 8
    [connectData appendData:[[NSData alloc] initWithBytes:magicByte length:2]];
    [connectData appendData:[self getVersionAndMsgTypeByte:model]];
    [connectData appendData:[self getCommandStackByte:model]];
    [connectData appendData:[self getCommandIdByte:model]];
    [connectData appendData:[self getFlagByte:model]];
    [connectData appendData:[[NSData alloc] initWithBytes:[self toEightBytes:model.protocolSeqId] length:8]];
    //暂时注释RXLogInfo(prefixStr, @"sender commandid：%ld,%ld,%ld,%ld,%ld",model.messageType,model.commandStack,model.commandId_control,model.commandId_chat,model.protocolSeqId);
//    [connectData appendData:[NSData encodeVarint:dataValue]];
    
    if (needEncrypt) {
        // 签名加密
        
        // 获取key
        NSString *secKey = [RXIMUserUtility sharedManager].secret;
        NSData *secret = [NSData AEC256EncryptWithData:data withKey:secKey];
//        NSData *base64Data = [secret base64EncodedDataWithOptions:0];
//        NSString *baseString = [[NSString alloc]initWithData:base64Data encoding:NSUTF8StringEncoding];
//        [connectData appendData:[NSData encodeVarint:(int)secret.length]];
        [connectData appendData: [[NSData alloc] initWithBytes:[self toFourBytes:(int)secret.length] length:4]];
        [connectData appendData:secret];
    } else {
//        [connectData appendData:[NSData encodeVarint:dataValue]];
        [connectData appendData: [[NSData alloc] initWithBytes:[self toFourBytes:(int)dataValue] length:4]];
        [connectData appendData:data];
    }

    return connectData;
}

// int->byte[]
-(Byte *)toFourBytes:(int)value{
    Byte *bytes = malloc(4);
    bytes[0] = (Byte)(value>>24 & 0xFF);
    bytes[1] = (Byte)((value>>16) & 0xFF);
    bytes[2] = (Byte)((value>>8) & 0xFF);
    bytes[3] = (Byte)(value & 0xFF);
    return bytes;
}

// long->byte[]
-(Byte *)toEightBytes:(long)value{
    Byte *bytes = malloc(8);
    bytes[0] = (Byte)((value>>56) & 0xFF);
    bytes[1] = (Byte)((value>>48) & 0xFF);
    bytes[2] = (Byte)((value>>40) & 0xFF);
    bytes[3] = (Byte)((value>>32) & 0xFF);
    bytes[4] = (Byte)((value>>24) & 0xFF);
    bytes[5] = (Byte)((value>>16) & 0xFF);
    bytes[6] = (Byte)((value>>8) & 0xFF);
    bytes[7] = (Byte)(value & 0xFF);
    return bytes;
}

// version && messageType
- (NSData *)getVersionAndMsgTypeByte:(RXIMMsgModel *)model
{
    switch (model.messageType) {
        case RecMsgType_request: // 请求消息
        {
            Byte byte[1] = {0x01};
            return [[NSData alloc] initWithBytes:byte length:1];
            break;
        }
        case RecMsgType_ack: // 确认消息
        {
            Byte byte[1] = {0x02};
            return [[NSData alloc] initWithBytes:byte length:1];
            break;
        }
        case RecMsgType_noti: // 通知消息
        {
            Byte byte[1] = {0x03};
            return [[NSData alloc] initWithBytes:byte length:1];
            break;
        }
        default:
            return nil;
            break;
    }
}

// commandStack
- (NSData *)getCommandStackByte:(RXIMMsgModel *)model
{
    switch (model.commandStack) {
        case CommandStack_control: // 控制消息
        {
            //暂时注释RXLogInfo(prefixStr, @"weiyongjian*0");
            Byte byte[1] = {0x04};
            return [[NSData alloc] initWithBytes:byte length:1];
            break;
        }
        case CommandStack_msg: // 消息
        {
            RXLogInfo(prefixStr, @"weiyongjian*1");
            Byte byte[1] = {0x08};
            return [[NSData alloc] initWithBytes:byte length:1];
            break;
        }
        default:
            return nil;
            break;
    }
}

// commandId
- (NSData *)getCommandIdByte:(RXIMMsgModel *)model
{
    if (model.commandStack == CommandStack_control) { // 控制消息
        switch (model.commandId_control) {
            case CommandId_Control_heart: // 心跳消息
            {
                Byte byte[1] = {0x01};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Control_conn: // 客户端连接服务器
            {
                Byte byte[1] = {0x02};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Control_ack: // 服务器应答连接情况
            {
                Byte byte[1] = {0x03};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Control_disconnect: // 客户端断开连接
            {
                Byte byte[1] = {0x04};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Control_serverKick: // 服务器断开客户端
            {
                Byte byte[1] = {0x05};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Control_rebalance: // 服务器要求客户端将连接断开并再次获取连接地址重连
            {
                Byte byte[1] = {0x06};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            default:
                return nil;
                break;
        }
    } else if (model.commandStack == CommandStack_msg) { // 消息
        switch (model.commandId_chat) {
            case CommandId_Chat_newMsgNotice:
            {
                Byte byte[1] = {0x01};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Chat_sync:
            {
                Byte byte[1] = {0x02};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Chat_history:
            {
                Byte byte[1] = {0x03};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
                
            case CommandId_Chat_msg:
            {
                Byte byte[1] = {0x04};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            case CommandId_Chat_readList: // 消息已读
            {
                Byte byte[1] = {0x05};
                return [[NSData alloc] initWithBytes:byte length:1];
                break;
            }
            default:
                return nil;
                break;
        }
    }else {
        return nil;
    }
}

// flag
- (NSData *)getFlagByte:(RXIMMsgModel *)model
{
    if (model.flag.hasPayload) {
        if (model.flag.isEncrypt) {
            Byte byte[1] = {0x03};
            return [[NSData alloc] initWithBytes:byte length:1];
        } else {
            Byte byte[1] = {0x01};
            return [[NSData alloc] initWithBytes:byte length:1];
        }
    } else {
        Byte byte[1] = {0x00};
        return [[NSData alloc] initWithBytes:byte length:1];
    }
}

- (NSMutableData *)dataBuffer
{
    if (!_dataBuffer) {
        _dataBuffer = [NSMutableData data];
    }
    return _dataBuffer;
}

@end
