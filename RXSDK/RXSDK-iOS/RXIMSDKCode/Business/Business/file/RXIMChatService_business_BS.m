//
//  RXIMChatService_business_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMChatService_business_BS.h"

//@import RXIMSdk_business.RXIMChatService_Inner;
//@import RXIMSdk_business.RXIMWCDB;
//@import RXIMSdk_business.RXIMLogManager;
//@import RXIMSdk_business.RXIMCommonTool;
//@import RXIMSdk_business.RXIMCommonDevice;
//@import RXIMSdk_business.RXIMErrorCode;
//@import RXIMSdk_business.RXIMInternalApi;
//@import RXIMSdk_business.RXIMBaseInterfaceModel;
//@import RXIMSdk_business.RXIMNetworkError;
//@import RXIMSdk_business.RXIMUserUtility;
//@import RXIMSdk_business.NSObject_RXUAddition;

#import "RXIMSdk_business/RXIMChatService_business.h"
#import "RXIMSdk_business/RXIMChatService+Inner.h"
#import "RXIMSdk_business/RXIMWCDB.h"
#import "RXIMSdk_business/RXIMLogManager.h"
#import "RXIMSdk_business/RXIMCommonTool.h"
#import "RXIMSdk_business/RXIMCommonDevice.h"
#import "RXIMSdk_business/RXIMErrorCode.h"
#import "RXIMSdk_business/RXIMInternalApi.h"
#import "RXIMSdk_business/RXIMBaseInterfaceModel.h"
#import "RXIMSdk_business/RXIMNetworkError.h"
#import "RXIMSdk_business/RXIMUserUtility.h"
#import "RXIMSdk_business/NSObject+RXUAddition.h"




@implementation RXIMChatService_business_BS

+ (instancetype)sharedSDK {
    static RXIMChatService_business_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMChatService_business_BS alloc] init];
        [RXIMChatService sharedSDK].delegate = sharedInstance;
        [RXIMChatService_business sharedSDK].delegate = sharedInstance;
    });
    return sharedInstance;
}

- (id<RXIMMessageDelegate>)delegate{
    return  [RXIMChatService sharedSDK].delegate;
}

- (id<RXIMMessageDelegate_business>)delegate_business{
    return  [RXIMChatService_business sharedSDK].delegate_business;
}

- (void)setDelegate:(id<RXIMMessageDelegate>)delegate{
    [RXIMChatService sharedSDK].delegate = delegate;
}

- (void)setDelegate_business:(id<RXIMMessageDelegate_business>)delegate_business{
    [RXIMChatService_business sharedSDK].delegate_business = delegate_business;
}

// 转发代理方法
- (void)onMessageUrgent:(RXIMMessage *)msgObj {
    if ([self.delegate_business respondsToSelector:@selector(onMessageUrgent:)]) {
        [self.delegate_business onMessageUrgent:msgObj];
    }
}

- (void)onMessageMark:(RXIMMessage *)msgObj {
    if ([self.delegate_business respondsToSelector:@selector(onMessageMark:)]) {
        [self.delegate_business onMessageMark:msgObj];
    }
}

// 实现业务方法
#pragma mark - 获取数据
- (void)getHistoryMessages:(NSString *)msgId
                    target:(NSString *)target
               sessionType:(RXIMSessionType)sessionType
                     limit:(NSInteger)limit
          isAfterTimestamp:(BOOL)isAfterTimestamp
         completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    NSInteger timestamp = 0;
    if (msgId != nil) {
        RXIMMessage *message = [[RXIMWCDB sharedSDK]getMsgWithMsgid:msgId];
        timestamp = message.timestamp;
    }
    NSArray *msgArr = [[RXIMWCDB sharedSDK] getMsgsWithMsgId:msgId timestamp:timestamp target:target limit:limit isAfterTimestamp:isAfterTimestamp];
    NSArray *reverseMsgArr = [[msgArr reverseObjectEnumerator] allObjects];
    
    [reverseMsgArr enumerateObjectsUsingBlock:^(RXIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        [self readMessage:obj.msgId target:obj.target sessionType:obj.sessionType];
    }];
    if (completionHandler) {
        completionHandler(reverseMsgArr,nil);
    }
}

#pragma mark - 消息加急

- (void)urgentMessage:(NSString * _Nonnull)msgId
               target:(NSString * _Nonnull)target
            receivers:(NSArray * _Nonnull)receivers
                  ext:(NSDictionary <NSString *,NSString *> * _Nonnull)ext
    completionHandler:(void (^)(RXIMError *error))completionHandler {
//    [[RXIMChatService_business sharedSDK] urgentMessage:msgId target:target receivers:receivers completionHandler:completionHandler];
    
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
    message.ext = ext;
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
- (void)markMessage:(NSArray * _Nonnull)msgIds
             target:(NSString * _Nonnull)target
              state:(BOOL)state
  completionHandler:(void (^)(RXIMError *error))completionHandler {
//    [[RXIMChatService_business sharedSDK] markMessage:msgIds target:target state:state completionHandler:completionHandler];
    
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
- (void)replyEmojiMessage:(NSString * _Nonnull)msgId
                   target:(NSString * _Nonnull)target
                    emoji:(NSString *)emojiJson
  completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMChatService_business sharedSDK] replyEmojiMessage:msgId target:target emoji:emojiJson completionHandler:completionHandler];
    
}

@end
