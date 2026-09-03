//
//  RXIMMsgContinuityHandle.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"
#import "RXIMMsgModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgContinuityHandle : NSObject

+ (instancetype)sharedSDK;

/**
 * 是否正在同步消息
 */
@property (nonatomic, assign) BOOL isSync;

/**
 * 消息缓存（连续性处理逻辑）
 */
@property (nonatomic, strong) NSMutableArray *msgCacheAry;

/**
 * 接收到的消息
 */
@property (nonatomic, strong) NSMutableArray *msgReceiveAry;

/**
 * 接收到消息处理
 * @return 消息是否连续
 */
- (BOOL)receiveMsgHandel:(RXIMMessageIMS *)msg msgModel:(RXIMMsgModel *)msgModel;

/**
 * 同步消息回执处理
 * @param msgs 消息组合
 */
- (void)syncMsgHandle:(NSArray *)msgs;


@end

NS_ASSUME_NONNULL_END
