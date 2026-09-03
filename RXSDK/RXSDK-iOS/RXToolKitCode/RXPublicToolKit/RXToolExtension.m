//
//  RXToolExtension.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import "RXToolExtension.h"

@implementation RXToolExtension

/**
 * 转换为JSON 字符串
 */
+ (NSString *)getJsonString:(NSDictionary *)jsonDic
{
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:NSJSONWritingPrettyPrinted error:&error];
    if (error) {
        NSLog(@"json解析失败:%@", error);
        return nil;
    }
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonString;
}

@end
