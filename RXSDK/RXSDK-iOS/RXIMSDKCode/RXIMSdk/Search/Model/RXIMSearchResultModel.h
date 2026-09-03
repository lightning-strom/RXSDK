//
//  RXIMSearchResultModel.h
//  RXIMSdk-business
//
//  Created by weiyongjian on 2023/1/18.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 搜索结果 */
@interface RXIMSearchResultModel : NSObject

/** 会话id */
@property (nonatomic, strong) NSString *sessionID;
/** 消息id */
@property (nonatomic, strong) NSString *msgId;
/** 消息id */
@property (nonatomic, assign) NSInteger msgType;
/** 发送者id */
@property (nonatomic, strong) NSString *fromId;
/** 时间戳（毫秒） */
@property (nonatomic, assign) NSInteger timestamp;
/** 消息内容 */
@property (nonatomic, strong) id content;
/** 搜索玩家 id  */
@property (nonatomic, strong) NSString *msgInboxId;

@end

/** 用于请求下一页的参数 */
@interface RXIMSearchAfterModel : NSObject

/** 时间戳（毫秒） */
@property (nonatomic, assign) NSInteger timestamp;
/** 消息id */
@property (nonatomic, strong) NSString *msgId;

@end

@interface RXIMSearchResultData : NSObject

@property (nonatomic, strong) NSArray<RXIMSearchResultModel *> *results;
@property (nonatomic, strong) RXIMSearchAfterModel *after;

@end

NS_ASSUME_NONNULL_END
