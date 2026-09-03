//
//  RXIMSearchResultModel.m
//  RXIMSdk-business
//
//  Created by weiyongjian on 2023/1/18.
//

#import "RXIMSearchResultModel.h"

@implementation RXIMSearchResultModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"sessionID":@"session_id",
             @"msgId":@"msg_id",
             @"msgType":@"msg_type",
             @"fromId":@"sender_id",
             @"msgInboxId":@"message_box_id",
    };
}

@end

@implementation RXIMSearchAfterModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"msgId":@"id"};
}

@end

@implementation RXIMSearchResultData

+(NSDictionary *)modelContainerPropertyGenericClass
{
    return @{@"results":RXIMSearchResultModel.class,@"after":RXIMSearchAfterModel.class};
}

@end
