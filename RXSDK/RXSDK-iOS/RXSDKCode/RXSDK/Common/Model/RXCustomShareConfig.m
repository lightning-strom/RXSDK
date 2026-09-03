//
//  RXCustomShareConfig.m
//  RXSDK
//
//  Created by 陈汉 on 2024/3/7.
//

#import "RXCustomShareConfig.h"
#import "NSObject+RXAddition.h"

@implementation RXCustomShareConfig

+ (RXCustomShareConfig *)shareConfigWithShareInfo:(NSDictionary *)shareInfo
{
    RXCustomShareConfig *config = [RXCustomShareConfig rx_modelWithDictionary:shareInfo];
    config.materialType = shareInfo[@"material_type"];
    
    return config;
}

@end
