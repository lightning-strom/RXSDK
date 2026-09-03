//
//  RXIMBaseInterfaceModel.m
//  RXIMSdk
//
//  Created by weiyongjian on 2021/6/9.
//

#import "RXIMBaseInterfaceModel.h"

@implementation RXIMBaseInterfaceModel

#pragma mark ========== 请求成功 ==========
-(BOOL)isSuccess
{
    return self.code==0;
}

@end
