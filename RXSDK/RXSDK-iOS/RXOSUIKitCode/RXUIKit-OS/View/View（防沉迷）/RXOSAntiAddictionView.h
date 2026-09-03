//
//  RXOSAntiAddictionView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"
#import "RXOSCommonHeader.h"
#import "RXOSUIKitService.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^AntiBlock)(void);

@interface RXOSAntiAddictionView : UIView

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                      btnTitle:(NSString *)btnTitle
                         block:(AntiBlock)block;

@end

NS_ASSUME_NONNULL_END
