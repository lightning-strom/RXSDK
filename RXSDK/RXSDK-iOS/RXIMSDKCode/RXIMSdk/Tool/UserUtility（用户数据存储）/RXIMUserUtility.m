//
//  RXIMUserUtility.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMUserUtility.h"

static NSString *const rxIMKey_appId = @"rxIMKey_appId";
static NSString *const rxIMKey_channelId = @"rxIMKey_channelId";
static NSString *const rxIMKey_cpId = @"rxIMKey_cpId";
static NSString *const rxIMKey_version = @"rxIMKey_version";
static NSString *const rxIMKey_baseUrl = @"rxIMKey_baseUrl";
static NSString *const rxIMKey_ossUrl = @"rxIMKey_ossUrl";
static NSString *const rxIMKey_ossEndpoint = @"rxIMKey_ossEndpoint";
static NSString *const rxIMKey_ossBucketName = @"rxIMKey_ossBucketName";

static NSString *const rxIMUserKey_entryAddress = @"rxIMUserKey_entryAddress";
static NSString *const rxIMUserKey_entryTimeout = @"rxIMUserKey_entryTimeout";
static NSString *const rxIMUserKey_token = @"rxIMUserKey_token";
static NSString *const rxIMUserKey_secret = @"rxIMUserKey_secret";
static NSString *const rxIMUserKey_refreshToken = @"rxIMUserKey_refreshToken";
static NSString *const rxIMUserKey_userId = @"rxIMUserKey_userId";
static NSString *const rxIMUserKey_msgTableName = @"rxIMUserKey_msgTableName";
static NSString *const rxIMUserKey_msgFTSTableName = @"rxIMUserKey_msgFTSTableName";
static NSString *const rxIMUserKey_sessionTableName = @"rxIMUserKey_sessionTableName";
static NSString *const rxIMUserKey_groupInfoTableName = @"rxIMUserKey_groupInfoTableName";
static NSString *const rxIMUserKey_msgLoacalId = @"rxIMUserKey_msgLoacalId";
static NSString *const rxIMUserKey_deviceCode = @"rxIMUserKey_deviceCode";
static NSString *const rxIMUserKey_localInboxId = @"rxIMUserKey_localInboxId";
static NSString *const rxIMUserKey_clientType = @"rxIMUserKey_clientType";
static NSString *const rxIMUserKey_snapChatTimeout = @"rxIMUserKey_snapChatTimeout";
static NSString *const rxIMUserKey_isBusiness = @"rxIMUserKey_isBusiness";

@implementation RXIMUserUtility

+ (instancetype)sharedManager
{
    static RXIMUserUtility *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXIMUserUtility alloc] init];
    });
    return manager;
}

/** entry 地址 */

- (void)setEntryAddress:(NSArray *)entryAddress
{
    [[NSUserDefaults standardUserDefaults] setValue:entryAddress forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_entryAddress, [RXIMUserUtility sharedManager].userId]];
}

- (NSArray *)entryAddress
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_entryAddress, [RXIMUserUtility sharedManager].userId]];
}

/** entry连接超时时间 */
- (void)setEntryTimeout:(NSInteger)entryTimeout
{
    [[NSUserDefaults standardUserDefaults] setInteger:entryTimeout forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_entryTimeout, [RXIMUserUtility sharedManager].userId]];
}

- (NSInteger)entryTimeout
{
    return [[NSUserDefaults standardUserDefaults] integerForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_entryTimeout, [RXIMUserUtility sharedManager].userId]];
}

/** token */

- (void)setToken:(NSString *)token
{
    [[NSUserDefaults standardUserDefaults] setValue:token forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_token, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)token
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_token, [RXIMUserUtility sharedManager].userId]] ? [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_token, [RXIMUserUtility sharedManager].userId]] : @"";
}

/** secret */
- (void)setSecret:(NSString *)secret
{
    [[NSUserDefaults standardUserDefaults] setValue:secret forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_secret, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)secret
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_secret, [RXIMUserUtility sharedManager].userId]];
}

/** refreshToken */
- (void)setRefreshToken:(NSString *)refreshToken
{
    [[NSUserDefaults standardUserDefaults] setValue:refreshToken forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_refreshToken, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)refreshToken
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_refreshToken, [RXIMUserUtility sharedManager].userId]];
}

/** appId */
- (void)setAppId:(NSString *)appId
{
    [[NSUserDefaults standardUserDefaults] setValue:appId forKey:rxIMKey_appId];
}

- (NSString *)appId
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_appId] ? [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_appId] : @"";
}

/** 保存channelId */
- (void)setChannelId:(NSString *)channelId
{
    [[NSUserDefaults standardUserDefaults] setValue:channelId forKey:rxIMKey_channelId];
}

- (NSString *)channelId
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_channelId] ? [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_channelId] : @"";
}

- (void)setCpid:(NSInteger)cpid
{
    [[NSUserDefaults standardUserDefaults] setInteger:cpid forKey:rxIMKey_cpId];
}

- (NSInteger)cpid
{
    return [[NSUserDefaults standardUserDefaults] integerForKey:rxIMKey_cpId];
}

/** appId */
- (void)setVersion:(NSString *)version
{
    [[NSUserDefaults standardUserDefaults] setValue:version forKey:rxIMKey_version];
}

- (NSString *)version
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_version] ? [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_version] : @"";
}

/** userId */
- (void)setUserId:(NSString *)userId
{
    [[NSUserDefaults standardUserDefaults] setValue:userId forKey:rxIMUserKey_userId];
}

- (NSString *)userId
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMUserKey_userId] ? [[NSUserDefaults standardUserDefaults] valueForKey:rxIMUserKey_userId] : @"";
}

