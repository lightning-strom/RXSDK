//
//  RXIMWebSocket.m
//  RXIMWebSocket
//
//  Created by YKZ on 2018/7/23.
//  Copyright © 2018年 yycx. All rights reserved.
//

#import "RXIMWebSocket.h"
#import "SRWebSocket.h"

@interface RXIMWebSocket ()<SRWebSocketDelegate>

@property (nonatomic,strong)SRWebSocket *webSocket;
@property(nonatomic, strong) NSThread *checkThread;             // 子线程用于监听心跳包

@end

@implementation RXIMWebSocket


static RXIMWebSocket *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMWebSocket alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    RXLogDebug(prefixStr, nil);
    self = [super init];
    if (self) {
        self.reConnectCount = 0;
        self.maxReConnectCount = 100;
        [self networkMonitoring];
    }
    return self;
}

#pragma mark - 连接socket
- (void)connectSocketWithHost:(NSString *)host port:(NSInteger)port timeout:(NSInteger)timeout{
 
    [self.webSocket close];
    self.webSocket.delegate = nil;
    self.webSocket = [[SRWebSocket alloc] initWithURLRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:host]]];
    self.webSocket.delegate = self;
    [self.webSocket open];
    RXLogInfo(prefixStr, @"socket开始连接");
}

#pragma mark - 地址为数组，按顺序调用，连接失败取下一个地址
- (void)connectSocketWithAddrs:(NSArray *)addrs timeout:(NSInteger)timeout
{
    RXLogDebug(prefixStr, nil);
    self.addrs = addrs;
    NSInteger i = self.reConnectCount;
    if (self.reConnectCount > addrs.count - 1) {
        if (addrs.count == 1) {
            i = 0;
        } else {
            return;
        }
    }
    RXLogInfo(prefixStr, @"socket开始连接:%@",addrs[i]);
    [self connectSocketWithHost:addrs[i] port:0 timeout:0];
}

#pragma mark - 关闭Socket
- (void)closeSocket
{
    RXLogDebug(prefixStr, nil);
    if(self.connectTimer != nil)
    {
        dispatch_source_cancel(self.connectTimer);
        self.connectTimer = nil;
    }
    [self.checkThread cancel];
    self.checkThread = nil;
    self.isThreadOpen = false;
    self.socketStatus = RXIMSocketOfflineReason_byUser;
    [self.mTimer invalidate];
    self.mTimer = nil;
    [self disconnectSocket];
}

#pragma mark - 断开连接socket
- (void)disconnectSocket
{
    RXLogDebug(prefixStr, nil);
    [self.webSocket close];
}

#pragma mark - 重新连接线程
- (void)socketReConnect
{
    RXLogInfo(prefixStr, @"socket重新连接");
    if (self.connectTimer != nil) {
        dispatch_source_cancel(self.connectTimer);
        self.connectTimer = nil;
    }
    
    if (self.reConnectCount > self.maxReConnectCount) {
        return;
    }
    
    self.connectQueue = dispatch_queue_create("reConnectSocketQueue", NULL);
    self.connectTimer= dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, self.connectQueue);
    //开始时间
    dispatch_time_t start = dispatch_time(DISPATCH_TIME_NOW, 3.0 * NSEC_PER_SEC);
    //间隔时间
    uint64_t interval = NSEC_PER_SEC * 3.0;
    dispatch_source_set_timer(self.connectTimer, start, interval, 0);
    //设置回调
    __weak __typeof__(self) weakSelf = self;
    dispatch_source_set_event_handler(self.connectTimer, ^{
        [weakSelf reConnectTimerStart];
    });
    //启动timer
    dispatch_resume(self.connectTimer);
}

#pragma mark - 重新连接socket
- (void)reConnectTimerStart{
    RXLogDebug(prefixStr, nil);
    @autoreleasepool {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self connectSocketWithAddrs:self.addrs timeout:0];
        });
    }
}

/**
 * 写入数据（发消息）
 * timeout  -1为不限制超时时间
 * tag 消息标记
 * commandStack 消息类型，非msg消息不需要回调
 */
- (void)sendData:(NSData *)data commandStack:(CommandStack)commandStack
{
    RXLogDebug(prefixStr, nil);
    NSInteger msgLocalId = -1000;
    if (commandStack == CommandStack_msg) {
        msgLocalId = [RXIMUserUtility sharedManager].msgLocalId;
    }
    NSError *error;
    [self.webSocket sendData:data error:&error];
}

