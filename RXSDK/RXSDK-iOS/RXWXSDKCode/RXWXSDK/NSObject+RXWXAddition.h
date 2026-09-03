//
//  NSObject+RXWXAddition.h
//  RXWXSDK
//
//  Created by 陈汉 on 2022/11/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSObject (RXWXAddition)

+ (instancetype)rxwx_modelWithDictionary:(NSDictionary *)dictionary;

@end

NS_ASSUME_NONNULL_END
