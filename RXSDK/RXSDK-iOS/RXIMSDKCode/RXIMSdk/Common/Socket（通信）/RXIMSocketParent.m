//
//  RXIMSocketParent.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/11/19.
//

#import <AFNetworking/AFNetworking.h>
#import "RXIMSocketParent.h"
#import "Control.pbobjc.h"

@implementation RXIMSocketParent

+ (instancetype)sharedSDK
{
    return [[RXIMSocketParent alloc] init];
}

- (void)connectSocketWithHost:(NSString *)host
                         port:(NSInteger)port
                      timeout:(NSInteger)timeout
{
    
}

- (void)connectSocketWithAddrs:(NSArray *)addrs
                       timeout:(NSInteger)timeout
{
    
}

- (void)closeSocket
{
    
}

- (void)sendData:(NSData *)data commandStack:(CommandStack)commandStack
{
    
}

- (void)openHeartThread
{
    
}

#pragma mark - socket接收消息处理
-(void)didReceiveMessage:(NSArray *)msgArr tag:(NSInteger)tag
{
    for (int i = 0; i < msgArr.count; i++) {
        RXIMMsgModel *receiveModel = msgArr[i];
        NSInteger msgTag = [RXIMUserUtility sharedManager].msgLocalId;
        // 控制消息
        if (receiveModel.commandStack == CommandStack_control) {
            if (receiveModel.commandId_control == CommandId_Control_heart) {
                msgTag = -1000;
            }
            else if (receiveModel.commandId_control == CommandId_Control_serverKick) {
                //服务器主动断开
                Error *discontent = (Error *)receiveModel.messageObj;
                RXLogError(prefixStr, @"服务器主动断开：code:%ld,content:%@",discontent.code,discontent.content);
                [RXIMMsgContinuityHandle sharedSDK].isSync = false;
            }else if (receiveModel.commandId_control == CommandId_Control_rebalance){
                //更换entry地址
                [[RXIMInternalManager sharedSDK] getEntryAddressWithComplete:^(RXIMError * _Nonnull error) {
                    if (!error) {
                        RXLogInfo(prefixStr, @"更换entry地址成功");
                    }else{
                        RXLogError(prefixStr, @"更换entry地址失败 code = %ld,errMsg = %@",error.code,error.developerMessage);
                    }
                    
                }];
            }else if(receiveModel.commandId_control == CommandId_Control_ack){
                RXLogInfo(prefixStr, @"服务器链接应答");
                // 1、不是手动断开且是中途断开，重连后拉取离线消息
                if (self.socketStatus == RXIMSocketOfflineReason_byOther) {
                    RXLogInfo(prefixStr, @"断连拉取离线消息");
                    [[RXIMDisconnectHandle sharedSDK] messageHandle];
                }
                self.reConnectCount = 0;
                if (self.connectDelegate) {
                    [self.connectDelegate socketConnectSuccess];
                }
            }
            
        }
        // IM消息
        else if(receiveModel.commandStack == CommandStack_msg){
            //服务器返回确认消息
            if (receiveModel.flag.isError) {
                [RXIMMsgContinuityHandle sharedSDK].isSync = false;
                Error *error = (Error *)receiveModel.messageObj;
                RXLogError(prefixStr, @"消息异常：code:%ld,content:%@,ext = %@",error.code,error.content,error.ext);
                if (self.msgDelegate && [self.msgDelegate respondsToSelector:@selector(socketSendMessageFailure:tag:)]) {
                    [self.msgDelegate socketSendMessageFailure:receiveModel tag:msgTag];
                }
                continue;
            }
            if (receiveModel.messageType == RecMsgType_ack) {
                //确认消息
                if(receiveModel.commandId_chat == CommandId_Chat_msg){
                    RXLogInfo(prefixStr, @"receiveModelACK = %ld",receiveModel.protocolSeqId);
                    //发送消息回执
                    if (self.msgDelegate && [self.msgDelegate respondsToSelector:@selector(socketSendMessageSuccess:tag:)]) {
                        [self.msgDelegate socketSendMessageSuccess:receiveModel tag:msgTag];
                    }
                    if (self.sessionDelegate && [self.sessionDelegate respondsToSelector:@selector(socketSendMessageSuccess:tag:)]) {
                        [self.sessionDelegate socketSendMessageSuccess:receiveModel tag:msgTag];
                    }
                }else if(receiveModel.commandId_chat == CommandId_Chat_sync){
                    //同步消息回执
                    if (self.msgDelegate && [self.msgDelegate respondsToSelector:@selector(socketSyncMsgResp:tag:)]) {
                        [self.msgDelegate socketSyncMsgResp:receiveModel tag:tag];
                    }
                }else if(receiveModel.commandId_chat == CommandId_Chat_history){
                    //历史消息回执
                    if (self.msgDelegate && [self.msgDelegate respondsToSelector:@selector(socketHistoryMsgResp:tag:)]) {
                        [self.msgDelegate socketHistoryMsgResp:receiveModel tag:tag];
                    }
                }
            }else{
                //通知消息
                if (receiveModel.commandId_chat == CommandId_Chat_msg) {
                    //接收消息
                    RXIMMessageIMS *message = [RXModelTransform rxModelToB_msg:receiveModel];
                    RXLogInfo(prefixStr, @"receive msg inbox = %ld timestamp = %ld protocal = %ld",message.inboxId,message.timestamp,receiveModel.protocolSeqId);
                    BOOL continuing = false;
                    //1、渠道消息inbox不更新 2、阅后即焚、删除消息inboxid为原消息的inboxid不用判断连续 3、会话已删除的消息
                    if (message.sessionType == RXIMSessionType_channel || message.msgType == RXIMMessageType_snapchat || message.msgType == RXIMServerMessageType_deleteMsg || message.msgType == RXIMServerMessageType_deleteConv) {
                        continuing = true;
                    }else{
                        continuing = [[RXIMMsgContinuityHandle sharedSDK] receiveMsgHandel:message msgModel:receiveModel];
                    }
                    if (continuing) {
                        //给服务器回执
                        [RXIMMsgHandle fetchReceiveMsgAsMsgType:receiveModel];
                        //连续处理
                        [[RXIMMsgContinuityHandle sharedSDK].msgCacheAry removeAllObjects];
                        if (message.sessionType != RXIMSessionType_channel) {
                            [[RXIMMsgContinuityHandle sharedSDK].msgReceiveAry removeAllObjects];
                            [RXIMUserUtility sharedManager].maxInboxId = message.inboxId;
                        }
                        RXLogInfo(prefixStr, @"receiveModel = %ld",receiveModel.protocolSeqId);
                        if (self.msgDelegate && [self.msgDelegate respondsToSelector:@selector(socketReceiveMessage:)]) {
                            [self.msgDelegate socketReceiveMessage:@[(RXIMMessage *)message]];
                        }
                        
                        if (self.sessionDelegate && [self.sessionDelegate respondsToSelector:@selector(socketReceiveMessage:)]) {
                            [self.sessionDelegate socketReceiveMessage:@[(RXIMMessage *)message]];
                        }
                        
                    }
                    
                }
            }
            
        }else if (receiveModel.commandStack == CommandStack_Event){
            if (self.sessionDelegate_business && [self.sessionDelegate_business respondsToSelector:@selector(socketReceiveEvent:tag:)]) {
                [self.sessionDelegate_business socketReceiveEvent:receiveModel tag:tag];
            }
        }
    }
}

#pragma mark - 网络监听
-(void)networkMonitoring
{
    RXLogDebug(prefixStr, nil);
    AFNetworkReachabilityManager *manager = [AFNetworkReachabilityManager sharedManager];
    [manager startMonitoring];
    [manager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        switch (status) {
            case AFNetworkReachabilityStatusUnknown:
                RXLogInfo(prefixStr, @"未识别的网络");
                break;
            case AFNetworkReachabilityStatusNotReachable:{
                RXLogInfo(prefixStr, @"网络断开");
                [RXIMUserUtility sharedManager].isNetwork = false;
            }
                break;
            case AFNetworkReachabilityStatusReachableViaWWAN:{
                RXLogInfo(prefixStr, @"2G,3G,4G...的网络");
                [RXIMUserUtility sharedManager].isNetwork = true;
            }
                break;
            case AFNetworkReachabilityStatusReachableViaWiFi:
                RXLogInfo(prefixStr, @"wifi的网络");
                [RXIMUserUtility sharedManager].isNetwork = true;
                break;
            default:
                break;
        }
    }];
}

- (NSMutableData *)dataBuffer
{
    if (!_dataBuffer) {
        _dataBuffer = [NSMutableData data];
    }
    return _dataBuffer;
}



@end
