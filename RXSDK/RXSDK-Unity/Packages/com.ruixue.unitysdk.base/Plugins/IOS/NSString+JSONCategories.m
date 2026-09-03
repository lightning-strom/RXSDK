//
//  NSString+JSONCategories.m
//  UnityFramework
//
//  Created by lee yubo on 2023/11/28.
//

#import "NSString+JSONCategories.h"

@implementation NSString (JSONCategories)
 
// 将NSArray、NSDictionary转化为JSON串
+ (NSString *)objectToJson:(id)obj
{
    if (obj == nil) {
        return nil;
    }
    
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:obj options:NSJSONWritingPrettyPrinted error:&error];
 
    if ([jsonData length] && error == nil) {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    } else {
        return nil;
    }
}
 
// JSON串解析为NSArray、NSDictionary
+ (id)jsonToObject:(NSString *)json
{
    // string转data
    NSData *jsonData = [json dataUsingEncoding:NSUTF8StringEncoding];
    // JSON解析
    id obj = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
    return obj;
}
 
@end
