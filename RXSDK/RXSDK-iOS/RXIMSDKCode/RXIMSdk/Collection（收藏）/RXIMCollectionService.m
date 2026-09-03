//
//  RXIMCollection.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/13.
//

#import "RXIMCollectionService.h"
#import "RXIMInternalApi.h"
#import "RXIMNetworkError.h"
#import "RXIMSessionInterfaceModel.h"
#import "RXIMWCDB.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonTool.h"
#import "RXIMErrorCode.h"
#import "RXIMCollectModel.h"
#import "GPBMessage.h"
#import "RXModelTransform.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMCollectionService

static RXIMCollectionService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMCollectionService alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 添加收藏
- (void)addCollection:(NSArray *)msgIds completionHandler:(void (^)(RXIMError *))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildAddCollection:msgIds] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 删除收藏
- (void)deleteCollection:(NSArray *)msgIds completionHandler:(void (^)(RXIMError *))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildDeleteCollection:msgIds] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *interfaceModel = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 获取收藏列表
- (void)getCollectionList:(void (^)(NSArray<RXIMMessage *> *msgs, RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(nil,error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetCollectionList] success:^(id  _Nullable responseObject) {
        RXIMCollectModel *collectModel = [RXIMCollectModel rx_modelWithDictionary:responseObject];
        if (collectModel.isSuccess) {
            NSMutableArray *existMsgArr = [NSMutableArray array];
            NSMutableArray *unExistMsgArr = [NSMutableArray array];
            for (NSString *msgId in collectModel.data.msgids) {
                RXIMMessage *msg = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
                if (msg) {
                    [existMsgArr addObject:msg];
                }else{
                    [unExistMsgArr addObject:msgId];
                }
            }
            if ([unExistMsgArr count]>0) {
                [self getCollectMsgs:unExistMsgArr completionHandler:^(NSArray<RXIMMessage *> *msgs, RXIMError *error) {
                    [existMsgArr addObjectsFromArray:msgs];
                    if (completionHandler) {
                        completionHandler(existMsgArr,nil);
                    }
                }];
            }else{
                if (completionHandler) {
                    completionHandler(existMsgArr,nil);
                }
            }
            
        }else{
            [RXIMNetworkError internalError:collectModel completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
}

-(void)getCollectMsgs:(NSArray *)msgIds
    completionHandler:(void (^)(NSArray<RXIMMessage *> *msgs, RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetCollectionMsgs:msgIds] success:^(id  _Nullable responseObject) {
        RXIMCollectMsgModel *collectModel = [RXIMCollectMsgModel rx_modelWithDictionary:responseObject];
        if (collectModel.isSuccess) {
            NSMutableArray *msgsArr = [NSMutableArray array];
            for (NSString *base64Str in collectModel.data.msgs) {
                NSData *data = [[NSData alloc]initWithBase64EncodedString:base64Str options:NSDataBase64DecodingIgnoreUnknownCharacters];
                ChatMessage *chatMessage = (ChatMessage *)[ChatMessage parseFromData:data error:nil];
                RXIMMessage *message = (RXIMMessage *)([RXModelTransform rxModelToB_singleMsg:chatMessage]);
                [msgsArr addObject:message];
            }
            if (completionHandler) {
                completionHandler(msgsArr,nil);
            }
        }else{
            [RXIMNetworkError internalError:collectModel completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
}


@end
