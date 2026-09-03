//
//  RXCountryList.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/19.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"
#import <RXSDK_Pure/RXErrorTool.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXCountryList : UIView

- (instancetype)initWithComplete:(void(^)(NSString *code))block;

@end

NS_ASSUME_NONNULL_END
