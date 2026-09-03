//
//  RXLegalModel.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXLegalModel.h"

@implementation RXLegalData_term

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_permissionList

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_permission

+ (NSDictionary *)mj_objectClassInArray{
    return @{@"list" : @"RXLegalData_permissionList"};
}

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_minor

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_realNameAuth

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_antiAddiction

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData_antiAddiction_user

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXLegalData

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{
        @"terms" : [RXLegalData_term class]
    };
}

@end

@implementation RXLegalModel

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end
