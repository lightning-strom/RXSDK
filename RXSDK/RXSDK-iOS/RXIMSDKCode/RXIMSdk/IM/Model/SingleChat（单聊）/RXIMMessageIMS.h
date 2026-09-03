//
//  RXIMMessageIMS.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/5.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMessageIMS : RXIMMessage

/** IMS扩展信息 */
@property(nonatomic, copy) NSDictionary<NSString *,NSString *> *imsExt;

@end


NS_ASSUME_NONNULL_END
