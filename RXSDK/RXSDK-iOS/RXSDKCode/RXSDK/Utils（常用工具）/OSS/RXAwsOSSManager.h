//
//  RXAwsOSSManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/8/27.
//

#import <Foundation/Foundation.h>
#import "RXCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXAwsOSSManager : NSObject

// 文件上传
+ (void)putFileAmazonOSSWithBodyData:(NSData *)bodyData response:(NSDictionary *)response ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
