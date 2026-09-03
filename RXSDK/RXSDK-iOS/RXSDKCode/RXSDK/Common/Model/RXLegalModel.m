//
//  RXLegalModel.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXLegalModel.h"

@implementation RXLegalData_term

@end

@implementation RXLegalData_permissionList

@end

@implementation RXLegalData_permission

+ (NSDictionary *)mj_objectClassInArray{
    return @{@"list" : @"RXLegalData_permissionList"};
}

@end

@implementation RXLegalData_minor

@end

@implementation RXLegalData_realNameAuth

@end

@implementation RXLegalData_antiAddiction

@end

@implementation RXLegalData_antiAddiction_user

@end

@implementation RXLegalData_antiAddiction_pay

+ (NSDictionary *)mj_objectClassInArray{
    return @{@"rules" : @"RXLegalData_antiAddiction_payList"};
}

@end

@implementation RXLegalData_antiAddiction_payList

@end

@implementation RXLegalData


+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{
        @"terms" : [RXLegalData_term class]
    };
}

@end

@implementation RXLegalModel

@end
