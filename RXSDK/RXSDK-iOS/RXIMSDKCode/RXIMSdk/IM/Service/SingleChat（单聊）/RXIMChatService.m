//
//  RXIMChatService.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMChatService.h"
#import "RXIMSocket.h"
#import "RXIMSocketUnpack.h"
#import "RXIMUserUtility.h"
#import "RximmessageP.pbobjc.h"
#import "RXIMSocketPacket.h"
#import "RXModelTransform.h"
#import "RXIMMsgHandle.h"
#import "RXIMCommonDevice.h"
#import "RXIMCreditUploadManager.h"
#import "RXIMSDKApi.h"
#import "RXModelTransform.h"
#import "RXIMMsgReplyContent.h"
#import "NSObject+RXUAddition.h"
#import "RXIMChatService+Inner.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"
#import "RXIMMsgContinuityHandle.h"
#import "RXIMCommonTool.h"
#import "RXIMErrorCode.h"
#import "RXIMWebSocket.h"
#import "RXIMSessionService+Inner.h"
#import "RXIMInternalApi.h"
#import "RXIMBaseInterfaceModel.h"
#import "RXIMNetworkError.h"
#import "RXIMChatService_business.h"
#import "RXIMSessionService_business.h"

static NSInteger timeInterval = 5;
static NSString *noteStr; //留言
static NSInteger forwardType; //转发类型

@interface RXIMChatService () <RXIMSocketInternalDelegate>

@property (nonatomic,strong) NSTimer *mTimer;
@property (nonatomic,strong) NSMutableArray *tempMessageAry; //临时存储消息
@property (nonatomic,strong) NSMutableArray *isSyncingMessageAry; //正在同步消息，发送消息的缓存队列

@end

@implementation RXIMChatService

static RXIMChatService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMChatService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSRunLoop currentRunLoop] addTimer:self.mTimer forMode:NSRunLoopCommonModes];
        self.tempMessageAry = [NSMutableArray array];
        self.isSyncingMessageAry = [NSMutableArray array];
        if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
            [RXIMWebSocket sharedSDK].msgDelegate = self;
        }else{
            [RXIMSocket sharedSDK].msgDelegate = self;
        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncFinished) name:@"SyncFinished" object:nil];
        [self addObserver:self forKeyPath:@"delegate" options:NSKeyValueObservingOptionNew context:NULL];

    }
    return self;
}


- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey,id> *)change
                       context:(void *)context {
    if ([keyPath isEqualToString:@"delegate"]) {
        id newDelegate = [change objectForKey:NSKeyValueChangeNewKey];
        NSLog(@"更改delegate  %@",change);
        if (!newDelegate) {
            NSLog(@"Delegate is now nil");
            // 在这里添加你需要的逻辑
        }
    }
}



#pragma mark - 同步消息
-(void)syncMessage
{
    [[RXIMSessionService sharedSDK] fetchConversationList:^(NSArray<RXIMSession *> * _Nonnull sessionInfoAry, RXIMError * _Nonnull error) {
        RXLogInfo(prefixStr, @"sync startInboxId5 = %ld,endInboxId = %ld",[RXIMUserUtility sharedManager].maxInboxId+1,0);
        [[RXIMChatService sharedSDK] getServerOfflineMsgWithStartinboxId:[RXIMUserUtility sharedManager].maxInboxId+1 endinboxId:0 limit:30];
    }];
}

#pragma mark - 发送消息操作
- (void)sendMessageHandle:(RXIMSendMessage
                           *)sendMessage
        completionHandler:(void (^)(RXIMMessage * message,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    RXIMMessage *message = [[RXIMMessage alloc]init];
    message.msgType = [RXModelTransform fetchMessageType:sendMessage.content];
    if (message.msgType == RXIMMessageType_UnknownMt) {
        RXIMError *error = [[RXIMError alloc]init];
        error.code = BasicErrCode_Argument;
        error.developerMessage = @"content format is incorrect.";
        if (completionHandler) {
            completionHandler(nil,error);
        }
        return;
    }
    if (message.msgType == RXIMMessageType_Custom) {
//        if (sendMessage.subType > LeaveConversation) {
//            RXIMError *error = [[RXIMError alloc]init];
//            error.code = BasicErrCode_Network;
//            error.developerMessage = @"subType is invalid";
//            if (completionHandler) {
//                completionHandler(nil,error);
//            }
//            return;
//        }
        message.subType = sendMessage.subType;
    }
    message.sessionType = sendMessage.sessionType;
    message.fromId = [RXIMUserUtility sharedManager].userId;
    message.sessionID = sendMessage.sessionID;
    if (message.sessionType == RXIMSessionType_single) {
        message.toId = [RXModelTransform receiverFromConversation:sendMessage.sessionID sender:message.fromId];
    }
    if (message.sessionType == RXIMSessionType_single) {
        message.toId = [RXModelTransform receiverFromConversation:sendMessage.sessionID sender:message.fromId];
    }
    message.content = sendMessage.content;
    if (sendMessage.ext == nil) {
        message.ext = @{};
    }else{
        message.ext = sendMessage.ext;
    }
    message.localId = [self getLocalIdStr];
    
    message.timestamp = [RXIMCommonDevice getTimestamp];
    message.status = RXIMMsgStatus_sending;
    message.clientType = [RXIMUserUtility sharedManager].clientType;
    message.receivers = sendMessage.receivers;
    message.option = sendMessage.option;
    message.snapchatTimeout = sendMessage.snapchatTimeout;
    message.unreadCount = [self getMsgUnreadCount:sendMessage.sessionID covType:sendMessage.sessionType];
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.protocolSeqId = [RXIMUserUtility sharedManager].protocolSeqId += 1;
    RXLogInfo(prefixStr, @"protocolSeqId:%ld",model.protocolSeqId);
    model.commandId_chat = CommandId_Chat_msg;

    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = YES;
    flag.hasPayload = YES;
    model.flag = flag;
    
    /**
     * 文件类消息先上传
     */
    if (message.msgType == RXIMMessageType_Image || message.msgType == RXIMMessageType_Audio || message.msgType == RXIMMessageType_File || message.msgType == RXIMMessageType_Video || message.msgType == RXIMMessageType_Position) {
        if (completionHandler) {
            completionHandler(message,nil);
        }
        [self getOSSLink:message complete:^(RXIMMessage *message, RXIMError *error) {
            [self.tempMessageAry addObject:message];
            BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
            if (res) {
                RXLogInfo(prefixStr, @"发送消息存入db成功");
            }else{
                RXLogError(prefixStr, @"发送消息localid=%ld存入db失败",message.localId);
            }
            NSData *msgData = [RXModelTransform configMessageModelToData:message];
            
            NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:msgData model:model needEncrypt:YES];
            if (![RXIMMsgContinuityHandle sharedSDK].isSync) {
                if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                    [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
                }else{
                    [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
                }
            }else{
                [self.isSyncingMessageAry addObject:sendData];
            }
        }];
    } else {
        if (completionHandler) {
            completionHandler(message,nil);
        }
        [self.tempMessageAry addObject:message];
        //已读和撤回消息不保存
        BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
        if (res) {
            RXLogInfo(prefixStr, @"发送消息存入db成功");
        }else{
            RXLogError(prefixStr, @"发送消息localid=%ld存入db失败",message.localId);
        }
        NSData *msgData = [RXModelTransform configMessageModelToData:message];
        NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:msgData model:model needEncrypt:YES];
        if (![RXIMMsgContinuityHandle sharedSDK].isSync) {
            if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
            }else{
                [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
            }
        }else{
            [self.isSyncingMessageAry addObject:sendData];
        }
        
    }
}

