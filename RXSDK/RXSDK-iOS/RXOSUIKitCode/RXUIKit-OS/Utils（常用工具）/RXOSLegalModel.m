//
//  RXOSLegalModel.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "RXOSLegalModel.h"

@implementation RXOSLegalData_term

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_permissionList

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_permission

+ (NSDictionary *)mj_objectClassInArray{
    return @{@"list" : @"RXOSLegalData_permissionList"};
}

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_minor

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_realNameAuth

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_antiAddiction

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData_antiAddiction_user

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end

@implementation RXOSLegalData

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{
        @"terms" : [RXOSLegalData_term class]
    };
}

@end

@implementation RXOSLegalModel

+ (NSDictionary *)modelContainerPropertyGenericClass {
    return @{};
}

@end
