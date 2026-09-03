//
//  RXIMMsgHandle.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/14.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"
#import "RXIMMsgModel.h"
#import "RXIMError.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgHandle : NSObject

/**
 * 处理发送成功的消息
 * 修改消息发送状态和服务器消息id
 */
+ (RXIMMessage *)handleSendSuccessMsg:(RXIMMsgModel *)msgModel;

/**
 * 处理发送失败的消息
 */
+ (RXIMError *)handleSendFailureMsg:(RXIMMsgModel *)msgModel;

/**
 * 处理发送成功的会话
 */
+ (RXIMMessage *)handleSendSuccessSession:(RXIMMsgModel *)msgModel;

/**
 * 根据接收的消息类型做处理
 */
+ (void)fetchReceiveMsgAsMsgType:(RXIMMsgModel *)msgModel;

/**
 * 客户端连接服务器消息封装
 */
+ (NSData *)getConnectData;

@end

NS_ASSUME_NONNULL_END