#pragma mark - 获取OSS链接地址
- (void)getOSSLink:(RXIMMessage *)message
        complete:(void (^)(RXIMMessage *message,RXIMError *error))complete
{
    NSData *mainData = nil;
    NSData *subData = nil;
    NSString *mainPath = nil;
    NSString *subPath = nil;
    NSString *mainFolderName = nil;
    NSString *subFolderName = nil;
    NSString *mainFileType = nil;
    NSString *subFileType = nil;
    __block NSString *mainRes = nil;
    __block NSString *subRes = nil;
    // 处理content类型
    if (message.msgType == RXIMMessageType_Image) {
        RXIMMsgImageContent *imageContent = (RXIMMsgImageContent *)message.content;
        mainData = imageContent.original_data;
        UIImage *scaleImage = [UIImage imageWithData:mainData];
        subData = UIImageJPEGRepresentation(scaleImage, 0.7);
        mainPath = imageContent.path;
        mainFileType = [RXModelTransform getImageType:imageContent.original_data];
        mainFolderName = @"image";
        subFileType = [RXModelTransform getImageType:imageContent.blurred_data];
        subFolderName = @"thumbimage";
    } else if (message.msgType == RXIMMessageType_File) {
        RXIMMsgFileContent *fileContent = (RXIMMsgFileContent *)message.content;
        mainPath = fileContent.path;
        mainData = fileContent.file_data;
        mainFileType = fileContent.file_type;
        mainFolderName = @"file";
    } else if (message.msgType == RXIMMessageType_Video) {
        RXIMMsgVideoContent *videoContent = (RXIMMsgVideoContent *)message.content;
        mainData = videoContent.video_data;
        subData = videoContent.cover_data;
        mainFileType = videoContent.video_type;
        subFileType = [RXModelTransform getImageType:videoContent.cover_data];
        mainFolderName = @"video";
        subFolderName = @"image";
        mainPath = videoContent.path;
    } else if (message.msgType == RXIMMessageType_Audio) {
        RXIMMsgAudioContent *audioContent = (RXIMMsgAudioContent *)message.content;
        mainData = audioContent.audioData;
        mainPath = audioContent.path;
        mainFileType = audioContent.audio_type;
        mainFolderName = @"audio";
    } else if (message.msgType == RXIMMessageType_Position){
        RXIMMsgLBSContent *lbsContent = (RXIMMsgLBSContent *)message.content;
        mainData = lbsContent.cover_data;
        mainFolderName = @"lbs";
        mainFileType = [RXModelTransform getImageType:lbsContent.cover_data];
    }
    if (mainPath == nil || mainPath.length == 0) {
        mainPath = [NSString stringWithFormat:@"mainPath%ld",[RXIMCommonDevice getTimestamp]];
    }
    if (subPath == nil || subPath.length == 0) {
        subPath = [NSString stringWithFormat:@"subPath%ld",[RXIMCommonDevice getTimestamp]];
    }
    dispatch_group_t group = dispatch_group_create();
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_group_enter(group);
    dispatch_async(queue, ^{
        [RXIMCreditUploadManager RXIMOSSUpload:mainData path:mainPath folderName:mainFolderName fileType:mainFileType uploadProgress:^(int64_t bytesSent, int64_t totalBytesSent, int64_t totalBytesExpectedToSend) {
            if (self.delegate && [self.delegate respondsToSelector:@selector(fileUploadCallback:byteSent:totalBytesSent:totalBytesExpectedToSend:)]) {
                [self.delegate fileUploadCallback:message byteSent:bytesSent totalBytesSent:totalBytesSent totalBytesExpectedToSend:totalBytesExpectedToSend];
            }
        } success:^(id  _Nonnull result) {
            mainRes = result;
            RXLogInfo(prefixStr, @"mainRes = %@",result);
            dispatch_group_leave(group);
        } failure:^{
            dispatch_group_leave(group);
            RXLogError(prefixStr, @"上传oss失败localid=%ld",message.localId);
        }];
    });
    
    if (subData != nil) {
        dispatch_group_enter(group);
        dispatch_async(queue, ^{
            [RXIMCreditUploadManager RXIMOSSUpload:subData path:subPath folderName:subFolderName fileType:subFileType uploadProgress:^(int64_t bytesSent, int64_t totalBytesSent, int64_t totalBytesExpectedToSend) {
            } success:^(id  _Nonnull result) {
                subRes = result;
                RXLogInfo(prefixStr, @"subRes = %@",result);
                dispatch_group_leave(group);
            } failure:^{
                dispatch_group_leave(group);
                RXLogError(prefixStr, @"上传oss失败localid=%ld",message.localId);
            }];
        });
    }
    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        // 上传的url赋值
        if (message.msgType == RXIMMessageType_Image) {
            RXIMMsgImageContent *imageContent = (RXIMMsgImageContent *)message.content;
            imageContent.original_url = mainRes;
            imageContent.thumbnail_url = subRes;
            message.content = imageContent;
        } else if (message.msgType == RXIMMessageType_File) {
            RXIMMsgFileContent *fileContent = (RXIMMsgFileContent *)message.content;
            fileContent.url = mainRes;
            message.content = fileContent;
        } else if (message.msgType == RXIMMessageType_Audio) {
            RXIMMsgAudioContent *audioContent = (RXIMMsgAudioContent *)message.content;
            audioContent.url = mainRes;
            message.content = audioContent;
        } else if(message.msgType == RXIMMessageType_Position){
            RXIMMsgLBSContent *lbsContent = (RXIMMsgLBSContent *)message.content;
            lbsContent.cover_url = mainRes;
            message.content = lbsContent;
        }else if (message.msgType == RXIMMessageType_Video) {
            RXIMMsgVideoContent *videoContent = (RXIMMsgVideoContent *)message.content;
            videoContent.video_url = mainRes;
            videoContent.cover_url = subRes;
            message.content = videoContent;
        }
        complete(message,nil);
    });
}

