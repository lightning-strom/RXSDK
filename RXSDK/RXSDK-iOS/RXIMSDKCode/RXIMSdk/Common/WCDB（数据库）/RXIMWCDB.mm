//
//  RXIMWCDB.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/3/10.
//

#import "RXIMWCDB.h"
#import "RXIMMessageDB+WCTTableCoding.h"
#import "RXIMMessageFTS+WCTTableCoding.h"
#import "RXIMMessageFTSPinYin+WCTTableCoding.h"
#import "RXIMSessionDB+WCTTableCoding.h"
#import "RXIMUserUtility.h"
#import <WCDB/WCDB.h>
#import "RXModelTransform.h"
#import "NSObject+RXUAddition.h"
#import "RXIMMsgTextContent.h"
#import "RXIMMsgFaceContent.h"
#import "RXIMMsgImageContent.h"
#import "RXIMCommonTool.h"
#import "RXIMLogManager.h"
#import "RXIMGroupMember.h"
#import "RXIMMsgReplyContent.h"
#import "RXIMMessageFTS.h"
#import "RXIMMessageFTSPinYin.h"



//@interface RXIMWCDB()

//@property (nonatomic,strong) WCTDatabase *databaseOrigin;

//@end

@implementation RXIMWCDB

static RXIMWCDB *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMWCDB alloc] init];
    });
    return sharedSDK;
}

-(NSString *)getOriginPath
{
    NSString *RXIMSDKPath = [RXIMUserUtility sharedManager].dbBasePath;
    if (RXIMSDKPath == nil) {
        NSArray *path = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *baseDirectory = [path objectAtIndex:0];
        RXIMSDKPath = [baseDirectory stringByAppendingPathComponent:@"RXIMSDK"];
    }
    NSString *pathOrigin = [RXIMSDKPath stringByAppendingPathComponent:@"ruixueim.db"];
    return pathOrigin;
}

#pragma mark - 判断数据库是否存在
-(BOOL)isExistDB
{
    NSString *pathOrigin = [self getOriginPath];

    BOOL isExist = [[NSFileManager defaultManager] fileExistsAtPath:pathOrigin];
    if (isExist) {
        self.databaseOrigin = [[WCTDatabase alloc] initWithPath:pathOrigin];
    }

    return isExist;
}

#pragma mark - 创建库
-(void)createDB
{
    [self createOriginDB];
    
#ifdef DEBUG
    //全局监控错误

//    [WCTStatistics SetGlobalErrorReport:^(WCTError *error) {
////        RXLogError(prefixStr, @"[wcdb error] %@",error);
//        NSLog(@"[wcdb error] %@",error);
//    }];

    [WCTDatabase globalTraceError:^(WCTError *error) {
        assert(error.level != WCTErrorLevelFatal);
        NSLog(@"%@", error);;
    }];

//
//    //全局监控耗时
//    [WCTStatistics SetGlobalPerformanceTrace:^(WCTTag tag, NSDictionary<NSString *, NSNumber *> *sqls, NSInteger cost) {
//        RXLogInfo(prefixStr, @"[wcdb trace] tag = %ld",tag);
//        [sqls enumerateKeysAndObjectsUsingBlock:^(NSString *sql, NSNumber *count, BOOL *) {
//            RXLogInfo(prefixStr,@"[wcdb trace] SQL: %@ Count: %d", sql, count.intValue);
//        }];
//        RXLogInfo(prefixStr, @"[wcdb trace] Total cost %ld nanoseconds", (long) cost);
//    }];
//    [WCTStatistics SetGlobalSQLTrace:^(NSString *sql) {
//        NSLog(@"SQL: %@", sql);
//    }];
#else
    
#endif
    
}

#pragma mark - 关闭数据库
-(void)closeDB
{
    [self.databaseOrigin close];
}

