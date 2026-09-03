//
//  RXAliOSSManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/8/19.
//

#import <Foundation/Foundation.h>
#import "RXCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXAliOSSManager : NSObject

// 文件上传
+ (void)putFileAliOSSWithBodyData:(NSData *)bodyData response:(NSDictionary *)response ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