#pragma mark - 发送消息
- (void)sendMessage:(RXIMSendMessage *)sendMessage
  completionHandler:(void (^)(RXIMMessage * message,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    [self argumentHandle:sendMessage completionHandler:^(RXIMError *error) {
        if (error) {
            completionHandler(nil,error);
        }else{
            [self sendMessageHandle:sendMessage completionHandler:completionHandler];
        }
    }];
}

#pragma mark - 重发消息
- (void)resendMessage:(RXIMMessage *)message
  completionHandler:(void (^)(RXIMMessage * message,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    if (message == nil) {
        RXIMError *error = [[RXIMError alloc]init];
        error.code = IMErrCode_Argument;
        error.developerMessage = @"message is null";
        completionHandler(nil,error);
        return;
    }
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.commandId_chat = CommandId_Chat_msg;
    message.status = RXIMMsgStatus_sending;
    NSInteger timestamp = [RXIMCommonDevice getTimestamp];
    message.timestamp = timestamp;
    [[RXIMWCDB sharedSDK] updateMsgWithTimestamp:timestamp localId:message.localId];
    BOOL isExistLink = false;
    if (message.msgType == RXIMMessageType_Image) {
        RXIMMsgImageContent *content = message.content;
        if (content.original_url != nil) {
            isExistLink = true;
        }
    }
    if (message.msgType == RXIMMessageType_Audio) {
        RXIMMsgAudioContent *content = message.content;
        if (content.url != nil) {
            isExistLink = true;
        }
    }
    if (message.msgType == RXIMMessageType_Video) {
        RXIMMsgVideoContent *content = message.content;
        if (content.video_url != nil && content.cover_url != nil) {
            isExistLink = true;
        }
    }
    if (message.msgType == RXIMMessageType_Position) {
        RXIMMsgLBSContent *content = message.content;
        if (content.cover_url != nil) {
            isExistLink = true;
        }
    }
    if (!isExistLink) {
        [self getOSSLink:message complete:^(RXIMMessage *message, RXIMError *error) {
            [self.tempMessageAry addObject:message];
            [self sendMessage:message];
        }];
    }else{
        [self.tempMessageAry addObject:message];
        [self sendMessage:message];
    }
}

#pragma mark - 转发消息
- (void)forwardMessage:(NSArray * _Nonnull)mids
              receives:(NSArray * _Nonnull)receives
                  type:(NSInteger)type
                  note:(NSString * _Nullable)note
                   ext:(NSArray * _Nullable)exts
                option:(NSInteger)option
     completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    noteStr = note;
    forwardType = type;
    if (type == 1) {
        [self singleForwardMsg:mids receives:receives note:note ext:exts option:option completionHandler:completionHandler];
    }else if(type == 2){
        [self ibyitemForwardMsg:mids receives:receives note:note ext:exts option:option completionHandler:completionHandler];
    }else{
        [self combineForwardMsg:mids receives:receives note:note ext:exts option:option completionHandler:completionHandler];
    }
    
}

#pragma mark - 单条转发
- (void)singleForwardMsg:(NSArray *)mids
                receives:(NSArray *)receives
                     note:(NSString *)note
                      ext:(NSArray *)exts
                   option:(NSInteger)option
        completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    __block NSMutableArray *messagesAry = [NSMutableArray array];
//    dispatch_sync(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [mids enumerateObjectsUsingBlock:^(NSString * _Nonnull mid, NSUInteger idx1, BOOL * _Nonnull stop) {
            RXIMMessage *messageDB = [[RXIMWCDB sharedSDK] getMsgWithMsgid:mid];
            [receives enumerateObjectsUsingBlock:^(NSString * _Nonnull target, NSUInteger idx2, BOOL * _Nonnull stop) {
                RXIMMessage *message = [[RXIMMessage alloc]init];
                message.fromId = [RXIMUserUtility sharedManager].userId;
                message.sessionID = target;
                message.localId = [self getLocalIdStr];
//                message.msgId = -message.localId;
                if (exts!=nil && exts.count>idx1) {
                    message.ext = [exts objectAtIndex:idx1];
                }
                RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
                if (session == nil) {
                    message.sessionType = RXIMSessionType_single;
                }else{
                    message.sessionType = session.type;
                }
                if (message.sessionType == RXIMSessionType_single) {
                    message.toId = [RXModelTransform receiverFromConversation:message.sessionID sender:message.fromId];
                }
                message.unreadCount = [self getMsgUnreadCount:target covType:message.sessionType];
                message.timestamp = [RXIMCommonDevice getTimestamp];
                message.status = RXIMMsgStatus_sending;
                message.option = option|session.userOption;
                message.snapchatTimeout = session.snapchatTimeout;
                if (messageDB.msgType == RXIMMessageType_Reply) {
                    RXIMMsgReplyContent *replyContent = messageDB.content;
                    message.content = replyContent.reply.content;
                    message.msgType = RXIMMessageType_Text;
                }else{
                    message.msgType = messageDB.msgType;
                    message.content = messageDB.content;
                }
                message.subType = messageDB.subType;
                message.clientType = messageDB.clientType;
                BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
                if (res) {
                    RXLogInfo(prefixStr, @"转发消息存入db成功");
                }else{
                    RXLogError(prefixStr, @"转发消息msgid=%ld存入db失败",message.localId);
                }
                if (message!=nil) {
                    [messagesAry addObject:message];
                }
                [self sendMessage:message];
            }];
        }];
