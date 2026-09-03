//
//  RXIMChatService_business.h
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/10.
//

#import "RXIMChatService.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RXIMMessageDelegate_business <RXIMMessageDelegate>
@optional
/**
 * 消息加急回执
 */
 - (void)onMessageUrgent:(RXIMMessage *)msgObj;

/**
 * 消息标记回执
 */
 - (void)onMessageMark:(RXIMMessage *)msgObj;

@end


@interface RXIMChatService_business : RXIMChatService

@property (nonatomic, weak) id <RXIMMessageDelegate_business> delegate_business;

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
    completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 消息标记
 * @param msgIds 消息id数组
 * @param target 会话id
 * @param state YES:标记 NO:取消标记
 * @param completionHandler 返回消息处理是否成功。
 */
-(void)markMessage:(NSArray * _Nonnull)msgIds
            target:(NSString * _Nonnull)target
             state:(BOOL)state
    completionHandler:(void (^)(RXIMError *error))completionHandler;

@end

NS_ASSUME_NONNULL_END
