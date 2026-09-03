//
//  RXIMSearch.m
//  RXIMSdk
//
//  Created by 魏永健 on 2022/5/10.
//

#import "RXIMSearch.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"

@implementation RXIMSearch

static RXIMSearch *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSearch alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 全文检索
-(NSArray *)searchTextMsg:(NSString *)searchStr
{
    RXLogDebug(prefixStr, nil);
    NSArray *msgAry = [[RXIMWCDB sharedSDK] searchTextMsg:searchStr];
    NSArray *msgSortAry = [msgAry sortedArrayUsingComparator:^NSComparisonResult(RXIMMessage * _Nonnull obj1, RXIMMessage * _Nonnull obj2) {
        if(obj1.timestamp > obj2.timestamp) {
            return NSOrderedAscending;
        }else {
            return NSOrderedDescending;
        }
    }];
    return msgSortAry;
}

#pragma mark - 搜索所有文件
-(NSArray *)searchAllFileMsg
{
    RXLogDebug(prefixStr, nil);
    NSArray *msgAry = [[RXIMWCDB sharedSDK] searchAllFileMsg];
    NSArray *msgSortAry = [msgAry sortedArrayUsingComparator:^NSComparisonResult(RXIMMessage * _Nonnull obj1, RXIMMessage * _Nonnull obj2) {
        if(obj1.timestamp > obj2.timestamp) {
            return NSOrderedAscending;
        }else {
            return NSOrderedDescending;
        }
    }];
    return msgSortAry;
}

#pragma mark - 搜索单个会话文本消息
-(NSArray *)searchTextMsgWithTarget:(NSString *)target searchStr:(NSString *)searchStr
{
    RXLogDebug(prefixStr, nil);
    NSArray *msgAry = [[RXIMWCDB sharedSDK] searchTextMsgWithTarget:target searchStr:searchStr];
    NSArray *msgSortAry = [msgAry sortedArrayUsingComparator:^NSComparisonResult(RXIMMessage * _Nonnull obj1, RXIMMessage * _Nonnull obj2) {
        if(obj1.timestamp > obj2.timestamp) {
            return NSOrderedAscending;
        }else {
            return NSOrderedDescending;
        }
    }];
    return msgSortAry;
}
#pragma mark - 搜索单个会话图片消息
-(NSArray *)searchPicMsg:(NSString *)target
{
    RXLogDebug(prefixStr, nil);
    return [[RXIMWCDB sharedSDK] searchPicMsg:target];
}

#pragma mark - 搜索单个会话文件消息
-(NSArray *)searchFileMsgWithTarget:(NSString *)target
{
    RXLogDebug(prefixStr, nil);
    return [[RXIMWCDB sharedSDK] searchFileMsgWithTarget:target];
}

#pragma mark - 搜索单个会话链接消息
-(NSArray *)searchLinkMsgWithTarget:(NSString *)target
{
    RXLogDebug(prefixStr, nil);
    NSArray *msgAry = [[RXIMWCDB sharedSDK] searchLinkMsgWithTarget:target];
    NSArray *msgSortAry = [msgAry sortedArrayUsingComparator:^NSComparisonResult(RXIMMessage * _Nonnull obj1, RXIMMessage * _Nonnull obj2) {
        if(obj1.timestamp > obj2.timestamp) {
            return NSOrderedAscending;
        }else {
            return NSOrderedDescending;
        }
    }];
    return msgSortAry;
}


@end
