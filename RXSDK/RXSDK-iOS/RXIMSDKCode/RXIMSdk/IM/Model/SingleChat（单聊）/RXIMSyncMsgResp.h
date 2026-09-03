//
//  RXIMSyncMsgResp.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSyncMsgResp : NSObject

/**
 * 消息列表
 */
@property (nonatomic, copy) NSArray *messages;

/**
 * 本批消息记录数量
 */
@property (nonatomic, assign) NSInteger count;

@end

NS_ASSUME_NONNULL_END
