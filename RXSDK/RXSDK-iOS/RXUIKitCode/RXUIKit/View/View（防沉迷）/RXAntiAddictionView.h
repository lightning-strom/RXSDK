//
//  RXAntiAddictionView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"
#import "RXUICommonHeader.h"
#import "RXUIKitService.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^AntiBlock)(void);

@interface RXAntiAddictionView : UIView

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                      btnTitle:(NSString *)btnTitle
                         block:(AntiBlock)block;

@end

NS_ASSUME_NONNULL_END
