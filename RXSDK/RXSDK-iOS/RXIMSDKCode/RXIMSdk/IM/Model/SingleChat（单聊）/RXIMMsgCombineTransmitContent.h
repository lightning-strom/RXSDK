//
//  RXIMMsgCombineTransmitContent.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/11/28.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgCombineTransmitData : NSObject

/** 发送人id */
@property (nonatomic, copy) NSString *fromId;
/** 消息内容 */
@property (nonatomic, strong) id content;
/** 服务端唯一消息号 */
@property (nonatomic, copy) NSString *msgId;
/** 毫秒时间戳 */
@property (nonatomic, assign) NSInteger timestamp;
/** 消息类型 */
@property (nonatomic, assign) RXIMMessageType msgType;
/** 消息子类型 */
@property (nonatomic, assign) NSInteger subType;


@end

@interface RXIMMsgCombineTransmitContent : NSObject

/** 来自哪个会话id */
@property (nonatomic, copy) NSString *sessionID;
/** 消息数组 */
@property (nonatomic, strong) NSArray<RXIMMsgCombineTransmitData *> *combine;

@end

NS_ASSUME_NONNULL_END
