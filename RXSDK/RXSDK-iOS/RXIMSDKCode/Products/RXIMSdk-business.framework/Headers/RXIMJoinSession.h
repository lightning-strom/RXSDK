//
//  RXIMJoinSession.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 加入会话模型 */
@interface RXIMJoinSession : NSObject

/** Session ID */
@property(nonatomic, copy) NSString *conversation_id;

/** 会话cp扩展字段 */
@property (nonatomic, strong, nullable) NSDictionary<NSString *,NSString *> *ext;

/** 会话选项，位运算 */
@property (nonatomic,assign) NSInteger option;

@end

NS_ASSUME_NONNULL_END
