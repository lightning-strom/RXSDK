//
//  RXLoginAlertView.h
//  RXUIKit
//
//  Created by 陈汉 on 2022/3/18.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLoginAlertView : UIView

- (instancetype)initWithTitile:(NSString *)title
                       content:(NSString *)content
                         block:(void(^)(NSInteger type))block;

@end

NS_ASSUME_NONNULL_END
