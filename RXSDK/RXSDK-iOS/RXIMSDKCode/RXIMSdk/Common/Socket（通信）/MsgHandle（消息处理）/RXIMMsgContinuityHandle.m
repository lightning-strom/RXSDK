//
//  RXIMMsgContinuityHandle.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import "RXIMMsgContinuityHandle.h"
#import "RXIMUserUtility.h"
#import "RXIMChatService+Inner.h"
#import "RXIMSessionService+Inner.h"
#import "RXIMMsgContinuityModel.h"
#import "RXIMMsgHandle.h"
#import "RXIMWCDB.h"
#import "RXIMSession.h"
#import "RXIMLogManager.h"

@interface RXIMMsgContinuityHandle()

/**
 * 是否等待补偿
 */
@property (nonatomic, assign) BOOL isWaiting;

/**
 * 同步的次数
 */
@property (nonatomic, assign) NSInteger syncNumber;

/**
 * 待删除的同步第一条数据
 */
@property (nonatomic, assign) NSInteger syncFirst;

@property (nonatomic, strong) NSLock *syncLock;

@end

@implementation RXIMMsgContinuityHandle

static RXIMMsgContinuityHandle *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMMsgContinuityHandle alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.syncLock = [[NSLock alloc] init];
        self.msgCacheAry = [NSMutableArray array];
        self.msgReceiveAry = [NSMutableArray array];
        self.isSync = false;
        self.isWaiting = false;
        self.syncNumber = 0;
    }
    return self;
}

#pragma mark - 接收消息处理
- (BOOL)receiveMsgHandel:(RXIMMessageIMS *)msg msgModel:(RXIMMsgModel *)msgModel
{
    NSInteger maxInboxId = [RXIMUserUtility sharedManager].maxInboxId;
    if (maxInboxId == 0 //新账号
        || (msg.inboxId - maxInboxId == 1 // 消息连续
        && !self.isSync //没在同步消息
        && !self.isWaiting // 没在等待消息
    )) {
        return YES;
    }
    else{
        //存接收消息
        RXIMMsgContinuityModel *model = [[RXIMMsgContinuityModel alloc]init];
        model.msg = msg;
        model.isReceiveMsg = true;
        model.msgModel = msgModel;
        [self.msgReceiveAry addObject:model];
    
        if (self.isSync || self.isWaiting) {//正在同步或者等待
            return NO;
        }else{
            self.isWaiting = true;
            RXIMMessage *frontMsg = [[RXIMWCDB sharedSDK] getMsgWithinboxId:maxInboxId];
            RXIMMsgContinuityModel *frontModel = [[RXIMMsgContinuityModel alloc]init];
            frontModel.msg = frontMsg;
            frontModel.isReceiveMsg = false;
            [self appendMsgToCacheAry:frontModel];
            self.syncFirst = maxInboxId;
            
            RXIMMsgContinuityModel *model = [[RXIMMsgContinuityModel alloc]init];
            model.msg = msg;
            model.isReceiveMsg = true;
            model.msgModel = msgModel;
            [self appendMsgToCacheAry:model];
            [self msgLoseHandle];
        }
        
    }
    return NO;
}

#pragma mark - 消息不连续处理
- (void)msgLoseHandle
{
    //排序
    [self msgSortWithInboxId];
    //判断缓存里是否连续
    NSInteger frontInboxId = 0;
    BOOL isContinuing = true;
//    NSMutableArray *tempMsgCacheAry = [NSMutableArray arrayWithArray:self.msgCacheAry];
    for (RXIMMsgContinuityModel *obj in self.msgCacheAry) {
        if (frontInboxId == 0) {
            frontInboxId = obj.msg.inboxId;
            continue;
        }else{
            if (obj.msg.inboxId - frontInboxId > 1){
                isContinuing = false;
                break;
            }
            frontInboxId = obj.msg.inboxId;
        }
    }
    if (!isContinuing && self.syncNumber<2) {//不连续
        [self msgSyncHandleWithStartInboxId:frontInboxId];
    }else{ //连续或者同步两次仍然不连续
        if ([self.msgCacheAry count]>0) {
            //清除连续消息缓存
            [self clearContinuityMsgCache];
            NSMutableArray *tempMsgCacheAry = self.msgCacheAry.mutableCopy;
            //清除缓存同步的第一条数据
            RXIMMsgContinuityModel *firstModel = tempMsgCacheAry.firstObject;
            if (firstModel.msg.inboxId == self.syncFirst) {
                [tempMsgCacheAry removeObjectAtIndex:0];
                RXLogInfo(prefixStr, @"清除第一条数据 = %ld",self.syncFirst);
            }
            RXIMMsgContinuityModel *lastModel = tempMsgCacheAry.lastObject;
            [RXIMUserUtility sharedManager].maxInboxId = lastModel.msg.inboxId;
            //交给上层处理
            RXLogInfo(prefixStr, @"交给上层处理个数 = %ld",tempMsgCacheAry.count);
            for (RXIMMsgContinuityModel *model in tempMsgCacheAry) {
                RXLogInfo(prefixStr, @"交给上层inboxid = %ld",model.msg.inboxId);
            }
            [self syncMsgNormalHandle:tempMsgCacheAry];
            //发送收到确认消息给服务器
            [self sendAckToServer:tempMsgCacheAry];
        }
        [self.msgCacheAry removeAllObjects];
        self.isSync = false;
        self.isWaiting = false;
        self.syncNumber = 0;
        [[NSNotificationCenter defaultCenter] postNotificationName:@"SyncFinished" object:nil];
        [self.msgCacheAry addObjectsFromArray:self.msgReceiveAry];
        for (RXIMMsgContinuityModel *model in self.msgCacheAry) {
            RXLogInfo(prefixStr, @"剩余连续 text = %ld",model.msg.inboxId);
        }
        //上层处理完看缓存中是否还有消息
        if (self.msgCacheAry.count > 0) {
            [self msgLoseHandle];
        }
    }
}

