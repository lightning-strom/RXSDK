//
//  RXWebSocket.m
//  test
//
//  Created by 陈汉 on 2023/11/17.
//

#import "RXWebSocket.h"
#import "SocketRocket.h"
#import "RXCommonHeader.h"
#import "RXLogService.h"
#import "RXBDAManager.h"

@interface RXWebSocket () <SRWebSocketDelegate>

@property (nonatomic, strong) NSString *host;
@property (nonatomic, assign) NSInteger reConnectCount;         // 重连次数
@property (nonatomic, assign) NSInteger maxReConnectCount;      // 最大重连次数
@property (nonatomic, strong) SRWebSocket *webSocket;
@property (nonatomic, strong) NSThread *checkThread;             // 子线程用于监听心跳包
@property (nonatomic, strong) dispatch_source_t connectTimer;   // GCDTimer
@property (nonatomic, assign) BOOL isThreadOpen;                // 心跳线程是否开启
@property (nonatomic, strong) dispatch_queue_t connectQueue;    // 线程

@property (nonatomic, strong) NSTimer *mTimer;
@property (nonatomic, assign) NSInteger testCount;

@end

@implementation RXWebSocket

static RXWebSocket *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXWebSocket alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.reConnectCount = 0;
        self.maxReConnectCount = 100;
    }
    return self;
}

#pragma mark - 连接socket
- (void)connectSocketWithHost:(NSString *)host port:(NSInteger)port timeout:(NSInteger)timeout
{
    self.host = host;
    [self.webSocket close];
    self.webSocket.delegate = nil;
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:host]];
    NSMutableDictionary *headers = [RX_CommonNetworkExcuteManager headParams];
    for (int i = 0; i < headers.allKeys.count; i++) {
        [request setValue:headers.allValues[i] forHTTPHeaderField:headers.allKeys[i]];
    }
    self.webSocket = [[SRWebSocket alloc] initWithURLRequest:request];
    self.webSocket.delegate = self;
    [self.webSocket open];
    NSLog(@"socket开始连接 %@", host);
}

#pragma mark - 地址为数组，按顺序调用，连接失败取下一个地址
- (void)connectSocketWithAddrs:(NSArray *)addrs timeout:(NSInteger)timeout
{
    self.addrs = addrs;
    NSInteger i = self.reConnectCount;
    if (self.reConnectCount > addrs.count - 1) {
        // 上报连接失败
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        if ([RXUserUtility sharedManager].wsList.count > 0) {
            [trackDic setValue:[RXUserUtility sharedManager].wsList forKey:@"wsList"];
        }
        
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_ws_fail distinctId:@"" properties:trackDic];
        
        if (addrs.count == 1) {
            i = 0;
        } else {
            return;
        }
    }
    NSLog(@"socket开始连接:%@", addrs[i]);
    [self connectSocketWithHost:self.host port:0 timeout:0];
}

#pragma mark - 关闭Socket
- (void)closeSocket
{
    if(self.connectTimer != nil)
    {
        dispatch_source_cancel(self.connectTimer);
        self.connectTimer = nil;
    }
    [self.checkThread cancel];
    self.checkThread = nil;
    self.isThreadOpen = false;
//    self.socketStatus = RXIMSocketOfflineReason_byUser;
    [self.mTimer invalidate];
    self.mTimer = nil;
    [self disconnectSocket];
}

#pragma mark - 断开连接socket
- (void)disconnectSocket
{
    [self.webSocket close];
}

#pragma mark - 重新连接线程
- (void)socketReConnect
{
    NSLog(@"socket重新连接");
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
    dispatch_time_t start = dispatch_time(DISPATCH_TIME_NOW, 5.0 * NSEC_PER_SEC);
    //间隔时间
    uint64_t interval = NSEC_PER_SEC * 5.0;
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
    @autoreleasepool {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self connectSocketWithAddrs:self.addrs timeout:0];
        });
    }
}

/**
 * 写入数据（发消息）data
 */
- (void)sendData:(NSData *)data
{
    NSError *error;
    [self.webSocket sendData:data error:&error];
}