#pragma mark - 初始化消息和会话数据库
-(void)createOriginDB
{
    NSString *pathOrigin = [self getOriginPath];

    self.databaseOrigin = [[WCTDatabase alloc] initWithPath:pathOrigin];
    //数据库加密
//    NSData *password = [@"MyPassword" dataUsingEncoding:NSASCIIStringEncoding];
//    [self.databaseOrigin setCipherKey:password];
//
//    [self.databaseOrigin close:^{
//      [self.databaseOrigin removeFilesWithError:nil];
//    }];
    BOOL res = NO;
    //创建消息表
    if (![self.databaseOrigin tableExists:[RXIMUserUtility sharedManager].msgTableName]) {
        res = [self.databaseOrigin createTable:[RXIMUserUtility sharedManager].msgTableName withClass:RXIMMessageDB.class];
        if (!res){
            NSLog(@"创建数据库msgTableName失败 表名%@",[RXIMUserUtility sharedManager].msgTableName);
        }else{
            NSLog(@"创建数据库msgTableName成功 表名%@",[RXIMUserUtility sharedManager].msgTableName);
        }
    }
    
    if (![self.databaseOrigin tableExists:[RXIMUserUtility sharedManager].sessionTableName]) {
        res = [self.databaseOrigin createTable:[RXIMUserUtility sharedManager].sessionTableName withClass:RXIMSessionDB.class];
        if (!res){
            NSLog(@"创建数据库sessionTableName失败 表名%@",[RXIMUserUtility sharedManager].sessionTableName);
        }else{
            NSLog(@"创建数据库sessionTableName成功 表名%@",[RXIMUserUtility sharedManager].sessionTableName);
        }
    }
    
    // 创建 FTS 表
    if (![self.databaseOrigin tableExists:[RXIMUserUtility sharedManager].msgFTSTableName]) {
        [self.databaseOrigin addTokenizer:WCTTokenizerVerbatim];
        res = [self.databaseOrigin createVirtualTable:[RXIMUserUtility sharedManager].msgFTSTableName withClass:RXIMMessageFTS.class];
        if (!res){
            NSLog(@"创建数据库msgFTSTableName失败 表名%@",[RXIMUserUtility sharedManager].msgFTSTableName);
        }else{
            NSLog(@"创建数据库msgFTSTableName成功 表名%@",[RXIMUserUtility sharedManager].msgFTSTableName);
        }
    }
    
    // 创建 FTS 拼音表
  
    if (![self.databaseOrigin tableExists:[RXIMUserUtility sharedManager].msgFTSPinYinTableName]) {
       
        [WCTDatabase configPinYinDict:@{
            @"单" : @[ @"shan", @"dan", @"chan" ],
            @"于" : @[ @"yu" ],
            @"骑" : @[ @"qi" ],
            @"模" : @[ @"mo", @"mu" ],
            @"具" : @[ @"ju" ],
            @"车" : @[ @"che" ],
        }];
        
        [self.databaseOrigin addTokenizer:WCTTokenizerPinyin];
        res = [self.databaseOrigin createVirtualTable:[RXIMUserUtility sharedManager].msgFTSTableName withClass:RXIMMessageFTSPinYin.class];
        if (!res){
            NSLog(@"创建数据库msgFTSPinYinTableName失败 表名%@",[RXIMUserUtility sharedManager].msgFTSPinYinTableName);
        }else{
            NSLog(@"创建数据库msgFTSPinYinTableName成功 表名%@",[RXIMUserUtility sharedManager].msgFTSPinYinTableName);
        }
    }
    
}

#pragma mark - ========== 数据库操作 ==========

#pragma mark - 判断消息是否存在
-(BOOL)isExistMsg:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    RXIMMessageDB *message = [self.databaseOrigin getOneObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.msgId == msgId];
    RXIMMessageDB *message = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.msgId == msgId];
    if (message) {
        return YES;
    }else{
        return NO;
    }
}

#pragma mark - ====== 增 ======
#pragma mark - 插入单条消息
/// <#Description#>
/// - Parameter message: message description
-(BOOL)insertMsg:(RXIMMessage *)message
{
    if (message == nil) {
        return NO;
    }
        
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *msgDB = [RXModelTransform msgToMsgDB:message];
//    BOOL res = [self.databaseOrigin insertObject:msgDB into:msgTableName];
    BOOL res = [self.databaseOrigin insertObject:msgDB intoTable:msgTableName];

    NSLog(@"插入数据 msgid: %@", msgDB.localId);

    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    RXIMMessageFTS *ftsEntry = [[RXIMMessageFTS alloc]initWithMessageDB:msgDB];
    BOOL ress = [self.databaseOrigin insertObject:ftsEntry intoTable:ftsTableName];
    if (!ress) {
        NSLog(@"Failed to insert into FTS table: %@", ftsTableName);
    }
    
    
//    NSString *ftsPinYinTableName = [RXIMUserUtility sharedManager].msgFTSPinYinTableName;
//    RXIMMessageFTSPinYin *ftsPinYinEntry = [[RXIMMessageFTSPinYin alloc]init];
//    ftsPinYinEntry.sessionID = msgDB.sessionID;
//    ftsPinYinEntry.msgId = msgDB.msgId;
//    ftsPinYinEntry.pinYin = [self convertToPinyin:msgDB.contentStr];
//    BOOL resss = [self.databaseOrigin insertObject:ftsPinYinEntry intoTable:ftsPinYinTableName];
//    if (!resss) {
//        NSLog(@"Failed to insert into FTSPinYin table: %@", ftsTableName);
//    }
    
    return res;
}

//-(NSString*)convertToPinyin:(NSString*)string{
//    NSMutableString *mutableString = [NSMutableString stringWithString:string];
//    CFStringTransform((__bridge CFMutableStringRef)mutableString, NULL, kCFStringTransformToLatin, NO);
//    CFStringTransform((__bridge CFMutableStringRef)mutableString, NULL, kCFStringTransformStripCombiningMarks, NO);
//    return mutableString;
//}

#pragma mark - 插入多条消息
-(BOOL)insertMsgs:(NSArray<RXIMMessage *> *)messages
{
    if (messages == nil) {
        return NO;
    }
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    NSMutableArray *msgFTSArr = [NSMutableArray array];
    
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    NSMutableArray *msgDBArr = [NSMutableArray array];
    [messages enumerateObjectsUsingBlock:^(RXIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMMessageDB *msgDB = [RXModelTransform msgToMsgDB:obj];
        [msgDBArr addObject:msgDB];
        
        RXIMMessageFTS *ftsEntry = [[RXIMMessageFTS alloc] initWithMessageDB:msgDB];
        [msgFTSArr addObject:ftsEntry];
    }];
//    BOOL res = [self.databaseOrigin insertOrReplaceObjects:msgDBArr into:msgTableName];
    BOOL res = [self.databaseOrigin insertOrReplaceObjects:msgDBArr intoTable:msgTableName];

//    BOOL ress = [self.databaseFTS insertOrReplaceObjects:msgFTSArr intoTable:ftsTableName];
//    if (!ress){
//        
//    }

    return res;
}

