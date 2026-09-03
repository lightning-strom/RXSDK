//
//  RXIMSendMessage.h
//  RXIMSdk
//
//  Created by weiyongjian on 2021/11/19.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSendMessage : NSObject

/** 会话 ID，个人（UserIDA < UserIDB，字典序比较）：$1$UserIDA:UserIDB；群：$2$群ID */
@property(nonatomic, copy) NSString *sessionID;

/** 会话类型 */
@property (nonatomic, assign) RXIMSessionType sessionType;

/** 消息类型 */
@property(nonatomic, assign) RXIMMessageType msgType;

/** 子消息类型 type == RXIMMessageType_Custom 有效 设置需小于100000000，100000000以上供sdk内部使用 */
@property(nonatomic, assign) NSInteger subType;

/** 消息选项 位运算 RXIMMsgOption组合 */
@property (nonatomic, assign) NSInteger option;

/** 接收人列表，单聊必须为空；群聊表示 @ 用户列表；自定义单聊表示实际接收人 UserID 清单；*/
@property (nonatomic, copy) NSArray *receivers;

/** 扩展信息 */
@property(nonatomic, copy) NSDictionary<NSString *,NSString *> *ext;

/** 消息内容 */
@property (nonatomic, strong) id content;

/** 阅后即焚超时时间，单位毫秒，只有消息选项option包含RXIMMsgOption_snapchat才有效 */
@property (nonatomic, assign) NSInteger snapchatTimeout;

@end

NS_ASSUME_NONNULL_END
