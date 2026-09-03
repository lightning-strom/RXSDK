//
//  RXIMSessionServer.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/11/2.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSessionServer : NSObject

/** Session ID */
@property(nonatomic, copy) NSString *conversation_id;

/** 会话属性，位运算 */
@property (nonatomic,assign) NSInteger attr;

/** 会话选项，位运算 */
@property (nonatomic,assign) NSInteger option;

/** 会话创建毫秒时间戳 */
@property (nonatomic,assign) NSInteger create_milli_ts;

/** 会话最后更新的毫秒时间戳 */
@property (nonatomic,assign) NSInteger update_milli_ts;

/** 会话创建者 */
@property (nonatomic,copy) NSString *creator;

/** 会话cp扩展字段 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *ext;

/** 会话 IMS 扩展信息 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *ims_ext;

/** 会话成员列表 */
@property (nonatomic, strong) NSArray *members;

/** 会话类型 */
@property (nonatomic, assign) RXIMSessionType type;

/** 会话状态 */
@property (nonatomic, assign) NSInteger status;

/** 最后一条消息 */
@property (nonatomic, strong) RXIMMessage *lastMessage;

/** 用户cpid */
@property (nonatomic, assign) NSInteger cpid;

/** 用户加入时间 */
@property (nonatomic, assign) NSInteger join_milli_ts;

/** 会话属性，位运算 */
@property (nonatomic,assign) NSInteger user_attr;

/** 会话选项，位运算 */
@property (nonatomic,assign) NSInteger user_option;

/** 用户cp扩展字段 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *user_ext;

/** IMS给用户在该会话中设置的扩展数据 */
@property (nonatomic, strong) NSDictionary<NSString *,NSString *> *user_ims_ext;

/** 未读消息数 */
@property (nonatomic, assign) NSInteger unreadCount;

/** 置顶时间戳 */
@property (nonatomic, assign) NSInteger top;

/** 是否免打扰 */
@property (nonatomic, assign) BOOL silent;

/** 置顶的消息id */
@property (nonatomic, strong) NSString *top_msg;

/** 由谁置顶的消息 */
@property (nonatomic, strong) NSString *top_msg_user;

/** 群名 */
@property (nonatomic, strong) NSString *conv_name;

/** 群描述 */
@property (nonatomic, strong) NSString *conv_desc;

@end

NS_ASSUME_NONNULL_END
