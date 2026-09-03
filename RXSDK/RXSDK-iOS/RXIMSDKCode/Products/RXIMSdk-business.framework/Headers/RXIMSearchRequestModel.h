//
//  RXIMSearchRequestModel.h
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/18.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSearchRequestModel : NSObject

@property (nonatomic, strong) NSString *userId;
/** 只搜索某些玩家发的消息 */
@property (nonatomic, strong) NSArray *senderIds;
/** 只从某些会话id内搜索 */
@property (nonatomic, strong) NSArray *sessionIDs;
/** 只搜索某些消息类型的消息 */
@property (nonatomic, strong) NSArray *msgTypes;
/** 开始时间戳（毫秒）。-1 表示没有时间范围搜索 */
@property (nonatomic, assign) NSInteger startTimestamp;
/** 结束时间戳（毫秒）。-1 表示没有时间范围搜索 */
@property (nonatomic, assign) NSInteger endTimestamp;
/** 搜索的关键字 */
@property (nonatomic, strong) NSString *keywords;
/** 搜索的个数 */
@property (nonatomic, assign) NSInteger count;
/** 分页请求相关，上次请求返回的时间戳 */
@property (nonatomic, assign) NSInteger afterTimestamp;
/** 分页请求相关，上次请求返回的id */
@property (nonatomic, strong) NSString *afterMsgId;

@end

NS_ASSUME_NONNULL_END
