//
//  RXIMSocketPacket.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/26.
//

#import <Foundation/Foundation.h>
#import "RXIMMsgModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSocketPacket : NSObject

+ (instancetype)sharedManager;

/**
 * 组包处理
 * @param data payload数据
 * @param model 包头数据
 * @param needEncrypt 是否需要加密
 */
- (NSData *)handleSendData:(NSData *)data model:(RXIMMsgModel *)model needEncrypt:(BOOL)needEncrypt;

@end

NS_ASSUME_NONNULL_END
