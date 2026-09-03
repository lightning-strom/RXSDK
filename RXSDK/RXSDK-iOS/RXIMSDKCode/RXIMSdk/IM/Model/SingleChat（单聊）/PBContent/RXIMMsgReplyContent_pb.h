//
//  RXIMMsgReplyContent_pb.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/13.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMReferenceMsg_pb : NSObject

/** 发送人id */
@property (nonatomic, copy) NSString *sender;
/** 消息内容 */
@property (nonatomic, copy) NSString *content;
/** 服务端唯一消息号 */
@property (nonatomic, copy) NSString *msg_id;
/** 引用消息的毫秒时间戳 */
@property (nonatomic, assign) NSInteger milli_ts;
/** 引用消息类型 */
@property (nonatomic, assign) RXIMMessageType type;
/** 引用消息子类型 */
@property (nonatomic, assign) NSInteger sub_type;

@end

@interface RXIMReplyMsg_pb : NSObject

/** 回复的消息类型 */
@property (nonatomic, assign) NSInteger type;
/** 回复的消息子类型 */
@property (nonatomic, assign) NSInteger sub_type;
/** 回复的消息内容 */
@property (nonatomic, copy) NSString *content;

@end

@interface RXIMMsgReplyContent_pb : NSObject

/** 引用的消息 */
@property(nonatomic, strong) RXIMReferenceMsg_pb *reference;

/** 回复的消息 */
@property(nonatomic, strong) RXIMReplyMsg_pb *reply;

@end

NS_ASSUME_NONNULL_END