#pragma mark - 插入单个会话
-(BOOL)insertSession:(RXIMSession *)session
{
    if (session == nil) {
        return NO;
    }
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [RXModelTransform sessionTosessionDB:session];
//    RXIMSessionDB *oldSessionDB = [self.databaseOrigin getOneObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == session.sessionID];
    RXIMSessionDB *oldSessionDB = [self.databaseOrigin getObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == session.sessionID];

    if (oldSessionDB) {
        sessionDB.lastMessage = oldSessionDB.lastMessage;
    }
//    BOOL res = [self.databaseOrigin insertOrReplaceObject:sessionDB into:sessionTableName];
    BOOL res = [self.databaseOrigin insertOrReplaceObject:sessionDB intoTable:sessionTableName];

    return res;
}

#pragma mark - 批量插入会话
-(BOOL)insertSessions:(NSArray<RXIMSession *> *)sessions
{
    if (sessions == nil) {
        return NO;
    }
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    NSMutableArray *sessionsDB = [NSMutableArray array];
    [sessions enumerateObjectsUsingBlock:^(RXIMSession * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMSessionDB *sessionDB = [RXModelTransform sessionTosessionDB:obj];
//        RXIMSessionDB *oldSessionDB = [self.databaseOrigin getOneObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == obj.sessionID];
        RXIMSessionDB *oldSessionDB = [self.databaseOrigin getObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == obj.sessionID];

        if (oldSessionDB) {
            sessionDB.lastMessage = oldSessionDB.lastMessage;
        }
        [sessionsDB addObject:sessionDB];
    }];
    
//    BOOL res = [self.databaseOrigin insertOrReplaceObjects:sessionsDB into:sessionTableName];
    BOOL res = [self.databaseOrigin insertOrReplaceObjects:sessionsDB intoTable:sessionTableName];

    return res;
}

#pragma mark - ====== 删 ======
#pragma mark - 删除单条消息
-(BOOL)deleteMsgWithMsgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:msgTableName where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin deleteFromTable:msgTableName where:RXIMMessageDB.msgId == msgId];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.msgId == msgId];
    if (!ress){
        NSLog(@"虚表数据删除失败，msgid = %@",msgId);
        
    }
    return res;
}

#pragma mark - 删除单条消息
-(BOOL)deleteMsgWithLocalId:(NSString *)localId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:msgTableName where:RXIMMessageDB.localId == localId];
    BOOL res = [self.databaseOrigin deleteFromTable:msgTableName where:RXIMMessageDB.localId == localId];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.localId == localId];
    if (!ress){
        NSLog(@"虚表数据删除失败，localId = %@",localId);
    }
    return res;
}

#pragma mark - 删除某个会话消息
-(BOOL)deleteMsgsWithTarget:(NSString *)target
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:msgTableName where:RXIMMessageDB.sessionID == target];
    BOOL res = [self.databaseOrigin deleteFromTable:msgTableName where:RXIMMessageDB.sessionID == target];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.sessionID == target];
    if (!ress){
        NSLog(@"虚表数据删除失败，target = %@",target);
    }
    return res;
}

#pragma mark - 删除某个会话
-(BOOL)deleteSessionWithTarget:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin deleteFromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.sessionID == target];
    if (!ress){
        NSLog(@"虚表数据删除失败，target = %@",target);
    }
    return res;
}

#pragma mark - 删除渠道消息
-(BOOL)deleteMsgsWithSessionType:(RXIMSessionType)sessionType
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:msgTableName where:RXIMMessageDB.sessionType == sessionType];
    BOOL res = [self.databaseOrigin deleteFromTable:msgTableName where:RXIMMessageDB.sessionType == sessionType];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.sessionType == sessionType];
    if (!ress){
        NSLog(@"虚表数据删除失败，sessionType = %lu",(unsigned long)sessionType);
    }
    return res;
}

#pragma mark - 删除某个渠道
-(BOOL)deleteSessionWithSessionType:(RXIMSessionType)sessionType
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    BOOL res = [self.databaseOrigin deleteObjectsFromTable:msgTableName where:RXIMMessageDB.msgType == sessionType];
    BOOL res = [self.databaseOrigin deleteFromTable:msgTableName where:RXIMMessageDB.msgType == sessionType];
    NSString *ftsTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    BOOL ress = [self.databaseOrigin deleteFromTable:ftsTableName where:RXIMMessageFTS.sessionType == sessionType];
    if (!ress){
        NSLog(@"虚表数据删除失败，sessionType = %lu",(unsigned long)sessionType);
    }
    return res;
}

#pragma mark - ====== 改 ======
//#pragma mark - 更新消息内文件缓存状态
//-(BOOL)updateMsgWithMsgFileState
//{
//    // 要更新的表
//    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
////    message.x
//    return YES;
//}

#pragma mark - 更新消息发送状态
-(BOOL)updateMsgWithMsgStatus:(RXIMMsgStatus)status localId:(NSString *)localId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.status = status;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.status withObject:message where:RXIMMessageDB.localId == localId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.status toObject:message where:RXIMMessageDB.localId == localId];
    return res;
}

#pragma mark - 更新消息id、消息状态、时间戳
-(BOOL)updateMsgWithMsgId:(NSString *)msgId inboxId:(NSInteger)inboxId status:(RXIMMsgStatus)status timestamp:(NSInteger)timestamp localId:(NSString *)localId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.msgId = msgId;
    message.status = status;
    message.timestamp = timestamp;
    message.inboxId = inboxId;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperties:{RXIMMessageDB.msgId,RXIMMessageDB.timestamp,RXIMMessageDB.status,RXIMMessageDB.inboxId} withObject:message where:RXIMMessageDB.localId == localId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:{RXIMMessageDB.msgId,RXIMMessageDB.timestamp,RXIMMessageDB.status,RXIMMessageDB.inboxId} toObject:message where:RXIMMessageDB.localId == localId];
    return res;
}

