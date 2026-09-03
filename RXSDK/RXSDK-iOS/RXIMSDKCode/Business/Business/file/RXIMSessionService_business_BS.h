//
//  RXIMSessionService_business_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import <Foundation/Foundation.h>
@import RXIMSdk_business.RXIMSessionService;
@import RXIMSdk_business.RXIMSessionService_business;

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSessionService_business_BS : RXIMSessionService_business <RXIMSessionServiceDelegate_business>


/**
 * 设置会话置顶/取消置顶
 * @param topTimestamp 置顶时间戳 0：取消置顶 当前时间戳：置顶
 * @param covId 会话id
 */
- (void)setTopTimestamp:(NSInteger)topTimestamp
                  covId:(NSString *)covId
      completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 设置会话免打扰
 * @param state YES:免打扰 NO:取消免打扰
 * @param covId 会话id
 */
- (void)setSilentState:(BOOL)state
            covId:(NSString *)covId
completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 删除服务器消息
 * @param msgIds 消息数组（单次最多20条）
 * @param covId 会话id
 */
- (void)deleteServerMessages:(NSArray * _Nonnull)msgIds
                       covId:(NSString * _Nonnull)covId
           completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 置顶/取消置顶会话内消息
 * @param covId 会话id
 * @param msgId 消息id
 * @param state 1：置顶； 0：取消置顶
 * @param cancelTopType  state=0有效；0：只取消自己的置顶 ；1：取消会话内所有人消息置顶
*/
- (void)topMessageInConversation:(NSString * _Nonnull)covId
                           msgId:(NSString * _Nonnull)msgId
                           state:(BOOL)state
                   cancelTopType:(NSInteger)cancelTopType
               completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 标记/取消标记会话
 * @param covId 会话id
 * @param state 1：标记； 0：取消标记
 */
- (void)markConversation:(NSString * _Nonnull)covId
                   state:(NSInteger)state
       completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 归档会话
 */
- (void)archiveConversation:(NSString * _Nonnull)covId
          completionHandler:(void (^)(RXIMError *error))completionHandler;

@end

NS_ASSUME_NONNULL_END
