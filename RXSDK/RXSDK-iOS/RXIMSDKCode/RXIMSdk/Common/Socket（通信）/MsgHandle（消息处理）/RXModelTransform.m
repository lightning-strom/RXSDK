//
//  RXModelTransform.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/11.
//

#import <UIKit/UIKit.h>
#import "NSObject+RXUAddition.h"
#import "RXModelTransform.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonDevice.h"
#import "RXIMWCDB.h"
#import "RXIMMessageIMS.h"
#import "RXIMMsgConvTipsContent.h"
#import "RXIMMsgTextContent.h"
#import "RXIMMsgFaceContent.h"
#import "RXIMMsgImageContent.h"
#import "RXIMMsgAudioContent.h"
#import "RXIMMsgVideoContent.h"
#import "RXIMMsgFileContent.h"
#import "RXIMMsgLBSContent.h"
#import "RXIMMsgCustomContent.h"
#import "RXIMMsgReplyContent.h"
#import "RXIMMsgConvTipsContent.h"
#import "RXIMMsgCombineTransmitContent.h"
#import "RXIMMsgImageContent_pb.h"
#import "RXIMMsgAudioContent_pb.h"
#import "RXIMMsgLBSContent_pb.h"
#import "RXIMMsgReplyContent_pb.h"
#import "RXIMMsgVideoContent_pb.h"
#import "RXIMMsgFileContent_pb.h"
#import "RXIMLogManager.h"
#import "RXIMGroupMember.h"
#import "RXIMCommonTool.h"

typedef enum : NSUInteger {
    MsgAttr_read = 1,
    MsgAttr_revoke = 2,
    MsgAttr_delete = 4,
} MsgAttr;

typedef enum : NSUInteger {
    convOption_top = 1,
    convOption_noDisturb = 2,
} convOption;

@implementation RXModelTransform

#pragma mark -- <消息接收模型转换>

#pragma mark - 消息体转换
+ (RXIMMessageIMS *)rxModelToB_msg:(RXIMMsgModel *)model
{
    RXIMMessageIMS *message;
    switch (model.commandId_chat) {
        case CommandId_Chat_msg:
        {
            ChatMessage *singleMsg = (ChatMessage *)model.messageObj;
            message = [RXModelTransform rxModelToB_singleMsg:singleMsg];
        }
            break;
        default:
            break;
    }
    return message;
}

#pragma mark - 离线消息模型解析
+ (NSArray *)rxModelToB_syncMsg:(RXIMMsgModel *)model
{
    NSMutableArray *syncMsgModelAry = [NSMutableArray array];
    if (model.commandId_chat == CommandId_Chat_sync) {
        InboxResp *inboxResp = (InboxResp *)model.messageObj;
        for (ChatMessage *chatMsg in inboxResp.messagesArray) {
            RXIMMessageIMS *msg = [RXModelTransform rxModelToB_singleMsg:chatMsg];
            [syncMsgModelAry addObject:msg];
        }
    }
    return syncMsgModelAry;
}

#pragma mark - 历史消息模型解析
+ (RXIMHistoryMsgResp *)rxModelToB_historyMsg:(RXIMMsgModel *)model
{
    HistoryResp *resp = (HistoryResp *)model.messageObj;
    NSMutableArray *rxMsgAry = [NSMutableArray array];
    for (ChatMessage *obj in resp.messagesArray) {
        RXIMMessageIMS *rxMsg = [RXModelTransform rxModelToB_singleMsg:obj];
        RXIMMessage *msg = [RXModelTransform msgImsToMsg:rxMsg];
        [rxMsgAry addObject:msg];
    }
    //消息逆序
    rxMsgAry = [[rxMsgAry reverseObjectEnumerator] allObjects].mutableCopy;
    RXIMHistoryMsgResp *rxResp = [[RXIMHistoryMsgResp alloc]init];
    rxResp.messages = rxMsgAry;
    rxResp.count = resp.count;
    rxResp.isDone = resp.done;
    return rxResp;
}

/** single content */
+ (id)fetchSingleReceiveContent:(ChatMessage *)message
{
    return [RXModelTransform rxReceiveJsonContent_model:message.type body:message.content];
}

