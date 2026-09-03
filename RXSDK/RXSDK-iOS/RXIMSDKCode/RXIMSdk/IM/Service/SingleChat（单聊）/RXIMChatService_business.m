//
//  RXIMChatService_business.m
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/10.
//

#import "RXIMChatService_business.h"
#import "RXIMChatService+Inner.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"
#import "RXIMCommonTool.h"
#import "RXIMCommonDevice.h"
#import "RXIMErrorCode.h"
#import "RXIMInternalApi.h"
#import "RXIMBaseInterfaceModel.h"
#import "RXIMNetworkError.h"
#import "RXIMUserUtility.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMChatService_business

static RXIMChatService_business *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMChatService_business alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

- (void)setDelegate_business:(id<RXIMMessageDelegate_business>)delegate_business
{
    _delegate_business = delegate_business;
    [RXIMChatService sharedSDK].delegate = (id)delegate_business;
    [RXIMChatService_business sharedSDK].delegate = (id)delegate_business;
}

#pragma mark - 消息加急
- (void)urgentMessage:(NSString * _Nonnull)msgId
               target:(NSString * _Nonnull)target
            receivers:(NSArray * _Nonnull)receivers
    completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    RXIMMessage *message = [[RXIMMessage alloc]init];
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
    if (session == nil) {
        message.sessionType = RXIMSessionType_single;
    }else{
        message.sessionType = session.type;
    }
    message.fromId = [RXIMUserUtility sharedManager].userId;
    message.sessionID = target;
    message.localId = [self getLocalIdStr];
    message.msgType = (RXIMMessageType)RXIMServerMessageType_SysMsgUrgent;
    message.timestamp = [RXIMCommonDevice getTimestamp];
    message.status = RXIMMsgStatus_sending;
    message.clientType = [RXIMUserUtility sharedManager].clientType;
    message.receivers = receivers.mutableCopy;
    message.msgId = msgId;
    RXIMMessage *msgDB = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
    message.option = msgDB.option;
    [self saveTmpMessage:message];
    BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
    if (res) {
        RXLogInfo(prefixStr, @"加急消息存入db成功");
    }else{
        RXLogError(prefixStr, @"加急消息localid=%ld存入db失败",message.localId);
    }
    [self sendMessage:message];
    if (completionHandler) {
        completionHandler(nil);
    }
}

#pragma mark - 标记消息
-(void)markMessage:(NSArray * _Nonnull)msgIds
            target:(NSString * _Nonnull)target
             state:(BOOL)state
    completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateServerMessageExt:msgIds target:target ext:nil imsExt:@{@"mark":[NSString stringWithFormat:@"%ld",state]}] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            for (NSString *msgId in msgIds) {
                [[RXIMWCDB sharedSDK] updateMsgWithIsMark:state msgId:msgId];
            }
            if (completionHandler) {
                completionHandler(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];
}

#pragma mark - 回复表情消息
-(void)replyEmojiMessage:(NSString * _Nonnull)msgId
            target:(NSString * _Nonnull)target
             emoji:(NSString *)emojiJson
    completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSString *jsonString = emojiJson;
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];

    NSError *err;
    NSArray *jsonArray = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&err];
 
    NSMutableArray<RXIMReplyEmoji *> *emojiArray = [NSMutableArray array];
    if (!error) {
        
        
        for (NSDictionary *dict in jsonArray) {
            RXIMReplyEmoji *emoji = [[RXIMReplyEmoji alloc] init];
            emoji.emojiName = dict[@"emojiName"];
            emoji.members = dict[@"members"];
            
            [emojiArray addObject:emoji];
        }
    }
    [[RXIMWCDB sharedSDK] updateMsgWithReplyEmoji:emojiArray msgId:msgId];

    if (completionHandler) {
        completionHandler(nil);
    }
    
//    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateServerMessageExt:@[msgId] target:target ext:nil imsExt:@{@"replyEmoji":[NSString stringWithFormat:@"%@",emojiJson]}] success:^(id  _Nullable responseObject) {
//        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
//        if (model.isSuccess) {
//            
//            [[RXIMWCDB sharedSDK] updateMsgWithReplyEmoji:emojiArray msgId:msgId];
//
//            if (completionHandler) {
//                completionHandler(nil);
//            }
//        }else{
//            [RXIMNetworkError internalError:model complete:completionHandler];
//        }
//    } failure:^(RXCommonRequestError * _Nullable error) {
//        [RXIMNetworkError networkError:error complete:completionHandler];
//    }];
}

@end