#pragma mark - 向缓存追加消息模型（去重）
-(void)appendMsgToCacheAry:(RXIMMsgContinuityModel *)model
{
    __block BOOL isFind = false;
    __block NSInteger index = 0;
    [self.msgCacheAry enumerateObjectsUsingBlock:^(RXIMMsgContinuityModel *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([model.msg.msgId isEqualToString:obj.msg.msgId]) {
            isFind = true;
            index = idx;
            *stop = YES;
        }
    }];
    if (!isFind) {
        [self.msgCacheAry addObject:model];
    }else{
        [self.msgCacheAry replaceObjectAtIndex:index withObject:model];
    }
}
#pragma mark - 发送确认消息给服务器
-(void)sendAckToServer:(NSArray *)msgCacheAry
{
    for (RXIMMsgContinuityModel *model in msgCacheAry) {
        if (model.isReceiveMsg) {//接收到的消息给服务器回执，同步的不需要
            [RXIMMsgHandle fetchReceiveMsgAsMsgType:model.msgModel];
        }
    }
}

#pragma mark - 将连续消息清除缓存
- (void)clearContinuityMsgCache
{
    __weak typeof(self) weakSelf = self;
    [self.msgCacheAry enumerateObjectsUsingBlock:^(RXIMMsgContinuityModel *  _Nonnull obj1, NSUInteger idx1, BOOL * _Nonnull stop1) {
        [weakSelf.msgReceiveAry enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(RXIMMsgContinuityModel *  _Nonnull obj2, NSUInteger idx2, BOOL * _Nonnull stop2) {
            if ([obj1.msg.msgId isEqualToString:obj2.msg.msgId]) {
                [weakSelf.msgReceiveAry removeObjectAtIndex:idx2];
            }
        }];
    }];
}

#pragma mark - 消息inboxId排序
- (void)msgSortWithInboxId
{
    NSArray *sortAry = [self.msgCacheAry sortedArrayUsingComparator:^NSComparisonResult(RXIMMsgContinuityModel * _Nonnull obj1, RXIMMsgContinuityModel *  _Nonnull obj2) {
        if (obj1.msg.inboxId < obj2.msg.inboxId) {
            return NSOrderedAscending;
        }else{
            return NSOrderedDescending;
        }
    }];
    self.msgCacheAry = sortAry.mutableCopy;
}

#pragma mark - 消息inboxid升序排序
- (NSArray *)msgSortWithTimestamp:(NSArray *)msgAry
{
    NSArray *sortAry = [msgAry sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        RXIMMessageIMS *msg1;
        RXIMMessageIMS *msg2;
        if ([obj1 isKindOfClass:[RXIMMessageIMS class]]) {
            msg1 = obj1;
        }else if([obj1 isKindOfClass:[RXIMMsgContinuityModel class]]){
            RXIMMsgContinuityModel *model1 = (RXIMMsgContinuityModel *)obj1;
            msg1 = model1.msg;
        }
        if ([obj2 isKindOfClass:[RXIMMessageIMS class]]) {
            msg2 = obj2;
        }else if([obj2 isKindOfClass:[RXIMMsgContinuityModel class]]){
            RXIMMsgContinuityModel *model2 = (RXIMMsgContinuityModel *)obj2;
            msg2 = model2.msg;
        }
        if (msg1.inboxId < msg2.inboxId) {
            return NSOrderedAscending;
        }else{
            return NSOrderedDescending;
        }
    }];
    return sortAry;
}

