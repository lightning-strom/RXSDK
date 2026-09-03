//
//  RXUIReminderView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/21.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^ConfirmBlock)(void);

@interface RXUIReminderView : UIView

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                      complete:(ConfirmBlock)complete;

@end

NS_ASSUME_NONNULL_END
