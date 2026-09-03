//
//  RXWebSocket.h
//  test
//
//  Created by 陈汉 on 2023/11/17.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXWebSocket : NSObject

@property (nonatomic, strong) NSArray *addrs;

+ (instancetype)sharedSDK;

// 连接socket
- (void)connectSocketWithHost:(NSString *)host port:(NSInteger)port timeout:(NSInteger)timeout;
- (void)connectSocketWithAddrs:(NSArray *)addrs timeout:(NSInteger)timeout;
// 关闭socket
- (void)closeSocket;

// 发送确认消息
- (void)sendAck;

@end

NS_ASSUME_NONNULL_END
