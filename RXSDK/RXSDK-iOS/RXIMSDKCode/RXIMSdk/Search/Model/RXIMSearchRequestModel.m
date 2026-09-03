//
//  RXIMSearchRequestModel.m
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/18.
//

#import "RXIMSearchRequestModel.h"

@implementation RXIMSearchRequestModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"userId":@"user_name",
             @"sessionIDs":@"conversationids",
             @"msgTypes":@"message_type",
             @"startTimestamp":@"start_time",
             @"endTimestamp":@"end_time",
             @"count":@"size",
             @"afterTimestamp":@"after_timestamp",
             @"afterMsgId":@"after_id",
    };
}

@end