- (void)setBaseUrl:(NSString *)baseUrl
{
    [[NSUserDefaults standardUserDefaults] setValue:baseUrl forKey:rxIMKey_baseUrl];
}

- (NSString *)baseUrl
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_baseUrl] ? [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_baseUrl] : @"";
}

- (void)setOssUrl:(NSString *)ossUrl
{
    [[NSUserDefaults standardUserDefaults] setValue:ossUrl forKey:rxIMKey_ossUrl];
}

- (NSString *)ossUrl
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_ossUrl];
}

- (void)setOssEndpoint:(NSString *)ossEndpoint
{
    [[NSUserDefaults standardUserDefaults] setValue:ossEndpoint forKey:rxIMKey_ossEndpoint];
}

- (NSString *)ossEndpoint
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_ossEndpoint];
}

- (void)setOssBucketName:(NSString *)ossBucketName
{
    [[NSUserDefaults standardUserDefaults] setValue:ossBucketName forKey:rxIMKey_ossBucketName];
}

- (NSString *)ossBucketName
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxIMKey_ossBucketName];
}

- (void)setMsgTableName:(NSString *)msgTableName
{
    [[NSUserDefaults standardUserDefaults] setValue:msgTableName forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgTableName, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)msgTableName
{
    NSString *tableName = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgTableName, [RXIMUserUtility sharedManager].userId]];
    if (tableName && tableName.length > 0) {
        return tableName;
    } else {
        NSString * str = [NSString stringWithFormat:@"msg_all_%@",[RXIMUserUtility sharedManager].userId];
        return str;
    }
}

/** msgFTSTableName */
- (void)setMsgFTSTableName:(NSString *)msgFTSTableName
{
    [[NSUserDefaults standardUserDefaults] setValue:msgFTSTableName forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgFTSTableName, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)msgFTSTableName
{
    NSString *tableName = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgFTSTableName, [RXIMUserUtility sharedManager].userId]];
    if (tableName && tableName.length > 0) {
        return tableName;
    } else {
        return [NSString stringWithFormat:@"msgFTS_all_%@",[RXIMUserUtility sharedManager].userId];
    }
}


- (void)setmsgFTSPinYinTableName:(NSString *)msgFTSPinYinTableName
{
    [[NSUserDefaults standardUserDefaults] setValue:msgFTSPinYinTableName forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgFTSTableName, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)msgFTSPinYinTableName
{
    NSString *tableName = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgFTSTableName, [RXIMUserUtility sharedManager].userId]];
    if (tableName && tableName.length > 0) {
        return tableName;
    } else {
        return [NSString stringWithFormat:@"msgFTSPinYin_all_%@",[RXIMUserUtility sharedManager].userId];
    }
}


/** sessionTableName */
- (void)setSessionTableName:(NSString *)sessionTableName
{
    [[NSUserDefaults standardUserDefaults] setValue:sessionTableName forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_sessionTableName, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)sessionTableName
{
    NSString *tableName = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_sessionTableName, [RXIMUserUtility sharedManager].userId]];
    if (tableName && tableName.length > 0) {
        return tableName;
    } else {
        return [NSString stringWithFormat:@"session_all_%@",[RXIMUserUtility sharedManager].userId];
    }
}

// 保存群信息表名
- (void)setGroupInfoTableName:(NSString *)groupInfoTableName
{
    [[NSUserDefaults standardUserDefaults] setValue:groupInfoTableName forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_groupInfoTableName, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)groupInfoTableName
{
    NSString *tableName = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_groupInfoTableName, [RXIMUserUtility sharedManager].userId]];
    if (tableName && tableName.length > 0) {
        return tableName;
    } else {
        return [NSString stringWithFormat:@"%@_%@_groupInfoTable", [RXIMUserUtility sharedManager].appId, [RXIMUserUtility sharedManager].userId];
    }
}

/** msgLoaclId */
- (void)setMsgLocalId:(NSInteger)msgLocalId
{
    [[NSUserDefaults standardUserDefaults] setInteger:msgLocalId forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgLoacalId, [RXIMUserUtility sharedManager].userId]];
}

- (NSInteger)msgLocalId
{
    return [[NSUserDefaults standardUserDefaults] integerForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_msgLoacalId, [RXIMUserUtility sharedManager].userId]];
}

- (void)setMaxInboxId:(NSInteger)maxInboxId
{
    [[NSUserDefaults standardUserDefaults] setInteger:maxInboxId forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_localInboxId, [RXIMUserUtility sharedManager].userId]];
}

- (NSInteger)maxInboxId
{
    return [[NSUserDefaults standardUserDefaults] integerForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_localInboxId, [RXIMUserUtility sharedManager].userId]];
}

/** deviceCode */
- (void)setDeviceCode:(NSString *)deviceCode
{
    [[NSUserDefaults standardUserDefaults] setValue:deviceCode forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_deviceCode, [RXIMUserUtility sharedManager].userId]];
}

- (NSString *)deviceCode
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_deviceCode, [RXIMUserUtility sharedManager].userId]];
}

/** clientType */
- (void)setClientType:(NSInteger)clientType
{
    [[NSUserDefaults standardUserDefaults] setInteger:clientType forKey:rxIMUserKey_clientType];
}

- (NSInteger)clientType
{
    return [[NSUserDefaults standardUserDefaults] integerForKey:rxIMUserKey_clientType];
}

- (BOOL)isBusiness
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_isBusiness, [RXIMUserUtility sharedManager].userId]];
}

- (void)setIsBusiness:(BOOL)isBusiness
{
    [[NSUserDefaults standardUserDefaults] setBool:isBusiness forKey:[NSString stringWithFormat:@"%@_%@", rxIMUserKey_isBusiness, [RXIMUserUtility sharedManager].userId]];
}

@end