#pragma mark - 消息同步处理
- (void)msgSyncHandleWithStartInboxId:(NSInteger)startInboxId
{
    RXIMMsgContinuityModel *endMsgModel = self.msgCacheAry.lastObject;
    NSInteger endInboxId = endMsgModel.msg.inboxId;
    //等待一会，看后续是否有补偿消息
    self.isWaiting = true;
    NSInteger milliTs = [RXIMUserUtility sharedManager].discontinuousinboxIddelayMilliTs;
    double second = (double)milliTs/1000.00;
    __weak typeof(self) weakSelf = self;
    dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(second * NSEC_PER_SEC));
    dispatch_after(delay, dispatch_get_main_queue(), ^{
//        weakSelf.isWaiting = false;
    //    NSInteger endinboxId = [self getEndinboxId];
        RXLogInfo(prefixStr, @"startInboxId = %ld,%ld millits = %ld",startInboxId,endInboxId,milliTs);
        //查看是否有补偿消息
        if ([weakSelf findIsCompensationMsg:startInboxId endInboxId:endInboxId]) {
            //已收到补偿消息，不进行同步，返回继续判断缓存内消息是否连续
            [weakSelf msgLoseHandle];
            return;
        }
        //同步消息
        weakSelf.isWaiting = false;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(10 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            //如果同步信息失败，将同步状态修复
            weakSelf.isSync = false;
            [[NSNotificationCenter defaultCenter] postNotificationName:@"SyncFinished" object:nil];
        });
        weakSelf.syncNumber++;
        RXLogInfo(prefixStr, @"sync startInboxId2 = %ld,endInboxId = %ld",startInboxId,endInboxId);
        [[RXIMChatService sharedSDK] getServerOfflineMsgWithStartinboxId:startInboxId+1 endinboxId:endInboxId limit:endInboxId-startInboxId-1];
    });
    
}

#pragma mark - 查找是否有补偿消息
-(BOOL)findIsCompensationMsg:(NSInteger)startInboxId endInboxId:(NSInteger)endInboxId
{
    __block BOOL isHave = false;
    if (self.msgCacheAry.count==0) {
        //补偿信息已到位且缓存消息连续，缓存已空，不进行同步
        isHave = true;
    }
    __weak typeof(self) weakSelf = self;
    __block NSInteger count = 0;
    [self.msgReceiveAry enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(RXIMMsgContinuityModel *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RXLogInfo(prefixStr, @"compensationMsg = %ld",obj.msg.inboxId);
        if (startInboxId < obj.msg.inboxId && obj.msg.inboxId < endInboxId) {
            count++;
            [weakSelf.msgReceiveAry removeObjectAtIndex:idx];
            [weakSelf appendMsgToCacheAry:obj];
        }
    }];
    if (count>0) {
        isHave = true;
    }
    return isHave;
}

#pragma mark - 获取缓存中不连续的结束inboxId
-(NSInteger)getEndInboxId
{
    RXIMMessageIMS *maxMsg = self.msgCacheAry.lastObject;
    NSInteger maxinboxId = maxMsg.inboxId;
    NSInteger frontinboxId = maxinboxId;
    NSInteger endinboxId = maxinboxId;
    if (self.msgCacheAry.count>1) {
        for (NSInteger i = self.msgCacheAry.count-2;i>0;i--) {
            RXIMMsgContinuityModel *model = [self.msgCacheAry objectAtIndex:i];
            if (model.msg.inboxId - frontinboxId == 1) {
                frontinboxId = model.msg.inboxId;
                continue;
            }else{
                endinboxId = model.msg.inboxId;
            }
        }
    }
    return endinboxId;
}

