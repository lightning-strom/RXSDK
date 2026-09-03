//
//  RXIMMsgModel.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/4.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// 消息类型 messageType
typedef enum : NSUInteger {
    RecMsgType_request = 1, // 请求消息
    RecMsgType_ack = 2, // 确认消息
    RecMsgType_noti, // 通知消息
} RecMsgType;

// 消息来源 commandStack
typedef enum : NSUInteger {
    CommandStack_control = 1, // 控制消息
    CommandStack_msg = 2, // IM消息
    CommandStack_Event = 3,// 事件，只同步给在线的，离线的再次登陆同步数据
} CommandStack;

// 消息状态 commandId for control
typedef enum : NSUInteger {
    CommandId_Control_heart = 1, // 心跳消息
    CommandId_Control_conn = 2, // 客户端连接服务器
    CommandId_Control_ack = 3, // 服务器应答连接情况
    CommandId_Control_disconnect = 4, // 客户端断开连接
    CommandId_Control_serverKick = 5, // 服务器断开客户端
    CommandId_Control_rebalance = 6, // 服务器要求客户端将连接断开并再次获取连接地址重连
} CommandId_Control;

// 消息状态 commandId for chat
typedef enum : NSUInteger {
    CommandId_Chat_newMsgNotice = 1, // 服务器发给客户端，表示有新的聊天消息需要同步，这是一个预留的指令 此时 protocol sequence id 表示当前该用户的 inboxId，且 Payload 长度为 0
    CommandId_Chat_sync = 2, // 聊天同步消息
    CommandId_Chat_history = 3, // 聊天历史消息获取与响应
    CommandId_Chat_msg = 4, // 聊天消息
    CommandId_Chat_readList = 5, // 获取或响应某多人消息已读列表
} CommandId_Chat;

// 消息状态 commandId for Event
typedef enum : NSUInteger {
    CommandId_Event_conversation = 1, // 会话事件
    CommandId_Event_userConversation = 2, // 用户会话事件
    CommandId_Event_collection = 3, // 收藏事件
} CommandId_Event;

// 消息状态 commandId for user
typedef enum : NSUInteger {
    CommandId_User_sync = 1, //消息同步请求或响应同步结果
    CommandId_User_history = 2, // 拉取会话历史消息记录请求或响应历史记录结果
} CommandId_User;

@interface RXIMMsgFlag : NSObject

@property (nonatomic, assign) BOOL hasPayload; // 是否含有payload数据
@property (nonatomic, assign) BOOL isEncrypt; // payload是否加密
@property (nonatomic, assign) BOOL isCompress; // 是否需要压缩
@property (nonatomic, assign) BOOL isError; // 是否报错

@end

@interface RXIMMsgModel : NSObject
@property (nonatomic, copy) NSString *magic; // 端口
@property (nonatomic, assign) NSInteger version; // 版本号
@property (nonatomic, assign) RecMsgType messageType; // 消息类型
@property (nonatomic, assign) CommandStack commandStack; // 消息来源
@property (nonatomic, assign) CommandId_Control commandId_control; // control消息类型
@property (nonatomic, assign) CommandId_Chat commandId_chat; // 聊天消息类型
@property (nonatomic, assign) CommandId_Event commandId_event; // 事件类型
@property (nonatomic, assign) CommandId_User commandId_user; // 用户消息类型
@property (nonatomic, strong) RXIMMsgFlag *flag;
@property (nonatomic, assign) long protocolSeqId; //客户端本地自增消息序列号
@property (nonatomic, assign) NSInteger payloadLength; // payload长度
@property (nonatomic, strong) id messageObj;
@end

NS_ASSUME_NONNULL_END
