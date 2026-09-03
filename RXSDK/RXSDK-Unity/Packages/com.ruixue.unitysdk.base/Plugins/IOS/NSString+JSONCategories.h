//
//  NSString+JSONCategories.h
//  UnityFramework
//
//  Created by lee yubo on 2023/11/28.
//


#import <Foundation/Foundation.h>
 
NS_ASSUME_NONNULL_BEGIN
 
@interface NSString (JSONCategories)
 
// 将NSArray、NSDictionary转化为JSON串
+ (NSString *)objectToJson:(id)obj;
 
// JSON串解析为NSArray、NSDictionary
+ (id)jsonToObject:(NSString *)json;
 
@end

NS_ASSUME_NONNULL_END
