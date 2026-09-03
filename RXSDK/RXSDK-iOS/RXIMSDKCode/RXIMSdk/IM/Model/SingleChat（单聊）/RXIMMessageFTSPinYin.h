//
//  RXIMMessageFTSPinYin.h
//  RXIMSdk
//
//  Created by Elbay on 2024/8/8.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMessageFTSPinYin : NSObject
///** 服务端唯一消息号 */
@property (nonatomic, strong) NSString *msgId;
///** 目标id 单聊为对方id，群聊为群id */
@property (nonatomic, strong) NSString *sessionID;

@property (nonatomic, strong) NSString *pinYin;

@end

NS_ASSUME_NONNULL_END
