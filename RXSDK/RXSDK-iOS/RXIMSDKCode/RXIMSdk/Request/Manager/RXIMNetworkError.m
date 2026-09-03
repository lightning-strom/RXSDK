//
//  RXIMNetworkError.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import "RXIMNetworkError.h"
#import "RXIMLogManager.h"

@implementation RXIMNetworkError


+ (void)internalError:(RXIMBaseInterfaceModel *)model complete:(void(^)(RXIMError *error))complete
{
    RXIMError *rxErr = [[RXIMError alloc]init];
    rxErr.code = model.code;
    rxErr.developerMessage = model.msg;
    if (complete) {
        complete(rxErr);
    }
}

+ (void)networkError:(RXCommonRequestError *)error complete:(void(^)(RXIMError *error))complete
{
    RXIMError *rxErr = [[RXIMError alloc]init];
    rxErr.code = error.error.code;
    if (error.responesObject != nil) {
        rxErr.developerMessage = [error.responesObject objectForKey:@"msg"];
    }
    if (complete) {
        complete(rxErr);
    }
}

+ (void)internalError:(RXIMBaseInterfaceModel *)model completeWithArgument:(void(^)(id argument,RXIMError *error))complete
{
    RXIMError *rxErr = [[RXIMError alloc]init];
    rxErr.code = model.code;
    rxErr.developerMessage = model.msg;
    if (complete) {
        complete(nil,rxErr);
    }
}

+ (void)networkError:(RXCommonRequestError *)error completeWithArgument:(void(^)(id argument,RXIMError *error))complete
{
    RXIMError *rxErr = [[RXIMError alloc]init];
    rxErr.code = error.error.code;
    if (error.responesObject != nil) {
        rxErr.developerMessage = [error.responesObject objectForKey:@"msg"];
    }
    if (complete) {
        complete(nil,rxErr);
    }
}
@end
