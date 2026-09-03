//
//  RXIMSessionService_business_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSessionService_business_BS.h"
@import RXIMSdk_business.RXIMInternalApi;
@import RXIMSdk_business.RXIMSocket;
@import RXIMSdk_business.RXIMWebSocket;
@import RXIMSdk_business.RXIMNetworkError;
@import RXIMSdk_business.RXIMSessionInterfaceModel;
@import RXIMSdk_business.RXIMWCDB;
@import RXIMSdk_business.RXIMSessionService_Inner;
@import RXIMSdk_business.RXIMChatService_Inner;
@import RXIMSdk_business.RXIMLogManager;
@import RXIMSdk_business.RXIMMsgHandle;
@import RXIMSdk_business.RXIMUserUtility;
@import RXIMSdk_business.RXIMCommonTool;
@import RXIMSdk_business.RXIMErrorCode;
@import RXIMSdk_business.NSObject_RXUAddition;
@import RXIMSdk_business.RXIMBaseInterfaceModel;

@interface RXIMSessionService_business()<RXIMSocketInternalDelegate>

@end

@implementation RXIMSessionService_business_BS

+(instancetype)sharedSDK {
   static RXIMSessionService_business_BS *sharedInstance = nil;
   static dispatch_once_t onceToken;
   dispatch_once(&onceToken, ^{
       
       sharedInstance = [[RXIMSessionService_business_BS alloc] init];
//       [RXIMSessionService sharedSDK].delegate = sharedInstance;

       if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
           [RXIMWebSocket sharedSDK].sessionDelegate_business = sharedInstance;

       }else{
           [RXIMSocket sharedSDK].sessionDelegate_business = sharedInstance;
       }
       
   });
   return sharedInstance;
}

- (id<RXIMSessionServiceDelegate>)delegate{
    return [RXIMSessionService sharedSDK].delegate;
}

- (void)setDelegate:(id<RXIMSessionServiceDelegate>)delegate{
    [RXIMSessionService sharedSDK].delegate = delegate;
}





#pragma mark  转发代理方法
- (void)onReceiveNewSession:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onReceiveNewSession:)]) {
       [self.delegate_business onReceiveNewSession:session];
   }
}

- (void)onSessionTopMsg:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionTopMsg:)]) {
       [self.delegate_business onSessionTopMsg:session];
   }
}

- (void)onSessionSetManagers:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionSetManagers:)]) {
       [self.delegate_business onSessionSetManagers:session];
   }
}

- (void)onSessionTransferGroupOwner:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionTransferGroupOwner:)]) {
       [self.delegate_business onSessionTransferGroupOwner:session];
   }
}

- (void)onSessionKickGroup:(NSArray<RXIMSession *> *)sessions {
   if ([self.delegate_business respondsToSelector:@selector(onSessionKickGroup:)]) {
       [self.delegate_business onSessionKickGroup:sessions];
   }
}

- (void)onSessionGroupNameChange:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionGroupNameChange:)]) {
       [self.delegate_business onSessionGroupNameChange:session];
   }
}

- (void)onSessionGroupDescChange:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionGroupDescChange:)]) {
       [self.delegate_business onSessionGroupDescChange:session];
   }
}

- (void)onSessionUserNicknameChange:(NSString *)sessionId userId:(NSString *)userId nickname:(NSString *)nickname {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserNicknameChange:userId:nickname:)]) {
       [self.delegate_business onSessionUserNicknameChange:sessionId userId:userId nickname:nickname];
   }
}

- (void)onSessionUserSilent:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserSilent:)]) {
       [self.delegate_business onSessionUserSilent:session];
   }
}

- (void)onSessionUserTop:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserTop:)]) {
       [self.delegate_business onSessionUserTop:session];
   }
}

- (void)onSessionUserExt:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserExt:)]) {
       [self.delegate_business onSessionUserExt:session];
   }
}

- (void)onSessionUserOption:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserOption:)]) {
       [self.delegate_business onSessionUserOption:session];
   }
}

- (void)onSessionUserSnapchat:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserSnapchat:)]) {
       [self.delegate_business onSessionUserSnapchat:session];
   }
}

- (void)onSessionUserMark:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserMark:)]) {
       [self.delegate_business onSessionUserMark:session];
   }
}

- (void)onSessionUserArchive:(RXIMSession *)session {
   if ([self.delegate_business respondsToSelector:@selector(onSessionUserArchive:)]) {
       [self.delegate_business onSessionUserArchive:session];
   }
}


#pragma mark  实现业务方法

