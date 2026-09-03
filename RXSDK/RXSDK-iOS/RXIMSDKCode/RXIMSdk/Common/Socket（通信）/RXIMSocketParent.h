//
//  RXIMSocketParent.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/11/19.
//

#import <Foundation/Foundation.h>
#import "RXIMMsgModel.h"
#import "RXIMMessageIMS.h"
#import "RXIMSession.h"
#import "RXIMError.h"
#import "RXIMUserUtility.h"
#import "RXIMSocketUnpack.h"
#import "RXIMDisconnectHandle.h"
#import "RXIMLogManager.h"
#import "RXIMMsgHandle.h"
#import "RXModelTransform.h"
#import "RXIMMsgContinuityHandle.h"
#import "RXIMInternalManager.h"
#import "RXIMErrorCode.h"
#import "RXIMSocketPacket.h"
#import "RXIMCommonDevice.h"

NS_ASSUME_NONNULL_BEGIN

/** socket断开原因 */
typedef enum : NSUInteger {
    /** 被其他断连（服务器关闭或者断网）*/
    RXIMSocketOfflineReason_byOther = 1,
    /** 被用户关闭 */
    RXIMSocketOfflineReason_byUser,
} RXIMSocketOfflineReason;

@protocol RXIMSocketInternalDelegate <NSObject>
@optional
/**
 * soket连接成功响应
 */
-(void)socketConnectSuccess;

/**
 * soket断开响应
 */
-(void)socketDisconnect:(RXIMError * _Nullable)error;
/**
 * 消息接收
 */
- (void)socketReceiveMessage:(NSArray *)msgs;

/**
 * 事件接收
 */
- (void)socketReceiveEvent:(RXIMMsgModel *)data tag:(NSInteger)tag;

/**
 * 消息发送成功
 */
- (void)socketSendMessageSuccess:(RXIMMsgModel *)data tag:(NSInteger)tag;

/**
 * 消息发送失败
 */
- (void)socketSendMessageFailure:(RXIMMsgModel *)data tag:(NSInteger)tag;

/**
 * 获取同步消息
 */
-(void)socketSyncMsgResp:(RXIMMsgModel *)data tag:(NSInteger)tag;

/**
 * 获取历史消息
 */
-(void)socketHistoryMsgResp:(RXIMMsgModel *)data tag:(NSInteger)tag;

@end


@interface RXIMSocketParent : NSObject

@property (nonatomic, weak) id <RXIMSocketInternalDelegate> msgDelegate;
@property (nonatomic, weak) id <RXIMSocketInternalDelegate> sessionDelegate;
@property (nonatomic, weak) id <RXIMSocketInternalDelegate> sessionDelegate_business;
@property (nonatomic, weak) id <RXIMSocketInternalDelegate> groupDelegate;
@property (nonatomic, weak) id <RXIMSocketInternalDelegate> connectDelegate;

@property (nonatomic, assign) BOOL isSocketConnect;             // socket是否连接
@property (nonatomic, assign) NSInteger reConnectCount;         // 重连次数
@property (nonatomic, assign) RXIMSocketOfflineReason socketStatus;    // socket状态
@property (nonatomic, copy) NSString *host;
@property (nonatomic, assign) NSInteger port;
@property (nonatomic, assign) NSInteger timeout;
@property (nonatomic, strong) NSArray *addrs;

@property (nonatomic, assign) NSInteger maxReConnectCount;      // 最大重连次数
@property (nonatomic, strong) dispatch_source_t connectTimer;   // GCDTimer
@property (nonatomic, strong) dispatch_queue_t connectQueue;    // 线程
@property (nonatomic, strong) NSMutableData *dataBuffer;        // 数据缓冲（处理粘包）
@property (nonatomic, assign) BOOL isThreadOpen;                // 心跳线程是否开启
@property (nonatomic, strong) NSTimer *mTimer;

+ (instancetype)sharedSDK;

/**
 * 连接socket
 * @param host 地址
 * @param port 端口
 * @param timeout 超时时间（秒）
 */
- (void)connectSocketWithHost:(NSString *)host
                         port:(NSInteger)port
                      timeout:(NSInteger)timeout;
/**
 * 地址为数组，按顺序调用，连接失败取下一个地址
 */
- (void)connectSocketWithAddrs:(NSArray *)addrs
                       timeout:(NSInteger)timeout;

/**
 * 关闭Socket
 */
- (void)closeSocket;

/**
 * 写入数据（发消息）
 * timeout  -1为不限制超时时间
 * tag 消息标记
 * commandStack 消息类型，非msg消息不需要回调
 */
- (void)sendData:(NSData *)data commandStack:(CommandStack)commandStack;

/**
 * 开启心跳消息线程
 */
- (void)openHeartThread;

/**
 * 接收消息处理
 */
-(void)didReceiveMessage:(NSArray *)msgArr tag:(NSInteger)tag;

/**
 * 网络监听
 */
-(void)networkMonitoring;

@end

NS_ASSUME_NONNULL_END
