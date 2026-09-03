//
//  RXIMSearch_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSearch_BS.h"
@implementation RXIMSearch_BS

+ (instancetype)sharedSDK {
    static RXIMSearch_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMSearch_BS alloc] init];
    });
    return sharedInstance;
    
}

- (NSArray *)searchTextMsg:(NSString *)searchStr {
    // 调用 RXIMSearch 的搜索文本消息方法
    return [[RXIMSearch sharedSDK] searchTextMsg:searchStr];
}

- (NSArray *)searchAllFileMsg {
    // 调用 RXIMSearch 的搜索所有文件消息方法
    return [[RXIMSearch sharedSDK] searchAllFileMsg];
}

- (NSArray *)searchTextMsgWithTarget:(NSString *)target searchStr:(NSString *)searchStr {
    // 调用 RXIMSearch 的搜索单个会话文本消息方法
    return [[RXIMSearch sharedSDK] searchTextMsgWithTarget:target searchStr:searchStr];
}

- (NSArray *)searchPicMsg:(NSString *)target {
    // 调用 RXIMSearch 的搜索单个会话图片消息方法
    return [[RXIMSearch sharedSDK] searchPicMsg:target];
}

- (NSArray *)searchFileMsgWithTarget:(NSString *)target {
    // 调用 RXIMSearch 的搜索单个会话文件消息方法
    return [[RXIMSearch sharedSDK] searchFileMsgWithTarget:target];
}

- (NSArray *)searchLinkMsgWithTarget:(NSString *)target {
    // 调用 RXIMSearch 的搜索单个会话链接消息方法
    return [[RXIMSearch sharedSDK] searchLinkMsgWithTarget:target];
}

@end
