//
//  RXIMMsgContinuityModel.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/23.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"
#import "RXIMMsgModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgContinuityModel : NSObject

/**
 * 接收消息模型
 */
@property (nonatomic, strong) RXIMMsgModel *msgModel;

/**
 * 消息
 */
@property (nonatomic, strong) RXIMMessageIMS *msg;

/**
 * 是否是接收到的消息，true：是 false：同步回来的消息
 */
@property (nonatomic, assign) BOOL isReceiveMsg;

@end

NS_ASSUME_NONNULL_END