#pragma mark - 更新消息时间戳
-(BOOL)updateMsgWithTimestamp:(NSInteger)timestamp localId:(NSString *)localId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.timestamp = timestamp;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.timestamp withObject:message where:RXIMMessageDB.localId == localId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.timestamp toObject:message where:RXIMMessageDB.localId == localId];

    return res;
}

//#pragma mark - 更新消息已读状态
//-(BOOL)updateMsgWithIsRead:(BOOL)isRead msgId:(NSString *)msgId
//{
//    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
//    message.isRead = isRead;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.isRead withObject:message where:RXIMMessageDB.msgId == msgId];
//    return res;
//}

#pragma mark - 更新消息撤回状态
-(BOOL)updateMsgWithIsRevoke:(BOOL)isRevoke msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.isRecall = isRevoke;
    message.unreadCount = 0;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperties:{RXIMMessageDB.isRecall,RXIMMessageDB.unreadCount} withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:{RXIMMessageDB.isRecall,RXIMMessageDB.unreadCount} toObject:message where:RXIMMessageDB.msgId == msgId];

    return res;
}

#pragma mark - 更新消息加急数据
-(BOOL)updateMsgWithIsUrgent:(BOOL)isUrgent millits:(NSInteger)millits toMembers:(NSArray *)toMembers msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.isUrgent = isUrgent;
    message.urgentMillits = millits;
    message.urgentToMembers = toMembers;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperties:{RXIMMessageDB.isUrgent,RXIMMessageDB.urgentMillits,RXIMMessageDB.urgentToMembers} withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:{RXIMMessageDB.isUrgent,RXIMMessageDB.urgentMillits,RXIMMessageDB.urgentToMembers} toObject:message where:RXIMMessageDB.msgId == msgId];

    return res;
}

#pragma mark - 更新消息标记状态
-(BOOL)updateMsgWithIsMark:(BOOL)isMark msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.isMark = isMark;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.isMark withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.isMark toObject:message where:RXIMMessageDB.msgId == msgId];
    return res;
}

#pragma mark - 更新回复表情消息
-(BOOL)updateMsgWithReplyEmoji:(NSArray<RXIMReplyEmoji*> *)emoji msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.replyEmoji = emoji;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.isMark withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.replyEmoji toObject:message where:RXIMMessageDB.msgId == msgId];
    return res;
}

//#pragma mark - 更新消息删除状态
//-(BOOL)updateMsgWithIsDelete:(BOOL)isDelete msgId:(NSString *)msgId
//{
//    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
//    message.isDelete = isDelete;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.isDelete withObject:message where:RXIMMessageDB.msgId == msgId];
//    return res;
//}

#pragma mark - 更新消息未读数
-(BOOL)updateMsgWithUnreadCount:(NSInteger)unreadCount msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.unreadCount = unreadCount;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.unreadCount withObject:message where:RXIMMessageDB.msgId == msgId];
//    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperty:RXIMMessageDB.unreadCount toValue:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName
                  setProperties:RXIMMessageDB.unreadCount
                       toObject:message
                          where:RXIMMessageDB.msgId == msgId];
    return res;
}

#pragma mark - 更新已读的数组
-(BOOL)updateMsgWithReadArr:(NSArray *)readArr msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.readIdArr = readArr;
    NSLog(@"即将更新 RXIMMessageDB 的readIdArr  %@" ,readArr);
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.readIdArr withObject:message where:RXIMMessageDB.msgId == msgId];
//    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperty:RXIMMessageDB.readIdArr toValue:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName
                  setProperties:RXIMMessageDB.readIdArr
                       toObject:message
                          where:RXIMMessageDB.msgId == msgId];

    return res;
}

#pragma mark - 更新消息内容
-(BOOL)updateMsgWithContent:(NSString *)content msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.content = content;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.content withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.content toObject:message where:RXIMMessageDB.msgId == msgId];
    return res;
}

#pragma mark - 更新消息扩展字段
-(BOOL)updateMsgWithExt:(NSDictionary *)ext msgId:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [[RXIMMessageDB alloc]init];
    message.ext = ext;
//    BOOL res = [self.databaseOrigin updateRowsInTable:msgTableName onProperty:RXIMMessageDB.ext withObject:message where:RXIMMessageDB.msgId == msgId];
    BOOL res = [self.databaseOrigin updateTable:msgTableName setProperties:RXIMMessageDB.ext toObject:message where:RXIMMessageDB.msgId == msgId];
    return res;
}

#pragma mark - 更新引用消息
- (NSArray<RXIMMessage *> *)updateReplyMsgWithOriginMsgId:(NSString *)msgId target:(NSString *)target
{
    NSMutableArray *resArr = [NSMutableArray array];
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    NSArray *msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.sessionID == target && RXIMMessageDB.msgType == RXIMMessageType_Reply];
    for (RXIMMessageDB *msgDB in msgDBArr) {
        RXIMMsgReplyContent *content = [RXModelTransform rxDBJsonContent_model:msgDB.msgType body:msgDB.content];
        if ([content.reference.msgId isEqualToString:msgId]) {
            content.reference.isRecall = true;
            NSString *contentDB = [content rx_modelToJSONString];
            msgDB.content = contentDB;
//            [self.databaseOrigin updateRowsInTable:msgTableName onProperties:{RXIMMessageDB.content} withObject:msgDB where:RXIMMessageDB.msgId == msgDB.msgId];
            [self.databaseOrigin updateTable:msgTableName setProperties:{RXIMMessageDB.content} toObject:msgDB where:RXIMMessageDB.msgId == msgDB.msgId];
            RXIMMessage *msg = [self getMsgWithMsgid:msgDB.msgId];
            [resArr addObject:msg];
        }
    }
    return resArr;
}


