//
//  RXIMHistoryMsgResp.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/16.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMHistoryMsgResp : NSObject

/** 消息列表 */
@property (nonatomic, copy) NSArray *messages;

/** 本批消息记录数量 */
@property (nonatomic, assign) NSInteger count;

/** 是否到底,YES:拉取完成 NO:拉取未完成,还有消息 */
@property (nonatomic, assign) BOOL isDone;

@end

NS_ASSUME_NONNULL_END
