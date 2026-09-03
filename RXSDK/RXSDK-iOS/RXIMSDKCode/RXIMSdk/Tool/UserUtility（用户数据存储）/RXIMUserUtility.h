//
//  RXIMUserUtility.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// - 是否是空对象
#define IsEmpty(_object) (_object == nil \
|| [_object isKindOfClass:[NSNull class]] \
|| ([_object respondsToSelector:@selector(length)] && [(NSData *)_object length] == 0) \
|| ([_object respondsToSelector:@selector(count)] && [(NSArray *)_object count] == 0))

/**
 * 消息类型（服务器）
 */
typedef enum : NSUInteger {
    /** 删除消息 */
    RXIMServerMessageType_deleteMsg = 204,
    /** 删除会话 */
    RXIMServerMessageType_deleteConv = 205,
    /** 消息加急 */
    RXIMServerMessageType_SysMsgUrgent = 206,
    /** 消息扩展字段变更 */
    RXIMServerMessageType_SysMsgUpdate = 207,
} RXIMServerMessageType;

/**
 * 通信类型
 */
typedef enum : NSUInteger {
    RXIMSocketType_socket,
    RXIMSocketType_webSocket,
} RXIMSocketType;

/**
 * 自定义消息子类型定义
 */
typedef enum : NSUInteger {
    LeaveConversation = 100000001,  // 离开会话
    JoinConversation = 100000002,   // 加入会话
    RTCInvite = 100000003,          // 音视频-邀约
    RTCCancel = 100000004,          // 音视频-取消
    RTCReceipt = 100000005,         // 音视频-接受
    RTCRefuse = 100000006,          // 音视频-拒绝
    RTCHangup = 100000007,          // 音视频-挂断
    RTCSwitch = 100000008,          // 音视频-切换
    RTCBlockCall = 100000009,       // 音视频-未连通
} CustomMessageSubType;

@interface RXIMUserUtility : NSObject

@property (nonatomic, copy) NSString *channelId;            // 渠道id
@property (nonatomic, copy) NSString *version;              // sdk版本号
@property (nonatomic, copy) NSString *appId;                // 产品id
@property (nonatomic, copy) NSString *token;                // token
@property (nonatomic, copy) NSString *secret;               // 秘钥
@property (nonatomic, copy) NSString *refreshToken;         // 刷新token
@property (nonatomic, copy) NSString *userId;               // 用户id
@property (nonatomic, copy) NSString *msgTableName;         // 消息表名（userId_appId_msgTable）
@property (nonatomic, copy) NSString *msgFTSTableName;      // FTS消息表名
@property (nonatomic, copy) NSString *msgFTSPinYinTableName;// FTS拼音表名
@property (nonatomic, copy) NSString *sessionTableName;     // 会话表名 会话表名（userId_appId_sessionTable）
@property (nonatomic, copy) NSString *groupInfoTableName;   // 群信息表名（userId_appId_groupInfoTable）
@property (nonatomic, copy) NSString *deviceCode;           // 设备码
@property (nonatomic, copy) NSString *dbBasePath;           // 数据库基地址
@property (nonatomic, copy) NSArray *entryAddress;          //entry地址
@property (nonatomic, assign) NSInteger entryTimeout;       //entry连接超时时间
@property (nonatomic, copy) NSArray *baseUrlList;           // 域名
@property (nonatomic, assign) NSInteger cpid;
@property (nonatomic, copy) NSString *baseUrl;              //服务器域名
@property (nonatomic, copy) NSString *ossUrl;               //oss服务域名
@property (nonatomic, copy) NSString *ossEndpoint;          //oss endpoint
@property (nonatomic, copy) NSString *ossBucketName;        //oss bucketname
@property (nonatomic, copy) NSString *ossDomain;            //oss domain


@property (nonatomic, assign) NSInteger clientType;         // 客户端类型
@property (nonatomic, assign) NSInteger msgLocalId;         // 消息本地id
@property (nonatomic, assign) NSInteger protocolSeqId;      // 协议id
@property (nonatomic, assign) NSInteger PingIntervalMilli;  // 客户端心跳包最大间隔毫秒数, 客户端应采用闲时心跳逻辑
@property (nonatomic, assign) NSInteger discontinuousinboxIddelayMilliTs;   //客户端遇到不连续的 inboxId 时延迟同步的毫秒数，延迟是为了等待中断序号可能因为网络问题晚到到的情况
@property (nonatomic, assign) NSInteger baseUrlCount;       // 当前使用的域名位置
@property (nonatomic, assign) NSInteger frontinboxId;       // 上一个消息同步序列号
@property (nonatomic, assign) NSInteger startInboxId;       // 同步的起始id
@property (nonatomic, assign) NSInteger endInboxId;         // 同步结束id
@property (nonatomic, assign) NSInteger maxInboxId;         // 本地最大的inboxid,保存到本地
@property (nonatomic, assign) BOOL isNetwork;               // 是否有网络
@property (nonatomic, assign) RXIMSocketType socketType;    // socket类型
@property (nonatomic,strong) NSMutableArray *serverCovListArr; // 服务器会话列表
@property (nonatomic, assign) BOOL isBusiness;              // 是否支持业务会话
+ (instancetype)sharedManager;

@end

NS_ASSUME_NONNULL_END
