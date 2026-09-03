//
//  RXADJTool.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import <Foundation/Foundation.h>
#import <Adjust/Adjust.h>
#import "RXADJConfig.h"
#import "RXAdjust.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXADJTool : NSObject

// Config 模型转换  rx-->adj
+ (ADJConfig *)getADJConfig:(RXADJConfig *)rxConfig;

// LogLevel 模型转换  rx-->adj
+ (ADJLogLevel)getADJLogLevel:(RXADJLogLevel)rxLogLevel;

// Event 模型转换  rx-->adj
+ (ADJEvent *)getADJEvent:(RXADJEvent *)rxEvent;

// Subscription 模型转换  rx-->adj
+ (ADJSubscription *)getADJSubscription:(RXADJSubscription *)subscription;

// EventSuccess 模型转换  adj-->rx
+ (RXADJEventSuccess *)getRXEventSuccess:(ADJEventSuccess *)adjEventSuccess;

// EventFailure 模型转换  adj-->rx
+ (RXADJEventFailure *)getRXEventFailure:(ADJEventFailure *)adjEventFailure;

// SessionSuccess 模型转换  adj-->rx
+ (RXADJSessionSuccess *)getRXSessionSuccess:(ADJSessionSuccess *)adjSessionSuccess;

// SessionFailure 模型转换  adj-->rx
+ (RXADJSessionFailure *)getRXSessionFailure:(ADJSessionFailure *)adjSessionFailure;

// Attribution 模型转换  adj-->rx
+ (RXADJAttribution *)getADJAttribution:(ADJAttribution *)adjAttribution;

//model转化为字典
+ (NSDictionary *)dicFromObject:(NSObject *)object;

@end

NS_ASSUME_NONNULL_END
