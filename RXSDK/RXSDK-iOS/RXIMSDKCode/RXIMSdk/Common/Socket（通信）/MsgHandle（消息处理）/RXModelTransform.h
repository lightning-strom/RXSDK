//
//  RXModelTransform.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/11.
//

#import <Foundation/Foundation.h>
#import "RXIMMsgModel.h"
#import "RXIMMessageIMS.h"
#import "RXIMSession.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMHistoryMsgResp.h"
#import "RXIMMessageDB.h"
#import "RXIMSessionDB.h"
#import "RXIMMessageFTS.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXModelTransform : NSObject

// ======接收模型转换======

/** 消息接收模型转换 */
+ (RXIMMessageIMS *)rxModelToB_msg:(RXIMMsgModel *)model;

/** 同步消息接收模型转换 */
+ (NSArray *)rxModelToB_syncMsg:(RXIMMsgModel *)model;

/** 服务器c历史消息接收模型转换 */
+ (RXIMHistoryMsgResp *)rxModelToB_historyMsg:(RXIMMsgModel *)model;

/** 消息类型转换 */
+ (RXIMMessageType)fetchMessageType:(id)messageObj;

/** 单聊模型转换 */
+ (RXIMMessageIMS *)rxModelToB_singleMsg:(ChatMessage *)singleMsg;

/** 接收消息内容json串转model */
+ (id)rxReceiveJsonContent_model:(MessageType)type body:(NSString *)body;

/** DB消息内容json转model */
+ (id)rxDBJsonContent_model:(RXIMMessageType)type body:(NSString *)body;

/** 历史消息数据转换 */
+ (RXIMHistoryMsgResp *)transHistoryMsgs:(NSData *)data;

// ======发送模型转换======

/** 消息发送模型转换 */
+ (NSData *)configMessageModelToData:(RXIMMessage *)message;

/** 获取图片类型 */
+(NSString *)getImageType:(NSData *)imageData;

/** 解析接收者 */
+(NSString *)receiverFromConversation:(NSString *)conversationId sender:(NSString *)sender;

+(RXIMMessage *)msgDBToMsg:(RXIMMessageDB *)msgdb;

+(RXIMMessageDB *)msgToMsgDB:(RXIMMessage *)msg;

+(RXIMSessionDB *)sessionTosessionDB:(RXIMSession *)session;

+(RXIMSession *)sessionDBTosession:(RXIMSessionDB *)sessionDB;

+(RXIMMessage *)msgImsToMsg:(RXIMMessageIMS *)msgIms;

+(RXIMMessage *)messageFTSToMsg:(RXIMMessageFTS*)msgFTS;

@end

NS_ASSUME_NONNULL_END
