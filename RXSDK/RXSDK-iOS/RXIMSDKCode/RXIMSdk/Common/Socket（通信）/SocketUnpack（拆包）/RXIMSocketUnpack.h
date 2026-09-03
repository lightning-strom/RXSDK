//
//  RXIMSocketUnpack.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import <Foundation/Foundation.h>
#import "RximmessageP.pbobjc.h"
#import "RXIMMessageIMS.h"
#import "RXIMMsgModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSocketUnpack : NSObject

+ (instancetype)sharedManager;

/**
 * 解析socket返回的数据
 * @param data 包数据
 */
- (NSMutableArray *)fetchReceiveMsg:(NSData *)data;


@end

NS_ASSUME_NONNULL_END
