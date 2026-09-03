//
//  NSObject+RXUIAdditon.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/1/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// Model 协议
@protocol RXAddition <NSObject>

@optional
// 协议方法：返回一个字典，表明特殊字段的处理规则
+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass;

@end

@interface NSObject (RXUIAdditon)

+ (instancetype)rxu_modelWithDictionary:(NSDictionary *)dictionary;

@end

NS_ASSUME_NONNULL_END
