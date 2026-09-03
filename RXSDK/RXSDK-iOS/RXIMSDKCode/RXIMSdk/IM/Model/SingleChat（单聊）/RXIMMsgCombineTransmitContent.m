//
//  RXIMMsgCombineTransmitContent.m
//  RXIMSdk
//
//  Created by 魏永健 on 2022/11/28.
//

#import "RXIMMsgCombineTransmitContent.h"

@implementation RXIMMsgCombineTransmitData

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"fromId":@"sender",
            @"msgId":@"msg_id",
            @"timestamp":@"milli_ts",
            @"msgType":@"type",
            @"subType":@"sub_type",
    };
}

@end

@implementation RXIMMsgCombineTransmitContent

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"sessionID":@"conversation_id",
    };
}

+(NSDictionary *)modelContainerPropertyGenericClass
{
    return @{@"combine":RXIMMsgCombineTransmitData.class};
}

@end