#pragma mark -- <timerAction>
- (void)openHeartThread
{
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
    @autoreleasepool {
        self.mTimer = [NSTimer scheduledTimerWithTimeInterval:5 target:self selector:@selector(heartBeat) userInfo:nil repeats:YES];
        [[NSRunLoop currentRunLoop] run];
    }
}

- (void)heartBeat{
//    NSLog(@"发送心跳消息");
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(1000) forKey:@"msg_type"];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
    
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    jsonString = [jsonString stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSError *error;
    [self.webSocket sendString:jsonString error:&error];
}

// 发送确认消息
- (void)sendAck
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(99) forKey:@"msg_type"];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
    
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    jsonString = [jsonString stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSError *error;
    [self.webSocket sendString:jsonString error:&error];
}

#pragma mark -- <SRWebSocketDelegate>
- (void)webSocketDidOpen:(SRWebSocket *)webSocket{
    self.reConnectCount = 0;
    NSLog(@"socket连接成功");
    if(self.connectTimer != nil) {
        dispatch_source_cancel(self.connectTimer);
        self.connectTimer = nil;
    }
    if (self.connectQueue) {
        self.connectQueue = nil;
    }
    
    [self openHeartThread];
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error{
    NSLog(@"socket断开连接 %@",error);
    self.reConnectCount++;
    [self socketReConnect];
}

// 接收消息
- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message{
    
    @try {
        NSMutableData *jsonData = [NSMutableData dataWithData:message];
        NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
        
        if ([dictionary isKindOfClass:[NSDictionary class]] && dictionary.allKeys.count > 0) {
            NSInteger msg_type = [dictionary[@"msg_type"] integerValue];
            NSString *uuid = [NSString stringWithFormat:@"%@", dictionary[@"uuid"]];
            
            // 心跳消息不处理
            if (msg_type == 1000) {
                return;
            }
            
            /**
             * 获取上一次的 uuid 和本次 uuid 做对比，一致则不处理
             */
            NSString *lastUuid = [RXUserUtility valueForKey:keyUserData_socketUUID];
            
            if ([lastUuid isEqualToString:uuid]) {
                NSLog(@"uuid 一致，不处理  %@", dictionary);
                [self sendAck];
                return;
            }
            
            if (msg_type == 1000) { // 心跳消息
                
            } else if (msg_type == -1) { // 断开连接
                NSLog(@"接收消息--断开连接 %@", dictionary);
                [self.webSocket close];
            } else if (msg_type == 1) {
                [[RXBDAManager sharedSDK] ws_trackEssentialEventWithNameWithInfo:dictionary[@"body"] uuid:uuid];
            } else {
                NSLog(@"接收消息 %@", dictionary);
            }
        }
    } @catch (NSException *exception) {
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        if ([RXUserUtility sharedManager].wsList.count > 0) {
            [trackDic setValue:[RXUserUtility sharedManager].wsList forKey:@"wsList"];
        }
        [trackDic setValue:@"数据格式有误" forKey:@"msg"];
        
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_ws_fail distinctId:@"" properties:trackDic];
    } @finally {
        
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean{
    NSLog(@"socket被关闭 code %ld",code);
    if (code == SRStatusCodeNormal) {

    }else{
        self.reConnectCount++;
        [self socketReConnect];
//        }
    }
    
}

- (void)webSocket:(SRWebSocket *)webSocket didReceivePong:(NSData *)pongPayload{
//    [RXIMWebSocket shareManager].receive ? [RXIMWebSocket shareManager].receive(pongPayload,FLSocketReceiveTypeForPong) : nil;
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithString:(NSString *)string
{
    
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithData:(NSData *)data
{
    
}

- (void)webSocket:(SRWebSocket *)webSocket didReceivePingWithData:(NSData *)data
{
    
}

- (BOOL)webSocketShouldConvertTextFrameToString:(SRWebSocket *)webSocket
{
    return YES;
}

#pragma mark -- <lazzys>
- (BOOL)isSocketConnect
{
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