//        dispatch_async(dispatch_get_main_queue(), ^{
            if (completionHandler) {
                completionHandler(messagesAry,nil);
            }
//        });
//    });
}

#pragma mark - 逐条转发
- (void)ibyitemForwardMsg:(NSArray *)mids
                receives:(NSArray *)receives
                     note:(NSString *)note
                      ext:(NSArray *)exts
                   option:(NSInteger)option
        completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    __block NSMutableArray *messagesAry = [NSMutableArray array];
//    dispatch_sync(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [receives enumerateObjectsUsingBlock:^(NSString * _Nonnull target, NSUInteger idx2, BOOL * _Nonnull stop){
            [mids enumerateObjectsUsingBlock:^(NSString * _Nonnull mid, NSUInteger idx1, BOOL * _Nonnull stop) {
                RXIMMessage *messageDB = [[RXIMWCDB sharedSDK] getMsgWithMsgid:mid];
                RXIMMessage *message = [[RXIMMessage alloc]init];
                message.fromId = [RXIMUserUtility sharedManager].userId;
                message.sessionID = target;
                message.localId = [self getLocalIdStr];
//                message.msgId = -message.localId;
                if (exts!=nil && exts.count>idx1) {
                    message.ext = [exts objectAtIndex:idx1];
                }
                RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
                if (session == nil) {
                    message.sessionType = RXIMSessionType_single;
                }else{
                    message.sessionType = session.type;
                }
                if (message.sessionType == RXIMSessionType_single) {
                    message.toId = [RXModelTransform receiverFromConversation:message.sessionID sender:message.fromId];
                }
                message.unreadCount = [self getMsgUnreadCount:target covType:messageDB.sessionType];
                message.timestamp = [RXIMCommonDevice getTimestamp];
                message.status = RXIMMsgStatus_sending;
                message.option = option|session.userOption;
                message.snapchatTimeout = session.snapchatTimeout;
                if (messageDB.msgType == RXIMMessageType_Reply) {
                    RXIMMsgReplyContent *replyContent = messageDB.content;
                    message.content = replyContent.reply.content;
                    message.msgType = RXIMMessageType_Text;
                }else{
                    message.msgType = messageDB.msgType;
                    message.content = messageDB.content;
                }
                message.subType = messageDB.subType;
                message.clientType = messageDB.clientType;
                BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
                if (res) {
                    RXLogInfo(prefixStr, @"转发消息存入db成功");
                }else{
                    RXLogError(prefixStr, @"转发消息msgid=%ld存入db失败",message.localId);
                }
                if (message!=nil) {
                    [messagesAry addObject:message];
                }
                [self sendMessage:message];
                if (idx1 == [mids count]-1) {
                    if (!IsEmpty(note)) {
                        RXIMSendMessage *sendMsg = [[RXIMSendMessage alloc]init];
                        RXIMMsgTextContent *textContent = [[RXIMMsgTextContent alloc] init];
                        textContent.text = note;
                        sendMsg.sessionID = target;
                        sendMsg.content = textContent;
                        sendMsg.msgType = RXIMMessageType_Text;
                        sendMsg.sessionType = message.sessionType;
                        sendMsg.ext = message.ext;
                        sendMsg.snapchatTimeout = message.snapchatTimeout;
                        sendMsg.option = message.option;
                        [[RXIMChatService sharedSDK] sendMessage:sendMsg completionHandler:^(RXIMMessage * _Nullable message,RXIMError *error){
                            
                        }];
                    }
                }
            }];
            
        }];
//        dispatch_async(dispatch_get_main_queue(), ^{
            if (completionHandler) {
                completionHandler(messagesAry,nil);
            }
//        });
//    });
}