#pragma mark - 更新会话最后一条消息
-(BOOL)updateSessionWithLastMsg:(RXIMMessage *)msg target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    if (IsEmpty(msg)) {
        sessionDB.lastMessage = @"";
    }else{
        RXIMMessageDB *msgDB = [RXModelTransform msgToMsgDB:msg];
        sessionDB.lastMessage = msgDB.rx_modelToJSONString;
    }
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.lastMessage withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.lastMessage toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

#pragma mark - 更新会话未读数
-(BOOL)updateSessionWithRedPoint:(NSInteger)redPoint target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.unreadCount = redPoint;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.unreadCount withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.unreadCount toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

#pragma mark - 更新第一条未读消息id
-(BOOL)updateSessionWithFirstRedPointMsgId:(NSString *)msgId target:(NSString *)target{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.firstUnreadMsgId = msgId;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.firstUnreadMsgId withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.firstUnreadMsgId toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        
    return res;
}


//#pragma mark - 更新会话置顶状态
//-(BOOL)updateSessionWithIsTop:(BOOL)isTop target:(NSString *)target
//{
//    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
////    sessionDB.isTop = isTop;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isTop withObject:sessionDB where:RXIMSessionDB.conversation_id == target];
//    return res;
//}
//
//#pragma mark - 更新会话免打扰状态
//-(BOOL)updateSessionWithIsNoDisturb:(BOOL)isNoDisturb target:(NSString *)target
//{
//    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
////    sessionDB.isNoDisturb = isNoDistur     b;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isNoDisturb withObject:sessionDB where:RXIMSessionDB.conversation_id == target];
//    return res;
//}

#pragma mark - 更新会话信息
-(BOOL)updateSessionWithExt:(NSDictionary *)ext option:(NSInteger)option evType:(NSInteger)evType creator:(NSString *)creator target:(NSString *)target
{
    BOOL res = true;
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    if ([RXIMUserUtility sharedManager].isBusiness) {
        if ((evType&EventTypeConversation_EvTypeConExt)==EventTypeConversation_EvTypeConExt) {
            sessionDB.ext = ext;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.ext withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.ext toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((evType&EventTypeConversation_EvTypeConOption)==EventTypeConversation_EvTypeConOption) {
            sessionDB.option = option;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.option withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.option toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((evType&EventTypeConversation_EvTypeConUpdateCreator)==EventTypeConversation_EvTypeConUpdateCreator) {
            sessionDB.creator = creator;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.creator withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.creator toObject:sessionDB where:RXIMSessionDB.sessionID == target];
            RXIMSession *originSession = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
            NSMutableArray *memberArr = [NSMutableArray array];
            for (int i = 0; i<originSession.members.count; i++) {
                RXIMGroupMember *member = [originSession.members objectAtIndex:i];
                if (member.identity == CapacityType_creator&&![member.user_id isEqualToString:creator]) {
                    member.identity = CapacityType_common;
                }
                if ([member.user_id isEqualToString:creator]) {
                    member.identity = CapacityType_creator;
                }
                NSDictionary *dic = [member rx_modelToJSONObject];
                [memberArr addObject:dic];
            }
            sessionDB.members = memberArr;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.members withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.members toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
    }else{
        sessionDB.ext = ext;
        sessionDB.option = option;
//        res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperties:{RXIMSessionDB.ext,RXIMSessionDB.option} withObject:sessionDB where:RXIMSessionDB.sessionID == target];
        res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.ext,RXIMSessionDB.option} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    }
    return res;
}

#pragma mark - 更新会话用户信息
-(BOOL)updateSessionWithUserExt:(NSDictionary *)userExt
                     userImsExt:(NSDictionary *)userImsExt
                     userOption:(NSInteger)userOption
                   topTimestamp:(NSInteger)topTimestamp
                         silent:(BOOL)silent
                         topMsg:(NSString *)topMsg
                     topMsgUser:(NSString *)topMsgUser
                         target:(NSString *)target
                      eventType:(NSInteger)eventType
{
    BOOL res = true;
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    if ([RXIMUserUtility sharedManager].isBusiness) {
        if ((eventType&EventTypeUserConv_EvTypeUserConExt) == EventTypeUserConv_EvTypeUserConExt ) {
            sessionDB.userExt = userExt;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.userExt withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.userExt toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConOption) == EventTypeUserConv_EvTypeUserConOption ) {
            sessionDB.userOption = userOption;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.userOption withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.userOption toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConTopConv) == EventTypeUserConv_EvTypeUserConTopConv ) {
            sessionDB.topTimestamp = topTimestamp;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.topTimestamp withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.topTimestamp toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConSilent) == EventTypeUserConv_EvTypeUserConSilent ) {
            sessionDB.silent = silent;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.silent withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.silent toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConTopMsg) == EventTypeUserConv_EvTypeUserConTopMsg ) {
            sessionDB.topMsg = topMsg;
            sessionDB.topMsgUser = topMsgUser;
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperties:{RXIMSessionDB.topMsg,RXIMSessionDB.topMsgUser} withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.topMsg,RXIMSessionDB.topMsgUser} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
        if ((eventType&EventTypeUserConv_EvTypeUserConImsext) == EventTypeUserConv_EvTypeUserConImsext ) {
            if ([userImsExt objectForKey:@"snapchat"]) {
                sessionDB.snapchatTimeout = [[userImsExt objectForKey:@"snapchat"] integerValue];
                sessionDB.userOption = userOption;
//                res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperties:{RXIMSessionDB.snapchatTimeout,RXIMSessionDB.userOption} withObject:sessionDB where:RXIMSessionDB.sessionID == target];
                res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.snapchatTimeout,RXIMSessionDB.userOption} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
            }
            if ([userImsExt objectForKey:@"mark"]) {
                sessionDB.isMark = [[userImsExt objectForKey:@"mark"] boolValue];
//                res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isMark withObject:sessionDB where:RXIMSessionDB.sessionID == target];
                res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.silent toObject:sessionDB where:RXIMSessionDB.sessionID == target];
            }
            if ([userImsExt objectForKey:@"archive"]) {
                sessionDB.isArchive = [[userImsExt objectForKey:@"archive"] boolValue];
//                res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isArchive withObject:sessionDB where:RXIMSessionDB.sessionID == target];
                res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.isArchive toObject:sessionDB where:RXIMSessionDB.sessionID == target];
            }
            
        }
    }else{
        sessionDB.userExt = userExt;
        sessionDB.userOption = userOption;
//        res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperties:{RXIMSessionDB.userExt,RXIMSessionDB.userOption} withObject:sessionDB where:RXIMSessionDB.sessionID == target];
        res = [self.databaseOrigin updateTable:sessionTableName setProperties:{RXIMSessionDB.userExt,RXIMSessionDB.userOption} toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        if ([userImsExt objectForKey:@"snapchat"]) {
            sessionDB.snapchatTimeout = [[userImsExt objectForKey:@"snapchat"] integerValue];
//            res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.snapchatTimeout withObject:sessionDB where:RXIMSessionDB.sessionID == target];
            res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.snapchatTimeout toObject:sessionDB where:RXIMSessionDB.sessionID == target];
        }
    }
    
    return res;
}