#pragma mark -- <timerAction>
- (void)openHeartThread
{
    RXLogDebug(prefixStr, nil);
    // 开启线程发送心跳
    if (self.isThreadOpen) {
        return;
    }
    self.isThreadOpen = YES;
    [self.checkThread start];
}

// 开启常驻线程不断发送心跳
- (void)checkClientOnline
{
    RXLogDebug(prefixStr, nil);
    @autoreleasepool {
        self.mTimer = [NSTimer scheduledTimerWithTimeInterval:5 target:self selector:@selector(heartBeat) userInfo:nil repeats:YES];
        [[NSRunLoop currentRunLoop] run];
    }
}

- (void)heartBeat{
    // 头部内容
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_control;
    model.commandId_control = CommandId_Control_heart;
    
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = NO;
    flag.hasPayload = YES;
    model.flag = flag;
     
    int timestamp = (int)[RXIMCommonDevice getTimestamp];
    NSData *heartData = [[RXIMSocketPacket sharedManager] handleSendData:[NSData dataWithBytes:&timestamp length: sizeof(timestamp)] model:model needEncrypt:NO];
    NSError *error;
    [self.webSocket sendData:heartData error:&error];
}

#pragma mark -- <SRWebSocketDelegate>
- (void)webSocketDidOpen:(SRWebSocket *)webSocket{
    self.reConnectCount = 0;
    RXLogInfo(prefixStr, @"socket连接成功");
    if(self.connectTimer != nil) {
        dispatch_source_cancel(self.connectTimer);
        self.connectTimer = nil;
    }
    if (self.connectQueue) {
        self.connectQueue = nil;
    }
    /**
     * 发送验证消息
     */
    RXIMMsgModel *model = [[RXIMMsgModel alloc] init];
    model.version = 0;
    model.messageType = RecMsgType_request;
    model.commandStack = CommandStack_control;
    model.commandId_control = CommandId_Control_conn;
    
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = NO;
    flag.hasPayload = YES;
    model.flag = flag;
    
    NSData *connectData = [[RXIMSocketPacket sharedManager] handleSendData:[RXIMMsgHandle getConnectData] model:model needEncrypt:NO];
    
    [self sendData:connectData commandStack:model.commandStack];
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error{
    RXLogInfo(prefixStr, @"socket断开连接 %@",error);
    self.socketStatus = RXIMSocketOfflineReason_byOther;
    self.reConnectCount++;
    [self socketReConnect];
    if (self.connectDelegate) {
        RXIMError *rxError = [[RXIMError alloc]init];
        rxError.code = IMErrCode_Socket;
        rxError.developerMessage = error.description;
        [self.connectDelegate socketDisconnect:rxError];
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message{
    RXLogDebug(prefixStr, nil);
    NSMutableArray *msgArr = [[RXIMSocketUnpack sharedManager] fetchReceiveMsg:message];
    if (msgArr == nil) {
        return;
    }
    [self didReceiveMessage:msgArr tag:0];
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean{
    RXLogInfo(prefixStr, @"socket被关闭 code %ld",code);
    if (code == SRStatusCodeNormal) {
        //被用户关闭
        self.socketStatus = RXIMSocketOfflineReason_byUser;
        if (self.connectDelegate) {
            [self.connectDelegate socketDisconnect:nil];
        }
    }else{
        self.reConnectCount++;
        [self socketReConnect];
        if (self.connectDelegate) {
            RXIMError *rxError = [[RXIMError alloc]init];
            rxError.code = IMErrCode_Socket;
            rxError.developerMessage = reason;
            [self.connectDelegate socketDisconnect:rxError];
        }
    }
    
}

- (void)webSocket:(SRWebSocket *)webSocket didReceivePong:(NSData *)pongPayload{
//    [RXIMWebSocket shareManager].receive ? [RXIMWebSocket shareManager].receive(pongPayload,FLSocketReceiveTypeForPong) : nil;
}

#pragma mark -- <lazzys>
- (BOOL)isSocketConnect
{
    RXLogDebug(prefixStr, nil);
    if (self.webSocket.readyState == SR_CONNECTING || self.webSocket.readyState == SR_OPEN) {
        return YES;
    }else{
        return NO;
    }
}

- (NSThread *)checkThread
{
    if (!_checkThread) {
        _checkThread = [[NSThread alloc]initWithTarget:self selector:@selector(checkClientOnline) object:nil];
    }
    return _checkThread;
}

- (void)dealloc
{
    [self closeSocket];
}

@end

