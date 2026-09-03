//
//  RXIMSocketEngine.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/9/27.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * IM连接监听
 */
@protocol RXIMSocketDelegate <NSObject>
/**
 * 连接成功
 */
- (void)onSocketConnectSuccess;

/**
 * 断开连接
 */
- (void)onSocketDisconnect:(RXIMError * _Nullable)error;

@end

/** IM连接引擎 */
@interface RXIMSocketEngine : NSObject

@property (nonatomic, weak) id <RXIMSocketDelegate> delegate;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 启动引擎
 */
-(void)onStart;

@end

NS_ASSUME_NONNULL_END
