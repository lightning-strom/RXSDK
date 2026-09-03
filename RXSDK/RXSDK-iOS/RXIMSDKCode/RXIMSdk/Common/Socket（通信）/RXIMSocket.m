//
//  RXIMSocket.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMSocket.h"
#import "GCDAsyncSocket.h"

@interface RXIMSocket () <GCDAsyncSocketDelegate>

@property (nonatomic, strong) GCDAsyncSocket *clientSocket;
@property(nonatomic, strong) NSThread *checkThread;             // 子线程用于监听心跳包

@end

@implementation RXIMSocket

static RXIMSocket *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSocket alloc] init];
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
        /**
         * 初始化
         */
        self.clientSocket = [[GCDAsyncSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
//        [self connectSocketWithHost:@"10.40.1.110" port:31130 timeout:60];
        [self networkMonitoring];
    }
    return self;
}

#pragma mark -- <init>
/**
 * 连接socket
 * @param host 地址
 * @param port 端口
 * @param timeout 超时时间（秒）
 */
- (void)connectSocketWithHost:(NSString *)host
                         port:(NSInteger)port
                      timeout:(NSInteger)timeout
                     
{
    RXLogDebug(prefixStr, nil);
    self.host = host;
    self.port = port;
    NSError *error = nil;
    if (!self.isSocketConnect) {
        // @"172.17.2.130" onPort:9401
        // 10.10.2.137:9401
//        host = @"8.210.132.211";
//        port = 6666;
        [self.clientSocket connectToHost:host onPort:port withTimeout:timeout error:&error];
        RXLogInfo(prefixStr, @"socket开始连接:%@:%ld",host,(long)port);
    }
}

/**
 * 地址为数组，按顺序调用，连接失败取下一个地址
 */
- (void)connectSocketWithAddrs:(NSArray *)addrs
                       timeout:(NSInteger)timeout
{
    RXLogDebug(prefixStr, nil);
    self.addrs = addrs;
    self.timeout = timeout;
    NSInteger i = self.reConnectCount;
    if (self.reConnectCount > addrs.count - 1) {
        if (addrs.count == 1) {
            i = 0;
        } else {
            return;
        }
    }
    
    NSArray *addArr = [addrs[i] componentsSeparatedByString:@":"];
    RXLogInfo(prefixStr, @"socketaddr:%@,%@",addArr[0],addArr[1]);
    [self connectSocketWithHost:addArr[0] port:[addArr[1] integerValue] timeout:timeout];
}

/**
 * 关闭Socket
 */
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
    self.socketStatus = RXIMSocketOfflineReason_byUser;
    self.isThreadOpen = false;
    [self.mTimer invalidate];
    self.mTimer = nil;
    [self disconnectSocket];
}

/**
 * 重新连接线程
 */
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

/**
 * 重新连接socket
 */
- (void)reConnectTimerStart{
    RXLogDebug(prefixStr, nil);
    @autoreleasepool {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self connectSocketWithAddrs:self.addrs timeout:self.timeout];
        });
    }
}

/**
 * 断开连接socket
 */
- (void)disconnectSocket
{
    RXLogDebug(prefixStr, nil);
    [self.clientSocket disconnect];
}

#pragma mark -- <read && write>
/**
 * 读取数据（收消息）
 * timeout  -1为不限制超时时间
 */
- (void)readData
{
    RXLogDebug(prefixStr, nil);
    [self.clientSocket readDataWithTimeout:-1 tag:self.port];
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

    [self.clientSocket writeData:data withTimeout:-1 tag:msgLocalId];
    [self.clientSocket readDataWithTimeout:-1 tag:msgLocalId];
}

#pragma mark -- <GCDAsyncSocketDelegate>

// 断开连接
- (void)socketDidDisconnect:(GCDAsyncSocket *)sock withError:(NSError *)err
{
    RXLogInfo(prefixStr, @"socket断开连接 %@",err);
    
    if (self.socketStatus == RXIMSocketOfflineReason_byUser) {
        if (self.connectDelegate) {
            [self.connectDelegate socketDisconnect:nil];
        }
    }else{
        self.socketStatus = RXIMSocketOfflineReason_byOther;
        self.reConnectCount++;
        [self socketReConnect];
        if (self.connectDelegate) {
            RXIMError *rxError = [[RXIMError alloc]init];
            rxError.code = IMErrCode_Socket;
            rxError.developerMessage = err.description;
            [self.connectDelegate socketDisconnect:rxError];
        }
    }
    
}

// 连接成功
- (void)socket:(GCDAsyncSocket *)sock didConnectToHost:(NSString *)host port:(uint16_t)port
{
    RXLogInfo(prefixStr, @"socket连接成功 host:%@  port:%hu", host, port);
    self.reConnectCount = 0;
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
    RXLogInfo(prefixStr, @"发送验证消息 = %ld,%ld,%ld",model.messageType,model.commandStack,model.commandId_control);
    
    RXIMMsgFlag *flag = [[RXIMMsgFlag alloc] init];
    flag.isEncrypt = NO;
    flag.hasPayload = YES;
    model.flag = flag;
    
    NSData *connectData = [[RXIMSocketPacket sharedManager] handleSendData:[RXIMMsgHandle getConnectData] model:model needEncrypt:NO];
    
    [self sendData:connectData commandStack:model.commandStack];
}

// 读取数据成功（收消息）
- (void)socket:(GCDAsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag
{
    RXLogDebug(prefixStr, nil);
    NSMutableArray *msgArr = [[RXIMSocketUnpack sharedManager] fetchReceiveMsg:data];
    if (msgArr == nil) {
        [sock readDataWithTimeout:-1 tag:tag];
        return;
    }
    // TODO: 根据类型传tag
    [sock readDataWithTimeout:-1 tag:tag];
    [self didReceiveMessage:msgArr tag:tag];
}

// 写入数据成功（发消息）
- (void)socket:(GCDAsyncSocket *)sock didWriteDataWithTag:(long)tag
{
    RXLogDebug(prefixStr, nil);
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
    
    // 发送心跳消息
    [self.clientSocket writeData:heartData withTimeout:-1 tag:-1000];
    [self.clientSocket readDataWithTimeout:-1 tag:-1000];
}

#pragma mark -- <getters && setters>
- (BOOL)isSocketConnect
{
    RXLogDebug(prefixStr, nil);
    return [self.clientSocket isConnected];
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