#pragma mark - DB消息内容json转model
+ (id)rxDBJsonContent_model:(RXIMMessageType)type body:(NSString *)body
{
    id contentRes;
    switch (type) {
        case MessageType_UnknownMt:
            break;
        case MessageType_Tips:
        {
            contentRes = [RXIMMsgConvTipsContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Text:
        {
            contentRes = [RXIMMsgTextContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Image:
        {
            contentRes = [RXIMMsgImageContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Face:
        {
            contentRes = [RXIMMsgFaceContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Audio:
        {
            contentRes = [RXIMMsgAudioContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Video:
        {
            contentRes = [RXIMMsgVideoContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_File:
        {
            contentRes = [RXIMMsgFileContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Position:
        {
            contentRes = [RXIMMsgLBSContent rx_modelWithJSON:body];
            break;
        }
        case MessageType_Reply:
        {
            RXIMMsgReplyContent *contentObj = (RXIMMsgReplyContent *)[RXIMMsgReplyContent rx_modelWithJSON:body];
            if (contentObj.reference.msgType == MessageType_Text) {
                RXIMMsgTextContent *imgContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithDictionary:contentObj.reference.content];
                contentObj.reference.content = imgContent;
            }else if(contentObj.reference.msgType == MessageType_Image){
                RXIMMsgImageContent *imgContent = (RXIMMsgImageContent *)[RXIMMsgImageContent rx_modelWithDictionary:contentObj.reference.content];
                contentObj.reference.content = imgContent;
            }else if(contentObj.reference.msgType == MessageType_Position){
                RXIMMsgLBSContent *lbsContent = (RXIMMsgLBSContent *)[RXIMMsgLBSContent rx_modelWithDictionary:contentObj.reference.content];
                contentObj.reference.content = lbsContent;
            }else if(contentObj.reference.msgType == MessageType_Reply){
                RXIMMsgReplyContent *replyContent = (RXIMMsgReplyContent *)[RXIMMsgReplyContent rx_modelWithDictionary:contentObj.reference.content];
                RXIMMsgTextContent *textContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithJSON:replyContent.reply.content];
                replyContent.reply.content = textContent;
                contentObj.reference.content = replyContent;
            }else if(contentObj.reference.msgType == MessageType_CombineTransmit){
                NSString *combineContentStr;
                if ([contentObj.reference.content isKindOfClass:[NSDictionary class]]) {
                    combineContentStr = [contentObj.reference.content rx_modelToJSONString];
                }else{
                    combineContentStr = contentObj.reference.content;
                }
                id combineContent = [RXModelTransform rxDBJsonContent_model:RXIMMessageType_CombineTransmit body:combineContentStr];
                contentObj.reference.content = combineContent;
            }
            if (contentObj.reply.msgType == MessageType_Text) {
                RXIMMsgTextContent *textContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithDictionary:contentObj.reply.content];
                contentObj.reply.content = textContent;
            }
            contentRes = contentObj;
        }
            break;
        case MessageType_CombineTransmit:{
            RXIMMsgCombineTransmitContent *contentObj = (RXIMMsgCombineTransmitContent *)[RXIMMsgCombineTransmitContent rx_modelWithJSON:body];
            NSMutableArray *combine = [NSMutableArray array];
            for (RXIMMsgCombineTransmitData *CTData in contentObj.combine) {
                NSString *ctDataContent;
                if (![CTData.content isKindOfClass:[NSString class]]) {
                    ctDataContent = [CTData.content rx_modelToJSONString];
                }else{
                    ctDataContent = CTData.content;
                }
                id combineContent = [RXModelTransform rxDBJsonContent_model:CTData.msgType body:ctDataContent];
                CTData.content = combineContent;
                if (CTData!=nil) {
                    [combine addObject:CTData];
                }
            }
            contentObj.combine = combine;
            contentRes = contentObj;
        }
            break;
        case MessageType_Cpcustom:
        {
            contentRes = [RXIMMsgCustomContent rx_modelWithJSON:body];
            break;
        }
        default:
            break;
    }
    return contentRes;
}

#pragma mark - 接收消息JSON内容转model
+ (id)rxReceiveJsonContent_model:(MessageType)type body:(NSString *)body
{
    switch (type) {
        case MessageType_UnknownMt:
            return nil;
            break;
        case MessageType_Tips:
        {
            RXIMMsgConvTipsContent *content = (RXIMMsgConvTipsContent *)[RXIMMsgConvTipsContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Text:
        {
            RXIMMsgTextContent *content = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Image:
        {
            RXIMMsgImageContent_pb *content_pb = (RXIMMsgImageContent_pb *)[RXIMMsgImageContent_pb rx_modelWithJSON:body];
            RXIMMsgImageContent *content = [[RXIMMsgImageContent alloc]init];
            content.original_url = content_pb.original_url;
            content.thumbnail_url = content_pb.thumbnail_url;
            if (content_pb.blurred_data!=nil && content_pb.blurred_data.length > 0) {
                content.blurred_data = [[NSData alloc]initWithBase64EncodedString:content_pb.blurred_data options:NSDataBase64DecodingIgnoreUnknownCharacters];
            }
            content.width = content_pb.width;
            content.height = content_pb.height;
            return content;
            break;
        }
        case MessageType_Face:
        {
            RXIMMsgFaceContent *content = (RXIMMsgFaceContent *)[RXIMMsgFaceContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Audio:
        {
            RXIMMsgAudioContent *content = (RXIMMsgAudioContent *)[RXIMMsgAudioContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Video:
        {
            RXIMMsgVideoContent *content = (RXIMMsgVideoContent *)[RXIMMsgVideoContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_File:
        {
            RXIMMsgFileContent *content = (RXIMMsgFileContent *)[RXIMMsgFileContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Position:
        {
            RXIMMsgLBSContent *content = (RXIMMsgLBSContent *)[RXIMMsgLBSContent rx_modelWithJSON:body];
            return content;
            break;
        }
        case MessageType_Reply:
        {
            RXIMMsgReplyContent_pb *pbContent = (RXIMMsgReplyContent_pb *)[RXIMMsgReplyContent_pb rx_modelWithJSON:body];
            RXIMMsgReplyContent *content = [[RXIMMsgReplyContent alloc]init];
            RXIMReferenceMsg *referenceMsg = [[RXIMReferenceMsg alloc]init];
            RXIMReplyMsg *replyMsg = [[RXIMReplyMsg alloc]init];
            content.reference = referenceMsg;
            content.reply = replyMsg;
            referenceMsg.fromId = pbContent.reference.sender;
            referenceMsg.msgType = pbContent.reference.type;
            referenceMsg.timestamp = pbContent.reference.milli_ts;
            referenceMsg.msgId = pbContent.reference.msg_id;
            referenceMsg.subType = pbContent.reference.sub_type;
            replyMsg.msgType = pbContent.reply.type;
            replyMsg.subType = pbContent.reply.sub_type;
            
            if (content.reference.msgType == MessageType_Text) {
                RXIMMsgTextContent *imgContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithJSON:pbContent.reference.content];
                referenceMsg.content = imgContent;
            }else if(content.reference.msgType == MessageType_Image){
                RXIMMsgImageContent *imgContent = (RXIMMsgImageContent *)[RXIMMsgImageContent rx_modelWithJSON:pbContent.reference.content];
                referenceMsg.content = imgContent;
            }else if(content.reference.msgType == MessageType_Position){
                RXIMMsgLBSContent *lbsContent = (RXIMMsgLBSContent *)[RXIMMsgLBSContent rx_modelWithJSON:pbContent.reference.content];
                referenceMsg.content = lbsContent;
            }else if(content.reference.msgType == MessageType_Reply){
                RXIMMsgReplyContent *replyContent = (RXIMMsgReplyContent *)[RXIMMsgReplyContent rx_modelWithJSON:pbContent.reference.content];
                RXIMMsgTextContent *textContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithJSON:replyContent.reply.content];
                replyContent.reply.content = textContent;
                content.reference.content = replyContent;
            }else if(content.reference.msgType == MessageType_CombineTransmit){
                RXIMMsgCombineTransmitContent *ctContent = (RXIMMsgCombineTransmitContent *)[RXIMMsgCombineTransmitContent rx_modelWithJSON:pbContent.reference.content];
                NSMutableArray *combine = [NSMutableArray array];
                for (NSDictionary *dataDic in ctContent.combine) {
                    RXIMMsgCombineTransmitData *CTData = [RXIMMsgCombineTransmitData rx_modelWithDictionary:dataDic];
                    CTData.content = [RXModelTransform rxDBJsonContent_model:CTData.msgType body:CTData.content];
                    if (CTData!=nil) {
                        [combine addObject:CTData];
                    }
                }
                ctContent.combine = combine;
                referenceMsg.content = ctContent;
            }
            if (content.reply.msgType == MessageType_Text) {
                RXIMMsgTextContent *textContent = (RXIMMsgTextContent *)[RXIMMsgTextContent rx_modelWithJSON:pbContent.reply.content];
                replyMsg.content = textContent;
            }
            return content;
        }
            break;
        case MessageType_CombineTransmit:{
            RXIMMsgCombineTransmitContent *content = (RXIMMsgCombineTransmitContent *)[RXIMMsgCombineTransmitContent rx_modelWithJSON:body];
            for (RXIMMsgCombineTransmitData *CTData in content.combine) {
                id combineContent = [RXModelTransform rxReceiveJsonContent_model:(MessageType)(CTData.msgType) body:CTData.content];
                CTData.content = combineContent;
            }
            return content;
        }
            break;
        case MessageType_Cpcustom:
        {
            RXIMMsgCustomContent *content = (RXIMMsgCustomContent *)[RXIMMsgCustomContent rx_modelWithJSON:body];
            return content;
            break;
        }
        default:
            return nil;
            break;
    }
}

#pragma mark - 单聊消息模型转换
+ (RXIMMessageIMS *)rxModelToB_singleMsg:(ChatMessage *)singleMsg
{
    RXIMMessageIMS *message = [[RXIMMessageIMS alloc]init];
    message.fromId = singleMsg.sender;
    message.sessionID = singleMsg.conversationId;
    message.receivers = singleMsg.receiversArray;
    message.sessionType = singleMsg.convType;
    if (message.sessionType == RXIMSessionType_single) {
        message.toId = [RXModelTransform receiverFromConversation:singleMsg.conversationId sender:message.fromId];
    }
    message.msgType = (RXIMMessageType)singleMsg.type;
    message.option = singleMsg.option;
    if((message.option&RXIMMsgOption_snapchat) == RXIMMsgOption_snapchat){
        message.snapchatTimeout = [[singleMsg.imsext objectForKey:@"snapchat"] integerValue];
    }
    if ([singleMsg.imsext objectForKey:@"mark"]) {
        message.isMark = [[singleMsg.imsext objectForKey:@"mark"] boolValue];
    }
    message.attr = singleMsg.attr;
    message.subType = singleMsg.subType;
    message.clientType = singleMsg.clientType;
    message.msgId = singleMsg.msgId;
    message.localId = singleMsg.uuid;
    message.timestamp = singleMsg.milliTs;
    message.inboxId = singleMsg.inboxId;
//    message.unreadCount = singleMsg.unreadCount;
    message.ext = singleMsg.ext;
    message.imsExt = singleMsg.imsext;
    message.content = [self fetchSingleReceiveContent:singleMsg];
    message.status = RXIMMsgStatus_success;
    message.receiverNum = singleMsg.receiverNum;
    return message;
}

#pragma mark - 解析接收者
+(NSString *)receiverFromConversation:(NSString *)conversationId sender:(NSString *)sender
{
    NSArray *conversationArr = [conversationId componentsSeparatedByString:@"$1$"];
    if (conversationArr!=nil && [conversationArr count]>1) {
        NSArray *userIdArr = [conversationArr[1] componentsSeparatedByString:@":"];
        if (userIdArr != nil && [userIdArr count]>1) {
            if ([userIdArr[0] isEqualToString:sender]) {
                return userIdArr[1];
            }else{
                return userIdArr[0];
            }
        }
    }
    return nil;
    
}

#pragma mark - 历史消息列表
+ (RXIMHistoryMsgResp *)transHistoryMsgs:(NSData *)data
{
    NSData *historyMsgsData = [[NSData alloc] initWithBase64EncodedData:data options:0];
    NSError *error;
    HistoryResp *respObj_pb = [HistoryResp parseFromData:historyMsgsData error:&error];
    RXIMHistoryMsgResp *respObj = [[RXIMHistoryMsgResp alloc]init];
    NSMutableArray *msgAry = [NSMutableArray array];
    for (ChatMessage *obj in respObj_pb.messagesArray) {
        RXIMMessageIMS *rxMsg = [RXModelTransform rxModelToB_singleMsg:obj];
        [msgAry addObject:rxMsg];
    }
    respObj.messages = msgAry;
    respObj.count = respObj_pb.count;
    respObj.isDone = respObj_pb.done;
    return respObj;
}

#pragma mark -- <消息发送模型转换>

#pragma mark - 发送消息封装
+ (NSData *)configMessageModelToData:(RXIMMessage *)message
{
    NSData *data = [NSData data];
    ChatMessage *singleMsg = [[ChatMessage alloc] init];
    singleMsg.type = (MessageType)message.msgType;
    singleMsg.subType = (int)message.subType;
    singleMsg.clientType = (int32_t)message.clientType;
    singleMsg.uuid = message.localId;
    singleMsg.receiversArray  = message.receivers;
    singleMsg.sender = message.fromId;
    singleMsg.ext = message.ext.mutableCopy;
    singleMsg.content = [RXModelTransform rxContentToB_content:message.content messageType:message.msgType];
    singleMsg.conversationId = message.sessionID;
    singleMsg.convType = (int)message.sessionType;
    singleMsg.option = message.option;
    NSMutableDictionary *imsExt = [NSMutableDictionary dictionary];
    if((message.option&RXIMMsgOption_snapchat) == RXIMMsgOption_snapchat){
        [imsExt setValue:[NSString stringWithFormat:@"%ld",(long)message.snapchatTimeout] forKey:@"snapchat"];
    }
    singleMsg.imsext = imsExt;
    singleMsg.cpid = (uint32_t)[RXIMUserUtility sharedManager].cpid;
    singleMsg.channelId = [RXIMUserUtility sharedManager].channelId;
    singleMsg.productId = [RXIMUserUtility sharedManager].appId;
    singleMsg.msgId = message.msgId;
    singleMsg.milliTs= message.timestamp;
    singleMsg.inboxId = message.inboxId;
    singleMsg.status = (int32_t)message.status;
    singleMsg.receiverNum = (int32_t)message.receiverNum;
    data = [singleMsg data];
    return data;
}

#pragma mark - 消息内容->消息类型
+ (RXIMMessageType)fetchMessageType:(id)messageObj
{
    if ([messageObj isKindOfClass:[RXIMMsgConvTipsContent class]]) {
        return RXIMMessageType_Tips;
    }else if ([messageObj isKindOfClass:[RXIMMsgTextContent class]]) {
        return RXIMMessageType_Text;
    } else if ([messageObj isKindOfClass:[RXIMMsgFaceContent class]]) {
        return RXIMMessageType_Face;
    } else if ([messageObj isKindOfClass:[RXIMMsgImageContent class]]) {
        return RXIMMessageType_Image;
    } else if ([messageObj isKindOfClass:[RXIMMsgAudioContent class]]) {
        return RXIMMessageType_Audio;
    } else if ([messageObj isKindOfClass:[RXIMMsgVideoContent class]]) {
        return RXIMMessageType_Video;
    } else if ([messageObj isKindOfClass:[RXIMMsgFileContent class]]) {
        return RXIMMessageType_File;
    } else if ([messageObj isKindOfClass:[RXIMMsgLBSContent class]]) {
        return RXIMMessageType_Position;
    } else if ([messageObj isKindOfClass:[RXIMMsgCustomContent class]]) {
        return RXIMMessageType_Custom;
    } else if ([messageObj isKindOfClass:[RXIMMsgReplyContent class]]){
        return RXIMMessageType_Reply;
    }else {
        return RXIMMessageType_UnknownMt;
    }
}

#pragma mark - rx消息类型 -> pb消息类型
+ (MessageType)messageTypeToPB:(RXIMMessageType)messageType
{
    switch (messageType) {
        case RXIMMessageType_UnknownMt:
            return MessageType_UnknownMt;
            break;
        case RXIMMessageType_Tips:
            return MessageType_Tips;
            break;
        case RXIMMessageType_Text:
            return MessageType_Text;
            break;
        case RXIMMessageType_Face:
            return MessageType_Face;
            break;
        case RXIMMessageType_Image:
            return MessageType_Image;
            break;
        case RXIMMessageType_Audio:
            return MessageType_Audio;
            break;
        case RXIMMessageType_Video:
            return MessageType_Video;
            break;
        case RXIMMessageType_File:
            return MessageType_File;
            break;
        case RXIMMessageType_Position:
            return MessageType_Position;
            break;
        case RXIMMessageType_Custom:
            return MessageType_Cpcustom;
            break;
        case RXIMMessageType_Reply:
            return MessageType_Reply;
            break;
//        case RXIMMessageType_MergeTransmit:
//            return MessageType_Merge;
//            break;
        default:
            return MessageType_UnknownMt;
            break;
    }
}

#pragma mark - 消息内容->pb内容
+ (NSString *)rxContentToB_content:(id)content messageType:(RXIMMessageType)messageType
{
    NSString *jsonContent;
    switch (messageType) {
        case RXIMMessageType_UnknownMt:
            break;
        case RXIMMessageType_Tips:
            jsonContent = [content rx_modelToJSONString];
            break;
        case RXIMMessageType_Text:
            jsonContent = [content rx_modelToJSONString];
            break;
        case RXIMMessageType_Face:
            jsonContent = [content rx_modelToJSONString];
            break;
        case RXIMMessageType_Image:{
            RXIMMsgImageContent *rxContent = (RXIMMsgImageContent *)content;
            RXIMMsgImageContent_pb *pbContent = [[RXIMMsgImageContent_pb alloc]init];
            pbContent.original_url = rxContent.original_url;
            pbContent.blurred_data =  [rxContent.blurred_data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];// data加密成Base64形式的字符串。
            pbContent.thumbnail_url = rxContent.thumbnail_url;
            if (rxContent.original_data == nil) {
                pbContent.file_type = @"png";
                pbContent.orientation = 1;
                pbContent.size = 1000;
            }else{
                pbContent.file_type = [RXModelTransform getImageType:rxContent.original_data];
                pbContent.orientation = [RXModelTransform getImageOrientation:[UIImage imageWithData:rxContent.original_data]];
                pbContent.size = rxContent.original_data.length;
            }
            pbContent.width = rxContent.width;
            pbContent.height = rxContent.height;
            jsonContent = [pbContent rx_modelToJSONString];
        }
            break;
        case RXIMMessageType_Audio:{
            RXIMMsgAudioContent *rxContent = (RXIMMsgAudioContent *)content;
            RXIMMsgAudioContent_pb *pbContent =[[RXIMMsgAudioContent_pb alloc]init];
            pbContent.url = rxContent.url;
            if (rxContent.audioData == nil) {
                pbContent.size = 1000;
            }else{
                pbContent.size = rxContent.audioData.length;
            }
            pbContent.duration = rxContent.duration;
            jsonContent = [pbContent rx_modelToJSONString];
        }
            break;
        case RXIMMessageType_Video:{
            RXIMMsgVideoContent *rxContent = (RXIMMsgVideoContent *)content;
            RXIMMsgVideoContent_pb *pbContent = [[RXIMMsgVideoContent_pb alloc]init];
            pbContent.video_url = rxContent.video_url;
            pbContent.cover_url = rxContent.cover_url;
            pbContent.cover_width = rxContent.cover_width;
            pbContent.cover_height = rxContent.cover_height;
            pbContent.file_type = rxContent.video_type;
            pbContent.duration = rxContent.duration;
            if (rxContent.video_data == nil) {
                pbContent.size = 1000;
            }else{
                pbContent.size = rxContent.video_data.length;
            }
            jsonContent = [pbContent rx_modelToJSONString];
        }
            break;
        case RXIMMessageType_File:{
            RXIMMsgFileContent *rxContent = (RXIMMsgFileContent *)content;
            RXIMMsgFileContent_pb *pbContent = [[RXIMMsgFileContent_pb alloc]init];
            pbContent.name = rxContent.name;
            pbContent.url = rxContent.url;
            if (rxContent.file_data == nil) {
                pbContent.size = 1000;
            }else{
                pbContent.size = rxContent.file_data.length;
            }
            
            pbContent.file_type = rxContent.file_type;
            jsonContent = [pbContent rx_modelToJSONString];
        }
            
            break;
        case RXIMMessageType_Position:{
            RXIMMsgLBSContent *rxContent = (RXIMMsgLBSContent *)content;
            RXIMMsgLBSContent_pb *pbContent = [[RXIMMsgLBSContent_pb alloc]init];
            pbContent.name = rxContent.name;
            pbContent.address = rxContent.address;
            pbContent.cover_url = rxContent.cover_url;
            pbContent.latitude = rxContent.latitude;
            pbContent.longitude = rxContent.longitude;
            jsonContent = [pbContent rx_modelToJSONString];
        }
            break;
        case RXIMMessageType_Custom:
            jsonContent = [content rx_modelToJSONString];
            break;
        case RXIMMessageType_Reply:{
            RXIMMsgReplyContent *replyContent = (RXIMMsgReplyContent *)content;
            RXIMMsgReplyContent_pb *pbContent = [[RXIMMsgReplyContent_pb alloc]init];
            RXIMReferenceMsg_pb *pbReference = [[RXIMReferenceMsg_pb alloc]init];
            RXIMReplyMsg_pb *pbReply = [[RXIMReplyMsg_pb alloc]init];
            pbReference.sender = replyContent.reference.fromId;
            pbReference.msg_id = replyContent.reference.msgId;
            pbReference.milli_ts = replyContent.reference.timestamp;
            pbReference.type = replyContent.reference.msgType;
            pbReference.sub_type = replyContent.reference.subType;
            pbReply.type = replyContent.reply.msgType;
            pbReply.sub_type = replyContent.reply.subType;
            NSString *referenceContentStr = [replyContent.reference.content rx_modelToJSONString];
            NSString *replyContentStr = [replyContent.reply.content rx_modelToJSONString];
            pbReference.content = referenceContentStr;
            pbReply.content = replyContentStr;
            pbContent.reference = pbReference;
            pbContent.reply = pbReply;
            jsonContent = [pbContent rx_modelToJSONString];
        }
            
            break;
        case RXIMMessageType_CombineTransmit:{
            RXIMMsgCombineTransmitContent *CTContent = (RXIMMsgCombineTransmitContent *)content;
            for (RXIMMsgCombineTransmitData *msg in CTContent.combine) {
                NSString *combineContent = [RXModelTransform rxContentToB_content:msg.content messageType:msg.msgType];
                msg.content = combineContent;
            }
            jsonContent = [CTContent rx_modelToJSONString];
        }
            break;
            
        default:
            break;
    }
    return jsonContent;
}

+(NSString *)getImageType:(NSData *)imageData
{
    if (imageData == nil) {
        return @"";
    }
    if (imageData.length > 4) {
        const unsigned char * bytes = [imageData bytes];
        
        if (bytes[0] == 0xff &&
            bytes[1] == 0xd8 &&
            bytes[2] == 0xff)
        {
            return @"jpeg";
        }
        
        if (bytes[0] == 0x89 &&
            bytes[1] == 0x50 &&
            bytes[2] == 0x4e &&
            bytes[3] == 0x47)
        {
            return @"png";
        }
    }
    
    return @"";
}


+(NSInteger)getImageOrientation:(UIImage *)image
{
    //1:normal；2:flip_horizontal；3:flip_vertical；4:rotate_90；5:rotate_180；6:rotate_270；
    NSInteger resOrientation = 0;
    switch (image.imageOrientation) {
            
        case UIImageOrientationUp: // default orientation
            resOrientation = 1;
            break;
        case UIImageOrientationDown: // 180 deg rotation
            resOrientation = 5;
            break;
        case UIImageOrientationLeft: // 90 deg CCW
            resOrientation = 4;
            break;
        case UIImageOrientationRight: // 90 deg CW
            resOrientation = 6;
            break;
        case UIImageOrientationUpMirrored: // horizontal flip
            resOrientation = 2;
            break;
        case UIImageOrientationDownMirrored: // horizontal flip
            resOrientation = 2;
            break;
        case UIImageOrientationLeftMirrored: // vertical flip
            resOrientation = 3;
            break;
        case UIImageOrientationRightMirrored: // vertical flip
            resOrientation = 3;
            break;
            
        default:
            break;
    }
    return resOrientation;
}

#pragma mark - 数据转换
+(RXIMMessage *)msgDBToMsg:(RXIMMessageDB *)msgdb
{
    RXIMMessage *msg = [[RXIMMessage alloc]init];
    msg.fromId = msgdb.fromId;
    msg.toId = msgdb.toId;
    msg.sessionID = msgdb.sessionID;
    msg.sessionType = msgdb.sessionType;
    msg.msgType = msgdb.msgType;
    msg.status = msgdb.status;
    msg.subType = msgdb.subType;
    msg.clientType = msgdb.clientType;
    msg.msgId = msgdb.msgId;
    msg.localId = msgdb.localId;
    msg.timestamp = msgdb.timestamp;
    msg.pushBody = msgdb.pushBody;
    msg.ext = msgdb.ext;
    msg.option = msgdb.option;
    msg.snapchatTimeout = msgdb.snapchatTimeout;
    msg.attr = msgdb.attr;
    msg.inboxId = msgdb.inboxId;
    msg.isRecall = msgdb.isRecall;
    msg.unreadCount = msgdb.unreadCount;
    msg.receivers = msgdb.receivers;
    msg.receiverNum = msgdb.receiverNum;
    msg.isUrgent = msgdb.isUrgent;
    msg.urgentMillits = msgdb.urgentMillits;
    msg.urgentToMembers = msgdb.urgentToMembers;
    msg.isMark = msgdb.isMark;
    msg.readIdArr = msgdb.readIdArr;
    msg.content = [RXModelTransform rxDBJsonContent_model:msgdb.msgType body:msgdb.content];
    msg.replyEmoji = msgdb.replyEmoji;
    return msg;
}

+(RXIMMessageDB *)msgToMsgDB:(RXIMMessage *)msg
{
    RXIMMessageDB *msgDB = [[RXIMMessageDB alloc]init];
    msgDB.fromId = msg.fromId;
    msgDB.toId = msg.toId;
    msgDB.sessionID = msg.sessionID;
    msgDB.sessionType = msg.sessionType;
    msgDB.msgType = msg.msgType;
    msgDB.status = msg.status;
    msgDB.subType = msg.subType;
    msgDB.clientType = msg.clientType;
    msgDB.msgId = msg.msgId;
    msgDB.localId = msg.localId;
    msgDB.timestamp = msg.timestamp;
    msgDB.pushBody = msg.pushBody;
    msgDB.ext = msg.ext;
    msgDB.option = msg.option;
    msgDB.snapchatTimeout = msg.snapchatTimeout;
    msgDB.attr = msg.attr;
    msgDB.inboxId = msg.inboxId;
    msgDB.isRecall = msg.isRecall;
    msgDB.unreadCount = msg.unreadCount;
    msgDB.receivers = msg.receivers;
    msgDB.receiverNum = msg.receiverNum;
    msgDB.isUrgent = msg.isUrgent;
    msgDB.urgentMillits = msg.urgentMillits;
    msgDB.urgentToMembers = msg.urgentToMembers;
    msgDB.isMark = msg.isMark;
    msgDB.readIdArr = msg.readIdArr;
    msgDB.content = [msg.content rx_modelToJSONString];
    if (msg.msgType == RXIMMessageType_Text){
        RXIMMsgTextContent * content = (RXIMMsgTextContent*)msg.content;
        msgDB.contentStr = content.text;
    }else if (msg.msgType == RXIMMessageType_File){
        RXIMMsgFileContent * content = (RXIMMsgFileContent*)msg.content;
        msgDB.contentStr = content.name;
    }else if (msg.msgType == RXIMMessageType_Position){
        RXIMMsgLBSContent * content = (RXIMMsgLBSContent*)msg.content;
        msgDB.contentStr = content.name;
    }
    msgDB.replyEmoji = msg.replyEmoji;
    return msgDB;
}

+(RXIMSessionDB *)sessionTosessionDB:(RXIMSession *)session
{
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.sessionID = session.sessionID;
    sessionDB.attr = session.attr;
    sessionDB.ext = session.ext;
    sessionDB.option = session.option;
    sessionDB.createTimestamp = session.createTimestamp;
    sessionDB.updateTimestamp = session.updateTimestamp;
    sessionDB.joinTimestamp = session.joinTimestamp;
    sessionDB.userAttr = session.userAttr;
    sessionDB.userExt = session.userExt;
    sessionDB.userOption = session.userOption;
    if ([RXIMUserUtility sharedManager].isBusiness) {
        NSMutableArray *membersObj = [NSMutableArray array];
        for (RXIMGroupMember *obj in session.members) {
            NSDictionary *dic = [obj rx_modelToJSONObject];
            [membersObj addObject:dic];
        }
        sessionDB.members = membersObj;
    }else{
        sessionDB.members = session.members;
    }
    sessionDB.cpid = session.cpid;
    sessionDB.type = session.type;
    sessionDB.status = session.status;
    sessionDB.unreadCount = session.unreadCount;
    sessionDB.firstUnreadMsgId = session.firstUnreadMsgId;

    RXIMMessageDB *msgDB = [RXModelTransform msgToMsgDB:session.lastMessage];
    sessionDB.lastMessage = msgDB.rx_modelToJSONString;
    sessionDB.snapchatTimeout = session.snapchatTimeout;
    sessionDB.topTimestamp = session.topTimestamp;
    sessionDB.silent = session.silent;
    sessionDB.isMark = session.isMark;
    sessionDB.isArchive = session.isArchive;
    sessionDB.topMsg = session.topMsg;
    sessionDB.topMsgUser = session.topMsgUser;
    sessionDB.creator = session.creator;
    sessionDB.groupName = session.groupName;
    sessionDB.groupDesc = session.groupDesc;
    if (session.groupDesc){
        NSLog(@"sessionTosessionDB groupDesc = %@" ,session.groupDesc);
    }
    return sessionDB;
}

+(RXIMSession *)sessionDBTosession:(RXIMSessionDB *)sessionDB
{
    RXIMSession *session = [[RXIMSession alloc]init];
    session.sessionID = sessionDB.sessionID;
    session.attr = sessionDB.attr;
    session.ext = sessionDB.ext;
    session.option = sessionDB.option;
    session.createTimestamp = sessionDB.createTimestamp;
    session.updateTimestamp = sessionDB.updateTimestamp;
    session.joinTimestamp = sessionDB.joinTimestamp;
    session.userAttr = sessionDB.userAttr;
    session.userExt = sessionDB.userExt;
    session.userOption = sessionDB.userOption;
    if ([RXIMUserUtility sharedManager].isBusiness) {
        NSMutableArray *membersArr = [NSMutableArray array];
        for (NSDictionary *obj in sessionDB.members) {
            RXIMGroupMember *memberObj = [RXIMGroupMember rx_modelWithDictionary:obj];
            if (memberObj){
                [membersArr addObject:memberObj];
            }
        }
        session.members = membersArr;
    }else{
        session.members = sessionDB.members;
    }
    session.cpid = sessionDB.cpid;
    session.type = sessionDB.type;
    session.status = sessionDB.status;
    session.unreadCount = sessionDB.unreadCount;
    session.firstUnreadMsgId = sessionDB.firstUnreadMsgId;
    
    RXIMMessageDB *msgDB = [RXIMMessageDB rx_modelWithJSON:sessionDB.lastMessage];
    session.lastMessage = [RXModelTransform msgDBToMsg:msgDB];
    session.snapchatTimeout = sessionDB.snapchatTimeout;
    session.topTimestamp = sessionDB.topTimestamp;
    session.silent = sessionDB.silent;
    session.isMark = sessionDB.isMark;
    session.isArchive = sessionDB.isArchive;
    session.topMsg = sessionDB.topMsg;
    session.topMsgUser = sessionDB.topMsgUser;
    session.creator = sessionDB.creator;
    session.groupName = sessionDB.groupName;
    session.groupDesc = sessionDB.groupDesc;
    return session;
}

+(RXIMMessage *)msgImsToMsg:(RXIMMessageIMS *)msgIms
{
    RXIMMessage *msg = [[RXIMMessage alloc]init];
    msg.fromId = msgIms.fromId;
    msg.toId = msgIms.toId;
    msg.sessionID = msgIms.sessionID;
    msg.sessionType = msgIms.sessionType;
    msg.msgType = msgIms.msgType;
    msg.status = msgIms.status;
    msg.subType = msgIms.subType;
    msg.clientType = msgIms.clientType;
    msg.msgId = msgIms.msgId;
    msg.localId = msgIms.localId;
    msg.timestamp = msgIms.timestamp;
    msg.pushBody = msgIms.pushBody;
    msg.ext = msgIms.ext;
    msg.option = msgIms.option;
    msg.snapchatTimeout = msgIms.snapchatTimeout;
    msg.attr = msgIms.attr;
    msg.inboxId = msgIms.inboxId;
    msg.isRecall = msgIms.isRecall;
    msg.unreadCount = msgIms.unreadCount;
    msg.receivers = msgIms.receivers;
    msg.receiverNum = msgIms.receiverNum;
    msg.isUrgent = msgIms.isUrgent;
    msg.urgentMillits = msgIms.urgentMillits;
    msg.urgentToMembers = msgIms.urgentToMembers;
    msg.isMark = msgIms.isMark;
    msg.content = msgIms.content;
    return msg;
}

+(RXIMMessage *)messageFTSToMsg:(RXIMMessageFTS*)msgFTS{
    RXIMMessage *msg = [[RXIMMessage alloc]init];
    msg.msgId = msgFTS.msgId;
//    msg.content = [RXModelTransform rxDBJsonContent_model:msgFTS.msgType body:msgFTS.content];
//    msg.sessionID = msgFTS.sessionID;
//    msg.content = msgFTS.content;
    msg.msgId = msgFTS.msgId;
 
//
//    msg.fromId = msgFTS.fromId;
//    msg.toId = msgFTS.toId;
//    msg.sessionID = msgFTS.sessionID;
//    msg.sessionType = msgFTS.sessionType;
//    msg.msgType = msgFTS.msgType;
//    msg.status = msgFTS.status;
//    msg.subType = msgFTS.subType;
//    msg.clientType = msgFTS.clientType;
//    msg.localId = msgFTS.localId;
//    msg.timestamp = msgFTS.timestamp;
//    msg.pushBody = msgFTS.pushBody;
//    msg.ext = msgFTS.ext;
//    msg.option = msgFTS.option;
//    msg.snapchatTimeout = msgFTS.snapchatTimeout;
//    msg.attr = msgFTS.attr;
//    msg.inboxId = msgFTS.inboxId;
//    msg.isRecall = msgFTS.isRecall;
//    msg.unreadCount = msgFTS.unreadCount;
//    msg.receivers = msgFTS.receivers;
//    msg.receiverNum = msgFTS.receiverNum;
//    msg.isUrgent = msgFTS.isUrgent;
//    msg.urgentMillits = msgFTS.urgentMillits;
//    msg.urgentToMembers = msgFTS.urgentToMembers;
//    msg.isMark = msgFTS.isMark;
//    msg.readIdArr = msgFTS.readIdArr;
    return msg;
}


@end
