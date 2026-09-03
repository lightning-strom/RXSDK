//
//  RXIMError.h
//  RXIMSdk
//
//  Created by weiyongjian on 2021/12/28.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMError : NSObject

/** 错误码 */
@property(nonatomic) NSInteger code;

/** 错误信息 */
@property(nonatomic, nonnull) NSString *developerMessage;

@end

NS_ASSUME_NONNULL_END