#pragma mark - 设置会话置顶/取消置顶
- (void)setTopTimestamp:(NSInteger)topTimestamp
                 covId:(NSString *)covId
     completionHandler:(void (^)(RXIMError *error))completionHandler {
       
    [[RXIMSessionService_business sharedSDK] setTopTimestamp:topTimestamp covId:covId completionHandler:completionHandler];
    
    return;
    
    /// 用下方。afn会崩溃在 dispatch_group_async(manager.completionGroup ?: url_session_manager_completion_group(), manager.completionQueue ?: dispatch_get_main_queue(), ^{
//    if (self.completionHandler) {
//        self.completionHandler(task.response, responseObject, serializationError);
//    }  这里说明[__NSPlaceholderDictionary initWithObjects:forKeys:count:]: attempt to insert nil object from objects[0]'。确定不应为nil但是不确定问题出现在哪儿

    RXIMError * error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConTopConv topTimestamp:topTimestamp silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel * model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:topTimestamp silent:false topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConTopConv];
            if (completionHandler) {
                completionHandler(nil);
            }
        }else {
            [RXIMNetworkError internalError:model complete:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:completionHandler];
    }];

}

#pragma mark - 设置会话免打扰
- (void)setSilentState:(BOOL)state
                 covId:(NSString *)covId
     completionHandler:(void (^)(RXIMError *error))completionHandler {
//   [[RXIMSessionService_business sharedSDK] setSilentState:state covId:covId completionHandler:completionHandler];
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConSilent topTimestamp:0 silent:state cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:state topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConSilent];
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

- (void)deleteServerMessages:(NSArray * _Nonnull)msgIds
                      covId:(NSString * _Nonnull)covId
          completionHandler:(void (^)(RXIMError *error))completionHandler {
   [[RXIMSessionService_business sharedSDK] deleteServerMessages:msgIds covId:covId completionHandler:completionHandler];
 
}

#pragma mark - 置顶/取消置顶会话内消息
- (void)topMessageInConversation:(NSString * _Nonnull)covId
                          msgId:(NSString * _Nonnull)msgId
                          state:(BOOL)state
                  cancelTopType:(NSInteger)cancelTopType
              completionHandler:(void (^)(RXIMError *error))completionHandler {
   [[RXIMSessionService_business sharedSDK] topMessageInConversation:covId msgId:msgId state:state cancelTopType:cancelTopType completionHandler:completionHandler];
//    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
//    if (error) {
//        completionHandler(error);
//        return;
//    }
//    if (state == 1 || (state == 0 && cancelTopType == 1)) {
//        [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildTopMessageInConversation:covId msgId:msgId state:state] success:^(id  _Nullable responseObject) {
//            RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
//            if (model.isSuccess) {
//                NSString *msgIdDB = msgId;
//                if (state == 0) {
//                    msgIdDB = nil;
//                }
//                [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:FALSE topMsg:msgIdDB topMsgUser:[RXIMUserUtility sharedManager].userId target:covId eventType:EventTypeUserConv_EvTypeUserConTopMsg];
//                if (completionHandler) {
//                    completionHandler(nil);
//                }
//            }else{
//                [RXIMNetworkError internalError:model complete:completionHandler];
//            }
//        } failure:^(RXCommonRequestError * _Nullable error) {
//            [RXIMNetworkError networkError:error complete:completionHandler];
//        }];
//    }else{
//        [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:nil eventType:EventTypeUserConv_EvTypeUserConTopMsg topTimestamp:0 silent:false cancelTopMsg:msgId] success:^(id  _Nullable responseObject) {
//            RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
//            if (model.isSuccess) {
//                [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:nil userOption:0 topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConTopMsg];
//                if (completionHandler) {
//                    completionHandler(nil);
//                }
//            }else{
//                [RXIMNetworkError internalError:model complete:completionHandler];
//            }
//        } failure:^(RXCommonRequestError * _Nullable error) {
//            [RXIMNetworkError networkError:error complete:completionHandler];
//        }];
//    }
    
}

#pragma mark - 标记/取消标记会话
- (void)markConversation:(NSString * _Nonnull)covId
                  state:(NSInteger)state
       completionHandler:(void (^)(RXIMError *error))completionHandler {
    //   [[RXIMSessionService_business sharedSDK] markConversation:covId state:state completionHandler:completionHandler];

    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:[NSString stringWithFormat:@"%ld",state] forKey:@"mark"];
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:imsExt eventType:EventTypeUserConv_EvTypeUserConImsext topTimestamp:0 silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:imsExt userOption:0 topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConImsext];
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

#pragma mark - 归档会话
- (void)archiveConversation:(NSString * _Nonnull)covId
          completionHandler:(void (^)(RXIMError *error))completionHandler {
    //   [[RXIMSessionService_business sharedSDK] archiveConversation:covId completionHandler:completionHandler];
    RXIMError *error = [RXIMCommonTool verifyIsSupportBusiness];
    if (error) {
        completionHandler(error);
        return;
    }
    NSMutableDictionary *imsExt = [self getSetedImsExt:covId];
    [imsExt setValue:@"1" forKey:@"archive"];
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateUserInfoToConversation:covId option:0 ext:nil imsExt:imsExt eventType:EventTypeUserConv_EvTypeUserConImsext topTimestamp:0 silent:false cancelTopMsg:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [[RXIMWCDB sharedSDK] updateSessionWithUserExt:nil userImsExt:imsExt userOption:0 topTimestamp:0 silent:FALSE topMsg:nil topMsgUser:nil target:covId eventType:EventTypeUserConv_EvTypeUserConImsext];
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



@end
