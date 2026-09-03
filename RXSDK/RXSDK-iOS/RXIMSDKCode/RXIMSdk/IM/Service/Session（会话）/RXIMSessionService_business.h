//
//  RXIMSessionService+business.h
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/10.
//
#import "RXIMSessionService.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RXIMSessionServiceDelegate_business <RXIMSessionServiceDelegate>
@optional
/**
 * 接收到新会话回执
 * @param session 会话
 */
- (void)onReceiveNewSession:(RXIMSession *)session;

/**
 * 会话内消息置顶回执
 * @param session 会话
 */
-(void)onSessionTopMsg:(RXIMSession *)session;

/**
 * 会话用户设置管理员回执（全量）
 * @param session 会话
 */
- (void)onSessionSetManagers:(RXIMSession *)session;

/**
 * 会话转让群主
 * @param session 会话
 */
- (void)onSessionTransferGroupOwner:(RXIMSession *)session;

/**
 * 自己被移出群聊
 * @param sessions 会话数组
 */
- (void)onSessionKickGroup:(NSArray<RXIMSession *> *)sessions;

/**
 * 群名称变动
 * @param session 会话
 */
- (void)onSessionGroupNameChange:(RXIMSession *)session;

/**
 * 群描述变动
 * @param session 会话
 */
- (void)onSessionGroupDescChange:(RXIMSession *)session;

/**
 * 会话内成员昵称变更
 * @param sessionId 会话id
 * @param userId 成员id
 * @param nickname 改变后的昵称
 *
 */
- (void)onSessionUserNicknameChange:(NSString *)sessionId userId:(NSString *)userId nickname:(NSString *)nickname;

#pragma mark - 相同账号不同平台的同步事件

/**
 * 会话免打扰回执
 * @param session 会话
 */
- (void)onSessionUserSilent:(RXIMSession *)session;

/**
 * 会话置顶回执
 * @param session 会话
 */
- (void)onSessionUserTop:(RXIMSession *)session;

/**
 * 会话用户扩展字段回执
 * @param session 会话
 */
- (void)onSessionUserExt:(RXIMSession *)session;

/**
 * 会话用户选项回执
 * @param session 会话
 */
- (void)onSessionUserOption:(RXIMSession *)session;

/**
 * 会话阅后即焚超时时间回执
 * @param session 会话
 */
- (void)onSessionUserSnapchat:(RXIMSession *)session;

/**
 * 标记会话回执
 * @param session 会话
 */
- (void)onSessionUserMark:(RXIMSession *)session;

/**
 * 归档会话回执
 */
- (void)onSessionUserArchive:(RXIMSession *)session;

@end

@interface RXIMSessionService_business:RXIMSessionService

@property (nonatomic, weak) id <RXIMSessionServiceDelegate_business> delegate_business;

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
