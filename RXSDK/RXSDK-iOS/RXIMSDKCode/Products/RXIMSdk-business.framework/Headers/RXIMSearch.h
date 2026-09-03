//
//  RXIMSearch.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/5/10.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSearch : NSObject


+ (instancetype)sharedSDK;

/**
 * 全文检索
 * @param searchStr 搜索内容
 */
-(NSArray *)searchTextMsg:(NSString *)searchStr;

/**
 * 搜索所有文件
 */
-(NSArray *)searchAllFileMsg;

/**
 * 搜索单个会话文本消息
 * @param searchStr 搜索内容
 * @param target 会话id
 */
-(NSArray *)searchTextMsgWithTarget:(NSString *)target searchStr:(NSString *)searchStr;

/**
 * 搜索单个会话图片消息
 * @param target 会话id
 */
-(NSArray *)searchPicMsg:(NSString *)target;

/**
 * 搜索单个会话文件消息
 * @param target 会话id
 */
-(NSArray *)searchFileMsgWithTarget:(NSString *)target;

/**
 * 搜索单个会话链接消息
 * @param target 会话id
 */
-(NSArray *)searchLinkMsgWithTarget:(NSString *)target;


@end

NS_ASSUME_NONNULL_END