#pragma mark - 更新会话成员
-(BOOL)updateSessionWithMembers:(NSArray *)members target:(NSString *)target state:(NSInteger)state
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
//    RXIMSessionDB *originSessionDB = [self.databaseOrigin getOneObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    RXIMSessionDB *originSessionDB = [self.databaseOrigin getObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    if ([RXIMUserUtility sharedManager].isBusiness){
        __block NSMutableArray *memberArr = [NSMutableArray arrayWithArray:originSessionDB.members];
        if (state == 1) { //新增
            for (ConvMemberSimpleInfo *convMember in members) {
                RXIMGroupMember *memberObj = [[RXIMGroupMember alloc]init];
                memberObj.user_id = convMember.userId;
                memberObj.nickname = convMember.userName;
                memberObj.join_milli_ts = convMember.joinMilliTs;
                memberObj.identity = CapacityType_common;
                NSDictionary *dic = memberObj.rx_modelToJSONObject;
                [memberArr addObject:dic];
            }
        }else{//删除
            for (ConvMemberSimpleInfo *convMember in members) {
                [originSessionDB.members enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(NSDictionary * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    RXIMGroupMember *memberObj = [RXIMGroupMember rx_modelWithDictionary:obj];
                    if([convMember.userId isEqualToString:memberObj.user_id]){
                        [memberArr removeObjectAtIndex:idx];
                    }
                }];
            }
        }
        sessionDB.members = memberArr;
    }else{
        sessionDB.members = members;
    }
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.members withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.members toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

#pragma mark - 更新管理员
-(BOOL)updateSessionWithManagers:(NSMutableDictionary *)managers target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    RXIMSession *originSession = [[RXIMWCDB sharedSDK] getSessionWithTarget:target];
    NSMutableArray *membersArr = [NSMutableArray arrayWithArray:originSession.members];
    for (int i = 0; i<originSession.members.count; i++) {
        RXIMGroupMember *member = [originSession.members objectAtIndex:i];
        if ([managers.allKeys containsObject:member.user_id]) {
            member.identity = CapacityType_manager;
        }else{
            if ([originSession.creator isEqualToString:member.user_id]) {
                member.identity = CapacityType_creator;
            }else{
                member.identity = CapacityType_common;
            }
        }
        NSDictionary *dic = member.rx_modelToJSONObject;
        [membersArr replaceObjectAtIndex:i withObject:dic];
    }
    sessionDB.members = membersArr;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.members withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.members toObject:sessionDB where:RXIMSessionDB.sessionID == target];

    return res;
}

- (BOOL)updateSessionWithIsArchive:(BOOL)state target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.isArchive = state;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isArchive withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.isArchive toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

- (BOOL)updateSessionWithNickname:(NSString *)nickname userId:(NSString *)userId target:(NSString *)target
{
    RXIMSession *originSession = [[RXIMSessionService sharedSDK] getConversationInfo:target];
    NSMutableArray *members = [NSMutableArray array];
    for (RXIMGroupMember *obj in originSession.members) {
        if ([obj.user_id isEqualToString:userId]) {
            obj.nickname = nickname;
        }
        NSDictionary *dic = [obj rx_modelToJSONObject];
        [members addObject:dic];
    }
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.members = members;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.members withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.members toObject:sessionDB where:RXIMSessionDB.sessionID == target];

    return res;
}

