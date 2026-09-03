//
//  RXIMChatService_business_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import <Foundation/Foundation.h>

@import RXIMSdk_business.RXIMChatService;
@import RXIMSdk_business.RXIMChatService_business;

NS_ASSUME_NONNULL_BEGIN


@interface RXIMChatService_business_BS : RXIMChatService_business <RXIMMessageDelegate_business>

- (void)getHistoryMessages:(NSString * _Nullable)msgId
                    target:(NSString * _Nonnull)target
               sessionType:(RXIMSessionType)sessionType
                     limit:(NSInteger)limit
          isAfterTimestamp:(BOOL)isAfterTimestamp
         completionHandler:(void (^)(NSArray<RXIMMessage *> *messages,RXIMError *error))completionHandler;



/**
 * 消息加急
 * @param msgId 消息id
 * @param target 会话id
 * @param receivers 接收者数组
 * @param completionHandler 返回消息处理是否正常，发送成功以delegate方式回调。
 */
- (void)urgentMessage:(NSString * _Nonnull)msgId
               target:(NSString * _Nonnull)target
            receivers:(NSArray * _Nonnull)receivers
                  ext:(NSDictionary <NSString *,NSString *> * _Nonnull)ext
    completionHandler:(void (^)(RXIMError *error))completionHandler;

///**
// * 消息标记
// * @param msgIds 消息id数组
// * @param target 会话id
// * @param state YES:标记 NO:取消标记
// * @param completionHandler 返回消息处理是否成功。
// */
//-(void)markMessage:(NSArray * _Nonnull)msgIds
//            target:(NSString * _Nonnull)target
//             state:(BOOL)state
//    completionHandler:(void (^)(RXIMError *error))completionHandler;
//
//
///**
// * 回复表情消息
// * @param msgIds 消息id数组
// * @param target 会话id
// * @param eooji 表情字符
// * @param completionHandler 返回消息处理是否成功。
// */
//-(void)markMessage:(NSArray * _Nonnull)msgIds
//            target:(NSString * _Nonnull)target
//             eooji:(NSString *)emojiStr
//    completionHandler:(void (^)(RXIMError *error))completionHandler;
@end

NS_ASSUME_NONNULL_END