#pragma mark - 合并转发
- (void)combineForwardMsg:(NSArray *)mids
                receives:(NSArray *)receives
                     note:(NSString *)note
                      ext:(NSArray *)exts
                   option:(NSInteger)option
        completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    __block NSMutableArray *messagesAry = [NSMutableArray array];

    RXLogDebug(prefixStr, nil);
    [receives enumerateObjectsUsingBlock:^(NSString * _Nonnull target, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMMessage *message = [[RXIMMessage alloc]init];
        message.fromId = [RXIMUserUtility sharedManager].userId;
        message.localId = [self getLocalIdStr];;
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
        if (session == nil) {
            message.sessionType = RXIMSessionType_single;
        }else{
            message.sessionType = session.type;
        }
        message.sessionID = session.sessionID;
        if (message.sessionType == RXIMSessionType_single) {
            message.toId = [RXModelTransform receiverFromConversation:message.sessionID sender:message.fromId];
        }
        message.timestamp = [RXIMCommonDevice getTimestamp];
        message.status = RXIMMsgStatus_sending;
        message.clientType = [RXIMUserUtility sharedManager].clientType;
        message.unreadCount = [self getMsgUnreadCount:session.sessionID covType:session.type];
        if (exts!=nil && exts.count>idx) {
            message.ext = [exts objectAtIndex:idx];
        }
        message.option = option|session.userOption;
        message.snapchatTimeout = session.snapchatTimeout;
        NSMutableArray *combine = [NSMutableArray array];
        NSString *sessionIDFrom;
        for (NSString *msgId in mids) {
            RXIMMessage *msg_db = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
            RXIMMsgCombineTransmitData *CTData = [[RXIMMsgCombineTransmitData alloc]init];
            CTData.msgId = msg_db.msgId;
//            if (msg_db.msgType == RXIMMessageType_Reply) {
//                RXIMMsgReplyContent *replyContent = msg_db.content;
//                CTData.content = replyContent.reply.content;
//                CTData.msgType = RXIMMessageType_Text;
//            }else{
                CTData.msgType = msg_db.msgType;
                CTData.content = msg_db.content;
//            }
            CTData.timestamp = msg_db.timestamp;
            CTData.subType = msg_db.subType;
            CTData.fromId = msg_db.fromId;
            [combine addObject:CTData];
            sessionIDFrom = msg_db.sessionID;
        }
        RXIMMsgCombineTransmitContent *content = [[RXIMMsgCombineTransmitContent alloc]init];
        content.sessionID = sessionIDFrom;
        content.combine = combine;
        message.content = content;
        message.msgType = RXIMMessageType_CombineTransmit;
        BOOL res = [[RXIMWCDB sharedSDK] insertMsg:message];
        if (res) {
            RXLogInfo(prefixStr, @"转发消息存入db成功");
        }else{
            RXLogError(prefixStr, @"转发消息msgid=%ld存入db失败",message.localId);
        }
        
        if (message!=nil) {
            [messagesAry addObject:message];
        }
        
        [self sendMessage:message];
    }];
    if (completionHandler) {
        completionHandler(messagesAry,nil);
    }
}

#pragma mark - 转发发送回复消息
- (void)sendReplyMsgInForward:(RXIMMessage *)originMsg target:(NSString *)target ext:(NSDictionary *)ext option:(NSInteger)option
{
    RXIMMsgReplyContent *replyContent = [[RXIMMsgReplyContent alloc]init];
    RXIMReferenceMsg *referenceMsg = [[RXIMReferenceMsg alloc]init];
    referenceMsg.fromId = originMsg.fromId;
    referenceMsg.msgType  = originMsg.msgType;
    referenceMsg.msgId = originMsg.msgId;
    referenceMsg.content = originMsg.content;
    referenceMsg.timestamp = originMsg.timestamp;
    referenceMsg.subType = originMsg.subType;
    RXIMReplyMsg *replyMsg = [[RXIMReplyMsg alloc]init];
    replyMsg.msgType = RXIMMessageType_Text;
    RXIMMsgTextContent *textContent = [[RXIMMsgTextContent alloc]init];
    textContent.text = noteStr;
    replyMsg.content = textContent;
    replyContent.reference = referenceMsg;
    replyContent.reply = replyMsg;
    RXIMMessage *replyMessage = [[RXIMMessage alloc]init];
    replyMessage.fromId = [RXIMUserUtility sharedManager].userId;
    replyMessage.sessionID = target;
    replyMessage.localId = [self getLocalIdStr];
    replyMessage.ext = ext;
    RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
    if (session == nil) {
        replyMessage.sessionType = RXIMSessionType_single;
    }else{
        replyMessage.sessionType = session.type;
    }
    if (replyMessage.sessionType == RXIMSessionType_single) {
        replyMessage.toId = [RXModelTransform receiverFromConversation:replyMessage.sessionID sender:replyMessage.fromId];
    }
    if (replyMessage.sessionType == RXIMSessionType_single) {
        replyMessage.toId = [RXModelTransform receiverFromConversation:replyMessage.sessionID sender:replyMessage.fromId];
    }
    replyMessage.unreadCount = [self getMsgUnreadCount:target covType:replyMessage.sessionType];
    replyMessage.timestamp = [RXIMCommonDevice getTimestamp];
    replyMessage.status = RXIMMsgStatus_sending;
    replyMessage.option = option|session.userOption;
    replyMessage.snapchatTimeout = session.snapchatTimeout;
    replyMessage.msgType = RXIMMessageType_Reply;
    replyMessage.content = replyContent;
    replyMessage.clientType = originMsg.clientType;
    BOOL res = [[RXIMWCDB sharedSDK] insertMsg:replyMessage];
    if (res) {
        RXLogInfo(prefixStr, @"转发消息的回复消息存入db成功");
    }else{
        RXLogError(prefixStr, @"转发消息的回复消息msgid=%ld存入db失败",replyMessage.localId);
    }
    [self sendMessage:replyMessage];
}

#pragma mark - 已读消息
- (void)hasReadMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    if (message == nil) {
        RXIMError *error = [[RXIMError alloc]init];
        error.code = IMErrCode_Argument;
        error.developerMessage = @"msg is null";
        completionHandler(error);
        return;
    }
    RXIMMessage *readMessage = [[RXIMMessage alloc]init];
    readMessage.sessionType = message.sessionType;
    readMessage.fromId = [RXIMUserUtility sharedManager].userId;
    readMessage.sessionID = message.sessionID;
    readMessage.ext = message.ext;
    readMessage.localId = [self getLocalIdStr];
    readMessage.msgType = RXIMMessageType_read;
    readMessage.timestamp = [RXIMCommonDevice getTimestamp];
    readMessage.status = RXIMMsgStatus_sending;
    readMessage.clientType = [RXIMUserUtility sharedManager].clientType;
    readMessage.option = message.option;
    readMessage.snapchatTimeout = message.snapchatTimeout;
    if (message.sessionType == RXIMSessionType_custom || message.sessionType == RXIMSessionType_group) {
        if (message.fromId!=nil) {
            readMessage.receivers = @[message.fromId].mutableCopy;
        }
    }else{
        readMessage.receivers = @[].mutableCopy;
    }
    readMessage.receiverNum = message.receiverNum;
    readMessage.msgId = message.msgId;
    [self.tempMessageAry addObject:readMessage];
    BOOL res = [[RXIMWCDB sharedSDK] insertMsg:readMessage];
    if (res) {
        RXLogInfo(prefixStr, @"已读消息存入db成功");
    }else{
        RXLogError(prefixStr, @"已读消息localid=%ld存入db失败",readMessage.localId);
    }
    [self sendMessage:readMessage];
    completionHandler(nil);
}

