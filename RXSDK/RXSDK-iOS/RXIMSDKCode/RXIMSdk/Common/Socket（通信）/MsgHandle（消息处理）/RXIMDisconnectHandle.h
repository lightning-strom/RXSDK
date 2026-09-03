//
//  RXIMDisconnectHandle.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//

#import <Foundation/Foundation.h>
#import "RXIMMessageIMS.h"

@interface RXIMDisconnectHandle : NSObject

+ (instancetype)sharedSDK;

/**
 * 断网重连拉取同步消息
 */
-(void)messageHandle;

@end

