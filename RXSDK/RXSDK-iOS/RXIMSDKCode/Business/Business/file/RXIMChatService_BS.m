//
//  RXIMChatService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMChatService_BS.h"
#import <RXIMSdk_business/RXIMWCDB.h>

@implementation RXIMChatService_BS

+ (instancetype)sharedSDK {
    static RXIMChatService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMChatService_BS alloc] init]; 
    });
    return sharedInstance;
}

- (id<RXIMMessageDelegate>)delegate{
    return [RXIMChatService sharedSDK].delegate;
}

- (void)setDelegate:(id<RXIMMessageDelegate>)delegate{
    [RXIMChatService sharedSDK].delegate = delegate;
}

#pragma mark 方法拦截转发

- (void)syncMessage {
    [[RXIMChatService sharedSDK] syncMessage];
}

- (void)sendMessage:(RXIMSendMessage * _Nonnull)sendMessage
  completionHandler:(void (^)(RXIMMessage * message, RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] sendMessage:sendMessage completionHandler:completionHandler];
}

- (void)resendMessage:(RXIMMessage * _Nonnull)message
    completionHandler:(void (^)(RXIMMessage * message, RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] resendMessage:message completionHandler:completionHandler];
}

- (void)forwardMessage:(NSArray * _Nonnull)mids
              receives:(NSArray * _Nonnull)receives
                  type:(NSInteger)type
                  note:(NSString * _Nullable)note
                   ext:(NSArray * _Nullable)exts
                option:(NSInteger)option
     completionHandler:(void (^)(NSArray<RXIMMessage *> *messages, RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] forwardMessage:mids receives:receives type:type note:note ext:exts option:option completionHandler:completionHandler];
}

- (void)hasReadMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] hasReadMessage:message completionHandler:completionHandler];
}

- (void)revokeMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] revokeMessage:message completionHandler:completionHandler];
}

- (void)fetchHistoryMessages:(NSString * _Nullable)msgId
                      target:(NSString * _Nonnull)target
                       limit:(NSInteger)limit {
    [[RXIMChatService sharedSDK] fetchHistoryMessages:msgId target:target limit:limit];
}

- (void)updateServerMessageExt:(NSArray * _Nonnull)msgIds
                        target:(NSString * _Nonnull)target
                           ext:(NSDictionary<NSString *, NSString *> * _Nonnull)ext
             completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] updateServerMessageExt:msgIds target:target ext:ext completionHandler:completionHandler];
}

- (void)getHistoryMessages:(NSString * _Nullable)msgId
                    target:(NSString * _Nonnull)target
               sessionType:(RXIMSessionType)sessionType
                     limit:(NSInteger)limit
          isAfterTimestamp:(BOOL)isAfter
         completionHandler:(void (^)(NSArray<RXIMMessage *> *messages, RXIMError *error))completionHandler {
    [[RXIMChatService sharedSDK] getHistoryMessages:msgId target:target sessionType:sessionType limit:limit completionHandler:completionHandler];
   
    NSInteger timestamp = 0;
    if (msgId != nil) {
        RXIMMessage *message = [[RXIMWCDB sharedSDK]getMsgWithMsgid:msgId];
        timestamp = message.timestamp;
    }

    NSArray *msgArr = [[RXIMWCDB sharedSDK] getMsgsWithMsgId:msgId timestamp:timestamp target:target limit:limit isAfterTimestamp:isAfter];
    NSArray *reverseMsgArr = [[msgArr reverseObjectEnumerator] allObjects];
    
    [reverseMsgArr enumerateObjectsUsingBlock:^(RXIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        [self readMessage:obj.msgId target:obj.target sessionType:obj.sessionType];
    }];
    if (completionHandler) {
        completionHandler(reverseMsgArr,nil);
    }
    
}

- (RXIMMessage *)getMessageWithMsgId:(NSString * _Nonnull)msgId {
    return [[RXIMChatService sharedSDK] getMessageWithMsgId:msgId];
}

- (BOOL)updateLocalMessageExt:(NSArray * _Nonnull)msgIds
                          ext:(NSDictionary<NSString *, NSString *> * _Nonnull)ext {
    return [[RXIMChatService sharedSDK] updateLocalMessageExt:msgIds ext:ext];
}

- (BOOL)setAudioMessagePlayed:(NSString *)msgId {
    return [[RXIMChatService sharedSDK] setAudioMessagePlayed:msgId];
}

#pragma mark 代理拦截转发

- (void)receiveMessage:(NSArray<RXIMMessage *> *)msgs {
    if ([self.delegate respondsToSelector:@selector(receiveMessage:)]) {
        [self.delegate receiveMessage:msgs];
    }
}

- (void)sendMessageSuccess:(RXIMMessage *)msgObj {
    if ([self.delegate respondsToSelector:@selector(sendMessageSuccess:)]) {
        [self.delegate sendMessageSuccess:msgObj];
    }
}

- (void)sendMessageFailure:(RXIMMessage *)msgObj error:(RXIMError *)error {
    if ([self.delegate respondsToSelector:@selector(sendMessageFailure:error:)]) {
        [self.delegate sendMessageFailure:msgObj error:error];
    }
}

- (void)historyMessage:(RXIMHistoryMsgResp *)msgObj {
    if ([self.delegate respondsToSelector:@selector(historyMessage:)]) {
        [self.delegate historyMessage:msgObj];
    }
}

- (void)onServerMessageDelete:(RXIMMessage *)msgObj {
    if ([self.delegate respondsToSelector:@selector(onServerMessageDelete:)]) {
        [self.delegate onServerMessageDelete:msgObj];
    }
}

- (void)syncMessageFinished {
    if ([self.delegate respondsToSelector:@selector(syncMessageFinished)]) {
        [self.delegate syncMessageFinished];
    }
}

- (void)onReplyOriginMessageRecalled:(NSArray<RXIMMessage *> *)msgs {
    if ([self.delegate respondsToSelector:@selector(onReplyOriginMessageRecalled:)]) {
        [self.delegate onReplyOriginMessageRecalled:msgs];
    }
}

- (void)fileUploadCallback:(RXIMMessage *)msgObj byteSent:(int64_t)bytesSent totalBytesSent:(int64_t)totalBytesSent totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
    if ([self.delegate respondsToSelector:@selector(fileUploadCallback:byteSent:totalBytesSent:totalBytesExpectedToSend:)]) {
        [self.delegate fileUploadCallback:msgObj byteSent:bytesSent totalBytesSent:totalBytesSent totalBytesExpectedToSend:totalBytesExpectedToSend];
    }
}

@end