#pragma mark - 同步回来的消息处理
- (void)syncMsgHandle:(NSArray *)msgs
{
    for (RXIMMessageIMS *msg in msgs) {
        RXLogInfo(prefixStr, @"return InboxId = %ld",msg.inboxId);
    }
    RXLogInfo(prefixStr, @"return InboxId count = %ld",msgs.count);
    if (msgs!=nil && [msgs count]>0) {
        RXIMMessageIMS *lastMsg = [msgs lastObject];
        if ([RXIMUserUtility sharedManager].endInboxId==0) { //end=0 && msgs!=nil
            //交给上层处理
            [self syncMsgNormalHandle:msgs];
            //inboxid=inboxid+fechcount继续同步，
            RXLogInfo(prefixStr, @"sync startInboxId1 = %ld",lastMsg.inboxId + 1);
            if (lastMsg.inboxId > [RXIMUserUtility sharedManager].startInboxId) {
                [RXIMUserUtility sharedManager].startInboxId=lastMsg.inboxId + 1;
                [[RXIMChatService sharedSDK] getServerOfflineMsgWithStartinboxId:[RXIMUserUtility sharedManager].startInboxId endinboxId:0 limit:30];
            }else{
                [RXIMUserUtility sharedManager].maxInboxId = lastMsg.inboxId+1;
                self.isSync = false;
                [[NSNotificationCenter defaultCenter] postNotificationName:@"SyncFinished" object:nil];
                RXLogInfo(prefixStr, @"no sync");
            }
        }else{//end!=0 && msgs!=nil
            RXIMMessageIMS *lastMsg = msgs.lastObject;
            if ([RXIMUserUtility sharedManager].endInboxId - lastMsg.inboxId != 1) {
                //未同步到最后，将同步回来的消息放入缓存等待处理，inboxid等于最后一条加1继续同步
                for (RXIMMessageIMS *msg in msgs) {
                    RXIMMsgContinuityModel *model = [[RXIMMsgContinuityModel alloc]init];
                    model.msg = msg;
                    model.isReceiveMsg = false;
                    [self.msgCacheAry addObject:model];
                }
                [RXIMUserUtility sharedManager].startInboxId = lastMsg.inboxId + 1;
                RXLogInfo(prefixStr, @"sync startInboxId3 = %ld,endInboxId = %ld",[RXIMUserUtility sharedManager].startInboxId,[RXIMUserUtility sharedManager].endInboxId);
                [[RXIMChatService sharedSDK] getServerOfflineMsgWithStartinboxId:[RXIMUserUtility sharedManager].startInboxId endinboxId:[RXIMUserUtility sharedManager].endInboxId limit:[RXIMUserUtility sharedManager].endInboxId - [RXIMUserUtility sharedManager].startInboxId];
                
            }else{
                // 已拉取到end，结束同步,本地最大inboxid置为结束inboxid
                [RXIMUserUtility sharedManager].maxInboxId = [RXIMUserUtility sharedManager].endInboxId;
                for (RXIMMessageIMS *msg in msgs) {
                    RXIMMsgContinuityModel *model = [[RXIMMsgContinuityModel alloc]init];
                    model.msg = msg;
                    model.isReceiveMsg = false;
                    [self appendMsgToCacheAry:model];
                }
                self.isSync = false;
                [[NSNotificationCenter defaultCenter] postNotificationName:@"SyncFinished" object:nil];
                //消息连续处理
                [self msgLoseHandle];
            }
            
        }
    }else{ // end=0&&msg==nil
        if ([RXIMUserUtility sharedManager].endInboxId == 0) {
            //将本地最大的inboxid后移fetchcount，结束同步
            [RXIMUserUtility sharedManager].maxInboxId = [RXIMUserUtility sharedManager].startInboxId == 0?[RXIMUserUtility sharedManager].startInboxId:[RXIMUserUtility sharedManager].startInboxId-1;
            
        }else{
            [self msgLoseHandle];
        }
        self.isSync = false;
        [[NSNotificationCenter defaultCenter] postNotificationName:@"SyncFinished" object:nil];
    }
}

#pragma mark - 交由上层处理的消息队列
- (void)syncMsgNormalHandle:(NSArray *)msgs
{
//    if ([RXIMUserUtility sharedManager].maxInboxId != 0) {
    //过滤掉会话已删除的消息
    NSArray *invalidMsgs = [self filterMsgsFromServerCovList:msgs];
        NSArray *msgSortedAry = [self msgSortWithTimestamp:invalidMsgs];
        [[RXIMChatService sharedSDK] receiveMessageHandle:msgSortedAry];
        [[RXIMSessionService sharedSDK] receiveMessageHandle:msgSortedAry];
//    }
}

-(NSArray *)filterMsgsFromServerCovList:(NSArray *)messages
{
    NSMutableArray *invalidMsgs = [NSMutableArray array];
    for (id obj in messages) {
        RXIMMessageIMS *msg;
        if ([obj isKindOfClass:[RXIMMsgContinuityModel class]]) {
            RXIMMsgContinuityModel *model = (RXIMMsgContinuityModel *)obj;
            msg = model.msg;
        }else{
            msg = obj;
        }
        if (msg.sessionType == RXIMSessionType_single || msg.sessionType == RXIMSessionType_channel || msg.sessionType == RXIMSessionType_custom || [self filterMsgFromServerCovList:msg]) {
            [invalidMsgs addObject:msg];
        }
    }
    return invalidMsgs;
}

#pragma mark - 判断会话是否被删除或者是删除后重新创建的同名会话，过滤消息
-(BOOL)filterMsgFromServerCovList:(RXIMMessageIMS *)message
{
    BOOL isValid = false;
    __block BOOL isExist = false;
    __block RXIMSession *session = nil;
    for (RXIMSession *obj in [RXIMUserUtility sharedManager].serverCovListArr) {
        if ([obj.sessionID isEqualToString:message.sessionID]) {
            //1.服务器会话存在
            isExist = true;
            session = obj;
            break;
        }
    }
    if (isExist) {
        if (message.timestamp > session.createTimestamp) {
            //2.不是删除后又新创建的同名会话
            isValid = true;
        }
    }
    return isValid;
}

@end
