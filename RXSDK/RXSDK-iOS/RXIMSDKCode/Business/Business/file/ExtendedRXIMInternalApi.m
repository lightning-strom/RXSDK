//
//  ExtendedRXIMInternalApi.m
//  Business
//
//  Created by Elbay on 2024/5/30.
//

#import "ExtendedRXIMInternalApi.h"
//#import "RXIMCommonTool.h"
@import RXIMSdk_business.RXIMCommonTool;
@import RXIMSdk_business.RXIMUserUtility;
@import RXIMSdk_business.RXIMApiUrl;


@interface ExtendedRXIMInternalApi ()

@end

@implementation ExtendedRXIMInternalApi


+ (nonnull RXCommonRequest *)buildUpdateConversationInfo:(NSString * _Nonnull)conversationId option:(NSInteger)option ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt evType:(NSInteger)evType creator:(NSString * _Nullable)creator {
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    [dic setValue:@(evType) forKey:@"event_type"];
    if ((evType&EventTypeConversation_EvTypeConExt)==EventTypeConversation_EvTypeConExt) {
        [dic setValue:ext forKey:@"ext"];
    }
    if ((evType&EventTypeConversation_EvTypeConOption)==EventTypeConversation_EvTypeConOption) {
        [dic setValue:@(option) forKey:@"option"];
    }
    if ((evType&EventTypeConversation_EvTypeConImsext)==EventTypeConversation_EvTypeConImsext) {
        [dic setValue:imsExt forKey:@"ims_ext"];
    }
    if ((evType&EventTypeConversation_EvTypeConUpdateCreator)==EventTypeConversation_EvTypeConUpdateCreator) {
        [dic setValue:creator forKey:@"creator"];
    }
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl updateSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

+ (nonnull RXCommonRequest *)buildUpdateUserInfoToConversation:(NSString * _Nonnull)conversationId option:(NSInteger)option ext:(NSDictionary<NSString *,NSString *> * _Nullable)ext imsExt:(NSDictionary<NSString *,NSString *> * _Nullable)imsExt eventType:(NSInteger)eventType topTimestamp:(NSInteger)topTimestamp silent:(BOOL)silent cancelTopMsg:(NSString * _Nullable)cancelTopMsg {
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:conversationId forKey:@"conversation_id"];
    [dic setValue:@(eventType) forKey:@"event_type"];
    if ((eventType&EventTypeUserConv_EvTypeUserConTopConv)==EventTypeUserConv_EvTypeUserConTopConv) {
        [dic setValue:@(topTimestamp) forKey:@"top"];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConSilent)==EventTypeUserConv_EvTypeUserConSilent) {
        [dic setValue:@(silent) forKey:@"silent"];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConTopMsg)==EventTypeUserConv_EvTypeUserConTopMsg) {
        if (cancelTopMsg != nil) {
            [dic setValue:cancelTopMsg forKey:@"cancel_top_msg"];
        }
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConImsext)==EventTypeUserConv_EvTypeUserConImsext) {
        [dic setValue:imsExt forKey:@"ims_ext"];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConExt)==EventTypeUserConv_EvTypeUserConExt) {
        [dic setValue:ext forKey:@"ext"];
    }
    if ((eventType&EventTypeUserConv_EvTypeUserConOption)==EventTypeUserConv_EvTypeUserConOption) {
        [dic setValue:@(option) forKey:@"option"];
    }
    
    RXCommonRequest *request = [[RXCommonRequest alloc]initWithApiName:[RXIMApiUrl updateUserDataSessionUrl] andParams:dic];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
    
}

@end