#pragma mark - 撤回消息
- (void)revokeMessage:(RXIMMessage * _Nonnull)message completionHandler:(void (^)(RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    if (message == nil) {
        RXIMError *error = [[RXIMError alloc]init];
        error.code = IMErrCode_Argument;
        error.developerMessage = @"msg is null";
        completionHandler(error);
        return;
    }
    if (message.status == RXIMMsgStatus_failed) {
        RXIMError *error = [[RXIMError alloc]init];
        error.code = IMErrCode_Argument;
        error.developerMessage = @"this is send failure msg,not need revoke!";
        completionHandler(error);
        return;
    }
    RXIMMessage *revokeMessage = [[RXIMMessage alloc]init];
    revokeMessage.sessionType = message.sessionType;
    revokeMessage.fromId = [RXIMUserUtility sharedManager].userId;
    revokeMessage.sessionID = message.sessionID;
    revokeMessage.ext = message.ext;
    revokeMessage.localId = [self getLocalIdStr];
    revokeMessage.msgType = RXIMMessageType_recall;
    revokeMessage.timestamp = [RXIMCommonDevice getTimestamp];
    revokeMessage.status = RXIMMsgStatus_sending;
    revokeMessage.clientType = [RXIMUserUtility sharedManager].clientType;
    revokeMessage.receivers = message.receivers;
    revokeMessage.receiverNum = message.receiverNum;
    revokeMessage.msgId = message.msgId;
    revokeMessage.option = message.option;
    [self.tempMessageAry addObject:revokeMessage];
    BOOL res = [[RXIMWCDB sharedSDK] insertMsg:revokeMessage];
    if (res) {
        RXLogInfo(prefixStr, @"撤回消息存入db成功");
    }else{
        RXLogError(prefixStr, @"撤回消息localid=%ld存入db失败",revokeMessage.localId);
    }
    [self sendMessage:revokeMessage];
    completionHandler(nil);
}

#pragma mark - 更新服务器消息扩展字段
- (void)updateServerMessageExt:(NSArray * _Nonnull)msgIds
                        target:(NSString * _Nonnull)target
                           ext:(NSDictionary<NSString *,NSString *> * _Nonnull)ext
             completionHandler:(void (^)(RXIMError *error))completionHandler
{
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildUpdateServerMessageExt:msgIds target:target ext:ext imsExt:nil] success:^(id  _Nullable responseObject) {
        RXIMBaseInterfaceModel *model = [RXIMBaseInterfaceModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            for (NSString *msgId in msgIds) {
                [[RXIMWCDB sharedSDK] updateMsgWithExt:ext msgId:msgId];
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

#pragma mark - 更新本地会话扩展字段
- (BOOL)updateLocalMessageExt:(NSArray * _Nonnull)msgIds
                     ext:(NSDictionary<NSString *,NSString *> * _Nonnull)ext
{
    BOOL res = true;
    for (NSString *msgId in msgIds) {
        res = [[RXIMWCDB sharedSDK] updateMsgWithExt:ext msgId:msgId];
        if (!res) {
            return res;
        }
    }
    return res;
}

#pragma mark - 设置语音消息已播放
- (BOOL)setAudioMessagePlayed:(NSString *)msgId
{
    RXLogDebug(prefixStr, nil);
    RXIMMessage *message = [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
    if ([message.content isKindOfClass:[RXIMMsgAudioContent class]]) {
        RXIMMsgAudioContent *content = (RXIMMsgAudioContent *)message.content;
        content.isPlay = true;
        return [[RXIMWCDB sharedSDK] updateMsgWithContent:content.rx_modelToJSONString msgId:msgId];
    }else{
        return false;
    }
    
}

#pragma mark - 获取本地历史消息
- (void)getHistoryMessages:(NSString *)msgId
                                 target:(NSString *)target
                            sessionType:(RXIMSessionType)sessionType
                                  limit:(NSInteger)limit
                      completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    NSInteger timestamp = 0;
    if (msgId != nil) {
        RXIMMessage *message = [[RXIMWCDB sharedSDK]getMsgWithMsgid:msgId];
        timestamp = message.timestamp;
    }
    NSArray *msgArr = [[RXIMWCDB sharedSDK] getMsgsWithMsgId:msgId timestamp:timestamp target:target limit:limit isAfterTimestamp:NO];
    NSArray *reverseMsgArr = [[msgArr reverseObjectEnumerator] allObjects];
    
    [reverseMsgArr enumerateObjectsUsingBlock:^(RXIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        [self readMessage:obj.msgId target:obj.target sessionType:obj.sessionType];
    }];
    if (completionHandler) {
        completionHandler(reverseMsgArr,nil);
    }
}

#pragma mark - 获取服务器历史消息
- (void)fetchHistoryMessages:(NSString *)msgId target:(NSString *)target limit:(NSInteger)limit
{
    RXLogDebug(prefixStr, nil);
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.commandId_chat = CommandId_Chat_history;
    model.protocolSeqId = 0;
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = YES;
    flag.hasPayload = YES;
    model.flag = flag;
    
    HistoryReq *req = [[HistoryReq alloc]init];
    req.conversationId = target;
    req.startMsgId = msgId;
    req.fetchCount = (int)limit;
    
    NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:[req data] model:model needEncrypt:YES];
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }else{
        [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }
}

#pragma mark - 获取消息未读数
-(NSInteger)getMsgUnreadCount:(NSString *)covId covType:(RXIMSessionType)covType
{
    NSInteger unreadCount = 0;
    if (covType == RXIMSessionType_single || covType == RXIMSessionType_custom) {
        unreadCount = 1;
    }else{
        RXIMSession *session = [[RXIMWCDB sharedSDK] getSessionWithTarget:covId];
        if (session!=nil) {
            NSArray *members = session.members;
            if (members!=nil) {
                unreadCount = members.count-1;
            }
        }
    }
    return unreadCount;
}

#pragma mark - 校验参数
- (void)argumentHandle:(RXIMSendMessage *)sendMessage
 completionHandler:(void (^)(RXIMError *error))complete
{
    RXIMError *error = [[RXIMError alloc]init];
    error.code = IMErrCode_Argument;
    if (sendMessage == nil) {
        error.developerMessage = @"sendMessage is null";
        complete(error);
    }
    if (sendMessage.content == nil) {
        error.developerMessage = @"message content is null";
        complete(error);
    }
    switch (sendMessage.msgType) {
        case RXIMMessageType_UnknownMt:
            error.developerMessage = @"mesage type is error";
            break;
        case RXIMMessageType_Tips:
            break;
        case RXIMMessageType_Text:{
            RXIMMsgTextContent *content = (RXIMMsgTextContent *)sendMessage.content;
            if (content.text == nil) {
                error.developerMessage = @"text is null";
            }
        }
            break;
        case RXIMMessageType_Image:{
            RXIMMsgImageContent *content = (RXIMMsgImageContent *)sendMessage.content;
            if (content.original_data == nil) {
                error.developerMessage = @"original_data is null";
            }
        }
            break;
        case RXIMMessageType_Audio:{
            RXIMMsgAudioContent *content = (RXIMMsgAudioContent *)sendMessage.content;
            if (content.audioData == nil) {
                error.developerMessage = @"audioData is null";
            }
            if (content.audio_type == nil) {
                error.developerMessage = @"audo_type is null";
            }
        }
            
            break;
        case RXIMMessageType_Video:{
            RXIMMsgVideoContent *content = (RXIMMsgVideoContent *)sendMessage.content;
            if (content.video_data == nil) {
                error.developerMessage = @"video_data is null";
            }
            if (content.video_type == nil) {
                error.developerMessage = @"video_type is null";
            }
        }
            break;
        case RXIMMessageType_File:{
            RXIMMsgFileContent *content = (RXIMMsgFileContent *)sendMessage.content;
            if (content.file_data == nil) {
                error.developerMessage = @"file_data is null";
            }
            if (content.file_type == nil) {
                error.developerMessage = @"file_type is null";
            }
        }
            break;
        case RXIMMessageType_Face:
            break;
        case RXIMMessageType_Position:
            break;
        case RXIMMessageType_Reply:{
            RXIMMsgReplyContent *content = (RXIMMsgReplyContent *)sendMessage.content;
            if (content.reference == nil) {
                error.developerMessage = @"reference is null";
            }
            if (content.reply == nil) {
                error.developerMessage = @"reply is null";
            }
        }
            break;
        case RXIMMessageType_CombineTransmit:{
            RXIMMsgCombineTransmitContent *content = (RXIMMsgCombineTransmitContent *)sendMessage.content;
            if (content.combine == nil) {
                error.developerMessage = @"combine is null";
            }
        }
            break;
        case RXIMMessageType_Custom:
            break;
        case RXIMMessageType_read:
            break;
        case RXIMMessageType_recall:
            break;
        default:
            break;
    }
    if (error.developerMessage == nil) {
        complete(nil);
    }else{
        complete(error);
    }
}

#pragma mark - 通过消息id获取消息
-(RXIMMessage *)getMessageWithMsgId:(NSString *)msgId
{
    RXLogDebug(prefixStr, nil);
    return [[RXIMWCDB sharedSDK] getMsgWithMsgid:msgId];
}
 
#pragma mark - 检查消息发送状态并处理
- (void)checkMessageHandle
{
    RXLogDebug(prefixStr, nil);
    [self.tempMessageAry enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(RXIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMMessage *message = [[RXIMWCDB sharedSDK] getMsgWithLocalId:obj.localId];
        if (message!=nil) {
            if (message.status == RXIMMsgStatus_sending) {
                NSInteger timestamp = [RXIMCommonDevice getTimestamp];
                if (timestamp - message.timestamp > 2000 && ![RXIMMsgContinuityHandle sharedSDK].isSync) {
                    message.status = RXIMMsgStatus_failed;
                    BOOL isSocketConnect;
                    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                        isSocketConnect = [RXIMWebSocket sharedSDK].isSocketConnect;
                    }else{
                        isSocketConnect = [RXIMSocket sharedSDK].isSocketConnect;
                    }
                    if (![RXIMUserUtility sharedManager].isNetwork) {
                        RXIMError *error = [[RXIMError alloc]init];
                        error.code = BasicErrCode_Network;
                        error.developerMessage = @"network invalid";
                        if (self.delegate && [self.delegate respondsToSelector:@selector(sendMessageFailure:error:)]) {
                            [self.delegate sendMessageFailure:message error:error];
                            RXLogError(prefixStr, @"消息发送失败");
                        }
                    }else if(!isSocketConnect){
                        RXIMError *error = [[RXIMError alloc]init];
                        error.code = IMErrCode_Socket;
                        error.developerMessage = @"entry disconnect";
                        if (self.delegate && [self.delegate respondsToSelector:@selector(sendMessageFailure:error:)]) {
                            [self.delegate sendMessageFailure:message error:error];
                            RXLogError(prefixStr, @"消息发送失败");
                        }
                    }
                    [self.tempMessageAry removeObjectAtIndex:idx];
                    if (obj.msgType == RXIMMessageType_read || obj.msgType == RXIMMessageType_recall || obj.msgType == RXIMServerMessageType_SysMsgUrgent) {
                        [[RXIMWCDB sharedSDK] deleteMsgWithLocalId:obj.localId];
                    }else{
                        [[RXIMWCDB sharedSDK] updateMsgWithMsgStatus:RXIMMsgStatus_failed localId:obj.localId];
                    }
                }
            }else if(message.status == RXIMMsgStatus_success){
                [self.tempMessageAry removeObjectAtIndex:idx];
            }
        }
    }];
}

#pragma mark - 消息体封装发送
- (void)sendMessage:(RXIMMessage *)message
{
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_msg;
    model.protocolSeqId = [RXIMUserUtility sharedManager].protocolSeqId += 1;
    RXLogInfo(prefixStr, @"protocolSeqId:%ld",model.protocolSeqId);
    model.commandId_chat = CommandId_Chat_msg;

    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = YES;
    flag.hasPayload = YES;
    model.flag = flag;
    
    NSData *msgData = [RXModelTransform configMessageModelToData:message];
    NSData *sendData = [[RXIMSocketPacket sharedManager] handleSendData:msgData model:model needEncrypt:YES];
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }else{
        [[RXIMSocket sharedSDK] sendData:sendData commandStack:model.commandStack];
    }
}

#pragma mark - 同步完成发送缓存内消息
-(void)syncFinished
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(syncMessageFinished)]) {
        [self.delegate syncMessageFinished];
    }
    if ([self.isSyncingMessageAry count]>0) {
        [self.isSyncingMessageAry enumerateObjectsUsingBlock:^(NSData * _Nonnull sendData, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
                [[RXIMWebSocket sharedSDK] sendData:sendData commandStack:CommandStack_msg];
            }else{
                [[RXIMSocket sharedSDK] sendData:sendData commandStack:CommandStack_msg];
            }
        }];
    }
    [self.isSyncingMessageAry removeAllObjects];
}