- (BOOL)updateGroupName:(NSString *)groupName target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.groupName = groupName;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.groupName withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.groupName toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

- (BOOL)updateGroupDesc:(NSString *)groupDesc target:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
    sessionDB.groupDesc = groupDesc;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.groupDesc withObject:sessionDB where:RXIMSessionDB.sessionID == target];
    BOOL res = [self.databaseOrigin updateTable:sessionTableName setProperties:RXIMSessionDB.groupDesc toObject:sessionDB where:RXIMSessionDB.sessionID == target];
    return res;
}

//#pragma mark - 更新@我状态
//-(BOOL)updateSessionWithIsATMe:(BOOL)isATMe target:(NSString *)target
//{
//    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    RXIMSessionDB *sessionDB = [[RXIMSessionDB alloc]init];
//    sessionDB.isATMe = isATMe;
//    BOOL res = [self.databaseOrigin updateRowsInTable:sessionTableName onProperty:RXIMSessionDB.isATMe withObject:sessionDB where:RXIMSessionDB.conversation_id == target];
//    return res;
//}
#pragma mark - ====== 查 ======
#pragma mark - 获取单条消息(msgid)
-(RXIMMessage *)getMsgWithMsgid:(NSString *)msgId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.msgId == msgId];
    if (message!=nil) {
        return [RXModelTransform msgDBToMsg:message];
    }else{
        return nil;
    }
}

#pragma mark - 获取单条消息(localid)
-(RXIMMessage *)getMsgWithLocalId:(NSString *)localId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.localId == localId];
    if (message!=nil) {
        return [RXModelTransform msgDBToMsg:message];
    }else{
        return nil;
    }
}

#pragma mark - 获取单条消息(inboxId)
-(RXIMMessage *)getMsgWithinboxId:(NSInteger)inboxId
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    RXIMMessageDB *message = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.inboxId == inboxId];
    if (message!=nil) {
        return [RXModelTransform msgDBToMsg:message];
    }else{
        return nil;
    }
}

#pragma mark - 获取历史消息
-(NSArray *)getMsgsWithMsgId:(NSString *)msgId timestamp:(NSInteger)timestamp target:(NSString *)target limit:(NSInteger)limit isAfterTimestamp:(BOOL)isAfterTimestamp
{
    NSArray *msgDBArr;
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    if (msgId == nil) {
//        msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.sessionID == target orderBy:RXIMMessageDB.timestamp.order(WCTOrderedDescending) limit:limit];
        msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
                                                fromTable:msgTableName
                                                    where:RXIMMessageDB.sessionID == target
                                                   orders:RXIMMessageDB.timestamp.asOrder(WCTOrderedDescending)
                                                    limit:limit];
    } else {
        NSInteger actualLimit = limit;
        if (isAfterTimestamp) {

            // 获取timestamp之后所有的消息，
//            msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
//                                                    fromTable:msgTableName
//                                                        where:RXIMMessageDB.timestamp >= timestamp && RXIMMessageDB.sessionID == target
//                                                      orderBy:RXIMMessageDB.timestamp.order(WCTOrderedAscending)];
            msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
                                                    fromTable:msgTableName
                                                        where:RXIMMessageDB.timestamp >= timestamp && RXIMMessageDB.sessionID == target
                                                      orders:RXIMMessageDB.timestamp.asOrder(WCTOrderedAscending)];
            //倒序返回
            msgDBArr = [msgDBArr sortedArrayUsingComparator:^NSComparisonResult(RXIMMessageDB *obj1, RXIMMessageDB *obj2) {
                return [@(obj2.timestamp) compare:@(obj1.timestamp)];
            }];
        } else {
//            msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
//                                                 fromTable:msgTableName
//                                                    where:RXIMMessageDB.timestamp < timestamp && RXIMMessageDB.sessionID == target
//                                                   orderBy:RXIMMessageDB.timestamp.order(WCTOrderedDescending)
//                                                      limit:actualLimit];
            
            // 获取符合条件的总数据量
            NSArray *allMsgDBArr;
            allMsgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.timestamp < timestamp && RXIMMessageDB.sessionID == target];
            NSInteger totalCount = allMsgDBArr.count;
            
            NSArray *conformMsgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
                                                 fromTable:msgTableName
                                                    where:RXIMMessageDB.timestamp < timestamp && RXIMMessageDB.sessionID == target
                                                   orders:RXIMMessageDB.timestamp.asOrder(WCTOrderedDescending)
                                                      limit:actualLimit];
            
            // 计算剩余数据量
            NSInteger remainingCount = totalCount - conformMsgDBArr.count;

            NSLog(@"剩余数据量: %ld", (long)remainingCount);
            if (remainingCount > 0){
                msgDBArr = conformMsgDBArr;
            }
            
        }
        
        // Check if actual records fetched are less than the requested limit, then fetch additional records
        if (msgDBArr.count < limit) {
//            NSArray *additionalMsgArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
//                                                                 fromTable:msgTableName
//                                                                  where:RXIMMessageDB.sessionID == target
//                                                                 orderBy:RXIMMessageDB.timestamp.order(WCTOrderedDescending)
//                                                                    limit:(limit - msgDBArr.count)];
            NSArray *additionalMsgArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class]
                                                                 fromTable:msgTableName
                                                                  where:RXIMMessageDB.sessionID == target
                                                                 orders:RXIMMessageDB.timestamp.asOrder(WCTOrderedDescending)
                                                                    limit:(limit - msgDBArr.count)];
            msgDBArr = [msgDBArr arrayByAddingObjectsFromArray:additionalMsgArr];
        }
    }
    
    NSMutableArray *msgArr = [NSMutableArray array];
    [msgDBArr enumerateObjectsUsingBlock:^(RXIMMessageDB * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [msgArr addObject:[RXModelTransform msgDBToMsg:obj]];
    }];
    return msgArr;
}

