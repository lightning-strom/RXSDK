//
//  RXToolExtension.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXToolExtension : NSObject

/**
 * 转换为JSON 字符串
 */
+ (NSString *)getJsonString:(NSDictionary *)jsonDic;

@end

NS_ASSUME_NONNULL_END
