//
//  RXIMSearchService.m
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/18.
//

#import "RXIMSearchService.h"
#import "RXIMInternalApi.h"
#import "RXIMNetworkError.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonTool.h"
#import "RXIMSearchResultInterface.h"
#import "RXModelTransform.h"
#import "RXIMWCDB.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMSearchService

static RXIMSearchService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSearchService alloc] init];
    });
    return sharedSDK;
}

- (void)searchMessage:(RXIMSearchRequestModel *)requestModel completionHandler:(void (^)(RXIMSearchResultData *searchResult,RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildSearchMessage:requestModel] success:^(id  _Nullable responseObject) {
        RXIMSearchResultInterface *interfaceModel = [RXIMSearchResultInterface rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
            if (completionHandler) {
//                for (RXIMSearchResultModel *modelObj in interfaceModel.data.results) {
//                    id contentObj = [RXModelTransform rxReceiveJsonContent_model:(MessageType)modelObj.msgType body:modelObj.content];
//                    modelObj.content = contentObj;
//                }
                completionHandler(interfaceModel.data,nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
}

- (NSArray <RXIMMessage *> *)searchLocalMultimedia:(NSString *)convId
{
    return [[RXIMWCDB sharedSDK] getMediaMsgsWithTarget:convId];
}

-(NSArray<RXIMMessage *> *)searchMessagesWithKeyword:(NSString *)keyword{
    return [[RXIMWCDB sharedSDK] searchMessagesWithKeyword:keyword];
}

@end