#pragma mark -- <RXIMSocketInternalDelegate>
#pragma mark - 消息接收
- (void)socketReceiveMessage:(NSArray *)msgs
{
    RXLogDebug(prefixStr, nil);
    [self receiveMessageHandle:msgs];
}

#pragma mark - 消息发送成功
- (void)socketSendMessageSuccess:(RXIMMsgModel *)data tag:(NSInteger)tag
{
    RXLogDebug(prefixStr, nil);
    RXIMMessage *message = [RXIMMsgHandle handleSendSuccessMsg:data];
    if (message!=nil) {
        if (message.isUrgent) {
            id delegate_business = [RXIMChatService_business sharedSDK].delegate_business;
            if (delegate_business && [delegate_business respondsToSelector:@selector(onMessageUrgent:)]) {
                [delegate_business onMessageUrgent:message];
            }
        }else{
            if (self.delegate && [self.delegate respondsToSelector:@selector(sendMessageSuccess:)]) {
                [self.delegate sendMessageSuccess:message];
            }
        }
        if (message.msgType == RXIMMessageType_recall) {
            //撤回消息成功后操作
            [self handleReplyMsgFromRecallMsg:message.msgId target:message.sessionID];//更新回复的原消息
        }
        if ((forwardType == 1 || forwardType == 3) && !IsEmpty(noteStr)) {
            //合并转发带留言的回复消息
            [self sendReplyMsgInForward:message target:message.sessionID ext:message.ext option:message.option];
            noteStr = nil;
            forwardType = 0;
        }
    }
}

