//
//  RXDestroyAccountModel.h
//  RXSDK
//
//  Created by 陈汉 on 2021/12/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXDestroyAccountModel : NSObject
@property (nonatomic, assign) BOOL commited;  // false-没有注销申请记录；true-有注销申请记录，需要做逻辑判断
@property (nonatomic, assign) BOOL refused;   // false-没有被管理员拒绝注销；true-管理员拒绝注销申请，可以登陆
@property (nonatomic, assign) BOOL cooling;   // false-未处于冷静期；true-处于冷静期
@property (nonatomic, strong) NSString *refuse_reason;  // 拒绝理由
@end

NS_ASSUME_NONNULL_END
