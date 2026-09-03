//
//  RXIMGroupMember.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/12/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 会话权限 */
typedef enum : NSUInteger {
    /** 无效值 */
    CapacityType_invalid = 0,
    /** 创建者 */
    CapacityType_creator = 1,
    /** 管理员 */
    CapacityType_manager = 2,
    /** 普通人 */
    CapacityType_common = 3,
} CapacityType;

@interface RXIMGroupMember : NSObject

/** 用户id */
@property (nonatomic, strong) NSString *user_id;

/** 在群里的昵称 */
@property (nonatomic, strong) NSString *nickname;

/** 在群里的权限 */
@property (nonatomic, assign) CapacityType identity;

/** 用户加入时间 */
@property (nonatomic, assign) NSInteger join_milli_ts;

@end

NS_ASSUME_NONNULL_END