#pragma mark - 消息发送失败
- (void)socketSendMessageFailure:(RXIMMsgModel *)data tag:(NSInteger)tag
{
    RXIMError *rxError = [RXIMMsgHandle handleSendFailureMsg:data];
    RXIMMessage *msg = [[RXIMWCDB sharedSDK] getMsgWithLocalId:[NSString stringWithFormat:@"%ld",tag]];
    if (msg.msgType == RXIMMessageType_read) {
        [[RXIMWCDB sharedSDK] deleteMsgWithLocalId:msg.localId];
    }else{
        [[RXIMWCDB sharedSDK] updateMsgWithMsgStatus:RXIMMsgStatus_failed localId:[NSString stringWithFormat:@"%ld",tag]];
    }
    msg.status = RXIMMsgStatus_failed;
    if (self.delegate && [self.delegate respondsToSelector:@selector(sendMessageFailure:error:)]){
        [self.delegate sendMessageFailure:msg error:rxError];
    }
}

#pragma mark - 同步消息
- (void)socketSyncMsgResp:(RXIMMsgModel *)data tag:(NSInteger)tag
{
    NSArray *syncMsgAry = [RXModelTransform rxModelToB_syncMsg:data];
    for (RXIMMessage *message in syncMsgAry) {
        RXLogInfo(prefixStr, @"同步消息类型：covType:%ld msid = %ld 消息id:%@ inboxid:%ld timestamp:%ld",message.sessionType,message.msgType,message.msgId,message.inboxId,message.timestamp);
    }
    [[RXIMMsgContinuityHandle sharedSDK] syncMsgHandle:syncMsgAry];
}

#pragma mark - 历史消息
- (void)socketHistoryMsgResp:(RXIMMsgModel *)data tag:(NSInteger)tag
{
    RXIMHistoryMsgResp *rxResp = [RXModelTransform rxModelToB_historyMsg:data];
    if (self.delegate && [self.delegate respondsToSelector:@selector(historyMessage:)]) {
        [self.delegate historyMessage:rxResp];
    }
}

#pragma mark - 缓存消息
- (void)saveTmpMessage:(RXIMMessage *)msg
{
    [self.tempMessageAry addObject:msg];
}

#pragma mark - <lazzy>
- (NSTimer *)mTimer
{
    if (!_mTimer) {
        _mTimer = [NSTimer scheduledTimerWithTimeInterval:timeInterval target:self selector:@selector(checkMessageHandle) userInfo:nil repeats:YES];
    }
    
    return _mTimer;
}

@end
