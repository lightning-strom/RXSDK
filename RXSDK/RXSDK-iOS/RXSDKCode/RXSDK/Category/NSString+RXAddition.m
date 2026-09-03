//
//  NSString+RXAddition.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "NSString+RXAddition.h"

@implementation NSString (RXAddition)

+ (NSString *)rx_isNullToString:(id)string {
    if ([string isEqual:@"NULL"]
        || [string isKindOfClass:[NSNull class]]
        || [string isEqual:[NSNull null]]
        || [string isEqual:NULL]
        || [[string class] isSubclassOfClass:[NSNull class]]
        || string == nil
        || string == NULL
        || [[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length]==0
        || [string isEqualToString:@"<null>"]
        || [string isEqualToString:@"(null)"])
    {
        return @"";
    }else
    {
        return (NSString *)string;
    }
}

@end