#pragma mark - 获取本地多媒体消息
-(NSArray *)getMediaMsgsWithTarget:(NSString *)target
{
    NSArray *msgDBArr;
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
    msgDBArr = [self.databaseOrigin getObjectsOfClass:[RXIMMessageDB class] fromTable:msgTableName where:(RXIMMessageDB.msgType == RXIMMessageType_Image || RXIMMessageDB.msgType == RXIMMessageType_Video) && RXIMMessageDB.sessionID == target];
    NSMutableArray *msgArr = [NSMutableArray array];
    [msgDBArr enumerateObjectsUsingBlock:^(RXIMMessageDB * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [msgArr addObject:[RXModelTransform msgDBToMsg:obj]];
    }];
    return msgArr;
}

#pragma mark - 获取会话最后一条消息
-(RXIMMessage *)getLastMsgWithTarget:(NSString *)target
{
    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;
//    RXIMMessageDB *msgDB = [self.databaseOrigin getOneObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.sessionID == target orderBy:RXIMMessageDB.timestamp.order(WCTOrderedDescending)];
    RXIMMessageDB *msgDB = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] 
                                                       fromTable:msgTableName
                                                           where:RXIMMessageDB.sessionID == target
                                                          orders:RXIMMessageDB.timestamp.asOrder(WCTOrderedDescending)];

    if (msgDB!=nil) {
        return [RXModelTransform msgDBToMsg:msgDB];
    }else{
        return nil;
    }
}

#pragma mark - 获取单个会话
-(RXIMSession *)getSessionWithTarget:(NSString *)target
{
    NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    RXIMSessionDB *sessionDB = [self.databaseOrigin getOneObjectOfClass:[RXIMSessionDB class] fromTable:sessionTableName where:RXIMSessionDB.sessionID == target];
    RXIMSessionDB *sessionDB = [self.databaseOrigin getObjectOfClass:[RXIMSessionDB class]
                                                           fromTable:sessionTableName
                                                               where:RXIMSessionDB.sessionID == target];
    if (sessionDB!=nil) {
        return [RXModelTransform sessionDBTosession:sessionDB];
    }else{
        return nil;
    }
}

#pragma mark - 获取所有会话
-(NSArray *)getAllSession
{
        NSString *sessionTableName = [RXIMUserUtility sharedManager].sessionTableName;
//    NSArray *sessions = [self.databaseOrigin getAllObjectsOfClass:[RXIMSessionDB class] fromTable:sessionTableName];
    NSArray *sessions = [self.databaseOrigin getObjectsOfClass:[RXIMSessionDB class] fromTable:sessionTableName];
    NSMutableArray *sessionsDB = [NSMutableArray array];
    [sessions enumerateObjectsUsingBlock:^(RXIMSessionDB * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXIMSession *session = [RXModelTransform sessionDBTosession:obj];
        [sessionsDB addObject:session];
    }];
    return sessionsDB;
}

#pragma mark - 搜索内容

-(NSArray<RXIMMessage *> *)searchMessagesWithKeyword:(NSString *)keyword
{
    NSString *query = [NSString stringWithFormat:@"%@", keyword];
    
    if (query.length <1){
        return nil;
    }
    
    NSString *msgFTSTableName = [RXIMUserUtility sharedManager].msgFTSTableName;
    NSString *msgFTSPinYinTableName = [RXIMUserUtility sharedManager].msgFTSPinYinTableName;

    NSString *msgTableName = [RXIMUserUtility sharedManager].msgTableName;

    NSArray<RXIMMessageFTS *> * ftsDatas = [self.databaseOrigin getObjectsOfClass:[RXIMMessageFTS class]
                                                                    fromTable:msgFTSTableName
                                                                        where:RXIMMessageFTS.contentStr.match(query)];
    
    NSArray<RXIMMessageFTS *> * ftsPinYinDatas = [self.databaseOrigin getObjectsOfClass:[RXIMMessageFTSPinYin class]
                                                                    fromTable:msgFTSPinYinTableName
                                                                        where:RXIMMessageFTSPinYin.pinYin.match(query)];
    //搜索全部字段
//    WCDB::Column tableColumn = WCDB::Column(msgFTSTableName);
//
//    NSArray<RXIMMessageFTS*>* ftsDatas = [self.databaseOrigin getObjectsOfClass:RXIMMessageFTS.class fromTable:msgFTSTableName where:tableColumn.match(query)];

    NSMutableArray <RXIMMessage*>* msgArr = [[NSMutableArray alloc]init];
    
    for (RXIMMessageFTS * result in ftsDatas){
        
        RXIMMessageDB *messageDB = [self.databaseOrigin getObjectOfClass:[RXIMMessageDB class] fromTable:msgTableName where:RXIMMessageDB.msgId == result.msgId];
        if (messageDB!=nil) {
            RXIMMessage *message = [RXModelTransform msgDBToMsg:messageDB];
            [msgArr addObject:message];
        }else{
            break;
        }

    }

    return msgArr;
}
@end
